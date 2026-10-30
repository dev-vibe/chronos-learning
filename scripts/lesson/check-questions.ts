// Flags understanding-prompt wording that learners cannot follow, under
// Stage 12 of docs/content/lesson-creation-runbook.md. It catches the common
// offenders mechanically; it does not replace the Stage 14C kid read.
//
//   npm run lesson:check-questions -- --lesson <lesson-id>   (exit 1 on any flag)
//   npm run lesson:check-questions -- --all                  (report only)
import { chronosContent } from '../../content/chronos';
import type { UnderstandingPrompt } from '../../src/domains/contracts';
import { argumentValue, hasFlag } from './arguments';

type Rule = { pattern: RegExp; why: string };

// Exam stems and research words: ask the real question, name the real thing.
const wordRules: Rule[] = [
  { pattern: /\b(conclusion|best[- ]supported|supports? best|best fits?|strongest|most likely|which statement|which of the following)\b/i, why: 'exam stem: ask the question the right answer answers' },
  { pattern: /\b(evidence|clues?|finds?|sources?|pattern|example)\b/i, why: 'category label: name the actual thing (Merer’s diary, the ovens)' },
  { pattern: /\b(arrangements?|connections?|ties?|relationships?|roles?|significance|aspects?|factors?)\b/i, why: 'abstract noun: say who did what' },
  { pattern: /\b(suggests?|indicates?|demonstrates?|establish(es)?|impl(y|ies)|attest(s|ed)?|infer|analy[sz]e|evaluate|consider)\b/i, why: 'research verb: ask directly' },
  { pattern: /\b(administration|administrative|governed|governance|uniform|polity|ideology|institutions?|elites?)\b/i, why: 'research word: use the lesson’s everyday words' },
  { pattern: /\bresearchers (are )?still\b|\bstill trying to (answer|find out)\b/i, why: 'limit quiz: ask about the history instead' },
];
// Only in the question itself: negatives and multi-part asks.
const questionRules: Rule[] = [
  { pattern: /\bnot\b|n[’']t\b|\bexcept\b|\bcannot\b/i, why: 'negative: ask the positive question' },
  { pattern: /\(\s*[12]\s*\)|\bpart [12]\b/i, why: 'numbered parts: one question per prompt' },
];

const sentences = (text: string) => text.split(/(?<=[.?!])\s+/).filter(Boolean);
const words = (text: string) => text.split(/\s+/).filter(Boolean).length;

function checkPrompt(prompt: UnderstandingPrompt): string[] {
  const flags: string[] = [];
  const scan = (where: string, text: string, rules: Rule[]) => {
    for (const rule of rules) {
      const match = text.match(rule.pattern);
      if (match) flags.push(`${where}: “${match[0]}” — ${rule.why}`);
    }
  };
  scan('question', prompt.question, [...wordRules, ...questionRules]);
  const questionMarks = (prompt.question.match(/\?/g) ?? []).length;
  if (questionMarks !== 1) flags.push(`question: ${questionMarks} question marks — ask exactly one question`);
  const asked = sentences(prompt.question).filter((sentence) => sentence.includes('?')).at(-1);
  if (asked && words(asked) > 20) flags.push(`question: the question sentence has ${words(asked)} words — keep it to about 20`);
  if (words(prompt.question) > 45) flags.push(`question: ${words(prompt.question)} words including background — keep it to about 40`);
  if (prompt.hint) scan('hint', prompt.hint, wordRules);
  else flags.push('hint: missing');
  if (prompt.kind === 'supported-selection') {
    prompt.options.forEach((option, index) => {
      const name = `option ${String.fromCharCode(65 + index)}`;
      scan(name, option.label, wordRules);
      if (words(option.label) > 16) flags.push(`${name}: ${words(option.label)} words — keep options short and plain`);
      if (/\bbut\b/i.test(option.label)) flags.push(`${name}: “but” clause — one plain idea per option`);
      if (option.feedback) scan(`${name} feedback`, option.feedback, wordRules);
      else flags.push(`${name} feedback: missing`);
    });
  }
  return flags;
}

const args = process.argv.slice(2);
const lessonId = argumentValue(args, 'lesson');
const all = hasFlag(args, 'all');
if (!lessonId && !all) {
  console.error('Usage: npm run lesson:check-questions -- --lesson <lesson-id> | --all');
  process.exit(2);
}

const lessons = all ? chronosContent.lessons : chronosContent.lessons.filter((lesson) => lesson.id === lessonId);
if (!lessons.length) {
  console.error(`No lesson with ID ${lessonId}.`);
  process.exit(2);
}

const promptsById = new Map(chronosContent.prompts.map((prompt) => [prompt.id, prompt]));
let flagged = 0;
for (const lesson of lessons) {
  for (const promptId of lesson.promptIds) {
    const prompt = promptsById.get(promptId);
    if (!prompt) continue;
    const flags = checkPrompt(prompt);
    if (!flags.length) continue;
    flagged += 1;
    console.log(`\n${lesson.id} · ${prompt.id}\n  ${prompt.question}`);
    flags.forEach((flag) => console.log(`  - ${flag}`));
  }
}
console.log(flagged ? `\n${flagged} prompt(s) flagged. Fix each flag, or record why it stays in the research note.` : 'No wording flags.');
if (flagged && !all) process.exit(1);
