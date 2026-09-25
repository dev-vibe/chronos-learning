// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LearnApp } from '../../src/learn/LearnApp';
import { lessonIdFromPath } from '../../src/learn/route';
import { setUnlockPreviewLessonsForTests } from '../../src/config/runtimeFlags';
import type { JourneyProgressSummary, LearnProgressGateway, LearnState, ReviewInbox } from '../../src/learn/progress';

const initial = (): LearnState => ({ learnerId: 'test', lessonId: 'lesson.uruk.first-city', status: 'in-progress', attemptedPromptIds: [], exploredSectionIds: [], responses: {}, account: { parentLinked: true }, version: 1 });
class TestGateway implements LearnProgressGateway {
  state = initial(); load = vi.fn(async () => this.state);
  loadJourneySummaries = vi.fn(async (lessonIds: readonly string[]) => Object.fromEntries(lessonIds.map((lessonId) => [lessonId, { lessonId, status: lessonId === this.state.lessonId ? this.state.status : 'in-progress' }])) as Record<string, JourneyProgressSummary>);
  markSection = vi.fn(async () => this.state);
  saveAttempt = vi.fn(async (_lesson: string, prompt: string, response: string) => { this.state = { ...this.state, attemptedPromptIds: [...new Set([...this.state.attemptedPromptIds, prompt])], responses: { ...this.state.responses, [prompt]: response } }; return this.state; });
  submit = vi.fn(async () => { this.state = { ...this.state, status: 'completed', completedAt: new Date().toISOString(), review: { status: 'submitted', round: (this.state.review?.round ?? 0) + (this.state.review?.status === 'submitted' ? 0 : 1), submittedAt: '2026-09-25T12:00:00.000Z', cardIds: [], ...(this.state.review?.feedback ? { feedback: this.state.review.feedback } : {}) } }; return this.state; });
  inbox: ReviewInbox = { passes: [], returned: [], waitingForMyReview: 0 };
  loadInbox = vi.fn(async () => this.inbox);
  acknowledgePass = vi.fn(async (lessonId: string) => { this.inbox = { ...this.inbox, passes: this.inbox.passes.filter((notice) => notice.lessonId !== lessonId) }; });
}

