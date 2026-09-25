import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cardsForLesson, LocalPreviewGateway, SupabaseLearnGateway, submissionAnswers } from '../../src/learn/progress';

const values = new Map<string, string>();
vi.stubGlobal('localStorage', {
  getItem: (key: string) => values.get(key) ?? null,
  setItem: (key: string, value: string) => values.set(key, value),
});

describe('parent review submissions', () => {
  beforeEach(() => values.clear());

  it('takes the cards a pass grants from the content bundle', () => {
    expect(cardsForLesson('lesson.humans.migrations-and-interbreeding')).toEqual(['card.people.neanderthals']);
    expect(cardsForLesson('lesson.egypt.pyramids-and-state-labor')).toEqual([]);
  });

  it('sends only this lesson’s prompts, in authored order', () => {
    expect(submissionAnswers('lesson.uruk.first-city', {
      'prompt.uruk.opportunity-and-cost': 'Specialists, but unequal labor.',
      'prompt.writing.administration-evidence': 'Wrong lesson',
      'prompt.uruk.administration-evidence': 'option.uruk.tablets',
    })).toEqual({
      'prompt.uruk.administration-evidence': 'option.uruk.tablets',
      'prompt.uruk.opportunity-and-cost': 'Specialists, but unequal labor.',
    });
  });

  it('lets a guest finish only after both required attempts, and never grants a card locally', async () => {
    const gateway = new LocalPreviewGateway();
    const lessonId = 'lesson.humans.migrations-and-interbreeding';
    await expect(gateway.submit(lessonId)).rejects.toThrow('required prompt attempts missing');
    await gateway.saveAttempt(lessonId, 'prompt.humans.long-segments-inference', 'option.humans.long-segments-recent');
    await expect(gateway.submit(lessonId)).rejects.toThrow('required prompt attempts missing');
    await gateway.saveAttempt(lessonId, 'prompt.humans.adna-evidence-and-limit', 'DNA can show biological relatives, but it cannot tell us a person’s language.');
    const finished = await gateway.submit(lessonId);
    expect(finished).toMatchObject({ status: 'completed', cardIds: [] });
    expect(finished.review).toBeUndefined();
    expect(finished.account).toBeUndefined();
    expect(await gateway.submit(lessonId)).toMatchObject({ status: 'completed', completedAt: finished.completedAt });
    expect(await gateway.loadInbox()).toEqual({ passes: [], returned: [], waitingForMyReview: 0 });
  });

  it('submits the latest answers through the submit_lesson command', async () => {
    const rpc = vi.fn(async () => ({ data: {}, error: null }));
    const gateway = new SupabaseLearnGateway('11111111-1111-4111-a111-111111111111', { rpc } as any);
    const state = { learnerId: 'x', lessonId: 'lesson.uruk.first-city', status: 'in-progress' as const, attemptedPromptIds: [], exploredSectionIds: [], responses: { 'prompt.uruk.administration-evidence': 'option.uruk.tablets' }, version: 1 as const };
    vi.spyOn(gateway, 'load').mockResolvedValue(state);
    await gateway.submit('lesson.uruk.first-city');
    expect(rpc).toHaveBeenCalledWith('submit_lesson', { p_lesson_id: 'lesson.uruk.first-city', p_answers: { 'prompt.uruk.administration-evidence': 'option.uruk.tablets' } });
    await gateway.acknowledgePass('lesson.uruk.first-city');
    expect(rpc).toHaveBeenLastCalledWith('acknowledge_pass', { p_lesson_id: 'lesson.uruk.first-city' });
  });

  it('maps unseen passes and sent-back notes into the learner inbox', async () => {
    const rows = [
      { lesson_id: 'lesson.uruk.first-city', status: 'passed', feedback: 'Great!', card_ids: ['card.place.uruk'], pass_seen_at: null },
      { lesson_id: 'lesson.writing.early-systems', status: 'passed', feedback: null, card_ids: [], pass_seen_at: '2026-09-01T00:00:00Z' },
      { lesson_id: 'lesson.egypt.nile-state', status: 'returned', feedback: 'Add a detail.', card_ids: [], pass_seen_at: null },
    ];
    const chain = (data: unknown) => { const query: any = { select: () => query, eq: () => query, in: () => query, then: (resolve: (value: unknown) => unknown) => Promise.resolve({ data, error: null }).then(resolve) }; return query; };
    const client: any = { from: (table: string) => chain(table === 'lesson_submissions' ? rows : []) };
    expect(await new SupabaseLearnGateway('11111111-1111-4111-a111-111111111111', client).loadInbox()).toEqual({
      passes: [{ lessonId: 'lesson.uruk.first-city', cardIds: ['card.place.uruk'], feedback: 'Great!' }],
      returned: [{ lessonId: 'lesson.egypt.nile-state', feedback: 'Add a detail.' }],
      waitingForMyReview: 0,
    });
  });
});
