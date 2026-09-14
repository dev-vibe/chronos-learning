# Indus map illustration edit — September 13, 2026

Tool: OpenAI built-in image generation; model identifier not exposed.

Input 1 (edit target / geography): `indus-geographic-edit-target.png`, an exact crop of Natural Earth's public-domain HYP_50M_SR_W relief map, with coordinate-verified city markers, its modern Indus river geometry, and a geographic context inset. Preserve this entire composition.

Input 2 (style only): `public/images/places/egypt-nile-corridor-map.jpg`, Chronos's approved Nile corridor map. It supplies brushwork, palette, subtle terrain, and typography only. Do not copy Egyptian geography or labels.

## Complete prompt

Use case: style-transfer / scientific-educational.
Create a polished illustrated historical-atlas map by editing image 1. Image 1 is the GEOGRAPHIC TRUTH AND LOCKED COMPOSITION. Image 2 is a STYLE REFERENCE ONLY.

Change the rendering of image 1 to the hand-painted, softly textured atlas style of image 2: warm ivory and pale ochre land, restrained mineral-blue seas, subdued blue-green lowlands, delicate shaded mountain relief and paper grain, elegant dark-blue serif lettering. Keep terrain subtle and readable; the map should invite exploration. This is a geographic locator for a history lesson, not a satellite image or a fantasy landscape.

LOCKED GEOGRAPHY: preserve image 1's north-up orientation, projection, complete crop and aspect ratio. Preserve the exact India peninsula silhouette, Sri Lanka, the Arabian coast at the far left, the Arabian Sea and Bay of Bengal, mountain belt along the north, and the Indus river path. Trace the existing coastlines, landforms and river; do not invent or reposition them. Relief may become softly painted but keep ridges and lowlands in the same places. Do not turn the whole Indus plain into forest or desert.

LOCKED MARKERS: preserve all three circular city markers at their exact pixel positions and their names. Harappa is northeast of Mohenjo-daro. Dholavira is south and east of Mohenjo-daro. A label may change typeface but not its map position or association with its dot. Do not enlarge dots into city illustrations.

LOCKED CONTEXT INSET: retain the lower-left inset with exactly the same geographic extent, continental shapes, and highlighted rectangular South Asia crop. Preserve its position and size. Paint the inset in the same restrained atlas style. Keep its thin frame and the crop rectangle clearly visible. This inset teaches the location of the main map relative to Africa and the rest of Asia; it is essential geographic content.

EXACT LABELS: "Harappa", "Mohenjo-daro", "Dholavira", "Pakistan", "India", "Himalayas", "Indus", "Arabian Sea", "Bay of Bengal", "Indian Ocean", "Africa", "Asia". Exactly these twelve labels, once each, in the same places as the target. Use generous, legible dark-blue serif lettering. Remove the heavy white text outlines of the source overlay. Keep subtle pale clearance around text where needed. Preserve approximate label sizes so the city and country names remain readable when reduced.

No additional labels, title, dates, educational paragraphs, legend, decorative compass, north arrow, border ornament, political boundary, routes, arrows between regions, ancient territorial fill, buildings, pyramids, boats, people, animals, logos, watermarks, or UI. Do not use the Nile map's river, delta, or place names. Do not crop or rearrange either map. Return the complete illustrated map at high resolution, preserving the 1600:1494 aspect ratio.

## Candidate disposition

The initial call was blocked by the service usage limit. After the reset, the same prompt produced `indus-illustrated-candidate-1.png`. Its secondary thin blue river lines across the northern plains were absent from the geographic edit target and were rejected. The correction below produced `indus-illustrated-master.png`, reviewed against the source and candidate. No river geometry was sourced from the generated candidate.

## Complete correction prompt

Edit image 1 with one precise correction only. Remove the faint thin blue river-like lines that were added across the green northern plains EAST (right) of the Harappa/Mohenjo-daro markers and south of the Himalayas label. Those secondary waterways do not occur in the approved reference (image 2). Restore continuous softly painted land texture beneath those faint lines. PRESERVE the bold blue Indus River on the left and its full path into the northern mountains exactly. Preserve every coast, landform, all twelve labels, all three city dots at exact normalized positions, the full Africa–Asia inset and its crop rectangle, typography, colors, framing and aspect ratio. Do not add any other rivers or details. Image 2 is the geographic reference for distinguishing the one approved Indus river from the unwanted fine blue lines. Output a full-resolution copy with only those invented secondary blue waterways removed.
