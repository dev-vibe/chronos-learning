# Chronos Product Requirements Document

Guided Historical Journeys, Knowledge Cards, and Historically Grounded Visual Production

Version 1.0 | Product and implementation specification | July 2026

## Document purpose

This PRD defines the target product architecture and user experience for Chronos: a history-learning application that provides a simple chronological learning path, optional civilization and thematic journeys, and an illustrated knowledge-card collection. It is written to be decomposed directly into epics, stories, design tasks, data-model tasks, content-production tasks, and acceptance tests.

The document intentionally separates the complexity of the historical knowledge model from the simplicity of the learner-facing interface. It also provides detailed image-generation prompts for visualizing the proposed application and its card system before implementation.

## Product decision in one sentence

Chronos is a knowledge graph underneath, a guided journey in use, and a personal illustrated historical atlas over time.

## North-star principles

- One consistent learning interaction; many authored journeys through shared historical knowledge.
- Complexity belongs in the curriculum model, not in learner controls.
- The World Spine teaches chronological orientation; Story Arcs teach historical continuity; Idea Trails teach recurring questions and systems; Investigations teach evidence and uncertainty.
- Knowledge Cards represent learned understanding, not arbitrary loot.
- Historical imagery must distinguish documented evidence, evidence-based reconstruction, and symbolic interpretation.
- Comprehensiveness describes the archive, not the amount any learner must complete.


---

# 1. Executive summary

Chronos currently has a strong, simple interaction model: a vertical progression of lesson nodes at the left and a scrollable lesson at the right. The risk is attempting to make that single timeline visually represent every civilization, theme, event, and relationship in world history. Such a design quickly becomes a matrix, graph browser, or filter system that is difficult for children to interpret and difficult for the product team to curate.

The proposed solution preserves the familiar interface but changes what the left rail means. It is not always the master timeline. It is the learner's current authored journey. A journey may be the World Spine, Ancient Egypt, the History of Philosophy, Writing Changes the World, or an Archaeological Investigation. Every journey uses the same interaction pattern, so learners never need to learn a second navigation system.

Lessons exist once and may be reused in multiple journeys through journey-specific framing. Completing a shared lesson completes it globally. Some historically significant but non-foundational topics, such as Rapa Nui, can live in civilization arcs, idea trails, investigations, or the archive without crowding the World Spine.

A secondary Knowledge Card system adds wonder and motivation. Learners discover beautifully illustrated cards for people, artifacts, inventions, places, events, ideas, and mysteries as a direct consequence of learning. Cards have the visual drama of premium collectible cards but do not introduce random drops, duplicates, currencies, or an implied hierarchy of historical worth. The collection becomes a personal atlas of knowledge and a gateway back into lessons and connections.

## 1.1 Primary outcomes

- A learner can always tell what to do next.
- A learner can follow a coherent world-history sequence without confronting the full archive.
- A learner can pursue a civilization or theme deeply without losing chronological orientation.
- A single historical lesson can serve several journeys without duplicate authoring.
- The content library can grow to thousands of nodes without making the core interface more complex.
- The visual reward system strengthens memory and curiosity rather than distracting from learning.
- Children and adults can share the same curriculum graph while receiving different presentation depth.

## 1.2 Explicit non-goals

- Chronos is not a raw knowledge-graph visualization tool for learners.
- Chronos is not a trading-card game in the initial product.
- Chronos does not use randomized card packs, duplicate cards, crafting, power levels, combat statistics, or card-market mechanics.
- Chronos does not require every meaningful lesson to appear on the World Spine.
- Chronos does not treat a filtered set of tagged nodes as an authored course.
- Chronos does not present generated imagery as direct historical evidence.

# 2. Problem statement

## 2.1 User problem

A learner needs a clear path through history but may also develop strong interest in a particular civilization, idea, invention, or unresolved historical puzzle. Conventional timelines provide orientation but flatten depth. Encyclopedic navigation provides breadth but burdens the learner with choices. Complex maps and matrices show relationships but require interpretation before learning can begin.

## 2.2 Product problem

Chronos must support a comprehensive and expanding historical corpus while remaining intuitive for an approximately 10- to 14-year-old learner. Nodes can belong to multiple stories. Some are essential prerequisites; some are locally important; some are memorable discoveries; and some primarily teach how historical knowledge is constructed. The product needs to represent all of these without displaying all of them at once.

## 2.3 Design challenge

The design challenge is not how to display the entire graph. It is how to reveal the smallest useful authored slice of the graph at each moment while preserving a stable mental model.

# 3. Users and jobs to be done

| User | Primary job | Product need |
| --- | --- | --- |
| Explorer learner (10-13) | Understand the story of history and pursue interesting subjects without getting lost. | Clear next action, vivid lessons, meaningful discoveries, limited choice at each moment. |
| Independent learner (13+) | Follow deeper themes and compare developments across societies. | More optional depth, sources, cross-links, and synthesis. |
| Adult/general learner | Build or repair historical context without a childish interface. | Shared structure with denser language, historiography, and source depth. |
| Parent/educator | Know what the learner is studying and whether knowledge is accumulating coherently. | Progress by journey, completed knowledge, optional recommendations, transparent content levels. |
| Curriculum editor | Create reusable lessons and authored paths without duplicating content. | Structured node model, journey-entry framing, prerequisites, editorial workflow. |
| Historical reviewer | Verify claims and visual details. | Source provenance, uncertainty annotations, visual briefs, review statuses. |

# 4. Product architecture

## 4.1 Four curricular layers

| Layer | Purpose | Visibility | Typical size |
| --- | --- | --- | --- |
| World Spine | A finite chronological skeleton of globally consequential transformations and ignition points. | Default required journey. | Approximately 150-250 mature lessons. |
| Story Arcs | Authored narratives following a civilization, region, movement, period, or tightly bounded historical subject. | Opened contextually or from the Library. | 8-40 lessons per arc. |
| Idea Trails | Authored journeys following an idea, technology, institution, human question, or recurring pattern across societies. | Opened contextually or from the Library. | 8-30 lessons per trail. |
| Investigations and Archive | Optional discoveries, contested questions, unusual artifacts, local histories, and comprehensive reference material. | Contextual prompts, search, collections, and Library. | Potentially thousands of lessons and entities. |

## 4.2 Journey definition

A Journey is an authored ordered sequence of lesson references plus journey-specific instructional framing. It is not a saved filter. It has an opening question, intentional sequence, chapter structure, transitions, required and optional entries, synthesis moments, and an ending.

## 4.3 Journey types

| Type | Learner-facing language | Example |
| --- | --- | --- |
| spine | World History | The World Spine |
| story_arc | Story or Civilization | Ancient Egypt; China Across Time |
| idea_trail | Idea Trail | Writing Changes the World; Who Should Rule? |
| investigation | Investigation | Rapa Nui: Collapse, Adaptation, and Myth |
| collection | Special Collection | Objects That Changed What We Know |

## 4.4 One lesson, many journeys

A lesson node stores reusable historical content and relationships. A Journey Entry stores why that lesson appears in a particular journey. The same Battle of Kadesh lesson may appear in Ancient Egypt, Bronze Age Powers, Warfare, Diplomacy, and Archaeology, with a different introduction and significance statement in each.

```
LessonNode
  identity, chronology, geography, claims, content modules, entities, sources

JourneyEntry
  journey position, requirement level, chapter, transition, title override, significance here

KnowledgeCard
  distilled entity or concept, image treatment, facts, connections, provenance

Progress
  lesson completion is global; journey progress is derived from required entries
```

# 5. Information architecture

## 5.1 Primary navigation

| Destination | Purpose |
| --- | --- |
| Home | Continue the current journey at its active lesson, see a few open stories, and receive one restrained recommendation. |
| Learn | Open the current journey and lesson in the stable rail-plus-content interface. |
| Library | Browse authored Stories, Idea Trails, and Investigations. |
| Collection | Browse discovered Knowledge Cards and their connections. |
| Profile | Audience level, accessibility, progress summary, account and parent/educator settings. |

