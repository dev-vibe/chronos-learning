import { describe, expect, it } from 'vitest';
import { unregisterPrototypeReview } from '../../scripts/lesson/prototype-registry';

const imported = {
  './prototype-reviews/pyramids-power-and-state-labor': `export const pyramidsPowerStateLaborPrototypeReview = {
  lessonId: 'lesson.egypt.pyramids-and-state-labor',
};`,
  './prototype-reviews/caral-andean-urbanism': `export const caralAndeanUrbanismPrototypeReview = {
  lessonId: 'lesson.caral.andean-urbanism',
};`,
};

describe('prototype review unregistration', () => {
  it('removes the imported review for the published lesson and keeps neighbors', () => {
    const source = `import type { LessonPrototypeReview } from '../src/infrastructure/content/prototypeReview';
import { pyramidsPowerStateLaborPrototypeReview } from './prototype-reviews/pyramids-power-and-state-labor';
import { caralAndeanUrbanismPrototypeReview } from './prototype-reviews/caral-andean-urbanism';

export const chronosPrototypeReviews: readonly LessonPrototypeReview[] = [pyramidsPowerStateLaborPrototypeReview, caralAndeanUrbanismPrototypeReview];
`;
    const { next, changed } = unregisterPrototypeReview(source, 'lesson.egypt.pyramids-and-state-labor', imported);
    expect(changed).toBe(true);
    expect(next).not.toContain('pyramidsPowerStateLaborPrototypeReview');
    expect(next).toContain('caralAndeanUrbanismPrototypeReview');
    expect(next).toContain('export const chronosPrototypeReviews: readonly LessonPrototypeReview[] = [caralAndeanUrbanismPrototypeReview];');
  });

  it('clears a sole imported review to an empty registry', () => {
    const source = `import { pyramidsPowerStateLaborPrototypeReview } from './prototype-reviews/pyramids-power-and-state-labor';
export const chronosPrototypeReviews: readonly LessonPrototypeReview[] = [pyramidsPowerStateLaborPrototypeReview];
`;
    expect(unregisterPrototypeReview(source, 'lesson.egypt.pyramids-and-state-labor', imported).next).toContain('= [];');
  });

  it('removes an inline review object', () => {
    const source = `export const chronosPrototypeReviews: readonly LessonPrototypeReview[] = [{
  lessonId: 'lesson.egypt.pyramids-and-state-labor',
  researchNotePath: 'docs/research/pyramids-power-and-state-labor.md',
  mediaIntentions: [
    { sectionId: 'section.pyramids.giza', kind: 'map', status: 'ready' },
  ],
  productReview: { state: 'approved', reviewedBy: 'Carlin Aylsworth' },
}];
`;
    const { next } = unregisterPrototypeReview(source, 'lesson.egypt.pyramids-and-state-labor');
    expect(next).toContain('= [];');
    expect(next).not.toContain('lesson.egypt.pyramids-and-state-labor');
    expect(next).not.toContain('mediaIntentions');
  });

  it('is a no-op when the lesson is already unregistered', () => {
    const source = `export const chronosPrototypeReviews: readonly LessonPrototypeReview[] = [];
`;
    expect(unregisterPrototypeReview(source, 'lesson.egypt.pyramids-and-state-labor')).toEqual({ next: source, changed: false });
  });
});
