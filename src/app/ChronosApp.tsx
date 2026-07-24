import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Bookmark, Check, ChevronRight, Clock3, Compass, Search } from 'lucide-react';
import { chronosContent } from '../../content/chronos';
import { worldSpineNodeCount, worldSpineRoadmap } from '../../content/world-spine/roadmap';
import { searchAliases } from '../../content/search/aliases';
import type { ChronosContentBundle } from '../../content/assemble';
import type { Journey } from '../domains/contracts';
import { createPublishedJourneyCatalog, publishedEntries, type CatalogJourney, type LibraryCategory } from '../domains/journeys/catalog';
import { closeJourney, continueJourney, deriveJourneyProgress, openJourney, saveJourney, selectJourneyNextAction, setInvitationState, type LearnerJourneyState } from '../domains/journeys/state';
import { resolveJourneyInvitation } from '../domains/journeys/invitations';
import { createLocalSearchProvider, type SearchProvider, type SearchResult } from '../domains/search/search';
import { isLessonOpenable } from '../config/runtimeFlags';
import { createProgressGateway, type JourneyProgressSummary, type LearnProgressGateway } from '../learn/progress';
import { ResponsiveMedia } from '../learn/ResponsiveMedia';
import { WorldSpineOverview } from './WorldSpineOverview';
import { createJourneyStateGateway, type JourneyStateGateway, type JourneyStateLoad } from '../infrastructure/journeys/gateway';
import { useChronosTheme } from '../theme/useChronosTheme';
import type { ChronosRoute } from './routes';
import { GlobalNavigation } from './GlobalNavigation';
import './app.css';

type Navigate = (destination: string) => void;
type DiscoveryAppProps = {
  route: Exclude<ChronosRoute, { name: 'learn' | 'legacy' }>;
  content?: ChronosContentBundle;
  journeyGatewayFactory?: () => Promise<JourneyStateGateway>;
  progressGatewayFactory?: () => Promise<LearnProgressGateway>;
  searchProvider?: SearchProvider;
  navigate?: Navigate;
};

const categoryCopy: Record<LibraryCategory, { title: string; description: string }> = {
  'civilizations-regions': { title: 'Civilizations and Regions', description: 'Follow an authored story through a place, people, or connected region.' },
  'ideas-across-time': { title: 'Ideas Across Time', description: 'Trace a question, invention, or institution across societies and centuries.' },
  investigations: { title: 'Investigations', description: 'Examine evidence, interpretations, and questions historians still debate.' },
};
const kindLabel = (kind: Journey['kind']) => ({ 'world-history': 'World History', 'story-arc': 'Civilization or Region', 'idea-trail': 'Idea Trail', investigation: 'Investigation' }[kind]);

function ProgressLine({ progress }: { progress: ReturnType<typeof deriveJourneyProgress> }) {
  return <div className="progress-line" aria-label={`${progress.completed} of ${progress.total} required lessons completed`}><span style={{ width: `${progress.percent}%` }} /><small>{progress.completed} of {progress.total} reviewed lessons</small></div>;
}

function JourneyCard({ item, state, progress }: { item: CatalogJourney; state?: LearnerJourneyState['journeys'][string]; progress: ReturnType<typeof deriveJourneyProgress> }) {
  return <article className="journey-card"><p className="label">{kindLabel(item.kind)}</p><h3><a href={`/library/${item.id}`}>{item.title}</a></h3><p>{item.learnerPromise}</p><div className="journey-card-meta"><span>{item.period}</span><span>{item.lessonCount} {item.lessonCount === 1 ? 'lesson' : 'lessons'}</span><b>{progress.isCompleted ? 'Completed' : state?.status === 'saved' ? 'Saved' : state?.status === 'open' ? 'Open' : 'Available'}</b></div><ProgressLine progress={progress} /></article>;
}

