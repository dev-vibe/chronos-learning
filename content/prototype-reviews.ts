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
    lessonId: 'lesson.caral.andean-urbanism',
    researchNotePath: 'docs/research/caral-andean-urbanism.md',
    validationTier: 'reference',
    mediaIntentions: [
      {
        sectionId: 'section.caral.another-way',
        kind: 'evidence',
        purpose: 'Masthead hero: arrive at Caral from a high-angle view of the sunken circular plaza, axial staircase, and stepped Pirámide Mayor with the valley behind.',
        status: 'ready',
        mediaId: 'media.caral.site-hero',
      },
      {
        sectionId: 'section.caral.coast-and-valley',
        kind: 'map',
        purpose: 'Locate the Pacific, Áspero at the river mouth, and inland Caral on a desert terrace above the Supe Valley without borders or a capital-territory fill.',
        status: 'ready',
        mediaId: 'media.caral.supe-valley-map',
      },
      {
        sectionId: 'section.caral.plaza',
        kind: 'evidence',
        purpose: 'Let learners inspect the surviving sunken circular plaza and platform mound before reading an interpretation of gathering or power.',
        status: 'ready',
        mediaId: 'media.caral.sunken-plaza',
      },
      {
        sectionId: 'section.caral.how-built',
        kind: 'reconstruction',
        purpose: 'Show workers filling fiber bags with stone and stacking them inside a retaining wall, labeled as an evidence-led reconstruction rather than a photographed event.',
        status: 'ready',
        mediaId: 'media.caral.shicra-reconstruction',
      },
    ],
    productReview: {
      state: 'approved',
      reviewedBy: 'Carlin Aylsworth',
      reviewedOn: '2026-08-19',
      notes: 'Approved title/scope/arc, Place/Foundation card card.place.caral, and truthful journey-end behavior. Extra image-wrapping modules added after the more-images request were removed on 2026-08-20 after product-owner correction; hero remains.',
    },
  },
];
