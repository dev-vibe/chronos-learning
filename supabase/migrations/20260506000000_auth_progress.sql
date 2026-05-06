create extension if not exists "uuid-ossp";

create table if not exists public.user_profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_sync_at timestamptz,
  preferences jsonb default '{}'::jsonb
);

create table if not exists public.user_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  xp integer not null default 0,
  level integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.completed_nodes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  node_id text not null,
  completed_at timestamptz not null default now(),
  quiz_score integer,
  quiz_attempts integer default 1,
  unique(user_id, node_id)
);

create index if not exists idx_user_progress_user_id on public.user_progress(user_id);
create index if not exists idx_completed_nodes_user_id on public.completed_nodes(user_id);

alter table public.user_profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.completed_nodes enable row level security;

drop policy if exists "Users can view own profile" on public.user_profiles;
create policy "Users can view own profile" on public.user_profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.user_profiles;
create policy "Users can insert own profile" on public.user_profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.user_profiles;
create policy "Users can update own profile" on public.user_profiles
  for update using (auth.uid() = id);

drop policy if exists "Users can view own progress" on public.user_progress;
create policy "Users can view own progress" on public.user_progress
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own progress" on public.user_progress;
create policy "Users can insert own progress" on public.user_progress
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own progress" on public.user_progress;
create policy "Users can update own progress" on public.user_progress
  for update using (auth.uid() = user_id);

drop policy if exists "Users can view own completed nodes" on public.completed_nodes;
create policy "Users can view own completed nodes" on public.completed_nodes
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own completed nodes" on public.completed_nodes;
create policy "Users can insert own completed nodes" on public.completed_nodes
  for insert with check (auth.uid() = user_id);

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_user_profiles_updated_at on public.user_profiles;
create trigger update_user_profiles_updated_at
  before update on public.user_profiles
  for each row
  execute function public.update_updated_at_column();

drop trigger if exists update_user_progress_updated_at on public.user_progress;
create trigger update_user_progress_updated_at
  before update on public.user_progress
  for each row
  execute function public.update_updated_at_column();

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, display_name, created_at, updated_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    now(),
    now()
  )
  on conflict (id) do nothing;

  insert into public.user_progress (user_id, xp, level, created_at, updated_at)
  values (new.id, 0, 1, now(), now())
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
