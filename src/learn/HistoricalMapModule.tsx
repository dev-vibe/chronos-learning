import { Info, X } from 'lucide-react';
import { useRef } from 'react';
import type { HistoricalMapModule as HistoricalMapData, MediaAsset, Source } from '../domains/contracts';
import { ResponsiveMedia } from './ResponsiveMedia';

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
        <div><span>{module.eyebrow}</span><h3 id={dialogTitleId}>{module.title}</h3></div>
        <button type="button" onClick={closeDialog} aria-label="Close map information"><X aria-hidden="true" /></button>
      </div>
      <div id={dialogDescriptionId} className="historical-map__dialog-body">
        <p>{module.body}</p>
        <dl>
          <div><dt>Period</dt><dd>{module.periodLabel}</dd></div>
          <div><dt>Focus</dt><dd>{module.focusPlace}</dd></div>
          <div><dt>Today</dt><dd>{module.modernContext}</dd></div>
        </dl>
        <section><h4>Coordinate-verified city locations</h4><p>{module.coordinateNote}</p></section>
        <section><h4>Approximate ancient landscape</h4><p>{module.uncertaintyNote}</p></section>
        <section className="historical-map__sources"><h4>Geographic references</h4><ul>{sources.map((source) => {
          const label = source.title === source.publisher || source.title.includes(source.publisher)
            ? source.title
            : `${source.publisher} — ${source.title}`;
          return <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{label}</a></li>;
        })}</ul></section>
      </div>
    </dialog>
  </figure>;
}
