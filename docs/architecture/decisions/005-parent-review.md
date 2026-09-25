# ADR 005: Parent review replaces database-held lesson configuration

- Status: Accepted
- Date: 2026-09-25
- Decision owner: Chronos product owner
- Supersedes: the lesson-configuration and card-granting parts of ADR 002

## Context

Every publish, and every change to a lesson's required prompts or cards, needed a generated SQL migration applied to the hosted project by hand. The database kept a second copy of facts the repository already held, only so that `complete_lesson_and_acquire_card` could refuse unearned cards. Chronos is used by a family, so a parent's judgment is a better check than a database copy of the prompt list.

## Decision

- Lessons, journeys, prompts and Knowledge Cards live only in the repository. A lesson is live when `status: 'published'` merges to main.
- A learner finishes a lesson by submitting their latest answers (`submit_lesson`). The lesson counts as finished immediately so the journey continues.
- A linked parent reads the answers on `/review` and passes the lesson (`review_submission`, which grants the lesson's cards as listed in the content bundle) or sends it back with a required note. The learner revises and resubmits from the lesson page.
- Parents link by entering a learner's single-use code (`learner_link_code`, `link_learner`). Links can be removed from either side.
- The first pass is celebrated once; `acknowledge_pass` records that it was seen.
- Every status change goes through a `SECURITY DEFINER` command with an empty `search_path`, executable only by `authenticated`. Browser roles can read submissions (their own, or their linked learners') and cannot write them directly. A learner cannot pass their own work or grant themselves cards.

## Consequences

- Publishing, unpublishing or changing a lesson needs no migration. `lesson:prepare-publication` no longer writes SQL.
- Learner tables no longer reference `content_lessons`, `journeys`, `journey_entries` or `knowledge_cards`. Those tables, `card_unlocks`, `legacy_id_aliases`, `lesson_completion_configuration`, `lesson_required_prompts` and `completion_commands` remain in the database unused, and `complete_lesson_and_acquire_card` is closed to every role. They can be dropped in a later migration.
- Guests can still finish lessons in their browser but cannot earn cards.
- A parent's pass trusts the parent's browser to name the lesson's cards. That is acceptable because the parent is the reviewer; a learner cannot call the command for themselves.
