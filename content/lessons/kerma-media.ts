import type { LessonModule, MediaAsset, Source } from '../../src/domains/contracts';
import { mediaLocator } from '../shared/media-locator';

export const kermaMediaSources: Source[] = [
  { id: 'source.kerma.deffufa-photo', title: 'Western Deffufa — Kerma, photograph', url: 'https://commons.wikimedia.org/wiki/File:Western_Deffufa_-_Kerma.jpg', publisher: 'Walter Callens / Wikimedia Commons', accessedOn: '2026-09-16', licenseOrUse: 'CC BY 2.0, https://creativecommons.org/licenses/by/2.0/. Photograph taken 2009-03-26; Flickr license confirmed by FlickreviewR on 2012-04-24. Full frame resized and compressed; no retouching. Modern view includes the conserved site, not an untouched ancient building.', reviewStatus: 'reviewed' },
  { id: 'source.kerma.sennuwy-photo', title: 'Lady Sennuwy, MFA 14.720, museum photograph', url: 'https://commons.wikimedia.org/wiki/File:Testupload_Boston_Museum_of_Fine_Arts_Egyptology_348.JPG', publisher: 'Marcus Cyron / Wikimedia Commons', accessedOn: '2026-09-16', licenseOrUse: 'CC BY 3.0, https://creativecommons.org/licenses/by/3.0/. Own-work photograph taken 2012-07-21. Cropped around the visible figure and inscribed base, resized and compressed; no retouching. Modern Boston museum display, not the Kerma excavation context.', reviewStatus: 'reviewed' },
  { id: 'source.kerma.map-style', title: 'Chronos Nile corridor illustrated map — style reference', url: 'https://commons.wikimedia.org/wiki/File:Ancient_Egypt_main_map.png', publisher: 'Chronos; underlying Egypt reference by Jeff Dahl', accessedOn: '2026-09-15', licenseOrUse: 'CC BY-SA 3.0. Existing Chronos Nile illustration supplied only for visual style; its Jeff Dahl reference and transformation are recorded in docs/research/the-nile-and-an-early-egyptian-state-map.md. No Egyptian site positions or labels copied. New illustrated locator distributed under CC BY-SA 3.0 with attribution.', reviewStatus: 'reviewed' },
  { id: 'source.kerma.met-beaker', title: 'Classic Kerma Beaker, 20.2.45', url: 'https://www.metmuseum.org/art/collection/search/545772', publisher: 'The Metropolitan Museum of Art', accessedOn: '2026-09-15', licenseOrUse: 'Public Domain / Met Open Access CC0. Object 545772, accession 20.2.45: handmade pottery, ca. 1802–1640 BCE, height 10.8 cm, found at Abydos Tomb 525 in Egypt. Original photograph cropped only in empty background and resized/compressed; no object retouching. Exact workshop and maker are not identified.', reviewStatus: 'reviewed' },
  { id: 'source.kerma.map-relief', title: 'Natural Earth 1:50m Cross-blended Hypsometric Tints with shaded relief and water', url: 'https://www.naturalearthdata.com/downloads/50m-raster-data/50m-cross-blend-hypso/', publisher: 'Natural Earth contributors', accessedOn: '2026-09-15', licenseOrUse: 'Public domain geographic raster. HYP_50M_SR_W crop and full-Africa inset; website version 3.2.0, archive version 2.0.0, exact hash in reference-lineage.json. Modern terrain/coastlines for orientation, not reconstructed ancient vegetation.', reviewStatus: 'reviewed' },
  { id: 'source.kerma.map-river', title: 'Natural Earth 1:50m rivers and lake centerlines', url: 'https://www.naturalearthdata.com/downloads/50m-physical-vectors/50m-rivers-lake-centerlines/', publisher: 'Natural Earth contributors', accessedOn: '2026-09-15', licenseOrUse: 'Public domain vector geography, repository tag v5.1.2. Reviewed Nile, White/Blue Nile and delta branches including connecting lake centerlines; modern canals omitted. Present-day generalized courses, not ancient-channel reconstruction.', reviewStatus: 'reviewed' },
  { id: 'source.kerma.map-site', title: 'Kerma — UNESCO Tentative List 6594', url: 'https://whc.unesco.org/en/tentativelists/6594/', publisher: 'UNESCO World Heritage Centre / Sudanese National Commission for Education, Science and Culture', accessedOn: '2026-09-15', licenseOrUse: 'Coordinate facts from the 2022-02-01 submission: N19 36 2.89 E30 24 35.03. Representative site point, not a boundary. Description identifies the Western Deffufa as a substantial mud-brick temple; conservation/restoration passages qualify present appearance (reviewed 2026-09-16). No UNESCO photograph or map reproduced.', reviewStatus: 'reviewed' },
];

