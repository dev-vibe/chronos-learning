# World Spine audit

Status: **Approved on July 19, 2026; product-owner amendments incorporated on July 19, 2026.** The audit and roster define curriculum documentation and the approved production runway; runtime fixtures and application behavior remain unchanged.

## Audit question

Which finite sequence of required lessons gives a learner aged roughly 10–14 the strongest causal and evidentiary understanding of world history? The answer is not an encyclopedia, a demographic allocation, or a list of famous names. A node belongs only when it makes a distinct, age-suitable explanatory handoff that later lessons depend on or that unusually clarifies the wider human story.

## Inventory and traceability

The audit covers **382 legacy records**: **381 unique timeline stubs** from `INITIAL_NODES` plus the content-only `wheel_legacy` duplicate. The earlier 379 figure in the architecture audit was superseded by two later additions on `main`; the current source was recounted directly. No legacy node is silently discarded.

The row-complete disposition—including legacy identity and date, one allowed disposition, proposed canonical identity and date, destination, rationale, overlap/prerequisite notes, and editorial status—is in [data/world-spine-legacy-node-audit.csv](data/world-spine-legacy-node-audit.csv). It maps **140 legacy records** into canonical nodes and explicitly relocates, researches, replaces, or archives the rest.

The distinct approved sequence is documented in [world-spine-canonical-roster.md](world-spine-canonical-roster.md), with its machine-checkable form in [data/world-spine-canonical-roster.csv](data/world-spine-canonical-roster.csv).

### Disposition totals

| Disposition | Count |
|---|---:|
| Keep | 2 |
| Adapt or rename | 27 |
| Merge | 95 |
| Reframe | 14 |
| Replace | 1 |
| Research further | 2 |
| Move to another Journey type | 235 |
| Archive | 6 |
| **Total** | **382** |

### Inventory completeness by legacy era

| Legacy era | Audited records |
|---|---:|
| prelude | 1 |
| foundations | 64 |
| classical | 46 |
| early_medieval | 27 |
| high_medieval | 35 |
| contact | 28 |
| renaissance | 19 |
| enlightenment | 20 |
| industry | 54 |
| global_conflict | 37 |
| modern | 51 |
| **Total** | **382** |

The content-only `wheel_legacy` record is counted under `foundations`. Counts are validation inputs, not coverage targets.

## Methodology and selection rubric

Each candidate was tested in sequence, not in isolation, against eight questions:

1. **Prerequisite value:** Does a later required lesson become confusing or misleading without it?
2. **Causal leverage:** Does it explain durable institutions, exchanges, conflicts, environments, or consequences?
3. **Wider significance:** Is it global, cross-regional, or a strongly representative case that changes a larger model?
4. **Explanatory power:** Does it help learners answer why or how, beyond remembering a name or date?
5. **Interest and memorability:** Is there a concrete human question, place, object, decision, or evidence problem?
6. **Evidence and teachability:** Can claims be supported by age-suitable primary, archaeological, scientific, or authoritative secondary evidence?
7. **Unique contribution:** Does it avoid duplicating a neighboring node or a broader synthesis?
8. **Age suitability:** Can the scope be honest, bounded, and comprehensible without flattening uncertainty or harm?
9. **Intellectual and dialectical continuity:** Does the sequence show inherited questions, competing answers, institutions, practical consequences, and later transmission or rebuttal?

The audit process was:

1. enumerate every legacy stub and expanded record;
2. compare each against current lessons, curriculum classification, World History membership, and the latest queue document available on `origin/agent/ash-64-lesson-creation-runbook` (the queue is not yet present on `main`);
3. identify causal gaps before deciding chapter boundaries;
4. merge event, person, invention, and battle chains where one process node teaches more, while preserving separate nodes where a thinker or school marks a genuine turn in a long intellectual argument;
5. verify material dates, disputed framing, exchange, and significance with authoritative sources;
6. assign one allowed disposition to every legacy record;
7. order canonical nodes by historical chronology and prerequisite logic;
8. diagnose geographic concentration, missing links, duplication, thematic continuity, and production readiness.

