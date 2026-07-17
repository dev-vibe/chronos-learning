import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Archive, BookOpen, Check, ChevronRight, Compass, Landmark, Menu, Moon, RotateCcw, Sun, X } from 'lucide-react';
import { urukContent } from '../../content/uruk';
import type { LessonModule, LessonSection } from '../domains/contracts';
import { resolveMediaAsset } from '../media/resolve';
import { HistoricalMapModule } from './HistoricalMapModule';
import { ResponsiveMedia } from './ResponsiveMedia';
import { completionKey, createProgressGateway, LocalPreviewGateway, type LearnProgressGateway, type LearnState } from './progress';
import './learn.css';

const lesson = urukContent.lessons.find((item) => item.id === 'lesson.uruk.first-city')!;
const journey = urukContent.journeys[0];
const promptById = new Map(urukContent.prompts.map((item) => [item.id, item]));
const mediaById = new Map(urukContent.media.map((item) => [item.id, item]));
const card = urukContent.cards[0];
const reconstruction = mediaById.get('media.uruk.reconstruction')!;

type JourneyRailProps = { open: boolean; onClose(): void; onNavigate(id: string): void; explored: string[]; currentSectionId?: string; returnFocus: React.RefObject<HTMLButtonElement | null> };

function JourneyRail({ open, onClose, onNavigate, explored, currentSectionId, returnFocus }: JourneyRailProps) {
  const railRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); returnFocus.current?.focus(); return; }
      if (event.key !== 'Tab' || !railRef.current) return;
      const focusable = [...railRef.current.querySelectorAll<HTMLElement>('button,[href],[tabindex]:not([tabindex="-1"])')];
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose, returnFocus]);
  const entries = journey.chapters[0].entries.map((entry) => ({ entry, lesson: urukContent.lessons.find((item) => item.id === entry.lessonId)! }));
  const close = () => { onClose(); returnFocus.current?.focus(); };
  return <>
    <div className={`learn-scrim ${open ? 'is-open' : ''}`} onClick={close} />
    <aside ref={railRef} className={`journey-rail ${open ? 'is-open' : ''}`} aria-label="World History journey" aria-modal={open || undefined} role={open ? 'dialog' : undefined}>
      <button ref={closeRef} className="icon-button rail-close" onClick={close} aria-label="Close journey"><X /></button>
      <div className="chronos-brand" aria-label="Chronos"><span className="brand-compass" aria-hidden="true"><b>C</b></span><span>Chronos</span></div>
      <div className="rail-heading"><p className="eyebrow">World History</p><h2>Foundations</h2><p>From settlements to recorded cities</p></div>
      <ol className="journey-list">{entries.map(({ entry, lesson: item }, index) => {
        const status = item.id === lesson.id ? 'current' : index === 0 ? 'complete' : 'upcoming';
        return <li key={entry.id} className={status}>
          <span className="journey-node">{status === 'complete' ? <Check size={14} /> : index + 1}</span>
          <div><small>{item.masthead}</small><strong>{item.title}</strong>{status === 'current' && <span>{explored.length} of {lesson.sections.length} sections explored</span>}</div>
        </li>;
      })}</ol>
      <div className="section-index-label"><span>In this lesson</span><b>{explored.length}/{lesson.sections.length}</b></div>
      <nav className="section-nav" aria-label="Lesson sections">{lesson.sections.map((section, index) => <button key={section.id} className={currentSectionId === section.id ? 'active' : ''} aria-current={currentSectionId === section.id ? 'location' : undefined} onClick={() => { onNavigate(section.id); onClose(); }}><span aria-hidden="true" className={explored.includes(section.id) ? 'done' : ''}>{explored.includes(section.id) ? <Check size={10} /> : index + 1}</span>{section.heading}</button>)}</nav>
    </aside>
  </>;
}

type ModuleProps = { module: LessonModule; state: LearnState; onAttempt(id: string, response: string): void };

