drop index public.learner_journeys_journey_id_idx;

create index learner_journeys_active_entry_idx
  on public.learner_journeys(journey_id, active_lesson_id);
