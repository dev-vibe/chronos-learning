import { Info, X } from 'lucide-react';
import { useRef } from 'react';
import type { HistoricalMapModule as HistoricalMapData, MediaAsset, Source } from '../domains/contracts';
import { ResponsiveMedia } from './ResponsiveMedia';
import { EvidenceViewer } from './EvidenceViewer';

type HistoricalMapModuleProps = {
  module: HistoricalMapData;
  media: MediaAsset;
  sources: Source[];
};

export function HistoricalMapModule({ module, media, sources }: HistoricalMapModuleProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const summaryId = `${module.id}-summary`;
  const dialogTitleId = `${module.id}-dialog-title`;
  const dialogDescriptionId = `${module.id}-dialog-description`;

  const openDialog = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else {
      dialog.setAttribute('open', '');
      dialog.querySelector<HTMLButtonElement>('button')?.focus();
    }
  };

  const closeDialog = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else {
      dialog.removeAttribute('open');
      triggerRef.current?.focus();
    }
  };

  return <figure className="historical-map" aria-label={module.title} aria-describedby={summaryId}>
    <ResponsiveMedia media={media} alt={media.alt} sizes="(max-width: 800px) 100vw, 960px" loading="lazy" />
    <EvidenceViewer className="historical-map__enlarge" media={media} title={module.title} summary={module.accessibleSummary}>
      <p>{module.uncertaintyNote}</p>
      {module.lookHere && <aside className="look-here"><ul>{module.lookHere.map((item) => <li key={item.label}><strong>{item.label}</strong><p>{item.detail}</p></li>)}</ul></aside>}
      <ul>{sources.map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></li>)}</ul>
    </EvidenceViewer>
    <button
      ref={triggerRef}
      className="historical-map__info"
      type="button"
      onClick={openDialog}
      aria-label={`About this map: ${module.title}`}
    >
      <Info aria-hidden="true" />
    </button>
    <p id={summaryId} className="sr-only">{module.accessibleSummary}</p>
    <dialog
      ref={dialogRef}
      className="historical-map__dialog"
      aria-labelledby={dialogTitleId}
      aria-describedby={dialogDescriptionId}
      onClose={() => triggerRef.current?.focus()}
      onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); closeDialog(); } }}
    >
      <div className="historical-map__dialog-header">
        <div>{module.eyebrow && <span>{module.eyebrow}</span>}<h3 id={dialogTitleId}>{module.title}</h3></div>
        <button type="button" onClick={closeDialog} aria-label="Close map information"><X aria-hidden="true" /></button>
      </div>
      <div id={dialogDescriptionId} className="historical-map__dialog-body">
        <p>{module.body}</p>
        <dl>
          <div><dt>When</dt><dd>{module.periodLabel}</dd></div>
          <div><dt>Where</dt><dd>{module.focusPlace}</dd></div>
          <div><dt>Today</dt><dd>{module.modernContext}</dd></div>
        </dl>
        {/* The authored notes say what is exact and what is approximate; the shell adds no headings of its own. */}
        <p>{module.coordinateNote}</p>
        <p>{module.uncertaintyNote}</p>
        <section className="historical-map__sources"><h4>Where the map comes from</h4><ul>{sources.map((source) => {
          const label = source.title === source.publisher || source.title.includes(source.publisher)
            ? source.title
            : `${source.publisher} — ${source.title}`;
          return <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{label}</a></li>;
        })}</ul></section>
      </div>
    </dialog>
  </figure>;
}
