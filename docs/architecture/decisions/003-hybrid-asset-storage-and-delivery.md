# ADR 003: Hybrid asset storage and delivery

- Status: Accepted; Uruk canary implementation in progress
- Date: 2026-07-14
- Decision owners: Chronos product and engineering
- Related work: ASH-56 / CHR-058 through CHR-061, ASH-63 / CHR-073 through CHR-082

## Decision summary

Keep code-integral assets and versioned media metadata in Git. Beginning with CHR-058, store approved historical-media binaries in Supabase Storage and deliver published derivatives directly from a public bucket through Supabase's CDN.

Do not migrate the current Uruk slice merely to change hosting. First introduce a provider-neutral media manifest and URL resolver, then use Uruk as a canary. Retain the checked-in files as a rollback path for one release. Move only reviewed assets; do not upload the legacy corpus of missing or unlicensed references.

Use pre-generated responsive derivatives with immutable, content-addressed object keys. Do not depend on Supabase Image Transformations for the initial release because transformations are not included on the Free plan and reproducible derivatives are an editorial requirement.

This is deliberately a hybrid decision:

- Git remains the reviewable source of truth for asset identity, provenance, license, depiction mode, alt text, visual brief, checksums, derivative specifications, and publication state.
- Supabase Storage holds large or mutable media bytes: source masters in a private bucket and approved learner-facing derivatives in a public bucket.
- Vercel continues to deploy the application and a very small set of application-coupled assets such as icons, fonts, social metadata, and a local media fallback.

## Context

Chronos is becoming media-heavy by design. The mature product may contain hundreds of lessons, 30–50 cards in the initial slice, evidence galleries, maps, generated reconstructions, source images, and multiple responsive derivatives. Media is not decoration: it carries provenance, licensing, depiction, historical-review, and recovery requirements.

The existing repository pattern is appropriate for a prototype but not for that corpus:

1. Content refers to root-relative paths such as `/images/places/uruk-reconstruction.webp`.
2. Vite copies every file under `public/` into every production build.
3. Vercel deploys that build and serves those files as static assets.
4. Legacy content also contains direct third-party image URLs, so the current state is not exclusively repository-hosted and is not a controlled publication pipeline.
5. There is no object-store bucket, upload workflow, derivative pipeline, independent asset backup, or provider-neutral URL layer.

The PRD and implementation plan already require stable asset IDs, responsive delivery, reproducible derivatives, original URLs and licenses, generated-image lineage, historical approval, and publication blocking when attribution is missing. The storage decision must support those requirements without making a family-scale application expensive or operationally elaborate.

## Current-state evidence

Measured on 2026-07-14 from the active workspace:

| Finding | Current result | Meaning |
| --- | ---: | --- |
| Tracked runtime images under `public/` | 26 files / 37.94 MiB | All are copied into the Vite build, whether or not a particular lesson uses them. |
| Production build | 44 files / 39.32 MiB | 37.94 MiB is imagery. Browsers fetch only rendered images, but every deployment contains the full set. |
| Present local image references | 25 of 192 unique paths | 167 legacy paths are missing and must not be treated as migratable assets. |
| Legacy external image references | 54 occurrences | Several are hotlinks, search-cache URLs, or HTML pages rather than controlled image objects. |
| Generated source masters in Git | 1 file / 2.30 MiB | This category will grow quickly once card and hero production begins. |
| Design references in Git | 5 files / 10.41 MiB | These are review inputs, not runtime assets. |
| PR screenshots in Git | 12 files / 5.68 MiB | These do not enter the Vite build but contribute to clone history. |
| Git object store | 72.24 MiB | Healthy today, but repeated binary revisions accumulate permanently. |
| Largest tracked image | 9.45 MiB | Multiple objects exceed GitHub's recommended 1 MiB object size. |
| Supabase project | Free, active/healthy, no Storage buckets | There is no production-only bucket state to preserve or migrate. |

The current build remains well within platform limits, so this is not an emergency migration. It is a boundary decision before ASH-56 scales the media corpus.

