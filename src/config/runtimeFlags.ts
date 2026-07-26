/** Parse Vite boolean env flags. Accepts `true` or `1`. */
export const parseBooleanEnv = (value: string | undefined): boolean => value === 'true' || value === '1';

let unlockPreviewLessonsOverride: boolean | undefined;

/** Test-only override so Vitest can force the flag without depending on local .env. */
export function setUnlockPreviewLessonsForTests(value: boolean | undefined): void {
  unlockPreviewLessonsOverride = value;
}

/**
 * Dev/audit only: open authored draft lessons and skip World Spine prerequisite locks.
 * Leave unset for production-like publication and curriculum gating.
 */
export function unlockPreviewLessonsEnabled(): boolean {
  if (unlockPreviewLessonsOverride !== undefined) return unlockPreviewLessonsOverride;
  return parseBooleanEnv(import.meta.env.VITE_UNLOCK_PREVIEW_LESSONS);
}

export function isLessonOpenable(lesson: { status: 'published' | 'draft' }): boolean {
  return lesson.status === 'published' || unlockPreviewLessonsEnabled();
}
