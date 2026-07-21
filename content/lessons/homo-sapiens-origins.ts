import type { Claim, KnowledgeCard, Lesson, MediaAsset, Source, UnderstandingPrompt } from '../../src/domains/contracts';
import type { AuthoredContentModule } from '../assemble';
import { mediaLocator } from '../shared/media-locator';

export const humanOriginsSources: Source[] = [
  { id: 'source.human-origins.hublin-2017-irhoud', title: 'New fossils from Jebel Irhoud, Morocco and the pan-African origin of Homo sapiens', url: 'https://doi.org/10.1038/nature22336', publisher: 'Nature', accessedOn: '2026-07-20', licenseOrUse: 'Peer-reviewed primary research reference; article figures not redistributed', reviewStatus: 'reviewed' },
  { id: 'source.human-origins.richter-2017-irhoud-date', title: 'The age of the hominin fossils from Jebel Irhoud, Morocco, and the origins of the Middle Stone Age', url: 'https://doi.org/10.1038/nature22335', publisher: 'Nature', accessedOn: '2026-07-20', licenseOrUse: 'Peer-reviewed primary dating reference; article figures not redistributed', reviewStatus: 'reviewed' },
  { id: 'source.human-origins.vidal-2022-omo-age', title: 'Age of the oldest known Homo sapiens from eastern Africa', url: 'https://doi.org/10.1038/s41586-021-04275-8', publisher: 'Nature', accessedOn: '2026-07-20', licenseOrUse: 'CC BY 4.0 peer-reviewed research reference; no article figure reused at runtime', reviewStatus: 'reviewed' },
  { id: 'source.human-origins.scerri-2018-structured-africa', title: 'Did Our Species Evolve in Subdivided Populations across Africa, and Why Does It Matter?', url: 'https://doi.org/10.1016/j.tree.2018.05.005', publisher: 'Trends in Ecology & Evolution', accessedOn: '2026-07-20', licenseOrUse: 'Peer-reviewed synthesis used as a research reference; article media not redistributed', reviewStatus: 'reviewed' },
  { id: 'source.human-origins.bergstrom-2021-ancestry', title: 'Origins of modern human ancestry', url: 'https://doi.org/10.1038/s41586-021-03244-5', publisher: 'Nature', accessedOn: '2026-07-20', licenseOrUse: 'Peer-reviewed synthesis used as a research reference; article media not redistributed', reviewStatus: 'reviewed' },
  { id: 'source.human-origins.ragsdale-2023-structured-stem', title: 'A weakly structured stem for human origins in Africa', url: 'https://doi.org/10.1038/s41586-023-06055-y', publisher: 'Nature', accessedOn: '2026-07-20', licenseOrUse: 'Peer-reviewed demographic modelling reference; runtime figure reuse not permitted', reviewStatus: 'reviewed' },
  { id: 'source.human-origins.mounier-lahr-2019-diversity', title: 'Deciphering African late middle Pleistocene hominin diversity and the origin of our species', url: 'https://doi.org/10.1038/s41467-019-11213-w', publisher: 'Nature Communications', accessedOn: '2026-07-20', licenseOrUse: 'CC BY 4.0 peer-reviewed countermodel; no article figure reused at runtime', reviewStatus: 'reviewed' },
  { id: 'source.human-origins.iugs-kibish', title: 'The modern human fossils of the Kibish Formation', url: 'https://iugs-geoheritage.org/geoheritage_sites/the-modern-human-fossils-of-the-kibish-formation/', publisher: 'International Union of Geological Sciences', accessedOn: '2026-07-20', licenseOrUse: 'Institutional location reference; photography rights not assumed', reviewStatus: 'reviewed' },
  { id: 'source.human-origins.mpi-jebel-irhoud', title: 'Africa and the Origins of Modern Humans', url: 'https://www.eva.mpg.de/evolution/field-projects/africa-and-the-origins-of-modern-humans/', publisher: 'Max Planck Institute for Evolutionary Anthropology', accessedOn: '2026-07-20', licenseOrUse: 'Institutional location reference; photography rights not assumed', reviewStatus: 'reviewed' },
  { id: 'source.human-origins.ufs-florisbad', title: 'A new perspective on the Florisbad archaeozoological site', url: 'http://hdl.handle.net/11660/1168', publisher: 'University of the Free State', accessedOn: '2026-07-20', licenseOrUse: 'University repository location reference; runtime media reuse not asserted', reviewStatus: 'reviewed' },
  { id: 'source.map.natural-earth', title: 'Natural Earth small-scale vector data', url: 'https://www.naturalearthdata.com/', publisher: 'Natural Earth', accessedOn: '2026-07-20', licenseOrUse: 'Public domain base geography; Chronos-original styling and factual site labels', reviewStatus: 'reviewed' },
];

