import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';
import { media } from '../../content/uruk';

type StoredObject = { bucket: string; objectKey: string; mimeType: string; sha256: string };
type Manifest = { assets: Array<{ source: StoredObject; locator: { bucket: string; variants: Array<Omit<StoredObject, 'bucket'>> } }> };

const root = process.cwd();
const verifyOnly = process.argv.includes('--verify-only');
const blockedAssets = media.filter((asset) => asset.reviewStatus !== 'approved');
if (!verifyOnly && blockedAssets.length > 0) {
  throw new Error(`Publication blocked: ${blockedAssets.map((asset) => asset.id).join(', ')} require provenance/rights approval.`);
}
const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Set SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY). Never expose the secret key to Vite.');

const manifest = JSON.parse(await readFile(resolve(root, 'media/manifests/uruk-release.json'), 'utf8')) as Manifest;
const objects: StoredObject[] = manifest.assets.flatMap((asset) => [
  asset.source,
  ...asset.locator.variants.map((variant) => ({ ...variant, bucket: asset.locator.bucket })),
]);
const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
const sha256 = (value: Uint8Array) => createHash('sha256').update(value).digest('hex');

for (const object of objects) {
  const storage = supabase.storage.from(object.bucket);
  const existing = await storage.download(object.objectKey);
  if (existing.data) {
    const digest = sha256(new Uint8Array(await existing.data.arrayBuffer()));
    if (digest !== object.sha256) throw new Error(`${object.bucket}/${object.objectKey} does not match its immutable manifest hash`);
    console.log(`verified ${object.bucket}/${object.objectKey}`);
    continue;
  }
  if (verifyOnly) throw new Error(`Missing remote media object ${object.bucket}/${object.objectKey}`);
  const stagedPath = resolve(root, 'tmp/chronos-media', object.bucket, ...object.objectKey.split('/'));
  const bytes = await readFile(stagedPath);
  if (sha256(bytes) !== object.sha256) throw new Error(`Staged media hash mismatch for ${object.bucket}/${object.objectKey}`);
  const uploaded = await storage.upload(object.objectKey, bytes, { cacheControl: '31536000', contentType: object.mimeType, upsert: false });
  if (uploaded.error) throw uploaded.error;
  console.log(`uploaded ${object.bucket}/${object.objectKey}`);
}
