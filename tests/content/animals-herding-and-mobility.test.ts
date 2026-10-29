import { afterEach, describe, expect, it } from 'vitest';
import { chronosContent } from '../../content/chronos';
import { isLessonOpenable, setUnlockPreviewLessonsForTests } from '../../src/config/runtimeFlags';

const LESSON_ID = 'lesson.animals.domestication-and-pastoralism';

describe('Animals, Herding, and Mobility published lesson', () => {
  afterEach(() => setUnlockPreviewLessonsForTests(undefined));

  const lesson = chronosContent.lessons.find((item) => item.id === LESSON_ID);

  it('opens as a published lesson with its three images and card', () => {
    expect(lesson).toMatchObject({ status: 'published', title: 'Animals, Herding, and Mobility' });
    expect(lesson!.mediaIds).toHaveLength(3);
    setUnlockPreviewLessonsForTests(false);
    expect(isLessonOpenable(lesson!)).toBe(true);
    expect(chronosContent.cards.find((card) => card.unlockLessonId === LESSON_ID)?.id).toBe('card.animals.ganj-dareh-hoofprints');
  });

  it('follows Farming and Settlements in the World History journey', () => {
    const entries = chronosContent.journeys[0].chapters[0].entries
      .slice()
      .sort((left, right) => left.position - right.position)
      .map((entry) => entry.lessonId);
    expect(entries.indexOf(LESSON_ID)).toBe(entries.indexOf('lesson.farming.settlements') + 1);
  });

  it('asks one question per prompt, with feedback on every selection option', () => {
    const prompts = chronosContent.prompts.filter((prompt) => lesson!.promptIds.includes(prompt.id));
    expect(prompts.filter((prompt) => prompt.required)).toHaveLength(3);
    for (const prompt of prompts) expect(prompt.question).not.toMatch(/\(1\)|\(2\)/);
    for (const prompt of prompts) {
      if (prompt.kind === 'supported-selection') {
        expect(prompt.options.every((option) => (option.feedback ?? "").length > 0)).toBe(true);
        expect(prompt.options.map((option) => option.id)).toContain(prompt.bestOptionId);
      }
    }
  });
});
