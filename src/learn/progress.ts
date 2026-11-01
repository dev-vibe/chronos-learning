import type { LessonProgress } from '../domains/contracts';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { chronosContent } from '../../content/chronos';
import { resolveActiveLearner, type ActiveLearner, type LearnerView } from '../infrastructure/family/activeLearner';
import { snapshotGuesses, snapshotQuestions, writtenPrompts, type SubmittedGuess, type SubmittedQuestion } from '../domains/submissions';
import { isGuessId, lessonGuesses } from '../domains/guesses';
import { isPromptAnswered } from './prompt-requirements';

export type PromptResponses = Record<string, string>;
/** Saved "guess before reading" answers, by guess ID. Kept apart from prompt responses so they never count as checks. */
export type GuessResponses = Record<string, string>;
export type ReviewStatus = 'submitted' | 'returned' | 'passed';
/** A parent's review of the learner's submitted answers for one lesson. */
export type LessonReview = { status: ReviewStatus; round: number; submittedAt: string; reviewedAt?: string; feedback?: string; cardIds: string[]; passSeenAt?: string };
/** Present only for signed-in learners; guests have no parent to review their work. */
export type LearnAccount = { parentLinked: boolean; view?: LearnerView };
export type LearnState = LessonProgress & { exploredSectionIds: string[]; responses: PromptResponses; guesses?: GuessResponses; cardIds?: string[]; cardId?: string; review?: LessonReview; account?: LearnAccount; version: 1 };
export type JourneyProgressSummary = Pick<LessonProgress, 'lessonId' | 'status' | 'completedAt'>;
export type PassNotice = { lessonId: string; cardIds: string[]; feedback?: string };
export type ReturnedNotice = { lessonId: string; feedback: string };
export type ReviewInbox = { passes: PassNotice[]; returned: ReturnedNotice[]; waitingForMyReview: number };
export interface LearnProgressGateway {
  load(lessonId: string): Promise<LearnState>;
  loadJourneySummaries(lessonIds: readonly string[]): Promise<Record<string, JourneyProgressSummary>>;
  markSection(lessonId: string, sectionId: string): Promise<LearnState>;
  saveAttempt(lessonId: string, promptId: string, response: string): Promise<LearnState>;
  /** Save the learner's guess before reading. Not an attempt at a check: it is never graded or required. */
  saveGuess(lessonId: string, guessId: string, guess: string): Promise<LearnState>;
  /** Finish the lesson and send the learner's latest answers for review. */
  submit(lessonId: string): Promise<LearnState>;
  loadInbox(): Promise<ReviewInbox>;
  acknowledgePass(lessonId: string): Promise<void>;
}

const key = (lessonId: string) => `chronos.learn.preview.v1:${lessonId}`;
const empty = (lessonId: string): LearnState => ({ learnerId: 'anonymous-preview', lessonId, status: 'in-progress', attemptedPromptIds: [], exploredSectionIds: [], responses: {}, guesses: {}, version: 1 });
export const lessonPromptIds = (lessonId: string): string[] => chronosContent.lessons.find((item) => item.id === lessonId)?.promptIds ?? [];
const currentSectionIds = (lessonId: string) => new Set(chronosContent.lessons.find((item) => item.id === lessonId)?.sections.map((section) => section.id) ?? []);
/** The cards a parent's pass grants, taken from the repository content bundle. */
export const cardsForLesson = (lessonId: string) => chronosContent.cards.filter((card) => card.unlockLessonId === lessonId).map((card) => card.id);
const lessonGuessModules = (lessonId: string) => lessonGuesses(chronosContent.lessons.find((item) => item.id === lessonId));
const lessonPrompts = (lessonId: string) => lessonPromptIds(lessonId).map((id) => chronosContent.prompts.find((prompt) => prompt.id === id)).filter((prompt): prompt is NonNullable<typeof prompt> => Boolean(prompt));
/**
 * What goes to the parent: the lesson's written answers, plus the learner's guess before reading (shown apart and never graded).
 * Multiple-choice checks are finished once answered correctly.
 */
export const submissionAnswers = (lessonId: string, responses: PromptResponses, guesses: GuessResponses = {}): PromptResponses => ({
  ...Object.fromEntries(snapshotGuesses(lessonGuessModules(lessonId), guesses).map((guess) => [guess.promptId, guesses[guess.promptId]])),
  ...Object.fromEntries(writtenPrompts(lessonPrompts(lessonId)).filter((prompt) => typeof responses[prompt.id] === 'string').map((prompt) => [prompt.id, responses[prompt.id]])),
});
/** The questions as the learner sees them (the saved guess first, then the written questions), stored with the answers so Review can show them after they change. */
export const submissionQuestions = (lessonId: string, guesses: GuessResponses = {}): Array<SubmittedGuess | SubmittedQuestion> =>
  [...snapshotGuesses(lessonGuessModules(lessonId), guesses), ...snapshotQuestions(lessonPrompts(lessonId))];
