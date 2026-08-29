insert into public.content_lessons (id, snapshot_version, published_at)
values ('lesson.caral.andean-urbanism', 'caral-andean-urbanism-v1', now());

update public.journeys
set snapshot_version = 'caral-andean-urbanism-v1'
where id = 'journey.world-history';

insert into public.journey_entries (id, journey_id, lesson_id, position, required)
values ('entry.world-history.caral-andean-urbanism', 'journey.world-history', 'lesson.caral.andean-urbanism', 7, true);

insert into public.knowledge_cards (id, snapshot_version)
values ('card.place.caral', 'caral-andean-urbanism-v1');

insert into public.card_unlocks (lesson_id, card_id, position)
values ('lesson.caral.andean-urbanism', 'card.place.caral', 0);

insert into public.legacy_id_aliases (
  legacy_id,
  canonical_id,
  entity_kind,
  semantic_equivalence_approved,
  review_note
)
values (
  'caral_norte_chico',
  'lesson.caral.andean-urbanism',
  'lesson',
  true,
  'ASH-98 approved replacing the legacy Norte Chico node with the evidence-led Caral urbanism lesson'
);

insert into public.lesson_completion_configuration (lesson_id, completion_enabled)
values ('lesson.caral.andean-urbanism', true);

insert into public.lesson_required_prompts (lesson_id, prompt_id, position)
values
  ('lesson.caral.andean-urbanism', 'prompt.caral.supported-model', 0),
  ('lesson.caral.andean-urbanism', 'prompt.caral.evidence-and-limit', 1);
