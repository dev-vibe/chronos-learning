/**
 * Gamification Service - Collectible Cards (in-memory only)
 * Profile state is managed by react-query via UserProfileContext
 */

import { CollectibleCard } from '../types';

export interface UserProfile {
  xp: number;
  level: number;
  collectibleCards: CollectibleCard[];
  nodesCompleted: string[];
}

// In-memory collectible cards cache
let collectibleCards: CollectibleCard[] = [];

export const GamificationService = {
  /**
   * Get collectible cards
   */
  getCollectibleCards: (): CollectibleCard[] => {
    return [...collectibleCards];
  },

  /**
   * Unlock a collectible card
   */
  unlockCollectibleCard: (card: CollectibleCard): boolean => {
    if (!collectibleCards.some(c => c.id === card.id)) {
      collectibleCards.push(card);
      return true;
    }
    return false;
  },

  /**
   * Unlock multiple collectible cards
   */
  unlockCollectibleCards: (cards: CollectibleCard[]): number => {
    let newCards = 0;
    cards.forEach(card => {
      if (!collectibleCards.some(c => c.id === card.id)) {
        collectibleCards.push(card);
        newCards++;
      }
    });
    return newCards;
  },

  /**
   * Check if user has a collectible card
   */
  hasCollectibleCard: (cardId: string): boolean => {
    return collectibleCards.some(c => c.id === cardId);
  },

  /**
   * Reset cards (for logout)
   */
  resetCards: (): void => {
    collectibleCards = [];
  }
};
