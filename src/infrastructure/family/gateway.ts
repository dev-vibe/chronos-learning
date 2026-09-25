import { isSupabaseConfigured, supabase } from '../../../lib/supabase';

export type FamilyMember = { id: string; displayName?: string };
export type AccountSnapshot = {
  userId: string;
  email?: string;
  displayName?: string;
  linkCode: string;
  /** Parents who review this account's lessons. */
  parents: FamilyMember[];
  /** Learners this account reviews. */
  learners: FamilyMember[];
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
  loadReviewQueue(): Promise<ReviewItem[]>;
  review(learnerId: string, lessonId: string, decision: ReviewDecision, feedback: string, cardIds: string[]): Promise<void>;
}

/** Show codes in two groups of four so they are easy to read aloud. */
export const formatLinkCode = (code: string) => code.length === 8 ? `${code.slice(0, 4)}-${code.slice(4)}` : code;

const friendly: Record<string, string> = {
  'link code not found': 'That code didn’t match anyone. Check it and try again, or ask for a new one.',
  'you cannot link your own account': 'That’s your own code. Enter the code shown on the learner’s account.',
  'not linked to this learner': 'You are not linked to this learner any more.',
  'submission is not waiting for review': 'This lesson has already been reviewed.',
  'a note is required when sending work back': 'Add a note so they know what to change.',
  'Invalid login credentials': 'That email and password didn’t match.',
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
  async signIn(email: string, password: string) {
    const { error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }
  async signUp(email: string, password: string, displayName: string): Promise<SignUpResult> {
    const { data, error } = await this.client.auth.signUp({ email, password, options: { data: { name: displayName } } });
    if (error) throw error;
    return data.session ? 'signed-in' : 'confirm-email';
  }
  async signInWithGoogle() {
    const { error } = await this.client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/account` } });
    if (error) throw error;
  }
  async signOut() {
    const { error } = await this.client.auth.signOut();
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
    const [code, links] = await Promise.all([
      this.client.rpc('learner_link_code', { p_rotate: false }),
      this.client.from('guardian_links').select('guardian_id,learner_id'),
    ]);
    if (code.error) throw code.error;
    if (links.error) throw links.error;
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
      linkCode: String(code.data),
      parents: parentIds.map(member),
      learners: learnerIds.map(member),
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
  async loadReviewQueue(): Promise<ReviewItem[]> {
    const user = await this.requireUser();
    const links = await this.client.from('guardian_links').select('learner_id').eq('guardian_id', user.id);
    if (links.error) throw links.error;
    const learnerIds = ((links.data ?? []) as Array<{ learner_id: string }>).map((row) => row.learner_id);
    if (!learnerIds.length) return [];
    const { data, error } = await this.client
      .from('lesson_submissions')
      .select('learner_id,lesson_id,status,round,submitted_at,reviewed_at,feedback,answers')
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
  async loadReviewQueue(): Promise<ReviewItem[]> { return []; }
  async review() { this.unavailable(); }
}

export function createFamilyGateway(): FamilyGateway {
  return isSupabaseConfigured() ? new SupabaseFamilyGateway() : new UnavailableFamilyGateway();
}
