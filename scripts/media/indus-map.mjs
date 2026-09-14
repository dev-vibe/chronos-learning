// Archived version-one geographic locator; not the current illustrated asset.
// Current reference preparation: scripts/media/indus-map-reference.mjs.
// Run only to reproduce the original research record, not to publish the map.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const output = resolve(root, 'docs/research/indus-map-assets');
const runtime = resolve(root, 'public/images/maps/indus-cities-locator.png');
const url = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_50m_land.geojson';
const width = 1600;
const bounds = { west: 63, east: 78, south: 21, north: 32.4 };
const standardParallel = 27;
const xScale = width / (bounds.east - bounds.west);
const yScale = xScale / Math.cos(standardParallel * Math.PI / 180);
const height = Math.round((bounds.north - bounds.south) * yScale);
const sites = [
  { name: 'Harappa', latitude: 30.6361, longitude: 72.8639, authority: 'Getty TGN 8039784 (archaeological site; NGA lineage)', url: 'https://www.getty.edu/vow/TGNFullDisplay?english=Y&find=&nation=&place=&subjectid=8039784' },
  { name: 'Mohenjo-daro', latitude: 27 + 19 / 60 + 45 / 3600, longitude: 68 + 8 / 60 + 20 / 3600, authority: 'UNESCO WHC 138', url: 'https://whc.unesco.org/en/list/138/' },
  { name: 'Dholavira', latitude: 23 + 53 / 60 + 18.27 / 3600, longitude: 70 + 12 / 60 + 47.89 / 3600, authority: 'UNESCO WHC 1645', url: 'https://whc.unesco.org/en/list/1645/' },
];
function project([longitude, latitude]) {
  return [(longitude - bounds.west) * xScale, (bounds.north - latitude) * yScale];
}
// Sutherland-Hodgman clipping in lon/lat: retain source geometry, interpolate
// only where an edge crosses the rectangular crop. No coastline smoothing.
function clipRing(input) {
  let points = input.slice(0, -1);
  for (const [axis, boundary, direction] of [[0, bounds.west, 1], [0, bounds.east, -1], [1, bounds.south, 1], [1, bounds.north, -1]]) {
    const next = [];
    for (let i = 0; i < points.length; i++) {
      const a = points[i]; const b = points[(i + 1) % points.length];
      const insideA = direction * (a[axis] - boundary) >= 0;
      const insideB = direction * (b[axis] - boundary) >= 0;
      if (insideA) next.push(a);
      if (insideA !== insideB) {
        const t = (boundary - a[axis]) / (b[axis] - a[axis]);
        next.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]);
      }
    }
    points = next;
  }
  return points.length < 3 ? [] : [...points, points[0]];
}
await mkdir(output, { recursive: true });
await mkdir(dirname(runtime), { recursive: true });
const dataPath = resolve(output, 'indus-map-data.json');
let data;
try { data = JSON.parse(await readFile(dataPath, 'utf8')); }
catch (error) {
  if (error.code !== 'ENOENT') throw error;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Natural Earth download failed: ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const full = JSON.parse(bytes.toString());
  const rings = full.features.flatMap(({ geometry }) => geometry.type === 'Polygon' ? geometry.coordinates : geometry.coordinates.flat()).map(clipRing).filter(ring => ring.length);
  data = { source: url, sourceSha256: createHash('sha256').update(bytes).digest('hex'), dataset: 'Natural Earth ne_50m_land, repository tag v5.1.2', license: 'Public domain', licenseUrl: 'https://www.naturalearthdata.com/about/terms-of-use/', bounds, projection: 'Equirectangular, standard parallel 27 degrees north; north at top', sites, rings };
  await writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`);
}
const path = data.rings.map(ring => ring.map((p, i) => `${i ? 'L' : 'M'}${project(p).map(n => n.toFixed(2)).join(',')}`).join(' ') + 'Z').join(' ');
const draw = (reference = false) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<rect width="${width}" height="${height}" fill="${reference ? '#edf4f7' : '#c3dadb'}"/>
<path d="${path}" fill="${reference ? '#ffffff' : '#f3e9d4'}" stroke="${reference ? '#454b51' : '#a7b5a4'}" stroke-width="3" fill-rule="evenodd"/>
${reference ? [24, 28, 32].map(lat => `<path d="M0,${project([63, lat])[1]}H${width}" stroke="#a0adb4" stroke-width="1"/>`).join('') + [64, 68, 72, 76].map(lon => `<path d="M${project([lon, 32.4])[0]},0V${height}" stroke="#a0adb4" stroke-width="1"/>`).join('') : ''}
${sites.map(site => {
  const [x, y] = project([site.longitude, site.latitude]);
  const labelOnLeft = site.name === 'Harappa';
  return `<circle cx="${x}" cy="${y}" r="18" fill="#a95e3d" stroke="#fffaf0" stroke-width="8"/>
<text x="${x + (labelOnLeft ? -37 : 37)}" y="${y + 22}" text-anchor="${labelOnLeft ? 'end' : 'start'}" font-family="Arial,sans-serif" font-size="70" font-weight="600" fill="#233f45" stroke="${reference ? '#ffffff' : '#f3e9d4'}" stroke-width="9" stroke-linejoin="round" paint-order="stroke">${site.name}</text>`;
}).join('')}
<text x="300" y="${height - 162}" text-anchor="middle" font-family="Arial,sans-serif" font-size="60" fill="#37686f"><tspan x="300">Arabian</tspan><tspan x="300" dy="72">Sea</tspan></text>
</svg>`;
await writeFile(resolve(output, 'indus-map-master.svg'), draw());
await sharp(Buffer.from(draw())).png().toFile(resolve(output, 'indus-map-master.png'));
await sharp(Buffer.from(draw())).png().toFile(runtime);
await sharp(Buffer.from(draw(true))).png().toFile(resolve(output, 'indus-map-data-reference.png'));
await sharp(runtime).resize({ width: 358 }).png().toFile(resolve(output, 'indus-map-mobile-review.png'));
const artifacts = [];
for (const file of [dataPath, resolve(output, 'indus-map-master.svg'), resolve(output, 'indus-map-master.png'), runtime]) {
  const bytes = await readFile(file);
  artifacts.push({ path: file.slice(root.length + 1).replaceAll('\\', '/'), bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
}
await writeFile(resolve(output, 'indus-map-lineage.json'), `${JSON.stringify({ generatedAt: '2026-09-12', renderer: `Node ${process.version}; Sharp ${sharp.versions.sharp}`, dimensions: { width, height }, method: 'Deterministic SVG from clipped geographic data; PNG raster export', artifacts }, null, 2)}\n`);
console.log(JSON.stringify({ width, height, artifacts }, null, 2));
