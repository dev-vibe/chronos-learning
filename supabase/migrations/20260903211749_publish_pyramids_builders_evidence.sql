-- ASH-99: publish the approved evidence-led Egypt lesson. No card unlock.
-- Filename matches the hosted migration version assigned on application.
insert into public.content_lessons (id, snapshot_version, published_at)
values ('lesson.egypt.pyramids-and-state-labor', 'pyramids-builders-evidence-v1', now());

update public.journeys
set snapshot_version = 'pyramids-builders-evidence-v1'
where id = 'journey.world-history';

insert into public.journey_entries (id, journey_id, lesson_id, position, required)
values ('entry.world-history.pyramids-and-state-labor', 'journey.world-history', 'lesson.egypt.pyramids-and-state-labor', 8, true);

insert into public.lesson_completion_configuration (lesson_id, completion_enabled)
values ('lesson.egypt.pyramids-and-state-labor', true);

insert into public.lesson_required_prompts (lesson_id, prompt_id, position)
values
  ('lesson.egypt.pyramids-and-state-labor', 'prompt.pyramids.context-and-phase', 0),
  ('lesson.egypt.pyramids-and-state-labor', 'prompt.pyramids.build-evidence-chain', 1);

-- Navigation aliases do not establish equivalent prior learning. Do not
-- auto-complete this new evidence-comparison lesson from old Imhotep/pyramid work.
insert into public.legacy_id_aliases
  (legacy_id, canonical_id, entity_kind, semantic_equivalence_approved, review_note)
values
  ('imhotep', 'lesson.egypt.pyramids-and-state-labor', 'lesson', false,
   'ASH-99 navigation alias only; the new four-case evidence lesson requires its own prompt attempts'),
  ('pyramids', 'lesson.egypt.pyramids-and-state-labor', 'lesson', false,
   'ASH-99 navigation alias only; legacy completion is not equivalent to the new evidence-comparison lesson');
