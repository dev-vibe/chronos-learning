update public.content_lessons
set snapshot_version = 'farming-settlements-v1',
    published_at = coalesce(published_at, now())
where id = 'lesson.farming.settlements';

update public.journeys
set snapshot_version = 'farming-settlements-v1'
where id = 'journey.world-history';

insert into public.knowledge_cards (id, snapshot_version)
values ('card.place.catalhoyuk', 'farming-settlements-v1');

insert into public.card_unlocks (lesson_id, card_id)
values ('lesson.farming.settlements', 'card.place.catalhoyuk');

insert into public.lesson_completion_configuration (lesson_id, completion_enabled)
values ('lesson.farming.settlements', true);

insert into public.lesson_required_prompts (lesson_id, prompt_id, position)
values
  ('lesson.farming.settlements', 'prompt.farming.best-supported-model', 0),
  ('lesson.farming.settlements', 'prompt.farming.opportunity-and-cost', 1);
