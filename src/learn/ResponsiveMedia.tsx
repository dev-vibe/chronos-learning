import { useState, type ImgHTMLAttributes, type SyntheticEvent } from 'react';
import type { MediaAsset } from '../domains/contracts';
import { resolveMediaAsset } from '../media/resolve';

type ResponsiveMediaProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'height' | 'src' | 'srcSet' | 'width'> & {
  media: MediaAsset;
};

export function ResponsiveMedia({ media, onError, onLoad, className, ...imageProps }: ResponsiveMediaProps) {
  const resolved = resolveMediaAsset(media);
  const [delivery, setDelivery] = useState({ source: resolved.src, fallback: false, loaded: false });
  const sourceChanged = delivery.source !== resolved.src;
  const fallback = sourceChanged ? false : delivery.fallback;
  const loaded = sourceChanged ? false : delivery.loaded;

  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    if (!fallback && resolved.src !== resolved.fallbackSrc) {
      setDelivery({ source: resolved.src, fallback: true, loaded: false });
      return;
    }
    onError?.(event);
  };

  return <img
    {...imageProps}
    src={fallback ? resolved.fallbackSrc : resolved.src}
    srcSet={fallback ? undefined : resolved.srcSet}
    width={resolved.width}
    height={resolved.height}
    decoding={imageProps.decoding ?? 'async'}
    className={[className, 'responsive-media'].filter(Boolean).join(' ')}
    data-loaded={loaded || undefined}
    onLoad={(event) => {
      setDelivery({ source: resolved.src, fallback, loaded: true });
      onLoad?.(event);
    }}
    onError={handleError}
  />;
}
