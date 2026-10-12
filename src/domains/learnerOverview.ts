import type { WorldSpineChapter } from '../../content/world-spine/roadmap';

/** A lesson a learner has finished, which is what shows a green check on their World History timeline. */
export type CompletedLesson = { learnerId: string; lessonId: string; completedAt: string };

/** A lesson a parent opted out of for one learner. It leaves that learner's curriculum until restored. */
export type LessonOptOut = { learnerId: string; lessonId: string; optedOutAt: string };

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
 * - unfinished: available to the learner but not finished yet.
 * - skipped: the parent opted this lesson out of the learner's curriculum.
 */
export type OverviewReview = 'passed' | 'waiting' | 'returned' | 'unreviewed' | 'unfinished' | 'skipped';

export type OverviewRow = {
  lessonId: string;
  chapterId?: string;
  chapterTitle?: string;
  review: OverviewReview;
  /** Times the learner has sent this lesson so far. Zero when unreviewed, unfinished or skipped. */
  tries: number;
  /** When the learner first finished (first sent) the lesson. Absent for unfinished and skipped lessons. */
  firstSentAt?: string;
  /** When they last sent it. Differs from `firstSentAt` after a resubmission. */
  lastSentAt?: string;
  reviewedAt?: string;
  /** When a parent opted the lesson out. Only on skipped lessons. */
  skippedAt?: string;
};

export type OverviewCounts = {
  finished: number;
  passed: number;
  waiting: number;
  returned: number;
  unreviewed: number;
  /** Available lessons the learner has not finished and that are still in their curriculum. */
  unfinished: number;
  skipped: number;
  /** Lessons the parent passed the first time they were sent. */
  passedFirstTry: number;
};

export type LearnerOverview = { rows: OverviewRow[]; counts: OverviewCounts };

export type OverviewOptions = {
  /** Lessons the learner could open, so unfinished ones can be listed. Finished lessons are always listed. */
  availableLessonIds?: Iterable<string>;
  optOuts?: readonly LessonOptOut[];
  isKnownLesson?: (lessonId: string) => boolean;
};

const finishedReviews: ReadonlySet<OverviewReview> = new Set(['passed', 'waiting', 'returned', 'unreviewed']);

/**
 * One learner's lessons in World History order, the same order as their
 * timeline: the ones they have finished with where each stands with the
 * parent, then the ones still to do, and the ones a parent has skipped.
 *
 * A submission always means the lesson is finished (sending it finishes it),
 * so a lesson with a submission counts even when the completion record is not
 * visible to the parent. A finished lesson is never shown as skipped.
 */
export function buildLearnerOverview(
  learnerId: string,
  completions: readonly CompletedLesson[],
  submissions: readonly OverviewSubmission[],
  chapters: readonly WorldSpineChapter[],
  { availableLessonIds = [], optOuts = [], isKnownLesson = () => true }: OverviewOptions = {},
): LearnerOverview {
  const placement = new Map<string, { order: number; chapterId: string; chapterTitle: string }>();
  for (const chapter of chapters) for (const node of chapter.nodes) placement.set(node.id, { order: node.order, chapterId: chapter.id, chapterTitle: chapter.title });

  const completedAt = new Map(completions.filter((item) => item.learnerId === learnerId).map((item) => [item.lessonId, item.completedAt]));
  const submissionByLesson = new Map(submissions.filter((item) => item.learnerId === learnerId).map((item) => [item.lessonId, item]));
  const skippedAt = new Map(optOuts.filter((item) => item.learnerId === learnerId).map((item) => [item.lessonId, item.optedOutAt]));
  const available = new Set(availableLessonIds);
  const lessonIds = [...new Set([...completedAt.keys(), ...submissionByLesson.keys(), ...available])].filter(isKnownLesson);

  const rows = lessonIds.map((lessonId): OverviewRow => {
    const submission = submissionByLesson.get(lessonId);
    const finished = submission !== undefined || completedAt.has(lessonId);
    const place = placement.get(lessonId);
    const review: OverviewReview = submission
      ? submission.status === 'passed' ? 'passed' : submission.status === 'returned' ? 'returned' : 'waiting'
      : finished ? 'unreviewed'
        : skippedAt.has(lessonId) ? 'skipped' : 'unfinished';
    return {
      lessonId,
      ...(place ? { chapterId: place.chapterId, chapterTitle: place.chapterTitle } : {}),
      review,
      tries: submission?.round ?? 0,
      ...(finished ? { firstSentAt: completedAt.get(lessonId) ?? submission!.submittedAt } : {}),
      ...(submission ? { lastSentAt: submission.submittedAt } : {}),
      ...(submission?.reviewedAt ? { reviewedAt: submission.reviewedAt } : {}),
      ...(review === 'skipped' ? { skippedAt: skippedAt.get(lessonId)! } : {}),
    };
  }).sort((left, right) => (placement.get(left.lessonId)?.order ?? Number.MAX_SAFE_INTEGER) - (placement.get(right.lessonId)?.order ?? Number.MAX_SAFE_INTEGER)
    || (left.firstSentAt ?? '').localeCompare(right.firstSentAt ?? '')
    || left.lessonId.localeCompare(right.lessonId));

  const count = (review: OverviewReview) => rows.filter((row) => row.review === review).length;
  return {
    rows,
    counts: {
      finished: rows.filter((row) => finishedReviews.has(row.review)).length,
      passed: count('passed'),
      waiting: count('waiting'),
      returned: count('returned'),
      unreviewed: count('unreviewed'),
      unfinished: count('unfinished'),
      skipped: count('skipped'),
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
  if (review === 'unfinished') return 'Not finished yet.';
  if (review === 'skipped') return 'Removed from the curriculum by a parent.';
  if (review === 'passed') return sentBack === 0 ? 'Passed the first time it was sent.' : `Passed after being sent back ${times(sentBack)}.`;
  if (review === 'waiting') return sentBack === 0 ? 'Sent once so far.' : `Sent ${times(tries)} so far, after being sent back ${times(sentBack)}.`;
  return `Sent back ${times(tries)} so far.`;
}
