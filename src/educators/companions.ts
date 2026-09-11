import type { ChronosContentBundle } from '../../content/assemble';

/** Public editorial material. Never attach learner identities or responses here. */
export type LessonCompanion = {
  lessonId: string;
  revision: number;
  revisedOn: string;
  purpose: string;
  discussion: string[];
  misconceptions: { idea: string; guidance: string }[];
  example: { question: string; explanation: string };
  referenceSourceIds: string[];
  curriculumMappings: { framework: string; frameworkVersion: string; reference: string; editorialRevision: number }[];
};

export const lessonCompanions: LessonCompanion[] = [
  {
    lessonId: 'lesson.humans.homo-sapiens-origins', revision: 1, revisedOn: '2026-09-10',
    purpose: 'Use fossils from different parts of Africa to explain why the origins of our species cannot be reduced to one birthplace or one moment.',
    discussion: [
      'Ask the learner to describe one feature they can see in the fossil reconstruction before explaining what it might mean.',
      'Compare “oldest found so far” with “first ever”. What would a new discovery change?',
      'A few days later, ask what a newly discovered fossil could tell us, and what it could not settle on its own.',
    ],
    misconceptions: [
      { idea: 'The oldest fossil found marks the exact birthplace of our species.', guidance: 'The record is incomplete. A find tells us where evidence survived and was found, not everywhere people lived.' },
      { idea: 'All of our species’ features appeared together.', guidance: 'Return to the Jebel Irhoud reconstruction: the modern-looking face and long, low braincase show a mix of features.' },
    ],
    example: {
      question: 'What does the mix of features at Jebel Irhoud suggest, and what can it not tell us?',
      explanation: 'The face and braincase suggest that features appeared at different times. A few fossils from one site cannot tell us exactly where all the changes happened or describe every population in Africa.',
    },
    referenceSourceIds: ['source.humans.hublin-2017-irhoud', 'source.humans.richter-2017-irhoud-age', 'source.humans.scerri-2018-subdivided'],
    curriculumMappings: [],
  },
  {
    lessonId: 'lesson.uruk.first-city', revision: 1, revisedOn: '2026-09-10',
    purpose: 'Connect the material traces of city life with the work of coordinating food, labor, and records, while separating surviving evidence from reconstruction.',
    discussion: [
      'Ask which image shows a surviving object and which shows a possible reconstruction of city life.',
      'Use the clay accounting record to discuss why a large community might need records beyond one person’s memory.',
      'A few days later, ask the learner to explain a benefit and a burden of people working together at city scale.',
    ],
    misconceptions: [
      { idea: 'A reconstructed city image shows exactly how the past looked.', guidance: 'Compare it with the archaeological site. Surviving traces constrain a reconstruction, but do not preserve every detail of daily life.' },
      { idea: 'Bigger cities benefited everyone equally.', guidance: 'Return to food, specialized work, and coordinated labor. Benefits and burdens could be distributed unevenly.' },
    ],
    example: {
      question: 'How can a clay record help us explain life at Uruk?',
      explanation: 'Clay records and seals provide evidence for accounting and administration. Keeping track of resources helped coordinate city life, although reading what a particular mark meant requires expert interpretation.',
    },
    referenceSourceIds: ['source.met.uruk', 'source.britannica.uruk'], curriculumMappings: [],
  },
];

export function availableCompanions(content: ChronosContentBundle) {
  return lessonCompanions.flatMap((companion) => {
    // Public access stays independent of the development-only lesson unlock flag.
    const lesson = content.lessons.find((item) => item.id === companion.lessonId && item.status === 'published');
    return lesson ? [{ companion, lesson }] : [];
  });
}
