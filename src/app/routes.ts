import { safeDecodePathSegment } from './safeDecode';

export type ChronosRoute =
  | { name: 'home' }
  | { name: 'library' }
  | { name: 'journey'; journeyId: string }
  | { name: 'search'; query: string }
  | { name: 'learn'; lessonId: string }
  | { name: 'educators'; lessonId?: string }
  | { name: 'audit' }
  | { name: 'legacy' }
  | { name: 'not-found' };

export function parseChronosRoute(pathname: string, search = ''): ChronosRoute {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/' || clean === '/home') return { name: 'home' };
  if (clean === '/educators') return { name: 'educators' };
  const companion = clean.match(/^\/educators\/([^/]+)$/);
  if (companion) { const lessonId = safeDecodePathSegment(companion[1]); return lessonId === undefined ? { name: 'not-found' } : { name: 'educators', lessonId }; }
  if (clean === '/library') return { name: 'library' };
  if (clean === '/audit' || clean === '/admin') return { name: 'audit' };
  const journey = clean.match(/^\/library\/([^/]+)$/);
  if (journey) { const journeyId = safeDecodePathSegment(journey[1]); return journeyId === undefined ? { name: 'not-found' } : { name: 'journey', journeyId }; }
  if (clean === '/search') return { name: 'search', query: new URLSearchParams(search).get('q') ?? '' };
  const lesson = clean.match(/^\/learn\/([^/]+)$/);
  if (lesson) { const lessonId = safeDecodePathSegment(lesson[1]); return lessonId === undefined ? { name: 'not-found' } : { name: 'learn', lessonId }; }
  if (clean === '/legacy') return { name: 'legacy' };
  return { name: 'not-found' };
}
