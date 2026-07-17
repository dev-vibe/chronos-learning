import type { Claim, KnowledgeCard, Lesson, MediaAsset, Source, UnderstandingPrompt } from '../../src/domains/contracts';
import type { AuthoredContentModule } from '../assemble';
import { mediaLocator } from '../shared/media-locator';

export const urukSources: Source[] = [
  { id: 'source.met.uruk', title: 'Uruk: First City of the Ancient World', url: 'https://www.metmuseum.org/toah/hd/uruk/hd_uruk.htm', publisher: 'The Metropolitan Museum of Art', accessedOn: '2026-07-13', licenseOrUse: 'Institutional educational reference; runtime reuse not asserted', reviewStatus: 'review-required' },
  { id: 'source.britannica.uruk', title: 'Uruk', url: 'https://www.britannica.com/place/Uruk', publisher: 'Encyclopaedia Britannica', accessedOn: '2026-07-13', licenseOrUse: 'Editorial reference; runtime reuse not asserted', reviewStatus: 'review-required' },
  { id: 'source.unesco.ahwar', title: 'The Ahwar of Southern Iraq', url: 'https://whc.unesco.org/en/list/1481/', publisher: 'UNESCO World Heritage Centre', accessedOn: '2026-07-14', licenseOrUse: 'Property description available under CC-BY-SA IGO 3.0', reviewStatus: 'reviewed' },
  { id: 'source.unesco.ahwar-maps', title: 'The Ahwar of Southern Iraq: Maps and Geographical Data', url: 'https://whc.unesco.org/en/list/1481/maps/', publisher: 'UNESCO World Heritage Centre', accessedOn: '2026-07-14', licenseOrUse: 'Official World Heritage coordinates and public State Party nomination-map reference', reviewStatus: 'reviewed' },
  { id: 'source.ur.southern-mesopotamia', title: 'Southern Mesopotamia, Figure 28.1', url: 'https://people.bu.edu/chamley/HSFref/Ur2012CompanionArchANE.pdf', publisher: 'Jason Ur, in A Companion to the Archaeology of the Ancient Near East (Blackwell)', accessedOn: '2026-07-14', licenseOrUse: 'Copyrighted scholarly publication; used as a non-distributed geographic reference only', reviewStatus: 'reviewed' },
  { id: 'source.archatlas.uruk-ur', title: 'Uruk and Ur', url: 'https://www.archatlas.org/atlas/visualisations/sitesfromsatellites/urukur/', publisher: 'ArchAtlas / Andrew Sherratt', accessedOn: '2026-07-14', licenseOrUse: 'Cited scholarly web reference; NASA imagery credited by the publisher', reviewStatus: 'reviewed' }
];

export const urukClaims: Claim[] = [
  { id: 'claim.uruk.administration', statement: 'Proto-cuneiform tablets and seals provide evidence for organized accounting and administration at Uruk.', kind: 'interpretation', certainty: 'high', sourceIds: ['source.met.uruk'], reviewStatus: 'editorial-review-required' },
  { id: 'claim.uruk.city-life', statement: 'City-scale life created opportunities for specialization while also requiring coordinated labor and creating unequal burdens.', kind: 'interpretation', certainty: 'moderate', sourceIds: ['source.met.uruk', 'source.britannica.uruk'], reviewStatus: 'editorial-review-required' },
  { id: 'claim.uruk.wetland-landscape', statement: 'Uruk, Ur, and Eridu developed on the shifting alluvial and wetland landscape of southern Mesopotamia; exact ancient river channels, marsh limits, and shoreline positions remain approximate.', kind: 'reconstruction', certainty: 'moderate', sourceIds: ['source.unesco.ahwar', 'source.ur.southern-mesopotamia', 'source.archatlas.uruk-ur'], reviewStatus: 'editorial-review-required' }
];

