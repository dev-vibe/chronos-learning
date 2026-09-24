import type { Claim, Lesson, Source, UnderstandingPrompt } from '../../src/domains/contracts';
import type { AuthoredContentModule } from '../assemble';

const lessonId = 'lesson.mesopotamia.law-and-kingship';

export const hammurabiSources: Source[] = [
  { id: 'source.hammurabi.louvre-object', title: 'The Code of Hammurabi, SB 8', url: 'https://collections.louvre.fr/en/ark:/53355/cl010174436', publisher: 'Musée du Louvre', accessedOn: '2026-09-24', licenseOrUse: 'Research citation for SB 8 object, relief, dimensions, provenance and dating. Image redistribution needs a separate use and credit review.', reviewStatus: 'reviewed' },
  { id: 'source.hammurabi.cdli-stele', title: 'Hammurabi law stele, SB 8 / P249253, witness to Q006387', url: 'https://cdli.earth/artifacts/249253', publisher: 'Cuneiform Digital Library Initiative', accessedOn: '2026-09-24', licenseOrUse: 'Research citation and paraphrase of column 1 lines 28–49 and reverse column XVII lines 45–65. No image redistribution approved.', reviewStatus: 'reviewed' },
  { id: 'source.hammurabi.louvre-essay', title: 'The Code of Hammurabi', url: 'https://www.louvre.fr/en/the-code-of-hammurabi', publisher: 'Musée du Louvre', accessedOn: '2026-09-23', licenseOrUse: 'Research citation for the monument’s text, earlier law collections and limits of the modern-code analogy. No image redistribution.', reviewStatus: 'reviewed' },
  { id: 'source.hammurabi.ehammurabi-198', title: 'Law §198 and source apparatus', url: 'https://ehammurabi.org/law/198', publisher: 'eHammurabi', accessedOn: '2026-09-24', licenseOrUse: 'Research citation for the silver-remedy case and translation apparatus; no translated text or artwork redistributed.', reviewStatus: 'reviewed' },
  { id: 'source.hammurabi.letter', title: 'Letter from King Hammurabi concerning a land dispute, YBC 9959 / P293786', url: 'https://cdli.earth/cdli-tablet/664', publisher: 'Cuneiform Digital Library Initiative / Yale Babylonian Collection', accessedOn: '2026-09-24', licenseOrUse: 'Research citation and paraphrase of translated lines 4–10. Image reuse needs permission or noncommercial-use determination.', reviewStatus: 'reviewed' },
  { id: 'source.hammurabi.commentary', title: 'Commentary on the Laws of Hammurabi, BM 59739 / P461271', url: 'https://ccp.yale.edu/P461271', publisher: 'Yale Cuneiform Commentaries Project', accessedOn: '2026-09-24', licenseOrUse: 'Research citation for first-millennium scholarly reception. Yale page and BM photographs are not cleared for redistribution.', reviewStatus: 'reviewed' },
];

