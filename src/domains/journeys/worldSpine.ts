import type { WorldSpineChapter, WorldSpineNode } from '../../../content/world-spine/roadmap';
import { worldSpineAccessPolicy, type WorldSpineAccessPolicy } from '../../../content/world-spine/access-policy';
import { isLessonOpenable, unlockPreviewLessonsEnabled } from '../../config/runtimeFlags';
import type { Lesson } from '../contracts';
import type { JourneyProgressSummary } from '../../learn/progress';

export type WorldSpineNodeStatus = 'completed' | 'current' | 'available' | 'locked' | 'preparing';

export type WorldSpineNodeView = WorldSpineNode & Readonly<{
  status: WorldSpineNodeStatus;
  completed: boolean;
  href?: string;
  lockReason?: string;
}>;

export type WorldSpineChapterView = Omit<WorldSpineChapter, 'nodes'> & Readonly<{
  nodes: readonly WorldSpineNodeView[];
  publishedCount: number;
  completedCount: number;
  containsCurrent: boolean;
}>;

export type WorldSpineAccess = Readonly<{ accessible: boolean; blockerId?: string }>;

const orderedNodes = (chapters: readonly WorldSpineChapter[]) => chapters
  .flatMap((chapter) => chapter.nodes)
  .sort((left, right) => left.order - right.order || left.id.localeCompare(right.id));

export function resolveWorldSpineAccess(
  chapters: readonly WorldSpineChapter[],
  lessons: readonly Lesson[],
  summaries: Record<string, JourneyProgressSummary>,
  targetId: string,
  policy: WorldSpineAccessPolicy = worldSpineAccessPolicy,
): WorldSpineAccess {
  const openableIds = new Set(lessons.filter((lesson) => isLessonOpenable(lesson)).map((lesson) => lesson.id));
  if (!openableIds.has(targetId)) return { accessible: false };

  const sequence = orderedNodes(chapters);
  const index = sequence.findIndex((node) => node.id === targetId);
  if (index < 0) return { accessible: false };

  // Dev audit unlock: open every authored lesson without curriculum gating.
  if (unlockPreviewLessonsEnabled()) return { accessible: true };

  const target = sequence[index];
  if (summaries[targetId]?.status === 'completed') return { accessible: true };

  const cutoffOrder = sequence.find((node) => node.id === policy.openThroughLessonId)?.order;
  if (cutoffOrder !== undefined && target.order <= cutoffOrder) return { accessible: true };

  // Canonical prerequisites remain gates even while their lessons are not yet
  // published. Publication timing must never redefine curriculum sequencing.
  const fallbackPrevious = index > 0 ? sequence[index - 1].id : undefined;
  const gateIds = target.prerequisiteIds.length ? target.prerequisiteIds : fallbackPrevious ? [fallbackPrevious] : [];
  const blockerId = gateIds.find((id) => summaries[id]?.status !== 'completed');
  return blockerId ? { accessible: false, blockerId } : { accessible: true };
}

export function createWorldSpineRoadmapView(
  chapters: readonly WorldSpineChapter[],
  lessons: readonly Lesson[],
  summaries: Record<string, JourneyProgressSummary>,
  currentLessonId: string,
): readonly WorldSpineChapterView[] {
  const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  return chapters.map((chapter) => {
    const nodes = chapter.nodes.map((node): WorldSpineNodeView => {
      const lesson = lessonById.get(node.id);
      const completed = summaries[node.id]?.status === 'completed';
      if (!lesson || !isLessonOpenable(lesson)) {
        return { ...node, status: 'preparing', completed: false, lockReason: 'Lesson in preparation' };
      }
      if (node.id === currentLessonId) {
        return { ...node, status: 'current', completed, href: '/learn/' + node.id };
      }
      if (completed) {
        return { ...node, status: 'completed', completed: true, href: '/learn/' + node.id };
      }
      const access = resolveWorldSpineAccess(chapters, lessons, summaries, node.id);
      if (!access.accessible) {
        const blocker = access.blockerId ? chapters.flatMap((item) => item.nodes).find((item) => item.id === access.blockerId) : undefined;
        return { ...node, status: 'locked', completed: false, lockReason: blocker ? 'Complete ' + blocker.title + ' first' : 'Complete earlier lessons first' };
      }
      return { ...node, status: 'available', completed: false, href: '/learn/' + node.id };
    });
    return {
      ...chapter,
      nodes,
      publishedCount: nodes.filter((node) => node.status !== 'preparing').length,
      completedCount: nodes.filter((node) => node.completed).length,
      containsCurrent: nodes.some((node) => node.id === currentLessonId),
    };
  });
}
