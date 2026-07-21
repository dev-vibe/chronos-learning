insert into public.content_lessons (id, snapshot_version, published_at)
values ('lesson.humans.homo-sapiens-origins', 'human-origins-v1', now());

update public.journeys
set snapshot_version = 'human-origins-v1'
where id = 'journey.world-history';

update public.journey_entries
set position = position + 100
where journey_id = 'journey.world-history';

update public.journey_entries
set position = position - 99
where journey_id = 'journey.world-history';

insert into public.journey_entries (id, journey_id, lesson_id, position, required)
values (
  'entry.world-history.human-origins',
  'journey.world-history',
  'lesson.humans.homo-sapiens-origins',
  0,
  true
);

insert into public.knowledge_cards (id, snapshot_version)
values ('card.idea.shared-african-origins', 'human-origins-v1');

insert into public.card_unlocks (lesson_id, card_id)
values ('lesson.humans.homo-sapiens-origins', 'card.idea.shared-african-origins');

insert into public.lesson_completion_configuration (lesson_id, completion_enabled)
values ('lesson.humans.homo-sapiens-origins', true);

insert into public.lesson_required_prompts (lesson_id, prompt_id, position)
values
  ('lesson.humans.homo-sapiens-origins', 'prompt.human-origins.best-supported-model', 0),
  ('lesson.humans.homo-sapiens-origins', 'prompt.human-origins.evidence-and-limit', 1);

comment on table public.content_lessons is
  'Published lesson identities and snapshot versions. Authored lesson content remains repository-canonical.';
