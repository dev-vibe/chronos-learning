begin;
create extension if not exists pgtap with schema extensions;
set local search_path=extensions,public;
select plan(33);

-- Changing a lesson's prompts is a repository change. These checks cover what
-- the database does when answers name prompts the lesson no longer has, or
-- miss prompts it has since gained.

insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at)
values
 ('51111111-1111-4111-a111-111111111111','00000000-0000-0000-0000-000000000000','authenticated','authenticated','change-kid@example.invalid','',now(),now(),now()),
 ('52222222-2222-4222-a222-222222222222','00000000-0000-0000-0000-000000000000','authenticated','authenticated','change-parent@example.invalid','',now(),now(),now()),
 ('53333333-3333-4333-a333-333333333333','00000000-0000-0000-0000-000000000000','authenticated','authenticated','change-shared-parent@example.invalid','',now(),now(),now());
insert into public.learners(id, display_name) values
 ('51111111-1111-4111-a111-111111111111','Kid'),
 ('52222222-2222-4222-a222-222222222222','Parent'),
 ('53333333-3333-4333-a333-333333333333','Shared parent');
insert into public.guardian_links(guardian_id, learner_id) values ('52222222-2222-4222-a222-222222222222','51111111-1111-4111-a111-111111111111');

create temporary table fixture(name text primary key, value text);
grant all on fixture to authenticated;

-- The migration adds a nullable snapshot and replaces submit_lesson in place.
select has_column('public', 'lesson_submissions', 'questions', 'submissions keep the questions as the learner saw them');
select col_is_null('public', 'lesson_submissions', 'questions', 'older submissions without a snapshot stay valid');
select is((select count(*) from pg_proc where proname='submit_lesson' and pronamespace='public'::regnamespace), 1::bigint, 'there is exactly one submit_lesson');
select function_privs_are('public', 'submit_lesson', array['text','jsonb','uuid','jsonb'], 'authenticated', array['EXECUTE'], 'learners can submit with a snapshot');
select function_privs_are('public', 'submit_lesson', array['text','jsonb','uuid','jsonb'], 'anon', array[]::text[], 'anonymous users cannot submit');
select is((select prosecdef from pg_proc where proname='submit_lesson' and pronamespace='public'::regnamespace), true, 'submit_lesson stays a security definer command');
select is((select proconfig from pg_proc where proname='submit_lesson' and pronamespace='public'::regnamespace), array['search_path=""'], 'submit_lesson keeps an empty search_path');

set local role authenticated;
select set_config('request.jwt.claim.sub','51111111-1111-4111-a111-111111111111',true);

-- 1. A submission made the old way (three arguments, no snapshot) still works and stays readable.
select is((public.submit_lesson('lesson.uruk.first-city','{"prompt.uruk.old-question":"Tablets tracked grain."}',null)->>'status'), 'submitted', 'a call without a snapshot is accepted');
select is((select questions from public.lesson_submissions where learner_id=auth.uid() and lesson_id='lesson.uruk.first-city'), null, 'a submission without a snapshot keeps a null snapshot');

-- 2. The snapshot is shape-checked, never compared with a prompt list.
select throws_ok($$select public.submit_lesson('lesson.uruk.first-city','{}',null,'{"a":1}')$$, '22023', 'questions must list each prompt once with its text', 'the snapshot must be an array');
select throws_ok($$select public.submit_lesson('lesson.uruk.first-city','{}',null,'[{"promptId":"prompt.a","kind":"concise-explanation"}]')$$, '22023', 'questions must list each prompt once with its text', 'each snapshot entry needs its question text');
select throws_ok($$select public.submit_lesson('lesson.uruk.first-city','{}',null,'[{"promptId":"prompt.a","kind":"essay","question":"Why?"}]')$$, '22023', 'questions must list each prompt once with its text', 'each snapshot entry needs a known kind');
select throws_ok($$select public.submit_lesson('lesson.uruk.first-city','{}',null,'[{"promptId":"prompt.a","kind":"concise-explanation","question":"Why?"},{"promptId":"prompt.a","kind":"concise-explanation","question":"Why again?"}]')$$, '22023', 'questions must list each prompt once with its text', 'a prompt appears once in the snapshot');
select throws_ok(format('select public.submit_lesson(%L,%L,null,%L)', 'lesson.uruk.first-city', '{}', (select jsonb_agg(jsonb_build_object('promptId','prompt.p'||n,'kind','concise-explanation','question','Q')) from generate_series(1,21) n)), '22023', 'questions must list each prompt once with its text', 'the snapshot is bounded');

