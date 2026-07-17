import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, extname, relative, resolve } from 'node:path';
import process from 'node:process';
import sharp, { type WebpOptions } from 'sharp';
import { QUALITY_POLICY, createReference, selectCandidate, type EncodedCandidate } from './quality';

type CatalogAsset = {
  id: string;
  collection: string;
  sourcePath: string;
  fallbackPath: string;
  preset: WebpOptions['preset'];
  widths: number[];
};
type Catalog = { schemaVersion: 1; assets: CatalogAsset[] };
type BuiltVariant = {
  objectKey: string;
  mimeType: EncodedCandidate['mimeType'];
  bytes: number;
  sha256: string;
  width: number;
  height: number;
  compression: EncodedCandidate['compression'];
  fidelity: EncodedCandidate['fidelity'];
};

const root = process.cwd();
const stagingRoot = resolve(root, 'tmp/chronos-media');
const catalogPath = resolve(root, 'media/catalog.json');
const runtimeManifestPath = resolve(root, 'content/media/generated/chronos-media.json');
const releaseManifestPath = resolve(root, 'media/manifests/chronos-release.json');
const optimizedFallbackRoot = resolve(root, 'public/images/optimized');
const checkOnly = process.argv.includes('--check');
const browserExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const presets = new Set(['default', 'picture', 'photo', 'drawing', 'icon', 'text']);

const sha256 = (value: Uint8Array) => createHash('sha256').update(value).digest('hex');
const mimeTypeFor = (extension: string) => extension === '.jpg' || extension === '.jpeg' ? 'image/jpeg' as const : ('image/' + extension.slice(1)) as EncodedCandidate['mimeType'];
const normalizedExtension = (extension: string) => extension === '.jpeg' ? '.jpg' as const : extension as EncodedCandidate['extension'];

function assertInside(path: string, parent: string, purpose: string) {
  const pathFromParent = relative(parent, path);
  if (pathFromParent === '' || (!pathFromParent.startsWith('..') && !pathFromParent.startsWith('/') && !pathFromParent.startsWith('\\'))) return;
  throw new Error('Refusing to ' + purpose + ' outside ' + parent + ': ' + path);
}

function validateCatalog(value: unknown): Catalog {
  if (!value || typeof value !== 'object' || (value as Catalog).schemaVersion !== 1 || !Array.isArray((value as Catalog).assets)) {
    throw new Error('media/catalog.json must use schemaVersion 1 and contain an assets array');
  }
  const seen = new Set<string>();
  for (const asset of (value as Catalog).assets) {
    if (!/^[a-z]+(?:\.[a-z0-9-]+)+$/.test(asset.id)) throw new Error('Invalid media asset ID: ' + asset.id);
    if (seen.has(asset.id)) throw new Error('Duplicate media asset ID: ' + asset.id);
    seen.add(asset.id);
    if (!/^[a-z0-9][a-z0-9-]*$/.test(asset.collection)) throw new Error(asset.id + ' has an invalid collection');
    if (!asset.sourcePath.startsWith('public/') || asset.sourcePath.includes('..')) throw new Error(asset.id + ' sourcePath must be a safe public/ path');
    if (!asset.fallbackPath.startsWith('/images/optimized/') || asset.fallbackPath.includes('..')) throw new Error(asset.id + ' fallbackPath must be under /images/optimized/');
    if (!presets.has(asset.preset ?? 'default')) throw new Error(asset.id + ' has an unsupported WebP preset');
    if (!Array.isArray(asset.widths) || asset.widths.length === 0 || asset.widths.some((width) => !Number.isInteger(width) || width <= 0)) throw new Error(asset.id + ' must declare positive integer widths');
  }
  return value as Catalog;
}

async function stage(bucket: string, objectKey: string, bytes: Uint8Array) {
  const outputPath = resolve(stagingRoot, bucket, ...objectKey.split('/'));
  assertInside(outputPath, stagingRoot, 'stage media');
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, bytes);
}

async function commitOrCheckFallback(path: string, bytes: Buffer) {
  const outputPath = resolve(root, 'public', path.slice(1));
  assertInside(outputPath, optimizedFallbackRoot, 'write optimized fallback');
  if (checkOnly) {
    const committed = await readFile(outputPath).catch(() => Buffer.alloc(0));
    if (!committed.equals(bytes)) throw new Error('Optimized fallback is stale: ' + path + '. Run npm run media:build.');
    return;
  }
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, bytes);
}

const catalog = validateCatalog(JSON.parse(await readFile(catalogPath, 'utf8')));
assertInside(stagingRoot, resolve(root, 'tmp'), 'clean media staging');
await rm(stagingRoot, { recursive: true, force: true });

