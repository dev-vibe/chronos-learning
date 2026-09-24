# Chronos lesson voice revision runbook

Status: the process for rewriting an already-published lesson so it reads as a true story, following the voice and storytelling rules in the [lesson creation runbook](lesson-creation-runbook.md#voice-and-storytelling). A voice revision changes how the lesson is told, not what it teaches. Read this file and the parts of the creation runbook named below; nothing else is required reading.

## When to use it

Use this runbook when the lesson is published and the goal is voice, story, flow or memorable detail.

Do not use it for a change to the essential question, durable understanding, central claims or their certainty, section order or teaching jobs, required prompts (IDs, options or answer logic), completion rules, the Knowledge Card, media teaching jobs, or journey position. Those are material revisions and follow the creation runbook. If you discover mid-revision that one of them is needed, stop and tell the owner. Do not fold it into a voice revision.

## Invocation

A request such as “Redo the Akkad lesson” or “Revise the next old lesson” is a complete instruction.

1. Fetch `dev-vibe/chronos-learning` and create a branch from the latest `main` named `revise/<lesson-slug>-voice`.
2. Revise the lesson the owner names. For “the next one”, take the first lesson in `content/journeys/world-history.ts` order whose research note has no `## Voice revision` section.
3. One lesson per branch and PR. There is no Linear issue and no queue change; the research note and the PR are the record.

## Read

- The creation runbook's **Chronos in brief**, **Non-negotiable product rules**, **Stage 7** (especially **Voice and storytelling**), the heading rules in **Stage 8**, the learner-facing labels in **Stage 9**, and the review questions in **Stage 14B**.
- The lesson module `content/lessons/<slug>.ts` (and `<slug>-media.ts` if present).
- The lesson's research note, especially the claim ledger (`later-tradition` claims), the content triage's Enrichment, Deferred and Rejected items, the source ledger, the image lifecycle captions and the card facts. Colorful material cut from the first version usually lives there.

## Step 1 — Audit the voice

Add a `## Voice revision` section to the research note and start it with a short audit.

For each section, write one line naming what reads flat: runs of short same-length sentences, hedging repeated in every sentence, moralizing asides, an announced question instead of an opening moment, a summary ending, a general sentence where a specific detail exists, or methods jargon.

For the whole lesson, record the current story spine (or `none`), the current memorable moments (or `none`), and whether the opening and ending land.

## Step 2 — Find the story material

Look in this order and stop when you have enough:

1. The research note (see **Read** above).
2. The lesson's existing central sources, close-read for specific details: object records, translated inscriptions, excavation reports, museum descriptions.
3. Targeted new research for one specific story, such as a legend, the story of a find, or a short quotable line. Do not reopen broad research or the challenge audit.

Choose a **story spine** (the person, object, place or puzzle the lesson follows from start to end, where the evidence allows) and **two to four memorable moments** (true, specific details or stories a 13-year-old would retell). Legends and later retellings are welcome when labeled as what they are.

Every new fact the learner will read needs a claim with kind, certainty and a registered source, in both the lesson module and the note's claim ledger. Close-review anything the explanation leans on and record a precise locator. A decorative detail is still a claim. If a detail cannot be supported, leave it out and list it in the handoff.

## Step 3 — Rewrite

**What may change:** prose `body` text; `knowledge` body and item text; evidence and scene captions and hotspot text; prompt feedback and explanation text; journey transition and bridge text; card reveal text and card facts, if accurate and sourced.

**What stays:**

- every ID: lesson, section, module, claim, source, prompt, option, card and media;
- section order and each section's teaching job;
- required prompts, their options and their answer logic;
- media assets and completion behavior.

**Headings** stay unless they break the Stage 8 heading rules; in that case, rename in plain words and keep the section ID.

**The “What we can know” box** is optional. Keep it where four parallel items are the clearest form. Otherwise, state the limit once in prose. If you remove the module, search `tests/` for its module ID and never remove a prompt module.

**Length** has no fixed limit; a flat lesson may need to grow and a padded one to shrink. The story replaces flat text; it does not pile on top of it. Keep a sentence only if it carries the story or the teaching, and keep the lesson one focused sitting rather than a chapter (Stage 7 pacing heuristics; Stage 14B Cognitive load). Record the before and after word counts in the research note so the owner can see the change.

**Voice:** apply the Stage 7 story tools and voice rules. Aim for sentence variety and concrete words, not shorter sentences everywhere. Keep each module's `claimIds` and `sourceIds` covering what the module now says, and add new claim IDs where new facts appear.

## Step 4 — Check

1. Re-run the Stage 14B review questions on the changed sections, focusing on Story, Evidence reasoning, Proportionality, Cognitive load and Headings. Record the findings in the `## Voice revision` section. Fix anything `blocking`.
2. Run `npm run validate:content` and `npm run test:domain`. If a test pins old text that you changed on purpose, update that expectation in the same PR. Never edit a test to hide an ID or behavior change.
3. Do not run lesson gates (they apply to drafts), write a migration (prose is not stored in the database), or upload media (no media changes). CI runs the full suite and build.

## Step 5 — Owner review (the only touchpoint)

Push, open the PR, and let CI run. Once the branch preview deploys, send the owner:

- the direct link to the revised lesson preview, following the creation runbook's preview-link contract;
- the story spine and the memorable moments, one line each;
- the old and new opening paragraph, side by side;
- any claims or sources you added, one line each;
- anything you left out because the evidence was too thin.

The owner reads the lesson on the preview. If they ask for changes, revise and send the link again.

## Step 6 — Finish in the same PR

After the owner approves, make the PR's final commit: complete the `## Voice revision` section with the date, PR link, story spine, memorable moments, added claims and the owner's approval. Merge when CI is green. Merging puts the revision live. There is no post-merge check and no follow-up PR.
