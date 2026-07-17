update public.content_lessons
set snapshot_version = 'writing-systems-v1',
    published_at = coalesce(published_at, now())
where id = 'lesson.writing.early-systems';

update public.journeys
set snapshot_version = 'writing-systems-v1'
where id = 'journey.world-history';

insert into public.knowledge_cards (id, snapshot_version)
values ('card.artifact.proto-cuneiform-tablet', 'writing-systems-v1');

insert into public.card_unlocks (lesson_id, card_id)
values ('lesson.writing.early-systems', 'card.artifact.proto-cuneiform-tablet');

insert into public.legacy_id_aliases (
  legacy_id, canonical_id, entity_kind, semantic_equivalence_approved, review_note
)
values (
  'sumer_writing',
  'lesson.writing.early-systems',
  'lesson',
  true,
  'ASH-63 preserved stable writing identity for the reviewed proto-cuneiform lesson'
);

insert into public.lesson_completion_configuration (lesson_id, completion_enabled)
values ('lesson.writing.early-systems', true);

insert into public.lesson_required_prompts (lesson_id, prompt_id, position)
values
  ('lesson.writing.early-systems', 'prompt.writing.administration-evidence', 0),
  ('lesson.writing.early-systems', 'prompt.writing.possibility-and-limit', 1);
