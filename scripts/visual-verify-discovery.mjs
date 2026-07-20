import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const base = process.env.VISUAL_BASE_URL ?? 'http://127.0.0.1:3001';
const output = 'docs/pr/ash-55';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];

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

async function verifyHome(page, width, height) {
  await page.goto(`${base}/home`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Welcome back.' }).waitFor();
  await page.getByText(/Continue.*World Spine/).waitFor();
  if (await page.getByRole('link', { name: 'Learn', exact: true }).count()) throw new Error('Home still exposes Learn as a global destination.');
  const navSelector = width <= 900 ? '.mobile-nav a' : '.global-rail nav a';
  if (await page.locator(navSelector).count() !== 3) throw new Error(`${width}x${height}: expected three global destinations.`);
  await assertLayout(page, `Home ${width}x${height} light`);
}

async function verifyLibrary(page, width, height) {
  await page.goto(`${base}/library`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Explore history.' }).waitFor();
  await page.getByText('185 lesson roadmap').waitFor();
  await page.getByText('12 chapters').waitFor();
  await assertLayout(page, `Library ${width}x${height} light`);
}

async function verifyWorldSpine(page, width, height) {
  await page.goto(`${base}/library/journey.world-history`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'The World Spine' }).waitFor();
  if (await page.locator('.world-spine-chapters li').count() !== 185) throw new Error('World History detail did not render all 185 roadmap nodes.');
  if (await page.locator('.world-spine-chapters .preparing').count() < 1) throw new Error('World History detail lost in-preparation states.');
  const firstChapter = page.locator('.world-spine-chapters details').first();
  if (!(await firstChapter.getAttribute('open'))) await firstChapter.locator('summary').click();
  await page.getByText('Farming and Settlements', { exact: true }).waitFor();
  if (await page.getByText('Farming and Settlements', { exact: true }).getAttribute('href')) throw new Error('An unfinished World Spine node became navigable.');
  await assertLayout(page, `World Spine detail ${width}x${height} light`);
}

async function verifyLearn(page, width, height) {
  await page.goto(`${base}/learn/lesson.uruk.first-city`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Uruk: Life in an Early City', exact: true }).waitFor();
  if (await page.locator('.spine-node').count() !== 185) throw new Error('Learn drawer did not render the full World Spine.');
  if (width <= 900) {
    await page.getByRole('button', { name: 'Open World Spine' }).click();
    await page.getByRole('dialog', { name: 'World History World Spine' }).waitFor();
    if (await page.locator('.learn-mobile-nav a').count() !== 3) throw new Error('Learn mobile navigation did not use three global destinations.');
  } else {
    await page.getByLabel('World History World Spine').waitFor();
  }
  await assertLayout(page, `Learn ${width}x${height} light`);
}

for (const [width, height] of [[1440, 900], [1024, 768], [390, 844], [360, 800]]) {
  const context = await browser.newContext({ viewport: { width, height }, colorScheme: 'light' });
  const page = await context.newPage();
  monitor(page, `${width}x${height}`);

  await verifyHome(page, width, height);
  if (width === 1440 || width === 390) await page.screenshot({ path: `${output}/home-${width}x${height}-light.png`, fullPage: false });
  await verifyLibrary(page, width, height);
  await verifyWorldSpine(page, width, height);
  if (width === 1440 || width === 390) await page.screenshot({ path: `${output}/world-spine-${width}x${height}-light.png`, fullPage: false });
  await verifyLearn(page, width, height);
  if (width === 360) await page.screenshot({ path: `${output}/learn-spine-${width}x${height}-light.png`, fullPage: false });

  const themeButton = page.getByRole('button', { name: 'Use dark theme' }).first();
  if (await themeButton.isVisible()) await themeButton.click();
  else {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'Uruk: Life in an Early City', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Open World Spine' }).click();
    await page.getByRole('dialog', { name: 'World History World Spine' }).waitFor();
  }
  await page.waitForTimeout(150);
  await assertLayout(page, `Learn ${width}x${height} dark`);
  if (width === 1440 || width === 390) await page.screenshot({ path: `${output}/learn-spine-${width}x${height}-dark.png`, fullPage: false });

  await context.close();
}

const gate = await browser.newContext({ viewport: { width: 1024, height: 768 }, colorScheme: 'light' });
const gatePage = await gate.newPage();
monitor(gatePage, 'gating');
await gatePage.goto(`${base}/learn/lesson.writing.early-systems`, { waitUntil: 'networkidle' });
await gatePage.getByRole('heading', { name: 'This lesson is still locked.' }).waitFor();
await gatePage.getByText(/Complete Uruk: Life in an Early City/).waitFor();
await gate.close();

await browser.close();
if (errors.length) throw new Error(`Browser errors:\n${errors.join('\n')}`);
console.log('ASH-55 discovery verification passed: four responsive sizes, light/dark, Home, Library, full World Spine detail, Learn drawer, simplified navigation, gating, overflow, and console checks.');
