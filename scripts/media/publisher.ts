import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

export type StoredObject = { bucket: string; objectKey: string; mimeType: string; sha256: string };
export type ManifestAsset = { id: string; source: StoredObject; locator: { bucket: string; variants: Array<Omit<StoredObject, 'bucket'>> } };
export type Manifest = { assets: ManifestAsset[] };
export type MediaRecord = { id: string; reviewStatus: string };
export type StorageError = { statusCode?: number | string; message?: string; originalError?: unknown };
export type StorageDownload = { data: { arrayBuffer(): Promise<ArrayBuffer> } | null; error: StorageError | null };
export type UploadOptions = { cacheControl: string; contentType: string; upsert: false };
export interface StorageBucket {
  download(objectKey: string): Promise<StorageDownload>;
  upload(objectKey: string, bytes: Uint8Array, options: UploadOptions): Promise<{ error: unknown | null }>;
}
export interface StorageBoundary { from(bucket: string): StorageBucket }

export type PublishMediaOptions = {
  media: readonly MediaRecord[];
  manifest: Manifest;
  storage: StorageBoundary;
  requestedIds?: readonly string[];
  sourcesOnly?: boolean;
  verifyOnly?: boolean;
  root?: string;
  readBytes(path: string): Promise<Uint8Array>;
  log?: (message: string) => void;
};

const sha256 = (value: Uint8Array) => createHash('sha256').update(value).digest('hex');

async function isMissingObject(error: StorageError): Promise<boolean> {
  if (String(error.statusCode) === '404') return true;
  // Binary downloads can wrap the API response instead of parsing its error body.
  const response = error.originalError;
  if (!(response instanceof Response) || ![400, 404].includes(response.status)) return false;
  try {
    const body = await response.clone().json() as { statusCode?: string; code?: string };
    return String(body.statusCode) === '404' && body.code === 'NoSuchKey';
  } catch {
    return false;
  }
}

export function selectMedia(media: readonly MediaRecord[], requestedIds: readonly string[], sourcesOnly: boolean, verifyOnly: boolean) {
  const selected = requestedIds.length === 0 ? [...media] : media.filter((asset) => requestedIds.includes(asset.id));
  const missingIds = requestedIds.filter((id) => !selected.some((asset) => asset.id === id));
  if (missingIds.length > 0) throw new Error('Unknown media asset IDs: ' + missingIds.join(', '));
  if (!sourcesOnly && !verifyOnly) {
    const blockedAssets = selected.filter((asset) => asset.reviewStatus !== 'approved');
    if (blockedAssets.length > 0) throw new Error('Publication blocked: ' + blockedAssets.map((asset) => asset.id).join(', ') + ' require provenance/rights approval.');
  }
  return selected;
}

export async function publishMedia({
  media,
  manifest,
  storage,
  requestedIds = [],
  sourcesOnly = false,
  verifyOnly = false,
  root = process.cwd(),
  readBytes,
  log = console.log,
}: PublishMediaOptions) {
  const selectedMedia = selectMedia(media, requestedIds, sourcesOnly, verifyOnly);
  const selectedManifest = manifest.assets.filter((asset) => selectedMedia.some((record) => record.id === asset.id));
  const missingManifestIds = selectedMedia.filter((record) => !selectedManifest.some((asset) => asset.id === record.id)).map((record) => record.id);
  if (missingManifestIds.length > 0) throw new Error('Missing media manifest entries: ' + missingManifestIds.join(', '));
  const objects: StoredObject[] = selectedManifest.flatMap((asset) => sourcesOnly
    ? [asset.source]
    : [asset.source, ...asset.locator.variants.map((variant) => ({ ...variant, bucket: asset.locator.bucket }))]);

  for (const object of objects) {
    const bucket = storage.from(object.bucket);
    const existing = await bucket.download(object.objectKey);
    if (existing.data) {
      const digest = sha256(new Uint8Array(await existing.data.arrayBuffer()));
      if (digest !== object.sha256) throw new Error(object.bucket + '/' + object.objectKey + ' does not match its immutable manifest hash');
      log('verified ' + object.bucket + '/' + object.objectKey);
      continue;
    }
    if (existing.error && !await isMissingObject(existing.error)) throw existing.error;
    if (verifyOnly) throw new Error('Missing remote media object ' + object.bucket + '/' + object.objectKey);
    const stagedPath = resolve(root, 'tmp/chronos-media', object.bucket, ...object.objectKey.split('/'));
    const bytes = await readBytes(stagedPath);
    if (sha256(bytes) !== object.sha256) throw new Error('Staged media hash mismatch for ' + object.bucket + '/' + object.objectKey);
    const uploaded = await bucket.upload(object.objectKey, bytes, {
      cacheControl: object.bucket === 'media-public' ? '31536000' : '3600',
      contentType: object.mimeType,
      upsert: false,
    });
    if (uploaded.error) throw uploaded.error;
    log('uploaded ' + object.bucket + '/' + object.objectKey);
  }
}
