// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LearnApp } from '../../src/learn/LearnApp';
import { lessonIdFromPath } from '../../src/learn/route';
import type { JourneyProgressSummary, LearnProgressGateway, LearnState } from '../../src/learn/progress';

const initial = (): LearnState => ({ learnerId: 'test', lessonId: 'lesson.uruk.first-city', status: 'in-progress', attemptedPromptIds: [], exploredSectionIds: [], responses: {}, version: 1 });
class TestGateway implements LearnProgressGateway {
  state = initial(); load = vi.fn(async () => this.state);
  loadJourneySummaries = vi.fn(async (lessonIds: readonly string[]) => Object.fromEntries(lessonIds.map((lessonId) => [lessonId, { lessonId, status: lessonId === this.state.lessonId ? this.state.status : 'in-progress' }])) as Record<string, JourneyProgressSummary>);
  markSection = vi.fn(async () => this.state);
  saveAttempt = vi.fn(async (_lesson: string, prompt: string, response: string) => { this.state = { ...this.state, attemptedPromptIds: [...new Set([...this.state.attemptedPromptIds, prompt])], responses: { ...this.state.responses, [prompt]: response } }; return this.state; });
  complete = vi.fn(async () => { this.state = { ...this.state, status: 'completed', completedAt: new Date().toISOString(), cardId: 'card.place.uruk' }; return { completion: 'newly-completed', cardOwnership: 'newly-acquired', cardId: 'card.place.uruk' } as const; });
}