const mapSources = ['source.kerma.map-relief', 'source.kerma.map-river', 'source.kerma.map-site', 'source.kerma.map-style', 'source.kerma.isotopes-2008'];
const brief = 'docs/research/kerma-and-middle-nile.md#image-lifecycle';

export const kermaMedia: MediaAsset[] = [
  { id: 'media.kerma.met-beaker', locator: mediaLocator('media.kerma.met-beaker'), alt: 'A flaring pottery beaker with a dark upper body and interior, a red lower body, and an irregular pale band between them. Chips and a crack are visible along its rim.', depictionMode: 'evidence', depictionLabel: 'Surviving vessel · modern museum photograph', rightsLabel: 'The Metropolitan Museum of Art · Rogers Fund, 1920 · Public Domain / CC0 · background cropped, resized and compressed', sourceIds: ['source.kerma.met-beaker'], visualBriefRef: brief, reviewStatus: 'approved' },
  { id: 'media.kerma.nile-locator', locator: mediaLocator('media.kerma.nile-locator'), alt: 'Illustrated locator of northeastern Africa. Kerma lies beside the Nile in present-day Sudan, south of Egypt and the Mediterranean Sea. A whole-Africa inset outlines the northeastern region enlarged in the main map.', depictionMode: 'map', depictionLabel: 'Illustrated locator · modern geography', rightsLabel: 'Chronos illustrated edit · Natural Earth geography, Public Domain · Nile style reference after Jeff Dahl · CC BY-SA 3.0', sourceIds: mapSources, visualBriefRef: brief, reviewStatus: 'approved' },
  { id: 'media.kerma.western-deffufa', locator: mediaLocator('media.kerma.western-deffufa'), alt: 'A wide view of the Western Deffufa at Kerma. Tall, weathered mud-brick walls rise behind lower rectangular remains and modern conserved surfaces in a dry landscape.', depictionMode: 'evidence', depictionLabel: 'Surviving monument · modern site photograph', rightsLabel: 'Walter Callens · 2009 · CC BY 2.0 · full frame resized and compressed', sourceIds: ['source.kerma.deffufa-photo', 'source.kerma.map-site'], visualBriefRef: brief, reviewStatus: 'approved' },
  { id: 'media.kerma.sennuwy', locator: mediaLocator('media.kerma.sennuwy'), alt: 'A seated dark-stone statue of Lady Sennuwy in a museum display. She wears a long wig, rests her hands on her thighs, and sits above an inscribed base. Repaired fractures remain visible.', depictionMode: 'evidence', depictionLabel: 'Surviving Egyptian statue · modern museum photograph', rightsLabel: 'Marcus Cyron · 2012 · CC BY 3.0 · cropped around the figure and base, resized and compressed', sourceIds: ['source.kerma.sennuwy-photo', 'source.kerma.sennuwy', 'source.kerma.reisner-context'], visualBriefRef: brief, reviewStatus: 'approved' },
];

