# Uruk southern Mesopotamia map research note

Date: 2026-07-14
Runtime media ID: `media.uruk.southern-mesopotamia-map`
Module ID: `module.uruk.southern-mesopotamia-map`

This note is the Uruk instance of the reusable [historical lesson map production runbook](../content/historical-map-production.md). New maps should start from the [historical map research-note template](templates/historical-map-research-note.md).

## Selected geographic reference

The primary composition reference is Figure 28.1, “Southern Mesopotamia,” in Jason Ur’s chapter “Southern Mesopotamia,” in *A Companion to the Archaeology of the Ancient Near East* (D. T. Potts, ed., Blackwell, 2012):

- URL: https://people.bu.edu/chamley/HSFref/Ur2012CompanionArchANE.pdf
- Publisher/host context: Blackwell Publishing; PDF copy hosted on a Boston University faculty site.
- Use status: copyrighted scholarly publication. It was used as a non-distributed geographic and compositional reference only. The reference map is not shipped in the application.
- Contribution: the relative placement of Uruk, Ur, and Eridu; the southern alluvial plain; broad Tigris and Euphrates orientation; higher Zagros ground to the northeast/east; and an explicitly ambiguous “Ancient Gulf or Marsh” zone.
- Important limitation: its caption identifies the drawn watercourses as modern. It is not an exact map of channels in 3200 BCE.

## Cross-checks

### UNESCO World Heritage Centre — The Ahwar of Southern Iraq

- Property page: https://whc.unesco.org/en/list/1481/
- Maps and geographical data: https://whc.unesco.org/en/list/1481/maps/
- Publisher: UNESCO World Heritage Centre. Nomination maps were supplied by the State Party.
- License/use status: the property description is available under CC-BY-SA IGO 3.0. The public geographical table and nomination maps were used as official coordinate and regional-context references.
- Contribution: confirms that Uruk, Ur, and Tell Eridu formed in the marshy Tigris-Euphrates delta landscape; identifies the interaction of alluvial plain, Zagros uplift, hydrology, sea-level change, and wetlands; and cautions that sea and marsh extent changed over time.
- Coordinate check:
  - Uruk: `31.324167, 45.637222`
  - Ur: `30.963056, 46.103056`
  - Eridu: `30.816944, 45.995833`

### ArchAtlas — Uruk and Ur

- URL: https://www.archatlas.org/atlas/visualisations/sitesfromsatellites/urukur/
- Publisher/author: ArchAtlas, Andrew Sherratt (2004); underlying Landsat imagery credited to NASA.
- Use status: cited scholarly web reference; imagery was inspected as research and is not redistributed.
- Contribution: confirms that the major fourth- and third-millennium waterways crossed the now-dry central alluvial fan; gives site coordinates close to the UNESCO values; and explains that present river courses are not the ancient courses.

## Uncertainty and editorial boundary

- The three city locations are the most defensible spatial features because they are tied to UNESCO World Heritage coordinates.
- River lines in the artwork show the broad Tigris-Euphrates system and wetland relationship, not surveyed channels for a single year.
- The “Ancient Persian Gulf” label identifies regional context. The displayed coastline/wetland margin is deliberately approximate because scholarship differs on the timing and extent of Holocene marine incursion, marsh formation, delta progradation, and channel migration.
- The artwork must not be described as an exact reconstruction of 3200 BCE. Editorial review should confirm whether “Ancient Persian Gulf” or “Gulf and marsh zone” is the clearest final learner-facing wording.

## Generated artwork lineage

- Generation method: built-in image generation, reference-based raster generation.
- Geographic reference input: local crop of Figure 28.1 kept outside runtime assets.
- Style reference input: the supplied Chronos lesson mockup (`ChatGPT Image Jul 13, 2026, 10_48_17 PM2.png`), used only for line weight, palette, simplicity, and map-panel character.
- Final master: `assets/generated/uruk-southern-mesopotamia-map-master.png`
- Optimized runtime derivative: `public/images/maps/uruk-southern-mesopotamia-map.webp`
- Depiction status: illustrative reconstruction.
- Prompt intent: preserve the real reference’s spatial relationships while transforming the visual treatment into the mockup’s simple ivory line-art map: two obvious mineral-blue rivers, sparse ochre relief, a pale Gulf/wetland wash, and generous negative space. A final reference-based generation baked in the verified labels for Uruk, Ur, Eridu, Tigris, Euphrates, Zagros Mountains, the Ancient Persian Gulf, and the approximate ancient coastline. The runtime renders this finished raster directly, without HTML overlays.
- Rejected draft: the first generated variant introduced an unsupported western water body. It was not used.
