import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { UserProfileProvider } from './contexts/UserProfileContext';
import { LearnApp } from './src/learn/LearnApp';
import { DiscoveryApp } from './src/app/ChronosApp';
import { parseChronosRoute } from './src/app/routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
const route = parseChronosRoute(window.location.pathname, window.location.search);
document.body.classList.toggle('learn-route', route.name === 'learn');
document.body.classList.toggle('discovery-route', !['learn', 'legacy'].includes(route.name));
let application: React.ReactNode;
if (route.name === 'learn') {
  application = <LearnApp lessonId={route.lessonId} />;
} else if (route.name === 'legacy') {
  application = <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <UserProfileProvider>
        <App />
      </UserProfileProvider>
    </AuthProvider>
  </QueryClientProvider>;
} else {
  application = <DiscoveryApp route={route} />;
}

root.render(
  <React.StrictMode>
    {application}
  </React.StrictMode>
);
