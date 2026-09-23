// Reproducible modern-geography locator; never an ancient border reconstruction.
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const input = 'tmp/akkad-map';
const output = 'docs/research/assets/akkad/map';
await mkdir(output, { recursive: true });
const raster = `${input}/relief/HYP_50M_SR_W.tif`;
const riverFile = `${input}/rivers.geojson`;
const bounds = { west: 32, east: 52, south: 27, north: 42 };
const size = { width: 1600, height: 1200 };
const insetBounds = { west: -10, east: 75, south: -5, north: 55 };
const inset = { x: 40, y: 856, width: 370, height: 286 };
const crop = (b) => ({ left: Math.round((b.west + 180) * 30), top: Math.round((90 - b.north) * 30), width: Math.round((b.east - b.west) * 30), height: Math.round((b.north - b.south) * 30) });
const project = (lon, lat) => [(lon - bounds.west) / (bounds.east - bounds.west) * size.width, (bounds.north - lat) / (bounds.north - bounds.south) * size.height];
const insetProject = (lon, lat) => [inset.x + (lon - insetBounds.west) / (insetBounds.east - insetBounds.west) * inset.width, inset.y + (insetBounds.north - lat) / (insetBounds.north - insetBounds.south) * inset.height];
const hash = async (path) => createHash('sha256').update(await readFile(path)).digest('hex');
const text = (label, x, y, fontSize, anchor = 'middle', italic = false) => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Georgia,serif" font-style="${italic ? 'italic' : 'normal'}" font-size="${fontSize}" fill="#153e4a" stroke="#fcf4e3" stroke-width="6" paint-order="stroke">${label}</text>`;

const relief = await sharp(raster).extract(crop(bounds)).resize(size.width, size.height, { fit: 'fill' }).modulate({ saturation: 0.62, brightness: 1.08 }).png().toBuffer();
await writeFile(`${output}/akkad-relief-reference.png`, relief);
const insetRelief = await sharp(raster).extract(crop(insetBounds)).resize(inset.width, inset.height, { fit: 'fill' }).modulate({ saturation: 0.5, brightness: 1.08 }).png().toBuffer();
const rivers = JSON.parse(await readFile(riverFile, 'utf8'));
const riverNames = new Set(['Al Furat', 'Firat', 'Dicle', 'Euphrates', 'Tigris', 'Shatt al Arab']);
const selectedRivers = rivers.features.filter((feature) => riverNames.has(feature.properties.name));
if (!selectedRivers.some((feature) => feature.properties.name === 'Tigris') || !selectedRivers.some((feature) => feature.properties.name === 'Euphrates')) throw new Error('Missing reviewed river geometry');
const riverSvg = selectedRivers.flatMap((feature) => feature.geometry.type === 'MultiLineString' ? feature.geometry.coordinates : [feature.geometry.coordinates]).map((line) => line.map(([lon, lat], i) => `${i ? 'L' : 'M'}${project(lon, lat).map((n) => n.toFixed(2)).join(',')}`).join(' ')).join(' ');
await writeFile(`${output}/selected-rivers.json`, JSON.stringify({ source: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_50m_rivers_lake_centerlines.geojson', features: selectedRivers }, null, 2) + '\n');

const { sites } = JSON.parse(await readFile(`${output}/sites.json`, 'utf8'));
const points = Object.fromEntries(sites.map((site) => [site.name, project(site.longitude, site.latitude)]));
const marker = (site) => { const [x, y] = points[site.name]; return `<circle cx="${x}" cy="${y}" r="12" fill="#9e4b28" stroke="#fff8e8" stroke-width="5"/>`; };
const [boxX, boxY] = insetProject(bounds.west, bounds.north);
const boxWidth = (bounds.east - bounds.west) / (insetBounds.east - insetBounds.west) * inset.width;
const boxHeight = (bounds.north - bounds.south) / (insetBounds.north - insetBounds.south) * inset.height;
const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}"><defs><clipPath id="map"><rect width="${size.width}" height="${size.height}"/></clipPath></defs><g clip-path="url(#map)">
<rect width="${size.width}" height="${size.height}" fill="#f5e7c7" opacity="0.21"/>
<path d="${riverSvg}" fill="none" stroke="#e9dbc0" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${riverSvg}" fill="none" stroke="#3c8093" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
${text('Mediterranean Sea', 244, 566, 48, 'middle', true)}${text('Persian Gulf', 1392, 1075, 50, 'middle', true)}
${text('Euphrates', 626, 680, 48, 'middle', true)}${text('Tigris', 962, 640, 48, 'middle', true)}
${sites.map(marker).join('')}
<path d="M${points.Urkesh[0]},${points.Urkesh[1]} L590,314" fill="none" stroke="#9e4b28" stroke-width="3"/>${text('Urkesh', 578, 300, 52, 'end')}
<path d="M${points['Tell Leilan'][0]},${points['Tell Leilan'][1]} L800,465" fill="none" stroke="#9e4b28" stroke-width="3"/>${text('Tell Leilan', 816, 487, 52, 'start')}
${text('Uruk', points.Uruk[0] + 28, points.Uruk[1] + 18, 58, 'start')}
<rect x="${inset.x - 9}" y="${inset.y - 9}" width="${inset.width + 18}" height="${inset.height + 18}" rx="8" fill="#fff7e8" stroke="#d3b88a" stroke-width="3"/>
<image x="${inset.x}" y="${inset.y}" width="${inset.width}" height="${inset.height}" href="data:image/png;base64,${insetRelief.toString('base64')}"/>
<rect x="${boxX}" y="${boxY}" width="${boxWidth}" height="${boxHeight}" fill="#aa5d2c25" stroke="#9e4b28" stroke-width="4"/>${text('Africa', 151, 1095, 35)}${text('West Asia', 283, 917, 35)}
</g></svg>`;
await sharp(relief).composite([{ input: Buffer.from(overlay) }]).png().toFile(`${output}/akkad-geographic-reference.png`);
await writeFile(`${output}/reference-lineage.json`, JSON.stringify({
  method: 'deterministic illustrated edit of georeferenced Natural Earth relief, reviewed rivers and site points; modern orientation only',
  raster: { url: 'https://naturalearth.s3.amazonaws.com/50m_raster/HYP_50M_SR_W.zip', zipSha256: await hash(`${input}/HYP_50M_SR_W.zip`), tifSha256: await hash(raster), license: 'Public domain' },
  rivers: { url: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_50m_rivers_lake_centerlines.geojson', sha256: await hash(riverFile), names: [...riverNames], license: 'Public domain' },
  siteData: { path: `${output}/sites.json`, sha256: await hash(`${output}/sites.json`), points }, bounds, insetBounds, inset, size,
  projection: 'equirectangular; modern geography; no ancient political border, ancient shoreline or Agade point',
  approvedRasterLabels: ['Mediterranean Sea', 'Persian Gulf', 'Euphrates', 'Tigris', 'Urkesh', 'Tell Leilan', 'Uruk', 'Africa', 'West Asia'],
  outputSha256: await hash(`${output}/akkad-geographic-reference.png`),
}, null, 2) + '\n');
console.log(`${output}/akkad-geographic-reference.png`);
