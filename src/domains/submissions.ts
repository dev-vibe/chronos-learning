import type { UnderstandingPrompt } from './contracts';

/**
 * One question as the learner saw it when they sent the lesson for review.
 * Review shows these, so a parent can still read the question after the
 * lesson's prompts change (a changed question gets a new prompt ID, and the
 * old one leaves the repository).
 */
export type SubmittedQuestion = {
  promptId: string;
  kind: UnderstandingPrompt['kind'];
  question: string;
  required: boolean;
  /** The "What a strong answer covers" guide at the time of submission. */
  explanation?: string;
  /** Multiple choice only: the label of the option the learner chose. */
  answerLabel?: string;
  /** Multiple choice only: whether the chosen option was the best-supported answer. */
  best?: boolean;
};

/** The questions of a lesson, in lesson order, as the learner sees them now, with their answers. */
export function snapshotQuestions(prompts: readonly UnderstandingPrompt[], answers: Readonly<Record<string, string>>): SubmittedQuestion[] {
  return prompts.map((prompt) => {
    const answer = answers[prompt.id];
    const base: SubmittedQuestion = { promptId: prompt.id, kind: prompt.kind, question: prompt.question, required: prompt.required, explanation: prompt.explanation };
    if (prompt.kind !== 'supported-selection' || typeof answer !== 'string') return base;
    const chosen = prompt.options.find((option) => option.id === answer);
    return { ...base, ...(chosen ? { answerLabel: chosen.label } : {}), best: answer === prompt.bestOptionId };
  });
}

/** Reads a stored snapshot defensively. Anything malformed is dropped rather than shown. */
export function parseSubmittedQuestions(value: unknown): SubmittedQuestion[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item): SubmittedQuestion[] => {
    if (!item || typeof item !== 'object') return [];
    const entry = item as Record<string, unknown>;
    if (typeof entry.promptId !== 'string' || typeof entry.question !== 'string') return [];
    if (entry.kind !== 'supported-selection' && entry.kind !== 'concise-explanation') return [];
    return [{
      promptId: entry.promptId,
      kind: entry.kind,
      question: entry.question,
      required: entry.required === true,
      ...(typeof entry.explanation === 'string' ? { explanation: entry.explanation } : {}),
      ...(typeof entry.answerLabel === 'string' ? { answerLabel: entry.answerLabel } : {}),
      ...(typeof entry.best === 'boolean' ? { best: entry.best } : {}),
    }];
  });
}
