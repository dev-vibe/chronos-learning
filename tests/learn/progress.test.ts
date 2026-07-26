import { beforeEach, describe, expect, it, vi } from 'vitest';
import { chronosContent } from '../../content/chronos';
import { LocalPreviewGateway, mapCompletionRpcResult, SupabaseLearnGateway } from '../../src/learn/progress';
import { canExplicitlyComplete } from '../../src/domains/contracts';

const values = new Map<string, string>();
vi.stubGlobal('localStorage', { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) });

describe('Uruk Learn progress boundary', () => {
  beforeEach(() => values.clear());
  it('retains semantic section progress and meaningful resume without completing on scroll', async () => {
    const gateway = new LocalPreviewGateway();
    let state = await gateway.markSection('lesson.uruk.first-city', 'section.uruk.the-built-city');
    expect(state.resumeSectionId).toBe('section.uruk.the-built-city');
    expect(state.exploredSectionIds).toEqual(['section.uruk.the-built-city']);
    expect(state.status).toBe('in-progress');
    state = await gateway.markSection('lesson.uruk.first-city', 'section.uruk.check-and-complete');
    expect(state.status).toBe('in-progress');
  });

  it('drops removed semantic section IDs from resume and exploration state', async () => {
    const lessonId = 'lesson.uruk.first-city';
    values.set(`chronos.learn.preview.v1:${lessonId}`, JSON.stringify({
      learnerId: 'anonymous-preview',
      lessonId,
      status: 'in-progress',
      resumeSectionId: 'section.uruk.removed-experiment',
      attemptedPromptIds: [],
      exploredSectionIds: ['section.uruk.the-built-city', 'section.uruk.removed-experiment'],
      responses: {},
      version: 1,
    }));

    const state = await new LocalPreviewGateway().load(lessonId);

    expect(state.resumeSectionId).toBeUndefined();
    expect(state.exploredSectionIds).toEqual(['section.uruk.the-built-city']);
  });

  it('persists attempts and idempotently returns revisit completion states', async () => {
    const gateway = new LocalPreviewGateway(); const lessonId = 'lesson.uruk.first-city';
    await gateway.saveAttempt(lessonId, 'prompt.uruk.administration-evidence', 'Administrative tablets and cylinder seals');
    await gateway.saveAttempt(lessonId, 'prompt.uruk.opportunity-and-cost', 'Specialized work was possible, but coordinated labor placed unequal burdens on people.');
    const state = await gateway.load(lessonId);
    expect(canExplicitlyComplete(chronosContent.lessons.find((lesson) => lesson.id === lessonId)!.promptIds, { lessonId, idempotencyKey: 'stable-key', explicitCompletion: true, attemptedPromptIds: state.attemptedPromptIds })).toBe(true);
    expect(await gateway.complete(lessonId, 'stable-key')).toMatchObject({ completion: 'newly-completed', cardOwnership: 'newly-acquired', cardId: 'card.place.uruk' });
    expect(await gateway.complete(lessonId, 'retry-key')).toMatchObject({ completion: 'already-completed', cardOwnership: 'already-owned' });
  });

  it('rejects local completion before required attempts', async () => {
    const gateway = new LocalPreviewGateway();
    await expect(gateway.complete('lesson.uruk.first-city', 'blocked-key')).rejects.toThrow('required prompt attempts missing');
  });

  it('bootstraps authenticated progress with the hardened insert-only contract', async () => {
    const upserts: Array<{ table: string; payload: unknown; options: unknown }> = [];
    const query = (data: unknown) => {
      const chain: any = {
        select: () => chain,
        eq: () => chain,
        single: async () => ({ data, error: null }),
        maybeSingle: async () => ({ data, error: null }),
        then: (resolve: (value: unknown) => unknown) => Promise.resolve({ data, error: null }).then(resolve),
      };
      return chain;
    };
    const client: any = {
      from: (table: string) => ({
        upsert: async (payload: unknown, options: unknown) => {
          upserts.push({ table, payload, options });
          return { error: null };
        },
        select: () => query(table === 'lesson_progress' ? { status: 'in_progress', completed_at: null } : []),
      }),
    };

    await new SupabaseLearnGateway('11111111-1111-1111-1111-111111111111', client).load('lesson.uruk.first-city');

    expect(upserts).toEqual([
      {
        table: 'learners',
        payload: { id: '11111111-1111-1111-1111-111111111111' },
        options: { onConflict: 'id', ignoreDuplicates: true },
      },
      {
        table: 'lesson_progress',
        payload: { learner_id: '11111111-1111-1111-1111-111111111111', lesson_id: 'lesson.uruk.first-city' },
        options: { onConflict: 'learner_id,lesson_id', ignoreDuplicates: true },
      },
    ]);
  });

  it('maps the exact camelCase, hyphenated RPC payload contract', () => {
    expect(mapCompletionRpcResult({ completion: 'already-completed', cardOwnership: 'already-owned', cardId: 'card.place.uruk' })).toEqual({ completion: 'already-completed', cardOwnership: 'already-owned', cardId: 'card.place.uruk' });
    expect(mapCompletionRpcResult({ completion: 'newly-completed', cardOwnership: 'newly-acquired', cardId: 'card.place.uruk' })).toEqual({ completion: 'newly-completed', cardOwnership: 'newly-acquired', cardId: 'card.place.uruk' });
  });

  it('renders all canonical semantic sections and evidence metadata from the fixture', () => {
    const lesson = chronosContent.lessons.find((item) => item.id === 'lesson.uruk.first-city')!;
    expect(lesson.sections.map((section) => section.id)).toEqual(lesson.sectionIdsRequired);
    expect(lesson.sections).toHaveLength(7);
    expect(lesson.sections.some((section) => section.id === 'section.uruk.connections')).toBe(false);
    expect(chronosContent.media.find((item) => item.id === 'media.uruk.reconstruction')).toMatchObject({ depictionMode: 'evidence-based-reconstruction', reviewStatus: 'provenance-review-required' });
  });
});

