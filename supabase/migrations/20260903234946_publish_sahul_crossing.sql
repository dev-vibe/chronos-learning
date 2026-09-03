-- ASH-109: publish Crossing to Sahul.
insert into public.content_lessons (id, snapshot_version, published_at)
values ('lesson.humans.sahul-crossing', 'sahul-crossing-v1', now());

update public.journeys
set snapshot_version = 'sahul-crossing-v1'
where id = 'journey.world-history';

-- Insert before already-published later entries. The two-step shift avoids
-- the non-deferrable unique(journey_id, position) constraint.
update public.journey_entries
set position = position + 100
where journey_id = 'journey.world-history'
  and position >= 2;

update public.journey_entries
set position = position - 99
where journey_id = 'journey.world-history'
  and position >= 102;

insert into public.journey_entries (id, journey_id, lesson_id, position, required)
values ('entry.world-history.sahul-crossing', 'journey.world-history', 'lesson.humans.sahul-crossing', 2, true);

insert into public.knowledge_cards (id, snapshot_version)
values
  ('card.place.sahul', 'sahul-crossing-v1');

insert into public.card_unlocks (lesson_id, card_id, position)
values
  ('lesson.humans.sahul-crossing', 'card.place.sahul', 0);

insert into public.lesson_completion_configuration (lesson_id, completion_enabled)
values ('lesson.humans.sahul-crossing', true);

insert into public.lesson_required_prompts (lesson_id, prompt_id, position)
values
  ('lesson.humans.sahul-crossing', 'prompt.humans.sahul.sand-date-supports', 0),
  ('lesson.humans.sahul-crossing', 'prompt.humans.sahul.planning-and-limit', 1);
