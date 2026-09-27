# Chronos prompt revision runbook

Status: the process for replacing an understanding prompt in a published lesson with a better one that does the same teaching job. A prompt revision changes how the lesson checks understanding, not what it teaches. It follows the [prompt-change policy](../architecture/prompt-changes.md). Read this file and **Stage 12** of the [lesson creation runbook](lesson-creation-runbook.md#stage-12--author-understanding-prompts-and-feedback); nothing else is required reading.

## When to use it

Use this runbook for any published prompt, required or optional, whose identity would change. A prompt's identity is its lesson, kind, question text, options (ids and labels), `bestOptionId`, `required` flag and `minimumResponseLength`. Typical requests: “improve the X prompt”, “this question is too generic”, “rebuild the evidence check around the tablet”.

It applies when the new prompt keeps the old one's teaching job: it still checks the same part of the durable understanding, and the lesson still has one to three required prompts. The new prompt may change its question, options, best answer, kind (multiple choice or written), required flag or minimum length.

Do not use it for:

- **a change to the essential question, durable understanding or a prompt's teaching job, or adding or removing a prompt.** Those are material revisions and follow the creation runbook. Stop and tell the owner.
- **text-only changes to explanation, option feedback, hint or option order.** Those keep the ID. Make them in a [voice revision](lesson-voice-revision-runbook.md) or a [correction](lesson-creation-runbook.md#corrections-after-release).

## Invocation

1. Fetch `dev-vibe/chronos-learning` and create a branch from the latest `main` named `revise/<lesson-slug>-prompt`.
2. Revise the prompt the owner names. One lesson per branch and PR; it may replace more than one of that lesson's prompts. There is no Linear issue and no queue change; the research note and the PR are the record.
3. **With a voice revision.** When the owner asks for both, do them in one branch (`revise/<lesson-slug>-voice`) and one PR. Follow both runbooks, keep a `## Voice revision` and a `## Prompt revision` section in the research note, and send one owner packet that covers both. Do not start a prompt revision from inside a voice revision without the owner's request.

## Read

- **Stage 12** of the creation runbook.
- The lesson module `content/lessons/<slug>.ts`: the prompt, the sections it draws on, and its `evidenceModuleIds`.
- The lesson's research note: the durable understanding, the learning blueprint and the claim ledger.

## Steps

1. **Draft** the new prompt under Stage 12: same teaching job, plausible wrong options that reveal real misconceptions, a `bestOptionId` for multiple choice, a hint, feedback for each wrong option, and an explanation.
2. **Check it against the lesson as it stands.** For every option, the best answer and every piece of feedback, name the section (or module) that supports it. If something needs a fact the lesson does not teach, rewrite the prompt; the lesson text changes only in a voice revision the owner asked for. Read each wrong option's feedback on its own and confirm it points back to the evidence without giving away the answer.
3. **Replace the prompt.** Give it a new, descriptive prompt ID and new option IDs, and never reuse a retired ID (retired IDs are marked in `content/published-prompt-fingerprints.json`). Replace the old prompt in the lesson's `promptIds`, in its `prompt` module (`promptId`) and in the prompts array, and delete the old prompt. Search `tests/` for the old prompt and option IDs and point each reference at the new ones.
4. **Record fingerprints:** `npm run content:fingerprints`. It adds the new prompt and marks the old one retired.
5. **Validate:** `npm run validate:content` and `npm run test:domain`. Never edit a test to hide an ID or behavior change. No migration and no lesson gates.
6. **Record it** in the research note under `## Prompt revision` (add a dated entry if the section exists): the old and new IDs, why the prompt changed, and the support map from step 2.
7. **Open one PR** and let CI run.
8. **Owner check** (the only touchpoint), below.
9. **Finish in the same PR.** After approval, the final commit adds the date, PR link and the owner's approval to the `## Prompt revision` entry. Merge when CI is green. Merging publishes the new prompt; there is no database step, post-merge check or follow-up PR.

## Owner check

Once the branch preview deploys, send the owner:

- the direct preview link to `/learn/<lesson-id>`, following the creation runbook's preview-link contract (a fresh visitor sees a locked lesson, so link through audit mode: `/audit?on&next=%2Flearn%2F<lesson-id>`);
- the old and new prompt side by side: question, options with their feedback, best answer, hint, explanation, required flag and minimum length;
- which section supports each option and the best answer;
- what learners who already started or finished the lesson will see:
  - finished, waiting and passed lessons stay as they are; for them the new question is just another check to try;
  - if the new prompt is required, a learner still working through the lesson, or one whose lesson was sent back, must complete it before sending;
  - parents see written questions only; on Review, a submission shows the written question as the learner saw it, and an old one is marked as changed.

If the owner asks for changes, revise and send the link again.