On mobile, use a five-item bottom navigation only if Collection merits a primary destination. In an earlier MVP, Collection may live inside Profile or Library to keep navigation to four items.

## 5.2 Navigation rules

- Learn opens the most recent active journey and lesson; the lesson always starts at the top.
- Explored-section progress is informational only. Reopening a lesson never restores a prior section, scroll position, or viewport.
- The current journey selector changes the authored path, not the visual layout.
- The Library never opens as an overwhelming undifferentiated catalog; it begins with three comprehensible categories and curated recommendations.
- Contextual journey invitations are preferred over asking learners to browse first.
- Global search can find nodes, cards, journeys, people, places, and artifacts, but search is not required for normal progression.
- Locked future lessons remain visible in a journey when useful for anticipation, but archive-only nodes are not injected into the rail.

# 6. Core experience

## 6.1 The stable learning shell

Every journey uses the same shell. The left side shows the current journey as an ordered vertical rail. The right side shows the selected lesson as a naturally scrolling page. A compact top bar identifies the journey and provides a journey switcher. The learner should not experience the rail as a data visualization; it is a table of contents with progression state.

| Region | Desktop behavior | Mobile behavior |
| --- | --- | --- |
| Global navigation | Narrow fixed left navigation or compact top navigation depending on final shell. | Bottom navigation. |
| Journey rail | Pinned secondary column, approximately 280-320 px wide. | Collapsible journey drawer or compact progress header; lesson remains primary. |
| Lesson canvas | Centered readable column, approximately 720-840 px, with contextual side affordances only when needed. | Single scrolling column with full-width media and cards. |
| Context panel | Optional selected-card or connection panel; never required for progression. | Bottom sheet or full-screen detail. |

## 6.2 Journey rail anatomy

- Journey title and type label.
- Overall journey progress.
- Chapter headings.
- Lesson nodes with date, title, completion state, and optional role chip.
- Visible but disabled locked lessons where prerequisite visibility is helpful.
- Optional entries visually quieter than required entries.
- Current lesson emphasized without excessive animation.
- No civilization-row comparison, graph edges, filtering controls, lens toggles, or duplicate nodes.

## 6.3 Lesson page anatomy

1. Lesson masthead: date or date range, title, place, role, and one-sentence significance.
2. Opening hook: vivid question, dilemma, object, or scene.
3. Narrative sections: short, scannable segments with one clear heading each. Authoring purpose metadata is not learner-facing UI.
4. Purpose-selected embedded media: evidence image, map, diagram, reconstruction, audio, short video, artifact viewer, or source excerpt. There is no media quota; video is exceptional and used only when motion, sound, performance, technique, testimony, or change over time is itself necessary to the learning.
5. Knowledge blocks: person, invention, place, artifact, event, or idea in a simple inline form.
6. Optional contextual synthesis: what came before, what was happening elsewhere, or where a pattern reappears. Include it only when the comparison itself teaches something; it is lesson content, not a disguised link to another lesson.
7. Check for understanding: retrieval, ordering, comparison, source interpretation, or explanation.
8. Explicit completion moment.
9. Post-completion next step: continuing the current journey is primary; a card reveal or one authored optional exploration may appear when meaningful.

A required lesson must not include a progress-bearing “Connections,” “Follow the idea forward,” or similar section whose main purpose is to route the learner elsewhere. Useful historical connections should appear at the point where they strengthen understanding. Any affordance to open a related lesson, Story Arc, Idea Trail, or Investigation must be visually distinct from that explanatory content, clearly optional, and unable to interrupt or alter required progress.

## 6.4 Contextual journey invitation

When a lesson opens a meaningful deeper path, Chronos may display one authored contextual invitation at the point where the relationship is most understandable—in the lesson, at completion, or later on Home or Library. It is never a lesson section, completion requirement, or substitute for explanatory content. The invitation must identify the related path, explain why it matters, preserve the learner’s lesson position, and remain subordinate to any current required action. Exploring, dismissing, saving, or ignoring it must not affect lesson or journey completion.

```
CONTINUE EXPLORING (OPTIONAL)

ANCIENT EGYPT
Follow Egypt from the first kingdoms to Cleopatra and beyond.

[Continue World History]   [Explore this story]
```

## 6.5 Shared lesson revisit behavior

When a learner reaches an already-completed lesson in another journey, Chronos does not force a full replay. The journey entry presents a short context-specific bridge and offers a concise refresher, the new perspective, or the full lesson.

```
PREVIOUSLY EXPLORED IN ANCIENT EGYPT

Why it matters here:
Kadesh also produced one of the earliest surviving international peace treaties.

[Read the new perspective] [Review full lesson] [Continue]
```

# 7. World Spine requirements

## 7.1 Purpose

The World Spine provides chronological orientation and causal scaffolding. It is an authored minimum model, not a ranking of human importance and not an exhaustive list.

### 7.1.1 Temporary curriculum-development access policy

While the opening curriculum is being backfilled, every published World Spine lesson from the start of the roadmap through and including `lesson.uruk.first-city` is intentionally open. Unpublished lessons remain visible as in preparation and cannot be opened. Published lessons after Uruk honor their canonical roster prerequisites even when a prerequisite is not yet published; completed lessons are always reopenable. Home, journey detail, and journey switching must resolve the same valid next action rather than trusting a stored pointer that is completed or inaccessible. An incomplete active pointer is re-evaluated when curriculum is backfilled; completion is never revoked. The named cutoff is temporary configuration and must be explicitly advanced or removed when the opening sequence is ready for normal gating.

## 7.2 Inclusion criteria

A Spine lesson should satisfy at least one primary criterion and usually several supporting criteria.

| Criterion | Question |
| --- | --- |
| Prerequisite value | Will later history be materially harder to understand without this node? |
| Systemic transformation | Did this alter how large numbers of people organized, produced, governed, believed, communicated, or connected? |
| Chronological anchor | Does it provide a durable marker that helps place other developments? |
| Global or cross-regional consequence | Did its effects extend beyond one local story or become important to several later arcs? |
| Representative ignition point | Can it efficiently introduce a larger transformation without requiring every local example? |

## 7.3 Exclusion from the Spine is not exclusion from Chronos

A high-value lesson may be excluded from the Spine when it is primarily local, enriches rather than enables later understanding, duplicates a transformation represented elsewhere, or is best taught as evidence, mystery, comparison, or depth. Such lessons remain first-class content in other journeys and the archive.

# 8. Story Arcs, Idea Trails, and Investigations

## 8.1 Story Arc requirements

- Begins with a compelling historical question or tension.
- Uses chapters to prevent a long undifferentiated lesson list.
- Includes periods of continuity and stability through synthesis rather than artificial event inflation.
- Connects outward at planned World Check moments.
- Ends with legacy, transformation, or unresolved consequences rather than an arbitrary political endpoint.
- May include required, recommended, and optional entries.

## 8.2 Idea Trail requirements

- Follows a question or system across time and place.
- Avoids presenting one society as the inevitable origin of a modern endpoint.
- Includes independent invention, exchange, reinterpretation, discontinuity, and revival where relevant.
- Uses journey-specific framing to explain what each reused lesson contributes to the idea.
- Ends with synthesis rather than a chronological stopping point alone.

## 8.3 Investigation requirements

- Clearly separates observation, evidence, interpretation, and uncertainty.
- Labels disputed claims and outdated popular narratives.
- Provides actual evidence images or source links alongside reconstruction artwork.
- Allows a learner to revise an initial hypothesis.
- Rewards good reasoning rather than guessing the one dramatic answer.
- Can exist entirely outside required progression.

## 8.4 Example: Rapa Nui placement

Rapa Nui can be a complete Investigation and also appear as an optional lesson in Settlement of the Pacific, Human Impact on Environments, Monument Builders, and How Historical Myths Form. It need not occupy a permanent World Spine node to remain prominent and discoverable.

# 9. Knowledge Card system

## 9.1 Product purpose

Knowledge Cards are illustrated, collectible representations of knowledge the learner has encountered. They create a sense of discovery, provide memory anchors, make accumulated knowledge visible, and reconnect prior learning across journeys.

