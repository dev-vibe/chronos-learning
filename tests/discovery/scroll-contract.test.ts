import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

describe('discovery route document scrolling', () => {
  it('overrides the legacy HTML shell scroll lock', () => {
    const html = source('../../index.html');
    const styles = source('../../src/app/app.css');

    expect(html).toContain('h-screen overflow-hidden');
    expect(styles).toMatch(/body\.discovery-route\{[^}]*height:auto!important/);
    expect(styles).toMatch(/body\.discovery-route\{[^}]*overflow-y:auto!important/);
    expect(styles).toMatch(/body\.discovery-route #root\{[^}]*min-height:100vh/);
  });
});
