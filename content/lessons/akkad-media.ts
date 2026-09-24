import type { LessonModule, MediaAsset, Source } from '../../src/domains/contracts';
import { mediaLocator } from '../shared/media-locator';

export const akkadMediaSources: Source[] = [
  { id: 'source.akkad.map-relief', title: 'Natural Earth 1:50m Cross-blended Hypsometric Tints with shaded relief and water', url: 'https://www.naturalearthdata.com/downloads/50m-raster-data/50m-cross-blend-hypso/', publisher: 'Natural Earth contributors', accessedOn: '2026-09-22', licenseOrUse: 'Public domain modern terrain, coastline and water raster. Download ZIP and TIFF hashes, crop and projection recorded in the Akkad image lifecycle. Not a reconstruction of ancient terrain or shoreline.', reviewStatus: 'reviewed' },
  { id: 'source.akkad.map-rivers', title: 'Natural Earth 1:50m rivers and lake centerlines', url: 'https://www.naturalearthdata.com/downloads/50m-physical-vectors/50m-rivers-lake-centerlines/', publisher: 'Natural Earth contributors', accessedOn: '2026-09-22', licenseOrUse: 'Public domain vector geography, repository tag v5.1.2. Reviewed Tigris/Euphrates/Shatt al Arab segments; generalized modern courses, not ancient channels. Exact data hash in map reference-lineage.json.', reviewStatus: 'reviewed' },
  { id: 'source.akkad.map-leilan', title: 'Tell Leilan place record', url: 'https://oracc.museum.upenn.edu/geonames/cbd/qpn/T.html', publisher: 'Oracc / Pleiades', accessedOn: '2026-09-22', licenseOrUse: 'Representative coordinates used as a factual point, cross-checked against Yale Tell Leilan excavation locator. No map or imagery copied.', reviewStatus: 'reviewed' },
  { id: 'source.akkad.map-urkesh', title: 'Urkesh place record', url: 'https://oracc.museum.upenn.edu/geonames/cbd/qpn/x000003150.html', publisher: 'Oracc / Pleiades', accessedOn: '2026-09-22', licenseOrUse: 'Representative Tell Mozan/Urkesh coordinates used as a factual point, cross-checked against Getty TGN. No map or imagery copied.', reviewStatus: 'reviewed' },
  { id: 'source.akkad.map-uruk', title: 'Uruk place record', url: 'https://oracc.museum.upenn.edu/geonames/cbd/qpn/x000003180.html', publisher: 'Oracc / Pleiades', accessedOn: '2026-09-22', licenseOrUse: 'Representative Uruk coordinates used as a factual point, cross-checked against UNESCO nomination center coordinates. No map or imagery copied.', reviewStatus: 'reviewed' },
  {
    id: 'source.akkad.stele-photo',
    title: 'Victory Stele of Naram-Sin, Louvre SB 4 / AS 6065 — photograph',
    url: 'https://commons.wikimedia.org/wiki/File:St%C3%A8le_de_Naram-Sin_-_Mus%C3%A9e_du_Louvre_Antiquit%C3%A9s_orientales_SB_4_;_AS_6065.jpg',
    publisher: 'Shonagon / Wikimedia Commons',
    accessedOn: '2026-09-22',
    licenseOrUse: 'Photograph dated 2022-09-27; CC0 1.0, https://creativecommons.org/publicdomain/zero/1.0/. Full frame resized to 960 px wide and JPEG-compressed without retouching. Surviving Louvre object SB 4; modern museum background is not ancient setting. Complete lineage in docs/research/akkad-and-the-problem-of-empire.md#image-lifecycle.',
    reviewStatus: 'reviewed',
  },
  {
    id: 'source.akkad.met-seal-example',
    title: 'Cylinder seal and modern impression, 1999.325.9',
    url: 'https://www.metmuseum.org/art/collection/search/327605',
    publisher: 'The Metropolitan Museum of Art',
    accessedOn: '2026-09-22',
    licenseOrUse: 'Open Access Public Domain museum image used unchanged. This Akkadian-period seal and its modern impression explain the technique; neither is a Tar’am-Agade sealing or evidence from Urkesh.',
    reviewStatus: 'reviewed',
  },
];

