import { describe, expect, it } from 'vitest';
import { chronosContent } from '../../content/chronos';
import { chronosPrototypeReviews } from '../../content/prototype-reviews';
import mediaManifest from '../../content/media/generated/chronos-media.json';

const id = 'lesson.egypt.pyramids-and-state-labor';

describe('Pyramids, Builders, and Evidence publication', () => {
  it('delivers a wide, high-resolution hero without changing its stable identity', () => {
    const locator = mediaManifest.assets.find((asset) => asset.id === 'media.pyramids.giza-hero')!.locator;
    expect(locator.fallback.width).toBeGreaterThanOrEqual(2000);
    expect(locator.fallback.width / locator.fallback.height).toBeGreaterThan(2.9);
    expect(locator.fallback.width / locator.fallback.height).toBeLessThan(3.1);
    expect(locator.variants.map((variant) => variant.width)).toEqual([480, 960, 2174]);
  });
  it('publishes the reviewed four-case lesson without a card or prototype annotations', () => {
    const lesson = chronosContent.lessons.find((item) => item.id === id)!;
    expect(lesson.status).toBe('published');
    expect(lesson.sections).toHaveLength(7);
    expect(lesson.sections.map((section) => section.id)).toEqual(lesson.sectionIdsRequired);
    expect(lesson.mediaIds).toHaveLength(6);
    expect(lesson.mediaIds).toEqual(expect.arrayContaining(['media.pyramids.hawara-kircher', 'media.pyramids.hawara-scan-illustration']));
    expect(lesson.mediaIds).not.toContain('media.pyramids.hawara-evidence-streams');
    expect(lesson.heroMediaId).toBe('media.pyramids.giza-hero');
    expect(lesson.heroLabel).toBe('Illustrated view');
    expect(lesson.heroCaption).toContain('Giza today');
    expect(lesson.mediaIds).toContain(lesson.heroMediaId);
    expect(chronosContent.media.find((media) => media.id === lesson.heroMediaId)).toMatchObject({
      depictionMode: 'evidence-based-reconstruction',
      reviewStatus: 'approved',
      sourceIds: expect.arrayContaining(['source.pyramids.commons-giza-hero']),
    });
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
