create table public.lesson_completion_configuration (
  lesson_id text primary key references public.content_lessons(id) on delete cascade,
  completion_enabled boolean not null default false,
  configured_at timestamptz not null default now()
);

create table public.lesson_required_prompts (
  lesson_id text not null references public.lesson_completion_configuration(lesson_id) on delete cascade,
  prompt_id text not null,
  position integer not null check (position >= 0),
  primary key (lesson_id, prompt_id),
  unique (lesson_id, position)
);

alter table public.lesson_completion_configuration enable row level security;
alter table public.lesson_required_prompts enable row level security;
revoke all on public.lesson_completion_configuration, public.lesson_required_prompts from public, anon, authenticated;

insert into public.lesson_completion_configuration (lesson_id, completion_enabled)
values ('lesson.uruk.first-city', true);

insert into public.lesson_required_prompts (lesson_id, prompt_id, position)
values
  ('lesson.uruk.first-city', 'prompt.uruk.administration-evidence', 0),
  ('lesson.uruk.first-city', 'prompt.uruk.opportunity-and-cost', 1);

create or replace function public.complete_lesson_and_acquire_card(p_lesson_id text,p_idempotency_key text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
  v_learner uuid := (select auth.uid());
  v_existing_lesson text;
  v_card text;
  v_completion_count integer := 0;
  v_card_count integer := 0;
  v_result jsonb;
begin
  if v_learner is null then
    raise exception 'authentication required' using errcode='28000';
  end if;
  if p_idempotency_key is null or length(trim(p_idempotency_key)) < 8 then
    raise exception 'invalid idempotency key' using errcode='22023';
  end if;

  insert into public.learners(id) values(v_learner) on conflict do nothing;

  select lesson_id, result into v_existing_lesson, v_result
  from public.completion_commands
  where learner_id=v_learner and idempotency_key=p_idempotency_key
  for update;
  if v_existing_lesson is not null and v_existing_lesson <> p_lesson_id then
    raise exception 'idempotency key reused for another lesson' using errcode='22023';
  end if;
  if v_result is not null then return v_result; end if;

  if not exists (
    select 1
    from public.content_lessons l
    join public.lesson_completion_configuration c on c.lesson_id=l.id
    where l.id=p_lesson_id and l.published_at is not null and c.completion_enabled
  ) then
    raise exception 'lesson is unpublished or completion is unsupported' using errcode='22023';
  end if;

  insert into public.completion_commands(learner_id,idempotency_key,lesson_id)
  values(v_learner,p_idempotency_key,p_lesson_id)
  on conflict do nothing;
  select lesson_id, result into v_existing_lesson, v_result
  from public.completion_commands
  where learner_id=v_learner and idempotency_key=p_idempotency_key
  for update;
  if v_existing_lesson <> p_lesson_id then
    raise exception 'idempotency key reused for another lesson' using errcode='22023';
  end if;
  if v_result is not null then return v_result; end if;

  if not exists(select 1 from public.lesson_progress where learner_id=v_learner and lesson_id=p_lesson_id) then
    raise exception 'learner progress not found' using errcode='42501';
  end if;
  if exists (
    select 1 from public.lesson_required_prompts r
    where r.lesson_id=p_lesson_id and not exists (
      select 1 from public.understanding_prompt_attempts a
      where a.learner_id=v_learner and a.lesson_id=r.lesson_id and a.prompt_id=r.prompt_id
    )
  ) then
    raise exception 'required prompt attempts missing' using errcode='23514';
  end if;

  update public.lesson_progress set status='completed',completed_at=coalesce(completed_at,now())
  where learner_id=v_learner and lesson_id=p_lesson_id and status<>'completed';
  get diagnostics v_completion_count=row_count;
  select card_id into v_card from public.card_unlocks where lesson_id=p_lesson_id;
  if v_card is not null then
    insert into public.card_ownership(learner_id,card_id,source_lesson_id)
    values(v_learner,v_card,p_lesson_id) on conflict do nothing;
    get diagnostics v_card_count=row_count;
  end if;
  v_result:=jsonb_build_object(
    'completion',case when v_completion_count=1 then 'newly-completed' else 'already-completed' end,
    'cardOwnership',case when v_card is null then 'not-configured' when v_card_count=1 then 'newly-acquired' else 'already-owned' end,
    'cardId',v_card
  );
  update public.completion_commands set result=v_result
  where learner_id=v_learner and idempotency_key=p_idempotency_key;
  return v_result;
end $$;

revoke all on function public.complete_lesson_and_acquire_card(text,text) from public,anon,service_role;
grant execute on function public.complete_lesson_and_acquire_card(text,text) to authenticated;
