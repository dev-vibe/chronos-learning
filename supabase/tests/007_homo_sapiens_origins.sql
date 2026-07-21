begin;
create extension if not exists pgtap with schema extensions;
set local search_path=extensions,public;
select plan(13);

insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at)
values ('77777777-7777-7777-7777-777777777777','00000000-0000-0000-0000-000000000000','authenticated','authenticated','human-origins@example.invalid','',now(),now(),now());

select ok((select published_at is not null from public.content_lessons where id='lesson.humans.homo-sapiens-origins'), 'Human Origins lesson is published');
select is((select position from public.journey_entries where id='entry.world-history.human-origins'), 0, 'Human Origins is the first World History entry');
select is((select position from public.journey_entries where id='entry.world-history.uruk'), 2, 'existing World History entries shift without changing identity');
select ok((select completion_enabled from public.lesson_completion_configuration where lesson_id='lesson.humans.homo-sapiens-origins'), 'Human Origins completion is enabled');
select is((select count(*) from public.lesson_required_prompts where lesson_id='lesson.humans.homo-sapiens-origins'), 2::bigint, 'Human Origins has two required prompts');
select is((select card_id from public.card_unlocks where lesson_id='lesson.humans.homo-sapiens-origins'), 'card.idea.shared-african-origins', 'Human Origins unlocks its Foundation card');

set local role authenticated;
select set_config('request.jwt.claim.sub','77777777-7777-7777-7777-777777777777',true);
insert into public.learners(id) values(auth.uid());
insert into public.lesson_progress(learner_id,lesson_id)
values (auth.uid(),'lesson.humans.homo-sapiens-origins');

select throws_ok(
  $$select public.complete_lesson_and_acquire_card('lesson.humans.homo-sapiens-origins','origins-missing-prompts')$$,
  '23514','required prompt attempts missing','Human Origins completion requires sincere attempts'
);

insert into public.understanding_prompt_attempts(learner_id,lesson_id,prompt_id,response) values
 (auth.uid(),'lesson.humans.homo-sapiens-origins','prompt.human-origins.best-supported-model','{}'),
 (auth.uid(),'lesson.humans.homo-sapiens-origins','prompt.human-origins.evidence-and-limit','{}');

select is((public.complete_lesson_and_acquire_card('lesson.humans.homo-sapiens-origins','origins-complete-once')->>'completion'), 'newly-completed', 'Human Origins completes explicitly');
select is((public.complete_lesson_and_acquire_card('lesson.humans.homo-sapiens-origins','origins-complete-once')->>'completion'), 'newly-completed', 'same key returns the original result');
select is((public.complete_lesson_and_acquire_card('lesson.humans.homo-sapiens-origins','origins-complete-again')->>'completion'), 'already-completed', 'a new key observes existing completion');
select is((select count(*) from public.card_ownership where learner_id=auth.uid() and card_id='card.idea.shared-african-origins'), 1::bigint, 'one Shared African Origins card exists');
select is((select status from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.humans.homo-sapiens-origins'), 'completed', 'Human Origins progress is complete');
select is((select count(*) from public.card_ownership where learner_id=auth.uid() and card_id='card.place.uruk'), 0::bigint, 'Human Origins does not grant the Uruk card');

select * from finish();
rollback;
