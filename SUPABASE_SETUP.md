# Supabase Setup Guide for Chronos Learning Terminal

This guide walks you through setting up Supabase authentication and database for the Chronos Learning Terminal.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Create Supabase Project](#create-supabase-project)
3. [Run Database Schema](#run-database-schema)
4. [Configure Environment Variables](#configure-environment-variables)
5. [Configure OAuth Providers](#configure-oauth-providers)
6. [Test the Integration](#test-the-integration)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Node.js and npm installed
- A GitHub, Google, or email account for Supabase signup
- (Optional) Google Cloud Console account for Google OAuth
- (Optional) Apple Developer account for Apple OAuth

---

## Create Supabase Project

1. **Sign up for Supabase**
   - Go to [https://supabase.com](https://supabase.com)
   - Click "Start your project"
   - Sign up with GitHub, Google, or email

2. **Create a new project**
   - Click "New Project"
   - Choose your organization (or create a new one)
   - Fill in project details:
     - **Name**: `chronos-learning` (or your preferred name)
     - **Database Password**: Generate a strong password (save this!)
     - **Region**: Choose closest to your users
     - **Pricing Plan**: Free tier is sufficient for development

3. **Wait for project setup**
   - This takes 1-2 minutes
   - Once ready, you'll see the project dashboard

4. **Get your API credentials**
   - Go to **Settings** → **API**
   - Copy these values:
     - **Project URL**: `https://your-project-id.supabase.co`
     - **anon public key**: `eyJhbGc...` (long string)

---

## Run Database Schema

1. **Open SQL Editor**
   - In your Supabase project dashboard
   - Click **SQL Editor** in the left sidebar

2. **Run the schema**
   - Click "+ New query"
   - Copy and paste the following SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_sync_at TIMESTAMPTZ,
  preferences JSONB DEFAULT '{}'::JSONB
);

-- User progress table (XP and level)
CREATE TABLE public.user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Artifacts table
CREATE TABLE public.user_artifacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  artifact_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, artifact_id)
);

-- Completed nodes table
CREATE TABLE public.completed_nodes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  node_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  quiz_score INTEGER,
  quiz_attempts INTEGER DEFAULT 1,
  UNIQUE(user_id, node_id)
);

-- Indexes
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_artifacts_user_id ON public.user_artifacts(user_id);
CREATE INDEX idx_completed_nodes_user_id ON public.completed_nodes(user_id);

-- Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_nodes ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own data)
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own artifacts" ON public.user_artifacts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own artifacts" ON public.user_artifacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own completed nodes" ON public.completed_nodes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own completed nodes" ON public.completed_nodes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, created_at, updated_at)
  VALUES (NEW.id, NOW(), NOW());

  INSERT INTO public.user_progress (user_id, xp, level, created_at, updated_at)
  VALUES (NEW.id, 0, 1, NOW(), NOW());

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
```

3. **Execute the query**
   - Click "Run" or press `Ctrl+Enter`
   - You should see "Success. No rows returned"

4. **Verify tables were created**
   - Click **Database** → **Tables** in the left sidebar
   - You should see:
     - `user_profiles`
     - `user_progress`
     - `user_artifacts`
     - `completed_nodes`

---

## Configure Environment Variables

1. **Update `.env.local`**
   - Open `.env.local` in your project root
   - Replace placeholder values with your actual credentials:

```env
# Gemini API for content generation
VITE_GEMINI_API_KEY=your-actual-gemini-key

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. **Restart your dev server**
   ```bash
   npm run dev
   ```

---

## Configure OAuth Providers

### Configure Site URL (Important!)

1. Go to **Authentication** → **URL Configuration** in Supabase dashboard
2. Set **Site URL** to your application URL:
   - Development: `http://localhost:3000` or `http://localhost:5173`
   - Production: `https://your-production-domain.com`
3. Add **Redirect URLs** (one per line):
   ```
   http://localhost:3000/**
   http://localhost:5173/**
   https://your-production-domain.com/**
   ```
4. Click **Save**

### Enable Email/Password Authentication

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. **Email** should be enabled by default
3. Configure email settings:
   - **Enable email confirmations**: On (recommended)
   - **Secure email change**: On (recommended)

### Enable Google OAuth (Optional)

1. **Create OAuth credentials in Google Cloud Console**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing one
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Choose **Web application**
   - Add authorized redirect URIs:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
   - Add authorized JavaScript origins:
     ```
     http://localhost:3000
     http://localhost:5173
     https://your-production-domain.com
     ```
   - Copy **Client ID** and **Client Secret**

2. **Configure in Supabase**
   - Go to **Authentication** → **Providers**
   - Enable **Google**
   - Paste **Client ID** and **Client Secret**
   - Save

**Note**: The app uses Supabase's automatic OAuth callback handling. The `AuthCallback` component is optional and provided for reference only. Supabase will automatically detect the OAuth redirect and set the session.

### Enable Apple OAuth (Optional)

