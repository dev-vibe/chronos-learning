/** Parse Vite boolean env flags. Accepts `true` or `1`. */
export const parseBooleanEnv = (value: string | undefined): boolean => value === 'true' || value === '1';

/** Browser-local audit unlock. Not sent to the server and does not publish lessons. */
export const AUDIT_UNLOCK_STORAGE_KEY = 'chronos.audit.unlockPreviewLessons';

let unlockPreviewLessonsOverride: boolean | undefined;

/** Test-only override so Vitest can force the flag without depending on local .env. */
export function setUnlockPreviewLessonsForTests(value: boolean | undefined): void {
  unlockPreviewLessonsOverride = value;
}

function readAuditUnlockFromStorage(): boolean {
  try {
    return globalThis.localStorage?.getItem(AUDIT_UNLOCK_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

/** Persist audit unlock for this browser only. */
export function setAuditUnlockEnabled(enabled: boolean): void {
  try {
    if (enabled) globalThis.localStorage?.setItem(AUDIT_UNLOCK_STORAGE_KEY, '1');
    else globalThis.localStorage?.removeItem(AUDIT_UNLOCK_STORAGE_KEY);
  } catch {
    // Private mode or missing storage should not break the page.
  }
}

export function auditUnlockEnabled(): boolean {
  return readAuditUnlockFromStorage();
}

/**
 * Dev/audit only: open authored draft lessons and skip World Spine prerequisite locks.
 * Honors the Vite env flag, then a per-browser audit toggle for hosted staging/prod.
 */
export function envPreviewUnlockEnabled(): boolean {
  return parseBooleanEnv(import.meta.env.VITE_UNLOCK_PREVIEW_LESSONS);
}

export function unlockPreviewLessonsEnabled(): boolean {
  if (unlockPreviewLessonsOverride !== undefined) return unlockPreviewLessonsOverride;
  return envPreviewUnlockEnabled() || readAuditUnlockFromStorage();
}

export function isLessonOpenable(lesson: { status: 'published' | 'draft' }): boolean {
  return lesson.status === 'published' || unlockPreviewLessonsEnabled();
}
