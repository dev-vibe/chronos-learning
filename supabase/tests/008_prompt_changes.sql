begin;
create extension if not exists pgtap with schema extensions;
set local search_path=extensions,public;
select plan(18);

-- Changing a lesson's prompts is a repository change. The database accepts
-- answers under any prompt ids, keeps the questions the learner saw, and never
-- undoes a pass.

insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at)
values
 ('51111111-1111-4111-a111-111111111111','00000000-0000-0000-0000-000000000000','authenticated','authenticated','change-kid@example.invalid','',now(),now(),now()),
 ('52222222-2222-4222-a222-222222222222','00000000-0000-0000-0000-000000000000','authenticated','authenticated','change-parent@example.invalid','',now(),now(),now());
insert into public.learners(id, display_name) values
 ('51111111-1111-4111-a111-111111111111','Kid'),
 ('52222222-2222-4222-a222-222222222222','Parent');
insert into public.guardian_links(guardian_id, learner_id) values ('52222222-2222-4222-a222-222222222222','51111111-1111-4111-a111-111111111111');

select has_column('public', 'lesson_submissions', 'questions', 'submissions keep the questions the learner saw');
select function_privs_are('public', 'submit_lesson', array['text','jsonb','jsonb','uuid'], 'anon', array[]::text[], 'anonymous users cannot submit');

set local role authenticated;
select set_config('request.jwt.claim.sub','51111111-1111-4111-a111-111111111111',true);

-- The snapshot is shape-checked only.
select throws_ok($$select public.submit_lesson('lesson.uruk.first-city','{}',null)$$, '22023', 'questions must list each prompt once with its text', 'the snapshot is required');
select throws_ok($$select public.submit_lesson('lesson.uruk.first-city','{}','[{"promptId":"prompt.a","kind":"concise-explanation"}]')$$, '22023', 'questions must list each prompt once with its text', 'each question needs its text');
select throws_ok($$select public.submit_lesson('lesson.uruk.first-city','{}','[{"promptId":"prompt.a","kind":"concise-explanation","question":"Why?"},{"promptId":"prompt.a","kind":"concise-explanation","question":"Why?"}]')$$, '22023', 'questions must list each prompt once with its text', 'a prompt appears once');

-- Answers to prompts the lesson no longer has are accepted and kept with their questions.
select is((public.submit_lesson(
  'lesson.uruk.first-city',
  '{"prompt.uruk.retired-question":"Scribes counted grain."}',
  '[{"promptId":"prompt.uruk.retired-question","kind":"concise-explanation","question":"What did the tablets record?","required":true}]'
)->>'status'), 'submitted', 'a submission with a retired prompt id is accepted');
select is((select answers->>'prompt.uruk.retired-question' from public.lesson_submissions where learner_id=auth.uid()), 'Scribes counted grain.', 'the answer is kept under its old id');
select is((select questions->0->>'question' from public.lesson_submissions where learner_id=auth.uid()), 'What did the tablets record?', 'the question text is kept');

-- Sent back, then resubmitted with a different set of prompt ids.
select set_config('request.jwt.claim.sub','52222222-2222-4222-a222-222222222222',true);
select is((public.review_submission('51111111-1111-4111-a111-111111111111','lesson.uruk.first-city','return','Say who kept the records.')->>'status'), 'returned', 'the parent sends it back');
select set_config('request.jwt.claim.sub','51111111-1111-4111-a111-111111111111',true);
select is((public.submit_lesson(
  'lesson.uruk.first-city',
  '{"prompt.uruk.new-question":"Scribes kept the records."}',
  '[{"promptId":"prompt.uruk.new-question","kind":"concise-explanation","question":"Who kept the records?","required":true}]'
)->>'round')::int, 2, 'resubmitting with different prompt ids starts a new round');
select is((select questions->0->>'promptId' from public.lesson_submissions where learner_id=auth.uid()), 'prompt.uruk.new-question', 'the new round carries its own questions');
select is((select status from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.uruk.first-city'), 'completed', 'the lesson stays finished');

-- A pass and its cards survive a later submission naming different prompts.
select set_config('request.jwt.claim.sub','52222222-2222-4222-a222-222222222222',true);
select is((public.review_submission('51111111-1111-4111-a111-111111111111','lesson.uruk.first-city','pass','Well done.',array['card.place.uruk'])->>'status'), 'passed', 'the parent passes it');
select set_config('request.jwt.claim.sub','51111111-1111-4111-a111-111111111111',true);
select is((public.submit_lesson(
  'lesson.uruk.first-city',
  '{"prompt.uruk.newer-question":"Something else"}',
  '[{"promptId":"prompt.uruk.newer-question","kind":"concise-explanation","question":"A question added later","required":true}]'
)->>'status'), 'passed', 'resubmitting a passed lesson with different prompt ids keeps the pass');
select is((select answers from public.lesson_submissions where learner_id=auth.uid()), '{"prompt.uruk.new-question":"Scribes kept the records."}'::jsonb, 'the passed answers are unchanged');
select is((select questions->0->>'question' from public.lesson_submissions where learner_id=auth.uid()), 'Who kept the records?', 'the passed questions are unchanged');
select is((select count(*) from public.card_ownership where learner_id=auth.uid() and card_id='card.place.uruk'), 1::bigint, 'the card stays owned');

select throws_ok($$update public.lesson_submissions set questions='[]' where learner_id=auth.uid()$$, '42501', null, 'the questions cannot be edited directly');

select * from finish();
rollback;
