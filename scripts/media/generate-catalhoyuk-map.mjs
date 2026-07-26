import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const NATURAL_EARTH_LAND =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_land.geojson';

const width = 1732;
const height = 980;
const bounds = { west: 23, east: 45, south: 32, north: 44.5 };
const site = { longitude: 32.828, latitude: 37.667 };

function project([longitude, latitude]) {
  const x = ((longitude - bounds.west) / (bounds.east - bounds.west)) * width;
  const y = ((bounds.north - latitude) / (bounds.north - bounds.south)) * height;
  return [x, y];
}

function ringPath(ring) {
  return ring
    .map((coordinate, index) => {
      const [x, y] = project(coordinate);
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ') + ' Z';
}

function geometryPath(geometry) {
  if (geometry.type === 'Polygon') {
    return geometry.coordinates.map(ringPath).join(' ');
  }

  if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates.flatMap((polygon) => polygon.map(ringPath)).join(' ');
  }

  return '';
}

const response = await fetch(NATURAL_EARTH_LAND);
if (!response.ok) {
  throw new Error(`Natural Earth fetch failed: ${response.status} ${response.statusText}`);
}

const land = await response.json();
const landPath = land.features.map((feature) => geometryPath(feature.geometry)).join(' ');
const [siteX, siteY] = project([site.longitude, site.latitude]);

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d6e8e7"/>
      <stop offset="1" stop-color="#a9cecf"/>
    </linearGradient>
    <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f3e6c9"/>
      <stop offset="1" stop-color="#ddc99f"/>
    </linearGradient>
    <radialGradient id="plateau" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#c28b52" stop-opacity=".34"/>
      <stop offset=".72" stop-color="#d6aa70" stop-opacity=".16"/>
      <stop offset="1" stop-color="#d6aa70" stop-opacity="0"/>
    </radialGradient>
    <filter id="paper" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="17" result="noise"/>
      <feColorMatrix in="noise" values="1 0 0 0 0
                                               0 1 0 0 0
                                               0 0 1 0 0
                                               0 0 0 .055 0"/>
      <feBlend in="SourceGraphic" mode="multiply"/>
    </filter>
    <filter id="markerShadow" x="-100%" y="-100%" width="300%" height="300%">
      <feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#56331f" flood-opacity=".34"/>
    </filter>
    <clipPath id="frame"><rect x="24" y="24" width="${width - 48}" height="${height - 48}" rx="26"/></clipPath>
  </defs>

  <rect width="${width}" height="${height}" fill="#f8f1e3"/>
  <g clip-path="url(#frame)" filter="url(#paper)">
    <rect x="24" y="24" width="${width - 48}" height="${height - 48}" fill="url(#ocean)"/>

    <g opacity=".22" fill="none" stroke="#ffffff" stroke-width="2">
      <path d="M40 176 C360 138 650 220 1010 168 S1480 110 1700 154"/>
      <path d="M58 792 C330 735 608 836 930 782 S1432 716 1680 764"/>
      <path d="M90 850 C404 795 716 902 1040 838 S1455 794 1688 830"/>
    </g>

    <path d="${landPath}" fill="url(#land)" fill-rule="evenodd"/>

    <ellipse cx="830" cy="485" rx="440" ry="245" fill="url(#plateau)" transform="rotate(-7 830 485)"/>
    <ellipse cx="${siteX.toFixed(1)}" cy="${siteY.toFixed(1)}" rx="150" ry="74" fill="#d7b273" opacity=".5"/>

    <g fill="none" stroke="#a98255" stroke-width="5" stroke-linecap="round" opacity=".25">
      <path d="M380 430 C510 350 690 335 845 386 C990 434 1112 447 1275 390"/>
      <path d="M420 505 C570 431 738 430 894 474 C1045 517 1160 515 1295 463"/>
      <path d="M515 590 C663 532 813 541 946 573 C1080 604 1182 591 1288 548"/>
    </g>

    <g font-family="Inter, Arial, sans-serif" text-anchor="middle">
      <text x="860" y="112" font-size="52" font-weight="650" letter-spacing="4" fill="#315f69">BLACK SEA</text>
      <text x="710" y="914" font-size="48" font-weight="650" letter-spacing="3.5" fill="#315f69">MEDITERRANEAN SEA</text>
      <text x="846" y="410" font-size="44" font-weight="650" letter-spacing="2.5" fill="#756047">ANATOLIAN PLATEAU</text>
      <text x="${(siteX - 235).toFixed(1)}" y="${(siteY + 54).toFixed(1)}" font-size="38" font-weight="650" letter-spacing="1.2" fill="#76563d">KONYA PLAIN</text>
    </g>

    <g transform="translate(${siteX.toFixed(1)} ${siteY.toFixed(1)})" filter="url(#markerShadow)">
      <circle r="34" fill="#fff8e9" stroke="#9d4d2c" stroke-width="9"/>
      <circle r="12" fill="#9d4d2c"/>
      <path d="M0 35 L-14 65 L14 65 Z" fill="#9d4d2c"/>
    </g>

    <g transform="translate(${(siteX + 42).toFixed(1)} ${(siteY - 26).toFixed(1)})">
      <rect x="0" y="0" width="300" height="82" rx="41" fill="#fffaf0" stroke="#b98655" stroke-width="3"/>
      <text x="150" y="55" font-family="Georgia, 'Times New Roman', serif" font-size="42" font-weight="700" text-anchor="middle" fill="#3d332b">Çatalhöyük</text>
    </g>
  </g>
  <rect x="24" y="24" width="${width - 48}" height="${height - 48}" rx="26" fill="none" stroke="#b58a54" stroke-width="5"/>
</svg>`;

const svgPath = resolve(ROOT, 'tmp/catalhoyuk-locator-map-v2.svg');
const sourcePath = resolve(ROOT, 'public/images/maps/catalhoyuk-locator-map.webp');
const previewPath = resolve(ROOT, 'tmp/catalhoyuk-locator-map-v2-preview.png');

await mkdir(dirname(svgPath), { recursive: true });
await mkdir(dirname(previewPath), { recursive: true });
await writeFile(svgPath, svg);
await sharp(Buffer.from(svg)).webp({ quality: 94, effort: 6, smartSubsample: true }).toFile(sourcePath);
await sharp(Buffer.from(svg)).png().toFile(previewPath);

console.log(`Wrote ${svgPath}`);
console.log(`Wrote ${sourcePath}`);
console.log(`Wrote ${previewPath}`);