function HomePage({ content, snapshot, summaries, onCommit }: { content: ChronosContentBundle; snapshot: JourneyStateLoad; summaries: Record<string, JourneyProgressSummary>; onCommit(next: LearnerJourneyState, destination?: string): void }) {
  const catalog = createPublishedJourneyCatalog(content.journeys, content.lessons);
  const state = snapshot.state; const activeJourney = content.journeys.find((journey) => journey.id === state.activeJourneyId && journey.status === 'published');
  const record = activeJourney ? state.journeys[activeJourney.id] : undefined;
  const nextAction = activeJourney ? selectJourneyNextAction(activeJourney, content.lessons, summaries, record?.activeLessonId) : { kind: 'blocked' as const };
  const activeLesson = nextAction.kind === 'lesson' ? content.lessons.find((lesson) => lesson.id === nextAction.lessonId && isLessonOpenable(lesson)) : undefined;
  const hero = activeLesson?.heroMediaId ? content.media.find((media) => media.id === activeLesson.heroMediaId) : undefined;
  const openItems = [catalog.worldHistory, ...Object.values(catalog.groups).flat()].filter((item): item is CatalogJourney => Boolean(item && state.journeys[item.id]?.status === 'open')).sort((left, right) => (state.journeys[right.id]?.lastVisitedAt ?? '').localeCompare(state.journeys[left.id]?.lastVisitedAt ?? '') || left.id.localeCompare(right.id)).slice(0, 3);
  const invitation = resolveJourneyInvitation(content.invitations, content.journeys, content.lessons, state, { placement: 'home', sourceLessonId: activeLesson?.id });
  const cardById = new Map(content.cards.map((card) => [card.id, card])); const mediaById = new Map(content.media.map((media) => [media.id, media]));
  useEffect(() => { document.title = 'Home · Chronos'; }, []);
  if (!activeJourney || !record) return <Recovery title="Your next lesson is unavailable." body="Chronos could not find your active journey. Your saved completion remains intact." />;
  const activeProgress = deriveJourneyProgress(activeJourney, content.lessons, summaries);
  return <main className="discovery-main home-page"><header className="page-intro"><p className="label">Your learning</p><h1>Welcome back.</h1><p>One clear next step, with room to explore when you choose.</p></header>
    {snapshot.staleJourneyIds.length > 0 && <p className="quiet-notice" role="status">A saved journey is no longer published, so it has been removed from your visible list. Your lesson progress is unchanged.</p>}
    {activeLesson ? <section className="continue-card" aria-labelledby="continue-title"><div className="continue-copy"><p className="label">Continue · {activeJourney.kind === 'world-history' ? 'World Spine' : activeJourney.title}</p><h2 id="continue-title">{activeLesson.title}</h2><p>{activeLesson.significance}</p><div className="continue-meta"><span>{activeLesson.masthead}</span><span>{activeLesson.place}</span></div><ProgressLine progress={activeProgress} /><a className="primary-action" href={`/learn/${activeLesson.id}`} onClick={(event) => { event.preventDefault(); onCommit(continueJourney(state, activeJourney, content.lessons, summaries), `/learn/${activeLesson.id}`); }}>Continue lesson <ArrowRight /></a></div>{hero && <div className="continue-image"><ResponsiveMedia media={hero} alt={hero.alt} sizes="(max-width: 720px) 100vw, 44vw" loading="eager" /><span>{hero.depictionLabel}</span></div>}</section> : <section className="continue-card continue-card-status" aria-labelledby="continue-title"><div className="continue-copy"><p className="label">{nextAction.kind === 'complete' ? 'Journey complete' : 'World Spine update'}</p><h2 id="continue-title">{nextAction.kind === 'complete' ? 'You have explored every published lesson.' : 'The next required lesson is not available yet.'}</h2><p>{nextAction.kind === 'complete' ? 'Your completed lessons remain open to revisit while the journey grows.' : 'Chronos will keep your progress safe and offer the next lesson when its curriculum prerequisites are ready.'}</p><ProgressLine progress={activeProgress} /><a className="primary-action" href={`/library/${activeJourney.id}`}>View journey <ArrowRight /></a></div></section>}
    <section className="dashboard-section" aria-labelledby="open-title"><div className="section-title"><div><p className="label">Personal paths</p><h2 id="open-title">Open journeys</h2></div><a href="/library">Visit Library <ChevronRight /></a></div><div className="journey-grid">{openItems.map((item) => <React.Fragment key={item.id}><JourneyCard item={item} state={state.journeys[item.id]} progress={deriveJourneyProgress(content.journeys.find((journey) => journey.id === item.id)!, content.lessons, summaries)} /></React.Fragment>)}</div>{openItems.length === 1 && <div className="limited-state"><Compass /><div><strong>World History is your only published journey right now.</strong><p>Curated civilization stories, idea trails, and investigations will appear here after review—not before.</p></div></div>}</section>
    {invitation && (() => { const destination = content.journeys.find((journey) => journey.id === invitation.destinationJourneyId && journey.status === 'published')!; return <section className="invitation-card"><p className="label">Continue exploring · Optional</p><h2>{destination.title}</h2><p>{invitation.reason}</p><div className="invitation-actions"><a href={'/learn/' + invitation.entryLessonId} onClick={(event) => { event.preventDefault(); const opened = continueJourney(state, destination, content.lessons, summaries); onCommit(setInvitationState(opened, invitation.id, 'opened'), '/learn/' + invitation.entryLessonId); }}>Open journey <ArrowRight /></a><button onClick={() => onCommit(setInvitationState(saveJourney(state, destination, content.lessons), invitation.id, 'saved'))}>Save for later</button><button onClick={() => onCommit(setInvitationState(state, invitation.id, 'dismissed'))}>Not now</button></div></section>; })()}
    <section className="dashboard-section discovered" aria-labelledby="discovered-title"><div className="section-title"><div><p className="label">Memory anchors</p><h2 id="discovered-title">Recently discovered</h2></div></div>{snapshot.ownedCards.length ? <div className="discovered-grid">{snapshot.ownedCards.slice(0, 4).map(({ cardId }) => { const card = cardById.get(cardId); const media = card ? mediaById.get(card.mediaId) : undefined; return card ? <a key={card.id} className="mini-card" href={`/learn/${card.unlockLessonId}`}>{media && <ResponsiveMedia media={media} alt="" sizes="180px" loading="lazy" />}<span>{card.category} · {card.cardClass}</span><strong>{card.title}</strong></a> : null; })}</div> : <div className="limited-state"><Bookmark /><div><strong>Your discoveries will gather here.</strong><p>Complete a reviewed lesson to earn its deterministic Knowledge Card.</p></div></div>}</section>
  </main>;
}

