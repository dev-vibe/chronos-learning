// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { chronosContent } from '../../content/chronos';
import { LocalJourneyStateGateway } from '../../src/infrastructure/journeys/gateway';
import { DEFAULT_JOURNEY_ID, openJourney } from '../../src/domains/journeys/state';
import type { Journey } from '../../src/domains/contracts';

const world = chronosContent.journeys.find((journey) => journey.id === DEFAULT_JOURNEY_ID)!;
const fixtureJourney: Journey = {
  ...world,
  id: 'journey.fixture.local',
  title: 'Local fixture',
  kind: 'story-arc',
  featured: false,
  entryLessonId: 'lesson.uruk.first-city',
  chapters: [{
    id: 'chapter.fixture.local',
    title: 'Local',
    position: 0,
    entries: [{
      id: 'entry.fixture.local.uruk',
      lessonId: 'lesson.uruk.first-city',
      position: 0,
      required: true,
      framing: 'Local adapter fixture.',
    }],
  }],
};
const boundary = { journeys: [...chronosContent.journeys, fixtureJourney], lessons: chronosContent.lessons };

beforeEach(() => {
  const storage = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: vi.fn((key: string) => storage.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => storage.set(key, value)),
    removeItem: vi.fn((key: string) => storage.delete(key)),
    clear: vi.fn(() => storage.clear()),
  });
});

describe('anonymous journey preview persistence', () => {
  it('uses an isolated versioned key and preserves reversible journey state', async () => {
    const gateway = new LocalJourneyStateGateway(boundary);
    const initial = await gateway.load();
    expect(initial.state.activeJourneyId).toBe(DEFAULT_JOURNEY_ID);
    const next = openJourney(initial.state, fixtureJourney, boundary.lessons, '2026-01-02T00:00:00.000Z');
    await gateway.save(next);
    const reloaded = await new LocalJourneyStateGateway(boundary).load();
    expect(reloaded.state.journeys[fixtureJourney.id].status).toBe('open');
    expect(localStorage.setItem).toHaveBeenCalledWith('chronos.discovery.preview.v1', expect.any(String));
  });

  it('recovers malformed and stale state without touching lesson completion keys', async () => {
    localStorage.setItem('chronos.discovery.preview.v1', '{broken');
    localStorage.setItem('chronos.learn.preview.v1:lesson.uruk.first-city', JSON.stringify({
      lessonId: 'lesson.uruk.first-city',
      status: 'completed',
      cardId: 'card.place.uruk',
      completedAt: '2026-01-03T00:00:00.000Z',
    }));
    const loaded = await new LocalJourneyStateGateway(boundary).load();
    expect(loaded.state.activeJourneyId).toBe(DEFAULT_JOURNEY_ID);
    expect(loaded.ownedCards).toEqual([{ cardId: 'card.place.uruk', acquiredAt: '2026-01-03T00:00:00.000Z' }]);
    expect(JSON.parse(localStorage.getItem('chronos.learn.preview.v1:lesson.uruk.first-city')!).status).toBe('completed');
  });
});
