import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LocalPreviewGateway, mapCompletionRpcResult } from '../../src/learn/progress';

const values = new Map<string, string>();
vi.stubGlobal('localStorage', {
  getItem: (key: string) => values.get(key) ?? null,
  setItem: (key: string, value: string) => values.set(key, value),
});

describe('Knowledge Card completion', () => {
  beforeEach(() => values.clear());

  it('grants the Neanderthal card only once', async () => {
    const gateway = new LocalPreviewGateway();
    const lessonId = 'lesson.humans.migrations-and-interbreeding';
    await gateway.saveAttempt(lessonId, 'prompt.humans.long-segments-inference', 'option.humans.long-segments-recent');
    await gateway.saveAttempt(lessonId, 'prompt.humans.adna-evidence-and-limit', 'DNA can show biological relatives, but it cannot tell us a person’s language.');

    await expect(gateway.complete(lessonId, 'ancient-dna-first')).resolves.toMatchObject({
      completion: 'newly-completed',
      cardOwnership: 'newly-acquired',
      cardIds: ['card.people.neanderthals'],
      cardId: 'card.people.neanderthals',
    });
    await expect(gateway.complete(lessonId, 'ancient-dna-retry')).resolves.toMatchObject({
      completion: 'already-completed',
      cardOwnership: 'already-owned',
      cardIds: ['card.people.neanderthals'],
    });
  });

  it('maps the ordered multi-card RPC payload and preserves the first-card compatibility field', () => {
    expect(mapCompletionRpcResult({
      completion: 'newly-completed',
      cardOwnership: 'newly-acquired',
      cardIds: ['card.people.neanderthals', 'card.people.example-second'],
    })).toEqual({
      completion: 'newly-completed',
      cardOwnership: 'newly-acquired',
      cardIds: ['card.people.neanderthals', 'card.people.example-second'],
      cardId: 'card.people.neanderthals',
    });
  });
});
