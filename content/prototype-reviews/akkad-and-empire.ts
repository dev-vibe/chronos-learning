import type { LessonPrototypeReview } from '../../src/infrastructure/content/prototypeReview';

export const akkadPrototypeReview: LessonPrototypeReview = {
  lessonId: 'lesson.mesopotamia.akkadian-empire',
  researchNotePath: 'docs/research/akkad-and-the-problem-of-empire.md',
  validationTier: 'high-risk',
  mediaIntentions: [
    { sectionId: 'section.akkad.place-and-question', kind: 'map', status: 'planned', purpose: 'Orient to Mesopotamia, Leilan and Urkesh without a capital dot or invented imperial border.' },
    { sectionId: 'section.akkad.leilan-administration', kind: 'evidence', status: 'planned', purpose: 'Show excavation evidence or a factual diagram of grain work and records, subject to rights and legibility.' },
    { sectionId: 'section.akkad.leilan-administration', kind: 'reconstruction', status: 'planned', purpose: 'Explore one bounded illustrated moment of administrative work only if site-specific references support it; optional visual interest, never a substitute for evidence.' },
    { sectionId: 'section.akkad.urkesh-ties', kind: 'evidence', status: 'planned', purpose: 'Let learners inspect excavated seal impressions naming Tar’am-Agade if rights and legibility permit.' },
    { sectionId: 'section.akkad.naram-sin-stele', kind: 'evidence', status: 'planned', purpose: 'Make surviving Akkadian art inspectable and ask how its composition presents royal power.' },
    { sectionId: 'section.akkad.regional-change', kind: 'diagram', status: 'planned', purpose: 'Compare place-specific changes without a uniform collapse arrow, if chronology and data align.' },
  ],
  productReview: { state: 'pending', notes: 'Owner approved the Stage 3B direction card on 2026-09-22 and requested art where available; learner prototype and final assets remain unapproved.' },
};
