import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.VISUAL_BASE_URL ?? 'http://127.0.0.1:3000';
const accessUrl = process.env.VISUAL_ACCESS_URL;
const output = 'docs/pr/ash-54';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--disable-gpu'] });
const errors = [];

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

for (const [width, height] of [[1440, 900], [1024, 768], [390, 844], [360, 800]]) {
  const context = await browser.newContext({ viewport: { width, height }, colorScheme: 'light' });
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(`${width}x${height}: ${error.message}`));
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
await openLesson(evidencePage);
await evidencePage.getByRole('button', { name: 'Tablets and administration' }).click();
await evidencePage.waitForTimeout(300);
await captureStable(evidencePage, `${output}/uruk-1440x900-evidence-module.png`);
await evidenceContext.close();

const flow = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
const page = await flow.newPage();
page.on('pageerror', (error) => errors.push(`flow: ${error.message}`));
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
if (errors.length) throw new Error(`Browser console errors:\n${errors.join('\n')}`);
console.log('Visual verification passed: decoded hero, 4 viewports × light/dark, evidence module, drawer keyboard behavior, prompt feedback, completion/card reveal, refresh/revisit, and invalid route.');
