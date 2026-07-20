export type ChronosRoute =
  | { name: 'home' }
  | { name: 'library' }
  | { name: 'journey'; journeyId: string }
  | { name: 'search'; query: string }
  | { name: 'learn'; lessonId: string }
  | { name: 'legacy' }
  | { name: 'not-found' };

export function parseChronosRoute(pathname: string, search = ''): ChronosRoute {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/' || clean === '/home') return { name: 'home' };
  if (clean === '/library') return { name: 'library' };
  const journey = clean.match(/^\/library\/([^/]+)$/);
  if (journey) return { name: 'journey', journeyId: decodeURIComponent(journey[1]) };
  if (clean === '/search') return { name: 'search', query: new URLSearchParams(search).get('q') ?? '' };
  const lesson = clean.match(/^\/learn\/([^/]+)$/);
  if (lesson) return { name: 'learn', lessonId: decodeURIComponent(lesson[1]) };
  if (clean === '/legacy') return { name: 'legacy' };
  return { name: 'not-found' };
}
