-- VisiblyAI — Supabase Schema
-- Run this in the Supabase SQL editor

CREATE TABLE IF NOT EXISTS public.scans (
  id                    TEXT        PRIMARY KEY,
  user_id               UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name         TEXT        NOT NULL,
  website_url           TEXT        NOT NULL,
  city                  TEXT        NOT NULL,
  primary_service       TEXT        NOT NULL,
  competitors           TEXT[]      NOT NULL DEFAULT '{}',
  overall_score         INTEGER     NOT NULL,
  grade                 TEXT        NOT NULL,
  categories            JSONB       NOT NULL DEFAULT '{}',
  insights              JSONB       NOT NULL DEFAULT '[]',
  problems              JSONB       NOT NULL DEFAULT '[]',
  recommendations       JSONB       NOT NULL DEFAULT '[]',
  quick_wins            JSONB       NOT NULL DEFAULT '[]',
  competitor_comparison JSONB       NOT NULL DEFAULT '[]',
  gemini_visibility     JSONB,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS scans_user_id_idx
  ON public.scans (user_id, created_at DESC);

ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own scans"
  ON public.scans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scans"
  ON public.scans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scans"
  ON public.scans FOR DELETE
  USING (auth.uid() = user_id);

-- ── Leads table (email gate captures) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leads (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email                 TEXT        NOT NULL,
  scan_id               TEXT        REFERENCES public.scans(id) ON DELETE SET NULL,
  business_name         TEXT,
  website_url           TEXT,
  city                  TEXT,
  service               TEXT,
  overall_score         INTEGER,
  gemini_visibility_rate NUMERIC,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads (email);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Only service role (server-side API) can insert leads — no client access
CREATE POLICY "Service role can insert leads"
  ON public.leads FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can read leads"
  ON public.leads FOR SELECT
  USING (auth.role() = 'service_role');
