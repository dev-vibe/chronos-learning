import type { CompleteLessonResult, LessonProgress } from '../domains/contracts';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { chronosContent } from '../../content/chronos';

export type PromptResponses = Record<string, string>;
export type LearnState = LessonProgress & { exploredSectionIds: string[]; responses: PromptResponses; cardIds?: string[]; cardId?: string; version: 1 };
export type JourneyProgressSummary = Pick<LessonProgress, 'lessonId' | 'status' | 'completedAt'>;
export interface LearnProgressGateway {
  load(lessonId: string): Promise<LearnState>;
  loadJourneySummaries(lessonIds: readonly string[]): Promise<Record<string, JourneyProgressSummary>>;
  markSection(lessonId: string, sectionId: string): Promise<LearnState>;
  saveAttempt(lessonId: string, promptId: string, response: string): Promise<LearnState>;
  complete(lessonId: string, idempotencyKey: string): Promise<CompleteLessonResult>;
}

const key = (lessonId: string) => `chronos.learn.preview.v1:${lessonId}`;
const empty = (lessonId: string): LearnState => ({ learnerId: 'anonymous-preview', lessonId, status: 'in-progress', attemptedPromptIds: [], exploredSectionIds: [], responses: {}, version: 1 });
const requiredPrompts = (lessonId: string) => chronosContent.lessons.find((item) => item.id === lessonId)?.promptIds.filter((id) => chronosContent.prompts.find((prompt) => prompt.id === id)?.required) ?? [];
const currentSectionIds = (lessonId: string) => new Set(chronosContent.lessons.find((item) => item.id === lessonId)?.sections.map((section) => section.id) ?? []);
const cardsForLesson = (lessonId: string) => chronosContent.cards.filter((card) => card.unlockLessonId === lessonId).map((card) => card.id);

export function normalizeLearnState(state: LearnState): LearnState {
  const validSections = currentSectionIds(state.lessonId);
  const resumeSectionId = state.resumeSectionId && validSections.has(state.resumeSectionId) ? state.resumeSectionId : undefined;
  const exploredSectionIds = [...new Set(state.exploredSectionIds.filter((sectionId) => validSections.has(sectionId)))];
  const cardIds = [...new Set([...(state.cardIds ?? []), ...(state.cardId ? [state.cardId] : [])])];
  return { ...state, resumeSectionId, exploredSectionIds, cardIds, cardId: cardIds[0] };
}

export class LocalPreviewGateway implements LearnProgressGateway {
  private read(lessonId: string) {
    try {
      const raw = localStorage.getItem(key(lessonId));
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed?.version !== 1 || parsed.lessonId !== lessonId) return empty(lessonId);
      const normalized = normalizeLearnState(parsed as LearnState);
      if (JSON.stringify(normalized) !== JSON.stringify(parsed)) localStorage.setItem(key(lessonId), JSON.stringify(normalized));
      return normalized;
    } catch { return empty(lessonId); }
  }
  private write(state: LearnState) { localStorage.setItem(key(state.lessonId), JSON.stringify(state)); return state; }
  async load(lessonId: string) { return this.read(lessonId); }
  async loadJourneySummaries(lessonIds: readonly string[]) {
    return Object.fromEntries([...new Set(lessonIds)].map((lessonId) => {
      const state = this.read(lessonId);
      return [lessonId, { lessonId, status: state.status, completedAt: state.completedAt }];
    }));
  }
  async markSection(lessonId: string, sectionId: string) {
    const state = this.read(lessonId);
    if (!state.exploredSectionIds.includes(sectionId)) state.exploredSectionIds.push(sectionId);
    state.resumeSectionId = sectionId;
    return this.write(state);
  }
  async saveAttempt(lessonId: string, promptId: string, response: string) {
    const state = this.read(lessonId);
    state.responses[promptId] = response;
    if (!state.attemptedPromptIds.includes(promptId)) state.attemptedPromptIds.push(promptId);
    return this.write(state);
  }
  async complete(lessonId: string, _idempotencyKey: string) {
    const state = this.read(lessonId);
    if (state.status === 'completed') {
      const cardIds = state.cardIds ?? (state.cardId ? [state.cardId] : []);
      return { completion: 'already-completed', cardOwnership: cardIds.length ? 'already-owned' : 'not-configured', cardIds, ...(cardIds[0] ? { cardId: cardIds[0] } : {}) } as const;
    }
    if (!requiredPrompts(lessonId).every((id) => state.attemptedPromptIds.includes(id))) throw new Error('required prompt attempts missing');
    const cardIds = cardsForLesson(lessonId);
    state.status = 'completed'; state.completedAt = new Date().toISOString(); state.cardIds = cardIds; state.cardId = cardIds[0]; this.write(state);
    return { completion: 'newly-completed', cardOwnership: cardIds.length ? 'newly-acquired' : 'not-configured', cardIds, ...(cardIds[0] ? { cardId: cardIds[0] } : {}) } as const;
  }
}

type SupabaseClient = typeof supabase;
export const mapCompletionRpcResult = (data: unknown): CompleteLessonResult => {
  const result = data as Partial<CompleteLessonResult> | null;
  if (!result || !['newly-completed', 'already-completed'].includes(String(result.completion)) || !['newly-acquired', 'already-owned', 'not-configured'].includes(String(result.cardOwnership))) throw new Error('invalid completion result');
  const cardIds = Array.isArray(result.cardIds) ? result.cardIds.filter((id): id is string => typeof id === 'string') : result.cardId ? [result.cardId] : [];
  return { completion: result.completion!, cardOwnership: result.cardOwnership!, cardIds, ...(cardIds[0] ? { cardId: cardIds[0] } : {}) };
};

