begin;
create extension if not exists pgtap with schema extensions;
set local search_path=extensions,public;
select plan(29);

-- A parent's sign-in holding two kid profiles, and a stranger.
insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at)
values
 ('aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa','00000000-0000-0000-0000-000000000000','authenticated','authenticated','shared-parent@example.invalid','',now(),now(),now()),
 ('bbbbbbbb-bbbb-4bbb-abbb-bbbbbbbbbbbb','00000000-0000-0000-0000-000000000000','authenticated','authenticated','shared-stranger@example.invalid','',now(),now(),now());

create temporary table fixture(name text primary key, value text);
grant all on fixture to authenticated;
set local role authenticated;

select set_config('request.jwt.claim.sub','aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',true);
insert into fixture values ('sam', public.add_learner_profile('  Sam ')->>'id');
insert into fixture values ('alex', public.add_learner_profile('Alex')->>'id');
select is((select display_name from public.learners where id=(select value from fixture where name='sam')::uuid), 'Sam', 'a kid profile needs only a name');
select is((select account_setup from public.learners where id=auth.uid()), 'shared', 'adding a kid marks the account as shared');
select is((select count(*) from public.learners where account_id=auth.uid() and id<>auth.uid()), 2::bigint, 'the account sees both kid profiles');
select throws_ok($$select public.add_learner_profile('   ')$$, '22023', 'a name is required', 'a profile needs a name');

-- The account acts as a kid: progress, attempts and submission go to the kid.
insert into public.lesson_progress(learner_id,lesson_id) values ((select value from fixture where name='sam')::uuid,'lesson.uruk.first-city');
insert into public.understanding_prompt_attempts(learner_id,lesson_id,prompt_id,response)
values ((select value from fixture where name='sam')::uuid,'lesson.uruk.first-city','prompt.uruk.administration-evidence','{"answer":"option.uruk.tablets"}');
select is((public.submit_lesson('lesson.uruk.first-city','{"prompt.uruk.administration-evidence":"option.uruk.tablets"}',(select value from fixture where name='sam')::uuid)->>'status'), 'submitted', 'a kid profile submits through the shared sign-in');
select is((select count(*) from public.lesson_submissions where learner_id=auth.uid()), 0::bigint, 'the submission belongs to the kid, not the parent');
select is((select count(*) from public.lesson_progress where learner_id=(select value from fixture where name='alex')::uuid), 0::bigint, 'siblings keep separate progress');

-- Parent view reviews the kid on the same account without a link code.
select is((public.review_submission((select value from fixture where name='sam')::uuid,'lesson.uruk.first-city','pass','Nice!',array['card.place.uruk'])->>'status'), 'passed', 'the parent passes a kid on the shared account');
select is((select count(*) from public.card_ownership where learner_id=(select value from fixture where name='sam')::uuid), 1::bigint, 'the kid profile owns the card');
select is((select count(*) from public.card_ownership where learner_id=auth.uid()), 0::bigint, 'the parent does not get the card');
select lives_ok(format('select public.acknowledge_pass(%L,%L::uuid)', 'lesson.uruk.first-city', (select value from fixture where name='sam')), 'the kid view acknowledges the pass');
select isnt((select pass_seen_at from public.lesson_submissions where learner_id=(select value from fixture where name='sam')::uuid), null, 'the celebration is recorded on the kid');
select throws_ok($$select public.review_submission(auth.uid(),'lesson.uruk.first-city','pass')$$, '42501', 'not linked to this learner', 'a sign-in never reviews its own learner');

-- A stranger cannot see or act for the profiles.
select set_config('request.jwt.claim.sub','bbbbbbbb-bbbb-4bbb-abbb-bbbbbbbbbbbb',true);
select is((select count(*) from public.learners where id=(select value from fixture where name='sam')::uuid), 0::bigint, 'a stranger cannot see a kid profile');
select is((select count(*) from public.lesson_submissions), 0::bigint, 'a stranger cannot see a kid''s work');
select throws_ok(format('select public.submit_lesson(%L,%L::jsonb,%L::uuid)', 'lesson.uruk.first-city', '{}', (select value from fixture where name='sam')), '42501', 'not allowed to act for this learner', 'a stranger cannot submit as a kid');
select throws_ok(format('insert into public.lesson_progress(learner_id,lesson_id) values (%L::uuid,%L)', (select value from fixture where name='sam'), 'lesson.writing.early-systems'), '42501', null, 'a stranger cannot write a kid''s progress');
select throws_ok(format('select public.remove_learner_profile(%L::uuid)', (select value from fixture where name='sam')), '22023', 'profile not found', 'a stranger cannot remove a kid profile');
select throws_ok(format('select public.review_submission(%L::uuid,%L,%L)', (select value from fixture where name='sam'), 'lesson.uruk.first-city', 'return'), '42501', 'not linked to this learner', 'a stranger cannot review a kid');

-- The optional parent-view PIN.
select set_config('request.jwt.claim.sub','aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',true);
select is(public.parent_pin_enabled(), false, 'the PIN is off by default');
select ok(public.verify_parent_pin(null), 'with no PIN, parent view opens');
select throws_ok($$select public.set_parent_pin('12a4')$$, '22023', 'the PIN must be 4 digits', 'a PIN is four digits');
select public.set_parent_pin('2468');
select is(public.parent_pin_enabled(), true, 'the parent turns the PIN on');
select is(public.verify_parent_pin('1111'), false, 'a wrong PIN is refused');
select is(public.verify_parent_pin('2468'), true, 'the right PIN opens parent view');
select is((select public.verify_parent_pin('0000') from generate_series(1,5) offset 4), false, 'five wrong tries in a row');
select throws_ok($$select public.verify_parent_pin('2468')$$, '22023', 'too many tries', 'then the PIN locks for a while');
select public.set_parent_pin(null);
select is(public.parent_pin_enabled(), false, 'the parent turns the PIN off');

-- Removing a kid removes that kid's progress and cards only.
select public.remove_learner_profile((select value from fixture where name='sam')::uuid);
select is((select count(*) from public.card_ownership), 0::bigint, 'removing a kid removes their cards');

select * from finish();
rollback;
