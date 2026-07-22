import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Archive, BookOpen, Check, ChevronLeft, ChevronRight, Compass, Home, Landmark, Library, Lock, Menu, Moon, RotateCcw, Search, Sun, X } from 'lucide-react';
import { chronosContent } from '../../content/chronos';
import type { Journey, KnowledgeCard, Lesson, LessonModule, LessonSection } from '../domains/contracts';
import { isLessonOpenable } from '../config/runtimeFlags';
import { HistoricalMapModule } from './HistoricalMapModule';
import { ResponsiveMedia } from './ResponsiveMedia';
import { completionKey, createProgressGateway, LocalPreviewGateway, type JourneyProgressSummary, type LearnProgressGateway, type LearnState } from './progress';
import { derivePromptRequirementState } from './prompt-requirements';
import { JourneySwitcher } from '../app/JourneySwitcher';
import { worldSpineRoadmap } from '../../content/world-spine/roadmap';
import { resolveWorldSpineAccess } from '../domains/journeys/worldSpine';
import { WorldSpineTimeline } from './WorldSpineTimeline';
import './learn.css';

const lessonById = new Map(chronosContent.lessons.map((item) => [item.id, item]));
const promptById = new Map(chronosContent.prompts.map((item) => [item.id, item]));
const mediaById = new Map(chronosContent.media.map((item) => [item.id, item]));
const cardById = new Map(chronosContent.cards.map((item) => [item.id, item]));
const cardByLessonId = new Map(chronosContent.cards.map((item) => [item.unlockLessonId, item]));
const sourceById = new Map(chronosContent.sources.map((item) => [item.id, item]));
const firstPublishedLessonId = chronosContent.journeys.filter((journey) => journey.status === 'published').flatMap((item) => item.chapters).sort((a, b) => a.position - b.position).flatMap((chapter) => [...chapter.entries].sort((a, b) => a.position - b.position)).map((entry) => entry.lessonId).find((id) => {
  const lesson = lessonById.get(id);
  return lesson ? isLessonOpenable(lesson) : false;
}) ?? chronosContent.lessons.find((item) => isLessonOpenable(item))?.id ?? '';

const findJourney = (lessonId: string) => chronosContent.journeys.find((item) => item.status === 'published' && item.chapters.some((chapter) => chapter.entries.some((entry) => entry.lessonId === lessonId)));
const orderedEntries = (journey: Journey) => [...journey.chapters].sort((a, b) => a.position - b.position).flatMap((chapter) => [...chapter.entries].sort((a, b) => a.position - b.position).map((entry) => ({ chapter, entry, lesson: lessonById.get(entry.lessonId) })).filter((item): item is { chapter: Journey['chapters'][number]; entry: Journey['chapters'][number]['entries'][number]; lesson: Lesson } => Boolean(item.lesson && isLessonOpenable(item.lesson))));

type JourneyRailProps = {
  open: boolean; onClose(): void; onNavigate(id: string): void; lesson: Lesson; journey: Journey;
  summaries: Record<string, JourneyProgressSummary>; currentState: LearnState; currentSectionId?: string; returnFocus: React.RefObject<HTMLButtonElement | null>;
};

