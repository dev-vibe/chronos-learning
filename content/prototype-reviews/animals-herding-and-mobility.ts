import type { LessonPrototypeReview } from '../../src/infrastructure/content/prototypeReview';

export const animalsHerdingPrototypeReview: LessonPrototypeReview = {
  lessonId: 'lesson.animals.domestication-and-pastoralism',
  researchNotePath: 'docs/research/animals-herding-and-mobility.md',
  validationTier: 'ordinary',
  mediaIntentions: [
    { sectionId: 'section.animals.ganj-dareh', kind: 'evidence', status: 'planned', purpose: 'Recommended core: the actual 2017 Ganj Dareh brick with three hoofprints (Daly et al. 2021, Fig. 2B, CC BY 4.0), direct use with crop only, so learners see the opening clue.' },
    { sectionId: 'section.animals.bones-show-herding', kind: 'diagram', status: 'planned', purpose: 'Recommended core: native/deterministic survival chart of male versus female goats at Ganj Dareh, redrawn from Daly et al. 2021 Fig. 2A data, with the Asiab hunted pattern as a labelled contrast and a text equivalent.' },
    { sectionId: 'section.animals.several-places', kind: 'map', status: 'planned', purpose: 'Recommended: world locator in the Akkad map standard showing broad herding regions (Zagros/Fertile Crescent, Indus, Andes, Sahara, Lake Turkana, northwest Arabia, western steppe) with approximate dates; no arrows or routes.' },
    { sectionId: 'section.animals.milk-wool-pulling', kind: 'diagram', status: 'not-needed', purpose: 'Native text explains how milk fat is found in pottery; a residue diagram would add chemistry detail without improving the main idea.' },
    { sectionId: 'section.animals.africa-herding-first', kind: 'evidence', status: 'not-needed', purpose: 'No openly licensed Lothagam North photograph exists, the public-domain Saharan rock-art copy is too small and undated, and a reconstruction would need site references we cannot reuse. The regional map carries the place; text carries the evidence.' },
    { sectionId: 'section.animals.why-herders-moved', kind: 'other', status: 'not-needed', purpose: 'Mobility and its limits are carried by native text; the regional map already locates Arabia and the steppe.' },
  ],
  productReview: { state: 'pending' },
};