Geographic breadth was used to find blind spots. It was never scored, balanced mechanically, or used to add a token node.

Slavery was evaluated as a recurring worldwide institution with locally different forms, not as a phenomenon unique to one people or civilization. Atlantic slavery receives concentrated treatment because of its distinctive racialization, oceanic scale, plantation economy, and global consequences. Abolition is treated causally: Western Quaker and evangelical Protestant networks supplied exceptional organization and moral pressure, acting with Black abolitionists and testimony, enslaved resistance and revolt, allied reformers and arguments, and the legislative, military, diplomatic, and enforcement power that converted protest into uneven legal emancipation.

## Major additions

- Greek, Chinese, South Asian, Iranian and Persianate, Jewish, Christian, and Islamic intellectual developments now form explicit dialectical chains rather than a compressed “thinkers” survey.
- Human origins in Africa, ancient DNA, Sahul, the peopling of the Americas, and Ice Age lifeways restore the missing deep-time foundation.
- Multiple independent agricultural beginnings replace a single Fertile Crescent “revolution” as the global frame; the current Southwest Asian lesson remains a bounded case.
- Zhou political ideas, Aksum, Swahili cities, Great Zimbabwe, Cahokia, Delhi, and the Inca road system repair causal gaps with distinct evidence and downstream value.
- Mongol rule and the Black Death become explicit bridges between post-classical regional systems and the early modern world.
- The Columbian Exchange, Atlantic slavery, Manila silver, and plantation resistance make the early global economy causal rather than decorative.
- Haiti, settler colonialism, abolition's incomplete aftermath, global migration, labor, women's movements, and African and Asian resistance explain how industrial mass society changed power.
- Armenian genocide, interwar anticolonial movements, China's revolution, decolonization, postwar rights movements, and the 1947–49 Israel–Palestine node close major twentieth-century prerequisite gaps.
- Climate, public health, computing, globalization, and recent interdependence form long causal threads rather than a string of product launches.

## Important mergers

- `wheel`, `wheel_legacy`, Bronze Age metallurgy starts, and broad bronze-spread stubs become **Wheels, Metals, and Specialized Work**.
- Indus cities and the undeciphered signs become one evidence-centered node.
- Gulf copper, Old Assyrian trade, Eurasian metallurgy, Cyprus, and Uluburun feed one **Bronze Age Exchange Networks** synthesis.
- Hittite, Egyptian, Amarna, Mitanni, and Kadesh material supports one diplomacy-and-rivalry node.
- Minor biographical stubs still merge where appropriate, but Greek intellectual history now has separate epic/public-argument, Socratic/Platonic, and Aristotelian/Hellenistic turns. Comparable Chinese, South Asian, Islamicate, Persianate, Jewish, and medieval school sequences preserve intellectual causality.
- Roman battles, rulers, engineering, and crisis markers consolidate into institutional Republic, Empire, and reconfiguration nodes.
- Caliphate battles and rulers consolidate into origins, governance, and Baghdad knowledge-network lessons.
- Industrial inventors consolidate into energy, production, network, and science-system lessons.
- Sarajevo merges into First World War causes; separate battle stubs merge into global-war nodes for both world wars.
- Product milestones from ARPANET through smartphones merge into computing/network and platform/divide nodes.

## Reframes and replacement

