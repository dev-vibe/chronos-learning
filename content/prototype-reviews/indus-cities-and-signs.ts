import type { LessonPrototypeReview } from '../../src/infrastructure/content/prototypeReview';

export const indusPrototypeReview: LessonPrototypeReview = {
  lessonId: 'lesson.indus.cities-and-signs',
  researchNotePath: 'docs/research/indus-cities-and-signs.md',
  validationTier: 'high-risk',
  mediaIntentions: [
    { sectionId: 'section.indus.cities-and-landscapes', kind: 'map', status: 'planned', purpose: 'Required locator map: locate Harappa, Mohenjo-daro and Dholavira against reviewed South Asian geography. Show regional variation without a solid political border or invented trade routes. It will also serve the opening orientation; no separate decorative hero.' },
    { sectionId: 'section.indus.water-systems', kind: 'evidence', status: 'planned', purpose: 'Required paired evidence, presented separately: a source-identified Mohenjo-daro drain and a Dholavira reservoir. Keep excavation/conservation visible and labels readable; no invented reconstruction of plumbing. Review redistribution rights before acquisition.' },
    { sectionId: 'section.indus.weights-and-work', kind: 'evidence', status: 'planned', purpose: 'Recommended core: a licensed photograph of excavated weights with reliable scale/context. Their graduated sizes support the written measurement evidence; appearance alone cannot establish mass or a specific tax.' },
    { sectionId: 'section.indus.seals-and-signs', kind: 'evidence', status: 'planned', purpose: 'Required: direct public-domain image of Met seal 49.40.2, about 3.8 cm across. Preserve every engraved mark; distinguish the animal/short inscription from the uncertain object identification. Keep the Harappa house assemblage as a separately attributed contextual example. Proposed Witness card reuses this evidence image after approval.' },
  ],
  productReview: { state: 'pending', notes: 'Carlin resumed production on 2026-09-11 after the research and workflow review. This is a new learner-prototype review; final images, card implementation and publication remain behind approval.' },
};
