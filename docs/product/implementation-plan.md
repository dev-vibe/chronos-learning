# Chronos Ordered Implementation Tickets

**Version 1.0 | July 2026**

## How to use this backlog

- Execute tickets in numeric order unless the Parallelization Guide explicitly says otherwise.
- Each ticket is intended to be independently assignable and to end in a reviewable increment.
- P0 tickets form the foundational release. P1 and P2 tickets may be deferred only where marked and without violating dependencies.
- Content, design, and engineering should run as coordinated tracks; “done” includes validation, tests, and documentation rather than code alone.

# Backlog conventions

**Outcome:** The user, product, or system result the ticket must create.

**Dependencies:** Tickets that must be substantially complete before this ticket can close.

**Implementation notes:** Scope guidance; not an exhaustive technical prescription.

**Acceptance criteria:** Observable conditions required to close the ticket.

**Priority:** P0 = launch-critical foundation; P1 = important but potentially deferrable; P2 = post-launch/advanced.

# Parallelization guide

- **After CHR-006:** Design prototypes CHR-007 and CHR-008 can run in parallel.

- **After CHR-010:** Lesson, entity, source, and journey schema work can be distributed, but integration must converge before migrations.

- **After CHR-029 to CHR-032:** Desktop/mobile Learn components, Home/Library, and card-frame work can proceed in separate feature branches against stable contracts.

- **After editorial workflows exist:** World Spine, Egypt, Writing, Rapa Nui, and initial card production can run as separate content pods with shared historical review.

- **Before beta:** Accessibility, performance, migration, content QA, and end-to-end testing should run concurrently, with launch blocked by any unresolved P0/P1 issue.

# Phase summary

| **Phase**                                                       | **Tickets** | **Primary deliverable**                                   | **Exit condition**                                    |
|-----------------------------------------------------------------|-------------|-----------------------------------------------------------|-------------------------------------------------------|
| Phase 0 - Product and Technical Foundation                      | CHR-001–009 | Validated scope, architecture, and interaction prototypes | Target learners understand the stable journey model.  |
| Phase 1 - Core Platform and Data Model                          | CHR-010–028 | Typed domain model, persistence, and application services | Core rules work independently of UI.                  |
| Phase 2 - Design System and Stable Learning Shell               | CHR-029–042 | Responsive stable Learn shell                             | A learner can complete lessons across journeys.       |
| Phase 3 - Home, Journeys, and Discovery                         | CHR-043–051 | Home, switching, contextual discovery, and Library        | Learners can resume and intentionally open paths.     |
| Phase 4 - Knowledge Cards and Personal Atlas                    | CHR-052–061 | Knowledge Cards, collection, and media pipeline           | Cards reward learning and preserve provenance.        |
| Phase 5 - Investigations and Historical Reasoning               | CHR-062–065 | Evidence-based Investigation engine                       | Learners can reason under uncertainty.                |
| Phase 6 - Audience Depth, Accessibility, and Resilience         | CHR-066–072 | Audience depth, accessibility, and resilience             | Core flows work inclusively and reliably.             |
| Phase 7 - Editorial Tooling and Reference Content               | CHR-073–082 | Editorial tooling and launch curriculum                   | Complete reviewed reference corpus exists.            |
| Phase 8 - Analytics, Quality, Migration, and Launch             | CHR-083–097 | Analytics, QA, migration, beta, and launch                | Release meets product, learning, and technical gates. |
| Phase 9 - Post-Launch Expansion (Ordered after a stable launch) | CHR-098–100 | Measured expansion and advanced tools                     | Growth preserves the simple default experience.       |

# Ordered ticket backlog

# Phase 0 - Product and Technical Foundation

**9 tickets**

## 0A. Decisions and baseline

CHR-001 \| Confirm MVP scope and product invariants

| **Priority:** P0 | **Dependencies:** None | **Sequence:** 1 |
|------------------|------------------------|-----------------|

**Outcome:** Freeze the first releasable slice and prevent the journey, card, and graph concepts from expanding during implementation.

**Implementation notes:** Create an ADR/product decision record covering the stable learning shell, journey types included in MVP, card acquisition rules, audience level, and explicit non-goals.

**Acceptance criteria**

- A signed-off scope record exists.

- World Spine, one Story Arc, one Idea Trail, and one Investigation are identified as the reference content set.

- Random rewards, duplicate cards, graph visualization, and card-game mechanics are explicitly excluded.

CHR-002 \| Audit the current Chronos application and repository

| **Priority:** P0 | **Dependencies:** CHR-001 | **Sequence:** 2 |
|------------------|---------------------------|-----------------|

**Outcome:** Establish what can be retained, refactored, or removed before building the new architecture.

**Implementation notes:** Inventory routes, components, data models, auth, content loaders, progress logic, styling, tests, and deployment configuration.

**Acceptance criteria**

- Audit lists reusable, replaceable, and obsolete elements.

- Current data migration risks are documented.

- A route and component dependency map is committed to the repository.

CHR-003 \| Define technical architecture and module boundaries

| **Priority:** P0 | **Dependencies:** CHR-002 | **Sequence:** 3 |
|------------------|---------------------------|-----------------|

**Outcome:** Choose the implementation shape for journeys, lessons, cards, progress, search, and editorial data.

**Implementation notes:** Document server/client boundaries, persistence, content ingestion, caching, image delivery, and ownership of derived progress.

**Acceptance criteria**

- Architecture diagram and ADR are committed.

- Each domain has a named module and API boundary.

- No UI component reads raw content files or database tables directly.

CHR-004 \| Define product terminology and canonical naming

| **Priority:** P0 | **Dependencies:** CHR-001 | **Sequence:** 4 |
|------------------|---------------------------|-----------------|

**Outcome:** Remove ambiguity between nodes, lessons, entries, arcs, trails, cards, artifacts, and investigations.

**Implementation notes:** Create a glossary used by code, content, design, analytics, and UI copy.

**Acceptance criteria**

- Canonical internal and learner-facing names are documented.

- Journey type enum values are fixed.

- Existing conflicting names have a migration plan.

CHR-005 \| Create the implementation repository conventions

| **Priority:** P0 | **Dependencies:** CHR-003 | **Sequence:** 5 |
|------------------|---------------------------|-----------------|

**Outcome:** Standardize feature folders, schemas, tests, fixtures, content files, and generated assets.

**Implementation notes:** Add conventions for domain modules, UI primitives, route names, story files, test factories, and content IDs.

**Acceptance criteria**

- Conventions are documented in CONTRIBUTING.md.

- Linting and type checking enforce import boundaries where practical.

- A sample feature demonstrates the convention.

## 0B. Design validation

CHR-006 \| Produce high-fidelity reference screens

| **Priority:** P0 | **Dependencies:** CHR-001 | **Sequence:** 6 |
|------------------|---------------------------|-----------------|

**Outcome:** Create the visual source of truth for the stable shell and card system before component implementation.

**Implementation notes:** Produce desktop and mobile designs for Home, Learn, Library, Collection, card reveal, card detail, and Investigation. Use the PRD prompt pack as input, then normalize into one coherent design system.

**Acceptance criteria**

- All required screens exist at desktop and mobile breakpoints.

- Every interactive state needed for MVP is represented.

- Design review confirms the shell remains simple when changing journeys.

CHR-007 \| Prototype the journey rail and lesson interaction

| **Priority:** P0 | **Dependencies:** CHR-006 | **Sequence:** 7 |
|------------------|---------------------------|-----------------|

**Outcome:** Validate navigation density, scrolling, locking, chapters, and mobile behavior using realistic content.

