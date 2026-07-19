import { describe, expect, it } from 'vitest';
import { MediaVariantSchema } from '../../src/domains/contracts';
import manifest from '../../content/media/generated/chronos-media.json';

describe('media quality contract', () => {
  it('records policy-compliant, visibly optimized variants', () => {
    for (const asset of manifest.assets) {
      for (const variant of asset.locator.variants) {
        expect(MediaVariantSchema.safeParse(variant).success).toBe(true);
        expect(variant.objectKey).toContain('/optimized/ql-v1/');
        expect(variant.bytes).toBeLessThanOrEqual(manifest.qualityPolicy.maximumVariantBytes);
      }
      expect(asset.locator.fallback.path).toMatch(/^\/images\/optimized\//);
    }
  });

  it('preserves source bytes when a lossy rewrite would save less than five percent', () => {
    const reconstruction = manifest.assets.find((asset) => asset.id === 'media.uruk.reconstruction');
    const largest = reconstruction?.locator.variants.at(-1);
    expect(largest?.compression.encoder).toBe('source-passthrough');
    expect(largest?.fidelity.mode).toBe('pixel-exact');
  });

  it('contains no smaller-width derivative that costs more than the next larger choice', () => {
    for (const asset of manifest.assets) {
      const variants = asset.locator.variants;
      for (let index = 0; index < variants.length - 1; index += 1) {
        expect(variants[index].bytes).toBeLessThan(variants[index + 1].bytes);
      }
    }
  });
});