function JourneyRail({ open, onClose, onNavigate, lesson, journey, summaries, currentState, currentSectionId, returnFocus }: JourneyRailProps) {
  const railRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); returnFocus.current?.focus(); return; }
      if (event.key !== 'Tab' || !railRef.current) return;
      const focusable = [...railRef.current.querySelectorAll<HTMLElement>('button,summary,[href],[tabindex]:not([tabindex="-1"])')];
      const first = focusable[0]; const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose, returnFocus]);

  const entries = orderedEntries(journey);
  const explored = currentState.exploredSectionIds;
  const close = () => { onClose(); returnFocus.current?.focus(); };
  return <>
    <div className={`learn-scrim ${open ? 'is-open' : ''}`} onClick={close} />
    <aside ref={railRef} className={`journey-rail ${open ? 'is-open' : ''}`} aria-label={journey.kind === 'world-history' ? 'World History World Spine' : journey.title + ' journey'} aria-modal={open || undefined} role={open ? 'dialog' : undefined}>
      <button ref={closeRef} className="icon-button rail-close" onClick={close} aria-label="Close journey"><X /></button>
      <div className="chronos-brand" aria-label="Chronos"><span className="brand-compass" aria-hidden="true"><b>C</b></span><span>Chronos</span></div>
      {journey.kind === 'world-history' ? <WorldSpineTimeline
        lesson={lesson}
        lessons={chronosContent.lessons}
        summaries={summaries}
        currentState={currentState}
        currentSectionId={currentSectionId}
        onNavigate={onNavigate}
        onClose={onClose}
      /> : <>
        <div className="rail-heading"><p className="eyebrow">{journey.title}</p><h2>{entries.find((item) => item.lesson.id === lesson.id)?.chapter.title}</h2><p>From settlements to recorded information</p></div>
        <ol className="journey-list">{entries.map(({ entry, lesson: item }, index) => {
          const isCurrent = item.id === lesson.id;
          const isComplete = isCurrent ? currentState.status === 'completed' : summaries[item.id]?.status === 'completed';
          const status = isCurrent ? 'current' : isComplete ? 'complete' : 'available';
          const content = <><span className="journey-node">{isComplete ? <Check size={14} /> : index + 1}</span><div><small>{item.masthead}</small><strong>{item.title}</strong>{isCurrent && <span>{explored.length} of {lesson.sections.length} sections explored</span>}</div></>;
          return <li key={entry.id} className={status}><a href={'/learn/' + item.id} aria-current={isCurrent ? 'page' : undefined} onClick={isCurrent ? (event) => { event.preventDefault(); onNavigate(lesson.sections[0].id); onClose(); } : undefined}>{content}</a></li>;
        })}</ol>
        <div className="section-index-label"><span>In this lesson</span><b>{explored.length}/{lesson.sections.length}</b></div>
        <nav className="section-nav" aria-label="Lesson sections">{lesson.sections.map((section, index) => <button key={section.id} className={currentSectionId === section.id ? 'active' : ''} aria-current={currentSectionId === section.id ? 'location' : undefined} onClick={() => { onNavigate(section.id); onClose(); }}><span aria-hidden="true" className={explored.includes(section.id) ? 'done' : ''}>{explored.includes(section.id) ? <Check size={10} /> : index + 1}</span>{section.heading}</button>)}</nav>
      </>}
    </aside>
  </>;
}

type ModuleProps = { module: LessonModule; state: LearnState; onAttempt(id: string, response: string): void };