**Implementation notes:** Build a disposable or Storybook prototype with at least 20 rail entries and a long lesson.

**Acceptance criteria**

- A learner can locate current, previous, next, optional, and locked lessons without instruction.

- Desktop and mobile prototypes pass an internal usability walkthrough.

- Rail and lesson scrolling behavior is finalized.

CHR-008 \| Prototype card reveal and collection interactions

| **Priority:** P0 | **Dependencies:** CHR-006 | **Sequence:** 8 |
|------------------|---------------------------|-----------------|

**Outcome:** Validate that cards feel rewarding without interrupting learning or resembling a game economy.

**Implementation notes:** Prototype inline card, reveal overlay, collection grid, and detail/evidence view.

**Acceptance criteria**

- Reveal can be dismissed immediately and never blocks completion.

- Previously acquired cards do not reveal again.

- Card detail clearly distinguishes illustration from evidence.

CHR-009 \| Run a focused usability test with target learners

| **Priority:** P0 | **Dependencies:** CHR-007, CHR-008 | **Sequence:** 9 |
|------------------|------------------------------------|-----------------|

**Outcome:** Test the main mental model before expensive implementation.

**Implementation notes:** Test with several learners around ages 10-14 and at least one adult. Focus on “what do I do next?”, switching journeys, card meaning, and investigation uncertainty.

**Acceptance criteria**

- Findings are documented by severity.

- Critical confusion is resolved in designs.

- A learner can explain the difference between World History and an optional Story in their own words.

# Phase 1 - Core Platform and Data Model

**19 tickets**

## 1A. Domain schemas and persistence

CHR-010 \| Implement canonical ID and date-range primitives

| **Priority:** P0 | **Dependencies:** CHR-003, CHR-004 | **Sequence:** 10 |
|------------------|------------------------------------|------------------|

**Outcome:** Provide stable IDs and chronology types shared across all historical entities.

**Implementation notes:** Support BCE/CE, approximate dates, ranges, unknown endpoints, display labels, and chronological sorting.

**Acceptance criteria**

- Types reject invalid ranges.

- BCE and CE values sort correctly across year zero.

- Display formatting has unit tests for exact, circa, range, century, and unknown dates.

CHR-011 \| Implement LessonNode schema and repository

| **Priority:** P0 | **Dependencies:** CHR-010 | **Sequence:** 11 |
|------------------|---------------------------|------------------|

**Outcome:** Create the reusable lesson entity independent of journeys.

**Implementation notes:** Include identity, chronology, geography, summary, significance, content modules, entities, concepts, claims, sources, audience presentations, and status.

**Acceptance criteria**

- Schema validation runs at ingestion.

- Lessons can be loaded by ID through a repository interface.

- Invalid entity and source references are reported clearly.

CHR-012 \| Implement Journey and JourneyEntry schemas

| **Priority:** P0 | **Dependencies:** CHR-011 | **Sequence:** 12 |
|------------------|---------------------------|------------------|

**Outcome:** Represent authored ordered paths and context-specific framing.

**Implementation notes:** Support type, chapters, opening question, entry order, requirement level, prerequisites, title override, transitions, significance-here, and synthesis entries.

**Acceptance criteria**

- One lesson can appear in multiple journeys without duplication.

- Entry ordering is deterministic.

- Required, recommended, and optional entries validate correctly.

CHR-013 \| Implement historical entity schemas

| **Priority:** P0 | **Dependencies:** CHR-010 | **Sequence:** 13 |
|------------------|---------------------------|------------------|

**Outcome:** Represent people, places, inventions, artifacts, events, ideas, cultures, and concepts independently of cards.

**Implementation notes:** Provide shared provenance and relationship fields while allowing category-specific metadata.

**Acceptance criteria**

- Every entity has a stable ID and category.

- Cross-entity references validate.

- Entities can exist without having a collectible card.

CHR-014 \| Implement KnowledgeCard and CardSet schemas

| **Priority:** P0 | **Dependencies:** CHR-013 | **Sequence:** 14 |
|------------------|---------------------------|------------------|

**Outcome:** Represent the distilled collectible knowledge layer separately from historical entities.

**Implementation notes:** Support card category, class, image treatment, short copy, significance, facts, connections, sources, evidence, set membership, and reveal configuration.

**Acceptance criteria**

- Cards reference a historical entity or explicitly documented composite concept.

- Cards validate front and detail requirements.

- No rarity, power, duplicate, or randomized drop fields exist.

CHR-015 \| Implement source, claim, and uncertainty schemas

| **Priority:** P0 | **Dependencies:** CHR-011 | **Sequence:** 15 |
|------------------|---------------------------|------------------|

**Outcome:** Make historical provenance and contested interpretation first-class data.

**Implementation notes:** Claims should support citations, confidence, scope, review status, and alternatives. Sources should support license and attribution metadata.

**Acceptance criteria**

- A claim can cite multiple sources.

- Contested claims can store competing interpretations without choosing false certainty.

- Source license and attribution are required for publishable media.

CHR-016 \| Implement visual brief schema

| **Priority:** P0 | **Dependencies:** CHR-014, CHR-015 | **Sequence:** 16 |
|------------------|------------------------------------|------------------|

**Outcome:** Capture evidence, required details, prohibited anachronisms, uncertainty, and depiction mode for generated artwork.

**Implementation notes:** Follow the PRD visual brief model and include generation/review lineage.

**Acceptance criteria**

- Every generated card image can point to a visual brief.

- Briefs support documented likeness, reconstruction, symbolic illustration, and artifact-focused modes.

- Approval status and reviewer notes are stored.

CHR-017 \| Implement user progress schemas

| **Priority:** P0 | **Dependencies:** CHR-012, CHR-014 | **Sequence:** 17 |
|------------------|------------------------------------|------------------|

**Outcome:** Store global lesson completion, active journey position, card ownership, responses, and investigation state.

**Implementation notes:** Keep lesson completion global while deriving journey completion from required entries.

**Acceptance criteria**

- Completing one lesson affects every journey containing it.

- Card ownership is unique per user and card.

- Progress updates are idempotent.

CHR-018 \| Create database migrations and indexes

| **Priority:** P0 | **Dependencies:** CHR-011 through CHR-017 | **Sequence:** 18 |
|------------------|-------------------------------------------|------------------|

**Outcome:** Persist the new domain efficiently and safely.

**Implementation notes:** Create normalized tables or equivalent storage, foreign keys, uniqueness constraints, and indexes for common retrieval paths.

**Acceptance criteria**

- Migrations run cleanly on empty and representative existing databases.

- Uniqueness prevents duplicate journey entries and card ownership.

- Query plans are acceptable for reference dataset sizes.

CHR-019 \| Build typed repositories and service interfaces

| **Priority:** P0 | **Dependencies:** CHR-018 | **Sequence:** 19 |
|------------------|---------------------------|------------------|

**Outcome:** Separate business rules from persistence and route handlers.

**Implementation notes:** Create repositories/services for lessons, journeys, entities, cards, sources, progress, and recommendations.

**Acceptance criteria**

- Domain services are testable without HTTP.

- Repositories return typed domain objects.

- No route duplicates progress or sequencing rules.

CHR-020 \| Create content validation CLI

| **Priority:** P0 | **Dependencies:** CHR-011 through CHR-016 | **Sequence:** 20 |
|------------------|-------------------------------------------|------------------|

**Outcome:** Allow editors and CI to validate the whole curriculum graph before deployment.

**Implementation notes:** Validate IDs, references, ordering, prerequisites, source metadata, image licenses, card links, and unreachable content.

**Acceptance criteria**

- CLI exits nonzero on invalid content.

