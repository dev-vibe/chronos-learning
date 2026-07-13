create index card_ownership_card_id_idx on public.card_ownership(card_id);
create index card_ownership_source_lesson_id_idx on public.card_ownership(source_lesson_id);
create index card_unlocks_card_id_idx on public.card_unlocks(card_id);
create index completion_commands_lesson_id_idx on public.completion_commands(lesson_id);
create index journey_entries_lesson_id_idx on public.journey_entries(lesson_id);
create index lesson_progress_lesson_id_idx on public.lesson_progress(lesson_id);
