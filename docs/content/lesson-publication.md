# Lesson publication playbook

Status: canonical go-live path after the product owner has already approved the lesson.

This is a mechanical cutover, not a second research, design, or platform-discovery project. If the user says “publish it,” “take it through publication,” or equivalent, read this file and execute it. Do not restart Stages 0–15.

## What publication actually is

The learner-facing lesson already exists. Publication does three things:

1. Tell the app the lesson is live (`status: "published"`).
2. Tell the database how completion works (one committed migration).
3. Make sure this lesson’s approved images are in Storage, then smoke the hosted preview.

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
- capture a desktop/mobile/light/dark screenshot matrix of every image;
- write a custom uploader, PowerShell sidecar, or new storage architecture.

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

### 5. Smoke the hosted preview once

Open the current branch preview at `/learn/<lesson-id>` (audit unlock if needed). Confirm:

- the lesson opens at the top;
- both required prompts accept a sincere attempt;
- explicit completion works, including the card or honest no-card ending;
- reopening the lesson starts at the top again;
- draft-only “Prototype review / Not learner content” notes are gone.

One pass is enough. Do not recapture every viewport and theme.

### 6. Push and hand off

Push the branch. Update the PR with the preview link. Set the queue row to `Review` until merge, then `Complete` after the production deployment is live. Include the direct lesson preview link in the final response.

Merge through the normal PR path after review. Do not treat merge itself as a research step.

## What “done” means

The lesson is published when:

- authored `status` is `published`;
- the committed migration is applied;
- this lesson’s media objects verify remotely;
- the hosted preview completes once;
- CI is green;
- the queue/research note record the go-live.

It is not done when an agent has re-derived the media pipeline, re-scored pedagogy, or produced a screenshot gallery.
