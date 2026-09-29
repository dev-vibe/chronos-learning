import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, resolve } from 'node:path';
import process from 'node:process';

// Generate or edit an image with the OpenAI Images API. Needs OPENAI_API_KEY in the environment or in the gitignored repo-root .env.
// Output goes under tmp/chronos-media/generated/ (gitignored) with a provenance sidecar; review it,
// then move accepted art under public/ and register it with `npm run media:add`.

const usage = `npm run media:generate -- --prompt "..." [--ref a.png --ref b.png] [--mask m.png] [--tier reference|draft] [--size 1536x1024] [--quality auto|low|medium|high] [--transparent] [--out path.png]`;
const args = process.argv.slice(2);
const all = (flag: string) => args.flatMap((a, i) => (a === flag ? [args[i + 1]] : []));
const one = (flag: string) => all(flag)[0];

const prompt = one('--prompt');
const promptFile = one('--prompt-file');
const text = prompt ?? (promptFile ? await readFile(promptFile, 'utf8') : undefined);
if (!text?.trim()) throw new Error('Missing --prompt or --prompt-file.\n' + usage);
if (!process.env.OPENAI_API_KEY) {
  try { process.loadEnvFile('.env'); } catch { /* no .env file */ }
}
const key = process.env.OPENAI_API_KEY;
if (!key) throw new Error('OPENAI_API_KEY is not set. Put OPENAI_API_KEY=... in the gitignored .env file at the repo root, or export it in your shell.');

const tier = one('--tier') ?? 'reference';
if (tier !== 'reference' && tier !== 'draft') throw new Error('--tier must be reference or draft');
const model = tier === 'reference' ? (process.env.IMAGE_MODEL_REFERENCE ?? 'gpt-image-2.5-sunburst') : (process.env.IMAGE_MODEL_DRAFT ?? 'gpt-image-2.5-flare');
const size = one('--size') ?? 'auto';
const quality = one('--quality') ?? 'auto';
if (!['auto', '1024x1024', '1536x1024', '1024x1536'].includes(size)) throw new Error('Invalid --size');
if (!['auto', 'low', 'medium', 'high'].includes(quality)) throw new Error('Invalid --quality');
const transparent = args.includes('--transparent');
const refs = all('--ref');
const maskPath = one('--mask');
if (maskPath && !refs.length) throw new Error('--mask needs at least one --ref');
const base = (process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1').replace(/\/+$/, '');

const mimeFor = (path: string) => ({ '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' })[extname(path).toLowerCase()] ?? (() => { throw new Error('Unsupported image type: ' + path); })();
const blobFor = async (path: string) => new Blob([new Uint8Array(await readFile(path))], { type: mimeFor(path) });

let response: Response;
if (refs.length) {
  const form = new FormData();
  for (const [k, v] of Object.entries({ model, prompt: text, size, quality, n: '1', output_format: 'png' })) form.set(k, v);
  if (transparent) form.set('background', 'transparent');
  for (const ref of refs) form.append('image[]', await blobFor(ref), basename(ref));
  if (maskPath) form.set('mask', await blobFor(maskPath), basename(maskPath));
  response = await fetch(`${base}/images/edits`, { method: 'POST', headers: { Authorization: `Bearer ${key}` }, body: form });
} else {
  const body: Record<string, unknown> = { model, prompt: text, size, quality, n: 1, output_format: 'png' };
  if (transparent) body.background = 'transparent';
  response = await fetch(`${base}/images/generations`, { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}

const raw = await response.text();
let json: { data?: { b64_json?: string }[]; error?: { message?: string } } = {};
try { json = JSON.parse(raw); } catch { /* non-JSON error body */ }
if (!response.ok) throw new Error(`OpenAI Images API ${response.status}: ${json.error?.message ?? raw.slice(0, 300)}`);
const b64 = json.data?.[0]?.b64_json;
if (!b64) throw new Error('OpenAI Images API returned no image data.');

const stamp = new Date().toISOString();
const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'image';
const out = resolve(one('--out') ?? `tmp/chronos-media/generated/${stamp.replace(/[:.]/g, '-')}-${slug}.png`);
await mkdir(dirname(out), { recursive: true });
await writeFile(out, Buffer.from(b64, 'base64'));
await writeFile(out.replace(/\.png$/i, '') + '.json', JSON.stringify({ tool: 'OpenAI Images API', model, tier, date: stamp, size, quality, transparent, prompt: text, references: refs, mask: maskPath ?? null }, null, 2) + '\n');
console.log(out);
