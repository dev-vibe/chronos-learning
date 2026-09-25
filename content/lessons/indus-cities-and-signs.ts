import type { Claim, Lesson, Source, UnderstandingPrompt } from '../../src/domains/contracts';
import type { AuthoredContentModule } from '../assemble';
import { indusMedia, indusMediaSources, indusSealCard, indusVisualModules } from './indus-media';

export const indusSources: Source[] = [
  { id: 'source.indus.dholavira', title: 'Dholavira: a Harappan City', url: 'https://whc.unesco.org/en/list/1645/', publisher: 'UNESCO World Heritage Centre / India', accessedOn: '2026-09-11', licenseOrUse: 'Research citation; description and Outstanding Universal Value closely reviewed. Photographs require separate clearance.', reviewStatus: 'reviewed' },
  { id: 'source.indus.moenjodaro', title: 'Archaeological Ruins at Moenjodaro', url: 'https://whc.unesco.org/en/list/138/', publisher: 'UNESCO World Heritage Centre / Pakistan', accessedOn: '2026-09-11', licenseOrUse: 'Research citation; Brief synthesis on site location and street drainage reviewed. Summary brick wording and inherited building names are not adopted.', reviewStatus: 'reviewed' },
  { id: 'source.indus.street-drains', title: 'Mohenjo-daro Street with Drains', url: 'https://www.harappa.com/blog/mohenjo-daro-street-drains', publisher: 'Harappa.com, citing Wheeler and Possehl', accessedOn: '2026-09-11', licenseOrUse: 'Research citation; paragraphs on household outflows, covered drains and cleaning closely reviewed. No image reproduction.', reviewStatus: 'reviewed' },
  { id: 'source.indus.measuring', title: 'Measuring the Harappan world', url: 'https://www.harappa.com/sites/default/files/pdf/Kenoyer%202010%20Measuring%20the%20Harappan%20World.pdf', publisher: 'J. Mark Kenoyer, in The Archaeology of Measurement (2010)', accessedOn: '2026-09-11', licenseOrUse: 'Research citation; pp. 115–117, table 9.3 and figure 9.10 closely reviewed. No figure reproduction.', reviewStatus: 'reviewed' },
  { id: 'source.indus.harp-weights', title: 'Weights, Harappa', url: 'https://www.harappa.com/slide/weights-harappa', publisher: 'Harappa Archaeological Research Project / Jonathan Mark Kenoyer', accessedOn: '2026-09-11', licenseOrUse: 'Research citation of excavation caption; photograph not licensed for publication here.', reviewStatus: 'reviewed' },
  { id: 'source.indus.harp-seals', title: 'Seals & tablets', url: 'https://www.harappa.com/indus/30.html', publisher: 'Harappa Archaeological Research Project / Jonathan Mark Kenoyer', accessedOn: '2026-09-11', licenseOrUse: 'Research citation of the Mound E house assemblage; no photograph reproduction.', reviewStatus: 'reviewed' },
  { id: 'source.indus.met-seal', title: 'Stamp seal: buffalo with incense burner (?) — object 49.40.2', url: 'https://www.metmuseum.org/art/collection/search/324063', publisher: 'The Metropolitan Museum of Art', accessedOn: '2026-09-11', licenseOrUse: 'Object description and details closely reviewed. Public-domain catalog image acquired and reviewed September 12; resized/compressed only, with no retouching. The view is labeled as the seal design because the catalog does not distinguish seal from impression.', reviewStatus: 'reviewed' },
  { id: 'source.indus.rao-response', title: 'Entropy, the Indus Script, and Language: A Reply to Richard Sproat', url: 'https://homes.cs.washington.edu/~rao/IndusCompLing.html', publisher: 'Rao and colleagues, Computational Linguistics 36(4), 2010; author manuscript', accessedOn: '2026-09-11', licenseOrUse: 'Research citation; sections 2–4 on statistical evidence, competing sign-system explanations and limits closely reviewed. No computational replication claimed.', reviewStatus: 'reviewed' },
  { id: 'source.indus.green-governance', title: 'Of Revenue Without Rulers: Public Goods in the Egalitarian Cities of the Indus Civilization', url: 'https://www.frontiersin.org/journals/political-science/articles/10.3389/fpos.2022.823071/full', publisher: 'Adam S. Green, Frontiers in Political Science (2022)', accessedOn: '2026-09-11', licenseOrUse: 'Research citation; governance evidence section closely reviewed. Egalitarian government remains the author’s interpretation; third-party figures are not reproduced.', reviewStatus: 'reviewed' },
  { id: 'source.indus.harp-settlement', title: 'Changing Settlement at Harappa', url: 'https://www.harappa.com/slide/changing-settlement-harappa', publisher: 'Harappa Archaeological Research Project, Harappa 2000–2001', accessedOn: '2026-09-11', licenseOrUse: 'Excavation-project period and settlement-plan caption closely reviewed; no plan reproduction.', reviewStatus: 'reviewed' },
  { id: 'source.indus.kenoyer-tradition', title: 'Cultures and Societies of the Indus Tradition', url: 'https://www.harappa.com/sites/default/files/pdf/CulturesSocietiesIndusTrad.pdf', publisher: 'J. Mark Kenoyer (2006)', accessedOn: '2026-09-11', licenseOrUse: 'Research citation; Table 1 and Localization Era discussion, PDF pp. 6 and 9, closely reviewed. Older linguistic/religious identifications are not adopted.', reviewStatus: 'reviewed' },
  ...indusMediaSources,
];

