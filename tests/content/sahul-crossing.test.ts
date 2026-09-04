import { afterEach, describe, expect, it } from 'vitest';
import { chronosContent } from '../../content/chronos';
import { setUnlockPreviewLessonsForTests } from '../../src/config/runtimeFlags';
import { isLessonOpenable } from '../../src/config/runtimeFlags';
import { selectJourneyNextAction } from '../../src/domains/journeys/state';

const LESSON_ID = 'lesson.humans.sahul-crossing';
const world = chronosContent.journeys[0];

describe('Crossing to Sahul published lesson', () => {
  afterEach(() => setUnlockPreviewLessonsForTests(undefined));

  it('opens the published lesson without preview unlock', () => {
    const lesson = chronosContent.lessons.find((item) => item.id === LESSON_ID);
    expect(lesson).toMatchObject({
      status: 'published',
      title: 'Crossing to Sahul',
      mediaIds: ['media.humans.sahul-landmass-map', 'media.humans.madjedbebe-grinding-stones'],
    });
    setUnlockPreviewLessonsForTests(false);
    expect(isLessonOpenable(lesson!)).toBe(true);
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

  it('offers Sahul after Migrations in production and preview', () => {
    const migrationsDone = {
      'lesson.humans.homo-sapiens-origins': { lessonId: 'lesson.humans.homo-sapiens-origins', status: 'completed' as const },
      'lesson.humans.migrations-and-interbreeding': { lessonId: 'lesson.humans.migrations-and-interbreeding', status: 'completed' as const },
    };

    setUnlockPreviewLessonsForTests(false);
    expect(selectJourneyNextAction(world, chronosContent.lessons, migrationsDone, 'lesson.humans.migrations-and-interbreeding')).toEqual({
      kind: 'lesson',
      lessonId: LESSON_ID,
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
