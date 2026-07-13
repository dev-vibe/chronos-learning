import { beforeEach, describe, expect, it, vi } from 'vitest';
import { urukContent } from '../../content/uruk';
import { LocalPreviewGateway, mapCompletionRpcResult } from '../../src/learn/progress';
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

  it('persists attempts and idempotently returns revisit completion states', async () => {
    const gateway = new LocalPreviewGateway(); const lessonId = 'lesson.uruk.first-city';
    await gateway.saveAttempt(lessonId, 'prompt.uruk.administration-evidence', 'Administrative tablets and cylinder seals');
    await gateway.saveAttempt(lessonId, 'prompt.uruk.opportunity-and-cost', 'Specialized work was possible, but coordinated labor placed unequal burdens on people.');
    const state = await gateway.load(lessonId);
    expect(canExplicitlyComplete(urukContent.lessons[1].promptIds, { lessonId, idempotencyKey: 'stable-key', explicitCompletion: true, attemptedPromptIds: state.attemptedPromptIds })).toBe(true);
    expect(await gateway.complete(lessonId, 'stable-key')).toMatchObject({ completion: 'newly-completed', cardOwnership: 'newly-acquired', cardId: 'card.place.uruk' });
    expect(await gateway.complete(lessonId, 'retry-key')).toMatchObject({ completion: 'already-completed', cardOwnership: 'already-owned' });
  });

  it('rejects local completion before required attempts', async () => {
    const gateway = new LocalPreviewGateway();
    await expect(gateway.complete('lesson.uruk.first-city', 'blocked-key')).rejects.toThrow('required prompt attempts missing');
  });

  it('maps the exact camelCase, hyphenated RPC payload contract', () => {
    expect(mapCompletionRpcResult({ completion: 'already-completed', cardOwnership: 'already-owned', cardId: 'card.place.uruk' })).toEqual({ completion: 'already-completed', cardOwnership: 'already-owned', cardId: 'card.place.uruk' });
    expect(mapCompletionRpcResult({ completion: 'newly-completed', cardOwnership: 'newly-acquired', cardId: 'card.place.uruk' })).toEqual({ completion: 'newly-completed', cardOwnership: 'newly-acquired', cardId: 'card.place.uruk' });
  });

  it('renders all canonical semantic sections and evidence metadata from the fixture', () => {
    const lesson = urukContent.lessons.find((item) => item.id === 'lesson.uruk.first-city')!;
    expect(lesson.sections.map((section) => section.id)).toEqual(lesson.sectionIdsRequired);
    expect(lesson.sections).toHaveLength(8);
    expect(urukContent.media[0]).toMatchObject({ depictionMode: 'evidence-based-reconstruction', reviewStatus: 'provenance-review-required' });
  });
});
