/**
 * Auth Context
 * Provides authentication state and methods throughout the app
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  isGuest: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
  updateUserName: (name: string) => Promise<{ error: AuthError | null }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const GUEST_SESSION_KEY = 'chronos.guestSession.v1';

const getStoredGuestSession = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(GUEST_SESSION_KEY) === 'true';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConfigured] = useState<boolean>(isSupabaseConfigured());
  const [isGuest, setIsGuest] = useState<boolean>(false);

  useEffect(() => {
    // Only set up auth if Supabase is configured
    if (!isConfigured) {
      console.log('[Auth] Supabase not configured, skipping auth setup');
      setIsGuest(getStoredGuestSession());
      setLoading(false);
      return;
    }

    console.log('[Auth] Setting up auth...');

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[Auth] Initial session:', session?.user?.id || 'none');
      setSession(session);
      setUser(session?.user ?? null);
      setIsGuest(session?.user ? false : getStoredGuestSession());
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Auth] Auth state change:', event, session?.user?.id || 'none');
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        window.localStorage.removeItem(GUEST_SESSION_KEY);
        setIsGuest(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isConfigured]);

  // Sign up with email/password
  const signUp = async (email: string, password: string, name?: string) => {
    if (!isConfigured) {
      return { error: new Error('Supabase not configured') as AuthError };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Redirect to app after email confirmation
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          // Save name to user_metadata
          full_name: name || '',
          name: name || '',
        },
      },
    });

    return { error };
  };

  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    if (!isConfigured) {
      return { error: new Error('Supabase not configured') as AuthError };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    if (!isConfigured) {
      return { error: new Error('Supabase not configured') as AuthError };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    return { error };
  };

  // Sign out
  const signOut = async () => {
    if (isConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setIsGuest(false);
    window.localStorage.removeItem(GUEST_SESSION_KEY);
  };

  // Continue as guest (no authentication)
  const continueAsGuest = () => {
    setIsGuest(true);
    setLoading(false);
    window.localStorage.setItem(GUEST_SESSION_KEY, 'true');
    // User and session remain null, indicating guest mode
  };

  // Update user name
  const updateUserName = async (name: string): Promise<{ error: AuthError | null }> => {
    if (!isConfigured || !user) {
      return { error: new Error('Not authenticated') as AuthError };
    }

    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: name.trim(),
        name: name.trim(),
      },
    });

    if (!error && data.user) {
      // Update local user state
      setUser(data.user);
    }

    return { error };
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    if (!isConfigured) return;

    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser) {
      setUser(currentUser);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    isConfigured,
    isGuest,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    continueAsGuest,
    updateUserName,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
