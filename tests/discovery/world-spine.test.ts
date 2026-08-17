import { describe, expect, it } from 'vitest';
import { chronosContent } from '../../content/chronos';
import { WORLD_SPINE_DEVELOPMENT_OPEN_THROUGH_LESSON_ID } from '../../content/world-spine/access-policy';
import { worldSpineNodeCount, worldSpineRoadmap } from '../../content/world-spine/roadmap';
import type { Lesson } from '../../src/domains/contracts';
import { setUnlockPreviewLessonsForTests } from '../../src/config/runtimeFlags';
import { createWorldSpineRoadmapView, resolveWorldSpineAccess } from '../../src/domains/journeys/worldSpine';

const publishedLesson = (id: string): Lesson => ({ ...chronosContent.lessons[0], id, status: 'published' });
const completed = (lessonId: string) => ({ lessonId, status: 'completed' as const });

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
    const nileState = view.flatMap((chapter) => chapter.nodes).find((node) => node.id === 'lesson.egypt.nile-state');
    expect(nileState).toMatchObject({ title: 'The Nile and an Early Egyptian State', status: 'preparing' });
    expect(nileState?.href).toBeUndefined();
  });

  it('publishes Many Beginnings as a navigable World Spine node', () => {
    setUnlockPreviewLessonsForTests(true);
    const view = createWorldSpineRoadmapView(worldSpineRoadmap, chronosContent.lessons, {}, 'lesson.farming.multiple-origins');
    const multipleOrigins = view.flatMap((chapter) => chapter.nodes).find((node) => node.id === 'lesson.farming.multiple-origins');
    expect(multipleOrigins).toMatchObject({ status: 'current', href: '/learn/lesson.farming.multiple-origins' });
    expect(resolveWorldSpineAccess(worldSpineRoadmap, chronosContent.lessons, {}, 'lesson.writing.early-systems')).toEqual({ accessible: true });
  });

  it('publishes Farming and Settlements as a navigable World Spine node', () => {
    const view = createWorldSpineRoadmapView(worldSpineRoadmap, chronosContent.lessons, {}, 'lesson.farming.settlements');
    const farming = view.flatMap((chapter) => chapter.nodes).find((node) => node.id === 'lesson.farming.settlements');
    expect(farming).toMatchObject({ status: 'current', href: '/learn/lesson.farming.settlements' });
  });

  it('uses the named Uruk development cutoff without publication-timing regressions', () => {
    expect(WORLD_SPINE_DEVELOPMENT_OPEN_THROUGH_LESSON_ID).toBe('lesson.uruk.first-city');
    const farmingOnly = [publishedLesson('lesson.farming.settlements')];
    expect(resolveWorldSpineAccess(worldSpineRoadmap, farmingOnly, {}, 'lesson.farming.settlements')).toEqual({ accessible: true });

    const prerequisitePublishedLater = [...farmingOnly, publishedLesson('lesson.farming.multiple-origins')];
    expect(resolveWorldSpineAccess(worldSpineRoadmap, prerequisitePublishedLater, {}, 'lesson.farming.settlements')).toEqual({ accessible: true });
    expect(resolveWorldSpineAccess(worldSpineRoadmap, prerequisitePublishedLater, {}, 'lesson.farming.multiple-origins')).toEqual({ accessible: true });
  });

  it('honors unpublished canonical prerequisites after the cutoff and always permits completed revisits', () => {
    const writingOnly = [publishedLesson('lesson.writing.early-systems')];
    expect(resolveWorldSpineAccess(worldSpineRoadmap, writingOnly, {}, 'lesson.writing.early-systems')).toEqual({
      accessible: false,
      blockerId: 'lesson.uruk.first-city',
    });
    expect(resolveWorldSpineAccess(worldSpineRoadmap, writingOnly, {
      'lesson.writing.early-systems': completed('lesson.writing.early-systems'),
    }, 'lesson.writing.early-systems')).toEqual({ accessible: true });
  });

  it('gates a new learner after Uruk and unlocks the next lesson after completion', () => {
    expect(resolveWorldSpineAccess(worldSpineRoadmap, chronosContent.lessons, {}, 'lesson.uruk.first-city')).toEqual({ accessible: true });
    expect(resolveWorldSpineAccess(worldSpineRoadmap, chronosContent.lessons, {}, 'lesson.writing.early-systems')).toEqual({
      accessible: false,
      blockerId: 'lesson.uruk.first-city',
    });
    expect(resolveWorldSpineAccess(worldSpineRoadmap, chronosContent.lessons, {
      'lesson.uruk.first-city': completed('lesson.uruk.first-city'),
    }, 'lesson.writing.early-systems')).toEqual({ accessible: true });
  });
});