beforeEach(() => {
  const storage = new Map<string, string>();
  const localStorageStub = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => { storage.set(key, value); },
    removeItem: (key: string) => { storage.delete(key); },
    clear: () => { storage.clear(); },
  };
  vi.stubEnv('VITE_MEDIA_PROVIDER', 'repository');
  vi.stubGlobal('localStorage', localStorageStub);
  Object.defineProperty(window, 'localStorage', { configurable: true, value: localStorageStub });
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} });
  Element.prototype.scrollIntoView = vi.fn();
  vi.stubGlobal('scrollTo', vi.fn());
});
afterEach(() => { cleanup(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe('Learn route and interactions', () => {
  it('parses the stable route and rejects unrelated paths', () => { expect(lessonIdFromPath('/learn/lesson.uruk.first-city')).toBe('lesson.uruk.first-city'); expect(lessonIdFromPath('/legacy')).toBeNull(); expect(lessonIdFromPath('/learn/%E0%A4%A')).toBeNull(); });
  it('renders an invalid lesson state', () => { render(<LearnApp lessonId="lesson.unknown" />); expect(screen.getByRole('heading', { name: /archive entry.*available/i })).toBeTruthy(); });
  it('renders the decoded-asset contract and typed editorial modules', async () => { const gateway = new TestGateway(); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); expect(await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' })).toBeTruthy(); const hero = document.querySelector('.hero-media') as HTMLImageElement; expect(hero).toBeTruthy(); expect(hero.getAttribute('src')).toBe('/images/optimized/uruk/reconstruction.optimized.webp'); expect(hero.getAttribute('width')).toBe('1600'); expect(hero.getAttribute('height')).toBe('800'); expect(hero.classList.contains('responsive-media')).toBe(true); expect(hero.hasAttribute('data-loaded')).toBe(false); fireEvent.load(hero); expect(hero.getAttribute('data-loaded')).toBe('true'); expect(document.querySelector('.hero-image')?.hasAttribute('style')).toBe(false); expect(document.querySelector('.hero-probe')).toBeNull(); expect(screen.getByText('City at a glance')).toBeTruthy(); expect(screen.getAllByText('From the evidence room')).toHaveLength(2); expect(screen.getByText(/records and ideas could travel beyond one person/i)).toBeTruthy(); expect(screen.queryByRole('heading', { name: 'Connections' })).toBeNull(); expect(screen.getByRole('heading', { name: 'World Check' })).toBeTruthy(); });
  it('uses one visible responsive hero in object-storage mode without a separate largest-derivative request surface', async () => { vi.stubEnv('VITE_MEDIA_PROVIDER', 'object-storage'); vi.stubEnv('VITE_MEDIA_BASE_URL', 'https://media.example.test/public'); const gateway = new TestGateway(); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' }); const hero = document.querySelector('.hero-media') as HTMLImageElement; expect(hero).toBeTruthy(); expect(hero.getAttribute('srcset')).toContain(' 480w'); expect(hero.getAttribute('srcset')).toContain(' 960w'); expect(hero.getAttribute('srcset')).toContain(' 1600w'); expect(hero.getAttribute('sizes')).toBe('(max-width: 800px) 100vw, 60vw'); expect(document.querySelectorAll('.hero-image img')).toHaveLength(1); expect(document.querySelector('.hero-image')?.hasAttribute('style')).toBe(false); expect(document.querySelector('.hero-probe')).toBeNull(); });
  it('renders responsive historical map media and opens its canonical context disclosure', async () => { const gateway = new TestGateway(); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' }); const image=screen.getByAltText(/Illustrated map of the southern Mesopotamian plain/i);expect(image.getAttribute('src')).toBe('/images/optimized/uruk/southern-mesopotamia-map.optimized.webp');expect(image.getAttribute('width')).toBe('1732');expect(image.getAttribute('height')).toBe('908');expect(image.closest('[data-section-id]')?.getAttribute('data-section-id')).toBe('section.uruk.masthead');expect(screen.getByText(/Illustrative map.*ancient waterways approximate/i)).toBeTruthy();expect(image.closest('figure')?.getAttribute('aria-describedby')).toBe('module.uruk.southern-mesopotamia-map-summary');const trigger=screen.getByRole('button',{name:/About this map/i});await userEvent.click(trigger);const dialog=screen.getByRole('dialog');expect(dialog.hasAttribute('open')).toBe(true);expect(screen.getByText(/official UNESCO World Heritage coordinates/i)).toBeTruthy();expect(screen.getByText(/Near modern Warka, Iraq/i)).toBeTruthy();expect(screen.getAllByRole('link').some((link)=>link.getAttribute('href')==='https://whc.unesco.org/en/list/1481/maps/')).toBe(true);fireEvent.keyDown(dialog,{key:'Escape'});expect(dialog.hasAttribute('open')).toBe(false);expect(document.activeElement).toBe(trigger); });
  it('falls back locally when object storage delivery fails', async () => { vi.stubEnv('VITE_MEDIA_PROVIDER', 'object-storage'); vi.stubEnv('VITE_MEDIA_BASE_URL', 'https://media.example.test/public'); const gateway = new TestGateway(); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' }); const image=screen.getByAltText(/Illustrated map of the southern Mesopotamian plain/i);expect(image.getAttribute('src')).toMatch(/^https:\/\/media\.example\.test\/public\/media-public\//);fireEvent.error(image);await waitFor(()=>expect(image.getAttribute('src')).toBe('/images/optimized/uruk/southern-mesopotamia-map.optimized.webp')); });
  it('opens the native Explore the Scene field guide', async () => { const gateway = new TestGateway(); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' }); const title = screen.getByText('Explore the scene'); const details = title.closest('details'); expect(details?.hasAttribute('open')).toBe(false); await userEvent.click(title); expect(details?.hasAttribute('open')).toBe(true); expect(screen.getByText('Monumental precinct')).toBeTruthy(); });
  it('offers retry after progress load failure', async () => { const gateway = new TestGateway(); gateway.load.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(gateway.state); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('button', { name: 'Retry loading progress' }); await userEvent.click(screen.getByRole('button', { name: 'Retry loading progress' })); expect(await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' })).toBeTruthy(); expect(gateway.load).toHaveBeenCalledTimes(2); expect(gateway.loadJourneySummaries).toHaveBeenCalledTimes(2); });
  it('keeps the journey outline in a drawer and returns focus after Escape', async () => { const gateway = new TestGateway(); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' }); const rail = screen.getByLabelText('World History'); expect(rail.getAttribute('aria-hidden')).toBe('true'); const open = within(screen.getByRole('complementary', { name: 'Chronos navigation' })).getByRole('button', { name: 'World History' }); await userEvent.click(open); expect(screen.getByRole('dialog', { name: 'World History' })).toBeTruthy(); expect(rail.getAttribute('aria-hidden')).toBe('false'); fireEvent.keyDown(document, { key: 'Escape' }); expect(rail.getAttribute('aria-hidden')).toBe('true'); expect(open).toBe(document.activeElement); });
  it('navigates to a semantic section and moves focus with the journey control', async () => { const gateway = new TestGateway(); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' }); await userEvent.click(within(screen.getByRole('complementary', { name: 'Chronos navigation' })).getByRole('button', { name: 'World History' })); await userEvent.click(screen.getByRole('button', { name: 'The built city' })); const section = document.getElementById('section.uruk.the-built-city'); expect(section?.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' }); expect(section).toBe(document.activeElement); });
  it('does not interrupt the lesson with a resume banner', async () => { const gateway = new TestGateway(); gateway.state = { ...gateway.state, resumeSectionId: 'section.uruk.the-built-city', exploredSectionIds: ['section.uruk.the-built-city'] }; render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' }); expect(screen.queryByText('Welcome back')).toBeNull(); expect(screen.queryByRole('button', { name: 'Resume' })).toBeNull(); expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' }); });
  it('fails closed for a missing lesson without leaking a spine title', () => {
    render(<LearnApp lessonId="lesson.farming.multiple-origins" />);
    expect(screen.getByRole('heading', { name: /This archive entry isn.t available\./i })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Many Beginnings of Farming' })).toBeNull();
    expect(document.querySelectorAll('.global-rail nav a')).toHaveLength(3);
  });
  it('keeps the Chronos shell and prerequisite visible for a locked lesson', async () => {
    const gateway = new TestGateway();
    gateway.state = { ...gateway.state, lessonId: 'lesson.writing.early-systems' };
    render(<LearnApp lessonId="lesson.writing.early-systems" gatewayFactory={async () => gateway} />);
    expect(await screen.findByRole('heading', { name: 'This lesson is still locked.' })).toBeTruthy();
    expect(screen.getByText(/Complete Uruk: Life in an Early City before continuing/i)).toBeTruthy();
    expect(document.querySelectorAll('.global-rail nav a')).toHaveLength(3);
    const rail = screen.getByLabelText('World History');
    expect(rail.getAttribute('aria-hidden')).toBe('true');
    expect(screen.queryByRole('navigation', { name: 'Lesson sections' })).toBeNull();
    expect(screen.getByRole('link', { name: /Continue Uruk: Life in an Early City/i }).getAttribute('href')).toBe('/learn/lesson.uruk.first-city');
  });
  it('opens the published Farming and Settlements lesson', async () => {
    const gateway = new TestGateway();
    gateway.state = { ...gateway.state, lessonId: 'lesson.farming.settlements' };
    gateway.loadJourneySummaries = vi.fn(async (lessonIds: readonly string[]) => Object.fromEntries(lessonIds.map((lessonId) => [lessonId, { lessonId, status: 'in-progress' as const }])));
    render(<LearnApp lessonId="lesson.farming.settlements" gatewayFactory={async () => gateway} />);
    expect(await screen.findByRole('heading', { name: 'Farming and Settlements' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Enter from the roof' })).toBeTruthy();
    expect(screen.getByRole('img', { name: /reconstruction looking across adjoining mudbrick rooftops/i })).toBeTruthy();
    expect(screen.getByText('Follow the evidence from roof to pantry')).toBeTruthy();
    expect(screen.queryByText('This archive entry is not available.')).toBeNull();
  });
  it('opens draft lessons when VITE_UNLOCK_PREVIEW_LESSONS is enabled', async () => {
    const { setUnlockPreviewLessonsForTests } = await import('../../src/config/runtimeFlags');
    setUnlockPreviewLessonsForTests(true);
    const gateway = new TestGateway();
    gateway.state = { ...gateway.state, lessonId: 'lesson.farming.settlements' };
    gateway.loadJourneySummaries = vi.fn(async (lessonIds: readonly string[]) => Object.fromEntries(lessonIds.map((lessonId) => [lessonId, { lessonId, status: 'in-progress' as const }])));
    render(<LearnApp lessonId="lesson.farming.settlements" gatewayFactory={async () => gateway} />);
    expect(await screen.findByRole('heading', { name: 'Farming and Settlements' })).toBeTruthy();
    expect(screen.queryByText('This archive entry is not available.')).toBeNull();
  });
  it('hides Rights metadata until media review is approved', async () => {
    const gateway = new TestGateway();
    render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />);
    await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' });
    expect(screen.queryByText('Rights and redistribution review required')).toBeNull();
    expect(screen.queryAllByText('Rights')).toHaveLength(0);
  });
  it('shows Rights metadata for approved media', async () => {
    const gateway = new TestGateway();
    gateway.state = { learnerId: 'test', lessonId: 'lesson.writing.early-systems', status: 'in-progress', attemptedPromptIds: [], exploredSectionIds: [], responses: {}, version: 1 };
    gateway.loadJourneySummaries = vi.fn(async (lessonIds: readonly string[]) => Object.fromEntries(lessonIds.map((lessonId) => [lessonId, {
      lessonId,
      status: lessonId === 'lesson.uruk.first-city' ? 'completed' as const : 'in-progress' as const,
    }])));
    render(<LearnApp lessonId="lesson.writing.early-systems" gatewayFactory={async () => gateway} />);
    await screen.findByRole('heading', { name: 'From Marks to Proto-Cuneiform' });
    expect(screen.getByText('Rights')).toBeTruthy();
    expect(screen.getByText('Public Domain · The Met Open Access')).toBeTruthy();
  });
  it('applies the selected theme through a working labeled control', async () => {
    const gateway = new TestGateway();
    render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />);
    await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' });
    expect(document.querySelector('.learn-app')?.getAttribute('data-theme')).toBe('light');
    await userEvent.click(screen.getAllByRole('button', { name: 'Use dark theme' })[0]);
    expect(document.querySelector('.learn-app')?.getAttribute('data-theme')).toBe('dark');
    expect(window.localStorage.getItem('chronos.theme.v1')).toBe('dark');
    expect(screen.getAllByRole('button', { name: 'Use light theme' }).length).toBeGreaterThan(0);
  });
  it('restores the shared theme preference when a lesson remounts', async () => {
    window.localStorage.setItem('chronos.theme.v1', 'dark');
    const gateway = new TestGateway();
    const { unmount } = render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />);
    await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' });
    expect(document.querySelector('.learn-app')?.getAttribute('data-theme')).toBe('dark');
    unmount();
    render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />);
    await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' });
    expect(document.querySelector('.learn-app')?.getAttribute('data-theme')).toBe('dark');
  });
  it('persists prompt feedback, completes, centers one card reveal, and gives a truthful next action', async () => { const gateway = new TestGateway(); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' }); await userEvent.click(screen.getByLabelText('Administrative tablets and cylinder seals')); expect(await screen.findByText(/Compare the evidence/)).toBeTruthy(); const text = screen.getByRole('textbox'); await userEvent.type(text, 'Specialized work created opportunity, while unequal labor was a serious cost.'); fireEvent.blur(text); await waitFor(() => expect(screen.getByRole('button', { name: 'Complete lesson' }).hasAttribute('disabled')).toBe(false)); await userEvent.click(screen.getByRole('button', { name: 'Complete lesson' })); expect(await screen.findByText('Knowledge Card · place')).toBeTruthy(); const reveal = document.querySelector('.card-reveal'); await waitFor(() => expect(reveal?.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' })); expect(document.activeElement).toBe(reveal); expect(screen.getAllByRole('heading', { name: 'Uruk' })).toHaveLength(1); const next = screen.getByRole('link', { name: /Continue World History/ }); expect(next.getAttribute('href')).toBe('/learn/lesson.writing.early-systems'); });
  it('keeps the learning drawer concise and links to the complete World History roadmap', async () => { const gateway = new TestGateway(); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' }); await userEvent.click(within(screen.getByRole('complementary', { name: 'Chronos navigation' })).getByRole('button', { name: 'World History' })); const timeline = screen.getByLabelText('World History timeline'); const visibleNodes = timeline.querySelectorAll('.spine-node'); expect(visibleNodes.length).toBeGreaterThan(3); expect(visibleNodes.length).toBeLessThan(185); expect(within(timeline).getByText('Farming and Settlements')).toBeTruthy(); expect([...timeline.querySelectorAll('.spine-node-copy strong')].some((node) => node.textContent === 'Decolonization and an Interdependent World')).toBe(false); expect(within(timeline).getAllByText(/more planned lessons/i).length).toBeGreaterThan(0); expect(screen.getByRole('link', { name: 'View complete 185-lesson roadmap' }).getAttribute('href')).toBe('/library/journey.world-history#world-spine-title'); })
});
