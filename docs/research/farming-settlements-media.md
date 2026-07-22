# Farming and Settlements media production note

Date: 2026-07-21  
Lesson: `lesson.farming.settlements`  
Checkpoint: Revision 2 approved by Carlin Aylsworth on 2026-07-21

## Rights and provenance decision

The replacement hero, evidence diagram, and card art are Chronos-original generated works. The generation briefs draw factual constraints from reviewed scholarship and institutional site descriptions; no protected excavation illustration is redistributed or supplied as a style reference. Runtime publication is approved only after the final outputs pass historical-detail, visual, accessibility, and lineage review.

The redesigned locator map is a Chronos-original vector composition grounded in UNESCO World Heritage coordinates, independently checked against the Çatalhöyük Research Project's regional description, and drawn from Natural Earth public-domain land geography. Its map-specific record remains in `docs/research/farming-catalhoyuk-locator-map.md`.

## Shared historical basis

| Source | Contribution | Use limit |
| --- | --- | --- |
| UNESCO, *Neolithic Site of Çatalhöyük* | Dense back-to-back mudbrick houses, roof access, Konya-plain setting, site coordinates | Factual and geographic reference |
| Çatalhöyük Research Project, *Architecture* | Main rooms, roof entry, oven/hearth, platforms, side-room storage, plastered surfaces | Factual reference; project illustrations are not redistributed |
| Bogaard et al. 2009, *Private pantries and celebrated surplus* | Spatial relationship among household storage, plant remains, entrance-area displays, and feasting interpretation | Research citation; article figures are not redistributed |
| Baird et al. 2018, *Agricultural origins on the Anatolian plateau* | Regional chronology and gradual cultivation context | Research citation |

## Rooftop settlement hero

- **Media ID:** `media.farming.catalhoyuk-rooftops`
- **Teaching purpose:** Make wall-to-wall density, roof movement, and the inland setting understandable before the learner reads an abstract explanation.
- **Depiction:** Evidence-based reconstruction.
- **Required details:** adjoining rectilinear mudbrick houses; varied roof levels; roof openings and ladders; plausible plaster, timber, reed, basket, and clay materials; restrained household activity; dry Konya plain beyond.
- **Prohibited:** palace, temple monument, paved streets between houses, domes, crenellated walls, carts, displayed metal tools, modern crops, giant crowd, close portrait faces, burials, text, labels, borders, or UI.
- **Uncertainty handling:** exact people, weather, roof furnishings, colors, and captured moment remain generalized.
- **Composition:** wide 16:9 master with a strong roof-path foreground and center-safe content for the lesson's 2.85:1 desktop crop.
- **Accessible equivalent:** alt text names roof connections, openings, ladders, household activity, and the plain; caption states that the exact scene is reconstructed.
- **Rights decision:** Chronos original; approved pending output review and recorded generation lineage.

## House and storage evidence view

- **Media ID:** `media.farming.catalhoyuk-house-diagram`
- **Teaching purpose:** Let learners inspect the spatial pattern before being told how archaeologists interpret it.
- **Depiction:** Evidence-led axonometric cutaway/diagram.
- **Required details:** one main room; roof opening and ladder; hearth/oven and platforms; side room with several built storage bins; entrance-area animal-display treatment; enough adjoining roof/wall context to explain access.
- **Supported versus reconstructed:** room relationships and bins are evidence-led; exact surface colors, perishables, and moment of use are reconstructed; household identity and ritual meaning are unknown.
- **Prohibited:** modern blueprint symbols, raster labels, museum UI, human remains, a staged feast, fantasy ornament, or unsupported second-storey rooms.
- **Composition:** landscape cutaway with calm museum-diagram material detail and clear visual zones for four native hotspots.
- **Accessible equivalent:** the lesson's hotspot list states each spatial relationship and identifies which conclusion is observation or interpretation.
- **Rights decision:** Chronos original; approved pending output review and recorded generation lineage.

## Çatalhöyük card artwork

- **Media ID:** `media.farming.catalhoyuk-card`
- **Teaching purpose:** Make the settlement itself the durable Place-card memory anchor without reusing an instructional diagram.
- **Depiction:** Evidence-based reconstruction.
- **Required details:** vertical view across roof-connected mudbrick homes; one clear roof opening and ladder; distant Konya plain; restrained, non-heroic household presence.
- **Prohibited:** baked-in card frame, title, class, date, symbols, prose, close portrait, fantasy city scale, palace, or burial imagery.
- **Composition:** 4:5 vertical master with a clear settlement silhouette and safe upper/lower space for application typography outside the artwork.
- **Accessible equivalent:** card alt and detail copy explain that it is a reconstructed settlement view.
- **Rights decision:** Chronos original; approved pending output review and recorded generation lineage.