function LibraryPage({ content, state, summaries }: { content: ChronosContentBundle; state: LearnerJourneyState; summaries: Record<string, JourneyProgressSummary> }) {
  const catalog = createPublishedJourneyCatalog(content.journeys, content.lessons);
  const categories = Object.keys(categoryCopy) as LibraryCategory[];
  const hasPublishedOptionalJourney = categories.some((category) => catalog.groups[category].length > 0);
  useEffect(() => { document.title = 'Library · Chronos'; }, []);
  return <main className="discovery-main library-page"><header className="page-intro"><p className="label">Authored journeys</p><h1>Explore history.</h1><p>Choose a reviewed path with a clear question and intentional sequence.</p></header>
    {catalog.worldHistory && <section className="world-feature" aria-labelledby="world-feature-title"><div><p className="label">The chronological spine</p><h2 id="world-feature-title">{catalog.worldHistory.title}</h2><p>{catalog.worldHistory.learnerPromise}</p><div className="feature-meta"><span>{catalog.worldHistory.period}</span><span>{worldSpineNodeCount} lesson roadmap</span><span>{worldSpineRoadmap.length} chapters</span><span>{catalog.worldHistory.lessonCount} available now</span></div><ProgressLine progress={deriveJourneyProgress(content.journeys.find((journey) => journey.id === catalog.worldHistory!.id)!, content.lessons, summaries)} /><a className="primary-action" href={`/library/${catalog.worldHistory.id}`}>Explore the World Spine <ArrowRight /></a></div><Compass aria-hidden="true" /></section>}
    {hasPublishedOptionalJourney
      ? <div className="category-stack">{categories.map((category) => { const copy = categoryCopy[category]; const items = catalog.groups[category]; return <section key={category} className="library-category" aria-labelledby={`category-${category}`}><div className="section-title"><div><p className="label">{category === 'investigations' ? 'Evidence and uncertainty' : 'Optional journeys'}</p><h2 id={`category-${category}`}>{copy.title}</h2><p>{copy.description}</p></div></div>{items.length ? <div className="journey-grid">{items.map((item) => <React.Fragment key={item.id}><JourneyCard item={item} state={state.journeys[item.id]} progress={deriveJourneyProgress(content.journeys.find((journey) => journey.id === item.id)!, content.lessons, summaries)} /></React.Fragment>)}</div> : <p className="category-pending">This category has no fully reviewed journey yet.</p>}</section>; })}</div>
      : <section className="library-coming-soon" aria-labelledby="optional-journeys-title">
        <div className="section-title"><div><p className="label">Deeper paths</p><h2 id="optional-journeys-title">More ways through history.</h2><p>These categories will grow only as complete authored journeys pass review.</p></div></div>
        <div className="category-preview-grid">{categories.map((category) => <article key={category}><span aria-hidden="true">{category === 'investigations' ? '?' : '—'}</span><h3>{categoryCopy[category].title}</h3><p>{categoryCopy[category].description}</p></article>)}</div>
        <div className="empty-category"><Compass aria-hidden="true" /><div><strong>More authored journeys are being prepared.</strong><p>For now, the complete World Spine above is the reviewed path. New stories, idea trails, and investigations will appear here when their full sequence is ready.</p></div></div>
      </section>}
  </main>;
}

