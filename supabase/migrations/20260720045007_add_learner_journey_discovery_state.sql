alter table public.journeys add column published_at timestamptz;

update public.journeys
set published_at = now()
where id = 'journey.world-history';

alter table public.journey_entries
add constraint journey_entries_journey_lesson_unique unique (journey_id, lesson_id);

create table public.learner_journeys (
  learner_id uuid not null references public.learners(id) on delete cascade,
  journey_id text not null,
  status text not null check (status in ('open', 'saved', 'closed')),
  active_lesson_id text not null,
  opened_at timestamptz,
  saved_at timestamptz,
  closed_at timestamptz,
  last_visited_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (learner_id, journey_id),
  foreign key (journey_id, active_lesson_id)
    references public.journey_entries(journey_id, lesson_id)
);

create table public.learner_navigation_state (
  learner_id uuid primary key references public.learners(id) on delete cascade,
  active_journey_id text not null references public.journeys(id),
  updated_at timestamptz not null default now()
);

create table public.learner_invitation_states (
  learner_id uuid not null references public.learners(id) on delete cascade,
  invitation_id text not null,
  action text not null check (action in ('saved', 'dismissed', 'opened')),
  updated_at timestamptz not null default now(),
  primary key (learner_id, invitation_id)
);

create index learner_journeys_journey_id_idx on public.learner_journeys(journey_id);
create index learner_journeys_status_order_idx on public.learner_journeys(learner_id, status, last_visited_at desc);
create index learner_journeys_active_lesson_id_idx on public.learner_journeys(active_lesson_id);
create index learner_navigation_active_journey_id_idx on public.learner_navigation_state(active_journey_id);

alter table public.learner_journeys enable row level security;
alter table public.learner_navigation_state enable row level security;
alter table public.learner_invitation_states enable row level security;

create policy learner_journeys_select on public.learner_journeys for select to authenticated
using ((select auth.uid()) = learner_id);
create policy learner_journeys_insert on public.learner_journeys for insert to authenticated
with check ((select auth.uid()) = learner_id);
create policy learner_journeys_update on public.learner_journeys for update to authenticated
using ((select auth.uid()) = learner_id)
with check ((select auth.uid()) = learner_id);

create policy learner_navigation_select on public.learner_navigation_state for select to authenticated
using ((select auth.uid()) = learner_id);
create policy learner_navigation_insert on public.learner_navigation_state for insert to authenticated
with check ((select auth.uid()) = learner_id);
create policy learner_navigation_update on public.learner_navigation_state for update to authenticated
using ((select auth.uid()) = learner_id)
with check ((select auth.uid()) = learner_id);

create policy learner_invitation_states_select on public.learner_invitation_states for select to authenticated
using ((select auth.uid()) = learner_id);
create policy learner_invitation_states_insert on public.learner_invitation_states for insert to authenticated
with check ((select auth.uid()) = learner_id);
create policy learner_invitation_states_update on public.learner_invitation_states for update to authenticated
using ((select auth.uid()) = learner_id)
with check ((select auth.uid()) = learner_id);

revoke all on public.learner_journeys, public.learner_navigation_state, public.learner_invitation_states
from public, anon, authenticated;
grant select, insert, update on public.learner_journeys, public.learner_navigation_state, public.learner_invitation_states
to authenticated;

drop policy journeys_select on public.journeys;
create policy journeys_select on public.journeys for select to authenticated
using (published_at is not null);

drop policy entries_select on public.journey_entries;
create policy entries_select on public.journey_entries for select to authenticated
using (
  exists (
    select 1 from public.journeys journey
    join public.content_lessons lesson on lesson.id = journey_entries.lesson_id
    where journey.id = journey_entries.journey_id
      and journey.published_at is not null
      and lesson.published_at is not null
  )
);

comment on table public.learner_journeys is
  'Learner-owned open, saved, or closed journey state. Closing never removes lesson progress.';
comment on table public.learner_navigation_state is
  'Learner-owned active journey pointer; active lesson remains stored per journey.';
comment on table public.learner_invitation_states is
  'Learner-owned authored invitation action state; never contributes to lesson or journey completion.';
