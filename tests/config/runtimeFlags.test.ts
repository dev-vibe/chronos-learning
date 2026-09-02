import { afterEach, describe, expect, it } from 'vitest';
import {
  AUDIT_UNLOCK_STORAGE_KEY,
  auditUnlockEnabled,
  isLessonOpenable,
  setAuditUnlockEnabled,
  setUnlockPreviewLessonsForTests,
  unlockPreviewLessonsEnabled,
} from '../../src/config/runtimeFlags';

const storage = new Map<string, string>();

const localStorageStub = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => { storage.set(key, value); },
  removeItem: (key: string) => { storage.delete(key); },
  clear: () => { storage.clear(); },
};

Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: localStorageStub });

afterEach(() => {
  storage.clear();
  setUnlockPreviewLessonsForTests(false);
});

describe('runtime preview flags', () => {
  it('treats a stored browser flag as audit unlock when tests do not override it', () => {
    setUnlockPreviewLessonsForTests(undefined);
    setAuditUnlockEnabled(true);
    expect(auditUnlockEnabled()).toBe(true);
    expect(unlockPreviewLessonsEnabled()).toBe(true);
    expect(isLessonOpenable({ status: 'draft' })).toBe(true);
    expect(localStorageStub.getItem(AUDIT_UNLOCK_STORAGE_KEY)).toBe('1');
    setAuditUnlockEnabled(false);
    expect(auditUnlockEnabled()).toBe(false);
  });

  it('keeps the test override stronger than stored audit unlock', () => {
    setAuditUnlockEnabled(true);
    setUnlockPreviewLessonsForTests(false);
    expect(unlockPreviewLessonsEnabled()).toBe(false);
    expect(isLessonOpenable({ status: 'draft' })).toBe(false);
  });
});
