import type { LessonPrototypeReview } from '../../src/infrastructure/content/prototypeReview';

export const pyramidsPowerStateLaborPrototypeReview: LessonPrototypeReview = {
  lessonId: 'lesson.egypt.pyramids-and-state-labor',
  researchNotePath: 'docs/research/pyramids-power-and-state-labor.md',
  validationTier: 'high-risk',
  mediaIntentions: [
    {
      sectionId: 'section.pyramids.giza',
      kind: 'diagram',
      purpose: 'Compare the different links in the Giza evidence chain—dated record, monument context, radiocarbon, and newly detected space—without depicting one link as proof of every phase.',
      status: 'planned',
    },
    {
      sectionId: 'section.pyramids.osirion',
      kind: 'evidence',
      purpose: 'Place the protected Seti-marked structural component beside the two surface-luminescence results so reviewers can judge whether the unresolved phase conflict becomes clearer.',
      status: 'planned',
    },
    {
      sectionId: 'section.pyramids.hawara',
      kind: 'diagram',
      purpose: 'Distinguish ancient testimony, excavated inscriptional context, geophysical anomaly, and excavation ground truth in one source-role comparison.',
      status: 'planned',
    },
    {
      sectionId: 'section.pyramids.vessels',
      kind: 'evidence',
      purpose: 'Compare a securely catalogued early stone vessel with a measured mesh and tool-process evidence so precision, provenance, age, and method remain separate questions.',
      status: 'planned',
    },
  ],
  productReview: {
    state: 'pending',
    notes: 'Awaiting Carlin’s review of the rebuilt evidence-led prototype, no-card decision, and four proposed visual jobs before final media or publication work.',
  },
};
