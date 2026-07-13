import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { UserProfileProvider } from './contexts/UserProfileContext';
import { LearnApp } from './src/learn/LearnApp';
import { lessonIdFromPath } from './src/learn/route';

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
const learnLessonId = lessonIdFromPath(window.location.pathname);
root.render(
  <React.StrictMode>
    {learnLessonId ? <LearnApp lessonId={learnLessonId} /> : <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserProfileProvider>
          <App />
        </UserProfileProvider>
      </AuthProvider>
    </QueryClientProvider>}
  </React.StrictMode>
);
