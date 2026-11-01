import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const run = (script: string, args: string[]) => {
  try {
    return execFileSync(process.execPath, ['--import', 'tsx', script, ...args], { encoding: 'utf8', cwd: process.cwd() });
  } catch (error) {
    // check-questions exits 1 when it flags wording; its report is still what we inspect.
    return String((error as { stdout?: string }).stdout ?? '');
  }
};

describe('scripts that read lesson text', () => {
  it('kid read prints plain text plus the panel and the word boxes', () => {
    const out = run('scripts/lesson/kid-read-text.ts', ['--lesson', 'lesson.mesopotamia.akkadian-empire']);
    expect(out).not.toMatch(/\[\[|\]\]/);
    expect(out).toContain('was king of Akkad, a kingdom in what is now Iraq');
    expect(out).toContain('## People, places and words');
    expect(out).toMatch(/- stele \(Word\): A tall stone slab/);
    // The guess before reading prints where it appears, with a note that the lesson waits for it.
    expect(out).toContain('Guess before reading: After the army went home, what would a king need so that the people there kept doing what he said?');
    expect(out).toContain('the rest of the lesson appears only after the learner saves a guess');
    expect(out.indexOf('Guess before reading:')).toBeLessThan(out.indexOf('## What Sargon’s records say'));
    expect(out).toMatch(/So what did it take to keep a city\?[^\n]*\n\[You guessed: /);
  }, 60_000);

  it('question checker never sees markup', () => {
    const out = run('scripts/lesson/check-questions.ts', ['--lesson', 'lesson.mesopotamia.akkadian-empire']);
    expect(out).not.toMatch(/\[\[|\]\]/);
    expect(out).toContain('No wording flags.');
  }, 60_000);
});