- Errors include file and field location.

- CI runs validation on every content change.

## 1B. API and application services

CHR-021 \| Implement journey retrieval API

| **Priority:** P0 | **Dependencies:** CHR-019 | **Sequence:** 21 |
|------------------|---------------------------|------------------|

**Outcome:** Return journey metadata, chapters, entries, progress, and next-action state.

**Implementation notes:** Support summary and full forms; do not expose internal editorial fields to learners.

**Acceptance criteria**

- API returns ordered entries and derived state.

- Unauthorized user data is inaccessible.

- Response contract has integration tests.

CHR-022 \| Implement lesson retrieval API

| **Priority:** P0 | **Dependencies:** CHR-019 | **Sequence:** 22 |
|------------------|---------------------------|------------------|

**Outcome:** Return the lesson presentation appropriate to user audience and journey context.

**Implementation notes:** Merge reusable lesson content with JourneyEntry framing on the server.

**Acceptance criteria**

- Same lesson returns different framing in different journeys without duplicating core content.

- Audience presentation is selected deterministically.

- Missing optional modules do not break rendering.

CHR-023 \| Implement progress command service and API

| **Priority:** P0 | **Dependencies:** CHR-017, CHR-019 | **Sequence:** 23 |
|------------------|------------------------------------|------------------|

**Outcome:** Record lesson starts, section progress, completion, checks, and active journey position.

**Implementation notes:** Use idempotency and transaction boundaries for completion plus card acquisition.

**Acceptance criteria**

- Repeated completion calls do not duplicate rewards.

- Journey completion is recalculated correctly.

- Concurrent updates do not lose progress.

CHR-024 \| Implement card acquisition service

| **Priority:** P0 | **Dependencies:** CHR-014, CHR-017, CHR-023 | **Sequence:** 24 |
|------------------|---------------------------------------------|------------------|

**Outcome:** Award deterministic cards from configured learning moments.

**Implementation notes:** Evaluate reveal rules after relevant progress commands and return newly acquired cards.

**Acceptance criteria**

- Only configured cards are awarded.

- A card is owned once globally.

- Already-owned cards return a quiet known-card state rather than another reveal.

CHR-025 \| Implement collection and card-detail APIs

| **Priority:** P0 | **Dependencies:** CHR-019, CHR-024 | **Sequence:** 25 |
|------------------|------------------------------------|------------------|

**Outcome:** Return owned cards, filtering metadata, sets, connections, evidence, and originating lessons.

**Implementation notes:** Support pagination and category/set filters.

**Acceptance criteria**

- Only acquired cards appear in the owned collection.

- Card detail includes attribution and depiction label.

- Connections resolve to accessible destinations.

CHR-026 \| Implement active journey and journey-switching service

| **Priority:** P0 | **Dependencies:** CHR-021, CHR-023 | **Sequence:** 26 |
|------------------|------------------------------------|------------------|

**Outcome:** Allow several open journeys while preserving a single current journey and last location per journey.

**Implementation notes:** Opening or switching journeys must not alter global completion.

**Acceptance criteria**

- User resumes each journey at its last meaningful entry.

- Switching is atomic and reflected across devices.

- Archived/closed journeys can be reopened without losing progress.

CHR-027 \| Implement shared-lesson revisit resolver

| **Priority:** P0 | **Dependencies:** CHR-022, CHR-023 | **Sequence:** 27 |
|------------------|------------------------------------|------------------|

**Outcome:** Determine whether to show full lesson, refresher, or context-specific bridge.

**Implementation notes:** Use completion history and journey framing to produce revisit state.

**Acceptance criteria**

- Completed shared lessons are never silently skipped when new framing exists.

- Learner may review the full lesson.

- New perspective can be completed independently without duplicating base completion.

CHR-028 \| Implement contextual journey invitation service

| **Priority:** P0 | **Dependencies:** CHR-021, CHR-023 | **Sequence:** 28 |
|------------------|------------------------------------|------------------|

**Outcome:** Return at most one authored optional invitation at a contextually meaningful moment without disrupting required learning.

**Implementation notes:** Invitations are authored, not inferred solely from tags. They may appear in a lesson, at completion, or on a later discovery surface, but never as lesson sections or completion gates. Include save/dismiss/snooze/open behavior and preserve the learner's lesson position.

**Acceptance criteria**

- Invitations never count as lesson sections or required progress.

- Any current required action remains visually primary.

- Invitation state is excluded from lesson-section and journey-completion calculations.

- Opening or dismissing an invitation from an in-lesson surface returns the learner to the same meaningful position without progress loss.

- Dismissal is remembered.

- Opening creates or activates the journey at its intended start.

# Phase 2 - Design System and Stable Learning Shell

**14 tickets**

## 2A. Foundations

CHR-029 \| Implement Chronos design tokens

| **Priority:** P0 | **Dependencies:** CHR-006 | **Sequence:** 29 |
|------------------|---------------------------|------------------|

**Outcome:** Create the approved dark archival visual system as reusable tokens.

**Implementation notes:** Define typography, spacing, surfaces, borders, cyan/amber accents, state colors, elevation, radii, motion, and readable content widths.

**Acceptance criteria**

- Tokens work in light-independent dark mode.

- Contrast meets WCAG AA for normal text.

- Components do not hard-code one-off colors or spacing.

CHR-030 \| Implement responsive application shell

| **Priority:** P0 | **Dependencies:** CHR-029 | **Sequence:** 30 |
|------------------|---------------------------|------------------|

**Outcome:** Build global navigation and content regions for desktop and mobile.

**Implementation notes:** Support Home, Learn, Library, Collection, and Profile with safe-area handling.

**Acceptance criteria**

- Navigation works by keyboard and touch.

- Current destination is announced accessibly.

- No horizontal page overflow at supported breakpoints.

CHR-031 \| Build common content and state primitives

| **Priority:** P0 | **Dependencies:** CHR-029 | **Sequence:** 31 |
|------------------|---------------------------|------------------|

**Outcome:** Create buttons, chips, progress, tabs, cards, dialogs, drawers, skeletons, empty states, and error states.

**Implementation notes:** Use accessible primitives and consistent state treatment.

**Acceptance criteria**

- Each primitive has Storybook examples or equivalent.

- Focus states and reduced-motion behavior are present.

- Loading and error layouts do not shift excessively.

CHR-032 \| Implement historical date and role components

| **Priority:** P0 | **Dependencies:** CHR-010, CHR-031 | **Sequence:** 32 |
|------------------|------------------------------------|------------------|

**Outcome:** Standardize dates, places, role chips, type labels, and source badges across the product.

**Implementation notes:** Ensure BCE/CE and uncertainty are legible to young learners.

**Acceptance criteria**

- All chronology formats use the shared formatter.

- Approximation and uncertainty are not hidden.

- Components support screen readers.

## 2B. Learn shell

CHR-033 \| Build desktop journey rail

| **Priority:** P0 | **Dependencies:** CHR-021, CHR-029 through CHR-032 | **Sequence:** 33 |
|------------------|----------------------------------------------------|------------------|

**Outcome:** Render chapters and lesson entries with progress, locking, and optionality.

**Implementation notes:** Use semantic navigation and virtualization only if required.

**Acceptance criteria**

- Current lesson, completed, available, optional, and locked states are distinguishable without color alone.

- Rail scroll position follows the current entry without hijacking user scroll.

- Clicking an available entry updates the lesson and URL.

CHR-034 \| Build mobile journey progress header and drawer

| **Priority:** P0 | **Dependencies:** CHR-033 | **Sequence:** 34 |
|------------------|---------------------------|------------------|

