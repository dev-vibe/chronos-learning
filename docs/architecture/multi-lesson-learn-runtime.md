# Multi-lesson Learn runtime seam

ASH-57 turns the accepted Uruk vertical slice into a content-driven two-lesson runtime without introducing a general-purpose page builder.

- `content/chronos.ts` is the repository-authored lesson registry. Stable IDs, status, journey placement, semantic sections, prompts, media, sources, claims, and deterministic card unlocks are resolved from typed content.
- `LearnApp` resolves the current lesson and its ordered journey neighbors from content. It loads progress for each published lesson in the active journey, renders draft entries as unavailable, and derives previous/next actions without lesson-specific branches.
- Prompt controls are selected by the prompt contract. Options and minimum response lengths are authored data; completion readiness uses the current lesson's required prompt IDs, while the database completion command remains authoritative.
- Progress keys, resume state, attempts, completion, and card ownership are lesson-scoped. Card reveal is driven by the completion result and only appears for `newly-acquired`; an owned card gets a quiet revisit state.
- Page title, description, masthead, hero, provenance, and evidence source context are lesson data. Invalid and unpublished routes fail closed.
- The media build emits shared `chronos-media.json` and `chronos-release.json` manifests. Per-asset catalog collections still organize object keys, while provider-neutral resolution and approved-publication gates remain unchanged.

This is intentionally a small reusable seam: the existing typed module vocabulary is shared, but lesson composition and editorial pacing remain authored rather than abstracted into arbitrary HTML or a universal page-builder configuration.