export const humanOriginsClaims: Claim[] = [
  { id: 'claim.human-origins.african-ancestry', statement: 'The deep ancestry of all living humans leads back to populations in Africa.', kind: 'interpretation', certainty: 'high', sourceIds: ['source.human-origins.bergstrom-2021-ancestry', 'source.human-origins.ragsdale-2023-structured-stem', 'source.human-origins.hublin-2017-irhoud'], reviewStatus: 'editorial-review-required' },
  { id: 'claim.human-origins.gradual-emergence', statement: 'Current evidence does not identify one exact first Homo sapiens person, generation, birthplace, or birthday.', kind: 'interpretation', certainty: 'high', sourceIds: ['source.human-origins.bergstrom-2021-ancestry', 'source.human-origins.scerri-2018-structured-africa', 'source.human-origins.hublin-2017-irhoud'], reviewStatus: 'editorial-review-required' },
  { id: 'claim.human-origins.irhoud-fossils', statement: 'Jebel Irhoud preserves fossils associated with material dated to about 315 ± 34 thousand years ago; their combination of traits is classified as early Homo sapiens by some researchers and debated by others.', kind: 'interpretation', certainty: 'moderate', sourceIds: ['source.human-origins.hublin-2017-irhoud', 'source.human-origins.richter-2017-irhoud-date', 'source.human-origins.mounier-lahr-2019-diversity'], reviewStatus: 'editorial-review-required' },
  { id: 'claim.human-origins.omo-minimum-age', statement: 'Omo I was deposited before an ash layer tied to an eruption dated 233 ± 22 thousand years ago, making the fossil older than that eruption.', kind: 'observation', certainty: 'high', sourceIds: ['source.human-origins.vidal-2022-omo-age'], reviewStatus: 'editorial-review-required' },
  { id: 'claim.human-origins.distributed-fossil-record', statement: 'Relevant late Middle Pleistocene fossils have been recovered in northern, eastern, and southern Africa.', kind: 'observation', certainty: 'high', sourceIds: ['source.human-origins.hublin-2017-irhoud', 'source.human-origins.vidal-2022-omo-age', 'source.human-origins.mounier-lahr-2019-diversity'], reviewStatus: 'editorial-review-required' },
  { id: 'claim.human-origins.mosaic-traits', statement: 'Features used to classify Homo sapiens did not all appear together in every early fossil.', kind: 'interpretation', certainty: 'high', sourceIds: ['source.human-origins.hublin-2017-irhoud', 'source.human-origins.mounier-lahr-2019-diversity', 'source.human-origins.bergstrom-2021-ancestry'], reviewStatus: 'editorial-review-required' },
  { id: 'claim.human-origins.connected-populations', statement: 'Genetic evidence is consistent with long-lived African population structure and repeated gene flow rather than one isolated founding population, while the number and locations of those populations remain model-dependent.', kind: 'interpretation', certainty: 'moderate', sourceIds: ['source.human-origins.ragsdale-2023-structured-stem', 'source.human-origins.bergstrom-2021-ancestry', 'source.human-origins.scerri-2018-structured-africa'], reviewStatus: 'editorial-review-required' },
  { id: 'claim.human-origins.genetic-limits', statement: 'Genetic models infer deep history from sampled genomes and assumptions; they are not direct DNA records from the 300,000–200,000-year-old fossils in this lesson.', kind: 'interpretation', certainty: 'high', sourceIds: ['source.human-origins.ragsdale-2023-structured-stem', 'source.human-origins.bergstrom-2021-ancestry', 'source.human-origins.scerri-2018-structured-africa'], reviewStatus: 'editorial-review-required' },
  { id: 'claim.human-origins.site-limit', statement: 'A fossil findspot shows where evidence survived and was recovered, not the only place a population lived or evolved.', kind: 'interpretation', certainty: 'high', sourceIds: ['source.human-origins.scerri-2018-structured-africa', 'source.human-origins.bergstrom-2021-ancestry', 'source.human-origins.vidal-2022-omo-age'], reviewStatus: 'editorial-review-required' },
];

