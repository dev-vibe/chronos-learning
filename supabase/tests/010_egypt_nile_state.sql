begin;
create extension if not exists pgtap with schema extensions;
set local search_path=extensions,public;
select plan(15);

insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','ash97@example.invalid','',now(),now(),now());

select ok((select published_at is not null from public.content_lessons where id='lesson.egypt.nile-state'), 'Egypt lesson is published');
select ok((select completion_enabled from public.lesson_completion_configuration where lesson_id='lesson.egypt.nile-state'), 'Egypt completion is enabled');
select is((select count(*) from public.lesson_required_prompts where lesson_id='lesson.egypt.nile-state'), 2::bigint, 'Egypt has two required prompts');
select is((select card_id from public.card_unlocks where lesson_id='lesson.egypt.nile-state' and position=0), 'card.artifact.narmer-palette', 'Egypt deterministically unlocks the Narmer Palette card');
select is((select position from public.journey_entries where id='entry.world-history.egypt-nile-state'), 6, 'Egypt follows early writing in the durable World History order');
select is((select count(*) from public.legacy_id_aliases where canonical_id='lesson.egypt.nile-state' and semantic_equivalence_approved), 2::bigint, 'both reviewed legacy aliases resolve to Egypt');

set local role authenticated;
select set_config('request.jwt.claim.sub','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',true);
insert into public.learners(id) values(auth.uid());
insert into public.lesson_progress(learner_id,lesson_id) values
 (auth.uid(),'lesson.egypt.nile-state'),
 (auth.uid(),'lesson.writing.early-systems');

select throws_ok(
  $$select public.complete_lesson_and_acquire_card('lesson.egypt.nile-state','egypt-missing-prompts')$$,
  '23514','required prompt attempts missing','Egypt completion requires both configured prompts'
);

insert into public.understanding_prompt_attempts(learner_id,lesson_id,prompt_id,response) values
 (auth.uid(),'lesson.egypt.nile-state','prompt.egypt.palette-supported-claim','{}'),
 (auth.uid(),'lesson.egypt.nile-state','prompt.egypt.evidence-and-limit','{}');

select is((public.complete_lesson_and_acquire_card('lesson.egypt.nile-state','egypt-complete-once')->>'completion'), 'newly-completed', 'Egypt completes explicitly');
select is((public.complete_lesson_and_acquire_card('lesson.egypt.nile-state','egypt-complete-once')->>'completion'), 'newly-completed', 'same command key returns the original Egypt result');
select is((public.complete_lesson_and_acquire_card('lesson.egypt.nile-state','egypt-complete-again')->>'completion'), 'already-completed', 'new command observes existing Egypt completion');
select is((public.complete_lesson_and_acquire_card('lesson.egypt.nile-state','egypt-card-again')->>'cardOwnership'), 'already-owned', 'Egypt card is granted only once');
select is((select count(*) from public.card_ownership where learner_id=auth.uid() and card_id='card.artifact.narmer-palette'), 1::bigint, 'one Narmer Palette card exists');
select is((select count(*) from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.egypt.nile-state' and status='completed'), 1::bigint, 'one Egypt completion row exists');
select is((select status from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.writing.early-systems'), 'in_progress', 'Egypt completion does not alter early writing');
select is((select count(*) from public.card_ownership where learner_id=auth.uid() and source_lesson_id='lesson.egypt.nile-state'), 1::bigint, 'Egypt completion owns exactly one lesson-sourced card');

select * from finish();
rollback;
