import React, { createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, X } from 'lucide-react';
import type { Lesson, LessonTerm } from '../domains/contracts';
import { focusGuessGate } from './GuessBeforeReading';
import { featuredTermGroups, planLessonTerms, stripTermMarkup, termKindLabels, type LessonTermPlan } from '../domains/lessonTerms';
import './lesson-terms.css';

const HOVER_OPEN_DELAY = 350;
const HOVER_CLOSE_DELAY = 220;
const GAP = 8;
const GUTTER = 16;

type OpenTerm = { term: LessonTerm; anchor: HTMLButtonElement; mode: 'preview' | 'pinned' };
type TermsContextValue = {
  plan: LessonTermPlan;
  open?: OpenTerm;
  popoverId: string;
  toggle(term: LessonTerm, anchor: HTMLButtonElement): void;
  hoverStart(term: LessonTerm, anchor: HTMLButtonElement): void;
  hoverEnd(): void;
};

const TermsContext = createContext<TermsContextValue | null>(null);
const canHover = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && Boolean(window.matchMedia('(hover: hover)')?.matches);

/** Renders a field's text with its marked terms. Without terms it returns the text unchanged. */
export function TermText({ field, text }: { field: string; text: string }) {
  const context = useContext(TermsContext);
  const parts = context?.plan.fields.get(field);
  if (!parts) return <>{stripTermMarkup(text)}</>;
  return <>{parts.map((part, index) => part.kind === 'term' && part.highlight
    ? <TermButton key={index} term={part.term} text={part.text} />
    : <React.Fragment key={index}>{part.text}</React.Fragment>)}</>;
}

function TermButton({ term, text }: { term: LessonTerm; text: string }) {
  const context = useContext(TermsContext)!;
  const ref = useRef<HTMLButtonElement>(null);
  const expanded = context.open?.term.id === term.id && context.open.anchor === ref.current;
  return <button
    ref={ref}
    type="button"
    className="lesson-term"
    data-term-id={term.id}
    aria-expanded={expanded}
    aria-controls={expanded ? context.popoverId : undefined}
    aria-haspopup="dialog"
    onClick={(event) => context.toggle(term, event.currentTarget)}
    onPointerEnter={(event) => { if (event.pointerType === 'mouse') context.hoverStart(term, event.currentTarget); }}
    onPointerLeave={(event) => { if (event.pointerType === 'mouse') context.hoverEnd(); }}
  >{text}</button>;
}

/** Owns the single open definition box for a lesson. */
export function LessonTermsProvider({ lesson, children }: { lesson: Lesson; children: React.ReactNode }) {
  const plan = useMemo(() => planLessonTerms(lesson), [lesson]);
  const [open, setOpen] = useState<OpenTerm>();
  const popoverId = useId();
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const clearTimers = () => { window.clearTimeout(openTimer.current); window.clearTimeout(closeTimer.current); };
  useEffect(() => () => clearTimers(), []);
  useEffect(() => { setOpen(undefined); }, [lesson.id]);

  const close = useCallback((returnFocus: boolean) => {
    clearTimers();
    setOpen((current) => {
      if (returnFocus) current?.anchor.focus({ preventScroll: true });
      return undefined;
    });
  }, []);
  const toggle = useCallback((term: LessonTerm, anchor: HTMLButtonElement) => {
    clearTimers();
    setOpen((current) => current?.anchor === anchor && current.mode === 'pinned' ? undefined : { term, anchor, mode: 'pinned' });
  }, []);
  const hoverStart = useCallback((term: LessonTerm, anchor: HTMLButtonElement) => {
    if (!canHover()) return;
    clearTimers();
    openTimer.current = window.setTimeout(() => setOpen((current) => current?.mode === 'pinned' ? current : { term, anchor, mode: 'preview' }), HOVER_OPEN_DELAY);
  }, []);
  const hoverEnd = useCallback(() => {
    window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen((current) => current?.mode === 'preview' ? undefined : current), HOVER_CLOSE_DELAY);
  }, []);
  const value = useMemo(() => ({ plan, open, popoverId, toggle, hoverStart, hoverEnd }), [plan, open, popoverId, toggle, hoverStart, hoverEnd]);

  return <TermsContext.Provider value={value}>
    {children}
    {open && <TermDefinition
      key={`${open.term.id}:${open.mode}`}
      id={popoverId}
      open={open}
      onClose={close}
      onPointerEnter={() => window.clearTimeout(closeTimer.current)}
      onPointerLeave={(event) => { if (event.pointerType === 'mouse') hoverEnd(); }}
    />}
  </TermsContext.Provider>;
}

type Placement = { top: number; left: number; width: number; side: 'below' | 'above'; arrow: number; maxHeight: number };

type Viewport = { width: number; top: number; bottom: number };

/** The visible reading area, between the sticky mobile header and the mobile tab bar when they show. */
function readingViewport(): Viewport {
  const visible = (selector: string) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect && rect.height > 0 && rect.width > 0 ? rect : undefined;
  };
  const header = visible('.learn-app .mobile-progress');
  const tabs = visible('.learn-app .mobile-nav');
  const top = Math.max(GUTTER, header && header.top <= 1 ? header.bottom + GAP : GUTTER);
  const bottom = Math.min(window.innerHeight - GUTTER, tabs && tabs.bottom >= window.innerHeight - 1 ? tabs.top - GAP : window.innerHeight - GUTTER);
  return { width: window.innerWidth, top, bottom };
}