## Rejected first-preview assets

| Asset | Reason rejected |
| --- | --- |
| First house diagram | Plain rectangles and symbols did not communicate material space or evidence quality; the same image was repeated as hero, evidence, scene, and card art |
| First locator map | Generic blob geometry and weak hierarchy did not meet the historical-atlas or phone-legibility standard |
| Diagram as masthead hero | An instructional plan cannot supply the imaginative orientation expected from a cinematic hero |

## Generation and review log

### Tool and processing

- Generation tool: Cursor `GenerateImage`; underlying model/version was not surfaced by the tool.
- Generation date: 2026-07-21.
- Final source preparation: generated PNG candidates were reviewed at full size, then encoded to WebP quality 94 with Sharp 0.35.3 for the repository media source. The media build preserves a 480-pixel lossless band and a full-size source or ql-v1-qualified band.
- No copyrighted illustration was supplied as an image or style reference. The rejected first-preview Chronos diagram was supplied only to preserve the evidence view's rough room relationship; the generation prompt explicitly replaced its visual treatment.

### Candidate decisions

| Asset | Candidate | Decision and reason |
| --- | --- | --- |
| Rooftop hero | `catalhoyuk-rooftops.png` | Rejected: visually strong, but visible ground-level doors and excessive gaps contradicted the roof-entry, wall-to-wall settlement evidence |
| Rooftop hero | `catalhoyuk-rooftops-v2.png` | Accepted: conjoined roofscape, roof openings, ladders, restrained activity, no street-facing doors or monumental architecture |
| House evidence view | `catalhoyuk-house-evidence.png` | Accepted: the roof opening, main room, hearth/platform zone, side-room bins, and entrance display remain legible as four distinct evidence zones |
| Card artwork | `catalhoyuk-card.png` | Rejected: visible ground-level doors and gaps weakened the place memory and historical constraint |
| Card artwork | `catalhoyuk-card-v2.png` | Accepted: vertical connected roofscape with one strong roof opening, restrained figures, and no baked-in card typography |

### Accepted source files

| Media ID | Repository source | Dimensions | Bytes | SHA-256 |
| --- | --- | ---: | ---: | --- |
| `media.farming.catalhoyuk-rooftops` | `public/images/places/catalhoyuk-rooftops.webp` | 1536×1024 | 620,850 | `c52eaad1eb2b56f529be69d0e2886f44c256ffb8703ed4ddd6ec307722704a41` |
| `media.farming.catalhoyuk-house-diagram` | `public/images/places/catalhoyuk-house-diagram.webp` | 1536×1024 | 628,674 | `b9fe369a8ccca1aec4c30e6397ba7a585872a57becc276a3b256d8ce4e9cff56` |
| `media.farming.catalhoyuk-card` | `public/images/places/catalhoyuk-card.webp` | 1024×1536 | 473,708 | `d4cb2755344d8da4dac40b0726298b798c4e5eaf8f4cb7158c88f892fcf6c9d1` |

### Review

- Automated historical-detail screening: passed for required architecture, materials, composition, and prohibited-anachronism list after rejecting the first hero/card candidates.
- Visual-quality screening: passed at source size and expected hero/card crops.
- Accessibility treatment: alt text and explicit reconstruction labels authored in the lesson module.
- Rights decision: approved as Chronos-original generated artwork with recorded brief, prompt constraints, date, candidate decisions, and repository checksums.
- Human historical/visual sign-off: Carlin Aylsworth approved the rebuilt lesson and all four final visual treatments on 2026-07-21 after reviewing the generated outputs and responsive in-app captures.
- Responsive review: passed at 1440×900, 1024×768, 390×844, and 360×800 in light and dark themes, including hero crops, phone-size map labels, map disclosure, evidence hotspots, decoded media, and horizontal-overflow checks. Captures are preserved in `docs/pr/ash-70/`.

No generated asset is direct evidence. Learner-facing uses retain an explicit depiction label, and the house cutaway is described as an evidence-led diagram rather than a surviving view.