function Module({ module, state, onAttempt }: ModuleProps) {
  if (module.type === 'prose') return <p className="prose-module">{module.body}</p>;
  if (module.type === 'knowledge') return <aside className="knowledge-block"><div className="module-heading"><span>{module.eyebrow}</span><h3>{module.title}</h3><p>{module.body}</p></div><dl>{module.items.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.detail}</dd></div>)}</dl></aside>;
  if (module.type === 'scene') {
    const media = mediaById.get(module.mediaId)!;
    return <details className="scene-module"><summary><span className="scene-thumb"><ResponsiveMedia media={media} alt="" sizes="96px" loading="lazy" /></span><span><small>Visual field guide</small><strong>{module.title}</strong><em>{module.body}</em></span><ChevronRight /></summary><div className="scene-details"><ResponsiveMedia media={media} alt={media.alt} sizes="(max-width: 800px) 100vw, 50vw" loading="lazy" /><ol>{module.hotspots.map((spot, index) => <li key={spot.label}><span>{index + 1}</span><div><strong>{spot.label}</strong><p>{spot.detail}</p></div></li>)}</ol></div></details>;
  }
  if (module.type === 'evidence') {
    const media = mediaById.get(module.mediaId)!;
    return <figure className="evidence-module"><div className="evidence-image"><ResponsiveMedia media={media} alt={media.alt} sizes="(max-width: 800px) 100vw, 50vw" loading="lazy" /><span>{module.artifactLabel}</span></div><figcaption><div className="evidence-type"><Archive /><span>From the evidence room</span></div><h3>{module.title}</h3><p>{module.body}</p><dl><div><dt>Depiction</dt><dd>{media.depictionLabel}</dd></div><div><dt>Review state</dt><dd>{media.reviewStatus.replaceAll('-', ' ')}</dd></div><div><dt>Source context</dt><dd>The Metropolitan Museum of Art</dd></div></dl></figcaption></figure>;
  }
  if (module.type === 'historical-map') {
    const media = mediaById.get(module.mediaId)!;
    const sources = module.sourceIds.map((sourceId) => urukContent.sources.find((source) => source.id === sourceId)!).filter(Boolean);
    return <HistoricalMapModule module={module} media={media} sources={sources} />;
  }
  const prompt = promptById.get(module.promptId)!;
  const answer = state.responses[prompt.id] ?? '';
  if (prompt.kind === 'supported-selection') return <fieldset className="prompt"><legend>{prompt.question}</legend>{['A reconstruction painting of the city', 'Administrative tablets and cylinder seals', 'A later story about Uruk’s walls'].map((choice) => <label key={choice}><input type="radio" name={prompt.id} checked={answer === choice} onChange={() => onAttempt(prompt.id, choice)} /><span>{choice}</span></label>)}{answer && <p className="feedback" role="status"><strong>Good investigation.</strong> {prompt.explanation}</p>}</fieldset>;
  return <div className="prompt"><label htmlFor={prompt.id}><strong>{prompt.question}</strong></label><textarea id={prompt.id} defaultValue={answer} minLength={prompt.minimumResponseLength} placeholder="Use an example from the lesson…" onBlur={(event) => event.currentTarget.value.trim().length >= (prompt.minimumResponseLength ?? 1) && onAttempt(prompt.id, event.currentTarget.value.trim())} />{answer && <p className="feedback" role="status"><strong>Your explanation is recorded.</strong> {prompt.explanation}</p>}<small>Write at least {prompt.minimumResponseLength} characters. Thoughtful attempts count; this is not scored.</small></div>;
}

function Section({ section, state, onAttempt }: { section: LessonSection; state: LearnState; onAttempt(id: string, response: string): void }) {
  const hasHistoricalMap = section.modules.some((module) => module.type === 'historical-map');
  return <section id={section.id} className={`lesson-section section-${section.modules[0].type}${hasHistoricalMap ? ' section-has-historical-map' : ''}`} data-section-id={section.id} tabIndex={-1}><header className="section-heading"><span>{section.purpose}</span><h2>{section.heading}</h2></header><div className="section-modules">{section.modules.map((module) => <React.Fragment key={module.id}><Module module={module} state={state} onAttempt={onAttempt} /></React.Fragment>)}</div></section>;
}

