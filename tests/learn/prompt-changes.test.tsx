// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LearnApp } from '../../src/learn/LearnApp';
import { LocalPreviewGateway, SupabaseLearnGateway, type JourneyProgressSummary, type LearnProgressGateway, type LearnState, type ReviewInbox } from '../../src/learn/progress';

// After a prompt is replaced, a learner's stored data names a prompt the
// lesson no longer has (retired) and lacks the prompt that replaced it (new).
// Uruk's current required prompts are these two; "the new one" below is the
// written answer, which the learner has not answered yet.
const lessonId = 'lesson.uruk.first-city';
const choice = 'prompt.uruk.administration-evidence';
const replacement = 'prompt.uruk.opportunity-and-cost';
const retired = 'prompt.uruk.retired-question';
const learnerId = '11111111-1111-4111-a111-111111111111';

const afterChange = (overrides: Partial<LearnState> = {}): LearnState => ({
  learnerId: 'test', lessonId, status: 'completed', completedAt: '2026-09-01T00:00:00.000Z',
  attemptedPromptIds: [choice], responses: { [choice]: 'option.uruk.tablets' },
  exploredSectionIds: [], account: { parentLinked: true }, version: 1, ...overrides,
});

class TestGateway implements LearnProgressGateway {
  constructor(public state: LearnState) {}
  load = vi.fn(async () => this.state);
  loadJourneySummaries = vi.fn(async (ids: readonly string[]) => Object.fromEntries(ids.map((id) => [id, { lessonId: id, status: id === lessonId ? this.state.status : 'in-progress' }])) as Record<string, JourneyProgressSummary>);
  markSection = vi.fn(async () => this.state);
  saveAttempt = vi.fn(async (_lesson: string, prompt: string, response: string) => { this.state = { ...this.state, attemptedPromptIds: [...new Set([...this.state.attemptedPromptIds, prompt])], responses: { ...this.state.responses, [prompt]: response } }; return this.state; });
  submit = vi.fn(async () => { this.state = { ...this.state, review: { status: 'submitted', round: (this.state.review?.round ?? 0) + 1, submittedAt: '2026-09-26T00:00:00.000Z', cardIds: [] } }; return this.state; });
  inbox: ReviewInbox = { passes: [], returned: [], waitingForMyReview: 0 };
  loadInbox = vi.fn(async () => this.inbox);
  acknowledgePass = vi.fn(async () => undefined);
}

