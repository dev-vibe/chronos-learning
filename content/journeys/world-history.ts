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
  approximateMinutes: 40,
  featured: true,
  prerequisiteJourneyIds: [],
  relatedJourneyIds: [],
  entryLessonId: 'lesson.farming.settlements',
  chapters: [{ id: 'chapter.world-history.foundations', title: 'Foundations', position: 0, entries: [{ id: 'entry.world-history.farming', lessonId: 'lesson.farming.settlements', position: 0, required: true, framing: 'Read one settlement to see how stored food changed the work and choices of staying' }, { id: 'entry.world-history.uruk', lessonId: 'lesson.uruk.first-city', position: 1, required: true, framing: 'How city life changed human coordination' }, { id: 'entry.world-history.writing', lessonId: 'lesson.writing.early-systems', position: 2, required: true, framing: 'How durable records changed coordination' }] }],
};
