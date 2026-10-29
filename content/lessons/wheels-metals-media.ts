import type { KnowledgeCard, LessonModule, MediaAsset, Source } from '../../src/domains/contracts';
import { mediaLocator } from '../shared/media-locator';

const lifecycle = 'docs/research/wheels-metals-and-specialized-work.md#image-lifecycle';

export const wheelsMetalsMediaSources: Source[] = [
  { id: 'source.wheels-metals.map-relief', title: 'Natural Earth 1:50m Cross-blended Hypsometric Tints with shaded relief and water', url: 'https://www.naturalearthdata.com/downloads/50m-raster-data/50m-cross-blend-hypso/', publisher: 'Natural Earth contributors', accessedOn: '2026-10-29', licenseOrUse: 'Public domain modern terrain raster; download and TIFF hashes, crop and projection in docs/research/assets/wheels-metals/map/reference-lineage.json. Not a reconstruction of ancient terrain or shoreline.', reviewStatus: 'reviewed' },
  { id: 'source.wheels-metals.map-vectors', title: 'Natural Earth 1:50m land and lake polygons (v5.1.2)', url: 'https://www.naturalearthdata.com/downloads/50m-physical-vectors/', publisher: 'Natural Earth contributors', accessedOn: '2026-10-29', licenseOrUse: 'Public domain vectors used only to separate land from water in the palette; hashes in reference-lineage.json.', reviewStatus: 'reviewed' },
  { id: 'source.wheels-metals.map-sites', title: 'Site coordinates for the lesson locator (Wikidata, Oracc and Pleiades place records)', url: 'https://www.wikidata.org/wiki/Q6660938', publisher: 'Wikidata, Oracc and Pleiades; cross-checked with OpenStreetMap', accessedOn: '2026-10-29', licenseOrUse: 'Factual points only, each with its record and cross-check in docs/research/assets/wheels-metals/map/sites.json. Southern Tuscany and Belovode are approximate.', reviewStatus: 'reviewed' },
  { id: 'source.wheels-metals.axe-photo', title: 'Iceman’s Copper Axe (photograph)', url: 'https://commons.wikimedia.org/wiki/File:Iceman%27s_Copper_Axe.jpg', publisher: 'АлександрЛаптев (Aleksandr Laptev) / Wikimedia Commons', accessedOn: '2026-10-29', licenseOrUse: 'Photograph taken 2017-10-08 at the South Tyrol Museum of Archaeology; CC BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0/. Cropped to the blade and pedestal top (removing the museum label) and compressed; the crop is shared under the same licence.', reviewStatus: 'reviewed' },
  { id: 'source.wheels-metals.wheel-photo', title: 'Ljubljana Marshes Wheel with axle (photograph)', url: 'https://commons.wikimedia.org/wiki/File:Ljubljana_Marshes_Wheel_with_axle_(oldest_wooden_wheel_yet_discovered).jpg', publisher: 'Petar Milošević / Wikimedia Commons', accessedOn: '2026-10-29', licenseOrUse: 'Photograph taken 2020-02-08 at the City Museum of Ljubljana; CC BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0/. Full frame resized to 1600 px and compressed.', reviewStatus: 'reviewed' },
  { id: 'source.wheels-metals.standard-photo', title: 'Standard of Ur – War side (photograph)', url: 'https://commons.wikimedia.org/wiki/File:Standard_of_Ur_-_War_side.jpg', publisher: 'LeastCommonAncestor / Wikimedia Commons', accessedOn: '2026-10-29', licenseOrUse: 'Photograph taken 2012-03-25 at the British Museum; CC BY-SA 3.0, https://creativecommons.org/licenses/by-sa/3.0/. Full frame resized to 1600 px and compressed.', reviewStatus: 'reviewed' },
];