export const humanOriginsMedia: MediaAsset[] = [{
  id: 'media.human-origins.africa-evidence-map',
  locator: mediaLocator('media.human-origins.africa-evidence-map'),
  alt: 'Map of Africa with Jebel Irhoud in the northwest, Omo Kibish in the east, and Florisbad in the south. The distant dots are fossil findspots, not exact birthplaces.',
  depictionMode: 'map',
  depictionLabel: 'Evidence-location map · findspots, not birthplaces',
  rightsLabel: 'Chronos original · Natural Earth base geography, Public Domain',
  sourceIds: ['source.map.natural-earth', 'source.human-origins.iugs-kibish', 'source.human-origins.mpi-jebel-irhoud', 'source.human-origins.ufs-florisbad'],
  visualBriefRef: 'docs/research/human-origins-africa-evidence-map.md',
  reviewStatus: 'provenance-review-required',
}];

export const humanOriginsPrompts: UnderstandingPrompt[] = [
  { id: 'prompt.human-origins.best-supported-model', lessonId: 'lesson.humans.homo-sapiens-origins', kind: 'supported-selection', question: 'Which conclusion best fits the fossil and genetic evidence?', explanation: 'The strongest broad conclusion is a long African emergence among populations that were sometimes separated and sometimes connected. The exact population map remains uncertain.', required: true, options: [
    { id: 'option.human-origins.connected-africa', label: 'Homo sapiens emerged over time in Africa among changing, connected populations' },
    { id: 'option.human-origins.single-fossil', label: 'One oldest fossil identifies an exact first person and birthplace' },
    { id: 'option.human-origins.simultaneous-world', label: 'Homo sapiens appeared everywhere in the world at the same moment' },
    { id: 'option.human-origins.complete-dna', label: 'Modern DNA is a complete recording of every population 300,000 years ago' },
  ] },
  { id: 'prompt.human-origins.evidence-and-limit', lessonId: 'lesson.humans.homo-sapiens-origins', kind: 'concise-explanation', question: 'Use one fossil or dating clue and one genetic clue to explain why scientists do not give our species one exact birthday and birthplace.', explanation: 'A sincere answer can pair Omo I’s minimum age, Jebel Irhoud’s dated range, or scattered fossil traits with the model-dependent evidence for connected African populations, then name what the evidence cannot prove exactly.', required: true, minimumResponseLength: 30 },
];

