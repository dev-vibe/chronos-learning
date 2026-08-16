---
name: chronos-lesson-production
description: Produce or materially revise evidence-led Chronos lessons through the repository's canonical learner-experience workflow. Use when asked to "create the next Chronos lesson," continue an active queued lesson, produce the next lesson, or substantially revise an existing lesson's scope, prose, prompts, evidence, media plan, or learner experience.
---

# Chronos lesson production

Treat the repository runbook as policy and this skill as its executable orchestration layer. Optimize for the learner outcome: an ages 11–14 learner can form an accurate, memorable mental model, reason from evidence, explain the central idea, and understand the next action.

## Locate the canonical workflow

1. Locate `dev-vibe/chronos-learning` from the current workspace or repository remotes. Do not assume the personal skill directory is the repository.
2. Read the repository's `AGENTS.md` completely.
3. Read `docs/content/lesson-creation-runbook.md` and `docs/content/lesson-production-queue.md` completely before selecting or changing a lesson.
4. Read every source that `AGENTS.md` marks required, including the active Linear epic and selected lesson issue/PR context.
5. Use repository-authored content, research notes, and queue state as canonical. Never reconstruct production state from chat or from this skill.

Stop and report the missing prerequisite when the canonical runbook or queue is absent from the current `main`; do not invent a replacement workflow.

## Classify the request

- For a next/continue request, continue the single active queue row before selecting new work. Otherwise select the first eligible `Ready` row exactly as the queue specifies.
- For a material revision, identify the canonical lesson and research note, preserve stable IDs only when meaning remains equivalent, and re-enter the earliest affected runbook stage. Repeat both approval gates after changes to scope, mental model, evidence, prompts, media teaching job, completion, or journey role.
- For a narrow correction that does not change the learner model, follow the correction path in Stage 18 and run validation proportional to risk.

Ask the user for a topic only when the queue and active work cannot supply one and a curriculum decision is genuinely required. Never silently promote, reorder, replace, or abandon queue work.

## Boot the lesson increment

1. Inspect the queue, its master Linear issue, the active lesson issue/PR, and production dependencies.
2. Inspect current lessons, journeys, cards, research notes, content contracts, media, migrations, and preview behavior before editing.
3. Reuse the active issue, branch, and PR when continuing work. For new work, create only the selected lesson's issue and prescribed branch from current `main`.
4. Set or retain `Researching` while performing research, modeling, and learner-prototype work. Keep repository changes bounded to one reviewable lesson outcome.
5. Create or update one `docs/research/<lesson>.md` editorial record using `docs/content/lesson-production/authoring-templates.md`.

Do not overwrite unrelated changes or start a second active lesson without explicit parallel-ownership approval.

## Execute the five phases

### 1. Select and bound — Stages 0–1

Lock lesson identity, curriculum and journey position, prerequisites, scope, essential question, durable understanding, accountable reviewer, and non-goals. Prefer one shared lesson with journey-specific framing over duplicate content.

### 2. Research and model — Stages 2–7

Build the research questions, source ledger, atomic claim ledger, content triage, learning blueprint, and ages 11–14 transformation record before drafting learner prose. Distinguish evidence, interpretation, uncertainty, reconstruction, and later tradition. Invoke specialist historical-map or media runbooks only when the selected teaching form triggers them.

### 3. Prototype and review — Stages 8–14B

Storyboard the complete lesson, map it to existing typed modules, plan media by teaching job, decide the card honestly, author required sincere-attempt prompts, and finish the research note.

Then build a complete unpublished `Lesson` with real prose and prompts in the actual Learn shell:

- keep `status: "draft"` and production access fail-closed;
- add the intended journey entry for preview reachability without publishing it;
- use development-only section-linked annotations for media intentions;
- do not generate final assets, add publication migrations or unlocks, change hosted systems, or mark content approved;
- run `npm run lesson:gate -- --lesson <lesson-id> --note <path> --gate prototype`;
- run `npm run lesson:preview -- --lesson <lesson-id>` and inspect desktop/mobile plus light/dark states.

