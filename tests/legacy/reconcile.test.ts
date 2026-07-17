import { describe, expect, it } from 'vitest';
import { reconcileLegacyUruk } from '../../src/application/legacy/reconcileUruk';

describe('legacy Uruk reconciliation', () => {
  it('handles no legacy progress', () => expect(reconcileLegacyUruk([]).importedCompletion).toBe(false));

  it('maps retried uruk deterministically and ignores game fields', () => {
    const result = reconcileLegacyUruk([{ completed_nodes: ['uruk', 'uruk'], xp: 900, rarity: 'legendary' }, { completed_nodes: [{ node_id: 'uruk' }] }]);
    expect(result.importedCompletion).toBe(true);
    expect(result.ignoredGameFields).toEqual(['xp', 'rarity']);
  });

  it('reports invalid resume and preserves canonical ownership', () => {
    const result = reconcileLegacyUruk([{ resumeSectionId: 'missing', canonicalCardIds: ['card.place.uruk'] }]);
    expect(result.exceptionsRequiringReview).toHaveLength(1);
    expect(result.cardAlreadyOwned).toBe(true);
  });
});
