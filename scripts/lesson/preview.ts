import { spawn } from 'node:child_process';
import { chronosContent } from '../../content/chronos';
import { chronosPrototypeReviews } from '../../content/prototype-reviews';
import { argumentValue } from './arguments';
import { prepareLessonPreview } from './gate-validation';

const lessonId = argumentValue(process.argv.slice(2), 'lesson');
if (!lessonId) {
  console.error('Usage: npm run lesson:preview -- --lesson <lesson-id>');
  process.exit(2);
}

const result = prepareLessonPreview(chronosContent, chronosPrototypeReviews, lessonId);
if (!result.success) {
  console.error(`Preview validation failed for ${lessonId}:\n${result.errors.map((error) => `- ${error}`).join('\n')}`);
  process.exit(1);
}

console.log(`Opening unpublished lesson prototype at ${result.route}`);
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const viteCommand = process.platform === 'win32' ? (process.env.ComSpec ?? 'cmd.exe') : npmCommand;
const viteArguments = process.platform === 'win32'
  ? ['/d', '/s', '/c', npmCommand, 'run', 'dev', '--', '--open', result.route]
  : ['run', 'dev', '--', '--open', result.route];
const vite = spawn(viteCommand, viteArguments, {
  cwd: process.cwd(),
  env: { ...process.env, VITE_UNLOCK_PREVIEW_LESSONS: 'true' },
  stdio: 'inherit',
});

vite.on('error', (error) => {
  console.error(`Could not start Vite: ${error.message}`);
  process.exitCode = 1;
});
vite.on('exit', (code) => { process.exitCode = code ?? 1; });
