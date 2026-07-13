alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke execute on functions from public, anon, authenticated;

revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

grant select on public.content_lessons,public.journeys,public.journey_entries,public.knowledge_cards,public.card_unlocks,public.legacy_id_aliases to authenticated;
grant select on public.learners,public.lesson_progress,public.section_resume_state,public.understanding_prompt_attempts,public.completion_commands,public.card_ownership to authenticated;
grant insert(id) on public.learners to authenticated;
grant insert(learner_id,lesson_id) on public.lesson_progress to authenticated;
grant insert(learner_id,lesson_id,section_id),update(section_id,updated_at) on public.section_resume_state to authenticated;
grant insert(learner_id,lesson_id,prompt_id,response) on public.understanding_prompt_attempts to authenticated;
grant usage,select on sequence public.understanding_prompt_attempts_id_seq to authenticated;

revoke all on function public.complete_lesson_and_acquire_card(text,text) from public,anon,service_role;
grant execute on function public.complete_lesson_and_acquire_card(text,text) to authenticated;
