import { Archive, Ruler } from 'lucide-react';
import type { LessonModule, MediaAsset, Source } from '../domains/contracts';
import { ResponsiveMedia } from './ResponsiveMedia';
import { EvidenceViewer } from './EvidenceViewer';

type Props = {
  module: Extract<LessonModule, { type: 'evidence' }>;
  media: MediaAsset;
  source?: Source;
  sources?: Source[];
  comparisonMedia?: MediaAsset;
};

const depictionHeadings = {
  evidence: 'Surviving evidence',
  diagram: 'Illustrated interpretation',
  'evidence-based-reconstruction': 'Reconstruction',
  map: 'Historical map',
};

export function EvidenceModule({ module, media, source, sources = [], comparisonMedia }: Props) {
  const stacked = module.layout === 'stacked';
  const notes = module.lookHere && <aside className="look-here"><h4>Look here</h4><ul>{module.lookHere.map((item) => <li key={item.label}><strong>{item.label}</strong><p>{item.detail}</p></li>)}</ul></aside>;
  return <figure className={`evidence-module${stacked ? ' evidence-module--stacked' : ''}`}>
    <div className={`evidence-visuals${comparisonMedia ? ' evidence-visuals--comparison' : ''}`}><div className="evidence-image">
      <ResponsiveMedia media={media} alt={media.alt} sizes={stacked ? '100vw' : '(max-width: 800px) 100vw, 50vw'} loading="eager" />
      <EvidenceViewer media={media} title={module.title} summary={module.body}>{notes}<p>{media.rightsLabel}</p></EvidenceViewer>
    </div>{comparisonMedia && module.comparison && <div className="evidence-comparison"><div className="evidence-image"><ResponsiveMedia media={comparisonMedia} alt={comparisonMedia.alt} sizes="50vw" loading="lazy" /><EvidenceViewer media={comparisonMedia} title={module.comparison.label} summary={module.comparison.detail}><p>{comparisonMedia.rightsLabel}</p></EvidenceViewer></div><p><strong>{module.comparison.label}</strong> {module.comparison.detail}</p><p>{comparisonMedia.depictionLabel}</p></div>}</div>
    <figcaption>
      <div className="evidence-type"><Archive /><span>{depictionHeadings[media.depictionMode]}</span></div>
      <h3>{module.title}</h3>
      <p>{module.body}</p>
      {notes}
      {module.scaleNote && <aside className="evidence-scale-note"><Ruler aria-hidden="true" /><p><strong>About scale</strong> {module.scaleNote}</p></aside>}
      <details className="evidence-provenance"><summary>Source and image details</summary><dl>
        <div><dt>Depiction</dt><dd>{media.depictionLabel}</dd></div>
        <div><dt>Source</dt><dd>{source ? <a href={source.url} target="_blank" rel="noreferrer">{source.publisher}</a> : 'See lesson sources'}</dd></div>
        {media.reviewStatus === 'approved' && <div><dt>Rights</dt><dd>{media.rightsLabel}</dd></div>}
        {module.lookHere?.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.sourceIds.map((id) => sources.find((entry) => entry.id === id)).filter((entry): entry is Source => Boolean(entry)).map((entry) => <p key={entry.id}><a href={entry.url}>{entry.title}</a></p>)}</dd></div>)}
        {comparisonMedia && <div><dt>Comparison image</dt><dd>{comparisonMedia.depictionLabel}. {comparisonMedia.rightsLabel}{comparisonMedia.sourceIds.map((id) => sources.find((entry) => entry.id === id)).filter((entry): entry is Source => Boolean(entry)).map((entry) => <p key={entry.id}><a href={entry.url}>{entry.title}</a></p>)}</dd></div>}
      </dl></details>
    </figcaption>
  </figure>;
}
