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
      status: 'ready',
      mediaId: 'media.pyramids.giza-evidence-chain',
    },
    {
      sectionId: 'section.pyramids.osirion',
      kind: 'evidence',
      purpose: 'Place the protected Seti-marked structural component beside the two surface-luminescence results so reviewers can judge whether the unresolved phase conflict becomes clearer.',
      status: 'ready',
      mediaId: 'media.pyramids.osirion-evidence-pair',
    },
    {
      sectionId: 'section.pyramids.hawara',
      kind: 'diagram',
      purpose: 'Distinguish ancient testimony, excavated inscriptional context, geophysical anomaly, and excavation ground truth in one source-role comparison.',
      status: 'ready',
      mediaId: 'media.pyramids.hawara-evidence-streams',
    },
    {
      sectionId: 'section.pyramids.vessels',
      kind: 'evidence',
      purpose: 'Compare a securely catalogued early stone vessel with a measured mesh and tool-process evidence so precision, provenance, age, and method remain separate questions.',
      status: 'ready',
      mediaId: 'media.pyramids.vessel-evidence-test',
    },
  ],
  productReview: {
    state: 'approved',
    reviewedBy: 'Carlin Aylsworth',
    reviewedOn: '2026-09-03',
    notes: 'Approved after the narrative-voice revision with “much better! please continue the lesson creation.” Approval covers the rebuilt evidence-led lesson, no-card decision, and four proposed visual teaching jobs; publication remains gated on implementation and release review.',
  },
};
