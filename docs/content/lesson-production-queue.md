# Chronos lesson production queue

Linear anchor: [ASH-65 — Maintain the canonical Chronos lesson production queue](https://linear.app/ashs-workshop/issue/ASH-65/maintain-the-canonical-chronos-lesson-production-queue)

Curriculum source: [Canonical World Spine roster](world-spine-canonical-roster.md) and [World Spine audit](world-spine-audit.md)

Status: **Roster positions 7–14 approved on July 19, 2026. Positions 15–24 added to the production queue on August 31, 2026** by product-owner direction after Caral completed. Animals, Herding, and Mobility and Wheels, Metals, and Specialized Work remain `Planned`. Pyramids, Builders, and Evidence is the active lesson. Spine positions 3–6 remain outside this runway.

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
| 70 | `lesson.egypt.pyramids-and-state-labor` — Pyramids, Builders, and Evidence | 15 | Teach how context, phase, date, attribution, use, and purpose differ, using Giza plus concise Osirion, Hawara, and stone-vessel comparisons. | Stage 3B direction approved September 2; rebuilt real-shell prototype, independent proxy review, and deterministic gate passed September 3 | `Awaiting approval` | [ASH-99](https://linear.app/ashs-workshop/issue/ASH-99/research-and-publish-pyramids-builders-and-evidence) · [Draft PR #29](https://github.com/dev-vibe/chronos-learning/pull/29) |
| 80 | `lesson.indus.cities-and-signs` — Indus Cities and Undeciphered Signs | 16 | Add a major independent urban tradition and teach disciplined inference from archaeology when writing cannot be read. | Early Writing Systems merged and verified | `Ready` | [ASH-100](https://linear.app/ashs-workshop/issue/ASH-100/research-and-publish-indus-cities-and-undeciphered-signs) |
| 90 | `lesson.nubia.kerma-and-nile-world` — Kerma and the Middle Nile | 17 | Explain the Nile as a connected political world rather than an Egypt-only story. | Nile lesson merged and verified | `Ready` | [ASH-101](https://linear.app/ashs-workshop/issue/ASH-101/research-and-publish-kerma-and-the-middle-nile) |
| 100 | `lesson.mesopotamia.akkadian-empire` — Akkad and the Problem of Empire | 18 | Introduce empire as a recurring political strategy rather than a celebratory first. | Early Writing Systems merged and verified | `Ready` | [ASH-102](https://linear.app/ashs-workshop/issue/ASH-102/research-and-publish-akkad-and-the-problem-of-empire) |
| 110 | `lesson.bronze-age.exchange-networks` — Bronze Age Exchange Networks | 19 | Show that early states depended on cross-regional exchange and specialist intermediaries. | Wheels, Metals, and Specialized Work implementation available | `Ready` | [ASH-103](https://linear.app/ashs-workshop/issue/ASH-103/research-and-publish-bronze-age-exchange-networks) |
| 120 | `lesson.steppe.chariots-and-mobility` — Steppe Mobility and the Chariot | 20 | Provide a causal bridge between mobile societies and changing Eurasian states. | Animals, Herding, and Mobility implementation available | `Ready` | [ASH-104](https://linear.app/ashs-workshop/issue/ASH-104/research-and-publish-steppe-mobility-and-the-chariot) |
| 130 | `lesson.mesopotamia.law-and-kingship` — Law, Kingship, and Hammurabi's Babylon | 21 | Use a famous law collection to teach what royal laws reveal—and what they do not prove about practice. | Akkad lesson implementation available | `Ready` | [ASH-105](https://linear.app/ashs-workshop/issue/ASH-105/research-and-publish-law-kingship-and-hammurabis-babylon) |
| 140 | `lesson.china.shang-bronze-and-writing` — Shang Power, Bronze, and Oracle Bones | 22 | Anchor early Chinese state formation in surviving bronze objects and inscriptions. | Wheels, Metals, and Specialized Work implementation available | `Ready` | [ASH-106](https://linear.app/ashs-workshop/issue/ASH-106/research-and-publish-shang-power-bronze-and-oracle-bones) |
| 150 | `lesson.bronze-age.diplomacy-and-rivalry` — Diplomacy and Rivalry in the Late Bronze Age | 23 | Make interstate causality visible before the region's political transformation. | Bronze Age Exchange Networks implementation available | `Ready` | [ASH-107](https://linear.app/ashs-workshop/issue/ASH-107/research-and-publish-diplomacy-and-rivalry-in-the-late-bronze-age) |
| 160 | `lesson.bronze-age.transformation` — The Late Bronze Age Transformation | 24 | Replace a single-cause collapse story with a teachable, regionally uneven evidence problem. | Diplomacy and Rivalry implementation available; close the Late Bronze Age regional-variation research gate in the lesson brief before drafting learner prose | `Ready` | [ASH-108](https://linear.app/ashs-workshop/issue/ASH-108/research-and-publish-the-late-bronze-age-transformation) |

`lesson.farming.multiple-origins` completed production on August 16, 2026. Carlin approved its Stages 0–14B learner prototype on August 11, approved the corrected wheat morphology on August 15, and explicitly confirmed the lesson was done and no longer draft on August 16. PR #22 merged, the release gate passed, and the committed publication configuration preserves the later family/public-release UAT program as a separate product gate.

`lesson.egypt.nile-state` completed production on August 19, 2026. Its Stages 0–14B packet and independent adult learner-proxy review found no blockers; Carlin approved the revised prototype, all three visual jobs, the Narmer Palette Artifact / Witness card, the safe journey-end behavior, and the final eager Palette loading and compact portrait-map corrections. The release gate, responsive/product checks, committed migration, hosted development configuration, immutable media publication, and post-publication regression suite all passed. PR #24 merged as `fca00f4`, and the corresponding Vercel production deployment reached `READY`.

`lesson.caral.andean-urbanism` completed production on August 29, 2026. Carlin approved the Stages 0–14B prototype on August 19 and confirmed the final lesson was done on August 27. The release gate and post-publication suite passed; the hosted Chronos migration and all 11 selected immutable media objects were verified; PR #26 merged as `ef0d58b`; and the corresponding Vercel deployment completed successfully.

On August 31, 2026, the product owner replenished the runway with World Spine positions 15–24 and directed creation of the corresponding per-lesson issues ASH-99 through ASH-108. Animals, Herding, and Mobility and Wheels, Metals, and Specialized Work remain `Planned` and are not auto-selected. The lowest eligible `Ready` row is `lesson.egypt.pyramids-and-state-labor` ([ASH-99](https://linear.app/ashs-workshop/issue/ASH-99/research-and-publish-pyramids-power-and-state-labor)). Rows 110, 120, 130, 140, 150, and 160 stay `Ready` but ineligible until their named production dependencies are satisfied.

Publishing position 7 after position 8 does not change canonical learner order. `lesson.farming.multiple-origins` remains the curriculum prerequisite for `lesson.farming.settlements`, and that prerequisite cannot be skipped. Producing positions 15–24 before positions 9–10 likewise does not permit learners to skip Animals, Herding, and Mobility or Wheels, Metals, and Specialized Work.

## Completed reference lessons in the approved segment

| Lesson | Spine position | Evidence of completion | Notes |
| --- | ---: | --- | --- |
| `lesson.humans.homo-sapiens-origins` — Our Species Begins in Africa | 1 | [ASH-72](https://linear.app/ashs-workshop/issue/ASH-72/rebuild-and-publish-our-species-begins-in-africa) · [PR #18 merged](https://github.com/dev-vibe/chronos-learning/pull/18) | Clean-slate rebuild approved and merged 2026-07-26 after the ASH-69 preview was rejected. Decision packet in `docs/research/homo-sapiens-origins.md`. |
| `lesson.humans.migrations-and-interbreeding` — Migrations, Encounters, and Ancient DNA | 2 | [ASH-73](https://linear.app/ashs-workshop/issue/ASH-73/research-and-publish-migrations-encounters-and-ancient-dna) · [PR #19 merged](https://github.com/dev-vibe/chronos-learning/pull/19) | Spine position 2 published 2026-07-27. Decision packet in `docs/research/migrations-and-ancient-dna.md`. |
| `lesson.uruk.first-city` — Uruk: Life in an Early City | 11 | Merged responsive Learn loop and supporting media work | First complete vertical slice and migration reference; not a universal content template. |
| `lesson.writing.early-systems` — From Marks to Proto-Cuneiform | 12 | [ASH-63](https://linear.app/ashs-workshop/issue/ASH-63/publish-early-writing-systems-and-prove-the-reusable-learn-pipeline) · [PR #8 merged](https://github.com/dev-vibe/chronos-learning/pull/8) | Second approved reference proving the reusable content, media, completion, and recovery pipeline. |
| `lesson.farming.settlements` — Farming and Settlements | 8 | [ASH-70](https://linear.app/ashs-workshop/issue/ASH-70/research-and-publish-farming-and-settlements) · [PR #15 merged](https://github.com/dev-vibe/chronos-learning/pull/15) | Revision 2 approved 2026-07-21 and merged 2026-07-26 after the first preview failed product-owner review. Decision packet in `docs/research/farming-settlements.md`. |

## Approved boundary

This queue records World Spine positions 1 and 2, each added by explicit product-owner direction, plus positions 7–14 and the August 31, 2026 extension through 15–24. The product owner also directed creation of per-lesson issues ASH-99 through ASH-108 for that extension. It does not promote any other roster node, create issues for `Planned` rows, or authorize full-lesson work without the queue and runbook gates. Spine positions 3–6 remain `Planned` in the canonical roster and are not eligible for automatic selection. The complete roster remains the curriculum source of truth; this file owns operational production state.

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
