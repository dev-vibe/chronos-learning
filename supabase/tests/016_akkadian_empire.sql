begin;
create extension if not exists pgtap with schema extensions;
set local search_path=extensions,public;
select plan(16);

insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at)
values ('f66856e2-d816-4edf-a415-3903172825e4','00000000-0000-0000-0000-000000000000','authenticated','authenticated','publish-akkadian_empire@example.invalid','',now(),now(),now());

select ok((select published_at is not null from public.content_lessons where id='lesson.mesopotamia.akkadian-empire'), 'lesson is published');
select ok((select completion_enabled from public.lesson_completion_configuration where lesson_id='lesson.mesopotamia.akkadian-empire'), 'completion is enabled');
select is((select count(*) from public.lesson_required_prompts where lesson_id='lesson.mesopotamia.akkadian-empire'), 2::bigint, 'required prompt count');
select is((select count(*) from public.card_unlocks where lesson_id='lesson.mesopotamia.akkadian-empire'), 0::bigint, 'card unlock count');
select is((select position from public.journey_entries where id='entry.world-history.akkadian-empire'), 12, 'journey position');
select is((select required from public.journey_entries where id='entry.world-history.akkadian-empire'), true, 'required entry');

set local role authenticated;
select set_config('request.jwt.claim.sub','f66856e2-d816-4edf-a415-3903172825e4',true);
insert into public.learners(id) values(auth.uid());
insert into public.lesson_progress(learner_id,lesson_id) values
 (auth.uid(),'lesson.mesopotamia.akkadian-empire'),
 (auth.uid(),'lesson.nubia.kerma-and-nile-world');

select throws_ok(
  $$select public.complete_lesson_and_acquire_card('lesson.mesopotamia.akkadian-empire','akkadian-empire-missing-prompts')$$,
  '23514','required prompt attempts missing','rejects completion without attempts'
);
insert into public.understanding_prompt_attempts(learner_id,lesson_id,prompt_id,response) values
 (auth.uid(),'lesson.mesopotamia.akkadian-empire','prompt.akkad.local-arrangements','{}');
select throws_ok(
  $$select public.complete_lesson_and_acquire_card('lesson.mesopotamia.akkadian-empire','akkadian-empire-one-prompt')$$,
  '23514','required prompt attempts missing','rejects completion with a partial attempt'
);
insert into public.understanding_prompt_attempts(learner_id,lesson_id,prompt_id,response) values
 (auth.uid(),'lesson.mesopotamia.akkadian-empire','prompt.akkad.holding-power','{}');

select is((public.complete_lesson_and_acquire_card('lesson.mesopotamia.akkadian-empire','akkadian-empire-complete-once')->>'completion'), 'newly-completed', 'completes explicitly');
select is((public.complete_lesson_and_acquire_card('lesson.mesopotamia.akkadian-empire','akkadian-empire-complete-once')->>'completion'), 'newly-completed', 'same command key returns the original result');
select is((public.complete_lesson_and_acquire_card('lesson.mesopotamia.akkadian-empire','akkadian-empire-complete-again')->>'completion'), 'already-completed', 'new command observes existing completion');
select is((public.complete_lesson_and_acquire_card('lesson.mesopotamia.akkadian-empire','akkadian-empire-no-card')->>'cardOwnership'), 'not-configured', 'no-card response is explicit');
select is((public.complete_lesson_and_acquire_card('lesson.mesopotamia.akkadian-empire','akkadian-empire-card-array')->'cardIds'), '[]'::jsonb, 'card list is empty');
select is((select count(*) from public.card_ownership where learner_id=auth.uid()), 0::bigint, 'completion grants no cards');
select is((select count(*) from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.mesopotamia.akkadian-empire' and status='completed'), 1::bigint, 'one completion row exists');
select is((select status from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.nubia.kerma-and-nile-world'), 'in_progress', 'completion leaves the previous lesson unchanged');

select * from finish();
rollback;
