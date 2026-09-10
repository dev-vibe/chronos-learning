# Learning-experience rollout

Implementation record for the September 2026 workflow and shared-shell improvements. This is an engineering and editorial handoff, not a claim of demonstrated learner outcomes.

## Scope and isolation

Work began in `.worktrees/learning-experience` on a fresh `codex/` branch from `origin/main` at `ad1b50a`. Existing checkouts were inspected and preserved; their uncommitted work was not overwritten, stashed, or switched. Published pyramids content remains in the catalogue. The separate Indus work remains paused in PR #41; this rollout does not resolve its pending research-direction gate or authorize publication. No lesson is published, merged, or deployed to production by this work.

## Existing capabilities and actual gaps

The application already had the shared Learn shell, stable lesson/section/prompt/card IDs, authored World History chapters, explicit sincere-attempt completion, durable progress, draft initialization from saved answers, published-content discovery, and provenance-aware media. Reopening a lesson already started at the top.

The rollout addresses threshold-triggered feedback, limited image inspection, repeated operational language, weak opening orientation, catalogue emphasis on unavailable paths, and absent public parent/educator companions. It adds shared rendering capabilities and selected authored metadata using existing historical content rather than restarting research.

- The operational production path is brief → research/material decisions → learning prototype → review → final assets/verification → publication. Specialist detail remains referenced; research effort follows instructional importance. The current owner research-direction gate stays active, and any future routine route remains a proposal.
- Learning connections record Retrieve, Extend, Revisit, and a historical reasoning skill. They support optional retrieval, opening context, and future use of the idea, without adding progress requirements or mastery records.
- Opening orientation uses existing date ranges and available authored map assets. The timeline distinguishes overlap and approximation. Lessons lacking suitable map assets retain honest place text rather than invented geography.
- Evidence and maps gain enlargement, optional source-grounded attention cues, comparison support, and evidence beside relevant questions. Deliberate comparison follows writing or selection; examples are presented as examples, not personalized evaluation.
- Home retains Continue as the primary action, names the current chapter, and offers one authored revisit when the relevant earlier lesson is completed. Library leads with published subjects and objects; unavailable paths and the full roadmap sit inside a collapsed secondary section.
- `/educators` and `/educators/:lessonId` are public companion routes with lesson purpose, discussion prompts, misconceptions, example explanations, edition/reference information, and print styling. They mount without learner-progress or journey-state gateways.

## Catalogue compatibility audit

All ten lessons in `content/chronos.ts` remain published with their existing identities. Shared answer, completion, reading-size, enlargement, and opening-context behavior applies through the common renderer. This table records inspected content compatibility; it is not a claim that every lesson received a new historical review or a full individual browser audit.

| Published lesson | Opening geography already available | Integration and remaining authoring work |
| --- | --- | --- |
| Human Origins (`lesson.humans.homo-sapiens-origins`) | Authored Africa evidence map with location/modern-coast caveats | Representative integration: chosen opening map, evidence-directed hints and question references, Look here guidance, card recall, authored learning bridge, and public companion. |
| Migrations and Interbreeding (`lesson.humans.migrations-and-interbreeding`) | Existing map hero | Shared opening reuses the map and its caveats; authored bridge links fossil reasoning to ancient DNA. Additional question-specific evidence references can be authored later. |
| Crossing to Sahul (`lesson.humans.sahul-crossing`) | Authored historical map | Existing uncertain routes and changing geography remain intact. Shared evidence enlargement and a learning bridge apply; no route precision is added. |
| Many Beginnings of Farming (`lesson.farming.multiple-origins`) | Authored map of broad regions | Existing world-map uncertainty and wheat comparison retained. Shared inspection and learning bridge apply. |
| Farming and Settlements (`lesson.farming.settlements`) | Authored settlement locator | Verified site location and modern-coast qualification remain intact. Shared map inspection and learning bridge apply. |
| Uruk (`lesson.uruk.first-city`) | Authored southern Mesopotamia map | Representative integration: opening map, clay-record attention cue and evidence/reconstruction comparison, question evidence, optional card recall/connection, and public companion. Existing source-review qualifications remain visible. |
| Early Writing (`lesson.writing.early-systems`) | Place text; no historical-map module or map hero | Shared timeline and text orientation apply. A compact map requires a separately reviewed geographic brief/asset; none is invented here. Existing tablet evidence gains enlargement. |
| Egypt and the Nile (`lesson.egypt.nile-state`) | Authored Nile historical map | Shared map and object inspection plus an authored learning bridge apply. Royal claims and evidence remain distinct. |
| Caral (`lesson.caral.andean-urbanism`) | Authored historical map | Shared map/object inspection and a comparison-oriented learning bridge apply; no new equivalence between societies is asserted. |
| Pyramids and State Labor (`lesson.egypt.pyramids-and-state-labor`) | Place text; no historical-map module or map hero | Existing diagrams, later illustration, reconstruction, scan qualifications, and source records are preserved. Shared evidence enlargement and learning bridge apply. An opening map remains a future reviewed asset task. |

