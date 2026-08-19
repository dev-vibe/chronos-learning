// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { chronosContent } from '../../content/chronos';
import type { ChronosContentBundle } from '../../content/assemble';
import type { Journey, JourneyInvitation } from '../../src/domains/contracts';
import { DiscoveryApp } from '../../src/app/ChronosApp';
import { createDefaultJourneyState, openJourney } from '../../src/domains/journeys/state';
import type { JourneyStateGateway, JourneyStateLoad } from '../../src/infrastructure/journeys/gateway';
import type { LearnProgressGateway } from '../../src/learn/progress';
import type { SearchProvider, SearchResult } from '../../src/domains/search/search';

const world = chronosContent.journeys.find((journey) => journey.id === 'journey.world-history')!;
const fixtureJourney: Journey = {
  ...world,
  id: 'journey.fixture.rivers',
  title: 'Rivers and Cities',
  kind: 'story-arc',
  learnerPromise: 'Compare how rivers shaped published city stories.',
  openingQuestion: 'How did rivers create opportunities and constraints?',
  description: 'A non-production test fixture.',
  period: 'Early cities',
  region: 'Southwest Asia',
  approximateMinutes: 20,
  featured: true,
  prerequisiteJourneyIds: [],
  relatedJourneyIds: [],
  entryLessonId: 'lesson.uruk.first-city',
  chapters: [{
    id: 'chapter.fixture.rivers',
    title: 'River Worlds',
    position: 0,
    entries: [{
      id: 'entry.fixture.rivers.uruk',
      lessonId: 'lesson.uruk.first-city',
      position: 0,
      required: true,
      framing: 'Compare a city and its environment.',
    }],
  }],
};
const fixtureInvitation: JourneyInvitation = {
  id: 'invitation.fixture.rivers',
  sourceLessonId: 'lesson.humans.homo-sapiens-origins',
  destinationJourneyId: fixtureJourney.id,
  entryLessonId: 'lesson.uruk.first-city',
  placements: ['home'],
  reason: 'You saw how our species began across Africa. Compare a city and its river setting in another authored path.',
  optional: true,
  status: 'published',
  priority: 10,
};

const multiContent: ChronosContentBundle = {
  ...chronosContent,
  journeys: [...chronosContent.journeys, fixtureJourney], invitations: [fixtureInvitation],
};

function makeHarness(content: ChronosContentBundle = chronosContent, multiple = false) {
  const initial = createDefaultJourneyState(content.journeys, content.lessons, '2026-01-01T00:00:00.000Z');
  const state = multiple ? openJourney(initial, fixtureJourney, content.lessons, '2026-01-02T00:00:00.000Z') : initial;
  let snapshot: JourneyStateLoad = { state, staleJourneyIds: [], ownedCards: [] };
  const journeyGateway: JourneyStateGateway = {
    load: vi.fn(async () => snapshot),
    save: vi.fn(async (next) => {
      snapshot = { ...snapshot, state: next };
      return snapshot;
    }),
  };
  const progressGateway = {
    loadJourneySummaries: vi.fn(async () => ({})),
  } as unknown as LearnProgressGateway;
  return { journeyGateway, progressGateway, snapshot: () => snapshot };
}

