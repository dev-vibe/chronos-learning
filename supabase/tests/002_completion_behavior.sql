begin;
create extension if not exists pgtap with schema extensions;
set local search_path=extensions,public;
select plan(15);

insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at)
values
 ('11111111-1111-1111-1111-111111111111','00000000-0000-0000-0000-000000000000','authenticated','authenticated','ash53-a@example.invalid','',now(),now(),now()),
 ('22222222-2222-2222-2222-222222222222','00000000-0000-0000-0000-000000000000','authenticated','authenticated','ash53-b@example.invalid','',now(),now(),now());

set local role authenticated;
select set_config('request.jwt.claim.sub','',true);
select throws_ok(
  $$select public.complete_lesson_and_acquire_card('lesson.uruk.first-city','test-unauthenticated')$$,
  '28000','authentication required','unauthenticated completion is rejected'
);

select set_config('request.jwt.claim.sub','11111111-1111-1111-1111-111111111111',true);
insert into public.learners(id) values(auth.uid());
insert into public.content_lessons(id,snapshot_version,published_at)
values ('lesson.test.unpublished-neighbor','test-unpublished-v1',null);
insert into public.lesson_progress(learner_id,lesson_id) values
 (auth.uid(),'lesson.uruk.first-city'),
 (auth.uid(),'lesson.writing.early-systems'),
 (auth.uid(),'lesson.farming.settlements'),
 (auth.uid(),'lesson.test.unpublished-neighbor');

select throws_ok(
  $$select public.complete_lesson_and_acquire_card('lesson.test.unpublished-neighbor','test-unpublished-lesson')$$,
  '22023','lesson is unpublished or completion is unsupported','unpublished neighbor stub is rejected'
);
select throws_ok(
  $$select public.complete_lesson_and_acquire_card('lesson.uruk.first-city','test-missing-prompts')$$,
  '23514','required prompt attempts missing','missing required prompts are rejected'
);

insert into public.understanding_prompt_attempts(learner_id,lesson_id,prompt_id,response) values
 (auth.uid(),'lesson.uruk.first-city','prompt.uruk.administration-evidence','{}'),
 (auth.uid(),'lesson.uruk.first-city','prompt.uruk.opportunity-and-cost','{}');

select is(
 (public.complete_lesson_and_acquire_card('lesson.uruk.first-city','test-success-command')->>'completion'),
 'newly-completed','Uruk completion is created once'
);
select is(
 (select status from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.uruk.first-city'),
 'completed','successful command persists completion'
);
select is(
 (public.complete_lesson_and_acquire_card('lesson.uruk.first-city','test-success-command')->>'completion'),
 'newly-completed','same idempotency key returns the original result'
);
select is(
 (public.complete_lesson_and_acquire_card('lesson.uruk.first-city','test-after-completion')->>'completion'),
 'already-completed','different key after completion reports existing completion'
);
select throws_ok(
 $$select public.complete_lesson_and_acquire_card('lesson.test.unpublished-neighbor','test-success-command')$$,
 '22023','idempotency key reused for another lesson','idempotency key cannot be reused for another lesson'
);
select is(
 (select count(*) from public.card_ownership where learner_id=auth.uid() and card_id='card.place.uruk'),
 1::bigint,'Uruk card ownership remains unique'
);

-- Meaningfully simulate competing successful calls with distinct keys. Both reach the
-- same completion/ownership uniqueness constraints and must observe existing state.
select is(
 (public.complete_lesson_and_acquire_card('lesson.uruk.first-city','test-competing-call-a')->>'completion'),
 'already-completed','first competing-key simulation observes existing completion'
);
select is(
 (public.complete_lesson_and_acquire_card('lesson.uruk.first-city','test-competing-call-b')->>'cardOwnership'),
 'already-owned','second competing-key simulation cannot duplicate card ownership'
);
select is(
 (select count(*) from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.uruk.first-city'),
 1::bigint,'competing calls retain one completion row'
);
select is(
 (select count(*) from public.card_ownership where learner_id=auth.uid() and card_id='card.place.uruk'),
 1::bigint,'competing calls retain one ownership row'
);

select set_config('request.jwt.claim.sub','22222222-2222-2222-2222-222222222222',true);
select is(
 (select count(*) from public.lesson_progress where learner_id='11111111-1111-1111-1111-111111111111'),
 0::bigint,'cross-user progress is isolated by RLS'
);
select is(
 (select count(*) from public.card_ownership where learner_id='11111111-1111-1111-1111-111111111111'),
 0::bigint,'cross-user card ownership is isolated by RLS'
);

select * from finish();
rollback;
