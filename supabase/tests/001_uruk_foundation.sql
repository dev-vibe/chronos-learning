begin; select plan(5);
select has_table('public','lesson_progress','lesson progress exists'); select has_function('public','complete_lesson_and_acquire_card',array['text','text'],'transaction command exists');
select col_is_pk('public','card_ownership',array['learner_id','card_id'],'card ownership unique');
select policies_are('public','lesson_progress',array['progress_insert','progress_select','progress_update'],'progress policies explicit');
select function_privs_are('public','complete_lesson_and_acquire_card',array['text','text'],'authenticated',array['EXECUTE'],'only intended authenticated execution');
select * from finish(); rollback;
