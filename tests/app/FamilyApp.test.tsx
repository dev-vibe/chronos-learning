// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { chronosContent } from '../../content/chronos';
import { FamilyApp } from '../../src/app/FamilyApp';
import type { AccountSetup, AccountSnapshot, FamilyGateway, ReviewItem } from '../../src/infrastructure/family/gateway';
import type { ActiveLearner } from '../../src/infrastructure/family/activeLearner';
import type { CompletedLesson, LessonOptOut } from '../../src/domains/learnerOverview';

const kidId = '11111111-1111-4111-a111-111111111111';
const parentId = '22222222-2222-4222-a222-222222222222';

class FakeFamilyGateway implements FamilyGateway {
  readonly available = true;
  user: { userId: string; email?: string } | null = null;
  account: AccountSnapshot = { userId: kidId, email: 'kid@example.test', displayName: 'Sam', setup: 'learner', linkCode: 'ABCDEFGH', parents: [], learners: [], profiles: [], parentPin: false };
  pin: string | null = null;
  queue: ReviewItem[] = [];
  session = vi.fn(async () => this.user);
  signIn = vi.fn(async (email: string) => { this.user = { userId: this.account.userId, email }; });
  signUp = vi.fn(async () => 'confirm-email' as const);
  signInWithGoogle = vi.fn(async () => undefined);
  signOut = vi.fn(async () => { this.user = null; });
  loadAccount = vi.fn(async () => this.account);
  saveDisplayName = vi.fn(async (name: string) => { this.account = { ...this.account, displayName: name }; });
  rotateLinkCode = vi.fn(async () => 'JKLMNPQR');
  linkLearner = vi.fn(async (code: string) => {
    if (code.replace(/-/g, '') !== 'STUVWXYZ') throw { message: 'link code not found' };
    this.account = { ...this.account, learners: [{ id: kidId, displayName: 'Sam' }] };
    return { id: kidId, displayName: 'Sam' };
  });
  unlink = vi.fn(async () => undefined);
  saveSetup = vi.fn(async (setup: AccountSetup) => { this.account = { ...this.account, setup }; });
  addProfile = vi.fn(async (name: string) => { const kid = { id: `kid-${this.account.profiles.length + 1}`, displayName: name.trim() }; this.account = { ...this.account, setup: this.account.setup ?? 'shared', profiles: [...this.account.profiles, kid] }; return kid; });
  renameProfile = vi.fn(async (id: string, name: string) => { this.account = { ...this.account, profiles: this.account.profiles.map((kid) => kid.id === id ? { ...kid, displayName: name } : kid) }; });
  removeProfile = vi.fn(async (id: string) => { this.account = { ...this.account, profiles: this.account.profiles.filter((kid) => kid.id !== id) }; });
  setParentPin = vi.fn(async (pin: string | null) => { this.pin = pin; this.account = { ...this.account, parentPin: pin !== null }; });
  verifyParentPin = vi.fn(async (pin: string) => this.pin === null || pin === this.pin);
  parentPinEnabled = vi.fn(async () => this.pin !== null);
  loadReviewQueue = vi.fn(async () => this.queue);
  completed: CompletedLesson[] = [];
  loadCompletedLessons = vi.fn(async () => this.completed);
  optOuts: LessonOptOut[] = [];
  loadLessonOptOuts = vi.fn(async () => this.optOuts);
  setLessonOptOut = vi.fn(async (learnerId: string, lessonId: string, optedOut: boolean) => {
    this.optOuts = optedOut ? [...this.optOuts, { learnerId, lessonId, optedOutAt: '2026-10-06T14:00:00.000Z' }] : this.optOuts.filter((item) => !(item.learnerId === learnerId && item.lessonId === lessonId));
  });
  review = vi.fn(async (learnerId: string, lessonId: string, decision: 'pass' | 'return', feedback: string) => {
    this.queue = this.queue.map((item) => item.learnerId === learnerId && item.lessonId === lessonId ? { ...item, status: decision === 'pass' ? 'passed' : 'returned', feedback, reviewedAt: '2026-09-26T00:00:00.000Z' } : item);
  });
}

