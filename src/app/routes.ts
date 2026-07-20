import { safeDecodePathSegment } from './safeDecode';

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
  if (journey) { const journeyId = safeDecodePathSegment(journey[1]); return journeyId === undefined ? { name: 'not-found' } : { name: 'journey', journeyId }; }
  if (clean === '/search') return { name: 'search', query: new URLSearchParams(search).get('q') ?? '' };
  const lesson = clean.match(/^\/learn\/([^/]+)$/);
  if (lesson) { const lessonId = safeDecodePathSegment(lesson[1]); return lessonId === undefined ? { name: 'not-found' } : { name: 'learn', lessonId }; }
  if (clean === '/legacy') return { name: 'legacy' };
  return { name: 'not-found' };
}
