import { createHash } from 'node:crypto';
import type { ChronosContentBundle } from '../../content/assemble';
import type { Journey } from '../../src/domains/contracts';
import { orderedJourneyEntries } from '../../src/domains/journeys/catalog';

export type PublicationAlias = {
  legacyId: string;
  semanticallyEquivalent: boolean;
  reviewNote: string;
};

export type LessonPublicationPlan = {
  lessonId: string;
  title: string;
  slug: string;
  snapshotVersion: string;
  issueId?: string;
  journeyId: string;
  entryId: string;
  journeyPosition: number;
  required: boolean;
  shiftLaterEntries: boolean;
  requiredPromptIds: string[];
  cardIds: string[];
  aliases: PublicationAlias[];
  mediaIds: string[];
  previousLessonId?: string;
  keepUnpublishedId?: string;
};

export type LessonPublicationOptions = {
  issueId?: string;
  equivalentAliasIds?: readonly string[];
  keepUnpublishedId?: string;
  snapshotVersion?: string;
};

const sqlString = (value: string) => `'${value.replaceAll("'", "''")}'`;

export function lessonSlug(lessonId: string): string {
  const segment = lessonId.split('.').at(-1);
  if (!segment) throw new Error(`Cannot derive a publication slug from ${lessonId}`);
  return segment.replaceAll('-', '_');
}

export function defaultSnapshotVersion(lessonId: string): string {
  const segment = lessonId.split('.').at(-1);
  if (!segment) throw new Error(`Cannot derive a snapshot version from ${lessonId}`);
  return `${segment}-v1`;
}

