insert into public.content_lessons (id, snapshot_version, published_at)
values ('lesson.farming.multiple-origins', 'many-beginnings-farming-v1', now());

update public.journeys
set snapshot_version = 'many-beginnings-farming-v1'
where id = 'journey.world-history';

-- Insert the canonical farming overview before the already-published
-- Farming and Settlements entry. The two-step shift avoids the
-- non-deferrable unique(journey_id, position) constraint.
update public.journey_entries
set position = position + 100
where journey_id = 'journey.world-history'
  and position >= 2;

update public.journey_entries
set position = position - 99
where journey_id = 'journey.world-history'
  and position >= 102;

insert into public.journey_entries (id, journey_id, lesson_id, position, required)
values ('entry.world-history.multiple-origins', 'journey.world-history', 'lesson.farming.multiple-origins', 2, true);

insert into public.lesson_completion_configuration (lesson_id, completion_enabled)
values ('lesson.farming.multiple-origins', true);

insert into public.lesson_required_prompts (lesson_id, prompt_id, position)
values
  ('lesson.farming.multiple-origins', 'prompt.farming.multi.what-evidence-supports', 0),
  ('lesson.farming.multiple-origins', 'prompt.farming.multi.explain-independent', 1);

insert into public.legacy_id_aliases (
  legacy_id,
  canonical_id,
  entity_kind,
  semantic_equivalence_approved,
  review_note
)
values (
  'neolithic_revolution',
  'lesson.farming.multiple-origins',
  'lesson',
  true,
  'ASH-74 approved semantic equivalence after replacing the single-revolution framing with multiple regional beginnings'
);