## 9.2 Card categories

| Category | Examples | Default visual focus |
| --- | --- | --- |
| Person | Hatshepsut, Ashoka, Ibn Sina | Character portrait or evidence-based scene. |
| Place | Uruk, Cahokia, Angkor Wat | Environmental or architectural composition. |
| Invention/System | Cuneiform, paper, vaccination | Workshop, process, or blueprint-like scene. |
| Artifact/Object | Standard of Ur, Rosetta Stone, quipu | Museum-object portrait with material detail. |
| Event | Unification of Egypt, Haitian Revolution | Selective narrative scene; use sparingly. |
| Idea | Mandate of Heaven, zero, natural selection | Symbolic but historically grounded composition. |
| Enigma/Investigation | Indus script, Sea Peoples | Evidence, excavation, fragment, or landscape with uncertainty. |

## 9.3 Card classes, not rarity

Cards may use classes that communicate historical or educational function. These must not imply that one culture, person, or object is intrinsically more valuable than another.

| Class | Meaning |
| --- | --- |
| Foundation | Essential scaffolding for understanding later history. |
| Breakthrough | Changed what people could do or understand. |
| Turning Point | Redirected political, social, cultural, or environmental trajectories. |
| Masterwork | A consequential or extraordinary human creation. |
| Witness | An object or source that preserves evidence. |
| Enigma | A subject with meaningful unresolved questions. |
| Legacy | Continued to shape later societies or interpretations. |

## 9.4 Acquisition rules

- Cards are acquired deterministically through relevant learning.
- Each card is acquired once globally.
- No duplicate cards, random packs, currencies, crafting, or card trading in the base product.
- A lesson may contain several inline entities but should normally reveal no more than one or two collection cards prominently.
- Not every entity becomes a collectible card; editorial selection is required.
- A card reveal is reserved for a meaningful completion or discovery moment.
- Previously acquired cards can be invoked as memory cues in future lessons.

## 9.5 Card front

- Class label and collection number.
- Dominant historically grounded artwork.
- Title.
- Date or date range.
- Culture or place.
- One compact significance statement.
- Clear visual distinction between category and class without game statistics.

## 9.6 Card detail/back

- Why it matters.
- Three to five memorable facts.
- What historians actually know and how they know it.
- Uncertainty note when applicable.
- Connected cards and journeys.
- Lesson where discovered.
- Primary and secondary sources.
- Image provenance and depiction label: documented likeness, evidence-based reconstruction, symbolic illustration, or artifact-focused.

## 9.7 Card set behavior

Curated sets can provide gentle collection motivation. Completing a set unlocks learning content, not currency or power. Possible rewards include a synthesis lesson, comparison activity, panoramic illustration, printable sheet, or summary card.

## 9.8 Collection experience

- Default view begins with Recently Discovered and a small progress summary.
- Browse by People, Places, Artifacts, Breakthroughs, Investigations, or journey.
- Undiscovered cards may be hidden, silhouetted selectively, or omitted depending on spoiler policy.
- Opening a card displays its historical connections and source basis.
- The collection can later provide timeline and map arrangements, but the default is a clean card grid.
- Collection browsing never blocks lesson completion.

# 10. Visual and interaction design system

## 10.1 Product visual direction

Chronos should feel like a modern historical learning terminal and premium digital archive: dark, calm, tactile, and precise. It should not feel like fantasy role-playing software, a neon cyberpunk dashboard, a beige school textbook, or a dense enterprise analytics product.

## 10.2 Design attributes

- Dark charcoal and near-black structural surfaces.
- Restrained cyan used for active navigation, information, and chronology.
- Restrained amber used for discovery, artifacts, and emphasis.
- Warm off-white reading surfaces or text where long-form readability benefits.
- Clean contemporary sans-serif typography with optional restrained serif display accents for cards only.
- Thin rules, subtle depth, fine texture, and precise spacing.
- No purple gradients, glowing orbs, excessive glassmorphism, bokeh, fantasy runes, or illegible science-fiction typography.
- Animation communicates state change and discovery; it does not constantly decorate the screen.

## 10.3 Desktop layout dimensions - target

| Element | Target guidance |
| --- | --- |
| Viewport reference | 1440 x 1024 for design exploration. |
| Primary navigation | 72-88 px icon rail or 220-240 px labeled sidebar; choose one final shell. |
| Journey rail | 288-320 px fixed/pinned width. |
| Lesson readable column | 720-840 px maximum text width. |
| Right contextual gutter/panel | 280-360 px when open; otherwise preserve breathing room. |
| Page spacing | 24 px base with 8 px sub-grid. |
| Card grid | Minimum 220 px card width desktop; 2-column tablet; single or 2-column mobile depending on card aspect. |

## 10.4 Card visual direction

Cards should evoke the emotional appeal of premium collectible illustration without imitating any existing franchise. The art direction is cinematic historical illustration with museum-grade material detail, dramatic but plausible light, painterly realism, strong silhouette design, and premium archival framing.

- Card frame is refined and historically neutral rather than pseudo-medieval.
- Class treatments vary through geometry, texture, and restrained accents rather than escalating rarity spectacle.
- Artwork occupies approximately 60-70 percent of the card front.
- Text remains highly legible at phone size.
- Generated art never contains baked-in UI text; titles and metadata are rendered by the application.
- The digital frame should accommodate both portrait and landscape source artwork via controlled crops.

# 11. Detailed screen requirements

## 11.1 Home dashboard

- Prominent Continue card for the current journey and lesson.
- At most three Open Stories displayed without horizontal-scroll dependence on desktop.
- One featured recommendation, justified by recent learning.
- Recently discovered cards preview, limited to three or four.
- No global progress gamification dashboard, leaderboard, daily quest wall, or currency balance.
- Parent or educator status remains secondary and role-gated.

## 11.2 Learn - desktop

- Persistent product navigation.
- Pinned journey rail with chapter grouping and vertical progress.
- Lesson content scrolls independently or as the primary page scroll; selected approach must not create nested-scroll confusion.
- Inline knowledge blocks are visually simpler than collectible cards.
- Completion controls appear at the natural end of the lesson.
- Card reveal uses a modal or focused overlay and returns the learner to the next-step decision.

## 11.3 Learn - mobile

- Lesson content receives nearly the full width.
- Journey context appears in a compact sticky header with lesson count and progress.
- Tapping the header opens the journey rail as a full-height drawer.
- Inline cards use horizontal media/text composition only where readable; otherwise stack.
- Card reveal is full-screen and dismissible with an obvious action.
- No essential interaction depends on hover.

## 11.4 Library

- Top-level categories: Civilizations and Regions; Ideas Across Time; Investigations.
- Each category begins with curated featured journeys and Continue sections.
- Filters are secondary and simple: time period, region, approximate length, and status.
- Cards display journey title, concise promise, period, lesson count, and progress.
- Learners can preview a journey before starting it.
- Starting a journey does not replace or erase the current World Spine progress.

## 11.5 Collection grid

- Recently Discovered is the default sort for first-time entry.
- Grid cards show art, title, date, category/class, and discovery status.
- A compact category strip or filter button replaces a dense permanent filter panel.
- Opening a card uses an immersive detail view with evidence and connections.
- Collection set progress is present but visually subordinate to the cards themselves.

## 11.6 Card detail

- Large artwork with explicit depiction label.
- Primary significance paragraph.
- Facts and connections.
- Actual evidence gallery where available.
- Journey appearances and discovered-in lesson.
- Sources and image credits.
- Action to revisit the associated lesson or begin a related journey.

## 11.7 Card reveal

- Begins only after a meaningful learner action.
- Uses a short restrained transition: archive scan, frame assembly, or light sweep.
- Immediately displays the card title and why it was discovered.
- Provides View Card and Continue actions.
- Does not require repeated tapping through celebratory screens.
- Respects reduced-motion preferences.

## 11.8 Investigation workspace

- Opening question and initial hypothesis prompt.
- Evidence cards separated by source type.
- Claims visually labeled as observation, interpretation, disputed, or outdated.
- A lightweight evidence board may be used inside the lesson, but does not replace the global Learn shell.
- Learner revises or explains a conclusion before completion.
- An Enigma or Witness card may be revealed upon completion.

