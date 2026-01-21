/**
 * User API Service - Supabase database operations
 * Handles all user profile, progress, artifacts, and completed nodes CRUD operations
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, calculateLevel } from './localStorage';

export interface CloudUserProfile {
  id: string;
  username?: string;
  display_name?: string;
  created_at: string;
  updated_at: string;
  last_sync_at?: string;
  preferences?: Record<string, any>;
}

export interface CloudUserProgress {
  id: string;
  user_id: string;
  xp: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface CloudArtifact {
  id: string;
  user_id: string;
  artifact_id: string;
  unlocked_at: string;
}

export interface CloudCompletedNode {
  id: string;
  user_id: string;
  node_id: string;
  completed_at: string;
  quiz_score?: number;
  quiz_attempts?: number;
}

export const UserAPI = {
  /**
   * Check if Supabase is configured and available
   */
  isAvailable: (): boolean => {
    return isSupabaseConfigured();
  },

  // ============ Profile Methods ============

  /**
   * Get full user profile with progress, artifacts, and completed nodes
   * Returns null if user has no profile yet (new user)
   */
  getProfile: async (userId: string): Promise<UserProfile | null> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, cannot fetch profile');
      return null;
    }

    try {
      // Fetch progress - use maybeSingle() to handle 0 rows gracefully
      const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      // If no progress row exists, this is a new user - return null
      if (progressError) {
        // Only log if it's not a "no rows" error
        if (progressError.code !== 'PGRST116') {
          console.error('Error fetching user progress:', progressError);
        }
        return null;
      }

      // No progress data means new user
      if (!progress) {
        console.log('[UserAPI] No progress found for user - new user');
        return null;
      }

      // Fetch artifacts (empty array is fine)
      const { data: artifacts, error: artifactsError } = await supabase
        .from('user_artifacts')
        .select('artifact_id')
        .eq('user_id', userId);

      if (artifactsError && artifactsError.code !== 'PGRST116') {
        console.error('Error fetching artifacts:', artifactsError);
        // Continue with empty artifacts rather than failing
      }

      // Fetch completed nodes (empty array is fine)
      const { data: completedNodes, error: nodesError } = await supabase
        .from('completed_nodes')
        .select('node_id')
        .eq('user_id', userId);

      if (nodesError && nodesError.code !== 'PGRST116') {
        console.error('Error fetching completed nodes:', nodesError);
        // Continue with empty nodes rather than failing
      }

      return {
        xp: progress.xp,
        level: progress.level,
        artifacts: artifacts?.map(a => a.artifact_id) || [],
        nodesCompleted: completedNodes?.map(n => n.node_id) || []
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  /**
   * Add XP to user and recalculate level
   */
  addXp: async (userId: string, amount: number): Promise<{ newLevel: number, leveledUp: boolean } | null> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, cannot add XP');
      return null;
    }

    try {
      // Get current progress
      const { data: progress, error: fetchError } = await supabase
        .from('user_progress')
        .select('xp, level')
        .eq('user_id', userId)
        .single();

      if (fetchError) {
        console.error('Error fetching current progress:', fetchError);
        return null;
      }

      const oldLevel = progress.level;
      const newXp = progress.xp + amount;
      const newLevel = calculateLevel(newXp);

      // Update progress
      const { error: updateError } = await supabase
        .from('user_progress')
        .update({
          xp: newXp,
          level: newLevel,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating progress:', updateError);
        return null;
      }

      return {
        newLevel,
        leveledUp: newLevel > oldLevel
      };
    } catch (error) {
      console.error('Error adding XP:', error);
      return null;
    }
  },

  /**
   * Unlock artifact for user
   */
  unlockArtifact: async (userId: string, artifactId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, cannot unlock artifact');
      return false;
    }

    try {
      // Check if artifact already exists
      const { data: existing } = await supabase
        .from('user_artifacts')
        .select('id')
        .eq('user_id', userId)
        .eq('artifact_id', artifactId)
        .single();

      if (existing) {
        return false; // Already unlocked
      }

      // Insert new artifact
      const { error } = await supabase
        .from('user_artifacts')
        .insert({
          user_id: userId,
          artifact_id: artifactId,
          unlocked_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error unlocking artifact:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error unlocking artifact:', error);
      return false;
    }
  },

  /**
   * Mark node as completed
   */
  completeNode: async (
    userId: string,
    nodeId: string,
    quizScore?: number,
    quizAttempts?: number
  ): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, cannot complete node');
      return false;
    }

    try {
      // Check if node already completed
      const { data: existing } = await supabase
        .from('completed_nodes')
        .select('id')
        .eq('user_id', userId)
        .eq('node_id', nodeId)
        .single();

      if (existing) {
        return false; // Already completed
      }

      // Insert completed node
      const { error } = await supabase
        .from('completed_nodes')
        .insert({
          user_id: userId,
          node_id: nodeId,
          completed_at: new Date().toISOString(),
          quiz_score: quizScore,
          quiz_attempts: quizAttempts
        });

      if (error) {
        console.error('Error completing node:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error completing node:', error);
      return false;
    }
  },

  // ============ Batch Operations (for Migration) ============

  /**
   * Batch upload artifacts
   */
  batchUploadArtifacts: async (userId: string, artifactIds: string[]): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, cannot upload artifacts');
      return false;
    }

    if (artifactIds.length === 0) return true;

    try {
      const records = artifactIds.map(artifactId => ({
        user_id: userId,
        artifact_id: artifactId,
        unlocked_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('user_artifacts')
        .upsert(records, { onConflict: 'user_id,artifact_id' });

      if (error) {
        console.error('Error batch uploading artifacts:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error batch uploading artifacts:', error);
      return false;
    }
  },

  /**
   * Batch upload completed nodes
   */
  batchUploadCompletedNodes: async (userId: string, nodeIds: string[]): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, cannot upload completed nodes');
      return false;
    }

    if (nodeIds.length === 0) return true;

    try {
      const records = nodeIds.map(nodeId => ({
        user_id: userId,
        node_id: nodeId,
        completed_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('completed_nodes')
        .upsert(records, { onConflict: 'user_id,node_id' });

      if (error) {
        console.error('Error batch uploading completed nodes:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error batch uploading completed nodes:', error);
      return false;
    }
  },

  /**
   * Batch migrate full profile (used for migration)
   */
  migrateProfile: async (userId: string, profile: UserProfile): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, cannot migrate profile');
      return false;
    }

    try {
      // Update progress (XP and level)
      const { error: progressError } = await supabase
        .from('user_progress')
        .update({
          xp: profile.xp,
          level: profile.level,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (progressError) {
        console.error('Error updating progress during migration:', progressError);
        return false;
      }

      // Upload artifacts
      const artifactsSuccess = await UserAPI.batchUploadArtifacts(userId, profile.artifacts);
      if (!artifactsSuccess) {
        console.error('Error uploading artifacts during migration');
        return false;
      }

      // Upload completed nodes
      const nodesSuccess = await UserAPI.batchUploadCompletedNodes(userId, profile.nodesCompleted);
      if (!nodesSuccess) {
        console.error('Error uploading completed nodes during migration');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error migrating profile:', error);
      return false;
    }
  },

  /**
   * Update last sync timestamp
   */
  updateLastSync: async (userId: string): Promise<void> => {
    if (!isSupabaseConfigured()) return;

    try {
      await supabase
        .from('user_profiles')
        .update({
          last_sync_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
    } catch (error) {
      console.error('Error updating last sync timestamp:', error);
    }
  }
};
