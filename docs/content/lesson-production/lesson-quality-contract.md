# Chronos lesson quality contract

Use this contract at the Stage 14B learner-prototype checkpoint and again at Stage 16 with production content and final media. It is a qualitative review instrument, not a scoring rubric. Do not total points or allow strength in one area to cancel a blocking weakness in another.

The quality promise is:

> An ages 11–14 learner can form an accurate, memorable mental model, reason from evidence, explain the central idea, and understand the next action.

Record concrete evidence from the rendered lesson for every finding. Mark each finding `pass`, `revise`, `blocking`, or `not applicable`, name the reviewer, and explain any safe deferral. A blocking finding returns the lesson to prototype or implementation work.

## Learner-experience gate

### Mental-model coherence

- State the lesson's essential question and durable understanding in plain language.
- Verify that every required section contributes to that model and that no indispensable causal step exists only in metadata, alt text, or feedback.
- Check that chronology, geography, actors, conditions, changes, and consequences connect without requiring unspoken specialist knowledge.
- Ask whether a learner could explain the central idea in their own words rather than repeat a slogan.

### Narrative momentum

- Verify that the opening creates a historical problem, tension, object, or question worth following.
- Check that each section answers or complicates what came before and creates a reason to continue.
- Remove repeated setup, conclusion-first prose, and transitions that merely announce the next heading.
- Confirm that the ending resolves the essential question without pretending the history is finished or inevitable.

### Age-appropriate cognitive load

- Introduce and reuse only indispensable vocabulary; define unfamiliar terms where the learner needs them.
- Keep each section focused on one teaching job and break up conceptually dense passages with evidence, comparison, or reflection that advances learning.
- Check long sentences, nested causation, unexplained names, rapid place changes, and excessive date loads in the actual responsive layout.
- Preserve complexity that matters; simplify presentation rather than manufacturing certainty.

### Heading voice

- Every required section heading names the subject or teaching job in ordinary words.
- Fail metaphors, riddles, punchlines, and “X is not a [modern object]” titles. A slogan heading is `revise` or `blocking`, never a highlight.
- Confirm that a skimming 12-year-old could tell what each section is about before reading the body.
- Analogies, if used at all, belong in prose with their limits stated—not in the heading, claim ID, or durable-understanding sentence.

### Evidence reasoning

- Give the learner a concrete source, object, map, pattern, or comparison from which to reason.
- Distinguish observation, inference, interpretation, uncertainty, reconstruction, and later tradition at the point of use.
- Ensure prompts require reasoning available from the lesson and that feedback explains both support and limits.
- Confirm that no source is made to prove more than it can. Keep recurring type labels in ordinary words: evidence-module chrome is “Surviving evidence”; the close-read knowledge module is “What you can see”; the labor/institution knowledge module is “Who did the work”; the can-show / cannot-prove knowledge module is “What we can know”. Fail “evidence room,” “evidence boundary,” “observation before interpretation,” “look before you explain,” and “in practice” as learner-facing methods jargon.

### Historical proportionality

- Match emphasis and certainty to the source record and current scholarship.
- Avoid monocausal or deterministic stories, present-day moral shortcuts, civilizational rankings, and a single-path account of change.
- Give people and societies specificity, diversity, and agency; identify survival bias or missing perspectives when it affects the model.
- Treat violence, enslavement, religion, death, sexuality, human remains, and other sensitive material truthfully, proportionately, and purposefully.

### Visual teaching value

- Require every image, map, diagram, object, audio, or video to answer a named learner question.
- Judge the visual at its exact section location: it must clarify evidence, geography, sequence, scale, comparison, technique, or uncertainty rather than decorate a pause in prose.
- Provide an accessible equivalent and preserve essential depiction/evidence labels in the learner experience.
- Follow the specialist historical-map, provenance/generation, and media-publishing runbooks for geographic truth, rights, raster lineage, responsive derivatives, and rollback.

### Next-action clarity