beforeEach(() => {
  const storage = new Map<string, string>();
  const localStorageStub = {
    getItem: vi.fn((key: string) => storage.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => storage.set(key, value)),
    removeItem: vi.fn((key: string) => storage.delete(key)),
    clear: vi.fn(() => storage.clear()),
  };
  vi.stubGlobal('localStorage', localStorageStub);
  Object.defineProperty(window, 'localStorage', { configurable: true, value: localStorageStub });
  window.history.replaceState(null, '', '/');
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Home, Library, preview, and search composition', () => {
  it('renders one obvious Continue action and an honest single-journey state', async () => {
    const harness = makeHarness();
    const navigate = vi.fn();
    render(<DiscoveryApp
      route={{ name: 'home' }}
      journeyGatewayFactory={async () => harness.journeyGateway}
      progressGatewayFactory={async () => harness.progressGateway}
      navigate={navigate}
    />);
    const continueLink = await screen.findByRole('link', { name: /Continue lesson/i });
    expect(continueLink.getAttribute('href')).toBe('/learn/lesson.humans.homo-sapiens-origins');
    expect(screen.getByText(/only published journey right now/i)).toBeTruthy();
    expect(screen.queryByText(/recommended for you/i)).toBeNull();
    await userEvent.click(continueLink);
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/learn/lesson.humans.homo-sapiens-origins'));
    expect(harness.journeyGateway.save).toHaveBeenCalledTimes(1);
  });

  it('continues into draft lessons when VITE_UNLOCK_PREVIEW_LESSONS is enabled', async () => {
    const { setUnlockPreviewLessonsForTests } = await import('../../src/config/runtimeFlags');
    const { createDefaultJourneyState: unlockedDefault } = await import('../../src/domains/journeys/state');
    setUnlockPreviewLessonsForTests(true);
    const initial = unlockedDefault(chronosContent.journeys, chronosContent.lessons, '2026-01-01T00:00:00.000Z');
    let snapshot: JourneyStateLoad = { state: initial, staleJourneyIds: [], ownedCards: [] };
    const journeyGateway: JourneyStateGateway = {
      load: vi.fn(async () => snapshot),
      save: vi.fn(async (next) => {
        snapshot = { ...snapshot, state: next };
        return snapshot;
      }),
    };
    const progressGateway = { loadJourneySummaries: vi.fn(async () => ({})) } as unknown as LearnProgressGateway;
    render(<DiscoveryApp
      route={{ name: 'home' }}
      journeyGatewayFactory={async () => journeyGateway}
      progressGatewayFactory={async () => progressGateway}
    />);
    const continueLink = await screen.findByRole('link', { name: /Continue lesson/i });
    expect(continueLink.getAttribute('href')).toBe('/learn/lesson.humans.homo-sapiens-origins');
    expect(screen.getByRole('heading', { name: 'Our Species Begins in Africa' })).toBeTruthy();
    expect(screen.queryByText(/next required lesson is not available yet/i)).toBeNull();
  });

  it('derives Home and journey-detail Continue from completion and access state', async () => {
    const harness = makeHarness();
    vi.mocked(harness.progressGateway.loadJourneySummaries).mockResolvedValue({
      'lesson.humans.homo-sapiens-origins': { lessonId: 'lesson.humans.homo-sapiens-origins', status: 'completed' },
      'lesson.humans.migrations-and-interbreeding': { lessonId: 'lesson.humans.migrations-and-interbreeding', status: 'completed' },
      'lesson.farming.settlements': { lessonId: 'lesson.farming.settlements', status: 'completed' },
      'lesson.uruk.first-city': { lessonId: 'lesson.uruk.first-city', status: 'completed' },
    });
    render(<DiscoveryApp
      route={{ name: 'home' }}
      journeyGatewayFactory={async () => harness.journeyGateway}
      progressGatewayFactory={async () => harness.progressGateway}
    />);
    expect((await screen.findByRole('link', { name: /Continue lesson/i })).getAttribute('href')).toBe('/learn/lesson.farming.multiple-origins');

    cleanup();
    render(<DiscoveryApp
      route={{ name: 'journey', journeyId: 'journey.world-history' }}
      journeyGatewayFactory={async () => harness.journeyGateway}
      progressGatewayFactory={async () => harness.progressGateway}
    />);
    expect((await screen.findByRole('link', { name: /Continue journey/i })).getAttribute('href')).toBe('/learn/lesson.farming.multiple-origins');
  });

  it('renders an honest completed state when no published required lesson remains', async () => {
    const harness = makeHarness();
    vi.mocked(harness.progressGateway.loadJourneySummaries).mockResolvedValue({
      'lesson.humans.homo-sapiens-origins': { lessonId: 'lesson.humans.homo-sapiens-origins', status: 'completed' },
      'lesson.humans.migrations-and-interbreeding': { lessonId: 'lesson.humans.migrations-and-interbreeding', status: 'completed' },
      'lesson.farming.multiple-origins': { lessonId: 'lesson.farming.multiple-origins', status: 'completed' },
      'lesson.farming.settlements': { lessonId: 'lesson.farming.settlements', status: 'completed' },
      'lesson.uruk.first-city': { lessonId: 'lesson.uruk.first-city', status: 'completed' },
      'lesson.writing.early-systems': { lessonId: 'lesson.writing.early-systems', status: 'completed' },
      'lesson.egypt.nile-state': { lessonId: 'lesson.egypt.nile-state', status: 'completed' },
    });
    render(<DiscoveryApp
      route={{ name: 'home' }}
      journeyGatewayFactory={async () => harness.journeyGateway}
      progressGatewayFactory={async () => harness.progressGateway}
    />);
    expect(await screen.findByRole('heading', { name: 'You have explored every published lesson.' })).toBeTruthy();
    expect(screen.queryByRole('link', { name: /Continue lesson/i })).toBeNull();
    expect(screen.getByRole('link', { name: /View journey/i }).getAttribute('href')).toBe('/library/journey.world-history');
  });
  it('shows multiple open fixture journeys without publishing them in production', async () => {
    const harness = makeHarness(multiContent, true);
    render(<DiscoveryApp
      route={{ name: 'home' }}
      content={multiContent}
      journeyGatewayFactory={async () => harness.journeyGateway}
      progressGatewayFactory={async () => harness.progressGateway}
    />);
    expect((await screen.findAllByRole('heading', { name: 'Rivers and Cities' })).length).toBeGreaterThan(0);
    expect(screen.queryByText(/only published journey right now/i)).toBeNull();
    expect(document.querySelectorAll('.journey-card')).toHaveLength(2);
  });

  it('persists authored invitation save and open actions without changing lesson completion', async () => {
    const saveHarness = makeHarness(multiContent);
    render(<DiscoveryApp
      route={{ name: 'home' }}
      content={multiContent}
      journeyGatewayFactory={async () => saveHarness.journeyGateway}
      progressGatewayFactory={async () => saveHarness.progressGateway}
    />);
    expect(await screen.findByText(fixtureInvitation.reason)).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Save for later' }));
    await waitFor(() => expect(screen.queryByText(fixtureInvitation.reason)).toBeNull());
    expect(saveHarness.snapshot().state.journeys[fixtureJourney.id].status).toBe('saved');
    expect(saveHarness.snapshot().state.invitationStates[fixtureInvitation.id].action).toBe('saved');

    cleanup();
    const openHarness = makeHarness(multiContent);
    const navigate = vi.fn();
    render(<DiscoveryApp
      route={{ name: 'home' }}
      content={multiContent}
      journeyGatewayFactory={async () => openHarness.journeyGateway}
      progressGatewayFactory={async () => openHarness.progressGateway}
      navigate={navigate}
    />);
    await screen.findByText(fixtureInvitation.reason);
    await userEvent.click(screen.getByRole('link', { name: /Open journey/i }));
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/learn/lesson.uruk.first-city'));
    expect(openHarness.snapshot().state.activeJourneyId).toBe(fixtureJourney.id);
    expect(openHarness.snapshot().state.invitationStates[fixtureInvitation.id].action).toBe('opened');
  });

  it('keeps empty Library categories intentional and excludes draft lessons', async () => {
    const harness = makeHarness();
    render(<DiscoveryApp
      route={{ name: 'library' }}
      journeyGatewayFactory={async () => harness.journeyGateway}
      progressGatewayFactory={async () => harness.progressGateway}
    />);
    expect(await screen.findByRole('heading', { name: 'Explore history.' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Civilizations and Regions' })).toBeTruthy();
    expect(screen.getByText(/More authored journeys are being prepared/i)).toBeTruthy();
    expect(within(document.querySelector('.library-page')!).queryByText('Farming and Settlements')).toBeNull();
    const open = screen.getByRole('button', { name: 'Open World History' });
    await userEvent.click(open);
    const drawer = screen.getByRole('dialog', { name: 'World History' });
    expect(within(drawer).getByRole('heading', { name: 'World History' })).toBeTruthy();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(open).toBe(document.activeElement);
  });

  it('fails closed for invalid and unpublished journey destinations', async () => {
    const harness = makeHarness();
    render(<DiscoveryApp
      route={{ name: 'journey', journeyId: 'journey.unpublished' }}
      journeyGatewayFactory={async () => harness.journeyGateway}
      progressGatewayFactory={async () => harness.progressGateway}
    />);
    expect(await screen.findByRole('heading', { name: /journey.*available/i })).toBeTruthy();
    expect(screen.getByText(/Only reviewed journeys can be opened here/i)).toBeTruthy();
  });

  it('shows state-dependent preview actions without allowing World History to close', async () => {
    const harness = makeHarness();
    render(<DiscoveryApp
      route={{ name: 'journey', journeyId: 'journey.world-history' }}
      journeyGatewayFactory={async () => harness.journeyGateway}
      progressGatewayFactory={async () => harness.progressGateway}
    />);
    expect(await screen.findByRole('heading', { name: 'World History' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Continue journey/i })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
    expect(within(document.querySelector('.world-spine-chapters')!).getByText('Farming and Settlements')).toBeTruthy(); expect(document.querySelectorAll('.world-spine-chapters .preparing')).not.toHaveLength(0);
  });

  it('uses a stable query URL, typed results, announcements, and keyboard selection', async () => {
    const harness = makeHarness();
    const provider: SearchProvider = {
      search: vi.fn(async (): Promise<SearchResult[]> => [
        { id: 'lesson.uruk.first-city', kind: 'lesson', title: 'Uruk: Life in an Early City', context: 'Lesson · Uruk period', destination: '/learn/lesson.uruk.first-city', score: 800 },
        { id: 'card.place.uruk', kind: 'knowledge-card', title: 'Uruk', context: 'Knowledge Card · Place', destination: '/learn/lesson.uruk.first-city', score: 700 },
      ]),
    };
    render(<DiscoveryApp
      route={{ name: 'search', query: '' }}
      journeyGatewayFactory={async () => harness.journeyGateway}
      progressGatewayFactory={async () => harness.progressGateway}
      searchProvider={provider}
    />);
    const input = await screen.findByRole('searchbox');
    expect(screen.getByRole('search')).toBeTruthy();
    expect(document.activeElement).toBe(input);
    expect(input.getAttribute('role')).toBeNull();
    expect(input.hasAttribute('aria-activedescendant')).toBe(false);
    await userEvent.type(input, 'uruk');
    await screen.findByText('2 published results');
    expect(window.location.search).toBe('?q=uruk');
    expect(screen.getByRole('heading', { name: 'Lessons' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Knowledge Cards' })).toBeTruthy();
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(screen.queryByRole('option')).toBeNull();
    const firstResult = screen.getByRole('link', { name: /Uruk: Life in an Early City/ });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(firstResult);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole('link', { name: /knowledge card.*Uruk/i }));
  });

  it('persists an intentional dark theme and exposes compact primary navigation', async () => {
    const harness = makeHarness();
    render(<DiscoveryApp
      route={{ name: 'home' }}
      journeyGatewayFactory={async () => harness.journeyGateway}
      progressGatewayFactory={async () => harness.progressGateway}
    />);
    await screen.findByRole('heading', { name: 'Welcome back.' });
    await userEvent.click(screen.getByRole('button', { name: 'Use dark theme' }));
    expect(document.querySelector('.discovery-app')?.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('chronos.theme.v1')).toBe('dark');
    expect(screen.getAllByLabelText('Chronos navigation')).toHaveLength(2);
    expect(document.querySelector('.mobile-nav')).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'Learn' })).toBeNull(); expect(document.querySelectorAll('.global-rail nav a')).toHaveLength(3); expect(document.querySelectorAll('.mobile-nav a')).toHaveLength(3);
    expect(within(screen.getByRole('complementary', { name: 'Chronos navigation' })).getByRole('button', { name: 'World History' })).toBeTruthy();
    expect(within(document.querySelector('.mobile-nav')!).getByRole('button', { name: 'World History' })).toBeTruthy();
  });

  it('offers retry after a transient navigation-state load failure', async () => {
    const harness = makeHarness();
    vi.mocked(harness.journeyGateway.load).mockRejectedValueOnce(new Error('offline'));
    render(<DiscoveryApp
      route={{ name: 'home' }}
      journeyGatewayFactory={async () => harness.journeyGateway}
      progressGatewayFactory={async () => harness.progressGateway}
    />);
    expect(await screen.findByRole('heading', { name: /couldn.*open your journeys/i })).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(await screen.findByRole('heading', { name: 'Welcome back.' })).toBeTruthy();
    expect(harness.journeyGateway.load).toHaveBeenCalledTimes(2);
  });

  it('reports failed discovery actions without losing lesson completion', async () => {
    const harness = makeHarness();
    const summaries = {
      'lesson.humans.homo-sapiens-origins': { lessonId: 'lesson.humans.homo-sapiens-origins', status: 'completed' as const },
      'lesson.humans.migrations-and-interbreeding': { lessonId: 'lesson.humans.migrations-and-interbreeding', status: 'completed' as const },
      'lesson.farming.settlements': { lessonId: 'lesson.farming.settlements', status: 'completed' as const },
      'lesson.uruk.first-city': { lessonId: 'lesson.uruk.first-city', status: 'completed' as const },
    };
    vi.mocked(harness.progressGateway.loadJourneySummaries).mockResolvedValue(summaries);
    vi.mocked(harness.journeyGateway.save).mockRejectedValueOnce(new Error('offline'));
    const navigate = vi.fn();
    render(<DiscoveryApp
      route={{ name: 'home' }}
      journeyGatewayFactory={async () => harness.journeyGateway}
      progressGatewayFactory={async () => harness.progressGateway}
      navigate={navigate}
    />);
    const continueLink = await screen.findByRole('link', { name: /Continue lesson/i });
    expect(continueLink.getAttribute('href')).toBe('/learn/lesson.farming.multiple-origins');
    await userEvent.click(continueLink);
    expect((await screen.findByRole('alert')).textContent).toMatch(/lesson completion is safe/i);
    expect(navigate).not.toHaveBeenCalled();
    expect(summaries['lesson.uruk.first-city'].status).toBe('completed');
  });
});
