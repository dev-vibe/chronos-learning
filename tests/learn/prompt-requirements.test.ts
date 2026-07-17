import { describe, expect, it } from 'vitest';
import { derivePromptRequirementState } from '../../src/learn/prompt-requirements';

describe('prompt requirement state', () => {
  it('does not let an optional prompt block completion or inflate required attempt copy', () => {
    const prompts = new Map([
      ['prompt.required.evidence', { id: 'prompt.required.evidence', required: true }],
      ['prompt.optional.reflection', { id: 'prompt.optional.reflection', required: false }],
    ]);

    expect(derivePromptRequirementState(
      ['prompt.required.evidence', 'prompt.optional.reflection'],
      prompts,
      ['prompt.required.evidence'],
    )).toEqual({
      requiredIds: ['prompt.required.evidence'],
      attemptedCount: 1,
      ready: true,
    });
  });
});
