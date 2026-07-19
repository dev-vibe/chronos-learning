# Multi-lesson Learn runtime seam

[ASH-63](https://linear.app/ashs-workshop/issue/ASH-63/publish-early-writing-systems-and-prove-the-reusable-learn-pipeline) turns the accepted Uruk vertical slice into a content-driven two-lesson runtime without introducing a general-purpose page builder.

- `content/chronos.ts` is a small aggregation boundary. Authored lesson data lives in `content/lessons/uruk.ts`, `content/lessons/early-writing-systems.ts`, and the bounded unpublished farming stub; World History ordering lives in `content/journeys/world-history.ts`.
- `content/assemble.ts` combines bounded modules without copying their content. Content validation runs against that assembled bundle, so duplicate stable IDs and broken references across lesson, journey, prompt, media, source, claim, and card modules fail together.
- `LearnApp` resolves the current lesson and ordered journey neighbors from assembled content. It performs one detailed progress load for the current lesson and one bounded summary load for journey-rail completion state; other lessons do not load exploration details, attempts, or ownership.
- Prompt controls are selected by the prompt contract. Completion readiness, required-attempt counts, instructions, and button state derive only from prompts whose contract has `required: true`; the database completion command remains authoritative.
- Progress keys, explored-section state, attempts, completion, and card ownership remain lesson-scoped. Every lesson navigation or reload starts at the top; explored-section state never triggers a resume banner, automatic scrolling, or viewport restoration. Card reveal is driven by the completion result and only appears for `newly-acquired`; an owned card gets a quiet revisit state.
- Page title, description, masthead, hero, provenance, and evidence source context are lesson data. Invalid and unpublished routes fail closed.
- The media build emits shared `chronos-media.json` and `chronos-release.json` manifests. Per-asset catalog collections still organize object keys, while provider-neutral resolution and approved-publication gates remain unchanged.

This is intentionally a small reusable seam: the existing typed module vocabulary is shared, but lesson composition and editorial pacing remain authored rather than abstracted into arbitrary HTML or a universal page-builder configuration.
