-- Migration 0003: Add resume_url and resume_filename to hero_content
-- Safe to run multiple times in the Supabase SQL Editor.

alter table hero_content
  add column if not exists resume_url text,
  add column if not exists resume_filename text default 'CV-EFRAIM-JAMES-2026.pdf';

