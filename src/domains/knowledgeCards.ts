import type { KnowledgeCard } from './contracts';

const TYPE_LABELS: Record<KnowledgeCard['category'], string> = {
  place: 'Place',
  person: 'Person',
  people: 'People',
  artifact: 'Artifact',
  invention: 'Invention',
  event: 'Event',
  idea: 'Idea',
};

/** Learner-facing card type — category only, never authoring class. */
export function knowledgeCardTypeLabel(category: KnowledgeCard['category']): string {
  return TYPE_LABELS[category];
}
