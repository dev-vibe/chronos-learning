/**
 * Gamification Service - Collectible Cards (in-memory only)
 * Profile state is managed by react-query via UserProfileContext
 */

import { FOUNDATIONS_YOUNGER_DRYAS } from '../data/eras/prelude/climate_transition';
import { CollectibleCard, CollectibleCardRef, NodeContent } from '../types';

export interface UserProfile {
  xp: number;
  level: number;
  collectibleCards: CollectibleCard[];
  nodesCompleted: string[];
}

const FIRST_ERA_NODE_ID = 'younger_dryas_reset';
const DEFAULT_USER_XP = 100;
const DEFAULT_USER_LEVEL = 2;
const DEFAULT_COMPLETED_NODES = [FIRST_ERA_NODE_ID];

const resolveCollectibleCard = (ref: CollectibleCardRef, content: NodeContent, fallbackIndex: number): CollectibleCard | null => {
  if (ref.type === 'person') {
    const person = content.people[ref.index];
    if (!person) return null;

    return {
      id: ref.id || `${ref.type}_${ref.index}_${fallbackIndex}`,
      type: 'person',
      name: person.name,
      description: person.description,
      imageUrl: person.imageUrl,
      category: person.category,
      role: person.role,
      rarity: 'Common'
    };
  }

  if (ref.type === 'invention') {
    const invention = content.inventions[ref.index];
    if (!invention) return null;

    return {
      id: ref.id || `${ref.type}_${ref.index}_${fallbackIndex}`,
      type: 'invention',
      name: invention.name,
      description: invention.description,
      imageUrl: invention.imageUrl,
      category: invention.category,
      rarity: 'Common'
    };
  }

  const place = content.places[ref.index];
  if (!place) return null;

  return {
    id: ref.id || `${ref.type}_${ref.index}_${fallbackIndex}`,
    type: 'place',
    name: place.name,
    description: place.description,
    imageUrl: place.imageUrl,
    location: place.location,
    rarity: 'Common'
  };
};

export const getFirstEraCollectibleCards = (): CollectibleCard[] => {
  const node = FOUNDATIONS_YOUNGER_DRYAS[FIRST_ERA_NODE_ID];
  if (!node?.quiz?.collectibleCards) {
    return [];
  }

  return node.quiz.collectibleCards
    .map((ref, index) => resolveCollectibleCard(ref, node, index))
    .filter((card): card is CollectibleCard => card !== null);
};

export const DEFAULT_COLLECTIBLE_CARDS = getFirstEraCollectibleCards();

export const createDefaultUserProfile = (): UserProfile => ({
  xp: DEFAULT_USER_XP,
  level: DEFAULT_USER_LEVEL,
  collectibleCards: [...DEFAULT_COLLECTIBLE_CARDS],
  nodesCompleted: [...DEFAULT_COMPLETED_NODES]
});

// In-memory collectible cards cache
let collectibleCards: CollectibleCard[] = [...DEFAULT_COLLECTIBLE_CARDS];

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
    collectibleCards = [...DEFAULT_COLLECTIBLE_CARDS];
  }
};