- “Younger Dryas: The Great Freeze” loses myth tagging and becomes climate context, not a claimed reset.
- The “Agricultural Revolution” becomes multiple beginnings plus a specific Southwest Asian case.
- “First empire,” “first peace treaty,” and lone-inventor claims are replaced by bounded, comparative descriptions.
- “Sea Peoples” becomes a multi-causal, regionally uneven Late Bronze Age transformation.
- Abraham and David move from asserted biographies into an Israel/Judah node that distinguishes archaeology, inscriptions, texts, and later tradition.
- “Gupta Golden Age (Zero Invented)” becomes a cross-institution knowledge node that avoids a single-date invention claim.
- “Fall of Rome” becomes a regional reconfiguration with eastern continuity.
- The c. 900 CE New Zealand date is the one **Replace** disposition: it becomes a longer Polynesian-voyaging history with settlement of Aotearoa New Zealand at approximately 1250–1300 CE.
- The Berlin Conference is taught as rule-making and claim formalization within high imperialism, not as one meeting that literally drew every African border.
- “Establishment of Israel” becomes the 1947–49 war-and-displacement node with Israeli and Palestinian histories and terminology review.

## Relocations and archives

Most excluded legacy records are not rejected as unimportant. Individual rulers, battles, artworks, texts, discoveries, and national episodes move to Story Arcs or Idea Trails where they can deepen a period without pretending to be prerequisites. Archaeological controversies, legendary biographies, and source conflicts move to Investigations.

Six low-leverage standalone popular-culture or event stubs are archive recommendations: `mozart`, `roaring_twenties`, `titanic`, `van_gogh`, `woodstock`, and `star_wars`. Archiving retires the progress-bearing stub; it does not require deleting reusable assets or research notes.

## Gaps, overlaps, and balance

### Resolved gaps

- Deep-time humanity before the Younger Dryas.
- Independent food-production histories beyond Southwest Asia.
- Causal bridges between Bronze Age states, Iron Age transformations, classical systems, and late antiquity.
- African and Indian Ocean state and network histories before European oceanic expansion.
- North American urbanism before Atlantic conquest.
- Connections from Mongol expansion to plague and from silver and slavery to industrial finance.
- Imperialism and resistance as prerequisites for world war and decolonization.
- Post-1945 histories outside a US–Soviet event list.

### Controlled overlap

Some adjacent pairs remain intentionally distinct because they answer different questions: Uruk versus early writing; Atlantic slave-trade system versus plantation and Middle Passage experience; Mongol conquest versus plague; First World War causes versus wartime systems; Nazi dictatorship versus the Holocaust; decolonization versus Cold War proxy conflicts. Their scopes and prerequisites prevent duplicate required progress.

### Concentration diagnosis

The 1450–1945 sequence is relatively dense in European-origin systems because Atlantic empire, industrialization, high imperialism, and two world wars had disproportionate worldwide consequences. Those nodes consistently include the non-European societies, coerced labor, resources, resistance, and networks that made the systems global. Ancient and post-1945 coverage is distributed across several independent regional systems because no one region provides the needed causal skeleton.

Meaningful absences are stated rather than hidden. The core does not survey every African kingdom, Indigenous nation, South Asian dynasty, Chinese dynasty, European state, or modern national election. Australia has strong deep-time and Pacific representation but no distinct later precolonial core node yet; Central Asia usually appears through steppe and exchange systems; national cultural canons remain optional unless they change a wider causal model.

### Thematic diagnosis

The roster maintains continuous threads for food and environment, disease, information systems, state capacity, coercion and resistance, trade and migration, belief and legitimacy, energy and labor, rights and institutions, and historical evidence. It avoids an invention parade, a battle chronology, a rulers list, and a simple westward relay of “civilizations.”

## Research and production status

**Approved reference:** only Uruk and early writing. **Ready candidates:** the current farming case plus Nile-state, Indus, Caral, Akkad, and Bronze-network nodes. All other included nodes are Planned or Research required. “Verified for roster” means the inclusion and date decision has authoritative support; it does not mean a lesson claim, source, or media brief is complete.

High-priority research gates:

1. Sahul and earliest-Americas date language.
2. The causal limits of Younger Dryas framing.
3. Zarathustra's date and the appropriate core scope.
4. Israel/Judah archaeology-text distinctions and the 1947–49 Israel–Palestine terminology and source protocol.
5. Multi-phase Bantu-language dispersal chronology.
6. Late Bronze Age regional variation.
7. Comparative dictatorship wording and genocide-sensitive scopes.
8. Atomic-bomb decision framing.
9. Recent-history endpoints: COVID, platforms, gene editing, generative AI, and new archaeological evidence.

