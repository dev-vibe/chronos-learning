import type { LessonPrototypeReview } from '../../src/infrastructure/content/prototypeReview';

export const indusPrototypeReview: LessonPrototypeReview = {
  lessonId: 'lesson.indus.cities-and-signs',
  researchNotePath: 'docs/research/indus-cities-and-signs.md',
  validationTier: 'high-risk',
  mediaIntentions: [
    { sectionId: 'section.indus.cities-and-landscapes', kind: 'map', status: 'ready', mediaId: 'media.indus.cities-locator-map', purpose: 'Coordinate-checked locator shared with opening orientation. Modern coastline only; no political border or invented routes.' },
    { sectionId: 'section.indus.water-systems', kind: 'reconstruction', status: 'ready', mediaId: 'media.indus.street-reconstruction', purpose: 'Vivid neighborhood reconstruction opens the lesson; a compact visual guide follows documented household-to-street connections. Replaces the plain diagram after the owner requested more engaging images.' },
    { sectionId: 'section.indus.water-systems', kind: 'reconstruction', status: 'ready', mediaId: 'media.indus.reservoir-reconstruction', purpose: 'Illustrate seasonal storage beside the actual reservoir photograph, with the invented water level and people explicitly labeled.' },
    { sectionId: 'section.indus.water-systems', kind: 'evidence', status: 'ready', mediaId: 'media.indus.reservoir', purpose: 'Licensed original Dholavira reservoir photograph, displayed beside its clearly labeled reconstruction, separately identified from Mohenjo-daro.' },
    { sectionId: 'section.indus.weights-and-work', kind: 'evidence', status: 'ready', mediaId: 'media.indus.weights', purpose: 'Licensed Mohenjo-daro weights photograph; modern museum arrangement and lack of measured scale explicitly distinguished.' },
    { sectionId: 'section.indus.seals-and-signs', kind: 'evidence', status: 'ready', mediaId: 'media.indus.seal', purpose: 'Met public-domain catalog image of the engraved design, preserved without retouching or mirroring. Reused by the Witness card.' },
  ],
  productReview: { state: 'approved', reviewedBy: 'Carlin Aylsworth', reviewedOn: '2026-09-13', notes: 'Carlin approved the text-first prototype with “lgtm” after the independent-review service limit was disclosed, then requested a stronger visual direction because the images were boring. Carlin approved the revised lesson and explicitly authorized publication on September 13 with “please finish. i approve”.' },
};
