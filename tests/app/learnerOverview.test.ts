import { describe, expect, it } from 'vitest';
import type { WorldSpineChapter } from '../../content/world-spine/roadmap';
import { buildLearnerOverview, triesDescription, triesLabel, type CompletedLesson, type OverviewSubmission } from '../../src/domains/learnerOverview';

const node = (order: number, id: string) => ({ order, id, title: id, dateDisplay: '', chapterId: order < 3 ? '01' : '02', prerequisiteIds: [], scope: '' });
const chapters: WorldSpineChapter[] = [
  { id: '01', title: 'First chapter', period: '', purpose: '', nodes: [node(1, 'lesson.a'), node(2, 'lesson.b')] },
  { id: '02', title: 'Second chapter', period: '', purpose: '', nodes: [node(3, 'lesson.c')] },
];
const kid = 'kid-1';
const done = (lessonId: string, completedAt: string, learnerId = kid): CompletedLesson => ({ learnerId, lessonId, completedAt });
const sent = (lessonId: string, status: OverviewSubmission['status'], round: number, extra: Partial<OverviewSubmission> = {}): OverviewSubmission => ({ learnerId: kid, lessonId, status, round, submittedAt: '2026-10-03T12:00:00.000Z', ...extra });

describe('learner overview', () => {
  it('lists finished lessons in World History order, not the order they were finished', () => {
    const { rows } = buildLearnerOverview(kid, [done('lesson.c', '2026-10-01T00:00:00Z'), done('lesson.a', '2026-10-02T00:00:00Z')], [], chapters);
    expect(rows.map((row) => row.lessonId)).toEqual(['lesson.a', 'lesson.c']);
    expect(rows[0]).toMatchObject({ chapterId: '01', chapterTitle: 'First chapter', review: 'unreviewed', tries: 0 });
  });

  it('counts how many times a lesson was sent before the parent passed it', () => {
    const { rows, counts } = buildLearnerOverview(kid,
      [done('lesson.a', '2026-10-01T09:00:00Z'), done('lesson.b', '2026-10-01T10:00:00Z')],
      [sent('lesson.a', 'passed', 1, { reviewedAt: '2026-10-02T00:00:00Z' }), sent('lesson.b', 'passed', 3, { submittedAt: '2026-10-05T00:00:00Z', reviewedAt: '2026-10-06T00:00:00Z' })],
      chapters);
    expect(rows.map((row) => [row.lessonId, row.review, row.tries])).toEqual([['lesson.a', 'passed', 1], ['lesson.b', 'passed', 3]]);
    // Finishing happens on the first send; the latest send is a later time.
    expect(rows[1]).toMatchObject({ firstSentAt: '2026-10-01T10:00:00Z', lastSentAt: '2026-10-05T00:00:00Z', reviewedAt: '2026-10-06T00:00:00Z' });
    expect(counts).toMatchObject({ finished: 2, passed: 2, passedFirstTry: 1, waiting: 0, returned: 0 });
  });

  it('separates waiting, sent-back and unreviewed lessons', () => {
    const { counts, rows } = buildLearnerOverview(kid,
      [done('lesson.a', '2026-10-01T00:00:00Z'), done('lesson.b', '2026-10-01T00:00:00Z'), done('lesson.c', '2026-10-01T00:00:00Z')],
      [sent('lesson.a', 'submitted', 2), sent('lesson.b', 'returned', 1, { reviewedAt: '2026-10-04T00:00:00Z' })],
      chapters);
    expect(rows.map((row) => row.review)).toEqual(['waiting', 'returned', 'unreviewed']);
    expect(counts).toMatchObject({ finished: 3, waiting: 1, returned: 1, unreviewed: 1, passed: 0 });
  });

  it('counts a submitted lesson as finished even when the completion record is not visible', () => {
    const { rows } = buildLearnerOverview(kid, [], [sent('lesson.a', 'passed', 2, { reviewedAt: '2026-10-04T00:00:00Z' })], chapters);
    expect(rows).toHaveLength(1);
    expect(rows[0].firstSentAt).toBe('2026-10-03T12:00:00.000Z');
  });

  it('ignores other learners and lessons the app no longer has, and keeps lessons outside the roadmap last', () => {
    const { rows } = buildLearnerOverview(kid,
      [done('lesson.a', '2026-10-01T00:00:00Z'), done('lesson.gone', '2026-10-01T00:00:00Z'), done('lesson.extra', '2026-09-01T00:00:00Z'), done('lesson.b', '2026-10-01T00:00:00Z', 'someone-else')],
      [], chapters, (id) => id !== 'lesson.gone');
    expect(rows.map((row) => row.lessonId)).toEqual(['lesson.a', 'lesson.extra']);
    expect(rows[1].chapterId).toBeUndefined();
  });

  it('labels tries in plain ordinal words', () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22].map(triesLabel)).toEqual(['1st try', '2nd try', '3rd try', '4th try', '11th try', '12th try', '13th try', '21st try', '22nd try']);
  });

  it('describes what the tries mean', () => {
    expect(triesDescription('passed', 1)).toBe('Passed the first time it was sent.');
    expect(triesDescription('passed', 3)).toBe('Passed after being sent back 2 times.');
    expect(triesDescription('passed', 2)).toBe('Passed after being sent back 1 time.');
    expect(triesDescription('waiting', 1)).toBe('Sent once so far.');
    expect(triesDescription('waiting', 2)).toBe('Sent 2 times so far, after being sent back 1 time.');
    expect(triesDescription('returned', 1)).toBe('Sent back 1 time so far.');
  });
});
