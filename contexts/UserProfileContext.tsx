/**
 * User Profile Context
 * Simple wrapper around react-query hooks
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { UserProfile } from '../services/gamification';
import { GamificationService } from '../services/gamification';
import {
  useProfileQuery,
  useAddXpMutation,
  useCompleteNodeMutation,
  useRefreshProfile
} from '../hooks/useProfileQueries';

interface UserProfileContextType {
  profile: UserProfile;
  loading: boolean;
  addXp: (amount: number) => Promise<void>;
  completeNode: (nodeId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();

  // Fetch profile
  const { data: dbProfile, isLoading } = useProfileQuery(user?.id || null, isGuest);

  // Mutations
  const addXpMutation = useAddXpMutation(user?.id || null, isGuest);
  const completeNodeMutation = useCompleteNodeMutation(user?.id || null, isGuest);
  const refreshProfile = useRefreshProfile(user?.id || null);

  // Merge DB profile with in-memory collectible cards
  const profile = useMemo(() => ({
    ...(dbProfile || {
      xp: 0,
      level: 1,
      collectibleCards: [],
      nodesCompleted: []
    }),
    collectibleCards: GamificationService.getCollectibleCards()
  }), [dbProfile]);

  const addXp = async (amount: number) => {
    await addXpMutation.mutateAsync(amount);
  };

  const completeNode = async (nodeId: string) => {
    await completeNodeMutation.mutateAsync(nodeId);
  };

  const refreshProfileAsync = async () => {
    refreshProfile();
  };

  const value: UserProfileContextType = {
    profile,
    loading: isLoading,
    addXp,
    completeNode,
    refreshProfile: refreshProfileAsync
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