Only Human Origins and Uruk receive public companions in this increment. Other lessons remain available in the learner catalogue; companion availability does not imply that all lessons already have parent material. Optional hints, attention cues, comparisons, and recall metadata are not mechanically fabricated for the rest of the catalogue.

## Data, privacy, and migration decisions

No database migrations are introduced by this rollout. New editorial metadata and UI preferences do not change persisted content identities, progress schema, completion meaning, or card ownership. Tab-scoped, learner/lesson/prompt-keyed session drafts are separate from submitted progress. They survive reload and navigation within that tab; closing the tab ends this draft storage. Submitted explanations continue to use the existing durable progress gateway. There is no new synchronized draft table.

Adult access to child progress remains unavailable. A future implementation needs explicit guardian/learner account relationships, consent and revocation, server-side authorization, committed schema migrations, row-level security, and tests for access denial and cross-account isolation. Being signed in or opening a public companion cannot confer permission. Public companions contain neither learner explanations nor studied-content histories.

Companion curriculum mappings currently remain empty. The typed foundation reserves a named framework, framework version, reference, and editorial revision. Adding mappings requires editorial review and must not change canonical historical content or import institutional controls into the learner shell.

## Learning evidence and owner decisions

The revised drafting reference is approximately age 12–13 within an intended audience of ages 11–15, particularly homeschooling. Adult/editorial and AI proxy review can identify problems; they cannot establish child age suitability. The learner-observation materials support representative lessons, uncertain age fit, independent and parent-supported use, immediate understanding, and delayed recall/transfer. Real sessions remain pending human participation. No participant observations, outcomes, or mastery claims were fabricated.

Owner review should decide whether the new orientation, evidence comparison, optional retrieval, and companion examples serve the intended learner experience; approve any future expansion of authored companions and map coverage; and arrange real observation sessions. Pending lesson approval gates remain binding. The possible future routine research path is not enabled by this implementation.

## Validation and preview evidence

- `npm test`: 181 tests in 33 files pass, covering domain/content, lesson gates, draft preservation, deliberate submission, errors, identity separation, completion/card idempotency, prerequisite access, public companions, and discovery.
- `npm run validate:content`, `npm run typecheck:chronos`, `npm run build`, and `git diff --check` pass. The additional TypeScript configuration checks the canonical app/content/scripts/tests with null checking; the original broad typecheck still includes unrelated legacy application errors. Build retains the existing large-bundle warning.
- `node scripts/verify-learning-experience.mjs`: disposable local browser audit passes. Checks Home, Library, Human Origins, Uruk and public companion at desktop/mobile in light/dark, largest text and 320px reflow, evidence modal keyboard/zoom/Escape/focus return, draft reload, explicit comparison, sincere completion, retained cards, reopening at top, all ten published lesson routes, and print navigation removal. Browser page errors: none. Evidence is written to ignored `tmp/learning-review/`; screenshots are engineering review artifacts, not participant observations.
- No database schema changes or production writes occurred. Existing migration/progress contract tests pass; no new migration needs applying.
- No branch-protection-required status checks are configured on main (GitHub API returned Branch not protected). PR check results and direct preview URLs are recorded in the PR handoff. No deployment command is authorized or run; local previews require the local server to remain running.

Actual learner comprehension, delayed recall/transfer, and independent age fit remain design hypotheses pending the observation program. Expansion of reviewed locator maps to Early Writing and Pyramids and companions beyond the two examples remains editorial work.
