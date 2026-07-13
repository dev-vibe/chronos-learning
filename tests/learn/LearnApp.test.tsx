// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LearnApp } from '../../src/learn/LearnApp';
import { lessonIdFromPath } from '../../src/learn/route';
import type { LearnProgressGateway, LearnState } from '../../src/learn/progress';

const initial = (): LearnState => ({ learnerId: 'test', lessonId: 'lesson.uruk.first-city', status: 'in-progress', attemptedPromptIds: [], exploredSectionIds: [], responses: {}, version: 1 });
class TestGateway implements LearnProgressGateway {
  state = initial(); load = vi.fn(async () => this.state); markSection = vi.fn(async () => this.state);
  saveAttempt = vi.fn(async (_lesson: string, prompt: string, response: string) => { this.state = { ...this.state, attemptedPromptIds: [...new Set([...this.state.attemptedPromptIds, prompt])], responses: { ...this.state.responses, [prompt]: response } }; return this.state; });
  complete = vi.fn(async () => { this.state = { ...this.state, status: 'completed', completedAt: new Date().toISOString(), cardId: 'card.place.uruk' }; return { completion: 'newly-completed', cardOwnership: 'newly-acquired', cardId: 'card.place.uruk' } as const; });
}

beforeEach(() => {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} });
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => cleanup());

describe('Learn route and interactions', () => {
  it('parses the stable route and rejects unrelated paths', () => { expect(lessonIdFromPath('/learn/lesson.uruk.first-city')).toBe('lesson.uruk.first-city'); expect(lessonIdFromPath('/legacy')).toBeNull(); });
  it('renders an invalid lesson state', () => { render(<LearnApp lessonId="lesson.unknown" />); expect(screen.getByRole('heading', { name: /archive entry isn’t available/i })).toBeTruthy(); });
  it('renders the cinematic reconstruction hero and canonical sections', async () => { const gateway = new TestGateway(); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); expect(await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' })).toBeTruthy(); expect(screen.getByText('Evidence-based reconstruction')).toBeTruthy(); expect(screen.getByRole('heading', { name: 'Water, food, and labor' })).toBeTruthy(); });
  it('offers retry after progress load failure', async () => { const gateway = new TestGateway(); gateway.load.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(gateway.state); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('button', { name: 'Retry loading progress' }); await userEvent.click(screen.getByRole('button', { name: 'Retry loading progress' })); expect(await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' })).toBeTruthy(); expect(gateway.load).toHaveBeenCalledTimes(2); });
  it('closes the mobile drawer with Escape and returns focus', async () => { const gateway = new TestGateway(); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' }); const open = screen.getByRole('button', { name: 'Open journey' }); await userEvent.click(open); expect(screen.getByRole('dialog', { name: 'World History journey' })).toBeTruthy(); fireEvent.keyDown(document, { key: 'Escape' }); expect(open).toBe(document.activeElement); });
  it('navigates to a semantic section and moves focus with the journey control', async () => { const gateway = new TestGateway(); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' }); await userEvent.click(screen.getByRole('button', { name: 'The built city' })); const section = document.getElementById('section.uruk.the-built-city'); expect(section?.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' }); expect(section).toBe(document.activeElement); });
  it('applies the selected theme through a working labeled control', async () => { const gateway = new TestGateway(); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' }); expect(document.querySelector('.learn-app')?.getAttribute('data-theme')).toBe('light'); await userEvent.click(screen.getAllByRole('button', { name: 'Use dark theme' })[0]); expect(document.querySelector('.learn-app')?.getAttribute('data-theme')).toBe('dark'); expect(screen.getAllByRole('button', { name: 'Use light theme' }).length).toBeGreaterThan(0); });
  it('persists prompt feedback, completes, reveals one card, and gives a truthful next action', async () => { const gateway = new TestGateway(); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' }); await userEvent.click(screen.getByLabelText('Administrative tablets and cylinder seals')); expect(await screen.findByText(/Good investigation/)).toBeTruthy(); const text = screen.getByPlaceholderText('Use an example from the lesson…'); await userEvent.type(text, 'Specialized work created opportunity, while unequal labor was a serious cost.'); fireEvent.blur(text); await waitFor(() => expect(screen.getByRole('button', { name: 'Complete lesson' }).hasAttribute('disabled')).toBe(false)); await userEvent.click(screen.getByRole('button', { name: 'Complete lesson' })); expect(await screen.findByText('Knowledge Card · Place')).toBeTruthy(); expect(screen.getAllByRole('heading', { name: 'Uruk' })).toHaveLength(1); await userEvent.click(screen.getByRole('button', { name: 'Preview Early Writing Systems' })); expect(screen.getByText(/That lesson is not published yet/)).toBeTruthy(); });
});
