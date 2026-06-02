import { spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const appUrl = 'http://127.0.0.1:5173';
const outDir = new URL('../tmp/world-spine-qa/', import.meta.url);
const userDataDir = 'C:\\TMP\\chronos-world-spine-chrome-profile';
const debugPort = 9333;

let messageId = 1;

async function main() {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  await rm(userDataDir, { recursive: true, force: true });

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ], {
    stdio: ['ignore', 'ignore', 'pipe'],
  });

  let stderr = '';
  chrome.stderr.on('data', chunk => {
    stderr += chunk.toString();
  });

  try {
    const browserWsUrl = await waitForBrowserWsUrl();
    const target = await createTarget(browserWsUrl);
    const cdp = await connectCdp(target.webSocketDebuggerUrl);

    await send(cdp, 'Runtime.enable');
    await send(cdp, 'Page.enable');
    await send(cdp, 'Log.enable');

    const consoleMessages = [];
    cdp.onMessage = message => {
      if (message.method === 'Runtime.consoleAPICalled') {
        const text = message.params.args?.map(arg => arg.value ?? arg.description ?? '').join(' ');
        consoleMessages.push(`[console:${message.params.type}] ${text}`);
      }
      if (message.method === 'Runtime.exceptionThrown') {
        consoleMessages.push(`[exception] ${message.params.exceptionDetails?.text ?? 'runtime exception'}`);
      }
      if (message.method === 'Log.entryAdded') {
        const entry = message.params.entry;
        if (entry.level === 'error' || entry.level === 'warning') {
          consoleMessages.push(`[${entry.level}] ${entry.text}`);
        }
      }
    };

    await send(cdp, 'Page.addScriptToEvaluateOnNewDocument', {
      source: `
        localStorage.setItem('chronos.guestSession.v1', 'true');
        localStorage.setItem('chronos.guestProfile.v1', JSON.stringify({ xp: 0, level: 1, collectibleCards: [], nodesCompleted: [] }));
      `,
    });

    const desktop = await captureViewport(cdp, {
      name: 'desktop',
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    const desktopMetrics = await collectMatrixMetrics(cdp);

    const mobile = await captureViewport(cdp, {
      name: 'mobile',
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    const mobileMetrics = await collectMatrixMetrics(cdp);

    const report = {
      desktop,
      mobile,
      metrics: {
        desktop: desktopMetrics,
        mobile: mobileMetrics,
      },
      consoleMessages,
      chromeStderrTail: stderr.slice(-2000),
    };

    await writeFile(new URL('report.json', outDir), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    await send(cdp, 'Browser.close').catch(() => {});
  } finally {
    chrome.kill();
  }
}

async function captureViewport(cdp, viewport) {
  await send(cdp, 'Emulation.setDeviceMetricsOverride', viewport);
  await send(cdp, 'Page.navigate', { url: appUrl });
  await waitForLoad(cdp);
  await delay(1600);

  const screenshot = await send(cdp, 'Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
    fromSurface: true,
  });

  const fileName = `${viewport.name}.png`;
  await writeFile(new URL(fileName, outDir), Buffer.from(screenshot.data, 'base64'));
  return { file: new URL(fileName, outDir).pathname, viewport };
}

async function collectMatrixMetrics(cdp) {
  const metrics = await send(cdp, 'Runtime.evaluate', {
    returnByValue: true,
    awaitPromise: true,
    expression: `(async () => {
      const rail = document.querySelector('aside');
      const matrixHeader = [...document.querySelectorAll('*')].find(el => el.textContent?.trim() === 'World Spine');
      const matrixScroller = document.querySelector('section .chronos-scroll-y');
      const separators = [...document.querySelectorAll('*')].filter(el => /Prehistory|First Cities and Bronze Age|Classical and Axial Age/.test(el.textContent || '')).length;
      const buttons = [...document.querySelectorAll('button')].map(button => button.textContent?.trim()).filter(Boolean).slice(0, 20);
      const locked = [...document.querySelectorAll('button')].filter(button => button.disabled).length;
      const rows = [...document.querySelectorAll('[style*="104px"]')].length;
      const matrixNodeIds = [...document.querySelectorAll('[data-node-id]')]
        .map(el => el.getAttribute('data-node-id'))
        .filter(Boolean);
      const matrixNodeIdCounts = matrixNodeIds.reduce((counts, nodeId) => {
        counts[nodeId] = (counts[nodeId] ?? 0) + 1;
        return counts;
      }, {});
      const duplicateMatrixNodeIds = Object.entries(matrixNodeIdCounts)
        .filter(([, count]) => count > 1)
        .map(([nodeId]) => nodeId)
        .sort();
      let scrollStability = null;
      if (matrixScroller) {
        matrixScroller.scrollTop = 0;
        await new Promise(resolve => requestAnimationFrame(resolve));
        matrixScroller.scrollTop = 812;
        await new Promise(resolve => requestAnimationFrame(resolve));
        const immediate = Math.round(matrixScroller.scrollTop);
        await new Promise(resolve => setTimeout(resolve, 800));
        const settled = Math.round(matrixScroller.scrollTop);
        scrollStability = {
          immediate,
          settled,
          delta: settled - immediate,
        };
      }
      const overflowingElements = [...document.querySelectorAll('body *')]
        .filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.right > window.innerWidth + 1 || rect.left < -1;
        })
        .slice(0, 10)
        .map(el => ({
          tag: el.tagName.toLowerCase(),
          className: typeof el.className === 'string' ? el.className.slice(0, 160) : '',
          text: (el.textContent || '').trim().slice(0, 80),
          right: Math.round(el.getBoundingClientRect().right),
          left: Math.round(el.getBoundingClientRect().left),
        }));
      return {
        title: document.title,
        bodyTextStart: document.body.innerText.slice(0, 900),
        railVisible: Boolean(rail),
        matrixHeaderVisible: Boolean(matrixHeader),
        passiveSeparatorTextMatches: separators,
        disabledButtonCount: locked,
        fixedHeightRowCount: rows,
        matrixNodePlacement: {
          nodeCardCount: matrixNodeIds.length,
          duplicateMatrixNodeIds,
        },
        scrollStability,
        horizontalOverflow: {
          documentElement: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          body: document.body.scrollWidth - document.body.clientWidth,
          overflowingElements,
        },
        viewport: { width: innerWidth, height: innerHeight },
        firstButtons: buttons,
      };
    })()`,
  });

  return metrics.result.value;
}

async function waitForBrowserWsUrl() {
  for (let index = 0; index < 50; index += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
      if (response.ok) {
        const json = await response.json();
        return json.webSocketDebuggerUrl;
      }
    } catch {
      await delay(200);
    }
  }
  throw new Error('Chrome DevTools endpoint did not start.');
}

async function createTarget(browserWsUrl) {
  const browser = await connectCdp(browserWsUrl);
  const result = await send(browser, 'Target.createTarget', { url: 'about:blank' });
  const targetsResponse = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
  const targets = await targetsResponse.json();
  await browser.close();
  return targets.find(target => target.id === result.targetId);
}

async function connectCdp(wsUrl) {
  const ws = new WebSocket(wsUrl);
  const pending = new Map();
  const cdp = {
    onMessage: null,
    close: () => ws.close(),
    send: (method, params = {}) => new Promise((resolve, reject) => {
      const id = messageId;
      messageId += 1;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    }),
  };

  ws.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result ?? {});
      return;
    }
    cdp.onMessage?.(message);
  });

  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });

  return cdp;
}

async function send(cdp, method, params) {
  return cdp.send(method, params);
}

async function waitForLoad(cdp) {
  await new Promise(resolve => {
    const previous = cdp.onMessage;
    cdp.onMessage = message => {
      previous?.(message);
      if (message.method === 'Page.loadEventFired') {
        cdp.onMessage = previous;
        resolve();
      }
    };
  });
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