- Verify that the learner can tell what to read, inspect, answer, or do at each interactive moment.
- Keep optional journeys and related lessons visually subordinate and outside section progress and completion.
- Confirm that sincere attempts unlock the explicit completion action and that the primary post-completion action continues the current journey.
- Review direct-open, locked, completed, revisit, and unavailable-next states; none may lead to a dead end or false progress.

## Integrity gates

### Research and editorial integrity

- Back every material claim with a source that supports its exact wording.
- Corroborate material interpretations when independent evidence is available.
- Verify chronology, geography, certainty, disagreements, obsolete popular claims, and missing voices against the research note.
- Keep title, significance, modules, prompts, media, journey framing, and any card consistent with the approved scope.

### Rights, media, and accessibility

- Confirm redistribution rights, source files, checksums, derivatives, manifests, provenance, and review status.
- Reject lesson-media SVG and any blank-canvas, hand-drawn, procedural, canvas, plotting, or shape-primitive instructional diagram.
- Require the actual reviewed raster reference and image-edit lineage for diagram-like generated media.
- Verify semantic headings and landmarks, keyboard and focus behavior, WCAG 2.2 AA contrast, reflow/zoom, touch targets, reduced motion, alt text, captions, transcripts, map summaries, and screen-reader states.

### Technical and data integrity

- Fail duplicate or broken references, unstable IDs, invalid section/prompt configurations, and claim/source mismatches.
- Verify draft, unpublished, direct, invalid, prerequisite, and published routes.
- Verify that scrolling does not complete a lesson, required prompts use sincere-attempt rules, and explicit completion/card acquisition are idempotent.
- Verify journey percentages and required actions exclude optional navigation and prototype annotations.
- Test empty-database migrations, hosted development configuration, intended Supabase project selection, security/performance advisors, and the absence of client secrets.

## Review method

### Stage 14B proxy and product review

1. Give a reviewer the raw Learn-shell prototype and this contract. Do not give them the author's intended diagnosis.
2. Ask the reviewer to read and act naturally before discussing intent.
3. Capture the point in the lesson and observable evidence for each hesitation, misreading, overload, decorative visual, prompt mismatch, or action ambiguity.
4. Treat slogan, metaphor, riddle, or punchline headings as `revise` or `blocking`. Do not praise a clever title as a learning moment. If a heading needs explaining, it fails.
5. Prepare the product-review record as `pending`, link the exact prototype, set the queue row to `Awaiting approval`, and stop for the accountable owner.
6. Have the owner inspect desktop/mobile and light/dark states and disposition every finding. Never let an agent or proxy approve on the owner's behalf.
7. Record explicit approval or return to Stage 14A for requested changes; repeat the affected review on the revised experience.

### Optional learner observation and future public-release UAT

Learner UAT is not a per-lesson gate. A deeper family/beta pass belongs to the later broad-public-release program. Optional learner observation can still inform product judgment; proxy disagreement, observed confusion, or uncertain age fit returns the lesson to prototype/product review rather than creating a separate UAT blocker.

Observe before explaining, then ask:

- What was this lesson mainly about?
- What evidence do you remember, and what did it help you work out?
- What is one thing historians know and one thing they are less sure about?
- Where did you feel lost, bored, rushed, talked down to, or overloaded?
- Which visual taught you something, and which felt decorative?
- What did you think you were supposed to do next?
- How would you answer the essential question in your own words?

Record behavior, not only preference. Note skipped labels, mistaken causal links, reconstruction treated as evidence, prompts passed without intended understanding, and unclear actions. Revise the lesson, then repeat the affected part of the walkthrough.

Record optional observations when available, but do not mark the lesson provisional merely because no learner walkthrough occurred.

## Production-preview states

At Stage 16, repeat the complete contract with final content and media. Review at minimum:

- 1440×900 and 390×844;
- light and dark themes;
- long text and media fallbacks;
- journey rail/drawer and focus order;
- prompts, feedback, explicit completion, card reveal or no-card ending, and revisit;
- unpublished neighbors, locked routes, and the next valid action.

Use the [authoring templates](authoring-templates.md) to record the gate result. Approval belongs to the accountable human; deterministic validation may prove structure and integrity but must never manufacture a pedagogy score.
