import type { WorldSpineChapter, WorldSpineNode } from '../../../content/world-spine/roadmap';
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

type Access = Readonly<{ accessible: boolean; blockerId?: string }>;

function publishedSequence(chapters: readonly WorldSpineChapter[], lessons: readonly Lesson[]) {
  const publishedIds = new Set(lessons.filter((lesson) => lesson.status === 'published').map((lesson) => lesson.id));
  return chapters.flatMap((chapter) => chapter.nodes).filter((node) => publishedIds.has(node.id));
}

export function resolveWorldSpineAccess(
  chapters: readonly WorldSpineChapter[],
  lessons: readonly Lesson[],
  summaries: Record<string, JourneyProgressSummary>,
  targetId: string,
): Access {
  const sequence = publishedSequence(chapters, lessons);
  const index = sequence.findIndex((node) => node.id === targetId);
  if (index < 0) return { accessible: false };

  const target = sequence[index];
  const publishedIds = new Set(sequence.map((node) => node.id));
  const authoredPrerequisites = target.prerequisiteIds.filter((id) => publishedIds.has(id));
  const fallbackPrevious = index > 0 ? sequence[index - 1].id : undefined;
  const gateIds = authoredPrerequisites.length ? authoredPrerequisites : fallbackPrevious ? [fallbackPrevious] : [];
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
      if (lesson?.status !== 'published') {
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
