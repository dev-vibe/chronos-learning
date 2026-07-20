# Discovery and navigation runtime

ASH-55 adds the learner-facing discovery layer around the accepted Learn shell. It does not replace the lesson renderer, progress rules, or authored curriculum pipeline.

## Route decision

Both `/` and `/home` render Home. Chronos does not issue a redirect for `/`; this keeps the first paint stable while preserving `/home` as an explicit, shareable destination.

Stable learner routes are:

- `/` and `/home`: Home dashboard;
- `/learn/:lessonId`: the accepted Learn runtime;
- `/library`: published journey catalog;
- `/library/:journeyId`: published journey preview;
- `/search?q=...`: bounded global search;
- `/legacy`: the retained pre-rebuild application.

Unknown routes render a safe recovery page. Unknown, draft, and unpublished lesson or journey IDs fail closed without learner-facing titles or editorial status.

## Boundaries

### Authored content

`content/journeys/` owns repository-authored journey metadata and contextual invitations. `content/search/aliases.ts` contains only reviewed learner-facing aliases and spelling variants. `content/chronos.ts` assembles bounded modules; it does not define a second content monolith.

The canonical contract distinguishes:

- published versus draft journeys;
- journey promise, opening question, concise description, period, region, and approximate duration;
- editorial type, featured state, entry lesson, prerequisites, and related journeys;
- authored invitation source, placement, destination, entry point, priority, and publication state.

Content validation checks these references and prevents a published journey or invitation from leading to an unpublished entry lesson.

### Catalog projection

`src/domains/journeys/catalog.ts` creates lightweight summaries from published journeys and published entries only. World History remains distinct. Optional journeys are grouped editorially into Civilizations and Regions, Ideas Across Time, and Investigations with deterministic ordering.

Catalog cards stay bounded to published journeys and do not load full lesson modules. World History detail adds a separate lightweight roadmap projection from the canonical 185-node roster.

### World Spine roadmap and gating

`content/world-spine/roadmap.ts` parses the approved canonical roster into 12 learner-facing chronological chapters and 185 stable nodes. This is curriculum orientation, not a publication catalog: every canonical node may be shown in the World History detail and Learn drawer, while only published lessons receive destinations or contribute to progress.

`src/domains/journeys/worldSpine.ts` resolves deterministic access among published required lessons. Authored published prerequisites take precedence, with the preceding published World Spine lesson as fallback. Draft and unimplemented nodes remain visible as in preparation but do not accidentally block the currently available sequence. A locked published lesson links back to its unmet prerequisite, and direct navigation fails safely.

### Learner journey state

`src/domains/journeys/state.ts` owns deterministic transitions for open, saved, closed, active journey, and active lesson per journey. World History is the stable default and cannot be closed. Journey progress is derived from required published entries and global lesson completion; journey actions never mutate lesson progress.

Closing removes a journey from the open list while preserving its active lesson and all global completion data. State normalization removes unpublished or stale journey records from learner-facing state and safely returns the active pointer to World History.

### Persistence gateways

`src/infrastructure/journeys/gateway.ts` provides two adapters behind one typed gateway:

- authenticated learners use Supabase tables protected by learner-owned RLS;
- anonymous preview uses the isolated, versioned `chronos.discovery.preview.v1` local key.

The anonymous adapter does not reconcile guest and account state. Existing Learn preview keys remain separate, so a failed discovery action cannot overwrite lesson attempts or completion.

Migration `20260720045007_add_learner_journey_discovery_state.sql` adds:

- `learner_journeys`;
- `learner_navigation_state`;
- `learner_invitation_states`;
- a fail-closed journey publication marker and catalog policies.

The active lesson uses a composite foreign key to a real entry in the same journey. Browser roles receive only explicit `SELECT`, `INSERT`, and `UPDATE` grants. Update policies use both `USING` and `WITH CHECK` with `auth.uid()`; editable user metadata is never an authorization source.

### Contextual invitations

`src/domains/journeys/invitations.ts` resolves at most one authored invitation by eligibility, descending priority, and stable ID. Draft invitations, unpublished destinations, unpublished entry lessons, wrong placements, wrong source lessons, and prior terminal actions are excluded.

Home renders the invitation only when the resolver returns one. Open, Save, and Dismiss persist explicit state. Invitations are navigation objects, not lesson sections: they do not change section counts, required prompts, completion eligibility, or journey progress. The production invitation module is intentionally empty until a complete optional journey is published.

### Search

`src/domains/search/search.ts` defines the provider abstraction and current local implementation. It indexes only:

- published journeys with at least one published entry;
- published lessons;
- Knowledge Cards unlocked by published lessons;
- reviewed aliases in the bounded alias module.

Ranking is deterministic: exact title, exact alias, title prefix, alias prefix, token prefix, then contained text. Case, accents, and punctuation are normalized. Planning-roster nodes, drafts, research notes, legacy IDs, editorial metadata, and learner data are not indexed.

The current corpus is small enough for an in-memory provider. An external search service is intentionally deferred until measured scale or quality needs justify it.

## Navigation and viewport rules

Journey-level Continue selects the journey and its stored active lesson, persists that pointer, and performs intentional navigation. Every lesson ID change synchronously resets the document viewport to the top. Existing explored-section state remains informational, but no saved viewport, resume banner, automatic section scroll, or within-lesson resume action is introduced.

The Learn shell is a contextual lesson workspace rather than a competing global destination. Home provides the primary Continue action; Library is for choosing and inspecting journeys; Search remains optional. Inside Learn, the World Spine drawer combines the 12-chapter chronology, available/locked/in-preparation lesson states, and the current lesson section index. Home, Library, and Search remain directly reachable.

Mobile uses the same three global destinations—Home, Library, and Search—in a compact bottom navigation. The World Spine opens from the lesson header.

## Honest current corpus

Production currently exposes one published journey, World History, with two published lessons: Uruk and Early Writing Systems. The complete 185-node World Spine is learner-visible as a roadmap. Unfinished nodes, including Farming and Settlements, are labeled in preparation, cannot be opened, are excluded from search, and do not affect progress.

The sequential access resolver requires Uruk completion before Early Writing opens. Empty Library categories still explain that optional curated journeys are being prepared; multi-journey, invitation, transition, and ordering behavior remains proven with non-production test fixtures.

## Deferred work

- publish additional authored journeys only through the reviewed content pipeline;
- add guest-to-account reconciliation only with an explicit product and data-migration design;
- add external search infrastructure only after measured corpus or relevance pressure;
- build the full Knowledge Card Collection in its own product increment;
- add completion and lesson-placement invitations when a legitimate optional production destination exists.
