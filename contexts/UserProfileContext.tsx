/**
 * User Profile Context
 * Simple wrapper around react-query hooks
 */

import React, { createContext, useContext, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  createDefaultUserProfile,
  createEmptyUserProfile,
  getCollectibleCardsForCompletedNodes,
  UserProfile
} from '../services/gamification';
import {
  useProfileQuery,
  useAddXpMutation,
  useCompleteNodeMutation,
  useRefreshProfile
} from '../hooks/useProfileQueries';
import { LocalStorageService } from '../services/localStorage';
import { UserAPI } from '../services/userAPI';

interface UserProfileContextType {
  profile: UserProfile;
  loading: boolean;
  syncStatus: 'synced' | 'syncing' | 'error';
  queueSize: number;
  showMigrationDialog: boolean;
  setShowMigrationDialog: React.Dispatch<React.SetStateAction<boolean>>;
  addXp: (amount: number) => Promise<void>;
  completeNode: (nodeId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  migrateLocalData: () => Promise<boolean>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);
const USE_DEMO_PROFILE = import.meta.env.VITE_DEMO_PROFILE === 'true';

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id || null;
  const [showMigrationDialog, setShowMigrationDialog] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');

  // Fetch profile
  const { data: dbProfile, isLoading } = useProfileQuery(userId, isGuest);

  // Mutations - use current userId
  const addXpMutation = useAddXpMutation(userId, isGuest);
  const completeNodeMutation = useCompleteNodeMutation(userId, isGuest);
  const refreshProfile = useRefreshProfile(userId);

  // Merge DB profile with in-memory collectible cards
  const profile = useMemo(() => {
    const baseProfile = dbProfile || (USE_DEMO_PROFILE ? createDefaultUserProfile() : createEmptyUserProfile());

    return {
      ...baseProfile,
      collectibleCards: getCollectibleCardsForCompletedNodes(baseProfile.nodesCompleted)
    };
  }, [dbProfile]);

  const addXp = async (amount: number) => {
    try {
      console.log('[UserProfileContext] addXp called with amount:', amount);
      console.log('[UserProfileContext] Auth state:', {
        user: user ? { id: user.id, email: user.email } : null,
        isGuest,
        userId: user?.id
      });
      await addXpMutation.mutateAsync(amount);
      console.log('[UserProfileContext] addXp completed successfully');
    } catch (error) {
      console.error('[UserProfileContext] addXp error:', error);
      throw error;
    }
  };

  const completeNode = async (nodeId: string) => {
    try {
      console.log('[UserProfileContext] completeNode called with nodeId:', nodeId, 'userId:', user?.id, 'isGuest:', isGuest);
      await completeNodeMutation.mutateAsync(nodeId);
      console.log('[UserProfileContext] completeNode completed successfully');
    } catch (error) {
      console.error('[UserProfileContext] completeNode error:', error);
      throw error;
    }
  };

  const refreshProfileAsync = async () => {
    refreshProfile();
  };

  const migrateLocalData = async (): Promise<boolean> => {
    if (!userId) return false;

    const localProfile = LocalStorageService.getProfileForMigration();
    if (!localProfile) return true;

    setSyncStatus('syncing');
    const success = await UserAPI.migrateProfile(userId, localProfile);
    setSyncStatus(success ? 'synced' : 'error');

    if (success) {
      LocalStorageService.setMigrationCompleted();
      refreshProfile();
    }

    return success;
  };

  const value: UserProfileContextType = {
    profile,
    loading: isLoading,
    syncStatus,
    queueSize: LocalStorageService.getQueue().length,
    showMigrationDialog,
    setShowMigrationDialog,
    addXp,
    completeNode,
    refreshProfile: refreshProfileAsync,
    migrateLocalData
  };

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
};

// Custom hook
export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
