begin;
create extension if not exists pgtap with schema extensions;
set local search_path=extensions,public;
select plan(16);

insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at)
values ('09975268-6b57-4d3f-a7dd-f2a5d145fe36','00000000-0000-0000-0000-000000000000','authenticated','authenticated','publish-sahul_crossing@example.invalid','',now(),now(),now());

select ok((select published_at is not null from public.content_lessons where id='lesson.humans.sahul-crossing'), 'lesson is published');
select ok((select completion_enabled from public.lesson_completion_configuration where lesson_id='lesson.humans.sahul-crossing'), 'completion is enabled');
select is((select count(*) from public.lesson_required_prompts where lesson_id='lesson.humans.sahul-crossing'), 2::bigint, 'required prompt count');
select is((select count(*) from public.card_unlocks where lesson_id='lesson.humans.sahul-crossing'), 1::bigint, 'card unlock count');
select is((select position from public.journey_entries where id='entry.world-history.sahul-crossing'), 2, 'journey position');
select is((select required from public.journey_entries where id='entry.world-history.sahul-crossing'), true, 'required entry');

set local role authenticated;
select set_config('request.jwt.claim.sub','09975268-6b57-4d3f-a7dd-f2a5d145fe36',true);
insert into public.learners(id) values(auth.uid());
insert into public.lesson_progress(learner_id,lesson_id) values
 (auth.uid(),'lesson.humans.sahul-crossing'),
 (auth.uid(),'lesson.humans.migrations-and-interbreeding');

select throws_ok(
  $$select public.complete_lesson_and_acquire_card('lesson.humans.sahul-crossing','sahul-crossing-missing-prompts')$$,
  '23514','required prompt attempts missing','rejects completion without attempts'
);
insert into public.understanding_prompt_attempts(learner_id,lesson_id,prompt_id,response) values
 (auth.uid(),'lesson.humans.sahul-crossing','prompt.humans.sahul.sand-date-supports','{}');
select throws_ok(
  $$select public.complete_lesson_and_acquire_card('lesson.humans.sahul-crossing','sahul-crossing-one-prompt')$$,
  '23514','required prompt attempts missing','rejects completion with a partial attempt'
);
insert into public.understanding_prompt_attempts(learner_id,lesson_id,prompt_id,response) values
 (auth.uid(),'lesson.humans.sahul-crossing','prompt.humans.sahul.planning-and-limit','{}');

select is((public.complete_lesson_and_acquire_card('lesson.humans.sahul-crossing','sahul-crossing-complete-once')->>'completion'), 'newly-completed', 'completes explicitly');
select is((public.complete_lesson_and_acquire_card('lesson.humans.sahul-crossing','sahul-crossing-complete-once')->>'completion'), 'newly-completed', 'same command key returns the original result');
select is((public.complete_lesson_and_acquire_card('lesson.humans.sahul-crossing','sahul-crossing-complete-again')->>'completion'), 'already-completed', 'new command observes existing completion');
select is((public.complete_lesson_and_acquire_card('lesson.humans.sahul-crossing','sahul-crossing-card-again')->>'cardOwnership'), 'already-owned', 'card is granted only once');
select is((select count(*) from public.card_ownership where learner_id=auth.uid() and card_id='card.place.sahul'), 1::bigint, 'one card exists');
select is((select count(*) from public.card_ownership where learner_id=auth.uid() and source_lesson_id='lesson.humans.sahul-crossing'), 1::bigint, 'lesson-sourced card count');
select is((select count(*) from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.humans.sahul-crossing' and status='completed'), 1::bigint, 'one completion row exists');
select is((select status from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.humans.migrations-and-interbreeding'), 'in_progress', 'completion leaves the previous lesson unchanged');

select * from finish();
rollback;
