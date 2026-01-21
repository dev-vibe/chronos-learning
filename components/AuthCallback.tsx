/**
 * Auth Callback Component
 * Handles OAuth redirects from Google/Apple
 *
 * Note: This app doesn't use react-router, so OAuth callbacks are handled
 * automatically by Supabase in the AuthContext. This component is provided
 * for reference if you want to add custom OAuth callback handling.
 */

import React, { useEffect } from 'react';
import { Loader, Shield } from 'lucide-react';

export const AuthCallback: React.FC = () => {
  useEffect(() => {
    // The Supabase client will automatically handle the OAuth callback
    // and set the session. After a brief delay, reload to home.
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-[#0c0c0e] max-w-md w-full rounded-2xl border border-stone-800 shadow-2xl p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-lg flex items-center justify-center">
            <Shield size={32} />
          </div>

          <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">
            Authentication Complete
          </h2>

          <div className="flex items-center gap-2 text-stone-400">
            <Loader size={18} className="animate-spin" />
            <span className="font-mono text-sm">Processing credentials...</span>
          </div>

          <p className="text-xs text-stone-600 text-center mt-2">
            Redirecting to Chronos Terminal...
          </p>
        </div>
      </div>
    </div>
  );
};
