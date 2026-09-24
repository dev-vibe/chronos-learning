import type { LessonPrototypeReview } from '../../src/infrastructure/content/prototypeReview';

export const akkadPrototypeReview: LessonPrototypeReview = {
  lessonId: 'lesson.mesopotamia.akkadian-empire',
  researchNotePath: 'docs/research/akkad-and-the-problem-of-empire.md',
  validationTier: 'high-risk',
  mediaIntentions: [
    { sectionId: 'section.akkad.place-and-question', kind: 'map', status: 'ready', mediaId: 'media.akkad.locator', purpose: 'Orient to Mesopotamia, Leilan and Urkesh without a capital dot or invented imperial border.' },
    { sectionId: 'section.akkad.leilan-administration', kind: 'evidence', status: 'not-needed', purpose: 'Yale excavation images have no confirmed redistribution rights; the native work sequence explains the local evidence without a misleading substitute.' },
    { sectionId: 'section.akkad.leilan-administration', kind: 'reconstruction', status: 'not-needed', purpose: 'The lesson already has a locator and two real-object images. A speculative administrative scene would add invention without clarifying the evidence.' },
    { sectionId: 'section.akkad.urkesh-ties', kind: 'evidence', status: 'not-needed', purpose: 'The excavated Tar’am-Agade seal illustrations lack confirmed redistribution rights; the text retains her direct evidence and its limits.' },
    { sectionId: 'section.akkad.urkesh-ties', kind: 'evidence', status: 'ready', mediaId: 'media.akkad.seal-example', purpose: 'A distinct Met Akkadian seal and modern impression show how the material works, explicitly without implying it is an Urkesh find.' },
    { sectionId: 'section.akkad.naram-sin-stele', kind: 'evidence', status: 'ready', mediaId: 'media.akkad.naram-sin-stele', purpose: 'Make surviving Akkadian art inspectable and ask how its composition presents royal power.' },
    { sectionId: 'section.akkad.regional-change', kind: 'diagram', status: 'not-needed', purpose: 'The evidence has incompatible geographic and chronological resolution; a compact prose ending avoids a falsely synchronized collapse picture.' },
  ],
  productReview: { state: 'approved', reviewedBy: 'Carlin Aylsworth', reviewedOn: '2026-09-22', notes: 'Owner approved the Learn-shell draft and evidence-led visual direction with “lgtm.” Final images still require their own rights, fidelity, and visual review. Independent adult proxy review remains outstanding and is not represented as completed.' },
};