export function publicationTestUserId(lessonId: string): string {
  const hex = createHash('sha256').update(`chronos-publish:${lessonId}`).digest('hex').slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

function findJourneyEntry(bundle: ChronosContentBundle, lessonId: string): {
  journey: Journey;
  entryIndex: number;
  entry: ReturnType<typeof orderedJourneyEntries>[number]['entry'];
  ordered: ReturnType<typeof orderedJourneyEntries>;
} {
  for (const journey of bundle.journeys) {
    const ordered = orderedJourneyEntries(journey);
    const entryIndex = ordered.findIndex(({ entry }) => entry.lessonId === lessonId);
    if (entryIndex >= 0) return { journey, entryIndex, entry: ordered[entryIndex].entry, ordered };
  }
  throw new Error(`${lessonId} is not reachable from an authored journey`);
}

export function planLessonPublication(
  bundle: ChronosContentBundle,
  lessonId: string,
  options: LessonPublicationOptions = {},
): LessonPublicationPlan {
  const lesson = bundle.lessons.find((candidate) => candidate.id === lessonId);
  if (!lesson) throw new Error(`lesson not found: ${lessonId}`);

  const { journey, entryIndex, entry, ordered } = findJourneyEntry(bundle, lessonId);
  const lessonById = new Map(bundle.lessons.map((item) => [item.id, item]));
  const shiftLaterEntries = ordered.slice(entryIndex + 1).some(({ entry: later }) => lessonById.get(later.lessonId)?.status === 'published');
  const requiredPromptIds = lesson.promptIds.filter((promptId) => bundle.prompts.find((prompt) => prompt.id === promptId)?.required);
  if (requiredPromptIds.length < 1) throw new Error(`${lessonId}: publication requires at least one required prompt`);
  const cardIds = bundle.cards.filter((card) => card.unlockLessonId === lessonId).map((card) => card.id);
  const equivalent = new Set(options.equivalentAliasIds ?? []);
  const issuePrefix = options.issueId ? `${options.issueId} ` : '';
  const aliases: PublicationAlias[] = lesson.legacyAliases.map((legacyId) => ({
    legacyId,
    semanticallyEquivalent: equivalent.has(legacyId),
    reviewNote: equivalent.has(legacyId)
      ? `${issuePrefix}approved semantic equivalence for legacy id ${legacyId}`
      : `${issuePrefix}navigation alias only; legacy completion is not equivalent to this lesson`.trim(),
  }));
  const mediaIds = [...new Set([...lesson.mediaIds, ...(lesson.heroMediaId ? [lesson.heroMediaId] : [])])];
  const previousLessonId = [...ordered.slice(0, entryIndex)].reverse().find(({ entry: earlier }) => {
    const earlierLesson = lessonById.get(earlier.lessonId);
    return earlierLesson && earlierLesson.id !== lessonId;
  })?.entry.lessonId;
  const keepUnpublishedId = options.keepUnpublishedId
    ?? ordered.slice(entryIndex + 1).find(({ entry: later }) => lessonById.get(later.lessonId)?.status !== 'published')?.entry.lessonId
    ?? bundle.lessons.find((candidate) => candidate.status !== 'published' && candidate.id !== lessonId)?.id;

  return {
    lessonId,
    title: lesson.title,
    slug: lessonSlug(lessonId),
    snapshotVersion: options.snapshotVersion ?? defaultSnapshotVersion(lessonId),
    issueId: options.issueId,
    journeyId: journey.id,
    entryId: entry.id,
    journeyPosition: entryIndex,
    required: entry.required,
    shiftLaterEntries,
    requiredPromptIds,
    cardIds,
    aliases,
    mediaIds,
    previousLessonId,
    keepUnpublishedId,
  };
}

export function renderPublicationMigration(plan: LessonPublicationPlan): string {
  const lines = [
    plan.issueId
      ? `-- ${plan.issueId}: publish ${plan.title}.`
      : `-- Publish ${plan.title}.`,
    `insert into public.content_lessons (id, snapshot_version, published_at)`,
    `values (${sqlString(plan.lessonId)}, ${sqlString(plan.snapshotVersion)}, now());`,
    '',
    `update public.journeys`,
    `set snapshot_version = ${sqlString(plan.snapshotVersion)}`,
    `where id = ${sqlString(plan.journeyId)};`,
    '',
  ];

  if (plan.shiftLaterEntries) {
    lines.push(
      `-- Insert before already-published later entries. The two-step shift avoids`,
      `-- the non-deferrable unique(journey_id, position) constraint.`,
      `update public.journey_entries`,
      `set position = position + 100`,
      `where journey_id = ${sqlString(plan.journeyId)}`,
      `  and position >= ${plan.journeyPosition};`,
      '',
      `update public.journey_entries`,
      `set position = position - 99`,
      `where journey_id = ${sqlString(plan.journeyId)}`,
      `  and position >= ${plan.journeyPosition + 100};`,
      '',
    );
  }

  lines.push(
    `insert into public.journey_entries (id, journey_id, lesson_id, position, required)`,
    `values (${sqlString(plan.entryId)}, ${sqlString(plan.journeyId)}, ${sqlString(plan.lessonId)}, ${plan.journeyPosition}, ${plan.required});`,
    '',
  );

  if (plan.cardIds.length > 0) {
    lines.push(`insert into public.knowledge_cards (id, snapshot_version)`);
    lines.push('values');
    lines.push(plan.cardIds.map((cardId) => `  (${sqlString(cardId)}, ${sqlString(plan.snapshotVersion)})`).join(',\n') + ';');
    lines.push('');
    lines.push(`insert into public.card_unlocks (lesson_id, card_id, position)`);
    lines.push('values');
    lines.push(plan.cardIds.map((cardId, index) => `  (${sqlString(plan.lessonId)}, ${sqlString(cardId)}, ${index})`).join(',\n') + ';');
    lines.push('');
  }

  if (plan.aliases.length > 0) {
    lines.push(`insert into public.legacy_id_aliases (`);
    lines.push(`  legacy_id,`);
    lines.push(`  canonical_id,`);
    lines.push(`  entity_kind,`);
    lines.push(`  semantic_equivalence_approved,`);
    lines.push(`  review_note`);
    lines.push(`)`);
    lines.push('values');
    lines.push(
      plan.aliases
        .map((alias) => [
          '  (',
          `    ${sqlString(alias.legacyId)},`,
          `    ${sqlString(plan.lessonId)},`,
          `    'lesson',`,
          `    ${alias.semanticallyEquivalent},`,
          `    ${sqlString(alias.reviewNote)}`,
          '  )',
        ].join('\n'))
        .join(',\n') + ';',
    );
    lines.push('');
  }

  lines.push(`insert into public.lesson_completion_configuration (lesson_id, completion_enabled)`);
  lines.push(`values (${sqlString(plan.lessonId)}, true);`);
  lines.push('');
  lines.push(`insert into public.lesson_required_prompts (lesson_id, prompt_id, position)`);
  lines.push('values');
  lines.push(plan.requiredPromptIds.map((promptId, index) => `  (${sqlString(plan.lessonId)}, ${sqlString(promptId)}, ${index})`).join(',\n') + ';');
  lines.push('');
  return lines.join('\n');
}

function assertionCount(plan: LessonPublicationPlan): number {
  return 6
    + (plan.aliases.length > 0 ? 1 : 0)
    + 1
    + (plan.requiredPromptIds.length > 1 ? 1 : 0)
    + 3
    + 3
    + 1
    + (plan.previousLessonId ? 1 : 0)
    + (plan.keepUnpublishedId ? 1 : 0);
}

export function renderPublicationDatabaseTest(plan: LessonPublicationPlan): string {
  const userId = publicationTestUserId(plan.lessonId);
  const email = `publish-${plan.slug}@example.invalid`;
  const key = plan.slug.replaceAll('_', '-');
  const lines = [
    'begin;',
    'create extension if not exists pgtap with schema extensions;',
    'set local search_path=extensions,public;',
    `select plan(${assertionCount(plan)});`,
    '',
    'insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at)',
    `values (${sqlString(userId)},'00000000-0000-0000-0000-000000000000','authenticated','authenticated',${sqlString(email)},'',now(),now(),now());`,
    '',
    `select ok((select published_at is not null from public.content_lessons where id=${sqlString(plan.lessonId)}), 'lesson is published');`,
    `select ok((select completion_enabled from public.lesson_completion_configuration where lesson_id=${sqlString(plan.lessonId)}), 'completion is enabled');`,
    `select is((select count(*) from public.lesson_required_prompts where lesson_id=${sqlString(plan.lessonId)}), ${plan.requiredPromptIds.length}::bigint, 'required prompt count');`,
    `select is((select count(*) from public.card_unlocks where lesson_id=${sqlString(plan.lessonId)}), ${plan.cardIds.length}::bigint, 'card unlock count');`,
    `select is((select position from public.journey_entries where id=${sqlString(plan.entryId)}), ${plan.journeyPosition}, 'journey position');`,
    `select is((select required from public.journey_entries where id=${sqlString(plan.entryId)}), ${plan.required}, 'required entry');`,
  ];

  if (plan.aliases.length > 0) {
    const equivalentCount = plan.aliases.filter((alias) => alias.semanticallyEquivalent).length;
    const navigationCount = plan.aliases.length - equivalentCount;
    if (navigationCount > 0 && equivalentCount === 0) {
      lines.push(`select is((select count(*) from public.legacy_id_aliases where canonical_id=${sqlString(plan.lessonId)} and not semantic_equivalence_approved), ${navigationCount}::bigint, 'legacy aliases do not transfer completion');`);
    } else {
      lines.push(`select is((select count(*) from public.legacy_id_aliases where canonical_id=${sqlString(plan.lessonId)}), ${plan.aliases.length}::bigint, 'legacy alias count');`);
    }
  }

  lines.push('');
  lines.push('set local role authenticated;');
  lines.push(`select set_config('request.jwt.claim.sub',${sqlString(userId)},true);`);
  lines.push('insert into public.learners(id) values(auth.uid());');
  lines.push('insert into public.lesson_progress(learner_id,lesson_id) values');
  lines.push(` (${'auth.uid()'},${sqlString(plan.lessonId)})` + (plan.previousLessonId ? `,` : ';'));
  if (plan.previousLessonId) {
    lines.push(` (${'auth.uid()'},${sqlString(plan.previousLessonId)});`);
  }
  lines.push('');
  lines.push('select throws_ok(');
  lines.push(`  $$select public.complete_lesson_and_acquire_card(${sqlString(plan.lessonId)},${sqlString(`${key}-missing-prompts`)})$$,`);
  lines.push(`  '23514','required prompt attempts missing','rejects completion without attempts'`);
  lines.push(');');

  if (plan.requiredPromptIds.length > 1) {
    lines.push(`insert into public.understanding_prompt_attempts(learner_id,lesson_id,prompt_id,response) values`);
    lines.push(` (auth.uid(),${sqlString(plan.lessonId)},${sqlString(plan.requiredPromptIds[0])},'{}');`);
    lines.push('select throws_ok(');
    lines.push(`  $$select public.complete_lesson_and_acquire_card(${sqlString(plan.lessonId)},${sqlString(`${key}-one-prompt`)})$$,`);
    lines.push(`  '23514','required prompt attempts missing','rejects completion with a partial attempt'`);
    lines.push(');');
    lines.push(`insert into public.understanding_prompt_attempts(learner_id,lesson_id,prompt_id,response) values`);
    lines.push(
      plan.requiredPromptIds.slice(1).map((promptId) => ` (auth.uid(),${sqlString(plan.lessonId)},${sqlString(promptId)},'{}')`).join(',\n') + ';',
    );
  } else {
    lines.push(`insert into public.understanding_prompt_attempts(learner_id,lesson_id,prompt_id,response) values`);
    lines.push(` (auth.uid(),${sqlString(plan.lessonId)},${sqlString(plan.requiredPromptIds[0])},'{}');`);
  }

  lines.push('');
  lines.push(`select is((public.complete_lesson_and_acquire_card(${sqlString(plan.lessonId)},${sqlString(`${key}-complete-once`)})->>'completion'), 'newly-completed', 'completes explicitly');`);
  lines.push(`select is((public.complete_lesson_and_acquire_card(${sqlString(plan.lessonId)},${sqlString(`${key}-complete-once`)})->>'completion'), 'newly-completed', 'same command key returns the original result');`);
  lines.push(`select is((public.complete_lesson_and_acquire_card(${sqlString(plan.lessonId)},${sqlString(`${key}-complete-again`)})->>'completion'), 'already-completed', 'new command observes existing completion');`);

  if (plan.cardIds.length > 0) {
    lines.push(`select is((public.complete_lesson_and_acquire_card(${sqlString(plan.lessonId)},${sqlString(`${key}-card-again`)})->>'cardOwnership'), 'already-owned', 'card is granted only once');`);
    lines.push(`select is((select count(*) from public.card_ownership where learner_id=auth.uid() and card_id=${sqlString(plan.cardIds[0])}), 1::bigint, 'one card exists');`);
    lines.push(`select is((select count(*) from public.card_ownership where learner_id=auth.uid() and source_lesson_id=${sqlString(plan.lessonId)}), ${plan.cardIds.length}::bigint, 'lesson-sourced card count');`);
  } else {
    lines.push(`select is((public.complete_lesson_and_acquire_card(${sqlString(plan.lessonId)},${sqlString(`${key}-no-card`)})->>'cardOwnership'), 'not-configured', 'no-card response is explicit');`);
    lines.push(`select is((public.complete_lesson_and_acquire_card(${sqlString(plan.lessonId)},${sqlString(`${key}-card-array`)})->'cardIds'), '[]'::jsonb, 'card list is empty');`);
    lines.push(`select is((select count(*) from public.card_ownership where learner_id=auth.uid()), 0::bigint, 'completion grants no cards');`);
  }

  lines.push(`select is((select count(*) from public.lesson_progress where learner_id=auth.uid() and lesson_id=${sqlString(plan.lessonId)} and status='completed'), 1::bigint, 'one completion row exists');`);
  if (plan.previousLessonId) {
    lines.push(`select is((select status from public.lesson_progress where learner_id=auth.uid() and lesson_id=${sqlString(plan.previousLessonId)}), 'in_progress', 'completion leaves the previous lesson unchanged');`);
  }
  if (plan.keepUnpublishedId) {
    lines.push('select throws_ok(');
    lines.push(`  $$select public.complete_lesson_and_acquire_card(${sqlString(plan.keepUnpublishedId)},${sqlString(`${key}-unpublished`)})$$,`);
    lines.push(`  '22023','lesson is unpublished or completion is unsupported','keeps the next neighbor unpublished'`);
    lines.push(');');
  }
  lines.push('');
  lines.push('select * from finish();');
  lines.push('rollback;');
  lines.push('');
  return lines.join('\n');
}

export function mediaPublishCommand(plan: LessonPublicationPlan): string {
  if (plan.mediaIds.length === 0) return 'npm run media:publish';
  return `npm run media:publish -- ${plan.mediaIds.map((id) => `--asset ${id}`).join(' ')}`;
}

export function publicationNextSteps(plan: LessonPublicationPlan): string[] {
  return [
    'npm run validate:content',
    'npm run test:domain',
    mediaPublishCommand(plan),
    'Apply the committed publication migration to the Chronos development project.',
    `Smoke the hosted preview at /learn/${plan.lessonId}: two sincere attempts, explicit completion, reopen at the top.`,
    'Push the branch. Let CI run the full suite. Do not re-run npm test or npm run build locally unless CI fails.',
  ];
}
