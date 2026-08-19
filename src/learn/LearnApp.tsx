import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Archive, BookOpen, ChevronRight, Compass, Landmark, Lock, Moon, Sun } from 'lucide-react';
import { chronosContent } from '../../content/chronos';
import type { Journey, KnowledgeCard, Lesson, LessonModule, LessonSection } from '../domains/contracts';
import { isLessonOpenable, unlockPreviewLessonsEnabled } from '../config/runtimeFlags';
import type { LessonPrototypeReview } from '../infrastructure/content/prototypeReview';
import { HistoricalMapModule } from './HistoricalMapModule';
import { ResponsiveMedia } from './ResponsiveMedia';
import { completionKey, createProgressGateway, LocalPreviewGateway, type JourneyProgressSummary, type LearnProgressGateway, type LearnState } from './progress';
import { useChronosTheme } from '../theme/useChronosTheme';
import { derivePromptRequirementState } from './prompt-requirements';
import { JourneySwitcher } from '../app/JourneySwitcher';
import { worldSpineRoadmap } from '../../content/world-spine/roadmap';
import { resolveWorldSpineAccess } from '../domains/journeys/worldSpine';
import { knowledgeCardTypeLabel } from '../domains/knowledgeCards';
import { createJourneyDrawerState, JourneyDrawer, orderedJourneyEntries } from './JourneyDrawer';
import { GlobalNavigation } from '../app/GlobalNavigation';
import { PrototypeMediaIntentions } from './PrototypeMediaIntentions';
import './learn.css';

const lessonById = new Map(chronosContent.lessons.map((item) => [item.id, item]));
const promptById = new Map(chronosContent.prompts.map((item) => [item.id, item]));
const mediaById = new Map(chronosContent.media.map((item) => [item.id, item]));
const cardById = new Map(chronosContent.cards.map((item) => [item.id, item]));
const cardsByLessonId = new Map<string, KnowledgeCard[]>();
for (const card of chronosContent.cards) cardsByLessonId.set(card.unlockLessonId, [...(cardsByLessonId.get(card.unlockLessonId) ?? []), card]);
const sourceById = new Map(chronosContent.sources.map((item) => [item.id, item]));
const firstPublishedLessonId = chronosContent.journeys.filter((journey) => journey.status === 'published').flatMap((item) => item.chapters).sort((a, b) => a.position - b.position).flatMap((chapter) => [...chapter.entries].sort((a, b) => a.position - b.position)).map((entry) => entry.lessonId).find((id) => {
  const lesson = lessonById.get(id);
  return lesson ? isLessonOpenable(lesson) : false;
}) ?? chronosContent.lessons.find((item) => isLessonOpenable(item))?.id ?? '';
const worldHistoryJourney = chronosContent.journeys.find(
  (journey) => journey.id === 'journey.world-history' && journey.status === 'published',
);
const firstPublishedLesson = lessonById.get(firstPublishedLessonId);

const findJourney = (lessonId: string) => chronosContent.journeys.find((item) => item.status === 'published' && item.chapters.some((chapter) => chapter.entries.some((entry) => entry.lessonId === lessonId)));
type ModuleProps = { module: LessonModule; state: LearnState; onAttempt(id: string, response: string): void };

