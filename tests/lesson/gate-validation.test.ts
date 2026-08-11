import { describe, expect, it } from 'vitest';
import { chronosContent } from '../../content/chronos';
import type { ChronosContentBundle } from '../../content/assemble';
import type { LessonPrototypeReview } from '../../src/infrastructure/content/prototypeReview';
import { prepareLessonPreview, validateLessonGate, type LessonGate } from '../../scripts/lesson/gate-validation';

const LESSON_ID = 'lesson.uruk.first-city';
const NOTE_PATH = 'docs/research/uruk-gate-fixture.md';

const review = (): LessonPrototypeReview => ({
  lessonId: LESSON_ID,
  researchNotePath: NOTE_PATH,
  validationTier: 'ordinary',
  mediaIntentions: [{
    sectionId: 'section.uruk.the-built-city',
    kind: 'diagram',
    purpose: 'Show the relationship between canals, streets, and dense buildings.',
    status: 'planned',
  }],
  productReview: { state: 'pending' },
  learnerReview: { required: false, state: 'not-required' },
});

const note = (signoff = false) => `
# Uruk gate fixture

- **Lesson ID:** \`${LESSON_ID}\`

## Node proposal
Bounded lesson proposal.
## Source ledger
Reviewed sources.
## Claim ledger
Atomic claims.
## Content triage
Bounded content.
## Learning blueprint
Learning design.
## Section/component storyboard
Typed sections.
${signoff ? '## Sign-off status\nReviewed.' : ''}
`;

function fixture(): ChronosContentBundle {
  const bundle = structuredClone(chronosContent);
  const lesson = bundle.lessons.find((candidate) => candidate.id === LESSON_ID)!;
  lesson.status = 'draft';
  bundle.prototypeReviews = [review()];
  return bundle;
}

function run(bundle: ChronosContentBundle, gate: LessonGate = 'prototype', noteText = note()) {
  return validateLessonGate({ bundle, lessonId: LESSON_ID, notePath: NOTE_PATH, gate, readNote: () => noteText });
}

describe('lesson production gates', () => {
  it('passes a coherent unpublished learner prototype without inventing a pedagogy score', () => {
    expect(run(fixture())).toEqual({ success: true, errors: [], lessonId: LESSON_ID, gate: 'prototype' });
  });

  it('accepts the existing spaced storyboard heading without requiring a cosmetic note rewrite', () => {
    const existingHeading = note().replace('## Section/component storyboard', '## Section / component storyboard');
    expect(run(fixture(), 'prototype', existingHeading).success).toBe(true);
  });

  it('prepares the exact Learn route by running the prototype gate', () => {
    const result = prepareLessonPreview(fixture(), LESSON_ID, { readNote: () => note() });
    expect(result.success).toBe(true);
    expect(result.route).toBe(`/learn/${LESSON_ID}`);
  });

  it('fails for a missing note or a note that identifies a different lesson', () => {
    const missing = validateLessonGate({ bundle: fixture(), lessonId: LESSON_ID, notePath: NOTE_PATH, gate: 'prototype', readNote: () => { throw new Error('missing'); } });
    expect(missing.errors.join(' ')).toMatch(/missing or unreadable/);
    expect(run(fixture(), 'prototype', note().replace(LESSON_ID, 'lesson.other.fixture')).errors.join(' ')).toMatch(/does not identify this lesson ID/);
  });

  it('rejects metadata on a published lesson and mismatched note identity', () => {
    const published = fixture();
    published.lessons.find((lesson) => lesson.id === LESSON_ID)!.status = 'published';
    expect(run(published).errors.join(' ')).toMatch(/published lessons must not retain prototype review metadata/);

    const mismatched = fixture();
    mismatched.prototypeReviews[0].researchNotePath = 'docs/research/a-different-note.md';
    expect(run(mismatched).errors.join(' ')).toMatch(/does not match prototype metadata/);
  });

  it('rejects invalid section and required-prompt counts', () => {
    const sections = fixture();
    const lesson = sections.lessons.find((candidate) => candidate.id === LESSON_ID)!;
    lesson.sections = lesson.sections.slice(0, 4);
    expect(run(sections).errors.join(' ')).toMatch(/five to eight sections/);

    const prompts = fixture();
    const promptLesson = prompts.lessons.find((candidate) => candidate.id === LESSON_ID)!;
    for (const promptId of promptLesson.promptIds) prompts.prompts.find((prompt) => prompt.id === promptId)!.required = false;
    expect(run(prompts).errors.join(' ')).toMatch(/one to three required prompts, found 0/);
  });

  it('requires coherent section-linked prototype annotations', () => {
    const missing = fixture();
    missing.prototypeReviews = [];
    expect(run(missing).errors.join(' ')).toMatch(/missing LessonPrototypeReview metadata/);

    const broken = fixture();
    broken.prototypeReviews[0].mediaIntentions[0].sectionId = 'section.fixture.missing';
    expect(run(broken).errors.join(' ')).toMatch(/prototype media intention references unknown section/);
  });

  it('surfaces broken claim/source links through the canonical content validator', () => {
    const bundle = fixture();
    const lesson = bundle.lessons.find((candidate) => candidate.id === LESSON_ID)!;
    bundle.claims.find((claim) => claim.id === lesson.claimIds[0])!.sourceIds = ['source.missing.fixture'];
    expect(run(bundle).errors.join(' ')).toMatch(/broken source reference source.missing.fixture/);
  });

  it('requires recorded product approval before implementation', () => {
    expect(run(fixture(), 'implementation').errors.join(' ')).toMatch(/requires recorded product approval/);
    const approved = fixture();
    approved.prototypeReviews[0].productReview = { state: 'approved', reviewedBy: 'Product owner', reviewedOn: '2026-08-11' };
    expect(run(approved, 'implementation').success).toBe(true);
  });

  it('blocks release on planned media, pending provenance, or incomplete required learner review', () => {
    const bundle = fixture();
    bundle.prototypeReviews[0] = {
      ...bundle.prototypeReviews[0],
      validationTier: 'reference',
      productReview: { state: 'approved', reviewedBy: 'Product owner', reviewedOn: '2026-08-11' },
      learnerReview: { required: true, state: 'not-scheduled' },
    };
    const errors = run(bundle, 'release', note(true)).errors.join(' ');
    expect(errors).toMatch(/required learner review is not complete/);
    expect(errors).toMatch(/is still planned/);
    expect(errors).toMatch(/lacks approved provenance/);
  });
});
