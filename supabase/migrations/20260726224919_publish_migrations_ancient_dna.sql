insert into public.content_lessons (id, snapshot_version, published_at)
values ('lesson.humans.migrations-and-interbreeding', 'migrations-ancient-dna-v1', now());

update public.journeys
set snapshot_version = 'migrations-ancient-dna-v1'
where id = 'journey.world-history';

-- Keep Origins in position 0 and make room immediately after it. The two-step
-- shift avoids the non-deferrable unique(journey_id, position) constraint.
update public.journey_entries
set position = position + 100
where journey_id = 'journey.world-history'
  and position >= 1;

update public.journey_entries
set position = position - 99
where journey_id = 'journey.world-history'
  and position >= 101;

insert into public.journey_entries (id, journey_id, lesson_id, position, required)
values ('entry.world-history.migrations-and-interbreeding', 'journey.world-history', 'lesson.humans.migrations-and-interbreeding', 1, true);

insert into public.knowledge_cards (id, snapshot_version)
values ('card.people.neanderthals', 'migrations-ancient-dna-v1');

insert into public.card_unlocks (lesson_id, card_id, position)
values ('lesson.humans.migrations-and-interbreeding', 'card.people.neanderthals', 0);

insert into public.lesson_completion_configuration (lesson_id, completion_enabled)
values ('lesson.humans.migrations-and-interbreeding', true);

insert into public.lesson_required_prompts (lesson_id, prompt_id, position)
values
  ('lesson.humans.migrations-and-interbreeding', 'prompt.humans.long-segments-inference', 0),
  ('lesson.humans.migrations-and-interbreeding', 'prompt.humans.adna-evidence-and-limit', 1);
