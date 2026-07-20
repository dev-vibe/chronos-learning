import type { Journey, Lesson } from '../contracts';
import type { JourneyProgressSummary } from '../../learn/progress';
import { publishedEntries } from './catalog';
import { worldSpineRoadmap } from '../../../content/world-spine/roadmap';
import { resolveWorldSpineAccess } from './worldSpine';

export const DEFAULT_JOURNEY_ID = 'journey.world-history';
export type JourneyMembership = 'open' | 'saved' | 'closed';
export type LearnerJourneyRecord = {
  journeyId: string;
  status: JourneyMembership;
  activeLessonId: string;
  openedAt?: string;
  savedAt?: string;
  closedAt?: string;
  lastVisitedAt: string;
};
export type InvitationAction = 'saved' | 'dismissed' | 'opened';
export type LearnerJourneyState = {
  version: 1;
  activeJourneyId: string;
  journeys: Record<string, LearnerJourneyRecord>;
  invitationStates: Record<string, { action: InvitationAction; updatedAt: string }>;
};

export type JourneyNextAction =
  | Readonly<{ kind: 'lesson'; lessonId: string; source: 'active' | 'next' | 'start' | 'backfill' }>
  | Readonly<{ kind: 'complete' }>
  | Readonly<{ kind: 'blocked'; blockerId?: string }>;

const actionableEntries = (journey: Journey, lessons: readonly Lesson[]) => {
  const published = publishedEntries(journey, lessons);
  const required = published.filter(({ entry }) => entry.required);
  return required.length ? required : published;
};

export function selectJourneyNextAction(
  journey: Journey,
  lessons: readonly Lesson[],
  summaries: Record<string, JourneyProgressSummary>,
  activeLessonId?: string,
): JourneyNextAction {
  const entries = actionableEntries(journey, lessons);
  if (!entries.length) return { kind: 'blocked' };

  const completed = (lessonId: string) => summaries[lessonId]?.status === 'completed';
  const access = (lessonId: string) => journey.kind === 'world-history'
    ? resolveWorldSpineAccess(worldSpineRoadmap, lessons, summaries, lessonId)
    : { accessible: true as const };
  const activeIndex = entries.findIndex(({ entry }) => entry.lessonId === activeLessonId);

  if (activeIndex >= 0) {
    const lessonId = entries[activeIndex].entry.lessonId;
    if (!completed(lessonId) && access(lessonId).accessible) {
      return { kind: 'lesson', lessonId, source: 'active' };
    }
  }

  const startIndex = activeIndex >= 0 && completed(entries[activeIndex].entry.lessonId) ? activeIndex + 1 : 0;
  for (let index = startIndex; index < entries.length; index += 1) {
    const lessonId = entries[index].entry.lessonId;
    if (!completed(lessonId) && access(lessonId).accessible) {
      const source = activeIndex < 0 ? 'start' : index > activeIndex ? 'next' : 'backfill';
      return { kind: 'lesson', lessonId, source };
    }
  }
  for (let index = 0; index < startIndex; index += 1) {
    const lessonId = entries[index].entry.lessonId;
    if (!completed(lessonId) && access(lessonId).accessible) {
      return { kind: 'lesson', lessonId, source: 'backfill' };
    }
  }

  if (entries.every(({ entry }) => completed(entry.lessonId))) return { kind: 'complete' };
  const blocked = entries
    .filter(({ entry }) => !completed(entry.lessonId))
    .map(({ entry }) => access(entry.lessonId))
    .find((result) => !result.accessible);
  return { kind: 'blocked', ...(blocked?.blockerId ? { blockerId: blocked.blockerId } : {}) };
}

/** The first published lesson a new learner may actually open. */
export const firstPublishedLessonId = (journey: Journey, lessons: readonly Lesson[]) => {
  const action = selectJourneyNextAction(journey, lessons, {});
  return action.kind === 'lesson' ? action.lessonId : undefined;
};

export function createDefaultJourneyState(journeys: readonly Journey[], lessons: readonly Lesson[], now = new Date().toISOString()): LearnerJourneyState {
  const world = journeys.find((journey) => journey.id === DEFAULT_JOURNEY_ID && journey.status === 'published');
  const activeLessonId = world ? firstPublishedLessonId(world, lessons) : undefined;
  if (!world || !activeLessonId) throw new Error('published World History journey is required');
  return { version: 1, activeJourneyId: world.id, journeys: { [world.id]: { journeyId: world.id, status: 'open', activeLessonId, openedAt: now, lastVisitedAt: now } }, invitationStates: {} };
}