# 12. Data model

## 12.1 Core entities

```
type LessonNode = {
  id: string
  slug: string
  canonicalTitle: string
  dateRange: HistoricalDateRange
  chronologyConfidence: "exact" | "approximate" | "range" | "contested"
  significance: string
  summaryByAudience: AudienceContentMap
  regionIds: string[]
  cultureIds: string[]
  conceptIds: string[]
  entityRefs: EntityReference[]
  contentModules: LessonModule[]
  prerequisiteNodeIds: string[]
  sourceIds: string[]
  status: ContentStatus
}

type Journey = {
  id: string
  slug: string
  kind: "spine" | "story_arc" | "idea_trail" | "investigation" | "collection"
  title: string
  learnerPromise: string
  openingQuestion: string
  audienceLevels: AudienceLevel[]
  chapterIds: string[]
  coverImage: ImageAssetRef
  status: ContentStatus
}

type JourneyEntry = {
  id: string
  journeyId: string
  chapterId: string
  lessonId: string
  position: number
  requirement: "required" | "recommended" | "optional"
  titleOverride?: string
  introduction?: string
  significanceHere?: string
  transitionFromPrevious?: string
  completionPrompt?: string
}

type KnowledgeCard = {
  id: string
  slug: string
  category: "person" | "place" | "invention" | "artifact" | "event" | "idea" | "enigma"
  cardClass: "foundation" | "breakthrough" | "turning_point" | "masterwork" | "witness" | "enigma" | "legacy"
  title: string
  subtitle?: string
  dateRange?: HistoricalDateRange
  shortSignificance: string
  longSignificance: string
  factIds: string[]
  connectionIds: string[]
  sourceIds: string[]
  primaryImageId: string
  visualBriefId: string
  depictionMode: DepictionMode
  reviewStatus: ReviewStatus
}

type LessonCardUnlock = {
  lessonId: string
  cardId: string
  revealMoment: "lesson_start" | "module_complete" | "lesson_complete" | "investigation_complete"
  moduleId?: string
  required: boolean
}

type UserLessonProgress = {
  userId: string
  lessonId: string
  status: "not_started" | "in_progress" | "completed"
  completedAt?: string
  audienceLevelAtCompletion: AudienceLevel
}

type UserJourneyProgress = {
  userId: string
  journeyId: string
  activeLessonId?: string
  openedAt: string
  lastVisitedAt: string
}

type UserCard = {
  userId: string
  cardId: string
  discoveredAt: string
  discoveredInLessonId: string
}

```

## 12.2 Visual brief schema

```
type VisualBrief = {
  id: string
  subject: string
  timeAndDate: string
  place: string
  narrativeMoment?: string
  evidenceBasis: {
    primarySourceIds: string[]
    museumObjectIds: string[]
    archaeologySourceIds: string[]
    scholarlyReconstructionIds: string[]
  }
  requiredDetails: string[]
  prohibitedAnachronisms: string[]
  uncertainDetails: { detail: string; handling: string }[]
  composition: string
  materialsAndClothing: string[]
  architectureAndEnvironment: string[]
  depictionMode: "documented_likeness" | "evidence_based_reconstruction" | "symbolic_illustration" | "artifact_focused"
  generatedAssetIds: string[]
  reviewerNotes: string[]
  reviewStatus: "draft" | "research_reviewed" | "historically_reviewed" | "approved"
}

```

## 12.3 Derived progress rules

- Lesson completion is global and keyed by learner plus canonical lesson.
- Journey completion percentage is computed from required entries only unless the UI explicitly shows optional completion separately.
- Opening a journey creates journey progress but does not change the active journey until the learner starts or continues it.
- Card discovery is idempotent.
- Revisiting a shared lesson may record contextual completion for analytics but does not create a second canonical completion.
- Audience-level changes do not erase completion; the learner may revisit richer content voluntarily.

# 13. Content and editorial model

## 13.1 Lesson production workflow

The canonical, step-by-step process is `docs/content/lesson-creation-runbook.md`; the ordered source of work is `docs/content/lesson-production-queue.md`. A request equivalent to “Let's create the next Chronos lesson” invokes both: continue active work or select the first eligible Ready lesson, create/reuse its issue and branch, run the research/editorial approval gate, and continue through publication after approval. The runbook governs research planning, source and claim weighting, content triage, learning design for ages 11–14, section/component storyboarding, images/maps/audio/video decisions, Knowledge Cards, understanding prompts, repository implementation, review, publication, learner observation, and correction. If a shorter summary or older runbook conflicts with it, the canonical runbook wins.

1. Node proposal: define why the lesson exists and where it may appear.
2. Research brief: chronology, geography, claims, controversies, and sources.
3. Canonical lesson draft: reusable factual and narrative modules.
4. Journey framing: introductions, transitions, significance-here, and synthesis.
5. Knowledge-card selection: identify whether any entity merits a card.
6. Visual brief: evidence basis, required details, uncertainty, and anachronism exclusions.
7. Historical review.
8. Age-level editorial passes.
9. Media rights and attribution review.
10. Publish and monitor learner comprehension.

Historical lesson maps follow the repository's historical map production runbook. Their geography is grounded in authoritative real maps, independently cross-checked, and explicit about approximate or disputed features before any stylistic generation occurs.

## 13.2 Audience levels

| Level | Target | Treatment |
| --- | --- | --- |
| Explorer | Approximately 10-13 | Vivid narrative, short sections, vocabulary support, concrete causation, limited historiography. |
| Standard | Teens and general adults | Greater density, institutional detail, more primary sources, broader causal nuance. |
| Deep Dive | Advanced teens and adults | Historiography, contested interpretations, source criticism, extended context and citations. |

Audience adaptation must change depth and assumptions, not merely replace simple words with difficult synonyms.

## 13.3 Historical uncertainty

- Every material claim can carry confidence and dispute metadata.
- Approximate dates are displayed as approximate.
- Generated reconstructions are labeled as reconstructions.
- Composite scenes are labeled as illustrative composites.
- Popular but outdated stories are presented as historiographical case studies, not repeated uncritically.
- Where historians disagree, Chronos explains the major interpretations proportionately and age-appropriately.

# 14. Image and media production requirements

## 14.1 Source hierarchy

1. Primary visual evidence: surviving artifacts, period art, inscriptions, maps, photographs, and excavated material.
2. Authoritative institutional interpretation: museums, archives, universities, archaeological projects, and recognized scholarly publications.
3. Scholarly reconstruction: clearly attributed and methodologically explained.
4. Generated illustration: used to imagine, synthesize, or dramatize only after a visual brief is prepared.
5. General web imagery: used only when licensing, provenance, and factual suitability are verified.

## 14.2 Depiction labels

| Label | Use |
| --- | --- |
| Documented likeness | Reliable portrait, photograph, death mask, coin portrait, or closely evidenced representation exists. |
| Evidence-based reconstruction | Visual assembled from archaeological, textual, and comparative evidence. |
| Symbolic illustration | Represents an idea, process, broad transformation, or poorly documented person without claiming a literal scene. |
| Artifact-focused | Centers the surviving object or source and minimizes speculative reconstruction. |

## 14.3 Generation constraints

- No educational prose, titles, logos, watermarks, generated legends, or UI chrome baked into generated artwork. Historical maps may contain only the short source-verified geographic labels or concise spatial annotations explicitly listed in the reviewed map brief; spelling and placement require manual review, while captions, provenance, and uncertainty explanations remain application content.
- Prompts must specify a narrow date, place, role, and material culture rather than a broad label such as “Roman soldier.”
- Prompts must list prohibited anachronisms.
- Where evidence is insufficient, prefer artifact-focused or symbolic imagery.
- Human diversity, clothing, skin tone, architecture, and environment must follow the specific historical context rather than generic cinematic conventions.
- Generated output must receive both visual-quality review and historical-detail review.
- Application metadata must preserve the generation prompt, model/version if available, date, visual brief, reviewers, and approval status.