## Approved resolutions and continuing research gates

The product owner approved these resolutions on July 19, 2026. A research gate below means the node and framing are approved, but the lesson still requires the named source or editorial review before production.

### Zoroastrian chronology

**Why flagged:** proposed dates for Zarathustra range broadly, and much of the textual evidence survives in later forms. A precise c. 1000 BCE biography would imply certainty the sources do not provide.

**Recommendation:** keep `lesson.iran.zoroastrian-traditions` because the tradition is historically consequential, but mark it Research required. Teach the chronology dispute and distinguish early traditions from later textual and imperial developments.

### Israel and Judah: evidence and tradition

**Why flagged:** archaeology, neighboring inscriptions, biblical writings, and later Jewish and Christian interpretations answer different questions and were produced in different contexts.

**Recommendation:** keep the node and require a source protocol that labels archaeological evidence, contemporary external evidence, literary tradition, and later interpretation separately. This is historical method, not a verdict on religious truth.

### Israel–Palestine, 1947–49

**Why flagged:** “independence,” “establishment,” “war,” “Nakba,” “displacement,” and “expulsion” carry different evidentiary and communal meanings. Omitting one perspective would distort later history.

**Recommendation:** keep the research-gated node. Cover UN partition, Israel’s establishment and war of independence, intervention by neighboring states, Palestinian flight and expulsion and the Nakba, the refugee crisis, and divergent memories. Require terminology and sensitivity review before lesson briefing.

### Bantu-language dispersals

**Why flagged:** the process spans many centuries, different routes, changing economies, and extensive interaction with existing communities. Positioning it at one date can recreate the false image of a single migration wave.

**Recommendation:** retain one long-duration synthesis positioned by its early phase, state the chronology uncertainty, and add explicit callbacks in later eastern and southern African nodes. Split it only if research supports two clearer causal lessons.

### Two Atlantic-slavery nodes

**Why flagged:** two required nodes can become repetitive, but one node cannot responsibly carry both system formation and lived operation.

**Approved resolution:** keep both. `lesson.atlantic.slavery-system` first establishes that slavery and captive labor existed widely across world history, then explains the Atlantic system's distinctive political economy, oceanic scale, forced transport, hereditary racialization, and plantation growth. `lesson.atlantic.plantations-and-middle-passage` explains captivity, plantation regimes, diaspora, survival, resistance, and revolt without repeating system formation. `lesson.abolition.emancipation-and-afterlives` must then make the exceptional organizational role of Western Quaker and evangelical Protestant abolitionism visible, together with Black abolitionists and testimony, enslaved resistance and revolution, allied religious and natural-rights arguments, and the state power needed for legal abolition and enforcement. It must not claim that emancipation immediately ended coercive labor or that abolition spread through one uniform European process.

### The endpoint: AI or historical method

**Why flagged:** AI is consequential but still too recent for stable historical judgment; ending on a technology trend could also imply that the Spine culminates in the present product cycle.

**Recommendation:** retain the platforms, divides, and AI node provisionally as Research required, but end the required sequence with `lesson.history.new-evidence-changes-the-past`. The final lesson should return to how evidence, new methods, uncertainty, and revision shape responsible historical knowledge.

### Approval record

The product owner approved the complete roster and the recommendations above on July 19, 2026, adding the explicit global-slavery and Protestant-abolition clarification now incorporated into the methodology, roster scopes, and source notes. The product owner then amended the approval during PR review: the standalone **One Species, Many Populations** node was removed because it did not provide a sufficiently distinct historical handoff; its evidence-led material was distributed between the origins and migrations nodes; the Columbus node was renamed and re-identified around **sustained** Atlantic contact in light of the earlier Norse presence; and the production queue was clarified so production dependencies do not override curriculum prerequisites or canonical Journey order. The amended canonical roster contains 185 nodes.