1. **Create Service ID in Apple Developer**
   - Go to [Apple Developer Console](https://developer.apple.com/account/)
   - Go to **Certificates, Identifiers & Profiles**
   - Create a **Services ID**
   - Enable **Sign in with Apple**
   - Add redirect URL:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```

2. **Generate Key**
   - Create a new **Key** for Sign in with Apple
   - Download the `.p8` key file

3. **Configure in Supabase**
   - Go to **Authentication** → **Providers**
   - Enable **Apple**
   - Paste **Service ID**, **Team ID**, **Key ID**, and key contents
   - Save

---

## Test the Integration

### Test Email Signup

1. Start your dev server: `npm run dev`
2. Open the app in your browser
3. You should see the Auth Screen
4. Click "Sign Up"
5. Enter email and password
6. Check your email for confirmation link
7. Click confirmation link
8. You should be logged in and see the timeline

### Test Google OAuth

1. On the Auth Screen, click "Google"
2. You'll be redirected to Google login
3. Authorize the app
4. You should be redirected back and logged in

### Test Guest Mode

1. On the Auth Screen, click "Continue as Guest"
2. You should see the timeline
3. Progress will be stored locally only (no cloud sync)

### Test Progress Sync

1. Log in with email or OAuth
2. Complete a quiz to earn XP
3. Open the User Profile modal (top right)
4. You should see "Synced" badge
5. Log out and log back in on a different browser/device
6. Your progress should be synced

### Test Offline Mode

1. Log in
2. Complete a quiz
3. Disconnect from internet (airplane mode or disable network)
4. Complete another quiz
5. You should see "Offline Mode" banner
6. Reconnect to internet
7. The offline actions should automatically sync

### Test Migration

1. Use the app as guest and complete some quizzes
2. Log out or refresh the page
3. Sign up for a new account
4. You should see the Migration Dialog
5. Click "Import to Cloud"
6. Your local progress should be uploaded to your account

---

## Troubleshooting

### "Supabase not configured" warning

**Problem**: You see a warning about Supabase not being configured.

**Solution**:
- Check that `.env.local` has correct values
- Restart dev server after updating `.env.local`
- Verify environment variable names start with `VITE_`

### Email confirmations not working

**Problem**: Confirmation emails aren't being sent.

**Solution**:
- Check Supabase email settings: **Authentication** → **Settings** → **Email Templates**
- For development, you can disable email confirmation:
  - Go to **Authentication** → **Settings**
  - Disable "Enable email confirmations"
- Check your spam folder

### OAuth redirect errors

**Problem**: OAuth login fails with redirect error.

**Solution**:
- Verify redirect URLs match exactly in OAuth provider and Supabase
- Check that OAuth provider is enabled in Supabase
- Clear browser cookies and try again

### RLS policy errors

**Problem**: Database queries fail with permission errors.

**Solution**:
- Verify Row Level Security (RLS) policies were created
- Check that `auth.uid()` matches `user_id` in queries
- Test RLS in SQL Editor: **SQL Editor** → **RLS Helper**

### Tables not created

**Problem**: Tables don't appear after running schema.

**Solution**:
- Check for SQL errors in the SQL Editor output
- Run schema in a new query (not in existing query with other SQL)
- Verify `uuid-ossp` extension is enabled

### Migration dialog not showing

**Problem**: Migration dialog doesn't appear after signing up with existing local data.

**Solution**:
- Check browser console for errors
- Verify local storage has data: Open DevTools → Application → Local Storage
- Look for key `chronos_agent_profile_v1`

### Sync queue not processing

**Problem**: Offline actions stay queued even when online.

**Solution**:
- Check browser console for sync errors
- Verify you're logged in (not guest mode)
- Check internet connection
- Manually refresh the page to trigger sync

---

## Free Tier Limits

Supabase free tier includes:

- **Database**: 500 MB storage
- **Auth**: 50,000 monthly active users
- **API Requests**: Unlimited
- **Bandwidth**: 2 GB egress per month
- **File Storage**: 1 GB

These limits are more than sufficient for a family homeschool app. For larger deployments, consider upgrading to Pro ($25/month).

---

## Security Notes

- The `anon` key is safe to expose in client-side code
- Row Level Security (RLS) ensures users can only access their own data
- Never commit `.env.local` to version control
- Use environment variables for all sensitive credentials
- OAuth redirects are validated by Supabase

---

## Next Steps

- Configure custom email templates: **Authentication** → **Email Templates**
- Set up Supabase Realtime for instant sync (optional)
- Add username/display name fields to signup flow
- Create admin dashboard to view user stats
- Set up Supabase Storage for avatar images (optional)

---

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **GitHub Issues**: https://github.com/anthropics/chronos-learning/issues

---

## Deployment

For production deployment:

1. Update redirect URLs in OAuth providers to production domain
2. Set environment variables in hosting platform (Vercel, Netlify, etc.)
3. Enable email confirmations in Supabase
4. Configure custom SMTP for emails (optional)
5. Set up monitoring and alerts in Supabase dashboard
