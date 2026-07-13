create policy completion_configuration_no_direct_access
on public.lesson_completion_configuration for select to authenticated using (false);

create policy required_prompts_no_direct_access
on public.lesson_required_prompts for select to authenticated using (false);

revoke all on public.lesson_completion_configuration, public.lesson_required_prompts
from public, anon, authenticated;
