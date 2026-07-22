import { useCallback, useEffect, useState } from 'react';
import { nextTheme, readThemePreference, writeThemePreference, type ChronosTheme, THEME_STORAGE_KEY } from './preference';

export function useChronosTheme() {
  const [theme, setThemeState] = useState<ChronosTheme>(readThemePreference);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      setThemeState(readThemePreference());
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const setTheme = useCallback((next: ChronosTheme) => {
    writeThemePreference(next);
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next = nextTheme(current);
      writeThemePreference(next);
      return next;
    });
  }, []);

  return { theme, setTheme, toggleTheme };
}
