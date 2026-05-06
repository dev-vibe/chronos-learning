import { createDefaultUserProfile, createEmptyUserProfile, UserProfile } from './gamification';

const GUEST_PROFILE_KEY = 'chronos.guestProfile.v1';
const OFFLINE_QUEUE_KEY = 'chronos.offlineQueue.v1';
const MIGRATION_COMPLETED_KEY = 'chronos.migrationCompleted.v1';
const USE_DEMO_PROFILE = import.meta.env.VITE_DEMO_PROFILE === 'true';

export interface OfflineAction {
  id: string;
  type: 'ADD_XP' | 'UNLOCK_ARTIFACT' | 'COMPLETE_NODE';
  payload: any;
  timestamp: number;
  retryCount: number;
}

const canUseStorage = (): boolean => typeof window !== 'undefined' && Boolean(window.localStorage);

const readJson = <T,>(key: string, fallback: T): T => {
  if (!canUseStorage()) return fallback;

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown): void => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const LocalStorageService = {
  getGuestProfile: (): UserProfile => {
    const fallback = USE_DEMO_PROFILE ? createDefaultUserProfile() : createEmptyUserProfile();
    return readJson<UserProfile>(GUEST_PROFILE_KEY, fallback);
  },

  saveGuestProfile: (profile: UserProfile): void => {
    writeJson(GUEST_PROFILE_KEY, profile);
  },

  clearProfile: (): void => {
    if (!canUseStorage()) return;
    window.localStorage.removeItem(GUEST_PROFILE_KEY);
  },

  getProfileForMigration: (): UserProfile | null => {
    if (LocalStorageService.isMigrationCompleted()) return null;
    const profile = readJson<UserProfile | null>(GUEST_PROFILE_KEY, null);
    if (!profile) return null;
    return profile.xp > 0 || profile.nodesCompleted.length > 0 ? profile : null;
  },

  setMigrationCompleted: (): void => {
    if (!canUseStorage()) return;
    window.localStorage.setItem(MIGRATION_COMPLETED_KEY, 'true');
  },

  isMigrationCompleted: (): boolean => {
    if (!canUseStorage()) return false;
    return window.localStorage.getItem(MIGRATION_COMPLETED_KEY) === 'true';
  },

  enqueueAction: (action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>): void => {
    const queue = LocalStorageService.getQueue();
    queue.push({
      ...action,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      retryCount: 0
    });
    writeJson(OFFLINE_QUEUE_KEY, queue);
  },

  getQueue: (): OfflineAction[] => {
    return readJson<OfflineAction[]>(OFFLINE_QUEUE_KEY, []);
  },

  dequeueAction: (actionId: string): void => {
    const queue = LocalStorageService.getQueue().filter(action => action.id !== actionId);
    writeJson(OFFLINE_QUEUE_KEY, queue);
  },

  incrementRetryCount: (actionId: string): void => {
    const queue = LocalStorageService.getQueue().map(action =>
      action.id === actionId
        ? { ...action, retryCount: action.retryCount + 1, timestamp: Date.now() }
        : action
    );
    writeJson(OFFLINE_QUEUE_KEY, queue);
  },

  clearQueue: (): void => {
    if (!canUseStorage()) return;
    window.localStorage.removeItem(OFFLINE_QUEUE_KEY);
  }
};