-- 3. Retired prompt ids are accepted and kept, with the question text the learner saw.
select is((public.submit_lesson(
  'lesson.uruk.first-city',
  '{"prompt.uruk.old-question":"Tablets tracked grain.","prompt.uruk.old-choice":"option.uruk.tablets"}',
  null,
  '[{"promptId":"prompt.uruk.old-question","kind":"concise-explanation","question":"What did the tablets record?","required":true},
    {"promptId":"prompt.uruk.old-choice","kind":"supported-selection","question":"Which evidence fits best?","required":true,"answerLabel":"Clay tablets","best":true}]'
)->>'status'), 'submitted', 'answers to prompts the lesson no longer has are accepted');
select is((select answers->>'prompt.uruk.old-question' from public.lesson_submissions where learner_id=auth.uid() and lesson_id='lesson.uruk.first-city'), 'Tablets tracked grain.', 'the retired prompt''s answer is kept under its old id');
select is((select questions->0->>'question' from public.lesson_submissions where learner_id=auth.uid() and lesson_id='lesson.uruk.first-city'), 'What did the tablets record?', 'the question text is kept with the answer');
select is((select questions->1->>'answerLabel' from public.lesson_submissions where learner_id=auth.uid() and lesson_id='lesson.uruk.first-city'), 'Clay tablets', 'the chosen option''s label is kept');
select is((select (questions->1->>'best')::boolean from public.lesson_submissions where learner_id=auth.uid() and lesson_id='lesson.uruk.first-city'), true, 'whether it was the best-supported answer is kept');

-- 4. Sent back, then resubmitted against a replaced prompt: a new round with a new snapshot.
select set_config('request.jwt.claim.sub','52222222-2222-4222-a222-222222222222',true);
select is((public.review_submission('51111111-1111-4111-a111-111111111111','lesson.uruk.first-city','return','Say who kept the records.')->>'status'), 'returned', 'the parent sends it back');
select set_config('request.jwt.claim.sub','51111111-1111-4111-a111-111111111111',true);
select is((public.submit_lesson(
  'lesson.uruk.first-city',
  '{"prompt.uruk.new-question":"Scribes kept the records."}',
  null,
  '[{"promptId":"prompt.uruk.new-question","kind":"concise-explanation","question":"Who kept the records, and why?","required":true}]'
)->>'round')::int, 2, 'resubmitting with a different set of prompt ids starts a new round');
select is((select questions->0->>'promptId' from public.lesson_submissions where learner_id=auth.uid() and lesson_id='lesson.uruk.first-city'), 'prompt.uruk.new-question', 'the new round carries its own snapshot');
select is((select status from public.lesson_progress where learner_id=auth.uid() and lesson_id='lesson.uruk.first-city'), 'completed', 'the lesson stays finished throughout');
select is((select count(*) from public.understanding_prompt_attempts where learner_id=auth.uid()), 0::bigint, 'submitting never writes or removes attempts');

-- 5. A pass and its cards survive a later submission naming different prompts.
select set_config('request.jwt.claim.sub','52222222-2222-4222-a222-222222222222',true);
select is((public.review_submission('51111111-1111-4111-a111-111111111111','lesson.uruk.first-city','pass','Well done.',array['card.place.uruk'])->>'status'), 'passed', 'the parent passes it');
select set_config('request.jwt.claim.sub','51111111-1111-4111-a111-111111111111',true);
insert into fixture values ('passed_at', (select reviewed_at::text from public.lesson_submissions where learner_id=auth.uid() and lesson_id='lesson.uruk.first-city'));
select is((public.submit_lesson(
  'lesson.uruk.first-city',
  '{"prompt.uruk.newer-question":"Something else"}',
  null,
  '[{"promptId":"prompt.uruk.newer-question","kind":"concise-explanation","question":"A question added later","required":true}]'
)->>'status'), 'passed', 'resubmitting a passed lesson with different prompt ids keeps the pass');
select is((select answers from public.lesson_submissions where learner_id=auth.uid() and lesson_id='lesson.uruk.first-city'), '{"prompt.uruk.new-question":"Scribes kept the records."}'::jsonb, 'the passed answers are unchanged');
select is((select questions->0->>'question' from public.lesson_submissions where learner_id=auth.uid() and lesson_id='lesson.uruk.first-city'), 'Who kept the records, and why?', 'the passed snapshot is unchanged');
select is((select reviewed_at::text from public.lesson_submissions where learner_id=auth.uid() and lesson_id='lesson.uruk.first-city'), (select value from fixture where name='passed_at'), 'the review is not reopened');
select is((select count(*) from public.card_ownership where learner_id=auth.uid() and card_id='card.place.uruk'), 1::bigint, 'the card stays owned');

-- 6. A kid profile on a shared sign-in submits a snapshot the same way.
select set_config('request.jwt.claim.sub','53333333-3333-4333-a333-333333333333',true);
insert into fixture values ('sam', public.add_learner_profile('Sam')->>'id');
select is((public.submit_lesson(
  'lesson.writing.early-systems',
  '{"prompt.retired.one":"An answer"}',
  (select value from fixture where name='sam')::uuid,
  '[{"promptId":"prompt.retired.one","kind":"concise-explanation","question":"An older question","required":true}]'
)->>'status'), 'submitted', 'a kid profile submits with a snapshot');
select is((select questions->0->>'question' from public.lesson_submissions where learner_id=(select value from fixture where name='sam')::uuid), 'An older question', 'the shared account reads the kid''s snapshot');

-- 7. A learner still cannot write the snapshot directly.
select throws_ok($$update public.lesson_submissions set questions='[]' where learner_id=auth.uid()$$, '42501', null, 'the snapshot cannot be edited directly');

select * from finish();
rollback;
