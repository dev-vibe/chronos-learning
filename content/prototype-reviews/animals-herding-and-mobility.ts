import type { LessonPrototypeReview } from '../../src/infrastructure/content/prototypeReview';

export const animalsHerdingPrototypeReview: LessonPrototypeReview = {
  lessonId: 'lesson.animals.domestication-and-pastoralism',
  researchNotePath: 'docs/research/animals-herding-and-mobility.md',
  validationTier: 'ordinary',
  mediaIntentions: [
    { sectionId: 'section.animals.ganj-dareh', kind: 'evidence', status: 'ready', mediaId: 'media.animals.ganj-dareh-hoofprints', purpose: 'The actual Ganj Dareh hoofprinted brick (Daly et al. 2021, Fig. 2B, CC BY 4.0), cropped from the figure with no other change, so learners see the opening clue.' },
    { sectionId: 'section.animals.bones-show-herding', kind: 'diagram', status: 'ready', mediaId: 'media.animals.ganj-dareh-survival-chart', purpose: 'Deterministic chart of male and female goat survival at Ganj Dareh, redrawn from Daly et al. 2021 Fig. 2A with plain labels and a text equivalent.' },
    { sectionId: 'section.animals.several-places', kind: 'map', status: 'ready', mediaId: 'media.animals.herding-regions-map', purpose: 'Deterministic Natural Earth world locator with numbered markers and broad zones for the lesson’s seven places; names, orientation and uncertainty in native text; no routes or borders.' },
    { sectionId: 'section.animals.milk-wool-pulling', kind: 'diagram', status: 'not-needed', purpose: 'Native text explains how milk fat is found in pottery; a residue diagram would add chemistry detail without improving the main idea.' },
    { sectionId: 'section.animals.africa-herding-first', kind: 'evidence', status: 'not-needed', purpose: 'No openly licensed Lothagam North photograph exists, the public-domain Saharan rock-art copy is too small and undated, and a reconstruction would need site references we cannot reuse. The regional map carries the place; text carries the evidence.' },
    { sectionId: 'section.animals.why-herders-moved', kind: 'other', status: 'not-needed', purpose: 'Mobility and its limits are carried by native text; the regional map already locates Arabia and the steppe.' },
  ],
  productReview: { state: 'approved', reviewedBy: 'Carlin Aylsworth', reviewedOn: '2026-10-29', notes: 'Carlin replied “approved” on 2026-10-29 to the Stage 14B prototype packet: planned hoofprint photo, survival chart and regional map; the hoofprint Witness card; and the abstract-level wording for the four inaccessible full texts. Approval authorizes final media and publication. In the same message Carlin asked for one question per prompt in very plain language; the lesson’s two-part written prompt was split into two prompts accordingly.' },
};
