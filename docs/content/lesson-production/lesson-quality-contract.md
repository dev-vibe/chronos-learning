# Chronos lesson quality contract

Use this contract at the Stage 14B learner-prototype checkpoint. Stage 16 is a production-consistency check, not a second scoring pass. If the product owner already approved the rendered lesson with final media, do not recapture a viewport matrix or re-score pedagogy. If final media changed after that approval, inspect only the changed assets. Do not total points or allow strength in one area to cancel a blocking weakness in another.

Draft initially for a roughly 12–13-year-old reader; ages 11–15 and homeschooling are the primary audience. Proxy review assesses a design hypothesis, not demonstrated age suitability.

The quality promise is:

> An ages 11–15 learner can form an accurate, memorable mental model, reason from evidence, explain the central idea, and understand the next action.

Record concrete evidence from the rendered lesson for every finding. Mark each finding `pass`, `revise`, `blocking`, or `not applicable`, name the reviewer, and explain any safe deferral. A blocking finding returns the lesson to prototype or implementation work.

## Learner-experience gate

### Mental-model coherence

- State the lesson's essential question and durable understanding in plain language.
- Verify that every required section contributes to that model and that no indispensable causal step exists only in metadata, alt text, or feedback.
- Check that chronology, geography, actors, conditions, changes, and consequences connect without requiring unspoken specialist knowledge.
- Ask whether a learner could explain the central idea in their own words rather than repeat a slogan.

### Cumulative learning

- Identify Retrieve, Extend and Revisit in the blueprint, including an honest opening-lesson/prior-knowledge case.
- Check the progression of observation, inference, contextualization, corroboration and qualified explanation, with occasional transfer to unfamiliar reviewed evidence.
- Keep optional recall useful and subordinate; completion is studied content and sincere attempts, never inferred mastery.

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
- Follow the specialist historical-map, provenance/generation, and media-publishing runbooks for geographic truth, rights, method/data lineage, responsive derivatives, and rollback.

### Next-action clarity

- Verify that the learner can tell what to read, inspect, answer, or do at each interactive moment.
- Keep optional journeys and related lessons visually subordinate and outside section progress and completion.
- Confirm that sincere attempts unlock the explicit completion action and that the primary post-completion action continues the current journey.
- Review direct-open, locked, completed, revisit, and unavailable-next states; none may lead to a dead end or false progress.

## Integrity gates

### Research and editorial integrity

- Back every material claim with a source that supports its exact wording. Closely review central support with precise page/figure/passage/object locations; distinguish qualifying sources and discovery leads. Give consequential challenges full analysis and peripheral proposals concise deferral reasons. Apply equal scrutiny to inherited and alternative accounts without quotas, false balance or authority shortcuts.
- Corroborate material interpretations when independent evidence is available.
- Verify chronology, geography, certainty, disagreements, obsolete popular claims, and missing voices against the research note.
- Keep title, significance, modules, prompts, media, journey framing, and any card consistent with the approved scope.

### Rights, media, and accessibility

- Confirm redistribution rights, source files, checksums, derivatives, manifests, provenance, and review status.
- Apply the runbook's [media method and fidelity policy](../lesson-creation-runbook.md#media-method-and-fidelity-policy): licensed originals for direct evidence; native/vector or raster factual diagrams with reviewed geometry/data; generated reconstruction where appropriate. Do not require generative transformation solely for style.
- Verify source/data-versus-final fidelity and accessible equivalents for every method; preserve reviewed measurements, relationships, labels and uncertainty.
- Require actual visual references for every depicted real subject, including every artifact, manuscript, inscription, structure, excavation, and survey panel in a composite. For generated depictions, verify the subject-to-reference mapping and that every reference was supplied to the edit tool; text citations and style/layout references do not establish subject coverage.
- Compare each depicted subject with its reference and reject invented or altered physical details, inscriptions, wall relationships, stratigraphy, and measurement patterns. Missing references or failed subject fidelity block acceptance in both style-only and adapted compositions, regardless of illustrative or reconstruction labels. Source the missing evidence, omit the subject, or use native text.
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

### Early learner observation

Use the [observation protocol](learner-observation.md) for representative lessons, new interactions and uncertain age fit. Include independent/parent-supported use and immediate plus delayed understanding/transfer. Adult and AI proxy reviews are useful but insufficient evidence of age suitability; identify their type and limitations.

Real sessions remain **pending human participation** until observed. No child test is required for every lesson, and no missing observation creates an automatic publication block. Known serious observed confusion still requires a disposition and affected review. Never label completion or proxy success demonstrated mastery.

## Production-preview states

At Stage 16, confirm that implementation did not drift from the approved prototype. If final media or prompts changed after product-owner approval, review those changed surfaces at:

- 1440×900 and 390×844;
- light and dark themes;
- prompts, feedback, explicit completion, card reveal or no-card ending, and revisit.

Do not treat a full responsive screenshot gallery as a publication gate. After the product owner says to publish, follow [the publication playbook](../lesson-publication.md): one hosted completion smoke check is enough.

Use the [authoring templates](authoring-templates.md) to record the gate result. Approval belongs to the accountable human; deterministic validation may prove structure and integrity but must never manufacture a pedagogy score.
