// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import type { ActiveLearner } from '../../src/infrastructure/family/activeLearner';
import { hasParentArea } from '../../src/infrastructure/family/activeLearner';

let active: ActiveLearner | null = null;
vi.mock('../../src/app/ProfileSwitcher', () => ({
  useActiveLearner: () => active,
  ProfileSwitcher: () => null,
}));

const { GlobalNavigation } = await import('../../src/app/GlobalNavigation');

const kids = [{ id: 'kid-sam', displayName: 'Sam' }];
const river = [{ id: 'river', displayName: 'River' }];
const self = (linkedLearners: typeof river): ActiveLearner => ({ userId: 'p', learnerId: 'p', view: 'self', profiles: [], linkedLearners });
const shared = (view: 'kid' | 'parent', linkedLearners = river): ActiveLearner => ({ userId: 'p', learnerId: view === 'kid' ? 'kid-sam' : 'p', view, profiles: kids, linkedLearners });

afterEach(() => { cleanup(); active = null; });

describe('the parent area in navigation', () => {
  it('belongs to a parent with linked kids, and to parent view on a shared sign-in, but never to a kid', () => {
    expect(hasParentArea(null)).toBe(false);
    expect(hasParentArea(self([]))).toBe(false);
    expect(hasParentArea(self(river))).toBe(true);
    expect(hasParentArea(shared('parent', []))).toBe(true);
    expect(hasParentArea(shared('kid'))).toBe(false);
  });

  it('shows Family beside Account once a kid is linked, and links it to the Family page', () => {
    active = self(river);
    render(<GlobalNavigation active="family" theme="light" onTheme={() => undefined} />);
    const family = screen.getAllByRole('link', { name: 'Family' })[0];
    expect(family.getAttribute('href')).toBe('/review');
    expect(family.getAttribute('aria-current')).toBe('page');
    expect(screen.getAllByRole('link', { name: 'Account' })[0].getAttribute('href')).toBe('/account');
  });

  it('keeps Family out of the navigation with no linked kids or while a kid is using a shared sign-in', () => {
    active = self([]);
    const { unmount } = render(<GlobalNavigation theme="light" onTheme={() => undefined} />);
    expect(screen.queryByRole('link', { name: 'Family' })).toBeNull();
    unmount();
    active = shared('kid');
    render(<GlobalNavigation theme="light" onTheme={() => undefined} />);
    expect(screen.queryByRole('link', { name: 'Family' })).toBeNull();
  });

  it('shows Family in parent view on a shared sign-in', () => {
    active = shared('parent', []);
    render(<GlobalNavigation theme="light" onTheme={() => undefined} />);
    expect(screen.getAllByRole('link', { name: 'Family' }).length).toBeGreaterThan(0);
  });
});
