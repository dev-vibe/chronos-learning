import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const shouldStartServer = process.env.VISUAL_START_SERVER === '1';
const base = process.env.VISUAL_BASE_URL ?? (shouldStartServer ? 'http://127.0.0.1:4174' : 'http://127.0.0.1:3000');
const accessUrl = process.env.VISUAL_ACCESS_URL;
const output = 'docs/pr/ash-54';
await mkdir(output, { recursive: true });
let server;
if (shouldStartServer) {
  const viteEntry = fileURLToPath(new URL('../../bin/vite.js', import.meta.resolve('vite')));
  const url = new URL(base);
  server = spawn(process.execPath, [viteEntry, 'preview', '--host', url.hostname, '--port', url.port, '--strictPort'], { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'] });
  let serverError = '';
  server.stderr.on('data', (chunk) => { serverError += chunk.toString(); });
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try { if ((await fetch(base)).ok) break; }
    catch { /* The server is still starting. */ }
    if (attempt === 39) throw new Error(`Visual server did not start at ${base}. ${serverError}`);
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  process.on('exit', () => server?.kill());
}
const browser = await chromium.launch({ headless: true });
const errors = [];

function monitorPage(page, label) {
  page.on('pageerror', (error) => errors.push(`${label} page error: ${error.message}`));
  page.on('console', (message) => {
    const source = message.location().url;
    if (message.type() === 'error') errors.push(`${label} console error: ${message.text()}${source ? ` (${source})` : ''}`);
  });
}

async function captureStable(page, path) {
  await page.screenshot({ fullPage: false });
  await page.waitForTimeout(250);
  const image = await page.screenshot({ fullPage: false });
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try { await writeFile(path, image); return; }
    catch (error) { if (attempt === 2) throw error; await page.waitForTimeout(250); }
  }
}

async function openLesson(page) {
  if (accessUrl) await page.goto(accessUrl, { waitUntil: 'networkidle' });
  await page.goto(`${base}/learn/lesson.uruk.first-city`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Uruk: Life in an Early City' }).waitFor();
  const hero = page.locator('.hero img');
  await hero.evaluate(async (image) => { if (!image.complete) await new Promise((resolve) => image.addEventListener('load', resolve, { once: true })); await image.decode(); });
  const imageState = await hero.evaluate((image) => ({ complete: image.complete, width: image.naturalWidth, height: image.naturalHeight, state: image.closest('.hero')?.dataset.imageState }));
  if (!imageState.complete || imageState.width !== 1600 || imageState.height !== 800 || imageState.state !== 'ready') throw new Error(`Hero failed decode contract: ${JSON.stringify(imageState)}`);
}

async function verifyAndCaptureMap(page, width, height, theme) {
  const map = page.locator('.historical-map');
  const label = width + 'x' + height + ' ' + theme;
  await map.evaluate((element) => window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 64, behavior: 'instant' }));
  await page.waitForTimeout(250);
  const image = map.locator(':scope > img');
  await image.evaluate(async (element) => {
    if (!element.complete) await new Promise((resolve) => element.addEventListener('load', resolve, { once: true }));
    await element.decode();
  });
  const state = await image.evaluate((element) => {
    const imageRect = element.getBoundingClientRect();
    const figureRect = element.closest('figure').getBoundingClientRect();
    const styles = getComputedStyle(element);
    return {
      complete: element.complete,
      naturalWidth: element.naturalWidth,
      naturalHeight: element.naturalHeight,
      width: imageRect.width,
      ratio: imageRect.width / imageRect.height,
      objectFit: styles.objectFit,
      clipped: imageRect.left < figureRect.left - 1 || imageRect.right > figureRect.right + 1 || imageRect.top < figureRect.top - 1 || imageRect.bottom > figureRect.bottom + 1,
    };
  });
  const naturalRatio = 1732 / 908;
  if (!state.complete || state.naturalWidth !== 1732 || state.naturalHeight !== 908) throw new Error(label + ': map failed decode contract ' + JSON.stringify(state));
  if (state.objectFit !== 'contain' || Math.abs(state.ratio - naturalRatio) > 0.01 || state.clipped) throw new Error(label + ': map is clipped or distorted ' + JSON.stringify(state));
  if (state.width < 300) throw new Error(label + ': map is too narrow for its baked labels (' + state.width + 'px)');
  const meta = map.locator('.historical-map__meta');
  const metaText = await meta.innerText();
  if (!await meta.isVisible() || !/illustrative map/i.test(metaText) || !/waterways approximate/i.test(metaText)) throw new Error(label + ': compact depiction and uncertainty treatment is missing');

  const describedBy = await map.getAttribute('aria-describedby');
  if (!describedBy) throw new Error(label + ': accessible summary is not referenced');
  const summary = page.locator('[id="' + describedBy + '"]');
  if (!/Uruk lies northwest of Ur and Eridu/i.test(await summary.textContent())) throw new Error(label + ': accessible summary is missing');

  const info = map.getByRole('button', { name: /About this map/i });
  await info.click();
  const dialog = page.getByRole('dialog', { name: 'A city shaped by water' });
  await dialog.waitFor();
  const dialogText = await dialog.innerText();
  if (!/UNESCO World Heritage coordinates/i.test(dialogText) || !/Near modern Warka, Iraq/i.test(dialogText) || !/Approximate ancient landscape/i.test(dialogText)) throw new Error(label + ': map disclosure is missing verified-location, modern-place, or uncertainty context');
  const links = dialog.getByRole('link');
  if (await links.count() < 3) throw new Error(label + ': map disclosure source links are missing');
  for (let index = 0; index < await links.count(); index += 1) {
    if (!String(await links.nth(index).getAttribute('href')).startsWith('https://')) throw new Error(label + ': map disclosure has a non-canonical source link');
  }
  if (!await dialog.evaluate((element) => element.contains(document.activeElement))) throw new Error(label + ': map disclosure did not receive focus');
  if (width === 390 && theme === 'light') await captureStable(page, `${output}/uruk-390x844-map-info.png`);
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  if (!await info.evaluate((element) => element === document.activeElement)) throw new Error(label + ': map disclosure did not return focus');
  await captureStable(page, `${output}/uruk-${width}x${height}-map-${theme}.png`);
}

