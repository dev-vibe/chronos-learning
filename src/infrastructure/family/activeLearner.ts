import { isSupabaseConfigured, supabase } from '../../../lib/supabase';

/**
 * Who is using Chronos right now.
 *
 * - `self`: a sign-in with no kid profiles, learning or reviewing as itself.
 * - `kid`: a shared account acting as one of its kid profiles. This is the
 *   default whenever a shared account opens Chronos.
 * - `parent`: a shared account in parent view, which lasts until the tab closes.
 */
export type LearnerView = 'self' | 'kid' | 'parent';
export type KidProfile = { id: string; displayName: string };
/** `linkedLearners` are kids with their own sign-in whom this account reviews. */
export type ActiveLearner = { userId: string; learnerId: string; view: LearnerView; profiles: KidProfile[]; linkedLearners?: KidProfile[] };

const KID_KEY = 'chronos.family.activeKid';
const PARENT_KEY = 'chronos.family.parentView';
const CACHE_KEY = 'chronos.family.profiles.v1';

const read = (storage: () => Storage | undefined, key: string) => { try { return storage()?.getItem(key) ?? null; } catch { return null; } };
const write = (storage: () => Storage | undefined, key: string, value: string | null) => {
  try { if (value === null) storage()?.removeItem(key); else storage()?.setItem(key, value); } catch { /* private mode */ }
};
const local = () => globalThis.localStorage;
const session = () => globalThis.sessionStorage;

/** Pick the acting learner. Shared accounts default to the last kid used. */
export function chooseActiveLearner(userId: string, profiles: KidProfile[], storedKidId: string | null, parentView: boolean, linkedLearners: KidProfile[] = []): ActiveLearner {
  if (!profiles.length) return { userId, learnerId: userId, view: 'self', profiles, linkedLearners };
  if (parentView) return { userId, learnerId: userId, view: 'parent', profiles, linkedLearners };
  const kid = profiles.find((profile) => profile.id === storedKidId) ?? profiles[0];
  return { userId, learnerId: kid.id, view: 'kid', profiles, linkedLearners };
}

/**
 * Whether the parent area (kids, progress, review) belongs in the main
 * navigation. A sign-in with kids of its own shows it only in parent view, so a
 * kid using the shared sign-in never sees it. A sign-in that only reviews linked
 * kids shows it whenever any are linked.
 */
export function hasParentArea(active: ActiveLearner | null | undefined): boolean {
  if (!active) return false;
  if (active.profiles.length) return active.view === 'parent';
  return (active.linkedLearners?.length ?? 0) > 0;
}

async function loadLinkedLearners(client: typeof supabase, guardianId: string): Promise<KidProfile[]> {
  try {
    const { data: links } = await client.from('guardian_links').select('learner_id').eq('guardian_id', guardianId) as unknown as { data: Array<{ learner_id: string }> | null };
    const ids = (links ?? []).map((row) => row.learner_id);
    if (!ids.length) return [];
    const { data: rows } = await client.from('learners').select('id,display_name').in('id', ids).order('created_at', { ascending: true }) as unknown as { data: Array<{ id: string; display_name: string | null }> | null };
    return (rows ?? []).map((row) => ({ id: row.id, displayName: row.display_name ?? 'Kid' }));
  } catch { return []; }
}

export async function loadActiveLearner(client: typeof supabase = supabase): Promise<ActiveLearner | null> {
  const { data } = await client.auth.getUser();
  const user = data.user;
  if (!user) { write(local, CACHE_KEY, null); return null; }
  const { data: rows, error } = await client
    .from('learners')
    .select('id,display_name')
    .eq('account_id', user.id)
    .neq('id', user.id)
    .order('created_at', { ascending: true });
  if (error) throw error;
  const profiles = ((rows ?? []) as Array<{ id: string; display_name: string | null }>).map((row) => ({ id: row.id, displayName: row.display_name ?? 'Kid' }));
  const linkedLearners = await loadLinkedLearners(client, user.id);
  write(local, CACHE_KEY, JSON.stringify({ userId: user.id, profiles, linkedLearners }));
  return chooseActiveLearner(user.id, profiles, read(local, KID_KEY), read(session, PARENT_KEY) === '1', linkedLearners);
}

let pending: Promise<ActiveLearner | null> | undefined;
/** The acting learner for this page load, shared by every gateway on the page. */
export function resolveActiveLearner(): Promise<ActiveLearner | null> {
  if (!isSupabaseConfigured()) return Promise.resolve(null);
  pending ??= loadActiveLearner().catch(() => null);
  return pending;
}

/** The last known profiles, for drawing the switcher before the network answers. */
export function cachedActiveLearner(): ActiveLearner | null {
  if (!isSupabaseConfigured()) return null;
  try {
    const cached = JSON.parse(read(local, CACHE_KEY) ?? 'null') as { userId: string; profiles: KidProfile[]; linkedLearners?: KidProfile[] } | null;
    if (!cached?.userId || !Array.isArray(cached.profiles)) return null;
    return chooseActiveLearner(cached.userId, cached.profiles, read(local, KID_KEY), read(session, PARENT_KEY) === '1', Array.isArray(cached.linkedLearners) ? cached.linkedLearners : []);
  } catch { return null; }
}

export function rememberKid(kidId: string) {
  write(local, KID_KEY, kidId);
  write(session, PARENT_KEY, null);
}
export function enterParentView() { write(session, PARENT_KEY, '1'); }
export function forgetFamilyView() {
  write(local, KID_KEY, null);
  write(local, CACHE_KEY, null);
  write(session, PARENT_KEY, null);
}

/** Pages that belong to parent view send a kid back Home after switching. */
export function switchToKid(kidId: string, location: Pick<Location, 'pathname' | 'assign' | 'reload'> = window.location) {
  rememberKid(kidId);
  if (location.pathname === '/review' || location.pathname === '/account') location.assign('/home');
  else location.reload();
}
export function switchToParent(location: Pick<Location, 'assign'> = window.location, destination = '/review') {
  enterParentView();
  location.assign(destination);
}

export const FAMILY_CHANGED_EVENT = 'chronos:family-changed';
/** Re-read profiles after sign-in, sign-out or adding and removing kids. */
export function refreshActiveLearner() {
  pending = undefined;
  try { window.dispatchEvent(new Event(FAMILY_CHANGED_EVENT)); } catch { /* no window */ }
}
