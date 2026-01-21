/**
 * Profile API - Clean functions for react-query
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ERAS, INITIAL_NODES } from '../constants';
import { UserProfile } from './gamification';

// Level = 1 + number of fully completed eras
export const calculateLevel = (nodesCompleted: string[]): number => {
  let completedEras = 0;
  
  for (const era of ERAS) {
    const eraNodes = INITIAL_NODES.filter(n => n.eraId === era.id);
    if (eraNodes.length > 0 && eraNodes.every(n => nodesCompleted.includes(n.id))) {
      completedEras++;
    }
  }
  
  return 1 + completedEras;
};

/**
 * Fetch user profile from database
 */
export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  if (!isSupabaseConfigured()) {
    return {
      xp: 0,
      level: 1,
      collectibleCards: [],
      nodesCompleted: []
    };
  }

  // Fetch progress
  const { data: progress, error: progressError } = await supabase
    .from('user_progress')
    .select('xp, level')
    .eq('user_id', userId)
    .maybeSingle();

  // Fetch completed nodes
  const { data: completedNodes, error: nodesError } = await supabase
    .from('completed_nodes')
    .select('node_id')
    .eq('user_id', userId);

  if (nodesError && nodesError.code !== 'PGRST116') {
    console.error('[ProfileAPI] Error fetching completed nodes:', nodesError);
  }

  const nodesCompleted = completedNodes?.map(n => n.node_id) || [];
  const xp = progress?.xp || 0;

  return {
    xp,
    level: calculateLevel(nodesCompleted),
    collectibleCards: [], // Cards are in-memory only
    nodesCompleted
  };
};

/**
 * Add XP to user
 */
export const addXpToUser = async (userId: string, amount: number, currentProfile: UserProfile): Promise<UserProfile> => {
  if (!isSupabaseConfigured()) {
    return {
      ...currentProfile,
      xp: currentProfile.xp + amount
    };
  }

  const newXp = currentProfile.xp + amount;
  const newLevel = calculateLevel(currentProfile.nodesCompleted);

  await supabase
    .from('user_progress')
    .update({
      xp: newXp,
      level: newLevel,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  return {
    ...currentProfile,
    xp: newXp,
    level: newLevel
  };
};

/**
 * Complete a node
 */
export const completeNodeForUser = async (
  userId: string,
  nodeId: string,
  currentProfile: UserProfile
): Promise<UserProfile> => {
  if (currentProfile.nodesCompleted.includes(nodeId)) {
    return currentProfile; // Already completed
  }

  const newNodesCompleted = [...currentProfile.nodesCompleted, nodeId];
  const newLevel = calculateLevel(newNodesCompleted);

  if (isSupabaseConfigured()) {
    // Insert completed node
    await supabase
      .from('completed_nodes')
      .insert({
        user_id: userId,
        node_id: nodeId,
        completed_at: new Date().toISOString()
      });

    // Update level
    await supabase
      .from('user_progress')
      .update({
        level: newLevel,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
  }

  return {
    ...currentProfile,
    nodesCompleted: newNodesCompleted,
    level: newLevel
  };
};
