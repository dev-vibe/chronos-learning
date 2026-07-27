alter table public.card_unlocks
  add column position integer;

update public.card_unlocks
set position = 0;

alter table public.card_unlocks
  alter column position set not null,
  add constraint card_unlocks_position_nonnegative check (position >= 0);

alter table public.card_unlocks
  drop constraint card_unlocks_pkey,
  add primary key (lesson_id, card_id),
  add constraint card_unlocks_lesson_position_key unique (lesson_id, position);

create or replace function public.complete_lesson_and_acquire_card(p_lesson_id text,p_idempotency_key text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
  v_learner uuid := (select auth.uid());
  v_existing_lesson text;
  v_card_ids text[] := array[]::text[];
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

  select coalesce(array_agg(card_id order by position,card_id),array[]::text[])
  into v_card_ids
  from public.card_unlocks
  where lesson_id=p_lesson_id;

  insert into public.card_ownership(learner_id,card_id,source_lesson_id)
  select v_learner,u.card_id,p_lesson_id
  from public.card_unlocks u
  where u.lesson_id=p_lesson_id
  order by u.position,u.card_id
  on conflict do nothing;
  get diagnostics v_card_count=row_count;

  v_result:=jsonb_build_object(
    'completion',case when v_completion_count=1 then 'newly-completed' else 'already-completed' end,
    'cardOwnership',case when cardinality(v_card_ids)=0 then 'not-configured' when v_card_count>0 then 'newly-acquired' else 'already-owned' end,
    'cardIds',to_jsonb(v_card_ids),
    'cardId',v_card_ids[1]
  );
  update public.completion_commands set result=v_result
  where learner_id=v_learner and idempotency_key=p_idempotency_key;
  return v_result;
end $$;

revoke all on function public.complete_lesson_and_acquire_card(text,text) from public,anon,service_role;
grant execute on function public.complete_lesson_and_acquire_card(text,text) to authenticated;
