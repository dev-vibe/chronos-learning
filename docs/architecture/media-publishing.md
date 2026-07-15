# Media publishing runbook

The media pipeline keeps authored metadata and a compact release manifest in Git. It stages source originals and generated responsive derivatives under ignored `tmp/chronos-media/`, then publishes immutable objects to Supabase Storage with trusted server-side credentials.

## Build and verify

```sh
npm run media:build
npm run media:verify
npm run validate:content
```

`media:build` currently processes the four Uruk canary assets. It generates WebP variants at useful widths up to 1600 pixels, records dimensions and SHA-256 checksums, and writes a browser-safe locator manifest to `content/media/generated/uruk-media.json` plus the source-inclusive release manifest at `media/manifests/uruk-release.json`. `media:verify` regenerates the same payload and fails if either committed manifest differs.

Generated binaries are intentionally not committed. The original Uruk files remain under `public/images/` for one release as the local fallback and rollback path.

## Publish

First apply `supabase/migrations/20260715024631_configure_chronos_media_storage.sql`. It creates:

- public `media-public` for approved derivatives;
- private `media-source` for source originals;
- no browser upload, update, move, list, or delete policies.

Set a trusted credential in the release shell, never in a `VITE_*` variable or browser environment:

```powershell
$env:SUPABASE_URL='https://<project-ref>.supabase.co'
$env:SUPABASE_SECRET_KEY='<server-side-secret-key>'
npm run media:publish
npm run media:verify:remote
```

The publisher verifies an existing object's checksum or uploads a missing immutable key with a one-year cache duration. It refuses to overwrite objects.

Publication also fails closed unless every selected `MediaAsset.reviewStatus` is `approved`. The current four Uruk records remain `provenance-review-required`, so their derivatives are staged and reproducible but must not be uploaded to `media-public` until editorial rights/provenance review is recorded. A server-side key is needed only after that gate passes.

## Canary cutover and rollback

Repository delivery is the safe default. After remote verification, set these application build variables:

```text
VITE_MEDIA_PROVIDER=object-storage
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
```

`VITE_MEDIA_BASE_URL` can override the public object base URL for another provider or a future custom CDN. Lesson content contains no provider hostname.

Every responsive image falls back to its checked-in repository file if hosted delivery fails. For an immediate release-wide rollback, set `VITE_MEDIA_PROVIDER=repository` and redeploy; no content edit is required.
