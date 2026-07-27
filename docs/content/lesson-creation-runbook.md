# Chronos lesson creation runbook

Status: canonical authoring process for every Chronos `Lesson` node. This runbook replaces earlier informal or incomplete lesson-authoring guidance.

Use it for World History, Story Arc, Idea Trail, and Investigation lessons. A lesson may be small or ambitious, but no step may be skipped silently. If a step does not apply, record why.

## Invocation contract: “Create the next lesson”

The user should not need to restate this runbook. A request equivalent to:

> Let's create the next Chronos lesson.

is a complete instruction to start or continue lesson production.

On that request, the agent must perform this boot sequence without asking the user to identify a subject:

1. Locate `dev-vibe/chronos-learning`, fetch current remote state, and read [`AGENTS.md`](../../AGENTS.md).
2. Confirm this runbook and [`docs/content/lesson-production-queue.md`](lesson-production-queue.md) exist on the latest `main`. If not, report the missing prerequisite instead of reconstructing the workflow from chat.
3. Read this runbook, the production queue, its master Linear issue [ASH-65](https://linear.app/ashs-workshop/issue/ASH-65/maintain-the-canonical-chronos-lesson-production-queue), and all active issue/PR context referenced by the selected row.
4. Inspect the repository's current lessons, journeys, cards, research notes, media, migrations, and content contracts before selecting or changing work.
5. If exactly one queue entry is already `Researching`, `Awaiting approval`, `Implementing`, or `Review`, continue that lesson on its existing issue/branch/PR. “Next” never abandons unfinished active work.
6. Otherwise, select the lowest production-order `Ready` entry whose production dependencies are satisfied. Skip `Planned`, `Blocked`, `Review`, and `Complete` entries. Curriculum prerequisites govern learner order and may differ from production dependencies; implementation order never permits learners to skip the canonical World Spine sequence. Never infer priority from legacy array order, tags, or whichever topic seems interesting.
7. If no entry is eligible, summarize the queue and ask for the smallest necessary curriculum decision. Do not invent, reorder, or promote a lesson silently.
8. Create or reuse one per-lesson Linear issue under the curriculum epic. Do not pre-create the rest of the queue as granular issues.
9. Create or reuse the prescribed lesson branch from latest `main`, and change the selected queue row to `Researching` in that branch.
10. Execute Stages 0–14 below and produce the durable research/editorial note and decision packet.
11. Commit and push the research checkpoint, update Linear, set the queue row to `Awaiting approval`, and ask the user to approve only the material decisions identified by the runbook. Do not make the user repeat operational instructions.
12. After approval, continue on the same issue, branch, and PR through Stages 15–18. Set the queue row to `Implementing`, then `Review`, and finally `Complete` only when the corresponding gates pass.
13. When the lesson becomes `Complete`, ensure the queue still has reviewed future candidates. If fewer than three candidates remain, flag curriculum-queue replenishment without inventing entries.

The agent may ask an early question only when a missing decision materially changes lesson identity, curriculum order, audience, or scope and cannot be resolved from the queue, repository, PRD, or existing issue. Ordinary research and implementation choices belong to this runbook.

### Mandatory research/editorial checkpoint

Stages 0–14 are one coherent discovery and design phase. Production lesson code, final asset acquisition/generation, publication migrations, and hosted changes wait until its decision packet is approved.

The packet must concisely show:

1. recommended learner-facing title and scope;
2. essential question and durable understanding;
3. major claims, sources, disagreement, and uncertainty;
4. content deliberately deferred or rejected;
5. ages 11–14 learning decisions;
6. proposed section/component flow;
7. media/map/video/no-media decisions;
8. Knowledge Card or explicit no-card decision;
9. understanding-check plan;
10. only the decisions that genuinely require product-owner judgment.

The user should be able to respond with “approved” or a few substantive changes. After approval, the agent continues without requiring a second implementation prompt.

## What this runbook protects

Chronos exists to teach history well. Shipping a page is not the goal; helping an approximately 11–14-year-old build an accurate, memorable, evidence-aware mental model is the goal.

A publishable lesson must be:

- historically responsible;
- clear about evidence, interpretation, uncertainty, reconstruction, and later tradition;
- narrow enough to teach one coherent transformation, problem, question, person, object, place, event, or idea;
- vivid without inventing certainty or drama;
- intellectually serious and emotionally approachable for ages 11–14;
- structured as a deliberate sequence rather than a pile of facts;
- visually planned around teaching needs rather than decoration;
- reusable across journeys without duplicating its canonical content;
- accessible, source-backed, validated, tested, and reviewable.

The author may be an AI agent, human editor, historian, designer, or combination of them. AI may gather, compare, outline, draft, and validate. It may not serve as the sole historical, rights, or publication reviewer.

## Required companion guidance

Read these before authoring:

1. [`AGENTS.md`](../../AGENTS.md)
2. [`docs/product/chronos-prd.md`](../product/chronos-prd.md)
3. [`docs/design/design-system.md`](../design/design-system.md)
4. [`docs/architecture/target-architecture.md`](../architecture/target-architecture.md)
5. the active Linear issue and journey/curriculum context
6. [`docs/content/lesson-production-queue.md`](lesson-production-queue.md)
7. [`docs/content/world-spine-canonical-roster.md`](world-spine-canonical-roster.md) and its audit when authoring a World Spine lesson

Use these specialist runbooks when triggered:

- Historical maps: [`docs/content/historical-map-production.md`](historical-map-production.md)
- Image research, rights, provenance, or generation: [`docs/prompts/media-provenance-research-and-generation.md`](../prompts/media-provenance-research-and-generation.md)
- Asset ingestion, responsive derivatives, publishing, and rollback: [`docs/architecture/media-publishing.md`](../architecture/media-publishing.md)

The specialist runbooks own their details. This document decides when they are needed and how their outputs fit the lesson.

## Non-negotiable product rules

- Repository-authored content is canonical. Database rows configure publication, progress, prompts, and deterministic unlocks; they do not become an undocumented second curriculum.
- One lesson has one stable identity even when reused in multiple journeys. Journey-specific framing belongs to `JourneyEntry`.
- Lessons normally contain five to eight stable semantic sections. Use fewer or more only when the learning sequence genuinely requires it and document the exception.
- Required lessons normally contain one to three required understanding prompts, usually two.
- Completion requires a sincere attempt, not a perfect score, and only occurs through the explicit completion action.
- Every lesson opens at the top. Explored-section state may inform progress UI but must not trigger a resume banner, automatic scrolling, or viewport restoration.
- Related lessons and optional journeys are navigation, not instructional sections or completion requirements.
- A reconstruction is never presented as direct evidence. Uncertainty is never hidden merely to make prose cleaner.
- Knowledge Cards are deterministic memory anchors, not loot. A lesson may have no card if no honest, useful memory object exists.
- Media is selected because it teaches. A lesson has no image, map, audio, or video quota.
- Never use SVG for lesson media. No lesson-media source, reference copy, intermediate, master, generated asset, map, diagram, card image, reconstruction, or runtime derivative may be an SVG.
- Never hand-author or procedurally draw an instructional diagram, infographic, or diagram-like lesson image with vector geometry, canvas commands, plotting code, or shape primitives. Every such visual must be produced as a raster image edit from a reviewed, rights-cleared pre-existing image of the same or closely similar visual type. If no suitable reference image exists, stop visual production and use no image or request a product-owner decision.
- Each section has one learner-facing title (`heading`). Do not stack a second attention-grabbing title, slogan, or paraphrase immediately under it.
- `purpose` is authoring metadata for storyboards, agents, and review. It is not learner-facing copy and must not read like a second headline.
- Module `title` / `eyebrow` appear only when they add a distinct teaching job (for example, an evidence close-read cue or a place label). If a module is the section’s sole content block, prefer the section heading alone and keep the module title short, literal, or empty of slogan energy.

## The authoring record

Create one lesson research/editorial note under `docs/research/` before writing production content. Keep the following artifacts in that note as the work advances:

1. node proposal;
2. research questions;
3. source ledger;
4. claim ledger;
5. content triage;
6. learning blueprint;
7. section and component storyboard;
8. media and Knowledge Card plan;
9. age/editorial pass notes;
10. review decisions, open questions, and publication sign-off.

Do not rely on chat history, browser tabs, or an agent’s memory as the editorial record.

# End-to-end workflow

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

Write:

- **Essential question:** one genuine historical question, not a topic label.
- **Durable understanding:** one sentence the learner should remember months later.
- **Three to five supporting understandings:** the minimum conceptual structure.
- **Evidence encounter:** the object, source, map, comparison, or dataset through which the learner will reason.
- **Scope boundary:** explicit dates, places, actors, and stopping point.
- **Non-goals:** interesting material that belongs elsewhere.

Reject or split the proposal when it is merely “everything about Ancient Egypt,” depends on a list of unrelated facts, repeats another node, or cannot name a coherent learner outcome.

## Stage 2 — Plan the research

Turn the essential question into a research plan. Include:

- chronology and periodization;
- geography and changing boundaries/environment;
- material evidence and primary sources;
- institutions, technology, economy, belief, or daily life as relevant;
- causes, enabling conditions, constraints, and consequences;
- who benefited, who bore costs, and whose experience is poorly preserved;
- scholarly agreements, live disagreements, obsolete popular stories, and genuine unknowns;
- vocabulary requiring precise definitions;
- visual evidence and likely media-rights constraints;
- age-sensitive material such as violence, death, enslavement, religion, sexuality, or human remains.

Write questions before answers. This reduces the risk of gathering only sources that support the first attractive narrative.

## Stage 3 — Gather sources in a deliberate order

Search broadly enough to discover the field, then rely on the best available sources.

Preferred order:

1. surviving primary material and authoritative object/site records;
2. specialist corpora, excavation projects, archives, and critical editions;
3. museums, universities, public research institutions, and scholarly reference works;
4. peer-reviewed scholarship and reputable academic books;
5. high-quality synthesis used to orient or cross-check;
6. general web sources only to locate stronger evidence or resolve a narrow practical fact.

Use this research loop:

1. Run an orientation search to learn the field's current terminology, major evidence, and obvious disputes.
2. Identify at least one authoritative anchor source for chronology/geography and one for the lesson's central claim.
3. Follow citations backward to the underlying object, corpus, excavation, primary source, or study.
4. Follow later citations forward to see whether the interpretation was refined, rejected, or remains influential.
5. Search deliberately for disagreement, regional/specialist perspectives, and evidence that would weaken the emerging narrative.
6. Locate at least one concrete primary/evidence encounter suitable for the learner.
7. Stop when the essential claims are independently supported, important disagreement is understood, new sources mostly repeat known evidence, and remaining gaps are recorded honestly. Do not stop merely because the first coherent story has appeared.

Wikipedia and search-result summaries may help discover terminology and references. They are not sufficient support for a material claim. A museum label is valuable but not automatically the last word. A single scholar’s interpretation is not “what historians believe.” Popular documentaries and unsourced educational sites are discovery leads, not claim authorities.

For every candidate source, record:

| Field | Required note |
| --- | --- |
| Stable source ID | Repository-safe ID |
| Full title, creator/publisher, URL | Enough to recover the source |
| Access date | ISO date |
| Source type | Primary object/text, corpus, excavation, scholarship, synthesis, visual reference |
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
| Direct support | Which sources actually support this wording? |
| Corroboration | Is the support independent, or are sources repeating one origin? |
| Counterevidence/alternative | What credible evidence or interpretation complicates it? |
| Survival bias | Is absence of evidence being mistaken for evidence of absence? |
| Perspective | Whose voice produced or preserved the record? Who is missing? |
| Learner treatment | State directly, qualify, compare interpretations, or omit? |
| Review status | Reviewed or editorial review required? |

Use proportionality, not false balance. A fringe claim does not receive equal space with a strongly supported consensus. A real scholarly disagreement is not erased because one version is easier to narrate. If evidence cannot support a clean answer, teach the limit or narrow the question.

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
- **Rejected:** misleading, redundant, weakly supported, age-inappropriate without educational value, or included only because it is colorful.

Then test the proposed synthesis:

1. Does it explain a mechanism, relationship, or evidentiary problem—not merely name events?
2. Does it preserve chronology without implying that history was inevitable?
3. Does it distinguish conditions, triggers, consequences, and later significance?
4. Does it give historical people agency without pretending everyone had equal power?
5. Does it avoid treating a society as uniform, timeless, isolated, uniquely primitive, or uniquely advanced?
6. Does it avoid “first,” “invented,” “collapsed,” “discovered,” and “civilized” unless precisely defined and supported?
7. Does it separate what happened from why historians think it happened?
8. Is a fascinating detail earning its space by teaching, evidencing, or helping memory?

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
- the natural bridge to the next required lesson.

Prefer “Explain how clay records helped institutions coordinate goods, and name a limit of what the tablets reveal” over “Know about proto-cuneiform.”

The U.S. Institute of Education Sciences recommends building world and word knowledge and giving grades 4–9 learners repeated chances to ask and answer questions while making sense of text. Apply that here by giving necessary context before demanding inference, defining essential vocabulary in use, and making the understanding check depend on the lesson’s evidence rather than trivia. See the [grades 4–9 practice guide](https://ies.ed.gov/ncee/wwc/PracticeGuide/29).

## Stage 7 — Perform the ages 11–14 design pass

Age adaptation changes explanation, pacing, assumptions, and support. It does not merely shorten words or remove nuance.

### Required transformations

- Start with a concrete question, object, place, decision, or human problem before an abstract system.
- Give time and place early. Do not assume learners already possess the surrounding chronology.
- Explain causal links explicitly, but avoid single-cause stories.
- Introduce specialized vocabulary only when it earns precision; define it near first use and then reuse it consistently.
- Break dense reasoning into visible steps without fragmenting it into disconnected fact cards.
- Prefer specific actors and actions over vague passive voice.
- Use analogies only when their limits are stated and they do not modernize the past.
- Explain uncertainty in direct language: “The marks survive; the exact transaction does not.”
- Preserve tradeoffs, power differences, missing voices, and unintended consequences.
- Never make a culture exotic, childish, faceless, or a mere stepping stone toward the present.
- Do not rely on gore, humiliation, sexualization, or sensational mystery to create interest.
- When difficult material is essential, describe it truthfully, proportionately, and without graphic decoration.

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
7. Can the learner know the section’s job from the heading alone, without reading an eyebrow or a second title?

### Inclusion and accessibility

Represent relevant identities, perspectives, and forms of knowledge authentically. Offer meaning through clear text plus appropriate visual/evidence forms without lowering the learning goal. Apply the learner-centered principles in [CAST’s UDL Guidelines 3.0](https://udlguidelines.cast.org/more/about-guidelines-3-0/), while avoiding a cluttered “everything in every format” interface.

## Stage 8 — Storyboard the lesson flow

Do this before writing final prose or sourcing decorative images.

Create a table:

| Order | Stable section ID | Learner-facing heading | Authoring purpose (not shown) | Key claim(s) | Module(s) | Evidence/media | Transition |
| --- | --- | --- | --- | --- | --- | --- | --- |

Heading rules:

- Prefer concrete, direct titles a learner can skim (“Read the skull,” “Evidence across a continent”).
- Avoid clever paraphrases that require decoding before content (“What counts as one of us?” when the job is naming *Homo sapiens* and the sparse record).
- Authoring `purpose` stays imperative and internal (“Supply the species category…”). Never publish that voice as on-page chrome.
- If the section is a single `knowledge` or `prose` module, do not invent a second grabber title for the module.

Each section must perform a distinct job. A common pattern is:

1. **Masthead/orientation** — time, place, significance, depiction label.
2. **Opening question** — concrete puzzle or human problem.
3. **Necessary context** — what the learner must know to reason further.
4. **Mechanism or development** — how something worked or changed.
5. **Evidence encounter** — examine an object, source, map, or record.
6. **Consequences and power** — possibilities, costs, unequal effects, or limits.
7. **Evidence/interpretation/uncertainty** — what can and cannot be concluded.
8. **World Check and explicit completion** — use evidence, receive feedback, complete deliberately.

This is a pattern, not a template to fill blindly. A biography, battle, migration, intellectual debate, environmental change, and archaeological investigation may need different sequences. Keep the stable shell while authoring the historical argument.

Flow tests:

- Can the learner state why each section follows the previous one?
- Does new information answer or sharpen the opening question?
- Is the evidence encountered before the lesson asks the learner to use it?
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
| `historical-map` | a spatial relationship necessary to the lesson claim | “the topic has a place,” modern basemaps without historical work, or decorative geography |
| `prompt` | a canonical understanding prompt placed where requirements are satisfied | navigation, surveys, trivia, or fake participation |

Titles: section `heading` owns orientation. For `knowledge` modules, the learner sees eyebrow + `body` as the lead into the item grid — do not invent a second grabber title for display. Module `title` on `evidence`, `scene`, and `historical-map` is a local cue only when needed (observe X; compare Y). Module `eyebrow` is a type/place label, not a slogan.

If the lesson genuinely needs a timeline, comparison table, audio source, diagram, or another unsupported teaching primitive, stop and decide whether to add a bounded reusable module. Do not fake it with arbitrary HTML, an image containing educational text, overloaded `knowledge` cards, hand-authored SVG, canvas drawing, or procedurally arranged shape primitives. A new module is an architecture/design change and requires its own validation and accessibility coverage.

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
- Use a **diagram** when a process or relationship matters more than literal appearance. Start from a reviewed, rights-cleared pre-existing diagram or closely similar visual, provide that raster reference to the image-generation tool, and create the Chronos version as an image edit. Do not draw it manually or generate it from an empty canvas.
- Use an **evidence-based reconstruction** when a scene materially helps learners imagine a poorly preserved environment and the brief can distinguish supported, inferred, generalized, and unknown details.
- Use a **symbolic treatment** sparingly when the subject is an abstract idea or evidence is too thin for a literal scene.
- Use **no media** when text is clearer and an asset would only create noise.

### Approved media plan → Stage 15 duty

After product-owner approval of the Stage 0–14 packet, treat media-plan rows marked **Required**, **Recommended**, or **Recommended core** as Stage 15 deliverables unless the approval packet explicitly defers or rejects them.

Do not invent an “MVP skip” for an approved recommended historical map, diagram, or evidence asset merely to ship prose sooner. If a later lesson already has a working module pattern (for example Uruk’s `historical-map`), reuse that pattern. Deferral requires an explicit product-owner note in the research checkpoint or a follow-up approval comment.

Rows marked **Preferred / optional** (for example an atmospheric hero when a diagram already carries the evidence encounter) may ship after the required and recommended assets, or wait for a bounded follow-up on the same issue when generation or rights block them.

For every image or generated asset, follow the [media provenance research and generation prompt](../prompts/media-provenance-research-and-generation.md); after approval, follow the [media ingestion and publishing runbook](../architecture/media-publishing.md).

### Mandatory raster image-edit workflow

This workflow applies to diagrams, infographics, timelines, maps, explanatory composites, card art, and reconstructions:

1. Find and review a rights-cleared pre-existing image of the same or closely similar type. It must be visually inspected, not inferred from surrounding text or alt text.
2. Record its canonical URL, creator, license/use status, local research-copy path, and the exact visual relationships it contributes.
3. Provide that raster reference image to the image-generation tool and use image editing, not blank-canvas generation, manual drawing, vector markup, canvas commands, plotting libraries, or procedural shape composition.
4. In the edit prompt, preserve the teaching relationship while removing copied labels, decorative clutter, unsupported certainty, and source-specific branding. Native application text carries educational explanation.
5. Export and retain only raster files through the entire lesson-media pipeline. Allowed publication formats are PNG, JPEG, WebP, or AVIF as supported by the pipeline. SVG is prohibited even as an intermediate file.
6. Compare the edited result against both the reference image and the governing historical/scientific sources. Reject it if the relationship changed, the edit added a false claim, or the result merely traces or copies protected expression.
7. Record the reference image, complete edit prompt, model/tool, accepted raster master, rejected drafts, and review decision in the research note.

The reference image governs visual structure, not historical truth. Claims, geography, chronology, and uncertainty still come from the reviewed authoritative sources. A text-only description of a reference image is not sufficient; the actual image must be supplied to the image-edit operation.

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

The reveal remains subordinate to lesson completion and the current journey’s next action.

## Stage 12 — Author understanding prompts and feedback

Start from the learning blueprint, not from facts that happen to be easy to quiz.

Normally use two required prompts:

1. one recognition, selection, ordering, matching, image/evidence, or comparison prompt;
2. one concise explanation asking the learner to connect evidence, causation, opportunity/cost, similarity/difference, or evidence/limit.

Prompt rules:

- require a sincere attempt, not perfection;
- use stable prompt and option IDs;
- test an essential understanding or historical-thinking move;
- make distractors plausible misconceptions, not jokes or wording traps;
- avoid dependence on an unimportant date, name, or vocabulary trick;
- explain why an answer is supported and what the evidence cannot prove;
- keep failure calm, specific, and recoverable;
- never use lives, timers, streak threats, score spectacle, or punitive repetition;
- do not pretend a minimum character count grades historical sophistication;
- exclude learner free text from general analytics.

Test each prompt by answering:

- Could a learner succeed through reasoning from this lesson rather than outside trivia?
- Would a wrong answer reveal a useful misconception?
- Does the feedback teach something rather than merely announce correctness?
- Does the server/database derive completion eligibility from the same required-prompt configuration?

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
- disagreements and uncertainty handling;
- outdated or popular claims deliberately excluded;
- missing voices/survival bias;
- essential question, durable understanding, misconceptions, and vocabulary;
- section/component storyboard;
- media and card rationale, rights, provenance, and visual briefs;
- prompt rationale;
- age 11–14 transformations;
- reviewer names/statuses or explicit pending gates;
- unresolved questions and the safe publication behavior they require.

The note is not learner-facing prose. It is the durable reasoning behind the lesson.

## Stage 15 — Implement the repository content

Follow the existing bounded-module architecture:

1. Create or update `content/lessons/<lesson-slug>.ts`.
2. Define reviewed `Source[]` entries.
3. Define atomic `Claim[]` entries with kind, certainty, sources, and review status.
4. Define approved `MediaAsset[]` entries only after the specialist media process. Implement every approved Required/Recommended media row from the checkpoint (maps via the historical-map runbook and `historical-map` module when that is the teaching form).
5. Define `UnderstandingPrompt[]` entries with stable IDs and `required` flags.
6. Define the `Lesson` with stable identity, chronology, significance, required section IDs, sections/modules, and complete reference lists.
7. Define zero or one normally expected `KnowledgeCard`; use more only with explicit product approval.
8. Export one `AuthoredContentModule` for the bounded lesson.
9. Add the module to the small `content/chronos.ts` aggregation boundary. Do not move authored content into the aggregator.
10. Add or update the relevant journey entry in `content/journeys/`.
11. Update the media catalog/manifests through the pipeline, never by hand-editing generated outputs.
12. Add a committed Supabase migration for publication, required prompts, deterministic unlock configuration, and any reviewed legacy alias.
13. Keep unpublished or incomplete neighbors fail-closed and non-completable.
14. Do not mark the lesson Review-ready while an approved Recommended map or core evidence visual remains unimplemented without explicit deferral.
15. Reject any lesson-media SVG or hand/procedurally drawn diagram. Verify that every diagram-like asset has a recorded raster reference and image-edit lineage before registering it.

Use stable IDs everywhere. Array position is not identity. Do not duplicate lesson copy inside React components, migrations, or test fixtures when the repository module can be used.

## Stage 16 — Run the review gates

The lesson is not publishable until every gate is passed or explicitly marked not applicable by the accountable reviewer.

### A. Research integrity

- Every material claim is source-backed.
- Citations support the exact wording, not merely the broad topic.
- Independent sources are used where material interpretation requires corroboration.
- Chronology and geography are checked.
- Consensus, disagreement, uncertainty, survival bias, and later tradition are proportionate.
- Primary evidence is not made to prove more than it can.

### B. Historical/editorial quality

- Scope answers the essential question without becoming an encyclopedia entry.
- The causal story is not deterministic or monocausal.
- People and societies have specificity, diversity, and agency.
- Language avoids anachronism, present-day moral shortcuts, exoticism, and civilizational rankings.
- Difficult material is truthful, proportionate, and purposeful.
- Title, masthead, significance, claims, modules, prompts, and card do not contradict one another.

### C. Ages 11–14 learning quality

- Time, place, problem, and stakes are understandable without assumed specialist knowledge.
- Each section has one clear purpose and follows logically.
- Heading hierarchy is lean: one section title; no competing purpose-line or duplicate module grabber.
- Section titles are direct; cleverness never costs a second parse.
- Essential vocabulary is introduced and reused.
- Concrete evidence precedes abstract inference.
- The learner is asked to think, not just scroll.
- Prompts assess the promised understanding and provide useful feedback.
- Simplification has not created false certainty or erased important people/perspectives.

### D. Page composition and visual quality

- Component choice follows teaching purpose.
- Section `purpose` is not rendered as learner chrome.
- The page has a coherent visual/narrative rhythm rather than a repeated template feel.
- Media earns its placement and has an accessible equivalent.
- Evidence, reconstruction, interpretation, uncertainty, and later tradition are distinguishable without overwhelming the design.
- Detailed attribution/provenance may live in a restrained disclosure or source treatment, but the essential depiction label cannot be hidden.
- Light/dark, desktop/mobile, long text, drawer, prompt, completion, card reveal, and revisit states are reviewed.

### E. Rights and media integrity

- Rights status supports runtime redistribution.
- Source files, checksums, derivatives, manifests, and lineage are reproducible.
- Generated assets have reviewed briefs, prompts/model details where available, and anachronism checks.
- Every diagram-like generated asset records the actual reviewed raster reference and image-edit lineage; blank-canvas, hand-drawn, procedural, canvas, plotting, and SVG production are prohibited.
- No lesson-media source, intermediate, master, or derivative is SVG.
- Maps pass geographic and uncertainty review.
- Video/audio pass caption, transcript, control, fallback, hosting, and privacy review.

### F. Accessibility

- Semantic heading order and landmarks are correct.
- Keyboard and focus behavior are complete.
- Alt text describes the teaching-relevant content, not decorative appearance alone.
- Captions, transcripts, accessible map summaries, and evidence descriptions are present where required.
- Color is not the only carrier of meaning; contrast meets WCAG 2.2 AA.
- Touch targets, zoom/reflow, reduced motion, and screen-reader states are verified.

### G. Technical and data integrity

Run at minimum:

```text
npm run validate:content
npm run media:verify
npm run test:domain
npm test
npm run typecheck
npm run build
```

If legacy code has documented type failures, report the exact baseline and prove there are no new failures in changed paths. Do not normalize a new error as “legacy.”

Also verify:

- duplicate/broken cross-module references fail validation;
- direct, invalid, and unpublished routes behave correctly;
- required versus optional prompts gate correctly;
- raw scrolling cannot complete a lesson;
- explicit completion and card acquisition are idempotent;
- other lessons and unpublished neighbors do not regress;
- empty-database migrations and database behavioral tests pass;
- committed migrations are applied only to the intended Chronos development project;
- post-apply security/performance advisors are reviewed;
- no secrets or service-role credentials enter client code or Git.

## Stage 17 — Preview with learners and adults

Before declaring the lesson a reference-quality pattern, perform a small structured walkthrough. For the initial audience, include learners around ages 11–14 when practical.

Do not ask only “Did you like it?” Observe and ask:

- What do you think this lesson was mainly about?
- What evidence do you remember?
- What is one thing historians know, and one thing they are less sure about?
- Where did you feel lost, bored, rushed, talked down to, or overloaded?
- Which image/map/object helped you understand something? Which felt decorative?
- What did you think you were supposed to do next?
- Can you answer the essential question in your own words?

Record where learners hesitate, misread a causal link, skip a label, misunderstand reconstruction as evidence, or pass a prompt without the intended understanding. Fix the lesson, not the learner.

An adult/historian review and a child comprehension review answer different questions; one cannot substitute for the other.

## Stage 18 — Publish, monitor, and correct

Publication sequence:

1. Resolve or explicitly defer every review note.
2. Mark sources, claims, media, lesson, and card with the correct reviewed/approved states.
3. Apply only committed migrations to the Chronos development project.
4. Verify hosted publication configuration, required prompts, legacy aliases, and unlocks.
5. Run security/performance advisors and behavioral completion tests.
6. Complete responsive browser verification and capture representative PR screenshots.
7. Update the Linear issue and PR with research basis, validation, limitations, reviewer checklist, and preview link.
8. Merge only after review; deploy through the normal release path.

After release, monitor:

- section exploration/drop-off patterns without treating scroll as completion;
- prompt attempts and recurring misconceptions without collecting unnecessary child data;
- completion failures or duplicate/retry anomalies;
- media delivery, broken sources, rights changes, and accessibility defects;
- learner/educator corrections and historical-review updates.

For a correction:

1. assess severity and learner harm;
2. unpublish immediately if a serious factual, rights, safety, or provenance issue requires it;
3. update the research note, source/claim ledger, content, media, tests, and migration/configuration as applicable;
4. preserve stable IDs when the lesson remains semantically equivalent;
5. create a new canonical lesson or reviewed mapping decision when meaning changes materially;
6. record the correction and reviewer decision in Git and Linear.

# Reusable templates

## Node proposal

```markdown
# <Lesson title> research and editorial note

Issue:
Lesson ID:
Journey/chapter/position:
Required or optional:
Accountable reviewer:

## Node proposal
Essential question:
Durable understanding:
Supporting understandings:
Evidence encounter:
Prerequisites:
Common misconceptions:
Scope — dates/places/actors:
Why this is one lesson:
Non-goals/deferred material:
Bridge from previous lesson:
Bridge to next lesson:
```

## Source ledger

```markdown
| Source ID | Citation/link | Type/authority | Claims supported | Limits/bias | Corroboration | Rights | Review |
| --- | --- | --- | --- | --- | --- | --- | --- |
```

## Claim ledger

```markdown
| Claim ID and wording | Kind | Certainty | Sources | Counterevidence/limits | Missing perspective | Learner treatment | Review |
| --- | --- | --- | --- | --- | --- | --- | --- |
```

## Content triage

```markdown
| Candidate idea | Essential/supporting/enrichment/deferred/rejected | Why | Destination |
| --- | --- | --- | --- |
```

## Learning blueprint

```markdown
Essential question:
Durable understanding:
Supporting understandings:
Prerequisites:
Misconceptions:
Indispensable vocabulary:
Evidence encounter:
Historical-thinking move:
Required sincere-attempt evidence:
```

## Section/component storyboard

```markdown
| Order | Section ID | Learner-facing heading | Authoring purpose (not shown) | Claims/sources | Module | Media/action | Transition |
| --- | --- | --- | --- | --- | --- | --- | --- |
```

## Media decision

```markdown
Teaching purpose:
Claim/source basis:
Selected form and alternatives considered:
Depiction mode/label:
Placement and learner action:
Accessibility equivalent:
Rights/provenance:
Reviewed raster reference image URL/path and permitted use:
Exact image-edit prompt and tool/model:
Specialist runbook outputs:
Review status:
```

## Final sign-off

```markdown
- [ ] Research integrity
- [ ] Historical/editorial review
- [ ] Ages 11–14 learning/editorial review
- [ ] Section/component storyboard review
- [ ] Visual/media/map/video review as applicable
- [ ] Rights/provenance review
- [ ] Knowledge Card review or explicit no-card decision
- [ ] Prompt/completion review
- [ ] Accessibility review
- [ ] Content/media/tests/type/build validation
- [ ] Empty-database and hosted-development verification
- [ ] Responsive browser review
- [ ] Learner walkthrough or documented reason deferred
- [ ] Product owner approval
```

# Definition of done

A lesson is done only when:

- its reason for existing and place in the curriculum are clear;
- the research note makes the editorial reasoning recoverable;
- claims and sources are atomic, proportional, and reviewed;
- content triage produced a coherent, bounded learning sequence;
- the ages 11–14 pass improved comprehension without distorting history;
- every section, component, medium, prompt, and card has a teaching purpose;
- evidence and uncertainty are honest and understandable;
- repository modules, journey framing, media, migrations, and stable IDs are coherent;
- validation, tests, build, database behavior, accessibility, and responsive preview pass;
- accountable humans have reviewed the historical/editorial and publication decisions;
- the learner can explain the central idea and use evidence—not merely reach the bottom.

When schedule pressure threatens these conditions, reduce the lesson’s scope or keep it draft. Do not lower the historical or learning standard that defines the product.