function JourneyDetailPage({ journeyId, content, state, summaries, busy, onCommit }: { journeyId: string; content: ChronosContentBundle; state: LearnerJourneyState; summaries: Record<string, JourneyProgressSummary>; busy: boolean; onCommit(next: LearnerJourneyState, destination?: string): void }) {
  const catalog = createPublishedJourneyCatalog(content.journeys, content.lessons); const item = [catalog.worldHistory, ...Object.values(catalog.groups).flat()].find((entry) => entry?.id === journeyId);
  const journey = content.journeys.find((entry) => entry.id === journeyId && entry.status === 'published'); const record = state.journeys[journeyId];
  useEffect(() => { document.title = item ? `${item.title} · Chronos` : 'Journey unavailable · Chronos'; }, [item]);
  if (!item || !journey) return <Recovery title="This journey isn’t available." body="The address may be incorrect, or the journey may not be available. Only reviewed journeys can be opened here." action="Return to Library" href="/library" />;
  const progress = deriveJourneyProgress(journey, content.lessons, summaries); const entries = publishedEntries(journey, content.lessons); const lessonById = new Map(content.lessons.map((lesson) => [lesson.id, lesson]));
  const nextAction = selectJourneyNextAction(journey, content.lessons, summaries, record?.activeLessonId);
  const activeLessonId = nextAction.kind === 'lesson' ? nextAction.lessonId : record?.activeLessonId ?? journey.entryLessonId;
  const continueState = continueJourney(state, journey, content.lessons, summaries);
  return <main className="discovery-main detail-page"><a className="back-link" href="/library">← Back to Library</a><header className="detail-hero"><p className="label">{kindLabel(journey.kind)}</p><h1>{journey.title}</h1><p className="detail-question">{journey.openingQuestion}</p><p>{journey.description}</p><div className="feature-meta"><span>{journey.period}</span>{journey.region && <span>{journey.region}</span>}<span>About {journey.approximateMinutes} minutes</span><span>{item.lessonCount} published lessons</span></div><ProgressLine progress={progress} /><div className="detail-actions">{nextAction.kind === 'lesson' ? <a className="primary-action" href={`/learn/${nextAction.lessonId}`} onClick={(event) => { event.preventDefault(); onCommit(continueState, `/learn/${nextAction.lessonId}`); }}>{record?.status === 'open' ? 'Continue journey' : 'Start journey'} <ArrowRight /></a> : <p className="journey-next-state" role="status">{nextAction.kind === 'complete' ? 'All published required lessons are complete.' : 'The next required lesson is waiting on an earlier curriculum prerequisite.'}</p>}{journey.id !== 'journey.world-history' && record?.status === 'open' && <button disabled={busy} onClick={() => onCommit(closeJourney(state, journey.id))}>Close</button>}{record?.status === 'saved' ? <button disabled={busy} onClick={() => onCommit(openJourney(state, journey, content.lessons))}>Open journey</button> : journey.id !== 'journey.world-history' && record?.status !== 'open' && <button disabled={busy} onClick={() => onCommit(saveJourney(state, journey, content.lessons))}>Save for later</button>}</div></header>
    {journey.kind !== 'world-history' && <section className="detail-layout"><div><p className="label">What this journey promises</p><h2>{journey.learnerPromise}</h2><p>Required lessons define the authored path; optional entries add depth without blocking completion.</p></div><dl><div><dt>Scope</dt><dd>Optional authored journey</dd></div><div><dt>Prerequisites</dt><dd>{journey.prerequisiteJourneyIds.length ? `${journey.prerequisiteJourneyIds.length} curated prerequisite` : 'None'}</dd></div><div><dt>Status</dt><dd>{progress.isCompleted ? 'Completed' : record?.status === 'saved' ? 'Saved' : record?.status === 'open' ? 'Open' : 'Available'}</dd></div></dl></section>}
    {journey.kind === 'world-history'
      ? <WorldSpineOverview lessons={content.lessons} summaries={summaries} currentLessonId={activeLessonId} />
      : <section className="chapter-list" aria-labelledby="chapters-title"><p className="label">Published structure</p><h2 id="chapters-title">Chapters and lessons</h2>{[...journey.chapters].sort((left, right) => left.position - right.position).map((chapter) => { const chapterEntries = entries.filter((entry) => entry.chapter.id === chapter.id); if (!chapterEntries.length) return null; return <article key={chapter.id}><div><span>Chapter {chapter.position + 1}</span><h3>{chapter.title}</h3></div><ol>{chapterEntries.map(({ entry }) => { const lesson = lessonById.get(entry.lessonId)!; const complete = summaries[lesson.id]?.status === 'completed'; return <li key={entry.id}><span className={complete ? 'complete' : ''}>{complete ? <Check /> : entry.position + 1}</span><div><small>{lesson.masthead} · {entry.required ? 'Required' : 'Optional'}</small><a href={`/learn/${lesson.id}`}>{lesson.title}</a><p>{entry.framing}</p></div></li>; })}</ol></article>; })}</section>}
    {!journey.relatedJourneyIds.length && journey.kind !== 'world-history' && <div className="quiet-notice">Related journeys will appear only when an editor has published and connected them.</div>}
  </main>;
}

