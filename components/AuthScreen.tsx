/**
 * Auth Screen Component
 * Login/signup interface with tactical terminal aesthetic
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Mail, Lock, Chrome, Apple, User, AlertCircle, Loader } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { signUp, signIn, signInWithGoogle, signInWithApple, continueAsGuest, isConfigured } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const { error: authError } = mode === 'signup'
        ? await signUp(email, password, name)
        : await signIn(email, password);

      if (authError) {
        setError(authError.message);
      } else if (mode === 'signup') {
        setSuccessMessage('Check your email to confirm your account!');
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error: authError } = await signInWithGoogle();
      if (authError) {
        setError(authError.message);
        setLoading(false);
      }
      // If successful, user will be redirected to Google OAuth
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleAppleAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error: authError } = await signInWithApple();
      if (authError) {
        setError(authError.message);
        setLoading(false);
      }
      // If successful, user will be redirected to Apple OAuth
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    continueAsGuest();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Grid background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(245, 158, 11, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 158, 11, 0.2) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Main auth card */}
      <div className="bg-[#0c0c0e] w-full max-w-md rounded-2xl border border-stone-800 shadow-2xl overflow-hidden relative z-10">

        {/* Header */}
        <div className="p-6 border-b border-stone-800 bg-stone-950">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-lg flex items-center justify-center">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white uppercase tracking-wider">Chronos Terminal</h1>
              <p className="text-[10px] font-mono text-stone-500 uppercase">Access Control System</p>
            </div>
          </div>
          <p className="text-sm text-stone-400 mt-3">
            Authenticate to sync your progress across devices or continue as guest for offline-only mode.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Error message */}
          {error && (
            <div className="bg-red-950/30 border border-red-500/50 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Success message */}
          {successMessage && (
            <div className="bg-emerald-950/30 border border-emerald-500/50 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-300">{successMessage}</p>
            </div>
          )}

          {/* Supabase not configured warning */}
          {!isConfigured && (
            <div className="bg-amber-950/30 border border-amber-500/50 rounded-lg p-3">
              <p className="text-sm text-amber-300">
                Cloud sync is not configured. You can continue as guest to use the app with local storage only.
              </p>
            </div>
          )}

          {/* Email/Password Form */}
          {isConfigured && (
            <>
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-mono text-stone-400 uppercase mb-2">Agent Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-stone-900/50 border border-stone-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                        placeholder="Enter your name"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono text-stone-400 uppercase mb-2">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-stone-900/50 border border-stone-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="agent@chronos.net"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-400 uppercase mb-2">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-stone-900/50 border border-stone-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="••••••••"
                      required
                      disabled={loading}
                      minLength={6}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-display font-bold uppercase tracking-wider py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</span>
                  )}
                </button>
              </form>

              {/* Toggle mode */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin');
                    setError(null);
                    setSuccessMessage(null);
                    setName('');
                  }}
                  className="text-sm text-stone-400 hover:text-amber-400 transition-colors"
                  disabled={loading}
                >
                  {mode === 'signin'
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
                </button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-800"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#0c0c0e] px-2 text-stone-500 font-mono uppercase">Or continue with</span>
                </div>
              </div>

              {/* OAuth Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="bg-stone-900/50 hover:bg-stone-800 border border-stone-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Chrome size={18} />
                  <span className="font-medium">Google</span>
                </button>

                <button
                  onClick={handleAppleAuth}
                  disabled={loading}
                  className="bg-stone-900/50 hover:bg-stone-800 border border-stone-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Apple size={18} />
                  <span className="font-medium">Apple</span>
                </button>
              </div>
            </>
          )}

          {/* Guest Mode Button */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0c0c0e] px-2 text-stone-500 font-mono uppercase">Or</span>
            </div>
          </div>

          <button
            onClick={handleGuestMode}
            className="w-full bg-stone-900/50 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <User size={18} />
            <span className="font-medium">Continue as Guest</span>
          </button>

          {/* Footer note */}
          <p className="text-xs text-stone-600 text-center">
            Guest mode stores progress locally only. Sign in to sync across devices.
          </p>
        </div>
      </div>
    </div>
  );
};
