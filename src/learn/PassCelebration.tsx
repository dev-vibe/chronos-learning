import React, { useEffect, useRef, useState } from 'react';
import { PartyPopper, Sparkles } from 'lucide-react';
import { chronosContent } from '../../content/chronos';
import type { KnowledgeCard } from '../domains/contracts';
import { KnowledgeCardFace } from './KnowledgeCardReveal';
import type { LearnProgressGateway, PassNotice } from './progress';
import './pass-celebration.css';

const lessonById = new Map(chronosContent.lessons.map((item) => [item.id, item]));
const cardById = new Map(chronosContent.cards.map((item) => [item.id, item]));

/**
 * Pass `passes` when the page already loaded the inbox; otherwise it loads it.
 *
 * The first time a learner opens Chronos after a parent passes a lesson, this
 * interrupts with a celebration and the cards they earned. Acknowledging it is
 * stored on the server, so it appears once across devices.
 */
export function PassCelebration({ gateway, passes, onAcknowledged }: { gateway?: LearnProgressGateway; passes?: PassNotice[]; onAcknowledged?(lessonId: string): void }) {
  const [queue, setQueue] = useState<PassNotice[]>([]);
  const [busy, setBusy] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (passes) { setQueue(passes.filter((notice) => lessonById.has(notice.lessonId))); return; }
    if (!gateway) return;
    let active = true;
    gateway.loadInbox().then((inbox) => { if (active) setQueue(inbox.passes.filter((notice) => lessonById.has(notice.lessonId))); }).catch(() => undefined);
    return () => { active = false; };
  }, [gateway, passes]);

  const current = queue[0];
  useEffect(() => {
    if (!current) return;
    const previous = document.activeElement as HTMLElement | null;
    buttonRef.current?.focus();
    return () => previous?.focus?.();
  }, [current?.lessonId]);

  if (!current || !gateway) return null;
  const lesson = lessonById.get(current.lessonId)!;
  const cards = current.cardIds.map((id) => cardById.get(id)).filter((card): card is KnowledgeCard => Boolean(card));
  const acknowledge = async () => {
    setBusy(true);
    try {
      await gateway.acknowledgePass(current.lessonId);
      onAcknowledged?.(current.lessonId);
    } catch {
      // If saving fails, it shows again next time; never trap the learner here.
    } finally {
      setBusy(false);
      setQueue((items) => items.slice(1));
    }
  };
  const keepFocusInside = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') { event.preventDefault(); void acknowledge(); }
    if (event.key === 'Tab') { event.preventDefault(); buttonRef.current?.focus(); }
  };

  return <div className="pass-celebration-backdrop">
    <div ref={dialogRef} className="pass-celebration" role="dialog" aria-modal="true" aria-labelledby="pass-celebration-title" aria-describedby="pass-celebration-body" onKeyDown={keepFocusInside}>
      <div className="pass-celebration-burst" aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <i key={index} style={{ '--i': index } as React.CSSProperties} />)}</div>
      <p className="pass-celebration-eyebrow"><PartyPopper aria-hidden="true" /> Passed!</p>
      <h2 id="pass-celebration-title">{lesson.title}</h2>
      <p id="pass-celebration-body">{cards.length === 0 ? 'Your parent read your answers and passed this lesson.' : cards.length === 1 ? 'Your parent read your answers and passed this lesson. You earned a new Knowledge Card!' : `Your parent read your answers and passed this lesson. You earned ${cards.length} new Knowledge Cards!`}</p>
      {current.feedback && <blockquote className="pass-celebration-note">“{current.feedback}”</blockquote>}
      {cards.length > 0 && <div className="pass-celebration-cards">{cards.map((card) => <div key={card.id} className="pass-celebration-card"><KnowledgeCardFace card={card} /></div>)}</div>}
      <button ref={buttonRef} className="primary pass-celebration-button" disabled={busy} onClick={acknowledge}><Sparkles aria-hidden="true" /> {cards.length ? (cards.length === 1 ? 'Add it to my collection' : 'Add them to my collection') : 'Awesome!'}</button>
      {queue.length > 1 && <p className="pass-celebration-more">{queue.length - 1} more {queue.length - 1 === 1 ? 'lesson was' : 'lessons were'} passed too.</p>}
    </div>
  </div>;
}
