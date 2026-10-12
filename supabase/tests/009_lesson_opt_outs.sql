begin;
create extension if not exists pgtap with schema extensions;
set local search_path=extensions,public;
select plan(21);

-- A kid, a linked parent, a stranger, and a shared sign-in with a kid profile.
insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at)
values
 ('91919191-9191-4919-a919-919191919191','00000000-0000-0000-0000-000000000000','authenticated','authenticated','optout-kid@example.invalid','',now(),now(),now()),
 ('92929292-9292-4929-a929-929292929292','00000000-0000-0000-0000-000000000000','authenticated','authenticated','optout-parent@example.invalid','',now(),now(),now()),
 ('93939393-9393-4939-a939-939393939393','00000000-0000-0000-0000-000000000000','authenticated','authenticated','optout-stranger@example.invalid','',now(),now(),now()),
 ('94949494-9494-4949-a949-949494949494','00000000-0000-0000-0000-000000000000','authenticated','authenticated','optout-shared@example.invalid','',now(),now(),now());

create temporary table fixture(name text primary key, value text);
grant all on fixture to authenticated;
set local role authenticated;

-- Anonymous calls are rejected.
select set_config('request.jwt.claim.sub','',true);
select throws_ok($$select public.set_lesson_opt_out('91919191-9191-4919-a919-919191919191','lesson.writing.early-systems',true)$$, '28000', 'authentication required', 'opting out requires sign-in');

-- The kid finishes one lesson and shares a link code.
select set_config('request.jwt.claim.sub','91919191-9191-4919-a919-919191919191',true);
insert into public.learners(id, display_name) values (auth.uid(), 'Kid');
insert into fixture values ('code', public.learner_link_code());
select lives_ok($$select public.submit_lesson('lesson.uruk.first-city','{"prompt.uruk.administration-evidence":"Tablets tracked grain."}','[]')$$, 'the kid finishes a lesson');

-- The linked parent manages the kid's curriculum.
select set_config('request.jwt.claim.sub','92929292-9292-4929-a929-929292929292',true);
select lives_ok(format('select public.link_learner(%L)', (select value from fixture where name='code')), 'the parent links the kid');
select lives_ok($$select public.set_lesson_opt_out('91919191-9191-4919-a919-919191919191','lesson.writing.early-systems',true)$$, 'the parent skips an unfinished lesson');
select is((select count(*) from public.lesson_opt_outs where learner_id='91919191-9191-4919-a919-919191919191'), 1::bigint, 'the parent sees the opt-out');
select is((select opted_out_by from public.lesson_opt_outs where learner_id='91919191-9191-4919-a919-919191919191'), '92929292-9292-4929-a929-929292929292'::uuid, 'the opt-out records who made it');
select lives_ok($$select public.set_lesson_opt_out('91919191-9191-4919-a919-919191919191','lesson.writing.early-systems',true)$$, 'skipping twice is harmless');
select is((select count(*) from public.lesson_opt_outs where learner_id='91919191-9191-4919-a919-919191919191'), 1::bigint, 'there is still one opt-out');
select throws_ok($$select public.set_lesson_opt_out('91919191-9191-4919-a919-919191919191','lesson.uruk.first-city',true)$$, '22023', 'finished lessons cannot be skipped', 'a finished lesson cannot be skipped');
select throws_ok($$select public.set_lesson_opt_out('91919191-9191-4919-a919-919191919191','Not A Lesson!',true)$$, '22023', 'invalid lesson', 'a malformed lesson id is refused');
select lives_ok($$select public.set_lesson_opt_out('91919191-9191-4919-a919-919191919191','lesson.writing.early-systems',false)$$, 'the parent restores the lesson');
select is((select count(*) from public.lesson_opt_outs where learner_id='91919191-9191-4919-a919-919191919191'), 0::bigint, 'the opt-out is gone');
select lives_ok($$select public.set_lesson_opt_out('91919191-9191-4919-a919-919191919191','lesson.writing.early-systems',true)$$, 'the parent skips it again');

-- The kid sees the result but cannot change it.
select set_config('request.jwt.claim.sub','91919191-9191-4919-a919-919191919191',true);
select is((select count(*) from public.lesson_opt_outs), 1::bigint, 'the kid sees their lesson was skipped');
select throws_ok($$select public.set_lesson_opt_out(auth.uid(),'lesson.writing.early-systems',false)$$, '42501', 'not linked to this learner', 'a kid cannot restore a skipped lesson');
select throws_ok($$insert into public.lesson_opt_outs(learner_id,lesson_id) values (auth.uid(),'lesson.other')$$, '42501', null, 'a kid cannot write opt-outs directly');
select throws_ok($$delete from public.lesson_opt_outs where learner_id=auth.uid()$$, '42501', null, 'a kid cannot delete opt-outs directly');

-- A stranger sees nothing and changes nothing.
select set_config('request.jwt.claim.sub','93939393-9393-4939-a939-939393939393',true);
select is((select count(*) from public.lesson_opt_outs), 0::bigint, 'a stranger cannot see opt-outs');
select throws_ok($$select public.set_lesson_opt_out('91919191-9191-4919-a919-919191919191','lesson.writing.early-systems',false)$$, '42501', 'not linked to this learner', 'a stranger cannot change a kid''s curriculum');

-- A shared sign-in manages its own kid profiles, but not itself.
select set_config('request.jwt.claim.sub','94949494-9494-4949-a949-949494949494',true);
insert into fixture values ('sam', public.add_learner_profile('Sam')->>'id');
select lives_ok(format('select public.set_lesson_opt_out(%L::uuid,%L,true)', (select value from fixture where name='sam'), 'lesson.writing.early-systems'), 'a shared sign-in skips a lesson for a kid profile');
select throws_ok($$select public.set_lesson_opt_out(auth.uid(),'lesson.writing.early-systems',true)$$, '42501', 'not linked to this learner', 'a sign-in never skips lessons for its own learner');

select * from finish();
rollback;
