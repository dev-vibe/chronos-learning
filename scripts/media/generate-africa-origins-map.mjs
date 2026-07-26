import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const NATURAL_EARTH_LAND =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_land.geojson';

/**
 * Two renders share one set of verified coordinates.
 *
 * `lesson` is the labelled portrait map used by the historical-map module.
 * `card`   is an unlabelled 1.6:1 landscape composition sized for the Knowledge
 *          Card frame, where baked labels would be illegible. Its markers are
 *          enlarged so they still read at roughly 314px wide.
 */
const variants = {
  lesson: {
    width: 1600,
    height: 1644,
    bounds: { west: -20, east: 52, south: -36, north: 38 },
    labelled: true,
    marker: { dot: 13, ring: 7, haloArea: 62, haloVerified: 30 },
    output: 'public/images/maps/africa-origins-evidence-map.webp',
    preview: 'tmp/africa-origins-evidence-map-preview.png',
    svg: 'tmp/africa-origins-evidence-map.svg',
  },
  card: {
    width: 1600,
    height: 1000,
    bounds: { west: -20 - 23.2, east: 52 + 23.2, south: -36, north: 38 },
    labelled: false,
    // The card carries no caption, so the lesson map's precision encoding would
    // be an unexplained difference in dot size. Uniform markers instead.
    marker: { dot: 26, ring: 12, haloArea: 44, haloVerified: 44 },
    output: 'public/images/human-origins/africa-origins-card.webp',
    preview: 'tmp/africa-origins-card-preview.png',
    svg: 'tmp/africa-origins-card.svg',
  },
};

/**
 * Every coordinate is sourced in docs/research/homo-sapiens-origins.md.
 * `precision: 'area'` marks finds whose published location is a basin or a
 * geological formation rather than a surveyed find spot. Those are drawn with a
 * wider, softer halo so the image cannot imply accuracy the sources do not give.
 */
const sites = [
  {
    name: 'Jebel Irhoud',
    detail: null,
    date: 'c. 315,000 years ago',
    longitude: -8.87,
    latitude: 31.853,
    precision: 'verified',
    label: { anchor: 'start', dx: 46, dy: 12 },
  },
  {
    name: 'Herto',
    detail: null,
    date: 'c. 160,000 years ago',
    longitude: 40.55639,
    latitude: 10.25914,
    precision: 'verified',
    label: { anchor: 'end', dx: -46, dy: -6 },
  },
  {
    name: 'Omo Kibish',
    detail: null,
    date: 'at least 233,000 years ago',
    longitude: 35.9303,
    latitude: 5.4027,
    precision: 'area',
    label: { anchor: 'end', dx: -70, dy: 10 },
  },
  {
    name: 'Olorgesailie',
    detail: 'stone tools',
    date: 'c. 320,000–305,000 years ago',
    longitude: 36.4447,
    latitude: -1.5775,
    precision: 'area',
    label: { anchor: 'end', dx: -70, dy: 26 },
  },
  {
    name: 'Florisbad',
    detail: null,
    date: 'c. 259,000 years ago',
    longitude: 26.069639,
    latitude: -28.768167,
    precision: 'verified',
    label: { anchor: 'end', dx: -46, dy: 8 },
  },
];

const response = await fetch(NATURAL_EARTH_LAND);
if (!response.ok) {
  throw new Error(`Natural Earth fetch failed: ${response.status} ${response.statusText}`);
}
const land = await response.json();