Apply `docs/content/lesson-production/lesson-quality-contract.md` without assigning a pedagogy score. Obtain an independent proxy review of the raw prototype. Record its findings and dispositions, prepare the accountable product/editorial review against the actual prototype, and leave `productReview` pending. Return to the prototype for every blocking proxy finding.

Commit and push the research and learner-prototype checkpoint, update Linear and the queue to `Awaiting approval`, and present only the material decisions with the exact preview route. Stop for Carlin's explicit approval. Never approve on the product owner's behalf. If changes are requested, return to Stage 14A; only after explicit approval record `productReview` as approved and begin Stage 15. Do not begin final media, migrations, unlocks, publication, or hosted changes while review is pending.

### 4. Implement — Stage 15

After explicit checkpoint approval, move the queue row to `Implementing` and refine the approved draft rather than rewriting it in a second system. Complete reviewed sources/claims, final media and provenance, prompts, card/no-card decision, journey framing, aggregation, tests, and committed publication migration. Keep incomplete neighbors unpublished and fail-closed.

For every accepted image, complete the runbook's top-level `## Image lifecycle` block before registering the final media. Show the actual reference and accepted final together, and record reasoning/source basis, reference origin/rights/path/hash, the complete generation prompt or direct-use transformation, tool/model/date, rejected candidates, final paths/hashes, and the comparison verdict. Do not treat scattered provenance fields or filenames as an adequate product-owner review surface.

When a reviewed reference already has the approved scientific or explanatory layout, require a style-only image edit: preserve its exact composition, positions, proportions, labels, callouts, and evidence-bearing details and change only rendering style. Inspect comparative morphology at actual desktop and mobile lesson sizes; reject output when the subjects become visually indistinguishable even if labels remain correct. Reject structural drift; do not reinterpret, simplify, or rearrange the source unless the research note documents an adapted composition and Carlin explicitly approves it.

Run:

```text
npm run lesson:gate -- --lesson <lesson-id> --note <path> --gate implementation
```

Do not enter `Review` while an approved core visual, provenance duty, required test, or blocking quality finding remains unresolved without an explicit safe deferral.

### 5. Validate and publish — Stages 16–18

Repeat the complete quality contract against final content and media. Run the runbook's full content, media, domain, test, typecheck, build, database, accessibility, and responsive-browser checks. Run the release gate before publication:

```text
npm run lesson:gate -- --lesson <lesson-id> --note <path> --gate release
```

Do not make learner UAT a per-lesson implementation or release gate. Record any future family/beta walkthrough as optional product evidence in the research note; it belongs to the later broad-public-release program. Proxy disagreement or observed confusion still returns the current lesson to prototype work for product review.

Publish only after accountable approval, committed migration review, hosted development verification, and every blocking finding is resolved. Set `Complete` only after approval, merge, publication verification, and current queue/research records.

## Preserve gate integrity

- Treat deterministic gate output as structural evidence, never as an automated quality judgment.
- Keep prototype annotations outside semantic headings, sections, prompts, progress, completion, and published rendering.
- Keep final assets, publication configuration, and unlocks behind the learner-prototype checkpoint.
- Keep the production-preview and release gates distinct from prototype approval.
- Record reviewer identity, state, findings, deferrals, and safe behavior in the research note and Linear.
- Make each accepted image's reasoning → visible reference → exact prompt/transformation → visible final chain directly reviewable from the research note.
- Stop at any human approval, rights decision, or unresolved curriculum choice that the repository assigns to an accountable person.

## Finish the handoff

Summarize the learner outcome, source/research basis, prototype or production preview, material review findings, validation run, publication state, and remaining human gates. Link directly to the research note's image lifecycle section when images exist, plus the lesson issue, PR, and preview. Never call an unpublished lesson published or broadly released.
