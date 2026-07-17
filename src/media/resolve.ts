import type { MediaAsset } from '../domains/contracts';

export type MediaDeliveryMode = 'repository' | 'object-storage';
export type MediaResolutionOptions = { mode?: MediaDeliveryMode; publicBaseUrl?: string };
export type ResolvedMedia = {
  src: string;
  srcSet?: string;
  fallbackSrc: string;
  width: number;
  height: number;
  usesObjectStorage: boolean;
};

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');
const encodePath = (value: string) => value.split('/').map(encodeURIComponent).join('/');

function environmentBaseUrl() {
  const configured = import.meta.env.VITE_MEDIA_BASE_URL?.trim();
  if (configured) return trimTrailingSlash(configured);
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
  return supabaseUrl ? `${trimTrailingSlash(supabaseUrl)}/storage/v1/object/public` : undefined;
}

function environmentMode(): MediaDeliveryMode {
  const configured = import.meta.env.VITE_MEDIA_PROVIDER?.trim();
  if (configured === 'repository' || configured === 'object-storage') return configured;
  return 'repository';
}

export function resolveMediaAsset(asset: MediaAsset, options: MediaResolutionOptions = {}): ResolvedMedia {
  const locator = asset.locator;
  if (locator.provider === 'repository') {
    return { src: locator.path, fallbackSrc: locator.path, width: locator.width, height: locator.height, usesObjectStorage: false };
  }

  const publicBaseUrl = options.publicBaseUrl === undefined ? environmentBaseUrl() : trimTrailingSlash(options.publicBaseUrl);
  const mode = options.mode ?? environmentMode();
  const fallback = locator.fallback;
  if (mode === 'repository' || !publicBaseUrl) {
    return { src: fallback.path, fallbackSrc: fallback.path, width: fallback.width, height: fallback.height, usesObjectStorage: false };
  }

  const variants = [...locator.variants].sort((left, right) => left.width - right.width);
  const bucket = locator.bucket;
  const urlFor = (objectKey: string) => `${publicBaseUrl}/${encodeURIComponent(bucket)}/${encodePath(objectKey)}`;
  const largest = variants.at(-1)!;
  return {
    src: urlFor(largest.objectKey),
    srcSet: variants.map((variant) => `${urlFor(variant.objectKey)} ${variant.width}w`).join(', '),
    fallbackSrc: fallback.path,
    width: fallback.width,
    height: fallback.height,
    usesObjectStorage: true,
  };
}
