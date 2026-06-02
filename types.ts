
export type Category = 'Science' | 'Military' | 'Literature' | 'Politics' | 'Art' | 'Philosophy' | 'Religion' | 'Exploration' | 'Climate' | 'Myth';

export type HistoryArcKind =
  | 'civilization'
  | 'city'
  | 'empire'
  | 'region'
  | 'religion'
  | 'philosophy'
  | 'technology'
  | 'trade'
  | 'migration'
  | 'war'
  | 'idea'
  | 'archaeology';

export type HistoryArcCoverageTier = 'spine' | 'major' | 'deep';

export type HistoryArcRole =
  | 'ignition'
  | 'milestone'
  | 'turning_point'
  | 'crossover'
  | 'collapse'
  | 'rediscovery';

export interface HistoryArc {
  id: string;
  title: string;
  kind: HistoryArcKind;
  coverageTier: HistoryArcCoverageTier;
  startNodeIds: string[];
  nodeIds: string[];
  parentArcIds?: string[];
  relatedArcIds?: string[];
  essentialQuestions?: string[];
  learningImplications?: string[];
}

export interface PhilosophyLessonTemplate {
  problem: string;
  claim: string;
  change: string;
  implication: string;
}

export interface Era {
  id: string;
  title: string;
  yearRange: string;
  introQuote?: string;
  description?: string;
  details?: {
    concept: string;
    explanation: string;
    keyThemes: string[];
  };
  prehistoryContext?: string;
  modernDiscoveries?: string;
}

export interface TimelineNodeStub {
  id: string;
  title: string;
  year: string;
  eraId: string;
  region: string;
  tags: Category[];
  arcIds?: string[];
  arcRoles?: Record<string, HistoryArcRole>;
}

export interface Resource {
  title: string;
  type: 'Video' | 'Podcast' | 'Article' | 'Activity';
  url?: string;
  isCore: boolean;
  description?: string;
  searchQuery?: string; // Legacy field for backward compatibility
}

export interface HistoricalPerson {
  name: string;
  role: string;
  category: 'Philosopher' | 'Leader' | 'Scientist' | 'Villain' | 'Hero' | 'Artist' | 'Other' | 'Military' | 'Explorer' | 'Worker' | 'Priest' | 'Commoner' | 'Warrior' | 'Athlete' | 'Mythical' | 'Poet' | 'Religious';
  description: string;
  imageUrl?: string;
  imageFit?: 'cover' | 'contain';
  born?: string;
  died?: string;
  nationality?: string;
  achievements?: string[];
  legacy?: string;
  stats?: {
    intellect: number;
    strength: number;
    influence: number;
  };
}

export interface Invention {
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
  imageFit?: 'cover' | 'contain';
  problem?: string;
  solution?: string;
  impact?: string;
  date?: string;
}

export interface Place {
  name: string;
  description: string;
  imageUrl?: string;
  imageFit?: 'cover' | 'contain';
  significance?: string;
  location?: string;
  lore?: string;
}

// Gamification Types
export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Collectible card reference - can point to a person, invention, or place
export interface CollectibleCardRef {
  type: 'person' | 'invention' | 'place';
  index: number; // Index in the people/inventions/places array
  id?: string; // Optional unique ID for the card
}

export interface CollectibleCard {
  id: string;
  type: 'person' | 'invention' | 'place';
  name: string;
  description: string;
  imageUrl?: string;
  imageFit?: 'cover' | 'contain';
  rarity?: 'Common' | 'Rare' | 'Legendary' | 'Mythic' | 'Epic';
  // Additional fields based on type
  category?: string; // For person or invention
  role?: string; // For person
  location?: string; // For place
}

export interface Quiz {
  title: string;
  description?: string;
  questions: QuizQuestion[];
  collectibleCards?: CollectibleCardRef[]; // Cards to unlock when quiz is completed
}

export interface NodeContent {
  heroImageUrl?: string;
  heroImageFit?: 'cover' | 'contain';
  summary: string;
  people: HistoricalPerson[];
  inventions: Invention[];
  places: Place[];
  resources: Resource[];
  funFact: string;
  quiz?: Quiz; // Optional gamification module
}

export interface TimelineNode extends TimelineNodeStub {
  content?: NodeContent;
}

export type MatrixRow =
  | { type: 'separator'; id: string; label: string }
  | { type: 'spine-node'; nodeId: string; laneArcIds: string[] };

export type MatrixNodeProgressState = 'completed' | 'current' | 'available' | 'future-locked';

export type DetailItem = 
  | { type: 'person'; data: HistoricalPerson }
  | { type: 'invention'; data: Invention }
  | { type: 'place'; data: Place };