export function placeBox(anchor: Pick<DOMRect, 'top' | 'bottom' | 'left' | 'width'>, box: { height: number }, viewport: Viewport): Placement {
  const width = Math.min(340, viewport.width - GUTTER * 2);
  const left = Math.min(Math.max(anchor.left + anchor.width / 2 - width / 2, GUTTER), viewport.width - width - GUTTER);
  const below = viewport.bottom - anchor.bottom - GAP;
  const above = anchor.top - GAP - viewport.top;
  // Below the term unless it only fits above; either way the box never covers the term.
  const side = box.height <= below || below >= above ? 'below' : 'above';
  const maxHeight = Math.max(120, side === 'below' ? below : above);
  const height = Math.min(box.height, maxHeight);
  const top = side === 'below' ? anchor.bottom + GAP : anchor.top - GAP - height;
  const arrow = Math.min(Math.max(anchor.left + anchor.width / 2 - left, 18), width - 18);
  return { top, left, width, side, arrow, maxHeight };
}

function TermDefinition({ id, open, onClose, onPointerEnter, onPointerLeave }: {
  id: string;
  open: OpenTerm;
  onClose(returnFocus: boolean): void;
  onPointerEnter(): void;
  onPointerLeave(event: React.PointerEvent): void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<Placement>();
  const labelId = `${id}-label`;
  const definitionId = `${id}-definition`;
  const { term, anchor, mode } = open;

  const position = useCallback(() => {
    const box = ref.current;
    if (!box || !anchor.isConnected) return;
    const rect = anchor.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) { onClose(false); return; }
    setPlacement(placeBox(rect, { height: box.scrollHeight }, readingViewport()));
  }, [anchor, onClose]);

  useLayoutEffect(() => { position(); }, [position]);
  const placed = Boolean(placement);
  useEffect(() => {
    // Opened by tap, click or keyboard: move focus in once the box is visible, so it is announced.
    if (placed && mode === 'pinned') ref.current?.focus({ preventScroll: true });
  }, [placed, mode]);
  useEffect(() => {
    let frame = 0;
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(position); };
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!ref.current?.contains(target) && !anchor.contains(target)) onClose(false);
    };
    window.addEventListener('scroll', schedule, { capture: true, passive: true });
    window.addEventListener('resize', schedule);
    document.addEventListener('pointerdown', outside);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule, { capture: true });
      window.removeEventListener('resize', schedule);
      document.removeEventListener('pointerdown', outside);
    };
  }, [anchor, mode, onClose, position]);
  useEffect(() => {
    // Escape closes the box from the term, the box, or anywhere else; focus returns to the term
    // unless the reader had moved on to something else.
    const key = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const active = document.activeElement;
      onClose(active === anchor || Boolean(ref.current?.contains(active)) || active === document.body);
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [anchor, onClose]);

  const container = anchor.closest('.learn-app') ?? document.body;
  const style = placement
    ? { top: placement.top, left: placement.left, width: placement.width, maxHeight: placement.maxHeight, '--term-arrow': `${placement.arrow}px` } as React.CSSProperties
    : { visibility: 'hidden' as const, top: 0, left: 0 };
  return createPortal(<div
    ref={ref}
    id={id}
    className={`term-definition term-definition--${placement?.side ?? 'below'}`}
    role="dialog"
    aria-modal="false"
    aria-labelledby={labelId}
    aria-describedby={definitionId}
    tabIndex={-1}
    style={style}
    onPointerEnter={onPointerEnter}
    onPointerLeave={onPointerLeave}
    onBlur={(event) => {
      const next = event.relatedTarget as Node | null;
      if (next && !ref.current?.contains(next) && next !== anchor) onClose(false);
    }}
  >
    <div className="term-definition__body">
    <div className="term-definition__head">
      <div><span className="term-definition__kind">{termKindLabels[term.kind]}</span><strong id={labelId}>{term.label}</strong></div>
      <button type="button" className="term-definition__close" aria-label={`Close ${term.label}`} onClick={() => onClose(true)}><X aria-hidden="true" /></button>
    </div>
    <p id={definitionId}>{term.definition}</p>
    </div>
  </div>, container);
}

/** Featured terms, grouped by kind; each jumps to the section where it matters most. */
export function KeyTermsPanel({ lesson }: { lesson: Lesson }) {
  const groups = useMemo(() => featuredTermGroups(lesson.terms), [lesson.terms]);
  const [expanded, setExpanded] = useState(() => typeof window.matchMedia !== 'function' || !window.matchMedia('(max-width: 700px)')?.matches);
  const listId = useId();
  if (!groups.length) return null;
  const jump = (term: LessonTerm) => {
    const section = document.getElementById(term.primarySectionId);
    const heading = section?.querySelector<HTMLElement>('h2');
    // The section may be waiting behind the lesson's guess before reading.
    if (!section || !heading) { focusGuessGate(); return; }
    const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)')?.matches;
    section.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  };
  return <nav className={`key-terms${expanded ? ' is-expanded' : ''}`} aria-label="People, places and words">
    <button type="button" className="key-terms__toggle" aria-expanded={expanded} aria-controls={listId} onClick={() => setExpanded((value) => !value)}>
      <span>People, places and words</span><ChevronDown aria-hidden="true" />
    </button>
    <div id={listId} className="key-terms__groups" hidden={!expanded}>
      {groups.map((group) => <div key={group.id} className="key-terms__group">
        <p className="key-terms__group-label" id={`${listId}-${group.id}`}>{group.label}</p>
        <ul aria-labelledby={`${listId}-${group.id}`}>{group.terms.map((term) => <li key={term.id}>
          <button type="button" onClick={() => jump(term)}>
            <strong>{term.label}</strong><span>{term.gloss}</span>
          </button>
        </li>)}</ul>
      </div>)}
    </div>
  </nav>;
}