export const akkadMedia: MediaAsset[] = [
  {
    id: 'media.akkad.locator',
    locator: mediaLocator('media.akkad.locator'),
    alt: 'A map of West Asia places Uruk in southern Mesopotamia near the Persian Gulf and Tell Leilan and Urkesh close together farther north. The Mediterranean is to the west; an inset locates the region beside Europe and Africa. No ancient empire border or point for Agade is shown.',
    depictionMode: 'map',
    depictionLabel: 'Illustrated locator · modern geography',
    rightsLabel: 'Chronos deterministic map · Natural Earth geography, Public Domain · site points from Oracc/Pleiades',
    sourceIds: ['source.akkad.map-relief', 'source.akkad.map-rivers', 'source.akkad.map-leilan', 'source.akkad.map-urkesh', 'source.akkad.map-uruk'],
    visualBriefRef: 'docs/research/akkad-and-the-problem-of-empire.md#image-lifecycle',
    reviewStatus: 'approved',
  },
  {
    id: 'media.akkad.naram-sin-stele',
    locator: mediaLocator('media.akkad.naram-sin-stele'),
    alt: 'A tall broken stone relief shows a much larger bow-carrying ruler above rows of soldiers and defeated people. Star-like disks and a column of writing appear near the top.',
    depictionMode: 'evidence',
    depictionLabel: 'Surviving royal relief · modern museum photograph',
    rightsLabel: 'Shonagon · 2022 · CC0 1.0 · full frame resized and compressed',
    sourceIds: ['source.akkad.stele-photo', 'source.akkad.louvre-stele'],
    visualBriefRef: 'docs/research/akkad-and-the-problem-of-empire.md#image-lifecycle',
    reviewStatus: 'approved',
  },
  {
    id: 'media.akkad.seal-example',
    locator: mediaLocator('media.akkad.seal-example'),
    alt: 'An Akkadian-period cylinder seal appears as a small dark upright object beside a long gray modern impression of its carved design. This is a museum example, not a find from Urkesh.',
    depictionMode: 'evidence',
    depictionLabel: 'Different Akkadian seal · modern impression for comparison',
    rightsLabel: 'The Metropolitan Museum of Art · Open Access Public Domain',
    sourceIds: ['source.akkad.met-seal-example'],
    visualBriefRef: 'docs/research/akkad-and-the-problem-of-empire.md#image-lifecycle',
    reviewStatus: 'approved',
  },
];

export const akkadLocatorVisual: LessonModule = {
  id: 'module.akkad.locator',
  type: 'historical-map',
  eyebrow: 'Place & landscape',
  title: 'Uruk, Leilan and Urkesh',
  body: 'Uruk lies in southern Mesopotamia. Tell Leilan and Urkesh are much farther north and close to each other. The distance helps explain why a victory claim alone could not show how rulers kept power in every place.',
  mediaId: 'media.akkad.locator',
  periodLabel: 'c. 2350–2150 BCE',
  focusPlace: 'Mesopotamia and neighboring regions',
  modernContext: 'This map uses modern geography to locate sites in West Asia, including present-day Iraq and Syria. The inset shows the wider area beside Europe and Africa; its box marks the enlarged view, not an empire.',
  accessibleSummary: 'Uruk is toward the south of the main map near the Persian Gulf. Tell Leilan and Urkesh are close together much farther north. The Mediterranean is to the west, and the Tigris and Euphrates run through the region. The small inset locates the view within West Asia beside Europe and northern Africa. There is no Akkadian border or dot for the still-unlocated city of Agade.',
  compactLabel: 'Modern site locations and generalized rivers · no empire boundary',
  coordinateNote: 'Natural Earth modern relief and river data; representative site points from Oracc/Pleiades, cross-checked with Yale, Getty and UNESCO. Points do not mark settlement extent.',
  uncertaintyNote: 'Rivers and shorelines changed in antiquity. The present-day courses and coast help orient us, not reconstruct Akkadian geography. Agade is named in records but has not been securely located, so it is unmarked.',
  depictionStatus: 'illustrative-reconstruction',
  claimIds: ['claim.akkad.capital-location', 'claim.akkad.winning-and-governing'],
  sourceIds: ['source.akkad.map-relief', 'source.akkad.map-rivers', 'source.akkad.map-leilan', 'source.akkad.map-urkesh', 'source.akkad.map-uruk', 'source.akkad.capital-review'],
};

export const akkadSteleVisual: LessonModule = {
  id: 'module.akkad.stele-evidence',
  type: 'evidence',
  title: 'Read the carved scene',
  artifactLabel: 'Victory Stele of Naram-Sin · Louvre SB 4',
  body: 'Find the largest figure, then follow the soldiers and defeated people below him. The artist makes the ruler the center of a violent victory story. What can that arrangement tell you about his message? What can it not tell you about ruling a city afterward?',
  mediaId: 'media.akkad.naram-sin-stele',
  layout: 'stacked',
  scaleNote: 'Modern photograph of the surviving stone. Much of its original Akkadian writing is lost. The column of writing at upper right was added after the stele was taken to Susa; it belongs to a later event.',
  claimIds: ['claim.akkad.stele-image', 'claim.akkad.stele-afterlife'],
  sourceIds: ['source.akkad.louvre-stele', 'source.akkad.stele-photo'],
};

export const akkadSealExampleVisual: LessonModule = {
  id: 'module.akkad.seal-example',
  type: 'evidence',
  title: 'How a cylinder seal leaves a mark',
  artifactLabel: 'A different Akkadian-period seal · Met 1999.325.9',
  body: 'A cylinder seal is rolled across soft clay to leave a repeated design. This museum image places a real seal next to a modern impression made from it. It helps us picture what an impression is, but neither object came from Urkesh or names Tar’am-Agade.',
  mediaId: 'media.akkad.seal-example',
  layout: 'stacked',
  scaleNote: 'The gray strip is a modern impression of this Met seal. The sealings naming Tar’am-Agade were excavated at Urkesh; they are different objects.',
  claimIds: ['claim.akkad.seal-example'],
  sourceIds: ['source.akkad.met-seal-example'],
};
