/**
 * Centralized localStorage service for Chronos Learning Terminal
 * Handles user profile, offline queue, and migration data
 */

export interface UserProfile {
  xp: number;
  level: number;
  artifacts: string[]; // List of Artifact IDs
  nodesCompleted: string[]; // List of Node IDs
}

export interface OfflineAction {
  id: string;
  type: 'ADD_XP' | 'UNLOCK_ARTIFACT' | 'COMPLETE_NODE';
  payload: any;
  timestamp: number;
  retryCount: number;
}

const PROFILE_STORAGE_KEY = 'chronos_agent_profile_v1';
const QUEUE_STORAGE_KEY = 'chronos_offline_queue_v1';
const MIGRATION_FLAG_KEY = 'chronos_migration_completed_v1';

const INITIAL_PROFILE: UserProfile = {
  xp: 0,
  level: 1,
  artifacts: [],
  nodesCompleted: []
};

// Level Curve: Level = sqrt(XP / 100) + 1
export const calculateLevel = (xp: number) => Math.floor(Math.sqrt(xp / 100)) + 1;

export const LocalStorageService = {
  // ============ Profile Methods ============

  /**
   * Get user profile from localStorage
   */
  getProfile: (): UserProfile | null => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load profile from localStorage', e);
      return null;
    }
  },

  /**
   * Save user profile to localStorage
   */
  saveProfile: (profile: UserProfile): void => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile to localStorage', e);
    }
  },

  /**
   * Clear profile from localStorage
   */
  clearProfile: (): void => {
    try {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear profile from localStorage', e);
    }
  },

  /**
   * Get profile for migration (check if local data exists)
   */
  getProfileForMigration: (): UserProfile | null => {
    const profile = LocalStorageService.getProfile();
    // Only return profile if it has actual progress (not just the initial state)
    if (profile && (profile.xp > 0 || profile.artifacts.length > 0 || profile.nodesCompleted.length > 0)) {
      return profile;
    }
    return null;
  },

  /**
   * Check if migration has been completed
   */
  isMigrationCompleted: (): boolean => {
    try {
      return localStorage.getItem(MIGRATION_FLAG_KEY) === 'true';
    } catch (e) {
      console.error('Failed to check migration status', e);
      return false;
    }
  },

  /**
   * Mark migration as completed
   */
  setMigrationCompleted: (): void => {
    try {
      localStorage.setItem(MIGRATION_FLAG_KEY, 'true');
    } catch (e) {
      console.error('Failed to set migration flag', e);
    }
  },

  // ============ Offline Queue Methods ============

  /**
   * Get offline queue
   */
  getQueue: (): OfflineAction[] => {
    try {
      const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load offline queue', e);
      return [];
    }
  },

  /**
   * Save offline queue
   */
  saveQueue: (queue: OfflineAction[]): void => {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.error('Failed to save offline queue', e);
    }
  },

  /**
   * Add action to offline queue
   */
  enqueueAction: (action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>): void => {
    const queue = LocalStorageService.getQueue();
    const newAction: OfflineAction = {
      ...action,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0
    };
    queue.push(newAction);
    LocalStorageService.saveQueue(queue);
  },

  /**
   * Remove action from queue by id
   */
  dequeueAction: (actionId: string): void => {
    const queue = LocalStorageService.getQueue();
    const filtered = queue.filter(action => action.id !== actionId);
    LocalStorageService.saveQueue(filtered);
  },

  /**
   * Clear all actions from queue
   */
  clearQueue: (): void => {
    try {
      localStorage.removeItem(QUEUE_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear offline queue', e);
    }
  },

  /**
   * Update retry count for an action
   */
  incrementRetryCount: (actionId: string): void => {
    const queue = LocalStorageService.getQueue();
    const updated = queue.map(action =>
      action.id === actionId
        ? { ...action, retryCount: action.retryCount + 1 }
        : action
    );
    LocalStorageService.saveQueue(updated);
  },

  // ============ Utility Methods ============

  /**
   * Merge two profiles (used for conflict resolution during sync)
   * Strategy: Max XP, union of artifacts and completed nodes
   */
  mergeProfiles: (local: UserProfile, cloud: UserProfile): UserProfile => {
    const xp = Math.max(local.xp, cloud.xp);
    const artifacts = Array.from(new Set([...local.artifacts, ...cloud.artifacts]));
    const nodesCompleted = Array.from(new Set([...local.nodesCompleted, ...cloud.nodesCompleted]));

    return {
      xp,
      level: calculateLevel(xp),
      artifacts,
      nodesCompleted
    };
  }
};