export const indusClaims: Claim[] = [
  { id: 'claim.indus.urban-period', statement: 'The Mature Harappan urban period is conventionally dated to about 2600–1900 BCE; individual settlements have longer histories.', kind: 'interpretation', certainty: 'high', sourceIds: ['source.indus.kenoyer-tradition', 'source.indus.harp-settlement', 'source.indus.dholavira'], reviewStatus: 'reviewed' },
  { id: 'claim.indus.regional-cities', statement: 'Indus settlements occupied different environments across parts of present-day Pakistan and India, including Mohenjo-daro and Dholavira.', kind: 'observation', certainty: 'high', sourceIds: ['source.indus.moenjodaro', 'source.indus.dholavira'], reviewStatus: 'reviewed' },
  { id: 'claim.indus.south-asia-location', statement: 'The lesson’s three cities are in South Asia, in present-day Pakistan and northwestern India. The Indian peninsula projects into the Indian Ocean, east of Africa; the Himalayas lie along its north.', kind: 'observation', certainty: 'high', sourceIds: ['source.indus.locator-relief', 'source.indus.locator-relief-crosscheck', 'source.indus.locator-getty-harappa', 'source.indus.moenjodaro', 'source.indus.dholavira'], reviewStatus: 'reviewed' },
  { id: 'claim.indus.household-drainage', statement: 'At Mohenjo-daro, bathing-floor drains fed street drains; covers and settling traps formed part of a maintained drainage system.', kind: 'observation', certainty: 'high', sourceIds: ['source.indus.street-drains', 'source.indus.moenjodaro'], reviewStatus: 'reviewed' },
  { id: 'claim.indus.water-storage', statement: 'Dholavira used reservoirs and seasonal streams in a dry setting, with substantial stone construction.', kind: 'observation', certainty: 'high', sourceIds: ['source.indus.dholavira'], reviewStatus: 'reviewed' },
  { id: 'claim.indus.shared-weights', statement: 'Measured stone weights from Harappa and other Indus sites follow shared standards, with variation rather than perfect identity.', kind: 'observation', certainty: 'high', sourceIds: ['source.indus.measuring', 'source.indus.harp-weights'], reviewStatus: 'reviewed' },
  { id: 'claim.indus.weight-functions', statement: 'Weights could support controlled exchange; their association with gateways and craft areas also supports taxation as an interpretation, not a recovered transaction.', kind: 'interpretation', certainty: 'moderate', sourceIds: ['source.indus.measuring', 'source.indus.harp-weights'], reviewStatus: 'reviewed' },
  { id: 'claim.indus.crafts-and-connections', statement: 'Dholavira preserves craft-working evidence and evidence of exchange within the Indus region and with Oman and Mesopotamia.', kind: 'interpretation', certainty: 'high', sourceIds: ['source.indus.dholavira'], reviewStatus: 'reviewed' },
  { id: 'claim.indus.seal-object', statement: 'Met object 49.40.2 is a small steatite stamp seal with an animal, a short inscription and another depicted object whose identification is uncertain.', kind: 'observation', certainty: 'high', sourceIds: ['source.indus.met-seal'], reviewStatus: 'reviewed' },
  { id: 'claim.indus.seal-context', statement: 'Seals could make clay impressions, and a house by Harappa’s Mound E gateway contained several kinds of inscribed objects; the users’ identities are inferred.', kind: 'interpretation', certainty: 'moderate', sourceIds: ['source.indus.harp-seals', 'source.indus.met-seal', 'source.indus.green-governance'], reviewStatus: 'reviewed' },
  { id: 'claim.indus.undeciphered-signs', statement: 'Indus inscriptions have no securely established reading; statistical regularities alone neither translate them nor settle whether they encode speech.', kind: 'interpretation', certainty: 'high', sourceIds: ['source.indus.rao-response', 'source.indus.met-seal'], reviewStatus: 'reviewed' },
  { id: 'claim.indus.coordination-and-rule', statement: 'Shared standards and large communal works support organized cooperation; they do not by themselves identify rulers, political institutions or equal access.', kind: 'interpretation', certainty: 'moderate', sourceIds: ['source.indus.green-governance', 'source.indus.dholavira'], reviewStatus: 'reviewed' },
  { id: 'claim.indus.urban-transformation', statement: 'After about 1900 BCE, settlement at Harappa contracted; wider changes in urban organization coexisted with continuing farming and craft traditions.', kind: 'interpretation', certainty: 'high', sourceIds: ['source.indus.harp-settlement', 'source.indus.kenoyer-tradition'], reviewStatus: 'reviewed' },
];

