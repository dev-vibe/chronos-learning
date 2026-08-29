# Supe Valley coast-and-inland map — historical map production record

Date: `2026-08-19`
Lesson ID: `lesson.caral.andean-urbanism`
Module ID: `module.caral.supe-map`
Runtime media ID: `media.caral.supe-valley-map`
Rights decision: `approved`
Depiction status: `evidence-based reconstruction`

## Map purpose

- Period and geographic extent: c. 3000–1800 BCE; Peru’s north-central Pacific coast around the Supe Valley, from the ocean to the nearby Andes.
- Focus place or route: the west–east relationship between coastal Áspero and inland Caral.
- Spatial relationship the learner should understand: Caral is not on the beach; Áspero sits at the river mouth; a green irrigated valley and pale desert terraces lie between the Pacific and the Andes.
- Required labels or annotations: `Pacific Ocean`, `Áspero`, `Caral`, `Supe Valley`, `Andes`.

## Selected geographic reference

- Title or figure: *Physical map of Peru*
- Canonical URL: https://commons.wikimedia.org/wiki/File:Peru_physical_map.svg
- Publisher or author: Urutseg, Wikimedia Commons; topography from the Shuttle Radar Topography Mission
- Publication date: 5 March 2011
- License or permitted reference status: CC0 1.0 public-domain dedication; derivatives and redistribution permitted without restriction.
- Geographic contribution: north-up Pacific-west / Andes-east composition, narrow coastal plain, and river valleys running from the mountains to the sea on Peru’s north-central coast.
- Important limitations: a modern national physical map, not a 2600 BCE reconstruction. It includes other countries, administrative borders, a full elevation legend, and far more coastline than the lesson needs.
- Local research-copy location: `docs/research/references/caral/peru-physical-map-reference.png`
- Reference SHA-256: `a3a5fe50107f9b1d4d700e4901a541e2551fde7b40857214efb2450dd58ab3e7`
- Working crop used for generation: `docs/research/references/caral/supe-coast-physical-map-crop.png`; SHA-256 `6efa93e91a9150d8cc449bb81ed5db7a23b2ee246189c3bf697aafa1c1dd0319`

This is the primary composition reference because it is a real, rights-cleared topographic raster that shows ocean, coastal desert, transverse valleys, and Andes in the correct relative orientation. It may be retained under CC0. Institutional coordinates below control the two site markers.

## Independent cross-checks

### UNESCO Sacred City of Caral-Supe maps

- Title: *Sacred City of Caral-Supe — Maps*
- Canonical URL: https://whc.unesco.org/en/list/1269/maps/
- Publisher or author: UNESCO World Heritage Centre
- License or permitted reference status: official coordinates used as a geographic reference; inscribed-property maps are reference-only and are not redistributed.
- Geographic contribution: Caral at S10 53 30 W77 31 17.
- Agreement or disagreement with the primary reference: agrees that the site lies inland of the Pacific on Peru’s north-central coast.

### Science 2001 inland distance

- Title: *Dating Caral, a Preceramic Site in the Supe Valley on the Central Coast of Peru*
- Canonical URL: https://doi.org/10.1126/science.1059519
- Publisher or author: Shady Solís, Haas, and Creamer, *Science*
- License or permitted reference status: research citation; figures are not redistributed.
- Geographic contribution: Caral about 23 km inland on a desert terrace above the Supe Valley.
- Agreement or disagreement with the primary reference: supplies the inland distance the national map cannot resolve at lesson scale.

### Scientific Reports 2023 Áspero coordinates

- Title: *Analysis of starch grains trapped in human dental calculus in Áspero, Peru*
- Canonical URL: https://doi.org/10.1038/s41598-023-41015-6
- Publisher or author: Dillehay et al. / open-access *Scientific Reports*
- License or permitted reference status: CC BY 4.0 article; coordinates used as facts; figures are not redistributed.
- Geographic contribution: Áspero at WGS84 10°48′52″S, 77°44′31″W, about 500 m from the ancient beach.
- Agreement or disagreement with the primary reference: places Áspero west of Caral at the coast; relative west–east order matches the topographic grain.

## Coordinate checks

| Location | Latitude | Longitude | Authority | Result |
| --- | ---: | ---: | --- | --- |
| Caral | -10.891667 | -77.521389 | UNESCO WHC S10 53 30 W77 31 17 | Inland of Áspero, east of the Pacific; confirmed |
| Áspero | -10.814444 | -77.741944 | Scientific Reports 2023 WGS84 | At the coast, west and slightly north of Caral; confirmed |

Coordinates guide only relative west–east order and the inland-not-beach relationship. They do not turn changing shorelines, river channels, or terrace edges into surveyed polygons.

## Confidence and uncertainty boundary

### Coordinate-verified

- Caral World Heritage point.
- Áspero published WGS84 point.

### Source-supported

- Pacific Ocean west of the coastal desert.
- Andes east of the coastal valleys.
- A green irrigated valley between desert terraces.
- Áspero at the river mouth; Caral inland on a terrace.

### Approximate

- Exact shoreline, river width, delta shape, terrace edges, and vegetation extent.
- The map’s landform silhouettes; no line is a reconstructed c. 2600 BCE survey.

### Omitted

- Political borders, capital-territory fill, Lima, modern highways, extra Norte Chico site catalog, boats, pyramids as icons, and a generated legend.

## Generated artwork lineage

- Generation tool: Cursor/Grok image generation, reference-led raster edit
- Model or version: built-in image generation service; model identifier not exposed
- Generation date: 2026-08-19
- Complete prompt: recorded in `docs/research/caral-andean-urbanism.md` under `media.caral.supe-valley-map`
- Geographic reference inputs: `docs/research/references/caral/supe-coast-physical-map-crop.png`
- Style references and permitted use: Chronos atlas treatment; reference used for geography only
- Final master path: `docs/research/generated/caral/supe-valley-map-master.png`
- Optimized runtime path or object identity: `public/images/places/caral-supe-valley-map.jpg`; fallback `/images/optimized/caral/supe-valley-map.optimized.jpg`
- Required labels and exact spelling: `Pacific Ocean`, `Áspero`, `Caral`, `Supe Valley`, `Andes`
- Rejected drafts and reasons: none; first candidate accepted after geographic and label review
- Historical reviewer and status: Codex cartographic review / accepted pending product owner inspection of the rendered lesson
- Visual reviewer and status: Codex visual review / accepted pending Stage 16 shell check

## Publication records

- Source IDs: `source.caral.commons-peru-physical-map`, `source.caral.unesco-maps`, `source.caral.shady-haas-creamer-2001`, `source.caral.scientific-reports-aspero-2023`
- Media asset ID and review status: `media.caral.supe-valley-map` / approved
- Lesson/module record: `module.caral.supe-map`
- Attribution or provenance shown to learners: Chronos original raster map edit · geographic reference by Urutseg, CC0 1.0
- Alt text and non-visual map summary: supplied on the media asset and historical-map module
- Visible uncertainty note: supplied on the historical-map module

## Final review

- [x] The real reference, not generated output, is the geographic source.
- [x] Every required place and label was checked against authoritative evidence.
- [x] Approximate features do not imply exact reconstruction.
- [x] Reference-map rights and runtime-asset rights are recorded separately.
- [x] Research inputs are not present in public runtime directories without approval.
- [ ] The complete map remains visible and legible at supported viewport sizes.
- [x] Media, content, accessibility, test, and build checks passed or are reported accurately.