/** Whether every required check is done: the best answer picked, or a written answer saved. */
export const requiredChecksDone = (lessonId: string, responses: PromptResponses) =>
  lessonPrompts(lessonId).filter((prompt) => prompt.required).every((prompt) => isPromptAnswered(prompt, responses[prompt.id]));
const emptyInbox = (): ReviewInbox => ({ passes: [], returned: [], waitingForMyReview: 0 });

/** Drops sections and prompts the lesson no longer has, so they never count towards or against it. */
export function normalizeLearnState(state: LearnState): LearnState {
  const currentPrompts = new Set(lessonPromptIds(state.lessonId));
  const attemptedPromptIds = state.attemptedPromptIds.filter((id) => currentPrompts.has(id));
  const responses = Object.fromEntries(Object.entries(state.responses).filter(([id]) => currentPrompts.has(id)));
  const currentGuesses = new Set(lessonGuessModules(state.lessonId).map((guess) => guess.id));
  const guesses = Object.fromEntries(Object.entries(state.guesses ?? {}).filter(([id]) => currentGuesses.has(id)));
  const validSections = currentSectionIds(state.lessonId);
  const resumeSectionId = state.resumeSectionId && validSections.has(state.resumeSectionId) ? state.resumeSectionId : undefined;
  const exploredSectionIds = [...new Set(state.exploredSectionIds.filter((sectionId) => validSections.has(sectionId)))];
  const cardIds = [...new Set([...(state.cardIds ?? []), ...(state.cardId ? [state.cardId] : [])])];
  return { ...state, attemptedPromptIds, responses, guesses, resumeSectionId, exploredSectionIds, cardIds, cardId: cardIds[0] };
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
  async saveGuess(lessonId: string, guessId: string, guess: string) {
    const state = this.read(lessonId);
    state.guesses = { ...(state.guesses ?? {}), [guessId]: guess };
    return this.write(state);
  }
  /** Guests finish lessons in this browser only. Cards need a parent's pass, which needs an account. */
  async submit(lessonId: string) {
    const state = this.read(lessonId);
    // Finishing happens once. A prompt added or replaced later never un-finishes the lesson.
    if (state.status === 'completed') return state;
    if (!requiredChecksDone(lessonId, state.responses)) throw new Error('required prompt attempts missing');
    state.status = 'completed'; state.completedAt = new Date().toISOString();
    return this.write(state);
  }
  async loadInbox() { return emptyInbox(); }
  async acknowledgePass(_lessonId: string) {}
}

type SupabaseClient = typeof supabase;
const mapReview = (row: any): LessonReview | undefined => {
  if (!row || !['submitted', 'returned', 'passed'].includes(row.status)) return undefined;
  return {
    status: row.status,
    round: Number(row.round ?? 1),
    submittedAt: String(row.submitted_at),
    ...(row.reviewed_at ? { reviewedAt: String(row.reviewed_at) } : {}),
    ...(row.feedback ? { feedback: String(row.feedback) } : {}),
    cardIds: Array.isArray(row.card_ids) ? row.card_ids.map(String) : [],
    ...(row.pass_seen_at ? { passSeenAt: String(row.pass_seen_at) } : {}),
  };
};

