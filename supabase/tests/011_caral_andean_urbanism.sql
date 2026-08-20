begin;
create extension if not exists pgtap with schema extensions;
set local search_path=extensions,public;
select plan(15);

insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','ash98@example.invalid','',now(),now(),now());

select ok((select published_at is not null from public.content_lessons where id='lesson.caral.andean-urbanism'), 'Caral lesson is published');
select ok((select completion_enabled from public.lesson_completion_configuration where lesson_id='lesson.caral.andean-urbanism'), 'Caral completion is enabled');
select is((select count(*) from public.lesson_required_prompts where lesson_id='lesson.caral.andean-urbanism'), 2::bigint, 'Caral has two required prompts');
select is((select card_id from public.card_unlocks where lesson_id='lesson.caral.andean-urbanism' and position=0), 'card.place.caral', 'Caral deterministically unlocks the Place card');
select is((select position from public.journey_entries where id='entry.world-history.caral-andean-urbanism'), 7, 'Caral follows Egypt in the durable World History order');
select is((select count(*) from public.legacy_id_aliases where canonical_id='lesson.caral.andean-urbanism' and semantic_equivalence_approved), 1::bigint, 'the reviewed legacy alias resolves to Caral');

set local role authenticated;
select set_config('request.jwt.claim.sub','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',true);
insert into public.learners(id) values(auth.uid());
insert into public.lesson_progress(learner_id,lesson_id) values
 (auth.uid(),'lesson.caral.andean-urbanism'),
 (auth.uid(),'lesson.egypt.nile-state');

select throws_ok(
  $$select public.complete_lesson_and_acquire_card('lesson.caral.andean-urbanism','caral-missing-prompts')$$,
  '23514','required prompt attempts missing','Caral completion requires both configured prompts'
);

insert into public.understanding_prompt_attempts(learner_id,lesson_id,prompt_id,response) values
 (auth.uid(),'lesson.caral.andean-urbanism','prompt.caral.supported-model','{}'),
 (auth.uid(),'lesson.caral.andean-urbanism','prompt.caral.evidence-and-limit','{}');

select is((public.complete_lesson_and_acquire_card('lesson.caral.andean-urbanism','caral-complete-once')->>'completion'), 'newly-completed', 'Caral completes explicitly');
select is((public.complete_lesson_and_acquire_card('lesson.caral.andean-urbanism','caral-complete-once')->>'completion'), 'newly-completed', 'same command key returns the original Caral result');
select is((public.complete_lesson_and_acquire_card('lesson.caral.andean-urbanism','caral-complete-again')->>'completion'), 'already-completed', 'new command observes existing Caral completion');
select is((public.complete_lesson_and_acquire_card('lesson.caral.andean-urbanism','caral-card-again')->>'cardOwnership'), 'already-owned', 'Caral card is granted only once');
select is((select count(*) from public.card_ownership where learner_id=auth.uid() and card_id='card.place.caral'), 1::bigint, 'one Caral Place card exists');
select is((select count(*) from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.caral.andean-urbanism' and status='completed'), 1::bigint, 'one Caral completion row exists');
select is((select status from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.egypt.nile-state'), 'in_progress', 'Caral completion does not alter Egypt');
select is((select count(*) from public.card_ownership where learner_id=auth.uid() and source_lesson_id='lesson.caral.andean-urbanism'), 1::bigint, 'Caral completion owns exactly one lesson-sourced card');

select * from finish();
rollback;
