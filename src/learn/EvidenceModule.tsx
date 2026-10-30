import { Archive, Ruler } from 'lucide-react';
import type { LessonModule, MediaAsset, Source } from '../domains/contracts';
import { ResponsiveMedia } from './ResponsiveMedia';
import { EvidenceViewer } from './EvidenceViewer';
import { evidenceLayout } from './evidence-layout';

// `type?:` rather than `type:` so the plain (non-strict) typecheck, where zod's inferred fields are all
// optional, still finds the evidence module instead of `never`. Under strictNullChecks it is the same type.
type EvidenceModuleData = Extract<LessonModule, { type?: 'evidence' }>;

type Props = {
  module: EvidenceModuleData;
  media: MediaAsset;
  source?: Source;
  sources?: Source[];
  comparisonMedia?: MediaAsset;
};

export function EvidenceModule({ module, media, source, sources = [], comparisonMedia }: Props) {
  const stacked = Boolean(comparisonMedia) || evidenceLayout(media, module.layout) === 'stacked';
  const notes = module.lookHere && <aside className="look-here"><ul>{module.lookHere.map((item) => <li key={item.label}><strong>{item.label}</strong><p>{item.detail}</p></li>)}</ul></aside>;
  // Labels come from the lesson (the module's artifact label and title), never from the depiction type.
  return <figure className={`evidence-module${stacked ? ' evidence-module--stacked' : ''}`} data-depiction={media.depictionMode}>
    <div className={`evidence-visuals${comparisonMedia ? ' evidence-visuals--comparison' : ''}`}><div className="evidence-image">
      <ResponsiveMedia media={media} alt={media.alt} sizes={stacked ? '100vw' : '(max-width: 800px) 100vw, 50vw'} loading="eager" />
      <EvidenceViewer media={media} title={module.title} summary={module.body}>{notes}<p>{media.rightsLabel}</p></EvidenceViewer>
    </div>{comparisonMedia && module.comparison && <div className="evidence-comparison"><div className="evidence-image"><ResponsiveMedia media={comparisonMedia} alt={comparisonMedia.alt} sizes="50vw" loading="lazy" /><EvidenceViewer media={comparisonMedia} title={module.comparison.label} summary={module.comparison.detail}><p>{comparisonMedia.rightsLabel}</p></EvidenceViewer></div><p><strong>{module.comparison.label}</strong> {module.comparison.detail}</p><p>{comparisonMedia.depictionLabel}</p></div>}</div>
    <figcaption>
      <div className="evidence-type"><Archive aria-hidden="true" /><span>{module.artifactLabel}</span></div>
      <h3>{module.title}</h3>
      <p>{module.body}</p>
      {notes}
      {module.scaleNote && <aside className="evidence-scale-note"><Ruler aria-hidden="true" /><p>{module.scaleNote}</p></aside>}
      <details className="evidence-provenance"><summary>About this picture</summary><dl>
        <div><dt>Picture</dt><dd>{media.depictionLabel}</dd></div>
        {source && <div><dt>From</dt><dd><a href={source.url} target="_blank" rel="noreferrer">{source.publisher}</a></dd></div>}
        {media.reviewStatus === 'approved' && <div><dt>Permission</dt><dd>{media.rightsLabel}</dd></div>}
        {module.lookHere?.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.sourceIds.map((id) => sources.find((entry) => entry.id === id)).filter((entry): entry is Source => Boolean(entry)).map((entry) => <p key={entry.id}><a href={entry.url}>{entry.title}</a></p>)}</dd></div>)}
        {comparisonMedia && module.comparison && <div><dt>{module.comparison.label}</dt><dd>{comparisonMedia.depictionLabel}. {comparisonMedia.rightsLabel}{comparisonMedia.sourceIds.map((id) => sources.find((entry) => entry.id === id)).filter((entry): entry is Source => Boolean(entry)).map((entry) => <p key={entry.id}><a href={entry.url}>{entry.title}</a></p>)}</dd></div>}
      </dl></details>
    </figcaption>
  </figure>;
}
