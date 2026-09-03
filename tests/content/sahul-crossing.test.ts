import { afterEach, describe, expect, it } from 'vitest';
import { chronosContent } from '../../content/chronos';
import { setUnlockPreviewLessonsForTests } from '../../src/config/runtimeFlags';
import { isLessonOpenable } from '../../src/config/runtimeFlags';
import { selectJourneyNextAction } from '../../src/domains/journeys/state';

const LESSON_ID = 'lesson.humans.sahul-crossing';
const world = chronosContent.journeys[0];

describe('Crossing to Sahul unpublished prototype', () => {
  afterEach(() => setUnlockPreviewLessonsForTests(undefined));

  it('keeps the lesson draft and fail-closed outside preview unlock', () => {
    const lesson = chronosContent.lessons.find((item) => item.id === LESSON_ID);
    expect(lesson).toMatchObject({
      status: 'draft',
      title: 'Crossing to Sahul',
      mediaIds: [],
    });
    setUnlockPreviewLessonsForTests(false);
    expect(isLessonOpenable(lesson!)).toBe(false);
  });

  it('sits after Migrations and before Many Beginnings without implying Ice Age exists', () => {
    const entries = world.chapters[0].entries
      .slice()
      .sort((left, right) => left.position - right.position)
      .map((entry) => entry.lessonId);
    expect(entries).toEqual([
      'lesson.humans.homo-sapiens-origins',
      'lesson.humans.migrations-and-interbreeding',
      LESSON_ID,
      'lesson.farming.multiple-origins',
      'lesson.farming.settlements',
    ]);
    expect(entries).not.toContain('lesson.humans.ice-age-lifeways');
  });

  it('skips the draft in production next-action and opens it only in preview', () => {
    const migrationsDone = {
      'lesson.humans.homo-sapiens-origins': { lessonId: 'lesson.humans.homo-sapiens-origins', status: 'completed' as const },
      'lesson.humans.migrations-and-interbreeding': { lessonId: 'lesson.humans.migrations-and-interbreeding', status: 'completed' as const },
    };

    setUnlockPreviewLessonsForTests(false);
    expect(selectJourneyNextAction(world, chronosContent.lessons, migrationsDone, 'lesson.humans.migrations-and-interbreeding')).toEqual({
      kind: 'lesson',
      lessonId: 'lesson.farming.multiple-origins',
      source: 'next',
    });

    setUnlockPreviewLessonsForTests(true);
    expect(isLessonOpenable(chronosContent.lessons.find((item) => item.id === LESSON_ID)!)).toBe(true);
    expect(selectJourneyNextAction(world, chronosContent.lessons, migrationsDone, 'lesson.humans.migrations-and-interbreeding')).toEqual({
      kind: 'lesson',
      lessonId: LESSON_ID,
      source: 'next',
    });
  });
});