function KnowledgeCard() {
  const media = mediaById.get(card.mediaId)!;
  return <div className="card-reveal"><div className="knowledge-card"><div className="card-frame"><div className="card-image"><ResponsiveMedia media={media} alt="Uruk reconstruction used for the Uruk Knowledge Card" sizes="320px" loading="lazy" /><span>Evidence-based reconstruction</span></div><div className="card-body"><span className="card-class"><Landmark /> {card.category} · {card.cardClass}</span><span className="card-kind">Knowledge Card · Place</span><h3>{card.title}</h3><p className="card-date">{card.date.display} · Southern Mesopotamia</p><p>{card.significance}</p><div className="card-ornament" aria-hidden="true"><i /><Compass /><i /></div></div></div></div><div className="card-copy"><p className="eyebrow">Knowledge Card acquired</p><h3>A place worth remembering</h3><p>You earned Uruk by using evidence to explain how early city life changed human coordination.</p><ul>{card.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul></div></div>;
}

export function LearnApp({ lessonId, gatewayFactory = createProgressGateway }: { lessonId: string; gatewayFactory?: () => Promise<LearnProgressGateway> }) {
  const [state, setState] = useState<LearnState | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [nextNotice, setNextNotice] = useState(false);
  const [heroState, setHeroState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const reconstructionMedia = resolveMediaAsset(reconstruction);
  const [heroSource, setHeroSource] = useState(reconstructionMedia.src);
  const observed = useRef(new Set<string>());
  const gatewayRef = useRef<LearnProgressGateway>(new LocalPreviewGateway());
  const menuRef = useRef<HTMLButtonElement>(null);
  const valid = lessonId === lesson.id;
  const retryLoad = useCallback(() => { setState(null); setError(''); setLoadAttempt((value) => value + 1); }, []);
  useEffect(() => { if (!valid) return; let active = true; gatewayFactory().then((selected) => { if (!active) return null; gatewayRef.current = selected; return selected.load(lessonId); }).then((loaded) => { if (active && loaded) setState(loaded); }).catch(() => { if (active) setError('Progress could not be loaded. Check your connection and retry.'); }); return () => { active = false; }; }, [lessonId, valid, loadAttempt, gatewayFactory]);
  useEffect(() => { if (!state) return; let active = true; const timers = new Set<number>(); const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting && entry.intersectionRatio >= .55) { const id = (entry.target as HTMLElement).dataset.sectionId!; if (!observed.current.has(id)) { observed.current.add(id); const timer = window.setTimeout(() => gatewayRef.current.markSection(lessonId, id).then((next) => { if (active) setState(next); }).catch(() => { if (active) setError('Section progress could not be saved. Your lesson remains open.'); }), 900); timers.add(timer); } } }), { threshold: [.55] }); document.querySelectorAll('[data-section-id]').forEach((node) => observer.observe(node)); return () => { active = false; observer.disconnect(); timers.forEach(window.clearTimeout); }; }, [lessonId, Boolean(state)]);
  const navigate = (id: string) => { const target = document.getElementById(id); if (!target) return; target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); target.focus({ preventScroll: true }); };
  const ready = useMemo(() => state && lesson.promptIds.every((id) => state.attemptedPromptIds.includes(id)), [state]);
  if (!valid) return <main className="not-found"><BookOpen /><p className="eyebrow">Lesson not found</p><h1>This archive entry isn’t available.</h1><p>Try the published Uruk lesson or return to the legacy timeline.</p><a className="primary" href="/learn/lesson.uruk.first-city">Open Uruk</a><a href="/">Return to Chronos</a></main>;
  if (!state) return error ? <main className="loading-error" role="alert"><BookOpen /><h1>We couldn’t open your progress.</h1><p>{error}</p><button className="primary" onClick={retryLoad}>Retry loading progress</button></main> : <main className="loading" aria-busy="true">Opening the Uruk archive…</main>;
  const attempt = async (id: string, response: string) => setState(await gatewayRef.current.saveAttempt(lessonId, id, response));
  const complete = async () => { setBusy(true); setError(''); try { const result = await gatewayRef.current.complete(lessonId, completionKey(lessonId)); setState(await gatewayRef.current.load(lessonId)); if (!result.cardId) setError('Completion was saved, but no Knowledge Card is configured.'); } catch { setError('The completion command was interrupted. Your attempts are safe; please retry.'); } finally { setBusy(false); } };
  return <div className="learn-app" data-theme={theme}>
    <JourneyRail open={drawer} onClose={() => setDrawer(false)} onNavigate={navigate} explored={state.exploredSectionIds} currentSectionId={state.resumeSectionId ?? lesson.sections[0].id} returnFocus={menuRef} />
    <header className="mobile-progress"><button ref={menuRef} className="icon-button" onClick={() => setDrawer(true)} aria-label="Open journey"><Menu /></button><div><strong>Uruk</strong><span>{state.exploredSectionIds.length} of {lesson.sections.length} sections explored</span></div><button className="icon-button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={`Use ${theme === 'light' ? 'dark' : 'light'} theme`}>{theme === 'light' ? <Moon /> : <Sun />}</button></header>
    <main className="lesson"><div className="lesson-toolbar"><button className="quiet drawer-button" onClick={() => setDrawer(true)}><Menu /> Journey</button><span>World History <ChevronRight /> Foundations <ChevronRight /> Uruk</span><button className="quiet theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={`Use ${theme === 'light' ? 'dark' : 'light'} theme`}>{theme === 'light' ? <Moon /> : <Sun />}<span>{theme === 'light' ? 'Dark' : 'Light'} mode</span></button></div>
      {state.resumeSectionId && state.resumeSectionId !== lesson.sections[0].id && state.status !== 'completed' && <div className="resume-banner"><div><strong>Welcome back</strong><span>Resume from {lesson.sections.find((item) => item.id === state.resumeSectionId)?.heading}.</span></div><button className="secondary" onClick={() => navigate(state.resumeSectionId!)}>Resume</button></div>}
      <article><header className="masthead"><div className="masthead-copy"><p className="eyebrow">c. 3200 BCE <span>·</span> Southern Mesopotamia</p><h1>{lesson.title}</h1><p className="dek">{lesson.significance}</p></div><figure className="hero" data-image-state={heroState}><div className="hero-image"><img className="hero-media" src={heroSource} srcSet={heroSource === reconstructionMedia.fallbackSrc ? undefined : reconstructionMedia.srcSet} sizes="(max-width: 800px) 100vw, 60vw" alt={reconstruction.alt} width={reconstructionMedia.width} height={reconstructionMedia.height} onLoad={(event) => setHeroState(event.currentTarget.naturalWidth > 0 && event.currentTarget.naturalHeight > 0 ? 'ready' : 'failed')} onError={() => { if (heroSource !== reconstructionMedia.fallbackSrc) { setHeroSource(reconstructionMedia.fallbackSrc); return; } setHeroState('failed'); }} /><span className="depiction-label">Evidence-based reconstruction</span>{heroState === 'failed' && <div className="hero-fallback" role="alert">The reconstruction could not be displayed. The lesson remains available below.</div>}</div><figcaption><span>{reconstruction.depictionLabel}</span><span>Interpretation informed by evidence—not a surviving view of Uruk.</span></figcaption></figure></header>
        {lesson.sections.map((section) => <React.Fragment key={section.id}><Section section={section} state={state} onAttempt={attempt} /></React.Fragment>)}
        <section className="completion-panel" aria-labelledby="completion-title"><p className="eyebrow">Your next step</p><h2 id="completion-title">{state.status === 'completed' ? 'Lesson explored' : 'Complete your Uruk lesson'}</h2>{state.status === 'completed' ? <><KnowledgeCard /><div className="actions"><button className="primary" onClick={() => setNextNotice(true)}>Preview Early Writing Systems <ChevronRight /></button><button className="secondary" onClick={() => navigate('section.uruk.masthead')}><RotateCcw /> Revisit lesson</button><button className="quiet" onClick={() => document.querySelector('.card-reveal')?.scrollIntoView()}>Inspect Uruk card</button></div>{nextNotice && <p className="next-notice" role="status"><strong>Early Writing Systems is next.</strong> That lesson is not published yet; your place in World History is saved.</p>}</> : <><p>Both understanding prompts need a sincere attempt. Scrolling alone never completes a lesson.</p><button className="primary" disabled={!ready || busy} onClick={complete}>{busy ? 'Completing…' : ready ? 'Complete lesson' : `${state.attemptedPromptIds.length} of 2 prompts attempted`}</button></>}{error && <p className="error" role="alert">{error} <button onClick={complete}>Retry</button></p>}</section>
      </article>
    </main>
  </div>;
}
