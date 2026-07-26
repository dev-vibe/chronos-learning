export type ChronosTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'chronos.theme.v1';

function systemTheme(): ChronosTheme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function readThemePreference(): ChronosTheme {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    // Private mode / blocked storage should fall back to system preference.
  }
  return systemTheme();
}

export function writeThemePreference(theme: ChronosTheme): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Preference still applies for the current session even if storage fails.
  }
}

export function nextTheme(theme: ChronosTheme): ChronosTheme {
  return theme === 'light' ? 'dark' : 'light';
}
