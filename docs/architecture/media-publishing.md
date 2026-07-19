# Media ingestion and publishing runbook

The media pipeline keeps canonical sources unchanged, commits a compact optimized rollback copy, stages responsive derivatives under ignored tmp/chronos-media/, and publishes immutable objects to Supabase Storage. ADR 004 defines the measured ql-v1 compression contract.
## Automated research and approval

Before sourcing or generating an image, run the workflow in [the media provenance research and generation prompt](../prompts/media-provenance-research-and-generation.md). The agent gathers authoritative license evidence, records attribution and historical suitability, and either recommends approval or replaces the asset.

Historical lesson maps also follow the [map-specific requirements in the media provenance prompt](../prompts/media-provenance-research-and-generation.md#additional-requirements-for-historical-maps). That workflow establishes the real geographic reference, coordinate checks, uncertainty boundary, generated-art lineage, and label review before this runbook ingests and publishes the accepted master.

The product owner is not the default copyright analyst. Clear public-domain, CC0, CC BY, CC BY-SA, or documented Chronos-original assets can follow the automated approval path. Unknown origin, educational-use-only, fair-use assumptions, all-rights-reserved, NC, ND, hotlinked, or watermarked assets remain blocked and should normally be replaced. Ambiguous edge cases go to a qualified reviewer; the publisher gate is never bypassed.

## Add an image

1. Put the canonical source under public/images/ while the canary rollback period is active. Do not pre-compress or overwrite it.
2. Add the catalog entry:

       npm run media:add -- --id media.uruk.example --source public/images/places/example.jpg --collection uruk --fallback /images/optimized/uruk/example.optimized.webp --preset photo --widths 480,960,1600

   Use photo for photographs, picture for mixed illustrations, drawing only after checking its output, and default when unsure. The build always includes the source width and refuses unsafe paths or duplicate IDs.
3. Add the asset’s source/provenance, alt text, depiction mode, learner-facing `rightsLabel`, and internal review state to authored content. New assets stay `provenance-review-required` until redistribution rights are actually confirmed. The publisher uses `reviewStatus`; learner UI must never present that internal workflow field as historical or editorial approval.
4. Build and verify:

       npm run media:build
       npm run media:verify
       npm run validate:content
       npm test

Review the console’s chosen encoder, byte count, PSNR, and mean error. Review the manifest diff and visually inspect the committed file under public/images/optimized/. Do not hand-edit generated manifests or optimized binaries.

If the selected full-size codec differs from the fallback extension, update fallbackPath to the extension requested by the build and rerun it. A source-passthrough result is intentional when re-encoding is not materially smaller.

## What the build guarantees

For each requested width, media:build compares pixel-exact WebP and a high-quality WebP candidate ladder with a resized sRGB reference. A derivative is accepted only when it satisfies ql-v1: PSNR at least 45 dB, mean channel error at most 1, maximum channel delta at most 16, and size at most 768 KiB. Lossy replacement of a full-size source must save at least 5%.

The build writes:

- content/media/generated/chronos-media.json: browser-safe provider-neutral locators;
- media/manifests/chronos-release.json: sources, checksums, compression, and fidelity;
- public/images/optimized/: committed canary rollback files;
- tmp/chronos-media/media-source/: unchanged private source objects;
- tmp/chronos-media/media-public/: immutable learner-facing derivatives.

Object keys include the source checksum, optimized/ql-v1, encoder, and derivative checksum. Published keys are never overwritten.

## Current asset results

| Asset | Canonical source | Optimized rollback | Decision |
| --- | ---: | ---: | --- |
| Reconstruction | 303,742 B | 303,742 B | exact source passthrough; lossy savings were under 5% |
| Site evidence | 109,191 B | 101,094 B | WebP q92; PSNR 45.14 dB |
| Clay envelope | 34,249 B | 34,249 B | exact JPEG passthrough |
| Southern Mesopotamia map | 241,550 B | 221,460 B | WebP q92; PSNR 49.25 dB |
| Proto-cuneiform tablet | 1,014,869 B | 728,374 B | Public-domain photograph; WebP q92; PSNR 47.08 dB |

Responsive variants provide the larger learner-bandwidth win. Widths that are bigger in bytes than a larger alternative are omitted from the manifest.

## Publish

Apply supabase/migrations/20260715024631_configure_chronos_media_storage.sql. It creates public media-public, private media-source, strict MIME/size limits, and no browser mutation policies.

Set trusted release credentials, never a VITE-prefixed secret:

    $env:SUPABASE_URL='https://<project-ref>.supabase.co'
    $env:SUPABASE_SECRET_KEY='<server-side-secret-key>'

Private canonical sources can be ingested before public rights approval:

    npm run media:ingest-sources -- --asset media.uruk.example

Publish an approved asset and verify its immutable objects:

    npm run media:publish -- --asset media.uruk.example
    npm run media:verify:remote -- --asset media.uruk.example

Omit --asset to process the collection. Public publication fails closed for every selected asset whose reviewStatus is not approved. Upload uses upsert false, verifies existing checksums, and gives public immutable keys a one-year browser cache. See the [Supabase upload reference](https://supabase.com/docs/reference/javascript/file-buckets-upload) and [Smart CDN cache guidance](https://supabase.com/docs/guides/storage/cdn/smart-cdn).

## Cutover and rollback

After remote checksum verification, set:

    VITE_MEDIA_PROVIDER=object-storage
    VITE_SUPABASE_URL=https://<project-ref>.supabase.co

VITE_MEDIA_BASE_URL can point the same provider-neutral manifest at another object store or CDN. For immediate rollback, set VITE_MEDIA_PROVIDER=repository and redeploy; each image uses its committed optimized fallback.
