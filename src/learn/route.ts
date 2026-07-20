import { safeDecodePathSegment } from '../app/safeDecode';

export const lessonIdFromPath = (pathname: string) => {
  const match = pathname.match(/^\/learn\/([^/]+)\/?$/);
  return match ? safeDecodePathSegment(match[1]) ?? null : null;
};
