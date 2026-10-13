import type { Claim, Lesson, Source, UnderstandingPrompt } from '../../src/domains/contracts';
import type { AuthoredContentModule } from '../assemble';
import { hammurabiLocatorVisual, hammurabiMedia, hammurabiMediaSources, hammurabiSteleCard, hammurabiSteleVisual } from './hammurabi-media';

const lessonId = 'lesson.mesopotamia.law-and-kingship';

export const hammurabiSources: Source[] = [
  ...hammurabiMediaSources,
  { id: 'source.hammurabi.met-kingdom', title: 'The Isin-Larsa and Old Babylonian Periods (2004–1595 B.C.)', url: 'https://www.metmuseum.org/essays/the-isin-larsa-and-old-babylonian-periods-2004-1595-b-c', publisher: 'Elizabeth Knott, Metropolitan Museum of Art', accessedOn: '2026-10-04', licenseOrUse: 'Research citation and original paraphrase of political-history paragraphs and Art and Culture; no images redistributed.', reviewStatus: 'reviewed' },
  { id: 'source.hammurabi.met-babylon', title: 'Babylon', url: 'https://www.metmuseum.org/essays/babylon', publisher: 'Michael Seymour, Metropolitan Museum of Art', accessedOn: '2026-10-04', licenseOrUse: 'Research citation and original paraphrase of the geography and Hammurabi paragraphs; no images redistributed.', reviewStatus: 'reviewed' },
  { id: 'source.hammurabi.louvre-object', title: 'The Code of Hammurabi, SB 8', url: 'https://collections.louvre.fr/en/ark:/53355/cl010174436', publisher: 'Musée du Louvre', accessedOn: '2026-09-24', licenseOrUse: 'Research citation for the surviving object, relief, dimensions and provenance; image rights remain unresolved.', reviewStatus: 'reviewed' },
  { id: 'source.hammurabi.louvre-essay', title: 'The Code of Hammurabi', url: 'https://www.louvre.fr/en/the-code-of-hammurabi', publisher: 'Musée du Louvre', accessedOn: '2026-10-04', licenseOrUse: 'Research citation for the monument, conditional cases, subject range and legal significance; no translated wording or images redistributed.', reviewStatus: 'reviewed' },
  { id: 'source.hammurabi.avalon-cases', title: 'Code of Hammurabi: prologue and numbered provisions', url: 'https://avalon.law.yale.edu/ancient/hamcode.asp', publisher: 'Avalon Project, Yale Law School', accessedOn: '2026-10-04', licenseOrUse: 'Older English primary-text translation used for original narrow paraphrases of §§48, 55 and 122. Translation vocabulary is dated; no quoted passage or exact debt-tablet interpretation used.', reviewStatus: 'reviewed' },
  { id: 'source.hammurabi.cdli-stele', title: 'Hammurabi law stele, SB 8 / P249253', url: 'https://cdli.earth/artifacts/249253', publisher: 'Cuneiform Digital Library Initiative', accessedOn: '2026-09-24', licenseOrUse: 'Previously close-reviewed prologue column 1 lines 28–49 and reverse column XVII §§196–199; research paraphrase only.', reviewStatus: 'reviewed' },
  { id: 'source.hammurabi.letter', title: 'Letter concerning a land dispute, YBC 9959 / P293786', url: 'https://cdli.earth/cdli-tablet/664', publisher: 'Cuneiform Digital Library Initiative / Yale Babylonian Collection', accessedOn: '2026-09-24', licenseOrUse: 'Research paraphrase of translated lines 4–10; no image redistribution approved.', reviewStatus: 'reviewed' },
  { id: 'source.hammurabi.commentary', title: 'Commentary on the Laws of Hammurabi, BM 59739 / P461271', url: 'https://ccp.yale.edu/P461271', publisher: 'Yale Cuneiform Commentaries Project', accessedOn: '2026-09-24', licenseOrUse: 'Research citation for later scholarly study; no photographs redistributed.', reviewStatus: 'reviewed' },
];

