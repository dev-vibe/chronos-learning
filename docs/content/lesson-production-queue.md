# Chronos lesson production queue

Linear anchor: [ASH-65 — Maintain the canonical Chronos lesson production queue](https://linear.app/ashs-workshop/issue/ASH-65/maintain-the-canonical-chronos-lesson-production-queue)

Curriculum source: [Canonical World Spine roster](world-spine-canonical-roster.md) and [World Spine audit](world-spine-audit.md)

Status: **Roster positions 7–14 approved on July 19, 2026; position 1 activated by product-owner direction on July 20, 2026.** No other World Spine node is approved for automatic production by this update.

This is the version-controlled source of truth for which canonical lesson is produced next. It is an editorially curated production queue, not the complete knowledge graph, legacy-data order, or a promise that every canonical node is ready for lesson production.

The canonical workflow is [`docs/content/lesson-creation-runbook.md`](lesson-creation-runbook.md), tracked by [ASH-64](https://linear.app/ashs-workshop/issue/ASH-64/create-the-canonical-end-to-end-lesson-creation-runbook). A request equivalent to “Let's create the next Chronos lesson” invokes the runbook and this queue automatically.

## Curriculum prerequisites and production dependencies

Canonical-roster prerequisites govern learner and curriculum sequencing: they state what a learner should understand before a node. The **Production dependencies** column below governs whether an agent may begin creating a lesson. Implementation may therefore occur outside learner-facing chronological order when its production dependencies are satisfied.

Implementation order never overrides canonical Journey order. Completing a later lesson early does not remove, fulfill, or permit learners to skip its curriculum prerequisite. In particular, `lesson.farming.multiple-origins` remains the curriculum prerequisite for `lesson.farming.settlements`, even though the drafted Farming and Settlements lesson is the first eligible production task.

## Selection rules

1. Continue an existing active row before starting new work.
2. Active states are `Researching`, `Awaiting approval`, `Implementing`, and `Review`.
3. If there is no active row, select the lowest production-order `Ready` row whose production dependencies are satisfied.
4. Skip `Planned`, `Blocked`, `Review`, and `Complete` rows when selecting new work.
5. Never silently promote `Planned` or `Blocked` work, change production order, or invent a replacement.
6. Normally only one lesson is active. A second requires explicit parallel-ownership approval and must not create shared-runtime or migration conflicts.
7. Create a per-lesson Linear issue only when the row becomes active.
8. Update the row in the same lesson branch and PR as work advances.
9. `Complete` means the lesson PR is approved and merged, publication/configuration is verified, and required queue/research documentation is current.
10. Keep at least three reviewed future candidates when possible. Queue curation is a product/curriculum decision, not automatic agent inference.

## Status vocabulary

| Status | Meaning |
| --- | --- |
| `Planned` | Canonical inclusion is approved, but the node is not approved for automatic selection. |
| `Ready` | Scope and production candidacy are approved; production dependencies still control eligibility. |
| `Researching` | Research, source, claim, and lesson-design work is underway. |
| `Awaiting approval` | The research/editorial decision packet is ready for product-owner review. |
| `Implementing` | The approved lesson plan is being implemented. |
| `Review` | The lesson PR is awaiting or addressing final review. |
| `Blocked` | A named decision, dependency, rights issue, or platform gap prevents work. |
| `Complete` | Approved, merged, verified, and documented. |

## Approved production runway

The production order below is operational and may differ from canonical learner order. That difference does not change the ordered World Spine or its curriculum prerequisites.

| Production order | Lesson | Spine position | Why it is queued | Production dependencies | Status | Linear / PR |
| ---: | --- | ---: | --- | --- | --- | --- |
| 1 | `lesson.humans.homo-sapiens-origins` — Our Species Begins in Africa | 1 | Begin the learner-facing World Spine at its actual chronological and conceptual starting point, establishing shared African origins and evidence-aware deep history. | Explicit product-owner activation on July 20, 2026; no curriculum prerequisite; source and claim brief is the first research gate | `Awaiting approval` | [ASH-69](https://linear.app/ashs-workshop/issue/ASH-69/research-and-publish-our-species-begins-in-africa) |
| 10 | `lesson.farming.settlements` — Farming and Settlements | 8 | Finish the existing drafted Southwest Asian settlement case and carry the reusable pipeline forward. | Early Writing Systems merged and verified; reusable multi-lesson pipeline accepted; canonical scope approved | `Ready` | Per-lesson issue created when selected |
| 20 | `lesson.farming.multiple-origins` — Many Beginnings of Farming | 7 | Establish the global frame that prevents a single “Neolithic Revolution” story. | No prior lesson implementation; source and claim brief is the first research gate | `Ready` | Per-lesson issue created when selected |
| 30 | `lesson.animals.domestication-and-pastoralism` — Animals, Herding, and Mobility | 9 | Explain mobile pastoral lifeways as a durable complement and alternative to settled farming. | Many Beginnings of Farming implementation available | `Planned` | None |
| 40 | `lesson.technology.wheels-metals-and-work` — Wheels, Metals, and Specialized Work | 10 | Provide the material and labor-system bridge into early cities and states. | Farming and Settlements implementation available; dedicated source brief | `Planned` | None |
| 50 | `lesson.egypt.nile-state` — The Nile and an Early Egyptian State | 13 | Add a contrasting, evidence-rich pathway to early state formation. | Uruk reference implementation available | `Ready` | Per-lesson issue created when selected |
| 60 | `lesson.caral.andean-urbanism` — Caral and Early Andean Urbanism | 14 | Add an independently developed urban case that challenges one-path models of cities. | Many Beginnings of Farming implementation available | `Ready` | Per-lesson issue created when selected |

`lesson.humans.homo-sapiens-origins` is the active production task by explicit product-owner direction on July 20, 2026. This amendment supersedes the prior default that would have selected Farming and Settlements first; it does not silently promote any other Planned node. After this active lesson leaves production, selection returns to the lowest eligible `Ready` row unless the product owner approves another queue amendment.

`lesson.farming.settlements` remains the first eligible task in the previously approved positions 7–14 runway because its actual production dependencies are satisfied and its draft is already available. Producing it before `lesson.farming.multiple-origins` would not change canonical order: learners must still encounter Many Beginnings of Farming first, and that curriculum prerequisite cannot be skipped. The Nile node is also reviewed and ready but follows both in production order. Caral remains approved and ready, with its stated production dependency; Planned rows require explicit promotion before selection.

## Completed reference lessons in the approved segment

| Lesson | Spine position | Evidence of completion | Notes |
| --- | ---: | --- | --- |
| `lesson.uruk.first-city` — Uruk: Life in an Early City | 11 | Merged responsive Learn loop and supporting media work | First complete vertical slice and migration reference; not a universal content template. |
| `lesson.writing.early-systems` — From Marks to Proto-Cuneiform | 12 | [ASH-63](https://linear.app/ashs-workshop/issue/ASH-63/publish-early-writing-systems-and-prove-the-reusable-learn-pipeline) · [PR #8 merged](https://github.com/dev-vibe/chronos-learning/pull/8) | Second approved reference proving the reusable content, media, completion, and recovery pipeline. |

## Approved boundary

This queue records the approved World Spine positions 7–14 runway plus the explicit July 20 activation of position 1. It does not promote positions 2–6 or later roster nodes, create per-node Linear issues, or authorize full-lesson work without the queue and runbook gates. The complete roster remains the curriculum source of truth; this file owns operational production state.

## Queue-change checklist

- [ ] Lesson identity and learner-facing title are unambiguous.
- [ ] Canonical Spine position and production order are both intentional.
- [ ] Production dependencies and blocking decisions are named.
- [ ] Curriculum prerequisites remain authoritative in the canonical roster.
- [ ] Status follows the vocabulary above.
- [ ] Active Linear issue and PR are linked when they exist.
- [ ] Reordering or promotion to `Ready` has product/curriculum approval.
- [ ] Completed work has merged and verified evidence.
- [ ] At least three future candidates remain, or the runway gap is explicitly flagged.
