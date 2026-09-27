import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chronosContent } from '../../content/chronos';
import { chronosPrototypeReviews } from '../../content/prototype-reviews';
import { argumentValue, hasFlag } from './arguments';
import { validateLessonGate } from './gate-validation';
import { mediaPublishCommand, planLessonPublication, publicationNextSteps } from './publication-plan';
import { unregisterPrototypeReview } from './prototype-registry';
import { PROMPT_FINGERPRINTS_PATH, regeneratePromptFingerprints } from '../../src/infrastructure/content/promptFingerprints';

const args = process.argv.slice(2);
const lessonId = argumentValue(args, 'lesson');
const notePath = argumentValue(args, 'note');
const applyStatus = hasFlag(args, 'apply-status');
const root = process.cwd();

if (!lessonId) {
  console.error('Usage: npm run lesson:prepare-publication -- --lesson <lesson-id> [--note <path>] [--apply-status]');
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

const plan = planLessonPublication(chronosContent, lessonId);

console.log(`Publication plan for ${plan.lessonId}`);
console.log(`- journey entry ${plan.entryId} at position ${plan.journeyPosition}`);
console.log(`- required prompts: ${plan.requiredPromptIds.join(', ') || '(none)'}`);
console.log(`- cards a parent's pass awards: ${plan.cardIds.join(', ') || 'none'}`);
console.log(`- media: ${plan.mediaIds.join(', ') || 'none'}`);
console.log(`- ${mediaPublishCommand(plan)}`);

async function applyPublishedStatus(targetLessonId: string): Promise<void> {
  const files = await readdir(resolve(root, 'content/lessons'));
  for (const name of files) {
    if (!name.endsWith('.ts')) continue;
    const path = resolve(root, 'content/lessons', name);
    const source = await readFile(path, 'utf8');
    const hasLiteralId = source.includes(`id: '${targetLessonId}'`) || source.includes(`id: "${targetLessonId}"`);
    const hasLessonIdConstant = (
      source.includes(`const lessonId = '${targetLessonId}'`) || source.includes(`const lessonId = "${targetLessonId}"`)
    ) && /\bid:\s*lessonId\b/.test(source);
    if (!hasLiteralId && !hasLessonIdConstant) continue;
    const draftStatuses = [...source.matchAll(/\bstatus:\s*['"]draft['"]/g)];
    if (draftStatuses.length > 1) {
      throw new Error(`More than one draft status in content/lessons/${name}; refusing to flip an ambiguous file`);
    }
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

if (!applyStatus) console.log('\nPass --apply-status to flip the authored lesson to published. No SQL is needed; publishing is a repository change.');

/** Records the newly published lesson's prompts so later changes to them are caught (docs/architecture/prompt-changes.md). */
async function recordPromptFingerprints(targetLessonId: string): Promise<void> {
  const path = resolve(root, PROMPT_FINGERPRINTS_PATH);
  const recorded = JSON.parse(await readFile(path, 'utf8'));
  const lessons = chronosContent.lessons.map((item) => item.id === targetLessonId ? { ...item, status: 'published' as const } : item);
  const { file, errors } = regeneratePromptFingerprints(chronosContent.prompts, lessons, recorded);
  if (errors.length) throw new Error(`Prompt fingerprints were not updated:\n${errors.map((error) => `- ${error}`).join('\n')}`);
  await writeFile(path, JSON.stringify(file, null, 2) + '\n');
  console.log(`Recorded ${targetLessonId}'s prompt fingerprints in ${PROMPT_FINGERPRINTS_PATH}.`);
}

if (applyStatus) {
  await applyPublishedStatus(lessonId);
  await recordPromptFingerprints(lessonId);
  await stripPrototypeReview(lessonId);
}

console.log('\nNext steps:');
for (const step of publicationNextSteps(plan)) console.log(`- ${step}`);
console.log('- Follow Stage 18 of docs/content/lesson-creation-runbook.md. Do not rediscover platform skills.');
