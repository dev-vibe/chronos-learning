# Human origins Africa evidence-location map research note

Date: `2026-07-20`
Lesson ID: `lesson.humans.homo-sapiens-origins`
Module ID: `module.human-origins.africa-evidence-map`
Runtime media ID: `media.human-origins.africa-evidence-map`
Rights decision: `approved for production from public-domain/factual inputs; final asset pending review`
Depiction status: `illustrative evidence-location map; not a reconstruction of populations or routes`

## Map purpose

- **Period and extent:** Africa, with evidence dated approximately 315,000–200,000 years ago.
- **Focus:** spatial separation of three fossil sites relevant to Homo sapiens emergence.
- **Relationship:** clues survive in northern, eastern, and southern Africa. Their spread argues against treating one findspot as a proven exclusive birthplace, but does not prove every mapped population contributed directly to living people.
- **Required raster labels:** `Jebel Irhoud`, `Omo Kibish`, `Florisbad`.
- **Native context:** Morocco, Ethiopia, and South Africa are modern references; dates, classifications, captions, and uncertainty remain application text.
- **Responsive target:** entire continent visible without cover-cropping; labels legible at 360 px; no inset.

## Selected geographic reference

- **Title:** Natural Earth small-scale physical/cultural vector data
- **Canonical URL:** https://www.naturalearthdata.com/
- **Publisher/authors:** Natural Earth; Tom Patterson, Nathaniel Vaughn Kelso, and contributors
- **Publication date:** living dataset; accessed 2026-07-20
- **License:** public domain
- **Contribution:** Africa outline, present-day coastline, restrained physical orientation
- **Limitations:** modern orientation, not a Pleistocene sea-level reconstruction; does not supply fossil interpretation
- **Local copy:** none retained at checkpoint

Natural Earth is the primary composition base because it is suitable for a continent-scale locator, explicitly public domain, and restylable without copying a protected scholarly map. Site positions and meanings come from independent authorities.

## Independent cross-checks

### Omo Kibish

- **Title:** The modern human fossils of the Kibish Formation
- **URL:** https://iugs-geoheritage.org/geoheritage_sites/the-modern-human-fossils-of-the-kibish-formation/
- **Publisher:** International Union of Geological Sciences
- **Rights:** research/location reference; photography not assumed reusable
- **Contribution:** formation location at 05°18'46"N, 035°56'22"E; context; current age summary
- **Agreement:** consistent with Vidal et al. 2022 and McDougall et al. 2005

### Jebel Irhoud

- **Title:** Africa and the Origins of Modern Humans
- **URL:** https://www.eva.mpg.de/evolution/field-projects/africa-and-the-origins-of-modern-humans/
- **Publisher:** Max Planck Institute for Evolutionary Anthropology
- **Rights:** research/location reference; images not assumed reusable
- **Contribution:** approximately 100 km west of Marrakesh, Morocco
- **Agreement:** consistent with Hublin et al. and Richter et al. 2017
- **Limit:** no precise coordinate from this authority; marker receives a deliberate uncertainty halo

### Florisbad

- **Title:** A new perspective on the geohydrological and surface processes controlling the depositional environment at the Florisbad archaeozoological site
- **URL:** http://hdl.handle.net/11660/1168
- **Publisher:** University of the Free State
- **Rights:** research/location reference only
- **Contribution:** coordinates 28°46'05.4"S, 26°04'10.7"E and site context
- **Agreement:** consistent with UFS and National Museum descriptions, 45 km northwest of Bloemfontein
- **Limit:** fossil classification is contested; label denotes evidence site, not undisputed ancestor

### Scientific interpretation cross-checks

- Hublin et al. 2017 and Richter et al. 2017 govern Jebel Irhoud morphology and age.
- Vidal et al. 2022 governs Omo I's minimum age.
- Mounier and Mirazón Lahr 2019 supplies the warning that regional fossils differ and not every lineage necessarily contributed equally.
- Bergström et al. 2021 and Ragsdale et al. 2023 govern the no-single-birthplace and structured-population framing.
- Protected scholarly figures remain research-only and are not copied.

## Coordinate checks

| Location | Latitude | Longitude | Authority | Result |
| --- | ---: | ---: | --- | --- |
| Omo Kibish reference point | 5.312778 | 35.939444 | IUGS | Coordinate-verified eastern placement |
| Florisbad site | -28.768167 | 26.069639 | University of the Free State | Coordinate-verified southern placement |
| Jebel Irhoud | not fixed | not fixed | MPI field record; Hublin/Richter figures | Source-supported northwest placement about 100 km west of Marrakesh; render approximately |