export class SupabaseLearnGateway implements LearnProgressGateway {
  private active: ActiveLearner;
  /** `active` says whether this sign-in is acting as itself, a kid profile, or in parent view. */
  constructor(private learnerId: string, private client: SupabaseClient = supabase, active?: ActiveLearner) {
    this.active = active ?? { userId: learnerId, learnerId, view: 'self', profiles: [] };
  }
  private async ensure(lessonId: string) {
    // A kid profile's learner row already exists and belongs to the parent's sign-in.
    if (this.learnerId === this.active.userId) {
      const learner = await this.client.from('learners').upsert(
        { id: this.learnerId },
        { onConflict: 'id', ignoreDuplicates: true },
      );
      if (learner.error) throw learner.error;
    }

    const progress = await this.client.from('lesson_progress').upsert(
      { learner_id: this.learnerId, lesson_id: lessonId },
      { onConflict: 'learner_id,lesson_id', ignoreDuplicates: true },
    );
    if (progress.error) throw progress.error;
  }
  async load(lessonId: string): Promise<LearnState> {
    await this.ensure(lessonId);
    const [progressResult, resumeResult, exploredResult, attemptsResult, ownershipResult, submissionResult, parentsResult] = await Promise.all([
      this.client.from('lesson_progress').select('status,completed_at').eq('learner_id', this.learnerId).eq('lesson_id', lessonId).single(),
      this.client.from('section_resume_state').select('section_id').eq('learner_id', this.learnerId).eq('lesson_id', lessonId).maybeSingle(),
      this.client.from('lesson_section_exploration').select('section_id').eq('learner_id', this.learnerId).eq('lesson_id', lessonId),
      this.client.from('understanding_prompt_attempts').select('prompt_id,response').eq('learner_id', this.learnerId).eq('lesson_id', lessonId).order('attempted_at', { ascending: true }),
      this.client.from('card_ownership').select('card_id').eq('learner_id', this.learnerId).eq('source_lesson_id', lessonId),
      this.client.from('lesson_submissions').select('status,round,submitted_at,reviewed_at,feedback,card_ids,pass_seen_at').eq('learner_id', this.learnerId).eq('lesson_id', lessonId).maybeSingle(),
      this.client.from('guardian_links').select('guardian_id').eq('learner_id', this.learnerId),
    ]);
    const failed = [progressResult, resumeResult, exploredResult, attemptsResult, ownershipResult, submissionResult, parentsResult].find((result) => result.error);
    if (failed?.error) throw failed.error;
    const { data: progress } = progressResult;
    if (!progress) throw new Error('Lesson progress could not be loaded');
    const { data: resume } = resumeResult;
    const { data: explored } = exploredResult;
    const { data: attempts } = attemptsResult;
    const { data: ownership } = ownershipResult;
    // Attempts arrive oldest first, so the latest response to each prompt wins.
    // Guesses share the table but are tagged `kind: 'guess'` and kept apart, so they never count as checks.
    const isGuessRow = (item: any) => item.response?.kind === 'guess' || isGuessId(String(item.prompt_id));
    const text = (item: any) => String(item.response?.answer ?? item.response?.value ?? '');
    const responses = Object.fromEntries((attempts ?? []).filter((item: any) => !isGuessRow(item)).map((item: any) => [item.prompt_id, text(item)]));
    const guesses = Object.fromEntries((attempts ?? []).filter(isGuessRow).map((item: any) => [item.prompt_id, text(item)]));
    const cardIds = (ownership ?? []).map((item: any) => String(item.card_id));
    const review = mapReview(submissionResult.data);
    return normalizeLearnState({ learnerId: this.learnerId, lessonId, status: progress.status === 'completed' ? 'completed' : 'in-progress', completedAt: progress.completed_at ?? undefined, resumeSectionId: resume?.section_id, attemptedPromptIds: Object.keys(responses), exploredSectionIds: (explored ?? []).map((item: any) => item.section_id), responses, guesses, cardIds, cardId: cardIds[0], ...(review ? { review } : {}), account: { parentLinked: (parentsResult.data ?? []).length > 0 || this.active.view === 'kid', view: this.active.view }, version: 1 });
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
  async saveGuess(lessonId: string, guessId: string, guess: string) {
    await this.ensure(lessonId);
    const { error } = await this.client.from('understanding_prompt_attempts').insert({ learner_id: this.learnerId, lesson_id: lessonId, prompt_id: guessId, response: { answer: guess, kind: 'guess' } });
    if (error) throw error; return this.load(lessonId);
  }
  async submit(lessonId: string) {
    const current = await this.load(lessonId);
    const answers = submissionAnswers(lessonId, current.responses, current.guesses);
    const { error } = await this.client.rpc('submit_lesson', { p_lesson_id: lessonId, p_answers: answers, p_learner_id: this.learnerId, p_questions: submissionQuestions(lessonId, current.guesses) });
    if (error) throw error;
    return this.load(lessonId);
  }
  async loadInbox(): Promise<ReviewInbox> {
    const [mine, links] = await Promise.all([
      this.client.from('lesson_submissions').select('lesson_id,status,feedback,card_ids,pass_seen_at').eq('learner_id', this.learnerId).in('status', ['passed', 'returned']),
      this.client.from('guardian_links').select('learner_id').eq('guardian_id', this.learnerId),
    ]);
    if (mine.error) throw mine.error;
    if (links.error) throw links.error;
    const rows = (mine.data ?? []) as any[];
    // Parent view also reviews the kid profiles on this sign-in.
    const managedIds = this.active.view === 'parent' ? this.active.profiles.map((profile) => profile.id) : [];
    const learnerIds = [...new Set([...((links.data ?? []) as any[]).map((row) => String(row.learner_id)), ...managedIds])];
    let waitingForMyReview = 0;
    if (learnerIds.length) {
      const waiting = await this.client.from('lesson_submissions').select('lesson_id', { count: 'exact', head: true }).eq('status', 'submitted').in('learner_id', learnerIds);
      if (waiting.error) throw waiting.error;
      waitingForMyReview = waiting.count ?? 0;
    }
    return {
      passes: rows.filter((row) => row.status === 'passed' && !row.pass_seen_at).map((row) => ({ lessonId: String(row.lesson_id), cardIds: (row.card_ids ?? []).map(String), ...(row.feedback ? { feedback: String(row.feedback) } : {}) })),
      returned: rows.filter((row) => row.status === 'returned').map((row) => ({ lessonId: String(row.lesson_id), feedback: String(row.feedback ?? '') })),
      waitingForMyReview,
    };
  }
  async acknowledgePass(lessonId: string) {
    const { error } = await this.client.rpc('acknowledge_pass', { p_lesson_id: lessonId, p_learner_id: this.learnerId });
    if (error) throw error;
  }
}

export async function createProgressGateway(): Promise<LearnProgressGateway> {
  if (isSupabaseConfigured()) {
    const active = await resolveActiveLearner();
    if (active) return new SupabaseLearnGateway(active.learnerId, supabase, active);
  }
  return new LocalPreviewGateway();
}