for (const [width, height] of [[1440, 900], [1024, 768], [390, 844], [360, 800]]) {
  const context = await browser.newContext({ viewport: { width, height }, colorScheme: 'light' });
  const page = await context.newPage();
  monitorPage(page, `${width}x${height}`);
  await openLesson(page);
  await page.waitForTimeout(700);
  if (width === 1440) {
    const firstSectionTop = await page.locator('#section\\.uruk\\.masthead').evaluate((element) => element.getBoundingClientRect().top);
    if (firstSectionTop >= height) throw new Error('The 1440×900 first viewport does not show meaningful lesson content.');
  }
  await captureStable(page, `${output}/uruk-${width}x${height}-light.png`);
  await page.getByRole('button', { name: 'Use dark theme' }).first().click();
  await page.waitForTimeout(700);
  await captureStable(page, `${output}/uruk-${width}x${height}-dark.png`);
  await verifyAndCaptureMap(page, width, height, 'dark');
  await page.getByRole('button', { name: 'Use light theme' }).first().click();
  await page.waitForTimeout(200);
  await verifyAndCaptureMap(page, width, height, 'light');
  if (width <= 390) {
    const open = page.getByRole('button', { name: 'Open journey' });
    await open.click();
    await page.getByRole('dialog', { name: 'World History journey' }).waitFor();
    await page.keyboard.press('Escape');
    if (!(await open.evaluate((element) => element === document.activeElement))) throw new Error(`${width}: drawer focus was not returned`);
  }
  await context.close();
}

const evidenceContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
const evidencePage = await evidenceContext.newPage();
monitorPage(evidencePage, 'evidence');
await openLesson(evidencePage);
await evidencePage.getByRole('button', { name: 'Tablets and administration' }).click();
await evidencePage.waitForTimeout(300);
await captureStable(evidencePage, `${output}/uruk-1440x900-evidence-module.png`);
await evidenceContext.close();

const flow = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
const page = await flow.newPage();
monitorPage(page, 'flow');
await openLesson(page);
await page.getByLabel('Administrative tablets and cylinder seals').check();
await page.getByText('Good investigation.').waitFor();
await page.getByPlaceholder('Use an example from the lesson…').fill('Specialized work created opportunity, while unequal labor was a serious cost.');
await page.getByPlaceholder('Use an example from the lesson…').blur();
await page.getByRole('button', { name: 'Complete lesson' }).click();
await page.getByText('Knowledge Card · Place').waitFor();
await page.getByRole('button', { name: 'Inspect Uruk card' }).click();
await page.waitForTimeout(250);
await captureStable(page, `${output}/uruk-1440x900-completion-card.png`);
await page.setViewportSize({ width: 390, height: 844 });
await page.getByRole('button', { name: 'Inspect Uruk card' }).click();
await page.waitForTimeout(250);
await captureStable(page, `${output}/uruk-390x844-completion-card.png`);
await page.reload({ waitUntil: 'networkidle' });
await page.getByRole('heading', { name: 'Lesson explored' }).waitFor();
if (await page.getByText('Knowledge Card · Place').count() !== 1) throw new Error('Revisit showed a duplicate or missing card.');
await page.goto(`${base}/learn/lesson.unknown`, { waitUntil: 'networkidle' });
await page.getByRole('heading', { name: 'This archive entry isn’t available.' }).waitFor();
await captureStable(page, `${output}/invalid-lesson-390x844.png`);
await flow.close();
await browser.close();
server?.kill();
if (errors.length) throw new Error(`Browser console errors:\n${errors.join('\n')}`);
console.log('Visual verification passed: production preview, page/console monitoring, decoded proportional map, 4 viewports × light/dark, compact disclosure and sources, drawer keyboard behavior, completion/revisit, and invalid route.');
