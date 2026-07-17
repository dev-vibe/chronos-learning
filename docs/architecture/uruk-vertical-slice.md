# Uruk first vertical slice

Status: exact proposed scope for the first implementation after ASH-52. This document is a build contract, not an implementation in this branch.

## Outcome

A learner can open the World History journey, study one canonical Uruk lesson in the stable Learn shell, resume at a meaningful section, sincerely attempt a short understanding check, explicitly complete the lesson, and discover one Uruk Knowledge Card exactly once. The flow demonstrates content validation, evidence-aware visuals, durable progress, and the legacy migration seam without attempting the full rebuild.

## Included end-to-end scope

- One routed desktop/mobile Learn shell with a minimal World History journey rail/drawer.
- One canonical lesson: `lesson.uruk.first-city` (final ID subject to the mapping fixture), aliased from legacy `uruk` only after semantic-equivalence review.
- One journey with a small Foundations chapter and enough neighboring entry stubs to show previous/current/next state. Only Uruk requires full content.
- Repository-authored, schema-validated content and a typed module renderer.
- Authenticated durable progress plus a versioned local guest adapter.
- Stable section resume, one understanding check, explicit completion, and deterministic card unlock.
- One Knowledge Card for Uruk with provenance and depiction labeling.
- Migration fixtures for the legacy Uruk content and representative `completed_nodes` states.

## Lesson structure

The lesson uses seven stable semantic sections. Proposed IDs and intent:

1. `masthead` — c. 3500–3000 BCE, southern Mesopotamia, significance: city-scale coordination changed human life.
2. `opening-city-question` — hook: what makes a settlement a city, and what problems appear when thousands live together?
3. `water-food-and-labor` — irrigation, surplus, specialization, institutions, inequality; avoid a simple “civilization began” claim.
4. `the-built-city` — Eanna/monumental precinct, mudbrick environment, neighborhoods, walls, and what archaeology can support.
5. `tablets-and-administration` — clay tokens/tablets and proto-cuneiform as evidence of administration; close with the concise synthesis that records and ideas could travel beyond one person's memory, connecting to the separate writing lesson without absorbing it.
6. `evidence-and-reconstruction` — compare an actual artifact/site record with a clearly labeled reconstruction and list uncertainty.
7. `check-and-complete` — one restrained World Check, two prompts, explanatory feedback, explicit completion, and post-completion next action.

Uruk does not use a standalone `connections` section. Its relationship to earlier farming and later writing remains authored curriculum metadata and visible instructional synthesis inside `tablets-and-administration`; this useful knowledge is not withheld until completion. Because Early Writing Systems is already the next required World History entry, the actual navigation control appears in the completed state as the primary “Continue World History” action rather than through a separate link-like section.

Each section has an immutable ID, heading, purpose, typed modules, and source/claim references. Copy from the legacy `uruk` record is input to a new research/editorial pass, not copied wholesale.

## Local progress and resume

- Entering the lesson records `in_progress` without implying completion.
- The client observes section visibility and stores a debounced local hint; only stable section IDs are persisted, never exact scroll pixels.
- A meaningful resume update occurs after the learner engages with or passes a section threshold, not on every scroll event.
- Returning opens the lesson at the last meaningful section with a quiet “Resume from…” option and an equally clear way to start at the top.
- Authenticated state is durable across devices. Guest state is namespaced and versioned locally, with an explicit future migration seam.
- If a stored section no longer exists, resume falls back to the nearest valid predecessor and records a recoverable diagnostic.

## Understanding check

Two required explanatory prompts are sufficient for the slice:

1. A supported selection/comparison prompt: which evidence best supports the claim that Uruk required organized administration? Feedback explains why a tablet or seal is evidence and why a reconstruction is not direct evidence.
2. A concise explanation prompt: name one opportunity and one cost or challenge of city life in Uruk, using lesson evidence.

Completion requires a sincere attempt at both prompts, not perfect accuracy. Multiple-choice retries are unpunished; explanation acceptance uses transparent minimum engagement (non-empty, reasonable length) and does not pretend to grade historical sophistication automatically. Attempts have stable prompt IDs and are retained for resume; free text is excluded from general analytics.

## Explicit completion

After the required attempts, the completion panel enables a single primary “Complete lesson” action. The command includes an idempotency key and atomically:

- marks canonical Uruk completion once;
- retains the audience level and completion timestamp;
- updates the active World History location/next action;
- grants the configured Uruk card if not already owned;
- returns `newly_discovered` or `already_owned` without creating duplicates.

Refresh, retry, double-click, and a second journey context must not duplicate completion or ownership. Card reveal is presentation after a successful command; closing it never rolls back completion.

After completion, “Continue World History: Early Writing Systems” is the primary next action. It has no effect on Uruk completion beyond navigating to the derived next entry. No optional exploration panel is shown unless a distinct authored Story Arc, Idea Trail, or Investigation is eligible.

