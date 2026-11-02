# Met 1999.325.9 — deterministic seal-repeat crop

The archival `DP-36495-001.jpg` is the freshly downloaded museum original, preserved byte for byte. Source: https://images.metmuseum.org/CRDImages/an/original/DP-36495-001.jpg. `met-object.json` preserves the response from https://collectionapi.metmuseum.org/public/collection/v1/objects/327605. Public Domain / Met Open Access; modern impression of a different Akkadian-period seal, not an Urkesh find or Tar’am-Agade's seal.

Chosen source-pixel crop: left1859, top1005, width1382, height740 (half-open bounds). `seal-repeat-master.png` retains the decoded source RGB crop without resizing, blending, reconstruction or retouching. `public/images/akkad/met-seal-repeat.jpg` is the delivery source, JPEG quality98, 4:4:4, mozjpeg. See `delivery.json` for exact source/master/runtime hashes. The owner accepted the untouched crop on 2026-11-01.

`source-and-repeat-review.png` compares the source impression band against two adjacent copies of the crop at exactly the same original pixel scale. The red source rectangle is review annotation only. `autocorrelation-review.png` and its SVG show the measured local correlation curves. These annotations never enter the runtime asset.

Run from the repository root using installed Sharp:

```powershell
node docs/research/assets/akkad/seal-roll/analyze.cjs
node docs/research/assets/akkad/seal-roll/seam-search.cjs
node docs/research/assets/akkad/seal-roll/prepare-delivery.cjs
```

Scripts resolve their source files relative to their own directory; `prepare-delivery.cjs` resolves the runtime destination relative to the repository root. `analyze.cjs` recreates `measurements.json`, coarse `correlation.csv`, and diagnostic `one-repeat.png`/`comparison.png` (regenerated on demand; not retained in the repository); `seam-search.cjs` recreates `seam-search.json` and candidate/tile images. `prepare-delivery.cjs` creates the chosen PNG master, runtime JPEG, annotated review images and `delivery.json`. Reproduction requires Node and the repository's exact installed Sharp version (0.35.3); encoded-byte stability across encoder versions is not promised. None of these scripts changes the archival JPEG.

The design band used for measurement is x1205..3450,y1015..1725. Coarse normalized derivative correlation peaks at preview lag436 (r.1401), then367 (.0707),508 (.0440). Sigma3 original-pixel derivative refinement maximizes at1382 (r.20586). Full-band unblurred zero-mean grayscale correlation instead peaks at1376 (r.61934); sigma3 grayscale peaks there at.69646. Thus1376..1382px is an estimated photographic period, not exact metrology. Stone apparent widest width is approximately490px; pi*490=1539.38px, about10.22% greater than1382px. Perspective, taper and modern impression deformation preclude exact calibration.

Seam search exhaustively evaluated every viable x01205..2068 at fixed1382width. Absolute grayscale boundary jumps are in `seam-search.json`; x1668 is the global minimum but cuts inscription. Chosen x1859 places the boundary beside the inscription panel and preserves the bird and one inscription. This review measurement is not learner-facing explanation.

Routing evidence: requested gpt-6.1-sol; session01a199af-eb37-73f1-8560-9c5e37ae361c session_meta matches parent01a199ae-5a4d-7951-9670-6fc209ec70da and agent_path/root/seal_measurement; turn_context.payload.model=gpt-6.1-sol. No price or cost claim; no transcript copied.

