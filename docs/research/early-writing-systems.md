# Early Writing Systems research and editorial note

Reauthored 2026-07-19 for [ASH-63](https://linear.app/ashs-workshop/issue/ASH-63/publish-early-writing-systems-and-prove-the-reusable-learn-pipeline) using the canonical lesson-creation runbook on the stacked ASH-64 branch.

Repository-authored content remains canonical. The database stores publication, required-prompt, completion, legacy-alias, and deterministic-unlock configuration only.

## Work boundary

- **Lesson ID:** `lesson.writing.early-systems`
- **Legacy alias:** `sumer_writing`
- **Journey position:** World History / Foundations, immediately after `lesson.uruk.first-city`
- **Required:** yes
- **Chronology:** approximately 3200–2800 BCE, with the featured object dated about 3100–2900 BCE
- **Branch/PR:** existing PR #8; the platform work and hosted migration are retained
- **Accountable product/editorial reviewer:** Carlin Aylsworth; renewed sign-off on the reauthored prose remains pending
- **Publication-state exception:** the development configuration was already applied before this runbook existed. This pass preserves the stable published identity and completion configuration, keeps PR #8 draft, and requires renewed human review before merge rather than creating a destructive rollback/republication cycle.

This increment reauthors one lesson and its durable editorial record. It does not redesign the Learn shell, add a universal component system, change stable learner data, add a map or generated reconstruction, resolve Uruk media rights, or author Farming and Settlements.

## Node proposal

**Learner-facing title:** **From Marks to Proto-Cuneiform**. The stable internal ID is broader, but the evidence here concerns late-fourth-millennium Mesopotamian administrative practices. The narrower title avoids implying coverage of every early writing tradition or a single universal origin.

**Essential question:** How could marks on clay carry useful information beyond one person’s memory?

**Durable understanding:** Proto-cuneiform grew from a longer world of counting, sealing, and administration; it made selected information durable, but it did not yet work like later language-rich cuneiform and its surviving records reveal only part of society.

**Supporting understandings:**

1. Growing institutions had to coordinate quantities, goods, people, and obligations beyond unaided memory.
2. Tokens, sealings, numerical tablets, and images formed a varied administrative environment; they do not provide one simple, fully traceable ladder to writing.
3. Surviving proto-cuneiform tablets organize restricted administrative information, often without representing sentences or spoken language fully.
4. Signs, tools, conventions, and uses changed over centuries into later cuneiform systems that represented several languages and many kinds of text.
5. Durable records created new possibilities for institutions while preserving the choices and silences of the people who controlled them.

**Evidence encounter:** The Met’s clay tablet 1988.433.1, dated about 3100–2900 BCE and probably from Uruk. Its incised signs, numerical impressions, and seal impression survive. The interpretation as a probable grain distribution is scholarly and remains uncertain.

**Prerequisites:** Uruk as a large southern Mesopotamian city; administration means organizing shared work or resources; a reconstruction is not direct evidence.

**Misconceptions to prevent:**

- one person invented writing at a single moment;
- every early sign was a picture with an obvious meaning;
- every token or seal motif can be matched directly to a later sign;
- proto-cuneiform already recorded speech like later cuneiform;
- administrative tablets tell us everything people wrote or experienced;
- all writing traditions descended from Mesopotamia.

**Scope:** Southern Mesopotamia and connected South-west Asian administrative practices around the late fourth millennium BCE, stopping after the distinction between proto-cuneiform and later developed cuneiform is clear.

**Deferred:** a full history of cuneiform languages, scribal schools in later periods, Egyptian/Chinese/Mesoamerican case studies, alphabetic writing, literature, law codes, and a universal survey of writing systems.

**Bridge from Uruk:** Uruk introduced city-scale coordination and clay records. This lesson slows down over those records and asks what kind of information they could—and could not—carry.

**Bridge forward:** Farming and Settlements can later return to the longer relationship among stored goods, settled communities, institutions, and records without treating those developments as one inevitable sequence.

## Research questions

- What survives from late-fourth-millennium administrative practice, and what is reconstructed?
- Which functions of proto-cuneiform are strongly supported by the corpus?
- How closely did proto-cuneiform represent spoken language?
- What is securely known about tokens, seals, numerical notations, and sign ancestry?
- How did later cuneiform differ in tools, structure, language representation, and range of use?
- What can be said proportionately about training, institutional control, access, and missing voices?
- Which independent writing traditions must be named to prevent a single-origin story?
- Does another image, map, or video teach something the surviving tablet cannot?

## Source ledger

| Source ID | Citation/link | Type and authority | Claims supported | Limits and bias | Corroboration | Rights/use | Review |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `source.met.proto-cuneiform-tablet` | [The Met, Proto-Cuneiform Tablet with Seal Impressions, 1988.433.1](https://www.metmuseum.org/art/collection/search/329081) | Authoritative object record and public-domain image | Object date, material, dimensions, probable Uruk provenance, visible marks/seal, probable grain-distribution reading | “Probably from Uruk” is not a secure excavated findspot; the transaction and seal scene are interpretations | Met writing essay; CDLI corpus for an excavated Uruk comparison | Object image marked Public Domain/Open Access; redistribution approved | Reviewed 2026-07-19 |
| `source.cdli.uruk-iv-tablet` | [CDLI, W 20498 / P003801](https://cdli.earth/P003801) | Specialist corpus record for an excavated Uruk tablet | Clay tablet evidence, Uruk findspot, corpus practice, specialist metadata | Not the featured runtime image; catalog metadata alone does not explain the whole writing system | Met object; Damerow; Antiquity | Research reference only; no CDLI image redistributed | Reviewed 2026-07-19 |
| `source.antiquity.seals-signs` | [Kelley, Cartolano, and Ferrara, “Seals and signs,” *Antiquity* 99 (2025)](https://www.cambridge.org/core/journals/antiquity/article/seals-and-signs-tracing-the-origins-of-writing-in-ancient-southwest-asia/B3C2D400F3F80A7A0162D9035C9C2804) | Peer-reviewed, current specialist research | Tokens, sealings, numerical tablets, sign diversity, administrative context, difficulty of direct token/sign or seal/sign correlations | Focuses on proposed seal-sign relationships; individual correlations remain interpretive and cannot stand for every sign | Damerow; CDLI corpus; ISAC synthesis | CC BY-NC-ND 4.0 reference; no article media or derivative text redistributed | Reviewed 2026-07-19 |
| `source.cdli.writing-epistemology` | [Peter Damerow, “The Origins of Writing as a Problem of Historical Epistemology”](https://cdli.earth/articles/cdlj/2006-1) | Specialist open scholarly article in the Cuneiform Digital Library Journal | Restricted administrative semantics, spatial organization, weak relation to oral syntax, later adaptation to language, evidence limits | Interpretive framework from 2006; terminology such as “proto-writing” is debated and should not become an unqualified learner label | ISAC edited volume; Met essay; Antiquity | Scholarly reference; article text not redistributed | Reviewed 2026-07-19 |
| `source.met.writing-origins` | [Ira Spar, “The Origins of Writing,” The Met](https://www.metmuseum.org/essays/the-origins-of-writing) | Institutional scholarly orientation | Uruk context, administrative use, drawn signs, later wedge impressions, expanding cuneiform uses | Published 2004 and sometimes uses linear “pictograph to cuneiform” shorthand; not the sole authority for contested origins | Damerow; Antiquity; ISAC | Reference only; article text not redistributed | Reviewed 2026-07-19 |
| `source.isac.visible-language` | [Christopher Woods, ed., *Visible Language: Inventions of Writing in the Ancient Middle East and Beyond*](https://isac.uchicago.edu/research/publications/oimp/oimp-32-visible-language-inventions-writing-ancient-middle-east-and) | University of Chicago/ISAC specialist edited volume | What writing is, Mesopotamian development, lexical/scribal practice, later language representation, independent Egyptian/Chinese/Mesoamerican traditions | Broad synthesis; individual chapters carry different arguments and the 2015 edition reprints a 2010 exhibition catalog | Met; Damerow; Antiquity | Institutional research reference; runtime redistribution not asserted | Reviewed 2026-07-19 |
| `source.cdli.englund-account-books` | [Robert K. Englund, “Proto-Cuneiform Account-Books and Journals,” in *Creating Economic Order* (CDL Press, 2004), pp. 23–46](https://cdli.earth/files-up/publications/englund2004a.pdf) | Specialist chapter by a leading proto-cuneiform editor | Number-sign values depend on the counted commodity (p. 31); 85% administrative / 15% lexical as averages (p. 28); school exercises (p. 34); dependent laborers in MSVO 1, 212–214 (pp. 40–41) | 2004; readings of person-qualifying signs are interpretive (“probably”) and come from specific Jemdet Nasr–period accounts, not the Met tablet | Damerow §5 and §8; *Antiquity* | Fact source only; text and figures not redistributed | Close-reviewed 2026-09-24 (voice revision) |

Research stopped when the central claims were supported by an object record plus specialist corpus/scholarship, the major token/seal and language-representation cautions were recoverable, current scholarship largely repeated the same administrative evidence, and remaining uncertainty could be taught honestly. No source supports identifying a single inventor, exact invention moment, universal token-to-sign sequence, or complete list of early users; those claims are excluded.

## Claim ledger

| Claim ID and wording | Kind | Certainty | Sources | Counterevidence/limits and missing perspective | Learner treatment | Review |
| --- | --- | --- | --- | --- | --- | --- |
| `claim.writing.coordination-problem`: late-fourth-millennium institutions used durable devices to organize goods, quantities, people, and activities | Interpretation | High | Met essay; Antiquity; Damerow | Surviving institutional records privilege organized administration over informal memory and exchange | Explain as the problem records addressed, not a claim that memory “failed” | Renewed editorial review required |
| `claim.writing.administrative-evidence`: surviving tablets preserve numerical and commodity signs used for administration and accounting | Observation | High | Met object; CDLI corpus; Antiquity | Surviving tablets are a selected institutional sample | Use as direct support for administrative record-making, not a complete social record | Renewed editorial review required |
| `claim.writing.precursors`: tokens, sealings, bullae, numerical tablets, and other marks existed before and alongside proto-cuneiform in administrative settings | Observation | High | Antiquity; Damerow | Practices varied across time and region | Present as a toolbox/environment, not a neat staircase | Renewed editorial review required |
| `claim.writing.precursor-paths`: some signs may draw on older visual or administrative practices, but most one-to-one paths are not demonstrable | Interpretation | Moderate | Antiquity | The article proposes several context-supported correlations but stresses that shape alone is insufficient | Make the uncertainty the main point | Renewed editorial review required |
| `claim.writing.tablet-object`: Met 1988.433.1 is a small clay tablet dated about 3100–2900 BCE, probably from Uruk, with incised signs, numerical impressions, and a seal impression | Observation | High | Met object record | Provenance is probable, not a documented modern excavation context | Invite close observation and use “probably from Uruk” | Renewed editorial review required |
| `claim.writing.tablet-reading`: the Met interprets the tablet as a probable grain distribution, but its exact transaction is uncertain | Interpretation | Moderate | Met object record | Absence of verbs and restricted notation limit translation | Explicitly separate object from reading | Renewed editorial review required |
| `claim.writing.restricted-information`: proto-cuneiform mostly organized quantities, goods, people, institutions, places, and administrative activities rather than fully encoding sentences | Interpretation | High | Damerow; Antiquity; ISAC | A few lexical/school texts complicate “only accounting”; many signs remain disputed | Say “most surviving texts” and “did not yet work like later cuneiform” | Renewed editorial review required |
| `claim.writing.change-over-time`: tools, signs, conventions, phonetic coding, languages, and text types changed over centuries into later cuneiform traditions | Interpretation | High | Met essay; Damerow; ISAC | The early transition is incompletely documented and was not a straight, inevitable upgrade | Use a three-stage comparison without an invention-moment claim | Renewed editorial review required |
| `claim.writing.power-access`: specialized institutional record-making may have concentrated access to durable information and decisions | Interpretation | Moderate | Damerow; ISAC; Met essay | Early tablets do not identify every reader, writer, decision-maker, or informal user; later scribal evidence cannot be projected backward unchanged | Frame as a question and bounded inference, never direct tablet evidence | Renewed editorial review required |
| `claim.writing.limits`: the surviving administrative corpus is not a complete record of speech, writing uses, or lived experience | Interpretation | High | Damerow; Antiquity | Survival, institutional collection, excavation, and modern decipherment all shape the sample | Contrast what survives, what scholars infer, and what remains missing | Renewed editorial review required |
| `claim.writing.independent-traditions`: Mesopotamian proto-cuneiform was one early tradition; writing also developed independently in Egypt, China, and Mesoamerica | Observation | High | ISAC | “Independent” is a scholarly conclusion about exposure and development, not cultural isolation | Include briefly to block a universal Mesopotamian-origin story | Renewed editorial review required |
| `claim.writing.tablet-making`: Met 1988.433.1 measures about 5.4 × 6 × 4.1 cm; signs drawn with a pointed implement; circular impressions are numbers; purchased 1988 | Observation | High | Met object record (dimensions, credit line, description ¶1) | Purchase means no recorded findspot | Scale and making in sections 1 and 4 | Close-reviewed 2026-09-24 (voice revision) |
| `claim.writing.tablet-seal-scene`: A cylinder seal was incompletely rolled over both faces and edges before the tablet was inscribed; scene of a male figure guiding two dogs on a leash, hunting or herding boars in a reed marsh; the seal apparently has not survived | Observation | High | Met object record, description ¶2 | The Met’s “priest-king … good shepherd” identification is interpretive and stays out (rejected in content triage) | Opening moment and closing callback; card fact | Close-reviewed 2026-09-24 (voice revision) |
| `claim.writing.temple-grain-no-verbs`: The Met reads the tablet as most likely grain distributed by a large temple; the absence of verbs makes early texts hard to interpret with certainty | Interpretation | Moderate | Met object record, description ¶2 | Refines `claim.writing.tablet-reading`; exact transaction unknown | Sections 1, 4 and 5; prompt 2 feedback | Close-reviewed 2026-09-24 (voice revision) |
| `claim.writing.among-oldest`: Proto-cuneiform is probably the oldest known writing system and the only early one documented by an abundance of original texts | Interpretation | Moderate | Damerow §4.1 | Egyptian writing is close in date; “probably” kept | Section 1, stated as “probably” | Close-reviewed 2026-09-24 (voice revision) |
| `claim.writing.seal-uses`: Seals secured containers and doors, covered bullae that could carry numerical impressions and enclose tokens, and were used on blank or numerical tablets; seals expressed authority and property | Observation | High | *Antiquity* 2025, “Information technologies and the Uruk phenomenon”; Damerow §9 | Sequence varied by site; not a single ladder | Section 3 items | Close-reviewed 2026-09-24 (voice revision) |
| `claim.writing.no-discontinuity`: Damerow: tokens, standardized containers and seals developed into proto-cuneiform with “virtually no discontinuity” | Interpretation | Moderate | Damerow §9.3 | One scholar’s framing; quoted and attributed | Section 3 body | Close-reviewed 2026-09-24 (voice revision) |
| `claim.writing.netted-vessel`: Kelley, Cartolano and Ferrara propose that ZATU190 (a vessel in a net) echoes a common seal motif, while warning that shape comparisons alone lack a sound method (Susa loops read as dried fruit or a belt loom) | Interpretation | Moderate | *Antiquity* 2025, “Late pre-literate seal motifs…” and “Comparing seals and signs” | A proposal, not a demonstrated path | Section 3 “Uncertain paths” item | Close-reviewed 2026-09-24 (voice revision) |
| `claim.writing.number-values`: The value of a number sign depended on the counted commodity: N14 could be ten pots of butter oil, about 150 liters of barley, or about 6 hectares of field | Observation | High | Englund 2004, p. 31 | The Met tablet’s own number signs are not identified in the lesson | Section 5 “Quantities” item | Close-reviewed 2026-09-24 (voice revision) |
| `claim.writing.school-lists`: Apart from administrative texts, surviving proto-cuneiform texts are mainly lexical lists, apparently written as exercises | Interpretation | High | Damerow §5; Englund 2004, pp. 28, 34 | Damerow notes the possible literary Tribute List exception (§5.1); lesson says “hardly any” | Sections 5 and 7 | Close-reviewed 2026-09-24 (voice revision) |
| `claim.writing.one-off-signs`: About 6,000 texts and fragments contain more than 1,500 non-numerical signs, more than 500 attested only once | Observation | High | Damerow §8.1–8.2 | Counts depend on how variants are grouped; *Antiquity* speaks of “hundreds” of signs | Section 6 body | Close-reviewed 2026-09-24 (voice revision) |
| `claim.writing.wedges-and-sounds`: Cuneiform (“wedge-shaped”) was written with a wedge-tipped stylus; by the Fara period some 500 years later, partial phonetic writing had changed the system and its range | Interpretation | High | Met object record ¶1; Met essay; Damerow §10.1 | The transition is meagerly documented (Damerow §10.1) | Section 6 items | Close-reviewed 2026-09-24 (voice revision) |
| `claim.writing.dependent-laborers`: Englund reads sign combinations qualifying named persons in MSVO 1, 212–214 as dependent laborers, probably captives taken in violent actions against neighbors | Interpretation | Moderate | Englund 2004, pp. 40–41 | One specialist’s reading of specific accounts; attributed and hedged; no graphic detail | Section 7, one sentence | Close-reviewed 2026-09-24 (voice revision) |
| `claim.writing.uruk-rubbish`: About 5,000 proto-cuneiform tablets were excavated at Uruk by the German Archaeological Institute, 1928–1976; the earliest known come from the Eanna precinct; virtually all were in secondary contexts in rubbish heaps, hampering dating | Observation | High | Woods, “The Earliest Mesopotamian Writing,” *Visible Language*, pp. 33–35 | The Met tablet is not from these excavations | Section 7 | Close-reviewed 2026-09-24 (voice revision) |

## Content triage

| Candidate idea | Decision | Why | Destination |
| --- | --- | --- | --- |
| The coordination problem | Essential | Answers why durable records mattered | Sections 1–2 |
| Tokens, seals, bullae, and numerical tablets | Essential | Establishes continuity without an invention instant | Section 3 |
| Met tablet close reading | Essential | Central evidence encounter | Section 4 and card |
| Restricted semantics versus sentences | Essential | Prevents projecting later writing backward | Section 5 |
| Change toward later cuneiform | Essential | Explains development over time | Section 6 |
| Access, decisions, and missing voices | Essential | Connects information to power while teaching limits | Section 7 |
| Independent writing traditions | Supporting | Prevents a universal single-origin claim | Section 7 |
| Exact sign readings and numerical systems | Deferred | Too technical for the essential question | Deep Dive/future lesson |
| “Priest-king” seal-scene interpretation | Rejected | Memorable but unnecessary and more interpretive than the lesson needs | None |
| Full scribal-school history | Deferred | Mostly documented in later periods | Later cuneiform lesson |
| Map | Rejected | The necessary place relationship is already established by Uruk and prose | None |
| Video | Rejected | Motion, sound, or performance is not required for the learning goal | None |
| Generated reconstruction | Rejected | The surviving object provides the stronger, more honest visual anchor | None |

## Learning blueprint

- **Essential question:** How could marks on clay carry useful information beyond one person’s memory?
- **Durable understanding:** Proto-cuneiform made selected administrative information durable without yet recording language like later cuneiform, and the archive preserves institutional choices more clearly than most people’s voices.
- **Prerequisites:** Uruk, administration, evidence versus reconstruction.
- **Indispensable vocabulary:** record, administration, token, seal, impression, proto-cuneiform, cuneiform, archive.
- **Evidence encounter:** Met 1988.433.1.
- **Historical-thinking move:** distinguish observation from interpretation, then use the surviving object to support a claim while naming a limit.
- **Required sincere-attempt evidence:** select the administrative tablet rather than reconstruction/later literature; explain one possibility created by durable records and one limit of the surviving corpus.

## Section and component storyboard

| Order | Section ID / heading | Learner purpose | Claims/sources | Module | Media/action | Transition |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `section.writing.opening-question` / Can a mark remember? | Enter through a concrete memory problem and continuity from Uruk | coordination / Met, Antiquity | Prose | Imagine information outlasting speaker | What had to be coordinated? |
| 2 | `section.writing.coordination-problem` / When memory is not enough | See records as a response to scale, not abstract progress | coordination / Met, Damerow | Knowledge | Compare count, identify, check | What tools existed before tablets? |
| 3 | `section.writing.before-tablets` / A toolbox before writing | Understand varied precursors and uncertainty | precursor practices/paths / Antiquity, Damerow | Knowledge | Compare token, sealing, numerical tablet | Examine one surviving tablet |
| 4 | `section.writing.tablets-as-evidence` / Read the object, then the claim | Separate visible object from probable reading | tablet object/reading / Met, CDLI | Evidence | Inspect tablet | Ask what kind of information it carries |
| 5 | `section.writing.limits` / A record is not yet a sentence | Distinguish restricted proto-cuneiform from full speech | restricted information / Damerow, Antiquity | Knowledge | Sort what it records/omits | Trace changes over time |
| 6 | `section.writing.signs-change` / Signs, tools, and uses change | Understand later cuneiform as development, not a finished invention appearing at once | change over time / Met, Damerow, ISAC | Knowledge | Compare early/changing/later | Ask who controlled durable records |
| 7 | `section.writing.power-and-access` / What records make visible—and leave out | Connect possibility, institutional access, archive bias, and independent traditions | power, archive limits, independent traditions / Damerow, ISAC | Prose + knowledge | Evidence/interpretation/unknown comparison | Use evidence in World Check |
| 8 | `section.writing.world-check` / World Check | Demonstrate the promised historical-thinking move and complete explicitly | prompt contracts | Prompts | Selection + concise explanation | Runtime completion and next journey action |

## Media and Knowledge Card plan

The single runtime asset remains `media.writing.proto-cuneiform-tablet`, using The Met’s public-domain image of 1988.433.1. Its teaching purpose is close observation of surviving evidence. Depiction mode is `evidence`; the alt text names visible incisions, impressions, clay, and the partial seal without claiming that “barley distribution” is visible. Learner-facing provenance uses `rightsLabel: Public Domain · The Met Open Access`; the separate `approved` media review status remains an internal publication gate and is not rendered as lesson approval. Detailed lineage remains in the catalog and release manifests. No map, video, diagram, or reconstruction passes the teaching-purpose gate.

The lesson earns one deterministic Witness card: `card.artifact.proto-cuneiform-tablet`. The card anchors the distinction between the surviving object and the scholarly reading. Stable identity, media, and unlock configuration remain unchanged; revised facts emphasize observation, probable interpretation, and uncertainty.

## Prompt rationale

`prompt.writing.administration-evidence` checks whether the learner can distinguish direct object evidence from a modern reconstruction or much later text. `prompt.writing.possibility-and-limit` asks for the durable understanding in the learner’s own words. Both remain required because together they assess evidence recognition and explanation. Completion still requires a sincere attempt, not accuracy or a perfect response.

## Ages 11–14 editorial pass

- Starts with a familiar memory/coordination problem, then establishes time and place.
- Defines specialized terms in context and reuses them.
- Uses one concrete object before asking for abstract inference.
- Replaces a simple “pictures evolved into writing” story with three visible changes: what was recorded, how signs were made, and how closely writing represented language.
- Keeps uncertainty in short direct sentences: “The marks survive. The exact transaction does not.”
- Names institutional power and missing voices without claiming that the tablet identifies every writer or reader.
- Avoids civilizational ranking, a lone inventor, inevitability, and the implication that societies without writing lacked complexity or memory.

## Review decisions and pending gates

- Stable lesson, section, reusable claim, prompt, card, media, and legacy IDs are retained because the semantic identity has not changed.
- No database migration is required for this reauthoring; hosted completion configuration remains aligned.
- No new media work is required; existing public-domain provenance and deterministic derivatives remain valid.
- New and materially revised claim wording is marked `editorial-review-required` in the content module pending human re-review.
- Content validation, media verification, tests, type checking, build, database regression tests, and responsive browser verification were rerun after implementation.
- A structured learner walkthrough with ages 11–14 is not completed in this engineering pass and remains a pre-reference-quality follow-up.
- Final historical/editorial and product approval remain pending; PR #8 must stay unmerged until those checks are complete.

## Validation record — 2026-07-19

- Content validation passed against the assembled content bundle.
- Media verification passed for 5 catalog assets and 12 deterministic derivatives.
- The full relevant Vitest suite passed: 19 files and 92 tests, including Uruk regressions and the two-lesson completion path.
- Type checking remains at the documented 44 legacy errors; no error is in a file changed by this reauthoring.
- The production build passed. Vite continues to report the existing large-chunk advisory.
- A local empty-database reset applied every committed migration through 20260717031052_publish_early_writing_systems.sql; all 43 pgTAP assertions passed.
- The production preview passed responsive browser verification at 1440×900, 1024×768, 390×844, and 360×800 in light and dark themes. The walkthrough covered direct load and refresh, decoded media, mobile drawer keyboard focus, Uruk continuation, both required writing prompts, explicit completion, card reveal, completed revisit, and invalid/unpublished lesson states.
- The reauthoring changes no completion configuration or migration. The previously reviewed hosted Chronos configuration remains the durable publication boundary; no dashboard or hosted database mutation was made in this pass.

## Sign-off

- [x] Research questions and source recheck completed
- [x] Source and claim ledgers recorded
- [x] Content triage, learning blueprint, and storyboard recorded
- [x] Media/card/prompt decisions recorded
- [x] Ages 11–14 agent editorial pass completed
- [ ] Human historical/editorial review of revised claims and prose
- [ ] Product owner approval
- [ ] Structured learner walkthrough, or documented product decision to defer
- [x] Post-implementation validation and responsive browser review

## Voice revision

Runbook: `docs/content/lesson-voice-revision-runbook.md`. Branch: `revise/early-writing-systems-voice`. Started 2026-09-24. Status: **approved by the owner 2026-09-24; merge completes the revision**. PR: [#61](https://github.com/dev-vibe/chronos-learning/pull/61).

### Audit of the published version

| Section | What read flat |
| --- | --- |
| `section.writing.opening-question` | Opened on a general system sentence (“Uruk was a city where institutions moved…”), then an announced question; no person, object or moment although the lesson’s own tablet was waiting in section 4. Heading `Can a mark remember?` is a riddle and appears word for word in the creation runbook’s Stage 8 “Fail” column. |
| `section.writing.coordination-problem` | Abstract body (“keep selected details steady while goods and duties moved”); no stakes or institution named; items read like a definition list. |
| `section.writing.before-tablets` | Four generic items; no concrete seal, envelope or sign; “not neat rungs on one known ladder” stated as a hedge rather than shown. The link to the seal on the lesson’s own tablet was missing. Heading `A toolbox before writing` is a metaphor. |
| `section.writing.tablets-as-evidence` | Run of short same-length sentences (“You can observe…”); the best details in the Met record (seal rolled before writing, the scene, the missing verbs, the purchase that leaves provenance at “probably”) were absent. Heading `Read the object, then the claim` is a method slogan a skimming reader cannot decode. |
| `section.writing.limits` | General where a sharp specific exists (“Different numerical systems counted different kinds of goods” instead of what one sign could mean); no mention that the non-account texts are school exercises. |
| `section.writing.signs-change` | Methods voice (“Sign shapes, stylus methods, habits, and sound-uses changed unevenly”); no number or example showing an unsettled early system; no explanation of the word cuneiform. |
| `section.writing.power-and-access` | Hedging repeated (“may also have…”, “careful reading — not something…”); a four-item “Archive care” box (a methods label, not one of the plain Stage 9 labels) repeated limits already made; no person at the receiving end of an account; ended on a list item, not an ending. |

Whole lesson: story spine `none` (a sequence of topics; the tablet appeared only in section 4); memorable moments `none`; opening did not land (system sentence plus announced question); ending did not land (the lesson stopped on a four-item box).

### Story material

- **Story spine:** The Met tablet 1988.433.1. It opens the lesson as a lump of clay rolled with a seal and then written on; section 3 starts from its seal (“the old part”); section 4 reads it; section 5 generalizes from its missing verbs; the ending returns to the man and his dogs still crossing the clay.
- **Memorable moments:** (1) the seal was rolled on first, before anyone wrote, leaving a man guiding two dogs on a leash, hunting or herding boars in a reed marsh, and the seal itself is lost; (2) the same small round number sign could mean ten pots of butter oil, about 150 liters of barley, or about 6 hectares of field; (3) the tablet has no verbs, so it never says who gave or who received; (4) virtually all of Uruk’s 5,000 early tablets came from ancient rubbish heaps.
- **Supporting details:** more than 500 of the 1,500-plus early signs occur only once (an unsettled system); the non-account texts are mostly word lists copied as exercises; the netted-jar proposal and the dried-fruit-or-loom caution from *Antiquity* 2025; Englund’s reading of named “dependent laborers,” probably captives.
- **Sources of the material:** close re-reading of the Met object record (full description), Damerow §§4–10, *Antiquity* 2025 (abstract; “Information technologies and the Uruk phenomenon”; “Comparing seals and signs”; “Late pre-literate seal motifs…”), and Woods in *Visible Language* pp. 33–35; one new specialist source, Englund 2004, for the number values, school exercises and dependent laborers.
- **Later tradition used:** none. No legend fits the evidence here; the gap between the tablet and its reading carries that job.
- **Cumulative link:** section 1 picks up the Uruk lesson (“In Uruk you saw a city where grain, animals, cloth and work had to be shared out…”).

### Changes

- Prose, knowledge body and item text, the evidence caption, the explanation for `prompt.writing.possibility-and-limit` and one card fact rewritten. Prompt IDs, options, answer logic, required flags, media, card identity and completion are unchanged. Section order and section IDs are unchanged.
- Three headings renamed under the Stage 8 heading rules (IDs kept): `Can a mark remember?` → `A clay record of grain`; `A toolbox before writing` → `Record-keeping before writing`; `Read the object, then the claim` → `The tablet up close`. No test or script pins the old headings. The storyboard table above keeps the original headings as the historical record.
- Removed `module.writing.archive-care` (the “Archive care” knowledge box in section 7). Its limits are stated once in prose; its claims (`claim.writing.limits`, `claim.writing.independent-traditions`) move to `module.writing.power`. No test references the module; it is not a prompt module.
- 1 source and 13 claims added to the lesson module and to the ledgers above: `source.cdli.englund-account-books`; `claim.writing.tablet-making`, `tablet-seal-scene`, `temple-grain-no-verbs`, `among-oldest`, `seal-uses`, `no-discontinuity`, `netted-vessel`, `number-values`, `school-lists`, `one-off-signs`, `wedges-and-sounds`, `dependent-laborers`, `uruk-rubbish`. Module `claimIds`/`sourceIds` updated to cover what each module now says.
- Reading length: 615 → 1,243 words in learner-facing headings and modules (lesson significance and hero caption included; prompts excluded). The published version was unusually thin; the added length is the opening scene, the concrete seal and number details and the ending, while the repeated limits box and hedges were cut. The result is in line with the other revised Foundations lessons (Sahul 1,256; Akkad 1,399).

### Left out

- The Met’s identification of the seal figure as the “priest-king … good shepherd”: interpretive and already rejected in content triage; the lesson describes the scene only.
- Kushim, often called the first named person in history: popular but contested (name or title), and not in the registered sources.
- Englund’s reading that one number sign equals one worker’s monthly ration (p. 39): sourced but hedged (“seems reasonable to assume”), and a second number fact would crowd the one about N14.
- The Tribute List as possible earliest literature (Damerow §5.1): too uncertain to feature; the lesson says “hardly any” early text reads like speech so it stays true.
- The rebus principle’s standard examples: the only close-read example (the Met essay’s English “eye/I”) would modernize the point; the lesson says only that some signs came to stand for sounds.
- Signs on the Met tablet that look like ears of grain: visible, but no registered source reads the specific signs, so the lesson does not name them.

### Stage 14B check on the changed sections

| Question | Finding | Evidence and disposition |
| --- | --- | --- |
| Story | pass | Opens on the tablet being sealed and then written; the seal returns in section 3, the tablet is read in section 4, its missing verbs lead section 5, and the ending calls back to the man and his dogs. Knowledge boxes keep parallel items with concrete details; no section is a bare list. |
| Evidence reasoning | pass | Section 4 separates what is visible from the Met’s reading and keeps “The marks survive; the exact transaction does not.” “Probably from Uruk” is explained by the purchase. The *Antiquity* proposal, Damerow’s “virtually no discontinuity” and Englund’s dependent-laborers reading are attributed. Both prompts remain answerable: prompt 1 from sections 4–5 and the caption; prompt 2 from sections 2, 4, 5 and 7. |
| Proportionality | pass | “Probably the oldest” keeps its hedge and the ending names Egypt, China and Mesoamerica; power over records is framed once as a reasonable reading; captives are mentioned once, attributed and without detail; no ranking of societies with and without writing. |
| Cognitive load | pass | New terms: cylinder seal (described in use), clay balls (glossed, the word “bullae” not used), stylus, cuneiform (defined as “wedge-shaped”). Numbers: 6 cm, 4 cm, 3100–2900 BCE, 1988, ten pots / 150 liters / 6 hectares, 1,500 / 500, 500 years, 5,000, 1928–1976 — spread across sections, one idea per sentence. Section 7 is the longest (four short paragraphs). |
| Headings | pass (after revise) | Three headings renamed to plain subject names (see Changes). Remaining headings unchanged. No second title stack added; module eyebrows unchanged. |

`npm run validate:content` passed; `npm run test:domain` passed (14 files, 63 tests). `tests/learn` has one failure, “resolves the published writing lesson with ordered journey navigation” in `tests/learn/multi-lesson.test.tsx`: it pins a journey summary list that predates the Indus, Kerma and Akkad lessons, fails identically on unmodified `main`, and does not touch this lesson’s content.

### Owner review

- Date: 2026-09-24.
- PR: [#61](https://github.com/dev-vibe/chronos-learning/pull/61), branch preview [chronos-learning-git-revise-early-wri-a2d0ed-dev-vibes-projects.vercel.app](https://chronos-learning-git-revise-early-wri-a2d0ed-dev-vibes-projects.vercel.app/learn/lesson.writing.early-systems).
- Story spine: the Met proto-cuneiform tablet 1988.433.1, from the seal rolled across it before anyone wrote to the closing callback on the man and his dogs still crossing the clay.
- Memorable moments: the seal went on first (a man guiding two dogs among boars in a reed marsh; the seal itself lost); one small round sign could mean ten pots of butter oil, about 150 liters of barley or about 6 hectares of field; the tablet has no verbs, so it never says who gave or received; virtually all of Uruk's 5,000 early tablets came from ancient rubbish heaps.
- Added: source `source.cdli.englund-account-books`; claims `claim.writing.tablet-making`, `tablet-seal-scene`, `temple-grain-no-verbs`, `among-oldest`, `seal-uses`, `no-discontinuity`, `netted-vessel`, `number-values`, `school-lists`, `one-off-signs`, `wedges-and-sounds`, `dependent-laborers`, `uruk-rubbish`.
- Owner decisions: Carlin Aylsworth reviewed the branch preview and approved the revision, including the three renamed headings and the removed Archive care box (“approved”), 2026-09-24. During review Carlin also agreed to follow-up platform work (repo-derived publication config, a prompt-change policy and a prompt-revision path), tracked outside this PR.
