// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { LessonModule, MediaAsset } from '../../src/domains/contracts';
import { LessonModuleSchema } from '../../src/domains/contracts';
import { EvidenceModule } from '../../src/learn/EvidenceModule';

afterEach(cleanup);

const module: Extract<LessonModule, { type?: 'evidence' }> = {
  id: 'module.fixture.evidence', type: 'evidence', title: 'Patterns beneath the soil',
  artifactLabel: 'Scan illustration', body: 'An illustration of a published rendering.',
  mediaId: 'media.fixture.scan', claimIds: [], sourceIds: ['source.fixture.scan'],
};
const media: MediaAsset = {
  id: 'media.fixture.scan', locator: { provider: 'repository', path: '/images/scan.jpg', width: 1688, height: 932 },
  alt: 'Blue rectangular patterns inside green and red bands.', depictionMode: 'diagram',
  depictionLabel: 'Illustration after a rendering', rightsLabel: 'Source attribution',
  sourceIds: ['source.fixture.scan'], visualBriefRef: 'docs/research/fixture.md', reviewStatus: 'approved',
};

describe('evidence card', () => {
  it('labels the card with its own authored artifact label and shows the scale note as written', () => {
    const authored = LessonModuleSchema.parse({ ...module, layout: 'stacked', scaleNote: 'No verified scale bar is supplied.' });
    if (authored.type !== 'evidence') throw new Error('Expected evidence module');
    const { container } = render(<EvidenceModule module={authored} media={media} />);
    expect(container.querySelector('.evidence-type')?.textContent).toBe('Scan illustration');
    // The depiction mode is a styling hook, not a fixed label.
    expect(container.querySelector('figure')?.getAttribute('data-depiction')).toBe('diagram');
    expect(screen.queryByText(/Illustrated interpretation|Surviving evidence|About scale/)).toBeNull();
    expect(screen.getByRole('complementary').textContent).toBe('No verified scale bar is supplied.');
    expect(screen.getByRole('img').getAttribute('alt')).toBe(media.alt);
    expect(container.querySelector('figure')?.classList.contains('evidence-module--stacked')).toBe(true);
  });

  it('uses the same authored label for surviving objects, and plain words for the picture details', () => {
    const { container } = render(<EvidenceModule module={module} media={{ ...media, depictionMode: 'evidence' }} />);
    expect(container.querySelector('.evidence-type')?.textContent).toBe('Scan illustration');
    expect(screen.queryByText('Surviving evidence')).toBeNull();
    expect(screen.queryByRole('complementary')).toBeNull();
    expect(screen.getByText('About this picture').tagName).toBe('SUMMARY');
    expect(Array.from(container.querySelectorAll('dt')).map((node) => node.textContent)).toEqual(['Picture', 'Permission']);
    expect(container.querySelector('figure')?.classList.contains('evidence-module--stacked')).toBe(true);
  });

  it('labels look-here notes and a comparison picture only with their authored labels', () => {
    const authored = LessonModuleSchema.parse({
      ...module,
      lookHere: [{ label: 'The marks', detail: 'Short lines pressed in rows.', sourceIds: ['source.fixture.scan'] }],
      comparison: { mediaId: 'media.fixture.other', label: 'The surviving reservoir', detail: 'A photograph of the dug-out basin.', sourceIds: ['source.fixture.scan'] },
    });
    if (authored.type !== 'evidence') throw new Error('Expected evidence module');
    const { container } = render(<EvidenceModule module={authored} media={media} comparisonMedia={{ ...media, id: 'media.fixture.other' }} />);
    expect(screen.queryByText(/Look here|Comparison image/)).toBeNull();
    expect(container.querySelector('.look-here')?.textContent).toBe('The marksShort lines pressed in rows.');
    expect(Array.from(container.querySelectorAll('dt')).map((node) => node.textContent)).toContain('The surviving reservoir');
  });
});
