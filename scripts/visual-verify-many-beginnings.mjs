import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const base = process.env.VISUAL_BASE_URL ?? 'http://127.0.0.1:4175';
const output = 'docs/pr/ash-74';
const lessonPath = '/learn/lesson.farming.multiple-origins';
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];

function monitor(page, label) {
  page.on('pageerror', (error) => errors.push(`${label} page error: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`${label} console error: ${message.text()}`);
  });
  page.on('requestfailed', (request) => errors.push(`${label} request failed: ${request.url()} (${request.failure()?.errorText ?? 'unknown'})`));
}

async function openLesson(page) {
  await page.goto(`${base}${lessonPath}`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Many Beginnings of Farming', exact: true }).waitFor();
  await page.evaluate(() => document.fonts.ready);

  if (await page.locator('[data-section-id]').count() !== 6) throw new Error('Many Beginnings did not render six semantic lesson sections.');
  if (await page.locator('.evidence-module').count() !== 1) throw new Error('The wheat evidence module did not render exactly once.');
  if (await page.locator('.historical-map').count() !== 1) throw new Error('The world origins map did not render exactly once.');
  if (await page.locator('.prototype-media-intentions').count() !== 3) throw new Error('The draft review metadata did not render three non-semantic media annotations.');
  if (await page.locator('.prototype-media-intentions h1,.prototype-media-intentions h2,.prototype-media-intentions h3').count()) throw new Error('A prototype annotation became a semantic heading.');

  const images = page.locator('.evidence-module img,.historical-map img');
  for (let index = 0; index < await images.count(); index += 1) {
    await images.nth(index).evaluate(async (image) => {
      if (!image.complete) await new Promise((resolve) => image.addEventListener('load', resolve, { once: true }));
      await image.decode();
      if (image.naturalWidth !== 960 || image.naturalHeight <= 0) throw new Error(`Unexpected production media dimensions: ${image.naturalWidth}x${image.naturalHeight}`);
    });
  }
}

async function assertLayout(page, label) {
  const layout = await page.evaluate(() => ({
    viewport: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
    overlay: Boolean(document.querySelector('.vite-error-overlay,#webpack-dev-server-client-overlay,[data-nextjs-dialog]')),
    contentLength: document.body.innerText.trim().length,
  }));
  if (layout.overlay) throw new Error(`${label} shows a framework error overlay.`);
  if (layout.contentLength < 1000) throw new Error(`${label} rendered too little learner content.`);
  if (layout.documentWidth > layout.viewport + 1 || layout.bodyWidth > layout.viewport + 1) {
    throw new Error(`${label} has horizontal overflow: ${JSON.stringify(layout)}`);
  }
}

async function captureModule(page, selector, path) {
  const module = page.locator(selector);
  await module.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  await page.screenshot({ path, fullPage: false });
}

const requestedWidth = Number(process.env.VISUAL_WIDTH ?? 0);
const viewports = [[1440, 900], [390, 844]].filter(([width]) => requestedWidth === 0 || width === requestedWidth);
if (viewports.length === 0) throw new Error(`Unsupported VISUAL_WIDTH: ${requestedWidth}`);

for (const [width, height] of viewports) {
  console.log(`Checking ${width}x${height}…`);
  const context = await browser.newContext({ viewport: { width, height }, colorScheme: 'light' });
  const page = await context.newPage();
  monitor(page, `${width}x${height}`);
  await openLesson(page);
  await assertLayout(page, `${width}x${height} light`);
  await captureModule(page, '.evidence-module', `${output}/many-beginnings-${width}x${height}-wheat-light.png`);
  await captureModule(page, '.historical-map-pair', `${output}/many-beginnings-${width}x${height}-map-light.png`);

  await page.getByRole('button', { name: 'Use dark theme' }).first().click();
  await page.waitForTimeout(250);
  await assertLayout(page, `${width}x${height} dark`);
  await captureModule(page, '.evidence-module', `${output}/many-beginnings-${width}x${height}-wheat-dark.png`);
  await captureModule(page, '.historical-map-pair', `${output}/many-beginnings-${width}x${height}-map-dark.png`);

  console.log(`Passed ${width}x${height}.`);
}
if (errors.length) throw new Error(`Browser errors:\n${errors.join('\n')}`);
console.log('ASH-74 final-media visual verification passed: 1440x900 and 390x844, light/dark, decoded 960px media, six semantic sections, review annotations outside heading semantics, and no overflow or browser errors.');
process.exit(0);