**Outcome:** Provide the same journey information without competing with lesson content.

**Implementation notes:** Use a compact header and accessible drawer or full-screen sheet.

**Acceptance criteria**

- Current position and next lesson are visible without opening the drawer.

- Drawer supports chapter navigation and preserves lesson scroll.

- Back behavior is predictable.

CHR-035 \| Build lesson masthead and narrative renderer

| **Priority:** P0 | **Dependencies:** CHR-022, CHR-031, CHR-032 | **Sequence:** 35 |
|------------------|---------------------------------------------|------------------|

**Outcome:** Render title, chronology, place, significance, sections, and rich content modules.

**Implementation notes:** Create a typed module renderer rather than arbitrary untrusted HTML.

**Acceptance criteria**

- All MVP module types render on desktop and mobile.

- Unknown module types fail safely in development and never crash production.

- Reading width and typography match design.

CHR-036 \| Build embedded media and attribution components

| **Priority:** P0 | **Dependencies:** CHR-035, CHR-015 | **Sequence:** 36 |
|------------------|------------------------------------|------------------|

**Outcome:** Render open-source images, maps, audio/video, captions, licenses, and source links consistently.

**Implementation notes:** Respect aspect ratios and provide full provenance.

**Acceptance criteria**

- Every published image displays or links to attribution.

- Media has alt text or an explicit decorative flag.

- Videos do not autoplay or navigate learners away unexpectedly.

CHR-037 \| Build inline knowledge blocks

| **Priority:** P0 | **Dependencies:** CHR-013, CHR-035 | **Sequence:** 37 |
|------------------|------------------------------------|------------------|

**Outcome:** Render simple people, place, invention, artifact, event, idea, and mystery blocks inside lessons.

**Implementation notes:** Inline blocks are calmer than collectible card presentation.

**Acceptance criteria**

- Each category has a consistent compact variant.

- Opening a full card or entity detail does not lose lesson position.

- Blocks work without an associated collectible card.

CHR-038 \| Build historical context and World Check modules

| **Priority:** P0 | **Dependencies:** CHR-035 | **Sequence:** 38 |
|------------------|---------------------------|------------------|

**Outcome:** Teach useful before/after, elsewhere-at-the-time, and future-reappearance context without turning related content into disguised navigation.

**Implementation notes:** Keep historical context curated and limited rather than generating a graph browser. Render it only when the comparison adds instructional value; do not create a progress-bearing “Connections” or “Follow the idea forward” section whose primary purpose is linking elsewhere.

**Acceptance criteria**

- Module supports short curated explanations and, when needed, non-primary references.

- No more than the configured number is shown by default.

- Historical connections remain visible where they teach; any related-path affordance is visually separate, clearly optional, and non-disruptive.

CHR-039 \| Build checks for understanding

| **Priority:** P0 | **Dependencies:** CHR-023, CHR-035 | **Sequence:** 39 |
|------------------|------------------------------------|------------------|

**Outcome:** Support retrieval, multiple choice, ordering, comparison, explanation, and source interpretation for MVP.

**Implementation notes:** Persist attempts while prioritizing explanatory feedback over scoring.

**Acceptance criteria**

- Responses save reliably.

- Feedback explains reasoning.

- Keyboard and touch interaction are accessible.

CHR-040 \| Build lesson completion and next-step panel

| **Priority:** P0 | **Dependencies:** CHR-023, CHR-024, CHR-028, CHR-035 | **Sequence:** 40 |
|------------------|------------------------------------------------------|------------------|

**Outcome:** Complete the core loop with explicit completion, one clear current-journey action, and optional post-completion reward or exploration.

**Implementation notes:** Before completion, the only forward action is “Complete lesson” once its requirements are met. After completion, “Continue [current journey]” is primary. Card presentation and at most one contextual exploration are subordinate and must not resemble required lesson sections.

**Acceptance criteria**

- Completion writes once even after refresh.

- Next required action is visually primary.

- Card and invitation moments never appear simultaneously unless explicitly designed.

- Ignoring, dismissing, or opening optional exploration cannot change lesson completion.

CHR-041 \| Build shared-lesson revisit experience

| **Priority:** P0 | **Dependencies:** CHR-027, CHR-035 | **Sequence:** 41 |
|------------------|------------------------------------|------------------|

**Outcome:** Render prior context, new significance, refresher, review, and continue options.

**Implementation notes:** Use a compact bridge by default.

**Acceptance criteria**

- Prior journey is named.

- New perspective is understandable without replaying the whole lesson.

- Full review remains available.

CHR-042 \| Implement Learn route state and deep linking

| **Priority:** P0 | **Dependencies:** CHR-033 through CHR-041 | **Sequence:** 42 |
|------------------|-------------------------------------------|------------------|

**Outcome:** Make journey and lesson URLs shareable and resilient.

**Implementation notes:** URL should identify journey context and lesson; restore scroll where reasonable.

**Acceptance criteria**

- Refresh restores the selected journey and lesson.

- Invalid combinations redirect to a safe valid state.

- Browser history works when traversing lessons.

# Phase 3 - Home, Journeys, and Discovery

**9 tickets**

## 3A. Home and switching

CHR-043 \| Build Home dashboard

| **Priority:** P0 | **Dependencies:** CHR-026, CHR-030, CHR-031 | **Sequence:** 43 |
|------------------|---------------------------------------------|------------------|

**Outcome:** Provide resume, open stories, one recommendation, and restrained progress.

**Implementation notes:** Avoid dense analytics and catalogs.

**Acceptance criteria**

- Resume opens the exact active location.

- Open journeys show useful progress.

- The screen has one obvious primary action.

CHR-044 \| Build journey switcher

| **Priority:** P0 | **Dependencies:** CHR-026, CHR-030 | **Sequence:** 44 |
|------------------|------------------------------------|------------------|

**Outcome:** Switch the left rail’s authored path without changing the interaction model.

**Implementation notes:** Show active, open, and saved journeys in a compact menu/drawer.

**Acceptance criteria**

- Switching preserves current lesson progress.

- Journey type and title are clear.

- The menu does not expose internal filters or graph controls.

CHR-045 \| Build contextual journey invitation card

| **Priority:** P0 | **Dependencies:** CHR-028, CHR-040 | **Sequence:** 45 |
|------------------|------------------------------------|------------------|

**Outcome:** Implement the authored invitation UI and actions.

**Implementation notes:** Support in-lesson, completion, Home, and Library placements selected by authored context. Support save, explore, dismiss, and—when shown at completion—continue current, with the current required action visually primary and optionality stated in text.

**Acceptance criteria**

- Only eligible invitations render.

- The invitation never appears in lesson section progress or changes completion eligibility.

- When shown at completion, Continue current journey is the primary action and lands on the derived next entry.

- When shown during a lesson, opening or dismissing preserves the learner's position and required flow.

- Dismissal is persisted.

- Opening an invitation lands on the authored entry point.

## 3B. Library

CHR-046 \| Implement Library catalog API

| **Priority:** P0 | **Dependencies:** CHR-019 | **Sequence:** 46 |
|------------------|---------------------------|------------------|

**Outcome:** Return published journeys grouped into Stories, Idea Trails, and Investigations.

**Implementation notes:** Support featured, recommended, open, completed, saved, and search states.

**Acceptance criteria**

- Unpublished journeys never leak.

- Grouping and sorting are deterministic.

- Results include enough metadata for cards without loading full entries.

CHR-047 \| Build Library landing page

| **Priority:** P0 | **Dependencies:** CHR-046, CHR-030 | **Sequence:** 47 |
|------------------|------------------------------------|------------------|

