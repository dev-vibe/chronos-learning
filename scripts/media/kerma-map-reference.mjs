// Research input for the illustrated locator, not a substitute final map.
// Geography is cropped from Natural Earth's georeferenced public-domain raster.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const input = process.argv[2] ?? 'tmp/kerma-map';
const output = 'docs/research/assets/kerma/map';
await mkdir(output, { recursive: true });
const raster = `${input}/relief/HYP_50M_SR_W.tif`;
const bounds = { west: 15, east: 45, south: 9, north: 34 };
const width = 1600;
const height = 1430;
const project = (lon, lat) => [(lon - bounds.west) / (bounds.east - bounds.west) * width, (bounds.north - lat) / (bounds.north - bounds.south) * height];
const crop = (b) => ({ left: Math.round((b.west + 180) * 30), top: Math.round((90 - b.north) * 30), width: Math.round((b.east - b.west) * 30), height: Math.round((b.north - b.south) * 30) });
const base = await sharp(raster).extract(crop(bounds)).resize(width, height, { fit: 'fill' }).png().toBuffer();
await writeFile(`${output}/northeast-africa-relief-crop.png`, base);
const insetBounds = { west: -20, east: 55, south: -36, north: 38 };
const inset = { x: 45, y: 865, width: 535, height: 528 };
const insetProject = (lon, lat) => [inset.x + (lon - insetBounds.west) / (insetBounds.east - insetBounds.west) * inset.width, inset.y + (insetBounds.north - lat) / (insetBounds.north - insetBounds.south) * inset.height];
const insetImage = await sharp(raster).extract(crop(insetBounds)).resize(inset.width, inset.height, { fit: 'fill' }).png().toBuffer();
await writeFile(`${output}/africa-relief-inset.png`, insetImage);
const site = JSON.parse(await readFile('docs/research/assets/kerma/map/site.json', 'utf8'));
const rivers = JSON.parse(await readFile(`${input}/rivers.geojson`, 'utf8'));
const reviewedNileNames = new Set(['Nile', 'El Bahr el Abyad', 'El Bahr el Azraq', 'Rosetta Branch', 'Damietta Branch']);
const selectedRivers = rivers.features.filter((f) => reviewedNileNames.has(f.properties.name));
if (!selectedRivers.some((f) => f.properties.name === 'Nile')) throw new Error('Reviewed Nile source geometry is missing');
const riverPath = selectedRivers.flatMap((f) => f.geometry.type === 'MultiLineString' ? f.geometry.coordinates : [f.geometry.coordinates])
  .map((line) => line.map(([lon, lat], i) => `${i ? 'L' : 'M'}${project(lon, lat).join(',')}`).join(' ')).join(' ');
await writeFile(`${output}/nile-river-data.json`, JSON.stringify({ source: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_50m_rivers_lake_centerlines.geojson', features: selectedRivers }, null, 2) + '\n');
const text = (label, x, y, size = 62, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Georgia,serif" font-size="${size}" fill="#123947" stroke="#fff9e8" stroke-width="6" paint-order="stroke">${label}</text>`;
const labels = [
  { label: 'Mediterranean Sea', x: 800, y: 88, size: 68 },
  { label: 'Egypt', x: 610, y: 325, size: 78 },
  { label: 'Nile', x: 840, y: 535, size: 65 },
  { label: 'Sudan', x: 755, y: 1080, size: 78 },
];
const [x, y] = project(site.longitude, site.latitude);
const [boxX, boxY] = insetProject(bounds.west, bounds.north);
const boxWidth = (bounds.east - bounds.west) / (insetBounds.east - insetBounds.west) * inset.width;
const boxHeight = (bounds.north - bounds.south) / (insetBounds.north - insetBounds.south) * inset.height;
const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
<defs><clipPath id="map"><rect width="${width}" height="${height}"/></clipPath></defs>
<g clip-path="url(#map)"><path d="${riverPath}" fill="none" stroke="#227494" stroke-width="5"/>
${labels.map((l) => text(l.label, l.x, l.y, l.size)).join('')}
<circle cx="${x}" cy="${y}" r="14" fill="#b5522e" stroke="#fff9e8" stroke-width="5"/>${text('Kerma', x + 30, y + 18, 78, 'start')}
<rect x="${inset.x - 8}" y="${inset.y - 8}" width="${inset.width + 16}" height="${inset.height + 16}" rx="5" fill="#fff9e8"/>
<image x="${inset.x}" y="${inset.y}" width="${inset.width}" height="${inset.height}" href="data:image/png;base64,${insetImage.toString('base64')}"/>
<rect x="${boxX}" y="${boxY}" width="${boxWidth}" height="${boxHeight}" fill="#d9862c18" stroke="#b5522e" stroke-width="5"/>
${text('Africa', inset.x + 205, inset.y + 270, 65)}
</g></svg>`;
await sharp(base).composite([{ input: Buffer.from(overlay) }]).png().toFile(`${output}/kerma-geographic-edit-target.png`);
const hash = async (path) => createHash('sha256').update(await readFile(path)).digest('hex');
await writeFile(`${output}/reference-lineage.json`, JSON.stringify({
  method: 'georeferenced public-domain raster crop and reviewed river/site overlays; geographic reference, not final illustrated asset',
  raster: { url: 'https://naturalearth.s3.amazonaws.com/50m_raster/HYP_50M_SR_W.zip', sha256: await hash(raster), worldFile: '0.03333333333333,0,0,-0.03333333333333,-179.98333333333333,89.98333333333333', license: 'Public domain' },
  bounds, width, height, projection: 'Equirectangular; main-map aspect approximates standard parallel 21.5 degrees N', insetBounds, inset,
  site, markerPixels: { x, y }, insetExtentPixels: { x: boxX, y: boxY, width: boxWidth, height: boxHeight }, labels,
  riverSourceSha256: await hash(`${input}/rivers.geojson`), referenceSha256: await hash(`${output}/kerma-geographic-edit-target.png`),
}, null, 2) + '\n');
console.log(`${output}/kerma-geographic-edit-target.png`);
