import type { LessonPrototypeReview } from '../../src/infrastructure/content/prototypeReview';

export const wheelsMetalsPrototypeReview: LessonPrototypeReview = {
  lessonId: 'lesson.technology.wheels-metals-and-work',
  researchNotePath: 'docs/research/wheels-metals-and-specialized-work.md',
  validationTier: 'ordinary',
  mediaIntentions: [
    { sectionId: 'section.wheels-metals.copper-axe', kind: 'evidence', status: 'ready', mediaId: 'media.wheels-metals.iceman-axe', purpose: 'Show Ötzi’s actual copper blade. CC BY-SA 4.0 museum photograph, cropped to remove the label.' },
    { sectionId: 'section.wheels-metals.wheels-appear', kind: 'map', status: 'ready', mediaId: 'media.wheels-metals.locator-map', purpose: 'Deterministic Natural Earth locator, Europe and the Middle East with a world inset, marking the lesson’s ten finds and sites as points only. The shell shows it at the opening.' },
    { sectionId: 'section.wheels-metals.ljubljana-wheel', kind: 'evidence', status: 'ready', mediaId: 'media.wheels-metals.ljubljana-wheel', purpose: 'Show the actual Ljubljana Marshes wheel and axle. CC BY-SA 4.0 museum photograph, full frame.' },
    { sectionId: 'section.wheels-metals.ur', kind: 'evidence', status: 'ready', mediaId: 'media.wheels-metals.standard-of-ur', purpose: 'Show the war side of the Standard of Ur with its wagon teams. CC BY-SA 3.0 museum photograph, full frame.' },
    { sectionId: 'section.wheels-metals.what-wheels-needed', kind: 'reconstruction', status: 'not-needed', purpose: 'Optional hero deferred to a bounded follow-up on ASH-115: Carlin generates images with ChatGPT, and the ChatGPT-ready prompt is in the research note. The lesson teaches fully without it.' },
    { sectionId: 'section.wheels-metals.making-metal', kind: 'diagram', status: 'not-needed', purpose: 'The four-step “From ore to tool” knowledge module carries the chain in native text; a diagram would repeat it without adding a relationship.' },
  ],
  productReview: { state: 'approved', reviewedBy: 'Carlin Aylsworth', reviewedOn: '2026-10-29', notes: 'Research beats “all yes” and prototype “approved!” on 2026-10-29, covering the Ljubljana wheel card and final media. The optional reconstruction hero is deferred to a follow-up.' },
};
