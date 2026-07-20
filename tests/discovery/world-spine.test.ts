import { describe, expect, it } from 'vitest';
import { chronosContent } from '../../content/chronos';
import { worldSpineNodeCount, worldSpineRoadmap } from '../../content/world-spine/roadmap';
import { createWorldSpineRoadmapView, resolveWorldSpineAccess } from '../../src/domains/journeys/worldSpine';

describe('canonical World Spine roadmap', () => {
  it('projects all 185 stable curriculum nodes into 12 chronological chapters', () => {
    const nodes = worldSpineRoadmap.flatMap((chapter) => chapter.nodes);
    expect(worldSpineRoadmap).toHaveLength(12);
    expect(worldSpineNodeCount).toBe(185);
    expect(nodes).toHaveLength(185);
    expect(new Set(nodes.map((node) => node.id)).size).toBe(185);
    expect(nodes.map((node) => node.order)).toEqual(Array.from({ length: 185 }, (_, index) => index + 1));
  });

  it('keeps unfinished roadmap nodes visible but non-navigable', () => {
    const view = createWorldSpineRoadmapView(worldSpineRoadmap, chronosContent.lessons, {}, 'lesson.uruk.first-city');
    const farming = view.flatMap((chapter) => chapter.nodes).find((node) => node.id === 'lesson.farming.settlements');
    expect(farming).toMatchObject({ title: 'Farming and Settlements', status: 'preparing' });
    expect(farming?.href).toBeUndefined();
  });

  it('gates each available World Spine lesson behind its earlier available prerequisite', () => {
    expect(resolveWorldSpineAccess(worldSpineRoadmap, chronosContent.lessons, {}, 'lesson.uruk.first-city')).toEqual({ accessible: true });
    expect(resolveWorldSpineAccess(worldSpineRoadmap, chronosContent.lessons, {}, 'lesson.writing.early-systems')).toEqual({
      accessible: false,
      blockerId: 'lesson.uruk.first-city',
    });
    const summaries = {
      'lesson.uruk.first-city': { lessonId: 'lesson.uruk.first-city', status: 'completed' as const },
    };
    expect(resolveWorldSpineAccess(worldSpineRoadmap, chronosContent.lessons, summaries, 'lesson.writing.early-systems')).toEqual({ accessible: true });
  });
});