## Evidence and reconstruction treatment

- Use at least one actual evidence asset (artifact, excavation/site plan, or institutionally sourced site image) on a neutral evidence surface with source, license, caption, and alt text.
- A cinematic Uruk scene may be used only from an approved visual brief and must be labeled “Evidence-based reconstruction.”
- The reconstruction caption identifies which details are supported, inferred, generalized, or unknown.
- Administrative tablets/seals must not be described as proof of every social or political claim.
- Claims distinguish observation, interpretation, and uncertainty. Avoid presenting Uruk as the uncontested first or only city.
- The lesson may use a simple Chronos-styled raster map to explain Uruk's relationship to the southern Mesopotamian river, wetland, and Gulf system. Its geography follows real scholarly references and authoritative city coordinates; changing channels, marshes, and shoreline remain explicitly approximate.
- The Uruk map's references, coordinate checks, uncertainty boundary, and generated-art lineage are recorded in `docs/research/uruk-southern-mesopotamia-map.md` and follow `docs/content/historical-map-production.md` as the reusable lesson-map process.
- Generated artwork contains no title, educational paragraph, or UI chrome. The map may contain only the short, source-verified geographic labels and spatial annotations listed in its reviewed brief.

The existing `public/images/places/uruk.jpg` is a candidate only. It must pass provenance, rights, historical, crop, resolution, and depiction review before use.

## Knowledge Card behavior

The slice defines one deterministic card, tentatively `card.place.uruk`:

- category `place`, class `foundation`;
- discovered only on explicit Uruk lesson completion;
- one global ownership row per learner/card;
- title, date range, place, compact significance, three to five facts, lesson connection, sources, evidence, visual brief, and depiction mode;
- no rarity, stats, XP, duplicate, currency, pack, or random behavior;
- a short reduced-motion-safe reveal for a newly owned card;
- `already_owned` returns a quiet acknowledgment and proceeds to the next action.

A full Collection grid is deferred. The slice may include a minimal card detail route or completion detail panel sufficient to verify provenance and return to the lesson.

## Legacy migration fixture

The slice must include a reviewed mapping from legacy `uruk` to the canonical ID and document whether completion is equivalent. Test fixtures cover:

- no legacy progress;
- legacy `completed_nodes` contains `uruk`;
- duplicate/retried legacy rows after normalization;
- legacy XP/card indexes present but ignored;
- missing or invalid resume section;
- existing canonical card ownership.

The migration output reports imported completion, ignored game fields, unresolved assets, and exceptions. It does not write to the hosted project outside committed/rehearsed migrations.

## Acceptance criteria

- A new learner can reach Uruk from a stable World History rail/drawer and the URL identifies both journey and lesson context.
- Refresh restores the selected journey, lesson, and last meaningful section.
- Desktop and mobile use the same lesson semantics; mobile replaces the pinned rail with an accessible drawer.
- All lesson modules and references pass schema/content validation in CI.
- The lesson presents five to eight semantic sections and distinguishes evidence from reconstruction.
- Both required prompts accept sincere attempts; a wrong choice does not block completion.
- Completion occurs only through the explicit action and remains correct under retries/concurrency.
- Completing Uruk is global and can be recognized from another journey context without replay.
- The Uruk card is granted once, reveals only when new, includes provenance/depiction mode, and has no game-economy fields.
- Keyboard, screen-reader landmarks/focus, reduced motion, contrast, alt text, and touch targets meet the agreed WCAG 2.2 AA baseline.
- The legacy mapping fixture produces a deterministic reconciliation report.
- Empty-database migrations and representative legacy-fixture migrations pass without manual dashboard changes.

## Deliberately deferred

- Full World Spine curriculum, complete journey switching, Library, Home dashboard, search, recommendations, and contextual journey invitations.
- Full Collection grid, sets, filters, multiple cards, and polished animation.
- Ancient Egypt, Writing Changes the World, Rapa Nui, shared-lesson UI beyond the minimum global-completion proof.
- Audience variants beyond one default Explorer presentation.
- Editorial CMS; repository files plus validation are sufficient.
- Atlas and maps as a global exploration interface, graph UI, analytics dashboards, educator views, offline lesson packs, and broad content migration. A bounded explanatory map inside the authored Uruk lesson is part of the slice, not the deferred Atlas.
- Deletion of `App.tsx` or other legacy runtime files before entry-point parity and rollback gates pass.

## Implementation sequence

1. Approve canonical terminology/IDs and the trusted transactional command boundary.
2. Add domain schemas, content validation, and Uruk fixtures.
3. Add committed empty-database migrations and RLS/integration tests.
4. Build the routed shell and typed Uruk renderer.
5. Implement resume, prompts, explicit completion, and card acquisition.
6. Run migration reconciliation, accessibility checks, responsive end-to-end tests, and a focused learner walkthrough.
7. Switch an opt-in development entry point only after all acceptance criteria pass.