# 15. Functional requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-001 | Learner can continue the current journey at its active lesson from Home; the lesson opens at the top. | Must |
| FR-002 | Learner can switch among opened journeys without losing progress. | Must |
| FR-003 | Every journey renders in the same learning shell. | Must |
| FR-004 | A lesson may appear in multiple journeys through separate Journey Entries. | Must |
| FR-005 | Completing a lesson updates it globally. | Must |
| FR-006 | Journey progress derives from required entries. | Must |
| FR-007 | Learner can browse Stories, Idea Trails, and Investigations. | Must |
| FR-008 | The system can offer at most one authored, contextually relevant optional journey without presenting it as lesson progress or competing with the learner's current required action. | Must |
| FR-009 | Previously completed shared lessons can present a context-specific bridge. | Must |
| FR-010 | Lesson completion can deterministically unlock a Knowledge Card. | Must |
| FR-011 | Card unlock is idempotent and produces no duplicates. | Must |
| FR-012 | Learner can browse discovered cards and open card detail. | Must |
| FR-013 | Card detail shows depiction type, sources, and connections. | Must |
| FR-014 | Investigation lessons can distinguish evidence and interpretation. | Should |
| FR-015 | Learner can change audience depth without losing progress. | Should |
| FR-016 | Parent/educator can view journey-level progress. | Could |
| FR-017 | Collection can show curated set completion. | Should |
| FR-018 | Optional Atlas can arrange learned knowledge on maps/timelines. | Later |
| FR-019 | Learner can search across journeys, lessons, cards, and entities. | Should |
| FR-020 | Editors can create visual briefs and track historical review. | Must |

# 16. Non-functional requirements

- Accessibility: target WCAG 2.2 AA; keyboard navigation, semantic headings, visible focus, alt text, captions, contrast, and reduced motion.
- Performance: lesson shell interactive quickly on typical mobile connections; images responsive and lazy-loaded; rail state available without blocking lesson text.
- Resilience: progress and card unlock operations are idempotent and safe under retries.
- Privacy: child accounts collect the minimum necessary personal data and use age-appropriate defaults.
- Content integrity: published claims and images retain source and review metadata.
- Internationalization readiness: dates, eras, names, directionality, and translated content cannot be hard-coded into visual assets.
- Offline tolerance: later phase may cache active lessons and discovered cards; the data model should not preclude it.
- Observability: track journey starts, lesson completion, revisit behavior, reveal completion, confusion exits, and optional-path engagement without optimizing solely for time-on-app.

# 17. Analytics and success metrics

## 17.1 Product health

- Percentage of new learners who begin the first lesson without assistance.
- Percentage who return to the correct active journey and lesson.
- Lesson completion and comprehension by lesson, not merely click-through.
- Journey completion and voluntary journey switching.
- Rate at which contextual invitations are opened, deferred, or dismissed.
- Shared-lesson refresher versus full-review choice.
- Card detail revisits and card-to-lesson navigation.
- Collection usage that correlates with retrieval success rather than compulsive checking.

## 17.2 Learning indicators

- Chronological ordering accuracy.
- Ability to explain causal relationships in the learner's own words.
- Retention of previously discovered people, objects, and ideas.
- Ability to connect one card or lesson to another journey.
- Ability to distinguish evidence from interpretation in Investigations.
- Improvement across spaced retrieval prompts.

## 17.3 Guardrail metrics

- Learners should not spend more time navigating the Library than learning without intentional browsing.
- Card reveal abandonment should remain low and reveal duration short.
- Collection mechanics should not cause distress over incompleteness.
- Optional content should not make required progress ambiguous.
- Related-lesson and journey invitations should not be mistaken for required lesson sections or the next required action.
- Recommendations should not over-concentrate on already overrepresented regions or famous rulers.

# 18. Delivery plan

## 18.1 Phase 0 - architecture and prototypes

- Finalize Journey and Journey Entry concepts.
- Prototype desktop and mobile learning shell.
- Prototype three card categories and the card detail view.
- Create one World Spine chapter, one short Story Arc, one Idea Trail, and one Investigation slice using shared nodes.
- Test comprehension of “current journey” and global completion.
- Establish visual brief and image-review workflow.

## 18.2 Phase 1 - foundational MVP

- Home Continue experience.
- Learn shell and journey switcher.
- World Spine journey.
- One complete Story Arc and one complete Idea Trail.
- Global lesson progress.
- Basic Library.
- Knowledge Card unlock, grid, and detail.
- Approximately 30-50 production cards.
- Editorial/admin support for journeys, entries, sources, and visual briefs.

## 18.3 Phase 2 - depth and investigations

- Investigation lesson modules.
- Context-specific shared-lesson bridges.
- Card sets and synthesis unlocks.
- Audience-level content variants.
- Parent/educator progress view.
- Expanded search and recommendation logic.
- Evidence galleries and richer source interactions.

## 18.4 Phase 3 - atlas and advanced exploration

- Optional Atlas with timeline, map, and connection views.
- Compare “what was happening elsewhere?” interactions.
- Advanced learner-created collections without altering canonical journeys.
- Offline packs and classroom facilitation tools.
- Potential physical printable cards or educator kits, after digital learning value is validated.

# 19. Suggested implementation epics

| Epic | Scope |
| --- | --- |
| E1 Journey domain | Journey, Chapter, Journey Entry, ordering, requirement levels, and publishing. |
| E2 Learning shell | Desktop/mobile rail, lesson canvas, current journey, progress, next action. |
| E3 Shared lesson progress | Global completion, journey derivation, revisits, contextual bridge. |
| E4 Library | Categories, previews, start/open/continue behavior, restrained filters. |
| E5 Knowledge Cards domain | Card schema, classes, connections, unlocks, sets, user ownership. |
| E6 Card UX | Inline knowledge block, reveal, collection grid, card detail, evidence gallery. |
| E7 Editorial tooling | Node authoring, journey authoring, source provenance, review states. |
| E8 Visual production | Visual briefs, generation metadata, approval workflow, asset crops. |
| E9 Investigations | Evidence modules, claims, hypothesis and conclusion interactions. |
| E10 Audience levels | Variant content loading, switching, progress continuity. |
| E11 Analytics | Learning and product events, dashboards, guardrail monitoring. |
| E12 Accessibility and performance | Cross-cutting acceptance and automated checks. |

# 20. Acceptance criteria by major epic

## 20.1 Journey shell

- Given an opened journey, when the learner selects it, the rail shows only entries authored for that journey in the defined order.
- Given a lesson reused across journeys, the canonical lesson content remains the same while journey-specific framing changes correctly.
- Given a mobile viewport, the journey rail is accessible without permanently reducing the lesson width.
- Given a locked lesson, its reason is understandable or it is not shown as locked.
- At every point, one primary next action is visually dominant.
- Related paths never appear as progress-bearing lesson sections; their controls remain distinct from explanatory content and subordinate to the learner's current required action.

## 20.2 Progress

- Completing a canonical lesson marks it completed in every journey where it appears.
- Journey percentages include required entries and clearly separate optional completion if displayed.
- Retries do not create duplicate completion or unlock records.
- Switching audience level preserves progress.
- A previously completed lesson offers a contextual bridge without forcing replay.

## 20.3 Knowledge Cards

- A configured reveal unlocks the correct card at the correct moment.
- An already owned card does not produce a duplicate; the interface acknowledges prior discovery where appropriate.
- Every card detail includes image provenance, depiction mode, and at least one source.
- Generated artwork is not published until historical review is approved.
- The collection remains usable at phone width and with keyboard navigation.
- Reduced-motion users receive a static reveal state.

## 20.4 Investigations

- Evidence and interpretation are visually distinguishable.
- Disputed or uncertain claims are not displayed as settled facts.
- The learner can review actual evidence associated with the investigation.
- Completion asks the learner to explain or revise a conclusion.
- The investigation may be completed without altering World Spine progression unless explicitly authored as required.

# 21. Risks and mitigations

