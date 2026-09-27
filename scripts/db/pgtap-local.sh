#!/usr/bin/env bash
# Run the pgTAP suite without Docker: rebuild a throwaway local database from
# every migration, on top of minimal Supabase role, auth and storage stand-ins
# (scripts/db/supabase-stubs.sql), then run pg_prove.
#
# Needs PostgreSQL 16 with the pgTAP extension and pg_prove (for example the
# postgresql-16-pgtap and libtap-parser-sourcehandler-pgtap-perl packages),
# and a running server you can reach as a superuser through the usual PG*
# variables. The database named by PGTAP_DB (default chronos_pgtap) is dropped
# and recreated.
set -euo pipefail
export PGOPTIONS="${PGOPTIONS:-} -c client_min_messages=warning"
root="$(cd "$(dirname "$0")/../.." && pwd)"
db="${PGTAP_DB:-chronos_pgtap}"
psql -q -d postgres -c "drop database if exists $db" >/dev/null 2>&1
psql -q -d postgres -c "create database $db" >/dev/null
psql -q -v ON_ERROR_STOP=1 -d "$db" -f "$root/scripts/db/supabase-stubs.sql" >/dev/null
for migration in "$root"/supabase/migrations/*.sql; do
  psql -q -v ON_ERROR_STOP=1 -d "$db" -f "$migration" >/dev/null
done
cd "$root/supabase/tests" && pg_prove -d "$db" ./*.sql
