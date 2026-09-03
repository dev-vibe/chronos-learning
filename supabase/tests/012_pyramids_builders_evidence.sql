begin;
create extension if not exists pgtap with schema extensions;
set local search_path=extensions,public;
select plan(17);

insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at)
values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','00000000-0000-0000-0000-000000000000','authenticated','authenticated','ash99@example.invalid','',now(),now(),now());

select ok((select published_at is not null from public.content_lessons where id='lesson.egypt.pyramids-and-state-labor'), 'Egypt evidence lesson is published');
select ok((select completion_enabled from public.lesson_completion_configuration where lesson_id='lesson.egypt.pyramids-and-state-labor'), 'Egypt completion is enabled');
select is((select count(*) from public.lesson_required_prompts where lesson_id='lesson.egypt.pyramids-and-state-labor'), 2::bigint, 'Egypt has two required prompts');
select is((select count(*) from public.card_unlocks where lesson_id='lesson.egypt.pyramids-and-state-labor'), 0::bigint, 'Egypt has no card unlock');
select is((select position from public.journey_entries where id='entry.world-history.pyramids-and-state-labor'), 8, 'Egypt evidence follows Caral');
select is((select count(*) from public.legacy_id_aliases where canonical_id='lesson.egypt.pyramids-and-state-labor' and not semantic_equivalence_approved), 2::bigint, 'both legacy aliases prohibit completion transfer');

set local role authenticated;
select set_config('request.jwt.claim.sub','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',true);
insert into public.learners(id) values(auth.uid());
insert into public.lesson_progress(learner_id,lesson_id) values
 (auth.uid(),'lesson.egypt.pyramids-and-state-labor'),
 (auth.uid(),'lesson.caral.andean-urbanism');

select throws_ok(
  $$select public.complete_lesson_and_acquire_card('lesson.egypt.pyramids-and-state-labor','egypt-missing-prompts')$$,
  '23514','required prompt attempts missing','Egypt rejects completion without attempts'
);
insert into public.understanding_prompt_attempts(learner_id,lesson_id,prompt_id,response) values
 (auth.uid(),'lesson.egypt.pyramids-and-state-labor','prompt.pyramids.context-and-phase','{}');
select throws_ok(
  $$select public.complete_lesson_and_acquire_card('lesson.egypt.pyramids-and-state-labor','egypt-one-prompt')$$,
  '23514','required prompt attempts missing','Egypt rejects completion with only one attempt'
);
insert into public.understanding_prompt_attempts(learner_id,lesson_id,prompt_id,response) values
 (auth.uid(),'lesson.egypt.pyramids-and-state-labor','prompt.pyramids.build-evidence-chain','{}');

select is((public.complete_lesson_and_acquire_card('lesson.egypt.pyramids-and-state-labor','egypt-complete-once')->>'completion'), 'newly-completed', 'Egypt completes explicitly');
select is((public.complete_lesson_and_acquire_card('lesson.egypt.pyramids-and-state-labor','egypt-complete-once')->>'completion'), 'newly-completed', 'same command key returns original result');
select is((public.complete_lesson_and_acquire_card('lesson.egypt.pyramids-and-state-labor','egypt-complete-again')->>'completion'), 'already-completed', 'new command observes existing completion');
select is((public.complete_lesson_and_acquire_card('lesson.egypt.pyramids-and-state-labor','egypt-no-card')->>'cardOwnership'), 'not-configured', 'no-card response is explicit');
select is((public.complete_lesson_and_acquire_card('lesson.egypt.pyramids-and-state-labor','egypt-card-array')->'cardIds'), '[]'::jsonb, 'card list is empty');
select is((select count(*) from public.card_ownership where learner_id=auth.uid()), 0::bigint, 'completion grants no cards');
select is((select count(*) from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.egypt.pyramids-and-state-labor' and status='completed'), 1::bigint, 'one Egypt completion row exists');
select is((select status from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.caral.andean-urbanism'), 'in_progress', 'Egypt completion leaves Caral unchanged');
select throws_ok(
  $$select public.complete_lesson_and_acquire_card('lesson.indus.cities-and-signs','indus-unpublished')$$,
  '22023','lesson is unpublished or completion is unsupported','Indus stays closed'
);

select * from finish();
rollback;
