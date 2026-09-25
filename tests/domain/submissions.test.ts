import { describe, expect, it } from 'vitest';
import { chronosContent } from '../../content/chronos';
import { parseSubmittedQuestions, reviewEntries, snapshotQuestions } from '../../src/domains/submissions';

const promptById = new Map(chronosContent.prompts.map((prompt) => [prompt.id, prompt]));
const uruk = chronosContent.lessons.find((lesson) => lesson.id === 'lesson.uruk.first-city')!;
const prompts = uruk.promptIds.map((id) => promptById.get(id)!);

describe('submitted question snapshots', () => {
  it('records every current question in lesson order, with the chosen label and verdict for multiple choice', () => {
    const snapshot = snapshotQuestions(prompts, { 'prompt.uruk.administration-evidence': 'option.uruk.tablets' });
    expect(snapshot.map((entry) => entry.promptId)).toEqual(uruk.promptIds);
    expect(snapshot[0]).toMatchObject({ kind: 'supported-selection', answerLabel: 'Administrative tablets and cylinder seals', best: true, required: true });
    expect(snapshot[1]).not.toHaveProperty('best');
  });

  it('reads stored snapshots defensively', () => {
    expect(parseSubmittedQuestions(null)).toBeUndefined();
    expect(parseSubmittedQuestions({})).toBeUndefined();
    expect(parseSubmittedQuestions([{ promptId: 'p.a', kind: 'concise-explanation', question: 'Q?' }, { promptId: 'p.b' }, 'junk', { promptId: 'p.c', kind: 'essay', question: 'Q' }]))
      .toEqual([{ promptId: 'p.a', kind: 'concise-explanation', question: 'Q?', required: false }]);
  });

  it('lists snapshot questions first, then any answer not in the snapshot', () => {
    const entries = reviewEntries(uruk.promptIds, promptById, { 'prompt.old.a': 'A', 'prompt.old.b': 'B' }, [{ promptId: 'prompt.old.a', kind: 'concise-explanation', question: 'Old A?', required: true }]);
    expect(entries).toEqual([
      { promptId: 'prompt.old.a', question: 'Old A?', answer: 'A', verdict: undefined, explanation: undefined, retired: true },
      { promptId: 'prompt.old.b', question: 'A question that is no longer in this lesson', answer: 'B', retired: true },
    ]);
  });
});