## Supporting source notes

These are decision anchors for roster approval, not complete lesson bibliographies.

- **Greek dialectical sequence:** [Stanford Encyclopedia of Philosophy, Ancient Political Philosophy](https://plato.stanford.edu/entries/ancient-political/) supports the Socrates–Plato–Aristotle sequence and its Hellenistic and Roman transformations.
- **Han synthesis:** [Stanford Encyclopedia of Philosophy, Philosophy in Han Dynasty China](https://plato.stanford.edu/archives/fall2024/entries/han-dynasty/) supports treating Han canon formation, commentary, and state institutions as a philosophical transformation.
- **Song-Ming renewal:** [Stanford Encyclopedia of Philosophy, Song-Ming Confucianism](https://plato.stanford.edu/archives/spr2020/entries/song-ming-confucianism/) supports the Neo-Confucian synthesis and its institutional afterlife.
- **Classical Indian debate:** [Stanford Encyclopedia of Philosophy, Logic in Classical Indian Philosophy](https://plato.stanford.edu/archives/spr2021/entries/logic-india/) supports public debate and long-running inter-school argument over knowledge.
- **Islamic reason and revelation:** [Stanford Encyclopedia of Philosophy, Arabic and Islamic Philosophy of Religion](https://plato.stanford.edu/entries/arabic-islamic-religion/) supports teaching multiple positions on reason, revelation, interpretation, and justification.
- **Rabbinic adaptation:** [Cambridge University Press, The Emergence of the Mishnah](https://www.cambridge.org/core/books/abs/history-of-the-talmud/emergence-of-the-mishnah/85BE9B4EB7D489813EDBFBD21DA81645) supports the post-Temple institutional and interpretive transformation.
- **Medieval cross-tradition philosophy:** [Stanford Encyclopedia of Philosophy, Maimonides](https://plato.stanford.edu/entries/maimonides/) supports the Jewish, Islamicate, and later Latin transmission of debates over law, reason, revelation, and Aristotle.
- **Bhakti traditions:** [The Metropolitan Museum of Art, The Art of South and Southeast Asia](https://resources.metmuseum.org/resources/metpublications/pdf/The_Art_of_South_and_Southeast_Asia_A_Resource_for_Educators.pdf) supports the growth of personal devotion and its literary and institutional expression.
- **Persianate intellectual traditions:** [Encyclopaedia Iranica, Rumi: Philosophy](https://www.iranicaonline.org/articles/rumi-philosophy/) supports locating Persian poetry and Sufi reflection inside wider philosophical and theological traditions.
- **Human origins:** [Smithsonian Human Origins Program](https://humanorigins.si.edu/evidence/human-fossils/species/homo-sapiens) anchors Homo sapiens origins and fossil chronology; its ancient-DNA material supports interaction and interbreeding.
- **African population structure and ancient DNA:** the Smithsonian Human Origins Program’s [review of interacting African populations](https://humanorigins.si.edu/research/whats-hot-human-origins/no-single-site-modern-human-origins) supports a structured, interconnected origin rather than one isolated population; its [ancient-DNA review](https://humanorigins.si.edu/evidence/genetics/ancient-dna-and-neanderthals) supports interbreeding and gene flow while modeling the limits of genomic inference.
- **Peopling the Americas:** [UNESCO's early peopling review](https://whc.unesco.org/document/142605) supports careful Beringia language and preserves uncertainty around routes and earliest sites.
- **Agricultural origins:** [Smithsonian Tropical Research Institute](https://stri.si.edu/scientist/dolores-piperno) supports multiple independent beginnings of agriculture.
- **Uruk:** [The Metropolitan Museum of Art](https://www.metmuseum.org/de/essays/uruk-the-first-city) anchors chronology, urban scale, and early administration.
- **Early writing:** [Institute for the Study of Ancient Cultures, University of Chicago](https://isac.uchicago.edu/museum-exhibits/visible-language-inventions-writing-ancient-middle-east-fall-2010) supports separate inventions and the distinction between record systems and later writing.
- **Caral:** [UNESCO World Heritage Centre](https://whc.unesco.org/en/list/1269/) supports the 3000–1800 BCE range and early urban complexity.
- **Indus cities:** [UNESCO World Heritage Centre](https://whc.unesco.org/en/list/138/) anchors Mohenjo-daro's archaeological urban evidence.
- **Bronze Age exchange:** [The Metropolitan Museum of Art](https://www.metmuseum.org/pt/met-publications/beyond-babylon-art-trade-and-diplomacy-in-the-second-millenium-bc) supports a connected world of trade, diplomacy, and the Uluburun cargo.
- **Late Bronze Age change:** [Antiquity](https://www.cambridge.org/core/journals/antiquity/article/getting-closer-to-the-late-bronze-age-collapse-in-the-aegean-and-eastern-mediterranean-c-1200-bc/482564326A668899FF183DD949FC520F) supports a regionally uneven, multi-causal transformation rather than one simultaneous catastrophe.
- **Israelite origins:** [Open Yale Courses](https://oyc.yale.edu/religious-studies/rlst-145/lecture-12) supports explicit separation of literary traditions, archaeology, and later interpretation.
- **Zoroastrian chronology:** [Encyclopaedia Iranica](https://www.iranicaonline.org/articles/chronology-of-iranian-history-part-1/) documents the broad scholarly date range.
- **Israel–Palestine, 1947–49:** the [United Nations record for Resolution 181](https://digitallibrary.un.org/record/210008), the [U.S. Office of the Historian overview](https://history.state.gov/milestones/1945-1952/arab-israeli-war), the [United Nations historical overview](https://www.un.org/unispal/history2/), and [UNRWA's refugee definition and history](https://www.unrwa.org/palestine-refugees) together support teaching partition, Israel's declaration and the war, neighboring-state intervention, the Palestinian flight and expulsion, armistices, and the refugee crisis with attributed terminology rather than a single communal label.
- **Bantu-language dispersals:** [The Journal of African History](https://www.cambridge.org/core/journals/journal-of-african-history/article/moving-histories-bantu-language-expansions-eclectic-economies-and-mobilities/F9F92F9C6A16A9633E75508E836C9C46) supports a complex, multi-phase history with unresolved chronology and local adaptation.
- **Silk Roads:** [UNESCO](https://www.unesco.org/en/silk-roads/about-silk-roads) supports reciprocal exchange across overlapping land and maritime routes.
- **Trans-Saharan exchange:** [The Metropolitan Museum of Art](https://www.metmuseum.org/de/essays/the-trans-saharan-gold-trade-7th-14th-century) supports West African state and commerce chronology.
- **Mongol connections:** [Harvard University, I Tatti](https://itatti.harvard.edu/publications/mongol-empire-global-history-and-art-history) supports treating conquest, destruction, administration, and exchange together.
- **Black Death:** [Cambridge World History of Human Disease](https://www.cambridge.org/core/books/abs/cambridge-world-history-of-human-disease/black-death/16390DE51801A6BFCD9FFC2B18CA00A1) supports global extent while noting uncertainty about precise origin.
- **Polynesian settlement:** [Te Ara Encyclopedia of New Zealand](https://teara.govt.nz/en/when-was-new-zealand-first-settled/page-1) corrects the legacy New Zealand date to permanent settlement around 1250–1300 CE.
- **Sustained Atlantic contact:** [UNESCO’s L’Anse aux Meadows record](https://whc.unesco.org/en/list/4) establishes an eleventh-century Norse presence in North America; the [Library of Congress overview of Columbus and the Taíno](https://www.loc.gov/exhibits/exploring-the-early-americas/columbus-and-the-taino.html) anchors the repeated voyages and their imperial sponsorship. Together they support describing 1492 as the beginning of sustained Atlantic contact, invasion, colonization, and exchange—not the first human or European presence in the Americas.
- **Columbian Exchange:** [Smithsonian Institution](https://www.si.edu/exhibitions/seeds-change%3Aevent-exhib-2294) supports ecological and demographic consequences.
- **Atlantic slavery:** [SlaveVoyages](https://legacy.slavevoyages.org/about/about) provides a traceable research database for voyages and forced movement.
- **Global histories of slavery:** [UNESCO's Routes of Enslaved Peoples overview](https://www.unesco.org/en/query-list/h/history-slavery) and [Cambridge's global-slavery historiography](https://www.cambridge.org/core/elements/writing-the-history-of-global-slavery/BF154CAE6000A154754FF571EA30C171) support treating slavery as a worldwide, historically varied institution rather than an Atlantic-only phenomenon.
- **Protestant abolitionist organization:** [UK Parliament's abolitionist history](https://www.parliament.uk/about/living-heritage/transformingsociety/tradeindustry/slavetrade/overview/the-abolitionists/) documents Quaker networks, Clarkson, and Wilberforce; [Cambridge University Press](https://www.cambridge.org/core/books/religious-speech-and-the-quest-for-freedoms-in-the-angloamerican-world/legacy-of-abolition-of-slavery/CD0866EA5CC1F33CE994C00ADB0D5D98) supports the major Quaker and evangelical contribution to Anglo-American abolitionism.
- **Abolitionist coalition and enforcement:** the [Smithsonian National Museum of American History](https://americanhistory.si.edu/explore/exhibitions/american-democracy/online/great-leap/great-debates/slavery-or-freedom) identifies Quaker, evangelical, Enlightenment, and enslaved action; its [slave-trade history](https://americanhistory.si.edu/explore/exhibitions/on-the-water/online/living-atlantic-world/forced-crossings/end-slave-trade) records later British naval enforcement. [Cambridge's African legal-abolition review](https://www.cambridge.org/core/journals/law-and-history-review/article/abolition-of-slavery-in-africas-legal-histories/47A74EA1672DB9EF11881137DB43796A) cautions against reducing varied local abolition processes to one movement diffusing from Europe.
- **Manila silver:** [The Metropolitan Museum of Art](https://www.metmuseum.org/de/essays/the-manila-galleon-trade-1565-1815) supports the Pacific link in early global trade circuits.
- **Industrialization:** [Science Museum Group](https://blog.sciencemuseum.org.uk/steaming-through-the-centuries/) supports steam as a technological system rather than one inventor's event.
- **First World War:** [Imperial War Museums](https://www.iwm.org.uk/history/why-the-first-world-war-was-truly-a-world-war) supports a global framing across imperial armies, colonies, seas, and multiple fronts.
- **Holocaust:** [United States Holocaust Memorial Museum](https://encyclopedia.ushmm.org/narrative/11128/en) anchors Nazi racial ideology, escalating persecution, and genocide.
- **Decolonization:** [United Nations](https://www.un.org/en/global-issues/decolonization/) supports the worldwide post-1945 sovereignty transition.
- **Climate attribution:** [Intergovernmental Panel on Climate Change](https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-3/) supports the causal link between human influence and observed climate change.
- **World Wide Web:** [CERN](https://home.cern/science/computing/the-birth-of-the-web/short-history-web/) anchors the web's institutional origin and public-release chronology.
- **COVID-19:** [World Health Organization](https://www.who.int/news/item/29-06-2020-covidtimeline) anchors the international public-health chronology while interpretation remains provisional.

## Approved implementation boundary

Approval authorizes the canonical audit and roster plus queue entries only for roster positions 7–14. It does not authorize full lesson writing, runtime-fixture changes, schema or application-behavior changes, bulk per-node Linear issues, or automatic promotion of later nodes into production. Research-required nodes keep their explicit editorial gates.