| Risk | Consequence | Mitigation |
| --- | --- | --- |
| Journey proliferation | Library becomes another overwhelming catalog. | Editorial limits, curated entry points, progressive disclosure, and clear journey promises. |
| Card system overwhelms lessons | Product feels like a binder or game instead of a course. | Simple inline blocks; premium card treatment only in reveal and Collection. |
| Generated historical errors | Learners absorb false visual details. | Visual briefs, source hierarchy, prohibited anachronisms, expert review, depiction labels. |
| Famous-person bias | Collection overrepresents rulers and warfare. | Editorial balance targets for daily life, systems, objects, women, workers, regions, and non-elite perspectives. |
| Completion anxiety | Large archive feels impossible to finish. | No global “percent of all history”; progress is journey-scoped. |
| Shared lesson feels repetitive | Learner disengages in later journeys. | Context-specific bridge, short refresher, and optional full review. |
| Adult mode feels childish | Adult adoption suffers. | Age-neutral shell; presentation depth changes content, not the core visual dignity. |
| Atlas is built too early | Resources consumed by complexity before learning loop works. | Defer Atlas until authored journeys and cards demonstrate value. |

# 22. Open decisions

- Whether Collection is a primary navigation destination in MVP or a section of Library/Profile.
- Whether desktop global navigation uses a narrow icon rail or labeled sidebar.
- Whether undiscovered cards appear as silhouettes, partial clues, or remain hidden.
- How many World Spine lessons are appropriate for the first complete curriculum.
- What level of educator assignment and reporting belongs in the consumer MVP.
- Whether physical/printable card support is strategically valuable after digital validation.


---

# 23. GPT Image 2 design-visualization prompt pack

The following prompts are for generating product concept images, not final production UI assets. Generate each view separately. The prompts deliberately repeat the shared design system because independent image generations do not reliably preserve context. Use the generated concepts as visual direction; implementation should recreate the design with real components, typography, and accessible text rather than embedding generated screenshots.

## 23.1 Shared design language to retain in every prompt

```
A premium modern history-learning application called CHRONOS. Dark tactical archive / time-machine interface, calm and educational, precise modern product design. Near-black and charcoal structural surfaces, restrained cyan accents for active chronology and navigation, restrained amber accents for artifacts and discovery, warm off-white high-legibility text, subtle fine-grain archival texture, thin rules, crisp spacing, understated depth. Clean contemporary sans-serif typography; optional restrained editorial serif only for card titles. No purple gradients, no glowing orbs, no bokeh, no fantasy runes, no cluttered analytics dashboard, no beige classroom aesthetic, no cartoon UI, no excessive glassmorphism, no unreadable sci-fi type. Age-neutral and sophisticated enough for adults, intuitive for an 11-year-old. Use realistic product UI proportions, coherent component hierarchy, and accessible contrast.
```

## 23.2 Prompt 1 - Desktop Learn view: World Spine lesson

```
Create a high-fidelity 1440x1024 desktop product design mockup for CHRONOS, a premium history-learning app. Show the default Learn view while a learner studies “The First Cities: Uruk” in the World History journey.

LAYOUT: a narrow fixed global navigation rail on the far left with CHRONOS wordmark and simple icons for Home, Learn, Library, Collection, Profile. Learn is active. Next, a pinned 304-pixel journey rail titled “WORLD HISTORY” with a small “World Spine” label, chapter heading “Foundations,” a thin vertical chronology line passing through compact lesson nodes, completed nodes above, one cyan active node for Uruk, and visible locked future nodes below. Each node has an approximate date and concise title. The journey rail is calm, like a premium table of contents, not a graph.

MAIN CANVAS: a wide scrollable lesson page on charcoal, containing a centered warm dark reading surface approximately 780 pixels wide. Masthead shows “c. 3500 BCE,” “MESOPOTAMIA,” title “The First Cities: Uruk,” and a short significance statement. Below: a cinematic but historically grounded reconstruction image of Uruk, an opening question, two readable content sections, a simple inline artifact information block for a clay tablet, a small map, and a “What was happening elsewhere?” connection strip.

RIGHT EDGE: generous negative space and a small collapsed contextual tab labeled “Connections,” not a permanent analytics panel.

VISUAL STYLE: [apply the full shared CHRONOS design language]. Use exact, believable UI details and spacing. The lesson is the visual priority. Avoid card-game decoration inside the lesson. No civilization rows, no filter toolbar, no graph edges, no excessive chips. Render as a polished real SaaS/education product screenshot with legible interface text.
```

Purpose: validates the invariant learning shell and demonstrates that the World Spine remains calm even though the system underneath is expansive.

## 23.3 Prompt 2 - Desktop Learn view: Ancient Egypt Story Arc

```
Create a high-fidelity 1440x1024 desktop product design mockup for CHRONOS using the same exact shell and visual system as the World History Learn view, but switch the current journey to a Story Arc titled “ANCIENT EGYPT.”

The far-left global navigation is unchanged. The pinned 304-pixel journey rail clearly shows “STORY ARC,” overall progress “4 of 15,” and chapter groups: “The Nile and the First Kingdoms,” “Pyramids and Power,” and “Empire and Upheaval.” Show completed lessons for the Nile and Narmer, the active lesson “Hatshepsut: Building a Reign,” and future lessons including Akhenaten, Tutankhamun, Kadesh, Ptolemaic Egypt, and Cleopatra. Keep the vertical sequence simple; no horizontal civilization lanes.

The lesson canvas displays “Hatshepsut: Building a Reign,” c. 1479–1458 BCE, with a historically grounded temple/royal scene, an opening narrative, a simple inline Person block, a trade expedition map, and a compact “World Check” panel showing contemporary developments elsewhere. At the top, the journey selector visibly says “Learning: Ancient Egypt” with a discreet dropdown chevron.

Use [the full shared CHRONOS design language]. The interface must feel identical in operation to World History while the content and journey rail communicate focused civilizational depth. No transformation into a different timeline visualization. Legible text, realistic component dimensions, sophisticated and age-neutral.
```

Purpose: proves that civilizational depth is delivered through a different authored journey, not a different interface model.

## 23.4 Prompt 3 - Mobile Learn view

```
Create a high-fidelity mobile app design mockup for CHRONOS at 430x932 pixels. Show the lesson “Hatshepsut: Building a Reign.”

TOP: compact sticky header with CHRONOS mark, current journey “Ancient Egypt,” progress “4 / 15,” and a clear button that opens the journey drawer. Below it, the lesson masthead has date, place, title, and one-line significance.

BODY: a single clean vertical reading flow with a full-width historically grounded hero image, short narrative sections, a simple inline Person block with portrait thumbnail and “Open card,” a trade-route map, a retrieval question, and an obvious Continue area near the bottom.

BOTTOM: five-item bottom navigation only if visually clean: Home, Learn active, Library, Collection, Profile. Otherwise use four items and place Collection inside Library.

DESIGN: [apply the full shared CHRONOS design language]. The interface should be thumb-friendly and highly legible, with no squeezed desktop rail. No nested-scroll feeling. Use restrained cyan and amber, no fantasy visual noise, no dense chips, and no tiny unreadable timeline labels. Render as a believable native-quality responsive web app screenshot.
```

Purpose: establishes that mobile preserves journey context without sacrificing the lesson canvas.

## 23.5 Prompt 4 - Journey drawer on mobile

```
Create a high-fidelity 430x932 mobile CHRONOS mockup showing the full-height Journey drawer opened over a dimmed lesson page.

DRAWER: about 90 percent of screen width, near-black surface, title “ANCIENT EGYPT,” label “Story Arc,” progress bar “4 of 15,” then chapter headings and a clean vertical sequence of lesson rows. Completed rows have subtle check marks, the current Hatshepsut row has a cyan active edge and filled node, recommended optional rows are visually quieter, locked future rows remain readable with small lock icons. Include a top close button and a compact “Switch journey” control.

The drawer must feel like a premium book table of contents, not a graph or task manager. Use [the full shared CHRONOS design language]. Keep text legible, spacing generous, and progression obvious to an 11-year-old. No filter controls, no civilization matrix, no nested menus.
```

