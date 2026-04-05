-- ============================================================
-- Dr. Rani Portfolio – Alter Tables for New Features
-- Run this ONCE in: Supabase Dashboard → SQL Editor → New query → Run
-- Run BEFORE using: Insights page, Teaching page, new Profile link fields
-- ============================================================

-- ── NEW PROFILE COLUMNS ───────────────────────────────────────
ALTER TABLE profile ADD COLUMN IF NOT EXISTS "researchGate"    text default '';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS "scopusId"        text default '';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS "semanticScholar" text default '';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS "citations"       text default '';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS "hIndex"          text default '';

-- ── NEW PROJECTS COLUMN ───────────────────────────────────────
ALTER TABLE projects ADD COLUMN IF NOT EXISTS "amount" numeric default null;

-- ── NEW TEACHING TABLE ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS teaching (
  id uuid primary key default gen_random_uuid(),
  course text not null,
  code text,
  level text,
  semester text,
  year text,
  description text,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz default now()
);

ALTER TABLE teaching ENABLE ROW LEVEL SECURITY;

-- Drop policy first if it already exists (safe re-run)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'teaching' AND policyname = 'auth_all'
  ) THEN
    EXECUTE 'CREATE POLICY "auth_all" ON teaching FOR ALL USING (auth.role() = ''authenticated'')';
  END IF;
END $$;

-- ── NEW COLLABORATIONS TABLE ──────────────────────────────────
CREATE TABLE IF NOT EXISTS collaborations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  role text,
  description text,
  url text,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz default now()
);
ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_all"    ON collaborations;
DROP POLICY IF EXISTS "public_read" ON collaborations;
CREATE POLICY "auth_all"    ON collaborations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_read" ON collaborations FOR SELECT TO anon USING (true);

-- ── NEW SESSION CHAIRS TABLE ──────────────────────────────────
CREATE TABLE IF NOT EXISTS "sessionChairs" (
  id uuid primary key default gen_random_uuid(),
  conference text not null,
  year integer,
  location text,
  topic text,
  description text,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz default now()
);
ALTER TABLE "sessionChairs" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_all"    ON "sessionChairs";
DROP POLICY IF EXISTS "public_read" ON "sessionChairs";
CREATE POLICY "auth_all"    ON "sessionChairs" FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_read" ON "sessionChairs" FOR SELECT TO anon USING (true);

-- ── FUNDED FLAG ON PROJECTS ───────────────────────────────────
ALTER TABLE projects ADD COLUMN IF NOT EXISTS funded boolean default false;
