-- Parent review replaces database-held lesson configuration.
--
-- Lessons, journeys, prompts and Knowledge Cards are defined only in the
-- repository content bundle. The database keeps learner state and a reviewed
-- submission per learner and lesson. A learner finishes a lesson by submitting
-- their answers; a linked parent passes it (which grants the lesson's cards) or
-- sends it back with a note. Publishing a lesson is a repository change only.
--
-- Parents choose between two setups. Separate sign-ins (recommended): each kid
-- has an account and links to the parent with a single-use code. Shared
-- account: the parent's sign-in holds a profile per kid (no kid email needed)
-- and the app switches between kid view and parent view. A shared account can
-- optionally lock parent view with a PIN.
--
-- The old configuration tables (content_lessons, journeys, journey_entries,
-- knowledge_cards, card_unlocks, legacy_id_aliases,
-- lesson_completion_configuration, lesson_required_prompts,
-- completion_commands) are left in place but nothing reads or writes them any
-- more. They can be dropped in a later migration.

-- 1. Learner tables stop referencing configuration tables. Lesson, journey and
--    card ids stay plain text that the app checks against the content bundle.
alter table public.lesson_progress drop constraint lesson_progress_lesson_id_fkey;
alter table public.card_ownership
  drop constraint card_ownership_card_id_fkey,
  drop constraint card_ownership_source_lesson_id_fkey;
alter table public.learner_journeys drop constraint learner_journeys_journey_id_active_lesson_id_fkey;
alter table public.learner_navigation_state drop constraint learner_navigation_state_active_journey_id_fkey;

-- Completion no longer grants cards on its own; a parent's pass does.
revoke all on function public.complete_lesson_and_acquire_card(text, text) from public, anon, authenticated, service_role;

-- 2. Learners are either a sign-in's own learner (id = account_id) or a kid
--    profile held by that sign-in (id <> account_id). Display names let a
--    parent recognize a learner.
alter table public.learners
  add column account_id uuid,
  add column display_name text check (display_name is null or char_length(trim(display_name)) between 1 and 60),
  add column account_setup text check (account_setup is null or account_setup in ('separate', 'shared', 'learner'));
update public.learners set account_id = id;
alter table public.learners
  drop constraint learners_id_fkey,
  alter column account_id set not null,
  add constraint learners_account_id_fkey foreign key (account_id) references auth.users(id) on delete cascade;

-- A learner inserted without an account is the sign-in's own learner.
create or replace function chronos_private.default_learner_account()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.account_id := coalesce(new.account_id, new.id);
  return new;
end $$;
create trigger learners_default_account before insert on public.learners
for each row execute function chronos_private.default_learner_account();
create index learners_account_id_idx on public.learners(account_id);
comment on column public.learners.account_setup is
  'The sign-in''s chosen setup: separate kid sign-ins, kid profiles on a shared account, or a learner on their own.';

-- True when the signed-in user may act as this learner: their own learner, or
-- a kid profile held by their sign-in.
create or replace function public.can_act_as(p_learner_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select p_learner_id = (select auth.uid())
    or exists (select 1 from public.learners l where l.id = p_learner_id and l.account_id = (select auth.uid()));
$$;
revoke all on function public.can_act_as(uuid) from public, anon;
grant execute on function public.can_act_as(uuid) to authenticated;

-- Learner-owned rows are open to whoever may act as that learner.
alter policy learners_select on public.learners using (public.can_act_as(id));
alter policy learners_insert on public.learners with check (id = (select auth.uid()) and account_id = (select auth.uid()));
alter policy learners_update on public.learners using (public.can_act_as(id)) with check (public.can_act_as(id));
grant insert (id, display_name), update (display_name, account_setup) on public.learners to authenticated;

alter policy progress_select on public.lesson_progress using (public.can_act_as(learner_id));
alter policy progress_insert on public.lesson_progress with check (public.can_act_as(learner_id));
alter policy progress_update on public.lesson_progress using (public.can_act_as(learner_id)) with check (public.can_act_as(learner_id));
alter policy resume_select on public.section_resume_state using (public.can_act_as(learner_id));
alter policy resume_insert on public.section_resume_state with check (public.can_act_as(learner_id));
alter policy resume_update on public.section_resume_state using (public.can_act_as(learner_id)) with check (public.can_act_as(learner_id));
alter policy attempts_select on public.understanding_prompt_attempts using (public.can_act_as(learner_id));
alter policy attempts_insert on public.understanding_prompt_attempts with check (public.can_act_as(learner_id));
alter policy attempts_update on public.understanding_prompt_attempts using (public.can_act_as(learner_id)) with check (public.can_act_as(learner_id));
alter policy ownership_select on public.card_ownership using (public.can_act_as(learner_id));
alter policy section_exploration_select on public.lesson_section_exploration using (public.can_act_as(learner_id));
alter policy section_exploration_insert on public.lesson_section_exploration with check (public.can_act_as(learner_id));
alter policy learner_journeys_select on public.learner_journeys using (public.can_act_as(learner_id));
alter policy learner_journeys_insert on public.learner_journeys with check (public.can_act_as(learner_id));
alter policy learner_journeys_update on public.learner_journeys using (public.can_act_as(learner_id)) with check (public.can_act_as(learner_id));
alter policy learner_navigation_select on public.learner_navigation_state using (public.can_act_as(learner_id));
alter policy learner_navigation_insert on public.learner_navigation_state with check (public.can_act_as(learner_id));
alter policy learner_navigation_update on public.learner_navigation_state using (public.can_act_as(learner_id)) with check (public.can_act_as(learner_id));
alter policy learner_invitation_states_select on public.learner_invitation_states using (public.can_act_as(learner_id));
alter policy learner_invitation_states_insert on public.learner_invitation_states with check (public.can_act_as(learner_id));
alter policy learner_invitation_states_update on public.learner_invitation_states using (public.can_act_as(learner_id)) with check (public.can_act_as(learner_id));

-- 3. Parent links. A learner shares a short code; the parent enters it once.
create table public.guardian_links (
  guardian_id uuid not null references public.learners(id) on delete cascade,
  learner_id uuid not null references public.learners(id) on delete cascade,
  linked_at timestamptz not null default now(),
  primary key (guardian_id, learner_id),
  check (guardian_id <> learner_id)
);
create index guardian_links_learner_id_idx on public.guardian_links(learner_id);

create table public.learner_link_codes (
  learner_id uuid primary key references public.learners(id) on delete cascade,
  code text not null unique check (code ~ '^[A-HJ-NP-Z2-9]{8}$'),
  created_at timestamptz not null default now()
);

-- 4. One reviewed submission per learner and lesson. Resubmitting after a
--    parent sends it back replaces the answers and starts a new round; the
--    parent's last note stays visible until the lesson passes.
create table public.lesson_submissions (
  learner_id uuid not null,
  lesson_id text not null,
  status text not null check (status in ('submitted', 'returned', 'passed')),
  answers jsonb not null check (jsonb_typeof(answers) = 'object' and octet_length(answers::text) <= 60000),
  round integer not null default 1 check (round >= 1),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.learners(id) on delete set null,
  feedback text check (feedback is null or char_length(feedback) <= 2000),
  card_ids text[] not null default '{}',
  pass_seen_at timestamptz,
  primary key (learner_id, lesson_id),
  foreign key (learner_id, lesson_id) references public.lesson_progress(learner_id, lesson_id) on delete cascade,
  check (status = 'submitted' or reviewed_at is not null),
  check (status <> 'returned' or feedback is not null)
);
create index lesson_submissions_reviewed_by_idx on public.lesson_submissions(reviewed_by);
create index lesson_submissions_status_idx on public.lesson_submissions(status, submitted_at);

alter table public.guardian_links enable row level security;
alter table public.learner_link_codes enable row level security;
alter table public.lesson_submissions enable row level security;

create policy guardian_links_select on public.guardian_links for select to authenticated
using ((select auth.uid()) in (guardian_id, learner_id));
create policy guardian_links_delete on public.guardian_links for delete to authenticated
using ((select auth.uid()) in (guardian_id, learner_id));

create policy learner_link_codes_select on public.learner_link_codes for select to authenticated
using ((select auth.uid()) = learner_id);

create policy lesson_submissions_select on public.lesson_submissions for select to authenticated
using (
  public.can_act_as(learner_id)
  or exists (
    select 1 from public.guardian_links link
    where link.guardian_id = (select auth.uid()) and link.learner_id = lesson_submissions.learner_id
  )
);

-- Linked parents and learners can see each other's display names.
create policy learners_select_linked on public.learners for select to authenticated
using (
  exists (
    select 1 from public.guardian_links link
    where (link.guardian_id = (select auth.uid()) and link.learner_id = learners.id)
       or (link.learner_id = (select auth.uid()) and link.guardian_id = learners.id)
  )
);

revoke all on public.guardian_links, public.learner_link_codes, public.lesson_submissions from public, anon, authenticated;
grant select, delete on public.guardian_links to authenticated;
grant select on public.learner_link_codes, public.lesson_submissions to authenticated;

-- Optional PIN for parent view on a shared account. Only a salted hash is
-- stored, and browser roles cannot read this table.
create extension if not exists pgcrypto with schema extensions;
create table public.parent_view_pins (
  account_id uuid primary key references auth.users(id) on delete cascade,
  pin_hash text not null,
  failed_attempts integer not null default 0,
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.parent_view_pins enable row level security;
revoke all on public.parent_view_pins from public, anon, authenticated;

-- 5. Commands. Status changes happen only here, never through direct writes.
create or replace function public.learner_link_code(p_rotate boolean default false)
returns text language plpgsql security definer set search_path = '' as $$
declare
  v_learner uuid := (select auth.uid());
  v_alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_bytes bytea;
  v_code text;
begin
  if v_learner is null then
    raise exception 'authentication required' using errcode = '28000';
  end if;
  insert into public.learners(id) values (v_learner) on conflict do nothing;

  if not p_rotate then
    select code into v_code from public.learner_link_codes where learner_id = v_learner;
    if v_code is not null then return v_code; end if;
  end if;

  loop
    v_bytes := uuid_send(gen_random_uuid());
    -- Bytes 0-5 and 10-11 of a version 4 UUID are fully random.
    v_code := '';
    for i in 0..7 loop
      v_code := v_code || substr(v_alphabet, 1 + (get_byte(v_bytes, case when i < 6 then i else i + 4 end) % 32), 1);
    end loop;
    begin
      insert into public.learner_link_codes(learner_id, code, created_at)
      values (v_learner, v_code, now())
      on conflict (learner_id) do update set code = excluded.code, created_at = excluded.created_at;
      return v_code;
    exception when unique_violation then
      -- Another learner already holds this code; draw again.
    end;
  end loop;
end $$;

create or replace function public.link_learner(p_code text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_guardian uuid := (select auth.uid());
  v_code text := upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g'));
  v_learner uuid;
  v_name text;
begin
  if v_guardian is null then
    raise exception 'authentication required' using errcode = '28000';
  end if;
  select learner_id into v_learner from public.learner_link_codes where code = v_code;
  if v_learner is null then
    raise exception 'link code not found' using errcode = '22023';
  end if;
  if v_learner = v_guardian then
    raise exception 'you cannot link your own account' using errcode = '22023';
  end if;

  insert into public.learners(id) values (v_guardian) on conflict do nothing;
  insert into public.guardian_links(guardian_id, learner_id) values (v_guardian, v_learner) on conflict do nothing;
  -- Codes are single-use; the learner's account page shows the next one.
  delete from public.learner_link_codes where learner_id = v_learner;

  select display_name into v_name from public.learners where id = v_learner;
  return jsonb_build_object('learnerId', v_learner, 'displayName', v_name);
end $$;

create or replace function public.submit_lesson(p_lesson_id text, p_answers jsonb, p_learner_id uuid default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_learner uuid := coalesce(p_learner_id, (select auth.uid()));
  v_row public.lesson_submissions;
begin
  if (select auth.uid()) is null then
    raise exception 'authentication required' using errcode = '28000';
  end if;
  if not public.can_act_as(v_learner) then
    raise exception 'not allowed to act for this learner' using errcode = '42501';
  end if;
  if p_lesson_id is null or p_lesson_id !~ '^[a-z0-9][a-z0-9.-]{0,199}$' then
    raise exception 'invalid lesson id' using errcode = '22023';
  end if;
  if p_answers is null or jsonb_typeof(p_answers) <> 'object'
     or exists (select 1 from jsonb_each(p_answers) e where jsonb_typeof(e.value) <> 'string' or char_length(e.value #>> '{}') > 5000) then
    raise exception 'answers must map prompt ids to text' using errcode = '22023';
  end if;

  if v_learner = (select auth.uid()) then
    insert into public.learners(id) values (v_learner) on conflict do nothing;
  end if;
  insert into public.lesson_progress(learner_id, lesson_id) values (v_learner, p_lesson_id) on conflict do nothing;
  -- Submitting finishes the lesson; the parent's review decides the cards.
  update public.lesson_progress
  set status = 'completed', completed_at = coalesce(completed_at, now())
  where learner_id = v_learner and lesson_id = p_lesson_id and status <> 'completed';

  select * into v_row from public.lesson_submissions
  where learner_id = v_learner and lesson_id = p_lesson_id
  for update;

  if not found then
    insert into public.lesson_submissions(learner_id, lesson_id, status, answers)
    values (v_learner, p_lesson_id, 'submitted', p_answers)
    returning * into v_row;
  elsif v_row.status = 'returned' then
    update public.lesson_submissions
    set status = 'submitted', answers = p_answers, round = round + 1, submitted_at = now()
    where learner_id = v_learner and lesson_id = p_lesson_id
    returning * into v_row;
  elsif v_row.status = 'submitted' then
    update public.lesson_submissions
    set answers = p_answers, submitted_at = now()
    where learner_id = v_learner and lesson_id = p_lesson_id
    returning * into v_row;
  end if;
  -- A passed submission is final and returned unchanged.
  return to_jsonb(v_row);
end $$;

create or replace function public.review_submission(
  p_learner_id uuid,
  p_lesson_id text,
  p_decision text,
  p_feedback text default null,
  p_card_ids text[] default '{}'
)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_guardian uuid := (select auth.uid());
  v_feedback text := nullif(trim(coalesce(p_feedback, '')), '');
  v_cards text[] := coalesce(p_card_ids, '{}');
  v_row public.lesson_submissions;
begin
  if v_guardian is null then
    raise exception 'authentication required' using errcode = '28000';
  end if;
  -- Parents review learners linked by code, or kid profiles on their own
  -- shared account. A sign-in never reviews its own learner.
  if not exists (select 1 from public.guardian_links where guardian_id = v_guardian and learner_id = p_learner_id)
     and not exists (select 1 from public.learners where id = p_learner_id and account_id = v_guardian and id <> v_guardian) then
    raise exception 'not linked to this learner' using errcode = '42501';
  end if;
  if p_decision not in ('pass', 'return') then
    raise exception 'decision must be pass or return' using errcode = '22023';
  end if;
  if cardinality(v_cards) > 10 or exists (select 1 from unnest(v_cards) c where c is null or c !~ '^[a-z0-9][a-z0-9.-]{0,199}$') then
    raise exception 'invalid card ids' using errcode = '22023';
  end if;

  select * into v_row from public.lesson_submissions
  where learner_id = p_learner_id and lesson_id = p_lesson_id
  for update;
  if not found then
    raise exception 'submission not found' using errcode = '22023';
  end if;
  if v_row.status = 'passed' and p_decision = 'pass' then
    return to_jsonb(v_row);
  end if;
  if v_row.status <> 'submitted' then
    raise exception 'submission is not waiting for review' using errcode = '22023';
  end if;

  if p_decision = 'return' then
    if v_feedback is null then
      raise exception 'a note is required when sending work back' using errcode = '22023';
    end if;
    update public.lesson_submissions
    set status = 'returned', feedback = v_feedback, reviewed_at = now(), reviewed_by = v_guardian
    where learner_id = p_learner_id and lesson_id = p_lesson_id
    returning * into v_row;
    return to_jsonb(v_row);
  end if;

  update public.lesson_submissions
  set status = 'passed', feedback = v_feedback, card_ids = v_cards, reviewed_at = now(), reviewed_by = v_guardian
  where learner_id = p_learner_id and lesson_id = p_lesson_id
  returning * into v_row;

  insert into public.card_ownership(learner_id, card_id, source_lesson_id)
  select p_learner_id, card_id, p_lesson_id from unnest(v_cards) as card_id
  on conflict do nothing;
  return to_jsonb(v_row);
end $$;

create or replace function public.acknowledge_pass(p_lesson_id text, p_learner_id uuid default null)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_learner uuid := coalesce(p_learner_id, (select auth.uid()));
begin
  if (select auth.uid()) is null then
    raise exception 'authentication required' using errcode = '28000';
  end if;
  if not public.can_act_as(v_learner) then
    raise exception 'not allowed to act for this learner' using errcode = '42501';
  end if;
  update public.lesson_submissions
  set pass_seen_at = now()
  where learner_id = v_learner and lesson_id = p_lesson_id and status = 'passed' and pass_seen_at is null;
end $$;

-- 6. Kid profiles on a shared account.
create or replace function public.add_learner_profile(p_display_name text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_account uuid := (select auth.uid());
  v_name text := trim(coalesce(p_display_name, ''));
  v_id uuid := gen_random_uuid();
begin
  if v_account is null then
    raise exception 'authentication required' using errcode = '28000';
  end if;
  if char_length(v_name) not between 1 and 60 then
    raise exception 'a name is required' using errcode = '22023';
  end if;
  insert into public.learners(id, account_id) values (v_account, v_account) on conflict do nothing;
  if (select count(*) from public.learners where account_id = v_account and id <> v_account) >= 10 then
    raise exception 'an account can hold up to 10 kids' using errcode = '22023';
  end if;
  insert into public.learners(id, account_id, display_name) values (v_id, v_account, v_name);
  update public.learners set account_setup = 'shared' where id = v_account and account_setup is null;
  return jsonb_build_object('id', v_id, 'displayName', v_name);
end $$;

create or replace function public.remove_learner_profile(p_learner_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if (select auth.uid()) is null then
    raise exception 'authentication required' using errcode = '28000';
  end if;
  -- Deleting a profile removes its progress, answers and cards.
  delete from public.learners
  where id = p_learner_id and account_id = (select auth.uid()) and id <> (select auth.uid());
  if not found then
    raise exception 'profile not found' using errcode = '22023';
  end if;
end $$;

-- 7. Optional parent-view PIN. The app asks for it before showing parent view.
create or replace function public.parent_pin_enabled()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.parent_view_pins where account_id = (select auth.uid()));
$$;

create or replace function public.set_parent_pin(p_pin text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_account uuid := (select auth.uid());
begin
  if v_account is null then
    raise exception 'authentication required' using errcode = '28000';
  end if;
  if p_pin is null then
    delete from public.parent_view_pins where account_id = v_account;
    return;
  end if;
  if p_pin !~ '^[0-9]{4}$' then
    raise exception 'the PIN must be 4 digits' using errcode = '22023';
  end if;
  insert into public.parent_view_pins(account_id, pin_hash)
  values (v_account, extensions.crypt(p_pin, extensions.gen_salt('bf')))
  on conflict (account_id) do update
  set pin_hash = excluded.pin_hash, failed_attempts = 0, locked_until = null, updated_at = now();
end $$;

create or replace function public.verify_parent_pin(p_pin text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  v_account uuid := (select auth.uid());
  v_row public.parent_view_pins;
begin
  if v_account is null then
    raise exception 'authentication required' using errcode = '28000';
  end if;
  select * into v_row from public.parent_view_pins where account_id = v_account for update;
  if not found then return true; end if;
  if v_row.locked_until is not null and v_row.locked_until > now() then
    raise exception 'too many tries' using errcode = '22023';
  end if;
  if v_row.pin_hash = extensions.crypt(coalesce(p_pin, ''), v_row.pin_hash) then
    update public.parent_view_pins set failed_attempts = 0, locked_until = null where account_id = v_account;
    return true;
  end if;
  -- Five wrong tries lock the PIN for five minutes.
  update public.parent_view_pins
  set failed_attempts = case when failed_attempts >= 4 then 0 else failed_attempts + 1 end,
      locked_until = case when failed_attempts >= 4 then now() + interval '5 minutes' else null end
  where account_id = v_account;
  return false;
end $$;

revoke all on function public.learner_link_code(boolean), public.link_learner(text), public.submit_lesson(text, jsonb, uuid),
  public.review_submission(uuid, text, text, text, text[]), public.acknowledge_pass(text, uuid),
  public.add_learner_profile(text), public.remove_learner_profile(uuid),
  public.parent_pin_enabled(), public.set_parent_pin(text), public.verify_parent_pin(text)
from public, anon;
grant execute on function public.learner_link_code(boolean), public.link_learner(text), public.submit_lesson(text, jsonb, uuid),
  public.review_submission(uuid, text, text, text, text[]), public.acknowledge_pass(text, uuid),
  public.add_learner_profile(text), public.remove_learner_profile(uuid),
  public.parent_pin_enabled(), public.set_parent_pin(text), public.verify_parent_pin(text)
to authenticated;

comment on table public.lesson_submissions is
  'A learner''s answers for one lesson and the linked parent''s review. Passing grants the lesson''s Knowledge Cards.';
comment on table public.guardian_links is
  'Parent-to-learner links created by entering the learner''s single-use link code.';
