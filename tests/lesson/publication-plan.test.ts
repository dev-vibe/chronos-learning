import { describe, expect, it } from 'vitest';
import { chronosContent } from '../../content/chronos';
import { mediaPublishCommand, planLessonPublication, publicationNextSteps } from '../../scripts/lesson/publication-plan';

describe('lesson publication plan', () => {
  it('derives a no-card World History lesson from authored content', () => {
    const plan = planLessonPublication(chronosContent, 'lesson.farming.multiple-origins');
    expect(plan).toMatchObject({
      journeyId: 'journey.world-history',
      entryId: 'entry.world-history.multiple-origins',
      journeyPosition: 3,
      required: true,
      requiredPromptIds: ['prompt.farming.multi.what-evidence-supports', 'prompt.farming.multi.explain-independent'],
      cardIds: [],
    });
  });

  it('lists the Caral Place card that a parent’s pass awards', () => {
    expect(planLessonPublication(chronosContent, 'lesson.caral.andean-urbanism').cardIds).toEqual(['card.place.caral']);
  });

  it('refuses a lesson without a required prompt', () => {
    const bundle = structuredClone(chronosContent);
    for (const prompt of bundle.prompts) if (prompt.lessonId === 'lesson.caral.andean-urbanism') prompt.required = false;
    expect(() => planLessonPublication(bundle, 'lesson.caral.andean-urbanism')).toThrow('requires at least one required prompt');
  });

  it('publishes by merging, with no database step', () => {
    const plan = planLessonPublication(chronosContent, 'lesson.caral.andean-urbanism');
    const steps = publicationNextSteps(plan).join('\n');
    expect(steps).toContain(mediaPublishCommand(plan));
    expect(steps).toContain('there is no database step');
    expect(steps).not.toMatch(/migration/i);
  });
});