**Outcome:** Present three understandable categories and curated entry points.

**Implementation notes:** Use editorial groupings, not an undifferentiated list.

**Acceptance criteria**

- Stories, Idea Trails, and Investigations are immediately distinguishable.

- Open and completed status is visible.

- Mobile layout remains scannable.

CHR-048 \| Build journey preview/detail page

| **Priority:** P0 | **Dependencies:** CHR-021, CHR-047 | **Sequence:** 48 |
|------------------|------------------------------------|------------------|

**Outcome:** Explain a journey’s question, chapters, scope, prerequisites, and expected depth before opening it.

**Implementation notes:** Show enough information to choose without presenting the full knowledge graph.

**Acceptance criteria**

- Start/resume/save actions reflect state.

- Required versus optional scope is summarized.

- Related journeys are curated and limited.

CHR-049 \| Implement save, open, close, and resume journey actions

| **Priority:** P0 | **Dependencies:** CHR-026, CHR-048 | **Sequence:** 49 |
|------------------|------------------------------------|------------------|

**Outcome:** Manage the learner’s personal journey list.

**Implementation notes:** Closing removes clutter but never deletes progress.

**Acceptance criteria**

- Actions are reversible.

- State synchronizes across Home, Library, and switcher.

- World Spine cannot be accidentally deleted.

CHR-050 \| Implement global search service

| **Priority:** P1 | **Dependencies:** CHR-011 through CHR-015 | **Sequence:** 50 |
|------------------|-------------------------------------------|------------------|

**Outcome:** Search published lessons, journeys, entities, cards, places, and artifacts.

**Implementation notes:** Index learner-facing text and aliases; respect publish state.

**Acceptance criteria**

- Results are typed and ranked.

- Search handles common spelling variants.

- No editorial drafts or private user data appear.

CHR-051 \| Build global search UI

| **Priority:** P1 | **Dependencies:** CHR-050, CHR-030 | **Sequence:** 51 |
|------------------|------------------------------------|------------------|

**Outcome:** Provide an optional fast path without making search necessary for progression.

**Implementation notes:** Use grouped results and recent searches only when useful.

**Acceptance criteria**

- Keyboard shortcut and mobile entry point work.

- Result type and destination are clear.

- Empty results offer useful recovery.

# Phase 4 - Knowledge Cards and Personal Atlas

**10 tickets**

## 4A. Card presentation

CHR-052 \| Build collectible card frame component

| **Priority:** P0 | **Dependencies:** CHR-008, CHR-014, CHR-029 | **Sequence:** 52 |
|------------------|---------------------------------------------|------------------|

**Outcome:** Implement the premium visual card front across categories and classes.

**Implementation notes:** Support art, title, category/class, date/place, short description, depiction label, and accessible fallback.

**Acceptance criteria**

- Seven card categories render consistently.

- Long titles and approximate dates do not break layout.

- Card never implies gameplay statistics or rarity.

CHR-053 \| Build card reveal experience

| **Priority:** P0 | **Dependencies:** CHR-024, CHR-052 | **Sequence:** 53 |
|------------------|------------------------------------|------------------|

**Outcome:** Create the optional celebratory moment after meaningful learning.

**Implementation notes:** Use restrained motion, sound off by default, and immediate dismissal.

**Acceptance criteria**

- Reveal appears only for newly acquired cards.

- Reduced-motion mode has an equivalent static treatment.

- Closing returns to the exact completion context.

CHR-054 \| Build Collection grid

| **Priority:** P0 | **Dependencies:** CHR-025, CHR-030, CHR-052 | **Sequence:** 54 |
|------------------|---------------------------------------------|------------------|

**Outcome:** Display the learner’s acquired knowledge as a browsable visual atlas.

**Implementation notes:** Support recent, category, class, journey, and set filters without clutter.

**Acceptance criteria**

- Owned cards load incrementally.

- Filters produce stable URLs or restorable state.

- Empty collection explains how cards are discovered.

CHR-055 \| Build card detail and evidence view

| **Priority:** P0 | **Dependencies:** CHR-025, CHR-036, CHR-052 | **Sequence:** 55 |
|------------------|---------------------------------------------|------------------|

**Outcome:** Expose significance, facts, connections, real evidence, provenance, and related learning.

**Implementation notes:** Clearly separate generated illustration from photographs and primary evidence.

**Acceptance criteria**

- Depiction mode is visible.

- Every evidence image has attribution and license.

- Related lessons and journeys open correctly.

CHR-056 \| Build card set experience

| **Priority:** P0 | **Dependencies:** CHR-014, CHR-025, CHR-054 | **Sequence:** 56 |
|------------------|---------------------------------------------|------------------|

**Outcome:** Show curated thematic sets and meaningful completion without currencies.

**Implementation notes:** Set completion may unlock synthesis content, not power or random rewards.

**Acceptance criteria**

- Set progress counts unique cards.

- Unknown/unacquired entries can be hidden or silhouetted per set configuration.

- Completion action routes to configured synthesis or reflection.

CHR-057 \| Add known-card callbacks inside later lessons

| **Priority:** P0 | **Dependencies:** CHR-024, CHR-037, CHR-055 | **Sequence:** 57 |
|------------------|---------------------------------------------|------------------|

**Outcome:** Use acquired cards as memory anchors and retrieval prompts.

**Implementation notes:** Render a quiet “you know this” treatment with context-specific recall.

**Acceptance criteria**

- No duplicate acquisition occurs.

- Learner can review the card without losing lesson position.

- Callback copy is authored or safely templated.

## 4B. Card media pipeline

CHR-058 \| Implement image asset and attribution pipeline

| **Priority:** P0 | **Dependencies:** CHR-015, CHR-016 | **Sequence:** 58 |
|------------------|------------------------------------|------------------|

**Outcome:** Store originals, optimized derivatives, generated art, evidence images, licenses, and metadata.

**Implementation notes:** Use stable asset IDs and responsive delivery.

**Acceptance criteria**

- Original source URL and license are retained.

- Published derivatives are reproducible.

- Missing attribution blocks publication.

CHR-059 \| Create card visual-brief authoring template

| **Priority:** P0 | **Dependencies:** CHR-016 | **Sequence:** 59 |
|------------------|---------------------------|------------------|

**Outcome:** Give researchers a repeatable form for historically grounded image briefs.

**Implementation notes:** Include period, place, evidence, required details, prohibited anachronisms, uncertain details, composition, and depiction label.

**Acceptance criteria**

- Template can produce valid VisualBrief data.

- Required evidence fields vary appropriately by depiction mode.

- Reviewer sign-off is captured.

CHR-060 \| Implement generated-image ingestion and lineage

| **Priority:** P0 | **Dependencies:** CHR-058, CHR-059 | **Sequence:** 60 |
|------------------|------------------------------------|------------------|

**Outcome:** Record prompt, model/version, source brief, generation date, revisions, and approval.

**Implementation notes:** Do not require in-app generation for MVP; support importing approved outputs.

**Acceptance criteria**

- Each generated image is traceable to a brief and prompt.

- Replaced images retain historical lineage.

- Only approved versions can be published.

CHR-061 \| Build visual historical-review queue

| **Priority:** P0 | **Dependencies:** CHR-060 | **Sequence:** 61 |
|------------------|---------------------------|------------------|

**Outcome:** Allow designated reviewers to approve, reject, or annotate card imagery.

**Implementation notes:** Prioritize unresolved uncertainty and potential anachronisms.

**Acceptance criteria**

- Review status is visible to editors.

- Rejection requires a reason.

- Publication checks approved status.

# Phase 5 - Investigations and Historical Reasoning