Purpose: specifies the mobile replacement for a persistent desktop rail.

## 23.6 Prompt 5 - Home dashboard

```
Create a high-fidelity 1440x1024 desktop Home dashboard for CHRONOS.

Use a narrow global navigation rail at left. Main page title “Welcome back.” The dominant module is a large Continue card for “World History — The Bronze Age Network,” with progress, a beautiful historically grounded image crop, and one clear “Continue lesson” button. Below, show “Your Open Stories” with exactly three refined journey cards: Ancient Egypt 4/15, Writing Changes the World 2/12, Archaeological Mysteries 1/10. Each journey card contains a subtle period label, progress, and calm image, not excessive metadata.

Add one featured recommendation labeled “Because you explored early writing,” recommending “How Humans Stored Memory.” Add a restrained “Recently Discovered” row with three small premium knowledge-card previews: Rosetta Stone, Hatshepsut, and Cuneiform.

Use [the full shared CHRONOS design language]. No streak flames, XP bars, leaderboards, daily quests, currency, or dense analytics. Make the page feel calm, curated, and immediately actionable, with the Continue module visually dominant.
```

Purpose: defines a useful home without importing conventional gamification dashboards.

## 23.7 Prompt 6 - Library

```
Create a high-fidelity 1440x1024 desktop Library view for CHRONOS.

LEFT: standard CHRONOS global navigation with Library active. MAIN: page title “Explore History” and a short line explaining that these are authored journeys. Across the top are three large category tabs or cards: “Civilizations & Regions,” “Ideas Across Time,” and “Investigations.” Civilizations & Regions is active.

Show a curated featured journey, “China Across Time,” with a strong cover image, learner promise, date span, 10 chapters, and a clear Preview button. Below, a clean responsive grid of journey cards: Ancient Egypt, The Greek World, Rome and Its Afterlives, Civilizations of Mesoamerica, African Kingdoms, and Settlement of the Pacific. Each card has one evocative image, title, concise promise, approximate lesson count, and progress when opened.

At the upper right, provide a search field and one compact Filters button. Do not show a permanent dense filter sidebar.

Use [the full shared CHRONOS design language]. Sophisticated editorial layout, large imagery, calm spacing, no Netflix-like visual overload, no raw node graph, no rows of tiny civilization timelines.
```

Purpose: demonstrates progressive disclosure and authored-journey browsing.

## 23.8 Prompt 7 - Knowledge Card reveal

```
Create a high-fidelity CHRONOS desktop card-reveal overlay at 1440x1024 after completing a lesson on the Rosetta Stone.

The underlying lesson page is softly dimmed and remains recognizable. Center a large vertical premium historical card, approximately 420x650 pixels, emerging from a subtle archive-scan frame. The card class is “WITNESS.” Main artwork is a dramatic, museum-grade artifact portrait of the Rosetta Stone with realistic dark granodiorite, raking warm light that reveals the inscriptions, and a restrained atmospheric museum/archive background. The card frame is refined, modern, historically neutral, dark metal and archival paper textures with restrained amber and cyan micro-accents.

CARD UI TEXT rendered as application UI, not inside the artwork: “THE ROSETTA STONE,” “196 BCE · Egypt,” and the statement “One decree, written three ways, helped unlock ancient Egyptian scripts.” No combat stats, mana symbols, fantasy icons, rarity gems, or imitation of any existing card-game franchise.

Above the card: small label “ARTIFACT DISCOVERED.” Below: two buttons, “View card” and “Continue.” Add a small line, “Discovered in Deciphering Ancient Egypt.”

Use [the full shared CHRONOS design language]. Celebration is premium and restrained, not childish, explosive, or casino-like.
```

Purpose: nails the emotional reward while preserving educational meaning and visual restraint.

## 23.9 Prompt 8 - Collection grid

```
Create a high-fidelity 1440x1024 desktop Collection view for CHRONOS.

Global navigation at left with Collection active. Main title “Your Historical Atlas,” summary “42 discoveries across 7 journeys,” and a subdued row of category controls: Recently Discovered active, People, Places, Artifacts, Breakthroughs, Investigations, Sets. Include a compact search field and filter button.

Show a beautiful 4-column grid of premium knowledge cards with varied categories but one coherent system: Hatshepsut (Person / Legacy), Rosetta Stone (Artifact / Witness), Cuneiform (Invention / Breakthrough), Uruk (Place / Foundation), Antikythera Mechanism (Artifact / Enigma), Ashoka (Person / Turning Point), Quipu (Artifact / Witness), Cahokia (Place / Foundation). Each card has large artwork, refined frame, title, date, and a small class label. No game statistics.

At right or below, show one restrained set-progress module: “Objects That Changed What We Know — 7 of 15,” visually secondary to the card collection.

Use [the full shared CHRONOS design language]. Cards are visually rich, but the surrounding application remains calm and museum-like. Avoid fantasy tropes, gold overload, booster-pack visuals, and clutter.
```

Purpose: defines the collection as a personal atlas rather than a loot inventory.

## 23.10 Prompt 9 - Card detail with evidence

```
Create a high-fidelity 1440x1024 desktop CHRONOS Knowledge Card detail view for “HATSHEPSUT.”

LAYOUT: a large premium card and artwork on the left, approximately 420 pixels wide. On the right, a readable detail column with title, “c. 1507–1458 BCE,” “Egypt · Person · Legacy,” and a depiction badge “Evidence-based reconstruction.” Include sections titled “Why she matters,” “Look closer” with four concise facts, “How we know” with source evidence, “Connected to” with compact links to Deir el-Bahari, Punt Expedition, Thutmose III, Ancient Egypt, Women Who Ruled, and Trade Across the Ancient World.

Below the main artwork, show an “Actual evidence” strip with three source thumbnails: a surviving statue, temple relief detail, and Deir el-Bahari photograph, each with concise museum-style captions and credit placeholders. Add “Discovered in Hatshepsut: Building a Reign” and a button “Return to lesson.”

The illustrated portrait should be dignified, historically grounded, and clearly separated from the actual evidence gallery. Use [the full shared CHRONOS design language]. No invented fantasy regalia, no seductive costume treatment, no pseudo-photographic claim of certainty, and no card-game statistics.
```

Purpose: demonstrates the critical distinction between evocative illustration and historical evidence.

## 23.11 Prompt 10 - Investigation view: Rapa Nui

```
Create a high-fidelity 1440x1024 desktop CHRONOS Investigation lesson titled “RAPA NUI: COLLAPSE, ADAPTATION, AND MYTH.”

Use the standard CHRONOS Learn shell: global navigation, pinned journey rail titled “ARCHAEOLOGICAL INVESTIGATIONS,” and a normal lesson canvas. In the lesson, show an opening aerial landscape image of Rapa Nui with moai and coastline, followed by an initial question: “What happened to this island society?”

Create a clean evidence workspace inside the lesson, not as the whole application: four evidence tiles labeled “Observation,” “Primary account,” “Archaeological evidence,” and “Later interpretation.” Include source thumbnails such as pollen/core evidence, moai transport experiment, historical account excerpt, and landscape/agriculture evidence. Add a visible disputed-claim callout: “The simple self-destruction story is contested.” Show a lightweight learner conclusion module with choices to revise an initial hypothesis and explain which evidence mattered.

Use [the full shared CHRONOS design language]. Clearly distinguish facts, interpretations, and uncertainty. Do not make the screen look like a crime-game corkboard, fantasy mystery game, or dense research database.
```

Purpose: visualizes how “weird puzzle pieces” can become first-class learning without joining the required Spine.

## 23.12 Prompt 11 - Contextual journey invitation

