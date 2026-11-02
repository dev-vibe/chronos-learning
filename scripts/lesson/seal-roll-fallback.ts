import type { Plugin } from 'vite';

const route = '/learn/lesson.mesopotamia.akkadian-empire';
const entry = '/akkad.html';

/** The app is client rendered. Give this lesson a real HTML photo when JS is off. */
export function sealRollFallback(): Plugin {
  return {
    name: 'seal-roll-fallback',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        const pathname = request.url?.split('?')[0].replace(/\/$/, '');
        if (pathname === route) request.url = entry;
        next();
      });
    },
  };
}
