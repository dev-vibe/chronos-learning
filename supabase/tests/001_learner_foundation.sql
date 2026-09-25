begin;
create extension if not exists pgtap with schema extensions;
set local search_path=extensions,public;
select plan(19);

select has_table('public', 'lesson_progress', 'lesson progress exists');
select has_table('public', 'lesson_submissions', 'lesson submissions exist');
select has_table('public', 'guardian_links', 'guardian links exist');
select has_table('public', 'learner_link_codes', 'learner link codes exist');
select col_is_pk('public', 'card_ownership', array['learner_id','card_id'], 'card ownership unique');
select col_is_pk('public', 'lesson_submissions', array['learner_id','lesson_id'], 'one submission per learner and lesson');

select col_isnt_fk('public', 'lesson_progress', 'lesson_id', 'lesson ids are not tied to a database catalog');
select col_isnt_fk('public', 'card_ownership', 'card_id', 'card ids are not tied to a database catalog');

select policies_are('public', 'lesson_progress', array['progress_insert','progress_select','progress_update'], 'progress policies explicit');
select policies_are('public', 'lesson_submissions', array['lesson_submissions_select'], 'submissions are read-only to browser roles');
select policies_are('public', 'guardian_links', array['guardian_links_delete','guardian_links_select'], 'links can be read or removed, never written directly');

select table_privs_are('public', 'lesson_submissions', 'authenticated', array['SELECT'], 'learners and parents only read submissions directly');
select table_privs_are('public', 'lesson_submissions', 'anon', array[]::text[], 'anonymous users cannot read submissions');

select function_privs_are('public', 'submit_lesson', array['text','jsonb'], 'authenticated', array['EXECUTE'], 'learners can submit');
select function_privs_are('public', 'review_submission', array['uuid','text','text','text','text[]'], 'authenticated', array['EXECUTE'], 'parents can review');
select function_privs_are('public', 'review_submission', array['uuid','text','text','text','text[]'], 'anon', array[]::text[], 'anonymous users cannot review');
select function_privs_are('public', 'link_learner', array['text'], 'anon', array[]::text[], 'anonymous users cannot link');
select function_privs_are('public', 'complete_lesson_and_acquire_card', array['text','text'], 'authenticated', array[]::text[], 'the retired completion command is closed');
select is(
  (select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and p.proname in ('submit_lesson','review_submission','link_learner','learner_link_code','acknowledge_pass')
     and not p.prosecdef),
  0::bigint,
  'every command runs as a checked security definer'
);

select * from finish();
rollback;