export const indusPrompts: UnderstandingPrompt[] = [
  {
    id: 'prompt.indus.shared-standards', bestOptionId: 'option.indus.shared-measure', lessonId: 'lesson.indus.cities-and-signs', kind: 'supported-selection', required: true, evidenceModuleIds: ['module.indus.weights-evidence'],
    question: 'Stone weights from several Indus cities follow a shared system. Which conclusion is best supported by that pattern?',
    hint: 'Separate what people needed to agree on from who might have made that agreement.',
    explanation: 'The weights support a shared way of measuring quantities. That could help people coordinate exchange or collections. The objects alone do not name the people who set or enforced the standard.',
    options: [
      { id: 'option.indus.shared-measure', label: 'People in different places used a common way to measure quantities.', feedback: 'Yes. Repeated measurements across sites support a shared standard, even though individual weights vary.' },
      { id: 'option.indus.one-emperor', label: 'One emperor personally controlled trade in every city.', feedback: 'A common standard does not identify an emperor. Different political arrangements could produce or maintain shared measures.' },
      { id: 'option.indus.equal-wealth', label: 'Every household owned the same amount of valuable goods.', feedback: 'A weight measures a quantity. It does not tell us how wealth was divided between households.' },
      { id: 'option.indus.decoded-signs', label: 'Researchers can now translate the signs on Indus seals.', feedback: 'Recognizing a measurement system does not provide sound values or meanings for the separate sign system.' },
    ],
  },
  {
    id: 'prompt.indus.water-and-work', lessonId: 'lesson.indus.cities-and-signs', kind: 'concise-explanation', required: true, evidenceModuleIds: ['module.indus.reservoir-evidence'], minimumResponseLength: 20,
    question: 'Choose Mohenjo-daro’s drains or Dholavira’s reservoirs. Explain how that water system depended on people working together. What does the surviving system leave uncertain about who organized the work?',
    hint: 'Think about the connection between a household and a larger system, or between collecting water and keeping it available.',
    explanation: 'For example: a household drain at Mohenjo-daro joined a street drain used beyond that home. Building connections and clearing collected waste required work that supported more than one household. The drain shows that work was organized, but it does not tell us whether a ruler, a neighborhood group or another institution directed it. Dholavira’s reservoirs offer another sound example: collecting and storing seasonal water required coordinated construction and upkeep.',
  },
];

