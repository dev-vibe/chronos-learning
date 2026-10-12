import React, { useRef, useState } from 'react';
import { Eye, RotateCw } from 'lucide-react';
import { chronosContent } from '../../content/chronos';
import type { KnowledgeCard } from '../domains/contracts';
import { knowledgeCardTypeLabel } from '../domains/knowledgeCards';
import { angleForDrag, isTap, recentVelocity, settleHalfTurns, showsBack, tiltFor, type VelocitySample } from './cardMotion';
import { KnowledgeCardFace } from './KnowledgeCardFace';
import './card-interactive.css';

const mediaById = new Map(chronosContent.media.map((item) => [item.id, item]));

/** Pressing these never starts a spin or a flip; they do their own job. */
const OWN_CONTROLS = 'button, a, summary, input, textarea, select';

type Gesture = { pointerId: number; startX: number; startY: number; startAngle: number; startHalfTurns: number; samples: VelocitySample[]; spun: boolean };

/**
 * The back of a Knowledge Card: a place to practice remembering, and an honest
 * note about the picture on the front (evidence vs. reconstruction).
 */
export function KnowledgeCardBack({ card }: { card: KnowledgeCard }) {
  const [recalled, setRecalled] = useState(false);
  const media = mediaById.get(card.mediaId);
  const hasPrompt = Boolean(card.recallPrompt);
  const showFacts = !hasPrompt || recalled;
  return <div className="knowledge-card knowledge-card-back"><div className="card-frame"><div className="card-inner">
    <div className="card-name"><h3>{hasPrompt ? 'Try remembering' : 'Remember this'}</h3></div>
    <div className="card-back-body">
      {hasPrompt && !recalled && <p className="card-back-prompt">{card.recallPrompt}</p>}
      {hasPrompt && !recalled && <button type="button" className="card-back-reveal" onClick={() => setRecalled(true)}><Eye aria-hidden="true" /> Show what to remember</button>}
      {showFacts && <ul className="card-back-facts" aria-label={`What to remember about ${card.title}`}>{card.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>}
    </div>
    <div className="card-back-picture"><p className="card-back-label">About the picture</p><p><strong>{card.depictionLabel}</strong>{media ? ` · ${media.rightsLabel}` : ''}</p></div>
    <p className="card-type"><span className="card-class">{knowledgeCardTypeLabel(card.category)}</span><span className="card-date">{card.date.display}</span></p>
  </div></div></div>;
}

/**
 * A Knowledge Card you can handle: it leans toward your pointer with a soft sheen,
 * spins when you drag it sideways (and settles with a little weight), and turns
 * over on tap to reveal a recall prompt. A real button does the same for keyboard
 * and screen-reader users. With reduced motion it simply swaps faces.
 */
export function InteractiveKnowledgeCard({ card }: { card: KnowledgeCard }) {
  const [halfTurns, setHalfTurns] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const flipped = showsBack(halfTurns);
  const hasPrompt = Boolean(card.recallPrompt);

  const prefersReducedMotion = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stageWidth = () => stageRef.current?.getBoundingClientRect().width || 1;

  const lean = (clientX: number, clientY: number) => {
    const stage = stageRef.current; const tilt = tiltRef.current;
    if (!stage || !tilt) return;
    const rect = stage.getBoundingClientRect();
    const t = tiltFor((clientX - rect.left) / Math.max(rect.width, 1), (clientY - rect.top) / Math.max(rect.height, 1));
    tilt.style.setProperty('--kc-rx', `${t.rotateX}deg`);
    tilt.style.setProperty('--kc-ry', `${t.rotateY}deg`);
    tilt.style.setProperty('--kc-gx', `${t.glareX}%`);
    tilt.style.setProperty('--kc-gy', `${t.glareY}%`);
    tilt.dataset.active = 'true';
  };
  const level = () => {
    const tilt = tiltRef.current;
    if (!tilt) return;
    for (const name of ['--kc-rx', '--kc-ry', '--kc-gx', '--kc-gy']) tilt.style.removeProperty(name);
    delete tilt.dataset.active;
  };
  const setSpin = (angle: number) => spinRef.current?.style.setProperty('--kc-spin', `${angle}deg`);

  const onPointerMove = (event: React.PointerEvent) => {
    const g = gesture.current;
    if (!g || g.pointerId !== event.pointerId) {
      if (event.pointerType !== 'touch' && !prefersReducedMotion()) lean(event.clientX, event.clientY);
      return;
    }
    const dx = event.clientX - g.startX; const dy = event.clientY - g.startY;
    g.samples = [...g.samples.slice(-5), { x: event.clientX, t: event.timeStamp }];
    if (!g.spun && isTap(dx, dy)) return;
    if (prefersReducedMotion()) return;
    g.spun = true;
    spinRef.current?.setAttribute('data-dragging', 'true');
    setSpin(angleForDrag(g.startAngle, dx, stageWidth()));
  };

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if ((event.target as Element).closest(OWN_CONTROLS)) return;
    stageRef.current?.setPointerCapture?.(event.pointerId);
    gesture.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, startAngle: halfTurns * 180, startHalfTurns: halfTurns, samples: [{ x: event.clientX, t: event.timeStamp }], spun: false };
    tiltRef.current?.setAttribute('data-pressed', 'true');
  };

  const release = (event: React.PointerEvent, cancelled: boolean) => {
    const g = gesture.current;
    if (!g || g.pointerId !== event.pointerId) return;
    gesture.current = null;
    tiltRef.current?.removeAttribute('data-pressed');
    if (event.pointerType === 'touch') level();
    spinRef.current?.removeAttribute('data-dragging');
    if (!g.spun) {
      if (!cancelled && isTap(event.clientX - g.startX, event.clientY - g.startY)) setHalfTurns(g.startHalfTurns + 1);
      return;
    }
    const width = stageWidth();
    const angle = angleForDrag(g.startAngle, event.clientX - g.startX, width);
    const velocity = (recentVelocity(g.samples) * 180) / width;
    const target = settleHalfTurns(angle, cancelled ? 0 : velocity, g.startHalfTurns);
    setSpin(target * 180);
    setHalfTurns(target);
  };

  return <div className="kc-scene" data-flipped={flipped || undefined}>
    <div
      ref={stageRef}
      className="kc-stage"
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={(event) => release(event, false)}
      onPointerCancel={(event) => release(event, true)}
      onPointerLeave={() => { if (!gesture.current) level(); }}
    >
      <div ref={tiltRef} className="kc-tilt">
        <div ref={spinRef} className="kc-spin" style={{ '--kc-spin': `${halfTurns * 180}deg` } as React.CSSProperties}>
          <div className="kc-side kc-front" aria-hidden={flipped || undefined} inert={flipped}><KnowledgeCardFace card={card} /></div>
          <div className="kc-side kc-back" aria-hidden={!flipped || undefined} inert={!flipped}><KnowledgeCardBack card={card} /></div>
        </div>
        <span className="kc-sheen" aria-hidden="true" />
      </div>
    </div>
    <button type="button" className="kc-turn" aria-pressed={flipped} onClick={() => setHalfTurns((turns) => turns + 1)}>
      <RotateCw aria-hidden="true" />
      <span>{flipped ? 'Turn card back over' : hasPrompt ? 'Turn over to try remembering' : 'Turn card over'}</span>
    </button>
  </div>;
}
