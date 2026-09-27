import { describe, expect, it } from 'vitest';
import { chronosContent } from '../../content/chronos';
import { parseSubmittedQuestions, snapshotQuestions } from '../../src/domains/submissions';

const promptById = new Map(chronosContent.prompts.map((prompt) => [prompt.id, prompt]));
const uruk = chronosContent.lessons.find((lesson) => lesson.id === 'lesson.uruk.first-city')!;

describe('submitted questions', () => {
  it('records only the written questions, in lesson order', () => {
    expect(snapshotQuestions(uruk.promptIds.map((id) => promptById.get(id)!))).toEqual([
      expect.objectContaining({ promptId: 'prompt.uruk.opportunity-and-cost', kind: 'concise-explanation', required: true }),
    ]);
  });

  it('reads stored questions defensively', () => {
    expect(parseSubmittedQuestions(null)).toEqual([]);
    expect(parseSubmittedQuestions([{ promptId: 'p.a', kind: 'concise-explanation', question: 'Q?' }, { promptId: 'p.b' }, 'junk', { promptId: 'p.c', kind: 'supported-selection', question: 'Q' }]))
      .toEqual([{ promptId: 'p.a', kind: 'concise-explanation', question: 'Q?', required: false }]);
  });
});
