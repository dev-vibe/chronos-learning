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
    expect(out).toContain('Sargon, king of Akkad, wanted everyone to know');
    expect(out).toContain('## People, places and words');
    expect(out).toMatch(/- stele \(Word\): A tall stone slab/);
  }, 60_000);

  it('question checker never sees markup', () => {
    const out = run('scripts/lesson/check-questions.ts', ['--lesson', 'lesson.mesopotamia.akkadian-empire']);
    expect(out).not.toMatch(/\[\[|\]\]/);
  }, 60_000);
});
