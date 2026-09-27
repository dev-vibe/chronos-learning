import { describe, expect, it } from 'vitest';
import { derivePromptRequirementState } from '../../src/learn/prompt-requirements';

const prompts = new Map([
  ['prompt.required.choice', { id: 'prompt.required.choice', kind: 'supported-selection' as const, required: true, bestOptionId: 'option.best' }],
  ['prompt.required.essay', { id: 'prompt.required.essay', kind: 'concise-explanation' as const, required: true }],
  ['prompt.optional.reflection', { id: 'prompt.optional.reflection', kind: 'concise-explanation' as const, required: false }],
]);
const ids = [...prompts.keys()];

describe('prompt requirement state', () => {
  it('does not let an optional prompt block finishing', () => {
    expect(derivePromptRequirementState(ids, prompts, { 'prompt.required.choice': 'option.best', 'prompt.required.essay': 'An answer.' }))
      .toEqual({ requiredIds: ['prompt.required.choice', 'prompt.required.essay'], answeredIds: ['prompt.required.choice', 'prompt.required.essay'], ready: true });
  });

  it('counts a multiple-choice check only once the best-supported answer is picked', () => {
    const wrong = derivePromptRequirementState(ids, prompts, { 'prompt.required.choice': 'option.other', 'prompt.required.essay': 'An answer.' });
    expect(wrong.answeredIds).toEqual(['prompt.required.essay']);
    expect(wrong.ready).toBe(false);
  });
});
