import type { Claim, Lesson, Source, UnderstandingPrompt } from '../../src/domains/contracts';
import type { AuthoredContentModule } from '../assemble';

export const kermaSources: Source[] = [
  { id: 'source.kerma.beaker', title: 'Kerma pottery beaker, EA81931 (2010,1001.115)', url: 'https://www.britishmuseum.org/collection/object/Y_EA81931', publisher: 'British Museum', accessedOn: '2026-09-14', licenseOrUse: 'Research citation; complete official indexed object fields and displayed collection photograph reviewed. Northern Dongola Reach R25, context 137; handmade, 1750–1450 BCE; incomplete with reconstruction. Exact image reuse permission remains unresolved; no image redistributed.', reviewStatus: 'reviewed' },
  { id: 'source.kerma.mission-history', title: 'History: the kingdom of Kerma', url: 'https://kerma.ch/en/history/', publisher: 'Swiss Archaeological Mission in Sudan', accessedOn: '2026-09-14', licenseOrUse: 'Research citation; chronology, economic prosperity and expansion passages reviewed. Images require separate clearance.', reviewStatus: 'reviewed' },
  { id: 'source.kerma.mission-research', title: 'Research at Kerma', url: 'https://kerma.ch/en/research/', publisher: 'Swiss Archaeological Mission in Sudan', accessedOn: '2026-09-14', licenseOrUse: 'Research citation; renewed urban excavations and local-capital interpretation reviewed. No image redistribution.', reviewStatus: 'reviewed' },
  { id: 'source.kerma.city-project', title: 'Kerma–Doukki Gel', url: 'https://archeologie.culture.gouv.fr/monde/fr/kerma-doukki-gel', publisher: 'French Ministry of Culture / Sudanese–Swiss–French archaeological mission', accessedOn: '2026-09-14', licenseOrUse: 'Research citation; La ville de Kerma and Les recherches en cours reviewed. Building functions are archaeological interpretations. No image redistribution.', reviewStatus: 'reviewed' },
  { id: 'source.kerma.isotopes-2008', title: 'Stable isotopes and diet at Ancient Kerma, Upper Nubia (Sudan)', url: 'https://kerma.ch/documents/Publications_PDF/Chaix_Thompson_2007_Isotopeskerma.pdf', publisher: 'A. H. Thompson, L. Chaix and M. P. Richards, Journal of Archaeological Science 35 (2008), 376–387', accessedOn: '2026-09-14', licenseOrUse: 'Research citation; pp. 377–378 site, indigenous roots and food remains; pp. 384–385 sampling limits reviewed. No universal diet inferred.', reviewStatus: 'reviewed' },
  { id: 'source.kerma.metallurgy', title: 'Copper at Ancient Kerma: A Diachronic Investigation of Alloys and Raw Materials', url: 'https://www.sciencedirect.com/science/article/pii/S2667136022000036', publisher: 'F. W. Rademakers et al., Advances in Archaeomaterials 3 (2022), 1–18', accessedOn: '2026-09-14', licenseOrUse: 'Research citation; Table 1 and sections 3.1–3.2 local alloying/recycling; sections 4–5 supply alternatives reviewed. No unique ore route inferred.', reviewStatus: 'reviewed' },
  { id: 'source.kerma.mass-burials', title: 'Dying to Serve: the Mass Burials at Kerma', url: 'https://www.cambridge.org/core/services/aop-cambridge-core/content/view/C64CF190D99C036B35E4D02729DF52DD/S0003598X00098938a.pdf/dying_to_serve_the_mass_burials_at_kerma.pdf', publisher: 'M. A. Judd and J. D. Irish, Antiquity 83 (2009), 709–722', accessedOn: '2026-09-14', licenseOrUse: 'Research citation; pp. 710–712 and 719–720 burial investment, city and authority reviewed. Causes of death and consent are not learner claims; no human-remains images.', reviewStatus: 'reviewed' },
  { id: 'source.kerma.sennuwy', title: 'Lady Sennuwy: object and conservation record, MFA 14.720', url: 'https://www.mfa.org/collections/conservation/feature_ladysennuwy', publisher: 'Museum of Fine Arts, Boston', accessedOn: '2026-09-14', licenseOrUse: 'Research citation; Egyptian object identity and Kerma K III find context reviewed. Transport alternatives remain unresolved. No image redistribution.', reviewStatus: 'reviewed' },
  { id: 'source.kerma.reisner-context', title: 'Excavations at Kerma, Parts I–III, p. 138', url: 'https://doi.org/10.11588/diglit.49516#0198', publisher: 'George A. Reisner, Harvard African Studies 5 (1923)', accessedOn: '2026-09-14', licenseOrUse: 'Research citation; statue find context reviewed. Earlier Egyptian-colony interpretation is not adopted.', reviewStatus: 'reviewed' },
];

