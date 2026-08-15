import { readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import type { ChronosContentBundle } from '../../content/assemble';
import type { LessonPrototypeReview } from '../../src/infrastructure/content/prototypeReview';
import { validateContent } from '../../src/infrastructure/content/validate';

export type LessonGate = 'prototype' | 'implementation' | 'release';

export type LessonGateInput = {
  bundle: ChronosContentBundle;
  lessonId: string;
  notePath: string;
  gate: LessonGate;
  cwd?: string;
  readNote?: (absolutePath: string) => string;
};

export type LessonGateResult = {
  success: boolean;
  errors: string[];
  lessonId: string;
  gate: LessonGate;
};

const REQUIRED_NOTE_SECTIONS = [
  'Node proposal',
  'Source ledger',
  'Claim ledger',
  'Content triage',
  'Learning blueprint',
  'Section/component storyboard',
] as const;

function repositoryRelativePath(root: string, candidate: string): { absolute: string; relative: string } | null {
  const absolute = resolve(root, candidate);
  const repoRelative = relative(root, absolute).replaceAll('\\', '/');
  if (!repoRelative || repoRelative === '..' || repoRelative.startsWith('../')) return null;
  return { absolute, relative: repoRelative };
}

function headingExpression(heading: string): RegExp {
  const escaped = heading
    .split('/')
    .map((part) => part.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('\\s*\\/\\s*');
  return new RegExp(`^##\\s+${escaped}\\s*$`, 'i');
}

function hasHeading(note: string, heading: string): boolean {
  const expression = headingExpression(heading);
  return note.split(/\r?\n/).some((line) => expression.test(line));
}

function sectionBody(note: string, heading: string): string {
  const lines = note.split(/\r?\n/);
  const expression = headingExpression(heading);
  const start = lines.findIndex((line) => expression.test(line));
  if (start < 0) return '';
  const endOffset = lines.slice(start + 1).findIndex((line) => /^##\s+/.test(line));
  const end = endOffset < 0 ? lines.length : start + 1 + endOffset;
  return lines.slice(start + 1, end).join('\n');
}

function hasSectionCountException(note: string): boolean {
  const match = note.match(/Section-count exception:\*{0,2}\s*([^\r\n]+)/i);
  if (!match) return false;
  const value = match[1].replaceAll('`', '').trim().toLowerCase();
  return value.length > 4 && !['none', 'n/a', 'not applicable'].includes(value);
}

function findReview(bundle: ChronosContentBundle, lessonId: string): LessonPrototypeReview | undefined {
  return bundle.prototypeReviews.find((review) => review.lessonId === lessonId);
}

export function validateLessonGate({
  bundle,
  lessonId,
  notePath,
  gate,
  cwd = process.cwd(),
  readNote = (path) => readFileSync(path, 'utf8'),
}: LessonGateInput): LessonGateResult {
  const errors: string[] = [];
  const contentResult = validateContent(bundle);
  errors.push(...contentResult.errors.map((error) => `content: ${error}`));

  const lesson = bundle.lessons.find((candidate) => candidate.id === lessonId);
  if (!lesson) return { success: false, errors: [...errors, `lesson not found: ${lessonId}`], lessonId, gate };

  const review = findReview(bundle, lessonId);
  if (!review) errors.push(`${lessonId}: missing LessonPrototypeReview metadata`);
  if (lesson.status !== 'draft') errors.push(`${lessonId}: ${gate} gate requires an unpublished draft lesson`);

  const resolvedNote = repositoryRelativePath(cwd, notePath);
  let note = '';
  if (!resolvedNote) {
    errors.push(`${lessonId}: research note must be inside the repository`);
  } else {
    if (review && resolvedNote.relative !== review.researchNotePath) {
      errors.push(`${lessonId}: note path ${resolvedNote.relative} does not match prototype metadata ${review.researchNotePath}`);
    }
    try {
      note = readNote(resolvedNote.absolute);
    } catch {
      errors.push(`${lessonId}: research note is missing or unreadable at ${resolvedNote.relative}`);
    }
  }

  if (note) {
    if (!new RegExp(`Lesson ID[^\\r\\n]*${lessonId.replaceAll('.', '\\.')}\\b`, 'i').test(note)) {
      errors.push(`${lessonId}: research note does not identify this lesson ID`);
    }
    for (const section of REQUIRED_NOTE_SECTIONS) {
      if (!hasHeading(note, section)) errors.push(`${lessonId}: research note is missing the "${section}" section`);
    }
    if (gate === 'release' && !hasHeading(note, 'Sign-off status') && !hasHeading(note, 'Final sign-off')) {
      errors.push(`${lessonId}: release gate requires a sign-off section`);
    }
  }

  const reachable = bundle.journeys.some((journey) => journey.chapters.some((chapter) => chapter.entries.some((entry) => entry.lessonId === lessonId)));
  if (!reachable) errors.push(`${lessonId}: lesson is not reachable from an authored journey`);

  if ((lesson.sections.length < 5 || lesson.sections.length > 8) && !hasSectionCountException(note)) {
    errors.push(`${lessonId}: lessons require five to eight sections or a documented Section-count exception`);
  }

  const requiredPromptCount = lesson.promptIds.filter((promptId) => bundle.prompts.find((prompt) => prompt.id === promptId)?.required).length;
  if (requiredPromptCount < 1 || requiredPromptCount > 3) {
    errors.push(`${lessonId}: lesson requires one to three required prompts, found ${requiredPromptCount}`);
  }

  const lessonSourceIds = new Set(lesson.sourceIds);
  for (const claimId of lesson.claimIds) {
    const claim = bundle.claims.find((candidate) => candidate.id === claimId);
    if (!claim) continue;
    for (const sourceId of claim.sourceIds) {
      if (!lessonSourceIds.has(sourceId)) errors.push(`${lessonId}: claim ${claimId} source ${sourceId} is not registered by the lesson`);
    }
  }

  if (review) {
    if (review.productReview.state === 'changes-requested') {
      errors.push(`${lessonId}: product review requested changes; return to prototype work`);
    }
    if (gate !== 'prototype' && review.productReview.state !== 'approved') {
      errors.push(`${lessonId}: ${gate} gate requires recorded product approval`);
    }

    if (gate !== 'prototype') {
      const readyMediaIds = review.mediaIntentions
        .filter((intention) => intention.status === 'ready')
        .flatMap((intention) => intention.mediaId ? [intention.mediaId] : []);
      if (readyMediaIds.length > 0) {
        const lifecycle = sectionBody(note, 'Image lifecycle');
        if (!lifecycle) {
          errors.push(`${lessonId}: ${gate} gate requires an "Image lifecycle" section for ready lesson media`);
        } else {
          for (const mediaId of readyMediaIds) {
            if (!lifecycle.includes(mediaId)) errors.push(`${lessonId}: image lifecycle does not identify ready media ${mediaId}`);
          }
        }
      }
    }

    if (gate === 'release') {
      if (review.learnerReview.required && review.learnerReview.state !== 'completed') {
        errors.push(`${lessonId}: required learner review is not complete`);
      }
      if (!review.learnerReview.required && review.learnerReview.state !== 'not-required') {
        errors.push(`${lessonId}: learner review state is inconsistent with its requirement`);
      }
      for (const intention of review.mediaIntentions) {
        if (intention.status === 'planned') errors.push(`${lessonId}: media intention for ${intention.sectionId} is still planned`);
      }
      const finalMediaIds = new Set([...lesson.mediaIds, ...(lesson.heroMediaId ? [lesson.heroMediaId] : [])]);
      for (const mediaId of finalMediaIds) {
        const media = bundle.media.find((candidate) => candidate.id === mediaId);
        if (media?.reviewStatus !== 'approved') errors.push(`${lessonId}: final media ${mediaId} lacks approved provenance`);
      }
      for (const sourceId of lesson.sourceIds) {
        const source = bundle.sources.find((candidate) => candidate.id === sourceId);
        if (source?.reviewStatus !== 'reviewed') errors.push(`${lessonId}: source ${sourceId} still requires review`);
      }
      for (const claimId of lesson.claimIds) {
        const claim = bundle.claims.find((candidate) => candidate.id === claimId);
        if (claim?.reviewStatus !== 'reviewed') errors.push(`${lessonId}: claim ${claimId} still requires review`);
      }
    }
  }

  return { success: errors.length === 0, errors, lessonId, gate };
}

export function prepareLessonPreview(
  bundle: ChronosContentBundle,
  lessonId: string,
  options: Pick<LessonGateInput, 'cwd' | 'readNote'> = {},
): LessonGateResult & { route: string } {
  const review = findReview(bundle, lessonId);
  const result = validateLessonGate({
    bundle,
    lessonId,
    notePath: review?.researchNotePath ?? '',
    gate: 'prototype',
    ...options,
  });
  return { ...result, route: `/learn/${encodeURIComponent(lessonId)}` };
}
