-- Replace this UUID with the auth.users.id for the account you want to seed.
-- Current hardcoded demo profile:
--   XP: 300
--   Level: 2
--   Completed nodes: younger_dryas_reset, neolithic_revolution, animal_domestication

do $$
declare
  target_user uuid := 'PASTE_USER_UUID_HERE';
begin
  insert into public.user_profiles (id, display_name, created_at, updated_at, last_sync_at)
  values (target_user, 'Chronos Operative', now(), now(), now())
  on conflict (id) do update
    set updated_at = now(),
        last_sync_at = now();

  insert into public.user_progress (user_id, xp, level, updated_at)
  values (target_user, 300, 2, now())
  on conflict (user_id) do update
    set xp = excluded.xp,
        level = excluded.level,
        updated_at = now();

  delete from public.completed_nodes
  where user_id = target_user;

  insert into public.completed_nodes (user_id, node_id, completed_at)
  values
    (target_user, 'younger_dryas_reset', now()),
    (target_user, 'neolithic_revolution', now()),
    (target_user, 'animal_domestication', now())
  on conflict (user_id, node_id) do nothing;
end $$;