export const kermaClaims: Claim[] = [
  { id: 'claim.kerma.beaker', statement: 'British Museum EA81931 is a handmade Kerma-period pottery beaker from the Northern Dongola Reach, dated 1750–1450 BCE; the incomplete, partly reconstructed vessel is 99 mm tall and has a flaring profile, red-brown body, dark rim and interior, and an irregular dark exterior band.', kind: 'observation', certainty: 'high', sourceIds: ['source.kerma.beaker'], reviewStatus: 'reviewed' },
  { id: 'claim.kerma.location', statement: 'Kerma is in present-day Sudan, in northeastern Africa, south of Egypt along the Nile.', kind: 'observation', certainty: 'high', sourceIds: ['source.kerma.mission-history', 'source.kerma.isotopes-2008'], reviewStatus: 'reviewed' },
  { id: 'claim.kerma.period', statement: 'About 2500–1500 BCE is a rounded teaching frame for the Kerma kingdom; archaeological phases have more detailed boundaries.', kind: 'interpretation', certainty: 'high', sourceIds: ['source.kerma.mission-history'], reviewStatus: 'reviewed' },
  { id: 'claim.kerma.local-city', statement: 'Excavated housing, streets, defenses, workshops and buildings interpreted as royal or administrative support Kerma as a local urban capital, not an Egyptian colonial foundation.', kind: 'interpretation', certainty: 'high', sourceIds: ['source.kerma.city-project', 'source.kerma.mission-research', 'source.kerma.isotopes-2008'], reviewStatus: 'reviewed' },
  { id: 'claim.kerma.food', statement: 'Cattle remains, cereals including barley and wheat, and excavated bakeries attest food production at Kerma.', kind: 'observation', certainty: 'high', sourceIds: ['source.kerma.isotopes-2008'], reviewStatus: 'reviewed' },
  { id: 'claim.kerma.work-and-support', statement: 'Food production and storage supported people doing other work; substantial city defenses and monuments required organized labor and supplies.', kind: 'interpretation', certainty: 'moderate', sourceIds: ['source.kerma.city-project', 'source.kerma.isotopes-2008', 'source.kerma.mass-burials'], reviewStatus: 'reviewed' },
  { id: 'claim.kerma.metalworking', statement: 'Metal objects and production waste support skilled local work including deliberate copper alloying and recycling.', kind: 'interpretation', certainty: 'high', sourceIds: ['source.kerma.metallurgy', 'source.kerma.city-project'], reviewStatus: 'reviewed' },
  { id: 'claim.kerma.unequal-power', statement: 'Royal and administrative buildings and much larger richly supplied burials support concentrated authority and unequal access to labor and wealth.', kind: 'interpretation', certainty: 'high', sourceIds: ['source.kerma.mass-burials', 'source.kerma.city-project'], reviewStatus: 'reviewed' },
  { id: 'claim.kerma.connections', statement: 'Kerma participated in exchange with other regions and had changing relations, including rivalry, with Egypt.', kind: 'interpretation', certainty: 'high', sourceIds: ['source.kerma.mission-history', 'source.kerma.metallurgy', 'source.kerma.mass-burials'], reviewStatus: 'reviewed' },
  { id: 'claim.kerma.sennuwy', statement: 'Egyptian statue MFA 14.720 was found in Kerma tomb K III; its presence shows movement but cannot alone prove Egyptian rule.', kind: 'observation', certainty: 'high', sourceIds: ['source.kerma.sennuwy', 'source.kerma.reisner-context'], reviewStatus: 'reviewed' },
  { id: 'claim.kerma.conquest', statement: 'Egyptian conquest around the end of the lesson period ended Kerma’s political independence and brought destruction to the city; this is not evidence that all its inhabitants disappeared.', kind: 'interpretation', certainty: 'high', sourceIds: ['source.kerma.mission-history'], reviewStatus: 'reviewed' },
];

