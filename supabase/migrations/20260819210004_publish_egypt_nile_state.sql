insert into public.content_lessons (id, snapshot_version, published_at)
values ('lesson.egypt.nile-state', 'egypt-nile-state-v1', now());

update public.journeys
set snapshot_version = 'egypt-nile-state-v1'
where id = 'journey.world-history';

insert into public.journey_entries (id, journey_id, lesson_id, position, required)
values ('entry.world-history.egypt-nile-state', 'journey.world-history', 'lesson.egypt.nile-state', 6, true);

insert into public.knowledge_cards (id, snapshot_version)
values ('card.artifact.narmer-palette', 'egypt-nile-state-v1');

insert into public.card_unlocks (lesson_id, card_id, position)
values ('lesson.egypt.nile-state', 'card.artifact.narmer-palette', 0);

insert into public.legacy_id_aliases (
  legacy_id,
  canonical_id,
  entity_kind,
  semantic_equivalence_approved,
  review_note
)
values
  (
    'hieroglyphs',
    'lesson.egypt.nile-state',
    'lesson',
    true,
    'ASH-97 approved merging the legacy writing node into the evidence-led early-state lesson'
  ),
  (
    'narmer',
    'lesson.egypt.nile-state',
    'lesson',
    true,
    'ASH-97 approved merging the legacy ruler node into the evidence-led early-state lesson'
  );

insert into public.lesson_completion_configuration (lesson_id, completion_enabled)
values ('lesson.egypt.nile-state', true);

insert into public.lesson_required_prompts (lesson_id, prompt_id, position)
values
  ('lesson.egypt.nile-state', 'prompt.egypt.palette-supported-claim', 0),
  ('lesson.egypt.nile-state', 'prompt.egypt.evidence-and-limit', 1);
