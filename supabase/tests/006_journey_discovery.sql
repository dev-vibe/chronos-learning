begin;
create extension if not exists pgtap with schema extensions;
set local search_path=extensions,public;
select plan(16);

select has_table('public', 'learner_journeys', 'learner journey state table exists');
select has_table('public', 'learner_navigation_state', 'active journey pointer table exists');
select has_table('public', 'learner_invitation_states', 'invitation action state table exists');
select has_pk('public', 'learner_journeys', 'journey state has learner and journey primary key');
select has_pk('public', 'learner_navigation_state', 'navigation state has learner primary key');
select has_pk('public', 'learner_invitation_states', 'invitation state has learner and invitation primary key');
select policies_are('public', 'learner_journeys', array['learner_journeys_insert','learner_journeys_select','learner_journeys_update'], 'journey state exposes only learner-owned policies');
select policies_are('public', 'learner_navigation_state', array['learner_navigation_insert','learner_navigation_select','learner_navigation_update'], 'navigation state exposes only learner-owned policies');
select policies_are('public', 'learner_invitation_states', array['learner_invitation_states_insert','learner_invitation_states_select','learner_invitation_states_update'], 'invitation state exposes only learner-owned policies');

insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at)
values
 ('55555555-5555-5555-5555-555555555555','00000000-0000-0000-0000-000000000000','authenticated','authenticated','ash55-a@example.invalid','',now(),now(),now()),
 ('66666666-6666-6666-6666-666666666666','00000000-0000-0000-0000-000000000000','authenticated','authenticated','ash55-b@example.invalid','',now(),now(),now());
insert into public.learners(id) values
 ('55555555-5555-5555-5555-555555555555'),
 ('66666666-6666-6666-6666-666666666666');

set local role authenticated;
select set_config('request.jwt.claim.sub','55555555-5555-5555-5555-555555555555',true);

select is((select count(*) from public.journeys), 1::bigint, 'authenticated catalog exposes only the published World History journey');
select is((select count(*) from public.journey_entries), 2::bigint, 'authenticated catalog excludes the draft farming entry');

insert into public.learner_journeys(learner_id,journey_id,status,active_lesson_id)
values(auth.uid(),'journey.world-history','open','lesson.uruk.first-city');
insert into public.learner_navigation_state(learner_id,active_journey_id)
values(auth.uid(),'journey.world-history');
insert into public.learner_invitation_states(learner_id,invitation_id,action)
values(auth.uid(),'invitation.fixture.test','dismissed');

select is((select status from public.learner_journeys where learner_id=auth.uid()), 'open', 'learner can read owned journey state');
select is((select active_journey_id from public.learner_navigation_state where learner_id=auth.uid()), 'journey.world-history', 'learner can read owned navigation state');
select is((select action from public.learner_invitation_states where learner_id=auth.uid()), 'dismissed', 'learner can persist invitation dismissal');

select throws_ok(
  $$update public.learner_journeys set learner_id='66666666-6666-6666-6666-666666666666' where learner_id=auth.uid()$$,
  '42501',
  'new row violates row-level security policy for table "learner_journeys"',
  'update WITH CHECK prevents transferring journey state to another learner'
);

select set_config('request.jwt.claim.sub','66666666-6666-6666-6666-666666666666',true);
select is((select count(*) from public.learner_journeys), 0::bigint, 'another learner cannot read journey state');

select * from finish();
rollback;
