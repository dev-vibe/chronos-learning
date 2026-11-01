-- A submission can carry the learner's "guess before reading".
--
-- Some lessons ask an ungraded question near the top that the learner answers
-- before the rest of the lesson appears. The guess is saved like a prompt
-- attempt (understanding_prompt_attempts, response {"answer", "kind": "guess"})
-- and is sent with the written answers so the parent can compare the guess
-- with what the learner wrote after reading. Its text sits in `answers` under
-- the guess ID, and its question in the `questions` snapshot with kind 'guess'.
--
-- The only change is that submit_lesson accepts that kind. Nothing here grades
-- the guess or counts it towards finishing or passing a lesson: review_submission
-- never reads answers, and the Learn page leaves guesses out of the required
-- checks. The same function, grants and row-level security otherwise apply.

create or replace function public.submit_lesson(p_lesson_id text, p_answers jsonb, p_questions jsonb, p_learner_id uuid default null)
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
  -- Shape checks only: prompt and guess ids are never compared with the lesson's content.
  if p_answers is null or jsonb_typeof(p_answers) <> 'object'
     or exists (select 1 from jsonb_each(p_answers) e where jsonb_typeof(e.value) <> 'string' or char_length(e.value #>> '{}') > 5000) then
    raise exception 'answers must map prompt ids to text' using errcode = '22023';
  end if;
  if p_questions is null or jsonb_typeof(p_questions) <> 'array'
     or jsonb_array_length(p_questions) > 20
     or octet_length(p_questions::text) > 60000
     or exists (
       select 1 from jsonb_array_elements(p_questions) q
       where jsonb_typeof(q) <> 'object'
          or jsonb_typeof(q->'promptId') is distinct from 'string'
          or jsonb_typeof(q->'question') is distinct from 'string'
          or char_length(q->>'question') not between 1 and 2000
          or coalesce(q->>'kind', '') not in ('supported-selection', 'concise-explanation', 'guess')
     )
     or (select count(*) from jsonb_array_elements(p_questions))
        <> (select count(distinct q->>'promptId') from jsonb_array_elements(p_questions) q) then
    raise exception 'questions must list each prompt once with its text' using errcode = '22023';
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
    insert into public.lesson_submissions(learner_id, lesson_id, status, answers, questions)
    values (v_learner, p_lesson_id, 'submitted', p_answers, p_questions)
    returning * into v_row;
  elsif v_row.status = 'returned' then
    update public.lesson_submissions
    set status = 'submitted', answers = p_answers, questions = p_questions, round = round + 1, submitted_at = now()
    where learner_id = v_learner and lesson_id = p_lesson_id
    returning * into v_row;
  elsif v_row.status = 'submitted' then
    update public.lesson_submissions
    set answers = p_answers, questions = p_questions, submitted_at = now()
    where learner_id = v_learner and lesson_id = p_lesson_id
    returning * into v_row;
  end if;
  -- A passed submission is final and returned unchanged, whatever prompts the
  -- new answers name. Its cards stay in card_ownership.
  return to_jsonb(v_row);
end $$;

comment on column public.lesson_submissions.questions is
  'The lesson''s questions as the learner saw them when submitting: an array of {promptId, kind, question, required, explanation?}. kind ''guess'' is the ungraded guess before reading, shown apart on Review.';
