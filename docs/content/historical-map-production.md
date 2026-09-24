# Historical lesson map production runbook

Use this runbook for every lesson map, including compact opening locators. The standard presentation is a lively, legible historical atlas map anchored in a real, rights-cleared geographic source or reviewed geographic data. The approved visual reference is the [Akkad locator](../../public/images/akkad/akkad-locator.jpg): warm golden terrain, clear blue water and rivers, terracotta site markers, strong label contrast, and a restrained paper-and-relief texture. Use its visual energy and hierarchy as the default, adapting the palette to the subject and teaching purpose. Geographic truth comes from the sources, never from the style reference or generation. A deterministic recolor/render or a faithful illustrated edit can produce the final map; choose the method that best preserves reviewed geography and remains readable at lesson size.

This standard applies to new and revised maps throughout Chronos. Existing maps require an explicit retrofit scope; recording the standard does not mean the older catalogue has been restyled. Direct inspection of a historical map as an evidence object remains an evidence module using the original, not a restyled locator.

This workflow applies the visual-brief, provenance, rights, review, and publication requirements in the Chronos PRD to the specific work of producing a historical lesson map.

## Required outputs

Every historical lesson map produces:

- a map brief tied to a specific lesson claim;
- one primary geographic reference plus at least one independent cross-check;
- a research note under `docs/research/` based on the [historical map research-note template](../research/templates/historical-map-research-note.md);
- a preserved high-quality master and an optimized runtime derivative;
- stable source, media, and lesson-module records;
- learner-facing context that distinguishes verified locations from approximate or reconstructed geography.

Reference maps and research crops are research inputs. Do not place them in public runtime directories unless Chronos has separately verified redistribution rights and intends to publish them.

## 1. Define the teaching purpose

Start with the spatial idea the learner should understand. Keep the map bounded to that purpose instead of asking for a general map of an entire civilization.

### Orientation before local detail

The learner must be able to answer **“Where in the world is this, relative to something I recognize?”** before comparing unfamiliar sites. Correct dots in an anonymous crop fail this requirement.

Build a visible chain from **world or continent → recognizable region → lesson places**. Use a wider extent, a clearly linked locator inset, or paired context/detail maps. Include at least one recognizable continental/coastal shape and a named geographic anchor; a previously studied place can strengthen the connection but must not be the only anchor. An unfamiliar sea name, country names only in metadata, or three local site labels are insufficient.

Choose enough surrounding geography to recognize the place. A close crop may clarify a river corridor but still need a wider locator. Inset outlines must match the main map's actual geographic extent; distinguish a view rectangle from territorial boundaries. Do not assume that “north of Harappa” helps someone who cannot locate Harappa.

Write one or two plain native sentences beside the map that make the same connection. For example: “These cities were in South Asia, in present-day Pakistan and northwestern India. The inset places this region east of Africa, on the northern side of the Indian Ocean.” Modern names can help orientation when labeled as modern; do not impose modern borders on an ancient state.

Review at the actual embedded size. Core orientation cannot depend on opening a modal, hover, source details, or reading alt text. If an inset or label becomes unreadable, increase the available width, simplify the labels, or separate the context and detail views. Enlargement is for closer inspection, not for discovering which continent the lesson occupies.

Record:

- lesson ID and intended module ID;
- period and geographic extent;
- focus place or route;
- the relationships the map must make obvious;
- required locations and geographic features;
- which labels or short spatial annotations must appear;
- expected desktop and mobile presentation.
- wider-world anchor and the visible context-to-detail chain;
- exact native orientation sentence and where it appears;
- the unfamiliar geography the learner is not expected to know already.

## 2. Research the geography

Find a trustworthy real map or documented geographic dataset that can serve as the primary geographic reference. Assess methods, scale, period, precision and claim fit; institutional status alone is insufficient. Useful sources include:

1. UNESCO or another official heritage body;
2. archaeological institutes and excavation publications;
3. museums, archives, and university publications;
4. peer-reviewed articles and scholarly historical atlases;
5. clearly licensed public-domain or permissively licensed maps.

Use at least one independent source to cross-check the primary reference. A generated map, search-result thumbnail, unsourced blog image, or modern web map without historical interpretation is not a valid historical source.

