import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';
import { media } from '../../content/chronos';
import { publishMedia, selectMedia, type Manifest, type StorageBoundary } from './publisher';

const root = process.cwd();
const args = process.argv.slice(2);
const verifyOnly = args.includes('--verify-only');
const sourcesOnly = args.includes('--sources-only');
const requestedIds = args.flatMap((arg, index) => arg === '--asset' && args[index + 1] ? [args[index + 1]] : []);
const mediaRecords = media.map((asset) => {
  if (!asset.id || !asset.reviewStatus) throw new Error('Media records require stable IDs and review status.');
  return { id: asset.id, reviewStatus: asset.reviewStatus };
});
selectMedia(mediaRecords, requestedIds, sourcesOnly, verifyOnly);

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Set SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY). Never expose the secret key to Vite.');

const manifest = JSON.parse(await readFile(resolve(root, 'media/manifests/chronos-release.json'), 'utf8')) as Manifest;
const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
const storage: StorageBoundary = {
  from(bucket) {
    const client = supabase.storage.from(bucket);
    return {
      download: (objectKey) => client.download(objectKey),
      upload: (objectKey, bytes, options) => client.upload(objectKey, bytes, options),
    };
  },
};

await publishMedia({
  media: mediaRecords,
  manifest,
  storage,
  requestedIds,
  sourcesOnly,
  verifyOnly,
  root,
  readBytes: readFile,
});
