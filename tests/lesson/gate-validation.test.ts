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

const lifecycle = (mediaId: string) => `
## Image lifecycle

### \`${mediaId}\` — City plan

#### 1. Reasoning and source basis
[Source context](https://example.org/source)

![Reference](https://example.org/reference.png)

#### 2. Reference image actually used
The source image above was the composition reference.

#### 3. Generation or transformation
\`\`\`text
Preserve the exact layout while changing only the illustration style.
\`\`\`

#### 4. Accepted final image
![Accepted final](/images/generated/final.png)

- SHA-256: fixture
- Reviewer/date/status: Product owner / 2026-08-11 / accepted
- Fidelity verdict: Preserved relationship and layout.
`;

function fixture(): ChronosContentBundle {
  const bundle = structuredClone(chronosContent);
  bundle.lessons.find((candidate) => candidate.id === LESSON_ID)!.status = 'draft';
  return bundle;
}

function run(bundle: ChronosContentBundle, prototypeReviews = [review()], gate: LessonGate = 'prototype', noteText = note()) {
  return validateLessonGate({ bundle, prototypeReviews, lessonId: LESSON_ID, notePath: NOTE_PATH, gate, readNote: () => noteText });
}

describe('lesson production gates', () => {
  it('passes a coherent unpublished learner prototype without inventing a pedagogy score', () => {
    expect(run(fixture())).toEqual({ success: true, errors: [], lessonId: LESSON_ID, gate: 'prototype' });
  });

  it('accepts the existing spaced storyboard heading without requiring a cosmetic note rewrite', () => {
    expect(run(fixture(), [review()], 'prototype', note().replace('## Section/component storyboard', '## Section / component storyboard')).success).toBe(true);
  });

  it('prepares the exact Learn route by running the prototype gate', () => {
    const result = prepareLessonPreview(fixture(), [review()], LESSON_ID, { readNote: () => note() });
    expect(result.success).toBe(true);
    expect(result.route).toBe(`/learn/${LESSON_ID}`);
  });

  it('fails for a missing note or a note that identifies a different lesson', () => {
    const missing = validateLessonGate({ bundle: fixture(), prototypeReviews: [review()], lessonId: LESSON_ID, notePath: NOTE_PATH, gate: 'prototype', readNote: () => { throw new Error('missing'); } });
    expect(missing.errors.join(' ')).toMatch(/missing or unreadable/);
    expect(run(fixture(), [review()], 'prototype', note().replace(LESSON_ID, 'lesson.other.fixture')).errors.join(' ')).toMatch(/does not identify this lesson ID/);
  });

  it('rejects metadata on a published lesson and mismatched note identity', () => {
    const published = fixture();
    published.lessons.find((lesson) => lesson.id === LESSON_ID)!.status = 'published';
    expect(run(published).errors.join(' ')).toMatch(/published lessons must not retain prototype review metadata/);

    const mismatched = review();
    mismatched.researchNotePath = 'docs/research/a-different-note.md';
    expect(run(fixture(), [mismatched]).errors.join(' ')).toMatch(/does not match prototype metadata/);
  });

  it('rejects invalid section and required-prompt counts', () => {
    const sections = fixture();
    sections.lessons.find((candidate) => candidate.id === LESSON_ID)!.sections = sections.lessons.find((candidate) => candidate.id === LESSON_ID)!.sections.slice(0, 4);
    expect(run(sections).errors.join(' ')).toMatch(/five to eight sections/);

    const prompts = fixture();
    const lesson = prompts.lessons.find((candidate) => candidate.id === LESSON_ID)!;
    for (const promptId of lesson.promptIds) prompts.prompts.find((prompt) => prompt.id === promptId)!.required = false;
    expect(run(prompts).errors.join(' ')).toMatch(/one to three required prompts, found 0/);
  });

  it('rejects a required prompt that is registered but never rendered', () => {
    const bundle = fixture();
    const lesson = bundle.lessons.find((candidate) => candidate.id === LESSON_ID)!;
    const [missingPromptId, replacementPromptId] = lesson.promptIds;
    lesson.sections = lesson.sections.map((section) => ({
      ...section,
      modules: section.modules.map((module) => module.type === 'prompt' && module.promptId === missingPromptId
        ? { ...module, promptId: replacementPromptId }
        : module),
    }));
    expect(run(bundle).errors.join(' ')).toMatch(/required prompt .* is not rendered/);
  });

  it('requires coherent section-linked prototype annotations', () => {
    expect(run(fixture(), []).errors.join(' ')).toMatch(/missing LessonPrototypeReview metadata/);
    const broken = review();
    broken.mediaIntentions[0].sectionId = 'section.fixture.missing';
    expect(run(fixture(), [broken]).errors.join(' ')).toMatch(/prototype media intention references unknown section/);
  });

  it('surfaces broken claim/source links through the canonical content validator', () => {
    const bundle = fixture();
    const lesson = bundle.lessons.find((candidate) => candidate.id === LESSON_ID)!;
    bundle.claims.find((claim) => claim.id === lesson.claimIds[0])!.sourceIds = ['source.missing.fixture'];
    expect(run(bundle).errors.join(' ')).toMatch(/broken source reference source.missing.fixture/);
  });

  it('requires recorded product approval before implementation', () => {
    expect(run(fixture(), [review()], 'implementation').errors.join(' ')).toMatch(/requires recorded product approval/);
    const approved = review();
    approved.productReview = { state: 'approved', reviewedBy: 'Product owner', reviewedOn: '2026-08-11' };
    expect(run(fixture(), [approved], 'implementation').success).toBe(true);
  });

  it('requires a complete, inspectable image lifecycle for every ready media intention', () => {
    const bundle = fixture();
    const approved = review();
    approved.productReview = { state: 'approved', reviewedBy: 'Product owner', reviewedOn: '2026-08-11' };
    const mediaId = bundle.lessons.find((lesson) => lesson.id === LESSON_ID)!.mediaIds[0];
    approved.mediaIntentions[0] = { ...approved.mediaIntentions[0], status: 'ready', mediaId };

    expect(run(bundle, [approved], 'implementation').errors.join(' ')).toMatch(/requires an "Image lifecycle" section/);
    expect(run(bundle, [approved], 'implementation', `${note()}\n${lifecycle(mediaId)}`).success).toBe(true);
    expect(run(bundle, [approved], 'implementation', `${note()}\n${lifecycle(mediaId).replace('#### 3. Generation or transformation', '#### Generation')}`).errors.join(' ')).toMatch(/missing generation or transformation/);
  });

  it('blocks release on planned media or pending provenance', () => {
    const approved = review();
    approved.validationTier = 'reference';
    approved.productReview = { state: 'approved', reviewedBy: 'Product owner', reviewedOn: '2026-08-11' };
    const errors = run(fixture(), [approved], 'release', note(true)).errors.join(' ');
    expect(errors).toMatch(/is still planned/);
    expect(errors).toMatch(/lacks approved provenance/);
  });
});
