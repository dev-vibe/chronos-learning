import { describe, expect, it } from 'vitest';
import { chronosContent } from '../../content/chronos';
import { chronosPrototypeReviews } from '../../content/prototype-reviews';

const id = 'lesson.egypt.pyramids-and-state-labor';

describe('Pyramids, Builders, and Evidence publication', () => {
  it('publishes the reviewed four-case lesson without a card or prototype annotations', () => {
    const lesson = chronosContent.lessons.find((item) => item.id === id)!;
    expect(lesson.status).toBe('published');
    expect(lesson.sections).toHaveLength(7);
    expect(lesson.sections.map((section) => section.id)).toEqual(lesson.sectionIdsRequired);
    expect(lesson.mediaIds).toHaveLength(4);
    expect(chronosContent.cards.filter((card) => card.unlockLessonId === id)).toEqual([]);
    expect(chronosPrototypeReviews.some((review) => review.lessonId === id)).toBe(false);
    expect(chronosContent.prompts.filter((prompt) => prompt.lessonId === id && prompt.required).map((prompt) => prompt.id)).toEqual([
      'prompt.pyramids.context-and-phase', 'prompt.pyramids.build-evidence-chain',
    ]);
    for (const sourceId of lesson.sourceIds) {
      expect(chronosContent.sources.find((source) => source.id === sourceId)?.reviewStatus).toBe('reviewed');
    }
    for (const claimId of lesson.claimIds) {
      expect(chronosContent.claims.find((claim) => claim.id === claimId)?.reviewStatus).toBe('reviewed');
    }
    for (const mediaId of lesson.mediaIds) {
      expect(chronosContent.media.find((media) => media.id === mediaId)?.reviewStatus).toBe('approved');
    }
  });

  it('follows Caral while keeping the unfinished Indus lesson unpublished', () => {
    const journey = chronosContent.journeys.find((item) => item.id === 'journey.world-history')!;
    const entries = journey.chapters.slice().sort((a, b) => a.position - b.position)
      .flatMap((chapter) => chapter.entries.slice().sort((a, b) => a.position - b.position));
    const position = entries.findIndex((entry) => entry.lessonId === id);
    expect(entries[position - 1].lessonId).toBe('lesson.caral.andean-urbanism');
    expect(entries[position].required).toBe(true);
    expect(chronosContent.lessons.find((lesson) => lesson.id === 'lesson.indus.cities-and-signs')?.status).not.toBe('published');
  });
});