beforeEach(() => {
  setUnlockPreviewLessonsForTests(undefined);
  sessionStorage.clear();
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
  it('renders the decoded-asset contract and typed editorial modules', async () => { const gateway = new TestGateway(); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); expect(await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' })).toBeTruthy(); const hero = document.querySelector('.hero-media') as HTMLImageElement; expect(hero).toBeTruthy(); expect(hero.getAttribute('src')).toBe('/images/optimized/uruk/reconstruction.optimized.webp'); expect(hero.getAttribute('width')).toBe('1600'); expect(hero.getAttribute('height')).toBe('800'); expect(hero.classList.contains('responsive-media')).toBe(true); expect(hero.hasAttribute('data-loaded')).toBe(false); fireEvent.load(hero); expect(hero.getAttribute('data-loaded')).toBe('true'); expect(document.querySelector('.hero-image')?.hasAttribute('style')).toBe(false); expect(document.querySelector('.hero-probe')).toBeNull(); expect(screen.queryByText('At a glance')).toBeNull();expect(document.querySelector('.evidence-comparison')).toBeNull(); expect(Array.from(document.querySelectorAll('.evidence-type')).map((node) => node.textContent?.replace(/\s+/g, ' ').trim())).toEqual(['Surviving evidence', 'Surviving evidence']); const evidenceImages = Array.from(document.querySelectorAll('.evidence-visuals > .evidence-image > img')); expect(evidenceImages).toHaveLength(2); expect(evidenceImages.every((image) => image.getAttribute('loading') === 'eager')).toBe(true); expect(within(document.querySelector('.evidence-module')!).getByText(/records and ideas could travel beyond one person/i)).toBeTruthy(); expect(screen.queryByRole('heading', { name: 'Connections' })).toBeNull(); expect(screen.getByRole('heading', { name: 'World Check' })).toBeTruthy(); });
  it('shows a map hero once, in Time and place, when the lesson has no locator map of its own', async () => { const gateway = new TestGateway(); gateway.state = { ...initial(), lessonId: 'lesson.humans.migrations-and-interbreeding' }; render(<LearnApp lessonId="lesson.humans.migrations-and-interbreeding" gatewayFactory={async () => gateway} />); await screen.findByRole('heading', { name: 'Migrations, Encounters, and Ancient DNA', level: 1 }); expect(document.querySelector('.masthead .hero')).toBeNull(); expect(document.querySelectorAll('.orientation-map img')).toHaveLength(1); });
  it('uses one visible responsive hero in object-storage mode without a separate largest-derivative request surface', async () => { vi.stubEnv('VITE_MEDIA_PROVIDER', 'object-storage'); vi.stubEnv('VITE_MEDIA_BASE_URL', 'https://media.example.test/public'); const gateway = new TestGateway(); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' }); const hero = document.querySelector('.hero-media') as HTMLImageElement; expect(hero).toBeTruthy(); expect(hero.getAttribute('srcset')).toContain(' 480w'); expect(hero.getAttribute('srcset')).toContain(' 960w'); expect(hero.getAttribute('srcset')).toContain(' 1600w'); expect(hero.getAttribute('sizes')).toBe('(max-width: 800px) 100vw, 60vw'); expect(document.querySelectorAll('.hero-image img')).toHaveLength(1); expect(document.querySelector('.hero-image')?.hasAttribute('style')).toBe(false); expect(document.querySelector('.hero-probe')).toBeNull(); });
  it('shows the map once at the opening while retaining geographic sources and stable sections', async () => {
    const gateway = new TestGateway();
    render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />);
    await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' });
    const images = screen.getAllByAltText(/Illustrated map of the southern Mesopotamian plain/i);
    expect(images).toHaveLength(1);
    const image = images[0];
    expect(image.getAttribute('src')).toBe('/images/optimized/uruk/southern-mesopotamia-map.optimized.webp');
    expect(image.getAttribute('width')).toBe('1732');
    expect(image.getAttribute('height')).toBe('908');
    expect(image.closest('.lesson-orientation')).toBeTruthy();
    expect(document.getElementById('section.uruk.masthead')?.querySelector('img')).toBeNull();
    expect(document.getElementById('section.uruk.masthead')?.textContent).toContain('Food, work, worship, and record-keeping');
    const trigger = screen.getByRole('button', { name: 'Enlarge Locator: Southern Mesopotamia' });
    await userEvent.click(trigger);
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/official UNESCO World Heritage coordinates/i)).toBeTruthy();
    expect(within(dialog).getAllByRole('link').some(link => link.getAttribute('href') === 'https://whc.unesco.org/en/list/1481/maps/')).toBe(true);
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(dialog.hasAttribute('open')).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });
  it('falls back locally when object storage delivery fails', async () => { vi.stubEnv('VITE_MEDIA_PROVIDER', 'object-storage'); vi.stubEnv('VITE_MEDIA_BASE_URL', 'https://media.example.test/public'); const gateway = new TestGateway(); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' }); const image=within(document.querySelector('.lesson-orientation')!).getByAltText(/Illustrated map of the southern Mesopotamian plain/i);expect(image.getAttribute('src')).toMatch(/^https:\/\/media\.example\.test\/public\/media-public\//);fireEvent.error(image);await waitFor(()=>expect(image.getAttribute('src')).toBe('/images/optimized/uruk/southern-mesopotamia-map.optimized.webp')); });
  it('opens the native Explore the Scene field guide', async () => { const gateway = new TestGateway(); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' }); const title = screen.getByText('Explore the scene'); const details = title.closest('details'); expect(details?.hasAttribute('open')).toBe(false); await userEvent.click(title); expect(details?.hasAttribute('open')).toBe(true); expect(screen.getByText('Monumental precinct')).toBeTruthy(); });
  it('offers retry after progress load failure', async () => { const gateway = new TestGateway(); gateway.load.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(gateway.state); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('button', { name: 'Retry loading progress' }); await userEvent.click(screen.getByRole('button', { name: 'Retry loading progress' })); expect(await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' })).toBeTruthy(); expect(gateway.load).toHaveBeenCalledTimes(2); expect(gateway.loadJourneySummaries).toHaveBeenCalledTimes(2); });
  it('keeps the journey outline in a drawer and returns focus after Escape', async () => { const gateway = new TestGateway(); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' }); const rail = screen.getByLabelText('World History'); expect(rail.getAttribute('aria-hidden')).toBe('true'); const open = within(screen.getByRole('complementary', { name: 'Chronos navigation' })).getByRole('button', { name: 'World History' }); await userEvent.click(open); expect(screen.getByRole('dialog', { name: 'World History' })).toBeTruthy(); expect(rail.getAttribute('aria-hidden')).toBe('false'); fireEvent.keyDown(document, { key: 'Escape' }); expect(rail.getAttribute('aria-hidden')).toBe('true'); expect(open).toBe(document.activeElement); });
  it('navigates to a semantic section and moves focus with the journey control', async () => { const gateway = new TestGateway(); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' }); await userEvent.click(within(screen.getByRole('complementary', { name: 'Chronos navigation' })).getByRole('button', { name: 'World History' })); await userEvent.click(screen.getByRole('button', { name: 'The built city' })); const section = document.getElementById('section.uruk.the-built-city'); expect(section?.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' }); expect(section).toBe(document.activeElement); });
  it('does not interrupt the lesson with a resume banner', async () => { const gateway = new TestGateway(); gateway.state = { ...gateway.state, resumeSectionId: 'section.uruk.the-built-city', exploredSectionIds: ['section.uruk.the-built-city'] }; render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' }); expect(screen.queryByText('Welcome back')).toBeNull(); expect(screen.queryByRole('button', { name: 'Resume' })).toBeNull(); expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' }); });
  it('fails closed for a missing lesson without leaking a spine title', () => {
    render(<LearnApp lessonId="lesson.unknown" />);
    expect(screen.getByRole('heading', { name: /This archive entry.*available\./i })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'The Nile and an Early Egyptian State' })).toBeNull();
    expect(document.querySelectorAll('.global-rail nav a')).toHaveLength(4);
  });
  it('keeps the Chronos shell and prerequisite visible for a locked lesson', async () => {
    const gateway = new TestGateway();
    gateway.state = { ...gateway.state, lessonId: 'lesson.writing.early-systems' };
    render(<LearnApp lessonId="lesson.writing.early-systems" gatewayFactory={async () => gateway} />);
    expect(await screen.findByRole('heading', { name: 'This lesson is still locked.' })).toBeTruthy();
    expect(screen.getByText(/Complete Uruk: Life in an Early City before continuing/i)).toBeTruthy();
    expect(document.querySelectorAll('.global-rail nav a')).toHaveLength(4);
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
    const map = within(document.querySelector('.lesson-orientation')!).getByRole('img', { name: /Editorial locator map.*Çatalhöyük/i });
    expect(map.closest('.lesson-orientation')).toBeTruthy();
    expect(document.querySelectorAll('.lesson-section .historical-map')).toHaveLength(0);
    expect(screen.getAllByRole('img', { name: /Editorial locator map.*Çatalhöyük/i })).toHaveLength(1);
    expect(screen.queryByText('This archive entry is not available.')).toBeNull();
  });
  it('places the Human Origins map once at the opening and preserves its teaching section', async () => {
    const gateway = new TestGateway();
    gateway.state = { ...gateway.state, lessonId: 'lesson.humans.homo-sapiens-origins' };
    render(<LearnApp lessonId="lesson.humans.homo-sapiens-origins" gatewayFactory={async () => gateway} />);
    expect(await screen.findByRole('heading', { name: 'Our Species Begins in Africa' })).toBeTruthy();
    const map = within(document.querySelector('.lesson-orientation')!).getByRole('img', { name: /Map of Africa with five marked sites/i });
    expect(map.getAttribute('width')).toBe('1600');
    expect(map.getAttribute('height')).toBe('1644');
    expect(map.closest('.lesson-orientation')).toBeTruthy();
    expect(document.querySelectorAll('.lesson-orientation .orientation-map>img')).toHaveLength(1);
    expect(document.querySelectorAll('.lesson-section .historical-map')).toHaveLength(0);
    expect(document.querySelectorAll('.lesson-section .prose-module').length).toBeGreaterThan(0);
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
    expect(within(screen.getByRole('complementary', { name: 'Chronos navigation' })).getByRole('link', { name: 'Audit on' }).getAttribute('href')).toBe('/audit');
  });
  it('shows the audit control when browser audit mode is stored', async () => {
    const { AUDIT_UNLOCK_STORAGE_KEY, setUnlockPreviewLessonsForTests } = await import('../../src/config/runtimeFlags');
    setUnlockPreviewLessonsForTests(undefined);
    window.localStorage.setItem(AUDIT_UNLOCK_STORAGE_KEY, '1');
    const gateway = new TestGateway();
    render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />);
    await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' });
    expect(within(screen.getByRole('complementary', { name: 'Chronos navigation' })).getByRole('link', { name: 'Audit on' }).getAttribute('href')).toBe('/audit');
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
  it('persists prompt feedback, finishes by sending answers for review, and gives a truthful next action', async () => { const gateway = new TestGateway(); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' }); expect(screen.getByText(/you earn the Uruk Knowledge Card/)).toBeTruthy(); await userEvent.click(screen.getByLabelText('Administrative tablets and cylinder seals')); await userEvent.click(screen.getAllByRole('button', { name: 'Compare your thinking' })[0]); expect(await screen.findByText(/Compare the evidence/)).toBeTruthy(); const text = screen.getByRole('textbox'); await userEvent.type(text, 'Specialized work created opportunity, while unequal labor was a serious cost.'); fireEvent.blur(text); await userEvent.click(screen.getAllByRole('button', { name: 'Compare your thinking' })[1]); await waitFor(() => expect(screen.getByRole('button', { name: 'Finish and send for review' }).hasAttribute('disabled')).toBe(false)); await userEvent.click(screen.getByRole('button', { name: 'Finish and send for review' }));
    expect(await screen.findByText('Waiting for review')).toBeTruthy(); expect(gateway.submit).toHaveBeenCalledWith('lesson.uruk.first-city'); expect(document.querySelector('.review-status')?.textContent).toContain('Sent to your parent'); expect(document.querySelector('.card-reveal')).toBeNull(); const next = screen.getByRole('link', { name: /Continue: From Marks/ }); expect(next.getAttribute('href')).toBe('/learn/lesson.writing.early-systems'); });
  it('asks a learner without a linked parent to link one, without blocking the finish', async () => { const gateway = new TestGateway(); gateway.state = { ...initial(), account: { parentLinked: false } }; render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' }); expect(screen.getByRole('link', { name: 'Link one on your Account page' }).getAttribute('href')).toBe('/account'); expect(screen.getByRole('button', { name: 'Answer the checks above' })).toBeTruthy(); });
  it('lets a guest finish in this browser and invites them to sign in for cards', async () => { const gateway = new TestGateway(); const { account: _account, ...guest } = initial(); gateway.state = { ...guest, status: 'completed', completedAt: '2026-09-01T00:00:00.000Z' }; render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); expect(await screen.findByRole('heading', { name: 'Lesson finished' })).toBeTruthy(); expect(screen.getByRole('link', { name: 'Sign in' }).getAttribute('href')).toBe('/account'); expect(document.querySelector('.card-reveal')).toBeNull(); });
  it('shows a sent-back note and resubmits from the same lesson page', async () => { const gateway = new TestGateway(); gateway.state = { ...initial(), status: 'completed', completedAt: '2026-09-01T00:00:00.000Z', attemptedPromptIds: ['prompt.uruk.administration-evidence', 'prompt.uruk.opportunity-and-cost'], responses: { 'prompt.uruk.administration-evidence': 'option.uruk.tablets', 'prompt.uruk.opportunity-and-cost': 'Work.' }, review: { status: 'returned', round: 1, submittedAt: '2026-09-01T00:00:00.000Z', reviewedAt: '2026-09-02T00:00:00.000Z', feedback: 'Say who did the work.', cardIds: [] } }; render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); expect(await screen.findByRole('heading', { name: 'Your parent sent this back' })).toBeTruthy(); expect(screen.getByText('Say who did the work.')).toBeTruthy(); expect(screen.getByRole('link', { name: /Sent back · see the note/ }).getAttribute('href')).toBe('#completion-title'); expect(screen.getByRole('link', { name: /^Question 1:/ }).getAttribute('href')).toBe('#prompt-prompt.uruk.administration-evidence'); await userEvent.click(screen.getByRole('button', { name: 'Send it again' })); expect(gateway.submit).toHaveBeenCalledTimes(1); expect(await screen.findByText('Waiting for review')).toBeTruthy(); expect(screen.getByText('Their last note')).toBeTruthy(); });
  it('celebrates a new pass once with the earned card, then shows the passed lesson', async () => { const gateway = new TestGateway(); gateway.state = { ...initial(), status: 'completed', completedAt: '2026-09-01T00:00:00.000Z', review: { status: 'passed', round: 1, submittedAt: '2026-09-01T00:00:00.000Z', reviewedAt: '2026-09-02T00:00:00.000Z', feedback: 'Great thinking!', cardIds: ['card.place.uruk'] }, cardIds: ['card.place.uruk'] }; gateway.inbox = { passes: [{ lessonId: 'lesson.uruk.first-city', cardIds: ['card.place.uruk'], feedback: 'Great thinking!' }], returned: [], waitingForMyReview: 0 }; render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); const dialog = await screen.findByRole('dialog', { name: 'Uruk: Life in an Early City' }); expect(within(dialog).getByText(/Passed!/)).toBeTruthy(); expect(within(dialog).getByText(/You earned a new Knowledge Card/)).toBeTruthy(); expect(within(dialog).getByRole('heading', { name: 'Uruk' })).toBeTruthy(); expect(document.activeElement).toBe(within(dialog).getByRole('button', { name: /Add it to my collection/ })); await userEvent.click(within(dialog).getByRole('button', { name: /Add it to my collection/ })); expect(gateway.acknowledgePass).toHaveBeenCalledWith('lesson.uruk.first-city'); await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Uruk: Life in an Early City' })).toBeNull()); expect(screen.getByRole('heading', { name: 'Lesson passed' })).toBeTruthy(); expect(screen.getByText('In your Knowledge Cards')).toBeTruthy(); cleanup(); render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />); await screen.findByRole('heading', { name: 'Lesson passed' }); expect(screen.queryByRole('dialog', { name: 'Uruk: Life in an Early City' })).toBeNull(); });
  it('requires deliberate comparison and keeps a short draft when reopened', async () => {
    const gateway = new TestGateway();
    const view = render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />);
    await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' });
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Clay' } });
    fireEvent.blur(screen.getByRole('textbox'));
    expect(gateway.saveAttempt).not.toHaveBeenCalled();
    view.unmount();
    render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />);
    expect((await screen.findByRole('textbox') as HTMLTextAreaElement).value).toBe('Clay');
    await userEvent.click(screen.getAllByRole('button', { name: 'Compare your thinking' })[1]);
    expect(screen.getByRole('alert').textContent).toContain('Add a little more');
    expect(gateway.saveAttempt).not.toHaveBeenCalled();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Specialized work created opportunity, while unequal labor was a serious cost.' } });
    expect(gateway.saveAttempt).not.toHaveBeenCalled();
    await userEvent.click(screen.getAllByRole('button', { name: 'Compare your thinking' })[1]);
    await screen.findByText('An example explanation');
    expect(gateway.saveAttempt).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole('button', { name: 'Revise my thinking (optional)' }));
    expect(document.activeElement).toBe(screen.getByRole('textbox'));
    expect(gateway.state.attemptedPromptIds).toContain('prompt.uruk.opportunity-and-cost');
  });
  it('lists every canonical World History lesson title in the drawer, including unpublished stops', async () => {
    const gateway = new TestGateway();
    render(<LearnApp lessonId="lesson.uruk.first-city" gatewayFactory={async () => gateway} />);
    await screen.findByRole('heading', { name: 'Uruk: Life in an Early City' });
    await userEvent.click(within(screen.getByRole('complementary', { name: 'Chronos navigation' })).getByRole('button', { name: 'World History' }));
    const timeline = screen.getByLabelText('World History timeline');
    expect(timeline.querySelectorAll('.spine-node')).toHaveLength(185);
    expect(within(timeline).getByText('Crossing to Sahul')).toBeTruthy();
    expect(within(timeline).getByText('Living Through the Ice Age')).toBeTruthy();
    expect(within(timeline).getByText('Peopling the Americas')).toBeTruthy();
    expect(within(timeline).getByText('Climate Change at the Start of the Holocene')).toBeTruthy();
    expect(within(timeline).getByText('Animals, Herding, and Mobility')).toBeTruthy();
    expect(within(timeline).getByText('Wheels, Metals, and Specialized Work')).toBeTruthy();
    expect(within(timeline).getByText('Farming and Settlements')).toBeTruthy();
    expect(within(timeline).getByText('New Evidence Changes How We Know the Past')).toBeTruthy();
    expect(within(timeline).queryByText(/more planned lessons/i)).toBeNull();
    expect(within(timeline).getAllByText('Lesson in preparation').length).toBeGreaterThan(0);
    expect(within(timeline).getByText('Living Through the Ice Age').closest('a')).toBeNull();
    expect(screen.getByRole('link', { name: 'View complete 185-lesson roadmap' }).getAttribute('href')).toBe('/library/journey.world-history#world-spine-title');
  });
});
