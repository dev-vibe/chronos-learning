export const lessonIdFromPath = (pathname: string) => {
  const match = pathname.match(/^\/learn\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
};