function Module({ module, state, onAttempt }: ModuleProps) {
  if (module.type === 'prose') return <p className="prose-module">{module.body}</p>;
  if (module.type === 'knowledge') return <aside className="knowledge-block"><div className="module-heading"><span>{module.eyebrow}</span><h3>{module.title}</h3><p>{module.body}</p></div><dl data-count={module.items.length}>{module.items.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.detail}</dd></div>)}</dl></aside>;
  if (module.type === 'scene') {
    const media = mediaById.get(module.mediaId)!;
    return <details className="scene-module"><summary><span className="scene-thumb"><ResponsiveMedia media={media} alt="" sizes="96px" loading="lazy" /></span><span><small>Visual field guide</small><strong>{module.title}</strong><em>{module.body}</em></span><ChevronRight /></summary><div className="scene-details"><ResponsiveMedia media={media} alt={media.alt} sizes="(max-width: 800px) 100vw, 50vw" loading="lazy" /><ol>{module.hotspots.map((spot, index) => <li key={spot.label}><span>{index + 1}</span><div><strong>{spot.label}</strong><p>{spot.detail}</p></div></li>)}</ol></div></details>;
  }
  if (module.type === 'evidence') {
    const media = mediaById.get(module.mediaId)!;
    const source = media.sourceIds.map((id) => sourceById.get(id)).find(Boolean);
    return <figure className="evidence-module"><div className="evidence-image"><ResponsiveMedia media={media} alt={media.alt} sizes="(max-width: 800px) 100vw, 50vw" loading="lazy" /><span>{module.artifactLabel}</span></div><figcaption><div className="evidence-type"><Archive /><span>From the evidence room</span></div><h3>{module.title}</h3><p>{module.body}</p><dl><div><dt>Depiction</dt><dd>{media.depictionLabel}</dd></div><div><dt>Source</dt><dd>{source ? <a href={source.url} target='_blank' rel='noreferrer'>{source.publisher}</a> : 'Institutional source'}</dd></div>{media.reviewStatus === 'approved' ? <div><dt>Rights</dt><dd>{media.rightsLabel}</dd></div> : null}</dl></figcaption></figure>;
  }
  if (module.type === 'historical-map') {
    const media = mediaById.get(module.mediaId)!;
    return <HistoricalMapModule module={module} media={media} sources={module.sourceIds.map((id) => sourceById.get(id)!).filter(Boolean)} />;
  }
  const prompt = promptById.get(module.promptId)!;
  const answer = state.responses[prompt.id] ?? '';
  if (prompt.kind === 'supported-selection') {
    const questionId = `${prompt.id}-question`;
    return <div className="prompt" role="radiogroup" aria-labelledby={questionId}><strong id={questionId}>{prompt.question}</strong>{prompt.options.map((choice) => <label key={choice.id}><input type="radio" name={prompt.id} checked={answer === choice.id} onChange={() => onAttempt(prompt.id, choice.id)} /><span>{choice.label}</span></label>)}{answer && <p className="feedback" role="status"><strong>Compare the evidence.</strong> {prompt.explanation}</p>}</div>;
  }
  return <div className="prompt"><label htmlFor={prompt.id}><strong>{prompt.question}</strong></label><textarea id={prompt.id} defaultValue={answer} minLength={prompt.minimumResponseLength} placeholder="Use an example from the lesson…" onBlur={(event) => event.currentTarget.value.trim().length >= prompt.minimumResponseLength && onAttempt(prompt.id, event.currentTarget.value.trim())} />{answer && <p className="feedback" role="status"><strong>Your explanation is recorded.</strong> {prompt.explanation}</p>}<small>Write at least {prompt.minimumResponseLength} characters. Thoughtful attempts count; this is not scored.</small></div>;
}

function Section({ section, state, onAttempt }: { section: LessonSection; state: LearnState; onAttempt(id: string, response: string): void }) {
  const hasHistoricalMap = section.modules.some((module) => module.type === 'historical-map');
  return <section id={section.id} className={`lesson-section section-${section.modules[0].type}${hasHistoricalMap ? ' section-has-historical-map' : ''}`} data-section-id={section.id} tabIndex={-1}><header className="section-heading"><span>{section.purpose}</span><h2>{section.heading}</h2></header><div className="section-modules">{section.modules.map((module) => <React.Fragment key={module.id}><Module module={module} state={state} onAttempt={onAttempt} /></React.Fragment>)}</div></section>;
}