function Module({ module, state, onAttempt }: ModuleProps) {
  if (module.type === 'prose') {
    const paragraphs = module.body.split(/\n\n+/).map((part) => part.trim()).filter(Boolean);
    return <div className="prose-module">{paragraphs.map((paragraph) => <p key={paragraph.slice(0, 48)}>{paragraph}</p>)}</div>;
  }
  if (module.type === 'knowledge') return <aside className="knowledge-block"><div className="module-heading"><span>{module.eyebrow}</span><p className="module-lead">{module.body}</p></div><dl data-count={module.items.length}>{module.items.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.detail}</dd></div>)}</dl></aside>;
  if (module.type === 'scene') {
    const media = mediaById.get(module.mediaId)!;
    return <details className="scene-module"><summary><span className="scene-thumb"><ResponsiveMedia media={media} alt="" sizes="96px" loading="lazy" /></span><span><small>Visual field guide</small><strong>{module.title}</strong><em>{module.body}</em></span><ChevronRight /></summary><div className="scene-details"><ResponsiveMedia media={media} alt={media.alt} sizes="(max-width: 800px) 100vw, 50vw" loading="lazy" /><ol>{module.hotspots.map((spot, index) => <li key={spot.label}><span>{index + 1}</span><div><strong>{spot.label}</strong><p>{spot.detail}</p></div></li>)}</ol></div></details>;
  }
  if (module.type === 'evidence') {
    const media = mediaById.get(module.mediaId)!;
    const source = media.sourceIds.map((id) => sourceById.get(id)).find(Boolean);
    return <figure className="evidence-module"><div className="evidence-image"><ResponsiveMedia media={media} alt={media.alt} sizes="(max-width: 800px) 100vw, 50vw" loading="eager" /><span>{module.artifactLabel}</span></div><figcaption><div className="evidence-type"><Archive /><span>From the evidence room</span></div><h3>{module.title}</h3><p>{module.body}</p><dl><div><dt>Depiction</dt><dd>{media.depictionLabel}</dd></div><div><dt>Source</dt><dd>{source ? <a href={source.url} target='_blank' rel='noreferrer'>{source.publisher}</a> : 'Institutional source'}</dd></div>{media.reviewStatus === 'approved' ? <div><dt>Rights</dt><dd>{media.rightsLabel}</dd></div> : null}</dl></figcaption></figure>;
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
  return <section id={section.id} className={`lesson-section section-${section.modules[0].type}`} data-section-id={section.id} tabIndex={-1}><header className="section-heading"><h2>{section.heading}</h2></header><div className="section-modules">{section.modules.map((module, index) => {
    const nextModule = section.modules[index + 1];
    const previousModule = section.modules[index - 1];

    if (module.type === 'knowledge' && nextModule?.type === 'historical-map') return null;

    if (module.type === 'historical-map') {
      return <div className={`historical-map-pair${module.introLayout === 'dense' ? ' historical-map-pair-dense' : ''}`} key={module.id}>
        {previousModule?.type === 'knowledge'
          ? <Module module={previousModule} state={state} onAttempt={onAttempt} />
          : <aside className="historical-map-intro">
              <div className="module-heading"><span>{module.eyebrow}</span><h3>{module.title}</h3><p>{module.body}</p></div>
            </aside>}
        <Module module={module} state={state} onAttempt={onAttempt} />
      </div>;
    }

    return <React.Fragment key={module.id}><Module module={module} state={state} onAttempt={onAttempt} /></React.Fragment>;
  })}</div></section>;
}

