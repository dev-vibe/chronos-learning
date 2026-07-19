begin;
create extension if not exists pgtap with schema extensions;
set local search_path=extensions,public;
select plan(12);

insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at)
values ('44444444-4444-4444-4444-444444444444','00000000-0000-0000-0000-000000000000','authenticated','authenticated','ash57@example.invalid','',now(),now(),now());

select ok((select published_at is not null from public.content_lessons where id='lesson.writing.early-systems'), 'writing lesson is published');
select ok((select completion_enabled from public.lesson_completion_configuration where lesson_id='lesson.writing.early-systems'), 'writing completion is enabled');
select is((select count(*) from public.lesson_required_prompts where lesson_id='lesson.writing.early-systems'), 2::bigint, 'writing has two data-driven required prompts');

set local role authenticated;
select set_config('request.jwt.claim.sub','44444444-4444-4444-4444-444444444444',true);
insert into public.learners(id) values(auth.uid());
insert into public.lesson_progress(learner_id,lesson_id) values
 (auth.uid(),'lesson.uruk.first-city'),
 (auth.uid(),'lesson.writing.early-systems');

select throws_ok(
  $$select public.complete_lesson_and_acquire_card('lesson.writing.early-systems','writing-missing-prompts')$$,
  '23514','required prompt attempts missing','writing completion requires its configured prompts'
);

insert into public.understanding_prompt_attempts(learner_id,lesson_id,prompt_id,response) values
 (auth.uid(),'lesson.writing.early-systems','prompt.writing.administration-evidence','{}'),
 (auth.uid(),'lesson.writing.early-systems','prompt.writing.possibility-and-limit','{}');

select is((public.complete_lesson_and_acquire_card('lesson.writing.early-systems','writing-complete-once')->>'completion'), 'newly-completed', 'writing completes explicitly');
select is((public.complete_lesson_and_acquire_card('lesson.writing.early-systems','writing-complete-once')->>'completion'), 'newly-completed', 'same key returns original writing result');
select is((public.complete_lesson_and_acquire_card('lesson.writing.early-systems','writing-complete-again')->>'completion'), 'already-completed', 'new key observes existing writing completion');
select is((public.complete_lesson_and_acquire_card('lesson.writing.early-systems','writing-card-again')->>'cardOwnership'), 'already-owned', 'writing card is granted once');
select is((select count(*) from public.card_ownership where learner_id=auth.uid() and card_id='card.artifact.proto-cuneiform-tablet'), 1::bigint, 'one writing card exists');
select is((select count(*) from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.writing.early-systems' and status='completed'), 1::bigint, 'one writing completion row exists');
select is((select status from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.uruk.first-city'), 'in_progress', 'writing completion does not alter Uruk');
select is((select count(*) from public.card_ownership where learner_id=auth.uid() and card_id='card.place.uruk'), 0::bigint, 'writing completion does not grant the Uruk card');

select * from finish();
rollback;
