import type { LessonPrototypeReview } from '../../src/infrastructure/content/prototypeReview';

export const manyBeginningsOfFarmingPrototypeReview: LessonPrototypeReview = {
  lessonId: 'lesson.farming.multiple-origins',
  researchNotePath: 'docs/research/many-beginnings-of-farming.md',
  validationTier: 'reference',
  mediaIntentions: [
    {
      sectionId: 'section.farming.multi.what-domestication',
      kind: 'diagram',
      purpose: 'Compare a wild cereal ear that drops ripe grains with a domesticated ear that holds them for harvest.',
      status: 'ready',
      mediaId: 'media.farming.wild-domesticated-wheat',
    },
    {
      sectionId: 'section.farming.multi.five-beginnings',
      kind: 'map',
      purpose: 'Locate illustrative early food-production regions without borders, pinpoint firsts, diffusion arrows, or a claim that the set is complete.',
      status: 'ready',
      mediaId: 'media.farming.multiple-origins-map',
    },
    {
      sectionId: 'section.farming.multi.different-evidence',
      kind: 'other',
      purpose: 'Ask which clues survive from cereal farming versus tropical root-crop and wetland cultivation, and what each evidence set leaves uncertain.',
      status: 'not-needed',
    },
  ],
  productReview: {
    state: 'approved',
    reviewedBy: 'Carlin Aylsworth',
    reviewedOn: '2026-08-11',
    notes: 'Approved the learner-prototype checkpoint in the Codex task: "love the prototype".',
  },
};
