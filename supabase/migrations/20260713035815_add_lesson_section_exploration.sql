create table public.lesson_section_exploration (
  learner_id uuid not null,
  lesson_id text not null,
  section_id text not null,
  explored_at timestamptz not null default now(),
  primary key (learner_id, lesson_id, section_id),
  foreign key (learner_id, lesson_id)
    references public.lesson_progress (learner_id, lesson_id)
    on delete cascade
);

alter table public.lesson_section_exploration enable row level security;

create policy section_exploration_select
on public.lesson_section_exploration for select to authenticated
using ((select auth.uid()) = learner_id);

create policy section_exploration_insert
on public.lesson_section_exploration for insert to authenticated
with check ((select auth.uid()) = learner_id);

grant select, insert on public.lesson_section_exploration to authenticated;

comment on table public.lesson_section_exploration is
  'Cumulative semantic lesson sections meaningfully explored by a learner; resume remains separately stored in section_resume_state.';