**4 tickets**

## 5A. Investigation engine

CHR-062 \| Implement Investigation schema extensions

| **Priority:** P0 | **Dependencies:** CHR-012, CHR-015 | **Sequence:** 62 |
|------------------|------------------------------------|------------------|

**Outcome:** Represent evidence packets, claims, hypotheses, questions, revisions, and synthesis.

**Implementation notes:** Keep investigations as a journey type while allowing specialized modules.

**Acceptance criteria**

- Observation, evidence, interpretation, and uncertainty are distinct fields.

- Multiple plausible hypotheses are supported.

- Outdated narratives can be labeled and compared.

CHR-063 \| Implement investigation response persistence

| **Priority:** P0 | **Dependencies:** CHR-017, CHR-062 | **Sequence:** 63 |
|------------------|------------------------------------|------------------|

**Outcome:** Store hypotheses, confidence, evidence selections, revisions, and final reflection.

**Implementation notes:** Support returning later without forcing a linear quiz model.

**Acceptance criteria**

- State resumes across devices.

- Learner can revise without losing earlier reasoning history.

- No response is scored as wrong solely for differing from a disputed interpretation.

CHR-064 \| Build Investigation workspace

| **Priority:** P0 | **Dependencies:** CHR-036, CHR-062, CHR-063 | **Sequence:** 64 |
|------------------|---------------------------------------------|------------------|

**Outcome:** Create the dedicated evidence-and-reasoning interface while retaining Chronos navigation.

**Implementation notes:** Support evidence cards, claim comparison, notes/hypothesis, confidence, and synthesis.

**Acceptance criteria**

- Evidence and interpretation are visually distinct.

- Mobile interaction remains usable.

- Learner always has a clear next investigative action.

CHR-065 \| Build Investigation completion and reward flow

| **Priority:** P0 | **Dependencies:** CHR-024, CHR-064 | **Sequence:** 65 |
|------------------|------------------------------------|------------------|

**Outcome:** Conclude with what is known, disputed, revised, and why the reasoning mattered.

**Implementation notes:** May award an Enigma, Witness, place, or artifact card based on authored configuration.

**Acceptance criteria**

- Completion does not imply false certainty.

- Card reveal follows normal uniqueness rules.

- Learner’s initial and revised ideas can be compared.

# Phase 6 - Audience Depth, Accessibility, and Resilience

**7 tickets**

## 6A. Audience presentation

CHR-066 \| Implement audience-level preference

| **Priority:** P1 | **Dependencies:** CHR-011, CHR-022 | **Sequence:** 66 |
|------------------|------------------------------------|------------------|

**Outcome:** Allow Explorer, Standard, and Deep Dive presentation selection.

**Implementation notes:** Default to the initial target audience while preserving one shared lesson identity.

**Acceptance criteria**

- Preference is stored per user.

- Changing level does not reset progress.

- Unavailable levels fall back predictably.

CHR-067 \| Build audience-aware lesson module selection

| **Priority:** P1 | **Dependencies:** CHR-066 | **Sequence:** 67 |
|------------------|---------------------------|------------------|

**Outcome:** Select or layer vocabulary, depth, source excerpts, historiography, and activities.

**Implementation notes:** Do not merely swap simple words for complex words.

**Acceptance criteria**

- Each level can vary structure and depth.

- Shared factual claims remain aligned.

- Editors can preview all levels.

CHR-068 \| Implement vocabulary assistance

| **Priority:** P1 | **Dependencies:** CHR-035 | **Sequence:** 68 |
|------------------|---------------------------|------------------|

**Outcome:** Provide contextual definitions and pronunciation where useful.

**Implementation notes:** Keep assistance available but unobtrusive.

**Acceptance criteria**

- Terms can be opened by keyboard and touch.

- Definitions are age-appropriate to selected level.

- Repeated terms do not produce excessive UI clutter.

## 6B. Accessibility and robustness

CHR-069 \| Complete keyboard and screen-reader navigation

| **Priority:** P0 | **Dependencies:** CHR-030 through CHR-065 | **Sequence:** 69 |
|------------------|-------------------------------------------|------------------|

**Outcome:** Ensure all core learning and collection flows work without pointer input.

**Implementation notes:** Audit landmarks, headings, focus order, dialogs, drawers, rail states, cards, quizzes, and media.

**Acceptance criteria**

- Critical paths pass automated and manual accessibility tests.

- Focus never becomes trapped or lost after route and overlay changes.

- Progress states have meaningful accessible names.

CHR-070 \| Implement reduced motion and sensory preferences

| **Priority:** P0 | **Dependencies:** CHR-029, CHR-053 | **Sequence:** 70 |
|------------------|------------------------------------|------------------|

**Outcome:** Respect user and system preferences for reveals, transitions, sound, and visual effects.

**Implementation notes:** Provide equivalent feedback without animation.

**Acceptance criteria**

- prefers-reduced-motion is honored.

- No essential information depends on motion or sound.

- Preference persists.

CHR-071 \| Implement offline-tolerant reading and retry behavior

| **Priority:** P1 | **Dependencies:** CHR-023, CHR-035 | **Sequence:** 71 |
|------------------|------------------------------------|------------------|

**Outcome:** Protect lesson progress during weak connectivity.

**Implementation notes:** Cache current lesson and queue safe progress writes where practical.

**Acceptance criteria**

- Current lesson remains readable after a transient disconnect.

- Queued writes are idempotent.

- User sees understandable sync status only when needed.

CHR-072 \| Add error boundaries and recovery states

| **Priority:** P0 | **Dependencies:** CHR-030 through CHR-065 | **Sequence:** 72 |
|------------------|-------------------------------------------|------------------|

**Outcome:** Prevent isolated content or media failures from taking down the learning shell.

**Implementation notes:** Add route, module, media, and command recovery.

**Acceptance criteria**

- Broken optional media does not block completion.

- Errors include a recovery action.

- Diagnostics identify the failed content ID without exposing internals to learners.

# Phase 7 - Editorial Tooling and Reference Content

**10 tickets**

## 7A. Editorial workflow

CHR-073 \| Define content lifecycle and permissions

| **Priority:** P0 | **Dependencies:** CHR-015, CHR-016 | **Sequence:** 73 |
|------------------|------------------------------------|------------------|

**Outcome:** Formalize draft, research review, historical review, visual review, approved, published, and archived states.

**Implementation notes:** Define who may advance each state and what validation gates apply.

**Acceptance criteria**

- Lifecycle is documented and encoded.

- Published content cannot bypass required reviews.

- Archiving preserves IDs and learner progress.

CHR-074 \| Build lesson editor or structured authoring workflow

| **Priority:** P0 | **Dependencies:** CHR-011, CHR-020, CHR-073 | **Sequence:** 74 |
|------------------|---------------------------------------------|------------------|

**Outcome:** Allow creation and preview of typed lesson modules without editing application code.

**Implementation notes:** May begin as validated repository files with preview tooling; full CMS is optional.

**Acceptance criteria**

- Editors can create, validate, preview, and submit a lesson.

- References and sources are searchable or safely enterable.

- Preview matches learner rendering.

CHR-075 \| Build journey authoring and validation workflow

| **Priority:** P0 | **Dependencies:** CHR-012, CHR-020, CHR-073 | **Sequence:** 75 |
|------------------|---------------------------------------------|------------------|

**Outcome:** Allow editors to sequence lessons, chapters, framing, prerequisites, synthesis, and invitations.

**Implementation notes:** Provide duplicate/reference warnings and a learner preview.

**Acceptance criteria**

- Editor can reuse a lesson with unique framing.

