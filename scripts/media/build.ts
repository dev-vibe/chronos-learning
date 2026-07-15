import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const root = process.cwd();
const stagingRoot = resolve(root, 'tmp/chronos-media');
const manifestPath = resolve(root, 'content/media/generated/uruk-media.json');
const releaseManifestPath = resolve(root, 'media/manifests/uruk-release.json');
const checkOnly = process.argv.includes('--check');
const widths = [480, 960, 1600];

const assets = [
  { id: 'media.uruk.reconstruction', path: '/images/places/uruk-reconstruction.webp' },
  { id: 'media.uruk.site', path: '/images/places/uruk-site-evidence.jpg' },
  { id: 'media.uruk.clay-envelope', path: '/images/inventions/clay_envelope.jpg' },
  { id: 'media.uruk.southern-mesopotamia-map', path: '/images/maps/uruk-southern-mesopotamia-map.webp' },
] as const;

const sha256 = (value: Uint8Array) => createHash('sha256').update(value).digest('hex');
const mimeTypeFor = (extension: string) => extension === '.jpg' || extension === '.jpeg' ? 'image/jpeg' : `image/${extension.slice(1)}`;

function assertStagingPath(path: string) {
  if (path !== stagingRoot && !path.startsWith(`${stagingRoot}\\`) && !path.startsWith(`${stagingRoot}/`)) {
    throw new Error(`Refusing to write outside media staging: ${path}`);
  }
}

async function stage(bucket: string, objectKey: string, bytes: Uint8Array) {
  const outputPath = resolve(stagingRoot, bucket, ...objectKey.split('/'));
  assertStagingPath(outputPath);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, bytes);
}

assertStagingPath(stagingRoot);
await rm(stagingRoot, { recursive: true, force: true });

const manifestAssets = [];
for (const asset of assets) {
  const sourcePath = resolve(root, 'public', asset.path.slice(1));
  const sourceBytes = await readFile(sourcePath);
  const sourceHash = sha256(sourceBytes);
  const extension = extname(sourcePath).toLowerCase();
  const metadata = await sharp(sourceBytes).metadata();
  if (!metadata.width || !metadata.height) throw new Error(`${asset.id} has no readable dimensions`);

  const targetWidths = widths.filter((width) => width <= metadata.width);
  if (targetWidths.length === 0) targetWidths.push(metadata.width);
  const variants = [];
  for (const width of targetWidths) {
    const bytes = await sharp(sourceBytes)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4, smartSubsample: true })
      .toBuffer();
    const variantMetadata = await sharp(bytes).metadata();
    if (!variantMetadata.width || !variantMetadata.height) throw new Error(`${asset.id} derivative has no readable dimensions`);
    const variantHash = sha256(bytes);
    const objectKey = `uruk/${asset.id}/${sourceHash.slice(0, 16)}/${variantMetadata.width}w-${variantHash.slice(0, 16)}.webp`;
    await stage('media-public', objectKey, bytes);
    variants.push({ objectKey, mimeType: 'image/webp', bytes: bytes.byteLength, sha256: variantHash, width: variantMetadata.width, height: variantMetadata.height });
  }

  const sourceObjectKey = `uruk/${asset.id}/${sourceHash}/original${extension}`;
  await stage('media-source', sourceObjectKey, sourceBytes);
  manifestAssets.push({
    id: asset.id,
    locator: {
      provider: 'object-storage',
      bucket: 'media-public',
      fallback: { path: asset.path, width: metadata.width, height: metadata.height },
      variants,
    },
    source: {
      bucket: 'media-source',
      objectKey: sourceObjectKey,
      mimeType: mimeTypeFor(extension),
      bytes: sourceBytes.byteLength,
      sha256: sourceHash,
      width: metadata.width,
      height: metadata.height,
    },
  });
}

const runtimeManifest = { schemaVersion: 1, collection: 'uruk', generatedBy: 'npm run media:build', assets: manifestAssets.map(({ id, locator }) => ({ id, locator })) };
const releaseManifest = { schemaVersion: 1, collection: 'uruk', generatedBy: 'npm run media:build', assets: manifestAssets };
const renderedRuntime = `${JSON.stringify(runtimeManifest, null, 2)}\n`;
const renderedRelease = `${JSON.stringify(releaseManifest, null, 2)}\n`;
if (checkOnly) {
  const committedRuntime = await readFile(manifestPath, 'utf8').catch(() => '');
  const committedRelease = await readFile(releaseManifestPath, 'utf8').catch(() => '');
  if (committedRuntime !== renderedRuntime || committedRelease !== renderedRelease) throw new Error('Uruk media manifests are stale. Run npm run media:build and commit the result.');
  console.log(`Verified ${manifestAssets.length} Uruk assets and ${manifestAssets.reduce((sum, asset) => sum + asset.locator.variants.length, 0)} derivatives.`);
} else {
  await mkdir(dirname(manifestPath), { recursive: true });
  await mkdir(dirname(releaseManifestPath), { recursive: true });
  await writeFile(manifestPath, renderedRuntime);
  await writeFile(releaseManifestPath, renderedRelease);
  console.log(`Built ${manifestAssets.length} Uruk assets in ${stagingRoot}.`);
}
