begin;
create extension if not exists pgtap with schema extensions;
set local search_path=extensions,public;
select plan(12);

insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at)
values ('77777777-7777-7777-7777-777777777777','00000000-0000-0000-0000-000000000000','authenticated','authenticated','ash70@example.invalid','',now(),now(),now());

select ok((select published_at is not null from public.content_lessons where id='lesson.farming.settlements'), 'farming lesson is published');
select ok((select completion_enabled from public.lesson_completion_configuration where lesson_id='lesson.farming.settlements'), 'farming completion is enabled');
select is((select count(*) from public.lesson_required_prompts where lesson_id='lesson.farming.settlements'), 2::bigint, 'farming has two data-driven required prompts');
select is((select card_id from public.card_unlocks where lesson_id='lesson.farming.settlements'), 'card.place.catalhoyuk', 'farming unlocks the Çatalhöyük place card');

set local role authenticated;
select set_config('request.jwt.claim.sub','77777777-7777-7777-7777-777777777777',true);
insert into public.learners(id) values(auth.uid());
insert into public.lesson_progress(learner_id,lesson_id) values
 (auth.uid(),'lesson.farming.settlements'),
 (auth.uid(),'lesson.uruk.first-city');

select throws_ok(
  $$select public.complete_lesson_and_acquire_card('lesson.farming.settlements','farming-missing-prompts')$$,
  '23514','required prompt attempts missing','farming completion requires its configured prompts'
);

insert into public.understanding_prompt_attempts(learner_id,lesson_id,prompt_id,response) values
 (auth.uid(),'lesson.farming.settlements','prompt.farming.best-supported-model','{}'),
 (auth.uid(),'lesson.farming.settlements','prompt.farming.opportunity-and-cost','{}');

select is((public.complete_lesson_and_acquire_card('lesson.farming.settlements','farming-complete-once')->>'completion'), 'newly-completed', 'farming completes explicitly');
select is((public.complete_lesson_and_acquire_card('lesson.farming.settlements','farming-complete-once')->>'completion'), 'newly-completed', 'same key returns original farming result');
select is((public.complete_lesson_and_acquire_card('lesson.farming.settlements','farming-complete-again')->>'completion'), 'already-completed', 'new key observes existing farming completion');
select is((public.complete_lesson_and_acquire_card('lesson.farming.settlements','farming-card-again')->>'cardOwnership'), 'already-owned', 'farming card is granted once');
select is((select count(*) from public.card_ownership where learner_id=auth.uid() and card_id='card.place.catalhoyuk'), 1::bigint, 'one farming card exists');
select is((select count(*) from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.farming.settlements' and status='completed'), 1::bigint, 'one farming completion row exists');
select is((select status from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.uruk.first-city'), 'in_progress', 'farming completion does not alter Uruk');

select * from finish();
rollback;
