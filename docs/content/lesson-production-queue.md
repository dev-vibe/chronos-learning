# Chronos lesson production queue

Linear anchor: [ASH-65 — Maintain the canonical Chronos lesson production queue](https://linear.app/ashs-workshop/issue/ASH-65/maintain-the-canonical-chronos-lesson-production-queue)

This is the version-controlled source of truth for which canonical lesson is produced next. It is an editorially curated production queue, not the complete knowledge graph, a legacy-data order, or a promise that every listed idea belongs on the World History spine.

The [lesson creation runbook](lesson-creation-runbook.md) owns selection and execution behavior. A user may invoke it with only:

> Let's create the next Chronos lesson.

## Selection rules

1. Continue an existing active row before starting new work.
2. Active states are `Researching`, `Awaiting approval`, `Implementing`, and `Review`.
3. If there is no active row, select the lowest production-order `Ready` row whose prerequisites are `Complete`.
4. Skip `Planned`, `Blocked`, `Review`, and `Complete` rows when selecting new work.
5. Never silently promote `Planned` or `Blocked` work, change order, or invent a replacement.
6. Normally only one lesson is active. A second requires explicit parallel-ownership approval and must not create shared-runtime or migration conflicts.
7. Create a per-lesson Linear issue only when the row becomes active.
8. Update the row in the same lesson branch/PR as work advances.
9. `Complete` means the lesson PR is approved and merged, publication/configuration is verified, and required queue/research documentation is current.
10. Keep at least three reviewed future candidates when possible. Queue curation is a product/curriculum decision, not an automatic agent inference.

## Status vocabulary

| Status | Meaning |
| --- | --- |
| `Planned` | Candidate is recorded but not approved for automatic selection. |
| `Ready` | Scope/order are approved; prerequisites still control eligibility. |
| `Researching` | Stages 0–14 are underway. |
| `Awaiting approval` | Research/editorial decision packet is ready for product-owner review. |
| `Implementing` | Approved plan is being implemented through Stages 15–18. |
| `Review` | Lesson PR is awaiting or addressing final review. |
| `Blocked` | A named decision, dependency, rights issue, or platform gap prevents work. |
| `Complete` | Approved, merged, verified, and documented. |

## Active and ready queue

| Production order | Lesson | Journey position | Why it is queued | Prerequisites | Status | Linear / PR |
| --- | --- | --- | --- | --- | --- | --- |
| 10 | `lesson.writing.early-systems` — From Marks to Proto-Cuneiform | World History · Foundations · after Uruk | Second reference lesson proving the reusable Learn/content/media/completion pipeline | Uruk and media pipeline complete | `Review` | [ASH-63](https://linear.app/ashs-workshop/issue/ASH-63/publish-early-writing-systems-and-prove-the-reusable-learn-pipeline) · [PR #8](https://github.com/dev-vibe/chronos-learning/pull/8) |
| 20 | `lesson.farming.settlements` — working title: Farming and Settlements | World History · Foundations · before Uruk | Replace the bounded unpublished stub and complete the three-lesson Foundations sequence leading into Uruk and writing | ASH-63 / PR #8 `Complete`; verify canonical scope against legacy `neolithic_revolution` before aliasing | `Ready` | Per-lesson issue created when selected |

`lesson.farming.settlements` is the next approved new lesson, but it is not eligible until Early Writing Systems is `Complete`. This technical sequencing ensures its branch starts from the accepted reusable multi-lesson runtime rather than rebuilding around an older base.

## Completed reference lessons

| Lesson | Journey position | Evidence of completion | Notes |
| --- | --- | --- | --- |
| `lesson.uruk.first-city` — Uruk: The First City? | World History · Foundations | Merged responsive Learn-loop and supporting media work | First complete vertical slice and migration template; not a universal content template. |

Move Early Writing Systems here and update its active row to `Complete` when PR #8 is merged and verified.

## Curriculum runway requiring review

No lesson after Farming and Settlements is yet approved for automatic production. Before Farming reaches final review, curate at least three candidates using:

- World History inclusion criteria in the PRD;
- the repository audit's keep/adapt/research/archive classifications;
- prerequisite and chronological coherence;
- coverage of regions, forms of evidence, and historical questions;
- opportunity to validate reusable lesson components without choosing topics merely to test software;
- the lesson creation runbook's node-proposal test.

Do not automatically convert the 50 legacy lessons, the 379 timeline stubs, or every “keep/adapt” audit item into this queue. Each candidate needs an explicit curriculum decision.

## Queue-change checklist

- [ ] Lesson identity and working title are unambiguous.
- [ ] Journey/chapter/position are intentional.
- [ ] Prerequisites and blocking decisions are named.
- [ ] Status follows the vocabulary above.
- [ ] Active Linear issue and PR are linked when they exist.
- [ ] Reordering or promotion to `Ready` has product/curriculum approval.
- [ ] Completed work has merged/verified evidence.
- [ ] At least three future candidates remain, or the runway gap is explicitly flagged.
