import { isSupabaseConfigured, supabase } from '../../../lib/supabase';
import { enterParentView, forgetFamilyView } from './activeLearner';
import { parseSubmittedQuestions, type SubmittedQuestion } from '../../domains/submissions';

export type FamilyMember = { id: string; displayName?: string };
/** separate: kids have their own sign-ins (recommended). shared: kid profiles on this sign-in. learner: just me. */
export type AccountSetup = 'separate' | 'shared' | 'learner';
export type AccountSnapshot = {
  userId: string;
  email?: string;
  displayName?: string;
  setup?: AccountSetup;
  linkCode: string;
  /** Parents who review this account's lessons. */
  parents: FamilyMember[];
  /** Learners with their own sign-ins that this account reviews. */
  learners: FamilyMember[];
  /** Kid profiles held by this sign-in (shared account). */
  profiles: FamilyMember[];
  /** Whether parent view on this shared account is locked with a PIN. */
  parentPin: boolean;
};
export type SubmissionStatus = 'submitted' | 'returned' | 'passed';
export type ReviewItem = {
  learnerId: string;
  lessonId: string;
  status: SubmissionStatus;
  round: number;
  submittedAt: string;
  reviewedAt?: string;
  feedback?: string;
  answers: Record<string, string>;
  /** The questions as the learner saw them when submitting. Absent for submissions made before snapshots existed. */
  questions?: SubmittedQuestion[];
};
export type ReviewDecision = 'pass' | 'return';
export type SignUpResult = 'signed-in' | 'confirm-email';

export interface FamilyGateway {
  readonly available: boolean;
  session(): Promise<{ userId: string; email?: string } | null>;
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string, displayName: string): Promise<SignUpResult>;
  signInWithGoogle(): Promise<void>;
  signOut(): Promise<void>;
  loadAccount(): Promise<AccountSnapshot>;
  saveDisplayName(displayName: string): Promise<void>;
  rotateLinkCode(): Promise<string>;
  linkLearner(code: string): Promise<FamilyMember>;
  unlink(guardianId: string, learnerId: string): Promise<void>;
  saveSetup(setup: AccountSetup): Promise<void>;
  addProfile(displayName: string): Promise<FamilyMember>;
  renameProfile(id: string, displayName: string): Promise<void>;
  removeProfile(id: string): Promise<void>;
  setParentPin(pin: string | null): Promise<void>;
  /** True when the PIN matches, or when no PIN is set. */
  verifyParentPin(pin: string): Promise<boolean>;
  parentPinEnabled(): Promise<boolean>;
  loadReviewQueue(): Promise<ReviewItem[]>;
  review(learnerId: string, lessonId: string, decision: ReviewDecision, feedback: string, cardIds: string[]): Promise<void>;
}

const questionsOf = (value: unknown) => {
  const questions = parseSubmittedQuestions(value);
  return questions ? { questions } : {};
};

/** Show codes in two groups of four so they are easy to read aloud. */
export const formatLinkCode = (code: string) => code.length === 8 ? `${code.slice(0, 4)}-${code.slice(4)}` : code;

const friendly: Record<string, string> = {
  'link code not found': 'That code didn’t match anyone. Check it and try again, or ask for a new one.',
  'you cannot link your own account': 'That’s your own code. Enter the code shown on the learner’s account.',
  'not linked to this learner': 'You are not linked to this learner any more.',
  'submission is not waiting for review': 'This lesson has already been reviewed.',
  'a note is required when sending work back': 'Add a note so they know what to change.',
  'Invalid login credentials': 'That email and password didn’t match.',
  'a name is required': 'Add a name first.',
  'an account can hold up to 10 kids': 'An account can hold up to 10 kids.',
  'the PIN must be 4 digits': 'The PIN must be 4 digits.',
  'too many tries': 'Too many wrong tries. Wait five minutes and try again.',
};
export function familyErrorMessage(error: unknown, fallback: string): string {
  const message = typeof error === 'object' && error && 'message' in error ? String((error as { message: unknown }).message) : '';
  return friendly[message] ?? (message && /password|email/i.test(message) ? message : fallback);
}

type SupabaseClient = typeof supabase;

export class SupabaseFamilyGateway implements FamilyGateway {
  readonly available = true;
  constructor(private client: SupabaseClient = supabase) {}