export const hammurabiClaims: Claim[] = [
  { id: 'claim.hammurabi.site-orientation', statement: 'The archaeological site of Babylon lies northwest of Larsa in the lower Mesopotamian plain.', kind: 'observation', certainty: 'high', sourceIds: ['source.hammurabi.map-babylon', 'source.hammurabi.map-larsa', 'source.hammurabi.map-excavation'], reviewStatus: 'reviewed' },
  { id: 'claim.hammurabi.buried-city', statement: 'The earliest Babylonian house levels, from the time of the first dynasty’s kings, lie below the modern water level, so the city of Hammurabi’s time is known only in small part.', kind: 'observation', certainty: 'high', sourceIds: ['source.hammurabi.koldewey-merkes'], reviewStatus: 'reviewed' },
  { id: 'claim.hammurabi.babylon-location', statement: 'Babylon stood on the Euphrates in Mesopotamia, in present-day Iraq.', kind: 'observation', certainty: 'high', sourceIds: ['source.hammurabi.met-babylon'], reviewStatus: 'reviewed' },
  { id: 'claim.hammurabi.kingdom-growth', statement: 'Through alliances and military campaigns, Hammurabi expanded Babylon’s kingdom, defeated Larsa and made Babylon a major political center.', kind: 'interpretation', certainty: 'high', sourceIds: ['source.hammurabi.met-kingdom', 'source.hammurabi.met-babylon'], reviewStatus: 'reviewed' },
  { id: 'claim.hammurabi.governing-work', statement: 'The law collection and a letter about a field show royal government addressing property, agricultural obligations and particular requests through written rules and instructions.', kind: 'interpretation', certainty: 'moderate', sourceIds: ['source.hammurabi.avalon-cases', 'source.hammurabi.letter', 'source.hammurabi.louvre-essay'], reviewStatus: 'reviewed' },
  { id: 'claim.hammurabi.stele-object', statement: 'The surviving basalt law stele is more than two meters tall and bears a royal relief above its inscription.', kind: 'observation', certainty: 'high', sourceIds: ['source.hammurabi.louvre-object', 'source.hammurabi.louvre-essay'], reviewStatus: 'reviewed' },
  { id: 'claim.hammurabi.royal-justice', statement: 'The relief associates Hammurabi with Shamash, and the prologue presents protecting the weak as a responsibility of his kingship.', kind: 'interpretation', certainty: 'high', sourceIds: ['source.hammurabi.louvre-object', 'source.hammurabi.cdli-stele'], reviewStatus: 'reviewed' },
  { id: 'claim.hammurabi.case-form', statement: 'The collection organizes conditional cases concerning matters including farming, property, trade, work and households.', kind: 'observation', certainty: 'high', sourceIds: ['source.hammurabi.louvre-essay', 'source.hammurabi.avalon-cases'], reviewStatus: 'reviewed' },
  { id: 'claim.hammurabi.harvest-debt', statement: 'Provision §48 suspends grain repayment to a creditor for a year when specified weather or water failures prevent a harvest.', kind: 'observation', certainty: 'high', sourceIds: ['source.hammurabi.avalon-cases'], reviewStatus: 'reviewed' },
  { id: 'claim.hammurabi.irrigation-duty', statement: 'Provision §55 requires a person whose careless irrigation floods a neighbor’s field to compensate the lost grain.', kind: 'observation', certainty: 'high', sourceIds: ['source.hammurabi.avalon-cases'], reviewStatus: 'reviewed' },
  { id: 'claim.hammurabi.witness-contract', statement: 'Provision §122 calls for witnesses and a contract before handing valuables to another person for safekeeping.', kind: 'observation', certainty: 'high', sourceIds: ['source.hammurabi.avalon-cases'], reviewStatus: 'reviewed' },
  { id: 'claim.hammurabi.different-remedies', statement: 'Neighboring injury cases prescribe different remedies according to legal status: a matching injury in §196 and silver in §198.', kind: 'observation', certainty: 'high', sourceIds: ['source.hammurabi.cdli-stele'], reviewStatus: 'reviewed' },
  { id: 'claim.hammurabi.legal-significance', statement: 'The collection is a major surviving achievement of Babylonian legal reasoning: it connects concrete situations to responsibilities and remedies within a royal monument.', kind: 'interpretation', certainty: 'moderate', sourceIds: ['source.hammurabi.louvre-essay', 'source.hammurabi.avalon-cases'], reviewStatus: 'reviewed' },
  { id: 'claim.hammurabi.later-study', statement: 'A first-millennium commentary shows scholars still studying parts of Hammurabi’s collection many centuries later.', kind: 'observation', certainty: 'high', sourceIds: ['source.hammurabi.commentary'], reviewStatus: 'reviewed' },
];

