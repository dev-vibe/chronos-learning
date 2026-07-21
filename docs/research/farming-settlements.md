# Farming and Settlements research and editorial note

Created 2026-07-21 for [ASH-70](https://linear.app/ashs-workshop/issue/ASH-70/research-and-publish-farming-and-settlements) using the canonical lesson-creation runbook.

Repository-authored content will remain canonical. This note records Stages 0–14 and is the research/editorial checkpoint; production lesson code, final media, migrations, hosted changes, and publication remain behind product-owner approval.

Parallel production note: product-owner direction on 2026-07-21 authorized this lesson while [ASH-69](https://linear.app/ashs-workshop/issue/ASH-69/research-and-publish-our-species-begins-in-africa) Human Origins remains open for image/review on a separate branch/PR. Shared-runtime or migration conflicts must be avoided until Human Origins merges.

## Work boundary

- **Lesson ID:** `lesson.farming.settlements`
- **Legacy aliases:** none (legacy stub `neolithic_revolution` belongs to `lesson.farming.multiple-origins`, not this case study)
- **Journey/chapter/position:** World History / Foundations (current journey module); canonical World Spine position 8 under Human Beginnings and Food Systems
- **Required:** yes
- **Chronology:** before about 3500 BCE, with the featured settlement case at roughly 7100–6000 BCE
- **Place framing:** Southwest Asia; close-up at Çatalhöyük (central Anatolia), with brief regional context
- **Curriculum prerequisite:** `lesson.farming.multiple-origins` (learners must still encounter Many Beginnings first; early production does not skip or fulfill that prerequisite)
- **Production order:** 10
- **Production dependencies:** Early Writing Systems merged and verified; reusable multi-lesson pipeline accepted; canonical scope approved
- **Issue:** ASH-70
- **Branch:** `codex/ash-70-farming-settlements`
- **Accountable product/editorial reviewer:** Carlin Aylsworth
- **Previous published neighbor in current journey module:** none until Human Origins or Many Beginnings publish; current Foundations entries place this before Uruk
- **Next canonical neighbor:** `lesson.animals.domestication-and-pastoralism`; Uruk remains the next published city-scale bridge

This increment designs one bounded Southwest Asian settlement case and its media/card/prompt plan. It does not implement Many Beginnings of Farming, survey global domestication, redesign the Learn shell, resolve ASH-69 media, generate final assets, publish database configuration, or make Planned position-7 content completable.

## Node proposal

**Recommended learner-facing title:** **Farming and Settlements**. The canonical title matches the roster and correctly names the transformation: cultivation plus denser, longer-lived settlement—not “the invention of civilization.”

**Essential question:** What changed when communities in Southwest Asia began depending more on cultivated plants and more permanent settlements—and what tradeoffs came with that change?

**Durable understanding:** Cultivation and denser settlement in Southwest Asia grew together gradually; stored food could support larger communities and new kinds of shared work, but private stores, crowding, labor, and health risks show that settled farming was a tradeoff—not a simple upgrade—and these communities were not yet cities like Uruk.

**Supporting understandings:**

1. People did not switch from “pure foraging” to “full farming” overnight. Low-level cultivation could sit beside foraging for centuries, and neighboring communities could accept or refuse cultivation differently.
2. More reliable plant foods and storage made longer-term residence and denser neighborhoods possible, but denser living created new coordination problems.
3. Surplus is not automatic wealth. At Çatalhöyük, families kept private pantry stores inside houses while also sharing through feasts and displays; storage created both security and social tension.
4. Settled farming carried costs visible in labor, crowding, and some health indicators; those costs varied over time and do not prove that farming was a mistake or that foragers were always healthier in every way.
5. A large farming settlement is still not a city. Çatalhöyük’s dense houses, roof streets, and household-scale organization prepare learners for Uruk’s later city-scale coordination without collapsing the two.

**Evidence encounter:** Household storage and house layout at Çatalhöyük. Learners reason from published archaeobotanical and spatial analysis: bins for grain and other foods sit deep inside houses (private pantries), while animal-head displays and feasting evidence near entrances point to shared celebration. The supported conclusion is that stored food was managed socially inside a dense settlement; surplus did not by itself create palaces or cities.

**Prerequisite ideas (curriculum):** farming began in more than one region (Many Beginnings); a reconstruction is not a photograph of the past; denser settlement changes daily life. Until Many Beginnings is published, this lesson must state the Southwest Asia case-bound explicitly and never imply a single worldwide “Agricultural Revolution.”

**Common misconceptions to prevent:**

- farming appeared suddenly as a single “Neolithic Revolution”;
- farming was an obvious improvement with no serious costs;
- surplus automatically creates kings, writing, or cities;
- Çatalhöyük was a city in the same sense as Uruk;
- no streets and similar house sizes prove perfect equality;
- Jericho’s tower proves the first fortress or the first civilization;
- every Southwest Asian community followed one identical path;
- this lesson covers China, the Americas, Africa, or New Guinea.

**Scope:** Southwest Asian cultivation and settlement before about 3500 BCE, centered on the Central Anatolian sequence from low-level food production (Boncuklu/Pınarbaşı) to dense farming settlement at Çatalhöyük East. Brief comparison may mention earlier Levantine Pre-Pottery Neolithic settlements such as Tell es-Sultan/Jericho without turning the lesson into a Jericho biography.

**Why this is one lesson:** It converts the abstract idea “farming changed society” into a teachable Southwest Asian mechanism—cultivation, storage, dense settlement, and tradeoffs—that Uruk later scales up. Global multiple origins and pastoral alternatives remain separate nodes.

**Bridge from previous:** Many Beginnings establishes that farming started independently in several regions. This lesson zooms into one regional pathway and asks what denser settlement did to daily life.

**Bridge to next:** Animals, Herding, and Mobility explains durable mobile alternatives and complements. Uruk then asks what changes when coordination grows to city scale.

## Research questions

- How gradual and uneven was the uptake of cultivation in Central Anatolia?
- What does “surplus” mean archaeologically—storage capacity, shared feasting, institutional stockpiles, or all of these?
- How did Çatalhöyük households organize private storage inside a dense, streetless settlement?
- What do skeletons and settlement debris support—and not support—about health, labor, and crowding?
- How should UNESCO/popular “egalitarian” language be qualified against private pantries and social tension?
- What separates a large Neolithic settlement from an early city?
- Which media can teach house layout and storage without human remains, invented faces, or non-redistributable excavation photos?
- How should the lesson stay honest while Many Beginnings remains unpublished?

## Source ledger

| Source ID | Citation/link | Type and authority | Claims supported | Limits/bias and corroboration | Rights/use | Review |
| --- | --- | --- | --- | --- | --- | --- |
| `source.farming.baird-2018-anatolia` | [Baird et al., “Agricultural origins on the Anatolian plateau,” *PNAS* 115 (2018)](https://doi.org/10.1073/pnas.1800163115) | Peer-reviewed multi-proxy excavation synthesis | Indigenous forager adoption of cultivation at Boncuklu; Pınarbaşı rejection/absence of cultivation; low-level food production lasting centuries; later major farming commitment at Çatalhöyük East from ~7100 cal BC | Regional Central Anatolia case; crop identification and wild/domestic distinctions carry method uncertainty; does not map every Southwest Asian path | Research citation; figures not approved for redistribution | Reviewed 2026-07-21 |
| `source.farming.bogaard-2009-pantries` | [Bogaard et al., “Private pantries and celebrated surplus,” *Antiquity* 83 (2009)](https://doi.org/10.1017/S0003598X00098896) | Peer-reviewed archaeobotanical/spatial analysis | Private household storage bins; entrance-area aurochs displays linked to shared feasting; social tension of dense living with full larders | One site’s burned-house and spatial sample; feast/display readings are interpretive | Research citation; article media not redistributed | Reviewed 2026-07-21 |
| `source.farming.unesco-catalhoyuk` | [UNESCO, “Neolithic Site of Çatalhöyük”](https://whc.unesco.org/en/list/1405/) | Institutional World Heritage description | Site location on Konya plain; East mound Neolithic levels; streetless back-to-back houses with roof access; long occupation | Dates and “egalitarian” wording are synthesis; UNESCO is not a primary excavation report | Description under CC-BY-SA IGO 3.0; useful for place framing, not detailed claims | Reviewed 2026-07-21 |
| `source.farming.catalhoyuk-architecture` | [Çatalhöyük Research Project, Architecture](http://www.catalhoyuk.com/site/architecture) | Project outreach synthesizing excavation results | Rectangular houses, roof movement, ladder/ceiling entry, oven below stairs, platforms, side-room storage, plastered decoration | Public summary; illustrations are interpretive reconstructions | Project media often CC BY-NC-SA → **not** assumed safe for Chronos runtime redistribution | Reviewed 2026-07-21 |
| `source.farming.larsen-2019-bioarch` | [Larsen et al., “Bioarchaeology of Neolithic Çatalhöyük…,” *PNAS* 116 (2019)](https://doi.org/10.1073/pnas.1904345116) | Peer-reviewed bioarchaeology of one long-lived settlement | Rising costs with density and farming dependence: disease exposure, labor/mobility demands, carbohydrate reliance, fertility/population growth | Osteological paradox and age-estimation limits apply; not a universal health score for all farmers | Research citation; no burial imagery for learners | Reviewed 2026-07-21 |
| `source.farming.milner-2019-commentary` | [Milner, “Early agriculture’s toll on human health,” *PNAS* 116 (2019)](https://doi.org/10.1073/pnas.1908960116) | Peer-reviewed commentary on Larsen et al. | Warns against a one-direction “farming always worsened health” model; emphasizes local variation and methodological caution | Commentary, not independent primary data | Open PNAS license for text reference; image of burial excavation rejected for learner use | Reviewed 2026-07-21 |
| `source.farming.bogaard-2017-resilience` | [Bogaard et al., “Agricultural innovation and resilience…,” *Anatolian Studies* 67 (2017)](https://doi.org/10.1017/S0066154617000072) | Peer-reviewed long-sequence archaeobotany | ~1,500-year farming sequence; East Mound ~7100–5950 BC; West Mound ~6000–5500 BC; sustained mixed farming | Technical crop/weed detail exceeds lesson needs | Research citation | Reviewed 2026-07-21 |
| `source.farming.kuijt-goring-morris-2002` | [Kuijt and Goring-Morris, “Foraging, farming, and social complexity…,” *Journal of World Prehistory* 16 (2002)](https://doi.org/10.1023/A:1022973114090) | Peer-reviewed southern Levant synthesis | Gradual, regionally varied PPN social complexity; farming and settlement not a single switch | Older synthesis; southern Levant focus | Research orientation only | Reviewed 2026-07-21 |
| `source.farming.bar-yosef-1986-jericho` | [Bar-Yosef, “The Walls of Jericho,” *Current Anthropology* 27 (1986)](https://doi.org/10.1086/203413) | Scholarly reinterpretation of Kenyon’s PPNA wall/tower | Tower/wall function is contested (defense is not the only or best reading) | Debate piece; use only to block fortress-first storytelling | Research citation | Reviewed 2026-07-21 |
| `source.farming.nigro-2016-tell-es-sultan` | [Nigro, “Tell es-Sultan 2015,” *Near Eastern Archaeology* 79 (2016)](https://doi.org/10.5615/neareastarch.79.1.0004) | Current expedition synthesis | PPNA tower as major communal labor; early agricultural settlement at a spring; chronological outline | Interpretive claims about surplus silos/defense need cautious wording | Research citation | Reviewed 2026-07-21 |

Research stopped when the gradual-adoption claim, Çatalhöyük storage/settlement mechanism, health-cost caution, and village-vs-city distinction were independently supported; remaining gaps (exact population counts, every household’s kinship, tower function) are teachable uncertainties rather than missing pillars.

## Claim ledger

| Claim ID and wording | Kind | Certainty | Sources | Counterevidence/limits and missing perspective | Learner treatment | Review |
| --- | --- | --- | --- | --- | --- | --- |
| `claim.farming.gradual-uptake`: In Central Anatolia, cultivation could be adopted at low intensity beside foraging for centuries, and nearby communities could differ in whether they cultivated | Interpretation | High | Baird 2018 | Does not describe every Southwest Asian valley; “rejection” at Pınarbaşı is absence of cultivation evidence, not a preserved speech act | Teach as uneven choice/process, not destiny | Editorial review required |
| `claim.farming.settlement-density`: Çatalhöyük East was a long-lived, densely packed settlement of conjoined mudbrick houses entered from roofs, without streets between houses | Observation | High | UNESCO; CRP Architecture; Baird 2018 | Exact peak population estimates vary; “town” vs “village” labels are modern | Use dense settlement language; avoid “first city” | Editorial review required |
| `claim.farming.mixed-farming`: By the time of Çatalhöyük East, communities practiced substantial mixed farming of domesticated plants and animals that could sustain a large sedentary community | Interpretation | High | Baird 2018; Bogaard 2017; Larsen 2019 | Farming intensity changed over the sequence; wild resources did not vanish | Say major commitment to mixed farming, not total replacement of wild foods | Editorial review required |
| `claim.farming.private-storage`: Households stored plant foods in interior bins/side rooms that functioned as private pantries | Observation/interpretation | High | Bogaard 2009; CRP Architecture | Burned-house assemblages dominate some phases; not every house is equally preserved | Central evidence encounter | Editorial review required |
| `claim.farming.shared-feasting`: Displays of aurochs heads/horns and related evidence point to shared feasting that could ease tensions created by private stores | Interpretation | Moderate | Bogaard 2009 | Religious and social readings overlap; exact feast frequency unknown | Present as supported interpretation, not proven theology | Editorial review required |
| `claim.farming.tradeoffs`: Denser farming life brought labor demands, crowding-related disease exposure, and other biological stresses that varied across the occupation | Interpretation | Moderate–High | Larsen 2019; Milner 2019 | Osteological paradox; not a universal decline narrative; some indicators change non-linearly | Teach tradeoffs with variation; avoid “farming ruined health” | Specialist bioarchaeology caution noted |
| `claim.farming.not-a-city`: Çatalhöyük’s household-centered dense settlement is not the same social scale as later cities such as Uruk | Interpretation | High | UNESCO (village-to-urban-agglomeration wording needs care); Uruk lesson contrast; absence of palace/administrative tablet complex of Uruk type | UNESCO “urban agglomeration” language can mislead learners | Explicit village/town-vs-city distinction before Uruk | Editorial review required |
| `claim.farming.no-palace-equality`: Similar house sizes and lack of palaces do not prove perfect equality; private storage and social mechanisms already manage tension | Interpretation | Moderate | Bogaard 2009; UNESCO egalitarianism claim | Wealth differences can be subtle; burial under floors is not a simple status scoreboard | Qualify “egalitarian” popular claims | Editorial review required |
| `claim.farming.jericho-labor`: Earlier Levantine settlements such as Tell es-Sultan show large communal constructions (tower/wall) whose exact purpose is debated | Observation/contested interpretation | Moderate | Nigro 2016; Bar-Yosef 1986 | Defense, ritual, flood control, and community symbol remain live options | Optional supporting comparison only | Editorial review required |
| `claim.farming.case-not-global`: This lesson is a Southwest Asian case and does not establish a single worldwide origin of farming | Interpretation | High | Curriculum roster; Kuijt & Goring-Morris orientation | Popular “Fertile Crescent invented farming for humanity” story remains common | Explicit scope sentence early | Editorial review required |

## Content triage

| Candidate idea | Decision | Why | Destination |
| --- | --- | --- | --- |
| Gradual/uneven uptake of cultivation | Essential | Prevents revolution mythology | Opening + context |
| Dense roof-access settlement form | Essential | Makes settlement concrete | Settlement section + media |
| Private pantries / celebrated surplus | Essential | Evidence encounter and surplus mechanism | Evidence section |
| Tradeoffs: labor, crowding, health caution | Essential | Blocks progress-only story | Consequences section |
| Village/town vs city distinction | Essential | Bridge to Uruk without collapse | Closing instructional beat |
| Boncuklu vs Pınarbaşı contrast | Supporting | Makes agency and uneven adoption vivid | Context module |
| Jericho tower | Enrichment/supporting | Memorable earlier communal labor; purpose contested | Brief comparison, not hero |
| Natufian deep dive | Deferred | Belongs with Holocene/multiple-origins runway | Later/related lessons |
| Global multiple origins | Deferred | Canonical prerequisite lesson | `lesson.farming.multiple-origins` |
| Pastoral mobility | Deferred | Next animal/pastoralism lesson | `lesson.animals.domestication-and-pastoralism` |
| Mother-goddess / goddess religion story | Rejected | Overbuilt popular narrative not required | None |
| Human remains / burial photos | Rejected | Age-inappropriate spectacle; not needed for claims | None |
| “Neolithic Revolution” as learner title | Rejected | Misleading suddenness; reserved as legacy alias for Many Beginnings | None |
| Video | Rejected | Motion not required | None |
| Full Göbekli Tepe monument story | Deferred/rejected here | Separate investigation candidate; risks temple-caused-civilization hype | Optional Investigation |

## Learning blueprint

- **Essential question:** What changed when communities in Southwest Asia began depending more on cultivated plants and more permanent settlements—and what tradeoffs came with that change?
- **Durable understanding:** Settled farming could feed denser communities and create stored food, but storage, crowding, and labor brought tradeoffs—and these places were not yet cities.
- **Supporting understandings:** gradual uptake; dense settlement form; private storage + sharing; health/labor tradeoffs with caution; not-yet-city.
- **Prerequisites:** regional case vs global story; evidence vs reconstruction; farming involves plants, animals, and work over time.
- **Misconceptions:** sudden revolution; pure progress; surplus = kings; Çatalhöyük = Uruk; perfect equality; fortress-first Jericho.
- **Indispensable vocabulary:** cultivation, domestication (light touch), settlement, surplus/storage, household, tradeoff, reconstruction.
- **Evidence encounter:** Çatalhöyük private pantry bins vs shared feast/display evidence.
- **Historical-thinking move:** opportunity/cost + evidence/limit (what storage shows; what skeletons and popular “egalitarian” labels cannot prove alone).
- **Required sincere-attempt evidence:** one supported-selection on the best model; one concise explanation naming an opportunity and a cost/limit from lesson evidence.
- **Bridge to Uruk:** denser farming settlements create coordination problems that cities later organize at a larger institutional scale.

## Ages 11–14 design pass

- Start with a concrete human problem: how do you feed a neighborhood that stays put?
- Give time/place early: Southwest Asia before 3500 BCE; Çatalhöyük in central Anatolia around 7000 BCE.
- Define *surplus* as stored food that can be kept and used later, not as “extra money.”
- Keep health content proportionate: crowding and disease exposure, harder routine labor, dental/dietary stress—no gore, no burial imagery, no “people were miserable and dumb for farming.”
- Avoid exoticizing “strange roof cities”; compare to apartment living only with an explicit limit (different materials, beliefs, and technologies).
- Use “some historians say / the evidence shows / we still debate” for tower purpose and equality claims.
- Read-aloud target: short paragraphs; one job per section; roughly six to seven semantic sections.

## Section/component storyboard

| Order | Section ID / heading | Learner purpose | Claims/sources | Module | Media/action | Transition |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `section.farming.opening-question` / What happens when a community stays put? | Enter through food, work, and permanence | case-not-global | Prose + masthead | Optional landscape/settlement hero reconstruction | Meet gradual change |
| 2 | `section.farming.gradual-change` / Farming was a process, not a switch | See uneven uptake | gradual-uptake / Baird | Knowledge | Compare Boncuklu low-level cultivation vs Pınarbaşı without crops | Ask what denser living looked like |
| 3 | `section.farming.dense-settlement` / A neighborhood without streets | Understand Çatalhöyük settlement form | settlement-density, mixed-farming / UNESCO, CRP | Knowledge + historical-map or diagram | Locate central Anatolia; no origin-of-farming arrows | Ask where food went |
| 4 | `section.farming.storage-evidence` / Private pantries, shared feasts | Evidence encounter on surplus | private-storage, shared-feasting / Bogaard | Evidence (+ optional scene hotspots on house diagram) | Observe bin location vs entrance displays | Ask what denser life cost |
| 5 | `section.farming.tradeoffs` / Opportunities and costs | Hold progress and harm together | tradeoffs, no-palace-equality / Larsen, Milner, Bogaard | Knowledge | Opportunity/cost pairs; no burial images | Distinguish from cities |
| 6 | `section.farming.not-yet-city` / Settled is not the same as city | Prepare Uruk without collapsing scales | not-a-city | Prose/knowledge | Contrast household settlement vs city-scale coordination | World Check |
| 7 | `section.farming.check-and-complete` / World Check | Sincere attempt + explicit completion | all core claims | Prompt ×2 | No new media | Journey continue |

Flow exception: seven sections (within the normal five-to-eight band) because the village-vs-city bridge is a distinct instructional job before Uruk.

## Media and Knowledge Card plan

### Media decisions

| Asset | Teaching purpose | Form | Depiction | Placement | Rights/provenance | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| Hero settlement atmosphere | Orient place/time without faces | Chronos-original evidence-based reconstruction of dense rooftop neighborhood OR Konya-plain landscape with distant mound | Reconstruction | Masthead | Must be Chronos-original or redistribution-cleared; CRP John Swogger/Killackey art is interpretive and often NC-licensed → do not scrape | Preferred after approval; no close faces; no burial scenes |
| Southwest Asia locator map | Place Çatalhöyük (and optional Jericho) without “sole cradle” arrows | Historical map | Map | Dense-settlement section | Follow historical-map runbook; Natural Earth base; site coordinates from UNESCO/project sources | Recommended |
| House-plan / storage diagram | Make private pantry vs entrance display readable | Diagram or evidence-based reconstruction with 2–4 hotspots | Diagram / reconstruction | Storage evidence | Chronos-original from published plans; label inferred furnishings | Recommended core visual for evidence encounter |
| Excavation photographs | Tempting but often NC-licensed; burial photos inappropriate | Evidence photo | Evidence | Only if redistribution-cleared non-burial image exists | Default: defer/reject for MVP | Reject for checkpoint unless rights clear |
| Video | Not required | — | — | — | — | Rejected |

### Knowledge Card

- **Decision:** one Place card — **Çatalhöyük**
- **Class:** Foundation (durable settlement memory anchor for the food-systems chapter)
- **Why it earns a card:** It is the concrete place through which learners remember dense settlement, storage, and tradeoffs.
- **Why not an Idea card only:** The evidence encounter is place-bound; the idea “settled farming has tradeoffs” is carried by the lesson prompts and can appear as card facts.
- **Avoid:** invented named farmer person card; goddess figurine as “mother goddess” card.
- **Depiction:** house/settlement diagram or approved reconstruction—not human remains.
- **Unlock:** deterministic on explicit completion of `lesson.farming.settlements`.

## Understanding-check plan

1. **Supported selection — `prompt.farming.best-supported-model`**
   - Question: Which statement best fits the Southwest Asian evidence in this lesson?
   - Supported option: Cultivation and denser settlement developed gradually; stored food could support larger communities, but crowding, labor, and social tension show real tradeoffs—and these settlements were not yet cities like Uruk.
   - Distractors: farming appeared in one sudden upgrade with only benefits; surplus automatically created kings and writing; Çatalhöyük proves farming began only in Anatolia for all humans.
   - Feedback separates case scope, gradual change, and village-vs-city.

2. **Concise explanation — `prompt.farming.opportunity-and-cost`**
   - Question: Using one piece of settlement or storage evidence, name one opportunity denser farming life created and one cost or limit it brought.
   - Sincere attempt required; perfection not required.
   - Feedback accepts opportunities such as stored food, staying put, larger community support; costs/limits such as hard labor, crowding/disease exposure, social tension around private stores, or uncertainty about equality.

## Journey framing

- **Entry ID:** `entry.world-history.farming` (existing)
- **Required:** yes
- **Framing upgrade:** from “From settled farming” to something like “See what denser farming settlements changed—and what they cost.”
- **Curriculum safety:** keep lesson `draft` and non-completable until publication gates pass; do not mark Many Beginnings complete by implication; Spine roadmap may show this node preparing while prerequisite remains unpublished.
- **Bridge next (animals):** herding and mobility as durable complements/alternatives.
- **Bridge next published city lesson:** Uruk scales coordination beyond household settlement.

## Disagreement, uncertainty, and missing voices

- Broad Southwest Asian early farming is high-confidence; a single invention moment is not.
- Private storage is strongly evidenced at Çatalhöyük; the social meaning of every display is interpretive.
- Health tradeoffs are real at this site and elsewhere, but not a simple one-way decline for every person or phase (Milner caution).
- “Egalitarian Neolithic” is a contested popular shorthand; absence of palaces ≠ absence of inequality.
- Jericho tower purpose remains debated; do not crown it “first fortress.”
- Women’s, children’s, and non-householder experiences are partly visible in bioarchaeology and house practice, but named individuals and everyday speech do not survive.
- Excavation history, tourism, and nationalist heritage framing shape what the public hears about these sites.

## Research/editorial checkpoint (decision packet)

Recommended decisions for product-owner approval:

1. Retain **Farming and Settlements** as the learner title; lead with Southwest Asia case scope so Many Beginnings is not silently skipped.
2. Approve the durable understanding: gradual cultivation + denser settlement + storage tradeoffs + not-yet-city.
3. Approve **Çatalhöyük household storage/house layout** as the central evidence encounter (Bogaard private pantries / celebrated surplus).
4. Approve Boncuklu/Pınarbaşı as the short gradual-uptake comparison; keep Jericho as optional brief communal-labor comparison only.
5. Approve media plan: Chronos-original house/storage diagram (required), source-verified locator map (recommended), optional cinematic settlement reconstruction hero with no faces; reject burial imagery and default excavation-photo scrape because of NC/rights risk.
6. Approve one Foundation Place card: **Çatalhöyük**.
7. Approve two required sincere-attempt prompts: supported model selection; opportunity-and-cost explanation.
8. Keep production content, final media, migrations, and publication paused until this packet is approved; coordinate merge timing with ASH-69 to avoid journey/migration conflicts.

## Sign-off status

- [x] Work boundary and node proposal
- [x] Research questions
- [x] Source ledger
- [x] Claim ledger
- [x] Content triage
- [x] Learning blueprint
- [x] Ages 11–14 editorial pass
- [x] Section/component storyboard
- [x] Media decision
- [x] Knowledge Card decision
- [x] Understanding-check plan
- [x] Journey framing
- [ ] Human historical/editorial review
- [ ] Bioarchaeology wording review (health tradeoffs)
- [ ] Product-owner approval of checkpoint
- [ ] Production content, final media, migrations, tests, and preview
- [ ] Structured learner walkthrough or documented reason deferred