const storage = new Map<string, string>();
beforeEach(() => {
  storage.clear();
  sessionStorage.clear();
  const localStorageStub = { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => { storage.set(key, value); }, removeItem: (key: string) => { storage.delete(key); }, clear: () => storage.clear() };
  vi.stubEnv('VITE_MEDIA_PROVIDER', 'repository');
  vi.stubGlobal('localStorage', localStorageStub);
  Object.defineProperty(window, 'localStorage', { configurable: true, value: localStorageStub });
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} });
  Element.prototype.scrollIntoView = vi.fn();
  vi.stubGlobal('scrollTo', vi.fn());
});
afterEach(() => { cleanup(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

const open = async (state: LearnState) => {
  const gateway = new TestGateway(state);
  render(<LearnApp lessonId={lessonId} gatewayFactory={async () => gateway} />);
  await screen.findByRole('heading', { name: 'Uruk: Life in an Early City', level: 1 });
  return gateway;
};
const answerReplacement = async () => {
  await userEvent.type(screen.getByRole('textbox'), 'Rations fed specialists, but the work was shared unequally.');
  await userEvent.click(screen.getByRole('button', { name: 'Save my answer' }));
};

describe('a finished learner after a required prompt is added or replaced', () => {
  it('waiting for review: stays finished, and asks for the new answer only before sending updates', async () => {
    const gateway = await open(afterChange({ review: { status: 'submitted', round: 1, submittedAt: '2026-09-01T00:00:00.000Z', cardIds: [] } }));
    expect(screen.getByRole('heading', { name: 'Lesson finished' })).toBeTruthy();
    expect(screen.getByText('Waiting for review')).toBeTruthy();
    expect(screen.queryByRole('heading', { name: /^Finish / })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Send my updated answers' })).toBeNull();
    expect(screen.getByText(/answer every check above first/)).toBeTruthy();
    expect(screen.getByRole('link', { name: /Continue: From Marks/ })).toBeTruthy();
    await answerReplacement();
    await userEvent.click(await screen.findByRole('button', { name: 'Send my updated answers' }));
    expect(gateway.submit).toHaveBeenCalledTimes(1);
  });

  it('passed: stays passed with its cards, and the new question is ordinary practice', async () => {
    await open(afterChange({ cardIds: ['card.place.uruk'], review: { status: 'passed', round: 1, submittedAt: '2026-09-01T00:00:00.000Z', reviewedAt: '2026-09-02T00:00:00.000Z', cardIds: ['card.place.uruk'], passSeenAt: '2026-09-02T00:00:00.000Z' } }));
    expect(screen.getByRole('heading', { name: 'Lesson passed' })).toBeTruthy();
    expect(screen.getByText('In your Knowledge Cards')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /send/i })).toBeNull();
    expect(screen.getByRole('button', { name: 'Save my answer' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Continue: From Marks/ })).toBeTruthy();
  });

  it('sent back: says which question still needs an answer before it can be sent again', async () => {
    const gateway = await open(afterChange({ review: { status: 'returned', round: 1, submittedAt: '2026-09-01T00:00:00.000Z', reviewedAt: '2026-09-02T00:00:00.000Z', feedback: 'Say who did the work.', cardIds: [] } }));
    expect(screen.getByRole('heading', { name: 'Your parent sent this back' })).toBeTruthy();
    expect(screen.getByText(/The lesson stays finished while you work on it/)).toBeTruthy();
    const send = screen.getByRole('button', { name: 'Answer every check above to send it again' });
    expect(send.hasAttribute('disabled')).toBe(true);
    const items = document.querySelectorAll('.review-prompt-links li');
    expect(items[0].textContent).not.toContain('not answered yet');
    expect(items[1].textContent).toContain('not answered yet');
    await answerReplacement();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Send it again' }).hasAttribute('disabled')).toBe(false));
    await userEvent.click(screen.getByRole('button', { name: 'Send it again' }));
    expect(gateway.submit).toHaveBeenCalledTimes(1);
  });

  it('finished before parent review existed: shows the lesson as finished, never as unfinished', async () => {
    await open(afterChange());
    expect(screen.getByRole('heading', { name: 'Lesson finished' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: /^Finish / })).toBeNull();
    expect(screen.getByRole('button', { name: 'Answer the checks above to send' }).hasAttribute('disabled')).toBe(true);
    expect(screen.getByRole('link', { name: /Continue: From Marks/ })).toBeTruthy();
    await answerReplacement();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Send for review' }).hasAttribute('disabled')).toBe(false));
  });

  it('guest who finished locally: stays finished with no finish button', async () => {
    const { account: _account, ...guest } = afterChange();
    await open(guest);
    expect(screen.getByRole('heading', { name: 'Lesson finished' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Finish lesson|Answer the checks/ })).toBeNull();
    expect(screen.getByRole('link', { name: /Continue: From Marks/ })).toBeTruthy();
  });
});

describe('progress gateways ignore attempts for prompts the lesson no longer has', () => {
  it('guest progress: keeps a finished lesson finished and keeps the retired answer in storage', async () => {
    storage.set(`chronos.learn.preview.v1:${lessonId}`, JSON.stringify({
      learnerId: 'anonymous-preview', lessonId, status: 'completed', completedAt: '2026-09-01T00:00:00.000Z',
      attemptedPromptIds: [retired, choice], responses: { [retired]: 'An older answer', [choice]: 'option.uruk.tablets' },
      exploredSectionIds: [], version: 1,
    }));
    const gateway = new LocalPreviewGateway();
    const loaded = await gateway.load(lessonId);
    expect(loaded.status).toBe('completed');
    expect(loaded.attemptedPromptIds).toEqual([choice]);
    expect(loaded.responses).toEqual({ [choice]: 'option.uruk.tablets' });
    expect(await gateway.submit(lessonId)).toMatchObject({ status: 'completed', completedAt: '2026-09-01T00:00:00.000Z' });
    expect(await gateway.loadJourneySummaries([lessonId])).toEqual({ [lessonId]: { lessonId, status: 'completed', completedAt: '2026-09-01T00:00:00.000Z' } });
    const saved = await gateway.saveAttempt(lessonId, replacement, 'Rations fed specialists, but the work was shared unequally.');
    expect(saved.attemptedPromptIds).toEqual([choice, replacement]);
    expect(JSON.parse(storage.get(`chronos.learn.preview.v1:${lessonId}`)!).responses[retired]).toBe('An older answer');
  });

  const fakeClient = (attempts: Array<{ prompt_id: string; response: unknown }>, rpc = vi.fn(async (_name: string, _args: unknown) => ({ data: null, error: null }))) => {
    const query = (data: unknown) => {
      const chain: any = { select: () => chain, eq: () => chain, order: () => chain, single: async () => ({ data, error: null }), maybeSingle: async () => ({ data, error: null }), then: (resolve: (value: unknown) => unknown) => Promise.resolve({ data, error: null }).then(resolve) };
      return chain;
    };
    const rows: Record<string, unknown> = {
      lesson_progress: { status: 'completed', completed_at: '2026-09-01T00:00:00Z' },
      understanding_prompt_attempts: attempts,
      lesson_submissions: { status: 'submitted', round: 1, submitted_at: '2026-09-01T00:00:00Z', card_ids: [] },
      guardian_links: [{ guardian_id: '22222222-2222-4222-a222-222222222222' }],
    };
    return { client: { from: (table: string) => ({ upsert: async () => ({ error: null }), select: () => query(rows[table] ?? []) }), rpc } as any, rpc };
  };

  it('signed-in progress: load drops retired attempts but keeps the lesson finished', async () => {
    const { client } = fakeClient([
      { prompt_id: retired, response: { answer: 'An older answer' } },
      { prompt_id: choice, response: { answer: 'option.uruk.tablets' } },
    ]);
    const loaded = await new SupabaseLearnGateway(learnerId, client).load(lessonId);
    expect(loaded.status).toBe('completed');
    expect(loaded.attemptedPromptIds).toEqual([choice]);
    expect(loaded.responses).toEqual({ [choice]: 'option.uruk.tablets' });
  });

  it('signed-in submit: sends only current answers, with the questions as the learner sees them', async () => {
    const { client, rpc } = fakeClient([
      { prompt_id: retired, response: { answer: 'An older answer' } },
      { prompt_id: choice, response: { answer: 'option.uruk.reconstruction' } },
    ]);
    await new SupabaseLearnGateway(learnerId, client).submit(lessonId);
    expect(rpc).toHaveBeenCalledWith('submit_lesson', expect.objectContaining({ p_lesson_id: lessonId, p_learner_id: learnerId, p_answers: { [choice]: 'option.uruk.reconstruction' } }));
    const questions = (rpc.mock.calls[0][1] as any).p_questions;
    expect(questions).toEqual([
      expect.objectContaining({ promptId: choice, kind: 'supported-selection', question: 'Which evidence best supports organized administration at Uruk?', required: true, answerLabel: 'A reconstruction painting of the city', best: false }),
      expect.objectContaining({ promptId: replacement, kind: 'concise-explanation', required: true }),
    ]);
    expect(questions[1]).not.toHaveProperty('answerLabel');
    expect(questions.map((question: any) => question.promptId)).not.toContain(retired);
  });
});
