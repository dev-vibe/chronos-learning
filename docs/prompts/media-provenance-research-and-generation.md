# Agent prompt: research or generate publishable lesson media

Use this prompt before adding any historical image to the Chronos public media bucket.

## Objective

Find or create an image that is historically suitable, publicly redistributable, clearly attributed, and reproducible. The product owner is not expected to interpret copyright terms. Gather the evidence, apply the policy below, and escalate only a genuinely ambiguous legal edge case.

## Instructions

1. Read AGENTS.md, the product and design invariants, ADR 003, ADR 004, and the media publishing runbook.
2. Inspect the intended lesson claim, depiction mode, alt text, and visual brief before searching. For a historical map, also follow the additional map requirements below.
3. Prefer sources in this order:
   - Chronos-original or newly generated artwork with complete generation lineage;
   - explicit public-domain or CC0 media from an authoritative collection;
   - explicit CC BY or CC BY-SA media with complete attribution;
   - another source only if its authoritative asset page grants redistribution and derivative rights in unambiguous language.
4. Use the authoritative asset/object page as evidence. A search result, hotlink, article-level copyright notice, or general educational-use statement is not sufficient.
5. Record:
   - canonical asset URL and direct origin page;
   - creator or photographer and rights holder, when known;
   - exact license name and authoritative license URL;
   - required attribution;
   - accession/object identifier for evidence photography;
   - access date;
   - factual/historical references used to assess the depiction;
   - whether cropping, compression, recoloring, or other derivatives are allowed.
6. Apply the publication policy:
   - Recommend approval when the authoritative evidence explicitly establishes public domain, CC0, CC BY, CC BY-SA, or Chronos ownership with documented generation lineage.
   - Do not recommend approval for unknown origin, all-rights-reserved media, fair-use assumptions, educational-use-only language, hotlinks, watermarked assets, or licenses containing NC or ND restrictions.
   - If the rights are unclear, prefer a clearly licensed replacement or generate new artwork. Do not ask an unqualified product owner to guess.
7. For generated artwork:
   - research the factual composition using at least two suitable references;
   - use copyrighted references only for non-expressive facts, not as an image-to-image style or composition source;
   - save the generation tool, model when available, date, complete prompt, reference URLs, rejected drafts, and final master path;
   - prohibit baked-in educational prose, titles, logos, watermarks, and UI chrome;
   - label reconstruction, uncertainty, and approximate geography explicitly;
   - visually inspect the final image for anachronisms and unsupported details.
   - when the reference already supplies the approved scientific or explanatory composition, use a **style-only transformation**: lock its canvas ratio, panel order, object positions/orientations/proportions, actions, callouts, short source-verified labels, and evidence-bearing details; change only the rendering style. Reject any candidate that omits, adds, moves, mirrors, rescales, relabels, or reinterprets a locked element, or makes comparison subjects visually indistinguishable at their actual desktop or mobile lesson size.
   - use an adapted composition only when its changed relationship is documented and explicitly approved by the product owner; visual polish is never grounds for silently redesigning a reference.
   - complete the lesson research note's top-level `## Image lifecycle` block: visibly embed the actual reference and accepted final together, preserve the complete prompt verbatim, and record a comparison verdict. Do not make a reviewer infer this chain from paths or prose alone.

### Additional requirements for historical maps

- Select one authoritative real map as the primary geographic reference and use at least one independent cross-check. Generated output is never a geographic source.
- Prefer UNESCO and other official heritage bodies, archaeological institutes, museums, universities, peer-reviewed publications, scholarly atlases, and clearly licensed maps.
- Record what each reference contributes, its license or reference-only status, and where suitable sources disagree.
- Coordinate-check known locations against an authoritative source when coordinates are available.
- Classify important features as coordinate-verified, source-supported, approximate, or omitted. Never present changing rivers, wetlands, coastlines, routes, or boundaries as exact without evidence.
- Treat image generation as a stylistic transformation of researched geography. Do not invent settlements, waterways, borders, ruins, roads, or landmarks.
- Short geographic labels or concise spatial annotations may appear in the raster only when the reviewed brief provides their exact wording. Manually verify spelling and placement; keep prose, captions, provenance, and uncertainty explanations in application content.
- Preserve research maps outside runtime asset directories unless their redistribution rights and intended publication are separately approved.

8. Write a research note under docs/research/ with:
   - Rights decision: approved, replacement-required, or legal-review-required;
   - concise rationale;
   - complete evidence links and attribution string;
   - historical suitability and uncertainty notes;
   - generation lineage when applicable;
   - canonical source and final runtime paths.
   - the required rendered image lifecycle comparison for every accepted image, using the canonical lesson-production authoring template.
9. Only after an approved decision:
   - add or update the Source and MediaAsset records, including a concise learner-facing `rightsLabel`;
   - change the internal `MediaAsset.reviewStatus` publication gate to approved; never render that workflow value as learner-facing historical/editorial approval;
   - run media:add when the catalog entry is new;
   - run media:build, media:verify, validate:content, and tests;
   - publish with the trusted server-side credential and verify remote checksums.
10. If blocked, report the precise missing evidence and offer one or more clearly licensed/generated replacements. Never weaken the publisher gate.

## Required response

Return a compact table with asset, origin, creator, license, attribution, historical suitability, rights decision, and evidence links. Link directly to the research note's `## Image lifecycle` section, state the reference-versus-final comparison verdict, and state exactly which repository records were changed and which assets remain blocked.
