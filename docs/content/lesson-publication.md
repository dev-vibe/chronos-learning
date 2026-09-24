# Lesson publication playbook

Status: canonical go-live path after the product owner has already approved the lesson.

This is a mechanical cutover, not a second research, design, or platform-discovery project. If the user says “publish it,” “take it through publication,” or equivalent, read this file and execute it. Do not restart Stages 0–15.

## Routine verification model

Carlin's standing preference is cheaper-model execution for suitable routine subtasks. Explicitly delegate collection of mechanical test/build/media/deployment results to Sol (`gpt-5.6-sol`), or another available suitable cheaper model if Sol is unavailable, with the necessary tools/access. An inherited main-model subagent is not a cheaper-model handoff. Record the requested model and available execution metadata; disclose unresolved routing uncertainty and use the human fallback rather than claiming a cheaper model ran. Batch related checks and request exact command outcomes, object checksums, deployment status and remaining gaps; review the report without repeating successful checks by default. Keep release decisions and substantive diagnosis with the main agent. This does not expand authorization for production mutations or require a new user-owned task.

The product owner performs the hosted lesson's visual and interactive check. Do not open the lesson in a browser, capture screenshots, or delegate that check to an AI agent during publication. Give the owner the exact hosted lesson URL and the short checklist in step 5, then record only what the owner reports. If suitable cheaper-model delegation for a mechanical check is unavailable, lacks access, fails or cannot satisfy it, ask Carlin to do that specific mechanical step with the exact command and result needed; explain the limitation and link [the standing preference](../../AGENTS.md#model-routing-for-routine-subtasks). Leave that check pending, continue independent work, and do not silently use the main model or claim verification. No extra platform discovery or repeated publication review is required to apply this rule.

## What publication actually is

The learner-facing lesson already exists. Publication does three things:

1. Tell the app the lesson is live (`status: "published"`).
2. Tell the database how completion works (one committed migration).
3. Make sure this lesson’s approved images are in Storage, then have the owner check the hosted lesson.

That is the whole job. CI on the PR is the full test/build suite. The product owner’s earlier approval is the editorial review.

The gray “Prototype review / Not learner content” notes are not lesson content. They are development-only media-intention annotations. They already hide after product-owner approval, and publishing flips the lesson to `published`, which hides them even in preview. `--apply-status` also unregisters the lesson from the active prototype-review registry so a published lesson cannot keep draft review metadata. Learner prose, prompts, and final images stay.

## Do not do these

Do not:

- re-read the PRD, design system, Linear epic, or companion authoring docs;
- read Vercel, Supabase, Postgres, or browser-automation skills;
- search changelogs, run advisors, or audit the database platform;
- repeat the lesson quality contract or launch an independent reviewer;
- run `npm run media:build` unless this lesson’s staged objects are actually missing;
- run `npm test`, `npm run typecheck`, or `npm run build` locally unless CI failed;
- merge `main` unless git reports a conflict;
- perform or delegate the hosted lesson's visual or interactive check, or capture a screenshot matrix;
- write a custom uploader, PowerShell sidecar, or new storage architecture;
- verify production after merge or open a follow-up PR just to record completion.

If a hosted command fails, fix that command. Do not invent a parallel pipeline.

## Prerequisites

Publication starts only when all of these are already true:

- product-owner prototype approval is recorded;
- Stage 15 implementation is done (final media, provenance, prompts, card/no-card);
- the release gate can pass on the current draft:

```text
npm run lesson:gate -- --lesson <lesson-id> --note <path> --gate release
```

If the gate fails, this is not a publication task. Return to implementation.

## Procedure

### 1. Generate the cutover files

```text
npm run lesson:prepare-publication -- --lesson <lesson-id> --note <path> --issue <ASH-n> --write --apply-status
```

Add `--equivalent-alias <legacy-id>` only when the product owner already approved completion-transfer for that alias. The default is navigation-only (`semantic_equivalence_approved = false`).

The command writes the migration and database test from the authored lesson. It flips `status` to `published` and unregisters the lesson from `content/prototype-reviews.ts`. That is what removes the draft-only “Prototype review / Not learner content” notes from the page. Keep the archived review file under `content/prototype-reviews/` for provenance; do not delete it. Do not hand-write SQL by copying a previous lesson.

### 2. Validate the cutover locally

```text
npm run validate:content
npm run test:domain
```

Do not run the full Vitest suite or a production build. GitHub CI does that on push.

### 3. Upload this lesson’s media only

Use the `--asset` list printed by the prepare command. Credentials come from the existing Chronos project env, not from a skill file.

```text
npm run media:publish -- --asset media.example.one --asset media.example.two
```

If staged files under `tmp/chronos-media/` are missing, rebuild **this lesson’s assets only if the build command supports `--asset`**; otherwise run `media:build` once because the staging directory was wiped, then publish. Never rebuild because a merge changed line endings or because the whole catalog “might be stale.”

Existing Storage objects are immutable. The publisher verifies checksums and does not overwrite.

### 4. Apply the committed migration

Apply the new migration to the Chronos development project. Do not create dashboard-only rows. Do not rewrite an already-applied migration; add a follow-up only if a real correction is required.

### 5. Push and hand off the hosted preview

Push the branch and update the PR with the preview link. Let CI run the full suite. After the branch preview is deployed, give the product owner a clickable direct link to `/learn/<lesson-id>` (with audit unlock parameters if needed). Ask the owner to check once and report whether:

- the lesson opens at the top;
- both required prompts accept a sincere attempt;
- explicit completion works, including the card or honest no-card ending;
- reopening the lesson starts at the top again;
- draft-only “Prototype review / Not learner content” notes are gone.

The product owner may use whichever viewport and theme they judge useful. Do not perform an agent browser check, infer a pass from HTTP status or deployment readiness, or claim the owner checked it until they report the result. Record any finding and fix it before merge; one owner pass is enough when no correction is needed.

### 6. Record completion in the lesson PR, then merge

After the owner reports a pass, make one final commit on the same branch: set the queue row to `Complete` and record the go-live in the research note (migration, media checksums, owner check, PR link). When CI is green on that commit, merge through the normal PR path and mark the Linear issue Done.

Merge is the last step. By the time the PR merges, the lesson is complete. Do not verify the production deployment, update records after merge, or open a separate closeout PR. The owner's own look at production is outside this process. Include the direct lesson link in the final response.

## What “done” means

The lesson is published when:

- authored `status` is `published`;
- the committed migration is applied;
- this lesson’s media objects verify remotely;
- the product owner reports that the hosted lesson check in step 5 passed;
- the queue row (`Complete`) and research note record the go-live in the lesson PR itself;
- CI is green and that PR is merged.

It is not done when an agent has re-derived the media pipeline, re-scored pedagogy, or produced a screenshot gallery.
