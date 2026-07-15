import { describe, expect, it } from 'vitest';
import { media } from '../../content/uruk';
import { resolveMediaAsset } from '../../src/media/resolve';

const reconstruction = media.find((asset) => asset.id === 'media.uruk.reconstruction')!;

describe('media resolver', () => {
  it('uses the committed repository fallback for instant rollback', () => {
    expect(resolveMediaAsset(reconstruction, { mode: 'repository' })).toMatchObject({
      src: '/images/places/uruk-reconstruction.webp',
      fallbackSrc: '/images/places/uruk-reconstruction.webp',
      width: 1600,
      height: 800,
      usesObjectStorage: false,
    });
  });

  it('builds a provider-neutral responsive object-storage URL set', () => {
    const resolved = resolveMediaAsset(reconstruction, { mode: 'object-storage', publicBaseUrl: 'https://media.example.test/public/' });
    expect(resolved.src).toBe('https://media.example.test/public/media-public/uruk/media.uruk.reconstruction/bfbc7a7253595793/1600w-2e000abd798aef57.webp');
    expect(resolved.srcSet?.split(', ')).toHaveLength(3);
    expect(resolved.srcSet).toContain(' 480w');
    expect(resolved.srcSet).toContain(' 960w');
    expect(resolved.srcSet).toContain(' 1600w');
    expect(resolved.usesObjectStorage).toBe(true);
  });

  it('fails safely to the repository when no public object base URL is configured', () => {
    expect(resolveMediaAsset(reconstruction, { mode: 'object-storage', publicBaseUrl: '' }).src).toBe('/images/places/uruk-reconstruction.webp');
  });
});
