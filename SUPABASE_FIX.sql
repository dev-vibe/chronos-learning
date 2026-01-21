-- Run this SQL in Supabase SQL Editor if your user profile wasn't created automatically

-- First, find your user ID from the auth.users table
-- Go to Authentication > Users in Supabase dashboard and copy your user ID

-- Then run this SQL, replacing YOUR_USER_ID with your actual ID:

-- Insert profile
INSERT INTO public.user_profiles (id, created_at, updated_at)
VALUES ('YOUR_USER_ID', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert progress
INSERT INTO public.user_progress (user_id, xp, level, created_at, updated_at)
VALUES ('YOUR_USER_ID', 0, 1, NOW(), NOW())
ON CONFLICT (user_id) DO NOTHING;

-- Verify it worked
SELECT * FROM public.user_progress WHERE user_id = 'YOUR_USER_ID';
