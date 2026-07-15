-- Applied migration version: 20260715024631.
-- Public lesson derivatives are cacheable and addressable without a learner session.
-- Originals remain private. No storage.objects policies are created: browser roles
-- cannot upload, replace, move, list, or delete media; trusted release tooling uses
-- a server-side Supabase secret/service-role key.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'media-public',
    'media-public',
    true,
    10485760,
    array['image/avif', 'image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'media-source',
    'media-source',
    false,
    52428800,
    array['image/avif', 'image/jpeg', 'image/png', 'image/tiff', 'image/webp']
  )
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