function buildSvg(variant) {
  const { width, height, bounds, labelled, marker } = variant;

  const project = ([longitude, latitude]) => [
    ((longitude - bounds.west) / (bounds.east - bounds.west)) * width,
    ((bounds.north - latitude) / (bounds.north - bounds.south)) * height,
  ];

  const ringPath = (ring) =>
    ring
      .map((coordinate, index) => {
        const [x, y] = project(coordinate);
        return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ') + ' Z';

  const geometryPath = (geometry) => {
    if (geometry.type === 'Polygon') return geometry.coordinates.map(ringPath).join(' ');
    if (geometry.type === 'MultiPolygon') {
      return geometry.coordinates.flatMap((polygon) => polygon.map(ringPath)).join(' ');
    }
    return '';
  };

  const landPath = land.features.map((feature) => geometryPath(feature.geometry)).join(' ');
  const [, equatorY] = project([0, 0]);

  const markers = sites
    .map((site) => {
      const [x, y] = project([site.longitude, site.latitude]);
      const halo = site.precision === 'area' ? marker.haloArea : marker.haloVerified;
      const haloOpacity = site.precision === 'area' ? 0.28 : 0.42;
      return `
    <g>
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${halo}" fill="#9d4d2c" opacity="${haloOpacity}"/>
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${marker.dot}" fill="#fff8e9" stroke="#9d4d2c" stroke-width="${marker.ring}"/>
    </g>`;
    })
    .join('');

  const labels = labelled
    ? sites
        .map((site) => {
          const [x, y] = project([site.longitude, site.latitude]);
          const textX = (x + site.label.dx).toFixed(1);
          const textY = (y + site.label.dy).toFixed(1);
          const detailLine = site.detail
            ? `<tspan x="${textX}" dy="34" font-family="Inter, Arial, sans-serif" font-size="26" font-style="italic" fill="#6d5742">${site.detail}</tspan>`
            : '';
          return `
    <text x="${textX}" y="${textY}" text-anchor="${site.label.anchor}" paint-order="stroke" stroke="#f8f1e3" stroke-width="7" stroke-linejoin="round">
      <tspan font-family="Georgia, 'Times New Roman', serif" font-size="38" font-weight="700" fill="#3d332b">${site.name}</tspan>
      ${detailLine}
      <tspan x="${textX}" dy="34" font-family="Inter, Arial, sans-serif" font-size="26" fill="#6d5742">${site.date}</tspan>
    </text>`;
        })
        .join('')
    : '';

  const oceanLabels = labelled
    ? `
    <text x="60" y="${(equatorY - 18).toFixed(1)}" font-family="Inter, Arial, sans-serif" font-size="26" letter-spacing="4" fill="#7d6b52" opacity=".85">EQUATOR</text>

    <g font-family="Inter, Arial, sans-serif" text-anchor="middle" fill="#4c7b81" opacity=".8">
      <text x="176" y="900" font-size="34" font-weight="650" letter-spacing="4">ATLANTIC</text>
      <text x="176" y="946" font-size="34" font-weight="650" letter-spacing="4">OCEAN</text>
      <text x="1386" y="1524" font-size="34" font-weight="650" letter-spacing="4">INDIAN</text>
      <text x="1386" y="1570" font-size="34" font-weight="650" letter-spacing="4">OCEAN</text>
      <text x="852" y="96" font-size="30" font-weight="650" letter-spacing="4">MEDITERRANEAN SEA</text>
    </g>`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
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
    <filter id="paper" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="17" result="noise"/>
      <feColorMatrix in="noise" values="1 0 0 0 0
                                        0 1 0 0 0
                                        0 0 1 0 0
                                        0 0 0 .055 0"/>
      <feBlend in="SourceGraphic" mode="multiply"/>
    </filter>
    <clipPath id="frame"><rect x="24" y="24" width="${width - 48}" height="${height - 48}" rx="26"/></clipPath>
  </defs>

  <rect width="${width}" height="${height}" fill="#f8f1e3"/>
  <g clip-path="url(#frame)" filter="url(#paper)">
    <rect x="24" y="24" width="${width - 48}" height="${height - 48}" fill="url(#ocean)"/>
    <path d="${landPath}" fill="url(#land)" fill-rule="evenodd"/>

    <line x1="24" y1="${equatorY.toFixed(1)}" x2="${width - 24}" y2="${equatorY.toFixed(1)}" stroke="#8a7a63" stroke-width="2.5" stroke-dasharray="14 12" opacity=".55"/>
${oceanLabels}
    ${markers}
    ${labels}
  </g>
  <rect x="24" y="24" width="${width - 48}" height="${height - 48}" rx="26" fill="none" stroke="#b58a54" stroke-width="5"/>
</svg>`;
}

for (const variant of Object.values(variants)) {
  const svg = buildSvg(variant);
  const svgPath = resolve(ROOT, variant.svg);
  const sourcePath = resolve(ROOT, variant.output);
  const previewPath = resolve(ROOT, variant.preview);

  await mkdir(dirname(svgPath), { recursive: true });
  await mkdir(dirname(sourcePath), { recursive: true });
  await mkdir(dirname(previewPath), { recursive: true });
  await writeFile(svgPath, svg);
  await sharp(Buffer.from(svg)).webp({ quality: 94, effort: 6, smartSubsample: true }).toFile(sourcePath);
  await sharp(Buffer.from(svg)).png().toFile(previewPath);

  console.log(`Wrote ${svgPath}`);
  console.log(`Wrote ${sourcePath}`);
  console.log(`Wrote ${previewPath}`);
}
