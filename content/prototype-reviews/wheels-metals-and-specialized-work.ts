import type { LessonPrototypeReview } from '../../src/infrastructure/content/prototypeReview';

export const wheelsMetalsPrototypeReview: LessonPrototypeReview = {
  lessonId: 'lesson.technology.wheels-metals-and-work',
  researchNotePath: 'docs/research/wheels-metals-and-specialized-work.md',
  validationTier: 'ordinary',
  mediaIntentions: [
    { sectionId: 'section.wheels-metals.copper-axe', kind: 'evidence', status: 'planned', purpose: 'Required. Show Ötzi’s actual copper axe (blade, yew haft and binding) so learners see the object the lesson follows. Licensed photograph only; clear rights with the South Tyrol Museum of Archaeology or use a cleared open-licence photograph. No generated version of this artifact.' },
    { sectionId: 'section.wheels-metals.wheels-appear', kind: 'map', status: 'planned', purpose: 'Recommended. Locator map, Europe and the Middle East as the wider anchor, marking Flintbek, Bronocice, the Carpathian Basin wagon models, Uruk, the Ljubljana Marshes, Ötzi’s find site with southern Tuscany, Belovode, Arslantepe and Ur. Points only; no routes, borders or “spread” arrows.' },
    { sectionId: 'section.wheels-metals.ljubljana-wheel', kind: 'evidence', status: 'planned', purpose: 'Required. Show the actual Ljubljana Marshes wheel and axle so learners can find the two planks, oak strips and square hub described beside it. Licensed photograph from the City Museum of Ljubljana or the CC BY-NC-SA monograph, subject to rights review.' },
    { sectionId: 'section.wheels-metals.ur', kind: 'evidence', status: 'planned', purpose: 'Required. Show the war side of the Standard of Ur so learners see four-wheeled, solid-wheeled wagons and their four-animal teams. British Museum or cleared open-licence photograph.' },
    { sectionId: 'section.wheels-metals.what-wheels-needed', kind: 'reconstruction', status: 'planned', purpose: 'Preferred / optional hero. Evidence-based reconstruction of two oxen pulling a two-wheeled cart beside a lake-side pile-dwelling village in the Ljubljana Marshes around 3200 BCE. The wheels and axle follow the Stare Gmajne find; the cart body, people, harness and houses are labelled as generalized. A ChatGPT-ready prompt is in the research note.' },
    { sectionId: 'section.wheels-metals.making-metal', kind: 'diagram', status: 'not-needed', purpose: 'The four-step “From ore to tool” knowledge module carries the chain in native text; a diagram would repeat it without adding a relationship.' },
  ],
  productReview: { state: 'pending', notes: 'Carlin approved all five research beats (“all yes”) on 2026-10-29. This prototype and its media intentions await Stage 14B owner review; final media and publication are not approved.' },
};