export const hammurabiClaims: Claim[] = [
  { id: 'claim.hammurabi.stele-object', statement: 'A basalt stele with Hammurabi’s law collection and a relief survives; it was made in Mesopotamia and found at Susa.', kind: 'observation', certainty: 'high', sourceIds: ['source.hammurabi.louvre-object', 'source.hammurabi.cdli-stele'], reviewStatus: 'reviewed' },
  { id: 'claim.hammurabi.relief-figures', statement: 'The relief shows Hammurabi standing before the seated god Shamash.', kind: 'observation', certainty: 'high', sourceIds: ['source.hammurabi.louvre-object'], reviewStatus: 'reviewed' },
  { id: 'claim.hammurabi.royal-image', statement: 'The relief presents royal authority in relation to Shamash but does not show the god dictating each case.', kind: 'interpretation', certainty: 'high', sourceIds: ['source.hammurabi.louvre-object', 'source.hammurabi.louvre-essay'], reviewStatus: 'reviewed' },
  { id: 'claim.hammurabi.justice-claim', statement: 'In the prologue, Hammurabi claims a duty to establish justice and prevent the strong from harming the weak.', kind: 'observation', certainty: 'high', sourceIds: ['source.hammurabi.cdli-stele'], reviewStatus: 'reviewed' },
  { id: 'claim.hammurabi.case-form', statement: 'The collection presents many conditional cases, pairing a stated situation with a stated outcome.', kind: 'observation', certainty: 'high', sourceIds: ['source.hammurabi.cdli-stele', 'source.hammurabi.louvre-essay'], reviewStatus: 'reviewed' },
  { id: 'claim.hammurabi.earlier-laws', statement: 'Mesopotamian law collections existed before Hammurabi’s, so calling his monument the first written laws is misleading.', kind: 'interpretation', certainty: 'high', sourceIds: ['source.hammurabi.louvre-essay'], reviewStatus: 'reviewed' },
  { id: 'claim.hammurabi.different-remedies', statement: 'Neighboring injury cases prescribe different outcomes according to the injured person’s legal status: a matching injury in §196 and silver in §198.', kind: 'observation', certainty: 'high', sourceIds: ['source.hammurabi.cdli-stele', 'source.hammurabi.ehammurabi-198'], reviewStatus: 'reviewed' },
  { id: 'claim.hammurabi.status-limits', statement: 'The cases show unequal written remedies, but the precise social meaning of the status terms and the frequency of those outcomes in practice require other evidence.', kind: 'interpretation', certainty: 'moderate', sourceIds: ['source.hammurabi.cdli-stele', 'source.hammurabi.ehammurabi-198', 'source.hammurabi.letter'], reviewStatus: 'editorial-review-required' },
  { id: 'claim.hammurabi.field-letter', statement: 'YBC 9959 records a shepherd’s complaint about a field and Hammurabi’s order to the addressee to decide the case and return the field.', kind: 'observation', certainty: 'high', sourceIds: ['source.hammurabi.letter'], reviewStatus: 'reviewed' },
  { id: 'claim.hammurabi.letter-limit', statement: 'The surviving letter records an order, not proof that the field was actually returned or that this was a typical dispute.', kind: 'interpretation', certainty: 'high', sourceIds: ['source.hammurabi.letter'], reviewStatus: 'reviewed' },
  { id: 'claim.hammurabi.later-study', statement: 'A first-millennium tablet comments on parts of Hammurabi’s collection, showing its later scholarly use.', kind: 'observation', certainty: 'high', sourceIds: ['source.hammurabi.commentary'], reviewStatus: 'reviewed' },
  { id: 'claim.hammurabi.practice-limit', statement: 'The stele, a petition letter and later commentary answer different questions; together they do not establish how often Hammurabi-era judges followed the stele.', kind: 'interpretation', certainty: 'moderate', sourceIds: ['source.hammurabi.cdli-stele', 'source.hammurabi.letter', 'source.hammurabi.commentary'], reviewStatus: 'editorial-review-required' },
];

export const hammurabiPrompts: UnderstandingPrompt[] = [
  {
    id: 'prompt.hammurabi.sources', lessonId, kind: 'supported-selection', required: true,
    question: 'The stele promises justice, while a letter orders an official to decide one shepherd’s field dispute. What can these sources support together?',
    hint: 'Think about what each source records, and what neither follows through to show.',
    explanation: 'The stele presents a ruler’s ideal and written cases. The letter records one complaint and an order. Neither tells us how every dispute ended or whether every stele case was applied in court.',
    options: [
      { id: 'option.hammurabi.source-limits', label: 'The king publicly claimed justice and intervened in one dispute, but ordinary outcomes need more evidence.', feedback: 'Yes. Both sources matter, and each has a limit.' },
      { id: 'option.hammurabi.every-court', label: 'Every judge applied every case on the stele exactly as written.', feedback: 'The stone states cases, but these sources do not show every courtroom decision.' },
      { id: 'option.hammurabi.no-action', label: 'The king only made an image; no surviving record shows him responding to a dispute.', feedback: 'The field letter records a royal order, although it does not show the final outcome.' },
    ],
  },
  {
    id: 'prompt.hammurabi.justice-and-status', lessonId, kind: 'concise-explanation', required: true, minimumResponseLength: 20,
    question: 'Hammurabi’s prologue says he would protect people from the strong. What do the two injury cases make you ask about that promise? Name one thing the cases show and one thing they cannot tell us.',
    hint: 'Compare the stated outcomes, then ask whether a written case is the same as an observed result.',
    explanation: 'The neighboring cases prescribe different remedies for people of different legal standing, so the text’s promise did not mean identical written treatment. The cases alone cannot tell us how often those outcomes happened, or what every person experienced.',
  },
];

