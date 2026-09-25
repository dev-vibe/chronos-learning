# Chronos agent guide

Chronos is being rebuilt inside this repository around one calm learning shell, authored historical journeys, evidence-aware visuals, and meaningful Knowledge Cards.

## Required reading

Before changing product behavior, data models, or UI (not lesson production), read:

1. `docs/product/chronos-prd.md`
2. `docs/product/implementation-plan.md`
3. `docs/design/design-system.md`
4. The active Linear epic in the [Chronos rebuild project](https://linear.app/ashs-workshop/project/chronos-guided-history-learning-rebuild-0fe768438099)

For lesson creation, publication, revision or correction, read only `docs/content/lesson-creation-runbook.md` and `docs/content/lesson-production-queue.md`. The runbook is self-contained; the required reading above does not apply to lesson work.

A user request equivalent to “Let's create the next Chronos lesson” is complete. Do not ask the user to supply a topic or repeat the workflow. Run the boot sequence in the lesson creation runbook, continue an active queued lesson or select the first eligible Ready lesson, and proceed through its built-in research/editorial approval gate.

For UI work, inspect the images in `docs/design/references/`. They express visual intent, hierarchy, and product personality. Rebuild them with real responsive components and accessible native text; do not embed screenshots or imitate generated text errors.

For generated historical maps, follow `docs/content/historical-map-production.md`. A real authoritative map must anchor the geography; generated output is never the geographic source.

## Product invariants

- Complexity belongs in the knowledge model, not learner controls.
- Every journey uses the same Learn shell: journey rail/drawer plus scrolling lesson.
- World History is the default chronological spine; Story Arcs, Idea Trails, and Investigations are authored optional paths.
- Lessons use stable semantic sections, unobtrusive explored-section progress, short understanding checks, and explicit completion. Reopening a lesson always starts at the top; do not add within-lesson resume banners, buttons, automatic scrolling, or scroll-position restoration.
- Section headings name the subject or teaching job in ordinary words. They are not metaphors, riddles, or punchlines.
- Related lessons and optional journeys never masquerade as progress-bearing lesson sections. Keep useful historical connections in the lesson where they teach; keep navigation visually distinct, non-disruptive, and subordinate to the current required action.
- Required core lessons normally include one to three explanatory prompts. Sincere attempt, not perfect accuracy, is the default completion requirement. Finishing a lesson sends the learner's answers to their parent, who passes it or sends it back with a note. Kids either have their own sign-in linked by code (recommended) or a profile on the parent's sign-in, switched from an always-visible control; parent view can be PIN-locked.
- Knowledge Cards are deterministic memory/reward objects, awarded when a parent passes the lesson. No XP economy, random packs, duplicates, currencies, rarity spectacle, combat stats, or punitive streaks.
- Reconstruction, evidence, interpretation, uncertainty, and later tradition must be explicitly distinguished.
- Generated art contains no baked-in educational paragraphs, titles, or UI chrome. Historical maps may use only the short source-verified labels or spatial annotations explicitly listed in their reviewed map brief.
- Historical accuracy, source provenance, accessibility, progress integrity, migrations, and recovery are release requirements.

## Rebuild strategy

Keep this repository and its useful content/assets, but replace the old tactical timeline architecture. Preserve stable IDs only where content remains semantically equivalent. Use the Uruk lesson as the first complete vertical slice and migration template; it is not the only lesson being retained.

Do not expand the old monolithic `App.tsx`, XP/level system, rarity/stats model, index-based collectible references, or perfect-quiz completion gate.

## Engineering workflow

- PostgreSQL/Supabase is the durable learner-progress store. All schema changes are committed migrations; never make production-only dashboard changes.
- Lessons, journeys, prompts and cards are defined only in the repository. The database holds learner state, parent links and reviews, never lesson configuration, so publishing, unpublishing or changing a lesson needs no migration.
- Supabase project: `Chronos`, ref `fghjnypxhnnutgsaqvvz`, region `ca-central-1`. Free is acceptable for development; upgrade before beta.
- Keep domain rules outside route handlers and UI components.
- Prefer typed module renderers over arbitrary HTML.
- Make one coherent, reviewable vertical outcome per branch/PR.
- Add or update tests proportional to risk, validate content/schema changes, and include a concise handoff note.
- Do not split the implementation inventory into many tiny issues automatically. Create child issues only for parallel ownership, a real blocker, or an independently reviewable deliverable.

## Model routing for routine subtasks

Carlin's standing preference is to delegate suitable routine work to a cheaper model instead of spending the main reasoning model on it. This explicitly authorizes bounded subagents, not new user-owned tasks. It does not apply to lesson production, which follows the runbook's owner touchpoints instead.

- Use Sol (`gpt-5.6-sol`), or another available suitable cheaper model if Sol is unavailable, for routine source discovery, fetching passages and citation metadata, live-lesson/browser smoke checks, link or asset checks, and collecting test/build/deployment results. Batch related checks into one bounded assignment with exact inputs and acceptance criteria.
- Select the model explicitly using the delegation tool. An agent that merely inherits the main model does not satisfy this preference. Only use a model/tool combination actually available in the session; naming Sol or Grok in a prompt does not route execution to it. Do not install or configure a new provider implicitly.
- Record the requested model and any execution metadata the tool actually exposes. Do not treat a model's self-description as proof of routing or price. If routing is rejected or reports conflict and cannot be resolved from available execution metadata, disclose that uncertainty and use the human fallback for remaining verification; do not claim cheaper-model execution succeeded.
- On local Codex, when session rollout files are accessible, match the child's `session_meta` parent/thread or agent path and inspect its `turn_context.payload.model`. This resolved a misleading “Astra” self-description on September 13, 2026: the child execution record identified `gpt-5.6-sol`. Inspect only the relevant metadata; do not copy private session transcripts into the repository. This is an observed local diagnostic, not a guaranteed public API. Current [official subagent guidance](https://learn.chatgpt.com/docs/agent-configuration/subagents) documents explicit spawn overrides and `[agents].default_subagent_model`; custom-agent file settings can override these. Do not change account-wide defaults merely to carry out a bounded assignment.
- Keep historical synthesis, conflicting-evidence judgments, lesson design, substantive editorial decisions, architecture, and final historical/visual judgment with the main model and accountable owner. A routine search assignment gathers evidence; it does not decide what is historically true.
- Require the delegate to return concrete evidence: exact URLs/passages, inspected route and deployment, observed behavior, command results, and failures or access gaps. Identify the model used. The main agent evaluates that report without repeating a successful routine check by default; genuine unresolved judgment remains with the main agent.
- If suitable cheaper-model delegation is unavailable, lacks the required browser/tools/access, fails, or cannot satisfy the check, ask Carlin to perform that step. Give the exact link or command, short checklist, and result needed; explain the delegation limitation and this standing preference. Keep the step pending and continue independent work. Do not silently perform it on the main model, mark it passed, or treat elapsed time as approval. Carlin may explicitly authorize a main-model exception.
- This is a routing preference, not a new editorial approval gate or permission to skip required validation. It does not require a separate agent for each tool call: minimal orchestration, reading the task's own instructions, and reviewing returned evidence stay with the main agent. Do not invent parallel work simply to create a delegate.

## Starting a new agent thread

For lesson production, the preferred complete prompt is:

> Let's create the next Chronos lesson.

The lesson runbook and production queue supply all operational detail.

For other work, use a prompt such as:

> Work on ASH-52 in `dev-vibe/chronos-learning`. Read `AGENTS.md` and the linked source documents first. Inspect the repository, propose the smallest coherent vertical outcome, implement it on a branch, validate it, and open a draft PR. Preserve unrelated existing work.
