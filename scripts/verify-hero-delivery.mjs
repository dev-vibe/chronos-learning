import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = process.cwd();
const base = 'http://127.0.0.1:4175';
const remoteBase = 'https://media.example.test/public';
const viteEntry = fileURLToPath(new URL('../../bin/vite.js', import.meta.resolve('vite')));
const environment = { ...process.env, VITE_MEDIA_PROVIDER: 'object-storage', VITE_MEDIA_BASE_URL: remoteBase };

function runVite(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [viteEntry, ...args], { cwd: root, env: environment, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    child.stdout.on('data', (chunk) => { output += chunk.toString(); });
    child.stderr.on('data', (chunk) => { output += chunk.toString(); });
    child.on('error', reject);
    child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`Vite ${args[0]} failed (${code}):\n${output}`)));
  });
}

await runVite(['build']);
const server = spawn(process.execPath, [viteEntry, 'preview', '--host', '127.0.0.1', '--port', '4175', '--strictPort'], { cwd: root, env: environment, stdio: ['ignore', 'pipe', 'pipe'] });
let serverError = '';
server.stderr.on('data', (chunk) => { serverError += chunk.toString(); });
let browser;
try {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try { if ((await fetch(base)).ok) break; }
    catch { /* preview is starting */ }
    if (attempt === 39) throw new Error(`Responsive hero preview did not start. ${serverError}`);
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const reconstructionRequests = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'image' && request.url().includes('/media.uruk.reconstruction/')) reconstructionRequests.push(request.url());
  });
  await page.route(`${remoteBase}/**`, (route) => route.fulfill({
    path: path.join(root, 'public/images/optimized/uruk/reconstruction.optimized.webp'),
    contentType: 'image/webp',
  }));
  await page.goto(`${base}/learn/lesson.uruk.first-city`, { waitUntil: 'networkidle' });
  const hero = page.locator('.hero-media');
  await hero.waitFor();
  await hero.evaluate(async (image) => { if (!image.complete) await new Promise((resolve) => image.addEventListener('load', resolve, { once: true })); await image.decode(); });
  if (await page.locator('.hero-probe').count()) throw new Error('Hidden hero probe still renders.');
  if (await page.locator('.hero-image').evaluate((element) => Boolean(element.style.backgroundImage))) throw new Error('Hero still loads a CSS background image.');
  const uniqueReconstructionRequests = [...new Set(reconstructionRequests)];
  if (uniqueReconstructionRequests.length !== 1 || !uniqueReconstructionRequests[0].includes('/480w-')) throw new Error(`Mobile selected an unexpected reconstruction derivative: ${reconstructionRequests.join(', ')}`);
  if (reconstructionRequests.some((url) => url.includes('/1600w-'))) throw new Error(`Mobile additionally requested the largest derivative: ${reconstructionRequests.join(', ')}`);
  await context.close();
  console.log('Responsive hero delivery passed: the visible hero selected only the 480w object-storage URL at 390px and never requested 1600w.');
} finally {
  await browser?.close();
  server.kill();
}
