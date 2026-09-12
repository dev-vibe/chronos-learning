# Indus Cities and Undeciphered Signs — research and editorial note

Issue: [ASH-100](https://linear.app/ashs-workshop/issue/ASH-100/research-and-publish-indus-cities-and-undeciphered-signs)

Draft PR: [#41](https://github.com/dev-vibe/chronos-learning/pull/41)

Lesson ID: `lesson.indus.cities-and-signs`

Research-note identity/version: `indus-cities-and-signs-v2`, learner prototype, 2026-09-11

Production record version: 2

The September 9 research checkpoint is retained below as history; the September 11 disposition and close-review tables govern this prototype.

Journey/chapter/position: `journey.world-history` / `chapter.world-history.cities-and-states` / canonical position 16

Required or optional: required World Spine lesson

Queue status: `Researching` — prototype built; independent review still pending before the formal owner-approval handoff.

Accountable product/editorial reviewer: Carlin Aylsworth

Researcher: Codex; this is an agent research assessment, not independent historical sign-off

Validation tier: high-risk, because language, identity, transmitted tradition, and political organization require explicit qualification

Branch: `codex/ash-100-indus-cities-and-signs`

Base: originally `ad1b50a`; merged current `origin/main` at `ca3d5dd` on September 11, including PR #42 app/workflow updates.

Worktree: `C:/dev/chronos-learning/.worktrees/ash-100-indus`

## Work boundary and repository evidence

The next four paragraphs record the September 9 starting state. As of September 11, the branch also contains the typed Indus draft, its preview registry and journey entry, and the owner's requested removal of public parent teaching companions. The revised PRD describes linked parent accounts; that separate account feature is not implemented by this lesson branch.

Carlin requested a fresh branch from main for the next eligible lesson, explicitly authorizing parallel work. This increment begins production order 80. The original pyramids checkout contains unrelated uncommitted work and is preserved. Current main includes the pyramids publication and PR #35 for Sahul; Sahul's existing `Review` queue state is left for its owner to close out. Parallel work here is confined to this note and the Indus queue entry.

The production dependency is satisfied by `content/lessons/early-writing-systems.ts` (`status: 'published'`), its inclusion in `content/chronos.ts`, and `supabase/migrations/20260717031052_publish_early_writing_systems.sql`; the queue identifies merged PR #8. ASH-100 already exists under curriculum epic ASH-57, so no duplicate issue was created. ASH-65 and ASH-100 were read; ASH-100 had no discussion comments or existing PR on the new branch when checked.

The content aggregator has ten lesson modules and no authored Indus lesson. The World History chapter currently ends with pyramids; the canonical roster places Indus after pyramids and before `lesson.nubia.kerma-and-nile-world`, with `lesson.writing.early-systems` as its curriculum prerequisite. Existing lessons keep sources, claims, prompts, media references, and cards in bounded modules. The runtime provides typed prose, knowledge, evidence, scene, map, and prompt modules. No platform or migration work is required at this checkpoint.

Reviewed legacy aliases are `indus_cities` and `indus_script` in the roster. Their inclusion here records curriculum identity, not authorization to transfer historical completion without the normal semantic-equivalence check.

## Node proposal

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

Product-owner response: **Proceed, 2026-09-11.** After reviewing the research packet and the workflow/UI assessments, Carlin wrote: “please continue the lesson creation.” This resumes the proposed Indus scope under the updated workflow. It is authorization for claim selection and prototype work, not approval of an unseen prototype or publication. Carlin also explicitly removed the public parent-teaching-guide direction in favor of linked parent accounts with progress and submitted-assessment access.

Follow-up research/disposition: closely inspect the central sources; retain the broad discovery audit without turning every proposal into learner content. The September 11 sources refine the existing scope rather than change the historical model. No decipherment, named government or single-cause ending is asserted.

## Current stage and safe state

Stages 4–14B resumed on September 11. The full typed lesson remains draft and only development preview can open/complete it. Final images, card registration, migrations, unlocks, hosted publication and Stage 15 remain pending prototype approval. Existing pyramids and app work is preserved. The user-requested removal of public parent guides is a separate correction in this branch; linked-parent accounts are specified in PRD §11.9 / CHR-100, not implemented by this lesson.

## September 11 close review and source roles

The earlier S01–S20 ledger records discovery depth honestly. Abstract-only or inaccessible items do not carry learner assertions. The registered production sources below supersede that depth only for the exact passages listed. Research review means Codex read those passages; human historical/editorial approval remains pending. HARP captions and Kenoyer publications often share an investigator/evidence base and are not counted as independent corroboration. UNESCO syntheses likewise inherit excavation records. Green offers an alternative interpretation rather than an independent excavation dataset.

| Registered source | Earlier ledger / new citation | Role | Exact reviewed material and limitation |
| --- | --- | --- | --- |
| `source.indus.dholavira` | S01 | Central supporting / qualifying | Description; Outstanding Universal Value, Brief synthesis and criterion (iv). Site-specific water/stone/craft evidence; the stated stratification is an inference. Do not adopt the stray Southeast Asia wording. |
| `source.indus.moenjodaro` | S02 | Central supporting | Outstanding Universal Value, Brief synthesis: location, streets and drainage. Reject the contradictory brick summary and inherited granary/priest labels. |
| `source.indus.street-drains` | [Mohenjo-daro Street with Drains](https://www.harappa.com/blog/mohenjo-daro-street-drains) | Central supporting | Opening five paragraphs; Wheeler plate 9 and Possehl citation identify the evidence chain. Contextual synthesis, not a newly inspected excavation archive. |
| `source.indus.measuring` | [Kenoyer 2010, Measuring the Harappan world](https://www.harappa.com/sites/default/files/pdf/Kenoyer%202010%20Measuring%20the%20Harappan%20World.pdf) | Central supporting / qualifying | Printed pp. 115–117, fig. 9.10 and table 9.3. Measurements support standards; gateway/craft context supports several use hypotheses. Avoid exact tax claims. |
| `source.indus.harp-weights` | [HARP, Weights, Harappa](https://www.harappa.com/slide/weights-harappa) | Central supporting | Full excavation caption. Same research tradition as Kenoyer; not independent replication. |
| `source.indus.harp-seals` | S03 | Central supporting | Complete Mound E house-assemblage caption. “Merchants” is explicitly tentative, not an identified occupation. |
| `source.indus.met-seal` | [Met object 49.40.2](https://www.metmuseum.org/art/collection/search/324063) | Central supporting / proposed visual | Object details, public-domain designation, displayed image reference. Collection object is not assigned a Harappa findspot; uncertain identification remains visible. |
| `source.indus.rao-response` | S07 | Qualifying | Sections 2–4 and fig. 1 discussion; author explicitly denies that statistics prove linguistic encoding. No corpus or computational replication claimed. |
| `source.indus.green-governance` | S04 | Qualifying / central interpretation | Section “What is The Evidence For Governance in The Indus Civilization?”, shared standards and collective works. Separate cooperative model from political equality. |
| `source.indus.harp-settlement` | [HARP, Changing Settlement at Harappa](https://www.harappa.com/slide/changing-settlement-harappa) | Central supporting | Full periodized settlement caption, Periods 3–5. Harappa contraction is not a population census or universal regional chronology. |
| `source.indus.kenoyer-tradition` | [Kenoyer 2006, Cultures and Societies of the Indus Tradition](https://www.harappa.com/sites/default/files/pdf/CulturesSocietiesIndusTrad.pdf) | Central supporting | Table 1 (PDF p. 6); Localization Era passage (PDF p. 9). Use period convention and continuing skills only; older linguistic/religious correlations are outside this lesson. |

All above accessed and close-reviewed by Codex on 2026-09-11. Citation-only use except the proposed Met open-access image; no media rights are inferred from a source’s availability. Other final visuals require separate licensed originals or reviewed deterministic output after prototype approval.

## Claim ledger

The authored module is the exact wording/reference source of truth. Every row remains `editorial-review-required`; the following records the research disposition. General preservation limitation: archaeology samples surviving objects and excavated areas, not every household’s experience. No equal wealth, peaceful utopia, identified ruler, decoded language or complete transaction is asserted.

| Claim ID and wording | Kind | Certainty | Sources | Counterevidence/limits | Learner treatment | Review |
| --- | --- | --- | --- | --- | --- | --- |
| `claim.indus.urban-period` — The Mature Harappan urban period is conventionally dated to about 2600–1900 BCE; individual settlements have longer histories. | interpretation | high | 'source.indus.kenoyer-tradition', 'source.indus.harp-settlement', 'source.indus.dholavira' | Scope and inference limits retained in wording and close-review table | Explain in context | Codex research review; owner pending |
| `claim.indus.regional-cities` — Indus settlements occupied different environments across parts of present-day Pakistan and India, including Mohenjo-daro and Dholavira. | observation | high | 'source.indus.moenjodaro', 'source.indus.dholavira' | Scope and inference limits retained in wording and close-review table | Explain in context | Codex research review; owner pending |
| `claim.indus.household-drainage` — At Mohenjo-daro, bathing-floor drains fed street drains; covers and settling traps formed part of a maintained drainage system. | observation | high | 'source.indus.street-drains', 'source.indus.moenjodaro' | Scope and inference limits retained in wording and close-review table | Explain in context | Codex research review; owner pending |
| `claim.indus.water-storage` — Dholavira used reservoirs and seasonal streams in a dry setting, with substantial stone construction. | observation | high | 'source.indus.dholavira' | Scope and inference limits retained in wording and close-review table | Explain in context | Codex research review; owner pending |
| `claim.indus.shared-weights` — Measured stone weights from Harappa and other Indus sites follow shared standards, with variation rather than perfect identity. | observation | high | 'source.indus.measuring', 'source.indus.harp-weights' | Scope and inference limits retained in wording and close-review table | Explain in context | Codex research review; owner pending |
| `claim.indus.weight-functions` — Weights could support controlled exchange; their association with gateways and craft areas also supports taxation as an interpretation, not a recovered transaction. | interpretation | moderate | 'source.indus.measuring', 'source.indus.harp-weights' | Scope and inference limits retained in wording and close-review table | Explain in context | Codex research review; owner pending |
| `claim.indus.crafts-and-connections` — Dholavira preserves craft-working evidence and evidence of exchange within the Indus region and with Oman and Mesopotamia. | interpretation | high | 'source.indus.dholavira' | Scope and inference limits retained in wording and close-review table | Explain in context | Codex research review; owner pending |
| `claim.indus.seal-object` — Met object 49.40.2 is a small steatite stamp seal with an animal, a short inscription and another depicted object whose identification is uncertain. | observation | high | 'source.indus.met-seal' | Scope and inference limits retained in wording and close-review table | Explain in context | Codex research review; owner pending |
| `claim.indus.seal-context` — Seals could make clay impressions, and a house by Harappa’s Mound E gateway contained several kinds of inscribed objects; the users’ identities are inferred. | interpretation | moderate | 'source.indus.harp-seals', 'source.indus.met-seal', 'source.indus.green-governance' | Scope and inference limits retained in wording and close-review table | Explain in context | Codex research review; owner pending |
| `claim.indus.undeciphered-signs` — Indus inscriptions have no securely established reading; statistical regularities alone neither translate them nor settle whether they encode speech. | interpretation | high | 'source.indus.rao-response', 'source.indus.met-seal' | Scope and inference limits retained in wording and close-review table | Explain in context | Codex research review; owner pending |
| `claim.indus.coordination-and-rule` — Shared standards and large communal works support organized cooperation; they do not by themselves identify rulers, political institutions or equal access. | interpretation | moderate | 'source.indus.green-governance', 'source.indus.dholavira' | Scope and inference limits retained in wording and close-review table | Explain in context | Codex research review; owner pending |
| `claim.indus.urban-transformation` — After about 1900 BCE, settlement at Harappa contracted; wider changes in urban organization coexisted with continuing farming and craft traditions. | interpretation | high | 'source.indus.harp-settlement', 'source.indus.kenoyer-tradition' | Scope and inference limits retained in wording and close-review table | Explain in context | Codex research review; owner pending |

## Central claim support

| Claim ID | Source ID | Locator | Review |
| --- | --- | --- | --- |
| claim.indus.urban-period | source.indus.kenoyer-tradition | Table 1, PDF p. 6: Harappan Phase and later phases | Codex, 2026-09-11, close-reviewed |
| claim.indus.urban-period | source.indus.harp-settlement | Passage describing Periods 1–5 and occupation extent | Codex, 2026-09-11, close-reviewed |
| claim.indus.regional-cities | source.indus.moenjodaro | Section Outstanding Universal Value, Brief synthesis: Indus plain location | Codex, 2026-09-11, close-reviewed |
| claim.indus.regional-cities | source.indus.dholavira | Passage Description, opening location paragraph | Codex, 2026-09-11, close-reviewed |
| claim.indus.household-drainage | source.indus.street-drains | Passage opening five paragraphs: house connections, covers and cleaned traps | Codex, 2026-09-11, close-reviewed |
| claim.indus.household-drainage | source.indus.moenjodaro | Section Brief synthesis, street layout and sanitation paragraph | Codex, 2026-09-11, close-reviewed |
| claim.indus.water-storage | source.indus.dholavira | Section Brief synthesis and criterion (iv): reservoirs and stone | Codex, 2026-09-11, close-reviewed |
| claim.indus.shared-weights | source.indus.measuring | pp. 115–116, table 9.3 and fig. 9.10 | Codex, 2026-09-11, close-reviewed |
| claim.indus.weight-functions | source.indus.measuring | p. 117, market exchange and taxation discussion | Codex, 2026-09-11, close-reviewed |
| claim.indus.crafts-and-connections | source.indus.dholavira | Passage Description, workshops/materials and interregional trade | Codex, 2026-09-11, close-reviewed |
| claim.indus.seal-object | source.indus.met-seal | Object 49.40.2, title, medium, dimensions and period | Codex, 2026-09-11, close-reviewed |
| claim.indus.seal-context | source.indus.harp-seals | Passage Seals & tablets, complete Mound E house caption | Codex, 2026-09-11, close-reviewed |
| claim.indus.seal-context | source.indus.green-governance | Section What is The Evidence For Governance, stamp-seal and sealing paragraphs | Codex, 2026-09-11, close-reviewed |
| claim.indus.undeciphered-signs | source.indus.rao-response | Sections 2–4, especially fig. 1 discussion denying proof of linguistic encoding | Codex, 2026-09-11, close-reviewed |
| claim.indus.coordination-and-rule | source.indus.green-governance | Section What is The Evidence For Governance, standards and collective construction paragraphs | Codex, 2026-09-11, close-reviewed |
| claim.indus.coordination-and-rule | source.indus.dholavira | Section Brief synthesis, differentiated residential areas | Codex, 2026-09-11, close-reviewed |
| claim.indus.urban-transformation | source.indus.harp-settlement | Passage Periods 4–5, reduced occupied area | Codex, 2026-09-11, close-reviewed |
| claim.indus.urban-transformation | source.indus.kenoyer-tradition | Passage Localization Era, PDF p. 9, continuing farming and craft techniques | Codex, 2026-09-11, close-reviewed |

## Content triage

| Candidate | Treatment | Reason / destination |
| --- | --- | --- |
| Household drainage and seasonal storage | Essential | Explain a city through everyday work and local constraints. |
| Shared weights and skilled production | Essential | Concrete mechanism linking communities; keep transaction types qualified. |
| Seal object and excavated house context | Essential | Separate visible marks, context and unread meaning. |
| Political organization | Essential, short | Coordination is not an identified government or evidence of universal equality. |
| Regional change after 1900 BCE | Supporting close | Prevent disappearance narrative; avoid unresolved single-cause ending. |
| Competing decipherments, Vedic/Tamil transmission | Deferred to possible Investigation | Broad audit retained; no reading meets the needed claim standard here. Revisit with predictive contextual evidence or owner-directed inquiry. |
| River attribution, climate models, Mehrgarh dates, ancestry | Deferred | No such precise causal, early-origin or identity claim is needed for this urban-life lesson. Revisit when authoring those questions; abstract-only sources carry no learner claims. |
| Observatory and dockyard proposals | Deferred | Interesting capability hypotheses, unnecessary for demonstrated coordination. Revisit with new discriminating field evidence. |
| Priest-king, universally peaceful democracy, decoded religious messages | Rejected as settled claims | The sources do not establish them. |

## Learning blueprint

Essential question: How did Indus communities organize city life, and what can we learn while their inscriptions remain unread?
Durable understanding: Water systems, shared measures and seals reveal coordinated urban life; they do not by themselves identify its rulers or recover its messages.
Supporting understandings: Local environments required different water solutions; measurement standards connected work and exchange; object context and sign meaning are different evidence problems; urban change did not erase communities and skills.
Prerequisites: `lesson.writing.early-systems`; prior city coordination in `lesson.uruk.first-city`. Pyramids is the canonical preceding entry, not a new prerequisite invented here.
Misconceptions: all cities require the same government; shared weights prove equal wealth; a patterned sign sequence is a decipherment; an urban phase ending means all people disappeared.
Indispensable vocabulary: reservoir, standard, balance, seal, steatite, decipher, hierarchy. Define in use; do not quiz terminology.
Evidence encounter: Harappa measured weights; Mohenjo-daro drainage connections; Met 49.40.2 object record alongside the separately excavated Harappa house assemblage. Final licensed images remain planned; prose provides usable descriptions now.
Historical-thinking move: Use context and independent kinds of material evidence to constrain an explanation.
Retrieve: Recall how durable marks supported coordination in `lesson.writing.early-systems`, and the shared work of `lesson.uruk.first-city`.
Extend: Explain a connected urban tradition through material systems while avoiding a named government or translated message unsupported by them.
Revisit: Planned `lesson.bronze-age.exchange-networks` can return to measures and seals; planned `lesson.nubia.kerma-and-nile-world` will supply another locally grounded political comparison. Neither is represented as currently available.
Reasoning progression: Earlier observation/inference distinction → combine infrastructure, measurements and find context here → compare alternative explanations with less prompting in later exchange/Investigation work.
Transfer plan: Defer an unfamiliar artifact task to the planned exchange lesson, with an independently reviewed object and contextual scaffold. Here the two required prompts consolidate new content without adding a third hurdle.
Completion versus mastery: Two sincere attempts and explicit completion record study. Independent explanation after a delay or application to a new object would be learner evidence; no such observation has occurred.
Required sincere-attempt evidence: A supported selection about shared measures and a concise explanation of connected water work with an authority limit. No answer accuracy requirement.

## Section/component storyboard

| Order | Section ID | Heading | Teaching job / claims | Module / media | Transition |
| --- | --- | --- | --- | --- | --- |
| 1 | section.indus.cities-and-landscapes | Cities across the Indus region | Urban dates and different settings | Prose; planned locator shared with opening orientation | Water is a common need with different local solutions. |
| 2 | section.indus.water-systems | Water for city life | household-drainage, water-storage | Two prose passages; planned separately identified drain/reservoir evidence | Coordination also connects work and quantities. |
| 3 | section.indus.weights-and-work | Shared measures and skilled work | shared-weights, weight-functions, crafts-and-connections | Prose; planned excavated weights | Seals add information to material exchange. |
| 4 | section.indus.seals-and-signs | Seals and undeciphered signs | seal-object, seal-context, undeciphered-signs | Object record and prose; planned original seal | Objects reveal activity more readily than political authority. |
| 5 | section.indus.organizing-cities | Who organized the cities? | coordination-and-rule | Prose; no decorative media | Systems can change without populations disappearing. |
| 6 | section.indus.changing-settlements | Changes after 1900 BCE | urban-transformation | Prose; no new visual required | Explain what the evidence supports. |
| 7 | section.indus.understanding | Explain the evidence | Shared measures and water coordination | Two canonical prompts | Explicit completion; next published content only. |

Seven required sections. No navigation section, duplicate headline or invented historical scene. Orientation dates use the shared app component; the locator is planned until approved media exists. The final required action remains separate from optional recall.

## Media decisions

| Intention | Placement | Teaching job | Method and rights | Prototype / final review |
| --- | --- | --- | --- | --- |
| Required locator | Opening / cities-and-landscapes | Locate three city examples and varied setting | Reviewed geographic source and deterministic map; follow specialist runbook after approval. No border implying one state; no speculative river route. | Development annotation and native place text / pending |
| Required drain and reservoir evidence | water-systems | Inspect a house-to-street connection and seasonal storage | Source-specific original photographs, licensed for intended distribution. Separate captions; do not imply same city or same scale. | Native descriptions and annotation / pending rights and final review |
| Recommended core weights | weights-and-work | Inspect manufactured objects behind measured standards | Licensed original with identified excavation/context. Photograph alone does not measure mass; retain measurement source. | Native explanation and annotation / pending |
| Required seal 49.40.2 | seals-and-signs | Distinguish visible image/signs from uncertain reading | Met public-domain original, direct use, preserve engraving; no generative restyling. Actual collection object not attributed to Harappa. | Native object description and annotation / pending acquisition and fidelity review |
| Hero, video, extra diagram | None | No additional teaching job at this scope | Not needed; reserve space for locator and evidence | Explicit no-media decision |

## Image lifecycle

No final image has been acquired, generated, registered or accepted in this checkpoint. The visible reference/data-to-final lifecycle blocks will be added under this heading for each final asset after prototype approval. Source images consulted for research are not approved runtime assets.

## Knowledge Card decision

Propose one Artifact / Witness card, `card.indus.stamp-seal`, with `unlockLessonId: lesson.indus.cities-and-signs`. Title: Indus Stamp Seal. Period: c. 2600–1900 BCE; place: Indus region. Use Met 49.40.2 as actual surviving evidence, with a matching source and honest collection context. Significance: a small object can preserve evidence of organized communication without giving us a translated message. Three proposed facts: steatite material; roughly four-centimetre size; engraved design with unread signs. Recall prompt: What can the seal show you before anyone translates its signs? Reuse its licensed evidence image instead of inventing another seal. Card and unlock are not yet implemented; owner approval of this choice is pending.

## Prompt rationale

`prompt.indus.shared-standards` separates a measured pattern from emperor/equality/decipherment leaps. Each option has specific feedback in the updated shared renderer. `prompt.indus.water-and-work` asks for a causal explanation available from either city, plus a bounded uncertainty about authority. Its authored example is comparison support, not personalized grading. The shared deliberate comparison action preserves thinking time; the existing minimum length remains an internal attempt threshold. After final evidence modules exist, reuse their IDs in prompt evidence references rather than duplicate images.

## Ages 11–15 transformations

Drafted for approximately age 12–13: open with household needs; limit the main geography to three cities; define seven terms where used; explain maintenance as well as construction; keep the sign debate to what a decipherment would need to establish. No named speculative rulers, graphic remains, imposed religious identity, sensational disappearance or modern political labels. Short paragraphs and plain headings retain the argument. Age suitability remains a design hypothesis pending actual learner observation.

## Learner-prototype review

Prototype URL: [Open the local Indus prototype](http://localhost:3000/learn/lesson.indus.cities-and-signs). Verified September 11 with `lesson:preview`; this needs the local preview server running on this computer. It is not a hosted preview. The ordinary production build keeps the draft unavailable. Prototype annotations describe planned images, not final learner content.
Proxy type: independent AI editorial/learner proxy requested September 11, but the reviewer failed before reviewing because its service reported an account usage limit. No independent findings were produced; no actual adult or child participant is claimed. This remains an outstanding Stage 14B review, not an author self-approval or a request to approve publication.
Quality-contract findings: author review below; independent review remains pending.
Product/editorial reviewer: Carlin Aylsworth.
Product review: pending; research-direction permission does not approve this prototype.
Learner observation: pending human participation under the sampled program; not a per-lesson block.
Validation: prototype gate and content validation passed. The full suite passed 178 of 179 tests; the remaining journey-order expectation was updated to include Indus and its three-test file then passed. `typecheck:chronos` passed after installing the worktree's lockfile dependencies (the original ancestor dependency tree lacked React types). Browser walkthrough confirmed rendering, deliberate feedback, sincere-attempt completion despite a wrong selection, a truthful no-card journey ending, and reopening at the top. Inspected desktop and mobile layouts in light/dark themes; no console errors were captured. These are local engineering checks, not learner observation or hosted progress validation.

### Author quality-contract pass — Codex, September 11

| Area | Finding and disposition |
| --- | --- |
| Mental-model coherence | Pass for prototype: the opening asks how city needs were met; connected drains, seasonal reservoirs and measured weights support an explanation of coordination. Section five states the limits on recovering political authority. |
| Cumulative learning | Pass for prototype: the opening recalls records and goods; the lesson extends reasoning when inscriptions are unread. Revisit and transfer remain explicitly planned for later lessons, not fabricated live links. |
| Narrative momentum | Pass for prototype: city needs lead to water, shared measures, recorded information and limits on identifying rulers; the ending includes settlement change without claiming a population vanished. |
| Cognitive load and headings | Revised: changed the conclusion-like heading to “Changes after 1900 BCE.” Necessary terms are defined in prose. The long seal section needs its planned object encounter; actual ages 11–15 suitability remains unobserved. |
| Evidence reasoning | Pass for written prototype: named excavated contexts and the Met object record distinguish observations from possible uses; prompts require explanations taught in the text. Final visual inspection remains pending. |
| Historical proportionality | Pass for prototype: standard weights do not prove one emperor, public works do not prove equality, and structured signs are not a decipherment. Political alternatives remain interpretations. Accountable human historical review is pending. |
| Visual teaching value | Deferred with safe behavior: four explicit media intentions remain planned; no fabricated or unlicensed final image is displayed. The inspected Met image shows the animal, signs and adjacent object, but final image selection must resolve seal versus impression presentation and viewing orientation before captioning it. The prose does not require an absent image to answer either check. |
| Next action | Pass locally: compare actions reveal specific feedback; two sincere attempts enable explicit completion, even with the emperor distractor chosen. No-card ending accurately says the available journey is finished. Reopening starts at the top. |
| Rights and accessibility | Partial/deferred: native text and controls render in responsive light/dark views. Final media rights, captions, alt text, derivatives and fidelity do not exist yet and cannot be signed off. |
| Technical/data integrity | Pass for prototype structure and local interactions; draft isolation is covered by existing runtime tests. No publication migration, hosted change or private learner-data access was made. |
| Independent review | Outstanding: reviewer service usage limit prevented the requested review. Retain the active checkpoint; do not claim Stage 14B complete. |

## Final sign-off

Research-direction response recorded September 11. Learner prototype approval, final visual rights/fidelity review, historical/editorial sign-off and publication are pending. No hosted data or publication state has changed.
