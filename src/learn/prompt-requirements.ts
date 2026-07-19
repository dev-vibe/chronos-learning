import type { UnderstandingPrompt } from '../domains/contracts';

type PromptRequirement = Pick<UnderstandingPrompt, 'id' | 'required'>;

export type PromptRequirementState = {
  requiredIds: string[];
  attemptedCount: number;
  ready: boolean;
};

export function derivePromptRequirementState(
  lessonPromptIds: readonly string[],
  prompts: ReadonlyMap<string, PromptRequirement>,
  attemptedPromptIds: readonly string[],
): PromptRequirementState {
  const requiredIds = lessonPromptIds.filter((id) => prompts.get(id)?.required === true);
  const attempted = new Set(attemptedPromptIds);
  const attemptedCount = requiredIds.filter((id) => attempted.has(id)).length;
  return { requiredIds, attemptedCount, ready: attemptedCount === requiredIds.length };
}
