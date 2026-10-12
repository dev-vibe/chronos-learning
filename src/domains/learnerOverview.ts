import type { WorldSpineChapter } from '../../content/world-spine/roadmap';

/** A lesson a learner has finished, which is what shows a green check on their World History timeline. */
export type CompletedLesson = { learnerId: string; lessonId: string; completedAt: string };

/** The parts of a lesson submission the overview needs. `round` counts how many times the learner has sent the lesson. */
export type OverviewSubmission = {
  learnerId: string;
  lessonId: string;
  status: 'submitted' | 'returned' | 'passed';
  round: number;
  submittedAt: string;
  reviewedAt?: string;
};

/**
 * - passed: the parent accepted it.
 * - waiting: sent, and the parent has not looked yet.
 * - returned: the parent sent it back and the learner has not resent it.
 * - unreviewed: finished with no submission on record, such as a lesson finished before parent review existed.
 */
export type OverviewReview = 'passed' | 'waiting' | 'returned' | 'unreviewed';

export type OverviewRow = {
  lessonId: string;
  chapterId?: string;
  chapterTitle?: string;
  review: OverviewReview;
  /** Times the learner has sent this lesson so far. Zero when unreviewed. */
  tries: number;
  /** When the learner first finished (first sent) the lesson. */
  firstSentAt: string;
  /** When they last sent it. Differs from `firstSentAt` after a resubmission. */
  lastSentAt?: string;
  reviewedAt?: string;
};

export type OverviewCounts = {
  finished: number;
  passed: number;
  waiting: number;
  returned: number;
  unreviewed: number;
  /** Lessons the parent passed the first time they were sent. */
  passedFirstTry: number;
};

export type LearnerOverview = { rows: OverviewRow[]; counts: OverviewCounts };

/**
 * One learner's finished lessons in World History order, the same order as
 * their timeline, each with where it stands with the parent.
 *
 * A submission always means the lesson is finished (sending it finishes it),
 * so a lesson with a submission counts even when the completion record is not
 * visible to the parent.
 */
export function buildLearnerOverview(
  learnerId: string,
  completions: readonly CompletedLesson[],
  submissions: readonly OverviewSubmission[],
  chapters: readonly WorldSpineChapter[],
  isKnownLesson: (lessonId: string) => boolean = () => true,
): LearnerOverview {
  const placement = new Map<string, { order: number; chapterId: string; chapterTitle: string }>();
  for (const chapter of chapters) for (const node of chapter.nodes) placement.set(node.id, { order: node.order, chapterId: chapter.id, chapterTitle: chapter.title });

  const completedAt = new Map(completions.filter((item) => item.learnerId === learnerId).map((item) => [item.lessonId, item.completedAt]));
  const submissionByLesson = new Map(submissions.filter((item) => item.learnerId === learnerId).map((item) => [item.lessonId, item]));
  const lessonIds = [...new Set([...completedAt.keys(), ...submissionByLesson.keys()])].filter(isKnownLesson);

  const rows = lessonIds.map((lessonId): OverviewRow => {
    const submission = submissionByLesson.get(lessonId);
    const place = placement.get(lessonId);
    const review: OverviewReview = !submission ? 'unreviewed' : submission.status === 'passed' ? 'passed' : submission.status === 'returned' ? 'returned' : 'waiting';
    return {
      lessonId,
      ...(place ? { chapterId: place.chapterId, chapterTitle: place.chapterTitle } : {}),
      review,
      tries: submission?.round ?? 0,
      firstSentAt: completedAt.get(lessonId) ?? submission!.submittedAt,
      ...(submission ? { lastSentAt: submission.submittedAt } : {}),
      ...(submission?.reviewedAt ? { reviewedAt: submission.reviewedAt } : {}),
    };
  }).sort((left, right) => (placement.get(left.lessonId)?.order ?? Number.MAX_SAFE_INTEGER) - (placement.get(right.lessonId)?.order ?? Number.MAX_SAFE_INTEGER)
    || left.firstSentAt.localeCompare(right.firstSentAt)
    || left.lessonId.localeCompare(right.lessonId));

  const count = (review: OverviewReview) => rows.filter((row) => row.review === review).length;
  return {
    rows,
    counts: {
      finished: rows.length,
      passed: count('passed'),
      waiting: count('waiting'),
      returned: count('returned'),
      unreviewed: count('unreviewed'),
      passedFirstTry: rows.filter((row) => row.review === 'passed' && row.tries === 1).length,
    },
  };
}

/** 1 becomes "1st try", 2 "2nd try", 11 "11th try". */
export function triesLabel(tries: number): string {
  const lastTwo = tries % 100;
  const suffix = lastTwo >= 11 && lastTwo <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[tries % 10] ?? 'th';
  return `${tries}${suffix} try`;
}

/** A plain sentence for the tries chip, shown on hover and used where a longer description helps. */
export function triesDescription(review: OverviewReview, tries: number): string {
  const sentBack = tries - 1;
  const times = (count: number) => `${count} ${count === 1 ? 'time' : 'times'}`;
  if (review === 'unreviewed') return 'Finished without a parent review.';
  if (review === 'passed') return sentBack === 0 ? 'Passed the first time it was sent.' : `Passed after being sent back ${times(sentBack)}.`;
  if (review === 'waiting') return sentBack === 0 ? 'Sent once so far.' : `Sent ${times(tries)} so far, after being sent back ${times(sentBack)}.`;
  return `Sent back ${times(tries)} so far.`;
}