- Cycles and impossible prerequisites are blocked.

- Derived required progress is previewed.

CHR-076 \| Build card and set authoring workflow

| **Priority:** P0 | **Dependencies:** CHR-014, CHR-016, CHR-073 | **Sequence:** 76 |
|------------------|---------------------------------------------|------------------|

**Outcome:** Allow cards, visual briefs, evidence, reveal rules, and sets to be curated.

**Implementation notes:** Integrate asset attribution and visual approval.

**Acceptance criteria**

- A card cannot publish without required copy, source data, and approved imagery.

- Reveal rules reference valid learning moments.

- Set membership validates unique order.

CHR-077 \| Build editorial graph integrity report

| **Priority:** P0 | **Dependencies:** CHR-020, CHR-074 through CHR-076 | **Sequence:** 77 |
|------------------|----------------------------------------------------|------------------|

**Outcome:** Give editors a comprehensible report of unreachable nodes, broken references, orphan cards, duplicate coverage, and overloaded Spine entries.

**Implementation notes:** Present warnings separately from blocking errors.

**Acceptance criteria**

- Report runs in CI and on demand.

- Every issue links to the affected content record.

- Known intentional exceptions can be documented rather than silently ignored.

## 7B. Initial curriculum slice

CHR-078 \| Author and approve the reference World Spine segment

| **Priority:** P0 | **Dependencies:** CHR-074, CHR-075 | **Sequence:** 78 |
|------------------|------------------------------------|------------------|

**Outcome:** Create the first coherent chronological segment used for launch testing.

**Implementation notes:** Use enough lessons to test chapters, locks, optional nodes, connections, and invitations.

**Acceptance criteria**

- Segment has a clear beginning and synthesis ending.

- All claims and media pass review.

- Required progression is achievable with no dead ends.

CHR-079 \| Author and approve the Ancient Egypt Story Arc

| **Priority:** P0 | **Dependencies:** CHR-078 | **Sequence:** 79 |
|------------------|---------------------------|------------------|

**Outcome:** Create the reference civilization journey with shared and arc-only lessons.

**Implementation notes:** Include chapters, continuity periods, World Checks, and legacy beyond pharaonic Egypt.

**Acceptance criteria**

- Arc demonstrates shared lessons and unique framing.

- At least one previously completed lesson uses revisit behavior.

- Progress derives correctly from required entries.

CHR-080 \| Author and approve the Writing Changes the World Idea Trail

| **Priority:** P0 | **Dependencies:** CHR-078 | **Sequence:** 80 |
|------------------|---------------------------|------------------|

**Outcome:** Create the reference cross-civilizational thematic journey.

**Implementation notes:** Include independent invention, exchange, preservation, reinterpretation, and information systems.

**Acceptance criteria**

- Trail does not read as a filtered tag list.

- Every entry has explicit significance-here framing.

- Synthesis connects recurring patterns across societies.

CHR-081 \| Author and approve the Rapa Nui Investigation

| **Priority:** P0 | **Dependencies:** CHR-064, CHR-078 | **Sequence:** 81 |
|------------------|------------------------------------|------------------|

**Outcome:** Create the reference evidence-based investigation and correct simplistic collapse mythology.

**Implementation notes:** Use archaeological evidence, environmental data, oral history where appropriate, colonial impacts, and explicit uncertainty.

**Acceptance criteria**

- Observation, evidence, interpretation, and debate are separated.

- Learner can revise a hypothesis.

- All visual reconstructions and evidence images are labeled and sourced.

CHR-082 \| Produce and approve the initial Knowledge Card set

| **Priority:** P0 | **Dependencies:** CHR-076, CHR-078 through CHR-081 | **Sequence:** 82 |
|------------------|----------------------------------------------------|------------------|

**Outcome:** Create enough cards across categories/classes to validate the collection system.

**Implementation notes:** Include people, artifacts, inventions, places, events, ideas, and an Enigma/Investigation card.

**Acceptance criteria**

- Every card is tied to a meaningful learning moment.

- All artwork passes historical and license review.

- No card is required solely to fill a category quota.

# Phase 8 - Analytics, Quality, Migration, and Launch

**15 tickets**

## 8A. Analytics and observability

CHR-083 \| Define analytics taxonomy and privacy boundaries

| **Priority:** P0 | **Dependencies:** CHR-001 | **Sequence:** 83 |
|------------------|---------------------------|------------------|

**Outcome:** Specify events needed to evaluate comprehension and product health without surveillance-like collection.

**Implementation notes:** Document event names, properties, retention, user controls, and prohibited data.

**Acceptance criteria**

- Taxonomy covers journey, lesson, card, library, revisit, and investigation flows.

- Free-text learner responses are excluded from general analytics unless explicitly required and protected.

- Events avoid leaking sensitive content.

CHR-084 \| Instrument core product events

| **Priority:** P0 | **Dependencies:** CHR-083, core UI tickets | **Sequence:** 84 |
|------------------|--------------------------------------------|------------------|

**Outcome:** Implement the approved taxonomy across critical flows.

**Implementation notes:** Capture starts, completions, resumes, switches, invitation actions, reveals, card revisits, and investigation revisions.

**Acceptance criteria**

- Events fire once at defined semantic moments.

- Development validation tool shows payloads.

- Analytics failures never block learning.

CHR-085 \| Build product and learning-health dashboards

| **Priority:** P0 | **Dependencies:** CHR-084 | **Sequence:** 85 |
|------------------|---------------------------|------------------|

**Outcome:** Make adoption, completion, confusion, and guardrail signals visible to the team.

**Implementation notes:** Include journey completion, resume success, abandon points, reveal skips, revisit use, and investigation revision behavior.

**Acceptance criteria**

- Metrics have documented definitions.

- Dashboard distinguishes product engagement from learning indicators.

- Guardrails flag excessive choice, repeated errors, or content bottlenecks.

CHR-086 \| Add application logging, tracing, and performance monitoring

| **Priority:** P0 | **Dependencies:** CHR-003 | **Sequence:** 86 |
|------------------|---------------------------|------------------|

**Outcome:** Make failures and latency diagnosable in production.

**Implementation notes:** Cover API, database, asset delivery, route transitions, and progress commands.

**Acceptance criteria**

- Logs include correlation IDs and content IDs.

- Sensitive learner data is redacted.

- Alerts exist for failed progress writes and widespread content-render errors.

## 8B. Testing and migration

CHR-087 \| Create domain unit-test suite

| **Priority:** P0 | **Dependencies:** CHR-010 through CHR-028 | **Sequence:** 87 |
|------------------|-------------------------------------------|------------------|

**Outcome:** Protect chronology, sequencing, prerequisites, progress, card uniqueness, and revisit rules.

**Implementation notes:** Use representative BCE/CE and multi-journey fixtures.

**Acceptance criteria**

- All domain invariants have tests.

- Tests include repeated and concurrent completion cases.

- Fixtures are readable and reusable.

CHR-088 \| Create API integration-test suite

| **Priority:** P0 | **Dependencies:** CHR-021 through CHR-028 | **Sequence:** 88 |
|------------------|-------------------------------------------|------------------|

**Outcome:** Verify auth, contracts, persistence, and transactional behavior.

**Implementation notes:** Run against a real test database where possible.

**Acceptance criteria**

- Core APIs have success, authorization, validation, and failure tests.

- Progress plus card acquisition is tested transactionally.

- Published/draft visibility is tested.

CHR-089 \| Create end-to-end critical-path tests

| **Priority:** P0 | **Dependencies:** All core UI tickets | **Sequence:** 89 |
|------------------|---------------------------------------|------------------|