For every reference, record the canonical URL, publisher or author, date when available, license or reference-only status, and the geographic fact it contributes. Copyrighted scholarship may be consulted for non-expressive geographic facts, but its map must not be redistributed or closely copied unless the license permits that use.

## 3. Separate verified and approximate features

Before rendering, classify each important feature:

- **Coordinate-verified:** known sites or modern reference points with authoritative coordinates.
- **Source-supported:** broadly agreed relationships or landforms shown consistently across suitable references.
- **Approximate:** reconstructed rivers, roads, wetlands, coastlines, territorial extents, or other features that changed or remain disputed.
- **Omitted:** details for which the sources are too weak or contradictory to support a useful depiction.

Use authoritative coordinates to check relative placement when they are available. Coordinates guide the composition; they do not make every surrounding historical feature exact.

When suitable sources disagree, record the disagreement and use a deliberately approximate treatment. Do not silently select one speculative reconstruction and present it as settled fact.

## 4. Select a method and prepare the brief

Prepare the real geographic source before styling. Use a licensed map or render reviewed geographic data into a reference image with the intended crop, terrain, labels, site markers, and context inset. Keep source data/version, coordinate system and any projection/generalization decisions with the brief; do not invent coordinates to fill gaps. Supply an actual relief reference when terrain is requested: mountains and river valleys are geography, not decoration. A compact locator may use a broad approximate region instead of a falsely precise point. Modern coastlines are modern orientation, not a claim about prehistoric geography.

For timelines paired with maps, retain authored chronology and units. Show meaningful overlap only when intervals support it; avoid converting deep-time or approximate dates into exact events. Use an explicitly schematic scale when a linear scale would make recent events unreadable, with an equivalent textual chronology. Do not combine different date conventions silently.

Record transformation/code paths and a rendered reference/data view for deterministic fidelity review. Use the same geographic, rights, label, accessibility and reference-versus-final checks as for raster output. If the current media pipeline requires raster, export a raster derivative; vector sources and accessible native UI are permitted.

### Visual treatment and illustrated edit brief

Use the Akkad locator as the approved visual benchmark, not as a geographic source. Its color gives the map energy for young learners while the blue waterways, terracotta markers, pale label outlines, and clear wider-world inset keep the spatial lesson easy to follow. Preserve enough light/dark contrast to distinguish land, water, relief, markers, and text at the actual embedded size. Add texture and color without inventing terrain, obscuring a river, implying an unsupported border, or turning a locator into a game map. The [Akkad geographic reference](../research/assets/akkad/map/akkad-geographic-reference.png) and [rendering script](../../scripts/media/akkad-map-reference.mjs) show one accepted deterministic treatment; they are examples, not geographic inputs for another lesson or a palette to copy mechanically.

For a deterministic final, retain the reviewed geometry and labels through the color/texture transformation and compare source and final side by side. For an image-generated edit, provide the prepared geographic source image as the edit target and the Akkad locator as a separately identified style reference. Lock the crop, projection, coastline, relief placement, river paths, marker positions, inset extent, and label associations. Generation changes the visual treatment, not the researched geography; a style reference never supplies missing geographic facts. If a chosen method cannot meet those constraints, switch methods and record why.

When using image generation, use this prompt structure:

