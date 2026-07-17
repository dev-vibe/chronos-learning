import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

describe('shared Learn runtime reusability', () => {
  it('contains no canonical Uruk-only branch in route, progress, or media behavior', () => {
    const runtime = [
      source('../../src/learn/LearnApp.tsx'),
      source('../../src/learn/progress.ts'),
      source('../../src/media/resolve.ts'),
    ].join('\n');
    expect(runtime).not.toContain("'lesson.uruk.first-city'");
    expect(runtime).not.toContain("'card.place.uruk'");
    expect(runtime).not.toContain("'prompt.uruk.");
    expect(runtime).not.toContain("'media.uruk.");
  });
});
