# Chronos lesson revision runbook

Status: the one process for revising an already-published lesson. It audits the whole lesson (the telling, each understanding prompt and the Knowledge Card) and improves whichever of them need it, following the voice and storytelling rules in the [lesson creation runbook](lesson-creation-runbook.md#voice-and-storytelling). A revision changes how the lesson is told and checked, not what it teaches. Read this file and the parts of the creation runbook named below; nothing else is required reading. (The file keeps its old name, `lesson-voice-revision-runbook.md`, because research notes link to it.)

## When to use it

Use this runbook for any request to revise a published lesson: “Revise the Akkad lesson”, “Redo the Akkad lesson”, “Revise the next old lesson”, “Improve the Akkad prompt”, “Refresh the Akkad card”. The owner does not need to say which parts to change; the audit in Step 1 decides. A request that names one part (“improve the X prompt”) does only that part.

Stop and tell the owner instead if the lesson needs a change to the essential question, durable understanding, central claims or their certainty, section order or teaching jobs, a prompt's teaching job, adding or removing a prompt, completion rules, the card's subject or adding or removing a card, the teaching job of an existing image, or journey position. Those are material revisions and follow the creation runbook. Do not fold one into a revision.

## Invocation

A request such as “Revise the Akkad lesson” or “Revise the next old lesson” is a complete instruction.

1. Fetch `dev-vibe/chronos-learning` and create a branch from the latest `main` named `revise/<lesson-slug>`.
2. Revise the lesson the owner names. For “the next one”, take the first lesson in `content/journeys/world-history.ts` order whose research note has no `## Voice revision` section.
3. One lesson per branch and PR, and one owner check covering everything the PR changes. There is no Linear issue and no queue change; the research note and the PR are the record.

## Read

- The creation runbook's **Chronos in brief**, **Non-negotiable product rules**, **Stage 7** (especially **Voice and storytelling**), the heading rules in **Stage 8**, the learner-facing labels in **Stage 9**, the card-art rule in **Stage 11**, **Stage 12** (prompts) and the review questions in **Stage 14B**.
- The lesson module `content/lessons/<slug>.ts` (and `<slug>-media.ts` if present), including its prompts and card.
- The lesson's research note, especially the claim ledger (`later-tradition` claims), the content triage's Enrichment, Deferred and Rejected items, the source ledger, the image lifecycle captions and the card facts. Colorful material cut from the first version usually lives there.

## Step 1 — Audit the lesson and choose the work

Add a `## Voice revision` section to the research note (the heading stays for every revision so “the next one” keeps working) and start it with a short audit of three parts.

**Telling.** For each section, write one line naming what reads flat: runs of short same-length sentences, hedging repeated in every sentence, moralizing asides, an announced question instead of an opening moment, a summary ending, a general sentence where a specific detail exists, or methods jargon. For the whole lesson, record the current story spine (or `none`), the current memorable moments (or `none`), and whether the opening and ending land.

**Prompts.** For each prompt, against Stage 12 and the story the lesson will tell: does it check its part of the durable understanding using the lesson's own evidence, or is it generic? Does every multiple-choice prompt have a `bestOptionId`, and does every wrong option's feedback hint without giving the answer away? Record one verdict per prompt:

- `keep`;
- `text` (explanation, feedback, hint or option order only, same ID: fix it in Step 3);
- `replace` (question, options, best answer or answer logic: follow the [prompt revision runbook](prompt-revision-runbook.md) in this PR).

**Card.** Does the card still match the revised lesson? Are its facts, reveal text and art (Stage 11: the lesson's most striking image of the subject) as good as the lesson now allows? Record `keep` or `refresh` and what would change.

Then do the work the audit calls for. If the telling is already strong, say so and skip to the parts that need work.

A request that names one part skips the audit of the others and records its work in that part's own section instead of `## Voice revision`: `## Prompt revision` (by the prompt revision runbook) or `## Card revision`, so the lesson still counts for “the next one”.

## Step 2 — Find the story material

Look in this order and stop when you have enough:

1. The research note (see **Read** above).
2. The lesson's existing central sources, close-read for specific details: object records, translated inscriptions, excavation reports, museum descriptions.
3. Targeted new research for one specific story, such as a legend, the story of a find, or a short quotable line. Do not reopen broad research or the challenge audit.

Look for pictures as well as words. When a memorable moment centers on an object, place or scene the learner would want to see, find an image for it (see **Step 3 — Add images**).

Choose a **story spine** (the person, object, place or puzzle the lesson follows from start to end, where the evidence allows) and **two to four memorable moments** (true, specific details or stories a 13-year-old would retell). Legends and later retellings are welcome when labeled as what they are.

Every new fact the learner will read needs a claim with kind, certainty and a registered source, in both the lesson module and the note's claim ledger. Close-review anything the explanation leans on and record a precise locator. A decorative detail is still a claim. If a detail cannot be supported, leave it out and list it in the handoff.

## Step 3 — Rewrite

**What may change:** prose `body` text; `knowledge` body and item text; evidence and scene captions and hotspot text; prompt explanation, option feedback and hint text, and option order; journey transition and bridge text; the card's reveal text, facts (accurate and sourced) and art; and new images, each with the module that carries it (see **Add images** below).

**What stays:**

- every existing ID: lesson, section, module, claim, source, prompt, option, card and media (new claims, sources, modules and media get new IDs; a prompt marked `replace` gets its new ID from the prompt revision runbook);
- section order and each section's teaching job;
- every prompt's question, options, best answer, required flag and minimum length, which is what its ID stands for ([policy](../architecture/prompt-changes.md)), unless the audit marked it `replace`;
- the card's subject, category, class and `unlockLessonId`;
- existing media assets and their teaching jobs, and completion behavior.

**Add images** where they help the story. Adding an image is expected in a revision, not a material change. For each one:

- choose the method and source under the creation runbook's Stage 10 (licensed originals first; a reconstruction is labelled as one), and clear the rights under [media publishing](../architecture/media-publishing.md);
- carry it in a new `evidence`, `scene` or `historical-map` module inside the section whose story it serves, placed where the learner needs to see it; do not add a section;
- give it alt text, a depiction label, a rights label and sources, and add its claims like any other new fact;
- add a Required image lifecycle record for it to the research note;
- run `media:add`, `media:build` and `media:verify`, and commit the catalog, manifest and optimized rollback copy.

Replacing or removing an existing image is still a material revision; report the problem instead.

**Prompts** marked `text` change here under the same ID. For each prompt marked `replace`, follow steps 1–6 of the [prompt revision runbook](prompt-revision-runbook.md) against the revised lesson, in this branch.

**The card**, if marked `refresh`: rewrite the reveal text in the lesson's voice, update facts so each is true, sourced and worth remembering (three to five), and choose the art under Stage 11. The art may be any image the lesson uses, including one added above; keep `depictionLabel` true to it. Learners who already own the card see the new version; nothing is taken away.

**Headings** stay unless they break the Stage 8 heading rules; in that case, rename in plain words and keep the section ID.

**The “What we can know” box** is optional. Keep it where four parallel items are the clearest form. Otherwise, state the limit once in prose. If you remove the module, search `tests/` for its module ID and never remove a prompt module.

**Length** has no fixed limit; a flat lesson may need to grow and a padded one to shrink. The story replaces flat text; it does not pile on top of it. Keep a sentence only if it carries the story or the teaching, and keep the lesson one focused sitting rather than a chapter (Stage 7 pacing heuristics; Stage 14B Cognitive load). Record the before and after word counts in the research note so the owner can see the change.

**Voice:** apply the Stage 7 story tools and voice rules. Aim for sentence variety and concrete words, not shorter sentences everywhere. Keep each module's `claimIds` and `sourceIds` covering what the module now says, and add new claim IDs where new facts appear.

## Step 4 — Check

1. Re-run the Stage 14B review questions on the changed sections, focusing on Story, Evidence reasoning, Proportionality, Cognitive load and Headings, plus Visual value and Rights, media and accessibility for any image you added. Re-read every prompt against the revised text: each option, best answer and piece of feedback must still be supported by the lesson. Record the findings in the `## Voice revision` section. Fix anything `blocking`.
2. Run `npm run validate:content` and `npm run test:domain`. If a test pins old text that you changed on purpose, update that expectation in the same PR. Never edit a test to hide an ID or behavior change.
3. Do not run lesson gates (they apply to drafts) or write a migration (prose and media are not stored in the database). CI runs the full suite and build.
4. If you added images, publish each approved asset to Storage and verify it (`npm run media:publish -- --asset <id>`, then `npm run media:verify:remote -- --asset <id>`) before merge. These need the trusted storage credentials; if the session does not have them, give the owner the two commands in the handoff. Until the objects are published, the app shows the committed rollback copy.

## Step 5 — Owner review (the only touchpoint)

Push, open the PR, and let CI run. Once the branch preview deploys, send the owner:

- the direct link to the revised lesson preview, following the creation runbook's preview-link contract (a fresh visitor sees a locked lesson, so link through audit mode: `/audit?on&next=%2Flearn%2F<lesson-id>`);
- the story spine and the memorable moments, one line each;
- the old and new opening paragraph, side by side;
- any claims or sources you added, one line each;
- any images you added, with their source, license and where they appear;
- anything you left out because the evidence was too thin;
- the audit verdict for each prompt and the card, one line each;
- for each replaced prompt, the prompt revision runbook's owner-check items;
- if the card changed, its old and new art, facts and reveal text.

The owner reads the lesson on the preview. If they ask for changes, revise and send the link again.

## Step 6 — Finish in the same PR

After the owner approves, make the PR's final commit: complete the `## Voice revision` section with the date, PR link, story spine, memorable moments, added claims and images, prompt and card changes, and the owner's approval. Merge when CI is green. Merging puts the revision live. There is no post-merge check and no follow-up PR.
