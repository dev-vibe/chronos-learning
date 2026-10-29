import type { KnowledgeCard, LessonModule, MediaAsset, Source } from '../../src/domains/contracts';
import { mediaLocator } from '../shared/media-locator';

const brief = 'docs/research/animals-herding-and-mobility.md#image-lifecycle';

export const animalsMediaSources: Source[] = [
  {
    id: 'source.animals.natural-earth-relief',
    title: 'Natural Earth 1:50m cross-blended hypsometric tints with shaded relief and water (HYP_50M_SR_W), with the Natural Earth II 1:50m raster as water mask',
    url: 'https://www.naturalearthdata.com/downloads/50m-raster-data/50m-cross-blend-hypso/',
    publisher: 'Natural Earth contributors',
    accessedOn: '2026-10-29',
    licenseOrUse: 'Public domain. Modern coastlines and relief cropped to 22 W–82 E, 20 S–56 N (inset 84 W–32 W, 42 S–12.7 N) and recoloured with the Akkad locator palette formula; orientation only, not ancient shorelines. Download hashes and render code recorded in the image lifecycle.',
    reviewStatus: 'reviewed',
  },
  {
    id: 'source.animals.ganj-dareh-coordinates',
    title: 'Ganj Dareh site record',
    url: 'https://xronos.ch/sites/23478',
    publisher: 'XRONOS chronological database',
    accessedOn: '2026-10-29',
    licenseOrUse: 'Factual coordinates 34.317 N, 47.500 E used to place one map marker; no content copied.',
    reviewStatus: 'reviewed',
  },
  {
    id: 'source.animals.takarkori-coordinates',
    title: 'Takarkori',
    url: 'https://en.wikipedia.org/wiki/Takarkori',
    publisher: 'Wikipedia',
    accessedOn: '2026-10-29',
    licenseOrUse: 'Factual coordinates 24.883 N, 10.333 E used to place one map marker; cross-checked against the Tadrart Acacus setting in Dunne et al. 2012.',
    reviewStatus: 'reviewed',
  },
];

const mapSourceIds = [
  'source.animals.natural-earth-relief',
  'source.animals.ganj-dareh-coordinates',
  'source.animals.takarkori-coordinates',
  'source.animals.hildebrand-2018-lothagam',
  'source.animals.kennedy-2023-mustatil',
  'source.animals.pitt-2019-cattle',
  'source.animals.yacobaccio-2021-camelids',
  'source.animals.wilkin-2021-yamnaya',
];

export const animalsMedia: MediaAsset[] = [
  {
    id: 'media.animals.ganj-dareh-hoofprints',
    locator: mediaLocator('media.animals.ganj-dareh-hoofprints'),
    alt: 'A rough reddish mud brick photographed on black. Three deep, two-toed hoofprints are pressed into its surface, with a fainter print on the left. A 15-centimetre scale bar runs below it.',
    depictionMode: 'evidence',
    depictionLabel: 'Surviving evidence · excavation photograph',
    rightsLabel: 'Daly et al. 2021, PNAS, Fig. 2B · CC BY 4.0 · cropped from the published figure',
    sourceIds: ['source.animals.daly-2021-ganj-dareh'],
    visualBriefRef: brief,
    reviewStatus: 'approved',
  },
  {
    id: 'media.animals.ganj-dareh-survival-chart',
    locator: mediaLocator('media.animals.ganj-dareh-survival-chart'),
    alt: 'Line chart of the share of Ganj Dareh goats still alive at each age. Female goats stay near 95 percent until one and a half years, then fall to about 74 percent and finally about 30 percent by two and a half to four years. Male goats fall faster: about 77 percent by one to one and a half years, about 25 percent by one and a half to two and a half years, and about 12 percent after that.',
    depictionMode: 'diagram',
    depictionLabel: 'Chart redrawn from published data · values approximate',
    rightsLabel: 'Chronos chart · data from Daly et al. 2021, PNAS, Fig. 2A, CC BY 4.0',
    sourceIds: ['source.animals.daly-2021-ganj-dareh'],
    visualBriefRef: brief,
    reviewStatus: 'approved',
  },
  {
    id: 'media.animals.herding-regions-map',
    locator: mediaLocator('media.animals.herding-regions-map'),
    alt: 'A map of Africa, Europe and western Asia in golden relief with blue seas. Red dots mark Ganj Dareh in western Iran, Takarkori in the Sahara, the mustatil near AlUla in northwest Arabia and Lothagam North in East Africa. Soft orange glows mark the Fertile Crescent, the Indus Valley, the Sahara and the western steppe north of the Black and Caspian Seas. An inset of South America shades the Andes.',
    depictionMode: 'map',
    depictionLabel: 'Evidence-led locator map · glows approximate, modern coasts for orientation',
    rightsLabel: 'Chronos deterministic map · Natural Earth, Public Domain',
    sourceIds: mapSourceIds,
    visualBriefRef: brief,
    reviewStatus: 'approved',
  },
];

