import { chronosContent } from '../../../content/chronos';
import type { Journey, Lesson } from '../../domains/contracts';
import { createDefaultJourneyState, normalizeJourneyState, type LearnerJourneyState } from '../../domains/journeys/state';
import { isSupabaseConfigured, supabase } from '../../../lib/supabase';

export type OwnedCardSummary = { cardId: string; acquiredAt: string };
export type JourneyStateLoad = { state: LearnerJourneyState; staleJourneyIds: string[]; ownedCards: OwnedCardSummary[] };
export interface JourneyStateGateway {
  load(): Promise<JourneyStateLoad>;
  save(state: LearnerJourneyState): Promise<JourneyStateLoad>;
}

const STORAGE_KEY = 'chronos.discovery.preview.v1';
type ContentBoundary = { journeys: readonly Journey[]; lessons: readonly Lesson[] };

export class LocalJourneyStateGateway implements JourneyStateGateway {
  constructor(private content: ContentBoundary = chronosContent) {}
  private read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const normalized = normalizeJourneyState(raw ? JSON.parse(raw) : null, this.content.journeys, this.content.lessons);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized.state));
      return normalized;
    } catch {
      const state = createDefaultJourneyState(this.content.journeys, this.content.lessons);
      return { state, staleJourneyIds: [] as string[] };
    }
  }
  private ownedCards() {
    const owned = chronosContent.cards.flatMap((card) => {
      try {
        const raw = localStorage.getItem(`chronos.learn.preview.v1:${card.unlockLessonId}`);
        const state = raw ? JSON.parse(raw) : null;
        return state?.cardId === card.id && state?.completedAt ? [{ cardId: card.id, acquiredAt: String(state.completedAt) }] : [];
      } catch { return []; }
    });
    return owned.sort((left, right) => right.acquiredAt.localeCompare(left.acquiredAt) || left.cardId.localeCompare(right.cardId));
  }
  async load() { return { ...this.read(), ownedCards: this.ownedCards() }; }
  async save(state: LearnerJourneyState) {
    const normalized = normalizeJourneyState(state, this.content.journeys, this.content.lessons);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized.state));
    return { ...normalized, ownedCards: this.ownedCards() };
  }
}

type SupabaseClient = typeof supabase;
export class SupabaseJourneyStateGateway implements JourneyStateGateway {
  constructor(private learnerId: string, private client: SupabaseClient = supabase, private content: ContentBoundary = chronosContent) {}
  private async ensureLearner() {
    const result = await this.client.from('learners').upsert({ id: this.learnerId }, { onConflict: 'id', ignoreDuplicates: true });
    if (result.error) throw result.error;
  }
  async load(): Promise<JourneyStateLoad> {
    await this.ensureLearner();
    const [journeysResult, navigationResult, invitationsResult, ownershipResult] = await Promise.all([
      this.client.from('learner_journeys').select('journey_id,status,active_lesson_id,opened_at,saved_at,closed_at,last_visited_at').eq('learner_id', this.learnerId),
      this.client.from('learner_navigation_state').select('active_journey_id').eq('learner_id', this.learnerId).maybeSingle(),
      this.client.from('learner_invitation_states').select('invitation_id,action,updated_at').eq('learner_id', this.learnerId),
      this.client.from('card_ownership').select('card_id,acquired_at').eq('learner_id', this.learnerId).order('acquired_at', { ascending: false }),
    ]);
    const failure = [journeysResult, navigationResult, invitationsResult, ownershipResult].find((result) => result.error);
    if (failure?.error) throw failure.error;
    const rows = journeysResult.data ?? [];
    const candidate = rows.length ? {
      version: 1 as const,
      activeJourneyId: navigationResult.data?.active_journey_id ?? 'journey.world-history',
      journeys: Object.fromEntries(rows.map((row: any) => [row.journey_id, {
        journeyId: row.journey_id, status: row.status, activeLessonId: row.active_lesson_id,
        openedAt: row.opened_at ?? undefined, savedAt: row.saved_at ?? undefined, closedAt: row.closed_at ?? undefined, lastVisitedAt: row.last_visited_at,
      }])),
      invitationStates: Object.fromEntries((invitationsResult.data ?? []).map((row: any) => [row.invitation_id, { action: row.action, updatedAt: row.updated_at }])),
    } : createDefaultJourneyState(this.content.journeys, this.content.lessons);
    const normalized = normalizeJourneyState(candidate, this.content.journeys, this.content.lessons);
    if (!rows.length) await this.persist(normalized.state);
    return { ...normalized, ownedCards: (ownershipResult.data ?? []).map((row: any) => ({ cardId: row.card_id, acquiredAt: row.acquired_at })) };
  }
  private async persist(state: LearnerJourneyState) {
    await this.ensureLearner();
    const journeyRows = Object.values(state.journeys).map((record) => ({
      learner_id: this.learnerId, journey_id: record.journeyId, status: record.status, active_lesson_id: record.activeLessonId,
      opened_at: record.openedAt ?? null, saved_at: record.savedAt ?? null, closed_at: record.closedAt ?? null,
      last_visited_at: record.lastVisitedAt, updated_at: new Date().toISOString(),
    }));
    const invitationRows = Object.entries(state.invitationStates).map(([id, value]) => ({ learner_id: this.learnerId, invitation_id: id, action: value.action, updated_at: value.updatedAt }));
    const writes: Array<PromiseLike<{ error: unknown }>> = [
      this.client.from('learner_journeys').upsert(journeyRows, { onConflict: 'learner_id,journey_id' }),
      this.client.from('learner_navigation_state').upsert({ learner_id: this.learnerId, active_journey_id: state.activeJourneyId, updated_at: new Date().toISOString() }, { onConflict: 'learner_id' }),
    ];
    if (invitationRows.length) writes.push(this.client.from('learner_invitation_states').upsert(invitationRows, { onConflict: 'learner_id,invitation_id' }));
    const results = await Promise.all(writes); const failure = results.find((result) => result.error); if (failure?.error) throw failure.error;
  }
  async save(state: LearnerJourneyState) { await this.persist(state); return this.load(); }
}

export async function createJourneyStateGateway(): Promise<JourneyStateGateway> {
  if (isSupabaseConfigured()) {
    const { data } = await supabase.auth.getUser();
    if (data.user) return new SupabaseJourneyStateGateway(data.user.id);
  }
  return new LocalJourneyStateGateway();
}