export const hammurabiPrompts: UnderstandingPrompt[] = [
  {
    id: 'prompt.hammurabi.safekeeping', lessonId, kind: 'supported-selection', required: true,
    bestOptionId: 'option.hammurabi.written-agreement',
    question: 'One provision calls for witnesses and a contract before someone hands over valuables for safekeeping. Why would those steps help settle a later dispute?',
    hint: 'Think about what the witnesses saw and what the contract recorded.',
    explanation: 'Witnesses and a contract provide evidence of what was handed over and what the arrangement was. Written legal cases addressed practical problems in a society where people farmed, borrowed, traded and entrusted property to others.',
    options: [
      { id: 'option.hammurabi.personal-reputation', label: 'They help the judge decide by comparing the two people’s reputations in the city.', feedback: 'Look at what the provision asks witnesses to observe. What information about the handover could they supply?' },
      { id: 'option.hammurabi.written-agreement', label: 'They help the judge establish what was handed over and what the agreement required.', feedback: 'Yes. The handover has witnesses and a written record that can be consulted when people disagree.' },
      { id: 'option.hammurabi.royal-ownership', label: 'They help the palace record the valuables as property belonging to the king’s household.', feedback: 'Check who is handing property to whom. Does this arrangement transfer it to the palace?' },
    ],
  },
  {
    id: 'prompt.hammurabi.problem-and-response', lessonId, kind: 'concise-explanation', required: true, minimumResponseLength: 20,
    question: 'Choose the failed harvest, flooded field or safekeeping case. (1) What problem does it address? (2) How could its rule help people live or work together?',
    hint: 'Start with “The problem is…”. Then explain what the rule asks people to do.',
    explanation: 'A strong answer connects a concrete problem to its remedy or responsibility: a failed harvest to delayed grain repayment, careless irrigation to compensation for a neighbor, or safekeeping to witnesses and a contract. It explains how that response could handle loss, establish obligations or make an agreement easier to enforce.',
  },
];

