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

  // If no progress row exists, create one
  if (!progress && !progressError) {
    const { error: createError } = await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        xp: 0,
        level: 1,
        updated_at: new Date().toISOString()
      });

    if (createError) {
      console.error('[ProfileAPI] Error creating user_progress:', createError);
    }
  }

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

  console.log('[ProfileAPI] addXpToUser - userId:', userId, 'newXp:', newXp, 'newLevel:', newLevel);

  // Use upsert to create row if it doesn't exist
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      xp: newXp,
      level: newLevel,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    })
    .select();

  if (error) {
    console.error('[ProfileAPI] Error saving XP:', error);
    throw error;
  }

  console.log('[ProfileAPI] addXpToUser - DB response:', data);

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

  console.log('[ProfileAPI] completeNodeForUser - userId:', userId, 'nodeId:', nodeId, 'newLevel:', newLevel);

  if (isSupabaseConfigured()) {
    // Insert completed node (ignore if already exists)
    const { data: nodeData, error: nodeError } = await supabase
      .from('completed_nodes')
      .insert({
        user_id: userId,
        node_id: nodeId,
        completed_at: new Date().toISOString()
      })
      .select();

    if (nodeError && nodeError.code !== '23505') { // 23505 = unique violation (already exists)
      console.error('[ProfileAPI] Error saving completed node:', nodeError);
      throw nodeError;
    }

    console.log('[ProfileAPI] completed_nodes insert result:', nodeData);

    // Upsert user_progress to ensure row exists
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        xp: currentProfile.xp,
        level: newLevel,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select();

    if (progressError) {
      console.error('[ProfileAPI] Error updating progress:', progressError);
      throw progressError;
    }

    console.log('[ProfileAPI] user_progress upsert result:', progressData);
  } else {
    console.warn('[ProfileAPI] Supabase not configured, skipping DB operations');
  }

  return {
    ...currentProfile,
    nodesCompleted: newNodesCompleted,
    level: newLevel
  };
};
