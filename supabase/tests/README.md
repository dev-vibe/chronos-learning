# Database test prerequisites

Run the reproducible structural and behavioral pgTAP suite with:

```sh
npx supabase start
npx supabase db reset
npx supabase test db
```

This requires Docker Desktop and Supabase CLI 2.109.1 or later. `001_learner_foundation.sql` checks the learner tables, policies and command privileges, including that lesson and card ids are not tied to a database catalog. `002_parent_review.sql` covers the parent-review flow in a rolled-back transaction: link codes, linking, submitting and resubmitting, sending back with a required note, passing with a one-time card grant, the one-time celebration, and that learners and unlinked accounts cannot review, grant cards or read each other's work. `004_media_storage.sql` verifies that public derivatives remain readable, originals remain private, upload constraints are explicit, and no browser-role mutation policies are introduced.

`006_journey_discovery.sql` verifies composite journey state keys, learner-owned policies, update `WITH CHECK` behavior, invitation dismissal persistence, and cross-learner isolation.

There are no per-lesson database tests: lessons are defined only in the repository, so publishing a lesson changes nothing in the database.