function KnowledgeCardReveal({ card, revealRef, acquired = false }: { card: KnowledgeCard; revealRef?: React.RefObject<HTMLDivElement | null>; acquired?: boolean }) {
  const media = mediaById.get(card.mediaId)!;
  const typeLabel = knowledgeCardTypeLabel(card.category);
  return <div ref={revealRef} className="card-reveal" tabIndex={-1} aria-live={acquired ? 'polite' : undefined}><div className="knowledge-card"><div className="card-frame"><div className={`card-image card-image-${card.category}`}><ResponsiveMedia media={media} alt={media.alt} sizes="320px" loading="lazy" /></div><div className="card-body"><span className="card-class">{card.category === 'place' ? <Landmark /> : <Archive />} {typeLabel}</span><h3>{card.title}</h3><p className="card-date">{card.date.display} · {card.place}</p><p>{card.significance}</p><div className="card-ornament" aria-hidden="true"><i /><Compass /><i /></div></div></div></div><div className="card-copy"><p className="eyebrow">{acquired ? 'Knowledge Card acquired' : 'In your Knowledge Cards'}</p><h3>{card.revealTitle}</h3><p>{card.revealBody}</p><ul>{card.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul></div></div>;
}

type LearnStatusShellProps = {
  theme: 'light' | 'dark';
  onTheme(): void;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  body: string;
  actions?: React.ReactNode;
  busy?: boolean;
  lesson?: Lesson;
  journey?: Journey;
  state?: LearnState;
  summaries?: Record<string, JourneyProgressSummary>;
};

function LearnStatusShell({
  theme,
  onTheme,
  icon,
  eyebrow,
  title,
  body,
  actions,
  busy,
  lesson,
  journey,
  state,
  summaries = {},
}: LearnStatusShellProps) {
  const [drawer, setDrawer] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const hasJourneyContext = Boolean(lesson && journey && state);
  const drawerLesson = lesson ?? firstPublishedLesson;
  const drawerJourney = worldHistoryJourney;
  const drawerState = drawerLesson
    ? state?.lessonId === drawerLesson.id
      ? state
      : createJourneyDrawerState(drawerLesson.id, summaries[drawerLesson.id])
    : undefined;
  const openDrawer = (event: React.MouseEvent<HTMLButtonElement>) => {
    menuRef.current = event.currentTarget;
    setDrawer(true);
  };
  return <div className="learn-app learn-status-shell" data-theme={theme}>
    <GlobalNavigation
      theme={theme}
      onTheme={onTheme}
      onWorldHistory={drawerLesson && drawerJourney ? openDrawer : undefined}
      worldHistoryOpen={drawer}
    />
    {drawerLesson && drawerJourney && drawerState && <JourneyDrawer
      open={drawer}
      onClose={() => setDrawer(false)}
      onNavigate={() => undefined}
      lesson={drawerLesson}
      journey={drawerJourney}
      summaries={summaries}
      currentState={drawerState}
      currentSectionId={drawerLesson.sections[0]?.id}
      showCurrentSections={false}
      returnFocus={menuRef}
    />}
    {hasJourneyContext && <header className="mobile-progress">
      <span className="mobile-progress-spacer" aria-hidden="true" />
      <div><strong>{lesson!.title}</strong><span>Locked lesson</span></div>
      <button className="icon-button" onClick={onTheme} aria-label={`Use ${theme === 'light' ? 'dark' : 'light'} theme`}>{theme === 'light' ? <Moon /> : <Sun />}</button>
    </header>}
    <main className={`lesson learn-status-lesson ${hasJourneyContext ? '' : 'without-journey'}`}>
      {hasJourneyContext && <div className="lesson-toolbar">
        <span className="lesson-breadcrumb">{journey!.title} <ChevronRight /> {lesson!.title}</span>
      </div>}
      <div className="learn-status-frame" aria-busy={busy || undefined}>
        <section className="learn-status-card">
          <span className="learn-status-icon" aria-hidden="true">{icon}</span>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{body}</p>
          {actions && <div className="learn-status-actions">{actions}</div>}
        </section>
      </div>
    </main>
  </div>;
}

export function LearnApp({ lessonId, gatewayFactory = createProgressGateway }: { lessonId: string; gatewayFactory?: () => Promise<LearnProgressGateway> }) {
  const lesson = lessonById.get(lessonId);
  const journey = lesson ? findJourney(lesson.id) : undefined;
  const entries = journey ? orderedJourneyEntries(journey) : [];
  const currentIndex = entries.findIndex((item) => item.lesson.id === lessonId);
  const next = entries.slice(currentIndex + 1).find((item) => isLessonOpenable(item.lesson));
  const [currentProgress, setCurrentProgress] = useState<LearnState | null>(null);
  const [journeySummaries, setJourneySummaries] = useState<Record<string, JourneyProgressSummary>>({});
  const state = currentProgress?.lessonId === lessonId ? currentProgress : null;
  const [drawer, setDrawer] = useState(false);
  const { theme, toggleTheme } = useChronosTheme();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [revealedCardIds, setRevealedCardIds] = useState<string[]>([]);
  const [prototypeReview, setPrototypeReview] = useState<LessonPrototypeReview>();
  const observed = useRef(new Set<string>());
  const gatewayRef = useRef<LearnProgressGateway>(new LocalPreviewGateway());
  const menuRef = useRef<HTMLElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const retryLoad = useCallback(() => { setCurrentProgress(null); setJourneySummaries({}); setError(''); setLoadAttempt((value) => value + 1); }, []);
  const openDrawer = (event: React.MouseEvent<HTMLButtonElement>) => {
    menuRef.current = event.currentTarget;
    setDrawer(true);
  };

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [lessonId]);

  useEffect(() => {
    let active = true;
    setPrototypeReview(undefined);
    if (!import.meta.env.DEV || !unlockPreviewLessonsEnabled()) return () => { active = false; };
    import('../../content/prototype-reviews').then(({ chronosPrototypeReviews }) => {
      if (active) setPrototypeReview(chronosPrototypeReviews.find((review) => review.lessonId === lessonId));
    });
    return () => { active = false; };
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
      const publishedIds = orderedJourneyEntries(journey).map((item) => item.lesson).filter((item) => isLessonOpenable(item)).map((item) => item.id);
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

  useEffect(() => {
    if (revealedCardIds.length === 0 || !revealRef.current) return;
    revealRef.current.focus({ preventScroll: true });
    revealRef.current.scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'center',
    });
  }, [revealedCardIds]);

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
  if (!lesson) return <LearnStatusShell theme={theme} onTheme={toggleTheme} icon={<BookOpen />} eyebrow="Lesson not found" title="This archive entry isn’t available." body="Check the lesson address or return to the first published World History lesson." actions={<><a className="primary" href={`/learn/${firstPublishedLessonId}`}>Open World History</a><a className="secondary" href="/home">Return Home</a></>} />;
  if (!isLessonOpenable(lesson) || !journey) return <LearnStatusShell theme={theme} onTheme={toggleTheme} icon={<BookOpen />} eyebrow="Lesson unavailable" title="This archive entry is not available." body="The address may refer to material that has not been published for learners." actions={<><a className="primary" href={'/learn/' + firstPublishedLessonId}>Open World History</a><a className="secondary" href="/home">Return Home</a></>} />;
  if (!state) return error
    ? <LearnStatusShell theme={theme} onTheme={toggleTheme} icon={<BookOpen />} eyebrow="Progress unavailable" title="We couldn’t open your progress." body={error} actions={<button className="primary" onClick={retryLoad}>Retry loading progress</button>} />
    : <LearnStatusShell theme={theme} onTheme={toggleTheme} icon={<Compass />} eyebrow="Opening lesson" title={`Opening ${lesson.title}…`} body="Gathering your journey and saved progress." busy />;
  if (!worldSpineAccess.accessible) return <LearnStatusShell
    theme={theme}
    onTheme={toggleTheme}
    icon={<Lock />}
    eyebrow="World History"
    title="This lesson is still locked."
    body={worldSpineBlocker ? 'Complete ' + worldSpineBlocker.title + ' before continuing along the chronology.' : 'Complete the earlier available lessons before continuing.'}
    lesson={lesson}
    journey={journey}
    state={state}
    summaries={journeySummaries}
    actions={<><a className="primary" href={'/learn/' + (worldSpineBlocker?.id ?? firstPublishedLessonId)}>Continue {worldSpineBlocker?.title ?? 'World History'}</a><a className="secondary" href="/home">Return Home</a></>}
  />;

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
      if (result.cardOwnership === 'newly-acquired') setRevealedCardIds(result.cardIds ?? (result.cardId ? [result.cardId] : []));
      else setRevealedCardIds([]);
    } catch { setError('The completion command was interrupted. Your attempts are safe; please retry.'); }
    finally { setBusy(false); }
  };

  const hero = lesson.heroMediaId ? mediaById.get(lesson.heroMediaId) : undefined;
  const configuredCards = cardsByLessonId.get(lesson.id) ?? [];
  const newlyAcquired = revealedCardIds.length > 0;
  const ownedCardIds = [...new Set([...(state.cardIds ?? []), ...(state.cardId ? [state.cardId] : [])])];
  const displayCardIds = newlyAcquired
    ? revealedCardIds
    : state.status === 'completed'
      ? (ownedCardIds.length ? ownedCardIds : configuredCards.map((card) => card.id))
      : [];
  const displayCards = displayCardIds.map((id) => cardById.get(id)).filter((card): card is KnowledgeCard => Boolean(card));
  return <div className="learn-app" data-theme={theme}>
    <GlobalNavigation
      theme={theme}
      onTheme={toggleTheme}
      onWorldHistory={openDrawer}
      worldHistoryOpen={drawer}
    />
    <JourneyDrawer open={drawer} onClose={() => setDrawer(false)} onNavigate={navigate} lesson={lesson} journey={journey} summaries={journeySummaries} currentState={state} currentSectionId={state.resumeSectionId ?? lesson.sections[0].id} returnFocus={menuRef} />
    <header className="mobile-progress"><span className="mobile-progress-spacer" aria-hidden="true" /><div><strong>{lesson.title}</strong><span>{state.exploredSectionIds.length} of {lesson.sections.length} sections explored</span></div><button className="icon-button" onClick={toggleTheme} aria-label={'Use ' + (theme === 'light' ? 'dark' : 'light') + ' theme'}>{theme === 'light' ? <Moon /> : <Sun />}</button></header>
    <main className="lesson"><div className="lesson-toolbar"><JourneySwitcher currentJourneyId={journey.id} currentLessonId={lesson.id} /><span className="lesson-breadcrumb">{breadcrumbChapter} <ChevronRight /> {lesson.title}</span></div>
      <article><header className="masthead"><div className="masthead-copy"><p className="eyebrow">{lesson.masthead} <span>·</span> {lesson.place}</p><h1>{lesson.title}</h1><p className="dek">{lesson.significance}</p></div>{hero && <figure className="hero"><div className={'hero-image hero-image-' + hero.depictionMode}><ResponsiveMedia className={`hero-media hero-${hero.depictionMode}`} media={hero} alt={hero.alt} sizes="(max-width: 800px) 100vw, 60vw" loading="eager" decoding="async" /><span className="depiction-label">{lesson.heroLabel}</span></div><figcaption><span>{hero.depictionLabel}</span><span>{lesson.heroCaption}</span></figcaption></figure>}</header>
        {lesson.sections.map((section) => <React.Fragment key={section.id}><Section section={section} state={state} onAttempt={attempt} /><PrototypeMediaIntentions lesson={lesson} review={prototypeReview} sectionId={section.id} /></React.Fragment>)}
        <section className="completion-panel" aria-labelledby="completion-title"><p className="eyebrow">Your next step</p><h2 id="completion-title">{state.status === 'completed' ? 'Lesson explored' : `Complete ${lesson.title}`}</h2>{state.status === 'completed' ? <>{displayCards.length > 0 && <div className="card-reveal-list">{displayCards.map((card, index) => <React.Fragment key={card.id}><KnowledgeCardReveal card={card} acquired={newlyAcquired} revealRef={newlyAcquired && index === 0 ? revealRef : undefined} /></React.Fragment>)}</div>}<div className="actions">{next ? <a className="primary" href={`/learn/${next.lesson.id}`}>Continue World History <ChevronRight /></a> : <span className="journey-end">World History continues with the next reviewed lesson.</span>}</div></> : <><p>{requirement.requiredIds.length === 1 ? 'The required understanding prompt needs' : `All ${requirement.requiredIds.length} required understanding prompts need`} a sincere attempt. Scrolling alone never completes a lesson.</p><button className="primary" disabled={!requirement.ready || busy} onClick={complete}>{busy ? 'Completing…' : requirement.ready ? 'Complete lesson' : `${requirement.attemptedCount} of ${requirement.requiredIds.length} required prompts attempted`}</button></>}{error && <p className="error" role="alert">{error} <button onClick={complete}>Retry</button></p>}</section>
      </article>
    </main>
  </div>;
}
