import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const bundleDirectory = process.env.VISUAL_BUNDLE_DIR;
const base = process.env.VISUAL_BASE_URL ?? 'http://127.0.0.1:3001';
const output = process.env.VISUAL_OUTPUT_DIR ?? 'docs/pr/design-audit-refinements';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH,
});
const errors = [];
const capture = async (page, path) => writeFile(path, await page.screenshot({ fullPage: false }));
let bundledApp;
if (bundleDirectory) {
  const bundleRoot = resolve(bundleDirectory);
  const index = await readFile(join(bundleRoot, 'index.html'), 'utf8');
  const scriptPath = index.match(/src="\/(assets\/[^"]+\.js)"/)?.[1];
  const stylePath = index.match(/href="\/(assets\/[^"]+\.css)"/)?.[1];
  if (!scriptPath || !stylePath) throw new Error('Could not resolve the built app assets.');
  const [rawScript, rawStyle] = await Promise.all([
    readFile(join(bundleRoot, scriptPath), 'utf8'),
    readFile(join(bundleRoot, stylePath), 'utf8'),
  ]);
  bundledApp = {
    root: bundleRoot,
    script: rawScript,
    style: rawStyle,
  };
}

const contentTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

async function serveBundle(context) {
  if (!bundledApp) return;
  const appHtml = `<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${bundledApp.style}</style></head><body><div id="root"></div><script type="module">${bundledApp.script}</script></body></html>`;
  await context.route('http://chronos.local/**', async (route) => {
    const url = new URL(route.request().url());
    if (!url.pathname.startsWith('/assets/') && !url.pathname.startsWith('/images/')) {
      await route.fulfill({ body: appHtml, contentType: 'text/html', status: 200 });
      return;
    }
    const requestedPath = join(bundledApp.root, decodeURIComponent(url.pathname).replace(/^\/+/, ''));
    try {
      await route.fulfill({
        body: await readFile(requestedPath),
        contentType: contentTypes[extname(requestedPath)] ?? 'application/octet-stream',
        status: 200,
      });
    } catch {
      await route.fulfill({ body: 'Not found', contentType: 'text/plain', status: 404 });
    }
  });
}

async function openPage(page, destination) {
  await page.goto(`${bundledApp ? 'http://chronos.local' : base}${destination}`, {
    waitUntil: bundledApp ? 'load' : 'networkidle',
  });
}

