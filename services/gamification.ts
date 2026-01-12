
import { Artifact } from '../types';

const STORAGE_KEY = 'chronos_agent_profile_v1';

export interface UserProfile {
  xp: number;
  level: number;
  artifacts: string[]; // List of Artifact IDs
  nodesCompleted: string[]; // List of Node IDs
}

const INITIAL_PROFILE: UserProfile = {
  xp: 0,
  level: 1,
  artifacts: [],
  nodesCompleted: []
};

// Level Curve: Level = sqrt(XP / 100) + 1
// XP to reach Level N = 100 * (N-1)^2
// Lvl 1: 0, Lvl 2: 100, Lvl 3: 400, Lvl 4: 900
const calculateLevel = (xp: number) => Math.floor(Math.sqrt(xp / 100)) + 1;

export const GamificationService = {
  getProfile: (): UserProfile => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_PROFILE;
    } catch (e) {
      console.error("Failed to load profile", e);
      return INITIAL_PROFILE;
    }
  },

  saveProfile: (profile: UserProfile) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error("Failed to save profile", e);
    }
  },

  addXp: (amount: number): { newLevel: number, leveledUp: boolean } => {
    const profile = GamificationService.getProfile();
    const oldLevel = profile.level;
    
    profile.xp += amount;
    profile.level = calculateLevel(profile.xp);
    
    GamificationService.saveProfile(profile);
    
    return {
      newLevel: profile.level,
      leveledUp: profile.level > oldLevel
    };
  },

  unlockArtifact: (artifact: Artifact) => {
    const profile = GamificationService.getProfile();
    if (!profile.artifacts.includes(artifact.id)) {
      profile.artifacts.push(artifact.id);
      GamificationService.saveProfile(profile);
      return true;
    }
    return false;
  },

  completeNode: (nodeId: string) => {
    const profile = GamificationService.getProfile();
    if (!profile.nodesCompleted.includes(nodeId)) {
      profile.nodesCompleted.push(nodeId);
      GamificationService.saveProfile(profile);
      return true;
    }
    return false;
  },
  
  hasCompletedNode: (nodeId: string) => {
      const profile = GamificationService.getProfile();
      return profile.nodesCompleted.includes(nodeId);
  },
  
  hasArtifact: (artifactId: string) => {
      const profile = GamificationService.getProfile();
      return profile.artifacts.includes(artifactId);
  }
};