```
Create a high-fidelity 1440x1024 CHRONOS completed-lesson state after the learner explicitly finishes “Egypt Unifies.” Keep the standard Learn shell visible. Include a focused but subordinate optional exploration panel without prescribing a fixed position beneath the completion controls. It is not a lesson section and does not contribute to lesson progress.

Panel eyebrow: “CONTINUE EXPLORING · OPTIONAL.” Title: “ANCIENT EGYPT.” Description: “Follow Egypt from the first kingdoms to Cleopatra and beyond.” Include a small cinematic cover image of the Nile, early monumental architecture, and desert horizon. Keep “Continue World History” as the primary action and “Explore this story” as the secondary action. Add a concise detail “15 lessons · 3 chapters.”

The invitation should feel like a door opening from knowledge already earned, not an advertisement, modal interruption, or replacement for the next lesson. Use [the full shared CHRONOS design language]. Keep the next action hierarchy obvious and preserve the learner’s existing journey.
```

Purpose: defines the preferred discovery mechanism for deeper paths.

## 23.13 Prompt 12 - Idea Trail and shared-lesson bridge

```
Create a high-fidelity 1440x1024 desktop CHRONOS Learn view for the Idea Trail “WHO SHOULD RULE?” The standard shell is unchanged. The journey rail shows cross-civilizational lessons: Mandate of Heaven, Athenian Democracy, Roman Republic, Ashoka and Moral Kingship, Magna Carta, Haudenosaunee Governance, Enlightenment, Haitian Revolution, and Modern Constitutions. The active lesson is “Athenian Democracy,” but it has already been completed in The Greek World story.

At the top of the lesson canvas, display a concise shared-lesson bridge: “Previously explored in The Greek World.” Below: “Why it matters here: Athens made participation central to government while excluding most residents. This trail asks who counted as the people.” Provide three actions: “Read the new perspective” primary, “Review full lesson,” and “Continue.” Beneath the bridge, preview a short context-specific section and a comparison question.

Use [the full shared CHRONOS design language]. Make the cross-time trail feel coherent and authored, not like a filtered tag result. No duplicate lesson cards, no graph visualization, and no confusing completion reset.
```

Purpose: demonstrates reusable nodes with authored framing and no forced repetition.

## 23.14 Prompt 13 - Card art specimen sheet

```
Create a polished concept-art specimen sheet showing seven separate CHRONOS historical knowledge-card fronts in a consistent premium archival design system. Present them against a neutral dark studio background with enough spacing to compare the system.

Cards:
1. Hatshepsut — Person / Legacy — evidence-based royal portrait at Deir el-Bahari.
2. Rosetta Stone — Artifact / Witness — artifact-focused museum portrait.
3. Cuneiform — Invention / Breakthrough — close view of a Mesopotamian scribe pressing a reed stylus into clay, historically specific materials.
4. Uruk — Place / Foundation — evidence-based reconstruction of a dense early city and monumental precinct.
5. Antikythera Mechanism — Artifact / Enigma — corroded fragments with a subtle technical reconstruction overlay.
6. Mandate of Heaven — Idea / Foundation — symbolic but historically grounded Zhou-era ritual and political transition, clearly illustrative.
7. Rapa Nui — Place / Enigma — moai landscape with agriculture and settlement evidence, avoiding the simplistic collapse cliché.

All cards share one refined modern frame, category icon system, title position, date position, class label, and short significance area. Give each class restrained micro-differences in geometry and accent, not rarity spectacle. No combat stats, numbers implying power, fantasy borders, imitation of Magic: The Gathering or any existing franchise, illegible decorative fonts, baked-in nonsense text, or anachronistic imagery. Historically plausible clothing, architecture, tools, materials, and landscape. Cinematic painterly realism with museum-grade detail and dramatic but plausible lighting.
```

Purpose: helps establish the visual grammar across varied card categories before producing individual assets.

## 23.15 Prompt 14 - Complete responsive design board

```
Create a professional product-design presentation board for CHRONOS showing a coherent responsive system, not a marketing poster. Include six labeled frames: Desktop Home, Desktop Learn / World History, Desktop Learn / Story Arc, Mobile Learn, Collection Grid, and Card Detail. Add a small component strip for journey nodes, progress states, inline knowledge blocks, buttons, chips, and card class labels.

All frames must use one consistent information architecture and [the full shared CHRONOS design language]. Emphasize the invariant journey rail plus lesson canvas on desktop and the compact journey header plus drawer on mobile. Show cards as a secondary visual layer: simple inline blocks in lessons, premium collectible treatment in reveal and Collection. Use believable spacing and component dimensions, accessible contrast, and real-looking concise labels.

Do not create an isometric device mockup, a glossy Behance poster, a fantasy game interface, a giant knowledge graph, or a civilization matrix. The board should be directly useful to a product designer and frontend implementation agent.
```

Purpose: checks visual consistency across the entire proposed product before implementation.

# 24. Prompt template for production card artwork

The previous prompts visualize the application. Production card artwork should be generated from a researched visual brief using a narrower template such as the following.

Historical lesson maps use the separate [historical map production runbook](../content/historical-map-production.md), which includes a map-specific research and generation prompt. Do not adapt the card-art prompt below into a map prompt.

```
Create a vertical historical illustration for a CHRONOS knowledge card. Generate ARTWORK ONLY: no border, no typography, no title, no symbols, no UI, no watermark.

SUBJECT: [specific person/object/place/process]
DATE AND PLACE: [narrow historically meaningful date, polity, region]
DEPICTION MODE: [documented likeness / evidence-based reconstruction / symbolic illustration / artifact-focused]
NARRATIVE MOMENT: [specific action or presentation, if applicable]

HISTORICAL REQUIREMENTS:
- [required clothing, material, architecture, tool, object, landscape detail]
- [required evidence-based appearance or surviving-source reference]
- [specific social role and context]
- [season, time of day, or environmental conditions only if supported or narratively neutral]

PROHIBITED ANACHRONISMS:
- [later armor, architecture, flags, technologies, symbols, fabrics, hairstyles, crops, animals, etc.]
- no generic fantasy ornament, no modern cinematic stereotypes

UNCERTAINTY HANDLING:
- [details that are unknown and must be obscured, generalized, shown symbolically, or omitted]

COMPOSITION:
- vertical 4:5 artwork suitable for a premium card crop
- clear focal subject and readable silhouette at thumbnail size
- preserve safe negative space near [top/bottom] for application typography outside the image
- cinematic painterly realism, museum-grade material detail, dramatic but physically plausible light
- dignified and historically grounded; not a posed costume photograph

EVIDENCE BASIS FOR THE CREATIVE TEAM:
- [museum objects, reliefs, archaeological reports, site photographs, primary sources]

The result should feel consequential and imaginative while remaining honest about what is and is not historically known.
```

# 25. Agent build brief

An implementation agent should treat this PRD as a hierarchy of invariants rather than a request to reproduce generated concept screenshots pixel for pixel.

1. Implement the Journey, Journey Entry, global Lesson Progress, Knowledge Card, and Visual Brief domains first.
2. Build one reusable responsive learning shell. Do not create separate interface architectures for Spine, Story Arc, Idea Trail, or Investigation.
3. Use production components and real typography; generated UI images are reference only.
4. Keep inline lesson entity blocks simple. Reserve premium card frames for reveal, Collection, and card detail.
5. Create seeded demonstration content that proves node reuse across at least three journeys.
6. Create idempotent completion and card-unlock operations before animation or collection polish.
7. Add source provenance and depiction labels before scaling generated art.
8. Validate the design with children and adults using task-based usability tests focused on “what do I do next?”, journey switching, and understanding shared completion.
9. Defer Atlas, graph visualization, and civilization matrices until the core learning loop is proven.

# 26. Definition of done for the initial product slice

- A new learner can start and complete a World Spine lesson without instruction.
- The learner can accept a contextual invitation to Ancient Egypt and understand that it is a separate story without losing World History progress.
- At least one lesson is reused in World History, Ancient Egypt, and an Idea Trail with different framing.
- Completion of that shared lesson is global and visually understandable.
- Completing a lesson reveals one historically reviewed Knowledge Card exactly once.
- The learner can find the card in Collection, open it, see why it matters, distinguish illustration from evidence, and return to the lesson.
- Rapa Nui or another investigation demonstrates optional archive depth without crowding the World Spine.
- The same core flow works on desktop and mobile.
- No primary screen requires understanding a graph, matrix, tag filter, or collectible-game economy.
- All published images and claims have source and review metadata.
