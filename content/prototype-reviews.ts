import type { LessonPrototypeReview } from '../src/infrastructure/content/prototypeReview';

/**
 * Development and authoring-only review metadata.
 *
 * Keep this registry outside the production content bundle. The Learn shell
 * imports it only in Vite development preview mode, while lesson gate scripts
 * import it directly for deterministic validation.
 */
export const chronosPrototypeReviews: readonly LessonPrototypeReview[] = [
  {
    lessonId: 'lesson.nubia.kerma-and-nile-world',
    researchNotePath: 'docs/research/kerma-and-middle-nile.md',
    validationTier: 'high-risk',
    mediaIntentions: [
      { sectionId: 'section.kerma.nile-neighbors', kind: 'map', status: 'planned', purpose: 'Locate Kerma in northeastern Africa, in present-day Sudan south of Egypt along the Nile. Planned illustrated locator with wider African context and a source-verified river detail; no ancient borders. The native orientation paragraph carries the location until the final map is reviewed.' },
      { sectionId: 'section.kerma.skilled-makers', kind: 'evidence', status: 'planned', purpose: 'Inspect Kerma-period pottery beaker EA81931 from the wider Northern Dongola Reach as a concrete example of skilled work; its exact workshop is unknown. Planned licensed original photograph with its accession, date and native description; no reconstructed substitute for evidence. Final image and rights review follow prototype approval.' },
    ],
    productReview: { state: 'pending', notes: 'Carlin approved the revised research direction on 2026-09-14. The complete learner prototype, final media plan and no-card ending await separate review.' },
  },
];
