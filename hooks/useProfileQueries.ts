/**
 * Profile Queries and Mutations
 * All react-query hooks for user profile
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserProfile } from '../services/gamification';
import { fetchUserProfile, addXpToUser, completeNodeForUser, calculateLevel } from '../services/profileAPI';
import { GamificationService } from '../services/gamification';
import { useAuth } from '../contexts/AuthContext';

const INITIAL_PROFILE: UserProfile = {
  xp: 0,
  level: 1,
  collectibleCards: [],
  nodesCompleted: []
};

/**
 * Query key factory for profile queries
 */
export const profileKeys = {
  all: ['userProfile'] as const,
  user: (userId: string | null) => [...profileKeys.all, userId || 'guest'] as const,
};

/**
 * Hook to fetch user profile
 */
export const useProfileQuery = (userId: string | null, isGuest: boolean) => {
  return useQuery({
    queryKey: profileKeys.user(userId),
    queryFn: async () => {
      if (userId && !isGuest) {
        return await fetchUserProfile(userId);
      }
      return INITIAL_PROFILE;
    },
    enabled: !!userId || isGuest,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to add XP
 */
export const useAddXpMutation = (userId: string | null, isGuest: boolean) => {
  const queryClient = useQueryClient();
  const { user: currentUser, isGuest: currentIsGuest } = useAuth();

  return useMutation({
    mutationFn: async (amount: number) => {
      // Get current userId dynamically from auth context
      const currentUserId = currentUser?.id || userId;
      const actuallyIsGuest = currentIsGuest || isGuest;
      const queryKey = profileKeys.user(currentUserId);
      
      console.log('[useAddXpMutation] Auth state:', {
        currentUser: currentUser ? { id: currentUser.id, email: currentUser.email } : null,
        currentIsGuest,
        userId,
        isGuest,
        currentUserId,
        actuallyIsGuest
      });
      
      console.log('[useAddXpMutation] Called - userId:', currentUserId, 'isGuest:', actuallyIsGuest, 'amount:', amount);
      
      if (!currentUserId || actuallyIsGuest) {
        console.log('[useAddXpMutation] Guest mode - updating cache only');
        // Guest mode - just update local cache optimistically
        const current = queryClient.getQueryData<UserProfile>(queryKey) || INITIAL_PROFILE;
        const updated = {
          ...current,
          xp: current.xp + amount
        };
        queryClient.setQueryData(queryKey, updated);
        return updated;
      }

      console.log('[useAddXpMutation] Authenticated user - calling API');
      const current = queryClient.getQueryData<UserProfile>(queryKey) || INITIAL_PROFILE;
      console.log('[useAddXpMutation] Current profile:', current);
      const updated = await addXpToUser(currentUserId, amount, current);
      console.log('[useAddXpMutation] Updated profile:', updated);
      queryClient.setQueryData(queryKey, updated);
      return updated;
    },
    onError: (error) => {
      console.error('[useAddXpMutation] Mutation error:', error);
    },
  });
};

/**
 * Hook to complete a node
 */
export const useCompleteNodeMutation = (userId: string | null, isGuest: boolean) => {
  const queryClient = useQueryClient();
  const { user: currentUser, isGuest: currentIsGuest } = useAuth();

  return useMutation({
    mutationFn: async (nodeId: string) => {
      // Get current userId dynamically from auth context
      const currentUserId = currentUser?.id || userId;
      const actuallyIsGuest = currentIsGuest || isGuest;
      const queryKey = profileKeys.user(currentUserId);
      
      console.log('[useCompleteNodeMutation] Auth state:', {
        currentUser: currentUser ? { id: currentUser.id, email: currentUser.email } : null,
        currentIsGuest,
        userId,
        isGuest,
        currentUserId,
        actuallyIsGuest
      });
      
      console.log('[useCompleteNodeMutation] Called - userId:', currentUserId, 'isGuest:', actuallyIsGuest, 'nodeId:', nodeId);
      
      if (!currentUserId || actuallyIsGuest) {
        console.log('[useCompleteNodeMutation] Guest mode - updating cache only');
        // Guest mode - just update local cache optimistically
        const current = queryClient.getQueryData<UserProfile>(queryKey) || INITIAL_PROFILE;
        if (current.nodesCompleted.includes(nodeId)) {
          return current;
        }
        
        const newNodesCompleted = [...current.nodesCompleted, nodeId];
        const newLevel = calculateLevel(newNodesCompleted);
        const updated = {
          ...current,
          nodesCompleted: newNodesCompleted,
          level: newLevel
        };
        queryClient.setQueryData(queryKey, updated);
        return updated;
      }

      console.log('[useCompleteNodeMutation] Authenticated user - calling API');
      const current = queryClient.getQueryData<UserProfile>(queryKey) || INITIAL_PROFILE;
      console.log('[useCompleteNodeMutation] Current profile:', current);
      const updated = await completeNodeForUser(currentUserId, nodeId, current);
      console.log('[useCompleteNodeMutation] Updated profile:', updated);
      queryClient.setQueryData(queryKey, updated);
      return updated;
    },
    onError: (error) => {
      console.error('[useCompleteNodeMutation] Mutation error:', error);
    },
  });
};

/**
 * Hook to refresh profile
 */
export const useRefreshProfile = (userId: string | null) => {
  const queryClient = useQueryClient();
  const queryKey = profileKeys.user(userId);

  return () => {
    queryClient.invalidateQueries({ queryKey });
  };
};