function KnowledgeCardReveal({ card }: { card: KnowledgeCard }) {
  const media = mediaById.get(card.mediaId)!;
  return <div className="card-reveal" tabIndex={-1}><div className="knowledge-card"><div className="card-frame"><div className={`card-image card-image-${card.category}`}><ResponsiveMedia media={media} alt={media.alt} sizes="320px" loading="lazy" /><span>{card.depictionLabel}</span></div><div className="card-body"><span className="card-class">{card.category === 'place' ? <Landmark /> : <Archive />} {card.category} · {card.cardClass}</span><span className="card-kind">Knowledge Card · {card.category}</span><h3>{card.title}</h3><p className="card-date">{card.date.display} · {card.place}</p><p>{card.significance}</p><div className="card-ornament" aria-hidden="true"><i /><Compass /><i /></div></div></div></div><div className="card-copy"><p className="eyebrow">Knowledge Card acquired</p><h3>{card.revealTitle}</h3><p>{card.revealBody}</p><ul>{card.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul></div></div>;
}

export function LearnApp({ lessonId, gatewayFactory = createProgressGateway }: { lessonId: string; gatewayFactory?: () => Promise<LearnProgressGateway> }) {
  const lesson = lessonById.get(lessonId);
  const journey = lesson ? findJourney(lesson.id) : undefined;
  const entries = journey ? orderedEntries(journey) : [];
  const currentIndex = entries.findIndex((item) => item.lesson.id === lessonId);
  const previous = entries.slice(0, currentIndex).reverse().find((item) => isLessonOpenable(item.lesson));
  const next = entries.slice(currentIndex + 1).find((item) => isLessonOpenable(item.lesson));
  const [currentProgress, setCurrentProgress] = useState<LearnState | null>(null);
  const [journeySummaries, setJourneySummaries] = useState<Record<string, JourneyProgressSummary>>({});
  const state = currentProgress?.lessonId === lessonId ? currentProgress : null;
  const [drawer, setDrawer] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [revealedCardId, setRevealedCardId] = useState<string>();
  const observed = useRef(new Set<string>());
  const gatewayRef = useRef<LearnProgressGateway>(new LocalPreviewGateway());
  const menuRef = useRef<HTMLButtonElement>(null);
  const retryLoad = useCallback(() => { setCurrentProgress(null); setJourneySummaries({}); setError(''); setLoadAttempt((value) => value + 1); }, []);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [lessonId]);

  useEffect(() => {
    if (!lesson || !isLessonOpenable(lesson) || !journey) return;
    document.title = `${lesson.title} · Chronos`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', lesson.significance);
  }, [lesson, journey]);

  useEffect(() => {
    if (!lesson || !isLessonOpenable(lesson) || !journey) return;
    let active = true;
    gatewayFactory().then(async (selected) => {
      gatewayRef.current = selected;
      const publishedIds = orderedEntries(journey).map((item) => item.lesson).filter((item) => isLessonOpenable(item)).map((item) => item.id);
      const [detailed, summaries] = await Promise.all([
        selected.load(lessonId),
        selected.loadJourneySummaries(publishedIds),
      ]);
      if (active) {
        setCurrentProgress(detailed);
        setJourneySummaries(summaries);
      }
    }).catch(() => { if (active) setError('Progress could not be loaded. Check your connection and retry.'); });
    return () => { active = false; };
  }, [lessonId, lesson, journey, loadAttempt, gatewayFactory]);

  useEffect(() => {
    if (!state) return;
    let active = true;
    const timers = new Set<number>();
    const observer = new IntersectionObserver((items) => items.forEach((item) => {
      if (item.isIntersecting) {
        const id = (item.target as HTMLElement).dataset.sectionId!;
        if (!observed.current.has(id)) {
          observed.current.add(id);
          const timer = window.setTimeout(() => gatewayRef.current.markSection(lessonId, id).then((nextState) => { if (active) setCurrentProgress(nextState); }).catch(() => { if (active) setError('Section progress could not be saved. Your lesson remains open.'); }), 900);
          timers.add(timer);
        }
      }
    }), { rootMargin: '-15% 0px -65% 0px', threshold: [0, .01] });
    document.querySelectorAll('[data-section-id]').forEach((node) => observer.observe(node));
    return () => { active = false; observer.disconnect(); timers.forEach(window.clearTimeout); };
  }, [lessonId, Boolean(state)]);

  const navigate = (id: string) => { const target = document.getElementById(id); if (!target) return; target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); target.focus({ preventScroll: true }); };
  const requirement = useMemo(() => derivePromptRequirementState(lesson?.promptIds ?? [], promptById, state?.attemptedPromptIds ?? []), [lesson, state?.attemptedPromptIds]);
  const worldSpineAccess = useMemo(() => journey?.kind === 'world-history'
    ? resolveWorldSpineAccess(worldSpineRoadmap, chronosContent.lessons, journeySummaries, lessonId)
    : { accessible: true }, [journey?.kind, journeySummaries, lessonId]);
  const worldSpineBlocker = worldSpineAccess.blockerId
    ? worldSpineRoadmap.flatMap((chapter) => chapter.nodes).find((node) => node.id === worldSpineAccess.blockerId)
    : undefined;
  const worldSpineChapter = worldSpineRoadmap.find((chapter) => chapter.nodes.some((node) => node.id === lessonId));
  const breadcrumbChapter = journey?.kind === 'world-history' ? worldSpineChapter?.title : entries[currentIndex]?.chapter.title;
  if (!lesson) return <main className="not-found"><BookOpen /><p className="eyebrow">Lesson not found</p><h1>This archive entry isn’t available.</h1><p>Check the lesson address or return to the first published World History lesson.</p><a className="primary" href={`/learn/${firstPublishedLessonId}`}>Open World History</a><a href="/">Return to Chronos</a></main>;
  if (!isLessonOpenable(lesson) || !journey) return <main className="not-found"><BookOpen /><p className="eyebrow">Lesson unavailable</p><h1>This archive entry is not available.</h1><p>The address may refer to material that has not been published for learners.</p><a className="primary" href={'/learn/' + firstPublishedLessonId}>Open World History</a><a href="/home">Return Home</a></main>;
  if (!state) return error ? <main className="loading-error" role="alert"><BookOpen /><h1>We couldn’t open your progress.</h1><p>{error}</p><button className="primary" onClick={retryLoad}>Retry loading progress</button></main> : <main className="loading" aria-busy="true">Opening {lesson.title}…</main>;
  if (!worldSpineAccess.accessible) return <main className="not-found"><Lock /><p className="eyebrow">World Spine</p><h1>This lesson is still locked.</h1><p>{worldSpineBlocker ? 'Complete ' + worldSpineBlocker.title + ' before continuing along the chronology.' : 'Complete the earlier available lessons before continuing.'}</p><a className="primary" href={'/learn/' + (worldSpineBlocker?.id ?? firstPublishedLessonId)}>Continue {worldSpineBlocker?.title ?? 'World History'}</a><a href="/home">Return Home</a></main>;

  const attempt = async (id: string, response: string) => {
    const nextState = await gatewayRef.current.saveAttempt(lessonId, id, response);
    setCurrentProgress(nextState);
  };
  const complete = async () => {
    setBusy(true); setError('');
    try {
      const result = await gatewayRef.current.complete(lessonId, completionKey(lessonId));
      const nextState = await gatewayRef.current.load(lessonId);
      setCurrentProgress(nextState);
      if (result.cardOwnership === 'newly-acquired' && result.cardId) setRevealedCardId(result.cardId);
      else setRevealedCardId(undefined);
    } catch { setError('The completion command was interrupted. Your attempts are safe; please retry.'); }
    finally { setBusy(false); }
  };

  const hero = lesson.heroMediaId ? mediaById.get(lesson.heroMediaId) : undefined;
  const configuredCard = cardByLessonId.get(lesson.id);
  const revealedCard = revealedCardId ? cardById.get(revealedCardId) : undefined;
  return <div className="learn-app" data-theme={theme}>
    <JourneyRail open={drawer} onClose={() => setDrawer(false)} onNavigate={navigate} lesson={lesson} journey={journey} summaries={journeySummaries} currentState={state} currentSectionId={state.resumeSectionId ?? lesson.sections[0].id} returnFocus={menuRef} />
    <header className="mobile-progress"><button ref={menuRef} className="icon-button" onClick={() => setDrawer(true)} aria-label="Open World Spine"><Menu /></button><div><strong>{lesson.title}</strong><span>{state.exploredSectionIds.length} of {lesson.sections.length} sections explored</span></div><a className="icon-button" href="/search" aria-label="Search Chronos"><Search /></a></header>
    <main className="lesson"><div className="lesson-toolbar"><button className="quiet drawer-button" onClick={() => setDrawer(true)}><Menu /> World Spine</button><JourneySwitcher currentJourneyId={journey.id} currentLessonId={lesson.id} /><span className="lesson-breadcrumb">{breadcrumbChapter} <ChevronRight /> {lesson.title}</span><nav className="learn-global-links" aria-label="Chronos"><a href="/home"><Home /> Home</a><a href="/library"><Library /> Library</a><a href="/search"><Search /> Search</a></nav><button className="quiet theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={'Use ' + (theme === 'light' ? 'dark' : 'light') + ' theme'}>{theme === 'light' ? <Moon /> : <Sun />}<span>{theme === 'light' ? 'Dark' : 'Light'} mode</span></button></div>
      <article><header className="masthead"><div className="masthead-copy"><p className="eyebrow">{lesson.masthead} <span>·</span> {lesson.place}</p><h1>{lesson.title}</h1><p className="dek">{lesson.significance}</p></div>{hero && <figure className="hero"><div className="hero-image"><ResponsiveMedia className={`hero-media hero-${hero.depictionMode}`} media={hero} alt={hero.alt} sizes="(max-width: 800px) 100vw, 60vw" loading="eager" decoding="async" /><span className="depiction-label">{lesson.heroLabel}</span></div><figcaption><span>{hero.depictionLabel}</span><span>{lesson.heroCaption}</span></figcaption></figure>}</header>
        {lesson.sections.map((section) => <React.Fragment key={section.id}><Section section={section} state={state} onAttempt={attempt} /></React.Fragment>)}
        <section className="completion-panel" aria-labelledby="completion-title"><p className="eyebrow">Your next step</p><h2 id="completion-title">{state.status === 'completed' ? 'Lesson explored' : `Complete ${lesson.title}`}</h2>{state.status === 'completed' ? <>{revealedCard && <KnowledgeCardReveal card={revealedCard} />}{!revealedCard && state.cardId && configuredCard && <p className="known-card" role="status"><Check size={16} /> {configuredCard.title} is already in your Knowledge Cards.</p>}<div className="actions">{next ? <a className="primary" href={`/learn/${next.lesson.id}`}>Continue World History <ChevronRight /></a> : <span className="journey-end">World History continues with the next reviewed lesson.</span>}{previous && <a className="secondary" href={`/learn/${previous.lesson.id}`}><ChevronLeft /> Previous: {previous.lesson.title}</a>}<button className="secondary" onClick={() => navigate(lesson.sections[0].id)}><RotateCcw /> Revisit lesson</button></div></> : <><p>{requirement.requiredIds.length === 1 ? 'The required understanding prompt needs' : `All ${requirement.requiredIds.length} required understanding prompts need`} a sincere attempt. Scrolling alone never completes a lesson.</p><button className="primary" disabled={!requirement.ready || busy} onClick={complete}>{busy ? 'Completing…' : requirement.ready ? 'Complete lesson' : `${requirement.attemptedCount} of ${requirement.requiredIds.length} required prompts attempted`}</button>{previous && <a className="quiet previous-link" href={`/learn/${previous.lesson.id}`}><ChevronLeft /> Previous: {previous.lesson.title}</a>}</>}{error && <p className="error" role="alert">{error} <button onClick={complete}>Retry</button></p>}</section>
      </article>
    </main>
    <nav className="learn-mobile-nav" aria-label="Chronos"><a href="/home"><Home /> Home</a><a href="/library"><Library /> Library</a><a href="/search"><Search /> Search</a></nav>
  </div>;
}
