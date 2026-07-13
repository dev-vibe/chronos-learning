import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const base = 'http://127.0.0.1:3000';
const output = 'docs/pr/ash-54';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];

for (const [width, height] of [[1440, 900], [1024, 768], [390, 844], [360, 800]]) {
  const context = await browser.newContext({ viewport: { width, height }, colorScheme: 'light' });
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(`${width}x${height}: ${error.message}`));
  await page.goto(`${base}/learn/lesson.uruk.first-city`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Uruk: Life in an Early City' }).waitFor();
  await page.screenshot({ path: `${output}/uruk-${width}x${height}-light.png`, fullPage: false });
  await page.getByRole('button', { name: 'Use dark theme' }).first().click();
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${output}/uruk-${width}x${height}-dark.png`, fullPage: false });
  if (width <= 390) {
    const open = page.getByRole('button', { name: 'Open journey' });
    await open.click();
    await page.getByRole('dialog', { name: 'World History journey' }).waitFor();
    await page.keyboard.press('Escape');
    if (!(await open.evaluate((element) => element === document.activeElement))) throw new Error(`${width}: drawer focus was not returned`);
  }
  await context.close();
}

const flow = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light' });
const page = await flow.newPage();
page.on('pageerror', (error) => errors.push(`flow: ${error.message}`));
await page.goto(`${base}/learn/lesson.uruk.first-city`, { waitUntil: 'networkidle' });
await page.getByLabel('Administrative tablets and cylinder seals').check();
await page.getByText('Good investigation.').waitFor();
await page.getByPlaceholder('Use an example from the lesson…').fill('Specialized work created opportunity, while unequal labor was a serious cost.');
await page.getByPlaceholder('Use an example from the lesson…').blur();
await page.getByRole('button', { name: 'Complete lesson' }).click();
await page.getByText('Knowledge Card · Place').waitFor();
await page.screenshot({ path: `${output}/uruk-390x844-completion-card.png`, fullPage: false });
await page.reload({ waitUntil: 'networkidle' });
await page.getByRole('heading', { name: 'Lesson explored' }).waitFor();
if (await page.getByText('Knowledge Card · Place').count() !== 1) throw new Error('revisit showed a duplicate or missing card');
await page.goto(`${base}/learn/lesson.unknown`, { waitUntil: 'networkidle' });
await page.getByRole('heading', { name: 'This archive entry isn’t available.' }).waitFor();
await page.screenshot({ path: `${output}/invalid-lesson-390x844.png`, fullPage: false });
await flow.close();
await browser.close();
if (errors.length) throw new Error(`Browser console errors:\n${errors.join('\n')}`);
console.log('Visual verification passed: 4 viewports × light/dark, drawer keyboard behavior, prompt feedback, completion/card reveal, refresh/revisit, and invalid route.');
