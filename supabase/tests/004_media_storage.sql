begin;
create extension if not exists pgtap with schema extensions;
set local search_path=extensions,public;
select plan(6);

select is(
  (select public from storage.buckets where id='media-public'),
  true,
  'published derivatives are publicly readable'
);
select is(
  (select public from storage.buckets where id='media-source'),
  false,
  'source originals remain private'
);
select is(
  (select file_size_limit from storage.buckets where id='media-public'),
  10485760::bigint,
  'published derivatives have a pragmatic 10 MiB ceiling'
);
select is(
  (select file_size_limit from storage.buckets where id='media-source'),
  52428800::bigint,
  'source originals use the free-plan 50 MiB ceiling'
);
select is(
  (select allowed_mime_types from storage.buckets where id='media-public'),
  array['image/avif', 'image/jpeg', 'image/png', 'image/webp']::text[],
  'published media is limited to browser image formats'
);
select is(
  (
    select count(*)
    from pg_policies
    where schemaname='storage'
      and tablename='objects'
      and (coalesce(qual, '') like '%media-public%'
        or coalesce(with_check, '') like '%media-public%'
        or coalesce(qual, '') like '%media-source%'
        or coalesce(with_check, '') like '%media-source%')
  ),
  0::bigint,
  'learner-facing roles receive no media object mutation policies'
);

select * from finish();
rollback;
