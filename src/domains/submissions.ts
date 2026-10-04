import type { UnderstandingPrompt } from './contracts';

/**
 * A written question as the learner saw it when they sent the lesson for
 * review. Only written answers go to the parent: a multiple-choice check is
 * finished once the learner picks the best-supported answer. The question is
 * stored with the answer so Review can still show it after the lesson's
 * prompts change (a changed question gets a new prompt ID).
 */
export type SubmittedQuestion = {
  promptId: string;
  kind: 'concise-explanation';
  question: string;
  required: boolean;
  /** The "What a strong answer covers" guide at the time of submission. */
  explanation?: string;
};

/** The lesson's written questions, in lesson order. */
export const writtenPrompts = (prompts: readonly UnderstandingPrompt[]): UnderstandingPrompt[] =>
  prompts.filter((prompt) => prompt.kind === 'concise-explanation');

export const snapshotQuestions = (prompts: readonly UnderstandingPrompt[]): SubmittedQuestion[] =>
  writtenPrompts(prompts).map((prompt) => ({ promptId: prompt.id, kind: 'concise-explanation', question: prompt.question, required: prompt.required, explanation: prompt.explanation }));

/** Reads stored questions defensively. Anything malformed is dropped rather than shown. */
export function parseSubmittedQuestions(value: unknown): SubmittedQuestion[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item): SubmittedQuestion[] => {
    if (!item || typeof item !== 'object') return [];
    const entry = item as Record<string, unknown>;
    if (typeof entry.promptId !== 'string' || typeof entry.question !== 'string' || entry.kind !== 'concise-explanation') return [];
    return [{
      promptId: entry.promptId,
      kind: 'concise-explanation',
      question: entry.question,
      required: entry.required === true,
      ...(typeof entry.explanation === 'string' ? { explanation: entry.explanation } : {}),
    }];
  });
}
