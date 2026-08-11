import { chronosContent } from '../../content/chronos';
import { argumentValue } from './arguments';
import { validateLessonGate, type LessonGate } from './gate-validation';

const lessonId = argumentValue(process.argv.slice(2), 'lesson');
const notePath = argumentValue(process.argv.slice(2), 'note');
const gate = argumentValue(process.argv.slice(2), 'gate') as LessonGate | undefined;

if (!lessonId || !notePath || !gate || !['prototype', 'implementation', 'release'].includes(gate)) {
  console.error('Usage: npm run lesson:gate -- --lesson <lesson-id> --note <path> --gate prototype|implementation|release');
  process.exit(2);
}

const result = validateLessonGate({ bundle: chronosContent, lessonId, notePath, gate });
if (!result.success) {
  console.error(`${gate} gate failed for ${lessonId}:\n${result.errors.map((error) => `- ${error}`).join('\n')}`);
  process.exit(1);
}

console.log(`${gate} gate passed for ${lessonId}. Deterministic content, review, and provenance checks are coherent.`);
