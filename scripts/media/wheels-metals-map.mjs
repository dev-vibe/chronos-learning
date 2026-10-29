// Reproducible modern-geography locator for Wheels, Metals, and Specialized Work.
// Points only: no routes, borders, spread arrows or ancient shorelines.
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const input = 'tmp/wm-map';
const output = 'docs/research/assets/wheels-metals/map';
await mkdir(output, { recursive: true });
const raster = `${input}/relief/HYP_50M_SR_W.tif`;
const bounds = { west: 3, east: 50, south: 27, north: 57 };
const standardParallel = 42;
const width = 1600;
const height = Math.round(width * (bounds.north - bounds.south) / ((bounds.east - bounds.west) * Math.cos(standardParallel * Math.PI / 180)));
const size = { width, height };
const insetBounds = { west: -25, east: 110, south: -40, north: 72 };
const inset = { x: 1192, y: 36, width: 372, height: Math.round(372 * (insetBounds.north - insetBounds.south) / (insetBounds.east - insetBounds.west)) };
const crop = (b) => ({ left: Math.round((b.west + 180) * 30), top: Math.round((90 - b.north) * 30), width: Math.round((b.east - b.west) * 30), height: Math.round((b.north - b.south) * 30) });
const project = (lon, lat) => [(lon - bounds.west) / (bounds.east - bounds.west) * size.width, (bounds.north - lat) / (bounds.north - bounds.south) * size.height];
const insetProject = (lon, lat) => [inset.x + (lon - insetBounds.west) / (insetBounds.east - insetBounds.west) * inset.width, inset.y + (insetBounds.north - lat) / (insetBounds.north - insetBounds.south) * inset.height];
const hash = async (path) => createHash('sha256').update(await readFile(path)).digest('hex');
const esc = (s) => s.replace(/&/g, '&amp;');
const text = (label, x, y, fontSize, anchor = 'middle', italic = false, fill = '#173e4b') => `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}" font-family="Georgia,serif" font-style="${italic ? 'italic' : 'normal'}" font-size="${fontSize}" fill="${fill}" stroke="#fff4d7" stroke-width="7" stroke-linejoin="round" paint-order="stroke">${esc(label)}</text>`;

// Akkad palette and grain, but the water mask comes from Natural Earth land and lake
// polygons: the hypsometric tints colour European lowlands green-blue, so the Akkad
// chroma test would paint them as sea. Source luminance still carries the relief.
const land = JSON.parse(await readFile(`${input}/ne_50m_land.geojson`, 'utf8'));
const lakes = JSON.parse(await readFile(`${input}/ne_50m_lakes.geojson`, 'utf8'));
const pathFor = (collection, proj) => collection.features.flatMap((feature) => feature.geometry.type === 'MultiPolygon' ? feature.geometry.coordinates : [feature.geometry.coordinates])
  .flatMap((polygon) => polygon).map((ring) => ring.map(([lon, lat], i) => `${i ? 'L' : 'M'}${proj(lon, lat).map((n) => n.toFixed(1)).join(',')}`).join('') + 'Z').join('');
const waterMask = async (w, h, proj) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#fff"/><path d="${pathFor(land, proj)}" fill="#000" fill-rule="evenodd"/><path d="${pathFor(lakes, proj)}" fill="#fff" fill-rule="evenodd"/></svg>`;
  return (await sharp(Buffer.from(svg)).blur(0.8).greyscale().raw().toBuffer({ resolveWithObject: true })).data;
};
const colorize = async (png, mask) => {
  const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const colored = Buffer.allocUnsafe(info.width * info.height * 3);
  const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 3;
    const red = data[i], green = data[i + 1], blue = data[i + 2];
    const light = red * 0.3 + green * 0.59 + blue * 0.11;
    const water = mask[y * info.width + x] / 255;
    const grain = ((((x * 374761393 + y * 668265263) ^ (x * 1274126177)) >>> 0) % 11 - 5) * 0.36;
    const shade = (light - 178) * 0.63;
    const landColor = [217 + shade + grain, 180 + shade * 0.86 + grain, 119 + shade * 0.72 + grain];
    const seaShade = (light - 214) * 0.45;
    const sea = [89 + seaShade + grain, 151 + seaShade + grain, 177 + seaShade + grain];
    for (let c = 0; c < 3; c++) colored[i + c] = clamp(landColor[c] * (1 - water) + sea[c] * water);
  }
  return sharp(colored, { raw: { width: info.width, height: info.height, channels: 3 } }).png().toBuffer();
};

const sourceRelief = await sharp(raster, { limitInputPixels: false }).extract(crop(bounds)).resize(size.width, size.height, { fit: 'fill' }).png().toBuffer();
await writeFile(`${output}/wheels-metals-relief-reference.png`, sourceRelief);
const relief = await colorize(sourceRelief, await waterMask(size.width, size.height, project));
await writeFile(`${output}/wheels-metals-atlas-base.png`, relief);
const insetProjectLocal = (lon, lat) => [(lon - insetBounds.west) / (insetBounds.east - insetBounds.west) * inset.width, (insetBounds.north - lat) / (insetBounds.north - insetBounds.south) * inset.height];
const insetRelief = await colorize(await sharp(raster, { limitInputPixels: false }).extract(crop(insetBounds)).resize(inset.width, inset.height, { fit: 'fill' }).png().toBuffer(), await waterMask(inset.width, inset.height, insetProjectLocal));