export const wheelsMetalsMedia: MediaAsset[] = [
  {
    id: 'media.wheels-metals.locator-map', locator: mediaLocator('media.wheels-metals.locator-map'),
    alt: 'A map of Europe and the Middle East with red points at Flintbek in northern Germany, Bronocice in southern Poland, Balatonberény in Hungary, the Ljubljana Marshes in Slovenia, Tisenjoch in the Alps, southern Tuscany in Italy, Belovode in Serbia, Arslantepe in eastern Türkiye, and Uruk and Ur in southern Iraq near the Persian Gulf. An inset places the area between Europe, Africa and Asia.',
    depictionMode: 'map', depictionLabel: 'Illustrated locator · modern geography',
    rightsLabel: 'Chronos deterministic map · Natural Earth geography, Public Domain · site points from Wikidata, Oracc and Pleiades',
    sourceIds: ['source.wheels-metals.map-relief', 'source.wheels-metals.map-vectors', 'source.wheels-metals.map-sites'], visualBriefRef: lifecycle, reviewStatus: 'approved',
  },
  {
    id: 'media.wheels-metals.iceman-axe', locator: mediaLocator('media.wheels-metals.iceman-axe'),
    alt: 'A dark greenish copper axe blade, wider at its cutting edge and narrowing toward the back, lies on top of a black display block.',
    depictionMode: 'evidence', depictionLabel: 'Surviving copper blade · modern museum photograph',
    rightsLabel: 'АлександрЛаптев · 2017 · CC BY-SA 4.0 · cropped and compressed',
    sourceIds: ['source.wheels-metals.axe-photo', 'source.wheels-metals.iceman-equipment'], visualBriefRef: lifecycle, reviewStatus: 'approved',
  },
  {
    id: 'media.wheels-metals.ljubljana-wheel', locator: mediaLocator('media.wheels-metals.ljubljana-wheel'),
    alt: 'A broken, dark wooden disc wheel made of two large planks with raised strips running across them lies in a museum case beside a long wooden axle with a thickened end.',
    depictionMode: 'evidence', depictionLabel: 'Surviving wheel and axle · modern museum photograph',
    rightsLabel: 'Petar Milošević · 2020 · CC BY-SA 4.0 · resized and compressed',
    sourceIds: ['source.wheels-metals.wheel-photo', 'source.wheels-metals.ljubljana-record', 'source.wheels-metals.velusek-2009'], visualBriefRef: lifecycle, reviewStatus: 'approved',
  },
  {
    id: 'media.wheels-metals.standard-of-ur', locator: mediaLocator('media.wheels-metals.standard-of-ur'),
    alt: 'A long panel of white shell figures on deep blue lapis lazuli in three rows. In the bottom row, four-wheeled wagons with solid wheels are pulled by animals that move from walking to galloping, with fallen enemies beneath them.',
    depictionMode: 'evidence', depictionLabel: 'Surviving inlaid panel · modern museum photograph',
    rightsLabel: 'LeastCommonAncestor · 2012 · CC BY-SA 3.0 · resized and compressed',
    sourceIds: ['source.wheels-metals.standard-photo', 'source.wheels-metals.bm-standard'], visualBriefRef: lifecycle, reviewStatus: 'approved',
  },
];

export const wheelsMetalsLocatorVisual: LessonModule = {
  id: 'module.wheels-metals.locator', type: 'historical-map', eyebrow: 'Place & landscape', title: 'From the Alps to southern Iraq',
  body: 'The lesson moves across Europe and the Middle East. The early wheel finds stretch from Flintbek in northern Germany to Uruk in southern Iraq. Ötzi’s axe links the Alps to the copper of southern Tuscany, and the story ends at Ur.',
  mediaId: 'media.wheels-metals.locator-map', periodLabel: 'c. 3600–2000 BCE', focusPlace: 'Europe and western Asia', modernContext: 'Present-day Germany, Poland, Hungary, Slovenia, Italy, Serbia, Türkiye and Iraq',
  accessibleSummary: 'Flintbek is in the far north near the North Sea. Bronocice, Balatonberény and the Ljubljana Marshes lie in central Europe, with Tisenjoch in the Alps and southern Tuscany farther south in Italy. Belovode is in Serbia. Arslantepe is in eastern Türkiye, south of the Black Sea. Uruk and Ur sit close together in southern Iraq near the Persian Gulf. An inset places the whole area where Europe, Africa and Asia meet.',
  compactLabel: 'Modern coastlines and site points · no routes or borders',
  coordinateNote: 'Natural Earth modern relief, land and lake data; site points from Wikidata, Oracc and Pleiades, cross-checked with OpenStreetMap. Southern Tuscany and Belovode are approximate (hollow markers).',
  uncertaintyNote: 'Points mark where finds were made, not where wheels or metalworking began. The map draws no routes, because the evidence does not show which way the technologies travelled.',
  depictionStatus: 'illustrative-reconstruction',
  claimIds: ['claim.wheels-metals.wheel-spread', 'claim.wheels-metals.axe-tuscany', 'claim.wheels-metals.origin-unknown'],
  sourceIds: ['source.wheels-metals.map-relief', 'source.wheels-metals.map-vectors', 'source.wheels-metals.map-sites', 'source.wheels-metals.bondar-2018', 'source.wheels-metals.artioli-2017'],
};