export const animalsHoofprintsVisual: LessonModule = {
  id: 'module.animals.hoofprints-evidence',
  type: 'evidence',
  title: 'Hoofprints in a mud brick',
  artifactLabel: 'Mud brick from Ganj Dareh, western Iran',
  body: 'Look at the deep, two-part marks in the middle of the brick. Hoofed animals stepped into the mud while it was still soft, before it dried and went into a wall.',
  mediaId: 'media.animals.ganj-dareh-hoofprints',
  layout: 'side-by-side',
  scaleNote: 'The scale bar is 15 centimetres. The small drawing at the bottom right traces the hoof shapes.',
  claimIds: ['claim.animals.hoofprints-newborns'],
  sourceIds: ['source.animals.daly-2021-ganj-dareh'],
};

export const animalsSurvivalChartVisual: LessonModule = {
  id: 'module.animals.survival-chart',
  type: 'evidence',
  title: 'Which goats lived longer?',
  artifactLabel: 'Ganj Dareh goats, all building levels',
  body: 'Follow the two lines from left to right. Both start high. The male line drops sharply after the first year, while the female line stays high much longer. That gap is the herders’ choice: eat most young males, keep the females.',
  mediaId: 'media.animals.ganj-dareh-survival-chart',
  layout: 'stacked',
  scaleNote: 'Redrawn from the researchers’ published chart, so each value is approximate.',
  claimIds: ['claim.animals.ganj-dareh-management'],
  sourceIds: ['source.animals.daly-2021-ganj-dareh'],
};

export const animalsRegionsMapVisual: LessonModule = {
  id: 'module.animals.regions-map',
  type: 'historical-map',
  eyebrow: 'Place & landscape',
  title: 'Where this lesson goes',
  body: 'Red dots mark the four excavated sites in this lesson. Soft glows mark broader regions where herding began or spread. The inset shows the Andes in South America, far to the west.',
  mediaId: 'media.animals.herding-regions-map',
  periodLabel: 'c. 9000–2000 BCE',
  focusPlace: 'Herding regions from the Andes to the Indus',
  modernContext: 'Most places in this lesson are in Africa and western Asia, from the Sahara to the Indus Valley. The inset adds the Andes of South America.',
  accessibleSummary: 'A map of Africa, Europe and western Asia. Ganj Dareh is in the Zagros Mountains of western Iran, east of the Fertile Crescent. The Indus Valley is farther east in present-day Pakistan. Takarkori is in the Sahara in Libya. The mustatil near AlUla is in northwest Arabia, east of the Red Sea. Lothagam North is in East Africa, in Kenya. The western steppe lies north of the Black and Caspian Seas. An inset of South America marks the Andes.',
  compactLabel: 'Site dots and broad region glows · no routes or borders',
  coordinateNote: 'Natural Earth relief and modern coasts. Ganj Dareh and Takarkori markers use published site coordinates; Lothagam North and the AlUla mustatil are placed from the excavation reports’ descriptions. Markers are larger than the sites.',
  uncertaintyNote: 'Zones are broad and approximate. They show where the lesson’s evidence comes from, not the full area where people herded or exact places where herding began.',
  depictionStatus: 'illustrative-reconstruction',
  claimIds: ['claim.animals.several-regions', 'claim.animals.andean-camelids', 'claim.animals.sahara-herding-first', 'claim.animals.lothagam-cemetery', 'claim.animals.mustatil-offerings', 'claim.animals.steppe-milk'],
  sourceIds: mapSourceIds,
};

export const animalsHoofprintsCard: KnowledgeCard = {
  id: 'card.animals.ganj-dareh-hoofprints',
  title: 'Hoofprints of Ganj Dareh',
  category: 'artifact',
  cardClass: 'witness',
  date: { startYear: -8200, endYear: -7600, display: 'c. 8200–7600 BCE', approximate: true },
  place: 'Ganj Dareh, Zagros Mountains, western Iran',
  significance: 'A mud brick from one of the first places where people kept goats as herds.',
  revealTitle: 'Animals among the houses',
  revealBody: 'Hoofed animals walked across this brick while the mud was soft. Goat bones from the same village show people eating most young males and keeping the females to breed, about 1,000 years before the goats’ bodies began to change.',
  depictionLabel: 'Surviving evidence · excavation photograph',
  facts: [
    'Ganj Dareh was a village of mud-brick houses in the Zagros Mountains.',
    'Most male goats there were eaten before they were two and a half years old.',
    'Most female goats lived longer and gave birth in the village.',
    'Changes in goat bodies show up about 1,000 years later.',
  ],
  lessonIds: ['lesson.animals.domestication-and-pastoralism'],
  sourceIds: ['source.animals.daly-2021-ganj-dareh'],
  mediaId: 'media.animals.ganj-dareh-hoofprints',
  unlockLessonId: 'lesson.animals.domestication-and-pastoralism',
  recallPrompt: 'How can goat bones show that people were keeping a herd and not just hunting?',
};
