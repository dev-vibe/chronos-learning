begin;
create extension if not exists pgtap with schema extensions;
set local search_path=extensions,public;
select plan(5);

select has_table('public', 'lesson_section_exploration', 'cumulative exploration table exists');
select has_pk('public', 'lesson_section_exploration', 'exploration has a stable composite primary key');
select policies_are('public', 'lesson_section_exploration', array['section_exploration_insert','section_exploration_select'], 'exploration has only learner-owned policies');

insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at)
values ('33333333-3333-3333-3333-333333333333','00000000-0000-0000-0000-000000000000','authenticated','authenticated','ash54@example.invalid','',now(),now(),now());
set local role authenticated;
select set_config('request.jwt.claim.sub','33333333-3333-3333-3333-333333333333',true);
insert into public.learners(id) values(auth.uid());
insert into public.lesson_progress(learner_id,lesson_id) values(auth.uid(),'lesson.uruk.first-city');
insert into public.lesson_section_exploration(learner_id,lesson_id,section_id) values
 (auth.uid(),'lesson.uruk.first-city','section.uruk.masthead'),
 (auth.uid(),'lesson.uruk.first-city','section.uruk.water-food-and-labor');
insert into public.section_resume_state(learner_id,lesson_id,section_id) values
 (auth.uid(),'lesson.uruk.first-city','section.uruk.water-food-and-labor');

select is((select count(*) from public.lesson_section_exploration where learner_id=auth.uid()), 2::bigint, 'multiple explored sections survive together');
select is((select section_id from public.section_resume_state where learner_id=auth.uid()), 'section.uruk.water-food-and-labor', 'last meaningful resume remains separate');

select * from finish();
rollback;
