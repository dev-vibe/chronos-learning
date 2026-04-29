/**
 * Gamification Service - Collectible Cards (in-memory only)
 * Profile state is managed by react-query via UserProfileContext
 */

import { ERAS, INITIAL_NODES } from '../constants';
import { STATIC_CONTENT } from '../staticContent';
import { CollectibleCard, CollectibleCardRef, NodeContent } from '../types';

export interface UserProfile {
  xp: number;
  level: number;
  collectibleCards: CollectibleCard[];
  nodesCompleted: string[];
}

const XP_PER_COMPLETED_NODE = 100;

// Bump this after a lesson is fully fleshed out and should count as completed
// in the demo profile. The app will open the next unlocked unfinished lesson.
export const DEMO_PROFILE_COMPLETED_THROUGH_NODE_ID = 'animal_domestication';

// Use this only when the unlock chain needs extra completed lessons while
// keeping a specific target lesson open for the demo profile.
export const DEMO_PROFILE_ADDITIONAL_COMPLETED_NODE_IDS: string[] = [];

const parseYearForProgress = (year: string): number => {
  let cleaned = year.replace(/^(c\.|ca\.|circa|~)\s*/i, '').trim();
  cleaned = cleaned.replace(/,/g, '');

  const match = cleaned.match(/(\d+(?:\.\d+)?)/);
  if (!match) return 0;

  const numericYear = parseFloat(match[1]);
  if (cleaned.toUpperCase().includes('BCE') || cleaned.toUpperCase().includes('BC')) {
    return -numericYear;
  }

  return numericYear;
};

const getChronologicalNodeIds = (): string[] => {
  return [...INITIAL_NODES]
    .sort((a, b) => parseYearForProgress(a.year) - parseYearForProgress(b.year))
    .map(node => node.id);
};

const getCompletedNodeIdsThrough = (nodeId: string): string[] => {
  const chronologicalNodeIds = getChronologicalNodeIds();
  const completedThroughIndex = chronologicalNodeIds.indexOf(nodeId);

  if (completedThroughIndex === -1) {
    console.warn(`[Gamification] Demo profile progress node not found: ${nodeId}`);
    return [];
  }

  return chronologicalNodeIds.slice(0, completedThroughIndex + 1);
};

const getDemoCompletedNodeIds = (): string[] => {
  const completedNodeIds = new Set(getCompletedNodeIdsThrough(DEMO_PROFILE_COMPLETED_THROUGH_NODE_ID));

  DEMO_PROFILE_ADDITIONAL_COMPLETED_NODE_IDS.forEach(nodeId => {
    completedNodeIds.add(nodeId);
  });

  return getChronologicalNodeIds().filter(nodeId => completedNodeIds.has(nodeId));
};

const calculateDefaultLevel = (nodesCompleted: string[]): number => {
  const completedNodeIds = new Set(nodesCompleted);
  const completedEraCount = ERAS.filter(era => {
    const eraNodeIds = INITIAL_NODES
      .filter(node => node.eraId === era.id)
      .map(node => node.id);

    return eraNodeIds.length > 0 && eraNodeIds.every(nodeId => completedNodeIds.has(nodeId));
  }).length;

  return 1 + completedEraCount;
};

const DEFAULT_COMPLETED_NODES = getDemoCompletedNodeIds();
const DEFAULT_USER_XP = DEFAULT_COMPLETED_NODES.length * XP_PER_COMPLETED_NODE;
const DEFAULT_USER_LEVEL = calculateDefaultLevel(DEFAULT_COMPLETED_NODES);

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
      imageFit: person.imageFit,
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
      imageFit: invention.imageFit,
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
    imageFit: place.imageFit,
    location: place.location,
    rarity: 'Common'
  };
};

export const getNodeCollectibleCards = (node?: NodeContent): CollectibleCard[] => {
  if (!node?.quiz?.collectibleCards) {
    return [];
  }

  return node.quiz.collectibleCards
    .map((ref, index) => resolveCollectibleCard(ref, node, index))
    .filter((card): card is CollectibleCard => card !== null);
};

export const DEFAULT_COLLECTIBLE_CARDS = DEFAULT_COMPLETED_NODES.flatMap(nodeId =>
  getNodeCollectibleCards(STATIC_CONTENT[nodeId])
);

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
