import React from 'react';
import { Compass, Home, Library, Moon, Search, Sun, UserRound, Users } from 'lucide-react';
import './global-navigation.css';
import { hasParentArea } from '../infrastructure/family/activeLearner';
import { ProfileSwitcher, useActiveLearner } from './ProfileSwitcher';

export type GlobalDestination = 'home' | 'library' | 'search' | 'learners' | 'account';

type GlobalNavigationProps = {
  active?: GlobalDestination;
  theme: 'light' | 'dark';
  onTheme(): void;
  onWorldHistory?(event: React.MouseEvent<HTMLButtonElement>): void;
  worldHistoryOpen?: boolean;
  auditMode?: boolean;
};

const destinations = [
  { id: 'home' as const, label: 'Home', href: '/home', icon: Home },
  { id: 'library' as const, label: 'Library', href: '/library', icon: Library },
  { id: 'search' as const, label: 'Search', href: '/search', icon: Search },
  { id: 'learners' as const, label: 'Learners', href: '/review', icon: Users },
  { id: 'account' as const, label: 'Account', href: '/account', icon: UserRound },
];

export function GlobalNavigation({
  active,
  theme,
  onTheme,
  onWorldHistory,
  worldHistoryOpen = false,
  auditMode = false,
}: GlobalNavigationProps) {
  // On a shared account, the profile switcher takes the Account slot and is
  // pinned near the top of the rail so it is always easy to find.
  const learner = useActiveLearner();
  const shared = learner && learner.profiles.length > 0 ? learner : null;
  // Learners (who they are, their progress and review) is a first-class
  // destination for any parent or tutor with linked learners, and for parent view
  // on a shared sign-in.
  const links = destinations.filter(({ id }) => (id === 'learners' ? hasParentArea(learner) : !shared || id !== 'account')).map(({ id, label, href, icon: Icon }) => (
    <a
      key={id}
      href={href}
      className={active === id ? 'active' : ''}
      aria-current={active === id ? 'page' : undefined}
    >
      <Icon />
      <span>{label}</span>
    </a>
  ));
  const worldHistory = onWorldHistory ? <button
    className={`world-history-nav ${worldHistoryOpen ? 'active' : ''}`}
    onClick={onWorldHistory}
    aria-haspopup="dialog"
    aria-expanded={worldHistoryOpen}
  >
    <Compass />
    <span>World History</span>
  </button> : null;

  return <>
    <aside className="global-rail" aria-label="Chronos navigation">
      <a className="app-brand" href="/home" aria-label="Chronos Home">
        <span aria-hidden="true">C</span>
        <strong>Chronos</strong>
      </a>
      {shared && <ProfileSwitcher active={shared} variant="rail" />}
      <nav>{links[0]}{worldHistory}{links.slice(1)}</nav>
      {auditMode ? <a className="audit-nav" href="/audit">Audit on</a> : null}
      <button
        className="theme-button"
        onClick={onTheme}
        aria-label={`Use ${theme === 'light' ? 'dark' : 'light'} theme`}
      >
        {theme === 'light' ? <Moon /> : <Sun />}
      </button>
    </aside>
    <nav className={`mobile-nav${auditMode ? ' with-audit' : ''}`} aria-label="Chronos navigation">{links[0]}{worldHistory}{links.slice(1)}{shared && <ProfileSwitcher active={shared} variant="tab" />}{auditMode ? <a className="audit-nav" href="/audit">Audit on</a> : null}</nav>
  </>;
}
