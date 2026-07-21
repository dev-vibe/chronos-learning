import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const inputPath = process.argv[2];
if (!inputPath) {
  throw new Error('Usage: node scripts/media/generate-human-origins-map.mjs <ne_110m_land.geojson>');
}

const expectedSha256 = '9e0729ee253ca7d7a5c4ae9395fb1902264c5377c52e224d13dd85010e2835d9';
const input = await readFile(resolve(inputPath));
const actualSha256 = createHash('sha256').update(input).digest('hex');
if (actualSha256 !== expectedSha256) {
  throw new Error(`Natural Earth input hash mismatch: ${actualSha256}`);
}

const geojson = JSON.parse(input.toString('utf8'));
const width = 1600;
const height = 1000;
const centerLongitude = 17;
const scale = 12;
const project = ([longitude, latitude]) => [
  width / 2 + (longitude - centerLongitude) * scale,
  height / 2 - latitude * scale,
];

const polygonPath = (rings) => rings.map((ring) => ring.map((coordinate, index) => {
  const [x, y] = project(coordinate);
  return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
}).join(' ') + ' Z').join(' ');

const landPaths = geojson.features.flatMap((feature) => {
  if (feature.geometry.type === 'Polygon') return [polygonPath(feature.geometry.coordinates)];
  if (feature.geometry.type === 'MultiPolygon') return feature.geometry.coordinates.map(polygonPath);
  return [];
}).map((pathData) => `<path d="${pathData}"/>`).join('');

const sites = [
  { label: 'Jebel Irhoud', coordinates: [-8.87, 31.85], labelDx: 30, labelDy: -25, uncertain: true },
  { label: 'Omo Kibish', coordinates: [35.939444, 5.312778], labelDx: 32, labelDy: -22 },
  { label: 'Florisbad', coordinates: [26.069639, -28.768167], labelDx: 32, labelDy: 13 },
];

const siteMarkup = sites.map((site) => {
  const [x, y] = project(site.coordinates);
  const labelX = x + site.labelDx;
  const labelY = y + site.labelDy;
  return `
    <g>
      ${site.uncertain ? `<circle cx="${x}" cy="${y}" r="24" class="uncertain"/>` : ''}
      <circle cx="${x}" cy="${y}" r="13" class="marker-halo"/>
      <circle cx="${x}" cy="${y}" r="7" class="marker"/>
      <path d="M${x + 8} ${y - 5} L${labelX - 10} ${labelY + 6}" class="leader"/>
      <text x="${labelX}" y="${labelY}" class="label">${site.label}</text>
    </g>`;
}).join('');

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="1600" height="1000" fill="#f4ead8"/>
  <defs>
    <clipPath id="frame"><rect x="72" y="54" width="1456" height="892" rx="36"/></clipPath>
    <filter id="paper" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="17" result="noise"/>
      <feColorMatrix in="noise" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .035 0"/>
    </filter>
  </defs>
  <rect x="72" y="54" width="1456" height="892" rx="36" fill="#efe1c8" stroke="#365d61" stroke-width="3"/>
  <g clip-path="url(#frame)">
    <g fill="#d6c39f" stroke="#31575d" stroke-width="4" stroke-linejoin="round">${landPaths}</g>
    <path d="M188 240 C410 190 630 206 850 170 S1280 128 1450 212" fill="none" stroke="#ffffff" stroke-opacity=".28" stroke-width="3"/>
    <path d="M150 720 C410 662 650 700 910 650 S1280 610 1480 680" fill="none" stroke="#ffffff" stroke-opacity=".2" stroke-width="3"/>
    <g font-family="Inter, Arial, sans-serif" font-size="38" font-weight="650" fill="#173f46">
      ${siteMarkup}
    </g>
    <rect width="1600" height="1000" filter="url(#paper)" opacity=".55"/>
  </g>
  <style>
    .marker { fill: #b95f3c; stroke: #fff8eb; stroke-width: 3; }
    .marker-halo { fill: #b95f3c; opacity: .2; }
    .uncertain { fill: none; stroke: #b95f3c; stroke-width: 3; stroke-dasharray: 8 8; opacity: .75; }
    .leader { fill: none; stroke: #496b6f; stroke-width: 3; stroke-linecap: round; }
    .label { paint-order: stroke; stroke: #f4ead8; stroke-width: 10; stroke-linejoin: round; }
  </style>
</svg>`;

const outputPath = resolve('public/images/maps/human-origins-africa-evidence-map.webp');
await sharp(Buffer.from(svg)).webp({ lossless: true }).toFile(outputPath);
console.log(`Generated ${outputPath} from Natural Earth input ${actualSha256}`);