const waitingUruk = (): ReviewItem => ({
  learnerId: kidId,
  lessonId: 'lesson.uruk.first-city',
  status: 'submitted',
  round: 1,
  submittedAt: '2026-09-25T00:00:00.000Z',
  answers: { 'prompt.uruk.opportunity-and-cost': 'Temple workers were paid in grain rations.' },
  questions: [{ promptId: 'prompt.uruk.opportunity-and-cost', kind: 'concise-explanation', question: 'Name one opportunity and one cost or challenge of life in Uruk, using lesson evidence.', required: true, explanation: 'Extra food could support specialized work.' }],
});

const originalLocation = window.location;
beforeEach(() => {
  sessionStorage.clear();
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); Object.defineProperty(window, 'location', { configurable: true, value: originalLocation }); });

describe('Account page', () => {
  it('signs a learner in with email and then shows their link code', async () => {
    const gateway = new FakeFamilyGateway();
    render(<FamilyApp page="account" gateway={gateway} />);
    await userEvent.type(await screen.findByLabelText('Email'), 'kid@example.test');
    await userEvent.type(screen.getByLabelText('Password'), 'secret-pass');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(gateway.signIn).toHaveBeenCalledWith('kid@example.test', 'secret-pass');
    expect(await screen.findByRole('heading', { name: 'Hi, Sam.' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Link to a parent' })).toBeTruthy();
    expect(screen.getByText('ABCD-EFGH')).toBeTruthy();
  });

  it('tells a new account to confirm their email when the project requires it', async () => {
    const gateway = new FakeFamilyGateway();
    render(<FamilyApp page="account" gateway={gateway} />);
    await userEvent.click(await screen.findByRole('button', { name: 'Create an account' }));
    await userEvent.type(screen.getByLabelText('Your first name'), 'Sam');
    await userEvent.type(screen.getByLabelText('Email'), 'kid@example.test');
    await userEvent.type(screen.getByLabelText('Password'), 'secret-pass');
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));
    expect(gateway.signUp).toHaveBeenCalledWith('kid@example.test', 'secret-pass', 'Sam');
    expect(await screen.findByText(/Check your email to confirm/)).toBeTruthy();
  });

  it('lets a learner get a new code at any time', async () => {
    const gateway = new FakeFamilyGateway();
    gateway.user = { userId: kidId, email: 'kid@example.test' };
    render(<FamilyApp page="account" gateway={gateway} />);
    await screen.findByText('ABCD-EFGH');
    await userEvent.click(screen.getByRole('button', { name: /Get a new code/ }));
    expect(await screen.findByText('JKLM-NPQR')).toBeTruthy();
  });

  it('shows a linked parent and still offers a code for another parent', async () => {
    const gateway = new FakeFamilyGateway();
    gateway.user = { userId: kidId };
    gateway.account = { ...gateway.account, parents: [{ id: parentId, displayName: 'Mom' }] };
    render(<FamilyApp page="account" gateway={gateway} />);
    expect(await screen.findByRole('heading', { name: 'Your parent' })).toBeTruthy();
    expect(screen.getByText(/Mom reviews your lessons/)).toBeTruthy();
    expect(screen.getByText('To add another parent, give them this code:')).toBeTruthy();
  });

  it('links a parent to a learner by code and explains a wrong code', async () => {
    const gateway = new FakeFamilyGateway();
    gateway.user = { userId: parentId };
    gateway.account = { userId: parentId, displayName: 'Mom', setup: 'separate', linkCode: 'HJKLMNPQ', parents: [], learners: [], profiles: [], parentPin: false };
    render(<FamilyApp page="account" gateway={gateway} />);
    const input = await screen.findByLabelText('Kid’s link code');
    await userEvent.type(input, 'aaaa-bbbb');
    await userEvent.click(screen.getByRole('button', { name: 'Link' }));
    expect((await screen.findByRole('alert')).textContent).toContain('didn’t match anyone');
    await userEvent.clear(input);
    await userEvent.type(input, 'stuv-wxyz');
    await userEvent.click(screen.getByRole('button', { name: 'Link' }));
    expect(gateway.linkLearner).toHaveBeenLastCalledWith('STUV-WXYZ');
    expect(await screen.findByText('Linked to Sam.')).toBeTruthy();
    expect(await screen.findByRole('heading', { name: 'Kids you review' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Open Review/ }).getAttribute('href')).toBe('/review');
  });
});

describe('Returning from Google sign-in', () => {
  it('keeps the sign-in code in the address until the session has been read, then tidies it', async () => {
    window.history.replaceState(null, '', '/account?signed-in=1&code=abc123');
    const gateway = new FakeFamilyGateway();
    let finish!: () => void;
    gateway.session = vi.fn(() => new Promise((resolve) => { finish = () => { gateway.user = { userId: kidId }; resolve(gateway.user); }; }));
    render(<FamilyApp page="account" gateway={gateway} />);
    expect(window.location.search).toBe('?signed-in=1&code=abc123');
    finish();
    expect(await screen.findByRole('heading', { name: 'Hi, Sam.' })).toBeTruthy();
    await waitFor(() => expect(window.location.search).toBe(''));
    expect(window.location.pathname).toBe('/account');
  });
});

describe('Account setup and shared accounts', () => {
  const newAccount = () => {
    const gateway = new FakeFamilyGateway();
    gateway.user = { userId: parentId, email: 'mom@example.test' };
    gateway.account = { userId: parentId, displayName: 'Mom', linkCode: 'HJKLMNPQ', parents: [], learners: [], profiles: [], parentPin: false };
    return gateway;
  };

  it('asks who will use the account and recommends separate sign-ins', async () => {
    const gateway = newAccount();
    render(<FamilyApp page="account" gateway={gateway} activeLearner={null} />);
    expect(await screen.findByRole('heading', { name: 'Who will use Chronos on this account?' })).toBeTruthy();
    const options = screen.getAllByRole('button', { name: /sign-in|learner/ }).filter((button) => button.classList.contains('setup-option'));
    expect(options[0].textContent).toContain('My kid will have their own sign-in');
    expect(options[0].textContent).toContain('Recommended');
    expect(options.filter((option) => option.textContent?.includes('Recommended'))).toHaveLength(1);
    await userEvent.click(options[0]);
    expect(gateway.saveSetup).toHaveBeenCalledWith('separate');
    expect(await screen.findByRole('heading', { name: 'Link your kid' })).toBeTruthy();
  });

  it('adds kids to a shared sign-in, renames and removes them, and links to Review', async () => {
    const gateway = newAccount();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<FamilyApp page="account" gateway={gateway} activeLearner={null} />);
    await userEvent.click(await screen.findByRole('button', { name: /My kids will share this sign-in/ }));
    expect(gateway.saveSetup).toHaveBeenCalledWith('shared');
    await userEvent.type(await screen.findByLabelText('Kid’s first name'), 'Sam');
    await userEvent.click(screen.getByRole('button', { name: /Add kid/ }));
    expect(gateway.addProfile).toHaveBeenCalledWith('Sam');
    await userEvent.type(await screen.findByLabelText('Add another kid'), 'Alex');
    await userEvent.click(screen.getByRole('button', { name: /Add kid/ }));
    const kids = await screen.findByRole('region', { name: 'Kids on this account' });
    await waitFor(() => expect(within(kids).getByText('Alex')).toBeTruthy());
    expect(within(kids).getByRole('link', { name: /Open Review/ }).getAttribute('href')).toBe('/review');
    await userEvent.click(within(kids).getAllByRole('button', { name: 'Rename' })[1]);
    const rename = within(kids).getByLabelText('New name for Alex');
    await userEvent.clear(rename);
    await userEvent.type(rename, 'Alexis');
    await userEvent.click(within(kids).getByRole('button', { name: 'Save' }));
    expect(gateway.renameProfile).toHaveBeenCalledWith('kid-2', 'Alexis');
    await userEvent.click((await within(kids).findAllByRole('button', { name: 'Remove' }))[1]);
    expect(gateway.removeProfile).toHaveBeenCalledWith('kid-2');
    await waitFor(() => expect(within(kids).queryByText('Alexis')).toBeNull());
  });

  it('links to Review from a shared account whose only kid has their own sign-in', async () => {
    const gateway = newAccount();
    gateway.account = { ...gateway.account, setup: 'shared', learners: [{ id: kidId, displayName: 'River' }] };
    render(<FamilyApp page="account" gateway={gateway} activeLearner={null} />);
    const linked = await screen.findByRole('region', { name: 'Kids with their own sign-in' });
    expect(within(linked).getByText('River')).toBeTruthy();
    expect(within(linked).getByRole('link', { name: /Open Review/ }).getAttribute('href')).toBe('/review');
  });

  it('lets the parent add, change and turn off an optional parent-view PIN', async () => {
    const gateway = newAccount();
    gateway.account = { ...gateway.account, setup: 'shared', profiles: [{ id: 'kid-1', displayName: 'Sam' }] };
    render(<FamilyApp page="account" gateway={gateway} activeLearner={null} />);
    const card = await screen.findByRole('region', { name: 'Parent view PIN' });
    expect(within(card).getByText(/^Off\./)).toBeTruthy();
    await userEvent.click(within(card).getByRole('button', { name: 'Add a PIN' }));
    await userEvent.type(within(card).getByLabelText('New 4-digit PIN'), '24a68');
    expect((within(card).getByLabelText('New 4-digit PIN') as HTMLInputElement).value).toBe('2468');
    await userEvent.click(within(card).getByRole('button', { name: 'Save PIN' }));
    expect(gateway.setParentPin).toHaveBeenCalledWith('2468');
    expect(await within(card).findByText(/^On\./)).toBeTruthy();
    await userEvent.click(within(card).getByRole('button', { name: 'Turn off the PIN' }));
    expect(gateway.setParentPin).toHaveBeenLastCalledWith(null);
    expect(await within(card).findByText(/^Off\./)).toBeTruthy();
  });

  it('shows kid view a way back to parent view instead of account settings, asking for the PIN only when set', async () => {
    const gateway = newAccount();
    gateway.account = { ...gateway.account, setup: 'shared', profiles: [{ id: 'kid-1', displayName: 'Sam' }, { id: 'kid-2', displayName: 'Alex' }] };
    const active: ActiveLearner = { userId: parentId, learnerId: 'kid-1', view: 'kid', profiles: [{ id: 'kid-1', displayName: 'Sam' }, { id: 'kid-2', displayName: 'Alex' }] };
    gateway.pin = '2468';
    const reload = vi.fn();
    Object.defineProperty(window, 'location', { configurable: true, value: { ...window.location, pathname: '/review', search: '', reload, assign: vi.fn() } });
    render(<FamilyApp page="review" gateway={gateway} activeLearner={active} />);
    expect(await screen.findByRole('heading', { name: 'You’re using Chronos as Sam.' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: /waiting|caught up/ })).toBeNull();
    expect(screen.getByRole('button', { name: 'Alex' })).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: /Switch to parent view/ }));
    const pin = await screen.findByLabelText(/Parent PIN/);
    await userEvent.type(pin, '1111');
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect((await screen.findByRole('alert')).textContent).toContain('didn’t match');
    expect(reload).not.toHaveBeenCalled();
    await userEvent.type(screen.getByLabelText(/Parent PIN/), '2468');
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() => expect(reload).toHaveBeenCalled());
    expect(sessionStorage.getItem('chronos.family.parentView')).toBe('1');
  });

  it('reviews kid profiles on the shared account', async () => {
    const gateway = newAccount();
    gateway.account = { ...gateway.account, setup: 'shared', profiles: [{ id: kidId, displayName: 'Sam' }] };
    gateway.queue = [waitingUruk()];
    render(<FamilyApp page="review" gateway={gateway} activeLearner={{ userId: parentId, learnerId: parentId, view: 'parent', profiles: [{ id: kidId, displayName: 'Sam' }] }} />);
    expect(await screen.findByRole('heading', { name: '1 lesson is waiting.' })).toBeTruthy();
    expect(screen.getByText(/^Sam · sent/)).toBeTruthy();
  });
});