describe('multi-lesson local progress boundary', () => {
  beforeEach(() => values.clear());

  it('persists writing resume and prompt attempts without corrupting Uruk', async () => {
    const gateway = new LocalPreviewGateway();
    const writingId = 'lesson.writing.early-systems';
    await gateway.markSection(writingId, 'section.writing.signs-change');
    await gateway.saveAttempt(writingId, 'prompt.writing.administration-evidence', 'option.writing.tablet');
    await expect(gateway.complete(writingId, 'blocked')).rejects.toThrow('required prompt attempts missing');
    await gateway.saveAttempt(writingId, 'prompt.writing.possibility-and-limit', 'Writing made durable allocations possible, while surviving administrative records omit many voices.');

    expect(await gateway.complete(writingId, 'first-key')).toMatchObject({ completion: 'newly-completed', cardOwnership: 'newly-acquired', cardId: 'card.artifact.proto-cuneiform-tablet' });
    expect(await gateway.complete(writingId, 'second-key')).toMatchObject({ completion: 'already-completed', cardOwnership: 'already-owned', cardId: 'card.artifact.proto-cuneiform-tablet' });
    expect(await gateway.load(writingId)).toMatchObject({ status: 'completed', resumeSectionId: 'section.writing.signs-change' });
    expect(await gateway.load('lesson.uruk.first-city')).toMatchObject({ status: 'in-progress', attemptedPromptIds: [], exploredSectionIds: [] });
  });
});
describe('journey progress summaries', () => {
  it('uses one bounded lesson_progress query instead of five detailed reads per published lesson', async () => {
    const lessonIds = Array.from({ length: 250 }, (_, index) => `lesson.test.${index}`);
    const inFilter = vi.fn(async () => ({
      data: [{ lesson_id: lessonIds[1], status: 'completed', completed_at: '2026-07-17T00:00:00.000Z' }],
      error: null,
    }));
    const chain: any = {
      select: () => chain,
      eq: () => chain,
      in: inFilter,
    };
    const client: any = { from: vi.fn(() => chain) };

    const summaries = await new SupabaseLearnGateway(
      '11111111-1111-1111-1111-111111111111',
      client,
    ).loadJourneySummaries(lessonIds);

    expect(client.from).toHaveBeenCalledTimes(1);
    expect(client.from).toHaveBeenCalledWith('lesson_progress');
    expect(inFilter).toHaveBeenCalledTimes(1);
    expect(inFilter).toHaveBeenCalledWith('lesson_id', lessonIds);
    expect(Object.keys(summaries)).toHaveLength(250);
    expect(summaries[lessonIds[1]]).toMatchObject({ status: 'completed' });
    expect(summaries[lessonIds[249]]).toMatchObject({ status: 'in-progress' });
  });
});
