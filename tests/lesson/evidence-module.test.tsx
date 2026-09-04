// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { LessonModule, MediaAsset } from '../../src/domains/contracts';
import { LessonModuleSchema } from '../../src/domains/contracts';
import { EvidenceModule } from '../../src/learn/EvidenceModule';

afterEach(cleanup);

const module: Extract<LessonModule, { type: 'evidence' }> = {
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
  it('distinguishes an illustrated interpretation and exposes the scale limitation beside the image', () => {
    const authored = LessonModuleSchema.parse({ ...module, layout: 'stacked', scaleNote: 'No verified scale bar is supplied.' });
    if (authored.type !== 'evidence') throw new Error('Expected evidence module');
    const { container } = render(<EvidenceModule module={authored} media={media} />);
    expect(screen.getByText('Illustrated interpretation')).toBeTruthy();
    expect(screen.queryByText('Surviving evidence')).toBeNull();
    expect(screen.getByRole('complementary').textContent).toContain('No verified scale bar is supplied.');
    expect(screen.getByRole('img').getAttribute('alt')).toBe(media.alt);
    expect(container.querySelector('figure')?.classList.contains('evidence-module--stacked')).toBe(true);
  });

  it('preserves the existing evidence presentation when no layout or scale note is authored', () => {
    const { container } = render(<EvidenceModule module={module} media={{ ...media, depictionMode: 'evidence' }} />);
    expect(screen.getByText('Surviving evidence')).toBeTruthy();
    expect(screen.queryByRole('complementary')).toBeNull();
    expect(container.querySelector('figure')?.className).toBe('evidence-module');
  });
});
