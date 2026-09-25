begin;
create extension if not exists pgtap with schema extensions;
set local search_path=extensions,public;
select plan(38);

-- Kid, parent, a stranger and a second kid.
insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at)
values
 ('11111111-1111-4111-a111-111111111111','00000000-0000-0000-0000-000000000000','authenticated','authenticated','review-kid@example.invalid','',now(),now(),now()),
 ('22222222-2222-4222-a222-222222222222','00000000-0000-0000-0000-000000000000','authenticated','authenticated','review-parent@example.invalid','',now(),now(),now()),
 ('33333333-3333-4333-a333-333333333333','00000000-0000-0000-0000-000000000000','authenticated','authenticated','review-stranger@example.invalid','',now(),now(),now()),
 ('44444444-4444-4444-a444-444444444444','00000000-0000-0000-0000-000000000000','authenticated','authenticated','review-kid-two@example.invalid','',now(),now(),now());

create temporary table fixture(name text primary key, value text);
grant all on fixture to authenticated;

set local role authenticated;

-- Anonymous calls are rejected.
select set_config('request.jwt.claim.sub','',true);
select throws_ok($$select public.submit_lesson('lesson.uruk.first-city','{}')$$, '28000', 'authentication required', 'submitting requires sign-in');

-- The kid gets a stable link code.
select set_config('request.jwt.claim.sub','11111111-1111-4111-a111-111111111111',true);
insert into public.learners(id, display_name) values (auth.uid(), 'Kid');
insert into fixture values ('code', public.learner_link_code());
select matches((select value from fixture where name='code'), '^[A-HJ-NP-Z2-9]{8}$', 'link code is eight unambiguous characters');
select is(public.learner_link_code(), (select value from fixture where name='code'), 'link code is stable until rotated');
select isnt(public.learner_link_code(true), (select value from fixture where name='code'), 'rotating issues a new code');
update fixture set value = public.learner_link_code() where name='code';

