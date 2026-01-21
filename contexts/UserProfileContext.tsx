/**
 * User Profile Context
 * Manages user profile with cloud sync and offline support
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { UserProfile, LocalStorageService, calculateLevel } from '../services/localStorage';
import { UserAPI } from '../services/userAPI';
import { OfflineQueue } from '../services/offlineQueue';

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

interface UserProfileContextType {
  profile: UserProfile;
  syncStatus: SyncStatus;
  queueSize: number;
  loading: boolean;
  addXp: (amount: number) => Promise<{ newLevel: number; leveledUp: boolean }>;
  unlockArtifact: (artifactId: string) => Promise<boolean>;
  completeNode: (nodeId: string, quizScore?: number, quizAttempts?: number) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  showMigrationDialog: boolean;
  setShowMigrationDialog: (show: boolean) => void;
  migrateLocalData: () => Promise<boolean>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

const INITIAL_PROFILE: UserProfile = {
  xp: 0,
  level: 1,
  artifacts: [],
  nodesCompleted: []
};

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const isOnline = useOnlineStatus();

  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [queueSize, setQueueSize] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMigrationDialog, setShowMigrationDialog] = useState(false);

  // Load profile on mount or when user changes
  useEffect(() => {
    if (authLoading) return;

    loadProfile();
  }, [user, authLoading]);

  // Process queue when connection is restored
  useEffect(() => {
    if (isOnline && user && OfflineQueue.hasQueuedActions()) {
      processOfflineQueue();
    }
  }, [isOnline, user]);

  // Update queue size periodically
  useEffect(() => {
    const updateQueueSize = () => {
      setQueueSize(OfflineQueue.getQueueSize());
    };

    updateQueueSize();
    const interval = setInterval(updateQueueSize, 1000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Load profile from cloud or localStorage
   * 
   * Architecture:
   * - Authenticated users: Cloud is source of truth, localStorage is cache
   * - Guest users: localStorage is source of truth
   * - New authenticated users get INITIAL_PROFILE (fresh start)
   */
  const loadProfile = async () => {
    console.log('[UserProfile] Loading profile...', { user: user?.id, isOnline });
    setLoading(true);

    try {
      // AUTHENTICATED USER: Cloud is the source of truth
      if (user && UserAPI.isAvailable()) {
        console.log('[UserProfile] User authenticated, loading from cloud...');

        // Try to load from cloud
        const cloudProfile = await UserAPI.getProfile(user.id);
        console.log('[UserProfile] Cloud profile:', cloudProfile);

        if (cloudProfile) {
          // Check if there's local data that needs migration (from guest mode)
          const localProfile = LocalStorageService.getProfileForMigration();

          if (localProfile && !LocalStorageService.isMigrationCompleted()) {
            console.log('[UserProfile] Migration needed - local data exists');
            setShowMigrationDialog(true);
            setProfile(localProfile);
          } else {
            console.log('[UserProfile] Using cloud profile');
            setProfile(cloudProfile);
            LocalStorageService.saveProfile(cloudProfile);
          }
        } else {
          // No cloud profile - this is a NEW authenticated user
          // Start them fresh, don't use stale localStorage data
          console.log('[UserProfile] No cloud profile - starting fresh for authenticated user');
          setProfile(INITIAL_PROFILE);
          LocalStorageService.saveProfile(INITIAL_PROFILE);
        }
      } 
      // GUEST USER: localStorage is the source of truth
      else {
        console.log('[UserProfile] Guest mode, using localStorage');
        const localProfile = LocalStorageService.getProfile();
        if (localProfile) {
          setProfile(localProfile);
        } else {
          setProfile(INITIAL_PROFILE);
          LocalStorageService.saveProfile(INITIAL_PROFILE);
        }
      }

      setSyncStatus('synced');
      console.log('[UserProfile] Profile loaded successfully');
    } catch (error) {
      console.error('[UserProfile] Error loading profile:', error);
      setSyncStatus('error');

      // Error occurred - for authenticated users, start fresh rather than using stale data
      if (user) {
        console.log('[UserProfile] Error for authenticated user, starting fresh');
        setProfile(INITIAL_PROFILE);
        LocalStorageService.saveProfile(INITIAL_PROFILE);
      } else {
        // Guest mode - use localStorage or initial
        const localProfile = LocalStorageService.getProfile();
        if (localProfile) {
          console.log('[UserProfile] Using localStorage fallback for guest');
          setProfile(localProfile);
        } else {
          setProfile(INITIAL_PROFILE);
        }
      }
    } finally {
      setLoading(false);
      console.log('[UserProfile] Loading complete');
    }
  };

  /**
   * Process offline queue
   */
  const processOfflineQueue = async () => {
    if (!user) return;

    setSyncStatus('syncing');

    try {
      const processed = await OfflineQueue.processQueue(user.id, (current, total) => {
        console.log(`Processing queue: ${current}/${total}`);
      });

      console.log(`Successfully processed ${processed} queued actions`);

      // Refresh profile after processing queue
      await refreshProfile();

      setSyncStatus('synced');
    } catch (error) {
      console.error('Error processing queue:', error);
      setSyncStatus('error');
    }
  };

  /**
   * Refresh profile from cloud
   */
  const refreshProfile = useCallback(async () => {
    if (!user || !UserAPI.isAvailable()) return;

    try {
      const cloudProfile = await UserAPI.getProfile(user.id);
      if (cloudProfile) {
        setProfile(cloudProfile);
        LocalStorageService.saveProfile(cloudProfile);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  }, [user]);

  /**
   * Add XP (optimistic update with sync)
   */
  const addXp = async (amount: number): Promise<{ newLevel: number; leveledUp: boolean }> => {
    // Use functional update to get the latest profile state
    let result = { newLevel: 1, leveledUp: false };
    let updatedProfile: UserProfile | null = null;

    setProfile(currentProfile => {
      const oldLevel = currentProfile.level;
      const newXp = currentProfile.xp + amount;
      const newLevel = calculateLevel(newXp);
      
      updatedProfile = { ...currentProfile, xp: newXp, level: newLevel };
      result = { newLevel, leveledUp: newLevel > oldLevel };
      
      return updatedProfile;
    });

    // Save to localStorage
    if (updatedProfile) {
      LocalStorageService.saveProfile(updatedProfile);
    }

    // Try to sync to cloud
    if (user && UserAPI.isAvailable()) {
      if (isOnline) {
        try {
          await UserAPI.addXp(user.id, amount);
        } catch (error) {
          console.error('Error syncing XP:', error);
          // Queue for later
          OfflineQueue.enqueue('ADD_XP', { amount });
          setSyncStatus('offline');
        }
      } else {
        // Offline - queue action
        OfflineQueue.enqueue('ADD_XP', { amount });
        setSyncStatus('offline');
      }
    }

    return result;
  };

  /**
   * Unlock artifact (optimistic update with sync)
   */
  const unlockArtifact = async (artifactId: string): Promise<boolean> => {
    // Check if already unlocked
    if (profile.artifacts.includes(artifactId)) {
      return false;
    }

    // Optimistic update
    const updatedProfile = {
      ...profile,
      artifacts: [...profile.artifacts, artifactId]
    };
    setProfile(updatedProfile);
    LocalStorageService.saveProfile(updatedProfile);

    // Try to sync to cloud
    if (user && UserAPI.isAvailable()) {
      if (isOnline) {
        try {
          await UserAPI.unlockArtifact(user.id, artifactId);
        } catch (error) {
          console.error('Error syncing artifact:', error);
          // Queue for later
          OfflineQueue.enqueue('UNLOCK_ARTIFACT', { artifactId });
          setSyncStatus('offline');
        }
      } else {
        // Offline - queue action
        OfflineQueue.enqueue('UNLOCK_ARTIFACT', { artifactId });
        setSyncStatus('offline');
      }
    }

    return true;
  };

  /**
   * Complete node (optimistic update with sync)
   */
  const completeNode = async (
    nodeId: string,
    quizScore?: number,
    quizAttempts?: number
  ): Promise<boolean> => {
    // Use functional update to get the latest profile state
    // This avoids stale closure issues when addXp is called before completeNode
    let wasAlreadyCompleted = false;
    let updatedProfile: UserProfile | null = null;
    
    setProfile(currentProfile => {
      // Check if already completed using CURRENT profile state
      if (currentProfile.nodesCompleted.includes(nodeId)) {
        wasAlreadyCompleted = true;
        return currentProfile; // No change
      }
      
      // Optimistic update
      updatedProfile = {
        ...currentProfile,
        nodesCompleted: [...currentProfile.nodesCompleted, nodeId]
      };
      return updatedProfile;
    });

    // If already completed, don't sync
    if (wasAlreadyCompleted || !updatedProfile) {
      return false;
    }

    // Save to localStorage
    LocalStorageService.saveProfile(updatedProfile);

    // Try to sync to cloud
    if (user && UserAPI.isAvailable()) {
      if (isOnline) {
        try {
          await UserAPI.completeNode(user.id, nodeId, quizScore, quizAttempts);
        } catch (error) {
          console.error('Error syncing completed node:', error);
          // Queue for later
          OfflineQueue.enqueue('COMPLETE_NODE', { nodeId, quizScore, quizAttempts });
          setSyncStatus('offline');
        }
      } else {
        // Offline - queue action
        OfflineQueue.enqueue('COMPLETE_NODE', { nodeId, quizScore, quizAttempts });
        setSyncStatus('offline');
      }
    }

    return true;
  };

  /**
   * Migrate local data to cloud
   */
  const migrateLocalData = async (): Promise<boolean> => {
    if (!user || !UserAPI.isAvailable()) return false;

    const localProfile = LocalStorageService.getProfileForMigration();
    if (!localProfile) return false;

    setSyncStatus('syncing');

    try {
      // Get cloud profile
      const cloudProfile = await UserAPI.getProfile(user.id);

      if (cloudProfile) {
        // Merge local and cloud data
        const mergedProfile = LocalStorageService.mergeProfiles(localProfile, cloudProfile);

        // Upload merged profile
        const success = await UserAPI.migrateProfile(user.id, mergedProfile);

        if (success) {
          // Update local profile
          setProfile(mergedProfile);
          LocalStorageService.saveProfile(mergedProfile);
          LocalStorageService.setMigrationCompleted();
          setSyncStatus('synced');
          return true;
        }
      }

      setSyncStatus('error');
      return false;
    } catch (error) {
      console.error('Error migrating profile:', error);
      setSyncStatus('error');
      return false;
    }
  };

  const value: UserProfileContextType = {
    profile,
    syncStatus,
    queueSize,
    loading,
    addXp,
    unlockArtifact,
    completeNode,
    refreshProfile,
    showMigrationDialog,
    setShowMigrationDialog,
    migrateLocalData
  };

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
};

// Custom hook to use profile context
export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
