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
- Setup offers two family arrangements, recommending the first:
  - **Separate sign-ins.** Each kid has an account and the parent links by entering the kid's single-use code (`learner_link_code`, `link_learner`). Links can be removed from either side.
  - **Shared sign-in**, for kids without their own email. The parent's sign-in holds a profile per kid (`add_learner_profile`, `remove_learner_profile`). Each profile is its own learner, so progress, submissions and cards stay separate. `can_act_as()` opens a learner's rows to whoever may act as that learner, and the commands take the acting profile.
- On a shared sign-in, Chronos opens as the last kid used. A switcher at the top of the side rail (bottom bar on phones) names who is using it and switches kids or opens parent view. Parent view lasts until the tab closes, and a fresh sign-in opens in parent view.
- The parent can lock parent view with an optional 4-digit PIN (`set_parent_pin`, `verify_parent_pin`), turned on, changed or off from the Account page. Only a salted hash is stored and five wrong tries lock it for five minutes. The PIN guards the app's parent view; on a shared sign-in the kid holds the same session, so a determined kid could still reach Review. That is the accepted trade-off of sharing a sign-in.
- The first pass is celebrated once; `acknowledge_pass` records that it was seen.
- Every status change goes through a `SECURITY DEFINER` command with an empty `search_path`, executable only by `authenticated`. Browser roles can read submissions (their own, or their linked learners') and cannot write them directly. A learner cannot pass their own work or grant themselves cards.

## Consequences

- Publishing, unpublishing or changing a lesson needs no migration. `lesson:prepare-publication` no longer writes SQL.
- Learner tables no longer reference `content_lessons`, `journeys`, `journey_entries` or `knowledge_cards`. Those tables, `card_unlocks`, `legacy_id_aliases`, `lesson_completion_configuration`, `lesson_required_prompts` and `completion_commands` remain in the database unused, and `complete_lesson_and_acquire_card` is closed to every role. They can be dropped in a later migration.
- Guests can still finish lessons in their browser but cannot earn cards.
- A parent's pass trusts the parent's browser to name the lesson's cards. That is acceptable because the parent is the reviewer; a learner cannot call the command for themselves.
- Changing a lesson's prompts after learners have answered them follows [prompt-changes.md](../prompt-changes.md): a changed question gets a new prompt ID, and submissions keep a snapshot of the questions as the learner saw them.