const sections: Lesson['sections'] = [
  {
    id: 'section.hammurabi.babylon-rivals', heading: 'Babylon among rival kingdoms', purpose: 'Introduce Hammurabi’s starting position and the historical change the lesson follows.',
    modules: [{ id: 'module.hammurabi.opening', type: 'prose', claimIds: ['claim.hammurabi.babylon-location', 'claim.hammurabi.kingdom-growth'], sourceIds: ['source.hammurabi.met-babylon', 'source.hammurabi.met-kingdom'], body: 'When Hammurabi became king in the eighteenth century BCE, Babylon was one kingdom among several competing for power. By the end of his reign, he had made it the center of a much larger state. How did a ruler win that position—and what did he have to do once other cities came under his authority?\n\nBabylon stood on the Euphrates River in Mesopotamia, in present-day Iraq. To its south lay the powerful kingdom of Larsa. Cities across the region had their own rulers, temples and histories. Hammurabi inherited a place in this crowded political world; he transformed Babylon’s position within it.' }, hammurabiLocatorVisual],
  },
  {
    id: 'section.hammurabi.kingdom-growth', heading: 'How Hammurabi expanded his kingdom', purpose: 'Explain the combination of diplomacy and conquest that raised Babylon’s political importance.',
    modules: [{ id: 'module.hammurabi.kingdom-growth', type: 'prose', claimIds: ['claim.hammurabi.kingdom-growth'], sourceIds: ['source.hammurabi.met-kingdom', 'source.hammurabi.met-babylon'], body: 'At the beginning of Hammurabi’s reign, Rim-Sin, the king of Larsa, controlled much of southern Mesopotamia. Babylon’s territory was smaller and lay to the north. Hammurabi used alliances and military campaigns to change that balance. Over roughly thirty years, he took control of Rim-Sin’s territory and defeated other centers of power. Babylon became a major political capital.\n\nThe change was larger than one victory. Cities and farmland that had answered to different kings now came under Hammurabi’s rule. His success joins an earlier story you have encountered at Akkad: a ruler could bring several communities under one authority. Holding and governing them required work after the fighting ended.' }],
  },
  {
    id: 'section.hammurabi.governing-land', heading: 'Governing cities and farmland', purpose: 'Make government concrete through the agricultural and administrative problems the records preserve.',
    modules: [{ id: 'module.hammurabi.government', type: 'prose', claimIds: ['claim.hammurabi.governing-work'], sourceIds: ['source.hammurabi.letter', 'source.hammurabi.avalon-cases', 'source.hammurabi.louvre-essay'], body: 'A kingdom’s affairs included fields, water, debts, property and disputes. The legal collection addresses these subjects in detail. Royal letters also show Hammurabi sending instructions about particular problems. Writing helped carry decisions from the king to the people responsible for acting on them.\n\nOne letter concerns a shepherd named Issinabu. He complained that a field he held had been assigned to someone else. Hammurabi instructed an official to decide the case and return the field. The letter preserves the instruction. Its interest here is the work of government it brings into view: a person made a request, an official had responsibility for the land, and the king intervened.\n\nAcross a growing kingdom, people needed ways to establish who held property, what they owed and how a disagreement should be handled. Hammurabi’s most famous monument takes us into that world.' }],
  },
  {
    id: 'section.hammurabi.law-stele', heading: 'The king and the law stele', purpose: 'Present the monument as a substantial legal and royal achievement within its ancient religious setting.',
    modules: [{ id: 'module.hammurabi.stele', type: 'prose', claimIds: ['claim.hammurabi.stele-object', 'claim.hammurabi.royal-justice', 'claim.hammurabi.case-form'], sourceIds: ['source.hammurabi.louvre-object', 'source.hammurabi.louvre-essay', 'source.hammurabi.cdli-stele'], body: 'The surviving law stele—a standing stone carved with writing—is taller than an adult. Near its top, Hammurabi stands before Shamash, the sun god associated with justice. Below them run long columns of cuneiform signs. The monument joins the king’s authority, divine order and the responsibility to administer justice.\n\nIn its prologue, or opening statement, Hammurabi presents protecting people from the strong as a duty of his kingship. Then come hundreds of legal cases. Many use an “if … then” pattern: describe a situation, then state the response. Their subjects include families, property, agriculture, trade and work.\n\nWritten law collections existed before Hammurabi. His monument stands out for its scale, detailed reasoning and preservation. To see what makes it interesting, look beyond the familiar phrase “eye for an eye” to the everyday problems it addresses.' }, hammurabiSteleVisual],
  },
  {
    id: 'section.hammurabi.practical-cases', heading: 'Laws for farming and property', purpose: 'Let learners encounter the collection’s practical range through three precise provisions.',
    modules: [
      { id: 'module.hammurabi.case-intro', type: 'prose', claimIds: ['claim.hammurabi.harvest-debt', 'claim.hammurabi.irrigation-duty', 'claim.hammurabi.witness-contract'], sourceIds: ['source.hammurabi.avalon-cases'], body: 'A harvest can fail. Water released onto one field can damage another. Two people can disagree over what was handed over for safekeeping. These are problems of people depending on one another. Three provisions show different ways the collection responds.' },
      { id: 'module.hammurabi.practical-cases', type: 'knowledge', eyebrow: 'What you can see', title: 'Three legal cases', body: 'These are paraphrases of provisions in the collection. The numbers are used by modern readers to find them.', claimIds: ['claim.hammurabi.harvest-debt', 'claim.hammurabi.irrigation-duty', 'claim.hammurabi.witness-contract'], sourceIds: ['source.hammurabi.avalon-cases'], items: [
        { label: 'A failed harvest · §48', detail: 'When specified weather or water failures prevent a harvest, a borrower need not repay grain to the creditor that year. The rule makes room for a loss the farmer did not choose.' },
        { label: 'Careless irrigation · §55', detail: 'If someone carelessly floods a neighbor’s field while watering their own, that person must compensate the neighbor for the grain lost. Water brings responsibilities as well as benefits.' },
        { label: 'Valuables for safekeeping · §122', detail: 'Before handing valuables to another person to keep, the owner should have witnesses and a contract. A written agreement and people who saw the handover can help settle a later disagreement.' },
      ] },
    ],
  },
  {
    id: 'section.hammurabi.legal-significance', heading: 'Why Hammurabi’s laws mattered', purpose: 'Explain the legal achievement and afterlife, with proportionate context about status, penalties and use.',
    modules: [{ id: 'module.hammurabi.significance', type: 'prose', claimIds: ['claim.hammurabi.legal-significance', 'claim.hammurabi.different-remedies', 'claim.hammurabi.later-study', 'claim.hammurabi.kingdom-growth'], sourceIds: ['source.hammurabi.louvre-essay', 'source.hammurabi.avalon-cases', 'source.hammurabi.cdli-stele', 'source.hammurabi.commentary', 'source.hammurabi.met-babylon'], body: 'The collection makes a society’s legal reasoning visible. Its cases connect actions to consequences, spell out obligations and consider what should happen when arrangements go wrong. They give us a detailed view of problems that mattered in Babylonian life.\n\nThis was an ancient society with different legal standings and harsh punishments. Some injury cases prescribe a matching bodily injury; others prescribe silver, depending on the injured person’s status. That difference belongs in understanding the legal system alongside its rules for compensation, agreements and relief after a failed harvest.\n\nThe exact way judges used the collection is still debated. Its lasting importance is clear: many centuries later, scholars were still commenting on its cases. Babylon itself remained an important center long after Hammurabi’s reign.\n\nHammurabi’s story therefore brings together two achievements: he enlarged Babylon’s kingdom, and his reign left one of the ancient world’s great surviving legal monuments. The stone’s long rows of cases bring the kingdom into focus—people tending fields, borrowing grain, entrusting property and seeking decisions about what they owed one another.' }],
  },
  {
    id: 'section.hammurabi.understanding', heading: 'Explain how the laws addressed a problem', purpose: 'Ask learners to reason about the practical work of law within the broader historical explanation.',
    modules: [
      { id: 'module.hammurabi.safekeeping-check', type: 'prompt', promptId: 'prompt.hammurabi.safekeeping', claimIds: ['claim.hammurabi.witness-contract'], sourceIds: ['source.hammurabi.avalon-cases'] },
      { id: 'module.hammurabi.problem-check', type: 'prompt', promptId: 'prompt.hammurabi.problem-and-response', claimIds: ['claim.hammurabi.harvest-debt', 'claim.hammurabi.irrigation-duty', 'claim.hammurabi.witness-contract', 'claim.hammurabi.legal-significance'], sourceIds: ['source.hammurabi.avalon-cases', 'source.hammurabi.louvre-essay'] },
    ],
  },
];