export const urukMedia: MediaAsset[] = [
  { id: 'media.uruk.reconstruction', locator: mediaLocator('media.uruk.reconstruction'), alt: 'Aerial evidence-based reconstruction of ancient Uruk with a monumental precinct at its center', depictionMode: 'evidence-based-reconstruction', depictionLabel: 'Evidence-based reconstruction — provenance and historical review required', sourceIds: ['source.met.uruk'], visualBriefRef: 'docs/architecture/uruk-vertical-slice.md#evidence-and-reconstruction-treatment', reviewStatus: 'provenance-review-required' },
  { id: 'media.uruk.site', locator: mediaLocator('media.uruk.site'), alt: 'Archaeological remains at the site of Uruk in the modern landscape', depictionMode: 'evidence', depictionLabel: 'Archaeological site photograph — provenance review required', sourceIds: ['source.met.uruk'], visualBriefRef: 'docs/architecture/uruk-vertical-slice.md#evidence-and-reconstruction-treatment', reviewStatus: 'provenance-review-required' },
  { id: 'media.uruk.clay-envelope', locator: mediaLocator('media.uruk.clay-envelope'), alt: 'Clay accounting envelope and tablet with impressed marks', depictionMode: 'evidence', depictionLabel: 'Surviving clay record — object identification and provenance review required', sourceIds: ['source.met.uruk'], visualBriefRef: 'docs/architecture/uruk-vertical-slice.md#evidence-and-reconstruction-treatment', reviewStatus: 'provenance-review-required' },
  { id: 'media.uruk.southern-mesopotamia-map', locator: mediaLocator('media.uruk.southern-mesopotamia-map'), alt: 'Illustrated map of the southern Mesopotamian plain showing the relative positions of Uruk, Ur, and Eridu, the Tigris and Euphrates river system, the Zagros highlands, and an approximate ancient Gulf and wetland margin', depictionMode: 'map', depictionLabel: 'Illustrative historical map — coordinate-verified cities with approximate ancient waterways and wetland margin', sourceIds: ['source.unesco.ahwar-maps', 'source.ur.southern-mesopotamia', 'source.archatlas.uruk-ur'], visualBriefRef: 'docs/research/uruk-southern-mesopotamia-map.md', reviewStatus: 'provenance-review-required' }
];

export const urukPrompts: UnderstandingPrompt[] = [
  { id: 'prompt.uruk.administration-evidence', lessonId: 'lesson.uruk.first-city', kind: 'supported-selection', question: 'Which evidence best supports organized administration at Uruk?', explanation: 'Administrative tablets and seals are surviving evidence of accounting; a reconstruction is an interpretation, not direct evidence.', required: true, options: [{ id: 'option.uruk.reconstruction', label: 'A reconstruction painting of the city' }, { id: 'option.uruk.tablets', label: 'Administrative tablets and cylinder seals' }, { id: 'option.uruk.later-story', label: 'A later story about Uruk’s walls' }] },
  { id: 'prompt.uruk.opportunity-and-cost', lessonId: 'lesson.uruk.first-city', kind: 'concise-explanation', question: 'Name one opportunity and one cost or challenge of life in Uruk, using lesson evidence.', explanation: 'A sincere answer connects an opportunity such as specialization with a challenge such as coordinated labor, inequality, crowding, or resource pressure.', required: true, minimumResponseLength: 20 }
];

