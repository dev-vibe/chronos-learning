// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { LearnApp } from '../../src/learn/LearnApp';
import { setUnlockPreviewLessonsForTests } from '../../src/config/runtimeFlags';
import type { JourneyProgressSummary, LearnProgressGateway, LearnState } from '../../src/learn/progress';

const LESSON_ID = 'lesson.humans.sahul-crossing';

const emptyState = (): LearnState => ({
  learnerId: 'sahul-preview',
  lessonId: LESSON_ID,
  status: 'in-progress',
  attemptedPromptIds: [],
  exploredSectionIds: [],
  responses: {},
  version: 1,
});

class PreviewGateway implements LearnProgressGateway {
  state = emptyState();
  load = vi.fn(async () => this.state);
  loadJourneySummaries = vi.fn(async (lessonIds: readonly string[]) => Object.fromEntries(lessonIds.map((lessonId) => [lessonId, { lessonId, status: 'in-progress' as const }])) as Record<string, JourneyProgressSummary>);
  markSection = vi.fn(async () => this.state);
  saveAttempt = vi.fn(async () => this.state);
  complete = vi.fn(async () => ({ completion: 'newly-completed' as const, cardOwnership: 'not-configured' as const }));
}

beforeEach(() => {
  vi.stubEnv('VITE_MEDIA_PROVIDER', 'repository');
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} });
  Element.prototype.scrollIntoView = vi.fn();
  vi.stubGlobal('scrollTo', vi.fn());
});

afterEach(() => {
  cleanup();
  setUnlockPreviewLessonsForTests(undefined);
  vi.unstubAllEnvs();
});

describe('Crossing to Sahul Learn preview', () => {
  it('fails closed without preview unlock', () => {
    setUnlockPreviewLessonsForTests(false);
    render(<LearnApp lessonId={LESSON_ID} gatewayFactory={async () => new PreviewGateway()} />);
    expect(screen.getByRole('heading', { name: /not available/i })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Crossing to Sahul' })).toBeNull();
  });

  it('renders the unpublished prototype with preview unlock', async () => {
    setUnlockPreviewLessonsForTests(true);
    render(<LearnApp lessonId={LESSON_ID} gatewayFactory={async () => new PreviewGateway()} />);
    expect(await screen.findByRole('heading', { name: 'Crossing to Sahul' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Sahul was one land' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Tools in dated sand' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'World Check' })).toBeTruthy();
    expect(screen.getAllByText(/at least c\. 65,000–50,000 years ago/i).length).toBeGreaterThan(0);
    expect(document.querySelectorAll('[data-section-id]')).toHaveLength(6);
  });
});