export const kermaPrompts: UnderstandingPrompt[] = [
  {
    id: 'prompt.kerma.contact-and-rule', lessonId: 'lesson.nubia.kerma-and-nile-world', kind: 'supported-selection', required: true,
    question: 'At Kerma, archaeologists found metalworking waste and an Egyptian-made statue. Which explanation best fits those finds?',
    hint: 'Waste left from making metal objects tells us where work happened. A finished object can travel after it was made.',
    explanation: 'Production waste supports metalworking at Kerma. The Egyptian statue reached Kerma from elsewhere, but its journey is not fully known. Together these finds fit a community with local skills and outside connections; they do not by themselves name its rulers.',
    options: [
      { id: 'option.kerma.local-and-connected', label: 'People worked metal at Kerma, and some finished objects arrived from Egypt.', feedback: 'The waste is evidence of local production. The statue is evidence of an Egyptian-made object reaching Kerma. Both can be true in an independent kingdom.' },
      { id: 'option.kerma.egyptian-government', label: 'The Egyptian statue proves that Egypt governed Kerma when its workshops operated.', feedback: 'An object can move through exchange, gifts or plunder. Its presence alone does not establish who governed the place where it ended up.' },
      { id: 'option.kerma.everything-local', label: 'The workshops show that everything used at Kerma was made there.', feedback: 'Evidence of local production does not rule out imports. The Egyptian-made statue shows why we need both parts of the evidence.' },
    ],
  },
  {
    id: 'prompt.kerma.work-and-power', lessonId: 'lesson.nubia.kerma-and-nile-world', kind: 'concise-explanation', required: true, minimumResponseLength: 20,
    question: 'Choose farmers, herders, craftspeople or builders. Explain how their work helped support Kerma’s power. Connect the work to something the kingdom could do.',
    hint: 'You could start: “Farmers helped support building work because…” Use a connection explained in the lesson.',
    explanation: 'For example: farmers grew grain that could feed people working on large buildings. Supplying food helped make organized building possible. Builders then created defenses or places used by rulers. Other answers can explain how skilled makers supplied useful or valued goods. The kingdom depended on many people’s work, even though its wealth and authority were shared unequally.',
  },
];

