import { readFile, writeFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

type CatalogAsset = { id: string; collection: string; sourcePath: string; fallbackPath: string; preset: string; widths: number[] };
type Catalog = { schemaVersion: 1; assets: CatalogAsset[] };

const root = process.cwd();
const catalogPath = resolve(root, 'media/catalog.json');
const args = process.argv.slice(2);
const valueFor = (flag: string) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
const usage = 'npm run media:add -- --id media.<collection>.<name> --source public/images/... --collection <slug> --fallback /images/optimized/<collection>/<name>.optimized.webp --preset photo --widths 480,960,1600';
const id = valueFor('--id');
const sourceArgument = valueFor('--source');
const collection = valueFor('--collection');
const fallbackPath = valueFor('--fallback');
const preset = valueFor('--preset') ?? 'picture';
const widths = (valueFor('--widths') ?? '480,960,1600').split(',').map(Number);
if (!id || !sourceArgument || !collection || !fallbackPath) throw new Error('Missing required argument.\n' + usage);
if (!/^[a-z]+(?:\.[a-z0-9-]+)+$/.test(id)) throw new Error('Invalid stable media ID: ' + id);
if (!/^[a-z0-9][a-z0-9-]*$/.test(collection)) throw new Error('Invalid collection: ' + collection);
if (!['default', 'picture', 'photo', 'drawing', 'icon', 'text'].includes(preset)) throw new Error('Invalid preset: ' + preset);
if (!fallbackPath.startsWith('/images/optimized/') || fallbackPath.includes('..')) throw new Error('Fallback must be under /images/optimized/');
if (widths.some((width) => !Number.isInteger(width) || width <= 0)) throw new Error('Widths must be comma-separated positive integers');

const sourcePath = resolve(root, sourceArgument);
const sourceRelative = relative(root, sourcePath).replaceAll('\\', '/');
if (!sourceRelative.startsWith('public/') || sourceRelative.includes('..')) throw new Error('Source must be a safe path under public/');
const metadata = await sharp(await readFile(sourcePath)).metadata();
if (!metadata.width || !metadata.height || !metadata.format) throw new Error('Source is not a readable image');

const catalog = JSON.parse(await readFile(catalogPath, 'utf8')) as Catalog;
if (catalog.assets.some((asset) => asset.id === id)) throw new Error('Catalog already contains ' + id);
catalog.assets.push({ id, collection, sourcePath: sourceRelative, fallbackPath, preset, widths: [...new Set(widths)].sort((left, right) => left - right) });
catalog.assets.sort((left, right) => left.id.localeCompare(right.id));
await writeFile(catalogPath, JSON.stringify(catalog, null, 2) + '\n');
console.log('Added ' + id + ': ' + metadata.width + 'x' + metadata.height + ' ' + metadata.format);
console.log('Next: record provenance/review metadata in content, then run npm run media:build && npm run media:verify.');
