import type { HistoricalMapModule as HistoricalMapData, MediaAsset, Source } from '../domains/contracts';

type HistoricalMapModuleProps = {
  module: HistoricalMapData;
  media: MediaAsset;
  sources: Source[];
};

const depictionLabel = (status: HistoricalMapData['depictionStatus']) => status
  .split('-')
  .map((word) => word[0].toUpperCase() + word.slice(1))
  .join(' ');

export function HistoricalMapModule({ module, media, sources }: HistoricalMapModuleProps) {
  const titleId = `${module.id}-title`;
  const summaryId = `${module.id}-summary`;
  const uncertaintyId = `${module.id}-uncertainty`;
  const provenanceId = `${module.id}-provenance`;

  return <figure className="historical-map" aria-labelledby={titleId} aria-describedby={`${summaryId} ${uncertaintyId} ${provenanceId}`}>
    <figcaption className="historical-map__caption">
      <span className="historical-map__eyebrow">{module.eyebrow}</span>
      <h3 id={titleId}>{module.title}</h3>
      <p className="historical-map__body">{module.body}</p>

      <dl className="historical-map__context">
        <div><dt>Period</dt><dd>{module.periodLabel}</dd></div>
        <div><dt>Focus</dt><dd>{module.focusPlace}</dd></div>
        <div><dt>Today</dt><dd>{module.modernContext}</dd></div>
        <div><dt>Status</dt><dd>{depictionLabel(module.depictionStatus)}</dd></div>
      </dl>

      <div className="historical-map__confidence">
        <p><strong>Coordinate-verified cities</strong><span>Uruk, Ur, and Eridu follow official UNESCO World Heritage coordinates.</span></p>
        <p id={uncertaintyId} className="historical-map__uncertainty"><strong>Approximate ancient landscape</strong><span>{module.uncertaintyNote}</span></p>
      </div>

      <div id={provenanceId} className="historical-map__provenance">
        <strong>Geographic references</strong>
        <ul>{sources.map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.publisher}</a></li>)}</ul>
      </div>
    </figcaption>

    <div className="historical-map__artwork">
      <img src={media.path} alt={media.alt} width="1732" height="908" loading="lazy" decoding="async" />
      <span aria-hidden="true">Illustrative reconstruction</span>
    </div>
    <p id={summaryId} className="sr-only">{module.accessibleSummary}</p>
  </figure>;
}
