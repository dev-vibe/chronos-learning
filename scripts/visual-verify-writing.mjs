import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const base = process.env.VISUAL_BASE_URL ?? 'http://127.0.0.1:4174';
const output = 'docs/pr/ash-57';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];

function monitor(page, label) {
  page.on('pageerror', (error) => errors.push(`${label} page error: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`${label} console error: ${message.text()}`);
  });
}

async function openWriting(page) {
  await page.goto(`${base}/learn/lesson.writing.early-systems`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'From Marks to Proto-Cuneiform', exact: true }).waitFor();
  if (await page.locator('[data-section-id]').count() !== 8) throw new Error('Writing lesson did not render eight semantic sections.');
  const previous = page.getByRole('link', { name: /Previous: Uruk/ }).first();
  if (await previous.getAttribute('href') !== '/learn/lesson.uruk.first-city') throw new Error('Writing previous action does not resolve to Uruk.');
  const images = page.locator('article img');
  for (let index = 0; index < await images.count(); index += 1) {
    await images.nth(index).evaluate(async (image) => {
      if (!image.complete) await new Promise((resolve) => image.addEventListener('load', resolve, { once: true }));
      await image.decode();
      if (!image.naturalWidth || !image.naturalHeight) throw new Error('Image decoded without dimensions.');
    });
  }
}

async function assertLayout(page, label) {
  const layout = await page.evaluate(() => ({ viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth, bodyWidth: document.body.scrollWidth }));
  if (layout.scrollWidth > layout.viewport + 1 || layout.bodyWidth > layout.viewport + 1) {
    const offenders = await page.evaluate(() => [...document.querySelectorAll('*')].map((element) => ({ tag: element.tagName, className: element.className, rect: element.getBoundingClientRect().toJSON() })).filter((item) => item.rect.right > innerWidth + 1).slice(0, 12));
    throw new Error(`${label} has horizontal overflow: ${JSON.stringify({ layout, offenders })}`);
  }
  const clipped = await page.evaluate(() => {
    const visible = [...document.querySelectorAll('.lesson h1,.lesson h2,.lesson p,.lesson img,.lesson button,.lesson a')].filter((element) => {
      const style = getComputedStyle(element); const rect = element.getBoundingClientRect();
      return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight;
    });
    return visible.map((element) => ({ tag: element.tagName, className: element.className, text: element.textContent?.slice(0, 60), rect: element.getBoundingClientRect().toJSON() })).filter((item) => item.rect.left < -1 || item.rect.right > innerWidth + 1);
  });
  if (clipped.length) throw new Error(`${label} has clipped first-viewport content: ${JSON.stringify(clipped)}`);
}

for (const [width, height] of [[1440, 900], [1024, 768], [390, 844], [360, 800]]) {
  const context = await browser.newContext({ viewport: { width, height }, colorScheme: 'light' });
  const page = await context.newPage();
  monitor(page, `${width}x${height}`);
  await openWriting(page);
  await assertLayout(page, `${width}x${height} light`);
  await page.screenshot({ path: `${output}/writing-${width}x${height}-light.png`, fullPage: false });
  await page.getByRole('button', { name: 'Use dark theme' }).first().click();
  await page.waitForTimeout(250);
  await assertLayout(page, `${width}x${height} dark`);
  await page.screenshot({ path: `${output}/writing-${width}x${height}-dark.png`, fullPage: false });
  if (width <= 390) {
    const open = page.getByRole('button', { name: 'Open journey' });
    await open.click();
    await page.getByRole('dialog', { name: 'World History journey' }).waitFor();
    if (!await page.getByText('Farming and Settlements').isVisible()) throw new Error(`${width}: mobile drawer lost the draft journey entry.`);
    await page.keyboard.press('Escape');
    if (!await open.evaluate((element) => element === document.activeElement)) throw new Error(`${width}: mobile drawer did not return focus.`);
  }
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'From Marks to Proto-Cuneiform', exact: true }).waitFor();
  await context.close();
}

const resumeContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
const resumePage = await resumeContext.newPage();
monitor(resumePage, 'resume');
await openWriting(resumePage);
await resumePage.getByRole('button', { name: 'Signs do not stand still' }).click();
await resumePage.waitForTimeout(1600);
await resumePage.reload({ waitUntil: 'networkidle' });
await resumePage.getByText(/Resume from Signs do not stand still/).waitFor();
await resumePage.screenshot({ path: `${output}/writing-1440x900-resume.png`, fullPage: false });
await resumeContext.close();

const flow = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
const page = await flow.newPage();
monitor(page, 'completion-flow');
await page.goto(`${base}/learn/lesson.uruk.first-city`, { waitUntil: 'networkidle' });
await page.getByRole('heading', { name: 'Uruk: Life in an Early City', exact: true }).waitFor();
await page.getByLabel('Administrative tablets and cylinder seals').check();
const urukAnswer = page.getByRole('textbox', { name: /Name one opportunity and one cost/ });
await urukAnswer.fill('Specialized work created opportunity, while unequal coordinated labor was a serious cost.');
await urukAnswer.blur();
await page.getByRole('button', { name: 'Complete lesson' }).click();
await page.getByText('Knowledge Card acquired').waitFor();
const next = page.getByRole('link', { name: /Continue World History/ });
if (await next.getAttribute('href') !== '/learn/lesson.writing.early-systems') throw new Error('Uruk continuation does not target writing.');
await next.click();
await page.getByRole('heading', { name: 'From Marks to Proto-Cuneiform', exact: true }).waitFor();
await page.getByLabel('A proto-cuneiform tablet recording quantities and goods').check();
const writingAnswer = page.getByRole('textbox', { name: /Explain one thing writing made possible/ });
await writingAnswer.fill('Writing made durable allocations possible, but surviving administrative tablets omit many voices.');
await writingAnswer.blur();
await page.getByRole('button', { name: 'Complete lesson' }).click();
await page.getByText('Knowledge Card acquired').waitFor();
await page.getByRole('heading', { name: 'Proto-Cuneiform Tablet' }).waitFor();
await page.screenshot({ path: `${output}/writing-1440x900-completion-card.png`, fullPage: false });
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: `${output}/writing-390x844-completion-card.png`, fullPage: false });
await page.reload({ waitUntil: 'networkidle' });
await page.getByText(/already in your Knowledge Cards/).waitFor();
if (await page.getByText('Knowledge Card acquired').count()) throw new Error('Completed revisit revealed the writing card again.');

await page.goto(`${base}/learn/lesson.farming.settlements`, { waitUntil: 'networkidle' });
await page.getByRole('heading', { name: /completable yet/i }).waitFor();
if (await page.getByRole('button', { name: 'Complete lesson' }).count()) throw new Error('Draft farming lesson exposed completion.');
await page.screenshot({ path: `${output}/farming-unpublished-390x844.png`, fullPage: false });
await page.goto(`${base}/learn/lesson.unknown`, { waitUntil: 'networkidle' });
await page.getByRole('heading', { name: /archive entry.*available/i }).waitFor();
await page.screenshot({ path: `${output}/invalid-lesson-390x844.png`, fullPage: false });
await flow.close();

await browser.close();
if (errors.length) throw new Error(`Browser errors:\n${errors.join('\n')}`);
console.log('ASH-57 visual verification passed: four viewports, light/dark, decoded media, direct route/refresh, mobile drawer, semantic resume, Uruk continuation, writing completion/card reveal/revisit, and invalid/unpublished states.');
