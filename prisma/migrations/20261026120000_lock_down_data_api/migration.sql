-- The app talks to Postgres only through Prisma as the table-owning "postgres"
-- role, never through Supabase's Data API (PostgREST/GraphQL/supabase-js).
-- Supabase granted the public "anon"/"authenticated" API roles full access to
-- every table in "public", which let anyone holding the project's publishable
-- key read/modify any row (including User.passwordHash). Lock that down.

-- Enable RLS with no policies: the API roles see nothing; "postgres" (table
-- owner) bypasses RLS, so Prisma is unaffected.
DO $$
DECLARE t record;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.tablename);
  END LOOP;
END $$;

-- Remove the existing API-role grants.
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon, authenticated;

-- Stop future tables created by Prisma migrations from being auto-granted
-- (matches Supabase's own default for new tables from 2026-10-30 onward).
-- Do NOT add "grant ... to anon" statements to future migrations.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM anon, authenticated;
