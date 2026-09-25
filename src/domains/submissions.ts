import type { UnderstandingPrompt } from './contracts';

/**
 * One question as the learner saw it when they sent the lesson for review.
 * The learner's browser writes it into the submission, so a parent can still
 * read the question after the lesson's prompts change (a changed question
 * always gets a new prompt ID, and the old one leaves the repository).
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
export function parseSubmittedQuestions(value: unknown): SubmittedQuestion[] | undefined {
  if (!Array.isArray(value)) return undefined;
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

export type ReviewEntry = {
  promptId: string;
  question: string;
  /** The answer in words, or undefined when the learner left it blank. */
  answer?: string;
  verdict?: 'best' | 'other';
  explanation?: string;
  /** The lesson no longer has this question; it is shown as the learner saw it. */
  retired: boolean;
};

/**
 * What a parent reads on Review: each question the learner was shown, with
 * their answer.
 *
 * - A prompt still in the repository is rendered from the repository. Its ID
 *   guarantees the question is the one the learner saw (the fingerprint guard
 *   enforces it), and the browser-supplied snapshot is not trusted over it.
 * - A prompt that has left the repository is rendered from the snapshot.
 * - A submission from before snapshots existed lists the lesson's current
 *   prompts, then any answer whose question is no longer available.
 */
export function reviewEntries(
  lessonPromptIds: readonly string[],
  promptById: ReadonlyMap<string, UnderstandingPrompt>,
  answers: Readonly<Record<string, string>>,
  snapshot?: readonly SubmittedQuestion[],
): ReviewEntry[] {
  const current = new Set(lessonPromptIds);
  const snapshotById = new Map((snapshot ?? []).map((entry) => [entry.promptId, entry]));
  const shown = snapshot ? snapshot.map((entry) => entry.promptId) : [...lessonPromptIds];
  const order = [...shown, ...Object.keys(answers).filter((id) => !shown.includes(id))];

  return order.map((promptId): ReviewEntry => {
    const raw = typeof answers[promptId] === 'string' && answers[promptId] !== '' ? answers[promptId] : undefined;
    const retired = !current.has(promptId);
    const prompt = promptById.get(promptId);
    if (prompt) {
      if (prompt.kind === 'supported-selection') {
        const label = raw === undefined ? undefined : prompt.options.find((option) => option.id === raw)?.label ?? snapshotById.get(promptId)?.answerLabel ?? raw;
        return { promptId, question: prompt.question, answer: label, verdict: raw === undefined ? undefined : raw === prompt.bestOptionId ? 'best' : 'other', explanation: prompt.explanation, retired };
      }
      return { promptId, question: prompt.question, answer: raw, explanation: prompt.explanation, retired };
    }
    const saved = snapshotById.get(promptId);
    if (saved) {
      const answer = raw === undefined ? undefined : saved.kind === 'supported-selection' ? saved.answerLabel ?? raw : raw;
      const verdict = raw === undefined || saved.kind !== 'supported-selection' || saved.best === undefined ? undefined : saved.best ? 'best' : 'other';
      return { promptId, question: saved.question, answer, verdict, explanation: saved.explanation, retired: true };
    }
    return { promptId, question: 'A question that is no longer in this lesson', answer: raw, retired: true };
  });
}
