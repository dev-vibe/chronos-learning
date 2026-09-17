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
      { sectionId: 'section.kerma.nile-neighbors', kind: 'map', status: 'ready', mediaId: 'media.kerma.nile-locator', purpose: 'Locate Kerma in northeastern Africa, in present-day Sudan south of Egypt along the Nile. Reviewed illustrated locator with a whole-Africa inset and source-verified geography; no ancient borders.' },
      { sectionId: 'section.kerma.food-and-building', kind: 'evidence', status: 'ready', mediaId: 'media.kerma.western-deffufa', purpose: 'See the surviving Western Deffufa and connect substantial mud-brick construction to the organized materials, labor and food support explained in the section. The caption distinguishes the conserved modern site from the complete ancient building.' },
      { sectionId: 'section.kerma.skilled-makers', kind: 'evidence', status: 'ready', mediaId: 'media.kerma.met-beaker', purpose: 'Inspect the shape and finish of a real Classic Kerma-style beaker, Met 20.2.45, found at Abydos in Egypt. Public-domain museum photograph; exact maker and workshop unknown. Rights-driven object substitution preserves the approved teaching job.' },
      { sectionId: 'section.kerma.egypt-and-change', kind: 'evidence', status: 'ready', mediaId: 'media.kerma.sennuwy', purpose: 'Inspect the Egyptian statue found at Kerma while keeping its manufacture, find context and uncertain journey distinct. The object demonstrates movement and connection, not Egyptian rule by itself.' },
    ],
    productReview: { state: 'approved', reviewedBy: 'Carlin Aylsworth', reviewedOn: '2026-09-14', notes: 'After inspecting the running Kerma prototype, Carlin said “looks good” and “please continue”. Proceed with the required map and licensed evidence photograph and the no-card ending. This is prototype approval, not publication authorization. No separate independent adult-proxy session is claimed.' },
  },
];