## Decision drivers

In priority order:

1. Preserve historical provenance, rights, review state, and reproducibility.
2. Keep the initial operating cost at or near zero.
3. Avoid adding a new vendor or custom media service unless it provides material value.
4. Stop large binary revisions from inflating Git history and every deployment.
5. Support responsive, lazy-loaded delivery with immutable caching.
6. Decouple media-byte publication from the application build; a manifest correction may initially still use the normal content deployment path.
7. Keep provider migration and disaster recovery practical.
8. Avoid production-only dashboard state and hidden manual steps.

## Options considered

Scores are 1 (poor) to 5 (strong). The weighted total uses operational simplicity 30%, initial cost 25%, editorial/provenance fit 20%, delivery scaling 15%, and portability/recovery 10%.

| Option | Simplicity | Initial cost | Editorial fit | Scaling | Portability | Weighted |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Keep all binaries in Git/Vercel | 5 | 5 | 2 | 2 | 3 | 3.75 |
| **Git metadata + Supabase Storage binaries** | **4** | **5** | **5** | **4** | **4** | **4.45** |
| Git metadata + Vercel Blob | 4 | 5 | 3 | 4 | 3 | 3.95 |
| Git metadata + Cloudflare R2 | 3 | 5 | 4 | 5 | 5 | 4.20 |
| Git LFS for binaries | 3 | 3 | 2 | 1 | 2 | 2.35 |

### Option A: Keep all binaries in Git and Vercel static assets

This has no new service and is reasonable for the current slice. Vercel Hobby includes 100 GB/month Fast Data Transfer, and static delivery is already configured. It also makes a code/content rollback automatically include the bytes.

It does not scale cleanly for Chronos. Every binary revision remains in Git history, all `public/` media is copied into each build, content-only media corrections require a full deployment, and the repository provides no natural private source-master boundary. GitHub recommends keeping individual objects at or below 1 MiB and storing generated files outside Git; its hard single-object limit is 100 MiB. Vercel documents a 100 MB static-file upload limit for Hobby CLI deployments. These are not immediate blockers, but they point in the wrong direction for a growing historical-media library.

Use this only as the migration-safe current state, not the target.

### Option B: Supabase Storage

Supabase is already the selected durable platform and the Chronos project is active in `ca-central-1`. Storage provides S3-compatible access, public and private buckets, direct public URLs, and CDN delivery. A public bucket gives better cache reuse for globally readable lesson media than per-request signed URLs.

The current Free plan includes 1 GB file storage, 5 GB cached egress, and 5 GB uncached egress. The existing 37.94 MiB runtime set would use less than 4% of the storage allowance. A conservative 750 MiB combined source-and-derivative budget leaves headroom while the product is on Free. The repository already requires upgrading Supabase before beta; current Pro allowances are 100 GB storage plus 250 GB each of cached and uncached egress, so the beta upgrade would cover media without adding a second base subscription.

Constraints are manageable:

- Free projects can pause after one week of inactivity.
- Free includes Basic CDN, not Smart CDN.
- Image Transformations are not included on Free.
- Supabase Storage does not support S3 object versioning.
- Database backups do not contain Storage objects.

These constraints lead directly to immutable keys, pre-generated derivatives, and an independent export/backup requirement.

### Option C: Vercel Blob

Vercel Blob is operationally close to the current deploy platform. Hobby currently includes 1 GB-month storage and 10 GB Blob Data Transfer, plus operation limits. Public Blob avoids pushing media through application functions.

It is a credible alternative, but it adds a second data plane alongside Supabase without improving the editorial model. Vercel describes Blob's delivery network as optimized for cost-efficient, non-critical media; Chronos lesson heroes can be LCP-critical. More importantly, storage choice should follow the media manifest rather than couple content publication to the application host.

Choose Blob later only if Vercel-native asset operations materially simplify the real editorial workflow.

### Option D: Cloudflare R2

