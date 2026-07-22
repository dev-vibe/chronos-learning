import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const base = process.env.VISUAL_BASE_URL ?? 'http://127.0.0.1:3000';
const output = 'docs/pr/ash-70';
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const errors = [];

function monitor(page, label) {
  page.on('pageerror', (error) => errors.push(`${label} page error: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`${label} console error: ${message.text()}`);
  });
}

async function decodeAllImages(page) {
  const images = page.locator('article img');
  for (let index = 0; index < await images.count(); index += 1) {
    await images.nth(index).evaluate(async (image) => {
      if (!image.complete) await new Promise((resolve) => image.addEventListener('load', resolve, { once: true }));
      await image.decode();
      if (!image.naturalWidth || !image.naturalHeight) throw new Error('Image decoded without dimensions.');
    });
  }
}

async function assertNoOverflow(page, label) {
  const layout = await page.evaluate(() => ({
    viewport: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
  }));
  if (layout.documentWidth > layout.viewport + 1 || layout.bodyWidth > layout.viewport + 1) {
    throw new Error(`${label} has horizontal overflow: ${JSON.stringify(layout)}`);
  }
}

async function openLesson(page) {
  page.setDefaultTimeout(12_000);
  await page.goto(`${base}/learn/lesson.farming.settlements`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Farming and Settlements', exact: true }).waitFor();
  if (await page.locator('[data-section-id]').count() !== 7) throw new Error('Farming lesson did not render seven semantic sections.');

  const hero = page.locator('.hero img');
  await hero.evaluate(async (image) => {
    if (!image.complete) await new Promise((resolve) => image.addEventListener('load', resolve, { once: true }));
    await image.decode();
  });
  const heroState = await hero.evaluate((image) => ({
    width: image.naturalWidth,
    height: image.naturalHeight,
    fit: getComputedStyle(image).objectFit,
  }));
  if (heroState.width !== 1536 || heroState.height !== 1024 || heroState.fit !== 'cover') {
    throw new Error(`Hero failed crop/decode contract: ${JSON.stringify(heroState)}`);
  }
}

for (const [width, height] of [[1440, 900], [1024, 768], [390, 844], [360, 800]]) {
  const context = await browser.newContext({ viewport: { width, height }, colorScheme: 'light' });
  const page = await context.newPage();
  monitor(page, `${width}x${height}`);
  console.log(`Checking ${width}x${height}`);
  await openLesson(page);
  await assertNoOverflow(page, `${width}x${height} light`);
  await page.screenshot({ path: `${output}/farming-${width}x${height}-light.png`, fullPage: false });

  const darkToggle = page.getByRole('button', { name: 'Use dark theme' }).first();
  if (await darkToggle.count()) {
    await darkToggle.click();
  } else {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: 'Farming and Settlements', exact: true }).waitFor();
  }
  await page.waitForTimeout(250);
  await assertNoOverflow(page, `${width}x${height} dark`);
  await page.screenshot({ path: `${output}/farming-${width}x${height}-dark.png`, fullPage: false });

  const map = page.locator('.historical-map');
  await map.evaluate((element) => window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 72, behavior: 'instant' }));
  await page.waitForTimeout(200);
  const mapImage = map.locator(':scope > img');
  await mapImage.evaluate(async (image) => {
    if (!image.complete) await new Promise((resolve) => image.addEventListener('load', resolve, { once: true }));
    await image.decode();
  });
  const mapState = await mapImage.evaluate((image) => ({
    width: image.naturalWidth,
    height: image.naturalHeight,
    fit: getComputedStyle(image).objectFit,
  }));
  if (mapState.width !== 1732 || mapState.height !== 980 || mapState.fit !== 'contain') {
    throw new Error(`${width} map failed decode/layout contract: ${JSON.stringify(mapState)}`);
  }
  await page.screenshot({ path: `${output}/farming-${width}x${height}-map-dark.png`, fullPage: false });

  const info = map.getByRole('button', { name: /About this map/i });
  await info.click();
  const dialog = page.getByRole('dialog', { name: 'Inland on the Konya plain' });
  await dialog.waitFor();
  const dialogText = await dialog.innerText();
  if (!/UNESCO World Heritage coordinates/i.test(dialogText) || !/coastlines/i.test(dialogText)) {
    throw new Error(`${width} map disclosure lost coordinate or uncertainty context.`);
  }
  await page.keyboard.press('Escape');

  const scene = page.locator('.scene-module');
  await scene.scrollIntoViewIfNeeded();
  await scene.locator('summary').click();
  await page.waitForTimeout(200);
  await decodeAllImages(page);
  if (await scene.locator('.scene-details li').count() !== 4) throw new Error('House evidence view lost its four hotspots.');
  await page.screenshot({ path: `${output}/farming-${width}x${height}-house-evidence.png`, fullPage: false });

  if (width <= 390) {
    const open = page.getByRole('button', { name: 'Open World Spine' });
    await open.click();
    await page.getByRole('dialog', { name: 'World History World Spine' }).waitFor();
    await page.keyboard.press('Escape');
    if (!await open.evaluate((element) => element === document.activeElement)) throw new Error(`${width}: drawer focus was not returned.`);
  }

  await context.close();
}

await browser.close();
if (errors.length) throw new Error(`Browser errors:\n${errors.join('\n')}`);
console.log('ASH-70 Farming visual verification passed: four viewports, light/dark, hero crop, map disclosure, evidence hotspots, decoded media, and overflow checks.');
