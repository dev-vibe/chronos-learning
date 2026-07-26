# Çatalhöyük locator map research note

Date: 2026-07-21
Lesson ID: `lesson.farming.settlements`
Module ID: `module.farming.catalhoyuk-locator-map`
Runtime media ID: `media.farming.catalhoyuk-locator-map`
Rights decision: `approved`
Depiction status: `illustrative-reconstruction`

## Map purpose

- Period and geographic extent: Neolithic / early farming settlement context before about 3500 BCE; southern Anatolian Plateau and surrounding seas for orientation.
- Focus place: Çatalhöyük on the Konya plain, central Anatolia.
- Spatial relationship the learner should understand: this Southwest Asian case sits inland on the Konya plain of the Anatolian Plateau—not on the southern Mesopotamian plain of Uruk, and not as a labeled “cradle of farming for all humans.”
- Required labels or annotations: `Çatalhöyük`, `Konya Plain`, `Anatolian Plateau`, `Mediterranean Sea`, `Black Sea`.

## Selected geographic reference

- Title or figure: UNESCO World Heritage Centre — Neolithic Site of Çatalhöyük (property description and maps/geographical data).
- Canonical URL: https://whc.unesco.org/en/list/1405/ and https://whc.unesco.org/en/list/1405/maps/
- Publisher or author: UNESCO World Heritage Centre; State Party geographical data.
- Publication date: inscription 2012; geographical table consulted 2026-07-21.
- License or permitted reference status: property description under CC-BY-SA IGO 3.0; coordinates and regional framing used as official reference. Nomination maps are not redistributed in Chronos runtime.
- Geographic contribution: places Çatalhöyük on the Southern Anatolian Plateau / Konya plain; official coordinates N37 40 0 / E32 49 41 (37.667, 32.828).
- Important limitations: UNESCO synthesis is not a detailed paleoenvironmental reconstruction of Çarşamba River channels or mountain names required for this locator.
- Local research-copy location: none required beyond this note.

This is the primary **site placement** reference because it supplies authoritative World Heritage coordinates and plain/plateau framing.

## Independent cross-checks

### Çatalhöyük Research Project / management plan geography

- Title: Çatalhöyük Site Management Plan (English) and Architecture / site outreach pages.
- Canonical URL: http://www.catalhoyuk.com/sites/default/files/Catal_SMP_EN_Revised.pdf ; http://www.catalhoyuk.com/site/architecture
- Publisher or author: Çatalhöyük Research Project / Ministry of Culture and Tourism partners.
- License or permitted reference status: project outreach; illustrations not redistributed.
- Geographic contribution: confirms location ~60 km southeast of Konya, on the Konya plain / Çarşamba alluvial fan; East and West mounds.
- Agreement or disagreement with the primary reference: agrees on plain/plateau placement; adds local river-fan detail not drawn as surveyed channels on the lesson map.

### Natural Earth (coast and landmass orientation)

- Title: Natural Earth physical/cultural vectors (1:50m class).
- Canonical URL: https://www.naturalearthdata.com/
- Publisher or author: Natural Earth.
- License or permitted reference status: Public Domain.
- Geographic contribution: Anatolian landmass outline relative to the Mediterranean and Black Sea for learner orientation.
- Agreement or disagreement with the primary reference: supplies modern coastlines for orientation only; not a Neolithic shoreline reconstruction.

## Coordinate checks

| Location | Latitude | Longitude | Authority | Result |
| --- | ---: | ---: | --- | --- |
| Çatalhöyük | 37.667 | 32.828 | UNESCO WHC geographical data / maps page | Marker placed inland on the Konya plain relative to Mediterranean (south) and Black Sea (north) |

Coordinates guide relative inland placement. They do not make mountain ranges, river courses, or Holocene shorelines exact.

## Confidence and uncertainty boundary

### Coordinate-verified

- Çatalhöyük site location (UNESCO).

### Source-supported

- Konya plain / Southern Anatolian Plateau setting (UNESCO; CRP).
- Inland position between Mediterranean and Black Sea (Natural Earth orientation + UNESCO plain framing).

### Approximate

- Schematic plateau and plain washes; no surveyed Çarşamba channels.
- Coastlines shown for modern orientation, not Neolithic shorelines.

### Omitted

- Jericho / Levant labels (optional in the lesson packet; omitted here to avoid a single-cradle arrow story).
- Modern national borders, roads, and city names other than the teaching labels.
- Farming-origin arrows, migration routes, or “Fertile Crescent” polygons.

## Generated artwork lineage

- Generation tool: reproducible Chronos-authored vector script, `scripts/media/generate-catalhoyuk-map.mjs`, rasterized with Sharp 0.35.3 for runtime delivery.
- Model or version: n/a (deterministic vector composition, not generated geography).
- Generation date: 2026-07-21; Revision 2 visual correction on the same date.
- Geographic reference inputs: UNESCO coordinates; Natural Earth 1:50m public-domain land GeoJSON fetched by the script; Çatalhöyük Research Project regional cross-check.
- Style references: Chronos historical-map palette (warm parchment, restrained ochre/mineral blue) matching the design system without copying a protected map composition.
- Reproducible vector output: `tmp/catalhoyuk-locator-map-v2.svg` (ignored build artifact generated from the committed script).
- Accepted media source: `public/images/maps/catalhoyuk-locator-map.webp`.
- Optimized runtime path: `/images/optimized/farming/catalhoyuk-locator-map.optimized.webp` via media pipeline.
- Required labels and exact spelling: Çatalhöyük; Konya Plain; Anatolian Plateau; Mediterranean Sea; Black Sea.
- Accepted source dimensions/checksum: 1732×980; 67,976 bytes; SHA-256 `a1ae0b2e4bd6aee114ae6a14ed537a67c80d8d201095066edfd11e94d9c24a79` before the ql-v1 media build.
- Rejected first-preview map: generic blob geometry and weak label hierarchy did not meet the authoritative-reference or phone-legibility standard.

### Revision 2 visual correction

Revision 2 replaces the hand-shaped Anatolia blob with land geometry projected from Natural Earth 1:50m data. The script places Çatalhöyük from UNESCO coordinates, uses restrained schematic plateau/plain washes only as orientation, and draws no modern political borders, origin arrows, invented rivers, roads, or settlements. Manual review confirmed the five allowed labels, inland site placement, sea relationships, and complete-frame visibility. The map remains a locator, not a Neolithic shoreline or river-channel reconstruction.

## Learner-facing wording

- Compact label: Illustrative map · modern coasts for orientation
- Coordinate note: Çatalhöyük is placed using UNESCO World Heritage coordinates.
- Uncertainty note: Coastlines and plateau washes orient the learner; they are not a reconstruction of Neolithic shorelines or river channels.
- Accessible summary: Çatalhöyük sits inland on the Konya plain of the Anatolian Plateau, between the Mediterranean Sea to the south and the Black Sea to the north. The map places this Southwest Asian settlement case; it does not show a worldwide origin of farming.
