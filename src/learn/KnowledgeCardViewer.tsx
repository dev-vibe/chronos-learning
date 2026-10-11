import React, { useEffect, useRef } from 'react';
import { ArrowRight, X } from 'lucide-react';
import type { KnowledgeCard } from '../domains/contracts';
import { InteractiveKnowledgeCard } from './InteractiveKnowledgeCard';

/**
 * Pick up a card you already own, right where you found it — no collection page.
 * Closing returns focus to whatever opened it.
 */
export function KnowledgeCardViewer({ card, onClose }: { card: KnowledgeCard; onClose(): void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    return () => previous?.focus?.({ preventScroll: true });
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
    if (event.key !== 'Tab') return;
    const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]') ?? []).filter((element) => !element.closest('[inert]'));
    if (controls.length === 0) return;
    const index = controls.indexOf(document.activeElement as HTMLElement);
    const next = event.shiftKey ? (index <= 0 ? controls.length - 1 : index - 1) : (index === controls.length - 1 ? 0 : index + 1);
    event.preventDefault();
    controls[next].focus();
  };

  return <div className="kc-viewer-backdrop" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={dialogRef} className="kc-viewer" role="dialog" aria-modal="true" aria-label={card.title} onKeyDown={onKeyDown}>
      <button ref={closeRef} type="button" className="kc-viewer-close" onClick={onClose} aria-label="Close card"><X aria-hidden="true" /></button>
      <InteractiveKnowledgeCard card={card} />
      <div className="kc-viewer-copy"><h2>{card.revealTitle}</h2><p>{card.revealBody}</p><a href={`/learn/${card.unlockLessonId}`}>Revisit the lesson <ArrowRight aria-hidden="true" /></a></div>
    </div>
  </div>;
}
