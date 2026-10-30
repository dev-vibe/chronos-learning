# Chronos lesson creation runbook

Status: the single canonical process for creating, publishing, materially revising and correcting a Chronos `Lesson`. Read this file and the [production queue](lesson-production-queue.md); nothing else is required reading. Start the research note by copying the [authoring template](lesson-production/authoring-templates.md). Open a [specialist runbook](#specialist-runbooks) only when its trigger applies.

A lesson may be small or ambitious, but no step may be skipped silently. If a step does not apply, record why in the research note. When schedule pressure threatens the standard, narrow the lesson or keep it draft; do not lower the standard.

## Chronos in brief

- **What it is:** a history-learning app. Underneath, a knowledge graph; in use, a guided journey; over time, a personal illustrated atlas. The World History Spine teaches chronological orientation; optional Story Arcs, Idea Trails and Investigations go deeper. A lesson exists once and can appear in several journeys with journey-specific framing; completing it anywhere completes it everywhere.
- **Who it serves:** learners aged 11–15, mainly homeschooling. Draft for a roughly 12–13-year-old reader; adults should still find it credible. Parents follow progress from their own account, outside the learner shell.
- **What a lesson must achieve:** the learner forms an accurate, memorable, evidence-aware mental model, can tell someone in their own words what happened and why, and knows the next action. Shipping a page is not the goal.
- **Questions:** every question a learner reads sounds like a curious person asking, not an exam or a research paper. If a 12-year-old cannot tell what a question wants after one read, the question is wrong, not the learner.
- **Tone:** warm, intelligent, calm and spacious, like an editorial history publication or a museum companion. Lessons are told as true stories: real people, places and objects, with stakes and surprises, told straight. Not a game, a terminal or a textbook dump. No mascots, loot, XP, streaks, timers or score spectacle.
- **Shell:** every lesson renders in the same Learn shell: a journey rail plus one scrolling lesson of five to eight semantic sections, short understanding prompts and an explicit completion action. Reopening always starts at the top.
- **Knowledge Cards:** deterministic memory anchors earned when a parent passes the learner's finished lesson. Never random, duplicated, ranked by rarity, or mandatory.
- **Evidence honesty:** observation, interpretation, reconstruction, uncertainty and later tradition are always distinguished. Generated imagery is never presented as evidence.
- **Where content lives:** the repository is canonical. Lesson modules live in `content/lessons/`, are registered in `content/chronos.ts` and are ordered in `content/journeys/`. The database holds only learner state, parent links and reviews, never lesson configuration.
- **Who decides:** Carlin is the product owner and the only approver. AI may research, draft and validate. It may not be the sole historical, rights or publication reviewer, and it never approves on the owner's behalf.

## Invocation contract: “Create the next lesson”

A request equivalent to “Let's create the next Chronos lesson” is a complete instruction. Do not ask for a topic or for the workflow to be restated.

1. Fetch `dev-vibe/chronos-learning` and read this runbook and the [production queue](lesson-production-queue.md) from the latest `main`. If either is missing, report it instead of reconstructing the workflow from chat.
2. If a queue row is `Active`, continue that lesson on its existing issue, branch and PR. “Next” never abandons unfinished work.
3. Otherwise select the lowest production-order `Ready` row whose production dependencies are satisfied. Never infer priority from array order, tags or interest. Curriculum prerequisites still govern learner order; implementation order never lets learners skip the World Spine sequence.
4. If nothing is eligible, summarize the queue and ask for the smallest necessary curriculum decision. Do not invent, reorder or promote rows.
5. Look at existing lessons, journeys, cards and research notes only as far as the selected lesson needs: neighbors, possible reuse and ID conventions.
6. Use the row's Linear issue (create one only if missing). Create the lesson branch from latest `main` with the issue key in its name so Linear follows the branch and PR on its own. Do not update Linear by hand.
7. In the branch's first commit, set the row to `Active`.
8. Run Stages 0–3B and stop at owner touchpoint 1.
9. After the owner responds, run Stages 4–14A, the Stage 14C kid read and Stage 14B, and stop at owner touchpoint 2.
10. After approval, run Stages 15–18 without further prompting. Stop only at owner touchpoint 3.
11. In the PR's final commit, set the row to `Complete`. If fewer than three reviewed `Ready` candidates remain, say so in the handoff without inventing entries.

Ask an early question only when a missing decision materially changes lesson identity, curriculum order, audience or scope and cannot be resolved from the queue, repository or existing issue.

### Owner touchpoints

The owner is involved exactly three times. Everything between them is the agent's job.

| # | When | The owner receives | What unblocks the next step |
| --- | --- | --- | --- |
| 1 | End of Stage 3B | A one-screen research decision card, with the analytical packet linked | The owner's `yes / change / no` response |
| 2 | End of Stage 14B | The prototype link and only the decisions that need the owner | Explicit approval. This also authorizes final media and publication; do not ask again whether to publish. |
| 3 | Stage 18, after the publication cutover | The hosted preview link and a five-item checklist | The owner reports a pass |

After touchpoint 3, record `Complete` in the PR and merge. Merging ends the process.

### Preview-link handoff contract

Every learner-prototype, implementation, review, and correction handoff must include a clickable Markdown link directly to the current lesson preview in the final user-facing response. Repeat the link every time, including after a one-line copy change or when the URL has not changed. Do not rely on a link in earlier commentary, a previous turn, a PR, or an editorial record. A PR link, source-file link, bare route, or app homepage does not replace the lesson preview.

Use the actual branch/deployment URL and exact lesson route, retaining any required preview/audit query parameters. Prefer the current hosted branch preview; identify it as a preview rather than production. If deployment is pending or access requires sign-in, include the known link with that caveat and do not claim the latest content is verified there. If no hosted preview exists, link a running local preview and state that it is local; if neither is available, explain the blocker rather than inventing a URL. Before a learner prototype exists, link the actual research packet being presented instead.

Before sending the final response, check: **Can the user open the lesson being discussed from this message alone?**

## Operational path

**Brief → research/material decisions → learning prototype → review → final assets → publication.** Stage numbers below remain stable for existing notes and issue links.

| Step | Stages | Reviewable output / exit |
| --- | --- | --- |
| Brief | 0–2 | Stable identity, audience, curriculum position, essential question, scope, non-goals and research questions. |
| Research/material decisions | 3–7 | Proportional source and challenge review; owner touchpoint 1 before claim selection; claim ledger, content triage, cumulative blueprint, and the kid's question, kid's answer and draft checks (6A). |
| Learning prototype | 8–14A | Complete draft in the shared Learn shell with real prompts and media intentions; no publication or final assets. |
| Review | 14C, 14B | A fresh reader tries the lesson and its questions cold (14C); one quality check by the author; owner touchpoint 2 on the actual prototype. |
| Final assets | 15–16 | Refine the approved draft and produce final media; implementation and release gates. |
| Publication | 18 | Mechanical cutover, owner touchpoint 3, `Complete` in the PR, merge. |

The single research note owns the source/claim evidence and decisions, and the authoring template defines its shape. Do not maintain parallel checklists. New records use `Production record version: 2`; mechanical lesson gates check cumulative fields and registered central claim/source references. Legacy approved and pending records keep their recorded gates.

### Research-direction rollout and future routine path

**Current mode: owner checkpoint required.** Stage 3B remains active for every new lesson and any pending lesson gate, including paused work. No automation, template version, source review, or proxy may count as the owner's response.

A possible future routine path would allow work within an explicitly approved brief (bounded question, chronology, claim boundaries, media jobs and escalation triggers). It would retain discovery, close central-source review, challenge screening, prototype review and publication approval, and return to the owner for consequential evidence, scope, depiction or uncertainty changes. **That path is inactive.** Enabling it requires an explicit owner decision and a versioned policy change; it cannot grandfather or bypass pending gates.

## Specialist runbooks

Open these only when triggered. They own their details; this runbook decides when they are needed.

- Historical maps: [`historical-map-production.md`](historical-map-production.md)
- Image research, rights, provenance or generation: [`media-provenance-research-and-generation.md`](../prompts/media-provenance-research-and-generation.md)
- Asset ingestion, responsive derivatives, publishing and rollback: [`media-publishing.md`](../architecture/media-publishing.md)
- A new reusable lesson module or other platform change is not lesson work. Handle it separately under `AGENTS.md`.

## Changing a published lesson

- **Revision:** any request to revise, redo or improve a published lesson, or one of its prompts or its card, follows the [lesson revision runbook](lesson-voice-revision-runbook.md). Its audit decides whether the telling, each prompt and the card need work, and it does them in one PR with one owner check. A prompt whose question, options, best answer or answer logic changes gets a new ID through the [prompt revision runbook](prompt-revision-runbook.md), which the revision runbook calls.
- **Material revision:** a change to the essential question, durable understanding, central claims or their certainty, section order or teaching jobs, a prompt's teaching job, adding or removing a prompt, completion rules, the card's subject or adding or removing a card, the teaching job of an existing image, or journey position. Re-enter the earliest affected stage in the lesson's research note.
- **Correction** (an error or harm in the published lesson): [Stage 18's correction path](#corrections-after-release).

## Non-negotiable product rules

- Repository-authored content is canonical. The database holds learner progress, parent links and reviews, never lesson, prompt or card configuration.
- One lesson has one stable identity even when reused in multiple journeys. Journey-specific framing belongs to `JourneyEntry`.
- Lessons normally contain five to eight stable semantic sections. Use fewer or more only when the learning sequence genuinely requires it and document the exception.
- Required lessons normally contain one to three required understanding prompts, usually two.
- Completion requires the best-supported answer on each required multiple-choice check (learners retry until they find it) and a sincere written attempt, and only occurs through the explicit completion action. Finishing sends the learner's written answers to a linked parent; the parent's pass awards the lesson's cards.
- Every lesson opens at the top. Explored-section state may inform progress UI but must not trigger a resume banner, automatic scrolling, or viewport restoration.
- Related lessons and optional journeys are navigation, not instructional sections or completion requirements.
- A reconstruction is never presented as direct evidence. Uncertainty is never hidden merely to make prose cleaner.
- Knowledge Cards are deterministic memory anchors, not loot. A lesson may have no card if no honest, useful memory object exists.
- Every lesson gets an explicit visual-interest pass: look for a compelling, historically responsible way to show evidence, place, change, comparison, or a scene that helps the learner enter the subject. Media is selected because it teaches. A lesson has no image, map, audio, or video quota; record why text is clearer if no meaningful visual survives the pass.
- Select media methods by teaching purpose and fidelity using Stage 10. Licensed originals, native/vector and raster factual visuals, and generated reconstruction have distinct appropriate roles.
- Never let visual polish alter reviewed geometry, measurements, labels, relationships, subject details, or uncertainty. Generation is not required for stylistic consistency.
- Each section has one learner-facing title (`heading`). The heading names the subject or teaching job in ordinary words. It orients; it is not a joke, metaphor, riddle, or magazine punchline. Interest comes from the history, not from the title.
- Do not stack a second attention-grabbing title, slogan, or paraphrase immediately under the heading.
- `purpose` is authoring metadata for storyboards, agents, and review. It is not learner-facing copy and must not read like a second headline.
- Module `title` / `eyebrow` appear only when they add a distinct teaching job (for example, an evidence close-read cue or a place label). If a module is the section’s sole content block, prefer the section heading alone and keep the module title short, literal, or empty of slogan energy.
- Claim IDs, section IDs, and durable-understanding sentences follow the same voice. Do not encode a heading metaphor into the knowledge model.

## The authoring record

Create one lesson research/editorial note under `docs/research/` before writing production content. Keep the following artifacts in that note as the work advances:

1. node proposal;
2. research questions;
3. source ledger;
4. recent-challenge audit, coverage statement, research packet, and product-owner response;
5. claim ledger;
6. content triage;
7. learning blueprint;
8. section and component storyboard;
9. media and Knowledge Card plan;
10. age/editorial pass notes;
11. the kid's question, kid's answer and draft checks (Stage 6A);
12. the kid read reports and fixes (Stage 14C);
13. review decisions, open questions, and publication sign-off.

Do not rely on chat history, browser tabs, or an agent’s memory as the editorial record.

# End-to-end workflow

# Phase 1 — Select and bound

## Stage 0 — Establish the work boundary

Before research:

1. Confirm the parent journey, chapter, canonical learner position, curriculum prerequisites, production order, production dependencies, neighboring entries, and whether the lesson is required or optional. Do not confuse the operational production queue with learner-facing chronology.
2. Confirm whether a canonical lesson already covers the subject. Prefer reuse with new `JourneyEntry` framing over duplication.
3. Assign a stable ID using the existing convention, for example `lesson.writing.early-systems`.
4. Record any legacy aliases only after deciding that the old and new lesson are semantically equivalent.
5. Keep the lesson `draft` and non-completable until every publication gate passes.
6. Identify the accountable human product/editorial reviewer.
7. State what this increment will not build. Do not hide a platform redesign, new universal component system, or broad migration inside a lesson PR.

Output: a one-paragraph work boundary plus owner, issue, branch, lesson ID, journey position, and non-goals.

## Stage 1 — Write the node proposal

Answer these before collecting facts:

- Why does this lesson deserve to exist as its own node?
- What historical change, problem, object, person, place, event, or question organizes it?
- What should a learner understand afterward that they would not understand from adjacent lessons?
- Why is it placed here in this journey?
- What knowledge is prerequisite?
- What later lesson will rely on it?
- What common misconception, myth, or oversimplification should it prevent?
- Does the proposed scope accidentally combine two lessons?

Write the following as a provisional research target. The essential question and durable understanding do not become the lesson's settled model until the Stage 3B research-direction checkpoint has been considered:

- **Essential question:** one genuine historical question, not a topic label, that a curious 12-year-old could ask in their own words (Stage 6A writes their version).
- **Durable understanding:** one sentence the learner should remember months later.
- **Three to five supporting understandings:** the minimum conceptual structure.
- **Evidence encounter:** the object, source, map, comparison, or dataset through which the learner will reason.
- **Scope boundary:** explicit dates, places, actors, and stopping point.
- **Non-goals:** interesting material that belongs elsewhere.

Reject or split the proposal when it is merely “everything about Ancient Egypt,” depends on a list of unrelated facts, repeats another node, or cannot name a coherent learner outcome.

### Historical significance and proportion

For a required World History lesson, explain why its subject belongs in the chronological story: what happened, what people accomplished or struggled to do, how the society worked, and what changed. Write this historical explanation before choosing a source exercise. A narrow object or dispute can carry the story only if it opens that larger understanding.

Evidence awareness supports the historical explanation. Repeated reminders that a source cannot prove everything do not constitute a lesson about a ruler, city or civilization. Do not organize a core lesson around a ruler's possible hypocrisy, present-day moral verdicts, or uncertainty about one administrative outcome unless that question is itself historically consequential and explicitly approved as the focus. Explain achievements, institutions, coercion and social differences in their historical setting, with emphasis proportional to their role in the subject.

At Stage 3B, include a plain sentence explaining why the subject matters historically. At Stage 14B, check what a learner could tell someone about the subject after reading. If the retelling consists mainly of cautions about evidence while omitting the defining development or achievement, mark the draft **blocking** and rewrite its argument before handoff.

# Phase 2 — Research and model

## Stage 2 — Plan the research

Turn the essential question into a research plan. Include:

- chronology and periodization;
- geography and changing boundaries/environment;
- material evidence and primary sources;
- institutions, technology, economy, belief, or daily life as relevant;
- causes, enabling conditions, constraints, and consequences;
- who benefited, who bore costs, and whose experience is poorly preserved;
- scholarly agreements, live disagreements, obsolete popular stories, and genuine unknowns;
- consequential discoveries, revisions, anomalies, and proposed upsets from approximately the previous 50 years, plus older proposals made newly testable by recent evidence or methods;
- relevant comparative-analysis traditions and independent or claim-owner research that may not appear in ordinary academic review articles;
- vocabulary requiring precise definitions;
- visual evidence and likely media-rights constraints;
- age-sensitive material such as violence, death, enslavement, religion, sexuality, or human remains;
- story material: named people and what they wanted, vivid true details, short quotable lines from sources, surprising numbers or scale, how the evidence was found, and the stories people told at the time or later (recorded as `later-tradition`).

Write questions before answers. This reduces the risk of gathering only sources that support the first attractive narrative.

Plan the recent-challenge search as its own workstream rather than assuming the ordinary source search will reveal it. Name likely terminology changes, disciplinary boundaries, non-academic research communities, primary-data repositories, translated or transmitted traditions, and evidence classes that could overturn the baseline account.

## Stage 3 — Gather sources in a deliberate order

Search broadly enough to discover the field, then rely on the best available sources.

Useful discovery routes (not a ranking that substitutes for evidence):

1. surviving primary material and authoritative object/site records;
2. specialist corpora, excavation projects, archives, and critical editions;
3. museums, universities, public research institutions, and scholarly reference works;
4. peer-reviewed scholarship and reputable academic books;
5. high-quality synthesis used to orient or cross-check;
6. general web sources only to locate stronger evidence or resolve a narrow practical fact.

Use this research loop:

1. Run an orientation search to learn the field's current terminology, major evidence, and obvious disputes.
2. Identify direct support for the chronology/geography and central explanation; source counts are not a quality target.
3. Follow citations backward to the underlying object, corpus, excavation, primary source, or study.
4. Follow later citations forward to see whether the interpretation was refined, rejected, or remains influential.
5. Search deliberately for disagreement, regional/specialist perspectives, and evidence that would weaken the emerging narrative.
6. Search outside the dominant synthesis for consequential claim-owner reports, independent fieldwork, preprints, conference material, technical datasets, replications, comparative analyses, and serious criticism. Discovery is not endorsement; omission based only on venue, affiliation, or acceptance status is not allowed.
7. Trace widely circulated upset claims back to their earliest recoverable evidence, data, text, scan, object, excavation context, experiment, or explicit method. Record when that chain is unavailable rather than silently discarding the claim.
8. Locate at least one concrete primary/evidence encounter suitable for the learner.
9. Stop ordinary source gathering only when the essential claims are independently supported, important disagreement is understood, new sources mostly repeat known evidence, and remaining gaps are recorded honestly. The separate Stage 3A challenge audit still must pass before research can close. Do not stop merely because the first coherent story has appeared.

Wikipedia and search-result summaries may help discover terminology and references. They are not sufficient support for a material claim. A museum label is valuable but not automatically the last word. A single scholar’s interpretation is not “what historians believe.” Popular documentaries and unsourced educational sites are discovery leads, not claim authorities.

Classify sources by instructional role before spending equal effort on every lead:

- **Central supporting:** carries a central claim, chronology, attribution, key visual relationship or essential misconception correction. Closely read the relevant full passage, figure, data context or object record. Record exact page/figure/passage/object identifiers, the inference it supports, its limits and review identity. Abstracts or snippets are insufficient. If inaccessible, recover the evidence, narrow/defer the claim or record the unresolved dependency; do not claim close review.
- **Qualifying:** changes a central claim's confidence, limits or alternatives. Read the relevant material closely enough to support that qualification; give precise locations for material qualifications.
- **Discovery lead:** helps find evidence or scope the field. Record its citation/link, potential relevance and disposition briefly. It does not support learner claims until promoted and reviewed.

No source quota, equal-space requirement or institutional endorsement replaces these questions. Roles describe use in this lesson, not intrinsic prestige. The same source may support one claim and qualify another.

For central supporting and qualifying sources, record:

| Field | Required note |
| --- | --- |
| Stable source ID | Repository-safe ID |
| Full title, creator/publisher, URL | Enough to recover the source |
| Access date | ISO date |
| Source type and role | Primary object/text, corpus, excavation, scholarship, synthesis, visual reference; central supporting / qualifying / discovery lead |
| Exact location | Page, figure/panel, named passage, dataset section or object/accession record plus relevant description |
| Authority | Why this creator/institution is relevant |
| Claims supported | Claim IDs or research questions |
| Limits/bias | Date, perspective, selection, translation, institutional or evidentiary limits |
| Agreement | What other independent source corroborates it |
| Rights status | Research-only, public domain, open license, permission required, unresolved |
| Review status | Reviewed or further review required |

Open and read the relevant source itself. Do not cite a search snippet, AI summary, bibliography entry, or another article’s description as if it were the source.

### Weighing sources

Do not treat all citations as equal and do not turn source quality into a fake numeric score. Judge each source across these dimensions:

- **Directness:** does it present the object/data/text or summarize someone else?
- **Relevant expertise:** is the author/institution qualified for this specific claim and region/period?
- **Method transparency:** can the evidence, translation, excavation context, reasoning, and limits be inspected?
- **Proximity and context:** how close is it to the event, and what purposes or constraints shaped its creation?
- **Independence:** do several sources truly corroborate one another, or repeat one publication/tradition?
- **Scholarly currency:** has newer evidence materially changed an older interpretation?
- **Perspective and preservation:** whose viewpoint survives, who selected it, and whose experience is absent?
- **Claim fit:** does the source support the exact learner-facing wording and strength of certainty?

When strong sources conflict, identify whether they disagree about evidence, translation, dating, definition, causal interpretation, or values. Narrow the claim if possible; otherwise represent the major interpretations proportionately and make the uncertainty part of the teaching. Never resolve disagreement by choosing the source with the cleanest prose.

## Stage 3A — Audit recent upsets and proposed revisions

Before deciding what the lesson will claim, conduct a dedicated challenge audit covering approximately the previous 50 years. Treat 50 years as the default discovery window, not a hard cutoff: include older proposals that remain influential, have received important new evidence, or have become newly testable through scanning, dating, computation, excavation, translation, experimental archaeology, or comparative analysis.

Search for material that could substantially revise any of the following:

- chronology or periodization;
- who made, occupied, inherited, modified, or claimed something;
- the character, continuity, organization, or technical ability of a society;
- purpose, function, scale, geography, environment, or construction sequence;
- causal explanations and assumptions about what was possible;
- the authenticity, translation, provenance, context, or interpretation of central evidence;
- the relationship between surviving material, later tradition, and modern reconstruction.

The audit must include both accepted revisions and serious proposed upsets. Search across peer-reviewed literature, excavation and museum records, primary texts and critical editions, technical reports, theses, preprints, conference proceedings, public datasets, reproducible independent research, claim-owner releases, and substantive comparative analysis. Also search for ancient, Indigenous, local, descendant, and transmitted accounts relevant to the attribution or interpretation. Do not use “fringe,” “not consensus,” “not peer reviewed,” or institutional affiliation as a substitute for examining the evidence and method.

Comparative analysis is a legitimate hypothesis-generating form of evidence. Evaluate what is being compared, whether the cases and measurements are genuinely comparable, whether selection effects or circular assumptions are present, what alternative explanations fit, and what new observation the comparison predicts. Do not dismiss it merely because it does not itself provide excavation stratigraphy or a direct date; instead, state precisely which inferential link it supplies and which links remain missing.

Screen broadly, then assess instructional consequence. Use the full analysis below when a proposal could materially change the explanation, chronology, attribution, visual depiction, or a major misconception. Record peripheral proposals in a short table with their evidence lead, reason for deferral and trigger for reconsideration; do not write a full dossier for each. Popularity or unfamiliarity alone does not make a proposal central. Screen the inherited account with the same questions.

For each consequential challenge or revision, record:

| Field | Required analysis |
| --- | --- |
| Proposal and consequence | What changes if it is correct, and why is that material to the lesson? |
| Origin and current form | Who made the claim, when, and how has it changed or been repeated? |
| Evidence and provenance | What object, text, context, measurement, dataset, scan, comparison, or experiment supports it? Can the underlying material be inspected? |
| Method | How does the evidence become the conclusion? Are assumptions, processing, calibration, and uncertainty visible? |
| Corroboration and independence | Has another source, method, team, or evidence class reached a compatible result without copying the same origin? |
| Strongest countercase | What evidence or reasoning most seriously weakens it? Has the claimant answered that objection? |
| Discriminating test | What observation would distinguish this proposal from the strongest alternative? Has that test occurred? |
| Status | Direct observation, supported inference, plausible hypothesis, unverified claim, contradicted claim, or unresolved conflict—with a short explanation, never a numeric score. |
| Lesson consequence | Essential highlight, qualified comparison, Investigation/Story Arc depth, contextual note, or omit with a recorded reason. |

Actively look for asymmetric scrutiny. Do not demand perfect provenance, replication, or direct dating from a challenge while allowing the inherited account to rest on names, associations, stylistic attribution, later tradition, or untested assumptions. Apply the same claim-fit questions to every account and state when different evidence types answer different parts of the problem.

Complete the audit with a coverage statement listing the search window, terminology, databases and repositories, disciplines, primary-source traditions, independent or claim-owner channels, major citation trails, inaccessible items, and known gaps. “No major challenge found” is acceptable only when this search record makes the negative result reviewable.

## Stage 3B — Present the research-direction checkpoint

Write the audit into the lesson's research note. Lead both the note and the actual user-facing handoff with a **one-screen decision card**, not an explanatory essay or a link the owner must open. Give a recommended focus, then one line with the question a curious 12-year-old would ask about it and one plain sentence they could tell a friend afterward (provisional; Stage 6A settles them), then roughly three to five numbered provisional teaching beats. Each row uses plain language to say what the beat would teach and, in a few words, what visual might help or why none would. Offer `yes / change / no` for each row and accept a response such as `all yes` or `1 yes; 2 change: ...`. Keep source IDs, caveats, and argumentation in the linked research packet unless one uncertainty would materially change the owner's decision. The owner should be able to respond from the handoff message alone. These beats are editorial possibilities, not approved section headings, selected claims, storyboard rows, or media commitments. Put optional explanation and the detailed packet below the card; do not ask the owner to parse them for routine approval.

The underlying analytical packet must still identify:

1. the inherited baseline account;
2. the strongest evidence supporting it;
3. each consequential recent revision or proposed upset and its present evidentiary status;
4. ancient or transmitted accounts that materially complicate attribution or interpretation;
5. comparative analyses and the exact inference each contributes;
6. genuine contradictions, missing tests, and evidence that is inaccessible or not reproducible;
7. the research team's provisional synthesis without concealing minority or unresolved possibilities;
8. how the findings could change the essential question, central argument, main-lesson highlights, Story Arc depth, or Investigation design;
9. the specific judgments or further research questions for the product owner.

Stop after sharing the decision card and linked packet (owner touchpoint 1). Share the actual analytical outcome, not merely a report that a search was performed. Do not begin Stage 4, settle the durable understanding, select claims for learner treatment, storyboard sections, draft prose or prompts, plan final media or a card, or build the Learn-shell prototype until the product owner has considered the findings and responded. Record that response and any requested follow-up research in the note. If the response exposes a missing evidence class or materially changes the historical model, repeat Stages 3A–3B.

## Stage 4 — Build the claim ledger before drafting prose

Every material learner-facing assertion must map to a claim and supporting sources. Break compound claims apart when their evidence or certainty differs.

Classify each claim using the canonical contract:

- `observation` — what survives or is directly documented;
- `interpretation` — the reasoned meaning historians draw from evidence;
- `reconstruction` — a proposed visual, spatial, procedural, or narrative filling of gaps;
- `later-tradition` — a later account, memory, legend, or representation being discussed as such.

Assign certainty:

- `high` — strong, converging evidence and broad scholarly agreement;
- `moderate` — reasonable interpretation with meaningful limits;
- `low` — plausible but weakly evidenced; normally avoid making it carry the lesson;
- `contested` — material disagreement that must be represented proportionately.

For each claim record:

| Field | Question |
| --- | --- |
| Claim ID and statement | What exactly is being asserted? |
| Kind and certainty | Observation, interpretation, reconstruction, or later tradition? How sure? |
| Direct support | Which sources actually support this wording? For central claims, identify precise page/figure/passage/object locations in the Central claim support table; record close review. |
| Corroboration | Is the support independent, or are sources repeating one origin? |
| Counterevidence/alternative | What credible evidence or interpretation complicates it? |
| Survival bias | Is absence of evidence being mistaken for evidence of absence? |
| Perspective | Whose voice produced or preserved the record? Who is missing? |
| Learner treatment | State directly, qualify, compare interpretations, or omit? |
| Review status | Reviewed or editorial review required? |

Use proportionality, not false balance. A weakly supported proposal does not receive equal space with a strongly evidenced explanation. A real scholarly disagreement is not erased because one version is easier to narrate. If evidence cannot support a clean answer, teach the limit or narrow the question.

Recommended historical-reading habits:

- **Source:** who made this, when, for whom, and why?
- **Contextualize:** what conditions made it meaningful at the time?
- **Corroborate:** what changes when it is compared with independent evidence?
- **Close-read:** what does it actually say or show, and what are we adding by inference?

These align with the Digital Inquiry Group’s [historical thinking framework](https://www.inquirygroup.org/history-lessons/historical-thinking-chart) and the Library of Congress [Observe–Reflect–Question primary-source process](https://www.loc.gov/programs/teachers/getting-started-with-primary-sources/guides/).

## Stage 5 — Weigh and select the content

Do not pour the research file into the lesson. Triage every candidate idea:

- **Essential:** necessary to answer the essential question or understand the next lesson.
- **Supporting:** makes an essential idea intelligible, concrete, or memorable.
- **Enrichment:** worthwhile but optional; possible knowledge block, later journey, card fact, or Deep Dive.
- **Deferred:** belongs in another lesson or journey.
- **Rejected:** misleading, redundant, weakly supported, age-inappropriate without educational value, or colorful but unsupported.

Then test the proposed synthesis:

1. Does it explain a mechanism, relationship, or evidentiary problem—not merely name events?
2. Does it preserve chronology without implying that history was inevitable?
3. Does it distinguish conditions, triggers, consequences, and later significance?
4. Does it give historical people agency without pretending everyone had equal power?
5. Does it avoid treating a society as uniform, timeless, isolated, uniquely primitive, or uniquely advanced?
6. Does it avoid “first,” “invented,” “collapsed,” “discovered,” and “civilized” unless precisely defined and supported?
7. Does it separate what happened from why historians think it happened?
8. Does the lesson keep its best true stories? A vivid, well-supported detail that makes an idea stick earns its space; cut color that is unsupported or teaches nothing.

If the lesson cannot fit without rushing, split or narrow it. Do not solve scope problems with tiny text, accordions, or a longer page.

## Stage 6 — Create the learning blueprint

Plan backward from what the learner should be able to explain or recognize.

Record:

- essential question;
- durable understanding;
- three to five supporting understandings;
- two to four prerequisite ideas;
- likely misconceptions;
- indispensable vocabulary;
- one concrete primary/evidence encounter;
- one causal, comparative, spatial, chronological, or source-reasoning move;
- the evidence of a sincere attempt that completion will require;
- the natural bridge to the next required lesson;
- the story spine: the person, object, place or puzzle the lesson follows from opening to end, where the evidence allows;
- two to four memorable moments: true, specific details or stories a learner would want to tell someone afterward.

Prefer “Explain how clay tablets helped temple officials keep track of grain, workers and animals” over “Know about proto-cuneiform.”

The U.S. Institute of Education Sciences recommends building world and word knowledge and giving grades 4–9 learners repeated chances to ask and answer questions while making sense of text. Apply that here by giving necessary context before demanding inference, defining essential vocabulary in use, and making the understanding check depend on the lesson’s evidence rather than trivia. See the [grades 4–9 practice guide](https://ies.ed.gov/ncee/wwc/PracticeGuide/29).

### Cumulative learning in every blueprint

Record **Retrieve** (which earlier idea returns), **Extend** (how this lesson develops or complicates it), and **Revisit** (where understanding will be used again). Name stable existing lesson IDs where available. For an opening lesson, Retrieve may name everyday prior knowledge without assuming formal study; a future use is an editorial intention, never a claim that unpublished content is available.

Plan progression from observing and separating inference, through contextualizing and corroborating, to comparing explanations and qualifying a conclusion. Name the move practiced now, its prior scaffold, and the next increase in independence. Occasionally plan transfer to unfamiliar evidence using reviewed material, with enough context for a fair attempt; it need not appear in every lesson or become a completion hurdle. [Learner observation](lesson-production/learner-observation.md) tests whether these choices work.

Completion records studied content and sincere attempts. It is distinct from demonstrated mastery; an example answer, character count, or optional recall task cannot certify mastery or revoke completion.

## Stage 6A — Write the kid's question and draft the checks

The questions at the end of a lesson can only be as clear as the idea they check, and that idea is usually first written in research language. So write the learner's version of the idea now, before the storyboard, and draft the checks from it. The lesson is then built to answer them.

Write this with the research note closed. Work from what a curious kid would want to know, not from the claim ledger, the synthesis or the durable-understanding sentence. Their words (arrangement, installation, attested, uniform, connection) are exactly what leaks into confusing questions.

Record in the research note under `## Kid's question`:

- **The kid's question:** the question a curious 12-year-old would actually ask about this subject, in their words. It usually starts with how, why, who or what was it like: “How did people build the pyramids without machines?”, “How did one king control cities hundreds of miles away?”, “Why did people start keeping goats instead of hunting them?” It is the essential question, said by a kid. If the two differ in substance, fix the essential question; do not keep two.
- **The kid's answer:** two or three sentences the learner could say to a friend or parent afterward, in their own words. It says what happened and why, with one or two real details. For Akkad: “Akkad's kings won lots of battles, but keeping a city was harder. At Leilan they sent their own officials and fed hundreds of workers every day. In other cities they did it differently, like marrying a princess into the local royal family.” If the kid's answer is mostly about what the evidence cannot prove, the lesson has lost its history (see [Historical significance and proportion](#historical-significance-and-proportion)).
- **How we know, in one line:** the one piece of detective work the lesson shows (Merer's diary, the goat bones, the door sealings). It is how the story is known, told as part of the story. It is not the point of the lesson.
- **Draft checks:** the multiple-choice question and the written question, written now under Stage 12. Each one checks one sentence of the kid's answer. Stage 12 polishes them; it does not invent them later from the claim ledger.
- **Plant list:** for each check, what the lesson must show for a kid to answer it: the facts, the details and any word it must explain. Stage 8 places each one before the check.

The opening (Stage 8) raises the kid's question through a real moment and may ask the learner to hold a guess (“What would you have done?”); the ending pays it off. A learner who reaches the checks should feel asked about the thing they have been reading about, not something new. This matters for memory as well as clarity: a question asked before reading helps learners remember the answer to *that* question and almost nothing else, and guessing first strengthens the effect ([St. Hilaire, Chan and Ahn, 2024 meta-analysis](https://par.nsf.gov/servlets/purl/10511812)). Stories organized around a problem the reader wants solved are understood faster and remembered better than explanation (Daniel Willingham, “The privileged status of story”, *American Educator*, Summer 2004). So the opening question and the end checks must be the same question.

## Stage 7 — Perform the ages 11–15 design pass

Age adaptation changes explanation, pacing, assumptions, and support. It does not merely shorten words or remove nuance.

### Required transformations

- Start with a concrete question, object, place, decision, or human problem before an abstract system.
- Give time and place early. Do not assume learners already possess the surrounding chronology.
- Explain causal links explicitly, but avoid single-cause stories.
- Introduce specialized vocabulary only when it earns precision; define it near first use and then reuse it consistently.
- Break dense reasoning into visible steps without fragmenting it into disconnected fact cards.
- Prefer specific actors and actions over vague passive voice.
- Use analogies only when their limits are stated and they do not modernize the past. Never put the analogy in a section heading.
- Explain uncertainty in direct language: “The marks survive; the exact transaction does not.”
- Preserve tradeoffs, power differences, missing voices, and unintended consequences.
- Never make a culture exotic, childish, faceless, or a mere stepping stone toward the present.
- Do not rely on gore, humiliation, sexualization, or manufactured mystery to create interest. A real open question is fair game; a fake one is not.
- When difficult material is essential, describe it truthfully, proportionately, and without graphic decoration.

### Voice and storytelling

Accuracy is the floor, not the goal. A lesson that is correct but flat does not get read. Write the way a knowledgeable guide tells a story they love to someone they respect: vivid, direct and specific, never cute.

Story tools (use the ones the evidence supports):

- **Open on a moment.** Start with a person doing something, an object being found, or a puzzle, at a specific time and place. Zoom out to the system once the learner cares.
- **Follow someone or something.** Where the evidence allows, carry one person, object or place through the lesson so the sections feel like chapters rather than topics.
- **Give people wants and stakes.** Say what rulers, workers, families or traders were trying to do, and what could go wrong for them.
- **Tell the stories people told.** Legends, boasts, curses, complaints and later retellings are strong material when labeled as what they are (“Later Mesopotamians told a story that…”). The gap between the legend and the evidence is often the best part of the lesson.
- **Show the detective work.** How something was found, misread, dated or reinterpreted is a story. Uncertainty can be the hook (“Nobody can read this script yet”) rather than a disclaimer.
- **Use the surprising true detail.** A number, a scale comparison, a sensory detail from the object, a short translated quote. One sharp specific beats three general sentences.
- **Land the ending.** Close with a callback to the opening or a real open question, not a summary of the headings.

Voice rules:

- Vary sentence length. A run of short declarative sentences reads like a list; let a longer sentence carry the story forward.
- State uncertainty once, clearly, where it matters, then keep going. Do not hedge every sentence.
- Let the history make the moral point. Do not add asides telling the learner how to feel about it.
- Use humor only when it comes from the history itself, such as a real complaint letter or a boast that backfired. No invented jokes, slang, pop-culture references, exclamation marks, or “Imagine you are…” openings used as filler.
- Never talk down. Write for a curious, intelligent reader who lacks background, not ability.
- Never invent dialogue, thoughts, feelings or scenes and present them as fact. A reconstructed scene must be labeled and built from evidence.
- Say what happened, not what didn't. Do not refute ideas the learner never had: “This does not mean…”, “It was a message, not a battle report”, “It does not show that Urkesh was run the way Leilan was”. A run of these turns a story into a list of corrections. Correct a misconception only when it is one kids really hold (named in the blueprint), once, at the point where it would form.
- Use verbs and people, not abstract nouns. “Akkad sent its own officials to run Leilan” beats “Leilan shows an Akkadian administrative installation”. Words such as arrangement, connection, tie, relationship, presence, role, practice, nature, significance and framework usually hide who did what to whom. Rewrite the sentence around the people and the action.
- Every name earns its place. Name a person, place or people only when the story needs it or the learner will meet it again, give each a plain clause saying what it is, and avoid piles of new names in one sentence or section. Use one name for one thing; when two are needed (Agade the city, Akkad the kingdom), say once how they relate.
- Never assume the learner did an earlier lesson. A callback re-says the one fact it needs (“In Nubia, the kingdom of Kerma traded with Egypt without being ruled by it”), not “At Kerma you saw…”.
- Explain an everyday-unfamiliar word the first time it appears (inscription, stele, cylinder seal), in the same sentence, or use a plainer word.
- Leave the research note's words in the research note. Scholarly terms (administration, state formation, attested, polity, ideology, material culture, installation, uniform) appear only when the lesson needs the idea, explained in plain words the first time.
- Tell the detective work once, as a story: who found what, and how they worked it out. Then go back to the history. Do not end every section with a reminder of what is still unknown; say what is unknown once, where it matters, as a real open question.

### Practical reading and pacing heuristics

These are review signals, not mechanical publication gates:

- one central question;
- five to eight semantic sections;
- one primary instructional job per section, stated in authoring `purpose` and expressed to the learner by a single clear `heading`;
- no duplicate title stack (purpose + heading + module title all competing for attention);
- usually one or two modules per section;
- short paragraphs, with the key relationship stated before qualifications pile up;
- roughly five to nine indispensable new terms, not a glossary dump;
- enough total reading for a focused lesson rather than a chapter-length article;
- visual or interaction changes that follow conceptual changes, not arbitrary alternating stripes;
- one to three required prompts, usually two.

Read every section aloud. Rewrite sentences that require holding too many clauses, actors, dates, or qualifications in working memory. Keep the qualification; improve its placement.

### Comprehension test

For each section ask:

1. What should the learner understand here?
2. What prior knowledge does this sentence assume?
3. Which word or relationship may block comprehension?
4. What concrete evidence or example makes it real?
5. What can be cut without harming the mental model?
6. Does the section leave a false impression even if every sentence is technically true?
7. Can a 12-year-old, or a parent skimming the page, tell what this section is about from the heading alone—without decoding a metaphor, riddle, or punchline, and without reading an eyebrow or a second title?

### Inclusion and accessibility

Represent relevant identities, perspectives, and forms of knowledge authentically. Offer meaning through clear text plus appropriate visual/evidence forms without lowering the learning goal. Apply the learner-centered principles in [CAST’s UDL Guidelines 3.0](https://udlguidelines.cast.org/more/about-guidelines-3-0/), while avoiding a cluttered “everything in every format” interface.

# Phase 3 — Prototype and review

## Stage 8 — Storyboard the lesson flow

Do this before writing final prose or sourcing decorative images.

Create a table:

| Order | Stable section ID | Learner-facing heading | Authoring purpose (not shown) | Key claim(s) | Module(s) | Evidence/media | Transition |
| --- | --- | --- | --- | --- | --- | --- | --- |

Heading rules:

A section heading names the subject or the teaching job in ordinary words. It orients. It is not a joke, metaphor, riddle, or magazine punchline. Interest comes from the history, not from the title.

Rewrite test: if a 12-year-old, or a parent skimming the page, cannot tell what the section is about without reading the body, rewrite the heading. If the heading needs explaining, it has already failed.

| Fail | Pass |
| --- | --- |
| A ruler’s claim is not a camera | What the Palette can prove |
| A kingdom shaped like a river? | The Nile corridor |
| Making rule travel | How administration worked |
| Can a mark remember? | Why people started keeping records |
| What counts as one of us? | What counts as *Homo sapiens*? |

A plain-language thesis is allowed when it uses the actual historical claim in ordinary words (“Farming did not begin once”). A metaphor standing in for that claim is not.

Do not:

- use a modern object as a metaphor for evidence (“camera,” “photograph,” “movie,” “news report”) in a heading;
- pose a riddle or rhetorical question whose answer is the section;
- compress a thesis into a clever verb phrase;
- put an analogy in the heading.

Authoring `purpose` stays imperative and internal (“Supply the species category…”). Never publish that voice as on-page chrome. If the section is a single `knowledge` or `prose` module, do not invent a second grabber title for the module. Claim IDs, section IDs, and durable-understanding sentences follow the same voice.

Each section must perform a distinct job. A common pattern is:

1. **Masthead/orientation** — time, place, significance, depiction label. Place the subject relative to recognizable wider geography before introducing unfamiliar local sites; follow the map runbook's context-to-detail requirement.
2. **Opening** — a moment, person, object or puzzle that makes the learner want the answer. The kid's question (Stage 6A) grows out of it rather than being announced.
3. **Necessary context** — what the learner must know to reason further.
4. **Mechanism or development** — how something worked or changed.
5. **Evidence encounter** — examine an object, source, map, or record.
6. **Consequences and power** — possibilities, costs, unequal effects, or limits.
7. **How we know and what is still a mystery** — told once, as the detective story and a real open question, usually in prose. Use a `knowledge` module only when four parallel items really are clearer than a few sentences; then use the stable eyebrow **What we can know**, and write each item as a plain positive statement (“The seal shows a princess of Akkad lived in the palace”; “Nobody yet knows whether she was queen”), not a run of “cannot prove” lines. Do not use “evidence boundary” or other methods jargon as the learner-facing label.
8. **World Check and explicit completion** — use evidence, receive feedback, complete deliberately.

This is a pattern, not a template to fill blindly. A biography, battle, migration, intellectual debate, environmental change, and archaeological investigation may need different sequences. Keep the stable shell while authoring the historical argument.

Flow tests:

- Can the learner state why each section follows the previous one?
- Does new information answer or sharpen the opening question?
- Is the evidence encountered before the lesson asks the learner to use it? Is every item on the Stage 6A plant list placed before its check?
- Does the page alternate modes only when the teaching mode changes?
- Is the final instructional section truly the end, with navigation appearing afterward?
- Does removing any section break the argument? If not, cut or merge it.

## Stage 9 — Map the storyboard to typed components

Use the smallest current module that expresses the teaching job:

| Module | Use it for | Do not use it for |
| --- | --- | --- |
| `prose` | narrative bridge, causation, explanation, qualification | long unstructured essays or facts that need comparison |
| `knowledge` | two to four parallel ideas, stages, features, contrasts, or consequences | unrelated fact tiles or decorative summaries |
| `scene` | close reading of an approved reconstruction with two to four meaningful hotspots | presenting reconstruction as evidence or adding spectacle |
| `evidence` | sustained attention to a surviving object/source and what it supports | generic illustration or claims the object cannot establish |
| `historical-map` | geographic orientation from recognizable wider context to lesson places; spatial relationships that support the explanation | isolated local dots without wider context, decorative geography, or unsupported historical borders/routes |
| `prompt` | a canonical understanding prompt placed where requirements are satisfied | navigation, surveys, trivia, or fake participation |

Titles: section `heading` owns orientation. For `knowledge` modules, the learner sees eyebrow + `body` as the lead into the item grid — do not invent a second grabber title for display. Module `title` on `evidence`, `scene`, and `historical-map` is a local cue only when needed (observe X; compare Y). Module `eyebrow` is a type/place label, not a slogan.

Keep these recurring learner-facing type labels in ordinary words:

- `evidence` module chrome: **Surviving evidence** (not “from the evidence room”).
- Close-read `knowledge` module after a source: **What you can see** (not “observation before interpretation” or “look before you explain”).
- Labor/institution `knowledge` module: **Who did the work** (not “a city/state in practice”).
- Source-limit `knowledge` module: **What we can know** (not “evidence boundary”).

Do not invent a new methods slogan for the same job.

If the lesson genuinely needs a timeline, comparison table, audio source, diagram, or another unsupported teaching primitive, stop and decide whether to add a bounded reusable module. Do not fake it with arbitrary HTML, an image containing educational text, overloaded `knowledge` cards, an inaccessible visual without a reviewed data model or text equivalent. A new module is an architecture/design change and requires its own validation and accessibility coverage.

Native application text carries titles, explanations, labels, and captions. Do not bake educational prose into artwork.

## Stage 10 — Make the media plan

For each proposed asset, complete:

| Field | Decision |
| --- | --- |
| Teaching purpose | What understanding becomes easier or possible? |
| Claim/evidence link | Which claim IDs and sources govern it? |
| Best form | Evidence object, period image, map, diagram, reconstruction, audio, video, or no media |
| Depiction mode | Evidence, evidence-based reconstruction, diagram, or map |
| Learner action | Observe, locate, compare, sequence, interpret, or simply orient? |
| Placement | Why at this exact point in the argument? |
| Accessible equivalent | Alt text, accessible summary, transcript, caption, or data description |
| Rights/provenance | What permits research use and runtime redistribution? |
| Review | Historical, visual, rights, and accessibility owner/status |

Media must either provide evidence, explain a relationship, orient the learner, or create a historically responsible imaginative entry. “The page needs another picture” is not a teaching purpose.

### Choosing the form

- Use a **surviving object or primary visual source** when the learner should observe evidence.
- Use a **map** when location, distance, environment, movement, boundaries, or spatial uncertainty is part of the explanation. Then follow the [historical map production runbook](historical-map-production.md).
- Use a **diagram** when a process or relationship matters more than literal appearance. Use reviewed geometry, measurements, labels and relationships; native components, deterministic vector drawing or raster production are appropriate. Choose the method that preserves those facts reliably.
- Use an **evidence-based reconstruction** when a scene materially helps learners imagine a poorly preserved environment, every depicted real subject has a reviewed visual reference, and the brief distinguishes surviving evidence from source-supported reconstruction. A reconstruction label does not permit invented artifacts, inscriptions, architecture, or measurements.
- Use a **symbolic treatment** sparingly for an abstract idea. Keep it visibly abstract; do not substitute a realistic invented object, manuscript, excavation, or scan for missing evidence.
- Use **no media** when text is clearer and an asset would only create noise.

### Approved media plan → Stage 15 duty

After product-owner approval of the Stage 0–14 packet, treat media-plan rows marked **Required**, **Recommended**, or **Recommended core** as Stage 15 deliverables unless the approval packet explicitly defers or rejects them.

Do not invent an “MVP skip” for an approved recommended historical map, diagram, or evidence asset merely to ship prose sooner. If a later lesson already has a working module pattern (for example Uruk’s `historical-map`), reuse that pattern. Deferral requires an explicit product-owner note in the research checkpoint or a follow-up approval comment.

Rows marked **Preferred / optional** (for example an atmospheric hero when a diagram already carries the evidence encounter) may ship after the required and recommended assets, or wait for a bounded follow-up on the same issue when generation or rights block them.

For every image or generated asset, follow the [media provenance research and generation prompt](../prompts/media-provenance-research-and-generation.md); after visual approval, follow the [media ingestion and publishing runbook](../architecture/media-publishing.md). Git holds identity and provenance; Supabase Storage holds bytes; Postgres does not store image blobs. Prepare the runtime source before `media:add`: keep the archival master in research, use a JPEG catalog source and the `photo` preset for large reconstructions, and do not overwrite a different asset's identity. A ql-v1 size failure is ingest prep, not a storage-architecture problem.

### Media method and fidelity policy

| Teaching purpose | Preferred method | Review invariant |
| --- | --- | --- |
| Inspect surviving evidence | Licensed original photograph, scan or object record; only permitted non-misleading crops/compression | The learner can inspect actual evidence; reconstruction cannot replace or masquerade as it. |
| Explain factual geometry, process, chronology or comparison | Native/deterministic/vector or raster rendering from reviewed data and relationships | Preserve reviewed geometry, measurements, labels, order and uncertainty; retain code/data versions and text equivalents. |
| Orient geographically | Source-faithful historical atlas map, rendered deterministically or as an illustrated edit; use the colorful Akkad locator as the visual benchmark | Use the [historical-map guidance](historical-map-production.md). The learner must locate the subject relative to recognizable wider geography at embedded size. Preserve source geometry; no invented terrain, coordinates, borders, routes or precision. |
| Reconstruct or set atmosphere | Image generation when the approved brief benefits from it | Explicit depiction label, source-supported real subjects, honest unknowns; no fabricated evidence or baked-in educational prose. |

Raster publication remains appropriate for the current image pipeline. Vector sources/intermediates and accessible native diagrams are allowed. Lesson maps follow the owner-selected Akkad visual standard; choose deterministic rendering or a faithful illustrated edit according to geographic fidelity and legibility. Other factual diagrams and evidence originals do not require generative restyling. Use typed native modules for new reusable forms, with responsive and accessibility coverage.

For generated depictions of a specific real artifact, inscription, site, structure, excavation or survey, inspect and supply references of the actual subject. Record subject-to-reference mapping, provenance, permitted transformation, complete prompt and rejected candidates. Similar objects and style references cannot supply missing historical details. Generic atmospheric reconstruction must state what is generalized or unknown and cannot invent identifiable artifacts or measured evidence.

Where an approved reference already carries the intended composition, preserve its canvas relationship, panel order, subject proportions, labels and evidence-bearing details. A style-only edit must retain those invariants. An adapted composition needs a documented teaching reason and owner review of the changed relationship. Neither mode permits invented inscriptions, wall arrangements, stratigraphy, scan patterns or other physical evidence. This same fidelity standard applies to deterministic output: code is not historical evidence.

Compare reference/data against the accepted final at desktop and mobile lesson sizes. Reject changed relationships, unsupported detail, ambiguous comparison subjects, illegible labels or false precision. Keep rights and attribution intact; copyrighted research references without derivative permission may inform facts but cannot become copied expression or image-edit inputs. Follow the [media provenance guidance](../prompts/media-provenance-research-and-generation.md) for rights and method records.

### Required image lifecycle record

Every accepted lesson image must have one plainly visible lifecycle block under a top-level `## Image lifecycle` heading in the lesson research note. This is the product owner's visual sanity-check surface, not a list of filenames hidden inside general provenance notes.

Use one `### <media-id> — <teaching role>` block per image and present the sequence in this order:

1. **Reasoning and source basis** — the teaching job, governing claim IDs and factual sources, why an image is better than no media, and the depiction/uncertainty boundary.
2. **Reference image actually used** — embed permitted visual references or a rendered view of the reviewed data, then record its canonical origin, creator, license, repository research-copy path and hash, the visual relationship to preserve, and what must not be copied or inferred. Include a subject-to-reference table covering every real subject and composite panel, with object/accession or figure identifiers where available. Separate subject references from style/layout references. A URL or prose description without the visible reference image is insufficient.
3. **Generation or transformation** — record every actual input file/hash, method (`style-only transformation`, `adapted composition`, direct use, or deterministic/native/vector rendering), tool/model/date, and the complete prompt verbatim. Include the subject-to-reference mapping and explicit prohibition on inventing physical or measured details in the prompt. For style-only work, list the locked layout and detail invariants explicitly. For direct use or deterministic production, say `No generation`, record transformations or code/data paths and versions, and list the relationships tested.
4. **Accepted final image** — embed the accepted master beside all subject references, then record master/runtime paths and hashes, rejected candidates with reasons, reviewer/status, and a comparison verdict for every subject: whether its appearance and every locked layout/detail invariant survived, what intentionally changed, and what unsupported details were checked. Missing subject references or failed fidelity checks block acceptance in either edit mode; they cannot be recorded as acceptable intentional changes.

The reference and accepted final must be visible together in the rendered Markdown when repository redistribution is permitted. Do not redistribute a reference without permission. For reference-only geographic/factual research, link the exact source and show a permitted data/reference rendering for fidelity review; for image-edit inputs, secure derivative rights or choose another reference. Record limitations explicitly. Do not make reviewers reconstruct lineage from browser tabs, temporary generation storage, chat, or scattered note sections.

Copy the exact lifecycle block from the [authoring templates](lesson-production/authoring-templates.md). Historical maps keep their specialist brief, but still receive this concise reference-versus-final lifecycle block in the lesson's main research note.

### Video decision gate

Video is exceptional, not standard. Use it only when motion, change over time, sound/performance, physical technique, oral testimony, or an expert demonstration is itself necessary to the learning.

Do not add video:

- merely for engagement, atmosphere, or relief from text;
- when a map, object, diagram, short animation, or authored explanation teaches more precisely;
- as a full documentary when only one small idea matters;
- when rights, captions, transcript, privacy, hosting, or long-term availability are unresolved;
- when the lesson becomes incoherent or impossible to complete without playback.

If video passes the gate:

1. State the exact learner question it answers.
2. Select or produce the shortest coherent segment.
3. Verify historical claims, editing context, rights, hosting, and permanence.
4. Provide accurate captions and a transcript; add audio description or an equivalent explanation when important visual information is not spoken.
5. Provide a useful poster image and static/text fallback.
6. Use native, keyboard-operable controls; never autoplay.
7. Avoid third-party ads, tracking, algorithmic recommendations, and links that pull learners out of Chronos.
8. Verify mobile, low-bandwidth, muted, and reduced-motion behavior.

Follow W3C WAI's [planning guidance for accessible audio and video](https://www.w3.org/WAI/media/av/planning/). Captions must include meaningful non-speech audio, not dialogue alone; the transcript/static fallback must preserve the teaching content carried by both sound and visuals.

No MVP lesson is blocked on custom video production. Stabilize the evidence-led lesson first and add video later only if learner observation reveals a real explanatory gap.

## Stage 11 — Decide whether the lesson earns a Knowledge Card

A card is justified when a person, place, artifact, invention, event, or idea is:

- a durable memory anchor for the lesson;
- visually and historically representable;
- meaningful enough to revisit outside the lesson;
- supported by reviewed sources;
- distinct from cards already in the collection.

Do not create a card simply because every previous lesson had one. Do not create multiple cards to reward more scrolling. Choose the class—Foundation, Breakthrough, Turning Point, Masterwork, Witness, Enigma, or Legacy—by the object’s learning role, never by historical “power” or game rarity.

Plan:

- stable card ID, category, and class;
- exact lesson understanding it anchors;
- date/place and compact significance;
- three to five facts worth remembering;
- depiction label and media;
- reveal title/body explaining why it was earned;
- source list and visual brief;
- deterministic `unlockLessonId`.

**Card art is the lesson's most striking image of the card's subject.** A card is a prize the learner keeps, shown at trading-card size, so it should be the picture they would want to hold:

- For a place, idea, event or people card, start from the hero or the lesson's most dramatic scene or reconstruction. Reuse it; the art box crops to a landscape frame, so check the subject survives the crop.
- For an artifact card, use the best image of the object itself, shown whole.
- A map, diagram or chart is card art only when the lesson has nothing more vivid. Record why in the card plan, and treat it as a gap worth a future image.
- Keep the card's `depictionLabel` true to the image (reconstruction, illustration or surviving evidence).

The reveal remains subordinate to lesson completion and the current journey’s next action.

## Stage 12 — Author understanding prompts and feedback

The checks were drafted at Stage 6A from the kid's answer. This stage makes them clear, fair and kind. Question writing is its own job: do it as a separate pass, after the lesson text exists, with the research note closed, and test it with the Stage 14C kid read.

A learner who does not understand a question learns nothing from it, and neither does the parent reading the answer. Every rule below serves one test: **a 12-year-old reads the question once and knows exactly what to do and what kind of answer is wanted.**

### What the checks are for

Normally use two required prompts:

1. one multiple-choice question (or ordering, matching or image question) about the most important idea in the kid's answer;
2. one written question that asks the learner to explain, in their own words, a how or a why from the lesson.

Ask about the history: what people did, why they did it, how it worked, what changed, what it was like. Ask how we know only when the detective work is itself one of the lesson's main moments, and then ask it concretely (“How could archaeologists tell the goats were being herded, not hunted?”). Do not use the checks to quiz what the evidence cannot prove. The lesson tells the learner what is still unknown; the checks do not test it.

**One question per prompt.** Every prompt asks exactly one question, and each written prompt gets one answer box for one answer. No numbered parts such as (1) and (2), no “and also…”, no second question mark, no “Choose one X, then…”. Learners at this age reliably miss the second part of a combined question. If the check needs two things, make two prompts the learner answers one after the other. Stay within three required prompts: if splitting would need more, drop the least important ask.

### Write the question the way a person would ask it

- **Ask a real question, not an exam task.** A real question is one a curious person might ask out loud: “Why did Akkad build so many ovens at Leilan?”, “What were the people of Ganj Dareh doing with their goats?” An exam task asks the learner to judge statements: “Which conclusion is best supported?”, “Which statement does this evidence support best?”, “What is the strongest conclusion?”. Do not use those stems. Ask the question the right answer answers.
- **Name the thing; never use a category label.** Say “Merer's diary”, “the hoofprints in the mud bricks”, “the princess's seal on the palace door”. Do not say “a clue”, “a find”, “the evidence”, “a source”, “an example”, “one of the sites” or “this pattern” unless the lesson itself called that exact thing by that word. A label is the writer's way of seeing the lesson; the learner has to rebuild the writer's whole framing before they can start.
- **Say what you are trying to figure out.** A question about a thing says what the thing tells us about: not “What does the seal show?” but “What does the princess's seal tell us about how Akkad got along with the king of Urkesh?”. A learner should never have to guess “a clue to what?”.
- **Use only the lesson's words.** Every word in the question appears in the lesson with the same meaning, or is an everyday word a 12-year-old uses. If the lesson said “the king's people ran the city”, do not ask about “administration” or “control”. Rewording test items into everyday words and simpler sentences, with the content unchanged, raises scores for all students, not only weak readers ([Abedi and Lord, CRESST](https://cresst.org/?p=2850)): hard wording tests reading, not history. These words are banned in questions, options, hints and feedback:

  | Instead of | Write |
  | --- | --- |
  | conclusion; which statement; best fits; strongest; most likely; which of the following | ask the question the right answer answers |
  | evidence; a find; a clue; a source; this pattern; an example | the thing's name: Merer's diary, the ovens, the door seals |
  | arrangement; connection; tie; relationship; role | the actual link: who was in charge, a marriage, a trade, a boss |
  | suggest; indicate; demonstrate; establish; imply; attest | show, tell us (or ask “why do you think…”) |
  | significance | why it matters |
  | control; kept hold of; administration; governed | ran the city; stayed in charge; told people what to do |
  | analyze; infer; consider; evaluate | cut it and ask the question |
  | researchers are still trying to answer; cannot prove; does not tell us | a positive open question (see below), or nothing |
  | any “not” or “except” in the question | the positive question |
- **Ask it positively.** Never pose the ask as a negative: “Name one thing this does not tell us”, “What can this not prove?”, “Why would a victory alone not tell us…?”. Ask the positive question: “After the soldiers went home, what did people still have to do every day to keep the city running?”.
- **Short, friendly and direct.** Address the learner as “you”. Put any background in a short sentence before the question, then ask the question in one sentence of about 20 words or fewer.
- **Show the answer's shape.** A written question says how much to write (“Write one or two sentences”) and where the answer comes from: from the lesson (“Use something from the story”) or from their own thinking (“There is no single right answer. Make your best guess and say why.”). Kids answer better when they know which kind of question it is ([Question–Answer Relationships](https://www.readingrockets.org/classroom/classroom-strategies/question-answer-relationship-qar)). The hint gives a sentence starter (“I think… because in the story…”), which is the kid-sized version of claim and support ([Project Zero, Claim–Support–Question](https://pz.harvard.edu/resources/claim-support-question)).
- **Put what they need in front of them.** For a multiple-choice question, the stem names the specific things to reason from (what was found, where, how many) so the learner reasons from them rather than trying to remember the lesson's title.
- **Go deep in plain words.** The big historical-thinking ideas are kid questions underneath ([Seixas's historical thinking concepts](https://www.thecanadianencyclopedia.ca/en/article/historical-thinking-concepts); the [Digital Inquiry Group's grades 3–5 chart](https://www.inquirygroup.org/history-lessons/historical-thinking-chart) does the same): Why did it happen? What happened because of it? What changed, and what stayed the same? What was it like for them? How do we know? Why does it matter? Use the concepts to plan; write only the kid questions. Deeper questions work when they are concrete and personal rather than abstract: “Would you rather have been a farmer at Çatalhöyük or a hunter who moved with the seasons? Why?”, “If you were the king of Akkad, how would you keep a far-away city loyal after your army went home?”, “Sargon carved his boasts in stone. Why do you think kings wanted their wins written down?”, “If you could dig anywhere at Giza for one day, where would you dig, and what would you hope to find?”. These still ask one question and still depend on the lesson.

### Write the multiple-choice options

- Each option is a short, plain answer to the question, in the learner's words: “They sent their own officials to run it.” Not a hedged claim: “Both places had Akkadian connections, but the evidence points to different or uncertain arrangements.”
- Put the whole question in the stem, so a learner knows what is asked before reading the options ([Haladyna, Downing and Rodriguez's item-writing review](https://cpl.health.unm.edu/AssetListing/Writing-Questions-for-Learning-and-Assessment-2573/Rules-for-Multiple-Choice-Items-Haladyna-et-al-2002-5943)). Three options are enough; use four only when a fourth real misunderstanding exists. No “all of the above” or “none of the above”.
- Each wrong option is a mistake a real kid could make after reading the lesson quickly, or a popular myth the lesson corrects (“Slaves captured in war built the pyramids”), written as confidently and at about the same length as the right one: a plain sentence of roughly 6–14 words, with no “but…” clause. No joke options.
- No tells: the right answer is not the longest, the only hedged one, or the only one without “every”, “always”, “never” or “all”. Do not hedge the right answer when the lesson states it plainly. When it is uncertain, put the hedge in the question (“What do the excavators think…?”). When “nobody knows yet” is itself the right idea, make it a plain option of its own rather than hedging every option.
- Keep the right answer to one idea. Do not join two claims with “and” unless both are the point.
- Every option has `feedback` and the prompt has a `hint`. Name the right option in `bestOptionId`.

### Hints, feedback and explanations

These are read by the same 12-year-old and follow the same plain-words rules.

- **Hint:** the first step, said simply and pointing at a named place in the lesson: “Look back at the ovens at Leilan. What had to happen every single day?”. A written prompt's hint may give a sentence starter: “Start with ‘The people at Leilan had to…’”. Never the answer; never a reasoning instruction such as “Ask what each find shows at its own place before you compare”.
- **Wrong-option feedback:** one or two sentences that send the learner back to a named section with one plain question to look for. It does not reveal the answer. “Reread ‘Governing at Tell Leilan.’ Who was directing the farm work there, a local ruler or someone sent by Akkad?”.
- **Right-option feedback:** one sentence saying why it is right, in the lesson's words.
- **Explanation:** shown after the right pick, and to the parent on Review as “What a strong answer covers”. Write it for a parent who did not read the lesson closely: the plain answer and the one or two details from the lesson that a good answer would use. Mention a limit only if a good answer genuinely depends on it.

### Other prompt rules

- A written prompt requires a sincere attempt, not perfection. A multiple-choice prompt is done once the learner picks the best option, so its hint and feedback must help them get there.
- Use stable prompt and option IDs. Once published, a prompt ID stands for its question, and changing it is a [prompt revision](prompt-revision-runbook.md).
- Avoid dependence on an unimportant date, name or vocabulary trick. The learner should succeed by understanding the lesson, not by remembering trivia or knowing things from outside it.
- Keep failure calm, specific and recoverable. Never use lives, timers, streak threats, score spectacle or punitive repetition.
- Do not pretend a minimum character count grades historical sophistication.
- Exclude learner free text from general analytics.

### Check each prompt before the kid read

Answer these yourself, then let the Stage 14C kid read confirm them:

- Say out loud, in one sentence, what the question asks the learner to do. Would a 12-year-old say the same thing after one read? If you need two sentences, rewrite it.
- Circle every word that is not in the lesson or in everyday speech. Replace each one.
- Circle every category label (clue, find, evidence, example, source, pattern). Replace each one with the thing's name, unless the lesson called that exact thing by that word.
- Does the question say what the learner is trying to figure out? Could they ask back “a clue to what?” or “show what about what?”.
- Count the question marks and the tasks. One of each.
- For a written prompt, write a two-sentence answer a 12-year-old would write, using only the lesson's words. If you cannot, the lesson does not teach it, or the question asks it too abstractly.
- For a multiple-choice prompt, cover the question: could someone who skipped the lesson pick the right answer from the options alone (the longest, the only hedged one, the only one without an absolute word)? If so, rewrite the options.
- Read each wrong option's feedback on its own. Does it give the answer away? Does it tell the learner where to look and what to look for?
- Would a wrong answer reveal a real misunderstanding, and does its feedback fix it?

| Instead of | Ask |
| --- | --- |
| Which conclusion best fits the whole pattern of evidence at Giza? | Merer's diary says his boat crew hauled limestone to Khufu's pyramid. Why does his diary help us know who built the pyramid? |
| At Leilan… At Urkesh… What is the strongest conclusion? | Akkad sent its own officials to run Leilan. At Urkesh, archaeologists found an Akkadian princess's seal on a door in the local king's palace. What do the excavators think Akkad did at Urkesh instead? |
| Choose Tell Leilan or Urkesh. (1) Name one thing archaeologists found there. (2) Say what it shows about how Akkad kept hold of the city after the fighting. | Winning a battle took one day. Why was keeping a city like Leilan so much harder? Write one or two sentences. |
| (1) Choose one clue from the Osirion, Hawara or the stone vessels, and say what it might mean. (2) What would you look for next to check your idea? | Scans found a hidden corridor inside the Great Pyramid, and nobody knows how old it is. How could researchers find out? Write one or two sentences. |
| Choose one region… (1) Name one crop… (2) What is one question… researchers are still trying to answer? | The first farmers in Southwest Asia grew wheat. The first farmers in New Guinea grew bananas and taro. How do those crops show that the New Guinea farmers worked out farming for themselves? |
| Hint: Think about what people would have to keep doing after the soldiers left, or what tie a find shows between the city and Akkad. | Hint: Look back at the ovens at Leilan. What had to happen every single day? |

## Stage 13 — Author journey framing and connections

Keep canonical lesson content reusable. In the journey module, author only what is specific to that path:

- entry position and required/optional status;
- why this lesson matters here;
- transition from the previous entry;
- bridge to the next entry;
- any context-specific title/significance override supported by the model.

Historical connections that explain the current subject belong at the point where they teach. A link to another lesson or optional journey must be visually distinct, clearly optional when appropriate, and excluded from section progress and completion.

Do not create a final “Connections” section whose real purpose is navigation. After explicit completion, the primary action continues the current journey. At most one authored optional exploration may appear subordinately when it is genuinely useful.

## Stage 14 — Write the research and editorial note

Before production implementation, make the note readable by someone who did not watch the research happen. It must include:

- learner-facing scope and title rationale;
- chronology/geography decisions;
- source ledger and claim ledger;
- the Stage 3A recent-challenge audit, coverage statement, analytical packet, product-owner response, and any repeated research cycle;
- disagreements and uncertainty handling;
- outdated or popular claims deliberately excluded;
- missing voices/survival bias;
- essential question, durable understanding, misconceptions, and vocabulary;
- section/component storyboard;
- media and card rationale, rights, provenance, and visual briefs;
- a top-level image lifecycle section with visible reference-versus-final comparisons and exact prompts for every accepted image;
- the kid's question, kid's answer and prompt rationale;
- the Stage 14C kid read reports and what changed;
- age 11–15 transformations;
- reviewer names/statuses or explicit pending gates;
- unresolved questions and the safe publication behavior they require.

The note is not learner-facing prose. It is the durable reasoning behind the lesson. Use the canonical structures in the [authoring templates](lesson-production/authoring-templates.md).

## Stage 14A — Build the unpublished Learn-shell prototype

Turn the storyboard into a complete typed `Lesson` with real learner-facing prose, stable sections, and working understanding prompts. Render it through the same Learn shell used by published lessons; do not create a parallel prototype renderer.

The prototype must:

- remain `status: "draft"`, unpublished, and non-completable outside development preview mode;
- be reachable through its intended journey position in preview mode so the rail, transition, and next action can be judged;
- use the real section and module types, not a slide deck, wireframe, or prose outline;
- contain the full intended reading experience and sincere-attempt prompts rather than lorem ipsum or synopsis copy;
- show section-linked media intentions as development-only review annotations when final media does not yet exist;
- include usable placeholder alternatives or accessible descriptions without implying that unreviewed media is final;
- avoid final asset generation/acquisition, publication, unlocks, approval-state changes, and hosted production changes.

Run `npm run lesson:gate -- --lesson <lesson-id> --note <path> --gate prototype` when the command is available. Open the exact lesson with `npm run lesson:preview -- --lesson <lesson-id>` and review desktop/mobile and light/dark presentation. A missing command is an implementation blocker for this production-system version; do not silently replace the real-shell review with screenshots of another renderer.

## Stage 14C — Kid read (a fresh reader tries the lesson cold)

Run this after Stage 14A and before Stage 14B. (It is lettered C so existing stage numbers stay stable.) The author cannot judge whether their own words are clear: they already know what they meant, and words such as “clue”, “the evidence” or “the arrangement” feel obvious from inside the research. A reader who has never seen the research is the only fair test.

1. **Start a separate agent** (a subagent or a new session) that has not seen the research note, this runbook, the conversation or the lesson source file. Give it only what the learner sees, in page order: run `npm run lesson:kid-read -- --lesson <lesson-id>` and save the output to a file outside the repository for the reader to open. It leaves out IDs, `purpose`, alt text, feedback and explanations. (`--feedback` adds option feedback for step 4.)
2. **Brief it with exactly this:**

   > You are a bright, curious 12-year-old who knows almost nothing about this topic. Read this history lesson once, from top to bottom, the way you would at home. Then:
   > 1. For each question at the end, before you answer it, say in your own words what it is asking you to do and what kind of answer it wants.
   > 2. Answer it the way a 12-year-old would, in one or two sentences. For a multiple-choice question, say which option you pick and why.
   > 3. List every word, phrase or sentence in the lesson or the questions that you would stumble on, have to read twice, or not understand. Say why. Be especially picky about the questions: flag any word that refers to something you would have to guess at (for example “the clue”, “this find”, “the evidence”, “the connection”: which one? a clue to what?).
   > 4. In two or three sentences, tell a friend what the lesson was about.
   > 5. Name the part you would still remember next week, and the part that felt boring or confusing.
   > Be blunt. Confusing writing is the writer's fault, not yours.
3. **Score it against Stage 6A:**
   - (1) must match what each check intends. If the reader misreads the task, the question fails, however correct its words.
   - (2) must reach the right option, or a sincere answer on target, using only the lesson. A capable model often reaches the right answer even through a bad question, so a right answer alone proves little: weigh the restatement in (1) and the flags in (3) more heavily.
   - (4) must roughly match the kid's answer. If it is mostly about what the evidence cannot show, or misses the main thing that happened, the lesson fails [Historical significance and proportion](#historical-significance-and-proportion).
   - Every flag on a check, hint or option is fixed. Flags in the prose are fixed, or kept with a written reason.
4. **Test the feedback.** Give a fresh reader the lesson, one question and one wrong option's feedback, and ask: what is this telling you to do next? It must send them to a place in the lesson with something specific to look for, without giving the answer.
5. **Repeat** with a new fresh reader on everything you changed until (1), (2) and (4) pass. Record the first and final reports verbatim, and what you changed, in the research note under `## Kid read`.

The kid read is a proxy for clarity, not evidence that the lesson suits children. Never describe it as a child test or as age-fit evidence (Stage 17). A real learner's confusion reported by the owner outranks it and is a reason to revise.

## Stage 14B — Check the prototype and request owner approval

Before involving the owner, check the rendered prototype yourself against the questions below, using the Stage 14C kid read as evidence for Prompt fit, Cognitive load and Story. Record each finding in the research note as `pass`, `revise`, `blocking` or `not applicable`, with evidence from the page. Return to Stage 14A for every `blocking` finding before the handoff. Do not total points or let a strength offset a blocking weakness. This is the only quality review; it is not repeated later.

**Learner experience**

- **Mental model:** did the Stage 14C reader's retelling match the kid's answer (Stage 6A)? Can the learner state the essential question and durable understanding in plain words? Does every section contribute, with no causal step hidden in metadata, alt text or feedback?
- **Cumulative learning:** are Retrieve, Extend and Revisit real, and does the reasoning progression build from observation toward qualified explanation?
- **Momentum:** does the opening create a problem worth following, and does each section answer or complicate the last? Does the ending resolve the question without pretending history is finished or inevitable?
- **Cognitive load:** only indispensable vocabulary, defined where needed; one teaching job per section; no overloaded sentences, date piles, unexplained names or rapid place changes at real layout sizes.
- **Headings:** plain words a skimming 12-year-old understands. A metaphor, riddle or punchline heading is `revise` or `blocking`.
- **Prompt fit:** did the Stage 14C reader say what each prompt asks, correctly, after one read? Each prompt is one real question (not “which conclusion/statement is best supported”), asked positively in the lesson's own everyday words, naming the actual thing rather than a label such as “a clue” or “the evidence”, and saying what the learner is trying to figure out. Written prompts show the answer's size and a sentence starter. Every option has feedback, the prompt has a plain hint, and the options show no wording tells (Stage 12). Is each check the kid's question (Stage 6A) or a step toward it?
- **Evidence reasoning:** a concrete source, object, map or comparison to reason from; observation, inference, reconstruction and uncertainty distinguished at the point of use; prompts answerable from the lesson; feedback explains support and limits. Recurring labels stay plain: “Surviving evidence”, “What you can see”, “Who did the work”, “What we can know”.
- **Proportionality:** emphasis and certainty match the evidence; no monocausal, deterministic or civilization-ranking story; people have specificity and agency; sensitive material is truthful and proportionate.
- **Visual value:** every visual answers a named learner question at its exact position and has an accessible equivalent. Maps anchor the subject to recognizable wider geography at embedded size.
- **Story:** name the two or three moments a 13-year-old would retell. Is there a story spine? Does any section read as a flat list of facts? Is the voice vivid and direct without being goofy or preachy?
- **Next action:** the learner always knows what to read, inspect, answer or do; optional journeys stay subordinate and outside progress; sincere attempts unlock explicit completion; the post-completion action continues the journey.

**Integrity**

- **Research:** every material claim is supported at its exact wording; central support is close-reviewed with precise locators.
- **Rights, media and accessibility:** rights and provenance recorded; reference-to-final fidelity preserved; semantic headings, keyboard and focus, WCAG 2.2 AA contrast, reflow, reduced motion, alt text and captions.
- **Technical:** stable IDs, valid section and prompt configuration, resolving claim/source references; scrolling never completes a lesson; completion and card acquisition are idempotent.

Then set the product-review record in `content/prototype-reviews/` to `pending`, commit, push, open the PR, and send the owner the packet (touchpoint 2). The packet contains:

1. learner-facing title and scope;
2. essential question and durable understanding;
3. major claims, disagreement and uncertainty;
4. content deliberately deferred or rejected;
5. ages 11–15 decisions;
6. the direct prototype link;
7. your quality findings and their dispositions;
8. media, map or no-media intentions at their section locations;
9. Knowledge Card or no-card decision;
10. understanding-check plan;
11. only the decisions that need the owner.

Stop there. The owner inspects the prototype, not only the packet. Only Carlin's explicit response sets product review to `approved`. Record requested changes and return to Stage 14A. Approval covers final media and publication: continue through Stages 15–18 without asking again.

# Phase 4 — Implement

## Stage 15 — Implement the repository content

Follow the existing bounded-module architecture:

1. Refine the Stage 14A draft in `content/lessons/<lesson-slug>.ts`; do not replace it with a second implementation.
2. Define reviewed `Source[]` entries.
3. Define atomic `Claim[]` entries with kind, certainty, sources, and review status.
4. Define approved `MediaAsset[]` entries only after the specialist media process. Implement every approved Required/Recommended media row from the checkpoint (maps via the historical-map runbook and `historical-map` module when that is the teaching form).
5. Define `UnderstandingPrompt[]` entries with stable IDs and `required` flags.
6. Define the `Lesson` with stable identity, chronology, significance, required section IDs, sections/modules, and complete reference lists.
7. Define zero or one normally expected `KnowledgeCard`; use more only with explicit product approval.
8. Export one `AuthoredContentModule` for the bounded lesson.
9. Add the module to the small `content/chronos.ts` aggregation boundary. Do not move authored content into the aggregator.
10. Add or update the relevant journey entry in `content/journeys/`.
11. Update the media catalog/manifests through the pipeline, never by hand-editing generated outputs. Follow the media publishing runbook's runtime-source prep before `media:add` / `media:build`.
12. Publishing needs no SQL. The database holds no lesson configuration; a lesson goes live when `status: 'published'` merges to main. The cards a pass awards come from each card's `unlockLessonId`.
13. Keep unpublished or incomplete neighbors fail-closed and non-completable.
14. Do not proceed to Stage 16 while an approved Recommended map or core evidence visual remains unimplemented without explicit deferral.
15. Verify the selected media method and reviewed reference/data-to-final fidelity using Stage 10; generation is optional, provenance is required.
16. Before registering any final image, complete its visible `## Image lifecycle` block in the lesson research note. The implementation gate must be able to match every ready media intention to its media ID in that section.

Use stable IDs everywhere. Array position is not identity. Do not duplicate lesson copy inside React components, migrations, or test fixtures when the repository module can be used.

# Phase 5 — Publish

## Stage 16 — Confirm the draft is ready

Stage 16 is a mechanical consistency check, not a second review. Run both gates on the still-draft lesson:

```text
npm run lesson:gate -- --lesson <lesson-id> --note <path> --gate implementation
npm run lesson:gate -- --lesson <lesson-id> --note <path> --gate release
```

If legacy code has documented failures, report the exact baseline and show there are no new failures in changed paths. Content validation and domain tests run once, after the cutover in Stage 18; CI runs the full suite, typecheck and build. When both gates pass, go straight to Stage 18.

## Stage 17 — Learner observation (not a per-lesson step)

Observation with real learners is a separate, sampled product program run by the owner; see the [learner-observation protocol](lesson-production/learner-observation.md). It gates no lesson. Never invent participants or results, and do not describe proxy or AI review as evidence of age fit.

## Stage 18 — Publish, then correct when needed

Publication is a repository change. Merging `status: 'published'` to main makes the lesson live; there is no migration or database step. The owner's prototype approval was the editorial review. Do not restart Stages 0–16.

A request to publish an already-approved lesson (for example after a pause) starts here. Confirm the release gate passes first; if it fails, return to Stage 15.

### Publication procedure

1. Flip the lesson to published:

   ```text
   npm run lesson:prepare-publication -- --lesson <lesson-id> --note <path> --apply-status
   ```

   This checks the release gate, sets `status` to `published`, records the lesson's prompt fingerprints, unregisters the lesson from `content/prototype-reviews.ts` (removing the draft-only notes) and prints the media to upload. Keep the archived review file under `content/prototype-reviews/`.
2. Validate with `npm run validate:content` and `npm run test:domain`.
3. Upload this lesson's media only, using the printed command: `npm run media:publish -- --asset <id> --asset <id>`. Credentials come from the existing project env; storage objects are immutable.
4. Push and put the preview link in the PR.
5. **Owner touchpoint 3.** Send the owner the direct preview link to `/learn/<lesson-id>` and ask them to report whether:
   - the lesson opens at the top;
   - each required prompt accepts a sincere attempt;
   - finishing sends the answers for review, and a pass from `/review` shows the celebration with the card (or the no-card ending);
   - reopening the lesson starts at the top again;
   - the draft-only notes are gone.

   Do not open the lesson in a browser yourself, delegate the check, or infer a pass from deployment status. Fix any finding and send the link again.
6. After the owner's pass, make the final commit: set the queue row to `Complete` and fill the research note's `Final sign-off` (media verified, owner check).
7. Merge. The lesson is live when main deploys. Do not verify production or open a follow-up PR.

If a command fails, fix that command rather than inventing a parallel pipeline.

### Corrections after release

1. Assess severity and learner harm. Unpublish immediately for a serious factual, rights, safety or provenance issue.
2. Update the research note, claims and sources, content, media and tests as needed, in one PR. Unpublishing is setting `status` back to `draft`; learners' saved progress and cards are kept.
3. Keep stable IDs when meaning is unchanged; create a new canonical lesson or a reviewed mapping when meaning changes materially.
   A published prompt's explanation, feedback, hint text and option order may be corrected under the same ID. Fixing its question, options, best answer, required flag or minimum length means a new prompt ID: follow the [prompt revision runbook](prompt-revision-runbook.md) in the correction PR ([policy](../architecture/prompt-changes.md)).
4. Send the owner the direct lesson preview link, following the preview-link contract, even for a one-line fix.

Monitoring drop-off, misconceptions, media delivery and learner feedback after release is product work, not part of this workflow.
