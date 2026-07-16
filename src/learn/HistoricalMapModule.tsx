import type { HistoricalMapModule as HistoricalMapData, MediaAsset } from '../domains/contracts';

export function HistoricalMapModule({ module, media }: { module: HistoricalMapData; media: MediaAsset }) {
  return <figure className="historical-map" aria-label={module.title}>
    <img src={media.path} alt={media.alt} width="1732" height="908" loading="lazy" decoding="async" />
  </figure>;
}
