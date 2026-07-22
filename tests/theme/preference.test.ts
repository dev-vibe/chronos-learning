// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTheme, readThemePreference, writeThemePreference, THEME_STORAGE_KEY } from '../../src/theme/preference';

beforeEach(() => {
  const storage = new Map<string, string>();
  const localStorageStub = {
    getItem: vi.fn((key: string) => storage.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => { storage.set(key, value); }),
    removeItem: vi.fn((key: string) => { storage.delete(key); }),
    clear: vi.fn(() => { storage.clear(); }),
  };
  vi.stubGlobal('localStorage', localStorageStub);
  Object.defineProperty(window, 'localStorage', { configurable: true, value: localStorageStub });
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('chronos theme preference', () => {
  it('falls back to system preference when nothing is stored', () => {
    expect(readThemePreference()).toBe('light');
  });

  it('reads and writes the shared storage key', () => {
    writeThemePreference('dark');
    expect(window.localStorage.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, 'dark');
    expect(readThemePreference()).toBe('dark');
    expect(nextTheme('dark')).toBe('light');
  });
});
