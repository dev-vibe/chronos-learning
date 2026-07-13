# ADR 001: Controlled in-place rebuild

- Status: Accepted by product direction; documented by ASH-52
- Date: 2026-07-12
- Decision owners: Chronos product and engineering

## Context

The repository contains useful React/Vite infrastructure, Git and deployment continuity, authentication work, substantial historical drafts, source links, and media. Its runtime, however, is organized around one tactical master timeline, a monolithic `App.tsx`, UI-owned locking, perfect-quiz completion, XP/levels, and index-based collectibles. Incremental reskinning would preserve the wrong boundaries and make the target Journey/Lesson/Card/Progress model harder to introduce.

Starting a new repository would discard provenance, review history, deploy continuity, and migration evidence. Replacing everything at once would make learner-progress and content reconciliation unsafe.

## Decision

Keep `dev-vibe/chronos-learning` and rebuild the application architecture inside it through a controlled migration seam.

- Establish target domain, application, infrastructure, and UI boundaries alongside the legacy runtime.
- Use Uruk as the first complete end-to-end slice and as the migration-template fixture.
- Preserve the legacy runtime until the new slice is validated and an entry-point switch is reversible.
- Make committed migrations the only authoritative schema-change mechanism.
- Migrate content and learner progress through explicit mapping ledgers, adapters, fixtures, and reconciliation reports.
- Remove legacy runtime code only after parity and recovery gates are met.

## Why the repository is retained

- Git history records the origin and evolution of content and technical assumptions.
- Existing authored copy, resource links, and media have real reuse value after review.
- Authentication/profile behavior and Supabase integration provide useful implementation evidence.
- Vite/React/TanStack/Supabase remain suitable foundations.
- Existing IDs and completed-node records are necessary inputs to a safe migration.
- GitHub and Vercel continuity reduces operational risk.

## Why the runtime architecture is replaced

- A single era timeline cannot model reusable lessons across authored journeys.
- `App.tsx` conflates navigation, loading, domain rules, persistence, progression, and presentation.
- Route-less state prevents durable deep links and meaningful resume.
- XP/levels/rarity/stats and perfect-score gating conflict with product invariants.
- Array-index collectible references are not stable identities.
- Browser/UI-owned rules cannot guarantee idempotency, authorization, or transactional completion.
- Raw static imports and hosted/manual SQL lack the validation and recovery guarantees required for release.

## Preservation rules

Preserve until reviewed:

- repository and deployment history;
- pinned dependencies and useful build configuration;
- historical copy and quiz prompts as editorial source material;
- source/resource links and media as provenance candidates;
- semantically equivalent legacy lesson IDs and all ID mapping evidence;
- auth/profile intent and completed-node data;
- legacy SQL and setup notes as migration evidence.

Preservation does not mean automatic publication or schema compatibility.

## Deletion rules

Delete or archive legacy material only when all applicable conditions hold:

1. a target replacement or explicit archival disposition exists;
2. stable IDs and learner progress have a deterministic mapping or documented exception;
3. content, source, and media parity is recorded;
4. migration rehearsal and reconciliation pass;
5. rollback/recovery is documented;
6. no active route or import depends on the material;
7. the deletion occurs in a focused, reviewable change after the new entry point is stable.

XP, levels, rarity, stats, and tactical UI may be deleted rather than migrated, but their old persisted fields must remain understood until legacy learner reconciliation is complete.

## Consequences

The repository temporarily contains two architectures and requires strict dependency boundaries. Progress is slower at the start because adapters, mappings, and validation are explicit. In return, each vertical outcome is reviewable, rollback remains possible, and useful content/data is not confused with obsolete runtime design.

## Alternatives rejected

- **Reskin/refactor in place inside `App.tsx`:** preserves coupling and makes the old timeline model the accidental domain model.
- **New repository:** loses history, content provenance, operational continuity, and migration evidence.
- **Big-bang replacement:** creates unacceptable learner-data, content, and rollback risk.
