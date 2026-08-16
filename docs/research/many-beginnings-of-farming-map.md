# Many Beginnings of Farming — historical map research note

Date: `2026-08-11`
Lesson ID: `lesson.farming.multiple-origins`
Module ID: `module.farming.multi.map-alternative`
Runtime media ID: `media.farming.multiple-origins-map`
Rights decision: `approved`
Depiction status: `illustrative reconstruction with evidence-led approximate zones`

## Map purpose

- Period and geographic extent: full world, `c. 10,000–3000 BCE`.
- Focus place or route: several broad, independent food-production regions; no route.
- Spatial relationship the learner should understand: Southwest Asia was one beginning among widely separated beginnings involving different local plants and practices.
- Required labels or annotations: none baked into the image. Native UI supplies the regional names and uncertainty language.

## Selected geographic reference

- Title or figure: Natural Earth II with Shaded Relief and Water, 1:50m raster, version 3.2.0.
- Canonical URL: https://www.naturalearthdata.com/downloads/50m-natural-earth-2/50m-natural-earth-ii-with-shaded-relief-and-water/
- Download object: https://naturalearth.s3.amazonaws.com/50m_raster/NE2_50M_SR_W.zip
- Publisher or author: Natural Earth.
- Publication date: current download version 3.2.0; page first published 2009.
- License or permitted reference status: Public Domain. Natural Earth permits use, modification, and redistribution; “Made with Natural Earth” is the recommended acknowledgement.
- Geographic contribution: the complete raster anchors coastlines, continent proportions, islands, and relative world geography.
- Important limitations: modern coastlines and idealized terrain are orientation aids, not a reconstruction of Holocene shorelines, vegetation, rivers, or political boundaries.
- Local research copy: `docs/research/references/many-beginnings-farming/natural-earth-ii-shaded-relief-water.jpg`, 2400×1200 JPEG derived from the 10800×5400 TIFF solely for generation input, SHA-256 `2BF3F7CBEFC9BCEB338A78060D541D03BDA2F4AF4596C0C5A4680D87739538E0`.

This is the primary composition reference because the generated output must preserve real world geography. It may be redistributed and modified under Natural Earth’s Public Domain terms.

## Independent cross-checks

- Title: *Convergent evolution and parallelism in plant domestication revealed by an expanding archaeological record*.
- Canonical URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC4035951/
- Publisher or author: PNAS / Dorian Q. Fuller and colleagues.
- License or permitted reference status: open-access scholarship used as factual research; article figures were not passed to generation or redistributed.
- Geographic contribution: cross-regional synthesis supporting multiple independent plant-domestication pathways.
- Agreement or disagreement with the primary reference: supports the broad multi-regional concept; Natural Earth supplies geography only and makes no historical-origin claim.

Regional placement was then cross-checked against the lesson’s reviewed New Guinea, China, Sahel, and Mesoamerica studies: Denham 2003; Deng et al. 2015; Winchell et al. 2018; and Piperno et al. 2009. The image uses broad zones rather than reproducing any journal figure.

## Coordinate checks

Exact coordinate claims are deliberately out of scope. This map teaches broad evidence regions, not pinpoint “first farms.” Modern coastlines anchor relative location, and the cited regional studies constrain the zones. No zone should be read as a surveyed boundary.

## Confidence and uncertainty boundary

### Coordinate-verified

- None. Exact site pins would create false precision for this lesson’s question.

### Source-supported

- Southwest Asia / Fertile Crescent as one early region.
- Northern millet and Yangtze rice traditions within China.
- New Guinea highland cultivation and wetland agriculture.
- Independent cereal pathways across the western and eastern Sahel.
- Multiple American pathways, represented here by Mesoamerica and northern South America / Andean foothills.

### Approximate

- Every glow edge, width, and intensity.
- The grouping of more than one pathway under the learner-facing regional labels “China” and “Americas.”
- Modern coastlines as orientation during a long period with environmental change.

### Omitted

- Diffusion arrows, national borders, exact pins, chronological ranking, crop icons, people, dates, political boundaries, and claims that the displayed set is complete.

The scholarly record differs on how many “centers” to count because genetic origins, crop-specific domestications, and cultural traditions are different units. Learner-facing copy therefore says “several regions,” “broad areas,” and “more beginnings existed than this lesson can show.”

## Generated artwork lineage

- Generation tool: OpenAI ImageGen built into Codex, image-edit mode.
- Model or version: not exposed by the tool; recorded as `gpt-imagegen` in generated C2PA metadata.
- Generation date: `2026-08-11`.
- Complete prompt:

```text
Edit the provided Natural Earth world raster into a historically disciplined educational map for an ages 11–14 lesson about the many beginnings of farming. Preserve the source coastline shapes, continent proportions, island positions, and geographic relationships exactly; this is a map edit, not invented geography. Keep an equirectangular full-world composition at 2:1 landscape aspect ratio. Restyle the base into a calm Chronos palette: deep desaturated blue ocean, warm parchment-to-olive land, subtle terrain shading, legible land-water contrast, no modern political borders.

Overlay exactly five soft, semi-transparent, approximate origin zones using restrained amber/gold glow or textured wash, not point markers: (1) Southwest Asia / Fertile Crescent, a curved zone from the southern Levant through northern Mesopotamia toward the Zagros; (2) China, two broad related areas across northern China and the Yangtze basin; visually one regional grouping, not a migration route; (3) New Guinea highlands, a compact zone centered on the island’s central highlands; (4) the African Sahel, an elongated east-west band immediately south of the Sahara; (5) the Americas, two separate soft areas within one broad regional story—Mesoamerica and northern South America / Andean foothills. Zones should communicate approximate regions and uncertainty, not exact sites.

Absolutely no arrows, travel lines, chronological sequence, pins, icons, crop illustrations, people, national borders, labels, dates, title, legend, captions, paragraphs, educational UI, frames, buttons, baked-in text, or invented coastlines. No single zone should look dominant. The visual thesis is simultaneous plurality: several communities in different regions changed how they lived with plants over long periods. Polished editorial museum-atlas quality, calm and uncluttered, with generous edge breathing room. Output a high-resolution raster suitable for responsive web use.
```

- Geographic reference input: `docs/research/references/many-beginnings-farming/natural-earth-ii-shaded-relief-water.jpg`.
- Style references and permitted use: the Natural Earth raster was the only image input; it is Public Domain.
- Full-resolution generated output: `C:\Users\carli\.codex\generated_images\019fef2e-3efb-7313-979b-6528d4f7d93d\exec-e22899d2-39a7-46a7-bfd5-41ce913a0e05.png` (1774×887; retained by Codex generation storage).
- Final production master: `public/images/maps/many-beginnings-farming-zones.png`, 960×480, SHA-256 `dc374e51d31d1b4e28da83c17d980f52f8b6726871616478f9198c4e3369e0a1`.
- Optimized runtime fallback: `/images/optimized/farming/multiple-origins-map.optimized.webp`, 960×480 lossless WebP, SHA-256 `ac553e99a841a5e22c7fe34559307a8c597badfc3f9b0ebc0f384e15bec78369`.
- Required labels and exact spelling: none in the raster.
- Rejected drafts and reasons: no visual draft was rejected. The 1774 px output was visually accepted but rejected as a runtime master because its 1600 px derivative could not meet the unchanged `ql-v1` 768 KB fidelity ceiling. The 960 px production master matches the Learn shell’s real teaching surface and produces pixel-exact 480/960 variants.
- Historical review: Chronos evidence/uncertainty review passed; no unsupported route, pinpoint, border, or complete-count claim remains.
- Visual review: production review passed at source size; responsive shell review remains part of the implementation gate.

## Publication records

- Source IDs: `source.farming.natural-earth`, `source.farming.fuller-2014-convergent`, `source.farming.denham-2003-kuk`, `source.farming.deng-2015-baligang`, `source.farming.winchell-2018-sorghum`, `source.farming.piperno-2009-maize`.
- Media asset: `media.farming.multiple-origins-map`, `approved` for the draft production preview.
- Lesson/module: `lesson.farming.multiple-origins` / `module.farming.multi.map-alternative`.
- Learner attribution/provenance: native map information identifies modern coasts, approximate zones, and the source links; media rights label states “Natural Earth base geography, Public Domain.”
- Alt text and non-visual map summary: stored in the typed media and historical-map module records.
- Visible uncertainty note: stored in the module and exposed through the map information dialog.

## Final review

- [x] The real reference, not generated output, is the geographic source.
- [x] Every required broad region was checked against authoritative evidence.
- [x] Approximate features do not imply exact reconstruction.
- [x] Reference-map rights and runtime-asset rights are recorded separately.
- [x] Research inputs are not present in public runtime directories.
- [x] The complete map remains visible and legible at 1440×900 and 390×844 in light and dark themes; implementation-gate captures are stored under `docs/pr/ash-74/`.
- [x] Media and content validation, the implementation gate, domain/full tests, and the production build pass. Repository-wide typecheck remains red only on the recorded pre-existing legacy and v2 inference baseline.
