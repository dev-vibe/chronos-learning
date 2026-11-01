// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LearnApp } from '../../src/learn/LearnApp';
import { setUnlockPreviewLessonsForTests } from '../../src/config/runtimeFlags';
import type { JourneyProgressSummary, LearnProgressGateway, LearnState, ReviewInbox } from '../../src/learn/progress';

const lessonId = 'lesson.mesopotamia.akkadian-empire';
const guessId = 'guess.akkad.keep-a-city';
const question = 'After the army went home, what would a king need so that the people there kept doing what he said?';

const initial = (): LearnState => ({ learnerId: 'test-learner', lessonId, status: 'in-progress', attemptedPromptIds: [], exploredSectionIds: [], responses: {}, guesses: {}, account: { parentLinked: true }, version: 1 });
class TestGateway implements LearnProgressGateway {
  state = initial();
  load = vi.fn(async () => this.state);
  loadJourneySummaries = vi.fn(async (lessonIds: readonly string[]) => Object.fromEntries(lessonIds.map((id) => [id, { lessonId: id, status: 'in-progress' }])) as Record<string, JourneyProgressSummary>);
  markSection = vi.fn(async () => this.state);
  saveAttempt = vi.fn(async (_lesson: string, prompt: string, response: string) => { this.state = { ...this.state, attemptedPromptIds: [...new Set([...this.state.attemptedPromptIds, prompt])], responses: { ...this.state.responses, [prompt]: response } }; return this.state; });
  saveGuess = vi.fn(async (_lesson: string, id: string, guess: string) => { this.state = { ...this.state, guesses: { ...(this.state.guesses ?? {}), [id]: guess } }; return this.state; });
  submit = vi.fn(async () => this.state);
  inbox: ReviewInbox = { passes: [], returned: [], waitingForMyReview: 0 };
  loadInbox = vi.fn(async () => this.inbox);
  acknowledgePass = vi.fn(async () => undefined);
}

let scrollTo: ReturnType<typeof vi.fn>;
beforeEach(() => {
  setUnlockPreviewLessonsForTests(true);
  sessionStorage.clear();
  const storage = new Map<string, string>();
  const localStorageStub = { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => { storage.set(key, value); }, removeItem: (key: string) => { storage.delete(key); }, clear: () => storage.clear() };
  vi.stubEnv('VITE_MEDIA_PROVIDER', 'repository');
  vi.stubGlobal('localStorage', localStorageStub);
  Object.defineProperty(window, 'localStorage', { configurable: true, value: localStorageStub });
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} });
  Element.prototype.scrollIntoView = vi.fn();
  scrollTo = vi.fn();
  vi.stubGlobal('scrollTo', scrollTo);
});
afterEach(() => { cleanup(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); setUnlockPreviewLessonsForTests(undefined); });

const open = async (gateway: TestGateway) => {
  render(<LearnApp lessonId={lessonId} gatewayFactory={async () => gateway} />);
  await screen.findByRole('heading', { name: 'Sargon’s kingdom of Akkad' });
};

