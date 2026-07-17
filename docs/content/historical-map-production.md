# Historical lesson map production runbook

Use this runbook when a lesson needs a designed historical map rather than a modern interactive map. The finished result may be a Chronos-original raster illustration, but its geography must come from real, documented references.

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

Record:

- lesson ID and intended module ID;
- period and geographic extent;
- focus place or route;
- the relationships the map must make obvious;
- required locations and geographic features;
- which labels or short spatial annotations must appear;
- expected desktop and mobile presentation.

## 2. Research the geography

Find a trustworthy real map that can serve as the primary geographic reference. Prefer, in order:

1. UNESCO or another official heritage body;
2. archaeological institutes and excavation publications;
3. museums, archives, and university publications;
4. peer-reviewed articles and scholarly historical atlases;
5. clearly licensed public-domain or permissively licensed maps.

Use at least one independent source to cross-check the primary reference. A generated map, search-result thumbnail, unsourced blog image, or modern web map without historical interpretation is not a valid historical source.

For every reference, record the canonical URL, publisher or author, date when available, license or reference-only status, and the geographic fact it contributes. Copyrighted scholarship may be consulted for non-expressive geographic facts, but its map must not be redistributed or closely copied unless the license permits that use.

## 3. Separate verified and approximate features

Before generation, classify each important feature:

- **Coordinate-verified:** known sites or modern reference points with authoritative coordinates.
- **Source-supported:** broadly agreed relationships or landforms shown consistently across suitable references.
- **Approximate:** reconstructed rivers, roads, wetlands, coastlines, territorial extents, or other features that changed or remain disputed.
- **Omitted:** details for which the sources are too weak or contradictory to support a useful depiction.

Use authoritative coordinates to check relative placement when they are available. Coordinates guide the composition; they do not make every surrounding historical feature exact.

When suitable sources disagree, record the disagreement and use a deliberately approximate treatment. Do not silently select one speculative reconstruction and present it as settled fact.

## 4. Prepare the generation brief

Image generation changes the visual treatment, not the researched geography. Provide the selected map reference image to the generation tool and make the verified relationships explicit in the prompt.

Use this prompt structure:

```text
Create a single historical map illustration for a Chronos lesson.

LESSON AND PURPOSE:
- Subject: [specific place, route, landscape, or event]
- Period: [narrow date or range]
- Teaching goal: [spatial relationship the learner should understand]

GEOGRAPHIC REFERENCE:
- Treat the attached real map as the geographic source.
- Preserve its relative placement, orientation, and broad land/water relationships.
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
- warm parchment or ivory ground;
- restrained ochre, sand, mineral blue, blue-green, and terracotta;
- subtle paper and topographic texture;
- elegant editorial historical-atlas character;
- calm, clear, and approachable for ages 10-14;
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

## 5. Generate and review

Preserve the generation tool, model or version when available, date, complete prompt, input reference URLs, reference file identities, and output candidates.

Reject any draft that:

- changes the verified relative placement of sites;
- invents or removes important geographic features;
- resolves an uncertain feature with unsupported precision;
- contains an unrequested or misspelled label;
- copies protected expressive details from a reference map;
- becomes noisy, game-like, photorealistic, or difficult to read at lesson size.

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
- Verify desktop, tablet, and narrow mobile widths in light and dark themes.
- Confirm no horizontal scrolling, overlap, missing asset, decode failure, or console error.
- Check that captions and uncertainty language remain visible and concise.
- Run `npm run validate:content`, the relevant tests, type checking, and the production build as applicable to the change. Run any media-build or publication checks available on the branch.

The final handoff lists references, master and runtime paths, changed records, validation results, screenshots, unresolved historical uncertainty, and any remaining design concern.
