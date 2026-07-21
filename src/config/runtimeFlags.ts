/** Parse Vite boolean env flags. Accepts `true` or `1`. */
export const parseBooleanEnv = (value: string | undefined): boolean => value === 'true' || value === '1';

/**
 * Dev/audit only: open authored draft lessons and skip World Spine prerequisite locks.
 * Leave unset for production-like publication and curriculum gating.
 */
export const unlockPreviewLessons = parseBooleanEnv(import.meta.env.VITE_UNLOCK_PREVIEW_LESSONS);

export function isLessonOpenable(lesson: { status: 'published' | 'draft' }): boolean {
  return lesson.status === 'published' || unlockPreviewLessons;
}