describe('guess before reading', () => {
  it('keeps the rest of the lesson hidden until a sincere guess is saved', async () => {
    const gateway = new TestGateway();
    await open(gateway);
    const box = screen.getByRole('textbox', { name: question });
    expect(box.getAttribute('placeholder')).toBe('A king would need…');
    expect(screen.getByText('Answer to keep reading')).toBeTruthy();
    // Nothing after the guess is on the page: no later sections, no checks, no completion panel.
    expect(screen.queryByRole('heading', { name: 'What Sargon’s records say' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'What it took to keep a city' })).toBeNull();
    expect(document.querySelector('[data-section-id="section.akkad.understanding"]')).toBeNull();
    expect(document.getElementById('completion-title')).toBeNull();
    // No grading anywhere around it.
    expect(screen.queryByText(/correct|right answer|wrong|score/i)).toBeNull();

    await userEvent.type(box, 'Army');
    await userEvent.click(screen.getByRole('button', { name: 'Save my guess' }));
    expect(screen.getByRole('alert').textContent).toBe('Write a few words, then save your guess.');
    expect(gateway.saveGuess).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(box);

    await userEvent.type(box, ' soldiers staying in the city');
    await userEvent.click(screen.getByRole('button', { name: 'Save my guess' }));
    expect(gateway.saveGuess).toHaveBeenCalledWith(lessonId, guessId, 'Army soldiers staying in the city');
    expect(gateway.saveAttempt).not.toHaveBeenCalled();

    expect(await screen.findByRole('heading', { name: 'What Sargon’s records say' })).toBeTruthy();
    expect(screen.queryByText('Answer to keep reading')).toBeNull();
    expect(screen.getByText('Saved')).toBeTruthy();
    expect(screen.getByText('Saved. The rest of the lesson is open below.').getAttribute('role')).toBe('status');
    // Focus stays where the button was, on the saved guess, without scrolling the page.
    const saved = document.activeElement as HTMLElement;
    expect(saved.classList.contains('saved-answer')).toBe(true);
    expect(within(saved).getByText('Army soldiers staying in the city')).toBeTruthy();
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
    // The checks and completion panel appear, and the guess counts toward none of them.
    expect(screen.getByRole('heading', { name: 'What it took to keep a city' })).toBeTruthy();
    expect(screen.queryByRole('textbox', { name: question })).toBeNull();
  });

  it('opens the whole lesson at the top when a guess is already saved, showing it read-only', async () => {
    const gateway = new TestGateway();
    gateway.state = { ...initial(), guesses: { [guessId]: 'A king would need his own people there.' } };
    await open(gateway);
    expect(screen.getByRole('heading', { name: 'What Sargon’s records say' })).toBeTruthy();
    expect(screen.queryByText('Answer to keep reading')).toBeNull();
    expect(screen.queryByRole('textbox', { name: question })).toBeNull();
    const savedText = screen.getAllByText('A king would need his own people there.');
    expect(savedText[0].closest('.saved-answer')).toBeTruthy();
    // Reopening never moves the reader: no scrolling to the guess and no focus taken.
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' });
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(document.body);
    expect(screen.queryByText('Saved. The rest of the lesson is open below.')).toBeNull();

    // Like a written answer, the guess can be edited; the lesson stays open while editing.
    await userEvent.click(screen.getByRole('button', { name: 'Edit my guess' }));
    const box = screen.getByRole('textbox', { name: question }) as HTMLTextAreaElement;
    expect(box.value).toBe('A king would need his own people there.');
    expect(document.activeElement).toBe(box);
    expect(screen.getByRole('heading', { name: 'What Sargon’s records say' })).toBeTruthy();
    await userEvent.clear(box);
    await userEvent.type(box, 'Food for the workers and an official');
    await userEvent.click(screen.getByRole('button', { name: 'Save my guess' }));
    expect(gateway.saveGuess).toHaveBeenLastCalledWith(lessonId, guessId, 'Food for the workers and an official');
  });

  it('shows the guess again, in the learner’s words, where the lesson answers it', async () => {
    const gateway = new TestGateway();
    gateway.state = { ...initial(), guesses: { [guessId]: 'More soldiers in every city.' } };
    await open(gateway);
    const note = screen.getByRole('complementary', { name: 'Your guess' });
    expect(within(note).getByText('You guessed:')).toBeTruthy();
    expect(within(note).getByText('More soldiers in every city.')).toBeTruthy();
    // Right after the paragraph that answers the opening question.
    const section = note.closest('[data-section-id]') as HTMLElement;
    expect(section.dataset.sectionId).toBe('section.akkad.regional-change');
    const answer = within(section).getByText(/^So what did it take to keep a city\?/);
    expect(answer.compareDocumentPosition(note) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(document.querySelectorAll('.guess-payoff')).toHaveLength(1);
  });

  it('never counts as a check: the lesson is ready to send only when its checks are done', async () => {
    const gateway = new TestGateway();
    gateway.state = { ...initial(), guesses: { [guessId]: 'Soldiers who stay behind.' } };
    await open(gateway);
    const waiting = screen.getByRole('button', { name: 'Answer the checks above' }) as HTMLButtonElement;
    expect(waiting.disabled).toBe(true);
    expect(gateway.state.attemptedPromptIds).toEqual([]);
    cleanup();

    const answered = new TestGateway();
    answered.state = { ...initial(), guesses: { [guessId]: 'Soldiers who stay behind.' }, attemptedPromptIds: ['prompt.akkad.urkesh-difference', 'prompt.akkad.official-or-princess'], responses: { 'prompt.akkad.urkesh-difference': 'option.akkad.princess-seal', 'prompt.akkad.official-or-princess': 'I would choose an official because the workers need food every day.' } };
    await open(answered);
    expect((screen.getByRole('button', { name: 'Finish and send for review' }) as HTMLButtonElement).disabled).toBe(false);
  });

  it('opens a lesson finished before it had a guess in full, with no guess box', async () => {
    const gateway = new TestGateway();
    gateway.state = { ...initial(), status: 'completed', completedAt: '2026-10-01T00:00:00.000Z' };
    await open(gateway);
    expect(screen.queryByRole('textbox', { name: question })).toBeNull();
    expect(screen.queryByText('Answer to keep reading')).toBeNull();
    expect(screen.queryByRole('complementary', { name: 'Your guess' })).toBeNull();
    expect(screen.getByRole('heading', { name: 'What Sargon’s records say' })).toBeTruthy();
  });

  it('takes a jump into a hidden section to the guess instead', async () => {
    const gateway = new TestGateway();
    await open(gateway);
    await userEvent.click(screen.getByRole('button', { name: /Leilan/ }));
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('textbox', { name: question })));
  });
});
