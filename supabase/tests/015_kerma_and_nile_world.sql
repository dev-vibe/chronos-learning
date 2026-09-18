begin;
create extension if not exists pgtap with schema extensions;
set local search_path=extensions,public;
select plan(17);

insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at)
values ('69c4a970-4af3-499d-a891-84efe3465a66','00000000-0000-0000-0000-000000000000','authenticated','authenticated','publish-kerma_and_nile_world@example.invalid','',now(),now(),now());

select ok((select published_at is not null from public.content_lessons where id='lesson.nubia.kerma-and-nile-world'), 'lesson is published');
select ok((select completion_enabled from public.lesson_completion_configuration where lesson_id='lesson.nubia.kerma-and-nile-world'), 'completion is enabled');
select is((select count(*) from public.lesson_required_prompts where lesson_id='lesson.nubia.kerma-and-nile-world'), 2::bigint, 'required prompt count');
select is((select count(*) from public.card_unlocks where lesson_id='lesson.nubia.kerma-and-nile-world'), 0::bigint, 'card unlock count');
select is((select position from public.journey_entries where id='entry.world-history.kerma-and-nile-world'), 11, 'journey position');
select is((select required from public.journey_entries where id='entry.world-history.kerma-and-nile-world'), true, 'required entry');
select is((select count(*) from public.legacy_id_aliases where canonical_id='lesson.nubia.kerma-and-nile-world' and not semantic_equivalence_approved), 1::bigint, 'legacy aliases do not transfer completion');

set local role authenticated;
select set_config('request.jwt.claim.sub','69c4a970-4af3-499d-a891-84efe3465a66',true);
insert into public.learners(id) values(auth.uid());
insert into public.lesson_progress(learner_id,lesson_id) values
 (auth.uid(),'lesson.nubia.kerma-and-nile-world'),
 (auth.uid(),'lesson.indus.cities-and-signs');

select throws_ok(
  $$select public.complete_lesson_and_acquire_card('lesson.nubia.kerma-and-nile-world','kerma-and-nile-world-missing-prompts')$$,
  '23514','required prompt attempts missing','rejects completion without attempts'
);
insert into public.understanding_prompt_attempts(learner_id,lesson_id,prompt_id,response) values
 (auth.uid(),'lesson.nubia.kerma-and-nile-world','prompt.kerma.contact-and-rule','{}');
select throws_ok(
  $$select public.complete_lesson_and_acquire_card('lesson.nubia.kerma-and-nile-world','kerma-and-nile-world-one-prompt')$$,
  '23514','required prompt attempts missing','rejects completion with a partial attempt'
);
insert into public.understanding_prompt_attempts(learner_id,lesson_id,prompt_id,response) values
 (auth.uid(),'lesson.nubia.kerma-and-nile-world','prompt.kerma.work-and-power','{}');

select is((public.complete_lesson_and_acquire_card('lesson.nubia.kerma-and-nile-world','kerma-and-nile-world-complete-once')->>'completion'), 'newly-completed', 'completes explicitly');
select is((public.complete_lesson_and_acquire_card('lesson.nubia.kerma-and-nile-world','kerma-and-nile-world-complete-once')->>'completion'), 'newly-completed', 'same command key returns the original result');
select is((public.complete_lesson_and_acquire_card('lesson.nubia.kerma-and-nile-world','kerma-and-nile-world-complete-again')->>'completion'), 'already-completed', 'new command observes existing completion');
select is((public.complete_lesson_and_acquire_card('lesson.nubia.kerma-and-nile-world','kerma-and-nile-world-no-card')->>'cardOwnership'), 'not-configured', 'no-card response is explicit');
select is((public.complete_lesson_and_acquire_card('lesson.nubia.kerma-and-nile-world','kerma-and-nile-world-card-array')->'cardIds'), '[]'::jsonb, 'card list is empty');
select is((select count(*) from public.card_ownership where learner_id=auth.uid()), 0::bigint, 'completion grants no cards');
select is((select count(*) from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.nubia.kerma-and-nile-world' and status='completed'), 1::bigint, 'one completion row exists');
select is((select status from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.indus.cities-and-signs'), 'in_progress', 'completion leaves the previous lesson unchanged');

select * from finish();
rollback;