R2 has the strongest raw free allowance: 10 GB-month storage, 1 million Class A operations, 10 million Class B operations, and no direct egress fee. It is S3-compatible and is the leading fallback if media outgrows Supabase's included egress or if an independent backup target is needed.

It is not the most pragmatic first move. It introduces another account, secrets, bucket policy, observability surface, domain/CDN setup, and incident owner before the initial dozen learners need that scale. The provider-neutral manifest preserves the option to move to R2 without embedding Supabase URLs throughout lesson content.

### Option E: Git LFS

Git LFS can reduce ordinary Git object growth for future large masters, but it does not provide the learner-facing publication workflow, CDN policy, responsive variants, or runtime asset service. It also introduces separate quotas and CI/build checkout behavior. It may be useful for a small number of design-source files, but it is not the media architecture.

## Detailed decision

### 1. Asset classes and their homes

| Asset class | System of record | Delivery |
| --- | --- | --- |
| Application-coupled icons, fonts, social/fallback images | Git | Vercel static assets |
| Media manifest, provenance, license, alt text, depiction mode, briefs, prompts, review state, checksums | Git-authored content; optionally projected into PostgreSQL at publish time | Application/content API |
| Generated masters, licensed source originals, review inputs | Supabase private `media-source` bucket | Editor/reviewer tooling only; never a public lesson URL |
| Approved responsive lesson/card/evidence derivatives | Supabase public `media-public` bucket | Direct public Storage URL through CDN |
| Design references and a small number of review screenshots | Git while modest | Repository documentation only |
| Unlicensed or link-only evidence | Source metadata only | Link to the authoritative page; do not copy or hotlink its image |

Buckets are split by access policy, not by historical category. Folder-like object prefixes may organize asset IDs and variants without creating many buckets.

### 2. Provider-neutral identity

Lessons and cards reference `MediaAsset.id`, never a hand-authored public URL. The media record contains a provider-neutral locator and variants. A representative shape is:

```text
MediaAsset
  id
  kind
  alt
  depictionMode
  sourceIds
  license
  reviewStatus
  original: bucket, objectKey, sha256, bytes
  variants[]: width, height, format, bucket, objectKey, sha256, bytes
```

The application resolves `bucket + objectKey` through a configured public media base URL. Published content must not depend on a Supabase client or a secret key to display public media.

### 3. Immutable object keys and caching

Published objects use a path such as:

```text
published/<asset-id>/<sha256-prefix>/<variant>.<format>
```

They are uploaded with a long browser cache policy such as `public, max-age=31536000, immutable`. An approved replacement receives a new checksum path; publication changes the manifest reference. Do not overwrite a published key.

This avoids stale-browser problems, makes rollback a manifest change, and compensates for Free not having Smart CDN invalidation. It also preserves the exact bytes reviewed by historians and editors.

### 4. Derivatives

Generate derivatives in a committed, deterministic script during ingestion or release preparation. For the first release:

- use WebP as the primary photographic/illustrative format;
- retain JPEG/PNG only where evidence fidelity, transparency, or source preservation requires it;
- produce only the widths actually used by the shell, initially approximately 480, 960, and 1600 pixels;
- preserve aspect ratio and recorded crop/focal-point metadata;
- enforce per-variant byte budgets in content validation;
- render `srcset`/`sizes`, width, height, lazy loading, and decoding hints in typed media components;
- do not generate derivatives at learner request time.

AVIF and hosted transformations can be evaluated after real performance data exists. They are not required to make the first corpus efficient.

### 5. Publication and security

- Only approved, redistribution-cleared derivatives enter `media-public`.
- Source masters and review inputs remain private.
- Public lesson media contains no learner data and needs no signed URL.
- Browser code never receives a Supabase secret/service-role key.
- Upload, replace, archive, and delete operations run through trusted editorial tooling.
- Bucket configuration, policies, and setup are committed and repeatable; no dashboard-only production changes.
- Storage object operations use the Storage/S3 API rather than direct writes to the `storage` schema.
- Published content validation rejects uncontrolled third-party hotlinks, missing variants, checksum mismatches, missing attribution/license, and unapproved review state.
- Do not proxy public media through a Vercel Function; direct delivery avoids paying and debugging two delivery paths.

