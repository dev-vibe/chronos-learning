# Farming and Settlements research and editorial note

Created 2026-07-21 for [ASH-70](https://linear.app/ashs-workshop/issue/ASH-70/research-and-publish-farming-and-settlements) using the canonical lesson-creation runbook.

Repository-authored content will remain canonical. This note records Stages 0–14 and is the research/editorial checkpoint; production lesson code, final media, migrations, hosted changes, and publication remain behind product-owner approval.

Revision 2 opened 2026-07-21 after the first production preview failed product-owner content and visual review. The source research remains useful, but the prior implementation approval is withdrawn. The current published lesson, reused diagram, and locator-map treatment are not approved for release. This revision supersedes the earlier storyboard, media plan, prompt plan, and decision packet while preserving the stable lesson identity and evidence base.

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

**Recommended learner-facing title:** **Farming and Settlements**. Retain the canonical roster title, but let the page itself open with the more concrete hook “Enter from the roof.” The title names the transformation without claiming a single invention or a march toward “civilization.”

**Essential question:** How did storing food change life inside a community that stayed in one place?

**Durable understanding:** At Çatalhöyük, farming and stored food helped people sustain a dense, long-lived neighborhood; house evidence also shows that staying brought more labor, crowding, and choices about what households kept private or shared.

**Supporting understandings:**

1. In Central Anatolia, cultivation grew gradually beside foraging; nearby communities did not all make the same choices at the same time.
2. At Çatalhöyük, rebuilding mudbrick houses in the same place created a dense neighborhood where roofs became routes and houses organized daily work.
3. Excavated bins and plant remains support private household storage. Entrance-area animal displays and feasting evidence support—but do not prove every detail of—shared celebration.
4. Staying offered food security and durable homes while increasing repetitive labor, crowding, disease exposure, and social questions around stored food.
5. Çatalhöyük was a large household-centered settlement, not a smaller version of an inevitable future city.

**Evidence encounter:** Read one Çatalhöyük house as evidence. A Chronos cutaway/plan will translate excavated architecture and archaeobotanical spatial analysis into a legible diagram: storage bins and plant remains lie in interior side rooms, while entrance-area animal displays and feasting evidence suggest more public moments. The diagram is explicitly an interpretive model; the evidence is the excavated placement of architecture, bins, remains, and displays. Learners decide which conclusions that pattern supports and which claims—perfect equality, exact family relationships, automatic kingship—it cannot establish.

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
| `source.farming.britannica-aurochs` | [Encyclopaedia Britannica, “aurochs”](https://www.britannica.com/animal/aurochs) | Reference work | What an aurochs was (extinct wild ox from which cattle are probably descended) and its size (about 1.8 m at the shoulder) | General reference for a definition; the aurochs article treats Europe, and Anatolian animals are not described there | Reference citation; text not redistributed | Added in the voice revision, accessed 2026-10-03 |

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
| `claim.farming.roof-ladder-entry`: At Çatalhöyük people moved around on the roofs and entered each house down a wooden ladder through an opening in the ceiling | Observation | High | CRP Architecture; UNESCO | Reconstruction of ladders is inferred from openings; wood does not survive | Opening; roof opening hotspot; knowledge item | Added in the voice revision |
| `claim.farming.neighbors-via-roof`: The journal summary of Bogaard et al. 2009 pictures neighbors as always in and out of each others’ houses, in this case via the roof (an assumption in the summary, not a count) | Interpretation | Moderate | Bogaard 2009 (journal summary) | The summary says “it can be assumed”; no measure of visiting exists | Opening, quoted and attributed to “a summary of one study” | Added in the voice revision |
| `claim.farming.boncuklu-ancestral`: Baird et al. argue that Boncuklu’s community, which combined some cultivation and sheep and goat herding with foraging for several centuries, was ancestral to Çatalhöyük East, where from 7100 BCE a modest involvement had become a major commitment to mixed farming; adoption had significant long-term social consequences for the adopting community | Interpretation | Moderate | Baird 2018 (abstract) | “Material continuities suggest” the ancestry; the abstract states the consequences for Boncuklu, not for every community | “No single day changed everything”, with the argument attributed to Baird’s team | Added in the voice revision |
| `claim.farming.rebuilt-mounds`: Houses were continually infilled, often burnt and rebuilt, and the settlement’s layers form two mounds rising up to 20 meters above the Konya plain | Observation | High | CRP Architecture; UNESCO | UNESCO’s “two tells” includes the West Mound; the East Mound is the taller; UNESCO’s Neolithic dates (7400–6200 BCE) differ from the 7100–5950 BCE used here and are not used | Knowledge item “Homes piled up” | Added in the voice revision |
| `claim.farming.bin-contents`: Families stored grain, fruit, nuts and condiments in bins deep inside the house, and displayed the heads and horns of aurochs near the entrance | Observation | High | Bogaard 2009 (journal summary) | One site’s sample; the summary, not the full article, was read | Side-room and entrance hotspots; “Private stores and shared occasions” | Added in the voice revision |
| `claim.farming.aurochs`: The aurochs was an extinct wild ox from which cattle are probably descended, about 1.8 m (6 ft) high at the shoulder | Observation | High | Britannica | Britannica describes the animal in Europe; size varied by sex and region | Entrance-display hotspot (defines the term) | Added in the voice revision |
| `claim.farming.full-larder`: The journal summary says the aurochs displays, besides a religious overtone, remembered feasts, “episodes of sharing that mitigated the provocations of a full larder” | Interpretation | Moderate | Bogaard 2009 (journal summary) | Religious and social readings overlap; frequency of feasts unknown | “Private stores and shared occasions”, quoted and attributed | Added in the voice revision |
| `claim.farming.density-and-workload`: Larsen et al. found elevated exposure to disease and labor demands, tied to dependence on domesticated plant carbohydrates, growing population size and density fueled by elevated fertility, and increasing stresses from workload; Milner cautions against a one-direction decline reading | Interpretation | Moderate | Larsen 2019 (abstract); Milner 2019 | Abstract read, full text not read (see Voice revision); osteological paradox applies | Closing paragraph of “The bargain of staying” | Added in the voice revision |
| `claim.farming.long-occupation`: Çatalhöyük East was occupied from about 7100 to 5950 BCE, a little over a thousand years | Observation | High | Larsen 2019 (abstract: 7100–5950 cal BCE); Bogaard 2017 | Dates are calibrated and approximate | Closing paragraph (“a little over a thousand years”) | Added in the voice revision |

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

- **Essential question:** How did storing food change life inside a community that stayed in one place?
- **Durable understanding:** At Çatalhöyük, farming and stored food helped people sustain a dense, long-lived neighborhood; house evidence also shows that staying brought more labor, crowding, and choices about what households kept private or shared.
- **Supporting understandings:** gradual regional uptake; roof-connected dense settlement; house layout as evidence; private storage and shared celebration; opportunity/cost without a progress-or-decline fable.
- **Prerequisites:** regional case vs global story; evidence vs reconstruction; farming involves plants, animals, and work over time.
- **Misconceptions:** a sudden global revolution; farming as pure progress or pure decline; surplus automatically creates rulers; roof access was merely picturesque; similar houses prove perfect equality.
- **Indispensable vocabulary:** cultivation, settlement, household, storage, surplus, tradeoff, reconstruction.
- **Evidence encounter:** spatial comparison of interior storage bins/plant remains with entrance-area displays and feasting evidence.
- **Historical-thinking move:** move from observation to a proportionate interpretation, then name what the same evidence cannot prove.
- **Required sincere-attempt evidence:** one supported selection about the house pattern; one concise explanation connecting a concrete advantage to a cost or social choice.
- **Bridge forward:** later lessons can ask how other communities chose mobility and how city-scale institutions coordinated beyond households; neither outcome is presented as inevitable.

## Ages 11–14 design pass

- Start with a concrete sensory-spatial puzzle: a child reaches a neighbor by crossing roofs, then climbs down into a house where food is stored out of public view.
- Give time/place early: Southwest Asia before 3500 BCE; Çatalhöyük in central Anatolia around 7000 BCE.
- Define *surplus* as stored food that can be kept and used later, not as “extra money.”
- Keep health content proportionate: crowding and disease exposure, harder routine labor, dental/dietary stress—no gore, no burial imagery, no “people were miserable and dumb for farming.”
- Explain roof movement as a practical consequence of wall-to-wall building, not an exotic “roof city” gimmick.
- Use “some historians say / the evidence shows / we still debate” for tower purpose and equality claims.
- Keep the evidence distinction visible in ordinary language: “The bin survives; the exact household conversation does not.”
- Read-aloud target: short paragraphs; one job per section; seven semantic sections with varied prose, map, evidence, and prompt rhythms rather than repeated fact grids.

## Section/component storyboard

| Order | Section ID / heading | Learner purpose | Claims/sources | Module | Media/action | Transition |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `section.farming.enter-from-roof` / Enter from the roof | Begin inside one plausible movement through the settlement, then label it as reconstruction | settlement-density / UNESCO, CRP | Prose beneath masthead | New wide rooftop hero; learner locates roof openings, adjoining homes, and the surrounding plain | Ask why people stayed |
| 2 | `section.farming.slow-change` / No single day changed everything | Establish gradual, uneven cultivation without turning the lesson into a regional survey | gradual-uptake, case-not-global / Baird | Prose + compact comparison knowledge block | Boncuklu / Pınarbaşı / later Çatalhöyük comparison | Move from choices over food to a new settlement form |
| 3 | `section.farming.wall-to-wall` / A neighborhood built wall to wall | Understand place, density, rebuilding, and roof movement | location, settlement-density, mixed-farming / UNESCO, CRP, Baird | Historical map + prose | Redesigned locator map; no migration or origin arrows | Enter one house |
| 4 | `section.farming.read-the-house` / Read the house | Close-read excavated spatial evidence before receiving the interpretation | private-storage, shared-feasting / Bogaard, CRP | Evidence + scene hotspots | New cutaway/plan with native hotspots for roof opening, main room, side-room bins, entrance-area display | Compare private and shared spaces |
| 5 | `section.farming.private-and-shared` / What stayed private? What was shared? | Build the bounded interpretation and name its limits | private-storage, shared-feasting, no-palace-equality / Bogaard | Prose + small evidence/limit knowledge block | No duplicate image; refer back to observed pattern | Ask what permanence demanded |
| 6 | `section.farming.bargain-of-staying` / The bargain of staying | Hold food security, durable homes, labor, crowding, health, and household-scale coordination together | tradeoffs, not-a-city / Larsen, Milner, Bogaard | Prose + concise two-sided knowledge block | No remains imagery; close with non-inevitable bridge to mobility and cities | Use evidence in World Check |
| 7 | `section.farming.check-and-complete` / World Check | Sincere attempt + explicit completion | core claims | Prompt ×2 | Evidence interpretation, then advantage/cost explanation | Continue World History |

Seven sections remain within the normal band. The earlier standalone “not yet a city” section is removed because it made Uruk the destination of the lesson. The distinction now appears briefly inside the final synthesis, where it prevents conflation without making settled farming feel like a waiting room for cities.

## Media and Knowledge Card plan

### Media decisions

| Asset | Teaching purpose | Form | Depiction | Placement | Rights/provenance | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| Rooftop settlement hero | Make wall-to-wall density and roof movement immediately intelligible | Chronos-original wide evidence-based reconstruction, viewed from roof height across adjoining mudbrick homes toward the Konya plain | Evidence-based reconstruction | Masthead + opening observation | New visual brief from UNESCO/CRP architecture and excavation synthesis; no copying protected excavation art | **Recommended core**; replaces the current diagram hero |
| Çatalhöyük locator map | Place the inland Konya-plain case without “sole cradle” arrows | Chronos-original editorial historical map | Map | Wall-to-wall section | Revise under historical-map runbook; UNESCO coordinates + CRP cross-check + Natural Earth orientation | **Recommended supporting**; replace the current schematic map |
| House and storage evidence view | Make the spatial evidence—interior bins versus entrance-area display—readable | Chronos-original axonometric cutaway/plan with 3–4 native hotspots | Evidence-led diagram / reconstruction | Read-the-house section only | Based on published plans and spatial analysis; supported, inferred, and omitted details listed in brief | **Required core evidence visual**; replace the current block SVG |
| Çatalhöyük card artwork | Give the Place card a durable image distinct from a lesson diagram | Vertical evidence-based reconstruction emphasizing the roof-connected settlement as a place | Evidence-based reconstruction | Completion reveal and Collection | Same reviewed architecture basis; separate 4:5 composition and lineage | **Recommended card deliverable**; no diagram reuse |
| Excavation photographs | Tempting but often NC-licensed; burial photos inappropriate | Evidence photo | Evidence | Only if redistribution-cleared non-burial image exists | Default: defer/reject for MVP | Reject for checkpoint unless rights clear |
| Video | Not required | — | — | — | — | Rejected |

### Revision 2 visual briefs

**Hero — roof-connected neighborhood**

- Required: densely adjoining rectilinear mudbrick houses; varied roof levels; roof openings and ladders; restrained household activity; dry Konya-plain setting; plausible plaster, reed, timber, basket, and clay materials.
- Avoid: a giant temple or palace, paved streets between houses, domes, crenellated fantasy walls, wheeled carts, metal tools on display, modern crops, a dramatic crowd spectacle, close identifiable faces, burials, text, labels, borders, or UI.
- Uncertainty: exact people, roof furnishings, colors, weather, and any one captured moment are reconstructed and must remain generalized.
- Composition: wide 2.85:1-safe master with a strong roof-path foreground and enough edge safety for responsive 16:9 mobile cropping.

**House evidence view — one house, legible relationships**

- Required: main room, roof opening/ladder, hearth/oven and platforms, side room with storage bins, entrance-area animal-display treatment, adjoining wall/roof context.
- Distinguish: excavated spatial relationship and bins (supported); exact perishables, colors, and moment of use (reconstructed); exact household identity and ritual meaning (unknown).
- Native UI—not raster text—carries hotspot labels, explanation, certainty, caption, and provenance.
- Composition: landscape axonometric/cutaway with uncluttered shapes and museum-diagram material detail, not a floor-plan made from plain rectangles.

**Locator map — central Anatolia in Southwest Asian context**

- Keep exact learner labels limited to `Çatalhöyük`, `Konya Plain`, `Anatolian Plateau`, `Mediterranean Sea`, and `Black Sea`.
- Preserve UNESCO site coordinates and independent cross-checks; show modern coasts only as orientation, never as a Neolithic shoreline reconstruction.
- Improve landform silhouette, geographic hierarchy, label placement, and phone-size legibility; no modern borders, origin arrows, invented rivers, decorative compass, or generated legend.

**Card — Çatalhöyük as a remembered place**

- Vertical 4:5 view across roof-connected homes with one clear roof opening and the plain beyond; the settlement, not an invented hero person, is the subject.
- No baked-in title, class, date, frame, or educational text. Application UI supplies all card typography and depiction labeling.

### Knowledge Card

- **Decision:** one Place card — **Çatalhöyük**
- **Class:** Foundation (durable settlement memory anchor for the food-systems chapter)
- **Why it earns a card:** It is the concrete place through which learners remember dense settlement, storage, and tradeoffs.
- **Why not an Idea card only:** The evidence encounter is place-bound; the idea “settled farming has tradeoffs” is carried by the lesson prompts and can appear as card facts.
- **Avoid:** invented named farmer person card; goddess figurine as “mother goddess” card.
- **Depiction:** house/settlement diagram or approved reconstruction—not human remains.
- **Unlock:** deterministic on explicit completion of `lesson.farming.settlements`.

## Understanding-check plan

1. **Evidence interpretation — `prompt.farming.house-pattern`**
   - Question: Storage bins and plant remains were concentrated inside side rooms, while entrance areas held animal displays and evidence linked to feasting. Which conclusion is best supported?
   - Supported option: Households kept some food in private interior stores while some activities brought people together near more visible spaces.
   - Distractors overclaim that every household was equal, that a king controlled all grain, or that the diagram records one exact feast.
   - Feedback names what is observed, what is interpreted, and what the pattern cannot prove.

2. **Concise explanation — `prompt.farming.opportunity-and-cost`**
   - Question: How could staying in one dense settlement create both an advantage and a problem? Use one detail from the houses, stored food, work, or health evidence.
   - Sincere attempt required; perfection not required.
   - Feedback accepts advantages such as food kept for later, durable homes, or supporting more neighbors; problems such as repetitive labor, crowding/disease exposure, tension around private stores, or the difficulty of coordinating wall-to-wall households.

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

### Revision 2 decision packet — approved 2026-07-21

1. **Title and focus:** retain **Farming and Settlements**, but organize the learner experience around the question **“How did storing food change life inside a community that stayed in one place?”**
2. **Durable understanding:** approve the revised one-sentence memory target: farming and storage sustained a dense neighborhood while permanence brought labor, crowding, and choices over private/shared resources.
3. **Narrative flow:** approve the seven-section sequence from rooftop entry → gradual change → wall-to-wall place → house evidence → bounded interpretation → bargain of staying → World Check. The lesson no longer culminates in “not yet a city.”
4. **Evidence encounter:** retain the Bogaard private-pantry/shared-feasting research, but require the learner to distinguish excavated spatial observations, the diagram’s reconstruction, and bounded social interpretation.
5. **Visual package:** approve four replacement deliverables after this gate: wide rooftop hero, redesigned locator map, evidence-led house cutaway/plan, and distinct vertical card artwork. Reject the current block SVGs and do not reuse one asset across all roles.
6. **Knowledge Card:** retain one Foundation Place card, **Çatalhöyük**, with dedicated vertical settlement artwork and deterministic unlock on explicit completion.
7. **Understanding checks:** replace the broad summary multiple choice with a house-pattern evidence interpretation; retain a rewritten opportunity-and-cost explanation. Both require sincere attempt, not perfection.
8. **Deferred/rejected:** global farming origins, Jericho tower, pastoral mobility, goddess claims, human-remains imagery, excavation-photo scraping, and video remain outside this lesson.

Production prose, final generation/acquisition, media ingestion, corrective publication migration, and hosted changes remained paused until this revision was approved.

**Approval record:** Carlin Aylsworth approved Revision 2 in the agent review gate on 2026-07-21. This authorizes the revised lesson prose, four-asset visual package, media ingestion, card treatment, prompt replacement, and forward-safe publication correction described above. Historical/editorial, bioarchaeology, visual, rights, accessibility, technical, and learner-review gates remain separate publication requirements.

**Final output approval:** Carlin Aylsworth approved the rebuilt learner copy and all four final visual treatments on 2026-07-21 after reviewing the generated assets and responsive in-app captures. The health language retains the source-led cautions in the claim ledger: pressures changed over time, affected people differently, and do not prove that farming was either a universal improvement or a universal decline. Automated walkthroughs covered four viewport widths, light/dark themes, hero crops, map disclosure, evidence hotspots, decoded media, and overflow. A facilitated age-range learner session is deferred until a representative learner is available; it remains a pre-beta evidence item rather than an unrecorded claim of completion.

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
- [x] Human historical/editorial review
- [x] Bioarchaeology wording review (health tradeoffs)
- [x] Product-owner approval of Revision 2 checkpoint
- [x] Revision 2 production content, final media, corrective migration, tests, and preview
- [x] Structured learner walkthrough or documented reason deferred

## Voice revision

Runbook: `docs/content/lesson-voice-revision-runbook.md`. Branch: `revise/farming-settlements`. Started 2026-10-03. PR: [#75](https://github.com/dev-vibe/chronos-learning/pull/75). Status: **approved by the owner 2026-10-03; merged with PR #75**.

### Audit of the published version

| Section | What read flat |
| --- | --- |
| `section.farming.enter-from-roof` | Opened on an imagined walk (“Step onto a flat mudbrick roof”), then a general sentence (“Food, fuel, work, smoke, waste, and neighbors all had to fit that dense pattern”) where the source gives the wooden ladder through a ceiling opening, then an announced question (“How did storing food change life…?”), then a scope disclaimer as the last paragraph. |
| `section.farming.slow-change` | Boncuklu and Pınarbaşı were named but not told: what Boncuklu’s people did, how long it lasted and the link to Çatalhöyük East (Baird’s “ancestral” argument) were all missing. Ended on a summary (“It was a long series of choices, skills, successes — and new dependencies”). |
| `section.farming.wall-to-wall` | “Homes accumulated” is general where the sources give houses that were often burnt and rebuilt and mounds up to 20 m high. |
| `section.farming.read-the-house` | Hotspots general (“animal heads and horns near more visible spots”); “aurochs” never named or explained; the entrance hotspot ended on a fragment (“— not every rule people followed”). |
| `section.farming.private-and-shared` | Accurate and well limited, but it never gave the study’s own point (a full larder is a provocation, and the horns remember feasts that eased it). Its last line (“The bins survive; the conversations around them do not.”) works and is kept. |
| `section.farming.bargain-of-staying` | A four-item list and nothing else: no story, health pressures in general words, and no ending. |
| `section.farming.check-and-complete` | Prompt explanations accurate (see Prompts). |

Whole lesson: story spine `none` (a sequence of topics); memorable moments `none` a 13-year-old would retell (the opening walk was imagined, not found); opening did not land (imagined scene plus announced question); ending did not land (a knowledge list).

**Prompts.**

| Prompt | Verdict | Finding |
| --- | --- | --- |
| `prompt.farming.house-pattern` | `replace` | Fails the Stage 12 option checks. The best option (124 characters) was the longest of four (the others ran 70 to 79), and the only one hedged (“some… some”); “every”, “exactly” and “exact” appeared only in wrong options. The fourth option (“the diagram records the exact people and actions of one feast”) tested the reconstruction label, not the house reading, and its feedback sent the learner to a different section. The stem’s “concentrated” and “linked to feasting”, and a closing “Which conclusion is best supported?”, are abstract for a 12-year-old. Same teaching job: read the bin-and-display pattern and go no further than it supports. Replaced by `prompt.farming.what-the-house-shows`. |
| `prompt.farming.opportunity-and-cost` | `keep` | Written. Two plain tasks (an advantage and a problem, with one detail) in the lesson’s own words; hint (added 2026-10-03) gives the first step; a two-sentence answer is writable from the revised text (for example: food kept for later let a household plan ahead, but a full larder in a crowded settlement could cause tension with neighbors). The explanation stays accurate for the revised text. |

**Card.** `card.place.catalhoyuk`: `refresh` (reveal text and facts; art `keep`). The reveal was an abstract sentence (“…to explain both the possibilities and pressures of staying in one place”) and the facts carried none of the lesson’s detail. Art stays the dedicated vertical settlement reconstruction, the most vivid image of the subject this lesson has (Stage 11); `depictionLabel` is unchanged and still true.

### Story material

- **Story spine:** food kept for later in a settlement with no streets. The lesson follows a household’s stored food from the roof ladder down to the bin in the side room, and asks what it meant to have a full larder when neighbors were a rooftop away. The ending calls back to the bins and horns.
- **Memorable moments:** (1) Çatalhöyük had no streets: people crossed the roofs and climbed a wooden ladder through the ceiling, and a study’s summary pictures neighbors “always in and out of each others’ houses”; (2) foragers at Boncuklu spent centuries doing a little farming beside foraging, their neighbors at Pınarbaşı disregarded it, and Baird’s team argues Boncuklu’s community was ancestral to the much larger Çatalhöyük East by 7100 BCE; (3) “the provocations of a full larder”: bins of grain, fruit, nuts and condiments deep inside the house, aurochs horns near the door, and feasts that eased the tension; (4) houses burnt and rebuilt on the same ground until the layers made mounds up to 20 m high.
- **Where the material came from:** the research note (Boncuklu/Pınarbaşı, the Bogaard pantry findings, the health caution) and re-reads of the registered sources: the Çatalhöyük Research Project Architecture page, the UNESCO listing, and the abstracts of Baird 2018 (Teesside repository copy), Bogaard 2009 (Cambridge page summary) and Larsen 2019 (two university repository copies). One targeted addition: Britannica’s “aurochs” entry, for the definition and size (new source).
- **Legend used:** none.
- **Evidence limits to know:** the full text of Bogaard 2009 (paywalled) and Larsen 2019 (the PubMed Central copy returned a challenge page and Europe PMC was rate-limited) was not read. The lesson therefore quotes only the journal summary of Bogaard and attributes it as “a summary of the study”, and takes the health findings only from Larsen’s abstract. Central support for the new claims still needs a close review of the full articles before anyone treats it as final.

### Changes

- Prose bodies in the opening and “No single day changed everything” rewritten; “Private stores and shared occasions” rewritten; the scene body and all four hotspots, and the “A neighborhood built wall to wall” knowledge items revised; a new closing prose module (`module.farming.bargain-closing`) added to “The bargain of staying” to carry the health findings and the ending; the card’s reveal and facts refreshed; `prompt.farming.house-pattern` replaced by `prompt.farming.what-the-house-shows`. Lesson, section, module (except the new one), claim, source, media and card IDs, section order, headings, media, captions and completion are unchanged. The existing `module.farming.bargain` knowledge module and the locator-map module are unchanged.
- Module `claimIds` and `sourceIds` updated to cover what each module now says.
- 9 claims and 1 source added: `roof-ladder-entry`, `neighbors-via-roof`, `boncuklu-ancestral`, `rebuilt-mounds`, `bin-contents`, `aurochs`, `full-larder`, `density-and-workload`, `long-occupation`; `source.farming.britannica-aurochs`.
- Reading length (prose, knowledge and scene text, excluding the map): 631 → 998 words (+58%). Prose modules alone: 352 → 668. Growth is the Boncuklu story, the full-larder argument, the aurochs explanation and the closing paragraph; the announced question, the “Food, fuel, work, smoke, waste, and neighbors” line, the summary sentences and the opening scope disclaimer as a stand-alone paragraph were cut or folded in. Captions and the locator map were not changed.
- **Images:** none added. The existing rooftop reconstruction, house diagram and locator map already carry the moments (1), (3) and the setting; no clearly licensed original photograph of the roofs, bins or aurochs horns was found in this pass.

### Left out

- Dental-cavity rates (10–13% of adult teeth), infections in up to a third of early remains, and the finding that later residents walked farther: they appear only in a university news release, not in a source I could read in full; not used.
- Healed skull fractures and violence at Çatalhöyük: in the same news release; not needed and heavy for the age group.
- “Replastered up to 450 times” (a figure I recalled): not found on the Architecture page or any source I read; not used.
- UNESCO’s “18 levels of Neolithic occupation between 7400 and 6200 BC”: conflicts with the 7100–5950 BCE dates used here; not used.
- The oven below the stairs and white plastered, painted walls (Architecture page): sourced but cut for length; burials beneath platforms (rejected in the first production).
- The Antiquity summary’s “like a pueblo” comparison: a modern analogy the runbook says to avoid.
- UNESCO’s “egalitarian ideals” wording: contested; the lesson keeps its qualification.

### Stage 14B check on the changed sections

| Question | Finding | Evidence and disposition |
| --- | --- | --- |
| Story | pass | Spine and four moments above. The opening starts on the roofs and ladder; the ending returns to the bins and horns; no section is a flat list. |
| Evidence reasoning | revise (accepted) | The two quotations from the Antiquity summary and Baird’s abstract are attributed (“A summary of the study”, “Baird’s team argues”); the scene hotspots and closing paragraph keep observation, interpretation and limit apart; “This is a reading of the evidence, not a record of what happened” stays. Open item: full-text close review of Bogaard 2009 and Larsen 2019 (see Evidence limits). |
| Proportionality | pass | Health findings come with Milner’s caution; the equality limit is kept; no ruler, no city claim. |
| Cognitive load | revise (accepted) | New names: Boncuklu and Pınarbaşı (already in the old version), Douglas Baird, aurochs (defined where first met, in the scene hotspot, and again in the prose). Reading length +58%; paragraphs stay short. The owner may ask for trimming. |
| Headings | pass | Unchanged. “The bargain of staying” leans on a mild metaphor but the learner sees its job (gains and costs) from the module text beneath it; left as is. |
| Prompt fit | pass | See the prompt table; new prompt checked in the Prompt revision entry below. |
| Visual value | not applicable | No image added or changed. |
| Rights, media and accessibility | not applicable | No media change. |

`npm run validate:content` passed; `npm run test:domain` passed (16 files, 84 tests); `npm run typecheck:chronos` passed; `npm run content:fingerprints` registered the new prompt and retired the old one. One test (`tests/content/validation.test.ts`) pinned the old prompt ID and now names the new one.

### Card revision

Old reveal: “You discovered Çatalhöyük by reading house and storage evidence to explain both the possibilities and pressures of staying in one place.” (title: “A settlement worth remembering”)
New reveal: “A full larder deep inside the house, aurochs horns near the door, neighbors a rooftop away: you found Çatalhöyük by reading where things lay in its houses. It shows how stored food made staying possible, and made it complicated.” (title: “A settlement with no streets”)

Facts (four before, five now; the first is unchanged): old “Dense mudbrick houses entered from rooftops, without ordinary streets” → “Mudbrick houses touched wall to wall with no streets: people crossed the roofs and climbed down a ladder to go in”; old “Household storage bins held plant foods in interior side rooms” → “Bins for grain, fruit, nuts and condiments stood in side rooms deep inside the houses”; old “Entrance-area displays and feasting evidence point toward shared social activity” → “Aurochs heads and horns near the entrances, with feast remains, point toward shared meals”; added “Houses were rebuilt on the same ground for generations, and the layers form mounds up to 20 meters high”. Subject, class, ID, art, depiction label and unlock are unchanged; learners who own the card see the new text.

### Owner review

Reviewed on the Vercel preview of PR #75. Ash (Carlin Aylsworth) approved the revision on 2026-10-03 (“gtg please merge/finish”) with no changes requested. The review covered the rewritten telling, the new `prompt.farming.what-the-house-shows`, the refreshed Çatalhöyük card and the source and claim additions. The evidence caveats stay as recorded above: the full texts of Bogaard 2009 and Larsen 2019 were not read, so claims resting on them keep their stated certainty.

## Prompt revision

### 2026-10-03 — hints and option feedback (text only, same prompt IDs)

Part of the assessment audit that followed the Indus review (prompt readability check in `docs/content/prompt-revision-runbook.md`). The audit kept every prompt's question and options as they were, so no prompt ID changed and no fingerprint changed; only hints and option feedback, which the prompt-change policy allows under the same ID. Hints and feedback now point back to a section and ask a question instead of stating the answer; every selection option has feedback.

- `prompt.farming.house-pattern`: no hint and no option feedback before. New hint asks where the bins and plant remains were found compared with the animal displays and feasting evidence. Every option has feedback; wrong answers point to “Private stores and shared occasions” or “Read the house” with a question.
- `prompt.farming.opportunity-and-cost`: no hint before. New hint points to “The bargain of staying” and asks for one advantage, one problem and how they connect.

**What learners will see.** Nothing is re-asked. Learners see the new hint, and after a wrong pick the new feedback, the next time they open the prompt. Finished lessons and parent reviews are unaffected.

Owner approval: pending.

### 2026-10-03 — `prompt.farming.house-pattern` → `prompt.farming.what-the-house-shows`

Part of the voice revision on `revise/farming-settlements`. Same teaching job: read the bin-and-display pattern in one house and go no further than it supports (private household stores beside shared, more visible occasions; not equality, not a ruler, not one exact feast). Same kind (supported selection) and required flag (yes). The earlier hint and feedback revision of the same day (above) is superseded for this prompt; `prompt.farming.opportunity-and-cost` keeps its hint. `prompt.farming.house-pattern` is retired in `content/published-prompt-fingerprints.json`.

**Why it changed.** The old best option was the longest and the only hedged one, absolute words appeared only in wrong options, and one distractor tested the reconstruction label rather than the house reading (see the audit above).

| | Old | New |
| --- | --- | --- |
| Question | “Storage bins and plant remains were concentrated inside side rooms, while entrance areas held animal displays and evidence linked to feasting. Which conclusion is best supported?” | “Excavators found bins of grain, fruit and nuts in side rooms deep inside Çatalhöyük houses. Near the entrances they found the heads and horns of aurochs, and remains linked to feasting. Which statement fits these finds best?” |
| Hint | “Ask where the bins and plant remains were found, and where the animal displays and feasting evidence were found. What does each location suggest?” | “Think about where each find was located, deep inside the house or near the entrance. Who would see each one?” |
| Best option | `option.farming.private-and-shared`: “Households kept some food in private interior stores while some activities brought people together near more visible spaces.” | `option.farming.own-stores-shared-meals`: “Each household kept its own food, and people also came together to share meals.” |

| New option | Feedback | Section that supports it |
| --- | --- | --- |
| `option.farming.own-stores-shared-meals` (best): Each household kept its own food, and people also came together to share meals. | Yes. Bins deep inside the houses fit food kept by each household, and horns and feast remains near the entrances fit meals shared more widely. | “Read the house” (side-room bins and entrance-area hotspots) and “Private stores and shared occasions” (`claim.farming.private-storage`, `bin-contents`, `shared-feasting`, `full-larder`) |
| `option.farming.ruler-central-store`: A ruler collected grain from the houses and kept it in one large central store. | Reread “Private stores and shared occasions.” Where were the bins found, and does that fit one central store? | Same section; bins were inside houses, not in one central place (`claim.farming.private-storage`) |
| `option.farming.similar-households`: The households had similar amounts of food and a similar place in the community. | Reread “Private stores and shared occasions.” Does the position of the bins tell us how much food each household had, or how people ranked? | Same section, last paragraph (`claim.farming.no-palace-equality`) |
| `option.farming.one-common-supply`: People kept no food of their own, because the community shared a common supply. | Look at the first find again. If the community shared one supply, why would there be bins deep inside separate houses? | “Read the house” (side-room bins) |

Old options for reference: `option.farming.perfect-equality`, `option.farming.central-ruler`, `option.farming.exact-scene` (retired with the prompt). Explanation (shown after the right pick): “The bins deep inside the houses fit food kept by each household. The horns and feast remains near the entrances fit meals shared more widely. This is an interpretation, not a record: the finds do not show a ruler, equal households, or exactly who took part in a feast.”

**Checks.** The four labels run 79, 79, 80 and 79 characters; the best is not the longest; no option uses an absolute word the others do not; no joke option. Covering the stem, the options alone do not give the answer away (each of the three wrong options describes a misconception about early settled life: a ruler’s store, equal households, or sharing everything). Each feedback points to a section or to the stem’s own evidence without stating the answer. Every term in the stem (aurochs, feasting) is taught in the revised “Read the house” scene and the prose.

**What learners will see.** Finished lessons, and lessons waiting for or passed by a parent, stay as they are; for them the new question is just another check to try. The prompt is required, so a learner still working through the lesson, or one whose lesson was sent back, must pick the best-supported answer on the new question before finishing. Parents see written questions only; this prompt is a selection, so Review is unaffected.

Owner approval: approved 2026-10-03 with PR #75.
