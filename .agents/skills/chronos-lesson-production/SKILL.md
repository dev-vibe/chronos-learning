---
name: chronos-lesson-production
description: Produce, continue, materially revise, correct, or publish a Chronos lesson using the canonical runbook and production queue.
---

# Chronos lesson production

The [lesson creation runbook](../../../docs/content/lesson-creation-runbook.md) is self-contained and owns the whole process. Read it and the [production queue](../../../docs/content/lesson-production-queue.md). Do not read other product, design or architecture docs for lesson work.

## Route the request

- **Create next / continue:** follow the runbook's invocation contract. Continue an `Active` row before selecting the first eligible `Ready` row.
- **Publish an already-approved lesson:** go to runbook Stage 18. Do not repeat research, reviews or platform discovery.
- **Material revision:** re-enter the earliest affected stage in the lesson's single research note. Repeat an owner touchpoint only if scope, central explanation, evidence, prompts, media job, completion or journey role changes.
- **Narrow correction:** use Stage 18's correction path.
- **Changes to the production system itself:** stay within the user's authorized scope; do not start a queued lesson.

## Hold the line

- The owner is involved exactly three times: the Stage 3B research card, Stage 14B prototype approval (which also authorizes publication), and the Stage 18 hosted check. Never approve on the owner's behalf.
- The queue row changes twice, both in the lesson PR: `Active` in its first commit, `Complete` in its last. Merging ends the process: no post-merge verification and no closeout PR.
- Every lesson handoff includes the direct lesson preview link, following the runbook's preview-link contract.
- Gate scripts prove structure and references, not research quality or human approval. Never call local checks learner validation, or unpublished work published.
