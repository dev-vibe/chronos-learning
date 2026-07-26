insert into public.content_lessons (id, snapshot_version, published_at)
values ('lesson.humans.homo-sapiens-origins', 'homo-sapiens-origins-v1', now());

update public.journeys
set snapshot_version = 'homo-sapiens-origins-v1'
where id = 'journey.world-history';

-- World History now opens at canonical Spine position 1, so every existing
-- entry shifts down one place. journey_entries carries a non-deferrable
-- unique(journey_id, position) and a position >= 0 check, so the shift goes up
-- and out of the way before it comes back down into its final slots.
update public.journey_entries
set position = position + 100
where journey_id = 'journey.world-history';

update public.journey_entries
set position = position - 99
where journey_id = 'journey.world-history';

insert into public.journey_entries (id, journey_id, lesson_id, position, required)
values ('entry.world-history.homo-sapiens-origins', 'journey.world-history', 'lesson.humans.homo-sapiens-origins', 0, true);

insert into public.knowledge_cards (id, snapshot_version)
values ('card.idea.origins-across-africa', 'homo-sapiens-origins-v1');

insert into public.card_unlocks (lesson_id, card_id)
values ('lesson.humans.homo-sapiens-origins', 'card.idea.origins-across-africa');

insert into public.lesson_completion_configuration (lesson_id, completion_enabled)
values ('lesson.humans.homo-sapiens-origins', true);

insert into public.lesson_required_prompts (lesson_id, prompt_id, position)
values
  ('lesson.humans.homo-sapiens-origins', 'prompt.humans.best-supported-conclusion', 0),
  ('lesson.humans.homo-sapiens-origins', 'prompt.humans.evidence-and-limit', 1);
