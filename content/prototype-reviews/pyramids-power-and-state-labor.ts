import type { LessonPrototypeReview } from '../../src/infrastructure/content/prototypeReview';

export const pyramidsPowerStateLaborPrototypeReview: LessonPrototypeReview = {
  lessonId: 'lesson.egypt.pyramids-and-state-labor',
  researchNotePath: 'docs/research/pyramids-power-and-state-labor.md',
  validationTier: 'high-risk',
  mediaIntentions: [
    {
      sectionId: 'section.pyramids.development',
      kind: 'reconstruction',
      purpose: 'Open with a reference-led comparison that makes the development from stepped to smooth-sided royal monuments legible without presenting one invented building moment as evidence.',
      status: 'planned',
    },
    {
      sectionId: 'section.pyramids.merer-logbook',
      kind: 'evidence',
      purpose: 'Show a legible surviving fragment of Merer’s papyrus only if item-level rights and a mobile crop can be verified; the native-text can-and-cannot module remains the fallback.',
      status: 'planned',
    },
    {
      sectionId: 'section.pyramids.workforce',
      kind: 'evidence',
      purpose: 'Use source-cleared builders’ marks to make named crews visible without turning the marks into a precise workforce chart.',
      status: 'planned',
    },
    {
      sectionId: 'section.pyramids.construction',
      kind: 'diagram',
      purpose: 'Keep the prototype focused on supported components and uncertainty; a construction-method diagram would imply more agreement than the lesson can currently defend.',
      status: 'not-needed',
    },
  ],
  productReview: {
    state: 'pending',
    notes: 'Awaiting Carlin’s learner-prototype checkpoint before any final media production or publication work.',
  },
};
