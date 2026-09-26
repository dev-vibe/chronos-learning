import { describe, expect, it } from 'vitest';
import { chronosContent } from '../../content/chronos';
import { parseSubmittedQuestions, snapshotQuestions } from '../../src/domains/submissions';

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
    expect(parseSubmittedQuestions(null)).toEqual([]);
    expect(parseSubmittedQuestions({})).toEqual([]);
    expect(parseSubmittedQuestions([{ promptId: 'p.a', kind: 'concise-explanation', question: 'Q?' }, { promptId: 'p.b' }, 'junk', { promptId: 'p.c', kind: 'essay', question: 'Q' }]))
      .toEqual([{ promptId: 'p.a', kind: 'concise-explanation', question: 'Q?', required: false }]);
  });
});
