# Uruk: Life in an Early City — research and editorial note

Lesson: `lesson.uruk.first-city` (`content/lessons/uruk.ts`). Journey position: World History / Foundations, entry `entry.world-history.uruk`, after `lesson.farming.settlements` and before `lesson.writing.early-systems`.

Uruk was the first vertical slice (see `docs/architecture/uruk-vertical-slice.md`) and was published before the lesson creation runbook required a research note, so it had none. This file was created during the voice revision to hold the `## Voice revision` record and the ledgers for the sources and claims that revision added. The original three claims (`claim.uruk.administration`, `claim.uruk.city-life`, `claim.uruk.wetland-landscape`) and six sources are unchanged and documented in the lesson module and in `docs/research/uruk-southern-mesopotamia-map.md`.

## Source ledger (added or updated in the voice revision)

| Source ID | Record | Used for | Limits | Rights |
| --- | --- | --- | --- | --- |
| `source.britannica.uruk` (updated) | [Britannica, “Erech”](https://www.britannica.com/place/Erech), last updated 2026-09-09 | Eanna and Anu precincts, White Temple on the Anu ziggurat, excavation from 1928, wall circumference and Gilgamesh legend | Tertiary reference. The old URL (`/place/Uruk`) now returns 404; the ID is unchanged and only the URL, title and access date were updated. | Editorial reference; no text reproduced |
| `source.uruk.perruchini-2023-brb-residues` | [Perruchini et al. 2023, *JAS: Reports* 48, 103730](https://doi.org/10.1016/j.jasrep.2022.103730) | Beveled-rim bowl manufacture and distribution, Nissen’s 1,520-bowl find and ration hypothesis, GU7 and NINDA sign identifications, bread and other hypotheses, Shakhi Kora residue results | Peer-reviewed article whose introduction reviews the debate; Nissen 1970, Potts 2009 and Green et al. 1997 are cited through it, not close-read directly. Residue results come from one northern site, not Uruk. | CC BY 4.0; cited only |
| `source.met.beveled-rim-bowl` | [The Met, Beveled rim bowl, 62.70.25](https://www.metmuseum.org/art/collection/search/325431) | Date (c. 3300–3100 BCE), findspot (Nippur, 1960–61), size (8.2 × 19 × 19 cm) of a typical bowl | Object is from Nippur, not Uruk; the lesson says only that it is in the Met. | Public Domain image, not used |
| `source.uruk.fassbinder-2019-magnetometry` | Fassbinder, Ostner, Scheiblecker, Parsi and van Ess 2019, “Venice in the desert”, in Bonsall (ed.), *New Global Perspectives on Archaeological Prospection*, pp. 197–200 ([academia.edu copy](https://www.academia.edu/40253397/Venice_in_the_desert_Archaeological_geophysics_on_the_world_s_oldest_metropolis_Uruk_Warka_the_city_of_King_Gilgamesh_Iraq_)) | 40,000 people by 3000 BCE in a c. 555 ha inner city; survey method, years and area; canal network; wall length; fired brick in the wall faces | Short conference chapter by the survey team. The canals and wall are not dated to 3200 BCE by the survey, and the lesson does not date them. | Copyrighted; cited only |
| `source.uruk.michalowski-2003-lu-a` | [Michalowski, *CDLJ* 2003:3](https://cdli.earth/articles/cdlj/2003-3) | Standard Professions List attested in Uruk IV and still copied in Old Babylonian times | The 129-line count is for the Early Dynastic composition, so the lesson gives no count. | Open article; cited only |
| `source.uruk.kovacs-gilgamesh` | *The Epic of Gilgamesh*, trans. Maureen Gallery Kovacs (Stanford UP, 1989; electronic ed. Wolf Carnahan 1998), [course copy](https://people.uncw.edu/deagona/myth/Gilgamesh%201-4.pdf) | The epic’s opening invitation to walk the wall and inspect its kiln-fired brick | Standard Babylonian version, compiled long after Gilgamesh’s probable reign; later tradition, not evidence for 3200 BCE. | Copyrighted translation; one short line quoted, rest paraphrased |

## Claim ledger (added in the voice revision)

All added claims are `reviewed` after close-reading on 2026-09-24.

| Claim | Kind / certainty | Source and locator | Note |
| --- | --- | --- | --- |
| `claim.uruk.largest-settlement` | interpretation / moderate | `source.met.uruk`, first paragraph (“By around 3200 B.C., the largest settlement in southern Mesopotamia, if not the world, was Uruk”) | Lesson keeps the hedge: “and perhaps in the world”. |
| `claim.uruk.population-estimate` | interpretation / moderate | `source.uruk.fassbinder-2019-magnetometry`, p. 197 (“The inner city covers an area of c. 555ha and was populated by c. 40,000 people already in BC 3000”) | Given as “one estimate”. |
| `claim.uruk.bowl-mass-find` | observation / high | `source.uruk.perruchini-2023-brb-residues`, §1 Introduction (“a mass find of 1520 BRBs in a sounding at Uruk-Warka (Nissen 1970, 137)”) | “Sounding” rendered as “test trench”. |
| `claim.uruk.bowl-making` | observation / high | Perruchini 2023, §1 (“attested in their thousands at 4th millennium BCE sites from southern Iraq and the Persian Gulf to the highlands of eastern Turkey and Iran”; formed by hand or in a mould, chaff-tempered, lightly fired, “rough and uneven forms”) | Basis for “no two came out quite alike”. |
| `claim.uruk.bowl-size` | observation / high | `source.met.beveled-rim-bowl`, object record (8.2 × 19 × 19 cm; c. 3300–3100 BCE; Nippur) | “Small enough to hold in two hands” follows from the dimensions. |
| `claim.uruk.ration-hypothesis` | interpretation / contested | Perruchini 2023, §1 (hypothesis “first formulated by Nissen”; standardized volume assumed by Johnson 1973, challenged by Beale 1978 and Frangipane 1989) | Lesson: “a strong idea, not a settled fact.” |
| `claim.uruk.ration-signs` | interpretation / moderate | Perruchini 2023, §1 (GAR = NINDA identified as a BRB, citing Potts 2009: 3; GU7 “combines a BRB and a human head and means ‘to eat’”, read as “ration”, citing Green et al. 1997: 153–154) | Lesson: “scholars read it as ‘ration’ … If those readings are right”. |
| `claim.uruk.bowl-debate` | interpretation / contested | Perruchini 2023, §1 (bread hypotheses “most popular in recent decades”; salt, dairy, ritual and other proposals) and §6 Concluding discussion (meat and potentially dairy residues; “supports multi-functional explanations”) | The ending’s open question. |
| `claim.uruk.rations-recorded` | interpretation / high | `source.met.uruk`, second paragraph (“pictographs were drawn on clay tablets to record the management of goods and the allocation of workers’ rations”) | |
| `claim.uruk.professions-list` | observation / high | `source.uruk.michalowski-2003-lu-a`, §2 (“attested already in Uruk IV … still copied in Old Babylonian times”) | “More than a thousand years later”: Uruk IV c. 3200 BCE, Old Babylonian c. 1900–1600 BCE. |
| `claim.uruk.precincts` | observation / high | `source.britannica.uruk`, main text (“the Anu ziggurat crowned by the ‘White Temple’”; “The temenos (sacred enclosure) of Eanna”) | Britannica dates the White Temple to the Jemdet Nasr period; other references date it earlier, so the lesson gives no date. |
| `claim.uruk.cone-mosaics` | observation / high | `source.met.uruk`, first paragraph (“monumental mud-brick buildings decorated with mosaics of painted clay cones embedded in the walls”) | |
| `claim.uruk.excavations` | observation / high | `source.britannica.uruk` (“excavated from 1928 onward by the German Oriental Society and the German Archeological Institute”) | |
| `claim.uruk.canals-magnetometry` | observation / high | Fassbinder et al. 2019, p. 197 (“network of waterways, ship canals, harbours and moles, water gates and landing places”; c. 70 ha surveyed; campaigns 2001–2002, resumed 2016, 2018–2019) | Not dated to 3200 BCE; lesson places it in the modern survey story only. |
| `claim.uruk.wall-later` | interpretation / high | `source.met.uruk`, Early Dynastic paragraph (“surrounded by a massive wall, which according to tradition was built on the orders of King Gilgamesh”; Gilgamesh probably ruled c. 2700 B.C.); Fassbinder et al. 2019, p. 197 (wall c. 9 km); Britannica (walls about 10 km in circumference, built “according to legend” by Gilgamesh) | Lesson uses “about 9 kilometers”. |
| `claim.uruk.gilgamesh-wall-story` | later-tradition / high | `source.uruk.kovacs-gilgamesh`, Tablet I, opening column (“Go up on the wall of Uruk and walk around, examine its foundation, inspect its brickwork thoroughly. Is not (even the core of) the brick structure made of kiln-fired brick…”) | Quoted: the first clause only. |
| `claim.uruk.wall-fired-brick` | interpretation / moderate | Fassbinder et al. 2019, p. 198 (“parts of the wall on its inner and outer faces are made of fired bricks; a detail that was not known before”) | “Suggest” keeps the survey’s own hedge (“seems to indicate”). |

`claim.farming.private-storage` (from `lesson.farming.settlements`) is reused for the Çatalhöyük comparison, with its two sources added to the Uruk module and lesson lists.

## Voice revision

Runbook: `docs/content/lesson-voice-revision-runbook.md`. Branch: `revise/uruk-first-city-voice`. Started 2026-09-24. Status: **approved by the owner 2026-09-24; merge completes the revision**. PR: [#60](https://github.com/dev-vibe/chronos-learning/pull/60).

### Audit of the published version

| Section | What read flat |
| --- | --- |
| `section.uruk.masthead` | Two general sentences (“grew into a major city”, “organized at a new scale”) where the Met gives “largest settlement … if not the world” and a population estimate exists. Map text was abstract (“its position linked fields and settlements”). |
| `section.uruk.opening-city-question` | Opened on two announced questions, with no moment, person, object or place; the scene intro was a disclaimer (“Use this reconstruction to ask questions…”). Hotspots general (“large shared buildings point to…”). |
| `section.uruk.water-food-and-labor` | Three same-length fact tiles and a two-sentence abstract body; “surplus” and “specialized work” with no example; power stated as an aside. |
| `section.uruk.the-built-city` | No named building or material detail although the precincts, White Temple and cone mosaics are well attested; no claims attached. |
| `section.uruk.tablets-and-administration` | Methods voice (“help historians track accounting and administration”); the uncertainty hedge repeated in body and caption; nothing linked the records to anything else in the lesson. |
| `section.uruk.evidence-and-reconstruction` | Three sentences of disclaimer; the site had no story (1928 excavations, magnetometer survey); the later story about Uruk’s walls appeared only as a wrong answer in prompt 1 without ever being told. |

Whole lesson: story spine `none`; memorable moments `none`; the opening did not land (announced question); the ending did not land (a disclaimer about the reconstruction).

### Story material

- **Story spine:** the beveled-rim bowl. It opens the lesson as a real puzzle (1,520 in one trench); section 3 gives Nissen’s ration answer and ties it to Uruk’s ration records and the Çatalhöyük contrast; section 4 returns to the people who had to be fed; section 5 finds the bowl inside the writing (the GU7 “to eat” sign); the ending returns to the bowls as the evidence that outlasts the legend, and to what they held as a real open question.
- **Memorable moments:** (1) 1,520 cheap, uneven bowls in one test trench, found by the thousands from southern Iraq to eastern Turkey and Iran; (2) the sign for “to eat” is a head with the bowl at its mouth; (3) a list of jobs first written at Uruk still being copied more than a thousand years later; (4) the Epic of Gilgamesh telling listeners to climb Uruk’s wall and check its fired brick, and the magnetometer survey finding fired brick in the wall faces (labelled later tradition and dated centuries after 3200 BCE).
- **Sources of the material:** close re-reading of the registered Met essay and Britannica article; targeted research for the bowl debate (Perruchini et al. 2023), one museum bowl (Met 62.70.25), the magnetometer survey (Fassbinder et al. 2019), the professions list (Michalowski 2003) and one short line of the epic (Kovacs translation).
- **Later tradition used:** the Gilgamesh wall passage, introduced as how “later Mesopotamians remembered Uruk” and followed by “a poem cannot tell us how Uruk worked in 3200 BCE”.
- **Cumulative link:** section 3 retrieves Çatalhöyük’s household food bins from `lesson.farming.settlements`; section 5 hands the ration sign to `lesson.writing.early-systems` without pre-empting its close-read.

### Changes

- Rewritten: masthead prose, map body, opening prose, scene body and hotspot details, both knowledge bodies and three item details, both evidence bodies. All IDs, headings, section order, prompts, options, answer logic, media, card, journey framing and completion are unchanged. No module removed or reordered. Hotspot labels, map notes and the tablet caption are unchanged.
- 5 sources and 17 claims added (ledgers above); `source.britannica.uruk` URL updated because the old one returns 404. Module `claimIds`/`sourceIds` updated to cover what each module now says; `section.uruk.the-built-city` previously had no claims.
- Reading length: 440 → 1,061 words in learner-facing headings and modules (+141%). The published lesson was the thinnest in the journey (the Sahul lesson was 1,029 words before its revision); the growth is the bowl puzzle, the ration argument and the site story, and the repeated disclaimers were cut.

### Left out

- The Uruk (Warka) Vase and its 2003 theft and return: a strong story, but not close-read in this pass and it would want an image, which is a media change.
- Goulder’s bread-baking experiments: only the abstract was accessible; the bread idea appears through Perruchini’s review.
- Nissen 1970, Potts 2009 and Green et al. 1997 directly: cited through Perruchini 2023; their exact pages were not read.
- The main canal’s size (c. 1.5 km long, up to 15 m wide) and the 555 ha area: accurate but added load.
- A date for the White Temple: Britannica’s Jemdet Nasr dating conflicts with other references.
- The Kushim tablet and other named-official stories: they belong to the writing lesson.

### Media observations for the owner (not changed)

- `media.uruk.reconstruction` shows a stepped, multi-tier temple tower inside a moated precinct. Stepped ziggurats of that form are generally later than 3200 BCE, so the picture may show a later Uruk than the lesson’s date. The scene text now avoids describing the tower.
- `media.uruk.clay-envelope` shows a wedge-script tablet inside a broken clay envelope, which looks much later than Uruk-period proto-cuneiform. The evidence text describes Uruk’s records in general and does not claim the pictured object is from Uruk.
- Both are media-teaching-job questions and therefore material revisions under the creation runbook; nothing was changed here.

### Stage 14B check on the changed sections

| Question | Finding | Evidence and disposition |
| --- | --- | --- |
| Story | pass | Opens on the 1,520-bowl find; the bowl returns in sections 3, 4 (who had to be fed), 5 (the ration sign) and the ending. Knowledge boxes keep their parallel items. |
| Evidence reasoning | pass | The ration idea is flagged once where it is introduced (“a strong idea, not a settled fact”); the sign readings are attributed to scholars and conditioned (“If those readings are right”); the Gilgamesh passage is labelled later tradition and separated from 3200 BCE; the magnetometer finding keeps its hedge (“suggest”). Prompt 1 is answerable from section 5, and its “later story about Uruk’s walls” option is now explained in section 6. Prompt 2 is answerable from section 3. |
| Proportionality | pass | “Largest … and perhaps in the world” keeps the Met’s hedge; power is stated as “could give”; the Çatalhöyük comparison is a contrast of storage, not a ranking; workers appear as people who had to be fed and paid, not as a faceless mass. |
| Cognitive load | pass | New names: beveled-rim bowl, Hans Nissen, Eanna, Anu, White Temple, magnetometer, Gilgamesh. Numbers: 3200, 40,000, 3000, 1,520, 19 and 8 cm, fifty years, 1928, 2001, 2700, 9 km, each once. Section 6 is the densest (three short paragraphs, one job each: the site, the legend, what we can know). |
| Headings | pass | All headings already name their subjects in plain words; none changed. `The built city` is pinned by `tests/learn/LearnApp.test.tsx`. |

`npm run validate:content` passed; `npm run test:domain` passed (14 files, 63 tests); `tests/learn/LearnApp.test.tsx` and `tests/learn/progress.test.ts` passed, including the two pinned Uruk phrases, which were kept. `tests/learn/multi-lesson.test.tsx` has one failure (“resolves the published writing lesson…”) that also fails on unmodified `main` and does not touch this lesson.

The branch preview was loaded and read in a browser on 2026-09-24: all six sections, both prompts and the completion action render with the revised text.

### Owner review

- Date: 2026-09-24.
- PR: [#60](https://github.com/dev-vibe/chronos-learning/pull/60), branch preview [chronos-learning-git-revise-uruk-firs-1dd558-dev-vibes-projects.vercel.app](https://chronos-learning-git-revise-uruk-firs-1dd558-dev-vibes-projects.vercel.app/learn/lesson.uruk.first-city).
- Story spine: the beveled-rim bowl, from the 1,520 found in one test trench to the closing open question of what the bowls held.
- Memorable moments: 1,520 cheap, uneven bowls in one trench, found by the thousands from southern Iraq to eastern Turkey and Iran; the “to eat” sign drawn as a head with the bowl at its mouth; a list of jobs first written at Uruk and still copied more than a thousand years later; the Epic of Gilgamesh’s invitation to check the wall’s kiln-fired brick, and the magnetometer survey finding fired brick in the wall faces (labelled later tradition, dated centuries after 3200 BCE).
- Added claims: `claim.uruk.largest-settlement`, `population-estimate`, `bowl-mass-find`, `bowl-making`, `bowl-size`, `ration-hypothesis`, `ration-signs`, `bowl-debate`, `rations-recorded`, `professions-list`, `precincts`, `cone-mosaics`, `excavations`, `canals-magnetometry`, `wall-later`, `gilgamesh-wall-story`, `wall-fired-brick`; reused `claim.farming.private-storage`. Sources added: `source.uruk.perruchini-2023-brb-residues`, `source.met.beveled-rim-bowl`, `source.uruk.fassbinder-2019-magnetometry`, `source.uruk.michalowski-2003-lu-a`, `source.uruk.kovacs-gilgamesh`; `source.britannica.uruk` URL updated.
- Owner decisions: the reconstruction and clay-envelope media observations above were reported and left for a separate material revision if wanted. Carlin Aylsworth reviewed the branch preview and approved the revision (“approved!”), 2026-09-24.