const sections: Lesson['sections'] = [
  {
    id: 'section.indus.cities-and-landscapes', heading: 'Cities across the Indus region', purpose: 'Locate the urban tradition and introduce coordination as a concrete historical problem.',
    modules: [
      indusVisualModules.map,
      { id: 'module.indus.cities-and-landscapes', type: 'prose', claimIds: ['claim.indus.urban-period', 'claim.indus.regional-cities'], sourceIds: ['source.indus.kenoyer-tradition', 'source.indus.moenjodaro', 'source.indus.dholavira'], body: 'A city needs ways to bring useful things in and carry unwanted things away. Food and materials must arrive. Water must be available. Waste cannot simply collect outside every doorway. Earlier in this journey, you saw how cities connected people through food, work and records. How did people solve those problems in the Indus region?\n\nAbout 2600–1900 BCE, large settlements flourished across parts of what are now Pakistan and India. Archaeologists call this the Mature Harappan period, after the site of Harappa. These dates describe an urban phase, not the lifetime of every settlement or its people.\n\nMohenjo-daro stood on the Indus plain in present-day Pakistan. Farther southeast, Dholavira occupied a dry island setting in Gujarat, now in India. They belonged to a connected regional tradition, but their surroundings called for different solutions.' },
    ],
  },
  {
    id: 'section.indus.water-systems', heading: 'Water for city life', purpose: 'Explain connected drainage and seasonal storage as different forms of organized work.',
    modules: [
      { id: 'module.indus.drains', type: 'prose', claimIds: ['claim.indus.household-drainage'], sourceIds: ['source.indus.street-drains', 'source.indus.moenjodaro'], body: 'At Mohenjo-daro, water from some household bathing floors flowed into drains along the streets. Brick channels carried it onward. Covers protected many channels, while traps collected heavier material so it could be cleared out.\n\nThe important feature is the connection. A drain inside one home fed a system extending beyond that home. Building it was only the beginning: people also had to keep water moving through it. Archaeologists report deposits beside traps as traces of that cleaning. City life depended on repeated maintenance as well as impressive construction.' },
      indusVisualModules.drainage,
      { id: 'module.indus.reservoirs', type: 'prose', claimIds: ['claim.indus.water-storage'], sourceIds: ['source.indus.dholavira'], body: 'At Dholavira, storing water was especially important. Two streams flowed seasonally, rather than supplying the same amount of water all year. The city had a series of reservoirs—large places for holding water—and made extensive use of stone in its buildings.\n\nHolding seasonal water made it available beyond the moment it arrived. That required planning space, directing water and maintaining the structures. The two cities show why a shared urban tradition did not mean copying one design everywhere.' },
      indusVisualModules.reservoir,
    ],
  },
  {
    id: 'section.indus.weights-and-work', heading: 'Shared measures and skilled work', purpose: 'Connect measured objects and craft production to coordination without assuming a particular transaction.',
    modules: [
      { id: 'module.indus.weights', type: 'prose', claimIds: ['claim.indus.shared-weights', 'claim.indus.weight-functions'], sourceIds: ['source.indus.measuring', 'source.indus.harp-weights'], body: 'Small stone objects reveal another connection between cities. Excavators at Harappa found carefully shaped weights. Comparing their masses with weights from other sites reveals a shared system. Many of the smaller units doubled: one, two, four, eight. Actual objects vary; a common standard does not mean every weight was perfect.\n\nA balance compares goods against a known weight. If people use the same standard, they can agree on a quantity even when they come from different places. Some weights were found near gateways and craft-working areas. Were they used in exchange, to collect payments, or both? Their locations help researchers test those possibilities, but no single weight preserves the whole transaction.' },
      indusVisualModules.weights,
      { id: 'module.indus.crafts', type: 'prose', claimIds: ['claim.indus.crafts-and-connections'], sourceIds: ['source.indus.dholavira'], body: 'At Dholavira, excavators found bead-working areas and objects made from materials including shell, copper and stone. The site also preserves evidence of connections with other Indus settlements, Oman and Mesopotamia. Making finished objects required people who could obtain materials, work them and pass them on.\n\nThese were connected communities of skilled people. Shared measures helped make some of their interactions possible. Seals offer another way to examine how they handled information.' },
    ],
  },
  {
    id: 'section.indus.seals-and-signs', heading: 'Seals and undeciphered signs', purpose: 'Distinguish an object’s observable features, excavated context and possible message.',
    modules: [
      { id: 'module.indus.seal-record', type: 'prose', claimIds: ['claim.indus.seal-object', 'claim.indus.seal-context'], sourceIds: ['source.indus.met-seal', 'source.indus.harp-seals'], body: 'A stamp seal is an engraved object that can leave an impression when pressed into soft material such as clay. One Indus seal in the Metropolitan Museum of Art is only about four centimetres across. It is made from steatite, a soft stone that was carved and then heated. Its engraved design combines an animal, a short row of signs and another object in front of the animal. The museum identifies a buffalo and tentatively calls the other object an incense burner. That question mark matters: identifying a carved shape can itself involve interpretation.\n\nAn excavated group offers a different kind of evidence. In a house near a gateway at Harappa, archaeologists found several kinds of seals and inscribed tablets together. The finds suggest that the occupants handled different kinds of recorded information. They may have been merchants, but the objects do not introduce their owners by a name we can read.' },
      indusVisualModules.seal,
      { id: 'module.indus.sign-limits', type: 'prose', claimIds: ['claim.indus.undeciphered-signs'], sourceIds: ['source.indus.rao-response', 'source.indus.met-seal'], body: 'To decipher a script is to work out how its signs represent a language. Indus signs have no securely established reading. Researchers disagree about how much spoken language they recorded, or whether they communicated through a different kind of sign system.\n\nRepeated signs and patterns in their order show that the marks were organized. A pattern alone does not tell us what a sign means. A convincing reading would need to explain inscriptions beyond the examples used to devise it, using consistent rules and fitting the objects’ contexts. Until then, a claim to have found a king’s name or a religious message remains something to test.' },
    ],
  },
  {
    id: 'section.indus.organizing-cities', heading: 'Who organized the cities?', purpose: 'State what coordinated work supports while keeping political authority and unequal access open.',
    modules: [
      { id: 'module.indus.organizing-cities', type: 'prose', claimIds: ['claim.indus.coordination-and-rule'], sourceIds: ['source.indus.green-governance', 'source.indus.dholavira'], body: 'Drains, reservoirs and shared measures did not maintain themselves. People organized labor, preserved skills and followed agreements that reached beyond a single household. Those relationships helped cities function.\n\nThe political arrangement is harder to recover. Some researchers emphasize cooperation among groups rather than commands from a ruling elite. Others read divisions between neighborhoods and differences in buildings as evidence of hierarchy—unequal positions in society. Large public works alone cannot decide between these explanations.\n\nWe should not supply an Egyptian-style ruler simply because we have already studied Egyptian monuments. Nor should we turn uncertainty about rulers into a claim that everyone was equal. We can explain important parts of urban coordination while remaining uncertain about who held authority and how widely its benefits were shared.' },
    ],
  },
  {
    id: 'section.indus.changing-settlements', heading: 'Changes after 1900 BCE', purpose: 'Distinguish the end of an urban phase from the disappearance of a population or all its knowledge.',
    modules: [
      { id: 'module.indus.changing-settlements', type: 'prose', claimIds: ['claim.indus.urban-transformation'], sourceIds: ['source.indus.harp-settlement', 'source.indus.kenoyer-tradition'], body: 'Around and after 1900 BCE, the earlier pattern of urban life changed. At Harappa, later occupation covered less ground than the city had at its greatest extent. That is evidence of a settlement changing, not an empty site with nobody left.\n\nAcross the wider region, farming and skills such as pottery and bead-making continued even as the earlier organization of cities and exchange changed. The shift unfolded over time. It should not be compressed into a single day when an entire people vanished.\n\nThe cities leave us more than a mystery about unread signs. They preserve ways people collected water, maintained shared spaces, measured goods and communicated. Those practices let us reconstruct parts of their lives even when we cannot recover their words.' },
    ],
  },
  {
    id: 'section.indus.understanding', heading: 'Explain the evidence', purpose: 'Check a shared-measure inference and ask for an explanation of collective water work and its limits.',
    modules: [
      { id: 'module.indus.shared-standards-check', type: 'prompt', promptId: 'prompt.indus.shared-standards', claimIds: ['claim.indus.shared-weights', 'claim.indus.coordination-and-rule'], sourceIds: ['source.indus.measuring', 'source.indus.green-governance'] },
      { id: 'module.indus.water-work-check', type: 'prompt', promptId: 'prompt.indus.water-and-work', claimIds: ['claim.indus.household-drainage', 'claim.indus.water-storage', 'claim.indus.coordination-and-rule'], sourceIds: ['source.indus.street-drains', 'source.indus.dholavira', 'source.indus.green-governance'] },
    ],
  },
];