const manifestAssets = [];
for (const asset of catalog.assets) {
  const sourcePath = resolve(root, asset.sourcePath);
  assertInside(sourcePath, resolve(root, 'public'), 'read media source');
  const sourceBytes = await readFile(sourcePath);
  const sourceHash = sha256(sourceBytes);
  const sourceExtension = normalizedExtension(extname(sourcePath).toLowerCase());
  if (!browserExtensions.has(sourceExtension)) throw new Error(asset.id + ' uses unsupported source extension ' + sourceExtension);
  const metadata = await sharp(sourceBytes).metadata();
  if (!metadata.width || !metadata.height) throw new Error(asset.id + ' has no readable dimensions');

  const targetWidths = [...new Set(asset.widths.filter((width) => width <= metadata.width))].sort((left, right) => left - right);
  if (!targetWidths.includes(metadata.width)) targetWidths.push(metadata.width);
  const built: Array<{ variant: BuiltVariant; candidate: EncodedCandidate }> = [];
  for (const width of targetWidths) {
    const reference = await createReference(sourceBytes, width);
    const passthrough = width === metadata.width
      ? { bytes: sourceBytes, extension: sourceExtension, mimeType: mimeTypeFor(sourceExtension) }
      : undefined;
    const candidate = await selectCandidate(reference, asset.preset ?? 'default', passthrough);
    const variantHash = sha256(candidate.bytes);
    const encoding = candidate.compression.encoder === 'source-passthrough'
      ? 'source-' + candidate.compression.codec
      : candidate.compression.encoder === 'webp-lossless'
        ? 'webp-lossless'
        : 'webp-q' + candidate.compression.quality;
    const objectKey = asset.collection + '/' + asset.id + '/' + sourceHash.slice(0, 16) + '/optimized/' + QUALITY_POLICY.profile + '/' + reference.width + 'w-' + encoding + '-' + variantHash.slice(0, 16) + candidate.extension;
    await stage('media-public', objectKey, candidate.bytes);
    const variant: BuiltVariant = {
      objectKey,
      mimeType: candidate.mimeType,
      bytes: candidate.bytes.byteLength,
      sha256: variantHash,
      width: reference.width,
      height: reference.height,
      compression: candidate.compression,
      fidelity: candidate.fidelity,
    };
    built.push({ variant, candidate });
    const fidelity = candidate.fidelity.mode === 'pixel-exact' ? 'pixel-exact' : 'PSNR ' + candidate.fidelity.psnrDb + ' dB, MAE ' + candidate.fidelity.meanAbsoluteError;
    console.log(asset.id + ' ' + reference.width + 'w: ' + candidate.bytes.byteLength + ' bytes, ' + encoding + ', ' + fidelity);
  }

  const publishableBuilt = built.filter((entry, index, all) => index === all.length - 1 || entry.variant.bytes < Math.min(...all.slice(index + 1).map((candidate) => candidate.variant.bytes)));
  const fallback = publishableBuilt.at(-1);
  if (!fallback) throw new Error(asset.id + ' produced no variants');
  if (extname(asset.fallbackPath).toLowerCase() !== fallback.candidate.extension) {
    throw new Error(asset.id + ' fallback extension must be ' + fallback.candidate.extension + ' for the selected candidate');
  }
  await commitOrCheckFallback(asset.fallbackPath, fallback.candidate.bytes);

  const sourceObjectKey = asset.collection + '/' + asset.id + '/' + sourceHash + '/original' + sourceExtension;
  await stage('media-source', sourceObjectKey, sourceBytes);
  manifestAssets.push({
    id: asset.id,
    locator: {
      provider: 'object-storage' as const,
      bucket: 'media-public',
      fallback: { path: asset.fallbackPath, width: fallback.variant.width, height: fallback.variant.height },
      variants: publishableBuilt.map(({ variant }) => variant),
    },
    source: {
      bucket: 'media-source',
      objectKey: sourceObjectKey,
      mimeType: mimeTypeFor(sourceExtension),
      bytes: sourceBytes.byteLength,
      sha256: sourceHash,
      width: metadata.width,
      height: metadata.height,
    },
  });
}

const generatedBy = 'npm run media:build';
const qualityPolicy = {
  profile: QUALITY_POLICY.profile,
  minimumPsnrDb: QUALITY_POLICY.minimumPsnrDb,
  maximumMeanAbsoluteError: QUALITY_POLICY.maximumMeanAbsoluteError,
  maximumChannelDelta: QUALITY_POLICY.maximumChannelDelta,
  maximumVariantBytes: QUALITY_POLICY.maximumVariantBytes,
  minimumSavingsRatioForLossyReencode: QUALITY_POLICY.minimumSavingsRatioForLossyReencode,
};
const runtimeManifest = { schemaVersion: 1, collection: 'chronos', generatedBy, qualityPolicy, assets: manifestAssets.map(({ id, locator }) => ({ id, locator })) };
const releaseManifest = { schemaVersion: 1, collection: 'chronos', generatedBy, qualityPolicy, assets: manifestAssets };
const renderedRuntime = JSON.stringify(runtimeManifest, null, 2) + '\n';
const renderedRelease = JSON.stringify(releaseManifest, null, 2) + '\n';
if (checkOnly) {
  const committedRuntime = await readFile(runtimeManifestPath, 'utf8').catch(() => '');
  const committedRelease = await readFile(releaseManifestPath, 'utf8').catch(() => '');
  if (committedRuntime !== renderedRuntime || committedRelease !== renderedRelease) throw new Error('Media manifests are stale. Run npm run media:build and commit the result.');
  console.log('Verified ' + manifestAssets.length + ' assets and ' + manifestAssets.reduce((sum, asset) => sum + asset.locator.variants.length, 0) + ' derivatives.');
} else {
  await mkdir(dirname(runtimeManifestPath), { recursive: true });
  await mkdir(dirname(releaseManifestPath), { recursive: true });
  await writeFile(runtimeManifestPath, renderedRuntime);
  await writeFile(releaseManifestPath, renderedRelease);
  console.log('Built ' + manifestAssets.length + ' assets in ' + stagingRoot + '.');
}
