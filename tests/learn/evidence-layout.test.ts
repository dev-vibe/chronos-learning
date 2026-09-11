import { expect, it } from 'vitest';
import { chronosContent } from '../../content/chronos';
import { evidenceLayout } from '../../src/learn/evidence-layout';

it('places landscapes above text and square/portrait images beside it before delivery', () => {
  const original = chronosContent.media[0];
  for (const [width, height, expected] of [[1600, 800, 'stacked'], [800, 800, 'side-by-side'], [800, 1200, 'side-by-side']] as const) {
    const repository = { ...original, locator: { provider: 'repository' as const, path: '/images/example.webp', width, height } };
    expect(evidenceLayout(repository)).toBe(expected);
    const remote = { ...original, locator: { provider: 'object-storage' as const, bucket: 'media', fallback: { path: '/images/example.webp', width, height }, variants: [] } };
    expect(evidenceLayout(remote)).toBe(expected);
  }
});

it('preserves a deliberate authored layout for evidence whose details need extra space', () => {
  const image = { ...chronosContent.media[0], locator: { provider: 'repository' as const, path: '/images/example.webp', width: 800, height: 1200 } };
  expect(evidenceLayout(image, 'stacked')).toBe('stacked');
});