  async session() {
    const { data } = await this.client.auth.getUser();
    return data.user ? { userId: data.user.id, email: data.user.email ?? undefined } : null;
  }
  // A fresh sign-in is the account holder, so it opens in parent view. This is
  // also how a parent who forgot the PIN gets back in to change it.
  async signIn(email: string, password: string) {
    const { error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    enterParentView();
  }
  async signUp(email: string, password: string, displayName: string): Promise<SignUpResult> {
    const { data, error } = await this.client.auth.signUp({ email, password, options: { data: { name: displayName } } });
    if (error) throw error;
    if (data.session) enterParentView();
    return data.session ? 'signed-in' : 'confirm-email';
  }
  async signInWithGoogle() {
    const { error } = await this.client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/account?signed-in=1` } });
    if (error) throw error;
  }
  async signOut() {
    const { error } = await this.client.auth.signOut();
    forgetFamilyView();
    if (error) throw error;
  }

  private async requireUser() {
    const { data, error } = await this.client.auth.getUser();
    if (error || !data.user) throw error ?? new Error('Sign in first');
    return data.user;
  }

  async loadAccount(): Promise<AccountSnapshot> {
    const user = await this.requireUser();
    const suggestedName = String(user.user_metadata?.name ?? user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? '').trim().slice(0, 60) || null;
    const created = await this.client.from('learners').upsert({ id: user.id, display_name: suggestedName }, { onConflict: 'id', ignoreDuplicates: true });
    if (created.error) throw created.error;
    const [code, links, own, kids, pin] = await Promise.all([
      this.client.rpc('learner_link_code', { p_rotate: false }),
      this.client.from('guardian_links').select('guardian_id,learner_id'),
      this.client.from('learners').select('account_setup').eq('id', user.id).maybeSingle(),
      this.client.from('learners').select('id,display_name').eq('account_id', user.id).neq('id', user.id).order('created_at', { ascending: true }),
      this.client.rpc('parent_pin_enabled'),
    ]);
    for (const result of [code, links, own, kids, pin]) if (result.error) throw result.error;
    const rows = (links.data ?? []) as Array<{ guardian_id: string; learner_id: string }>;
    const parentIds = rows.filter((row) => row.learner_id === user.id).map((row) => row.guardian_id);
    const learnerIds = rows.filter((row) => row.guardian_id === user.id).map((row) => row.learner_id);
    const names = await this.client.from('learners').select('id,display_name').in('id', [user.id, ...parentIds, ...learnerIds]);
    if (names.error) throw names.error;
    const nameById = new Map(((names.data ?? []) as Array<{ id: string; display_name: string | null }>).map((row) => [row.id, row.display_name ?? undefined]));
    const member = (id: string): FamilyMember => ({ id, ...(nameById.get(id) ? { displayName: nameById.get(id) } : {}) });
    return {
      userId: user.id,
      ...(user.email ? { email: user.email } : {}),
      ...(nameById.get(user.id) ? { displayName: nameById.get(user.id) } : {}),
      ...(own.data?.account_setup ? { setup: own.data.account_setup as AccountSetup } : {}),
      linkCode: String(code.data),
      parents: parentIds.map(member),
      learners: learnerIds.map(member),
      profiles: ((kids.data ?? []) as Array<{ id: string; display_name: string | null }>).map((row) => ({ id: row.id, displayName: row.display_name ?? 'Kid' })),
      parentPin: Boolean(pin.data),
    };
  }
  async saveDisplayName(displayName: string) {
    const user = await this.requireUser();
    const { error } = await this.client.from('learners').update({ display_name: displayName.trim() }).eq('id', user.id);
    if (error) throw error;
  }
  async rotateLinkCode() {
    const { data, error } = await this.client.rpc('learner_link_code', { p_rotate: true });
    if (error) throw error;
    return String(data);
  }
  async linkLearner(code: string): Promise<FamilyMember> {
    const { data, error } = await this.client.rpc('link_learner', { p_code: code });
    if (error) throw error;
    const result = data as { learnerId: string; displayName?: string | null };
    return { id: result.learnerId, ...(result.displayName ? { displayName: result.displayName } : {}) };
  }
  async unlink(guardianId: string, learnerId: string) {
    const { error } = await this.client.from('guardian_links').delete().eq('guardian_id', guardianId).eq('learner_id', learnerId);
    if (error) throw error;
  }
  async saveSetup(setup: AccountSetup) {
    const user = await this.requireUser();
    const { error } = await this.client.from('learners').update({ account_setup: setup }).eq('id', user.id);
    if (error) throw error;
  }
  async addProfile(displayName: string): Promise<FamilyMember> {
    const { data, error } = await this.client.rpc('add_learner_profile', { p_display_name: displayName });
    if (error) throw error;
    const result = data as { id: string; displayName: string };
    return { id: result.id, displayName: result.displayName };
  }
  async renameProfile(id: string, displayName: string) {
    const { error } = await this.client.from('learners').update({ display_name: displayName.trim() }).eq('id', id);
    if (error) throw error;
  }
  async removeProfile(id: string) {
    const { error } = await this.client.rpc('remove_learner_profile', { p_learner_id: id });
    if (error) throw error;
  }
  async setParentPin(pin: string | null) {
    const { error } = await this.client.rpc('set_parent_pin', { p_pin: pin });
    if (error) throw error;
  }
  async verifyParentPin(pin: string) {
    const { data, error } = await this.client.rpc('verify_parent_pin', { p_pin: pin });
    if (error) throw error;
    return Boolean(data);
  }
  async parentPinEnabled() {
    const { data, error } = await this.client.rpc('parent_pin_enabled');
    if (error) throw error;
    return Boolean(data);
  }
  async loadReviewQueue(): Promise<ReviewItem[]> {
    const user = await this.requireUser();
    const [links, kids] = await Promise.all([
      this.client.from('guardian_links').select('learner_id').eq('guardian_id', user.id),
      this.client.from('learners').select('id').eq('account_id', user.id).neq('id', user.id),
    ]);
    if (links.error) throw links.error;
    if (kids.error) throw kids.error;
    const learnerIds = [...new Set([
      ...((links.data ?? []) as Array<{ learner_id: string }>).map((row) => row.learner_id),
      ...((kids.data ?? []) as Array<{ id: string }>).map((row) => row.id),
    ])];
    if (!learnerIds.length) return [];
    const { data, error } = await this.client
      .from('lesson_submissions')
      .select('learner_id,lesson_id,status,round,submitted_at,reviewed_at,feedback,answers,questions')
      .in('learner_id', learnerIds)
      .order('submitted_at', { ascending: false });
    if (error) throw error;
    return ((data ?? []) as any[]).map((row) => ({
      learnerId: String(row.learner_id),
      lessonId: String(row.lesson_id),
      status: row.status as SubmissionStatus,
      round: Number(row.round ?? 1),
      submittedAt: String(row.submitted_at),
      ...(row.reviewed_at ? { reviewedAt: String(row.reviewed_at) } : {}),
      ...(row.feedback ? { feedback: String(row.feedback) } : {}),
      answers: Object.fromEntries(Object.entries(row.answers ?? {}).map(([key, value]) => [key, String(value)])),
      ...questionsOf(row.questions),
    }));
  }
  async review(learnerId: string, lessonId: string, decision: ReviewDecision, feedback: string, cardIds: string[]) {
    const { error } = await this.client.rpc('review_submission', {
      p_learner_id: learnerId,
      p_lesson_id: lessonId,
      p_decision: decision,
      p_feedback: feedback,
      p_card_ids: decision === 'pass' ? cardIds : [],
    });
    if (error) throw error;
  }
}

/** Used when this build has no Supabase project configured, such as local development. */
class UnavailableFamilyGateway implements FamilyGateway {
  readonly available = false;
  async session() { return null; }
  private unavailable(): never { throw new Error('Accounts are not set up in this environment.'); }
  async signIn() { this.unavailable(); }
  async signUp(): Promise<SignUpResult> { this.unavailable(); }
  async signInWithGoogle() { this.unavailable(); }
  async signOut() {}
  async loadAccount(): Promise<AccountSnapshot> { this.unavailable(); }
  async saveDisplayName() { this.unavailable(); }
  async rotateLinkCode(): Promise<string> { this.unavailable(); }
  async linkLearner(): Promise<FamilyMember> { this.unavailable(); }
  async unlink() { this.unavailable(); }
  async saveSetup() { this.unavailable(); }
  async addProfile(): Promise<FamilyMember> { this.unavailable(); }
  async renameProfile() { this.unavailable(); }
  async removeProfile() { this.unavailable(); }
  async setParentPin() { this.unavailable(); }
  async verifyParentPin() { return true; }
  async parentPinEnabled() { return false; }
  async loadReviewQueue(): Promise<ReviewItem[]> { return []; }
  async review() { this.unavailable(); }
}

export function createFamilyGateway(): FamilyGateway {
  return isSupabaseConfigured() ? new SupabaseFamilyGateway() : new UnavailableFamilyGateway();
}
