// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LearnApp } from '../../src/learn/LearnApp';
import type { JourneyProgressSummary, LearnProgressGateway, LearnState } from '../../src/learn/progress';

const emptyState = (lessonId: string): LearnState => ({
  learnerId: 'multi-lesson-test', lessonId, status: 'in-progress', attemptedPromptIds: [], exploredSectionIds: [], responses: {}, version: 1,
});

class MultiLessonGateway implements LearnProgressGateway {
  states = new Map([
    ['lesson.uruk.first-city', emptyState('lesson.uruk.first-city')],
    ['lesson.writing.early-systems', emptyState('lesson.writing.early-systems')],
  ]);
  load = vi.fn(async (lessonId: string) => this.states.get(lessonId)!);
  loadJourneySummaries = vi.fn(async (lessonIds: readonly string[]) => Object.fromEntries(lessonIds.map((lessonId) => {
    const state = this.states.get(lessonId);
    return [lessonId, { lessonId, status: state?.status ?? 'in-progress', completedAt: state?.completedAt }];
  })) as Record<string, JourneyProgressSummary>);
  markSection = vi.fn(async (lessonId: string, sectionId: string) => {
    const state = this.states.get(lessonId)!;
    const next = { ...state, resumeSectionId: sectionId, exploredSectionIds: [...new Set([...state.exploredSectionIds, sectionId])] };
    this.states.set(lessonId, next);
    return next;
  });
  saveAttempt = vi.fn(async (lessonId: string, promptId: string, response: string) => {
    const state = this.states.get(lessonId)!;
    const next = { ...state, attemptedPromptIds: [...new Set([...state.attemptedPromptIds, promptId])], responses: { ...state.responses, [promptId]: response } };
    this.states.set(lessonId, next);
    return next;
  });
  complete = vi.fn(async (lessonId: string) => {
    const state = this.states.get(lessonId)!;
    if (state.status === 'completed') return { completion: 'already-completed', cardOwnership: 'already-owned', cardId: state.cardId } as const;
    const cardId = lessonId === 'lesson.writing.early-systems' ? 'card.artifact.proto-cuneiform-tablet' : 'card.place.uruk';
    this.states.set(lessonId, { ...state, status: 'completed', completedAt: new Date().toISOString(), cardId });
    return { completion: 'newly-completed', cardOwnership: 'newly-acquired', cardId } as const;
  });
}

beforeEach(() => {
  vi.stubEnv('VITE_MEDIA_PROVIDER', 'repository');
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} });
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => { cleanup(); vi.unstubAllEnvs(); });

describe('multi-lesson Learn runtime', () => {
  it('resolves the published writing lesson with ordered journey and prior navigation', async () => {
    const gateway = new MultiLessonGateway();
    render(<LearnApp lessonId="lesson.writing.early-systems" gatewayFactory={async () => gateway} />);
    expect(await screen.findByRole('heading', { name: 'From Marks to Proto-Cuneiform' })).toBeTruthy();
    expect(document.title).toContain('From Marks to Proto-Cuneiform');
    expect(document.querySelectorAll('[data-section-id]')).toHaveLength(8);
    expect((document.querySelector('.hero-media') as HTMLImageElement).src).toContain('/images/optimized/early-writing/proto-cuneiform-tablet.optimized.webp');
    expect(screen.getByRole('link', { name: /Previous: Uruk/ }).getAttribute('href')).toBe('/learn/lesson.uruk.first-city');
    const journey = screen.getByLabelText('World History journey');
    const publishedLinks = within(journey).getAllByRole('link').map((link) => link.getAttribute('href'));
    expect(publishedLinks).toEqual(['/learn/lesson.uruk.first-city', '/learn/lesson.writing.early-systems']);
    expect(within(journey).getByText('Farming and Settlements').closest('[aria-disabled="true"]')).toBeTruthy();
    expect(gateway.load).toHaveBeenCalledTimes(1);
    expect(gateway.load).toHaveBeenCalledWith('lesson.writing.early-systems');
    expect(gateway.loadJourneySummaries).toHaveBeenCalledTimes(1);
    expect(gateway.loadJourneySummaries).toHaveBeenCalledWith(['lesson.uruk.first-city', 'lesson.writing.early-systems']);
  });

  it('completes writing once, reveals its deterministic card once, and keeps Uruk isolated', async () => {
    const gateway = new MultiLessonGateway();
    render(<LearnApp lessonId="lesson.writing.early-systems" gatewayFactory={async () => gateway} />);
    await screen.findByRole('heading', { name: 'From Marks to Proto-Cuneiform' });
    await userEvent.click(screen.getByLabelText('A proto-cuneiform tablet recording quantities and goods'));
    const explanation = screen.getByRole('textbox', { name: /Explain one thing writing made possible/ });
    await userEvent.type(explanation, 'Writing made allocations durable, but surviving administrative tablets omit many voices.');
    fireEvent.blur(explanation);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Complete lesson' }).hasAttribute('disabled')).toBe(false));
    await userEvent.click(screen.getByRole('button', { name: 'Complete lesson' }));
    expect(await screen.findByText(/Knowledge Card.*artifact/)).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Proto-Cuneiform Tablet' })).toBeTruthy();
    expect(gateway.states.get('lesson.uruk.first-city')?.status).toBe('in-progress');
    expect(gateway.complete).toHaveBeenCalledTimes(1);

    cleanup();
    render(<LearnApp lessonId="lesson.writing.early-systems" gatewayFactory={async () => gateway} />);
    await screen.findByRole('heading', { name: 'From Marks to Proto-Cuneiform' });
    expect(screen.queryByText('Knowledge Card acquired')).toBeNull();
    expect(screen.getByText(/already in your Knowledge Cards/)).toBeTruthy();
  });

  it('keeps the unpublished farming entry visibly non-completable', () => {
    render(<LearnApp lessonId="lesson.farming.settlements" />);
    expect(screen.getByRole('heading', { name: /completable yet/i })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Complete lesson' })).toBeNull();
  });
});
