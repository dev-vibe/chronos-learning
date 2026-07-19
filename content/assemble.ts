import type { Claim, Journey, KnowledgeCard, Lesson, MediaAsset, Source, UnderstandingPrompt } from '../src/domains/contracts';

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
  cards: KnowledgeCard[];
};

export function assembleContent(modules: readonly AuthoredContentModule[], journeys: readonly Journey[]): ChronosContentBundle {
  return {
    sources: modules.flatMap((module) => [...(module.sources ?? [])]),
    claims: modules.flatMap((module) => [...(module.claims ?? [])]),
    media: modules.flatMap((module) => [...(module.media ?? [])]),
    prompts: modules.flatMap((module) => [...(module.prompts ?? [])]),
    lessons: modules.flatMap((module) => [...(module.lessons ?? [])]),
    journeys: [...journeys],
    cards: modules.flatMap((module) => [...(module.cards ?? [])]),
  };
}
