// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setUnlockPreviewLessonsForTests } from '../../src/config/runtimeFlags';
import type { LessonPrototypeReview } from '../../src/infrastructure/content/prototypeReview';
import { PrototypeMediaIntentions } from '../../src/learn/PrototypeMediaIntentions';

const review: LessonPrototypeReview = {
  lessonId: 'lesson.fixture.prototype',
  researchNotePath: 'docs/research/fixture-prototype.md',
  validationTier: 'ordinary',
  mediaIntentions: [{
    sectionId: 'section.fixture.evidence',
    kind: 'evidence',
    purpose: 'Let reviewers judge whether the source encounter earns its space.',
    status: 'planned',
  }],
  productReview: { state: 'pending' },
  learnerReview: { required: false, state: 'not-required' },
};

beforeEach(() => setUnlockPreviewLessonsForTests(true));
afterEach(() => { cleanup(); setUnlockPreviewLessonsForTests(false); });

describe('prototype media intentions', () => {
  it('renders a clearly marked non-semantic review annotation for an unlocked draft', () => {
    render(<PrototypeMediaIntentions lesson={{ status: 'draft' }} review={review} sectionId="section.fixture.evidence" />);
    const annotation = screen.getByRole('complementary', { name: 'Prototype media intentions' });
    expect(annotation.getAttribute('data-prototype-annotation-for')).toBe('section.fixture.evidence');
    expect(screen.getByText('Not learner content')).toBeTruthy();
    expect(screen.queryByRole('heading')).toBeNull();
    expect(annotation.querySelector('[data-section-id]')).toBeNull();
    expect(annotation.querySelector('input, textarea, button')).toBeNull();
  });

  it('does not render without preview unlocking or for a published lesson', () => {
    setUnlockPreviewLessonsForTests(false);
    const { rerender } = render(<PrototypeMediaIntentions lesson={{ status: 'draft' }} review={review} sectionId="section.fixture.evidence" />);
    expect(screen.queryByRole('complementary')).toBeNull();
    setUnlockPreviewLessonsForTests(true);
    rerender(<PrototypeMediaIntentions lesson={{ status: 'published' }} review={review} sectionId="section.fixture.evidence" />);
    expect(screen.queryByRole('complementary')).toBeNull();
  });
});