export function normalizeJourneyState(input: unknown, journeys: readonly Journey[], lessons: readonly Lesson[], now = new Date().toISOString()) {
  const fallback = createDefaultJourneyState(journeys, lessons, now);
  if (!input || typeof input !== 'object' || (input as Partial<LearnerJourneyState>).version !== 1) return { state: fallback, staleJourneyIds: [] as string[] };
  const candidate = input as LearnerJourneyState;
  const published = new Map(journeys.filter((journey) => journey.status === 'published').map((journey) => [journey.id, journey]));
  const staleJourneyIds = Object.keys(candidate.journeys ?? {}).filter((id) => !published.has(id));
  const records: LearnerJourneyState['journeys'] = {};
  for (const [id, journey] of published) {
    const stored = candidate.journeys?.[id];
    if (!stored) continue;
    const validLessons = new Set(publishedEntries(journey, lessons).map(({ entry }) => entry.lessonId));
    const activeLessonId = validLessons.has(stored.activeLessonId) ? stored.activeLessonId : firstPublishedLessonId(journey, lessons);
    if (!activeLessonId) continue;
    records[id] = { ...stored, journeyId: id, activeLessonId };
  }
  records[DEFAULT_JOURNEY_ID] = { ...(records[DEFAULT_JOURNEY_ID] ?? fallback.journeys[DEFAULT_JOURNEY_ID]), status: 'open', closedAt: undefined };
  const activeJourneyId = records[candidate.activeJourneyId]?.status === 'open' ? candidate.activeJourneyId : DEFAULT_JOURNEY_ID;
  return { state: { version: 1 as const, activeJourneyId, journeys: records, invitationStates: candidate.invitationStates ?? {} }, staleJourneyIds };
}

const copy = (state: LearnerJourneyState): LearnerJourneyState => ({ ...state, journeys: { ...state.journeys }, invitationStates: { ...state.invitationStates } });
export function saveJourney(state: LearnerJourneyState, journey: Journey, lessons: readonly Lesson[], now = new Date().toISOString()) {
  const next = copy(state); const existing = next.journeys[journey.id]; const activeLessonId = existing?.activeLessonId ?? firstPublishedLessonId(journey, lessons);
  if (!activeLessonId) return next;
  next.journeys[journey.id] = { ...existing, journeyId: journey.id, activeLessonId, status: 'saved', savedAt: now, lastVisitedAt: existing?.lastVisitedAt ?? now };
  return next;
}
export function openJourney(state: LearnerJourneyState, journey: Journey, lessons: readonly Lesson[], now = new Date().toISOString()) {
  const next = copy(state); const existing = next.journeys[journey.id]; const activeLessonId = existing?.activeLessonId ?? firstPublishedLessonId(journey, lessons);
  if (!activeLessonId) return next;
  next.journeys[journey.id] = { ...existing, journeyId: journey.id, activeLessonId, status: 'open', openedAt: existing?.openedAt ?? now, closedAt: undefined, lastVisitedAt: existing?.lastVisitedAt ?? now };
  return next;
}
export function continueJourney(
  state: LearnerJourneyState,
  journey: Journey,
  lessons: readonly Lesson[],
  summaries: Record<string, JourneyProgressSummary> = {},
  now = new Date().toISOString(),
) {
  const next = openJourney(state, journey, lessons, now);
  const record = next.journeys[journey.id];
  if (!record) return next;
  const action = selectJourneyNextAction(journey, lessons, summaries, record.activeLessonId);
  next.activeJourneyId = journey.id;
  next.journeys[journey.id] = {
    ...record,
    ...(action.kind === 'lesson' ? { activeLessonId: action.lessonId } : {}),
    lastVisitedAt: now,
  };
  return next;
}
export function closeJourney(state: LearnerJourneyState, journeyId: string, now = new Date().toISOString()) {
  if (journeyId === DEFAULT_JOURNEY_ID) return state;
  const next = copy(state); const record = next.journeys[journeyId]; if (!record) return next;
  next.journeys[journeyId] = { ...record, status: 'closed', closedAt: now };
  if (next.activeJourneyId === journeyId) next.activeJourneyId = DEFAULT_JOURNEY_ID;
  return next;
}
export function setActiveLesson(state: LearnerJourneyState, journeyId: string, lessonId: string, now = new Date().toISOString()) {
  const next = copy(state); const record = next.journeys[journeyId]; if (!record) return next;
  next.activeJourneyId = journeyId; next.journeys[journeyId] = { ...record, status: 'open', activeLessonId: lessonId, lastVisitedAt: now, closedAt: undefined }; return next;
}
export function setInvitationState(state: LearnerJourneyState, invitationId: string, action: InvitationAction, now = new Date().toISOString()) {
  const next = copy(state); next.invitationStates[invitationId] = { action, updatedAt: now }; return next;
}
export function deriveJourneyProgress(journey: Journey, lessons: readonly Lesson[], summaries: Record<string, JourneyProgressSummary>) {
  const required = publishedEntries(journey, lessons).filter(({ entry }) => entry.required);
  const completed = required.filter(({ entry }) => summaries[entry.lessonId]?.status === 'completed').length;
  return { completed, total: required.length, percent: required.length ? Math.round(completed / required.length * 100) : 0, isCompleted: required.length > 0 && completed === required.length };
}
