import { describe, expect, it } from 'vitest';
import { chronosContent } from '../../content/chronos';
import { searchAliases } from '../../content/search/aliases';
import type { ChronosContentBundle } from '../../content/assemble';
import type { Journey, JourneyInvitation } from '../../src/domains/contracts';
import { createPublishedJourneyCatalog } from '../../src/domains/journeys/catalog';
import { resolveJourneyInvitation } from '../../src/domains/journeys/invitations';
import {
  DEFAULT_JOURNEY_ID,
  closeJourney,
  continueJourney,
  createDefaultJourneyState,
  deriveJourneyProgress,
  normalizeJourneyState,
  openJourney,
  saveJourney,
  selectJourneyNextAction,
  setActiveLesson,
  setInvitationState,
} from '../../src/domains/journeys/state';
import { createLocalSearchProvider, normalizeSearchText } from '../../src/domains/search/search';
import { parseChronosRoute } from '../../src/app/routes';

const world = chronosContent.journeys.find((journey) => journey.id === DEFAULT_JOURNEY_ID)!;
const optionalJourney: Journey = {
  ...world,
  id: 'journey.fixture.rivers',
  title: 'Rivers and Cities',
  kind: 'story-arc',
  learnerPromise: 'Compare how rivers shaped published city stories.',
  openingQuestion: 'How did rivers create opportunities and constraints?',
  description: 'A non-production fixture used to prove multi-journey behavior.',
  period: 'Early cities',
  region: 'Southwest Asia',
  featured: false,
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
const optionalIdea: Journey = {
  ...optionalJourney,
  id: 'journey.fixture.records',
  title: 'Records Across Time',
  kind: 'idea-trail',
  learnerPromise: 'Trace durable records.',
  entryLessonId: 'lesson.writing.early-systems',
  chapters: [{
    id: 'chapter.fixture.records',
    title: 'Durable Information',
    position: 0,
    entries: [{
      id: 'entry.fixture.records.writing',
      lessonId: 'lesson.writing.early-systems',
      position: 0,
      required: true,
      framing: 'Follow a reviewed writing lesson.',
    }],
  }],
};
const mixedScopeJourney: Journey = {
  ...optionalJourney,
  id: 'journey.fixture.mixed-scope',
  chapters: [{
    ...optionalJourney.chapters[0],
    id: 'chapter.fixture.mixed-scope',
    entries: [
      optionalJourney.chapters[0].entries[0],
      {
        id: 'entry.fixture.mixed-scope.writing',
        lessonId: 'lesson.writing.early-systems',
        position: 1,
        required: false,
        framing: 'Explore an optional published connection.',
      },
    ],
  }],
};

const fixtureContent: ChronosContentBundle = {
  ...chronosContent,
  journeys: [...chronosContent.journeys, optionalJourney, optionalIdea],
};

describe('learner journey state', () => {
  it('creates World History as the non-removable default without using array position', () => {
    const shuffled = [optionalJourney, ...chronosContent.journeys];
    const state = createDefaultJourneyState(shuffled, chronosContent.lessons, '2026-01-01T00:00:00.000Z');
    expect(state.activeJourneyId).toBe(DEFAULT_JOURNEY_ID);
    expect(state.journeys[DEFAULT_JOURNEY_ID].status).toBe('open');
    expect(closeJourney(state, DEFAULT_JOURNEY_ID)).toBe(state);
  });

  it('supports reversible save, open, continue, close, and per-journey lesson selection', () => {
    const base = createDefaultJourneyState(fixtureContent.journeys, fixtureContent.lessons, '2026-01-01T00:00:00.000Z');
    const saved = saveJourney(base, optionalJourney, fixtureContent.lessons, '2026-01-02T00:00:00.000Z');
    expect(saved.journeys[optionalJourney.id].status).toBe('saved');
    const opened = openJourney(saved, optionalJourney, fixtureContent.lessons, '2026-01-03T00:00:00.000Z');
    expect(opened.journeys[optionalJourney.id].status).toBe('open');
    const selected = setActiveLesson(opened, optionalJourney.id, 'lesson.uruk.first-city', '2026-01-04T00:00:00.000Z');
    expect(selected.activeJourneyId).toBe(optionalJourney.id);
    const continued = continueJourney(selected, world, fixtureContent.lessons, {}, '2026-01-05T00:00:00.000Z');
    expect(continued.activeJourneyId).toBe(DEFAULT_JOURNEY_ID);
    expect(continued.journeys[optionalJourney.id].activeLessonId).toBe('lesson.uruk.first-city');
    const closed = closeJourney(continued, optionalJourney.id, '2026-01-06T00:00:00.000Z');
    expect(closed.journeys[optionalJourney.id].status).toBe('closed');
    expect(closed.journeys[optionalJourney.id].activeLessonId).toBe('lesson.uruk.first-city');
  });

  it('derives progress only from required published entries and never mutates lesson completion', () => {
    const summaries = {
      'lesson.uruk.first-city': { lessonId: 'lesson.uruk.first-city', status: 'completed' as const },
      'lesson.farming.settlements': { lessonId: 'lesson.farming.settlements', status: 'completed' as const },
    };
    expect(deriveJourneyProgress(world, chronosContent.lessons, summaries)).toEqual({
      completed: 2,
      total: 7,
      percent: 29,
      isCompleted: false,
    });
    const state = createDefaultJourneyState(fixtureContent.journeys, fixtureContent.lessons);
    closeJourney(openJourney(state, optionalJourney, fixtureContent.lessons), optionalJourney.id);
    expect(summaries['lesson.uruk.first-city'].status).toBe('completed');
  });

  it('selects one valid next action for active, completed, locked, backfilled, and finished states', () => {
    expect(selectJourneyNextAction(world, chronosContent.lessons, {}, 'lesson.uruk.first-city')).toEqual({
      kind: 'lesson', lessonId: 'lesson.uruk.first-city', source: 'active',
    });
    const urukCompleted = {
      'lesson.uruk.first-city': { lessonId: 'lesson.uruk.first-city', status: 'completed' as const },
    };
    expect(selectJourneyNextAction(world, chronosContent.lessons, urukCompleted, 'lesson.uruk.first-city')).toEqual({
      kind: 'lesson', lessonId: 'lesson.writing.early-systems', source: 'next',
    });
    const writingCompleted = {
      ...urukCompleted,
      'lesson.writing.early-systems': { lessonId: 'lesson.writing.early-systems', status: 'completed' as const },
    };
    expect(selectJourneyNextAction(world, chronosContent.lessons, writingCompleted, 'lesson.writing.early-systems')).toEqual({
      kind: 'lesson', lessonId: 'lesson.egypt.nile-state', source: 'next',
    });
    expect(selectJourneyNextAction(world, chronosContent.lessons, {}, 'lesson.writing.early-systems')).toEqual({
      kind: 'lesson', lessonId: 'lesson.humans.homo-sapiens-origins', source: 'backfill',
    });
    expect(selectJourneyNextAction(world, chronosContent.lessons, {
      'lesson.humans.homo-sapiens-origins': { lessonId: 'lesson.humans.homo-sapiens-origins', status: 'completed' as const },
      'lesson.humans.migrations-and-interbreeding': { lessonId: 'lesson.humans.migrations-and-interbreeding', status: 'completed' as const },
      'lesson.farming.multiple-origins': { lessonId: 'lesson.farming.multiple-origins', status: 'completed' as const },
      'lesson.farming.settlements': { lessonId: 'lesson.farming.settlements', status: 'completed' as const },
      ...writingCompleted,
      'lesson.egypt.nile-state': { lessonId: 'lesson.egypt.nile-state', status: 'completed' as const },
    }, 'lesson.egypt.nile-state')).toEqual({ kind: 'complete' });
  });

  it('preserves an accessible incomplete optional active lesson without counting it as required progress', () => {
    expect(selectJourneyNextAction(mixedScopeJourney, chronosContent.lessons, {}, 'lesson.writing.early-systems')).toEqual({
      kind: 'lesson', lessonId: 'lesson.writing.early-systems', source: 'active',
    });
    expect(deriveJourneyProgress(mixedScopeJourney, chronosContent.lessons, {
      'lesson.writing.early-systems': { lessonId: 'lesson.writing.early-systems', status: 'completed' as const },
    })).toEqual({ completed: 0, total: 1, percent: 0, isCompleted: false });
  });

  it('repairs stale local state and removes journeys that are no longer published', () => {
    const state = createDefaultJourneyState(fixtureContent.journeys, fixtureContent.lessons);
    const withOptional = openJourney(state, optionalJourney, fixtureContent.lessons);
    const normalized = normalizeJourneyState(withOptional, chronosContent.journeys, chronosContent.lessons);
    expect(normalized.staleJourneyIds).toEqual([optionalJourney.id]);
    expect(normalized.state.journeys[optionalJourney.id]).toBeUndefined();
    expect(normalized.state.activeJourneyId).toBe(DEFAULT_JOURNEY_ID);
  });
});

describe('published catalog and authored invitations', () => {
  it('filters unpublished content and groups published fixture journeys deterministically', () => {
    const catalog = createPublishedJourneyCatalog([...fixtureContent.journeys].reverse(), fixtureContent.lessons);
    expect(catalog.worldHistory?.id).toBe(DEFAULT_JOURNEY_ID);
    expect(catalog.groups['civilizations-regions'].map((item) => item.id)).toEqual([optionalJourney.id]);
    expect(catalog.groups['ideas-across-time'].map((item) => item.id)).toEqual([optionalIdea.id]);
    expect(catalog.groups.investigations).toEqual([]);
    expect(catalog.worldHistory?.lessonCount).toBe(7);
    expect(catalog.worldHistory?.requiredLessonCount).toBe(7);
  });

  it('selects at most one eligible invitation by priority and stable ID', () => {
    const state = createDefaultJourneyState(fixtureContent.journeys, fixtureContent.lessons);
    const invitations: JourneyInvitation[] = [
      {
        id: 'invitation.fixture.lower',
        sourceLessonId: 'lesson.uruk.first-city',
        destinationJourneyId: optionalJourney.id,
        entryLessonId: 'lesson.uruk.first-city',
        placements: ['home', 'completion'],
        reason: 'Compare the river setting.',
        optional: true,
        status: 'published',
        priority: 5,
      },
      {
        id: 'invitation.fixture.higher',
        sourceLessonId: 'lesson.uruk.first-city',
        destinationJourneyId: optionalIdea.id,
        entryLessonId: 'lesson.writing.early-systems',
        placements: ['home'],
        reason: 'Trace the record-making idea.',
        optional: true,
        status: 'published',
        priority: 10,
      },
    ];
    const result = resolveJourneyInvitation(invitations, fixtureContent.journeys, fixtureContent.lessons, state, {
      placement: 'home',
      sourceLessonId: 'lesson.uruk.first-city',
    });
    expect(result?.id).toBe('invitation.fixture.higher');
    const dismissed = setInvitationState(state, 'invitation.fixture.higher', 'dismissed');
    expect(resolveJourneyInvitation(invitations, fixtureContent.journeys, fixtureContent.lessons, dismissed, {
      placement: 'home',
      sourceLessonId: 'lesson.uruk.first-city',
    })?.id).toBe('invitation.fixture.lower');
  });

  it('never renders draft or ineligible destinations and does not alter journey progress', () => {
    const state = createDefaultJourneyState(fixtureContent.journeys, fixtureContent.lessons);
    const before = structuredClone(state.journeys);
    const draftInvitation: JourneyInvitation = {
      id: 'invitation.fixture.draft',
      destinationJourneyId: optionalJourney.id,
      entryLessonId: 'lesson.uruk.first-city',
      placements: ['home'],
      reason: 'Hidden draft.',
      optional: true,
      status: 'draft',
      priority: 100,
    };
    expect(resolveJourneyInvitation([draftInvitation], fixtureContent.journeys, fixtureContent.lessons, state, { placement: 'home' })).toBeUndefined();
    expect(state.journeys).toEqual(before);
  });
});

describe('bounded published search', () => {
  it('normalizes case, punctuation, accents, and reviewed spelling variants', async () => {
    expect(normalizeSearchText('Proto—Cunéiform!')).toBe('proto cuneiform');
    const provider = createLocalSearchProvider(chronosContent, searchAliases);
    const result = await provider.search('cuneform');
    expect(result[0].title).toMatch(/Proto-Cuneiform|Tablet/);
    expect(result.every((item) => item.destination.startsWith('/learn/') || item.destination.startsWith('/library/'))).toBe(true);
  });

  it('ranks exact and prefix matches deterministically and excludes drafts and roster-only nodes', async () => {
    const provider = createLocalSearchProvider(chronosContent, searchAliases);
    const exact = await provider.search('Uruk');
    expect(exact[0].title).toBe('Uruk');
    expect(exact.some((item) => item.title === 'Uruk: Life in an Early City')).toBe(true);
    expect(exact[0].score).toBeGreaterThanOrEqual(exact.at(-1)!.score);
    expect((await provider.search('farm')).some((item) => item.title.toLowerCase().includes('farming'))).toBe(true);
    expect((await provider.search('farm')).some((item) => item.title === 'Farming and Settlements')).toBe(true);
    expect(await provider.search('industrial revolution')).toEqual([]);
  });
});

describe('stable routes', () => {
  it('renders both root addresses as Home and parses stable ID/query destinations', () => {
    expect(parseChronosRoute('/')).toEqual({ name: 'home' });
    expect(parseChronosRoute('/home/')).toEqual({ name: 'home' });
    expect(parseChronosRoute('/learn/lesson.uruk.first-city')).toEqual({ name: 'learn', lessonId: 'lesson.uruk.first-city' });
    expect(parseChronosRoute('/library/journey.world-history')).toEqual({ name: 'journey', journeyId: 'journey.world-history' });
    expect(parseChronosRoute('/search', '?q=proto%20cuneiform')).toEqual({ name: 'search', query: 'proto cuneiform' });
    expect(parseChronosRoute('/library/unknown/extra')).toEqual({ name: 'not-found' });
    expect(parseChronosRoute('/learn/%E0%A4%A')).toEqual({ name: 'not-found' });
    expect(parseChronosRoute('/library/%E0%A4%A')).toEqual({ name: 'not-found' });
  });
});