export class SupabaseLearnGateway implements LearnProgressGateway {
  constructor(private learnerId: string, private client: SupabaseClient = supabase) {}
  private async ensure(lessonId: string) {
    const learner = await this.client.from('learners').upsert(
      { id: this.learnerId },
      { onConflict: 'id', ignoreDuplicates: true },
    );
    if (learner.error) throw learner.error;

    const progress = await this.client.from('lesson_progress').upsert(
      { learner_id: this.learnerId, lesson_id: lessonId },
      { onConflict: 'learner_id,lesson_id', ignoreDuplicates: true },
    );
    if (progress.error) throw progress.error;
  }
  async load(lessonId: string): Promise<LearnState> {
    await this.ensure(lessonId);
    const [progressResult, resumeResult, exploredResult, attemptsResult, ownershipResult] = await Promise.all([
      this.client.from('lesson_progress').select('status,completed_at').eq('learner_id', this.learnerId).eq('lesson_id', lessonId).single(),
      this.client.from('section_resume_state').select('section_id').eq('learner_id', this.learnerId).eq('lesson_id', lessonId).maybeSingle(),
      this.client.from('lesson_section_exploration').select('section_id').eq('learner_id', this.learnerId).eq('lesson_id', lessonId),
      this.client.from('understanding_prompt_attempts').select('prompt_id,response').eq('learner_id', this.learnerId).eq('lesson_id', lessonId),
      this.client.from('card_ownership').select('card_id').eq('learner_id', this.learnerId).eq('source_lesson_id', lessonId),
    ]);
    const failed = [progressResult, resumeResult, exploredResult, attemptsResult, ownershipResult].find((result) => result.error);
    if (failed?.error) throw failed.error;
    const { data: progress } = progressResult;
    const { data: resume } = resumeResult;
    const { data: explored } = exploredResult;
    const { data: attempts } = attemptsResult;
    const { data: ownership } = ownershipResult;
    const responses = Object.fromEntries((attempts ?? []).map((item: any) => [item.prompt_id, String(item.response?.answer ?? item.response?.value ?? '')]));
    const cardIds = (ownership ?? []).map((item: any) => String(item.card_id));
    return normalizeLearnState({ learnerId: this.learnerId, lessonId, status: progress.status === 'completed' ? 'completed' : 'in-progress', completedAt: progress.completed_at ?? undefined, resumeSectionId: resume?.section_id, attemptedPromptIds: Object.keys(responses), exploredSectionIds: (explored ?? []).map((item: any) => item.section_id), responses, cardIds, cardId: cardIds[0], version: 1 });
  }
  async loadJourneySummaries(lessonIds: readonly string[]): Promise<Record<string, JourneyProgressSummary>> {
    const uniqueIds = [...new Set(lessonIds)];
    if (uniqueIds.length === 0) return {};
    const { data, error } = await this.client
      .from('lesson_progress')
      .select('lesson_id,status,completed_at')
      .eq('learner_id', this.learnerId)
      .in('lesson_id', uniqueIds);
    if (error) throw error;
    const stored = new Map((data ?? []).map((row: any) => [row.lesson_id, row]));
    return Object.fromEntries(uniqueIds.map((lessonId) => {
      const row = stored.get(lessonId);
      return [lessonId, {
        lessonId,
        status: row?.status === 'completed' ? 'completed' : 'in-progress',
        completedAt: row?.completed_at ?? undefined,
      }];
    }));
  }
  async markSection(lessonId: string, sectionId: string) {
    await this.ensure(lessonId);
    const [resume, explored] = await Promise.all([
      this.client.from('section_resume_state').upsert({ learner_id: this.learnerId, lesson_id: lessonId, section_id: sectionId, updated_at: new Date().toISOString() }, { onConflict: 'learner_id,lesson_id' }),
      this.client.from('lesson_section_exploration').upsert({ learner_id: this.learnerId, lesson_id: lessonId, section_id: sectionId }, { onConflict: 'learner_id,lesson_id,section_id', ignoreDuplicates: true }),
    ]);
    if (resume.error) throw resume.error; if (explored.error) throw explored.error; return this.load(lessonId);
  }
  async saveAttempt(lessonId: string, promptId: string, response: string) {
    await this.ensure(lessonId);
    const { error } = await this.client.from('understanding_prompt_attempts').insert({ learner_id: this.learnerId, lesson_id: lessonId, prompt_id: promptId, response: { answer: response } });
    if (error) throw error; return this.load(lessonId);
  }
  async complete(lessonId: string, idempotencyKey: string) {
    const { data, error } = await this.client.rpc('complete_lesson_and_acquire_card', { p_lesson_id: lessonId, p_idempotency_key: idempotencyKey });
    if (error) throw error;
    return mapCompletionRpcResult(data);
  }
}

export async function createProgressGateway(): Promise<LearnProgressGateway> {
  if (isSupabaseConfigured()) {
    const { data } = await supabase.auth.getUser();
    if (data.user) return new SupabaseLearnGateway(data.user.id);
  }
  return new LocalPreviewGateway();
}

export const completionKey = (lessonId: string) => `${lessonId}:${crypto.randomUUID()}`;
