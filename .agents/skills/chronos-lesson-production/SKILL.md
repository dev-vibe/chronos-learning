---
name: chronos-lesson-production
description: Produce, continue, materially revise, correct, or publish a Chronos lesson using the canonical runbook and production queue. Use for "create the next Chronos lesson", continuing an active lesson, or publishing an approved one.
---

# Chronos lesson production

The [lesson creation runbook](../../../docs/content/lesson-creation-runbook.md) is self-contained and owns the whole process. Read it and the [production queue](../../../docs/content/lesson-production-queue.md). Do not read other product, design or architecture docs for lesson work. If either file is missing, say so and stop; do not reconstruct the workflow from chat or from this skill.

In a Cowork or cloud session linked to Carlin's computer, also read [Git and file access for Cowork and cloud agent sessions](../../../docs/content/lesson-production/cowork-git.md).

## Route the request

- **Create next / continue:** follow the runbook's invocation contract. Continue an `Active` row before selecting the first eligible `Ready` row.
- **Publish an already-approved lesson:** go to runbook Stage 18. Do not repeat research, reviews or platform discovery.
- **Revision of a published lesson** ("revise/redo the X lesson", "improve the X prompt", "refresh the X card"): use the [lesson revision runbook](../../../docs/content/lesson-voice-revision-runbook.md) (skill `chronos-lesson-voice-revision`). Its audit decides whether the telling, the prompts and the card need work.
- **Material revision:** re-enter the earliest affected stage in the lesson's single research note. Repeat an owner touchpoint only if scope, central explanation, evidence, prompts, media job, completion or journey role changes.
- **Narrow correction:** use Stage 18's correction path.
- **Changes to the production system itself:** stay within the user's authorized scope; do not start a queued lesson.

## Hold the line

- The owner is involved exactly three times: the Stage 3B research card, Stage 14B prototype approval (which also authorizes publication), and the Stage 18 hosted check. Never approve on the owner's behalf.
- The queue row changes twice, both in the lesson PR: `Active` in its first commit, `Complete` in its last. Merging ends the process: no post-merge verification and no closeout PR.
- Every lesson handoff includes the direct lesson preview link, following the runbook's preview-link contract.
- Gate scripts prove structure and references, not research quality or human approval. Never call local checks learner validation, or unpublished work published.
