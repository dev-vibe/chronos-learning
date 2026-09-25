# Changing a lesson's understanding prompts

- Status: Accepted
- Date: 2026-09-25
- Builds on: [ADR 005: Parent review](decisions/005-parent-review.md)

Learners' answers are stored under prompt IDs, and a parent reviews those answers. Lessons live only in the repository, so a prompt can change at any merge while learners already have answers saved under it. This page says what may change, and what happens to learners who already answered.

## The policy

1. **A prompt ID stands for the question itself.** That covers its lesson, kind, question text, options (their ids and labels), best answer (`bestOptionId`), `required` flag, `minimumResponseLength`, and any other logic that decides what counts as an answer. To change any of these, give the prompt a new ID.
   - Explanation, option feedback and hint text may change under the same ID. Voice revisions do this.
   - Reordering options, or changing which evidence a prompt links to, may also stay under the same ID.
2. **What a learner has earned stays.** Finishing a lesson, a parent's pass and Knowledge Cards are never undone by a prompt change. A change never un-finishes a learner, reopens a passed review or removes a card.
3. **Nothing is migrated or deleted.** Old attempts and submitted answers stay in the database under their old prompt IDs. A retired ID is never reused for a different question.

## How to change a prompt

1. In the lesson module, give the changed prompt a new ID and point the lesson's `promptIds` and its prompt module at it. Delete the old prompt.
2. Run `npm run content:fingerprints`. It records the new prompt and marks the old one retired in `content/published-prompt-fingerprints.json`.
3. Run `npm run validate:content`, then merge. There is no database step.

`validate:content` fails when a published prompt's question, options, best answer, required flag or minimum length changed under an unchanged ID, and tells the author to use a new ID. The fingerprint script refuses to record such a change, so it cannot be hidden by regenerating. The same check runs in the content tests.

## What learners see afterwards

The lesson page counts only the lesson's current prompts. Attempts for a retired prompt are kept but ignored by the checks, the "finish" requirement and progress.

| Learner's state | After a required prompt is added or replaced |
| --- | --- |
| Not finished | Answers the lesson's current checks before finishing, as usual. |
| Finished, waiting for review | Still finished and waiting. The parent reviews what was sent. The new question is there to try; to send updated answers, the learner answers every current check first. |
| Passed | Still passed, with the cards. The new question is ordinary practice. |
| Sent back | Still finished. **Send it again** needs every current required check answered, and the page marks the one that is missing. A resubmission is a fresh round the parent judges against the lesson as it is now, and the learner is already revising, so one more answer is a small ask. |
| Finished before parent review existed (no submission yet) | Shown as finished. Sending it for review needs every current required check answered. |
| Guest who finished in this browser | Still finished. The new question is ordinary practice. |

Every send (first send, update, send again) covers the lesson's current required checks. Finishing happens once and is never undone.

## What the parent sees

When a learner sends a lesson, their browser stores a snapshot of the lesson's questions with the submission (`lesson_submissions.questions`): each question's text, kind, whether it was required, the "strong answer" guide, and, for multiple choice, the chosen option's label and whether it was the best-supported answer.

Review lists exactly the questions the learner was shown, with their answers:

- A question still in the lesson is shown from the repository. Its unchanged ID guarantees it is the same question, and the snapshot is not trusted over it.
- A question that has since changed is shown from the snapshot, marked as changed since the learner saw it.
- A submission made before snapshots existed lists the lesson's current questions, plus any answer whose question has left the lesson.

The snapshot comes from the learner's browser, so on a retired question a determined learner could have altered the text or verdict the parent reads. That matches ADR 005's trust model: the parent is the check.

## Database

`submit_lesson` and `review_submission` do not look at the lesson's prompts. `submit_lesson` accepts any prompt IDs, never changes a passed submission, and never writes or removes attempts. A learner's own resubmission replaces the previous round's answers in `lesson_submissions`, as before; every attempt stays in `understanding_prompt_attempts`.