```text
Create a single historical map illustration for a Chronos lesson.

LESSON AND PURPOSE:
- Subject: [specific place, route, landscape, or event]
- Period: [narrow date or range]
- Teaching goal: [spatial relationship the learner should understand]
- Wider-world anchor: [recognizable geography and context-to-detail relationship]

GEOGRAPHIC REFERENCE:
- Treat the attached real map as the geographic source.
- Preserve its crop, projection, coastlines, terrain placement, river paths, site markers, and context inset.
- Do not use the reference's graphic style unless separately permitted.

VERIFIED FEATURES:
- [coordinate-verified locations]
- [source-supported landforms or relationships]

APPROXIMATE FEATURES:
- [changing river channels, wetlands, coastlines, routes, or boundaries]
- Render these softly or schematically; do not imply surveyed precision.

REQUIRED LABELS:
- [complete, verified list with exact spelling]

CHRONOS STYLE:
- warm golden or parchment-toned land, with clear blue water and rivers;
- purposeful ochre, blue-green, and terracotta accents with enough contrast to read at lesson size;
- restrained paper and source-faithful topographic texture;
- use the approved Akkad locator as a style reference only;
- elegant editorial historical-atlas character;
- calm, clear, and approachable for ages 11-15;
- simple composition with generous negative space.

DO NOT ADD:
- invented settlements, rivers, roads, borders, ruins, landmarks, or symbols;
- modern national borders unless the lesson explicitly requires modern context;
- fantasy, tactical-game, satellite, or generic GIS styling;
- a decorative compass, generated legend, title, date, paragraph, logo, watermark, or UI chrome;
- any word or annotation not listed under REQUIRED LABELS.

OUTPUT:
- one complete label-ready or verified-label raster map;
- sufficient resolution for the intended desktop display and mobile scaling;
- no cropping of required geography.
```

Short source-verified geographic labels and concise spatial annotations may be generated into a historical map only when the brief lists their exact wording. They require manual spelling and placement review. Educational prose, titles, captions, provenance, uncertainty explanations, legends, and application UI remain native application content.

If generated labeling cannot be made reliable, generate a label-free base and render the labels as accessible application text. Do not accept plausible-looking misspellings or misplaced labels.

## 5. Produce and review

Preserve tool/code/data versions, date, transformations, input reference URLs/identities, and output candidates. For generation also retain model and complete prompt. Compare reviewed reference/data and final together; inspect geometry and labels independently of visual polish.

Reject any draft that:

- changes the verified relative placement of sites;
- invents or removes important geographic features;
- resolves an uncertain feature with unsupported precision;
- contains an unrequested or misspelled label;
- copies protected expressive details from a reference map;
- becomes noisy, game-like, photorealistic, or difficult to read at lesson size.
- leaves the learner unable to place the subject relative to recognizable wider geography;
- makes the locator rectangle look like a civilization's territory;
- invents terrain or secondary waterways to make the illustration look richer.

Record rejected drafts and the reason for rejection in the research note. Historical review must check geography and labels; visual review must check clarity, hierarchy, and fit with the lesson design.

## 6. Preserve and publish the asset

Keep the highest-quality accepted output as the canonical master. Give the runtime derivative a descriptive stable filename and connect it to a stable media ID. Store the master and runtime derivative according to the repository's current media conventions, and preserve checksums, review status, optimization settings, and rollback information where the media model supports them.

Do not silently overwrite an approved map. A correction preserves the stable authored media ID while updating the reviewed asset lineage and runtime derivative deliberately.

## 7. Author the lesson module

The lesson content should record:

- stable module, media, and source IDs;
- title, eyebrow, body, period, focus place, and modern context;
- meaningful alt text and a non-visual summary of the spatial lesson;
- depiction or reconstruction status;
- source and provenance context;
- a visible uncertainty note;
- any legend or explanatory text the learner needs.

The learner must still understand the map's main point if the image is unavailable. Do not rely on spatial position, color, or raster labels as the only accessible expression of meaning.

## 8. Verify the result

Inspect the real lesson, not only the source image.

- Confirm the complete map is visible without `object-fit: cover` cropping.
- Check that the focus place is visually obvious and every required label remains legible.
- Without opening the viewer, identify the continent/recognizable region and explain where the lesson sites fit. Record the actual visible anchors and native sentence; “accurate coordinates” alone is not a pass.
- Compare the result with the Akkad visual reference for energy, hierarchy, contrast, and restrained terrain treatment, and with the geographic source independently for fidelity. Neither aesthetic success nor geographic accuracy compensates for failed orientation.
- Verify desktop, tablet, and narrow mobile widths in light and dark themes.
- Confirm no horizontal scrolling, overlap, missing asset, decode failure, or console error.
- Check that captions and uncertainty language remain visible and concise.
- Run `npm run validate:content`, the relevant tests, type checking, and the production build as applicable to the change. Run any media-build or publication checks available on the branch.

The final handoff lists references, master and runtime paths, changed records, validation results, screenshots, unresolved historical uncertainty, and any remaining design concern.
