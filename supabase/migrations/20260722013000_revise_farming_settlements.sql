update public.content_lessons
set snapshot_version = 'farming-settlements-v2',
    published_at = coalesce(published_at, now())
where id = 'lesson.farming.settlements';

update public.journeys
set snapshot_version = 'farming-settlements-v2'
where id = 'journey.world-history';

update public.knowledge_cards
set snapshot_version = 'farming-settlements-v2'
where id = 'card.place.catalhoyuk';

insert into public.lesson_completion_configuration (lesson_id, completion_enabled)
values ('lesson.farming.settlements', true)
on conflict (lesson_id) do update
set completion_enabled = excluded.completion_enabled,
    configured_at = now();

delete from public.lesson_required_prompts
where lesson_id = 'lesson.farming.settlements'
  and prompt_id = 'prompt.farming.best-supported-model';

insert into public.lesson_required_prompts (lesson_id, prompt_id, position)
values ('lesson.farming.settlements', 'prompt.farming.house-pattern', 0)
on conflict (lesson_id, prompt_id) do update
set position = excluded.position;

update public.lesson_required_prompts
set position = 1
where lesson_id = 'lesson.farming.settlements'
  and prompt_id = 'prompt.farming.opportunity-and-cost';
