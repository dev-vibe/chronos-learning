import type { ChronosContentBundle } from '../../content/assemble';
import type { Journey } from '../../src/domains/contracts';
import { orderedJourneyEntries } from '../../src/domains/journeys/catalog';

/**
 * Publishing is a repository change. The database holds no lesson
 * configuration: a lesson goes live when its `status: 'published'` reaches
 * main. This plan only checks that the lesson is ready and lists what the
 * release needs (media uploads and the owner's preview check).
 */
export type LessonPublicationPlan = {
  lessonId: string;
  title: string;
  journeyId: string;
  entryId: string;
  journeyPosition: number;
  required: boolean;
  requiredPromptIds: string[];
  /** Cards a parent's pass awards, from each card's `unlockLessonId`. */
  cardIds: string[];
  mediaIds: string[];
};

function findJourneyEntry(bundle: ChronosContentBundle, lessonId: string): {
  journey: Journey;
  entryIndex: number;
  entry: ReturnType<typeof orderedJourneyEntries>[number]['entry'];
} {
  for (const journey of bundle.journeys) {
    const ordered = orderedJourneyEntries(journey);
    const entryIndex = ordered.findIndex(({ entry }) => entry.lessonId === lessonId);
    if (entryIndex >= 0) return { journey, entryIndex, entry: ordered[entryIndex].entry };
  }
  throw new Error(`${lessonId} is not reachable from an authored journey`);
}

export function planLessonPublication(bundle: ChronosContentBundle, lessonId: string): LessonPublicationPlan {
  const lesson = bundle.lessons.find((candidate) => candidate.id === lessonId);
  if (!lesson) throw new Error(`lesson not found: ${lessonId}`);

  const { journey, entryIndex, entry } = findJourneyEntry(bundle, lessonId);
  const requiredPromptIds = lesson.promptIds.filter((promptId) => bundle.prompts.find((prompt) => prompt.id === promptId)?.required);
  if (requiredPromptIds.length < 1) throw new Error(`${lessonId}: publication requires at least one required prompt`);

  return {
    lessonId,
    title: lesson.title,
    journeyId: journey.id,
    entryId: entry.id,
    journeyPosition: entryIndex,
    required: entry.required,
    requiredPromptIds,
    cardIds: bundle.cards.filter((card) => card.unlockLessonId === lessonId).map((card) => card.id),
    mediaIds: [...new Set([...lesson.mediaIds, ...(lesson.heroMediaId ? [lesson.heroMediaId] : [])])],
  };
}

export function mediaPublishCommand(plan: LessonPublicationPlan): string {
  if (plan.mediaIds.length === 0) return 'npm run media:publish';
  return `npm run media:publish -- ${plan.mediaIds.map((id) => `--asset ${id}`).join(' ')}`;
}

export function publicationNextSteps(plan: LessonPublicationPlan): string[] {
  return [
    'npm run validate:content',
    'npm run test:domain',
    mediaPublishCommand(plan),
    'Push the branch. Let CI run the full suite. Do not re-run npm test or npm run build locally unless CI fails.',
    `Give the product owner the direct hosted preview for /learn/${plan.lessonId}; the owner checks sincere attempts, finishing and sending for review, a pass from /review awarding the card or no-card ending, reopen at the top, and removal of draft-only notes.`,
    'Merge. The lesson is live once main deploys; there is no database step.',
  ];
}
