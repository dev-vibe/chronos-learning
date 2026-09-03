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
      status: 'ready',
      mediaId: 'media.humans.sahul-landmass-map',
    },
    {
      sectionId: 'section.humans.sahul.dated-sand',
      kind: 'evidence',
      purpose: 'Show scans of actual recovered stones, distinguishing observable shape from the dating supplied by their layer context.',
      status: 'ready',
      mediaId: 'media.humans.madjedbebe-grinding-stones',
    },
    {
      sectionId: 'section.humans.sahul.what-we-can-know',
      kind: 'other',
      purpose: 'The limits section is carried by native text; a decorative image would not teach the bound.',
      status: 'not-needed',
    },
  ],
  productReview: {
    state: 'approved',
    reviewedBy: 'Carlin Aylsworth',
    reviewedOn: '2026-09-03',
    notes: 'Approved the revised writing and requested completion of the lesson build: “perfect. please finish that lesson build from here”. Continue the planned map, Madjedbebe evidence image, and Sahul Place / Foundation card.',
  },
};
