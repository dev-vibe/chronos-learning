# ADR 006: Parents can skip unfinished lessons per kid

- Status: Accepted
- Date: 2026-10-11
- Decision owner: Chronos product owner
- Builds on: ADR 005

## Context

The World History spine is one fixed list for everyone. A family may reasonably decide a lesson does not fit one kid, for now or at all, and today the only way to move on is to leave it unfinished while later lessons wait behind it.

## Decision

- A parent can skip any lesson a kid has not finished, and restore it later, from the Progress section of `/review`. One row in `lesson_opt_outs` per kid and lesson; restoring deletes the row.
- Scope is the single kid. Other kids and the lesson content are untouched.
- A skipped lesson leaves the kid's curriculum: it disappears from the timeline, rail, library, search and "next lesson", and opening its address shows a calm "set aside" page. Counts of required lessons exclude it.
- A skipped lesson never blocks anything. For prerequisite checks it counts as settled, so the following lessons stay reachable.
- Finished lessons cannot be skipped, so a kid's record of what they did, their submissions and Knowledge Cards stay intact. Skipping touches no progress, submission or card.
- The change goes through `set_lesson_opt_out`, a `SECURITY DEFINER` command with an empty `search_path`, executable only by `authenticated`, for a linked guardian or the owner of a kid profile. A learner cannot change their own curriculum. The table is read-only to browser roles.
- The learner app receives the skip as a `skipped` status in the same per-lesson summary that already carries progress, so every learner screen reacts the same way.

## Consequences

- On a shared sign-in the kid holds the same session as the parent, so the optional PIN guards the parent view but a determined kid could still skip lessons. This is the same accepted trade-off as ADR 005.
- The migration must be applied before the app that reads `lesson_opt_outs` is deployed; the learner app does not hide a failed read, because showing skipped lessons as available would be wrong.
- Opt-outs are by lesson id, so a lesson published later is unaffected until the parent skips it.
