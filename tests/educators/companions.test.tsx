// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { chronosContent } from '../../content/chronos';
import { EducatorApp } from '../../src/educators/EducatorApp';
import { availableCompanions, lessonCompanions } from '../../src/educators/companions';
import { parseChronosRoute } from '../../src/app/routes';
import { setUnlockPreviewLessonsForTests } from '../../src/config/runtimeFlags';

const privateGateway = vi.fn(() => { throw new Error('Public companions must not read learner state'); });
vi.mock('../../src/learn/progress', () => ({ createProgressGateway: () => privateGateway() }));
vi.mock('../../src/infrastructure/journeys/gateway', () => ({ createJourneyStateGateway: () => privateGateway() }));
beforeEach(() => {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  const values = new Map<string, string>();
  vi.stubGlobal('localStorage', { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); setUnlockPreviewLessonsForTests(false); });

describe('public lesson companions', () => {
  it('opens without learner gateway calls and provides keyboard-accessible print', async () => {
    const print = vi.spyOn(window, 'print').mockImplementation(() => {});
    render(<EducatorApp lessonId="lesson.humans.homo-sapiens-origins" />);
    expect(screen.getByRole('heading', { name: 'Lesson purpose' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'An example explanation' })).toBeTruthy();
    expect(screen.getByText(/completion is not a claim of mastery/)).toBeTruthy();
    const button = screen.getByRole('button', { name: 'Print companion' });
    button.focus();
    await userEvent.keyboard('{Enter}');
    expect(print).toHaveBeenCalledOnce();
    expect(privateGateway).not.toHaveBeenCalled();
    expect(screen.getByRole('link', { name: 'Open lesson' }).getAttribute('href')).toBe('/learn/lesson.humans.homo-sapiens-origins');
  });

  it('fails closed for unknown and draft content even with audit unlock enabled', () => {
    setUnlockPreviewLessonsForTests(true);
    const content = { ...chronosContent, lessons: chronosContent.lessons.map((lesson) => ({ ...lesson, status: 'draft' as const })) };
    expect(availableCompanions(content)).toEqual([]);
    render(<EducatorApp lessonId="lesson.humans.homo-sapiens-origins" content={content} />);
    expect(screen.getByRole('heading', { name: 'This companion isn’t available.' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Print companion' })).toBeNull();
  });

  it('keeps versioned companion references grounded in the canonical lesson', () => {
    for (const companion of lessonCompanions) {
      const lesson = chronosContent.lessons.find((item) => item.id === companion.lessonId)!;
      expect(lesson).toBeTruthy();
      expect(companion.revision).toBeGreaterThan(0);
      for (const id of companion.referenceSourceIds) {
        expect(lesson.sourceIds).toContain(id);
        expect(chronosContent.sources.some((source) => source.id === id)).toBe(true);
      }
      expect(companion.curriculumMappings).toEqual([]);
    }
  });

  it('uses direct companion URLs and rejects malformed path encodings', () => {
    expect(parseChronosRoute('/educators')).toEqual({ name: 'educators' });
    expect(parseChronosRoute('/educators/lesson.humans.homo-sapiens-origins')).toEqual({ name: 'educators', lessonId: 'lesson.humans.homo-sapiens-origins' });
    expect(parseChronosRoute('/educators/%XX')).toEqual({ name: 'not-found' });
  });
});
