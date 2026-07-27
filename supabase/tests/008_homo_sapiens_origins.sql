begin;
create extension if not exists pgtap with schema extensions;
set local search_path=extensions,public;
select plan(13);

insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at)
values ('88888888-8888-8888-8888-888888888888','00000000-0000-0000-0000-000000000000','authenticated','authenticated','ash72@example.invalid','',now(),now(),now());

select ok((select published_at is not null from public.content_lessons where id='lesson.humans.homo-sapiens-origins'), 'origins lesson is published');
select ok((select completion_enabled from public.lesson_completion_configuration where lesson_id='lesson.humans.homo-sapiens-origins'), 'origins completion is enabled');
select is((select count(*) from public.lesson_required_prompts where lesson_id='lesson.humans.homo-sapiens-origins'), 2::bigint, 'origins has two data-driven required prompts');
select is((select card_id from public.card_unlocks where lesson_id='lesson.humans.homo-sapiens-origins'), 'card.idea.origins-across-africa', 'origins unlocks the idea card');

select is((select position from public.journey_entries where id='entry.world-history.homo-sapiens-origins'), 0, 'World History opens at canonical Spine position 1');
select is((select position from public.journey_entries where id='entry.world-history.farming'), 2, 'later publication shifts existing entries without changing identity');
select is((select position from public.journey_entries where id='entry.world-history.writing'), 4, 'later publication preserves the original relative order');

set local role authenticated;
select set_config('request.jwt.claim.sub','88888888-8888-8888-8888-888888888888',true);
insert into public.learners(id) values(auth.uid());
insert into public.lesson_progress(learner_id,lesson_id) values
 (auth.uid(),'lesson.humans.homo-sapiens-origins'),
 (auth.uid(),'lesson.farming.settlements');

select throws_ok(
  $$select public.complete_lesson_and_acquire_card('lesson.humans.homo-sapiens-origins','origins-missing-prompts')$$,
  '23514','required prompt attempts missing','origins completion requires its configured prompts'
);

insert into public.understanding_prompt_attempts(learner_id,lesson_id,prompt_id,response) values
 (auth.uid(),'lesson.humans.homo-sapiens-origins','prompt.humans.best-supported-conclusion','{}'),
 (auth.uid(),'lesson.humans.homo-sapiens-origins','prompt.humans.evidence-and-limit','{}');

select is((public.complete_lesson_and_acquire_card('lesson.humans.homo-sapiens-origins','origins-complete-once')->>'completion'), 'newly-completed', 'origins completes explicitly');
select is((public.complete_lesson_and_acquire_card('lesson.humans.homo-sapiens-origins','origins-complete-once')->>'completion'), 'newly-completed', 'same key returns the original origins result');
select is((public.complete_lesson_and_acquire_card('lesson.humans.homo-sapiens-origins','origins-complete-again')->>'completion'), 'already-completed', 'new key observes existing origins completion');
select is((select count(*) from public.card_ownership where learner_id=auth.uid() and card_id='card.idea.origins-across-africa'), 1::bigint, 'one origins card exists');
select is((select status from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.farming.settlements'), 'in_progress', 'origins completion does not alter farming');

select * from finish();
rollback;
