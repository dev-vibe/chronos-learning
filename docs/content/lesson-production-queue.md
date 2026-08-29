# Chronos lesson production queue

Linear anchor: [ASH-65 — Maintain the canonical Chronos lesson production queue](https://linear.app/ashs-workshop/issue/ASH-65/maintain-the-canonical-chronos-lesson-production-queue)

Curriculum source: [Canonical World Spine roster](world-spine-canonical-roster.md) and [World Spine audit](world-spine-audit.md)

Status: **Roster positions 7–14 approved on July 19, 2026.** Farming and Settlements, Human Origins, and Migrations merged by July 27, 2026. Selection returned to the lowest eligible `Ready` row: Many Beginnings of Farming under ASH-74. No other World Spine node is approved for automatic production by this update.

This is the version-controlled source of truth for which canonical lesson is produced next. It is an editorially curated production queue, not the complete knowledge graph, legacy-data order, or a promise that every canonical node is ready for lesson production.

The canonical workflow is [`docs/content/lesson-creation-runbook.md`](lesson-creation-runbook.md), tracked by [ASH-64](https://linear.app/ashs-workshop/issue/ASH-64/create-the-canonical-end-to-end-lesson-creation-runbook). A request equivalent to “Let's create the next Chronos lesson” invokes the runbook and this queue automatically.

## Curriculum prerequisites and production dependencies

Canonical-roster prerequisites govern learner and curriculum sequencing: they state what a learner should understand before a node. The **Production dependencies** column below governs whether an agent may begin creating a lesson. Implementation may therefore occur outside learner-facing chronological order when its production dependencies are satisfied.

Implementation order never overrides canonical Journey order. Completing a later lesson early does not remove, fulfill, or permit learners to skip its curriculum prerequisite. In particular, `lesson.farming.multiple-origins` remains the curriculum prerequisite for `lesson.farming.settlements`, even though Farming and Settlements published first.

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
| 10 | `lesson.humans.migrations-and-interbreeding` — Migrations, Encounters, and Ancient DNA | 2 | Product-owner direction: continue the World History opening sequence immediately after Human Origins. | Human Origins merged and verified; source and claim brief approved with a Neanderthal card | `Complete` | [ASH-73](https://linear.app/ashs-workshop/issue/ASH-73/research-and-publish-migrations-encounters-and-ancient-dna) · [PR #19 merged](https://github.com/dev-vibe/chronos-learning/pull/19) |
| 20 | `lesson.farming.multiple-origins` — Many Beginnings of Farming | 7 | Establish the global frame that prevents a single “Neolithic Revolution” story. | No prior lesson implementation; source and claim brief is the first research gate | `Complete` | [ASH-74](https://linear.app/ashs-workshop/issue/ASH-74/research-and-publish-many-beginnings-of-farming) · [PR #22 merged](https://github.com/dev-vibe/chronos-learning/pull/22) |
| 30 | `lesson.animals.domestication-and-pastoralism` — Animals, Herding, and Mobility | 9 | Explain mobile pastoral lifeways as a durable complement and alternative to settled farming. | Many Beginnings of Farming implementation available | `Planned` | None |
| 40 | `lesson.technology.wheels-metals-and-work` — Wheels, Metals, and Specialized Work | 10 | Provide the material and labor-system bridge into early cities and states. | Farming and Settlements implementation available; dedicated source brief | `Planned` | None |
| 50 | `lesson.egypt.nile-state` — The Nile and an Early Egyptian State | 13 | Add a contrasting, evidence-rich pathway to early state formation. | Uruk reference implementation available | `Complete` | [ASH-97](https://linear.app/ashs-workshop/issue/ASH-97/research-and-publish-the-nile-and-an-early-egyptian-state) · [PR #24 merged](https://github.com/dev-vibe/chronos-learning/pull/24) |
| 60 | `lesson.caral.andean-urbanism` — Caral and Early Andean Urbanism | 14 | Add an independently developed urban case that challenges one-path models of cities. | Many Beginnings of Farming implementation available | `Complete` | [ASH-98](https://linear.app/ashs-workshop/issue/ASH-98/research-and-publish-caral-and-early-andean-urbanism) · [PR #26 merged](https://github.com/dev-vibe/chronos-learning/pull/26) |

`lesson.farming.multiple-origins` completed production on August 16, 2026. Carlin approved its Stages 0–14B learner prototype on August 11, approved the corrected wheat morphology on August 15, and explicitly confirmed the lesson was done and no longer draft on August 16. PR #22 merged, the release gate passed, and the committed publication configuration preserves the later family/public-release UAT program as a separate product gate.

`lesson.egypt.nile-state` completed production on August 19, 2026. Its Stages 0–14B packet and independent adult learner-proxy review found no blockers; Carlin approved the revised prototype, all three visual jobs, the Narmer Palette Artifact / Witness card, the safe journey-end behavior, and the final eager Palette loading and compact portrait-map corrections. The release gate, responsive/product checks, committed migration, hosted development configuration, immutable media publication, and post-publication regression suite all passed. PR #24 merged as `fca00f4`, and the corresponding Vercel production deployment reached `READY`.

`lesson.caral.andean-urbanism` completed production on August 29, 2026. Carlin approved the Stages 0–14B prototype on August 19 and confirmed the final lesson was done on August 27. The release gate and post-publication suite passed; the hosted Chronos migration and all 11 selected immutable media objects were verified; PR #26 merged as `ef0d58b`; and the corresponding Vercel deployment completed successfully.

There is no active or automatically selectable `Ready` lesson after this completion. The curriculum queue needs replenishment before the following production cycle; Planned rows still require explicit promotion.

Publishing position 7 after position 8 does not change canonical learner order. `lesson.farming.multiple-origins` remains the curriculum prerequisite for `lesson.farming.settlements`, and that prerequisite cannot be skipped.

## Completed reference lessons in the approved segment

| Lesson | Spine position | Evidence of completion | Notes |
| --- | ---: | --- | --- |
| `lesson.humans.homo-sapiens-origins` — Our Species Begins in Africa | 1 | [ASH-72](https://linear.app/ashs-workshop/issue/ASH-72/rebuild-and-publish-our-species-begins-in-africa) · [PR #18 merged](https://github.com/dev-vibe/chronos-learning/pull/18) | Clean-slate rebuild approved and merged 2026-07-26 after the ASH-69 preview was rejected. Decision packet in `docs/research/homo-sapiens-origins.md`. |
| `lesson.humans.migrations-and-interbreeding` — Migrations, Encounters, and Ancient DNA | 2 | [ASH-73](https://linear.app/ashs-workshop/issue/ASH-73/research-and-publish-migrations-encounters-and-ancient-dna) · [PR #19 merged](https://github.com/dev-vibe/chronos-learning/pull/19) | Spine position 2 published 2026-07-27. Decision packet in `docs/research/migrations-and-ancient-dna.md`. |
| `lesson.uruk.first-city` — Uruk: Life in an Early City | 11 | Merged responsive Learn loop and supporting media work | First complete vertical slice and migration reference; not a universal content template. |
| `lesson.writing.early-systems` — From Marks to Proto-Cuneiform | 12 | [ASH-63](https://linear.app/ashs-workshop/issue/ASH-63/publish-early-writing-systems-and-prove-the-reusable-learn-pipeline) · [PR #8 merged](https://github.com/dev-vibe/chronos-learning/pull/8) | Second approved reference proving the reusable content, media, completion, and recovery pipeline. |
| `lesson.farming.settlements` — Farming and Settlements | 8 | [ASH-70](https://linear.app/ashs-workshop/issue/ASH-70/research-and-publish-farming-and-settlements) · [PR #15 merged](https://github.com/dev-vibe/chronos-learning/pull/15) | Revision 2 approved 2026-07-21 and merged 2026-07-26 after the first preview failed product-owner review. Decision packet in `docs/research/farming-settlements.md`. |

## Approved boundary

This queue records World Spine positions 1 and 2, each added by explicit product-owner direction, plus positions 7–14. It does not promote any other roster node, create per-node Linear issues, or authorize full-lesson work without the queue and runbook gates. Spine positions 3–6 remain `Planned` in the canonical roster and are not eligible for automatic selection. The complete roster remains the curriculum source of truth; this file owns operational production state.

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