describe('Review page', () => {
  const parentGateway = () => {
    const gateway = new FakeFamilyGateway();
    gateway.user = { userId: parentId };
    gateway.account = { userId: parentId, displayName: 'Mom', setup: 'separate', linkCode: 'HJKLMNPQ', parents: [], learners: [{ id: kidId, displayName: 'Sam' }], profiles: [], parentPin: false };
    gateway.queue = [waitingUruk()];
    return gateway;
  };

  it('asks a parent to link a learner before there is anything to review', async () => {
    const gateway = parentGateway();
    gateway.account = { ...gateway.account, learners: [] };
    render(<FamilyApp page="review" gateway={gateway} />);
    expect(await screen.findByRole('heading', { name: 'No kids to review yet.' })).toBeTruthy();
  });

  it('lists every kid at the top of the Family page with a way to their progress', async () => {
    const gateway = parentGateway();
    gateway.account = { ...gateway.account, profiles: [{ id: 'kid-two', displayName: 'Ava' }] };
    render(<FamilyApp page="review" gateway={gateway} />);
    const roster = await screen.findByRole('region', { name: 'Your kids' });
    expect(within(roster).getByText('Sam')).toBeTruthy();
    expect(within(roster).getByText(/Own sign-in · 1 lesson finished · 1 waiting for you/)).toBeTruthy();
    expect(within(roster).getByText(/On this sign-in · 0 lessons finished/)).toBeTruthy();
    expect(within(roster).getByRole('link', { name: 'See Sam’s progress' }).getAttribute('href')).toBe(`#progress-${kidId}`);
    expect(document.getElementById(`progress-${kidId}`)).toBeTruthy();
    expect(within(roster).getByRole('link', { name: 'Account' }).getAttribute('href')).toBe('/account');
  });

  it('shows the learner’s answers in words and requires a note to send work back', async () => {
    const gateway = parentGateway();
    render(<FamilyApp page="review" gateway={gateway} />);
    expect(await screen.findByRole('heading', { name: '1 lesson is waiting.' })).toBeTruthy();
    const card = screen.getByRole('article', { name: 'Uruk: Life in an Early City' });
    expect(within(card).getByText('Temple workers were paid in grain rations.')).toBeTruthy();
    expect(within(card).getByText('Extra food could support specialized work.')).toBeTruthy();
    // Multiple choice is finished by the kid choosing the best-supported answer, so it isn't reviewed.
    expect(within(card).queryByText(/Which evidence best supports/)).toBeNull();
    await userEvent.click(within(card).getByRole('button', { name: 'Send back' }));
    expect(within(card).getByRole('alert').textContent).toContain('Add a note so Sam knows what to change');
    expect(gateway.review).not.toHaveBeenCalled();
    await userEvent.type(within(card).getByLabelText(/Note for Sam/), 'Say who did the work.');
    await userEvent.click(within(card).getByRole('button', { name: 'Send back' }));
    expect(gateway.review).toHaveBeenCalledWith(kidId, 'lesson.uruk.first-city', 'return', 'Say who did the work.', ['card.place.uruk']);
    expect(await screen.findByRole('heading', { name: 'All caught up.' })).toBeTruthy();
    expect(screen.getByText('Sent back')).toBeTruthy();
  });

  it('passes a lesson and awards the lesson’s card from the content bundle', async () => {
    const gateway = parentGateway();
    render(<FamilyApp page="review" gateway={gateway} />);
    const pass = await screen.findByRole('button', { name: 'Pass and award the Uruk card' });
    await userEvent.click(pass);
    expect(gateway.review).toHaveBeenCalledWith(kidId, 'lesson.uruk.first-city', 'pass', '', ['card.place.uruk']);
    await waitFor(() => expect(screen.getByText('Passed')).toBeTruthy());
  });

  it('shows the parent’s previous note on resubmitted work', async () => {
    const gateway = parentGateway();
    gateway.queue = [{ ...waitingUruk(), round: 2, feedback: 'Say who did the work.' }];
    render(<FamilyApp page="review" gateway={gateway} />);
    expect(await screen.findByText('Your last note')).toBeTruthy();
    expect(screen.getByText(/resubmitted \(2nd try\)/)).toBeTruthy();
  });
});

