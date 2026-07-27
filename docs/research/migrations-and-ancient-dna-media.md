# Migrations, Encounters, and Ancient DNA — generated media lineage

Date: `2026-07-26`
Lesson: `lesson.humans.migrations-and-interbreeding`
Decision owner: product owner kept the canonical lesson title and approved the Neanderthals card. The Denisovans card was subsequently removed.

## Neanderthals Knowledge Card

- Media ID: `media.humans.neanderthals-card`
- Generation tool: OpenAI image generation through Codex
- Generation date: `2026-07-26`
- Accepted master: Codex generated-image archive for this task, `exec-35a721bf-b6d0-4ad2-9ca9-3c0069243bd4.png`
- Runtime source: `public/images/ancient-dna/neanderthals-card-publication-640.png`
- Optimized fallback: `public/images/optimized/ancient-dna/neanderthals-card.optimized.webp`
- Depiction decision: evidence-based reconstruction of an unnamed adult, never a portrait of a known person.
- Complete generation brief: “Create a vertical scientific-educational Knowledge Card illustration of an adult Neanderthal. Show evidence-supported anatomy—a broad midface and nose, pronounced brow ridge, and long low cranium—without caricature or a primitive-versus-modern ladder. The person is dignified and alert in a cool Eurasian rock-shelter setting. Use natural earth pigments, soft museum-quality light, restrained detail, and generous quiet space for native UI outside the image. No text, title, border, icon, DNA helix, UI chrome, weapons, fantasy costume, or modern objects.”
- Accepted because: the facial anatomy is legible at card size, the person is treated with dignity, and no educational copy is baked into the art.

## Removed Denisovans Knowledge Card

- Former media ID: `media.humans.denisovans-card`
- Removal decision: the product owner removed the card rather than award a symbolic or speculative people card.
- Evidence correction: 2025 molecular studies linked the nearly complete Harbin cranium to a Denisovan population. This provides substantial cranial evidence, but one skull still does not establish a representative Denisovan portrait or soft-tissue appearance across diverse Denisovan-related populations.
- Removed runtime files: `public/images/ancient-dna/denisovans-card-publication-640.png` and `public/images/optimized/ancient-dna/denisovans-card.optimized.webp`.
## Inherited-segments raster image edit

- Media ID: `media.humans.inherited-segments-diagram`
- Rejected asset: the manually composed SVG-derived diagram previously stored as `public/images/evidence/inherited-segments-diagram.webp`.
- Rejection reason: abstract capsule geometry and a pedigree-like branch obscured the scientific relationship; it violated the raster-reference image-edit rule.
- Reference figure: Benjamin M. Moran et al., “The genomic consequences of hybridization,” Figure 3, “Conflicting selection between linked alleles,” *eLife* 10:e69016 (2021).
- Canonical article URL: https://elifesciences.org/articles/69016
- Reference raster URL: https://iiif.elifesciences.org/lax/69016%2Felife-69016-fig3-v1.tif/full/full/0/default.jpg
- License: CC BY 4.0; copyright holder Moran et al.; attribution and adaptation lineage retained here.
- Scientific contribution: the reference shows linked ancestry regions being separated by recombination across generations. Its selection-specific symbols, axes, and data plot were not retained.
- Full local reference: `docs/research/references/migrations-ancient-dna/moran-2021-figure-3.jpg` (`sha256:761624acce7206906593f13556bd992fb079d13ef284923f190e8b32ec047931`).
- Transfer-only raster copy: `docs/research/references/migrations-ancient-dna/moran-2021-figure-3-edit-reference.jpg`; resized because the Windows tool bridge rejected the full local path and limited inline image data.
- Generation tool: OpenAI built-in image generation through Codex, reference-image edit mode.
- Generation date: `2026-07-26`.
- Accepted generated master: `exec-f9a3d243-fb12-4f73-a488-77bcc72bb289.png`.
- Runtime source: `public/images/evidence/inherited-segments-diagram.png` (`960 × 549`; `sha256:7acf7bf794274d936c200fe3966b92ab0920ab6a26e70fd592bf222710544a9f`). The full-resolution accepted master remains in the generated-image archive.

Complete image-edit prompt:

```text
Use case: scientific-educational
Asset type: Chronos lesson evidence-panel raster image for learners ages 10–13
Input images: Image 1 is the reviewed CC BY 4.0 scientific reference from Moran et al. (2021), eLife Figure 3. Use it as the required structural reference for the scientific idea that recombination separates linked ancestry regions across generations.
Primary request: Edit the supplied scientific reference into a clear museum-quality educational raster showing how the length of inherited Neanderthal-ancestry segments changes over generations. Preserve only the central scientific relationship: relatively recent inherited ancestry can remain in one long continuous tract, while repeated recombination over many generations leaves the same ancestry distributed as shorter separated tracts.
Scene/backdrop: quiet warm ivory paper-like background with subtle natural texture
Subject: two horizontal, scientifically credible chromosome or haplotype bands arranged as a direct comparison. The upper band contains one long continuous muted-rust ancestry tract embedded within a deep blue-teal surrounding genome. The lower band contains several shorter separated muted-rust ancestry tracts embedded within the same kind of blue-teal band, visibly expressing fragmentation through recombination over time.
Style/medium: polished raster scientific illustration grounded in Image 1's linked-locus and recombination visual language; tactile editorial naturalism; not flat UI geometry and not vector or SVG style
Composition/framing: landscape 8:5 composition, generous margins, direct top-to-bottom comparison, high clarity at mobile size
Color palette: warm ivory, muted mineral rust, deep desaturated blue-teal, restrained charcoal accents
Constraints: no text, title, labels, letters, numbers, percentages, axes, charts, data plots, legend, arrows, family tree, pedigree nodes, DNA double helix, portraits, bones, icons, UI chrome, border, watermark, or logos. Do not imply an exact chromosome, exact generation count, exact individual, or exact family relationship. Do not copy Image 1's exact layout, symbols, or data; transform it into an original Chronos composition while preserving the scientifically supported recombination relationship. Raster illustration only.
Avoid: abstract rounded capsules; branch-and-node doodles; generic infographic styling; decorative swirls; false precision; dense detail; baked-in educational copy.
```

