import type { JourneyProgressSummary } from '../../learn/progress';

/**
 * A lesson a parent has opted out of for this learner. It is removed from the
 * learner's curriculum: it is never offered, never counts towards progress,
 * and never blocks the lessons after it.
 */
export const isLessonSkipped = (summaries: Record<string, JourneyProgressSummary>, lessonId: string) =>
  summaries[lessonId]?.status === 'skipped';

/** Done as far as the curriculum is concerned: finished, or removed by a parent. */
export const isLessonSettled = (summaries: Record<string, JourneyProgressSummary>, lessonId: string) =>
  summaries[lessonId]?.status === 'completed' || isLessonSkipped(summaries, lessonId);