describe('Progress overview', () => {
  const title = (id: string) => chronosContent.lessons.find((lesson) => lesson.id === id)!.title;
  const writing = 'lesson.writing.early-systems';
  const uruk = 'lesson.uruk.first-city';
  const parentGateway = () => {
    const gateway = new FakeFamilyGateway();
    gateway.user = { userId: parentId };
    gateway.account = { userId: parentId, displayName: 'Mom', setup: 'separate', linkCode: 'HJKLMNPQ', parents: [], learners: [{ id: kidId, displayName: 'Sam' }, { id: 'kid-two', displayName: 'Ava' }], profiles: [], parentPin: false };
    return gateway;
  };
  const progressOf = async (name: string) => within(await screen.findByRole('article', { name }));

  it('shows each kid’s finished lessons with when they were sent and how many tries they took', async () => {
    const gateway = parentGateway();
    gateway.completed = [
      { learnerId: kidId, lessonId: writing, completedAt: '2026-09-25T15:42:00.000Z' },
      { learnerId: kidId, lessonId: uruk, completedAt: '2026-09-24T15:42:00.000Z' },
    ];
    gateway.queue = [
      { ...waitingUruk(), lessonId: uruk, status: 'passed', round: 1, submittedAt: '2026-09-24T15:42:00.000Z', reviewedAt: '2026-09-24T20:00:00.000Z' },
      { ...waitingUruk(), lessonId: writing, status: 'passed', round: 3, submittedAt: '2026-09-28T15:42:00.000Z', reviewedAt: '2026-09-29T20:00:00.000Z' },
    ];
    render(<FamilyApp page="review" gateway={gateway} />);
    const sam = await progressOf('Sam');
    // Same order as the timeline: Uruk comes before writing even though writing was sent later.
    const rows = Array.from(sam.getAllByRole('listitem')).filter((row) => !row.querySelector('button')).map((row) => row.textContent ?? '');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toContain(title(uruk));
    expect(rows[1]).toContain(title(writing));
    expect(sam.getByText('1st try')).toBeTruthy();
    expect(sam.getByText('3rd try').getAttribute('title')).toBe('Passed after being sent back 2 times.');
    expect(sam.getAllByText('Passed')).toHaveLength(2);
    expect(rows[1]).toMatch(/Sent .*sent again .*passed /);
    const stat = (label: string) => sam.getByText(label).parentElement!.querySelector('dd')!.textContent;
    expect(stat('Lessons finished')).toBe('2');
    expect(stat('Passed lessons')).toBe('2');
    expect(stat('Passed first try')).toBe('1');
  });

  it('keeps one card per kid and says when a kid has not finished anything', async () => {
    const gateway = parentGateway();
    gateway.completed = [{ learnerId: kidId, lessonId: uruk, completedAt: '2026-09-24T15:42:00.000Z' }];
    gateway.queue = [waitingUruk()];
    render(<FamilyApp page="review" gateway={gateway} />);
    const sam = await progressOf('Sam');
    expect(sam.getByText('Waiting for you')).toBeTruthy();
    const ava = await progressOf('Ava');
    expect(ava.getByText(/Ava hasn’t finished a lesson yet/)).toBeTruthy();
  });

  it('shows lessons finished before parent review as finished, not as waiting', async () => {
    const gateway = parentGateway();
    gateway.completed = [{ learnerId: kidId, lessonId: uruk, completedAt: '2026-08-01T15:42:00.000Z' }];
    gateway.queue = [];
    render(<FamilyApp page="review" gateway={gateway} />);
    const sam = await progressOf('Sam');
    expect(sam.getByText('Not reviewed')).toBeTruthy();
    expect(sam.queryByText(/^\d+(st|nd|rd|th) try$/)).toBeNull();
    expect(screen.getByText(/^Finished /)).toBeTruthy();
  });

  it('flags a lesson sent back and waiting on a resend', async () => {
    const gateway = parentGateway();
    gateway.queue = [{ ...waitingUruk(), status: 'returned', round: 1, feedback: 'Say who did the work.', reviewedAt: '2026-09-26T00:00:00.000Z' }];
    render(<FamilyApp page="review" gateway={gateway} />);
    const sam = await progressOf('Sam');
    expect(sam.getByText('Sent back')).toBeTruthy();
    expect(sam.getByText('1st try')).toBeTruthy();
    expect(sam.getByText('Needs another try').parentElement!.querySelector('dd')!.textContent).toBe('1');
  });

  describe('skipping lessons', () => {
    it('lists lessons still to do with a Skip button, and never offers Skip on a finished lesson', async () => {
      const gateway = parentGateway();
      gateway.completed = [{ learnerId: kidId, lessonId: uruk, completedAt: '2026-09-24T15:42:00.000Z' }];
      gateway.queue = [{ ...waitingUruk(), status: 'passed', reviewedAt: '2026-09-25T00:00:00.000Z' }];
      render(<FamilyApp page="review" gateway={gateway} />);
      const sam = await progressOf('Sam');
      expect(sam.getByRole('button', { name: `Skip ${title(writing)} for Sam` })).toBeTruthy();
      expect(sam.queryByRole('button', { name: `Skip ${title(uruk)} for Sam` })).toBeNull();
      expect(sam.getByText('Still to do').parentElement!.querySelector('dd')!.textContent).not.toBe('0');
    });

    it('skips a lesson after confirming, shows it as skipped, and restores it', async () => {
      const gateway = parentGateway();
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      render(<FamilyApp page="review" gateway={gateway} />);
      const sam = await progressOf('Sam');
      await userEvent.click(sam.getByRole('button', { name: `Skip ${title(writing)} for Sam` }));
      expect(gateway.setLessonOptOut).toHaveBeenCalledWith(kidId, writing, true);
      const restore = await sam.findByRole('button', { name: `Restore ${title(writing)} for Sam` });
      expect(sam.getByText('Skipped', { selector: '.review-tag' })).toBeTruthy();
      expect(sam.getByText('Skipped', { selector: 'dt' }).parentElement!.querySelector('dd')!.textContent).toBe('1');
      expect(sam.queryByRole('button', { name: `Skip ${title(writing)} for Sam` })).toBeNull();
      // Skipping one kid's lesson leaves the other kid's list alone.
      expect((await progressOf('Ava')).getByRole('button', { name: `Skip ${title(writing)} for Ava` })).toBeTruthy();
      await userEvent.click(restore);
      expect(gateway.setLessonOptOut).toHaveBeenLastCalledWith(kidId, writing, false);
      expect(await sam.findByRole('button', { name: `Skip ${title(writing)} for Sam` })).toBeTruthy();
      expect(sam.queryByText('Skipped', { selector: 'dt' })).toBeNull();
    });

    it('does nothing when the parent cancels the confirmation', async () => {
      const gateway = parentGateway();
      vi.spyOn(window, 'confirm').mockReturnValue(false);
      render(<FamilyApp page="review" gateway={gateway} />);
      const sam = await progressOf('Sam');
      await userEvent.click(sam.getByRole('button', { name: `Skip ${title(writing)} for Sam` }));
      expect(gateway.setLessonOptOut).not.toHaveBeenCalled();
    });

    it('explains when a skip cannot be saved', async () => {
      const gateway = parentGateway();
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      gateway.setLessonOptOut.mockRejectedValueOnce({ message: 'finished lessons cannot be skipped' });
      render(<FamilyApp page="review" gateway={gateway} />);
      const sam = await progressOf('Sam');
      await userEvent.click(sam.getByRole('button', { name: `Skip ${title(writing)} for Sam` }));
      expect((await screen.findByRole('alert')).textContent).toMatch(/already finished/);
      expect(sam.getByRole('button', { name: `Skip ${title(writing)} for Sam` })).toBeTruthy();
    });

    it('says how many more lessons are still being written', async () => {
      const gateway = parentGateway();
      render(<FamilyApp page="review" gateway={gateway} />);
      await progressOf('Sam');
      expect(screen.getByText(/still being written/)).toBeTruthy();
    });
  });
});