- Accepted because: the edited raster presents one long tract versus several shorter tracts without a pedigree, decorative DNA imagery, exact family claim, text, or false precision. The relationship remains supported by Fu 2015 and Sümer 2024.

## Hero evidence-map raster image edit

- The rejected SVG-producing generator remains deleted and `media.humans.ancient-genome-map` remains retired.
- The map returned under the new stable ID `media.humans.migrations-hero-map` only after the product owner selected the real Sümer et al. Figure 1 reference and requested a graphical raster image edit.
- Full geographic research, exact labels, complete image-edit prompt, rights reasoning, source reference, and accepted output lineage are recorded in `docs/research/migrations-and-ancient-dna-map.md`.
- Runtime source: `public/images/maps/migrations-ancient-genomes-hero.webp`; lossless master: `docs/research/references/migrations-ancient-dna/accepted-masters/migrations-ancient-genomes-hero-master.png`.
- No SVG, manual vector drawing, canvas renderer, or code-generated diagram was used.

## Ancient-DNA clean-room raster image edit

- Media ID: `media.humans.adna-clean-room`.
- Use case: graphical research-process illustration in the lesson’s final section.
- Reference page: https://www.eurekalert.org/multimedia/895013
- Reference credit: Vanessa Villalba; Max Planck Institute of Geoanthropology / EurekAlert.
- Reference permission: “With appropriate credit”; license listed as licensed content.
- Local research copy: `docs/research/references/migrations-ancient-dna/max-planck-adna-clean-room.jpg`.
- Generation tool: OpenAI built-in image generation through Codex, reference-image edit mode.
- Generation date: `2026-07-26`.
- Accepted generated master retained in the Codex generated-image archive: `exec-0ee87feb-83be-4a62-bb14-6df5b4b14bb3.png`.
- Lossless project master: `docs/research/references/migrations-ancient-dna/accepted-masters/ancient-dna-clean-room-master.png`, 1376 × 1143 PNG.
- Runtime publication source: `public/images/evidence/ancient-dna-clean-room-illustration.webp`, 1376 × 1143 quality-96 WebP; optimized fallback: `public/images/optimized/ancient-dna/ancient-dna-clean-room.optimized.webp`.
- Depiction decision: preserve the reference photograph’s researcher, protective clothing, posture, clean-bench sash, pipette stand, green and pink racks, containers, equipment, and camera angle while changing only the visual medium to a calm graphical app illustration.
- No sample identity is asserted. Native lesson text explains contamination control and remains separate from the image.

Complete image-edit prompt:

> Use case: style-transfer
> Asset type: Chronos lesson section illustration about ancient-DNA laboratory work
> Input images: Image 1 is the clean-room photograph and edit target. Preserve its exact subject, equipment, working posture, camera angle, and spatial arrangement.
> Primary request: Redraw the same ancient-DNA clean-room scene in the polished graphical art style of a modern history-learning app for ages 10–13.
> Required scene details to preserve: one researcher occupying the right side in a full white hooded clean suit, protective glasses and pale yellow gloves; the researcher leans toward the work surface and holds the same pipetting tool in the same working position; the transparent clean-bench sash and its reflections; the circular stand of adjustable pipettes on the left; the bright green tube rack in the front-left; the pink tube rack farther back near the researcher; the small containers and laboratory unit visible behind the sash; the same high, slightly leftward camera angle and the same clean, enclosed workspace.
> Style/medium: sophisticated flat graphical raster illustration with subtle painterly texture, crisp app-editorial shapes, restrained scientific realism, museum-quality educational artwork; clearly an illustration, not a photograph and not vector output.
> Composition/framing: preserve the reference composition and visual hierarchy; landscape approximately 3:2 with safe padding for responsive cropping; researcher remains the focal subject on the right and the equipment remains readable on the left.
> Lighting/mood: calm, careful, precise, softly luminous clean-room light.
> Color palette: warm ivory, cream, pale mineral blue, quiet teal shadows, restrained terracotta accents; retain the reference’s green and pink racks for factual visual correspondence.
> Constraints: do not add or remove equipment, people, tubes, racks, instruments, furniture, windows, or architectural elements. Do not invent a visible DNA strand, fossil, skull, bone, dramatic glow, contamination particles, labels, arrows, educational text, title, logo, watermark, or UI chrome. Preserve the real procedure without claiming the exact sample identity. Raster image only; never SVG.

## Review state

- Historical, geographic, and uncertainty review: passed for the hero map source edit.
- Rights and lineage review: passed for the CC BY map reference and the clean-room reference’s credit requirement.
- Content and alt-text review: passed for both new media records.
- Visual and responsive review: pending final in-app screenshots.