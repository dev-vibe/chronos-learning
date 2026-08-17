import type { LessonPrototypeReview } from '../src/infrastructure/content/prototypeReview';
import { egyptNileStatePrototypeReview } from './prototype-reviews/egypt-nile-state';

/**
 * Development and authoring-only review metadata.
 *
 * Keep this registry outside the production content bundle. The Learn shell
 * imports it only in Vite development preview mode, while lesson gate scripts
 * import it directly for deterministic validation.
 */
export const chronosPrototypeReviews: readonly LessonPrototypeReview[] = [egyptNileStatePrototypeReview];
