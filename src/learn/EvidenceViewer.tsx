import { useId, useRef, useState, type ReactNode } from 'react';
import { Expand, X } from 'lucide-react';
import type { MediaAsset } from '../domains/contracts';
import { ResponsiveMedia } from './ResponsiveMedia';

type Props = { media: MediaAsset; title: string; summary?: string; children?: ReactNode; className?: string };

/** Native modal keeps background content inert and restores the originating control. */
export function EvidenceViewer({ media, title, summary, children, className = '' }: Props) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [opened, setOpened] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const close = () => {
    if (typeof dialog.current?.close === 'function') dialog.current.close();
    else dialog.current?.removeAttribute('open');
    setOpened(false);
    trigger.current?.focus({ preventScroll: true });
  };
  const open = () => {
    setOpened(true);
    setZoomed(false);
    if (typeof dialog.current?.showModal === 'function') dialog.current.showModal();
    else dialog.current?.setAttribute('open', '');
    dialog.current?.querySelector<HTMLButtonElement>('button')?.focus();
  };
  return <>
    <button ref={trigger} type="button" className={`evidence-enlarge ${className}`} onClick={open} aria-haspopup="dialog" aria-label={`Enlarge ${title}`}><Expand aria-hidden="true" /><span>Enlarge</span></button>
    <dialog ref={dialog} className="evidence-viewer" aria-labelledby={`${id}-title`} aria-describedby={`${id}-summary`} onClose={() => { setOpened(false); trigger.current?.focus({ preventScroll: true }); }} onCancel={(event) => { event.preventDefault(); close(); }} onKeyDown={(event) => {
      if (event.key === 'Escape') { event.preventDefault(); close(); }
      if (event.key === 'Tab') {
        const controls = Array.from(dialog.current?.querySelectorAll<HTMLElement>('button, a[href], summary, [tabindex="0"]') ?? []);
        const first = controls[0]; const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }}>
      <header><h3 id={`${id}-title`}>{title}</h3><button type="button" className="icon-button" onClick={close} aria-label="Close enlarged image"><X aria-hidden="true" /></button></header>
      {opened && <div className="evidence-viewer__body">
        <button type="button" className="secondary" aria-pressed={zoomed} onClick={() => setZoomed(!zoomed)}>{zoomed ? 'Fit image' : 'Show more detail'}</button>
        <div className="evidence-viewer__canvas" tabIndex={0} role="region" aria-label="Image detail; scroll to explore when enlarged">
          <ResponsiveMedia media={media} alt={media.alt} sizes={zoomed ? '180vw' : '100vw'} className={zoomed ? 'is-zoomed' : ''} />
        </div>
        <p id={`${id}-summary`}>{summary ?? media.alt}</p>
        <p className="evidence-viewer__depiction">{media.depictionLabel}</p>
        {children}
      </div>}
    </dialog>
  </>;
}
