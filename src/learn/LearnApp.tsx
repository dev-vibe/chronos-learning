import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Check, ChevronRight, Menu, Moon, RotateCcw, Sun, X } from 'lucide-react';
import { urukContent } from '../../content/uruk';
import type { LessonModule, LessonSection } from '../domains/contracts';
import { completionKey, createProgressGateway, LocalPreviewGateway, type LearnProgressGateway, type LearnState } from './progress';
import './learn.css';

const lesson = urukContent.lessons.find((item) => item.id === 'lesson.uruk.first-city')!;
const journey = urukContent.journeys[0];
const promptById = new Map(urukContent.prompts.map((item) => [item.id, item]));
const mediaById = new Map(urukContent.media.map((item) => [item.id, item]));
const card = urukContent.cards[0];

function JourneyRail({ open, onClose, onNavigate, explored, returnFocus }: { open: boolean; onClose(): void; onNavigate(id: string): void; explored: string[]; returnFocus: React.RefObject<HTMLButtonElement | null> }) {
  const railRef = useRef<HTMLElement>(null); const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (!open) return; closeRef.current?.focus(); const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); onClose(); returnFocus.current?.focus(); return; } if (event.key === 'Tab' && railRef.current) { const focusable = [...railRef.current.querySelectorAll<HTMLElement>('button,[href],[tabindex]:not([tabindex="-1"])')]; const first = focusable[0], last = focusable[focusable.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); } } }; document.addEventListener('keydown', onKey); return () => document.removeEventListener('keydown', onKey); }, [open, onClose, returnFocus]);
  const entries = journey.chapters[0].entries.map((entry) => ({ entry, lesson: urukContent.lessons.find((item) => item.id === entry.lessonId)! }));
  const close = () => { onClose(); returnFocus.current?.focus(); };
  return <><div className={`learn-scrim ${open ? 'is-open' : ''}`} onClick={close} /><aside ref={railRef} className={`journey-rail ${open ? 'is-open' : ''}`} aria-label="World History journey" aria-modal={open || undefined} role={open ? 'dialog' : undefined}>
    <button ref={closeRef} className="icon-button rail-close" onClick={close} aria-label="Close journey"><X /></button>
    <div className="chronos-mark" aria-label="Chronos">C<span>◷</span></div><p className="eyebrow">World History</p><h2>Foundations</h2>
    <ol className="journey-list">{entries.map(({ entry, lesson: item }, index) => <li key={entry.id} className={item.id === lesson.id ? 'current' : ''}>
      <span className="journey-node">{item.id === lesson.id ? index + 1 : index === 0 ? <Check size={14} /> : index + 1}</span>
      <div><small>{item.masthead}</small><strong>{item.title}</strong>{item.id === lesson.id && <span>{explored.length} of 8 sections explored</span>}</div>
    </li>)}</ol>
    <nav className="section-nav" aria-label="Lesson sections">{lesson.sections.map((section) => <button key={section.id} onClick={() => { onNavigate(section.id); onClose(); }}><span className={explored.includes(section.id) ? 'done' : ''} />{section.heading}</button>)}</nav>
  </aside></>;
}

const Module: React.FC<{ module: LessonModule; state: LearnState; onAttempt(id: string, response: string): void }> = ({ module, state, onAttempt }) => {
  if (module.type === 'prose' || module.type === 'connection') return <p>{module.body}</p>;
  if (module.type === 'evidence') {
    const media = mediaById.get(module.mediaId)!;
    return <figure className="evidence-figure"><div className="media-wrap"><img src={media.path} alt={media.alt} /><span className="depiction-label">Reconstruction</span></div><figcaption><strong>{media.depictionLabel}</strong><span>{module.body}</span><span>Source context: The Metropolitan Museum of Art · Editorial state: provenance review required</span></figcaption></figure>;
  }
  const prompt = promptById.get(module.promptId)!;
  const answer = state.responses[prompt.id] ?? '';
  if (prompt.kind === 'supported-selection') return <fieldset className="prompt"><legend>{prompt.question}</legend>{['A reconstruction painting of the city', 'Administrative tablets and cylinder seals', 'A later story about Uruk’s walls'].map((choice) => <label key={choice}><input type="radio" name={prompt.id} checked={answer === choice} onChange={() => onAttempt(prompt.id, choice)} /> <span>{choice}</span></label>)}{answer && <p className="feedback" role="status"><strong>Good investigation.</strong> {prompt.explanation}</p>}</fieldset>;
  return <div className="prompt"><label htmlFor={prompt.id}><strong>{prompt.question}</strong></label><textarea id={prompt.id} defaultValue={answer} minLength={prompt.minimumResponseLength} placeholder="Use an example from the lesson…" onBlur={(event) => event.currentTarget.value.trim().length >= (prompt.minimumResponseLength ?? 1) && onAttempt(prompt.id, event.currentTarget.value.trim())} />{answer && <p className="feedback" role="status"><strong>Your explanation is recorded.</strong> {prompt.explanation}</p>}<small>Write at least {prompt.minimumResponseLength} characters. Thoughtful attempts count; this is not scored.</small></div>;
}