### 6. Recovery

Supabase database backups do not include Storage objects, and Supabase Storage does not provide S3 object versioning. Therefore:

- never overwrite published keys;
- archive rather than immediately delete replaced source objects;
- retain the local source file until upload checksum verification and an independent copy exist;
- export a release manifest containing every object key, checksum, byte size, and metadata record;
- before beta, automate an S3-compatible sync of both buckets to an independent backup target and test a restore;
- treat a database restore and an object restore as one recovery runbook.

Cloudflare R2 is the preferred first provider to evaluate for that independent target because its current free tier is materially larger than the launch corpus, but selecting the backup account is deferred until the beta recovery work rather than added to the MVP now.

## Cost envelope

The goal is a bounded free-development phase, not a promise that production will always be free.

| Stage | Guardrail | Expected platform cost for media |
| --- | --- | --- |
| Current vertical slice | Existing 37.94 MiB remains in Git/Vercel | $0 incremental |
| Development media pipeline | Supabase Storage remains below 750 MiB; monitor cached and uncached egress separately | $0 on current Free allowances |
| Initial dozen learners | Responsive/lazy derivatives; no automatic full-corpus download | Expected inside Free allowances; verify in usage reports |
| Closed beta and production | Upgrade Supabase as already required; keep spend cap/alerts where available | Covered by the planned platform subscription until included quotas are exceeded |

Re-evaluate the primary object store if any trigger occurs:

- total Storage exceeds 750 MiB before the planned Pro upgrade;
- either Free egress pool exceeds 70% in a month;
- projected media egress would materially dominate the Pro bill;
- editor operations require object versioning or lifecycle rules;
- a custom media domain becomes a product requirement;
- an R2 backup is already operating reliably and consolidating onto it would remove more complexity than it adds.

## Migration plan

### Phase 0: Record the boundary

Accept this ADR without moving bytes or changing learner behavior.

### Phase 1: Build the seam in CHR-058

1. Extend `MediaAsset` to reference stable asset identity and responsive variants rather than only `path`.
2. Add a resolver that supports both `repo-public` and `object-storage` locators.
3. Add deterministic derivative generation, checksums, byte budgets, manifest validation, and upload verification.
4. Add a small bundled fallback so media failure never blocks lesson completion.

Repository delivery remains the default until the canary objects pass remote checksum verification. Cutover is explicit with `VITE_MEDIA_PROVIDER=object-storage`; rollback is `VITE_MEDIA_PROVIDER=repository`.

### Phase 2: Uruk canary

1. Create `media-source` and `media-public` through committed, repeatable setup.
2. After each asset passes rights/provenance review, upload the four Uruk assets and generated derivatives. The publisher must fail closed while a record remains `provenance-review-required`.
3. Verify checksums, MIME types, cache headers, direct CDN delivery, attribution, responsive selection, keyboard/screen-reader behavior, and mobile performance.
4. Run existing content, Learn, and visual tests against the object-storage locator.
5. Keep the checked-in Uruk runtime files for one release as rollback inputs.

### Phase 3: Reviewed corpus migration

1. Migrate only assets that pass rights, provenance, depiction, alt-text, and historical review.
2. Treat the 167 missing local paths and 54 external legacy references as editorial inventory, not upload work.
3. Preserve a mapping from legacy path or source URL to canonical asset ID and disposition.
4. Delete a runtime file from `public/` only in the same reviewable change that verifies its hosted replacement and rollback locator.

### Phase 4: Stop binary growth

After the resolver and recovery path are proven, reject new historical-media binaries under `public/images` in validation. Allow an explicit exception list for code-integral assets and temporary canary rollback files.

Do not rewrite Git history to remove existing binaries. The current repository is small enough that history surgery would add risk without meaningful benefit.

