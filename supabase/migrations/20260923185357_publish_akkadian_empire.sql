-- ASH-102: publish Akkad and the Problem of Empire.
insert into public.content_lessons (id, snapshot_version, published_at)
values ('lesson.mesopotamia.akkadian-empire', 'akkadian-empire-v1', now());

update public.journeys
set snapshot_version = 'akkadian-empire-v1'
where id = 'journey.world-history';

insert into public.journey_entries (id, journey_id, lesson_id, position, required)
values ('entry.world-history.akkadian-empire', 'journey.world-history', 'lesson.mesopotamia.akkadian-empire', 12, true);

insert into public.lesson_completion_configuration (lesson_id, completion_enabled)
values ('lesson.mesopotamia.akkadian-empire', true);

insert into public.lesson_required_prompts (lesson_id, prompt_id, position)
values
  ('lesson.mesopotamia.akkadian-empire', 'prompt.akkad.local-arrangements', 0),
  ('lesson.mesopotamia.akkadian-empire', 'prompt.akkad.holding-power', 1);