export const indusLesson: Lesson = {
  id: 'lesson.indus.cities-and-signs', legacyAliases: ['indus_cities', 'indus_script'], status: 'published',
  title: 'Indus Cities and Undeciphered Signs', masthead: 'c. 2600–1900 BCE', place: 'Indus region · present-day Pakistan and India',
  chronology: { startYear: -2600, endYear: -1900, display: 'c. 2600–1900 BCE', approximate: true },
  significance: 'Water systems, shared weights and seals reveal how Indus communities organized city life—even though their inscriptions remain unread.',
  learningOutcome: 'You explored how water systems and shared measures connected Indus communities, and why organized work does not by itself identify who ruled.',
  orientationMapModuleId: 'module.indus.cities-locator-map',
  heroMediaId: 'media.indus.street-reconstruction',
  heroLabel: 'A neighborhood at Mohenjo-daro',
  heroCaption: 'Reconstruction based on documented household and street drains. The people, buildings and moment are imagined; part of the channel is exposed to show how it connects.',
  sectionIdsRequired: sections.map((section) => section.id), sections,
  claimIds: indusClaims.map((claim) => claim.id), sourceIds: indusSources.map((source) => source.id), mediaIds: indusMedia.map((media) => media.id), promptIds: indusPrompts.map((prompt) => prompt.id),
};

export const indusContent: AuthoredContentModule = { sources: indusSources, claims: indusClaims, lessons: [indusLesson], prompts: indusPrompts, media: indusMedia, cards: [indusSealCard] };