## Rollback

For the canary and first migrated release, the manifest can switch each asset back to its existing `repo-public` locator. Because published object keys are immutable, rolling back application or content versions also restores the exact prior asset reference. Do not delete checked-in fallback files or old object keys until the retention window and restore test have passed.

If Supabase Storage is unavailable, lesson text and progress remain usable; typed media components render the local fallback and preserve captions/attribution. Media failure must never prevent an understanding check or explicit completion.

## Consequences

### Positive

- Git reviews continue to show the historical/editorial decision, while large bytes stop accumulating in every clone and deploy.
- Large media bytes can be uploaded and verified independently; corrections still follow the explicit content-approval workflow.
- Responsive delivery and immutable caching reduce learner bandwidth without a runtime transformation bill.
- Public and private media receive clear access boundaries.
- Provider-neutral IDs and S3-compatible export preserve a credible path to R2 or another object store.
- The decision uses an already selected platform and fits inside current development allowances.

### Negative

- A media upload/publish tool and object-existence validation must be built.
- Local development needs fixtures, a remote read path, or the bundled fallback.
- Supabase Free can pause, lacks Image Transformations, and has smaller egress allowances than R2.
- Storage objects need a separate backup; database backup alone is insufficient.
- Asset publication and application deployment become separate operations that need release coordination.

### Risks and controls

| Risk | Control |
| --- | --- |
| Hosted object and Git manifest drift | Checksums, object existence validation, publish transaction/report, and reconciliation command. |
| Stale cache after correction | Never overwrite; publish a new content-addressed key. |
| Accidental public release of restricted media | Separate private/public buckets and publication gate requiring license approval. |
| Provider outage blocks lesson | Text-first rendering, local fallback, retry, and media errors that do not block completion. |
| Free quota exhaustion | Responsive byte budgets, lazy loading, usage alerts, and the explicit 70%/750 MiB triggers. |
| Supabase project loss or object deletion | Independent S3-compatible backup and tested restore before beta. |
| Vendor lock-in | Stable asset IDs, provider-neutral locators, checksums, and no provider URLs in authored lessons. |

## Validation required before retiring the repository fallback

- Benchmark an Uruk hero, map, and evidence image from expected learner regions on the Free Basic CDN.
- Confirm the public URL and cache headers work without a Supabase key.
- Confirm private source objects cannot be read anonymously.
- Demonstrate deterministic derivative regeneration with identical checksums.
- Demonstrate a manifest rollback to `repo-public`.
- Calculate actual storage and egress from the first approved card batch rather than extrapolating from raw masters.
- Document and rehearse an object export before deleting the final independent source copy.

## Sources and pricing snapshot

Pricing and limits change. These links were checked on 2026-07-14 and must be rechecked before implementation or provider migration.

- [Supabase pricing](https://supabase.com/pricing)
- [Supabase Storage pricing](https://supabase.com/docs/guides/storage/pricing)
- [Supabase Storage bandwidth and egress](https://supabase.com/docs/guides/storage/serving/bandwidth)
- [Supabase Storage CDN fundamentals](https://supabase.com/docs/guides/storage/cdn/fundamentals)
- [Supabase Smart CDN and cache duration](https://supabase.com/docs/guides/storage/cdn/smart-cdn)
- [Supabase serving assets from public buckets](https://supabase.com/docs/guides/storage/serving/downloads)
- [Supabase S3 compatibility and lack of object versioning](https://supabase.com/docs/guides/storage/s3/compatibility)
- [Supabase database backups exclude Storage objects](https://supabase.com/docs/guides/platform/backups)
- [Vercel pricing](https://vercel.com/pricing)
- [Vercel platform limits](https://vercel.com/docs/limits)
- [Vercel Blob pricing](https://vercel.com/docs/vercel-blob/usage-and-pricing)
- [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/)
- [GitHub repository limits](https://docs.github.com/en/repositories/creating-and-managing-repositories/repository-limits)
