# ADR 004: Measured quasi-lossless media ingestion

- Status: Accepted
- Date: 2026-07-15
- Extends: ADR 003, Hybrid asset storage and delivery

## Decision

Keep every canonical source byte unchanged. Generate responsive delivery candidates deterministically with Sharp, decode each candidate, compare it pixel-by-pixel with the resized sRGB reference, and publish the smallest useful candidate that passes the ql-v1 quality contract:

- PSNR at least 45 dB;
- mean absolute channel error at most 1;
- maximum individual channel delta at most 16;
- at most 768 KiB per variant;
- WebP qualities searched from 96 down to 80, plus pixel-exact WebP;
- keep a full-size source passthrough when a lossy rewrite saves less than 5%;
- omit a smaller-width candidate when it has at least as many bytes as the next larger candidate.

Object keys contain optimized/ql-v1; committed rollback files live under public/images/optimized/. The manifest records the encoder, quality, checksum, and measured fidelity for every derivative. The source object remains in private media-source; only redistribution-approved derivatives may enter public media-public.

## Context

Near-lossless WebP sounds like the obvious default but is not a useful universal policy for an existing mixed JPEG/WebP corpus. Lossless re-encoding preserves decoded pixels but often grows already-compressed photographic inputs substantially. A fixed lossy quality is smaller, but the same quality number produces different visible error across photographs, reconstructions, diagrams, and maps.

The pipeline needs a rule an agent can execute without aesthetic guesswork, while preserving the exact reviewed source and making every lossy decision auditable.

## Evidence

The four Uruk canary originals were benchmarked against lossless, near-lossless, and WebP quality candidates. Lossless outputs were approximately 3.4 to 5.8 times the existing source size for three inputs and 4.4 times for the reconstruction. Conversely, the existing 34,249-byte clay-envelope JPEG beat every compliant WebP re-encode and should remain untouched.

The first complete run also showed that a 960px pixel-exact map derivative was larger than the compliant full-width map. This is why usefulness includes monotonic byte size, not just fidelity and nominal width.

Official references:

- [Sharp WebP output options](https://sharp.pixelplumbing.com/api-output/)
- [Google WebP FAQ](https://developers.google.com/speed/webp/faq)
- [Google cwebp documentation](https://developers.google.com/speed/webp/docs/cwebp)

## Options considered

### Fixed WebP quality

Simple and fast, but not comparable across image classes. It may waste bytes on simple art and introduce avoidable error in detailed evidence.

### Always lossless or near-lossless WebP

Strong pixel fidelity, but frequently expands inputs that are already JPEG or lossy WebP. This would increase storage and learner bandwidth while adding no recoverable information.

### Visual metrics plus candidate search

More build CPU, but deterministic, testable, and cheap at the current editorial ingestion rate. It preserves exact sources, records the evidence for every derivative, and adapts to each image.

This option is selected.

## Consequences

- Media builds take tens of seconds rather than a few seconds.
- Encoder or Sharp upgrades may change bytes, so dependency versions remain pinned and manifest diffs require review.
- PSNR and pixel-error thresholds are guardrails, not proof of historical or editorial accuracy; provenance review remains separate.
- A future perceptual metric may supplement ql-v1, but changing thresholds or encoders requires a new named profile rather than silently changing existing object keys.