export const wheelsMetalsAxeVisual: LessonModule = {
  id: 'module.wheels-metals.axe-evidence', type: 'evidence', title: 'Look at the blade', artifactLabel: 'Copper blade of Ötzi’s axe · South Tyrol Museum of Archaeology',
  body: 'This is the copper blade that Ötzi carried. It was cast, hammered and sharpened, and its metal came from southern Tuscany. This photograph shows the blade alone; its yew handle and leather binding are not in the picture.',
  mediaId: 'media.wheels-metals.iceman-axe', layout: 'stacked',
  scaleNote: 'Modern museum photograph of the blade alone. The museum dates the axe to about 3300–3100 BCE.',
  claimIds: ['claim.wheels-metals.axe-making', 'claim.wheels-metals.axe-tuscany'], sourceIds: ['source.wheels-metals.axe-photo', 'source.wheels-metals.iceman-equipment', 'source.wheels-metals.artioli-2017'],
};

export const wheelsMetalsWheelVisual: LessonModule = {
  id: 'module.wheels-metals.wheel-evidence', type: 'evidence', title: 'Find the planks and strips', artifactLabel: 'Ljubljana Marshes wheel and axle · City Museum of Ljubljana',
  body: 'The wheel lies broken in its case, with the oak axle beside it. Find the line where the two ash planks meet, and the raised oak strips running across them.',
  mediaId: 'media.wheels-metals.ljubljana-wheel', layout: 'stacked',
  scaleNote: 'Modern museum photograph. The wheel is about 70 cm across; a digging machine destroyed about a third of it just before it was found.',
  lookHere: [
    { label: 'The join between the planks', detail: 'A long crack-like line runs across the disc where the two ash planks were fitted together.', sourceIds: ['source.wheels-metals.velusek-2009'] },
    { label: 'Raised strips', detail: 'The strips across the planks are the oak pieces that locked them together.', sourceIds: ['source.wheels-metals.velusek-2009'] },
    { label: 'The axle end', detail: 'The thickened end of the axle shows where it fitted into a wheel.', sourceIds: ['source.wheels-metals.velusek-2009', 'source.wheels-metals.ljubljana-record'] },
  ],
  claimIds: ['claim.wheels-metals.ljubljana-construction', 'claim.wheels-metals.ljubljana-find'], sourceIds: ['source.wheels-metals.wheel-photo', 'source.wheels-metals.velusek-2009', 'source.wheels-metals.ljubljana-record'],
};

export const wheelsMetalsStandardVisual: LessonModule = {
  id: 'module.wheels-metals.standard-evidence', type: 'evidence', title: 'Follow the wagons', artifactLabel: 'The Standard of Ur, war side · British Museum 121201',
  body: 'Look at the bottom row. Follow the wagons from left to right: the first team walks, then the animals speed up until the last ones rear. Each wagon has solid wheels, like the Ljubljana wheel.',
  mediaId: 'media.wheels-metals.standard-of-ur', layout: 'stacked',
  scaleNote: 'Modern museum photograph of a panel about 50 cm long, made around 2550–2400 BCE. The museum calls the vehicles chariots; they have four wheels, so this lesson calls them wagons.',
  claimIds: ['claim.wheels-metals.ur-standard', 'claim.wheels-metals.kungas'], sourceIds: ['source.wheels-metals.standard-photo', 'source.wheels-metals.bm-standard', 'source.wheels-metals.bennett-2022'],
};

export const wheelsMetalsWheelCard: KnowledgeCard = {
  id: 'card.wheels-metals.ljubljana-wheel', title: 'The Ljubljana Marshes Wheel', category: 'artifact', cardClass: 'witness',
  date: { startYear: -3200, endYear: -3150, display: 'c. 3200 BCE', approximate: true }, place: 'Ljubljana Marshes · Slovenia',
  significance: 'One of the oldest wooden wheels ever found, made by a skilled wheelwright.',
  revealTitle: 'A wheel that needed a whole team', revealBody: 'Two ash planks from an old tree, four oak strips and a square hub fitted to an oak axle: this wheel shows how much skill one cart needed, and a later repair shows someone kept it running.',
  depictionLabel: 'Surviving wheel and axle · modern museum photograph',
  facts: ['It is about 5,150 years old.', 'Its two planks came from an ash tree more than 80 years old.', 'Four oak strips locked the planks together.', 'The square hub made the wheel and axle turn together.', 'It was found in 2002 and first mistaken for modern rubbish.'],
  lessonIds: ['lesson.technology.wheels-metals-and-work'], sourceIds: ['source.wheels-metals.velusek-2009', 'source.wheels-metals.ljubljana-record', 'source.wheels-metals.wheel-photo'],
  mediaId: 'media.wheels-metals.ljubljana-wheel', unlockLessonId: 'lesson.technology.wheels-metals-and-work',
  recallPrompt: 'What did one wooden wheel need before it could carry anything?',
};
