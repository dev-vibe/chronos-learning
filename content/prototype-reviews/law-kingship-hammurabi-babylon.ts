import type { LessonPrototypeReview } from '../../src/infrastructure/content/prototypeReview';

export const hammurabiPrototypeReview: LessonPrototypeReview = {
  lessonId: 'lesson.mesopotamia.law-and-kingship',
  researchNotePath: 'docs/research/law-kingship-hammurabi-babylon.md',
  validationTier: 'high-risk',
  mediaIntentions: [
    { sectionId: 'section.hammurabi.babylon-and-stele', kind: 'evidence', status: 'planned', purpose: 'Show the actual Louvre SB 8 stele at a readable scale so learners can see its carved relief above the writing; rights and credit must be resolved before runtime use.' },
    { sectionId: 'section.hammurabi.injury-and-status', kind: 'diagram', status: 'not-needed', purpose: 'Native text makes the two remedies and their limits readable without placing unreviewed translated words inside an image.' },
    { sectionId: 'section.hammurabi.field-letter', kind: 'evidence', status: 'planned', purpose: 'Show the actual YBC 9959 tablet if redistribution and legibility permit; the learner must still be able to follow the petition and order in native text.' },
    { sectionId: 'section.hammurabi.sources-and-practice', kind: 'evidence', status: 'not-needed', purpose: 'The later commentary is a dated evidence point, but its tiny fragment would not clarify the central object-versus-letter reasoning at lesson size.' },
  ],
  productReview: { state: 'pending', notes: 'Stage 14B owner prototype review pending. The approved Stage 3B response was “all yes” on 2026-09-24.' },
};
