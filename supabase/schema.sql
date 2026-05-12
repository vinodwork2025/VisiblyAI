-- VisiblyAI / CiteCheck — Supabase Schema
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