export const humanOriginsLesson: Lesson = {
  id: 'lesson.humans.homo-sapiens-origins',
  legacyAliases: [],
  status: 'published',
  title: 'Our Species Begins in Africa',
  masthead: 'c. 300,000–200,000 years ago',
  place: 'Africa',
  chronology: { startYear: -300000, endYear: -200000, display: 'approximately 300,000–200,000 years ago', approximate: true },
  significance: 'Fossils and genomes point to a long African emergence shared by all living people—not one exact first person, place, or date.',
  heroMediaId: 'media.human-origins.africa-evidence-map',
  heroLabel: 'Evidence-location map',
  heroCaption: 'These dots mark where clues survived and were recovered. They are not three exact birthplaces.',
  sectionIdsRequired: [
    'section.human-origins.opening-question',
    'section.human-origins.fossil-clues',
    'section.human-origins.older-than-ash',
    'section.human-origins.clues-across-africa',
    'section.human-origins.genome-clues',
    'section.human-origins.connected-populations',
    'section.human-origins.known-and-unknown',
    'section.human-origins.world-check',
  ],
  sections: [
    {
      id: 'section.human-origins.opening-question',
      heading: 'Did our species have a birthday?',
      purpose: 'Replace a sudden origin story with an evidence question',
      modules: [{ id: 'module.human-origins.opening', type: 'prose', body: 'Every person has a birthday. A species does not. Across many generations, populations change, separate, meet, and mix. Scientists therefore cannot point to one baby as the first Homo sapiens. They ask a different question: what story best explains the incomplete clues that survived?', claimIds: ['claim.human-origins.gradual-emergence'], sourceIds: ['source.human-origins.bergstrom-2021-ancestry', 'source.human-origins.scerri-2018-structured-africa'] }],
    },
    {
      id: 'section.human-origins.fossil-clues',
      heading: 'A fossil is a clue, not a birth certificate',
      purpose: 'Separate observed anatomy, classification, and direct ancestry',
      modules: [{ id: 'module.human-origins.fossil-clues', type: 'knowledge', eyebrow: 'Read the evidence in layers', title: 'What a fossil can—and cannot—tell us', body: 'Researchers compare anatomy, position in the ground, associated materials, and other finds. Classification is an expert explanation built from those observations; it is not a label the fossil carried.', items: [
        { label: 'Observe', detail: 'Which bones and features survive, and where were they found?' },
        { label: 'Date', detail: 'Which layer or associated material was measured, with what range or limit?' },
        { label: 'Classify', detail: 'Which combination of traits best fits Homo sapiens or another group?' },
        { label: 'Limit', detail: 'A classified fossil is not automatically a direct ancestor of people alive today.' },
      ], claimIds: ['claim.human-origins.mosaic-traits', 'claim.human-origins.irhoud-fossils'], sourceIds: ['source.human-origins.hublin-2017-irhoud', 'source.human-origins.richter-2017-irhoud-date', 'source.human-origins.mounier-lahr-2019-diversity'] }],
    },
    {
      id: 'section.human-origins.older-than-ash',
      heading: 'Older than the ash',
      purpose: 'Reason from Omo I stratigraphy without inventing an exact fossil age',
      modules: [{ id: 'module.human-origins.omo-ash', type: 'knowledge', eyebrow: 'Omo Kibish, Ethiopia', title: 'A minimum age, not an exact birthday', body: 'Omo I was found below a volcanic ash layer called the KHS Tuff. Researchers matched that ash to an eruption dated 233 ± 22 thousand years ago. In an undisturbed sequence, material below the ash was already there when the ash fell.', items: [
        { label: 'Above', detail: 'The KHS volcanic ash records an eruption with a measured age range.' },
        { label: 'Below', detail: 'The layer containing Omo I was deposited before that ash covered it.' },
        { label: 'Supported', detail: 'Omo I is older than the eruption dated 233 ± 22 thousand years ago.' },
        { label: 'Not supported', detail: 'The fossil is exactly 233,000 years old.' },
      ], claimIds: ['claim.human-origins.omo-minimum-age'], sourceIds: ['source.human-origins.vidal-2022-omo-age'] }],
    },
    {
      id: 'section.human-origins.clues-across-africa',
      heading: 'Clues across a continent',
      purpose: 'Map evidence locations without turning findspots into origin centers',
      modules: [{
        id: 'module.human-origins.africa-evidence-map',
        type: 'historical-map',
        eyebrow: 'Evidence locations',
        title: 'Far-apart finds, one incomplete record',
        body: 'Fossils relevant to the emergence of Homo sapiens have been recovered far apart in Africa. Jebel Irhoud, Omo Kibish, and Florisbad contribute different clues, and researchers do not classify every find in exactly the same way.',
        mediaId: 'media.human-origins.africa-evidence-map',
        periodLabel: 'c. 315,000–200,000 years ago',
        focusPlace: 'Africa',
        modernContext: 'Modern Morocco, Ethiopia, and South Africa',
        accessibleSummary: 'Jebel Irhoud lies in northwestern Africa, Omo Kibish in eastern Africa, and Florisbad in southern Africa. Their spread shows where evidence was recovered, not three separate or exact birthplaces.',
        compactLabel: 'Evidence-location map · findspots are not birthplaces',
        coordinateNote: 'Omo Kibish and Florisbad use institutional coordinates. Jebel Irhoud is placed approximately from the Max Planck field location west of Marrakesh.',
        uncertaintyNote: 'The modern coastline is for orientation. Site markers do not show population ranges, population size, direct ancestry, or exclusive origin centers; Florisbad’s classification is contested.',
        depictionStatus: 'illustrative-reconstruction',
        claimIds: ['claim.human-origins.distributed-fossil-record', 'claim.human-origins.site-limit', 'claim.human-origins.irhoud-fossils'],
        sourceIds: ['source.map.natural-earth', 'source.human-origins.iugs-kibish', 'source.human-origins.mpi-jebel-irhoud', 'source.human-origins.ufs-florisbad', 'source.human-origins.mounier-lahr-2019-diversity'],
      }],
    },
    {
      id: 'section.human-origins.genome-clues',
      heading: 'Genomes are family-history clues',
      purpose: 'Explain what genetic models infer and what they do not directly preserve',
      modules: [{ id: 'module.human-origins.genome-clues', type: 'knowledge', eyebrow: 'A second kind of evidence', title: 'Patterns, comparisons, and models', body: 'Researchers compare genomes from living people and the limited ancient DNA that survives. Shared and differing patterns can test possible population histories, but they do not replay the past like a recording.', items: [
        { label: 'Sample', detail: 'Every study includes some people and places, never every past population.' },
        { label: 'Compare', detail: 'Shared variants and differences preserve traces of related population histories.' },
        { label: 'Model', detail: 'Researchers test which branching, separation, and gene-flow histories fit the patterns.' },
        { label: 'Revise', detail: 'New samples or different assumptions can change the detailed model.' },
      ], claimIds: ['claim.human-origins.genetic-limits', 'claim.human-origins.african-ancestry'], sourceIds: ['source.human-origins.bergstrom-2021-ancestry', 'source.human-origins.ragsdale-2023-structured-stem', 'source.human-origins.scerri-2018-structured-africa'] }],
    },
    {
      id: 'section.human-origins.connected-populations',
      heading: 'Separated, connected, reconnected',
      purpose: 'State the durable population model without false geographic precision',
      modules: [{ id: 'module.human-origins.connected-populations', type: 'knowledge', eyebrow: 'Best current broad model', title: 'A long African emergence', body: 'Fossil and genetic evidence fit a history in which African populations were sometimes separated and sometimes connected over a long time. Scientists still debate how many populations to model, where they lived, and how much each contributed.', items: [
        { label: 'Sometimes separated', detail: 'Distance and changing environments could reduce contact for many generations.' },
        { label: 'Sometimes connected', detail: 'Movement and interbreeding could carry genes and traits between populations.' },
        { label: 'No single founding dot', detail: 'Current evidence does not isolate one small birthplace that supplied the whole later species.' },
        { label: 'One shared humanity', detail: 'These deep population histories do not divide living people into biological races or ranks.' },
      ], claimIds: ['claim.human-origins.connected-populations', 'claim.human-origins.african-ancestry', 'claim.human-origins.gradual-emergence'], sourceIds: ['source.human-origins.ragsdale-2023-structured-stem', 'source.human-origins.bergstrom-2021-ancestry', 'source.human-origins.scerri-2018-structured-africa'] }],
    },
    {
      id: 'section.human-origins.known-and-unknown',
      heading: 'What the evidence supports',
      purpose: 'Close with calibrated certainty and a bridge to migration',
      modules: [{ id: 'module.human-origins.known-and-unknown', type: 'knowledge', eyebrow: 'Strong conclusion, open details', title: 'Shared roots without a false exact answer', body: 'The broad conclusion is durable: Homo sapiens emerged in Africa, and all living people share that deep ancestry. The detailed route remains open because fossils are rare, dates are ranges or limits, classifications are debated, and genetic models depend on samples.', items: [
        { label: 'High confidence', detail: 'Our species emerged in Africa over a long period.' },
        { label: 'Supported model', detail: 'Multiple populations were sometimes separated and sometimes connected.' },
        { label: 'Still uncertain', detail: 'No exact first person, generation, birthplace, population tree, or complete route is known.' },
        { label: 'Next', detail: 'Populations moved within and beyond Africa and encountered other human groups.' },
      ], claimIds: ['claim.human-origins.african-ancestry', 'claim.human-origins.gradual-emergence', 'claim.human-origins.site-limit', 'claim.human-origins.genetic-limits'], sourceIds: ['source.human-origins.bergstrom-2021-ancestry', 'source.human-origins.scerri-2018-structured-africa', 'source.human-origins.ragsdale-2023-structured-stem'] }],
    },
    {
      id: 'section.human-origins.world-check',
      heading: 'World Check',
      purpose: 'Use fossil and genetic evidence without overclaiming',
      modules: [
        { id: 'module.human-origins.prompt-model', type: 'prompt', promptId: 'prompt.human-origins.best-supported-model', claimIds: [], sourceIds: [] },
        { id: 'module.human-origins.prompt-limit', type: 'prompt', promptId: 'prompt.human-origins.evidence-and-limit', claimIds: [], sourceIds: [] },
      ],
    },
  ],
  claimIds: humanOriginsClaims.map((claim) => claim.id),
  sourceIds: humanOriginsSources.map((source) => source.id),
  mediaIds: ['media.human-origins.africa-evidence-map'],
  promptIds: ['prompt.human-origins.best-supported-model', 'prompt.human-origins.evidence-and-limit'],
};

