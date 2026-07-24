import React from 'react';
import { Home, Library, Moon, Search, Sun } from 'lucide-react';
import './global-navigation.css';

export type GlobalDestination = 'home' | 'library' | 'search';

type GlobalNavigationProps = {
  active?: GlobalDestination;
  theme: 'light' | 'dark';
  onTheme(): void;
};

const destinations = [
  { id: 'home' as const, label: 'Home', href: '/home', icon: Home },
  { id: 'library' as const, label: 'Library', href: '/library', icon: Library },
  { id: 'search' as const, label: 'Search', href: '/search', icon: Search },
];

export function GlobalNavigation({ active, theme, onTheme }: GlobalNavigationProps) {
  const links = destinations.map(({ id, label, href, icon: Icon }) => (
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

  return <>
    <aside className="global-rail" aria-label="Chronos navigation">
      <a className="app-brand" href="/home" aria-label="Chronos Home">
        <span aria-hidden="true">C</span>
        <strong>Chronos</strong>
      </a>
      <nav>{links}</nav>
      <button
        className="theme-button"
        onClick={onTheme}
        aria-label={`Use ${theme === 'light' ? 'dark' : 'light'} theme`}
      >
        {theme === 'light' ? <Moon /> : <Sun />}
      </button>
    </aside>
    <nav className="mobile-nav" aria-label="Chronos navigation">{links}</nav>
  </>;
}
