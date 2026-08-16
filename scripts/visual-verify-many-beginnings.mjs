import { chromium } from 'playwright';
import { mkdir, readFile } from 'node:fs/promises';

const base = process.env.VISUAL_BASE_URL ?? 'http://127.0.0.1:4175';
const output = 'docs/pr/ash-74';
const lessonPath = '/learn/lesson.farming.multiple-origins';
await mkdir(output, { recursive: true });
const mediaManifest = JSON.parse(await readFile('content/media/generated/chronos-media.json', 'utf8'));

function allowedDimensions(mediaId) {
  const entry = mediaManifest.assets.find((candidate) => candidate.id === mediaId);
  if (!entry) throw new Error(`Missing generated-media manifest entry for ${mediaId}.`);
  const locator = entry.locator;
  return [locator.fallback, ...locator.variants].map(({ width, height }) => `${width}x${height}`);
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];

function monitor(page, label) {
  page.on('pageerror', (error) => errors.push(`${label} page error: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:')) errors.push(`${label} console error: ${message.text()}`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`${label} HTTP ${response.status()}: ${response.url()}`);
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
  await page.waitForTimeout(250);
  if (await page.locator('.prototype-media-intentions').count() !== 0) throw new Error('Approved prototype annotations leaked into the learner-facing preview.');

  const imageChecks = [
    ['.evidence-module img', 'media.farming.wild-domesticated-wheat'],
    ['.historical-map img', 'media.farming.multiple-origins-map'],
  ];
  for (const [selector, mediaId] of imageChecks) {
    const image = page.locator(selector);
    await image.scrollIntoViewIfNeeded();
    const dimensions = await image.evaluate(async (element) => {
      const image = /** @type {HTMLImageElement} */ (element);
      if (!image.complete) await new Promise((resolve) => image.addEventListener('load', resolve, { once: true }));
      await image.decode();
      return `${image.naturalWidth}x${image.naturalHeight}`;
    });
    const allowed = allowedDimensions(mediaId);
    if (!allowed.includes(dimensions)) throw new Error(`${mediaId} decoded ${dimensions}; expected a declared manifest size: ${allowed.join(', ')}.`);
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
  await module.screenshot({ path, timeout: 10_000 });
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
  console.log(`Validated ${width}x${height} lesson structure and media.`);
  await assertLayout(page, `${width}x${height} light`);
  console.log(`Capturing ${width}x${height} light modules.`);
  await captureModule(page, '.evidence-module', `${output}/many-beginnings-${width}x${height}-wheat-light.png`);
  await captureModule(page, '.historical-map-pair', `${output}/many-beginnings-${width}x${height}-map-light.png`);

  console.log(`Switching ${width}x${height} to dark theme.`);
  await page.getByRole('button', { name: 'Use dark theme' }).first().click();
  await page.waitForTimeout(250);
  await assertLayout(page, `${width}x${height} dark`);
  console.log(`Capturing ${width}x${height} dark modules.`);
  await captureModule(page, '.evidence-module', `${output}/many-beginnings-${width}x${height}-wheat-dark.png`);
  await captureModule(page, '.historical-map-pair', `${output}/many-beginnings-${width}x${height}-map-dark.png`);

  console.log(`Passed ${width}x${height}.`);
}
if (errors.length) throw new Error(`Browser errors:\n${errors.join('\n')}`);
console.log('ASH-74 final-media visual verification passed: 1440x900 and 390x844, light/dark, manifest-declared responsive media, six semantic sections, no approved prototype annotations, and no overflow or browser errors.');
process.exit(0);
