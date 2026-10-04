import type { LessonPrototypeReview } from '../../src/infrastructure/content/prototypeReview';

export const hammurabiPrototypeReview: LessonPrototypeReview = {
  lessonId: 'lesson.mesopotamia.law-and-kingship',
  researchNotePath: 'docs/research/law-kingship-hammurabi-babylon.md',
  validationTier: 'high-risk',
  mediaIntentions: [
    { sectionId: 'section.hammurabi.babylon-rivals', kind: 'map', status: 'ready', mediaId: 'media.hammurabi.locator', purpose: 'Locate Babylon northwest of Larsa in West Asia and present-day Iraq. Reviewed modern geography and native orientation; no empire boundary.' },
    { sectionId: 'section.hammurabi.law-stele', kind: 'evidence', status: 'ready', mediaId: 'media.hammurabi.law-stele', purpose: 'Show the surviving Louvre SB 8 stone, relief and inscription using the rights-cleared full-object CC0 photograph.' },
    { sectionId: 'section.hammurabi.practical-cases', kind: 'diagram', status: 'not-needed', purpose: 'Native text presents the failed harvest, careless irrigation and safekeeping provisions with readable problem-and-response relationships.' },
    { sectionId: 'section.hammurabi.governing-land', kind: 'evidence', status: 'not-needed', purpose: 'The named land request makes government concrete in prose. A small photograph would add little to this supporting episode; the original law stele is the main evidence image.' },
    { sectionId: 'section.hammurabi.legal-significance', kind: 'evidence', status: 'not-needed', purpose: 'The later commentary is a short afterlife point. Its fragment would not clarify the main explanation of kingdom-building and practical law.' },
  ],
  productReview: { state: 'approved', reviewedBy: 'Carlin Aylsworth', reviewedOn: '2026-10-04', notes: 'Carlin Aylsworth replied “perfect. approved” on 2026-10-04 to the rewritten local prototype, revised map/stele intentions and card plan. Stage 14B approval authorizes final media and publication, including the public GitHub lesson handoff identified in the preceding message.' },
};
