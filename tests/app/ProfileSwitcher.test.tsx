// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileSwitcher } from '../../src/app/ProfileSwitcher';
import { chooseActiveLearner, loadActiveLearner, rememberKid, switchToKid, type ActiveLearner } from '../../src/infrastructure/family/activeLearner';
import type { FamilyGateway } from '../../src/infrastructure/family/gateway';

const parentId = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';
const kids = [{ id: 'kid-sam', displayName: 'Sam' }, { id: 'kid-alex', displayName: 'Alex' }];
const pinGateway = (pin: string | null) => ({
  parentPinEnabled: vi.fn(async () => pin !== null),
  verifyParentPin: vi.fn(async (value: string) => pin === null || value === pin),
  signOut: vi.fn(async () => undefined),
}) as unknown as FamilyGateway;
const originalLocation = window.location;
let location: { pathname: string; search: string; assign: ReturnType<typeof vi.fn>; reload: ReturnType<typeof vi.fn> };

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  location = { pathname: '/learn/lesson.uruk.first-city', search: '', assign: vi.fn(), reload: vi.fn() };
  Object.defineProperty(window, 'location', { configurable: true, value: location });
});
afterEach(() => { cleanup(); Object.defineProperty(window, 'location', { configurable: true, value: originalLocation }); });

describe('choosing who is using Chronos', () => {
  it('acts as the sign-in itself when there are no kid profiles', () => {
    expect(chooseActiveLearner(parentId, [], null, true)).toMatchObject({ learnerId: parentId, view: 'self' });
  });
  it('defaults a shared account to the last kid used, or the first kid', () => {
    expect(chooseActiveLearner(parentId, kids, null, false)).toMatchObject({ learnerId: 'kid-sam', view: 'kid' });
    expect(chooseActiveLearner(parentId, kids, 'kid-alex', false)).toMatchObject({ learnerId: 'kid-alex', view: 'kid' });
    expect(chooseActiveLearner(parentId, kids, 'removed-kid', false)).toMatchObject({ learnerId: 'kid-sam', view: 'kid' });
  });
  it('uses parent view only while this tab has chosen it', () => {
    expect(chooseActiveLearner(parentId, kids, 'kid-alex', true)).toMatchObject({ learnerId: parentId, view: 'parent' });
  });
  it('loads profiles for the signed-in account and remembers the chosen kid', async () => {
    const query: any = { select: () => query, eq: () => query, neq: () => query, order: async () => ({ data: [{ id: 'kid-sam', display_name: 'Sam' }, { id: 'kid-alex', display_name: 'Alex' }], error: null }) };
    const client: any = { auth: { getUser: async () => ({ data: { user: { id: parentId } } }) }, from: () => query };
    rememberKid('kid-alex');
    expect(await loadActiveLearner(client)).toMatchObject({ learnerId: 'kid-alex', view: 'kid', profiles: kids });
    sessionStorage.setItem('chronos.family.parentView', '1');
    expect(await loadActiveLearner(client)).toMatchObject({ learnerId: parentId, view: 'parent' });
  });
  it('switching kids leaves parent view and sends parent-only pages home', () => {
    sessionStorage.setItem('chronos.family.parentView', '1');
    switchToKid('kid-alex', location as unknown as Location);
    expect(sessionStorage.getItem('chronos.family.parentView')).toBeNull();
    expect(localStorage.getItem('chronos.family.activeKid')).toBe('kid-alex');
    expect(location.reload).toHaveBeenCalled();
    location.pathname = '/review';
    switchToKid('kid-sam', location as unknown as Location);
    expect(location.assign).toHaveBeenCalledWith('/home');
  });
});

describe('profile switcher', () => {
  const kidView: ActiveLearner = { userId: parentId, learnerId: 'kid-sam', view: 'kid', profiles: kids };
  const renderIn = (ui: React.ReactElement) => render(<div className="discovery-app">{ui}</div>);

  it('names who is using Chronos and switches kids in one tap', async () => {
    renderIn(<ProfileSwitcher active={kidView} variant="rail" gateway={pinGateway(null)} />);
    const trigger = screen.getByRole('button', { name: 'Using Chronos as Sam. Switch profile' });
    expect(trigger.textContent).toContain('Switch');
    await userEvent.click(trigger);
    const panel = screen.getByRole('dialog', { name: 'Switch profile' });
    expect(within(panel).getByRole('button', { name: /Sam/ }).getAttribute('aria-current')).toBe('true');
    expect(within(panel).getByRole('link', { name: /Account settings/ }).getAttribute('href')).toBe('/account');
    await userEvent.click(within(panel).getByRole('button', { name: /Alex/ }));
    expect(localStorage.getItem('chronos.family.activeKid')).toBe('kid-alex');
    expect(location.reload).toHaveBeenCalled();
  });

  it('opens parent view straight away when no PIN is set', async () => {
    renderIn(<ProfileSwitcher active={kidView} variant="tab" gateway={pinGateway(null)} />);
    await userEvent.click(screen.getByRole('button', { name: /Switch profile/ }));
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /Parent view/ }));
    await waitFor(() => expect(location.assign).toHaveBeenCalledWith('/review'));
    expect(sessionStorage.getItem('chronos.family.parentView')).toBe('1');
  });

  it('asks for the PIN when the parent turned it on', async () => {
    const gateway = pinGateway('2468');
    renderIn(<ProfileSwitcher active={kidView} variant="rail" gateway={gateway} />);
    await userEvent.click(screen.getByRole('button', { name: /Switch profile/ }));
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /Parent view/ }));
    await userEvent.type(await screen.findByLabelText(/Parent PIN/), '1357');
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect((await screen.findByRole('alert')).textContent).toContain('didn’t match');
    expect(location.assign).not.toHaveBeenCalled();
    await userEvent.type(screen.getByLabelText(/Parent PIN/), '2468');
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() => expect(location.assign).toHaveBeenCalledWith('/review'));
  });

  it('marks parent view clearly and closes on Escape', async () => {
    renderIn(<ProfileSwitcher active={{ ...kidView, learnerId: parentId, view: 'parent' }} variant="rail" gateway={pinGateway(null)} />);
    const trigger = screen.getByRole('button', { name: 'Parent view. Switch profile' });
    await userEvent.click(trigger);
    expect(screen.getByRole('dialog')).toBeTruthy();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});