export const hammurabiLesson: Lesson = {
  id: lessonId, legacyAliases: ['hammurabi'], status: 'published',
  title: 'Law, Kingship, and Hammurabi’s Babylon', masthead: 'Eighteenth century BCE', place: 'Babylon · Mesopotamia · present-day Iraq',
  chronology: { startYear: -1800, endYear: -1600, display: 'c. 1800–1600 BCE', approximate: true },
  significance: 'Hammurabi made Babylon the center of a powerful kingdom. His famous law collection opens a world of farmers, borrowers, property and the work of government.',
  learningOutcome: 'You traced Babylon’s rise under Hammurabi and explained how a legal case addressed a practical problem in Babylonian life.',
  orientationMapModuleId: 'module.hammurabi.locator',
  heroMediaId: 'media.hammurabi.babylon-hero',
  heroLabel: 'Imagined reconstruction',
  heroCaption: 'Babylon in Hammurabi’s time. His city now lies below the water table, so no plan of it survives. The mud-brick wall, houses, temple courtyard, boats and fields follow what is known of cities in this period.',
  sectionIdsRequired: sections.map((section) => section.id), sections,
  claimIds: hammurabiClaims.map((claim) => claim.id), sourceIds: hammurabiSources.map((source) => source.id), mediaIds: hammurabiMedia.map((media) => media.id), promptIds: hammurabiPrompts.map((prompt) => prompt.id),
};

export const hammurabiContent: AuthoredContentModule = { sources: hammurabiSources, claims: hammurabiClaims, media: hammurabiMedia, lessons: [hammurabiLesson], prompts: hammurabiPrompts, cards: [hammurabiSteleCard] };
