# Chronos agent guide

Chronos is being rebuilt inside this repository around one calm learning shell, authored historical journeys, evidence-aware visuals, and meaningful Knowledge Cards.

## Required reading

Before changing product behavior, data models, or UI, read:

1. `docs/product/chronos-prd.md`
2. `docs/product/implementation-plan.md`
3. `docs/design/design-system.md`
4. The active Linear epic in the [Chronos rebuild project](https://linear.app/ashs-workshop/project/chronos-guided-history-learning-rebuild-0fe768438099)

For UI work, inspect the images in `docs/design/references/`. They express visual intent, hierarchy, and product personality. Rebuild them with real responsive components and accessible native text; do not embed screenshots or imitate generated text errors.

## Product invariants

- Complexity belongs in the knowledge model, not learner controls.
- Every journey uses the same Learn shell: journey rail/drawer plus scrolling lesson.
- World History is the default chronological spine; Story Arcs, Idea Trails, and Investigations are authored optional paths.
- Lessons use stable semantic sections, unobtrusive local progress, meaningful resume state, short understanding checks, and explicit completion.
- Related lessons and optional journeys never masquerade as progress-bearing lesson sections. Keep useful historical connections in the lesson where they teach; keep navigation visually distinct, non-disruptive, and subordinate to the current required action.
- Required core lessons normally include one to three explanatory prompts. Sincere attempt, not perfect accuracy, is the default completion requirement.
- Knowledge Cards are deterministic memory/reward objects. No XP economy, random packs, duplicates, currencies, rarity spectacle, combat stats, or punitive streaks.
- Reconstruction, evidence, interpretation, uncertainty, and later tradition must be explicitly distinguished.
- Generated art contains no baked-in educational paragraphs, titles, or UI chrome.
- Historical accuracy, source provenance, accessibility, progress integrity, migrations, and recovery are release requirements.

## Rebuild strategy

Keep this repository and its useful content/assets, but replace the old tactical timeline architecture. Preserve stable IDs only where content remains semantically equivalent. Use the Uruk lesson as the first complete vertical slice and migration template; it is not the only lesson being retained.

Do not expand the old monolithic `App.tsx`, XP/level system, rarity/stats model, index-based collectible references, or perfect-quiz completion gate.

## Engineering workflow

- PostgreSQL/Supabase is the durable learner-progress store. All schema changes are committed migrations; never make production-only dashboard changes.
- Supabase project: `Chronos`, ref `fghjnypxhnnutgsaqvvz`, region `ca-central-1`. Free is acceptable for development; upgrade before beta.
- Keep domain rules outside route handlers and UI components.
- Prefer typed module renderers over arbitrary HTML.
- Make one coherent, reviewable vertical outcome per branch/PR.
- Add or update tests proportional to risk, validate content/schema changes, and include a concise handoff note.
- Do not split the implementation inventory into many tiny issues automatically. Create child issues only for parallel ownership, a real blocker, or an independently reviewable deliverable.

## Starting a new agent thread

Use a prompt such as:

> Work on ASH-52 in `dev-vibe/chronos-learning`. Read `AGENTS.md` and the linked source documents first. Inspect the repository, propose the smallest coherent vertical outcome, implement it on a branch, validate it, and open a draft PR. Preserve unrelated existing work.
