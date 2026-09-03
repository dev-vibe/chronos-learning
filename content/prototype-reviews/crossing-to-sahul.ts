import type { LessonPrototypeReview } from '../../src/infrastructure/content/prototypeReview';

export const crossingToSahulPrototypeReview: LessonPrototypeReview = {
  lessonId: 'lesson.humans.sahul-crossing',
  researchNotePath: 'docs/research/crossing-to-sahul.md',
  validationTier: 'high-risk',
  mediaIntentions: [
    {
      sectionId: 'section.humans.sahul.landmass',
      kind: 'map',
      purpose: 'Show Sahul as one lowered-sea landmass and Wallacea as the water gap, without arrows that fake a known route.',
      status: 'planned',
    },
    {
      sectionId: 'section.humans.sahul.dated-sand',
      kind: 'evidence',
      purpose: 'Let learners see that the dated material is shelter sediment and tools, not a reconstructed first landing.',
      status: 'planned',
    },
    {
      sectionId: 'section.humans.sahul.what-we-can-know',
      kind: 'other',
      purpose: 'The limits section is carried by native text; a decorative image would not teach the bound.',
      status: 'not-needed',
    },
  ],
  productReview: {
    state: 'pending',
  },
};
