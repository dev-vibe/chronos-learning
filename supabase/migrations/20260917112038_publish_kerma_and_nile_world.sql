-- ASH-101: publish Kerma and the Middle Nile.
insert into public.content_lessons (id, snapshot_version, published_at)
values ('lesson.nubia.kerma-and-nile-world', 'kerma-and-nile-world-v1', now());

update public.journeys
set snapshot_version = 'kerma-and-nile-world-v1'
where id = 'journey.world-history';

insert into public.journey_entries (id, journey_id, lesson_id, position, required)
values ('entry.world-history.kerma-and-nile-world', 'journey.world-history', 'lesson.nubia.kerma-and-nile-world', 11, true);

insert into public.legacy_id_aliases (
  legacy_id,
  canonical_id,
  entity_kind,
  semantic_equivalence_approved,
  review_note
)
values
  (
    'kerma',
    'lesson.nubia.kerma-and-nile-world',
    'lesson',
    false,
    'ASH-101 navigation alias only; legacy completion is not equivalent to this lesson'
  );

insert into public.lesson_completion_configuration (lesson_id, completion_enabled)
values ('lesson.nubia.kerma-and-nile-world', true);

insert into public.lesson_required_prompts (lesson_id, prompt_id, position)
values
  ('lesson.nubia.kerma-and-nile-world', 'prompt.kerma.contact-and-rule', 0),
  ('lesson.nubia.kerma-and-nile-world', 'prompt.kerma.work-and-power', 1);
