import { afterEach, describe, expect, it } from 'vitest';
import { chronosContent } from '../../content/chronos';
import { isLessonOpenable, setUnlockPreviewLessonsForTests } from '../../src/config/runtimeFlags';

const LESSON_ID = 'lesson.animals.domestication-and-pastoralism';

describe('Animals, Herding, and Mobility prototype', () => {
  afterEach(() => setUnlockPreviewLessonsForTests(undefined));

  const lesson = chronosContent.lessons.find((item) => item.id === LESSON_ID);

  it('stays an unpublished draft that only preview mode can open', () => {
    expect(lesson).toMatchObject({ status: 'draft', title: 'Animals, Herding, and Mobility', mediaIds: [] });
    setUnlockPreviewLessonsForTests(false);
    expect(isLessonOpenable(lesson!)).toBe(false);
    setUnlockPreviewLessonsForTests(true);
    expect(isLessonOpenable(lesson!)).toBe(true);
  });

  it('follows Farming and Settlements in the World History journey', () => {
    const entries = chronosContent.journeys[0].chapters[0].entries
      .slice()
      .sort((left, right) => left.position - right.position)
      .map((entry) => entry.lessonId);
    expect(entries.indexOf(LESSON_ID)).toBe(entries.indexOf('lesson.farming.settlements') + 1);
  });

  it('has two required prompts with feedback on every selection option', () => {
    const prompts = chronosContent.prompts.filter((prompt) => lesson!.promptIds.includes(prompt.id));
    expect(prompts.filter((prompt) => prompt.required)).toHaveLength(2);
    for (const prompt of prompts) {
      if (prompt.kind === 'supported-selection') {
        expect(prompt.options.every((option) => (option.feedback ?? "").length > 0)).toBe(true);
        expect(prompt.options.map((option) => option.id)).toContain(prompt.bestOptionId);
      }
    }
  });
});
