# Database test prerequisites

Run the reproducible structural and behavioral pgTAP suite with:

```sh
npx supabase start
npx supabase db reset
npx supabase test db
```

This requires Docker Desktop and Supabase CLI 2.109.1 or later. `002_completion_behavior.sql` covers authentication, publication/eligibility, required prompts, idempotency, ownership uniqueness, and cross-user RLS in a rolled-back transaction.

The two distinct-key assertions meaningfully simulate competing completion calls against the same uniqueness boundaries. True parallel-session testing requires a running local stack and a future integration harness capable of coordinating separate database connections; the primary keys on `(learner_id, lesson_id)`, `(learner_id, idempotency_key)`, and `(learner_id, card_id)`, plus row locking in the function, are the concurrency boundary exercised by the simulation.
