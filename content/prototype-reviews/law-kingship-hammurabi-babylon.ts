import type { LessonPrototypeReview } from '../../src/infrastructure/content/prototypeReview';

export const hammurabiPrototypeReview: LessonPrototypeReview = {
  lessonId: 'lesson.mesopotamia.law-and-kingship',
  researchNotePath: 'docs/research/law-kingship-hammurabi-babylon.md',
  validationTier: 'high-risk',
  mediaIntentions: [
    { sectionId: 'section.hammurabi.babylon-rivals', kind: 'map', status: 'planned', purpose: 'Orient Babylon and Larsa along the Euphrates in Mesopotamia, with present-day Iraq as the wider-world anchor. Use reviewed geography and native accessible labels; no unsupported empire boundary or later city architecture.' },
    { sectionId: 'section.hammurabi.law-stele', kind: 'evidence', status: 'planned', purpose: 'Show the actual Louvre SB 8 stele so learners can see the royal relief above the substantial legal inscription. Resolve rights, credit and phone legibility before runtime use.' },
    { sectionId: 'section.hammurabi.practical-cases', kind: 'diagram', status: 'not-needed', purpose: 'Native text presents the failed harvest, careless irrigation and safekeeping provisions with readable problem-and-response relationships.' },
    { sectionId: 'section.hammurabi.governing-land', kind: 'evidence', status: 'not-needed', purpose: 'The named land request makes government concrete in prose. A small photograph would add little to this supporting episode; the original law stele is the main evidence image.' },
    { sectionId: 'section.hammurabi.legal-significance', kind: 'evidence', status: 'not-needed', purpose: 'The later commentary is a short afterlife point. Its fragment would not clarify the main explanation of kingdom-building and practical law.' },
  ],
  productReview: { state: 'pending', notes: 'Owner rejected the narrow justice-versus-practice framing on 2026-10-04 and directed its replacement after the broader historical focus was described. This rewritten prototype and changed map/stele intentions await Stage 14B owner review; final media and publication are not approved.' },
};
