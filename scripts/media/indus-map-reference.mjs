// Prepare a geographic edit target from Natural Earth's georeferenced relief.
// This script produces research inputs only, never the final illustrated map.
import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const input = 'tmp/indus-map-v2';
const output = 'docs/research/indus-map-assets/v2';
await mkdir(output, { recursive: true });
const raster = `${input}/relief/HYP_50M_SR_W.tif`;
const bounds = { west: 57, east: 96, south: 4, north: 38 };
const width = 1600;
const height = 1494;
const project = (lon, lat) => [(lon - 57) / 39 * width, (38 - lat) / 34 * height];
const crop = (b) => ({ left: Math.round((b.west + 180) * 30), top: Math.round((90 - b.north) * 30), width: Math.round((b.east - b.west) * 30), height: Math.round((b.north - b.south) * 30) });
const base = await sharp(raster).extract(crop(bounds)).resize(width, height, { fit: 'fill' }).png().toBuffer();
await writeFile(`${output}/south-asia-relief-source-crop.png`, base);
const insetBounds = { west: -25, east: 150, south: -40, north: 70 };
const inset = { x: 70, y: 1040, width: 560, height: 352 };
const insetImage = await sharp(raster).extract(crop(insetBounds)).resize(inset.width, inset.height, { fit: 'fill' }).png().toBuffer();
const insetProject = (lon, lat) => [inset.x + (lon + 25) / 175 * inset.width, inset.y + (70 - lat) / 110 * inset.height];
const sites = JSON.parse(await readFile('docs/research/indus-map-assets/indus-map-data.json', 'utf8')).sites;
const rivers = JSON.parse(await readFile(`${input}/rivers.geojson`, 'utf8'));
const indus = rivers.features.filter(f => f.properties.name === 'Indus');
await writeFile(`${output}/indus-river-data.json`, JSON.stringify({ source: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_50m_rivers_lake_centerlines.geojson', features: indus }, null, 2) + '\n');
const riverPath = indus.flatMap(f => f.geometry.type === 'MultiLineString' ? f.geometry.coordinates : [f.geometry.coordinates]).map(line => line.map(([lon, lat], i) => `${i ? 'L' : 'M'}${project(lon, lat).join(',')}`).join(' ')).join(' ');
const text = (label, x, y, size = 52, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Georgia,serif" font-size="${size}" fill="#123947" stroke="#fff9e8" stroke-width="6" paint-order="stroke">${label}</text>`;
const [boxX, boxY] = insetProject(bounds.west, bounds.north);
const labels = [
  { label: 'Pakistan', x: 290, y: 390, size: 58 },
  { label: 'India', x: 990, y: 850, size: 68 },
  { label: 'Himalayas', x: 1150, y: 390, size: 58 },
  { label: 'Indus', x: 370, y: 515, size: 45 },
  { label: 'Arabian Sea', x: 350, y: 845, size: 57 },
  { label: 'Bay of Bengal', x: 1280, y: 1130, size: 53 },
  { label: 'Indian Ocean', x: 1030, y: 1430, size: 58 },
];
const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><clipPath id="map"><rect width="${width}" height="${height}"/></clipPath></defs>
<g clip-path="url(#map)"><path d="${riverPath}" fill="none" stroke="#227494" stroke-width="5"/>
${labels.map(l => text(l.label, l.x, l.y, l.size)).join('')}
${sites.map(s => { const [x, y] = project(s.longitude, s.latitude); return `<circle cx="${x}" cy="${y}" r="12" fill="#b5522e" stroke="#fff9e8" stroke-width="5"/>${text(s.name, x + 27, y + 12, 55, 'start')}`; }).join('')}
<rect x="${inset.x - 6}" y="${inset.y - 6}" width="${inset.width + 12}" height="${inset.height + 12}" rx="7" fill="#fff9e8"/>
<image x="${inset.x}" y="${inset.y}" width="${inset.width}" height="${inset.height}" href="data:image/png;base64,${insetImage.toString('base64')}"/>
<rect x="${boxX}" y="${boxY}" width="${(bounds.east-bounds.west)/175*inset.width}" height="${(bounds.north-bounds.south)/110*inset.height}" fill="#d9862c22" stroke="#b5522e" stroke-width="5"/>
${text('Africa', 220, 1230, 44)}${text('Asia', 460, 1110, 44)}
</g></svg>`;
await sharp(base).composite([{input:Buffer.from(overlay)}]).png().toFile(`${output}/indus-geographic-edit-target.png`);
await copyFile(`${input}/south-asia-relief-crosscheck.png`, `${output}/south-asia-relief-crosscheck.png`);
const hash = async path => createHash('sha256').update(await readFile(path)).digest('hex');
await writeFile(`${output}/reference-lineage.json`, JSON.stringify({ method:'georeferenced source crop and coordinate overlays; no generative geography', raster:{url:'https://naturalearth.s3.amazonaws.com/50m_raster/HYP_50M_SR_W.zip', releaseLabel:'Website 3.2.0; downloaded VERSION.txt 2.0.0', sha256:await hash(raster), worldFile:'0.03333333333333,0,0,-0.03333333333333,-179.98333333333333,89.98333333333333', license:'Public domain'}, bounds, width, height, projection:'Equirectangular, approximate standard parallel 21° N', insetBounds, inset, sites, labels, riverSha256:await hash(`${input}/rivers.geojson`), referenceSha256:await hash(`${output}/indus-geographic-edit-target.png`) }, null, 2) + '\n');
console.log(`${output}/indus-geographic-edit-target.png`);
