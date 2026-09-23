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
const text = (label, x, y, fontSize, anchor = 'middle', italic = false) => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Georgia,serif" font-style="${italic ? 'italic' : 'normal'}" font-size="${fontSize}" fill="#173e4b" stroke="#fff4d7" stroke-width="7" stroke-linejoin="round" paint-order="stroke">${label}</text>`;

// Change the palette pixel-by-pixel, not the geography. Natural Earth's blue-vs-red
// chroma distinguishes its water from land; source luminance preserves its relief.
const colorize = async (png) => {
  const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const colored = Buffer.allocUnsafe(info.width * info.height * 3);
  const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 3;
    const red = data[i], green = data[i + 1], blue = data[i + 2];
    const light = red * 0.3 + green * 0.59 + blue * 0.11;
    const water = Math.max(0, Math.min(1, (blue - red - 4) / 24));
    const grain = ((((x * 374761393 + y * 668265263) ^ (x * 1274126177)) >>> 0) % 11 - 5) * 0.36;
    const shade = (light - 178) * 0.63;
    const land = [217 + shade + grain, 180 + shade * 0.86 + grain, 119 + shade * 0.72 + grain];
    const seaShade = (light - 214) * 0.45;
    const sea = [89 + seaShade + grain, 151 + seaShade + grain, 177 + seaShade + grain];
    for (let c = 0; c < 3; c++) colored[i + c] = clamp(land[c] * (1 - water) + sea[c] * water);
  }
  return sharp(colored, { raw: { width: info.width, height: info.height, channels: 3 } }).png().toBuffer();
};

const sourceRelief = await sharp(raster).extract(crop(bounds)).resize(size.width, size.height, { fit: 'fill' }).png().toBuffer();
await writeFile(`${output}/akkad-relief-reference.png`, sourceRelief);
const relief = await colorize(sourceRelief);
await writeFile(`${output}/akkad-atlas-base.png`, relief);
const insetRelief = await colorize(await sharp(raster).extract(crop(insetBounds)).resize(inset.width, inset.height, { fit: 'fill' }).png().toBuffer());
const rivers = JSON.parse(await readFile(riverFile, 'utf8'));
const riverNames = new Set(['Al Furat', 'Firat', 'Dicle', 'Euphrates', 'Tigris', 'Shatt al Arab']);
const selectedRivers = rivers.features.filter((feature) => riverNames.has(feature.properties.name));
if (!selectedRivers.some((feature) => feature.properties.name === 'Tigris') || !selectedRivers.some((feature) => feature.properties.name === 'Euphrates')) throw new Error('Missing reviewed river geometry');
const riverSvg = selectedRivers.flatMap((feature) => feature.geometry.type === 'MultiLineString' ? feature.geometry.coordinates : [feature.geometry.coordinates]).map((line) => line.map(([lon, lat], i) => `${i ? 'L' : 'M'}${project(lon, lat).map((n) => n.toFixed(2)).join(',')}`).join(' ')).join(' ');
await writeFile(`${output}/selected-rivers.json`, JSON.stringify({ source: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_50m_rivers_lake_centerlines.geojson', features: selectedRivers }, null, 2) + '\n');

const { sites } = JSON.parse(await readFile(`${output}/sites.json`, 'utf8'));
const points = Object.fromEntries(sites.map((site) => [site.name, project(site.longitude, site.latitude)]));
const marker = (site) => { const [x, y] = points[site.name]; return `<circle cx="${x}" cy="${y}" r="20" fill="#fff0ca" opacity="0.85"/><circle cx="${x}" cy="${y}" r="12" fill="#a53f27" stroke="#fff9e7" stroke-width="4"/>`; };
const [boxX, boxY] = insetProject(bounds.west, bounds.north);
const boxWidth = (bounds.east - bounds.west) / (insetBounds.east - insetBounds.west) * inset.width;
const boxHeight = (bounds.north - bounds.south) / (insetBounds.north - insetBounds.south) * inset.height;
const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}"><defs><clipPath id="map"><rect width="${size.width}" height="${size.height}"/></clipPath></defs><g clip-path="url(#map)">
<path d="${riverSvg}" fill="none" stroke="#fff0c7" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${riverSvg}" fill="none" stroke="#217f9e" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
${text('Mediterranean Sea', 244, 566, 48, 'middle', true)}${text('Persian Gulf', 1392, 1075, 50, 'middle', true)}
${text('Euphrates', 626, 680, 48, 'middle', true)}${text('Tigris', 962, 640, 48, 'middle', true)}
${sites.map(marker).join('')}
<path d="M${points.Urkesh[0]},${points.Urkesh[1]} L590,314" fill="none" stroke="#8d3d2b" stroke-width="4"/>${text('Urkesh', 578, 300, 52, 'end')}
<path d="M${points['Tell Leilan'][0]},${points['Tell Leilan'][1]} L800,465" fill="none" stroke="#8d3d2b" stroke-width="4"/>${text('Tell Leilan', 816, 487, 52, 'start')}
${text('Uruk', points.Uruk[0] + 28, points.Uruk[1] + 18, 58, 'start')}
<rect x="${inset.x - 9}" y="${inset.y - 9}" width="${inset.width + 18}" height="${inset.height + 18}" rx="8" fill="#fff2d1" stroke="#93572f" stroke-width="4"/>
<image x="${inset.x}" y="${inset.y}" width="${inset.width}" height="${inset.height}" href="data:image/png;base64,${insetRelief.toString('base64')}"/>
<rect x="${boxX}" y="${boxY}" width="${boxWidth}" height="${boxHeight}" fill="#aa5d2c25" stroke="#9e4b28" stroke-width="4"/>${text('Africa', 151, 1095, 35)}${text('West Asia', 283, 917, 35)}
</g></svg>`;
await sharp(relief).composite([{ input: Buffer.from(overlay) }]).png().toFile(`${output}/akkad-geographic-reference.png`);
await writeFile(`${output}/reference-lineage.json`, JSON.stringify({
  method: 'deterministic pixel palette edit of georeferenced Natural Earth relief, then reviewed river and site overlays; modern orientation only',
  raster: { url: 'https://naturalearth.s3.amazonaws.com/50m_raster/HYP_50M_SR_W.zip', zipSha256: await hash(`${input}/HYP_50M_SR_W.zip`), tifSha256: await hash(raster), license: 'Public domain' },
  rivers: { url: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_50m_rivers_lake_centerlines.geojson', sha256: await hash(riverFile), names: [...riverNames], license: 'Public domain' },
  siteData: { path: `${output}/sites.json`, sha256: await hash(`${output}/sites.json`), points }, bounds, insetBounds, inset, size,
  palette: { sourceCropSha256: await hash(`${output}/akkad-relief-reference.png`), coloredBaseSha256: await hash(`${output}/akkad-atlas-base.png`), description: 'Source blue-red chroma determines water; source luminance retains relief. Land is warm ochre, water mineral blue, with deterministic fine grain. Geometry is unchanged.' },
  projection: 'equirectangular; modern geography; no ancient political border, ancient shoreline or Agade point',
  approvedRasterLabels: ['Mediterranean Sea', 'Persian Gulf', 'Euphrates', 'Tigris', 'Urkesh', 'Tell Leilan', 'Uruk', 'Africa', 'West Asia'],
  outputSha256: await hash(`${output}/akkad-geographic-reference.png`),
}, null, 2) + '\n');
console.log(`${output}/akkad-geographic-reference.png`);
