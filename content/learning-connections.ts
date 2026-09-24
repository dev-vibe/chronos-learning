/** Editorial learning bridges using the existing published explanations.
 * These are invitations to retrieve, not mastery records or prerequisites. */
export type LearningConnection = {
  retrieve?: { lessonId: string; prompt: string };
  extend: string;
  revisit?: { lessonId: string; prompt: string };
  reasoningSkill: string;
};

export const learningConnectionsByLessonId: Record<string, LearningConnection> = {
  'lesson.indus.cities-and-signs': {
    retrieve: { lessonId: 'lesson.writing.early-systems', prompt: 'How could durable marks help people coordinate goods and work?' },
    extend: 'Use shared measures, water systems and seals to investigate coordination where the inscriptions remain unread.',
    reasoningSkill: 'Combine archaeological patterns with context while separating organized work from a particular form of rule.',
  },
  'lesson.humans.homo-sapiens-origins': {
    extend: 'Start with a question we will return to: what can surviving evidence tell us, and what does it leave uncertain?',
    revisit: { lessonId: 'lesson.humans.migrations-and-interbreeding', prompt: 'How does ancient DNA add to the story told by fossils?' },
    reasoningSkill: 'Distinguish an observation from an inference and name a limit of evidence.',
  },
  'lesson.humans.migrations-and-interbreeding': {
    retrieve: { lessonId: 'lesson.humans.homo-sapiens-origins', prompt: 'Why could one fossil site not settle where our species began?' },
    extend: 'Bring that caution to fossils and ancient DNA as you follow migrations and encounters.',
    revisit: { lessonId: 'lesson.humans.sahul-crossing', prompt: 'What can evidence show about a journey when the travellers left no written account?' },
    reasoningSkill: 'Compare what different kinds of evidence can establish.',
  },
  'lesson.humans.sahul-crossing': {
    retrieve: { lessonId: 'lesson.humans.migrations-and-interbreeding', prompt: 'What can a trace of ancient people tell us about movement, and what remains unknown?' },
    extend: 'Use archaeology and changing geography to examine sea crossings without inventing the missing voyage.',
    revisit: { lessonId: 'lesson.farming.multiple-origins', prompt: 'How can traces from several places challenge a single story of change?' },
    reasoningSkill: 'Separate evidence of arrival from hypotheses about routes and methods.',
  },
  'lesson.farming.multiple-origins': {
    retrieve: { lessonId: 'lesson.humans.homo-sapiens-origins', prompt: 'Why does evidence from several places matter?' },
    extend: 'Compare several beginnings of farming instead of treating one place as a model for everyone.',
    revisit: { lessonId: 'lesson.farming.settlements', prompt: 'How did growing food change everyday life in one settlement?' },
    reasoningSkill: 'Compare change across regions without assuming a single path.',
  },
  'lesson.farming.settlements': {
    retrieve: { lessonId: 'lesson.farming.multiple-origins', prompt: 'Why was farming a gradual change with different beginnings?' },
    extend: 'Look closely at one settlement to weigh the opportunities and costs of living together.',
    revisit: { lessonId: 'lesson.uruk.first-city', prompt: 'Which problems change when a settlement becomes a city?' },
    reasoningSkill: 'Connect material evidence to daily life and weigh consequences.',
  },
  'lesson.uruk.first-city': {
    retrieve: { lessonId: 'lesson.farming.settlements', prompt: 'What opportunities and difficulties came with living close together?' },
    extend: 'Examine how food, work, and records connected people in a much larger city.',
    revisit: { lessonId: 'lesson.writing.early-systems', prompt: 'Why might a city need records that outlast a conversation?' },
    reasoningSkill: 'Explain how several parts of a social system depend on each other.',
  },
  'lesson.writing.early-systems': {
    retrieve: { lessonId: 'lesson.uruk.first-city', prompt: 'Why did people coordinating food and work need records?' },
    extend: 'Follow the marks on clay and ask what these records could communicate.',
    revisit: { lessonId: 'lesson.egypt.nile-state', prompt: 'What can a ruler’s surviving image tell us, and what can it not prove?' },
    reasoningSkill: 'Interpret a record in context without assuming it works like modern writing.',
  },
  'lesson.egypt.nile-state': {
    retrieve: { lessonId: 'lesson.uruk.first-city', prompt: 'How could organising food and work support political power?' },
    extend: 'Compare that idea with the Nile and with the claims a royal object presents.',
    revisit: { lessonId: 'lesson.egypt.pyramids-and-state-labor', prompt: 'Which evidence can connect a monument to builders and rulers?' },
    reasoningSkill: 'Distinguish a claim to power from evidence of how power worked.',
  },
  'lesson.caral.andean-urbanism': {
    retrieve: { lessonId: 'lesson.uruk.first-city', prompt: 'Which relationships helped people live and work in a city?' },
    extend: 'Compare an Andean urban case without assuming it followed Mesopotamia’s path.',
    revisit: { lessonId: 'lesson.egypt.pyramids-and-state-labor', prompt: 'What does a monumental building reveal about organised work?' },
    reasoningSkill: 'Compare societies while testing the limits of the comparison.',
  },
  'lesson.egypt.pyramids-and-state-labor': {
    retrieve: { lessonId: 'lesson.egypt.nile-state', prompt: 'Why does a royal claim need to be checked against other evidence?' },
    extend: 'Keep date, builder, use, and purpose separate as you compare surviving traces.',
    reasoningSkill: 'Evaluate an attribution using context and multiple kinds of evidence.',
  },
  'lesson.nubia.kerma-and-nile-world': {
    retrieve: { lessonId: 'lesson.egypt.nile-state', prompt: 'How could organizing food and work support political power along the Nile?' },
    extend: 'Follow food, skilled work, buildings and traveling objects to understand Kerma as a powerful kingdom with changing ties to Egypt.',
    reasoningSkill: 'Distinguish evidence of local production from evidence that an object moved between communities.',
  },
  'lesson.mesopotamia.akkadian-empire': {
    retrieve: { lessonId: 'lesson.nubia.kerma-and-nile-world', prompt: 'Why does an object from another kingdom not, by itself, prove political rule?' },
    extend: 'Compare a ruler’s victories and image with traces of administration and royal ties at two northern cities.',
    reasoningSkill: 'Test a royal claim against place-specific evidence and qualify what kind of political connection it supports.',
  },
};