function SearchPage({ provider, initialQuery }: { provider: SearchProvider; initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { document.title = 'Search · Chronos'; inputRef.current?.focus(); }, []);
  useEffect(() => {
    let current = true;
    const normalized = query.trim();
    const params = normalized ? `?q=${encodeURIComponent(normalized)}` : '';
    window.history.replaceState(null, '', `/search${params}`);
    if (!normalized) { setResults([]); setLoading(false); return; }
    setLoading(true);
    provider.search(normalized).then((items) => { if (current) { setResults(items); setLoading(false); } });
    return () => { current = false; };
  }, [provider, query]);
  const groups = ['journey', 'lesson', 'knowledge-card'] as const;
  const displayedResults = groups.flatMap((kind) => results.filter((result) => result.kind === kind));
  const openFirstResult = () => { if (displayedResults[0]) window.location.assign(displayedResults[0].destination); };
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && results.length) {
      event.preventDefault();
      document.getElementById('search-result-0')?.focus();
    }
  };
  return <main className={`discovery-main search-page ${query.trim() ? 'has-query' : ''}`}><header className="page-intro"><p className="label">Optional fast path</p><h1>Search published history.</h1><p>Search available lessons, journeys, and Knowledge Cards. Browse the World Spine when you want the complete curriculum map.</p></header><form className="search-box" role="search" onSubmit={(event) => { event.preventDefault(); openFirstResult(); }}><Search aria-hidden="true" /><label className="sr-only" htmlFor="global-search">Search published Chronos content</label><input ref={inputRef} id="global-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={onKeyDown} placeholder="Try Uruk, cuneiform, or clay tablet" aria-describedby="search-status" /><kbd>Ctrl K</kbd></form><p id="search-status" className="result-announcement" aria-live="polite">{loading ? 'Searching…' : query.trim() ? `${results.length} published ${results.length === 1 ? 'result' : 'results'}` : 'Enter a person, place, artifact, lesson, or journey.'}</p>
    <div id="search-results" className="search-results">{!query.trim() ? <div className="search-empty"><Compass /><h2>Search when curiosity strikes.</h2><p>You never need search to continue your active journey.</p></div> : !loading && !results.length ? <div className="search-empty"><Search /><h2>No published results.</h2><p>Check the spelling or try a broader term. Lessons still in preparation remain visible in the World Spine.</p></div> : groups.map((kind) => { const items = results.filter((result) => result.kind === kind); if (!items.length) return null; return <section key={kind}><h2>{kind === 'knowledge-card' ? 'Knowledge Cards' : kind === 'journey' ? 'Journeys' : 'Lessons'}</h2><div>{items.map((result) => { const index = displayedResults.indexOf(result); return <a key={result.id} id={`search-result-${index}`} href={result.destination}><span>{result.kind.replace('-', ' ')}</span><strong>{result.title}</strong><small>{result.context}</small><ArrowRight /></a>; })}</div></section>; })}</div>
  </main>;
}

