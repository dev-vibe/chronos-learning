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
  const userId = user?.id || null;

  // Fetch profile
  const { data: dbProfile, isLoading } = useProfileQuery(userId, isGuest);

  // Mutations - use current userId
  const addXpMutation = useAddXpMutation(userId, isGuest);
  const completeNodeMutation = useCompleteNodeMutation(userId, isGuest);
  const refreshProfile = useRefreshProfile(userId);

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
