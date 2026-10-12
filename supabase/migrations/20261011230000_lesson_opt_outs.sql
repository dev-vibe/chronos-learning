-- A parent can take an unfinished lesson out of one kid's curriculum.
--
-- An opt-out is per kid and reversible: removing the row restores the lesson.
-- It never touches progress, submissions or cards. Finished lessons cannot be
-- opted out, so a kid's record of what they did stays intact.

create table public.lesson_opt_outs (
  learner_id uuid not null references public.learners(id) on delete cascade,
  lesson_id text not null check (lesson_id ~ '^[a-z0-9][a-z0-9._-]{0,199}$'),
  opted_out_at timestamptz not null default now(),
  opted_out_by uuid references public.learners(id) on delete set null,
  primary key (learner_id, lesson_id)
);

create index lesson_opt_outs_opted_out_by_idx on public.lesson_opt_outs(opted_out_by);

alter table public.lesson_opt_outs enable row level security;

-- Kids read their own opt-outs (so their lessons disappear); linked parents and
-- the account owner read them too. Nobody writes the table directly.
create policy lesson_opt_outs_select on public.lesson_opt_outs
  for select to authenticated
  using (
    public.can_act_as(learner_id)
    or exists (
      select 1 from public.guardian_links link
      where link.guardian_id = (select auth.uid())
        and link.learner_id = lesson_opt_outs.learner_id
    )
  );

revoke all on public.lesson_opt_outs from public, anon, authenticated;
grant select on public.lesson_opt_outs to authenticated;

create function public.set_lesson_opt_out(p_learner_id uuid, p_lesson_id text, p_opted_out boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_caller uuid := (select auth.uid());
begin
  if v_caller is null then
    raise exception 'authentication required' using errcode = '28000';
  end if;

  -- Only a parent: a linked guardian, or the account owner of a kid profile.
  -- A learner never changes their own curriculum.
  if p_learner_id = v_caller
     or not (
       exists (
         select 1 from public.guardian_links link
         where link.guardian_id = v_caller and link.learner_id = p_learner_id
       )
       or exists (
         select 1 from public.learners kid
         where kid.id = p_learner_id and kid.account_id = v_caller and kid.id <> v_caller
       )
     ) then
    raise exception 'not linked to this learner' using errcode = '42501';
  end if;

  if p_lesson_id is null or p_lesson_id !~ '^[a-z0-9][a-z0-9._-]{0,199}$' then
    raise exception 'invalid lesson' using errcode = '22023';
  end if;

  if p_opted_out then
    if exists (
      select 1 from public.lesson_progress progress
      where progress.learner_id = p_learner_id
        and progress.lesson_id = p_lesson_id
        and progress.completed_at is not null
    ) or exists (
      select 1 from public.lesson_submissions submission
      where submission.learner_id = p_learner_id and submission.lesson_id = p_lesson_id
    ) then
      raise exception 'finished lessons cannot be skipped' using errcode = '22023';
    end if;

    insert into public.lesson_opt_outs(learner_id, lesson_id, opted_out_by)
    values (p_learner_id, p_lesson_id, v_caller)
    on conflict (learner_id, lesson_id) do nothing;
  else
    delete from public.lesson_opt_outs
    where learner_id = p_learner_id and lesson_id = p_lesson_id;
  end if;
end;
$$;

revoke all on function public.set_lesson_opt_out(uuid, text, boolean) from public, anon;
grant execute on function public.set_lesson_opt_out(uuid, text, boolean) to authenticated;
