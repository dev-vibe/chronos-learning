// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuditApp } from '../../src/app/AuditApp';
import { AUDIT_UNLOCK_STORAGE_KEY, setUnlockPreviewLessonsForTests } from '../../src/config/runtimeFlags';

beforeEach(() => {
  const storage = new Map<string, string>();
  const localStorageStub = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => { storage.set(key, value); },
    removeItem: (key: string) => { storage.delete(key); },
    clear: () => { storage.clear(); },
  };
  vi.stubGlobal('localStorage', localStorageStub);
  Object.defineProperty(window, 'localStorage', { configurable: true, value: localStorageStub });
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  setUnlockPreviewLessonsForTests(undefined);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  setUnlockPreviewLessonsForTests(false);
});

describe('AuditApp', () => {
  it('turns on browser audit mode and opens World History', async () => {
    const navigate = vi.fn();
    render(<AuditApp navigate={navigate} />);
    expect(screen.getByRole('heading', { name: 'Audit mode is off.' })).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: /Turn on audit mode/i }));
    expect(window.localStorage.getItem(AUDIT_UNLOCK_STORAGE_KEY)).toBe('1');
    expect(navigate).toHaveBeenCalledWith('/library/journey.world-history');
  });

  it('enables audit mode from the bookmarkable on query', () => {
    const navigate = vi.fn();
    render(<AuditApp search="?on" navigate={navigate} />);
    expect(window.localStorage.getItem(AUDIT_UNLOCK_STORAGE_KEY)).toBe('1');
    expect(navigate).toHaveBeenCalledWith('/library/journey.world-history');
  });

  it('turns off stored audit mode', async () => {
    window.localStorage.setItem(AUDIT_UNLOCK_STORAGE_KEY, '1');
    const navigate = vi.fn();
    render(<AuditApp navigate={navigate} />);
    expect(screen.getByRole('heading', { name: 'Audit mode is on.' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Open World History/i }).getAttribute('href')).toBe('/library/journey.world-history');
    await userEvent.click(screen.getByRole('button', { name: /Turn off audit mode/i }));
    expect(window.localStorage.getItem(AUDIT_UNLOCK_STORAGE_KEY)).toBeNull();
    expect(navigate).toHaveBeenCalledWith('/audit');
  });
});
