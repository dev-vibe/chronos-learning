import { Archive, Ruler } from 'lucide-react';
import type { LessonModule, MediaAsset, Source } from '../domains/contracts';
import { ResponsiveMedia } from './ResponsiveMedia';

type Props = {
  module: Extract<LessonModule, { type: 'evidence' }>;
  media: MediaAsset;
  source?: Source;
};

const depictionHeadings = {
  evidence: 'Surviving evidence',
  diagram: 'Illustrated interpretation',
  'evidence-based-reconstruction': 'Reconstruction',
  map: 'Historical map',
};

export function EvidenceModule({ module, media, source }: Props) {
  const stacked = module.layout === 'stacked';
  return <figure className={`evidence-module${stacked ? ' evidence-module--stacked' : ''}`}>
    <div className="evidence-image">
      <ResponsiveMedia media={media} alt={media.alt} sizes={stacked ? '100vw' : '(max-width: 800px) 100vw, 50vw'} loading="eager" />
      <span>{module.artifactLabel}</span>
    </div>
    <figcaption>
      <div className="evidence-type"><Archive /><span>{depictionHeadings[media.depictionMode]}</span></div>
      <h3>{module.title}</h3>
      <p>{module.body}</p>
      {module.scaleNote && <aside className="evidence-scale-note"><Ruler aria-hidden="true" /><p><strong>About scale</strong> {module.scaleNote}</p></aside>}
      <dl>
        <div><dt>Depiction</dt><dd>{media.depictionLabel}</dd></div>
        <div><dt>Source</dt><dd>{source ? <a href={source.url} target="_blank" rel="noreferrer">{source.publisher}</a> : 'Institutional source'}</dd></div>
        {media.reviewStatus === 'approved' && <div><dt>Rights</dt><dd>{media.rightsLabel}</dd></div>}
      </dl>
    </figcaption>
  </figure>;
}
