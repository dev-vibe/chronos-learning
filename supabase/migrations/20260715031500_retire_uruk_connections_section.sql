update public.section_resume_state
set section_id = 'section.uruk.check-and-complete',
    updated_at = now()
where lesson_id = 'lesson.uruk.first-city'
  and section_id = 'section.uruk.connections';

delete from public.lesson_section_exploration
where lesson_id = 'lesson.uruk.first-city'
  and section_id = 'section.uruk.connections';

comment on table public.section_resume_state is
  'Latest meaningful semantic lesson section; retired section IDs are migrated to a current destination.';