-- Submitting finishes the lesson and waits for review.
select is((public.submit_lesson('lesson.uruk.first-city','{"prompt.uruk.administration-evidence":"Tablets tracked grain."}')->>'status'), 'submitted', 'submission waits for review');
select is((select status from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.uruk.first-city'), 'completed', 'submitting finishes the lesson');
select is((public.submit_lesson('lesson.uruk.first-city','{"prompt.uruk.administration-evidence":"Tablets tracked grain and beer."}')->>'round')::int, 1, 'editing while waiting keeps the round');
select is((select answers->>'prompt.uruk.administration-evidence' from public.lesson_submissions where learner_id=auth.uid()), 'Tablets tracked grain and beer.', 'the latest answers are kept');
select throws_ok($$select public.submit_lesson('lesson.uruk.first-city','{"prompt.x":1}')$$, '22023', 'answers must map prompt ids to text', 'answers must be text');

-- The kid cannot review, grant cards or change status directly.
select throws_ok($$select public.review_submission(auth.uid(),'lesson.uruk.first-city','pass')$$, '42501', 'not linked to this learner', 'a kid cannot pass their own work');
select throws_ok($$update public.lesson_submissions set status='passed' where learner_id=auth.uid()$$, '42501', null, 'a kid cannot change status directly');
select throws_ok($$insert into public.lesson_submissions(learner_id,lesson_id,status,answers,reviewed_at) values (auth.uid(),'lesson.x','passed','{}',now())$$, '42501', null, 'a kid cannot insert a passed submission');
select throws_ok($$insert into public.card_ownership(learner_id,card_id,source_lesson_id) values (auth.uid(),'card.place.uruk','lesson.uruk.first-city')$$, '42501', null, 'a kid cannot grant a card');
select throws_ok(format('select public.link_learner(%L)', (select value from fixture where name='code')), '22023', 'you cannot link your own account', 'a kid cannot link to themselves');

-- The stranger cannot see or review the kid's work.
select set_config('request.jwt.claim.sub','33333333-3333-4333-a333-333333333333',true);
select is((select count(*) from public.lesson_submissions), 0::bigint, 'an unlinked account sees no submissions');
select throws_ok($$select public.review_submission('11111111-1111-4111-a111-111111111111','lesson.uruk.first-city','pass')$$, '42501', 'not linked to this learner', 'an unlinked account cannot review');
select throws_ok($$select public.link_learner('ZZZZ-ZZZZ')$$, '22023', 'link code not found', 'an unknown code is rejected');

-- The parent links with the code, typed loosely.
select set_config('request.jwt.claim.sub','22222222-2222-4222-a222-222222222222',true);
select is((public.link_learner(lower(substr((select value from fixture where name='code'),1,4)) || '-' || substr((select value from fixture where name='code'),5))->>'displayName'), 'Kid', 'the parent links with the code');
select is((select display_name from public.learners where id='11111111-1111-4111-a111-111111111111'), 'Kid', 'the parent can see the linked kid''s name');
select is((select count(*) from public.lesson_submissions), 1::bigint, 'the parent sees the linked kid''s submission');

select set_config('request.jwt.claim.sub','33333333-3333-4333-a333-333333333333',true);
select throws_ok(format('select public.link_learner(%L)', (select value from fixture where name='code')), '22023', 'link code not found', 'a used code cannot link anyone else');
select is((select count(*) from public.learners where id='11111111-1111-4111-a111-111111111111'), 0::bigint, 'an unlinked account cannot see the kid''s name');

-- Sending work back needs a note; the kid resubmits from the lesson.
select set_config('request.jwt.claim.sub','22222222-2222-4222-a222-222222222222',true);
select throws_ok($$select public.review_submission('11111111-1111-4111-a111-111111111111','lesson.uruk.first-city','return','  ')$$, '22023', 'a note is required when sending work back', 'sending back needs a note');
select is((public.review_submission('11111111-1111-4111-a111-111111111111','lesson.uruk.first-city','return','Add who did the work.')->>'status'), 'returned', 'the parent sends work back');
select throws_ok($$select public.review_submission('11111111-1111-4111-a111-111111111111','lesson.uruk.first-city','pass')$$, '22023', 'submission is not waiting for review', 'returned work cannot pass until resubmitted');

select set_config('request.jwt.claim.sub','11111111-1111-4111-a111-111111111111',true);
select is((select feedback from public.lesson_submissions where learner_id=auth.uid()), 'Add who did the work.', 'the kid sees the note');
select is((public.submit_lesson('lesson.uruk.first-city','{"prompt.uruk.administration-evidence":"Temple workers were paid in grain."}')->>'round')::int, 2, 'resubmitting starts a new round');
select is((select feedback from public.lesson_submissions where learner_id=auth.uid()), 'Add who did the work.', 'the last note stays visible while waiting');

-- Passing grants the cards exactly once.
select set_config('request.jwt.claim.sub','22222222-2222-4222-a222-222222222222',true);
select is((public.review_submission('11111111-1111-4111-a111-111111111111','lesson.uruk.first-city','pass','Great work!',array['card.place.uruk'])->>'status'), 'passed', 'the parent passes the lesson');
select is((public.review_submission('11111111-1111-4111-a111-111111111111','lesson.uruk.first-city','pass','Great work!',array['card.place.uruk'])->>'status'), 'passed', 'passing twice is harmless');
select throws_ok($$select public.review_submission('11111111-1111-4111-a111-111111111111','lesson.uruk.first-city','return','Actually no')$$, '22023', 'submission is not waiting for review', 'a pass is final');

select set_config('request.jwt.claim.sub','11111111-1111-4111-a111-111111111111',true);
select is((select count(*) from public.card_ownership where learner_id=auth.uid() and card_id='card.place.uruk'), 1::bigint, 'the kid owns the card once');
select is((select count(*) from public.lesson_submissions where learner_id=auth.uid() and status='passed' and pass_seen_at is null), 1::bigint, 'the pass is waiting to be celebrated');
select public.acknowledge_pass('lesson.uruk.first-city');
update fixture set value = (select pass_seen_at::text from public.lesson_submissions where learner_id=auth.uid()) where name='code';
select public.acknowledge_pass('lesson.uruk.first-city');
select is((select pass_seen_at::text from public.lesson_submissions where learner_id=auth.uid()), (select value from fixture where name='code'), 'the celebration is shown once');
select is((public.submit_lesson('lesson.uruk.first-city','{"prompt.uruk.administration-evidence":"Changed"}')->>'status'), 'passed', 'a passed lesson stays passed');

-- Another kid's work stays private from this kid.
select set_config('request.jwt.claim.sub','44444444-4444-4444-a444-444444444444',true);
select is((public.submit_lesson('lesson.writing.early-systems','{}')->>'status'), 'submitted', 'a second kid can submit');
select set_config('request.jwt.claim.sub','11111111-1111-4111-a111-111111111111',true);
select is((select count(*) from public.lesson_submissions), 1::bigint, 'kids only see their own submissions');

-- Either side can remove the link.
delete from public.guardian_links where learner_id=auth.uid();
select set_config('request.jwt.claim.sub','22222222-2222-4222-a222-222222222222',true);
select is((select count(*) from public.lesson_submissions), 0::bigint, 'after unlinking the parent no longer sees the work');

select * from finish();
rollback;
