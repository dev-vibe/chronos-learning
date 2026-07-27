begin;
create extension if not exists pgtap with schema extensions;
set local search_path=extensions,public;
select plan(12);

insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at)
values ('99999999-9999-9999-9999-999999999999','00000000-0000-0000-0000-000000000000','authenticated','authenticated','ash73@example.invalid','',now(),now(),now());

select ok((select published_at is not null from public.content_lessons where id='lesson.humans.migrations-and-interbreeding'), 'ancient DNA lesson is published');
select ok((select completion_enabled from public.lesson_completion_configuration where lesson_id='lesson.humans.migrations-and-interbreeding'), 'ancient DNA completion is enabled');
select is((select count(*) from public.lesson_required_prompts where lesson_id='lesson.humans.migrations-and-interbreeding'), 2::bigint, 'ancient DNA has two required prompts');
select is((select count(*) from public.card_unlocks where lesson_id='lesson.humans.migrations-and-interbreeding'), 1::bigint, 'ancient DNA unlocks one card');
select is((select string_agg(card_id,',' order by position) from public.card_unlocks where lesson_id='lesson.humans.migrations-and-interbreeding'), 'card.people.neanderthals', 'card selection is deterministic');
select is((select position from public.journey_entries where id='entry.world-history.migrations-and-interbreeding'), 1, 'ancient DNA follows Origins');
select is((select position from public.journey_entries where id='entry.world-history.farming'), 2, 'later entries shift without changing identity');

set local role authenticated;
select set_config('request.jwt.claim.sub','99999999-9999-9999-9999-999999999999',true);
insert into public.learners(id) values(auth.uid());
insert into public.lesson_progress(learner_id,lesson_id)
values (auth.uid(),'lesson.humans.migrations-and-interbreeding');

select throws_ok(
  $$select public.complete_lesson_and_acquire_card('lesson.humans.migrations-and-interbreeding','ancient-dna-missing')$$,
  '23514','required prompt attempts missing','completion requires both configured prompts'
);

insert into public.understanding_prompt_attempts(learner_id,lesson_id,prompt_id,response) values
 (auth.uid(),'lesson.humans.migrations-and-interbreeding','prompt.humans.long-segments-inference','{}'),
 (auth.uid(),'lesson.humans.migrations-and-interbreeding','prompt.humans.adna-evidence-and-limit','{}');

select is((public.complete_lesson_and_acquire_card('lesson.humans.migrations-and-interbreeding','ancient-dna-complete')->>'completion'), 'newly-completed', 'lesson completes explicitly');
select is((public.complete_lesson_and_acquire_card('lesson.humans.migrations-and-interbreeding','ancient-dna-complete')->'cardIds')::text, '["card.people.neanderthals"]', 'same command returns the card');
select is((select count(*) from public.card_ownership where learner_id=auth.uid() and source_lesson_id='lesson.humans.migrations-and-interbreeding'), 1::bigint, 'the card is owned once');
select is((public.complete_lesson_and_acquire_card('lesson.humans.migrations-and-interbreeding','ancient-dna-again')->>'cardOwnership'), 'already-owned', 'a new command does not duplicate the card');

select * from finish();
rollback;
