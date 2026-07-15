import type { HistoricalMapModule as HistoricalMapData, MediaAsset } from '../domains/contracts';
import { ResponsiveMedia } from './ResponsiveMedia';

export function HistoricalMapModule({ module, media }: { module: HistoricalMapData; media: MediaAsset }) {
  return <figure className="historical-map" aria-label={module.title}>
    <ResponsiveMedia media={media} alt={media.alt} sizes="(max-width: 800px) 100vw, 960px" loading="lazy" />
  </figure>;
}
