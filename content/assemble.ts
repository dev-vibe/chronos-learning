import type { Claim, Journey, JourneyInvitation, KnowledgeCard, Lesson, MediaAsset, Source, UnderstandingPrompt } from '../src/domains/contracts';
export type AuthoredContentModule = {
  readonly sources?: readonly Source[];
  readonly claims?: readonly Claim[];
  readonly media?: readonly MediaAsset[];
  readonly prompts?: readonly UnderstandingPrompt[];
  readonly lessons?: readonly Lesson[];
  readonly cards?: readonly KnowledgeCard[];
};

export type ChronosContentBundle = {
  sources: Source[];
  claims: Claim[];
  media: MediaAsset[];
  prompts: UnderstandingPrompt[];
  lessons: Lesson[];
  journeys: Journey[];
  invitations: JourneyInvitation[];
  cards: KnowledgeCard[];
};

export function assembleContent(modules: readonly AuthoredContentModule[], journeys: readonly Journey[], invitations: readonly JourneyInvitation[] = []): ChronosContentBundle {
  return {
    sources: modules.flatMap((module) => [...(module.sources ?? [])]),
    claims: modules.flatMap((module) => [...(module.claims ?? [])]),
    media: modules.flatMap((module) => [...(module.media ?? [])]),
    prompts: modules.flatMap((module) => [...(module.prompts ?? [])]),
    lessons: modules.flatMap((module) => [...(module.lessons ?? [])]),
    journeys: [...journeys],
    invitations: [...invitations],
    cards: modules.flatMap((module) => [...(module.cards ?? [])]),
  };
}
