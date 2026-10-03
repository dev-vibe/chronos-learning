# Changing a lesson's understanding prompts

Builds on [ADR 005: Parent review](decisions/005-parent-review.md). Learners' answers are stored under prompt IDs, and lessons live only in the repository, so a prompt can change while learners already have answers saved under it.

## The policy

1. **A prompt ID stands for the question itself:** its lesson, kind, question text, options (ids and labels), `bestOptionId`, `required` and `minimumResponseLength`. To change any of these, give the prompt a new ID. Explanation, option feedback and hint text may change under the same ID, and so may option order.
2. **What a learner has earned stays.** A prompt change never un-finishes a lesson, reopens a passed review or removes a card.
3. **Nothing is migrated or deleted.** Old answers stay in the database under their old IDs, and a retired ID is never reused.

## How to change a prompt

For a published lesson, the [prompt revision runbook](../content/prompt-revision-runbook.md) wraps these steps with drafting, a support check and the owner's review.

1. Give the changed prompt a new ID in the lesson module, update the lesson's `promptIds` and prompt module, and delete the old prompt.
2. Run `npm run content:fingerprints`. It records the new prompt and marks the old one retired in `content/published-prompt-fingerprints.json`.
3. Run `npm run validate:content` and merge. There is no database step.

`validate:content` fails when a published prompt's identity changes under an unchanged ID, and says to use a new ID. The fingerprint script never overwrites an existing hash, so regenerating can't hide the change.

## What learners and parents see

- The Learn page only counts the lesson's current prompts. A finished, waiting or passed lesson stays that way; a new question is just another check to try.
- Every send (first send, updated answers, send it again) needs the lesson's current required checks done. A sent-back learner sees which question is still missing.
- Only written answers go to the parent. Each submission stores the written questions as the learner saw them (`lesson_submissions.questions`), and Review shows those. A question the lesson has since replaced is marked as changed.
- The questions come from the learner's browser, like the answers. As ADR 005 says, the parent is the check.
