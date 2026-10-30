// Prints the learner-facing text of one lesson, in page order, for the
// Stage 14C kid read in docs/content/lesson-creation-runbook.md.
// Leaves out everything a learner never reads: IDs, purposes, claims,
// sources, alt text, explanations and (unless --feedback) option feedback.
import { chronosContent } from '../../content/chronos';
import type { LessonModule, UnderstandingPrompt } from '../../src/domains/contracts';
import { argumentValue, hasFlag } from './arguments';

const args = process.argv.slice(2);
const lessonId = argumentValue(args, 'lesson');
const withFeedback = hasFlag(args, 'feedback');
if (!lessonId) {
  console.error('Usage: npm run lesson:kid-read -- --lesson <lesson-id> [--feedback]');
  process.exit(2);
}

const lesson = chronosContent.lessons.find((candidate) => candidate.id === lessonId);
if (!lesson) {
  console.error(`No lesson with ID ${lessonId}.`);
  process.exit(1);
}

const promptsById = new Map(chronosContent.prompts.map((prompt) => [prompt.id, prompt]));
const out: string[] = [];
const line = (text = '') => out.push(text);
// The question appears in place; its choices and hint are printed at the end,
// so a reader says what each question asks before seeing them (in the app the
// hint stays hidden until the learner opens it).
const asked: UnderstandingPrompt[] = [];

const writePrompt = (prompt: UnderstandingPrompt) => {
  asked.push(prompt);
  line();
  line(`Question ${asked.length}: ${prompt.question}`);
  line(prompt.kind === 'supported-selection' ? '  (multiple choice: the choices are at the end)' : '  (written answer)');
};

const writeChoicesAndHints = () => {
  if (!asked.length) return;
  line();
  line('## Choices and hints (look only after saying what each question asks)');
  asked.forEach((prompt, index) => {
    line();
    line(`Question ${index + 1}`);
    if (prompt.kind === 'supported-selection') {
      prompt.options.forEach((option, optionIndex) => line(`  ${String.fromCharCode(65 + optionIndex)}) ${option.label}`));
    } else {
      line('  [Answer box]');
    }
    if (prompt.hint) line(`  Hint (hidden until opened): ${prompt.hint}`);
    if (withFeedback && prompt.kind === 'supported-selection') {
      line('  Feedback shown after picking each choice:');
      prompt.options.forEach((option, optionIndex) => line(`    ${String.fromCharCode(65 + optionIndex)}) ${option.feedback ?? '(none)'}`));
    }
  });
};

const notes = (items: { label?: string; detail?: string }[] | undefined) => items?.forEach((item) => line(`- ${item.label}: ${item.detail}`));

const writeModule = (module: LessonModule) => {
  switch (module.type) {
    case 'prose':
      line(module.body);
      break;
    case 'knowledge':
      line(`[${module.eyebrow}]`);
      line(module.body);
      notes(module.items);
      break;
    case 'scene':
      line(`[Picture] ${module.title}`);
      line(module.body);
      notes(module.hotspots);
      break;
    case 'evidence':
      line(`[Picture: ${module.artifactLabel}] ${module.title}`);
      line(module.body);
      notes(module.lookHere);
      if (module.scaleNote) line(`About scale: ${module.scaleNote}`);
      if (module.comparison) line(`- ${module.comparison.label}: ${module.comparison.detail}`);
      break;
    case 'historical-map':
      line(`[Map: ${module.eyebrow}] ${module.title}`);
      line(module.body);
      notes(module.lookHere);
      break;
    case 'prompt': {
      const prompt = promptsById.get(module.promptId);
      if (prompt) writePrompt(prompt);
      break;
    }
  }
  line();
};

line(`# ${lesson.title}`);
line(`${lesson.masthead} · ${lesson.place} · ${lesson.chronology.display}`);
if (lesson.heroCaption) line(lesson.heroCaption);
for (const section of lesson.sections) {
  line();
  line(`## ${section.heading}`);
  section.modules.forEach(writeModule);
}
writeChoicesAndHints();

console.log(out.join('\n').replace(/\n{3,}/g, '\n\n'));