export const kermaVisualModules: Record<string, LessonModule> = {
  deffufa: {
    id: 'module.kerma.deffufa-evidence', type: 'evidence', title: 'Building with mud brick', artifactLabel: 'Western Deffufa · Kerma city',
    body: 'This large mud-brick monument, known as the Western Deffufa, stands above the surrounding ruins. Archaeologists identify it as a temple. Producing and carrying bricks, bringing workers together and supplying them with food made building on this scale possible.',
    mediaId: 'media.kerma.western-deffufa', layout: 'stacked',
    scaleNote: 'A modern photograph of the surviving site, which has received conservation and restoration. It does not show the complete ancient building.',
    claimIds: ['claim.kerma.deffufa', 'claim.kerma.work-and-support'], sourceIds: ['source.kerma.map-site', 'source.kerma.deffufa-photo', 'source.kerma.city-project'],
  },
  sennuwy: {
    id: 'module.kerma.sennuwy-evidence', type: 'evidence', title: 'An Egyptian sculpture at Kerma', artifactLabel: 'Lady Sennuwy · MFA Boston 14.720',
    body: 'This is the statue found at Kerma: a seated woman with a long wig and hands resting on her thighs. It was made in Egypt. Finding it in Kerma does not make it a portrait of a Kerma ruler; it is one of the objects that moved between communities.',
    mediaId: 'media.kerma.sennuwy', layout: 'side-by-side',
    scaleNote: 'Modern museum display. The statue was reassembled from fragments; cracks remain visible. Its precise journey from Egypt to Kerma is uncertain.',
    claimIds: ['claim.kerma.sennuwy'], sourceIds: ['source.kerma.sennuwy', 'source.kerma.sennuwy-photo', 'source.kerma.reisner-context'],
  },
  map: {
    id: 'module.kerma.nile-locator', type: 'historical-map', eyebrow: 'Place & landscape', title: 'Kerma in northeastern Africa',
    body: 'Locate Kerma on the Nile south of Egypt. The same river connected different communities and kingdoms; this map does not draw the boundaries of their rule.',
    mediaId: 'media.kerma.nile-locator', periodLabel: 'c. 2500–1500 BCE', focusPlace: 'Kerma',
    modernContext: 'Kerma is in northeastern Africa, in present-day Sudan south of Egypt. The box on the whole-Africa inset marks the region enlarged in the main map.',
    accessibleSummary: 'The whole-Africa inset places the main map in the continent’s northeast. In the main map, the Mediterranean Sea is at the top, Egypt below it, and Sudan farther south. Kerma is marked beside the Nile in Sudan, south of Egypt. The Nile has a large bend through northern Sudan. No ancient kingdom boundary is shown.',
    compactLabel: 'Modern geography for orientation · inset box marks the enlarged view',
    coordinateNote: 'Natural Earth relief and river data; Kerma’s representative point comes from Sudan’s UNESCO submission. A published archaeological location map cross-checks the broad Nile setting. The point does not trace the city’s extent.',
    uncertaintyNote: 'Modern countries, coastlines, terrain and generalized river courses help locate the lesson. Ancient channels and landscapes changed. Terrain colors do not reconstruct ancient vegetation; the inset box is not a political border.',
    depictionStatus: 'illustrative-reconstruction', claimIds: ['claim.kerma.location', 'claim.kerma.locator-geography'], sourceIds: mapSources,
  },
  beaker: {
    id: 'module.kerma.beaker-evidence', type: 'evidence', title: 'Shape and finish', artifactLabel: 'Classic Kerma beaker · found in Egypt · Met 20.2.45',
    body: 'Follow the widening sides up to the dark rim. Then compare the dark upper surface with the red lower body and the irregular pale band between them. These are features of a real surviving vessel.',
    mediaId: 'media.kerma.met-beaker', layout: 'stacked',
    scaleNote: 'The vessel is 10.8 centimetres tall. This museum photograph has been cropped only to remove empty background; the object’s shape, surface and damage are unchanged. Its findspot is Abydos in Egypt, not Kerma city.',
    claimIds: ['claim.kerma.met-beaker'], sourceIds: ['source.kerma.met-beaker'],
  },
};