const Section: React.FC<{ section: LessonSection; state: LearnState; onAttempt(id: string, response: string): void }> = ({ section, state, onAttempt }) => {
  return <section id={section.id} className={`lesson-section ${section.id.includes('evidence') ? 'evidence-section' : ''}`} data-section-id={section.id} tabIndex={-1}><p className="section-kicker">{section.purpose}</p><h2>{section.heading}</h2>{section.modules.map((module) => <Module key={module.id} module={module} state={state} onAttempt={onAttempt} />)}</section>;
}

export function LearnApp({ lessonId, gatewayFactory = createProgressGateway }: { lessonId: string; gatewayFactory?: () => Promise<LearnProgressGateway> }) {
  const [state, setState] = useState<LearnState | null>(null); const [drawer, setDrawer] = useState(false); const [theme, setTheme] = useState<'light'|'dark'>(() => matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const [loadAttempt, setLoadAttempt] = useState(0); const [nextNotice, setNextNotice] = useState(false); const observed = useRef(new Set<string>()); const gatewayRef = useRef<LearnProgressGateway>(new LocalPreviewGateway()); const menuRef = useRef<HTMLButtonElement>(null);
  const valid = lessonId === lesson.id;
  const retryLoad = useCallback(() => { setState(null); setError(''); setLoadAttempt((value) => value + 1); }, []);
  useEffect(() => { if (!valid) return; let active = true; gatewayFactory().then((selected) => { if (!active) return null; gatewayRef.current = selected; return selected.load(lessonId); }).then((loaded) => { if (active && loaded) setState(loaded); }).catch(() => { if (active) setError('Progress could not be loaded. Check your connection and retry.'); }); return () => { active = false; }; }, [lessonId, valid, loadAttempt, gatewayFactory]);
  useEffect(() => { if (!state) return; let active = true; const timers = new Set<number>(); const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting && entry.intersectionRatio >= .55) { const id = (entry.target as HTMLElement).dataset.sectionId!; if (!observed.current.has(id)) { observed.current.add(id); const timer = window.setTimeout(() => gatewayRef.current.markSection(lessonId, id).then((next) => { if (active) setState(next); }).catch(() => { if (active) setError('Section progress could not be saved. Your lesson remains open.'); }), 900); timers.add(timer); } } }), { threshold: [.55] }); document.querySelectorAll('[data-section-id]').forEach((node) => observer.observe(node)); return () => { active = false; observer.disconnect(); timers.forEach(window.clearTimeout); }; }, [lessonId, !!state]);
  const navigate = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  const ready = useMemo(() => state && lesson.promptIds.every((id) => state.attemptedPromptIds.includes(id)), [state]);
  if (!valid) return <main className="not-found"><BookOpen /><p className="eyebrow">Lesson not found</p><h1>This archive entry isn’t available.</h1><p>Try the published Uruk lesson or return to the legacy timeline.</p><a className="primary" href="/learn/lesson.uruk.first-city">Open Uruk</a><a href="/">Return to Chronos</a></main>;
  if (!state) return error ? <main className="loading-error" role="alert"><BookOpen /><h1>We couldn’t open your progress.</h1><p>{error}</p><button className="primary" onClick={retryLoad}>Retry loading progress</button></main> : <main className="loading" aria-busy="true">Opening the Uruk archive…</main>;
  const attempt = async (id: string, response: string) => setState(await gatewayRef.current.saveAttempt(lessonId, id, response));
  const complete = async () => { setBusy(true); setError(''); try { const result = await gatewayRef.current.complete(lessonId, completionKey(lessonId)); setState(await gatewayRef.current.load(lessonId)); if (!result.cardId) setError('Completion was saved, but no Knowledge Card is configured.'); } catch { setError('The completion command was interrupted. Your attempts are safe; please retry.'); } finally { setBusy(false); } };
  return <div className="learn-app" data-theme={theme}>
    <JourneyRail open={drawer} onClose={() => setDrawer(false)} onNavigate={navigate} explored={state.exploredSectionIds} returnFocus={menuRef} />
    <header className="mobile-progress"><button ref={menuRef} className="icon-button" onClick={() => setDrawer(true)} aria-label="Open journey"><Menu /></button><div><strong>Uruk</strong><span>{state.exploredSectionIds.length} of 8 sections explored</span></div><button className="icon-button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={`Use ${theme === 'light' ? 'dark' : 'light'} theme`}>{theme === 'light' ? <Moon /> : <Sun />}</button></header>
    <main className="lesson"><div className="lesson-toolbar"><button className="quiet drawer-button" onClick={() => setDrawer(true)}><Menu /> Journey</button><span>World History <ChevronRight /> Foundations</span><button className="icon-button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={`Use ${theme === 'light' ? 'dark' : 'light'} theme`}>{theme === 'light' ? <Moon /> : <Sun />}</button></div>
      {state.resumeSectionId && state.resumeSectionId !== lesson.sections[0].id && state.status !== 'completed' && <div className="resume-banner"><div><strong>Welcome back</strong><span>Resume from {lesson.sections.find((item) => item.id === state.resumeSectionId)?.heading}.</span></div><button className="secondary" onClick={() => navigate(state.resumeSectionId!)}>Resume</button></div>}
      <article><header className="masthead"><p className="eyebrow">c. 3200 BCE · Southern Mesopotamia</p><h1>{lesson.title}</h1><p className="dek">{lesson.significance}</p><figure className="hero"><img src={mediaById.get('media.uruk.candidate')?.path} alt={mediaById.get('media.uruk.candidate')?.alt} /><figcaption><strong>Evidence-based reconstruction</strong><span>Candidate depiction · provenance and historical review required. This is an interpretation informed by evidence, not a surviving view of Uruk.</span></figcaption></figure></header>
        {lesson.sections.map((section) => <Section key={section.id} section={section} state={state} onAttempt={attempt} />)}
        <section className="completion-panel" aria-labelledby="completion-title"><p className="eyebrow">Your next step</p><h2 id="completion-title">{state.status === 'completed' ? 'Lesson explored' : 'Complete your Uruk lesson'}</h2>{state.status === 'completed' ? <><p>Your completion is safely recorded. You can revisit any section without changing your result.</p><div className="card-reveal"><div className="card-art"><img src={mediaById.get(card.mediaId)?.path} alt="Uruk reconstruction used for the Uruk Knowledge Card" /></div><div><span>Knowledge Card · Place</span><h3>{card.title}</h3><p>{card.significance}</p><strong>Earned for completing the Uruk investigation.</strong></div></div><div className="actions"><button className="primary" onClick={() => setNextNotice(true)}>Preview Early Writing Systems <ChevronRight /></button><button className="secondary" onClick={() => navigate('section.uruk.masthead')}><RotateCcw /> Revisit lesson</button><button className="quiet" onClick={() => document.querySelector('.card-reveal')?.scrollIntoView()}>Inspect Uruk card</button></div>{nextNotice && <p className="next-notice" role="status"><strong>Early Writing Systems is next.</strong> That lesson is not published yet; your place in World History is saved.</p>}</> : <><p>Both understanding prompts need a sincere attempt. Scrolling alone never completes a lesson.</p><button className="primary" disabled={!ready || busy} onClick={complete}>{busy ? 'Completing…' : ready ? 'Complete lesson' : `${state.attemptedPromptIds.length} of 2 prompts attempted`}</button></>}{error && <p className="error" role="alert">{error} <button onClick={complete}>Retry</button></p>}</section>
      </article>
    </main>
  </div>;
}
