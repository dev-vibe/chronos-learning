# Indus Cities and Undeciphered Signs — research and editorial note

Issue: [ASH-100](https://linear.app/ashs-workshop/issue/ASH-100/research-and-publish-indus-cities-and-undeciphered-signs)

Draft PR: [#41](https://github.com/dev-vibe/chronos-learning/pull/41)

Lesson ID: `lesson.indus.cities-and-signs`

Research-note identity/version: `indus-cities-and-signs-v1`, Stage 3B packet, 2026-09-09 (America/New_York; source access 2026-09-10 UTC)

Journey/chapter/position: `journey.world-history` / `chapter.world-history.cities-and-states` / canonical position 16

Required or optional: required World Spine lesson

Queue status: `Researching`

Accountable product/editorial reviewer: Carlin Aylsworth

Researcher: Codex; this is an agent research assessment, not independent historical sign-off

Validation tier: high-risk, because language, identity, transmitted tradition, and political organization require explicit qualification

Branch: `codex/ash-100-indus-cities-and-signs`

Base: `origin/main` at `ad1b50a`

Worktree: `C:/dev/chronos-learning/.worktrees/ash-100-indus`

## Work boundary and repository evidence

Carlin requested a fresh branch from main for the next eligible lesson, explicitly authorizing parallel work. This increment begins production order 80. The original pyramids checkout contains unrelated uncommitted work and is preserved. Current main includes the pyramids publication and PR #35 for Sahul; Sahul's existing `Review` queue state is left for its owner to close out. Parallel work here is confined to this note and the Indus queue entry.

The production dependency is satisfied by `content/lessons/early-writing-systems.ts` (`status: 'published'`), its inclusion in `content/chronos.ts`, and `supabase/migrations/20260717031052_publish_early_writing_systems.sql`; the queue identifies merged PR #8. ASH-100 already exists under curriculum epic ASH-57, so no duplicate issue was created. ASH-65 and ASH-100 were read; ASH-100 had no discussion comments or existing PR on the new branch when checked.

The content aggregator has ten lesson modules and no authored Indus lesson. The World History chapter currently ends with pyramids; the canonical roster places Indus after pyramids and before `lesson.nubia.kerma-and-nile-world`, with `lesson.writing.early-systems` as its curriculum prerequisite. Existing lessons keep sources, claims, prompts, media references, and cards in bounded modules. The runtime provides typed prose, knowledge, evidence, scene, map, and prompt modules. No platform or migration work is required at this checkpoint.

Reviewed legacy aliases are `indus_cities` and `indus_script` in the roster. Their inclusion here records curriculum identity, not authorization to transfer historical completion without the normal semantic-equivalence check.

## Node proposal — provisional research target

**Essential question:** What can the remains of Indus cities tell us about how people lived and worked together when their signs cannot yet be securely read?

**Provisional durable understanding:** Buildings, water systems, and objects can reveal large-scale cooperation while leaving the identities and decisions of the people who organized it uncertain.

Supporting research targets:

- Shared practices connected settlements with different local environments and social arrangements.
- Constructing and maintaining urban services required people, materials, skills, and continuing coordination.
- An object's use and archaeological context can be investigated before its inscription is translated.
- A change in cities does not necessarily mean the disappearance of their inhabitants or traditions.

**Candidate evidence encounter:** the HARP group of seals and tablets from one house near Harappa's Mound E southern gateway (S03). This is a research encounter, not a selected final image or media plan. The association is observable; calling its occupants merchants is an inference.

**Scope:** primarily c. 2600–1900 BCE, northwestern South Asia in present-day Pakistan and India. Harappa, Mohenjo-daro, and Dholavira are candidate comparisons. Earlier settlement and later transformation enter only where necessary to explain the urban phase. These are modern archaeological place/culture labels, not securely recovered names for an Indus nation.

**Prerequisites and bridges:** extend early writing's distinction between marks, information, and language; carry pyramids' distinction between a surviving object and a claim about its makers into a contrasting urban setting. Kerma then continues comparison among connected but distinct Bronze Age societies. Adjacency does not imply that Egypt, Indus, and Kerma succeeded one another without overlap.

**Why one lesson:** cities and signs address the same question of coordination and what survives of it. A separate decipherment survey would overwhelm the core urban case.

**Misconceptions to investigate:** every large city needs a visible king; uniform objects imply one empire; drains prove equality; absence of a decipherment means absence of knowledge; a plausible reading equals a demonstrated reading; civilization began wherever its oldest settlement is found; urban decline means everyone died or left at once.

**Non-goals:** full South Asian prehistory, an exhaustive language-history debate, settlement rankings, a solved script, a verdict on modern national/religious identity, new UI primitives, final assets, publication, or changes to neighboring lessons. These boundaries remain provisional until Carlin considers Stage 3B.

## Research questions

1. Which dates describe settlement, urban integration, and later occupation rather than one undifferentiated civilization?
2. How did water access differ among river cities, former channels, and Dholavira's seasonal-water setting?
3. Which excavated features show coordination, and which proposed institutions remain inferred?
4. What do seals, sealings, weights, workshops, and findspots establish about exchange and administration?
5. What would discriminate linguistic writing, restricted administrative notation, and nonlinguistic symbolism?
6. Which proposed readings make reproducible predictions on inscriptions not used to construct them?
7. What do river/climate studies explain, and where do their dates, geographic reach, or causal mechanisms fall short?
8. How do skeletal and genetic evidence challenge accounts of peace, invasion, migration, and identity without speaking for every community?
9. What do Vedic, Tamil, and other transmitted accounts contribute, and which links to excavated contexts remain unverified?
10. Which recent chronological, computational, architectural, and environmental proposals could change the lesson's model?

## Source ledger

All links below were opened on 2026-09-10 UTC. “Examined” records agent inspection of the stated material; it does not mean human editorial approval or computational replication. Sources support research questions at this stage; there is no learner claim ledger yet. Default rights treatment is research citation only, with no text or image redistribution licensed by implication.

| ID | Citation / source link | Type and authority | Questions / corroboration | Limits and review | Rights |
| --- | --- | --- | --- | --- | --- |
| S01 | UNESCO / State Party, [Dholavira: a Harappan City](https://whc.unesco.org/en/list/1645/) | Official site record | Q1–3; compares with S02, S04 | Site description examined; institutional terms such as castle and social hierarchy are interpretations | Research only; images need separate clearance |
| S02 | UNESCO / Pakistan, [Archaeological Ruins at Moenjodaro](https://whc.unesco.org/en/list/138/) | Official site record | Q1–3; S01, S04 | Examined. Summary says unbaked brick while detailed text describes baked brick; priest college and granary labels need specialist checking | Research only |
| S03 | HARP / Jonathan Mark Kenoyer, [Seals & tablets](https://www.harappa.com/indus/30.html) | Excavation project's contextual object record | Q4–5; S08 uses other object contexts | Caption examined; one house cannot establish a whole economy | Copyright; research only |
| S04 | Adam S. Green (2022), [Of Revenue Without Rulers](https://www.frontiersin.org/journals/political-science/articles/10.3389/fpos.2022.823071/full) | Original comparative archaeological argument | Q3; S01 and S05 are counterweights | Abstract, framing, and comparative method examined; governance reconstructed from material proxies | Research only |
| S05 | Gwen Robbins Schug et al. (2012), [A Peaceful Realm?](https://www.harappa.com/content/peaceful-realm-trauma-and-social-differentiation-harappa) | Study authors' abstract and linked paper record | Q3, Q8; independent skeletal evidence | Abstract examined; full skeletal dataset not reanalyzed | Research only |
| S06 | Steve Farmer, Richard Sproat, Michael Witzel (2004), [The Collapse of the Indus-Script Thesis](https://safarmer.com/files/fsw3.pdf) | Original challenge, author-hosted paper, EJVS 11(2):19–57 | Q5; challenged by S07, S09 | Abstract and argument examined; categorical exclusion exceeds what short surviving records alone demonstrate | Research only |
| S07 | Rajesh P. N. Rao et al. (2010), [Entropy, the Indus Script, and Language: A Reply to Richard Sproat](https://homes.cs.washington.edu/~rao/IndusCompLing.html), with [author rebuttal](https://homes.cs.washington.edu/~rao/IndusResponse.html) | Researchers' methodological response and citation trail to 2009–10 analyses | Q5; explicit S06 countercase | Examined; sequence statistics do not identify a language or translate signs | Research only |
| S08 | Bahata Ansumali Mukhopadhyay (2023), [Semantic scope of Indus inscriptions](https://doi.org/10.1057/s41599-023-02320-7) | Original epigraphic and archaeological analysis | Q4–6; S03 supports contextual approach | Abstract, materials/methods and evidence examples examined; specific taxes/licenses and exclusion of names remain her argument | Research only |
| S09 | Ashish Nair (2026), [How Non-Linguistic Is the Indus Sign System?](https://arxiv.org/html/2604.17828v1) | Independent computational preprint, April 20, 2026 | Q5–6; revisits S06/S07 | Methods, limitations and conclusion examined; code availability claimed, not independently rerun | Research only |
| S10 | Iravatham Mahadevan, [Parpola's Methodology of Decipherment](https://www.harappa.com/script/maha7.html) | Specialist explanation of a competing linguistic method | Q5–6, Q9; compare S08/S11 | Full page examined; presumed language and pictogram identification remain inputs | Research only |
| S11 | Yajnadevam, [A cryptanalytic decipherment of the Indus script](https://rarebooksocietyofindia.org/book_archive/A_cryptanalytic_decipherment_of_the_Indu.pdf), compiled November 13, 2024; [ScriptDerivation repository](https://github.com/yajnadevam/ScriptDerivation), [Lipi README](https://github.com/yajnadevam/lipi/blob/main/README.md) | Claim-owner paper and publicly exposed implementation | Q5–6; a competing Sanskrit solution | Abstract and unicity-distance argument examined; repository pages inspected, execution and exhaustive inscription audit not done | Research only; no code executed |
| S12 | Ajit Singh et al. (2017), [Counter-intuitive influence of Himalayan river morphodynamics on Indus Civilisation urban settlements](https://research-repository.st-andrews.ac.uk/handle/10023/12303) | Original research abstract in university repository | Q2, Q7; independent sediment provenance and dating methods | Repository abstract examined; publisher fetch failed; local scope must be preserved | Article CC BY 4.0; research only here |
| S13 | Hiren Solanki et al. (2025), [River drought forcing of the Harappan metamorphosis](https://www.nature.com/articles/s43247-025-02901-1) | Original paleoclimate/hydrological modeling study, November 27 | Q7; different method from S12/S14 | Abstract and model methods examined; no ancient flow gauges, model bias and proxy coverage limit precision | Research only |
| S14 | Anindya Sarkar et al. (2016), [Oxygen isotope in archaeological bioapatites from India](https://www.nature.com/articles/srep26555) | Original Bhirrana isotope and archaeological study | Q1, Q7; complicates S13 | Abstract and chronology framing examined; earliest habitation is not equivalent to mature cities | Research only |
| S15 | Vasant Shinde et al. (2019), [An Ancient Harappan Genome Lacks Ancestry from Steppe Pastoralists or Iranian Farmers](https://pmc.ncbi.nlm.nih.gov/articles/PMC6800651/) | Original ancient-DNA study, Cell | Q8; comparison with 11 peripheral individuals | Summary and sampling discussion examined; one usable Rakhigarhi genome, no language measurement | Research only |
| S16 | Benjamin Mutin et al. (2025), [New radiocarbon dates of human tooth enamel reveal a late appearance of farming life in the indus Valley](https://www.nature.com/articles/s41598-025-92621-5) | Original dating/modeling study, April 15 | Q1, Q8; scope differs from S14/S15 | Abstract and method framing examined; cemetery dates versus wider onset and migration inference must be separated | Research only |
| S17 | Rigveda 7.95, [R. T. H. Griffith translation](https://www.intratext.com/IXT/ENG0039/_PGZ.HTM) | Transmitted primary hymn in an older translation | Q9; compare geological S12 | Entire hymn examined; translation is dated, composition and geography need modern philological cross-check | Research only; no verse reproduced |
| S18 | Iravatham Mahadevan (2009), [Meluhha and Agastya: Alpha and Omega of the Indus Script](https://www.harappa.com/sites/default/files/pdf/meluhha_and_agastya_2009.pdf) | Original comparative interpretation connecting signs and tradition | Q6, Q9; S10 belongs to same research tradition, not independent confirmation | Paper opened; proposal reviewed as hypothesis, underlying Tamil textual chain not independently collated | Research only |
| S19 | Mayank N. Vahia and Srikumar Menon (2013), [A possible Harappan Astronomical Observatory at Dholavira](https://arxiv.org/abs/1310.6474) | Authors' architecture/astronomy proposal | Q3, Q10; compare S01 | Author abstract examined; crucial roof apertures assumed; full geometric model not rerun | Research only |
| S20 | IIT Gandhinagar / PIB (2024), [Lothal dockyard study release](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2047689&lang=2&reg=3) | Claim-owner institutional release, August 22 | Q4, Q10; river connectivity as evidence for port feasibility | Release examined, underlying study not yet read; release itself requests further chronological work | Research only |

## Recent-challenge audit (Stages 3A–3B)

### Baseline and what supports it

The inherited account is a c. 2600–1900 BCE urban tradition with planned settlements, water infrastructure, exchange, and undeciphered inscriptions. Buildings and excavated objects support substantial coordination (S01–S03); the chronology is also used in independent research (S04, S15). Neither a standardized object nor a monumental building by itself identifies a government. The baseline is stronger than popular additions such as a single priest-king, universal peace, translated religious scenes, or one catastrophic end.

Institutional authority is not a substitute for checking each statement. S02's internally inconsistent brick summary and inherited building labels are specifically excluded as unexamined defaults. The same scrutiny applies to newer cooperative-governance and alternative-decipherment proposals.

The following is an analytical research matrix, not a learner claim ledger. Proposed teaching consequences remain subject to Carlin's response. Tests and counterarguments identified as “assessment” are this researcher's reasoning, not claims of published refutation.

| Revision / consequence | Origin and evidence | Method / inferential link | Corroboration and strongest countercase | Discriminating test | Provisional status / possible lesson consequence |
| --- | --- | --- | --- | --- | --- |
| **1. Coordination without a ruling elite** changes the model inherited from Egypt | Green 2022, S04: infrastructure, access, craft standards, public buildings | Collective-action comparison reconstructs inclusive institutions | S01 supports substantial planning but also unequal residential divisions; S05 warns against universal equality. Public works alone do not reveal decision rights | Compare access, wealth and authority indicators across neighborhoods, cities and phases | **Supported inference:** extensive coordination. **Plausible hypothesis:** specific egalitarian institutions. Make the distinction central; do not announce democracy |
| **2. Violence and inequality** challenge a peaceful utopia | Robbins Schug et al. 2012, S05: injuries and burial differences at Harappa | Patterns by burial group and gender connect trauma with social differentiation | Independent evidence class from architecture; selective burial, preservation and one-site sampling constrain extrapolation | Comparable, securely phased skeletal samples from more sites | **Supported inference** of patterned interpersonal violence at Harappa; not proof of empire-wide war or an invasion. Preserve unequal experiences without graphic treatment |
| **3. Nonlinguistic signs** would change what “undeciphered” means | Farmer–Sproat–Witzel 2004, S06: brevity, sign distributions, absent long texts | Compare inscription behavior with nonlinguistic symbols; challenge hypothetical lost manuscripts | S07 contests the statistical and preservation inferences; administrative brevity is not decisive either way | Predict held-out sequences and contexts; discover securely contextualized longer or bilingual records | **Unresolved conflict.** Do not infer literacy merely from city size or illiteracy merely from short texts |
| **4. Linguistic statistical structure** pushes against categorical non-script claims | Rao et al. 2009–10, S07: sequence regularities and entropy | Compare sign-order constraints across systems | Patterned nonlinguistic systems can overlap; authors explicitly distinguish supporting evidence from proof | Stronger real-world controls, corpus normalization and independent replication; test readings separately | **Supported inference:** structured ordering. **Unresolved:** speech encoding. Avoid “computer analysis decoded it” |
| **5. Restricted administrative notation** could bridge a false binary | Mukhopadhyay 2019/2023, examined through S08: sealings, object locations, sign positions and numerical notations | Compare patterned messages with administrative systems; propose taxation/licensing functions | S03 independently supports contextual use; a commercial context does not itself decode fees or exclude personal names | Predict sign classes against new findspots, goods, quantities and artifact types | **Plausible hypothesis**, especially broad administration; exact semantics remain unverified. Candidate comparison rather than translated fact |
| **6. A 2026 statistical challenge** changes the controls used in the debate | Nair, S09: 1,916 deduplicated inscriptions and synthetic/real nonlinguistic comparisons | Multi-metric comparison tests specific alternative generators | Not an independent decipherment; shared corpora, duplicate handling, allographs and short sequences affect results | Rerun public workflow with richer administrative models and independent corpus normalization | **Unverified here computational result; unresolved linguistic conclusion.** The author disclaims resolving the question. Useful research update, not a learner breakthrough |
| **7. Dravidian readings** could identify language and cultural connections | S10: pictorial/rebus readings constrained by reconstructed Dravidian forms | Proposed picture → sound → other meaning, checked against context | Comparative linguistics supplies constraints; object recognition, homophones and presumed language can still allow multiple readings | Fix values and segmentation first, then predict new inscriptions without changing the key | **Plausible language hypothesis; particular readings unverified.** Do not silently turn the fish/star comparison into a translation |
| **8. Sanskrit cryptanalytic decipherment** would overturn language and script chronology | Yajnadevam, November 2024 manuscript and public repositories, S11; claims post-Vedic Sanskrit and a proto-abugida | Regex/set intersection, sign grouping and a Shannon unicity argument | Public implementation permits scrutiny. Assessment: uniqueness conditional on a chosen cipher model is not proof that the ancient system used that model; grouping/reading freedoms need accounting | Independent sign inventory, frozen rules, held-out objects, full failures and blinded linguistic/contextual review | **Unverified claim**, not accepted here as a decipherment. No reproduction or comprehensive refutation claimed; same predictive standard as S10 |
| **9. Cities beside a former Himalayan channel** changes the river story | Singh et al. 2017, S12: sediment architecture/provenance and OSL ages | Former Sutlej course diverted well before mature urbanism | Independent methods within one study converge; local channel history cannot settle every Ghaggar-Hakra reach or the identity of a hymn's river | Expand dated cores and match site occupation to local hydrology | **Supported inference within sampled reach.** Avoid placing all cities on a single perennial river or dating a named tradition from one core |
| **10. Drought versus adaptation** changes the ending | Solanki et al. 2025, S13, reconstruct prolonged river drought; Sarkar et al. 2016, S14, emphasize subsistence change | Basin simulation/proxy comparison versus local isotope/occupation sequence | Different scales and mechanisms partly explain disagreement; coincidence does not isolate causes, and models lack ancient gauge calibration | Independently date regional occupation/crop changes against local water records | **Supported environmental pressure; unresolved causal weighting.** Candidate regional transformation account, not one drought that erased everyone |
| **11. Earlier settlement claims and younger Mehrgarh dates** change the prelude | Bhirrana S14 dates pre-urban occupation; Mutin et al. 2025 S16 model 23 Mehrgarh burials to begin c. 5200–4900 BCE | Isotope/stratigraphic chronology and enamel radiocarbon/Bayesian modeling | Different sites and phases, not direct mutual refutations. Cemetery onset and regional farming onset are not identical | Replicate with other securely stratified materials and compare non-cemetery contexts | **Recent proposed chronological revision.** Keep c. 2600–1900 BCE urban focus; neither “8,000-year-old cities” nor a settled regional origin date follows |
| **12. Ancient DNA constrains ancestry narratives** | Shinde et al. 2019, S15: one usable Rakhigarhi genome, compared with peripheral individuals | Statistical ancestry models | Narrow sampling; language, religion and political affiliation are not genetic measurements. S16's farmer-diffusion inference concerns another time/place, requiring explicit reconciliation rather than a headline contest | More securely dated genomes across regions and earlier phases, integrated with archaeology | **Supported sampled ancestry result; broad identities unresolved.** Do not use one person to prove no migration, an invasion, or a language |
| **13. Transmitted accounts may preserve connections** | Rigveda Sarasvati hymn S17; Mahadevan's Meluhha/Agastya argument S18 | Compare river descriptions, later traditions, signs and possible linguistic continuities | Transmission preserves meaningful evidence, but the material/textual link needs independent dating; assumed sign readings cannot confirm themselves | A dated bridge of forms, geography and texts independent of the proposed reading | **Direct evidence of transmitted accounts; Indus identification unresolved.** Consider respectfully without presenting them as contemporary city records |
| **14. Specialized engineering interpretations** could alter capability and trade | Vahia/Menon 2013 observatory proposal S19; IITGN 2024 Lothal release S20 | Solar geometry with assumed roof openings; remote-sensed river connectivity for port feasibility | Model feasibility is not demonstrated use. S20 explicitly leaves channel timing for further work | Surviving aperture/phase evidence and alternatives for Dholavira; dated navigable connection and basin-use deposits for Lothal | **Plausible hypotheses with missing tests.** Neither needed to establish engineering ability; potential Investigation depth |

### Ancient, local, descendant and comparative perspectives

S17 is a hymn to Sarasvati, represented in Griffith's translation as a powerful river associated with mountains and ocean. It is evidence of a transmitted religious/geographical conception. Its genre does not erase that value; neither does it supply an independently fixed date or a unique match to an excavated river channel. A modern critical translation and philological comparison remain necessary before using its wording in learner prose.

S18 explicitly proposes a link between common Indus signs, Meluhha and Agastya traditions. That comparison matters because it suggests cultural transmission rather than unexplained disappearance. The sign readings and the historical bridge remain hypotheses. This pass has not independently collated the Tamil texts or established an unbroken transmission chain.

The search included South Asian excavation/project sources, Indian research teams, an Indian independent epigrapher, Dravidian and Sanskrit interpretation communities, and material from present-day Pakistan. No community was contacted, and no consultation with living descendants or Indigenous representatives is claimed. No single modern population is treated as the exclusive owner or unchanged identity of the Indus world.

The main comparative methods examined were urban infrastructure/access, skeletal groups, linguistic and nonlinguistic corpora, rebus readings, cryptanalysis, river stratigraphy, climate simulation, ancestry modeling, transmitted names/stories, and architectural astronomy. Each comparison supplies a limited inferential link; none replaces all the missing evidence with resemblance.

### Coverage statement

- **Window:** approximately 1976–2026, with older transmitted texts and founding decipherment/urban assumptions retained where recent work tests them. Publication dates were read from articles: search crawl dates were not treated as publication dates.
- **Searches:** Indus/Harappan urban governance, collective action, water systems, priest-king, trauma/peace, river change, Ghaggar-Hakra/Sarasvati, drought/metamorphosis, Bhirrana antiquity, Mehrgarh enamel dates, Rakhigarhi ancestry, Indus signs nonlinguistic/entropy, Bahata administrative semantics, Dravidian/Parpola/Mahadevan, Sanskrit/Yajnadevam cryptanalysis, 2025–2026 decipherment/AI, Agastya/Meluhha, Dholavira observatory, and Lothal dockyard.
- **Repositories and trails:** UNESCO site records; HARP/Harappa researcher contributions; publisher pages at Nature/Frontiers; PubMed/PMC and university repositories; author pages at Washington; Farmer's paper archive; arXiv; claim-owner GitHub; PIB's IITGN release; a transmitted Rigveda translation. Discovery-only news, Wikipedia, and discussion results led to underlying sources; their summaries were not substituted for primary support.
- **Source-access limits:** Nature/PMC intermittently returned cookie or captcha pages; accessible publisher/DOI or university versions were used where available. British Museum seal `1912,0629.1`, the Kenoyer 2008 PDF, Dani interview, and the June 2025 RMRL bulletin did not load reliably. They are leads, not read authorities. The full Lothal paper, observatory model, corpus volumes, and all supplements were not audited. S12 is inspected at author-abstract level only. Review depth is explicit in the ledger.
- **Known gaps:** no exhaustive census of every claimed decipherment; no code replication; no new excavation or private datasets; no full philological review of Sanskrit/Tamil traditions; no audited transport-network chronology, seal workshop corpus, or region-wide inequality dataset. These gaps restrict certainty and selection; they do not justify treating the inherited story as proved.
- **Saturation and boundaries:** independent evidence classes converge on major urban coordination and significant local variation. New sources continue to refine disputed governance, script and transformation models. This is a bounded Stage 3B sweep with named follow-ups, not a claim that every possible challenge has been found or resolved.

## Research-direction packet and product-owner response

**Provisional synthesis:** retain the approved cities-and-signs scope. Investigate how people coordinated water, work and exchange; make the difference between material evidence and a proposed institutional or linguistic explanation visible. The strongest revisions add variation and testable uncertainty rather than a new single master explanation.

**Possible effect on essential question:** keep the provisional question about what city remains can reveal. Avoid framing the whole lesson as a hunt for a code that will explain everything. A decipherment could change many conclusions, but archaeology already carries substantial historical knowledge.

**Candidate highlights for consideration, not selected claims:** locally different water solutions; coordination without pretending to know who ruled; an excavated group of inscribed objects whose use can be investigated; contested sign models; regional urban transformation. Preserve ordinary inhabitants and labor, not only rulers and famous objects.

**Potential optional depth:** a controlled comparison of sign models and claimed readings; Sarasvati geography/tradition; the dates and mechanisms of urban transformation; observatory and dockyard tests. No new journey, media plan, card decision, storyboard or learner prose has been created.

**Judgment requested:** proceed toward an urban-life lesson with a concise, substantive account of the sign debate, keeping linguistic identity, transmitted-tradition and engineering-upset arguments in the research record unless Carlin wants one investigated further before drafting. The current research does not warrant treating any decipherment, named ruler, universal equality or single-cause collapse as settled.

Packet shared: 2026-09-09, this note and the current task handoff.

Product-owner response: **pending**.

Follow-up research/disposition: record Carlin's directions here; repeat Stages 3A–3B if a missed evidence class changes the model.

## Deferred stages and safe state

Stages 4–18 have not started. The claim ledger, content triage, learning blueprint, storyboard, age transformation record, prompts, media intentions, Knowledge Card decision, prototype and publication sign-offs await the research-direction response. No lesson preview exists yet; this research note is the direct review surface required by the runbook before a prototype exists.

No final images have been acquired or generated. There is no image lifecycle to approve at this stage. No content module, journey entry, runtime file, generated catalog, database migration, hosted configuration, completion rule or card unlock changed.

Validation for this checkpoint: review changed Markdown, confirm queue identity and source-reference coverage, and run `git diff --check`. Product/runtime tests and the prototype gate are not applicable until a typed prototype exists. The note does not claim those gates passed.
