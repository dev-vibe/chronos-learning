import type { Journey } from '../../src/domains/contracts';

export const worldHistoryJourney: Journey = {
  id: 'journey.world-history',
  title: 'World History',
  kind: 'world-history',
  status: 'published',
  learnerPromise: 'Build a clear chronological map of how human societies changed.',
  openingQuestion: 'How did people create new ways to live together across time and place?',
  description: 'The primary chronological journey through reviewed turning points in world history.',
  period: 'Deep history to the present',
  region: 'Global',
  approximateMinutes: 80,
  featured: true,
  prerequisiteJourneyIds: [],
  relatedJourneyIds: [],
  entryLessonId: 'lesson.humans.homo-sapiens-origins',
  // Chapters follow the canonical World Spine roster in
  // docs/content/data/world-spine-canonical-roster.csv, so entry identities stay
  // stable as the earlier positions are backfilled.
  chapters: [
    {
      id: 'chapter.world-history.human-beginnings',
      title: 'Human Beginnings and Food Systems',
      position: 0,
      entries: [
        { id: 'entry.world-history.homo-sapiens-origins', lessonId: 'lesson.humans.homo-sapiens-origins', position: 0, required: true, framing: 'Start where the evidence starts, and find out why there is no single birthplace to point to' },
        { id: 'entry.world-history.migrations-and-interbreeding', lessonId: 'lesson.humans.migrations-and-interbreeding', position: 1, required: true, framing: 'Follow some connected African populations beyond the continent and ask what happened when they met other humans' },
        { id: 'entry.world-history.multiple-origins', lessonId: 'lesson.farming.multiple-origins', position: 2, required: true, framing: 'Before zooming into one settlement, see how farming began independently in more than one part of the world' },
        { id: 'entry.world-history.farming', lessonId: 'lesson.farming.settlements', position: 3, required: true, framing: 'Read one settlement to see how stored food changed the work and choices of staying' },
      ],
    },
    {
      id: 'chapter.world-history.cities-and-states',
      title: 'Cities, States, and Bronze Age Networks',
      position: 1,
      entries: [
        { id: 'entry.world-history.uruk', lessonId: 'lesson.uruk.first-city', position: 0, required: true, framing: 'How city life changed human coordination' },
        { id: 'entry.world-history.writing', lessonId: 'lesson.writing.early-systems', position: 1, required: true, framing: 'How durable records changed coordination' },
        { id: 'entry.world-history.egypt-nile-state', lessonId: 'lesson.egypt.nile-state', position: 2, required: true, framing: 'How a river corridor, administration, and royal claims became part of an early territorial state' },
        { id: 'entry.world-history.caral-andean-urbanism', lessonId: 'lesson.caral.andean-urbanism', position: 3, required: true, framing: 'See how urban life took shape on Peru’s desert coast without pottery, metal, or writing' },
        { id: 'entry.world-history.pyramids-and-state-labor', lessonId: 'lesson.egypt.pyramids-and-state-labor', position: 4, required: true, framing: 'Test how dates, inscriptions, scans, objects, and ancient accounts support different parts of a monument’s history' },
      ],
    },
  ],
};
