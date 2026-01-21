/**
 * Profile Queries and Mutations
 * All react-query hooks for user profile
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserProfile } from '../services/gamification';
import { fetchUserProfile, addXpToUser, completeNodeForUser, calculateLevel } from '../services/profileAPI';
import { GamificationService } from '../services/gamification';

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
  const queryKey = profileKeys.user(userId);

  return useMutation({
    mutationFn: async (amount: number) => {
      if (!userId || isGuest) {
        // Guest mode - just update local cache optimistically
        const current = queryClient.getQueryData<UserProfile>(queryKey) || INITIAL_PROFILE;
        const updated = {
          ...current,
          xp: current.xp + amount
        };
        queryClient.setQueryData(queryKey, updated);
        return updated;
      }

      const current = queryClient.getQueryData<UserProfile>(queryKey) || INITIAL_PROFILE;
      const updated = await addXpToUser(userId, amount, current);
      queryClient.setQueryData(queryKey, updated);
      return updated;
    },
  });
};

/**
 * Hook to complete a node
 */
export const useCompleteNodeMutation = (userId: string | null, isGuest: boolean) => {
  const queryClient = useQueryClient();
  const queryKey = profileKeys.user(userId);

  return useMutation({
    mutationFn: async (nodeId: string) => {
      if (!userId || isGuest) {
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

      const current = queryClient.getQueryData<UserProfile>(queryKey) || INITIAL_PROFILE;
      const updated = await completeNodeForUser(userId, nodeId, current);
      queryClient.setQueryData(queryKey, updated);
      return updated;
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