export const humanOriginsCards: KnowledgeCard[] = [{
  id: 'card.idea.shared-african-origins',
  title: 'Shared African Origins',
  category: 'idea',
  cardClass: 'foundation',
  date: { startYear: -300000, endYear: -200000, display: 'c. 300,000–200,000 years ago', approximate: true },
  place: 'Africa',
  significance: 'Fossils and genomes connect every living person to deep African ancestry while leaving the detailed map of early populations open to revision.',
  revealTitle: 'You traced a shared beginning',
  revealBody: 'You used fossils, ash, and genomes without turning incomplete clues into a false exact answer.',
  depictionLabel: 'Evidence-location map · findspots, not birthplaces',
  facts: ['Early Homo sapiens evidence is African', 'Fossil dates may be ranges or minimum ages', 'Early fossils combine traits in different ways', 'Genetic models support connected African populations', 'A findspot is not an exact birthplace'],
  lessonIds: ['lesson.humans.homo-sapiens-origins'],
  sourceIds: ['source.human-origins.bergstrom-2021-ancestry', 'source.human-origins.vidal-2022-omo-age', 'source.human-origins.hublin-2017-irhoud'],
  mediaId: 'media.human-origins.africa-evidence-map',
  unlockLessonId: 'lesson.humans.homo-sapiens-origins',
}];

export const humanOriginsContent: AuthoredContentModule = {
  sources: humanOriginsSources,
  claims: humanOriginsClaims,
  media: humanOriginsMedia,
  prompts: humanOriginsPrompts,
  lessons: [humanOriginsLesson],
  cards: humanOriginsCards,
};
