import { afterEach } from 'vitest';
import { setUnlockPreviewLessonsForTests } from '../src/config/runtimeFlags';

// Keep publication gating production-like in unit tests even when local .env
// enables VITE_UNLOCK_PREVIEW_LESSONS for manual content audit.
setUnlockPreviewLessonsForTests(false);

afterEach(() => {
  setUnlockPreviewLessonsForTests(false);
});
