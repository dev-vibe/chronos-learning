import type { LessonPrototypeReview } from '../../src/infrastructure/content/prototypeReview';

export const egyptNileStatePrototypeReview: LessonPrototypeReview = {
  lessonId: 'lesson.egypt.nile-state',
  researchNotePath: 'docs/research/the-nile-and-an-early-egyptian-state.md',
  validationTier: 'reference',
  mediaIntentions: [
    {
      sectionId: 'section.egypt.river-corridor',
      kind: 'map',
      purpose: 'Show the Nile flowing north through the southern valley into the northern delta, with the relative locations of Nekhen, Abydos, and the Memphis region—without invented borders or conquest arrows.',
      status: 'planned',
    },
    {
      sectionId: 'section.egypt.read-palette',
      kind: 'evidence',
      purpose: 'Present both faces of the Narmer Palette at inspection quality so learners can observe crowns, scale, attendants, signs, animals, and violence before reading an interpretation.',
      status: 'planned',
    },
    {
      sectionId: 'section.egypt.making-rule-travel',
      kind: 'reconstruction',
      purpose: 'Make administration human through an evidence-led Nile landing and storehouse scene with boats, containers, seals, labels, and varied workers—without pyramids or later-period visual clichés.',
      status: 'planned',
    },
  ],
  productReview: {
    state: 'pending',
    notes: 'Product-review record prepared. The independent learner-proxy pass is still required before requesting product-owner review of the lesson flow, three visual teaching jobs, and proposed Narmer Palette Artifact / Witness card.',
  },
};