function monitor(page, label) {
  page.on('pageerror', (error) => errors.push(`${label} page error: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`${label} console error: ${message.text()}`);
  });
}

async function assertLayout(page, label) {
  const result = await page.evaluate(() => ({
    viewport: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
  }));
  if (result.documentWidth > result.viewport + 1 || result.bodyWidth > result.viewport + 1) {
    const offenders = await page.evaluate(() => [...document.querySelectorAll('*')]
      .map((element) => ({ tag: element.tagName, className: element.className, right: element.getBoundingClientRect().right }))
      .filter((item) => item.right > innerWidth + 1)
      .slice(0, 10));
    throw new Error(`${label} has horizontal overflow: ${JSON.stringify({ result, offenders })}`);
  }
  const overlay = await page.locator('vite-error-overlay,.vite-error-overlay,#webpack-dev-server-client-overlay').count();
  if (overlay) throw new Error(`${label} rendered a development error overlay.`);
}

async function assertDocumentScroll(page, label) {
  const metrics = await page.evaluate(() => ({
    clientHeight: document.documentElement.clientHeight,
    scrollHeight: document.documentElement.scrollHeight,
  }));
  if (metrics.scrollHeight <= metrics.clientHeight + 1) throw new Error(`${label} is not tall enough to exercise document scrolling.`);
  const target = Math.min(500, metrics.scrollHeight - metrics.clientHeight);
  const actual = await page.evaluate((next) => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, next);
    return window.scrollY;
  }, target);
  if (actual < target - 1) throw new Error(`${label} document scroll is locked: expected ${target}, received ${actual}.`);
  await page.evaluate(() => window.scrollTo(0, 0));
}

const globalNavigation = (page, width) => width <= 900
  ? page.locator('.mobile-nav')
  : page.locator('.global-rail nav');

async function verifyGlobalDrawer(page, width, label) {
  const navigation = globalNavigation(page, width);
  if (await navigation.locator(':scope > *').count() !== 4) {
    throw new Error(`${label} did not expose the four shared global destinations.`);
  }
  if (width <= 900) {
    const itemTops = await navigation.locator(':scope > *').evaluateAll((items) => (
      items.map((item) => item.getBoundingClientRect().top)
    ));
    if (Math.max(...itemTops) - Math.min(...itemTops) > 2) {
      throw new Error(`${label} wrapped the mobile destinations onto multiple rows.`);
    }
  }
  const trigger = navigation.getByRole('button', { name: 'World History' });
  await trigger.click();
  const drawer = page.getByRole('dialog', { name: 'World History' });
  await drawer.waitFor();
  await drawer.getByRole('heading', { name: 'World History' }).waitFor();
  await drawer.getByRole('button', { name: 'Close World History' }).click();
  await drawer.waitFor({ state: 'hidden' });
  await page.waitForTimeout(260);
}

async function verifyHome(page, width, height) {
  await openPage(page, '/home');
  await page.getByRole('heading', { name: 'Welcome back.' }).waitFor();
  await page.getByText(/Continue.*World History/).waitFor();
  if (await page.getByRole('link', { name: 'Learn', exact: true }).count()) throw new Error('Home still exposes Learn as a global destination.');
  await verifyGlobalDrawer(page, width, `Home ${width}x${height}`);
  await assertLayout(page, `Home ${width}x${height} light`);
  await assertDocumentScroll(page, `Home ${width}x${height}`);
}

async function verifyLibrary(page, width, height) {
  await openPage(page, '/library');
  await page.getByRole('heading', { name: 'Explore history.' }).waitFor();
  const main = page.getByRole('main');
  await main.getByText('185 lesson roadmap').waitFor();
  await main.getByText('12 chapters').waitFor();
  const open = page.getByRole('button', { name: 'Open World History' });
  await open.click();
  const drawer = page.getByRole('dialog', { name: 'World History' });
  await drawer.waitFor();
  await drawer.getByRole('button', { name: 'Close World History' }).click();
  await drawer.waitFor({ state: 'hidden' });
  await page.waitForTimeout(260);
  if (await page.evaluate(() => document.activeElement?.textContent?.includes('Open World History')) !== true) {
    throw new Error('Library drawer did not return focus to its trigger.');
  }
  await assertLayout(page, `Library ${width}x${height} light`);
  await assertDocumentScroll(page, `Library ${width}x${height}`);
}

async function verifyWorldSpine(page, width, height) {
  await openPage(page, '/library/journey.world-history');
  await page.getByRole('heading', { name: 'Complete World History roadmap' }).waitFor();
  if (await page.locator('.world-spine-chapters li').count() !== 185) throw new Error('World History detail did not render all 185 roadmap nodes.');
  if (await page.locator('.world-spine-chapters .preparing').count() < 1) throw new Error('World History detail lost in-preparation states.');
  const firstChapter = page.locator('.world-spine-chapters details').first();
  if (!(await firstChapter.getAttribute('open'))) await firstChapter.locator('summary').click();
  const farming = page.locator('.world-spine-chapters').getByText('Farming and Settlements', { exact: true });
  await farming.waitFor({ state: 'attached' });
  if (await farming.getAttribute('href') !== '/learn/lesson.farming.settlements') throw new Error('The published Farming and Settlements node is not navigable.');
  await assertLayout(page, `World History detail ${width}x${height} light`);
  await assertDocumentScroll(page, `World History detail ${width}x${height}`);
}

async function verifySearch(page, width, height) {
  await openPage(page, '/search?q=uruk');
  const input = page.getByRole('searchbox', { name: 'Search published Chronos content' });
  await input.waitFor();
  await page.locator('#search-result-0').waitFor();
  if (await page.getByRole('combobox').count()) throw new Error('Search still claims the ARIA combobox pattern.');
  if (await page.getByRole('listbox').count() || await page.getByRole('option').count()) throw new Error('Search results still claim composite-widget roles.');
  await input.focus();
  await input.press('ArrowDown');
  if (await page.evaluate(() => document.activeElement?.id) !== 'search-result-0') throw new Error('Arrow Down did not move focus to the first search result.');
  await page.keyboard.press('Tab');
  if (await page.evaluate(() => document.activeElement?.id) !== 'search-result-1') throw new Error('Tab did not follow normal link focus order through search results.');
  await verifyGlobalDrawer(page, width, `Search ${width}x${height}`);
  await assertLayout(page, `Search ${width}x${height} light`);
}
async function verifyLearn(page, width, height) {
  await openPage(page, '/learn/lesson.uruk.first-city');
  await page.getByRole('heading', { name: 'Uruk: Life in an Early City', exact: true }).waitFor();
  const rail = page.getByLabel('World History', { exact: true });
  if (await rail.getAttribute('aria-hidden') !== 'true') throw new Error('World History was permanently visible instead of closed in its drawer.');
  const visibleNodes = await page.locator('.spine-node').count();
  if (visibleNodes < 4 || visibleNodes >= 185) throw new Error(`Learn rail was not condensed: rendered ${visibleNodes} World History nodes.`);
  const drawerTrigger = globalNavigation(page, width).getByRole('button', { name: 'World History' });
  await drawerTrigger.click();
  await page.getByRole('dialog', { name: 'World History' }).waitFor();
  await page.getByRole('link', { name: 'View complete 185-lesson roadmap' }).waitFor();
  await page.getByRole('button', { name: 'Close World History' }).click();
  if (await rail.getAttribute('aria-hidden') !== 'true') throw new Error('World History drawer did not close.');
  await rail.waitFor({ state: 'hidden' });
  if (await globalNavigation(page, width).locator(':scope > *').count() !== 4) throw new Error('Learn did not retain the four shared global destinations.');
  await assertLayout(page, `Learn ${width}x${height} light`);
}

async function verifyLockedLesson(page, width, height) {
  await openPage(page, '/learn/lesson.writing.early-systems');
  await page.getByRole('heading', { name: 'This lesson is still locked.' }).waitFor();
  await page.getByText(/Complete Uruk: Life in an Early City before continuing/).waitFor();
  await verifyGlobalDrawer(page, width, `Locked lesson ${width}x${height}`);
  if (await page.getByRole('navigation', { name: 'Lesson sections' }).count()) throw new Error('Locked lesson exposed its section controls.');
  await assertLayout(page, `Locked lesson ${width}x${height}`);
}

const requestedViewport = process.env.VISUAL_VIEWPORT?.split('x').map(Number);
const viewports = requestedViewport?.length === 2 && requestedViewport.every(Number.isFinite)
  ? [requestedViewport]
  : [[1440, 900], [1024, 768], [390, 844], [360, 800]];

for (const [width, height] of viewports) {
  console.log(`Verifying Chronos at ${width}x${height}…`);
  const context = await browser.newContext({ viewport: { width, height }, colorScheme: 'light' });
  await serveBundle(context);
  const page = await context.newPage();
  monitor(page, `${width}x${height}`);

  await verifyHome(page, width, height);
  console.log(`  Home passed at ${width}x${height}.`);
  if (width === 1440 || width === 390) await capture(page, `${output}/home-${width}x${height}-light.png`);
  await verifyLibrary(page, width, height);
  console.log(`  Library passed at ${width}x${height}.`);
  if (width === 1440 || width === 390) await capture(page, `${output}/library-${width}x${height}-light.png`);
  await verifyWorldSpine(page, width, height);
  console.log(`  World History passed at ${width}x${height}.`);
  if (width === 1440 || width === 390) await capture(page, `${output}/world-spine-${width}x${height}-light.png`);
  await verifySearch(page, width, height);
  console.log(`  Search passed at ${width}x${height}.`);
  if (width === 1440 || width === 390) await capture(page, `${output}/search-${width}x${height}-light.png`);
  await verifyLearn(page, width, height);
  console.log(`  Learn passed at ${width}x${height}.`);
  if (width === 1440 || width === 390) await capture(page, `${output}/learn-spine-${width}x${height}-light.png`);

  const themeButton = page.getByRole('button', { name: 'Use dark theme' }).first();
  if (await themeButton.isVisible()) await themeButton.click();
  else {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'Uruk: Life in an Early City', exact: true }).waitFor();
    await globalNavigation(page, width).getByRole('button', { name: 'World History' }).click();
    await page.getByRole('dialog', { name: 'World History' }).waitFor();
  }
  await page.waitForTimeout(150);
  await assertLayout(page, `Learn ${width}x${height} dark`);
  if (width === 1440 || width === 390) await capture(page, `${output}/learn-spine-${width}x${height}-dark.png`);

  await verifyLockedLesson(page, width, height);
  console.log(`  Locked lesson passed at ${width}x${height}.`);
  if (width === 1440 || width === 390) await capture(page, `${output}/locked-${width}x${height}-dark.png`);

  await context.close();
  console.log(`Verified Chronos at ${width}x${height}.`);
}

const gate = await browser.newContext({ viewport: { width: 1024, height: 768 }, colorScheme: 'light' });
await serveBundle(gate);
const gatePage = await gate.newPage();
monitor(gatePage, 'gating');
await openPage(gatePage, '/learn/lesson.writing.early-systems');
await gatePage.getByRole('heading', { name: 'This lesson is still locked.' }).waitFor();
await gatePage.getByText(/Complete Uruk: Life in an Early City/).waitFor();
await gate.close();

await browser.close();
if (errors.length) throw new Error(`Browser errors:\n${errors.join('\n')}`);
console.log('ASH-71 discovery verification passed: four responsive sizes, light/dark, Home, Library, full World History detail, shared World History drawer, simplified navigation, document scrolling, gating, overflow, and console checks.');
