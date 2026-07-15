import { useEffect, useState, type ImgHTMLAttributes, type SyntheticEvent } from 'react';
import type { MediaAsset } from '../domains/contracts';
import { resolveMediaAsset } from '../media/resolve';

type ResponsiveMediaProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'height' | 'src' | 'srcSet' | 'width'> & {
  media: MediaAsset;
};

export function ResponsiveMedia({ media, onError, ...imageProps }: ResponsiveMediaProps) {
  const resolved = resolveMediaAsset(media);
  const [fallback, setFallback] = useState(false);
  useEffect(() => setFallback(false), [resolved.src]);

  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    if (!fallback && resolved.src !== resolved.fallbackSrc) {
      setFallback(true);
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
    onError={handleError}
  />;
}