export const urukLesson: Lesson = {

    status: 'published', place: 'Southern Mesopotamia', heroMediaId: 'media.uruk.reconstruction', heroLabel: 'Evidence-based reconstruction', heroCaption: 'Interpretation informed by evidence—not a surviving view of Uruk.',

    id: 'lesson.uruk.first-city', legacyAliases: ['uruk'], title: 'Uruk: Life in an Early City', masthead: 'c. 3200 BCE', chronology: { startYear: -3500, endYear: -3000, display: 'approximately 3500–3000 BCE', approximate: true }, significance: 'Uruk’s emergence as a major city around 3200 BCE shows how city-scale coordination changed human life.',

    sectionIdsRequired: ['section.uruk.masthead', 'section.uruk.opening-city-question', 'section.uruk.water-food-and-labor', 'section.uruk.the-built-city', 'section.uruk.tablets-and-administration', 'section.uruk.evidence-and-reconstruction', 'section.uruk.check-and-complete'],

    sections: [

      { id: 'section.uruk.masthead', heading: 'Uruk around 3200 BCE', purpose: 'Begin with place and scale', modules: [{ id: 'module.uruk.city-glance', type: 'knowledge', eyebrow: 'City at a glance', title: 'Thousands of lives, one shared place', body: 'Uruk grew into a major southern Mesopotamian city where food, work, worship, and record-keeping had to be coordinated at a new scale.', items: [{ label: 'Place', detail: 'Southern Mesopotamia' }, { label: 'Chronology', detail: 'c. 3200 BCE' }, { label: 'Big idea', detail: 'Coordination changed city life' }], claimIds: ['claim.uruk.city-life'], sourceIds: ['source.met.uruk'] }, {

        id: 'module.uruk.southern-mesopotamia-map', type: 'historical-map', eyebrow: 'Place & landscape', title: 'A city shaped by water',

        body: 'Uruk stood on the southern Mesopotamian plain, where rivers, channels, wetlands, and dry ground shifted over generations. Its position connected fields and settlements while demanding constant coordination around water.',

        mediaId: 'media.uruk.southern-mesopotamia-map', periodLabel: 'c. 3200 BCE', focusPlace: 'Uruk', modernContext: 'Near modern Warka, Iraq',

        accessibleSummary: 'Uruk lies northwest of Ur and Eridu on the southern Mesopotamian plain. The Euphrates system runs along the western side, the Tigris system lies farther east toward the Zagros highlands, and a shifting wetland and Gulf zone lies to the southeast.',

        compactLabel: 'Illustrative map · ancient waterways approximate',

        coordinateNote: 'Uruk, Ur, and Eridu are placed using official UNESCO World Heritage coordinates.',

        uncertaintyNote: 'City locations follow UNESCO World Heritage coordinates. Ancient river channels, marshes, and the Gulf shoreline shifted over time and are shown approximately.',

        depictionStatus: 'illustrative-reconstruction', claimIds: ['claim.uruk.wetland-landscape'], sourceIds: ['source.unesco.ahwar', 'source.unesco.ahwar-maps', 'source.ur.southern-mesopotamia', 'source.archatlas.uruk-ur'],

      }] },

      { id: 'section.uruk.opening-city-question', heading: 'What makes a city?', purpose: 'Opening city question', modules: [{ id: 'module.uruk.city-question', type: 'prose', body: 'What changes when thousands of people live and work together—and how can historians recognize those changes in the traces people leave behind?', claimIds: [], sourceIds: [] }, { id: 'module.uruk.scene', type: 'scene', title: 'Explore the scene', body: 'Use this reconstruction as a question-making tool. Each feature is an interpretation informed by evidence, not a surviving view.', mediaId: 'media.uruk.reconstruction', hotspots: [{ label: 'Monumental precinct', detail: 'Large shared buildings point to coordinated construction and ritual life.' }, { label: 'Dense neighborhoods', detail: 'Mudbrick homes placed many households close together.' }, { label: 'Water routes', detail: 'Canals and waterways connected fields, food, and movement.' }], claimIds: ['claim.uruk.city-life'], sourceIds: ['source.met.uruk'] }] },

      { id: 'section.uruk.water-food-and-labor', heading: 'Water, food, and labor', purpose: 'How the city kept moving', modules: [{ id: 'module.uruk.city-systems', type: 'knowledge', eyebrow: 'Inline knowledge', title: 'A city is a system', body: 'Irrigation and surplus supported specialized work, while coordination could distribute benefits and burdens unevenly.', items: [{ label: 'Water', detail: 'Canals carried water toward fields and settlements.' }, { label: 'Food', detail: 'Surplus grain could support people doing other work.' }, { label: 'Labor', detail: 'Large projects required planning and many hands.' }], claimIds: ['claim.uruk.city-life'], sourceIds: ['source.met.uruk', 'source.britannica.uruk'] }] },

      { id: 'section.uruk.the-built-city', heading: 'The built city', purpose: 'Read architecture as a clue', modules: [{ id: 'module.uruk.built-city', type: 'knowledge', eyebrow: 'Look closer', title: 'Buildings preserve choices', body: 'Mudbrick buildings and monumental precincts reveal large-scale construction, while much of everyday city life remains incomplete in the record.', items: [{ label: 'Monumental', detail: 'Shared precincts demanded materials, planning, and labor.' }, { label: 'Everyday', detail: 'Homes and lanes held ordinary lives that left fewer traces.' }, { label: 'Uncertain', detail: 'A plan of walls cannot tell us exactly how every space felt or functioned.' }], claimIds: [], sourceIds: ['source.met.uruk'] }] },

      { id: 'section.uruk.tablets-and-administration', heading: 'Tablets and administration', purpose: 'Museum evidence', modules: [{ id: 'module.uruk.tablet-evidence', type: 'evidence', title: 'Records pressed into clay', artifactLabel: 'Surviving evidence', body: 'Clay records and seals help historians trace accounting and administration. The object survives; what a specific mark meant still requires expert interpretation. Uruk connects earlier farming communities to a world where records and ideas could travel beyond one person’s memory.', mediaId: 'media.uruk.clay-envelope', claimIds: ['claim.uruk.administration'], sourceIds: ['source.met.uruk'] }] },

      { id: 'section.uruk.evidence-and-reconstruction', heading: 'Evidence and reconstruction', purpose: 'Separate what survives from what is inferred', modules: [{ id: 'module.uruk.site-evidence', type: 'evidence', title: 'The city beneath the landscape', artifactLabel: 'Archaeological context', body: 'The surviving site is direct archaeological context. The cinematic city above is a reconstruction that assembles evidence into a possible view; it is not a photograph of the past.', mediaId: 'media.uruk.site', claimIds: ['claim.uruk.administration'], sourceIds: ['source.met.uruk'] }] },

      { id: 'section.uruk.check-and-complete', heading: 'World Check', purpose: 'Use evidence to explain', modules: [{ id: 'module.uruk.prompt-admin', type: 'prompt', promptId: 'prompt.uruk.administration-evidence', claimIds: [], sourceIds: [] }, { id: 'module.uruk.prompt-cost', type: 'prompt', promptId: 'prompt.uruk.opportunity-and-cost', claimIds: [], sourceIds: [] }] },

    ],

    claimIds: ['claim.uruk.administration', 'claim.uruk.city-life', 'claim.uruk.wetland-landscape'], sourceIds: ['source.met.uruk', 'source.britannica.uruk', 'source.unesco.ahwar', 'source.unesco.ahwar-maps', 'source.ur.southern-mesopotamia', 'source.archatlas.uruk-ur'], mediaIds: ['media.uruk.reconstruction', 'media.uruk.site', 'media.uruk.clay-envelope', 'media.uruk.southern-mesopotamia-map'], promptIds: ['prompt.uruk.administration-evidence', 'prompt.uruk.opportunity-and-cost'],

  };

export const urukCards: KnowledgeCard[] = [
  { id: 'card.place.uruk', title: 'Uruk', category: 'place', cardClass: 'foundation', date: { startYear: -3500, endYear: -3000, display: 'c. 3200 BCE', approximate: true }, place: 'Southern Mesopotamia', significance: 'A major early city where evidence reveals new scales of building, work, and administration.', revealTitle: 'A place worth remembering', revealBody: 'You earned Uruk by using evidence to explain how early city life changed human coordination.', depictionLabel: 'Evidence-based reconstruction', facts: ['Major city by about 3200 BCE', 'Located in southern Mesopotamia', 'Administrative tablets preserve accounting evidence'], lessonIds: ['lesson.uruk.first-city'], sourceIds: ['source.met.uruk', 'source.britannica.uruk'], mediaId: 'media.uruk.reconstruction', unlockLessonId: 'lesson.uruk.first-city' }
];

export const urukContent: AuthoredContentModule = {
  sources: urukSources,
  claims: urukClaims,
  media: urukMedia,
  prompts: urukPrompts,
  lessons: [urukLesson],
  cards: urukCards,
};