describe('Review after a lesson’s prompts change', () => {
  it('shows each written question as the kid saw it, including one the lesson has since replaced', async () => {
    const gateway = new FakeFamilyGateway();
    gateway.user = { userId: parentId };
    gateway.account = { userId: parentId, displayName: 'Mom', setup: 'separate', linkCode: 'HJKLMNPQ', parents: [], learners: [{ id: kidId, displayName: 'Sam' }], profiles: [], parentPin: false };
    gateway.queue = [{
      ...waitingUruk(),
      answers: { 'prompt.uruk.retired': 'Seals showed who closed the jar.' },
      questions: [
        { promptId: 'prompt.uruk.retired', kind: 'concise-explanation', question: 'What could a seal tell a scribe?', required: true, explanation: 'Seal impressions name an office or person.' },
        { promptId: 'prompt.uruk.optional', kind: 'concise-explanation', question: 'Anything else you noticed?', required: false },
      ],
    }];
    render(<FamilyApp page="review" gateway={gateway} />);
    const card = await screen.findByRole('article', { name: 'Uruk: Life in an Early City' });
    const items = card.querySelectorAll('.review-answers > li');
    expect(items).toHaveLength(2);
    expect(within(items[0] as HTMLElement).getByText('What could a seal tell a scribe?')).toBeTruthy();
    expect(within(items[0] as HTMLElement).getByText('Seals showed who closed the jar.')).toBeTruthy();
    expect(within(items[0] as HTMLElement).getByText(/since changed in the lesson.*as Sam saw it/)).toBeTruthy();
    expect(within(items[1] as HTMLElement).getByText('No answer')).toBeTruthy();
    // The lesson's current written prompt wasn't in this submission, so it isn't listed.
    expect(within(card).queryByText(/Name one opportunity/)).toBeNull();
  });
});