const sections: Lesson['sections'] = [
  {
    id: 'section.hammurabi.babylon-and-stele', heading: 'Babylon and the law stele', purpose: 'Orient the learner in time and place and make the surviving object the opening question.',
    modules: [
      { id: 'module.hammurabi.opening', type: 'prose', claimIds: ['claim.hammurabi.stele-object', 'claim.hammurabi.practice-limit'], sourceIds: ['source.hammurabi.louvre-object', 'source.hammurabi.cdli-stele', 'source.hammurabi.letter'], body: 'A tall black stone survives from the kingdom of Hammurabi. It carries a carved scene and long columns of writing. If you could read the stone, would you know how justice worked for the people who lived under his rule?\n\nHammurabi ruled Babylon in Mesopotamia, the region around the Tigris and Euphrates rivers in and around present-day Iraq, during the eighteenth century BCE. The stone was made in Mesopotamia and found much later at Susa, in present-day Iran. It is a surviving object, but it does not come with a record of every dispute it may have influenced. We will read it beside a different kind of source: a letter about one person’s field.' },
    ],
  },
  {
    id: 'section.hammurabi.royal-claim', heading: 'The king’s claim to justice', purpose: 'Read the relief and prologue as a public royal statement with a specific point of view.',
    modules: [
      { id: 'module.hammurabi.royal-claim', type: 'prose', claimIds: ['claim.hammurabi.relief-figures', 'claim.hammurabi.royal-image', 'claim.hammurabi.justice-claim'], sourceIds: ['source.hammurabi.louvre-object', 'source.hammurabi.louvre-essay', 'source.hammurabi.cdli-stele'], body: 'At the top of the stele, Hammurabi stands before Shamash, a god associated with justice. The image connects the king’s authority with the god. It does not show Shamash dictating each case.\n\nBelow the image, the prologue speaks in the king’s voice. Hammurabi says his rule should establish justice and keep the strong from harming the weak. That is a powerful claim. It tells us how the ruler wanted his actions remembered. To ask what the promise meant for other people, we need to read the cases and look beyond the stone.' },
    ],
  },
  {
    id: 'section.hammurabi.written-cases', heading: 'Cases written on the stone', purpose: 'Explain the conditional form and avoid the first-code myth or automatic-enforcement inference.',
    modules: [
      { id: 'module.hammurabi.cases', type: 'prose', claimIds: ['claim.hammurabi.case-form', 'claim.hammurabi.earlier-laws'], sourceIds: ['source.hammurabi.cdli-stele', 'source.hammurabi.louvre-essay'], body: 'Most of the long inscription gives cases in a repeating form: if a situation happens, then an outcome follows. The subjects range across injuries, property, work and households. Earlier Mesopotamian law collections also survive, so Hammurabi did not invent writing laws.\n\nA written case can show what the text says should happen in a stated situation. It cannot, by itself, tell us how often that situation arose or what a particular judge did. The stone is worth taking seriously as a statement about justice without treating it like a complete record of court decisions.' },
    ],
  },
  {
    id: 'section.hammurabi.injury-and-status', heading: 'Different remedies for injuries', purpose: 'Compare neighboring provisions and make the tension with the justice claim visible without a rigid class diagram.',
    modules: [
      { id: 'module.hammurabi.injury-intro', type: 'prose', claimIds: ['claim.hammurabi.different-remedies', 'claim.hammurabi.status-limits'], sourceIds: ['source.hammurabi.cdli-stele', 'source.hammurabi.ehammurabi-198'], body: 'Two neighboring cases concern injury to an eye. In one, the stated outcome is a matching injury to the person who caused it. In the other, the stated outcome is a payment of silver. The difference depends on a status word applied to the injured person. The Akkadian terms are difficult to fit neatly into modern labels, but the unequal written outcomes are clear.\n\nThe famous phrase “eye for an eye” is therefore a poor summary of how the whole collection treats people. The king’s promise to protect the weak sits beside provisions that distinguish people by legal standing. We should ask what justice meant in this text, and whose position it centered.' },
      { id: 'module.hammurabi.injury-contrast', type: 'knowledge', eyebrow: 'What you can see', title: 'Two neighboring cases', body: 'Both cases concern an eye injury. Their prescribed remedies differ.', claimIds: ['claim.hammurabi.different-remedies', 'claim.hammurabi.status-limits'], sourceIds: ['source.hammurabi.cdli-stele', 'source.hammurabi.ehammurabi-198'], items: [
        { label: 'Case §196', detail: 'For injury to a person described with one legal-status term, the text prescribes a matching injury.' },
        { label: 'Case §198', detail: 'For injury to a person described with another term, the text prescribes silver.' },
        { label: 'The limit', detail: 'These are written remedies. The cases do not record how often either result occurred.' },
      ] },
    ],
  },
  {
    id: 'section.hammurabi.field-letter', heading: 'A shepherd’s field dispute', purpose: 'Follow a named petitioner through a surviving order while distinguishing instruction from outcome.',
    modules: [
      { id: 'module.hammurabi.field-letter', type: 'prose', claimIds: ['claim.hammurabi.field-letter', 'claim.hammurabi.letter-limit'], sourceIds: ['source.hammurabi.letter'], body: 'Another clay record brings us closer to one dispute. A shepherd named Issinabu reported that a field he held had been assigned to someone else. A letter from Hammurabi tells its addressee to decide the case and return the field to him.\n\nThis is an action in the record: someone complained, the matter reached the king, and he sent an order. The letter does not show the final handover. It also cannot stand for every person seeking help. Still, it gives us a kind of evidence the stele cannot: a particular petitioner and a particular response.' },
    ],
  },
  {
    id: 'section.hammurabi.sources-and-practice', heading: 'What the stone and letter can tell us', purpose: 'Resolve the evidence question, include the later scholarly afterlife, and preserve the open question about legal authority.',
    modules: [
      { id: 'module.hammurabi.later-use', type: 'prose', claimIds: ['claim.hammurabi.later-study', 'claim.hammurabi.practice-limit'], sourceIds: ['source.hammurabi.commentary', 'source.hammurabi.cdli-stele', 'source.hammurabi.letter'], body: 'People continued to work with Hammurabi’s text after his lifetime. A small tablet made many centuries later comments on some of its cases. That tells us the collection remained important to learned readers. It does not tell us how a court in Hammurabi’s own reign decided every case.\n\nScholars still discuss how the royal monument, scribal learning and legal practice were connected. The stone could make a serious public claim to justice even if it was not used like a modern law book. The field letter shows an order in one dispute, but it does not settle the larger question. Different sources let us ask better questions without pretending they give one complete view of Babylonian life.' },
      { id: 'module.hammurabi.source-limits', type: 'knowledge', eyebrow: 'What we can know', title: 'What we can know', body: 'Each surviving source answers a different part of the question.', claimIds: ['claim.hammurabi.justice-claim', 'claim.hammurabi.field-letter', 'claim.hammurabi.practice-limit'], sourceIds: ['source.hammurabi.cdli-stele', 'source.hammurabi.letter', 'source.hammurabi.commentary'], items: [
        { label: 'It can show', detail: 'The stone presents the king’s justice claim and written cases; the letter records a royal order.' },
        { label: 'It can support', detail: 'Together, they show that royal justice was both a public message and a subject of specific requests.' },
        { label: 'It cannot prove alone', detail: 'That every judge followed every written case, or that Issinabu received his field.' },
        { label: 'It cannot recover', detail: 'The experience of every household, especially people whose words were not preserved.' },
      ] },
    ],
  },
  {
    id: 'section.hammurabi.understanding', heading: 'Explain the evidence for royal justice', purpose: 'Ask the learner to connect the ruler’s claim, unequal cases and a specific petition without overclaiming practice.',
    modules: [
      { id: 'module.hammurabi.source-check', type: 'prompt', promptId: 'prompt.hammurabi.sources', claimIds: ['claim.hammurabi.justice-claim', 'claim.hammurabi.field-letter', 'claim.hammurabi.practice-limit'], sourceIds: ['source.hammurabi.cdli-stele', 'source.hammurabi.letter'] },
      { id: 'module.hammurabi.status-check', type: 'prompt', promptId: 'prompt.hammurabi.justice-and-status', claimIds: ['claim.hammurabi.justice-claim', 'claim.hammurabi.different-remedies', 'claim.hammurabi.status-limits'], sourceIds: ['source.hammurabi.cdli-stele', 'source.hammurabi.ehammurabi-198'] },
    ],
  },
];

export const hammurabiLesson: Lesson = {
  id: lessonId, legacyAliases: ['hammurabi'], status: 'draft',
  title: 'Law, Kingship, and Hammurabi’s Babylon', masthead: 'Eighteenth century BCE', place: 'Babylon · Mesopotamia · present-day Iraq',
  chronology: { startYear: -1800, endYear: -1600, display: 'c. 1800–1600 BCE', approximate: true },
  significance: 'Hammurabi’s law monument claimed just rule. Its written cases, a field-dispute letter and later commentary reveal different parts of the story—and leave real limits.',
  learningOutcome: 'You compared a royal promise, unequal written cases and a specific petition to explain what surviving sources can and cannot tell us about justice.',
  sectionIdsRequired: sections.map((section) => section.id), sections,
  claimIds: hammurabiClaims.map((claim) => claim.id), sourceIds: hammurabiSources.map((source) => source.id), mediaIds: [], promptIds: hammurabiPrompts.map((prompt) => prompt.id),
};

export const hammurabiContent: AuthoredContentModule = { sources: hammurabiSources, claims: hammurabiClaims, media: [], lessons: [hammurabiLesson], prompts: hammurabiPrompts };
