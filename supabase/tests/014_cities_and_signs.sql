begin;
create extension if not exists pgtap with schema extensions;
set local search_path=extensions,public;
select plan(17);

insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at)
values ('d784ae19-d1dd-443b-a689-ec6f60aacff7','00000000-0000-0000-0000-000000000000','authenticated','authenticated','publish-cities_and_signs@example.invalid','',now(),now(),now());

select ok((select published_at is not null from public.content_lessons where id='lesson.indus.cities-and-signs'), 'lesson is published');
select ok((select completion_enabled from public.lesson_completion_configuration where lesson_id='lesson.indus.cities-and-signs'), 'completion is enabled');
select is((select count(*) from public.lesson_required_prompts where lesson_id='lesson.indus.cities-and-signs'), 2::bigint, 'required prompt count');
select is((select count(*) from public.card_unlocks where lesson_id='lesson.indus.cities-and-signs'), 1::bigint, 'card unlock count');
select is((select position from public.journey_entries where id='entry.world-history.indus-cities-and-signs'), 10, 'journey position');
select is((select required from public.journey_entries where id='entry.world-history.indus-cities-and-signs'), true, 'required entry');
select is((select count(*) from public.legacy_id_aliases where canonical_id='lesson.indus.cities-and-signs' and not semantic_equivalence_approved), 2::bigint, 'legacy aliases do not transfer completion');

set local role authenticated;
select set_config('request.jwt.claim.sub','d784ae19-d1dd-443b-a689-ec6f60aacff7',true);
insert into public.learners(id) values(auth.uid());
insert into public.lesson_progress(learner_id,lesson_id) values
 (auth.uid(),'lesson.indus.cities-and-signs'),
 (auth.uid(),'lesson.egypt.pyramids-and-state-labor');

select throws_ok(
  $$select public.complete_lesson_and_acquire_card('lesson.indus.cities-and-signs','cities-and-signs-missing-prompts')$$,
  '23514','required prompt attempts missing','rejects completion without attempts'
);
insert into public.understanding_prompt_attempts(learner_id,lesson_id,prompt_id,response) values
 (auth.uid(),'lesson.indus.cities-and-signs','prompt.indus.shared-standards','{}');
select throws_ok(
  $$select public.complete_lesson_and_acquire_card('lesson.indus.cities-and-signs','cities-and-signs-one-prompt')$$,
  '23514','required prompt attempts missing','rejects completion with a partial attempt'
);
insert into public.understanding_prompt_attempts(learner_id,lesson_id,prompt_id,response) values
 (auth.uid(),'lesson.indus.cities-and-signs','prompt.indus.water-and-work','{}');

select is((public.complete_lesson_and_acquire_card('lesson.indus.cities-and-signs','cities-and-signs-complete-once')->>'completion'), 'newly-completed', 'completes explicitly');
select is((public.complete_lesson_and_acquire_card('lesson.indus.cities-and-signs','cities-and-signs-complete-once')->>'completion'), 'newly-completed', 'same command key returns the original result');
select is((public.complete_lesson_and_acquire_card('lesson.indus.cities-and-signs','cities-and-signs-complete-again')->>'completion'), 'already-completed', 'new command observes existing completion');
select is((public.complete_lesson_and_acquire_card('lesson.indus.cities-and-signs','cities-and-signs-card-again')->>'cardOwnership'), 'already-owned', 'card is granted only once');
select is((select count(*) from public.card_ownership where learner_id=auth.uid() and card_id='card.indus.stamp-seal'), 1::bigint, 'one card exists');
select is((select count(*) from public.card_ownership where learner_id=auth.uid() and source_lesson_id='lesson.indus.cities-and-signs'), 1::bigint, 'lesson-sourced card count');
select is((select count(*) from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.indus.cities-and-signs' and status='completed'), 1::bigint, 'one completion row exists');
select is((select status from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.egypt.pyramids-and-state-labor'), 'in_progress', 'completion leaves the previous lesson unchanged');

select * from finish();
rollback;
