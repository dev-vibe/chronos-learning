# Our Species Begins in Africa research and editorial note

Created 2026-07-20 for [ASH-69](https://linear.app/ashs-workshop/issue/ASH-69/research-and-publish-our-species-begins-in-africa) using the canonical lesson-creation runbook.

Repository-authored content will remain canonical. This note records Stages 0–14 and is the research/editorial checkpoint; production lesson code, final media, migrations, hosted changes, and publication remain behind product-owner approval.

## Work boundary

- **Lesson ID:** `lesson.humans.homo-sapiens-origins`
- **Legacy aliases:** none
- **Journey/chapter/position:** World History / Human Beginnings and Food Systems / canonical position 1
- **Required:** yes
- **Chronology:** approximately 300,000–200,000 years ago; individual evidence dates retain their published uncertainty
- **Curriculum prerequisite:** none
- **Production order:** 1 by explicit product-owner direction on 2026-07-20
- **Production dependencies:** research, claim, media, and ages 11–14 editorial gate
- **Issue:** ASH-69
- **Branch:** `codex/ash-69-human-origins`
- **Accountable product/editorial reviewer:** Carlin Aylsworth
- **Previous entry:** none; this is the opening of the canonical World Spine
- **Next entry:** `lesson.humans.migrations-and-interbreeding`

This increment creates one bounded opening lesson and its evidence-location map brief. It does not implement the next migration/ancient-DNA lesson, survey the entire hominin family tree, redesign the Learn shell, add a universal component, generate final media, publish database configuration, or modify hosted progress before the checkpoint is approved.

## Node proposal

**Recommended learner-facing title:** **Our Species Begins in Africa**. Retaining the canonical title makes the first action legible. The masthead and opening question must immediately explain that “begins” names a long evolutionary process, not a birthday or single birthplace.

**Essential question:** How can scientists know where our species emerged when there was no single birthday and the evidence is incomplete?

**Durable understanding:** Homo sapiens emerged in Africa over a long period among connected and sometimes separated populations; fossils and genomes support that broad history, but they do not identify one exact first person, place, or date.

**Supporting understandings:**

1. Fossils classified as early Homo sapiens occur in Africa by roughly 300,000 years ago, but they combine features in different ways and do not mark a sharp species boundary.
2. A fossil's date is an evidence-based range or limit. At Omo Kibish, ash above the fossil provides a minimum age rather than the fossil's exact age.
3. Fossils and archaeological sites are scattered and unevenly preserved, so a mapped findspot is evidence about where a clue survived—not proof that evolution happened only there.
4. Genetic models point to long histories of connected African populations, but their detailed population trees depend on samples and model assumptions.
5. All living people share deep African ancestry; this lesson cannot be used to rank living populations or divide humanity into biological races.

**Evidence encounter:** Omo I at Omo Kibish, Ethiopia. Learners reason from stratigraphy: the fossil-bearing layer lies below the KHS volcanic ash, and geochemical matching dates the source eruption to 233 ± 22 thousand years ago. The supported conclusion is that Omo I is older than that eruption; 233,000 years is not an exact fossil birthday.

**Prerequisite ideas:** A fossil is preserved physical evidence; older layers are generally below younger undisturbed layers; a scientific model is an explanation tested against evidence, not a photograph of the past.

**Common misconceptions to prevent:**

- scientists found one “first human”;
- a species appears in a single generation with a birthday;
- Jebel Irhoud is an uncontested exact birthplace;
- the oldest fossil found must be the first member of the species;
- DNA can name an exact first population from 300,000 years ago;
- “modern” means smarter, better, or more evolved;
- present-day racial categories describe ancient biological branches;
- stone-tool changes prove one species suddenly replaced another.

**Scope:** African fossil, archaeological, and genetic evidence bearing on the emergence of Homo sapiens from roughly 300,000 to 200,000 years ago. Jebel Irhoud and Omo I are the principal fossil cases; Florisbad is used on the map as a deliberately contested southern African comparison.

**Why this is one lesson:** It establishes the first durable model the rest of World History needs: humanity has shared African roots, and deep history is reconstructed by combining incomplete evidence. Migration, interbreeding, adaptation, and ancient DNA then have a clear next lesson rather than crowding this one.

**Bridge forward:** The next lesson follows populations moving within and beyond Africa and meeting other human groups. It can build on the distinction between a broad African origin and later dispersal histories.

## Research questions

- Which fossils securely support an African origin, and which classifications remain debated?
- What do published dates actually measure: an exact fossil age, a range, a minimum, or a maximum?
- What does the geographical spread of early fossils support, and what would be an overclaim?
- How do fossil morphology, archaeology, and genetic models corroborate or complicate one another?
- Which structured-population models are broadly supported, and which details remain model-dependent?
- What is lost because very ancient DNA has not been recovered from these African fossils?
- How should “Homo sapiens,” “modern,” “population,” “ancestry,” and “species” be explained without biological ranking?
- Which human-remains, map, and reconstruction choices are ethical, licensed, and genuinely instructional?
- How should the 2026 Thomas Quarry findings inform background without turning this into a full hominin-lineage survey?

## Source ledger

| Source ID | Citation/link | Type and authority | Claims supported | Limits/bias and corroboration | Rights/use | Review |
| --- | --- | --- | --- | --- | --- | --- |
| `source.human-origins.hublin-2017-irhoud` | [Hublin et al., “New fossils from Jebel Irhoud, Morocco and the pan-African origin of Homo sapiens,” Nature 546 (2017)](https://doi.org/10.1038/nature22336) | Peer-reviewed primary fossil analysis; Moroccan INSAP and Max Planck collaboration | Jebel Irhoud morphology, mosaic of traits, early Homo sapiens interpretation | Classification and ancestry are interpretations; Mounier and Lahr provide a materially different phylogenetic reading | Research citation only; article figures not approved for redistribution | Reviewed 2026-07-20 |
| `source.human-origins.richter-2017-irhoud-date` | [Richter et al., “The age of the hominin fossils from Jebel Irhoud,” Nature 546 (2017)](https://doi.org/10.1038/nature22335) | Peer-reviewed primary dating study | Thermoluminescence age 315 ± 34 ka for heated flints associated with the fossils; independent ESR support | Dates associated material and a tooth with method-specific uncertainty; not a species birthday | Research citation only; no article media redistributed | Reviewed 2026-07-20 |
| `source.human-origins.vidal-2022-omo-age` | [Vidal et al., “Age of the oldest known Homo sapiens from eastern Africa,” Nature 601 (2022)](https://doi.org/10.1038/s41586-021-04275-8) | Peer-reviewed open-access tephrochronology study | Omo I stratigraphy, KHS Tuff correlation, minimum age of 233 ± 22 ka, limits of earlier correlations | Establishes a robust minimum, not a precise fossil age; the paper itself explains unresolved maximum age | CC BY 4.0; eligible figures may be adapted after figure-level review | Reviewed 2026-07-20 |
| `source.human-origins.scerri-2018-structured-africa` | [Scerri et al., “Did Our Species Evolve in Subdivided Populations across Africa, and Why Does It Matter?” Trends in Ecology & Evolution 33 (2018)](https://doi.org/10.1016/j.tree.2018.05.005) | Peer-reviewed interdisciplinary review; author manuscript available through PMC | Pan-African structured-population framework; fossil, environmental, archaeological, and genetic incompleteness | A framework and research program, not proof of one demographic history; later work tests alternatives | Research citation only; no article media redistributed | Reviewed 2026-07-20 |
| `source.human-origins.bergstrom-2021-ancestry` | [Bergström et al., “Origins of modern human ancestry,” Nature 590 (2021)](https://doi.org/10.1038/s41586-021-03244-5) | Peer-reviewed synthesis by geneticists and palaeoanthropologists | Broad African origin, no identifiable single limited birthplace, distinction among ancestry phases | Review emphasizes that several evolutionary histories remain consistent with current data | Research citation only; no article media redistributed | Reviewed 2026-07-20 |
| `source.human-origins.ragsdale-2023-structured-stem` | [Ragsdale et al., “A weakly structured stem for human origins in Africa,” Nature 617 (2023)](https://doi.org/10.1038/s41586-023-06055-y) | Peer-reviewed demographic modelling using diverse contemporary genomes | Model of two or more weakly differentiated ancestral populations connected by gene flow | One best-fitting model under stated data and assumptions; sparse ancient African genomes and model misspecification limit certainty | Research citation only; current license does not permit runtime figure reuse | Reviewed 2026-07-20 |
| `source.human-origins.mounier-lahr-2019-diversity` | [Mounier and Mirazón Lahr, “Deciphering African late middle Pleistocene hominin diversity,” Nature Communications 10 (2019)](https://doi.org/10.1038/s41467-019-11213-w) | Peer-reviewed open-access morphological modelling study | High fossil diversity; regional lineages; not all populations necessarily contributed equally | Specific method favors south/east coalescence and questions Irhoud's direct role; countermodel, not consensus | CC BY 4.0 article; figures need separate teaching-purpose review | Reviewed 2026-07-20 |
| `source.human-origins.hublin-2026-thomas-quarry` | [Hublin et al., “Early hominins from Morocco basal to the Homo sapiens lineage,” Nature 649 (2026)](https://doi.org/10.1038/s41586-025-09914-y) | Current peer-reviewed open-access fossil and dating study | African lineage context predating Homo sapiens; Thomas Quarry fossils around 773 ka | Outside lesson chronology and not Homo sapiens; included to ensure current research, then deferred | CC BY 4.0; no runtime reuse proposed | Reviewed 2026-07-20 |
| `source.human-origins.iugs-kibish` | [IUGS, “The modern human fossils of the Kibish Formation”](https://iugs-geoheritage.org/geoheritage_sites/the-modern-human-fossils-of-the-kibish-formation/) | International geological heritage record | Omo location, formation context, current 233 ± 22 ka summary | Institutional synthesis; primary dating claim remains Vidal et al. | Research/location reference; image rights not assumed | Reviewed 2026-07-20 |
| `source.human-origins.mpi-jebel-irhoud` | [Max Planck Institute, “Africa and the Origins of Modern Humans”](https://www.eva.mpg.de/evolution/field-projects/africa-and-the-origins-of-modern-humans/) | Field-project institutional record | Jebel Irhoud about 100 km west of Marrakesh; excavation context | Older summary; dating and classification come from primary papers | Research/location reference; images not approved | Reviewed 2026-07-20 |
| `source.human-origins.ufs-florisbad` | [University of the Free State repository, Douglas, “A new perspective…” (2009)](http://hdl.handle.net/11660/1168) | University research repository | Florisbad coordinates and site context | Not primary phylogenetic authority; direct date and classification checked against peer-reviewed studies | Research/location reference only | Reviewed 2026-07-20 |

Research stopped when the African-origin claim, two primary evidence cases, structured-population interpretation, a substantive countermodel, current 2026 context, geographic references, and rights boundaries were recoverable. Additional sources mostly extended into migration, behavior, climate, or earlier hominin evolution that belongs in other nodes.

## Claim ledger

| Claim ID and wording | Kind | Certainty | Sources | Counterevidence/limits and missing perspective | Learner treatment | Review |
| --- | --- | --- | --- | --- | --- | --- |
| `claim.human-origins.african-ancestry`: the deep ancestry of all living humans leads back to populations in Africa | Interpretation | High | Bergström; Ragsdale; Hublin 2017; Hublin 2026 | Exact regional contributions and demographic paths remain unresolved | State directly, then separate this broad conclusion from detailed models | Human editorial review required |
| `claim.human-origins.gradual-emergence`: current evidence does not identify one exact first Homo sapiens person, generation, birthplace, or birthday | Interpretation | High | Bergström; Scerri; Hublin 2017; Mounier and Lahr | Species definitions are classifications applied to a gradual, incomplete record | Opening puzzle and durable understanding | Human editorial review required |
| `claim.human-origins.irhoud-fossils`: Jebel Irhoud preserves fossils dated with associated material to about 315 ± 34 ka that combine traits aligned with Homo sapiens and more ancestral cranial traits | Observation plus interpretation | Moderate | Hublin 2017; Richter 2017 | Age is a range; assignment to early Homo sapiens and ancestry are debated | Separate anatomy observations from classification | Specialist historical review required |
| `claim.human-origins.omo-minimum-age`: Omo I was deposited before an ash layer tied to an eruption dated 233 ± 22 ka, making the fossil older than that eruption | Observation | High | Vidal 2022 | Minimum age; a robust maximum remains unresolved | Learner reasons “older than,” never “exactly 233,000 years old” | Human editorial review required |
| `claim.human-origins.distributed-fossil-record`: relevant late Middle Pleistocene fossils occur in northern, eastern, and southern Africa | Observation | High | Hublin 2017; Vidal 2022; Mounier and Lahr; Florisbad reference | Preservation/research uneven; several classifications disputed | Map evidence locations without origin centers or migration arrows | Specialist historical/map review required |
| `claim.human-origins.mosaic-traits`: features used to classify Homo sapiens did not all appear together in every early fossil | Interpretation | High | Hublin 2017; Mounier and Lahr; Bergström | Morphology does not alone reveal direct ancestry | Explain “mosaic” without a ladder of better/worse traits | Specialist historical review required |
| `claim.human-origins.connected-populations`: genetic evidence is consistent with long-lived African population structure and repeated gene flow rather than one isolated founding population | Interpretation | Moderate | Ragsdale; Bergström; Scerri | Number, location, timing, and contribution of populations are model-dependent | Show model details as provisional | Specialist genetics review required |
| `claim.human-origins.genetic-limits`: genetic models infer deep history from sampled genomes and assumptions; they are not direct DNA records from the 300–200 ka fossils in this lesson | Observation and interpretation | High | Ragsdale; Bergström; Scerri | Future ancient biomolecules or broader sampling may change models | Contrast clue/model with photograph/proof | Human editorial review required |
| `claim.human-origins.site-limit`: a fossil findspot shows where evidence survived and was recovered, not the only place a population lived or evolved | Interpretation | High | Scerri; Bergström; Vidal; map sources | Absence may reflect preservation and research history | Repeat in map caption and conclusion | Human editorial review required |
| `claim.human-origins.no-biological-ranking`: the evidence describes shared ancestry and cannot rank living populations as more or less evolved | Interpretation | High | Bergström; Ragsdale | Present-day identities are not proxies for ancient populations | State plainly without turning this into a race-science survey | Human editorial review required |

## Content triage

| Candidate idea | Decision | Why | Destination |
| --- | --- | --- | --- |
| No single species birthday | Essential | Organizes lesson and blocks false precision | Opening and conclusion |
| Jebel Irhoud morphology and date | Essential | Early case and model of classification uncertainty | Fossil-clues section |
| Omo I ash-layer reasoning | Essential | Concrete evidence encounter | Dating-evidence section |
| Africa-wide evidence locations | Essential | Makes distributed/incomplete record visible | Evidence-location map |
| Structured, connected populations | Essential | Replaces lone birthplace without claiming one settled tree | Genetics sections |
| Observation versus classification versus ancestry | Essential | Core reasoning move | Throughout |
| Florisbad | Supporting | Adds southern evidence while modelling disputed classification | Map and uncertainty note |
| Thomas Quarry around 773 ka | Deferred | Current ancestry context but outside chronology | Future deep dive |
| Full hominin family tree | Deferred | Overwhelms central question | Library/deep dive |
| Dispersals, Neanderthals, Denisovans, interbreeding | Deferred | Canonical next lesson | `lesson.humans.migrations-and-interbreeding` |
| Detailed stone-tool industries | Deferred | Tools do not map neatly to species | Ice Age lifeways/deep dive |
| Climate as a single cause | Rejected | Evidence does not support one trigger | None |
| “Cognitive revolution” | Rejected | Disputed progress threshold outside fossil question | None |
| Exact appearance, language, names, social roles | Rejected | Evidence cannot support precise reconstruction | None |
| Modern racial typologies | Rejected | Scientifically and pedagogically misleading | None |
| Video | Rejected | Motion/sound/technique not necessary | None |
| Cinematic reconstruction hero | Rejected for checkpoint | Implies unsupported appearance and distracts from evidence | Reconsider only for a precise reviewed need |

## Learning blueprint

- **Essential question:** How can scientists know where our species emerged when there was no single birthday and the evidence is incomplete?
- **Durable understanding:** Homo sapiens emerged in Africa over time among connected populations; fossils and genomes support the broad history while leaving the exact people, places, and sequence unresolved.
- **Prerequisites:** fossil, layer, evidence, model.
- **Indispensable vocabulary:** Homo sapiens, species, fossil, trait, layer, minimum age, population, genome, model, ancestry.
- **Evidence encounter:** Omo I below the KHS volcanic ash.
- **Historical/scientific thinking move:** separate observation from classification and use a dated layer to support a bounded conclusion.
- **Required sincere-attempt evidence:** recognize the connected-population explanation; explain why one fossil clue and one genetic clue do not create an exact birthday or birthplace.
- **Bridge forward:** movement and encounters change population histories after the African origin established here.

## Ages 11–14 editorial decisions

- Begin with “Can a species have a birthday?” before naming demographic models.
- Put time and Africa on screen immediately; describe 300,000 years as many thousands of generations without a fake exact count.
- Teach one dating inference: fossil layer below dated ash means “older than,” not “the same age as.”
- Define “modern human” as a scientific label for Homo sapiens, never a claim that earlier people were less intelligent or valuable.
- Use “ancestral” and “earlier” instead of “primitive.”
- Explain “mosaic” as a mix of features used by researchers, not a half-finished person.
- Keep genetics at population scale. Do not equate present-day ethnic groups with ancient populations.
- State uncertainty directly: “The fossil survives. Its exact place in our family history does not.”
- Name African sites and collaborating institutions; do not cast Africa as a passive backdrop.
- Treat human remains respectfully; no sensational display, facial animation, or claim to know identity.
- Avoid march-of-progress graphics, skin-color coding, skull ranking, and overly certain family trees.
- Repeat: “What is observed? What is inferred? What remains unknown?”

## Section and component storyboard

| Order | Section ID / heading | Learner purpose | Claims/sources | Module | Media/action | Transition |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `section.human-origins.opening-question` / Can a species have a birthday? | Enter through gradual change and incomplete evidence | gradual emergence / Bergström, Scerri | Prose | No hero; consider what a “first” fossil proves | Meet fossil clues |
| 2 | `section.human-origins.fossil-clues` / A fossil is a clue, not a birth certificate | Separate features, classification, ancestry | Irhoud, mosaic / Hublin, Richter, Mounier and Lahr | Knowledge | Compare observation / classification / ancestry | Ask how old a clue is |
| 3 | `section.human-origins.dating-evidence` / Older than the ash | Reason from stratigraphy and minimum age | Omo / Vidal | Knowledge + prose | Order fossil layer, ash layer, eruption; state bounded conclusion | Place clues on continent |
| 4 | `section.human-origins.africa-wide-record` / Clues across a continent | See spatial spread and preservation limits | distributed record, site limit / map sources | Historical map | Locate Jebel Irhoud, Omo Kibish, Florisbad; no origin arrows | Ask what fossils cannot show |
| 5 | `section.human-origins.genetic-clues` / Genomes are family-history clues | Understand genetic inference without treating DNA as a recording | genetic limits / Bergström, Ragsdale | Knowledge | Compare data / model / uncertainty | Build cautious model |
| 6 | `section.human-origins.connected-populations` / Connected, separated, connected again | Replace lone birthplace with network model | connected populations / Scerri, Ragsdale, Bergström | Knowledge | Existing prose/knowledge treatment; no new universal primitive | Test limits |
| 7 | `section.human-origins.known-and-unknown` / What the evidence can—and cannot—say | Consolidate ancestry, missing evidence, no ranking | synthesis claims / all sources | Prose + knowledge | Sort know / infer / do not know | World Check |
| 8 | `section.human-origins.world-check` / World Check | Demonstrate evidence reasoning and complete explicitly | prompt contracts | Prompts | Selection + concise explanation | Completion and next action |

No unsupported universal component is required. A population-network idea uses existing prose/knowledge unless implementation review proves a bounded accessible diagram is necessary; that architecture change would be separately scoped.

## Media decision

### Evidence-location map

- **Teaching purpose:** make the wide geographic spread of fossil clues visible while teaching that findspots are not exact origin centers.
- **Claim/source basis:** distributed-record and site-limit claims; Natural Earth, IUGS, MPI, UFS, Hublin, Vidal, Mounier and Lahr.
- **Selected form:** Chronos-original evidence-location map built from a public-domain Natural Earth base and reviewed site evidence.
- **Alternatives considered:** prose-only loses the spatial argument; a copyrighted scholarly figure creates rights/density problems; migration arrows overclaim.
- **Depiction label:** “Evidence-location map · sites are clues, not exact birthplaces.”
- **Placement/action:** section 4; locate and compare northern, eastern, and southern evidence.
- **Accessibility equivalent:** native summary names each modern region and explains that classifications and dates differ.
- **Rights/provenance:** public-domain base plus factual locations; source figures remain research-only; final output needs historical, rights, visual, and accessibility review.
- **Specialist output:** [human-origins-africa-evidence-map.md](human-origins-africa-evidence-map.md).
- **Review status:** brief ready; final asset not generated or approved for publication.

### Fossil and ash evidence

No separate fossil photograph is recommended initially. Omo reasoning is taught more precisely with native text and an ordered layer treatment, avoiding unresolved image rights and sensitive display of human remains. If implementation cannot express the inference accessibly, use a short Chronos-original diagram after approval; do not substitute a decorative fossil image.

### Hero and video

No cinematic hero and no video pass the teaching-purpose gate. The evidence-led opening is intentional.

## Knowledge Card plan

- **Stable ID:** `card.idea.shared-african-origins`
- **Title:** **Shared African Origins**
- **Category/class:** idea / Foundation
- **Memory anchor:** Homo sapiens emerged through a long African population history, not from one identifiable first person or racial branch.
- **Date/place:** approximately 300,000–200,000 years ago / Africa
- **Significance:** Fossils and genomes connect every living person to deep African ancestry while leaving the detailed map of early populations open to revision.
- **Facts:** early Homo sapiens evidence is African; dates are ranges/limits; fossils combine traits differently; genetic models support connected populations; a findspot is not a birthplace.
- **Depiction:** reuse the approved map or a closely related diagram; do not invent a named ancestor or representative face.
- **Reveal:** “You traced a shared beginning” / “You used fossils, ash, and genomes without turning incomplete clues into a false exact answer.”
- **Unlock:** deterministic on explicit completion of `lesson.humans.homo-sapiens-origins`.
- **Review:** concept ready; final copy/media pending product-owner, historical, and visual review.

## Understanding-check plan

1. **Supported selection — `prompt.human-origins.best-supported-model`**
   - Question: Which conclusion best fits the fossil and genetic evidence?
   - Supported option: Homo sapiens emerged over time in Africa among populations that were sometimes separated and sometimes connected, while the exact sequence remains uncertain.
   - Distractors: one exact fossil birthplace; simultaneous worldwide appearance; modern DNA as a complete recording.
   - Feedback explains why the broad African conclusion is strong and the detailed map provisional.

2. **Concise explanation — `prompt.human-origins.evidence-and-limit`**
   - Question: Use one fossil or dating clue and one genetic clue to explain why scientists do not give our species one exact birthday and birthplace.
   - Required because it assesses the durable understanding and evidence/limit distinction.
   - Completion requires a sincere attempt, not correctness, length spectacle, or specialist vocabulary.

## Journey framing

- **Entry ID:** `entry.world-history.human-origins`
- **Required/position:** yes; position 0 in a new `chapter.world-history.human-beginnings` chapter aligned to the canonical roster.
- **Framing:** “Begin with the evidence that connects every later human story.”
- **Previous transition:** none.
- **Bridge next:** “Once our species had emerged in Africa, populations moved, met other humans, and carried different histories forward.”
- **World History entry lesson:** this lesson when published.
- **Progress safety:** later unpublished entries remain fail-closed; this lesson must not make Planned position 2 completable.
- **Optional navigation:** none; Continue World History remains the primary post-completion action.

## Disagreement, uncertainty, and missing voices

- Broad African origin is high-confidence; an exact single birthplace is not.
- Jebel Irhoud's date is well supported as a range, but its classification and direct ancestry are interpretive.
- Omo I is older than the dated ash; its exact age remains unresolved.
- Pan-African/structured models reject a simple isolated birthplace but differ about population number, location, contribution, and connections.
- The 2023 weakly structured stem is a powerful model, not direct observation of named ancient groups.
- African heat, soil chemistry, preservation, excavation history, and uneven genomic sampling leave large gaps.
- Fossils preserve anatomy more readily than language, identity, kinship, belief, or people's voices.
- Research history overrepresents long-running projects and underrepresents unsurveyed or poorly preserving regions.
- Learner treatment distinguishes observation, classification, demographic model, and unknown rather than collapsing them into “scientists proved.”

## Research/editorial checkpoint

Recommended decisions:

1. Retain **Our Species Begins in Africa**, with immediate language preventing a sudden-birthday reading.
2. Approve a long African emergence among connected populations, with no exact first person/place/date.
3. Approve Omo I's “older than the ash” inference as the central evidence encounter.
4. Approve a source-verified map with Jebel Irhoud, Omo Kibish, and contested Florisbad; no routes, borders, or origin-center arrows.
5. Approve no cinematic hero, no video, and no human facial reconstruction.
6. Approve one Foundation card, **Shared African Origins**, using the map/diagram rather than an invented ancestor.
7. Approve two required sincere-attempt prompts: supported model selection and evidence-plus-limit explanation.
8. Require specialist historical/genetics review before prose treats the structured-population model as more specific than current evidence allows.

## Sign-off status

- [x] Work boundary and node proposal
- [x] Research questions
- [x] Source ledger
- [x] Claim ledger
- [x] Content triage
- [x] Learning blueprint
- [x] Ages 11–14 editorial pass
- [x] Section/component storyboard
- [x] Media decision and specialist map brief
- [x] Knowledge Card decision
- [x] Understanding-check plan
- [x] Journey framing
- [ ] Human historical/editorial review
- [ ] Specialist genetics review
- [x] Product-owner approval of checkpoint
- [x] Production content, final media, migrations, tests, and preview
- [x] Structured learner walkthrough or documented reason deferred