const { sites } = JSON.parse(await readFile(`${output}/sites.json`, 'utf8'));
const points = Object.fromEntries(sites.map((site) => [site.name, project(site.longitude, site.latitude)]));
const approximate = new Set(['Southern Tuscany', 'Belovode']);
const marker = (site) => { const [x, y] = points[site.name]; return approximate.has(site.name)
  ? `<circle cx="${x}" cy="${y}" r="19" fill="#fff0ca" opacity="0.85"/><circle cx="${x}" cy="${y}" r="11" fill="#fff9e7" stroke="#a53f27" stroke-width="5"/>`
  : `<circle cx="${x}" cy="${y}" r="19" fill="#fff0ca" opacity="0.85"/><circle cx="${x}" cy="${y}" r="11" fill="#a53f27" stroke="#fff9e7" stroke-width="4"/>`; };
// Label offsets reviewed for legibility; every label stays beside its own point.
const labelOffsets = {
  Flintbek: [24, -10, 'start'], Bronocice: [24, -12, 'start'], 'Balatonberény': [24, 14, 'start'],
  'Ljubljana Marshes': [10, 46, 'start'], Tisenjoch: [-24, -12, 'end'], 'Southern Tuscany': [24, 16, 'start'],
  Belovode: [24, 14, 'start'], Arslantepe: [24, -10, 'start'], Uruk: [-24, -6, 'end'], Ur: [24, 22, 'start'],
};
const labels = sites.map((site) => { const [x, y] = points[site.name]; const [dx, dy, anchor] = labelOffsets[site.name]; return text(site.name, x + dx, y + dy, 40, anchor); }).join('');
const [boxX, boxY] = insetProject(bounds.west, bounds.north);
const boxWidth = (bounds.east - bounds.west) / (insetBounds.east - insetBounds.west) * inset.width;
const boxHeight = (bounds.north - bounds.south) / (insetBounds.north - insetBounds.south) * inset.height;
const seas = [
  ['Mediterranean Sea', 18, 35.2], ['Black Sea', 34.5, 43.3], ['North Sea', 5.6, 56.2, 'start'], ['Persian Gulf', 49.4, 27.7, 'end'],
].map(([label, lon, lat, anchor = 'middle']) => { const [x, y] = project(lon, lat); return text(label, x, y, 38, anchor, true, '#14506a'); }).join('');
const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}"><defs><clipPath id="map"><rect width="${size.width}" height="${size.height}"/></clipPath></defs><g clip-path="url(#map)">
${seas}
${sites.map(marker).join('')}
${labels}
<rect x="${inset.x - 9}" y="${inset.y - 9}" width="${inset.width + 18}" height="${inset.height + 18}" rx="8" fill="#fff2d1" stroke="#93572f" stroke-width="4"/>
<image x="${inset.x}" y="${inset.y}" width="${inset.width}" height="${inset.height}" href="data:image/png;base64,${insetRelief.toString('base64')}"/>
<rect x="${boxX.toFixed(1)}" y="${boxY.toFixed(1)}" width="${boxWidth.toFixed(1)}" height="${boxHeight.toFixed(1)}" fill="#aa5d2c25" stroke="#9e4b28" stroke-width="4"/>
${text('Europe', ...insetProject(5, 62), 26)}${text('Africa', ...insetProject(20, 5), 26)}${text('Asia', ...insetProject(85, 50), 26)}
</g></svg>`;
await sharp(relief).composite([{ input: Buffer.from(overlay) }]).png().toFile(`${output}/wheels-metals-locator-master.png`);
await writeFile(`${output}/reference-lineage.json`, JSON.stringify({
  method: 'deterministic palette edit of georeferenced Natural Earth relief (Akkad palette; water mask from Natural Earth 1:50m land and lake polygons), then reviewed site and sea-label overlays; modern orientation only',
  vectors: { land: { url: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_50m_land.geojson', sha256: await hash(`${input}/ne_50m_land.geojson`) }, lakes: { url: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_50m_lakes.geojson', sha256: await hash(`${input}/ne_50m_lakes.geojson`) }, license: 'Public domain' },
  raster: { url: 'https://naturalearth.s3.amazonaws.com/50m_raster/HYP_50M_SR_W.zip', zipSha256: await hash(`${input}/HYP_50M_SR_W.zip`), tifSha256: await hash(raster), license: 'Public domain' },
  siteData: { path: `${output}/sites.json`, sha256: await hash(`${output}/sites.json`), points }, approximatePoints: [...approximate], bounds, insetBounds, inset, size,
  projection: `equidistant cylindrical, standard parallel ${standardParallel}°N; modern coastlines; no ancient border, shoreline or route`,
  palette: { sourceCropSha256: await hash(`${output}/wheels-metals-relief-reference.png`), coloredBaseSha256: await hash(`${output}/wheels-metals-atlas-base.png`) },
  approvedRasterLabels: [...sites.map((site) => site.name), 'Mediterranean Sea', 'Black Sea', 'North Sea', 'Persian Gulf', 'Europe', 'Africa', 'Asia'],
  outputSha256: await hash(`${output}/wheels-metals-locator-master.png`),
}, null, 2) + '\n');
console.log(`${output}/wheels-metals-locator-master.png`, size);
