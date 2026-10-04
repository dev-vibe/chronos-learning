import type { UnderstandingPrompt } from '../domains/contracts';

type PromptRequirement = Pick<UnderstandingPrompt, 'id' | 'required' | 'kind'> & { bestOptionId?: string };

export type PromptRequirementState = {
  requiredIds: string[];
  answeredIds: string[];
  ready: boolean;
};

/**
 * A multiple-choice check counts once the learner has picked the best-supported
 * answer (they can try again until they do). A written answer counts once saved;
 * the parent reviews it.
 */
export function isPromptAnswered(prompt: PromptRequirement | undefined, response: string | undefined): boolean {
  if (!prompt || !response) return false;
  return prompt.kind === 'supported-selection' ? response === prompt.bestOptionId : true;
}

export function derivePromptRequirementState(
  lessonPromptIds: readonly string[],
  prompts: ReadonlyMap<string, PromptRequirement>,
  responses: Readonly<Record<string, string>>,
): PromptRequirementState {
  const requiredIds = lessonPromptIds.filter((id) => prompts.get(id)?.required === true);
  const answeredIds = lessonPromptIds.filter((id) => isPromptAnswered(prompts.get(id), responses[id]));
  return { requiredIds, answeredIds, ready: requiredIds.every((id) => answeredIds.includes(id)) };
}