function Recovery({ title, body, action = 'Return Home', href = '/home', retry }: { title: string; body: string; action?: string; href?: string; retry?: () => void }) { return <main className="recovery"><Compass /><p className="label">Chronos archive</p><h1>{title}</h1><p>{body}</p>{retry ? <button className="primary-action" onClick={retry}>Retry</button> : <a className="primary-action" href={href}>{action}</a>}</main>; }

export function DiscoveryApp({ route, content = chronosContent, journeyGatewayFactory = createJourneyStateGateway, progressGatewayFactory = createProgressGateway, searchProvider, navigate = (destination) => window.location.assign(destination) }: DiscoveryAppProps) {
  const [snapshot, setSnapshot] = useState<JourneyStateLoad>(); const [summaries, setSummaries] = useState<Record<string, JourneyProgressSummary>>({}); const [loadError, setLoadError] = useState(''); const [actionError, setActionError] = useState(''); const [busy, setBusy] = useState(false); const [attempt, setAttempt] = useState(0); const gatewayRef = useRef<JourneyStateGateway>();
  const { theme, toggleTheme } = useChronosTheme();
  const provider = useMemo(() => searchProvider ?? createLocalSearchProvider(content, searchAliases), [content, searchProvider]);
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); window.location.assign('/search'); } }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, []);
  useEffect(() => { let current = true; setLoadError(''); Promise.all([journeyGatewayFactory(), progressGatewayFactory()]).then(async ([journeyGateway, progressGateway]) => { gatewayRef.current = journeyGateway; const openableIds = content.lessons.filter((lesson) => isLessonOpenable(lesson)).map((lesson) => lesson.id); const [loaded, progress] = await Promise.all([journeyGateway.load(), progressGateway.loadJourneySummaries(openableIds)]); if (current) { setSnapshot(loaded); setSummaries(progress); } }).catch(() => { if (current) setLoadError('Your navigation state could not be loaded. Check the connection and retry.'); }); return () => { current = false; }; }, [attempt, content, journeyGatewayFactory, progressGatewayFactory]);
  const commit = async (next: LearnerJourneyState, destination?: string) => { if (!gatewayRef.current) return; setBusy(true); setActionError(''); try { const loaded = await gatewayRef.current.save(next); setSnapshot(loaded); if (destination) navigate(destination); } catch { setActionError('That journey action could not be saved. Your lesson completion is safe; please retry.'); } finally { setBusy(false); } };
  if (loadError) return <div className="discovery-app" data-theme={theme}><GlobalNavigation theme={theme} onTheme={toggleTheme} /><Recovery title="We couldn’t open your journeys." body={loadError} retry={() => { setSnapshot(undefined); setAttempt((value) => value + 1); }} /></div>;
  if (!snapshot) return <div className="discovery-app" data-theme={theme}><GlobalNavigation theme={theme} onTheme={toggleTheme} /><main className="discovery-loading" aria-busy="true">Opening your Chronos library…</main></div>;
  const active = route.name === 'home' ? 'home' : route.name === 'library' || route.name === 'journey' ? 'library' : 'search';
  return <div className="discovery-app" data-theme={theme}><GlobalNavigation active={active} theme={theme} onTheme={toggleTheme} />{actionError && <div className="action-error" role="alert">{actionError}</div>}{route.name === 'home' && <HomePage content={content} snapshot={snapshot} summaries={summaries} onCommit={commit} />}{route.name === 'library' && <LibraryPage content={content} state={snapshot.state} summaries={summaries} />}{route.name === 'journey' && <JourneyDetailPage journeyId={route.journeyId} content={content} state={snapshot.state} summaries={summaries} busy={busy} onCommit={commit} />}{route.name === 'search' && <SearchPage provider={provider} initialQuery={route.query} />}{route.name === 'not-found' && <Recovery title="That page isn’t in the archive." body="Check the address or return to a published Chronos destination." />}</div>;
}
