# ADR 002: Transactional progress command

- Status: Accepted for the Uruk foundation
- Date: 2026-07-13
- Decision owners: Chronos product and engineering

## Decision

Use a migration-defined PostgreSQL function as the foundational transactional command boundary for lesson completion and deterministic Knowledge Card acquisition. The application-facing command and result remain framework-independent so the boundary can later move behind a Vercel/server API without rewriting clients.

The function derives the learner exclusively from `auth.uid()`, rejects unauthenticated calls, validates the learner-owned progress and attempts, uses a fixed empty `search_path` with fully qualified names, accepts a learner-scoped idempotency key, and completes the lesson plus grants its configured card in one transaction. Database uniqueness makes completion and ownership safe under retries and concurrency. The result distinguishes newly created state from existing state.

Execution is revoked from `PUBLIC`, `anon`, and `service_role`, and granted only to `authenticated`. This intentionally exposed `SECURITY DEFINER` command is narrow, validates every identifier and owner internally, and makes no authorization decision from editable `user_metadata`.

## Consequences

PostgreSQL is initially both the durable system of record and atomic command boundary. UI and application contracts do not depend on Supabase transport details. Advisor findings for an authenticated security-definer function must be reviewed as an intentional privileged per-user endpoint, with the function body and grants audited on every change.
