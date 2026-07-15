# Uruk media provenance review

Date: 2026-07-15
Decision owner: Chronos automated media-research workflow

## Outcome

The previously imported reconstruction, site photograph, and clay-envelope files have no creator, origin, license, or embedded-rights record. Git history only records the commits that introduced the binary files. They are retained as unapproved repository history and are no longer the canonical sources for the Uruk lesson.

Three Chronos-original generated illustrations replace them. The final generated files have no input-image references, no baked text, no watermark, and no UI chrome. They are explicitly labeled as reconstructions or illustrative context, never as direct photographs or a specific surviving object.

| Media ID | Canonical master | Rights decision | Historical boundary |
| --- | --- | --- | --- |
| media.uruk.reconstruction | assets/generated/uruk-reconstruction-researched-20260715.png | approved | evidence-based reconstruction, not a surviving view |
| media.uruk.site | assets/generated/uruk-site-context-researched-20260715.png | approved | illustrative modern archaeological context, not a documentary photograph |
| media.uruk.clay-envelope | assets/generated/uruk-clay-envelope-researched-20260715.png | approved | illustrative reconstruction based on surviving accounting envelopes, not a specific photographed object |
| media.uruk.southern-mesopotamia-map | assets/generated/uruk-southern-mesopotamia-map-master.png | approved | illustrative historical map; waterways and shoreline remain approximate |

## Rights and factual references

The historical sources are used for factual research only; none of their image pixels are distributed in the generated replacements.

- The Met Uruk overview: https://www.metmuseum.org/toah/hd/uruk/hd_uruk.htm
- UNESCO, The Ahwar of Southern Iraq: https://whc.unesco.org/en/list/1481/
- UNESCO maps and geographical data: https://whc.unesco.org/en/list/1481/maps/
- Wikimedia Commons, Uruk archaeological site at Warka: https://commons.wikimedia.org/wiki/File:Uruk_Archaeological_site_at_Warka.jpg . This is an OGL v1.0 photo by SAC Andy Holmes (RAF)/MOD. It was found as a clean replacement candidate, but its binary could not be downloaded from this environment because Wikimedia returned HTTP 429.
- Wikimedia Commons, accountancy clay envelope, Louvre Sb 1932: https://commons.wikimedia.org/wiki/File:Accountancy_clay_envelope_Louvre_Sb1932.jpg . The photograph is CC BY 2.5 by Marie-Lan Nguyen; attribution would be required if the photograph is used directly. It informed the generic object category only and is not redistributed.

## Generation lineage

Tool: built-in image generation
Date: 2026-07-15
Rights holder: Chronos

### Reconstruction

Purpose: wide Uruk lesson hero.

Prompt constraints: aerial view of Uruk around 3200 BCE; dense mudbrick neighborhoods, monumental precinct, waterways, cultivated fields, and alluvial plain. Avoid readable text, labels, later ziggurats, modern structures, stone monuments, and claims of exact survey accuracy.

### Archaeological context

Purpose: show how an archaeological site differs from a reconstructed city.

Prompt constraints: present-day-looking mudbrick foundations, excavated wall lines, and earthen mounds on an arid plain. Avoid people, vehicles, modern infrastructure, standing ancient buildings, labels, and any claim of documentary photography.

### Clay accounting envelope

Purpose: introduce administrative material evidence without misrepresenting an invented image as a museum photograph.

Prompt constraints: generic Late Uruk clay accounting envelope with simple cone, disc, and sphere tokens; no readable cuneiform, no labels, no museum branding, and no claim that it depicts a particular object.

## Map

The existing map has a complete prior research note at docs/research/uruk-southern-mesopotamia-map.md. Its final master is Chronos-generated. The Jason Ur figure, UNESCO data, and ArchAtlas material remain non-distributed factual/geographic references; no source image is delivered. The supplied Chronos mockup is an internal style reference.

## Attribution

No external image attribution is required for the three generated replacements. The licensed candidates above are retained in this note for future editorial substitution, with their required attributions recorded.