**Outcome:** Automate the complete learner experience across desktop and mobile viewports.

**Implementation notes:** Cover first lesson, completion, primary next-lesson navigation, contextual invitations before and after completion, switching, shared revisit, collection, and Investigation. Assert that related-path invitations never appear as lesson sections, change completion eligibility, or interrupt the required check/completion flow.

**Acceptance criteria**

- Tests run in CI.

- Screenshots or traces are captured on failure.

- At least one no-card and already-owned-card path is covered.

CHR-090 \| Run accessibility audit and remediation

| **Priority:** P0 | **Dependencies:** CHR-069, CHR-070, CHR-089 | **Sequence:** 90 |
|------------------|---------------------------------------------|------------------|

**Outcome:** Validate WCAG AA behavior with automated and manual testing.

**Implementation notes:** Include screen reader, keyboard, zoom, contrast, reduced motion, and touch targets.

**Acceptance criteria**

- No critical or serious unresolved issues in launch flows.

- Known minor exceptions are documented with owners.

- Accessibility regression checks run in CI where possible.

CHR-091 \| Run performance and large-corpus tests

| **Priority:** P0 | **Dependencies:** CHR-033, CHR-054, CHR-086 | **Sequence:** 91 |
|------------------|---------------------------------------------|------------------|

**Outcome:** Prove the shell remains fast with mature-scale journeys and collections.

**Implementation notes:** Test long rails, thousands of cards, high-resolution media, and mobile hardware.

**Acceptance criteria**

- Targets for LCP, interaction latency, and API response are met.

- Large rails and grids do not freeze the UI.

- Image loading respects responsive sizes and lazy loading.

CHR-092 \| Migrate existing Chronos content and progress

| **Priority:** P0 | **Dependencies:** CHR-018, CHR-020, CHR-073 | **Sequence:** 92 |
|------------------|---------------------------------------------|------------------|

**Outcome:** Map current nodes, lessons, media, and learner state into the new model.

**Implementation notes:** Create repeatable migration scripts and reconciliation reports.

**Acceptance criteria**

- Every migrated record has a deterministic mapping or documented exception.

- Existing completion is preserved where semantically equivalent.

- Migration can be rehearsed and rolled back.

CHR-093 \| Perform content and visual QA pass

| **Priority:** P0 | **Dependencies:** CHR-078 through CHR-082, CHR-089 | **Sequence:** 93 |
|------------------|----------------------------------------------------|------------------|

**Outcome:** Review every launch lesson, journey, card, source, image, breakpoint, and state.

**Implementation notes:** Use a checklist covering historical accuracy, reading level, attribution, anachronisms, truncation, and interaction.

**Acceptance criteria**

- All launch content is signed off.

- No missing or broken media remains.

- Every generated image displays the correct depiction label.

## 8C. Release

CHR-094 \| Implement feature flags and staged rollout

| **Priority:** P0 | **Dependencies:** CHR-086, CHR-089 | **Sequence:** 94 |
|------------------|------------------------------------|------------------|

**Outcome:** Allow safe internal, beta, and gradual production activation.

**Implementation notes:** Flag new shell, cards, Library, and Investigations independently where useful.

**Acceptance criteria**

- Flags have safe defaults.

- Progress remains consistent when a feature is disabled.

- Rollback does not require a database rollback.

CHR-095 \| Prepare launch operations and support documentation

| **Priority:** P0 | **Dependencies:** CHR-093, CHR-094 | **Sequence:** 95 |
|------------------|------------------------------------|------------------|

**Outcome:** Ensure the team can respond to user, content, and technical issues.

**Implementation notes:** Create runbooks, known issues, moderation/escalation paths, and editorial correction process.

**Acceptance criteria**

- Support can identify journey, lesson, and card IDs from user reports.

- Historical corrections have an emergency publish path.

- Incident ownership is clear.

CHR-096 \| Run closed beta and resolve launch blockers

| **Priority:** P0 | **Dependencies:** CHR-090 through CHR-095 | **Sequence:** 96 |
|------------------|-------------------------------------------|------------------|

**Outcome:** Validate the full product with target families/learners before general release.

**Implementation notes:** Collect observation and structured feedback without treating engagement alone as success.

**Acceptance criteria**

- No unresolved P0/P1 defects remain.

- Critical comprehension and navigation issues are resolved.

- Launch criteria are reviewed and approved.

CHR-097 \| Launch the foundational Chronos experience

| **Priority:** P0 | **Dependencies:** CHR-096 | **Sequence:** 97 |
|------------------|---------------------------|------------------|

**Outcome:** Release the stable learning shell, initial journeys, cards, and Investigation to the intended audience.

**Implementation notes:** Use staged rollout and monitor product, learning, accessibility, and technical guardrails.

**Acceptance criteria**

- Production release is healthy.

- Progress and card acquisition error rates remain within agreed thresholds.

- Team completes a post-launch review with prioritized follow-up backlog.

# Phase 9 - Post-Launch Expansion (Ordered after a stable launch)

**3 tickets**

## 9A. Advanced exploration

CHR-098 \| Expand curriculum using measured gaps

| **Priority:** P1 | **Dependencies:** CHR-097 | **Sequence:** 98 |
|------------------|---------------------------|------------------|

**Outcome:** Prioritize additional Spine segments, civilizations, idea trails, and investigations based on curricular need rather than catalog volume.

**Implementation notes:** Use editorial strategy and learner evidence; maintain inclusion criteria.

**Acceptance criteria**

- Each proposed journey has a pedagogical thesis and dependency assessment.

- Spine additions pass inclusion review.

- Archive growth does not increase default UI complexity.

CHR-099 \| Build optional Atlas and comparison tools

| **Priority:** P2 | **Dependencies:** CHR-097, sufficient corpus | **Sequence:** 99 |
|------------------|----------------------------------------------|------------------|

**Outcome:** Provide maps, simultaneous-history comparison, and relationship exploration for advanced learners.

**Implementation notes:** Keep Atlas downstream of learning and separate from the default Learn shell.

**Acceptance criteria**

- Atlas is optional and does not replace authored journeys.

- Comparisons disclose category and chronology ambiguity.

- A learner can return to the originating lesson or journey easily.

CHR-100 \| Add parent and educator progress views

| **Priority:** P2 | **Dependencies:** CHR-097 | **Sequence:** 100 |
|------------------|---------------------------|-------------------|

**Outcome:** Summarize coherent learning without reducing the product to time-on-task or points.

**Implementation notes:** Show journey progress, demonstrated knowledge, investigations, and suggested discussion prompts.

**Acceptance criteria**

- Views avoid exposing private free-form learner notes by default.

- Progress definitions are transparent.

- Educator recommendations link to authored content.

# Launch dependency chain

The shortest conceptual path to the foundational release is:

1.  Product invariants and current-state audit

2.  Architecture and validated interaction model

3.  Domain schemas, persistence, and services

4.  Stable responsive Learn shell

5.  Home and authored journey discovery

6.  Knowledge Cards and evidence-aware media

7.  Investigation engine

8.  Editorial workflows and approved reference corpus

9.  Accessibility, testing, migration, beta, and staged launch

# Recommended ticket hygiene

- Copy each ticket into the team tracker without removing its acceptance criteria.

- Add estimates only after the responsible discipline has reviewed the current repository and design assets.

- Split a ticket when it exceeds one reviewable vertical outcome; preserve the original ticket as an epic or parent.

- Do not close implementation tickets with placeholder content when realistic historical content is required to validate the experience.

- Treat historical accuracy, source licensing, accessibility, and progress integrity as release requirements rather than later polish.
