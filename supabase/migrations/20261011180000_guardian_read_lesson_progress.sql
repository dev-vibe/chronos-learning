-- A parent linked to a kid's own sign-in can already read that kid's
-- submissions. Let them read the kid's finished lessons too, so the parent view
-- can show the same green checks the kid sees on their World History timeline,
-- including lessons finished before parent review existed (those have no
-- submission row to show).
--
-- Read only. Writing lesson progress still requires acting as the learner.
alter policy progress_select on public.lesson_progress
using (
  public.can_act_as(learner_id)
  or exists (
    select 1 from public.guardian_links link
    where link.guardian_id = (select auth.uid()) and link.learner_id = lesson_progress.learner_id
  )
);
