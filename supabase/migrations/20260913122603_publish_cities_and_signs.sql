-- ASH-100: publish Indus Cities and Undeciphered Signs.
insert into public.content_lessons (id, snapshot_version, published_at)
values ('lesson.indus.cities-and-signs', 'cities-and-signs-v1', now());

update public.journeys
set snapshot_version = 'cities-and-signs-v1'
where id = 'journey.world-history';

insert into public.journey_entries (id, journey_id, lesson_id, position, required)
values ('entry.world-history.indus-cities-and-signs', 'journey.world-history', 'lesson.indus.cities-and-signs', 10, true);

insert into public.knowledge_cards (id, snapshot_version)
values
  ('card.indus.stamp-seal', 'cities-and-signs-v1');

insert into public.card_unlocks (lesson_id, card_id, position)
values
  ('lesson.indus.cities-and-signs', 'card.indus.stamp-seal', 0);

insert into public.legacy_id_aliases (
  legacy_id,
  canonical_id,
  entity_kind,
  semantic_equivalence_approved,
  review_note
)
values
  (
    'indus_cities',
    'lesson.indus.cities-and-signs',
    'lesson',
    false,
    'ASH-100 navigation alias only; legacy completion is not equivalent to this lesson'
  ),
  (
    'indus_script',
    'lesson.indus.cities-and-signs',
    'lesson',
    false,
    'ASH-100 navigation alias only; legacy completion is not equivalent to this lesson'
  );

insert into public.lesson_completion_configuration (lesson_id, completion_enabled)
values ('lesson.indus.cities-and-signs', true);

insert into public.lesson_required_prompts (lesson_id, prompt_id, position)
values
  ('lesson.indus.cities-and-signs', 'prompt.indus.shared-standards', 0),
  ('lesson.indus.cities-and-signs', 'prompt.indus.water-and-work', 1);