const sections: Lesson['sections'] = [
  {
    id: 'section.kerma.nile-neighbors', heading: 'Kerma on the Nile', purpose: 'Locate the city and kingdom and ask what supported its power.',
    modules: [
      { id: 'module.kerma.nile-neighbors', type: 'prose', claimIds: ['claim.kerma.location', 'claim.kerma.period', 'claim.kerma.local-city'], sourceIds: ['source.kerma.mission-history', 'source.kerma.isotopes-2008', 'source.kerma.city-project'], body: 'A kingdom needs more than a ruler. People must grow food, make useful things and build places where others can live and work. At Kerma, those activities helped sustain a powerful neighbor of ancient Egypt. What made Kerma powerful?\n\nStart in northeastern Africa. Kerma stood along the Nile in what is now Sudan, south of Egypt. Egypt and Sudan are modern country names that help us locate it. The city became the capital—the center of government—of a kingdom, a territory and its communities under a ruler.\n\nThis lesson follows Kerma roughly from 2500 to 1500 BCE. Its history overlapped the Egyptian and Indus societies you have met; one did not wait for the others to finish. Remember the Nile’s role in connecting Egyptian communities. Along the same river, people at Kerma built a kingdom with its own rulers.' },
    ],
  },
  {
    id: 'section.kerma.food-and-building', heading: 'Feeding and building the city', purpose: 'Explain food supply as a condition for specialized work and substantial construction.',
    modules: [
      { id: 'module.kerma.feeding-city', type: 'prose', claimIds: ['claim.kerma.food', 'claim.kerma.work-and-support'], sourceIds: ['source.kerma.isotopes-2008', 'source.kerma.city-project'], body: 'Farmers and herders helped feed Kerma. Archaeologists have found cattle remains, grains including barley and wheat, and places used for baking. These traces bring ordinary needs into the history of a kingdom: food had to be produced and prepared, day after day.\n\nFood also supported people doing other jobs. Someone building a wall or working metal still needed to eat. Growing, storing and supplying food made it possible to support work beyond farming. This relationship helps explain how a large city could function; it does not tell us the exact arrangements by which every household supplied or received food.' },
      { id: 'module.kerma.building-city', type: 'prose', claimIds: ['claim.kerma.local-city', 'claim.kerma.work-and-support'], sourceIds: ['source.kerma.city-project', 'source.kerma.mass-burials'], body: 'Excavations reveal streets, houses, workshops and substantial defenses. Researchers also identify buildings used by rulers and officials. Making those places required materials, labor and planning. Keeping a group working meant bringing their efforts and supplies together.\n\nFood alone did not create a kingdom. People had to organize work, maintain skills and decide how resources would be used. Kerma’s surviving city shows some of what that organization achieved.' },
    ],
  },
  {
    id: 'section.kerma.skilled-makers', heading: 'Kerma’s skilled makers', purpose: 'Connect local production evidence with skilled people and useful or valued objects.',
    modules: [
      { id: 'module.kerma.beaker', type: 'prose', claimIds: ['claim.kerma.beaker'], sourceIds: ['source.kerma.beaker'], body: 'Craftspeople are people skilled at making things. One surviving pottery beaker gives a Kerma-period maker’s work a recognizable form. It was found in the Northern Dongola Reach, in the wider Nile region rather than Kerma city itself. Pottery is clay hardened by heat; this vessel was shaped by hand.\n\nAbout ten centimetres tall, it widens toward the opening. Its lower body is red-brown; its rim and inside are dark, with an irregular dark band around the outside. The vessel combines a carefully made shape with a distinctive finish. It is now in the British Museum, numbered EA81931. Some missing parts have been reconstructed.\n\nThe maker’s name is unknown. The finished object nevertheless preserves the result of someone’s skilled work, long after the person is gone.' },
      { id: 'module.kerma.metalworking', type: 'prose', claimIds: ['claim.kerma.metalworking'], sourceIds: ['source.kerma.metallurgy', 'source.kerma.city-project'], body: 'Within Kerma city, metal objects and waste left from production reveal another craft. Workers mixed copper with other metals and reused metal. A mixture of metals is called an alloy.\n\nThe waste is a trace of work at the site, rather than simply a finished object that might have arrived from elsewhere. Kerma had people who could work materials into new objects. Their skills helped supply the city and its rulers.' },
    ],
  },
  {
    id: 'section.kerma.rulers-and-resources', heading: 'Rulers and resources', purpose: 'Explain how organized work and wealth were concentrated unequally.',
    modules: [
      { id: 'module.kerma.rulers', type: 'prose', claimIds: ['claim.kerma.unequal-power', 'claim.kerma.work-and-support'], sourceIds: ['source.kerma.mass-burials', 'source.kerma.city-project'], body: 'The kingdom depended on many people’s work, but people did not share its wealth and authority equally. Buildings interpreted as royal residences and places of administration point to rulers and officials. In the cemetery, some enormous tombs contained far more goods than smaller burials.\n\nThe contrast is evidence of unequal access to resources. Large tombs also required living people to gather materials and carry out construction. Rulers could draw on work and wealth far beyond what went into an ordinary burial.\n\nThose remains preserve elite power especially clearly. They tell us much less about the wishes of the people who did the work. We can recognize concentrated authority without pretending that every worker’s choices or obligations are known.' },
    ],
  },
  {
    id: 'section.kerma.egypt-and-change', heading: 'A changing relationship with Egypt', purpose: 'Distinguish local power, external connections and later conquest.',
    modules: [
      { id: 'module.kerma.egyptian-object', type: 'prose', claimIds: ['claim.kerma.connections', 'claim.kerma.sennuwy'], sourceIds: ['source.kerma.mission-history', 'source.kerma.metallurgy', 'source.kerma.sennuwy', 'source.kerma.reisner-context'], body: 'Kerma’s own rulers and skilled workers did not make it isolated. People exchanged materials and finished objects with other regions. Egypt was one important neighbor, and relationships changed over the centuries: connection could include exchange as well as rivalry.\n\nAn Egyptian statue of a woman named Sennuwy was found in a large tomb at Kerma. The statue had traveled, but its precise journey is uncertain. Its presence does not by itself show that Egyptians ruled the city. Think of it alongside the workshops: Kerma had local production and outside connections at the same time.' },
      { id: 'module.kerma.political-change', type: 'prose', claimIds: ['claim.kerma.conquest', 'claim.kerma.work-and-support', 'claim.kerma.unequal-power'], sourceIds: ['source.kerma.mission-history', 'source.kerma.city-project', 'source.kerma.mass-burials'], body: 'Around 1500 BCE, Egyptian conquest ended the kingdom’s independence and brought destruction to Kerma city. This was a violent change in power. The destruction of a capital does not mean that all the people of its kingdom disappeared.\n\nKerma’s history is therefore more than the story of an Egyptian neighbor. Farmers, herders, craftspeople and builders helped sustain a kingdom whose rulers gathered substantial resources. Their work supported its power; its changing relationships show that independence and connections could exist together.' },
    ],
  },
  {
    id: 'section.kerma.understanding', heading: 'Explain Kerma’s power', purpose: 'Use material evidence and explain a connection between work and a kingdom’s capacities.',
    modules: [
      { id: 'module.kerma.contact-check', type: 'prompt', promptId: 'prompt.kerma.contact-and-rule', claimIds: ['claim.kerma.metalworking', 'claim.kerma.sennuwy'], sourceIds: ['source.kerma.metallurgy', 'source.kerma.sennuwy'] },
      { id: 'module.kerma.power-check', type: 'prompt', promptId: 'prompt.kerma.work-and-power', claimIds: ['claim.kerma.work-and-support', 'claim.kerma.unequal-power'], sourceIds: ['source.kerma.city-project', 'source.kerma.mass-burials'] },
    ],
  },
];

export const kermaLesson: Lesson = {
  id: 'lesson.nubia.kerma-and-nile-world', legacyAliases: ['kerma'], status: 'draft',
  title: 'Kerma and the Middle Nile', masthead: 'c. 2500–1500 BCE', place: 'Middle Nile · present-day Sudan',
  chronology: { startYear: -2500, endYear: -1500, display: 'c. 2500–1500 BCE', approximate: true },
  significance: 'Food, skilled work and organized labor helped sustain Kerma, a kingdom with its own rulers and changing connections with Egypt.',
  learningOutcome: 'You explored how people’s work supported Kerma’s power, and why connections with Egypt did not always mean Egyptian rule.',
  sectionIdsRequired: sections.map((section) => section.id), sections,
  claimIds: kermaClaims.map((claim) => claim.id), sourceIds: kermaSources.map((source) => source.id), mediaIds: [], promptIds: kermaPrompts.map((prompt) => prompt.id),
};

export const kermaContent: AuthoredContentModule = { sources: kermaSources, claims: kermaClaims, lessons: [kermaLesson], prompts: kermaPrompts };