Coordinates guide marker relationship only. Marker size must not imply site extent, population size, or certainty.

## Confidence and uncertainty boundary

### Coordinate-verified

- Omo Kibish reference point.
- Florisbad site.

### Source-supported

- Jebel Irhoud in Morocco approximately 100 km west of Marrakesh.
- Northern, eastern, and southern evidence relationship.
- Modern continental outline used only for orientation.

### Approximate

- Jebel Irhoud marker.
- Any soft ecological texture.
- Present-day coastline as locator rather than 300,000-year-old shoreline.

### Omitted

- National borders in raster.
- Population territories, skin tones, languages, migration arrows, gene-flow routes, climate zones, and origin-center symbols.
- Herto, Thomas Quarry, and sites outside the bounded comparison.
- Dates and classification badges inside image; these remain native text.

Learner uncertainty: “These dots mark where evidence was recovered. They do not mark three exact birthplaces, and scientists disagree about how some fossils fit our ancestry.”

## Production brief

Create a restrained Chronos-original Africa evidence-location map.

- Use a public-domain Natural Earth Africa outline.
- Keep north up and show the whole continent with generous space.
- Place only the three reviewed markers.
- Use a distinct uncertainty ring for Jebel Irhoud without visual alarm.
- Use mineral blue linework, warm ivory ground, restrained ochre markers, and accessible contrast.
- Do not add national borders, flags, routes, people, skulls, tool icons, compass, generated legend, title, dates, paragraphs, logo, watermark, or UI chrome.
- Exact labels: `Jebel Irhoud`, `Omo Kibish`, `Florisbad`.
- Keep explanation, modern-country context, dating, provenance, and uncertainty as native text.
- Prefer deterministic vector/GIS composition over image generation. If raster generation is used, manually verify every label and coordinate relationship.

## Generated artwork lineage

- **Generation tool:** `scripts/media/generate-human-origins-map.mjs` using Sharp and deterministic SVG composition
- **Model/version:** not applicable unless later approved
- **Generation date:** 2026-07-20
- **Complete prompt:** production brief above
- **Inputs:** Natural Earth `ne_110m_land.geojson` (SHA-256 `9e0729ee253ca7d7a5c4ae9395fb1902264c5377c52e224d13dd85010e2835d9`); reviewed coordinates/relationships above
- **Style inputs:** Chronos design system only
- **Final master path:** `public/images/maps/human-origins-africa-evidence-map.webp`
- **Optimized runtime path:** `public/images/optimized/human-origins/africa-evidence-map.optimized.webp`
- **Required labels:** Jebel Irhoud; Omo Kibish; Florisbad
- **Rejected drafts:** none generated at checkpoint
- **Historical/map reviewer:** pending
- **Visual/accessibility reviewer:** pending

## Publication records

- **Source IDs:** `source.map.natural-earth`, `source.human-origins.iugs-kibish`, `source.human-origins.mpi-jebel-irhoud`, `source.human-origins.ufs-florisbad`, plus lesson claim sources
- **Media asset:** `media.human-origins.africa-evidence-map`; generated and registered, remaining provenance-review-required until final human review
- **Module:** `module.human-origins.africa-evidence-map`
- **Attribution:** “Chronos evidence-location map · Base geography: Natural Earth (public domain) · Site evidence: IUGS, MPI-EVA, UFS, and cited studies”
- **Alt text:** “Map of Africa with Jebel Irhoud in the northwest, Omo Kibish in the east, and Florisbad in the south. The distant sites show that early human-origin evidence is spread across the continent; the dots are findspots, not exact birthplaces.”
- **Non-visual summary:** northern, eastern, and southern sites contribute different clues; classification and contribution to living ancestry remain uncertain.
- **Visible uncertainty note:** wording above.

## Final review

- [x] Public-domain real reference, not generated output, is the base.
- [x] Required places checked against institutional or primary research evidence.
- [x] Approximate placement and modern coastline do not imply Pleistocene precision.
- [x] Reference rights and future runtime-asset rights separated.
- [x] No research input in public runtime directories.
- [x] Final map generated only after checkpoint approval.
- [x] Labels and relative placement manually reviewed.
- [x] Complete map verified at supported viewport sizes.
- [x] Media, content, accessibility, test, and build checks passed.
