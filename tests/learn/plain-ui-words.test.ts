import { mkdtempSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { plainWordProblems } from '../../src/domains/plainWords';
import { uiStrings } from '../support/uiStrings';

// The Learn shell puts no teaching words of its own around lesson content: every
// learner-facing label is authored in the lesson, or is neutral control text
// ("Check my answer", "Hint", "Save my answer"). This scans the words the shell
// itself can put on screen for the plain-words table in Stage 12 of
// docs/content/lesson-creation-runbook.md. Lesson content is checked by the
// lesson runbooks, not here.
const learnFiles = readdirSync('src/learn')
  .filter((name) => /\.tsx?$/.test(name))
  // Owner-only prototype review panel, marked "Not learner content".
  .filter((name) => name !== 'PrototypeMediaIntentions.tsx')
  .map((name) => `src/learn/${name}`);

const shellFiles = [
  ...learnFiles,
  'src/domains/lessonOrientation.ts',
  'src/domains/knowledgeCards.ts',
  'src/app/GlobalNavigation.tsx',
  'src/app/JourneySwitcher.tsx',
  'src/app/ProfileSwitcher.tsx',
  // Parent Review reads the same questions; it gets the same plain words.
  'src/app/FamilyApp.tsx',
];

describe('plain words in the Learn shell', () => {
  it('finds no banned word in any string the shell puts on screen', () => {
    const problems = shellFiles.flatMap((file) => uiStrings(file).flatMap((entry) =>
      plainWordProblems(entry.text).map((problem) => `${entry.file}:${entry.line} “${problem.word}” in “${entry.text}” (instead: ${problem.instead})`)));
    expect(problems).toEqual([]);
  });

  it('reads the strings a component can show, and would catch the old wording', () => {
    const dir = mkdtempSync(join(tmpdir(), 'plain-words-'));
    const file = join(dir, 'Fixture.tsx');
    writeFileSync(file, `
      import { thing } from './evidence-layout';
      const label = { evidence: 'Surviving evidence' };
      export function Fixture({ kind, busy }: { kind: string; busy: boolean }) {
        if (kind === 'evidence') return null;
        return <div className="evidence-module" data-kind="evidence">
          <details><summary>Keep the evidence nearby</summary></details>
          <textarea placeholder="Use an example from the lesson…" />
          <button aria-label={\`Open the \${kind} clue\`}>{busy ? 'Saving…' : 'Check my answer'}</button>
          Yes! That’s the best-supported answer.
        </div>;
      }`);
    const texts = uiStrings(file).map((entry) => entry.text);
    expect(texts).toEqual(expect.arrayContaining(['Surviving evidence', 'Keep the evidence nearby', 'Use an example from the lesson…', 'Open the clue', 'Saving…', 'Check my answer', 'Yes! That’s the best-supported answer.']));
    // Class names, data attributes, imports and comparisons are not words for people.
    expect(texts).not.toContain('evidence');
    expect(texts).not.toContain('evidence-module');
    expect(texts).not.toContain('./evidence-layout');
    expect(texts.filter((text) => plainWordProblems(text).length)).toEqual([
      'Surviving evidence', 'Keep the evidence nearby', 'Use an example from the lesson…', 'Open the clue', 'Yes! That’s the best-supported answer.',
    ]);
  });
});
