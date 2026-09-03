import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { chronosContent } from '../../content/chronos';
import { chronosPrototypeReviews } from '../../content/prototype-reviews';
import { argumentValue, argumentValues, hasFlag } from './arguments';
import { validateLessonGate } from './gate-validation';
import {
  mediaPublishCommand,
  planLessonPublication,
  publicationNextSteps,
  renderPublicationDatabaseTest,
  renderPublicationMigration,
} from './publication-plan';
import { unregisterPrototypeReview } from './prototype-registry';

const args = process.argv.slice(2);
const lessonId = argumentValue(args, 'lesson');
const notePath = argumentValue(args, 'note');
const issueId = argumentValue(args, 'issue');
const snapshotVersion = argumentValue(args, 'snapshot');
const keepUnpublishedId = argumentValue(args, 'keep-unpublished');
const equivalentAliasIds = argumentValues(args, 'equivalent-alias');
const writeFiles = hasFlag(args, 'write');
const applyStatus = hasFlag(args, 'apply-status');
const root = process.cwd();

if (!lessonId) {
  console.error('Usage: npm run lesson:prepare-publication -- --lesson <lesson-id> [--note <path>] [--issue ASH-n] [--equivalent-alias <id>] [--keep-unpublished <id>] [--write] [--apply-status]');
  process.exit(2);
}

const lesson = chronosContent.lessons.find((candidate) => candidate.id === lessonId);
if (!lesson) {
  console.error(`lesson not found: ${lessonId}`);
  process.exit(1);
}

const review = chronosPrototypeReviews.find((item) => item.lessonId === lessonId);
const resolvedNote = notePath ?? review?.researchNotePath;
if (lesson.status === 'draft') {
  if (!resolvedNote) {
    console.error(`${lessonId}: release gate requires --note or prototype-review metadata`);
    process.exit(1);
  }
  const gate = validateLessonGate({
    bundle: chronosContent,
    prototypeReviews: chronosPrototypeReviews,
    lessonId,
    notePath: resolvedNote,
    gate: 'release',
  });
  if (!gate.success) {
    console.error(`release gate failed for ${lessonId}:\n${gate.errors.map((error) => `- ${error}`).join('\n')}`);
    process.exit(1);
  }
}

const plan = planLessonPublication(chronosContent, lessonId, {
  issueId,
  equivalentAliasIds,
  keepUnpublishedId,
  snapshotVersion,
});
const migrationSql = renderPublicationMigration(plan);
const testSql = renderPublicationDatabaseTest(plan);

console.log(`Publication plan for ${plan.lessonId}`);
console.log(`- snapshot: ${plan.snapshotVersion}`);
console.log(`- journey entry ${plan.entryId} at position ${plan.journeyPosition}`);
console.log(`- required prompts: ${plan.requiredPromptIds.join(', ') || '(none)'}`);
console.log(`- cards: ${plan.cardIds.join(', ') || 'none'}`);
console.log(`- aliases: ${plan.aliases.map((alias) => `${alias.legacyId}${alias.semanticallyEquivalent ? ' (equivalent)' : ''}`).join(', ') || 'none'}`);
console.log(`- media: ${plan.mediaIds.join(', ') || 'none'}`);
console.log(`- ${mediaPublishCommand(plan)}`);

async function nextDatabaseTestName(slug: string): Promise<string> {
  const testsDir = resolve(root, 'supabase/tests');
  const names = await readdir(testsDir);
  const next = names
    .map((name) => Number.parseInt(name.slice(0, 3), 10))
    .filter((value) => Number.isInteger(value))
    .reduce((max, value) => Math.max(max, value), 0) + 1;
  return `${String(next).padStart(3, '0')}_${slug}.sql`;
}

async function existingPublishMigration(slug: string): Promise<string | undefined> {
  const names = await readdir(resolve(root, 'supabase/migrations'));
  return names.find((name) => name.includes(`publish_${slug}`));
}

function timestamp(): string {
  const now = new Date();
  const stamp = now.toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  return stamp;
}

async function applyPublishedStatus(targetLessonId: string): Promise<void> {
  const files = await readdir(resolve(root, 'content/lessons'));
  for (const name of files) {
    if (!name.endsWith('.ts')) continue;
    const path = resolve(root, 'content/lessons', name);
    const source = await readFile(path, 'utf8');
    if (!source.includes(`id: '${targetLessonId}'`) && !source.includes(`id: "${targetLessonId}"`)) continue;
    if (!/\bstatus:\s*'draft'/.test(source) && !/\bstatus:\s*"draft"/.test(source)) {
      console.log(`${path} is not an unpublished draft; leaving status unchanged.`);
      return;
    }
    const next = source.replace(/\bstatus:\s*'draft'/, "status: 'published'").replace(/\bstatus:\s*"draft"/, 'status: "published"');
    await writeFile(path, next);
    console.log(`Set ${targetLessonId} to published in content/lessons/${name}.`);
    return;
  }
  throw new Error(`Could not find an authored lesson file for ${targetLessonId}`);
}

async function stripPrototypeReview(targetLessonId: string): Promise<void> {
  const indexPath = resolve(root, 'content/prototype-reviews.ts');
  const source = await readFile(indexPath, 'utf8');
  const importedFiles: Record<string, string> = {};
  for (const match of source.matchAll(/from\s*['"](\.\/prototype-reviews\/[^'"]+)['"]/g)) {
    const specifier = match[1];
    const importedPath = resolve(root, 'content', `${specifier.replace(/^\.\//, '')}.ts`);
    importedFiles[specifier] = await readFile(importedPath, 'utf8');
  }
  const { next, changed } = unregisterPrototypeReview(source, targetLessonId, importedFiles);
  if (!changed) {
    console.log('No prototype-review metadata remains for this lesson.');
    return;
  }
  await writeFile(indexPath, next);
  console.log('Unregistered prototype-review metadata. Archive files under content/prototype-reviews/ stay for provenance.');
}

if (writeFiles) {
  const existing = await existingPublishMigration(plan.slug);
  const migrationName = existing ?? `${timestamp()}_publish_${plan.slug}.sql`;
  const migrationPath = resolve(root, 'supabase/migrations', migrationName);
  if (!existing) await mkdir(dirname(migrationPath), { recursive: true });
  if (existing) {
    console.log(`A publish migration already exists at supabase/migrations/${existing}; not overwriting it.`);
  } else {
    await writeFile(migrationPath, migrationSql);
    console.log(`Wrote supabase/migrations/${migrationName}`);
  }

  const testsDir = resolve(root, 'supabase/tests');
  const existingTest = (await readdir(testsDir)).find((name) => name.includes(plan.slug));
  if (existingTest) {
    console.log(`A database test already exists at supabase/tests/${existingTest}; not overwriting it.`);
  } else {
    const testName = await nextDatabaseTestName(plan.slug);
    await writeFile(resolve(testsDir, testName), testSql);
    console.log(`Wrote supabase/tests/${testName}`);
  }
} else {
  console.log('\nMigration SQL:\n');
  console.log(migrationSql);
  console.log('Database test SQL:\n');
  console.log(testSql);
  console.log('Pass --write to commit these files. Pass --apply-status to flip the authored lesson to published.');
}

if (applyStatus) {
  await applyPublishedStatus(lessonId);
  await stripPrototypeReview(lessonId);
}

console.log('\nNext steps:');
for (const step of publicationNextSteps(plan)) console.log(`- ${step}`);
console.log('- Follow docs/content/lesson-publication.md. Do not rediscover platform skills.');
