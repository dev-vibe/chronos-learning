// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { HistoricalMapModule as HistoricalMapData, MediaAsset } from '../../src/domains/contracts';
import { HistoricalMapModuleSchema } from '../../src/domains/contracts';
import { HistoricalMapModule } from '../../src/learn/HistoricalMapModule';

afterEach(cleanup);

const map = HistoricalMapModuleSchema.parse({
  id: 'module.fixture.map', type: 'historical-map', title: 'Uruk, Leilan and Urkesh', body: 'Uruk lies far to the south.',
  mediaId: 'media.fixture.map', periodLabel: 'c. 2350–2150 BCE', focusPlace: 'Mesopotamia', modernContext: 'Present-day Iraq and Syria',
  accessibleSummary: 'Three dots along two rivers.', compactLabel: 'Modern site locations', coordinateNote: 'The dots are at the real sites.',
  uncertaintyNote: 'The rivers have moved since then.', depictionStatus: 'evidence-based-reconstruction',
  lookHere: [{ label: 'The two rivers', detail: 'The Tigris and the Euphrates.', sourceIds: ['source.fixture.map'] }],
  sourceIds: ['source.fixture.map'],
}) as HistoricalMapData;
const media: MediaAsset = {
  id: 'media.fixture.map', locator: { provider: 'repository', path: '/images/map.jpg', width: 1600, height: 1000 },
  alt: 'A map of Mesopotamia.', depictionMode: 'map', depictionLabel: 'Illustrated locator', rightsLabel: 'Public Domain',
  sourceIds: ['source.fixture.map'], visualBriefRef: 'docs/research/fixture.md', reviewStatus: 'approved',
};

describe('map information', () => {
  it('shows the authored notes in plain words, with no headings of its own and no eyebrow when none is authored', () => {
    const { container } = render(<HistoricalMapModule module={map} media={media} sources={[]} />);
    const dialog = container.querySelector('.historical-map__dialog')!;
    expect(Array.from(dialog.querySelectorAll('dt')).map((node) => node.textContent)).toEqual(['When', 'Where', 'Today']);
    expect(dialog.textContent).toContain('The dots are at the real sites.');
    expect(dialog.textContent).toContain('The rivers have moved since then.');
    expect(dialog.textContent).not.toMatch(/Coordinate-verified|Approximate ancient landscape|Period|Focus/);
    expect(dialog.querySelector('.historical-map__dialog-header span')).toBeNull();
    expect(screen.queryByText('Look here')).toBeNull();
  });

  it('shows an authored eyebrow when there is one', () => {
    const { container } = render(<HistoricalMapModule module={{ ...map, eyebrow: 'Where this lesson goes' }} media={media} sources={[]} />);
    expect(container.querySelector('.historical-map__dialog-header span')?.textContent).toBe('Where this lesson goes');
  });
});
