-- Admin dashboard / CMS / analytics schema for efraimjames-web.
-- Idempotent schema definition: safe to run multiple times in the Supabase SQL Editor or via CLI.
-- See C:\Users\windows11\.claude\plans\lovely-crafting-wilkinson.md for the full plan this implements.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Content tables
-- ---------------------------------------------------------------------------

create table if not exists projects (
  id              text primary key,
  title           text not null,
  card_title      text,
  description     text not null,
  full_description text not null,
  image_url       text not null,
  tags            text[] not null default '{}',
  category        text not null,
  link            text not null default '#',
  year            text not null,
  client          text not null,
  role            text not null,
  section         text not null check (section in ('featured', 'collaborative', 'other')),
  display_order   integer not null default 0,
  created_at      timestamptz not null default now()
);

create table if not exists work_history (
  id             uuid primary key default gen_random_uuid(),
  period         text not null,
  role           text not null,
  company        text not null,
  location       text not null,
  description    text not null,
  skills         text[] not null default '{}',
  -- array of {name, url, logo_url, logo_scale?}
  project_links  jsonb not null default '[]',
  display_order  integer not null default 0,
  created_at     timestamptz not null default now()
);

create table if not exists hero_toolkit (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  -- key into a curated whitelist mapped in code to an actual icon component + color.
  -- never render this as arbitrary markup/code.
  icon_key       text not null,
  display_order  integer not null default 0
);

create table if not exists hero_content (
  id                 smallint primary key default 1 check (id = 1),
  badge_text         text not null,
  heading_line1      text not null,
  heading_line2      text not null,
  subheading         text not null,
  cta_primary_label  text not null,
  cta_secondary_label text not null,
  resume_url         text,
  resume_filename    text default 'CV-EFRAIM-JAMES-2026.pdf'
);

create table if not exists about_content (
  id           smallint primary key default 1 check (id = 1),
  paragraph_1  text not null,
  paragraph_2  text not null,
  tags         text[] not null default '{}'
);

create table if not exists site_settings (
  id                      smallint primary key default 1 check (id = 1),
  contact_email           text not null,
  contact_phone_display   text not null,
  contact_whatsapp_digits text not null,
  contact_location_short  text not null,
  contact_location_full   text not null,
  social_github           text not null default '',
  social_linkedin         text not null default '',
  social_behance          text not null default '',
  footer_tagline          text not null default '',
  copyright_text          text not null default ''
);

-- Fixed set of 6 — each id maps to a hand-built "visual" mini-animation in code
-- (CodeVisual, ChartVisual, ...). Only the copy/CTA fields are CMS-editable.
create table if not exists capabilities (
  id          smallint primary key check (id between 1 and 6),
  title       text not null,
  description text not null,
  cta_label   text not null,
  cta_target  text not null
);

-- Generic "add a new section" content block (heading + markdown + optional image/button).
create table if not exists custom_sections (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  body_markdown  text not null default '',
  image_url      text,
  cta_label      text,
  cta_url        text,
  enabled        boolean not null default true,
  created_at     timestamptz not null default now()
);

-- Single ordered list driving the home page: one row per fixed section component
-- (block_key = 'hero', 'projects', ...) or per custom section (block_key = 'custom:<uuid>').
create table if not exists page_blocks (
  id             uuid primary key default gen_random_uuid(),
  block_key      text not null unique,
  enabled        boolean not null default true,
  display_order  integer not null default 0
);

-- ---------------------------------------------------------------------------
-- Analytics
-- ---------------------------------------------------------------------------

create table if not exists analytics_events (
  id          bigint generated always as identity primary key,
  session_id  text not null,
  event_type  text not null check (event_type in ('pageview', 'resume_download', 'contact_submit', 'project_click')),
  path        text,
  referrer    text,
  device_type text,
  browser     text,
  os          text,
  country     text,
  project_id  text,
  created_at  timestamptz not null default now()
);

create index if not exists analytics_events_created_at_idx on analytics_events (created_at);
create index if not exists analytics_events_event_type_idx on analytics_events (event_type);
create index if not exists analytics_events_path_idx on analytics_events (path);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- Content tables: anyone can read (anon key, powers the public site); only an
-- authenticated session (there is exactly one admin account) can write.
-- analytics_events: RLS enabled with NO policies at all, for anon or authenticated
-- — so neither role can read or write it directly. All access goes through the
-- api/track.ts and api/analytics-summary.ts Vercel functions using the
-- service_role key, which bypasses RLS entirely by design.

do $$
declare
  t text;
begin
  for t in select unnest(array[
    'projects', 'work_history', 'hero_toolkit', 'hero_content',
    'about_content', 'site_settings', 'capabilities', 'custom_sections', 'page_blocks'
  ])
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "public read" on %I', t);
    execute format('create policy "public read" on %I for select using (true)', t);
    execute format('drop policy if exists "authenticated insert" on %I', t);
    execute format('create policy "authenticated insert" on %I for insert to authenticated with check (true)', t);
    execute format('drop policy if exists "authenticated update" on %I', t);
    execute format('create policy "authenticated update" on %I for update to authenticated using (true) with check (true)', t);
    execute format('drop policy if exists "authenticated delete" on %I', t);
    execute format('create policy "authenticated delete" on %I for delete to authenticated using (true)', t);
  end loop;
end $$;

alter table analytics_events enable row level security;

-- ---------------------------------------------------------------------------
-- Structural seed data (fixed rows that always exist; content-heavy seeding —
-- projects, work_history, hero_toolkit, image uploads — happens in the
-- separate seed script once Storage is set up).
-- ---------------------------------------------------------------------------

insert into page_blocks (block_key, display_order, enabled) values
  ('hero', 0, true),
  ('what-i-can-do', 1, true),
  ('projects', 2, true),
  ('collaborative-projects', 3, true),
  ('other-projects', 4, false),
  ('lets-talk', 5, true),
  ('about', 6, true),
  ('work-history', 7, true),
  ('contact', 8, true)
on conflict (block_key) do nothing;

insert into capabilities (id, title, description, cta_label, cta_target) values
  (1, 'Frontend Engineering',
      'Fast, accessible, type-safe interfaces with React, Next.js and TypeScript — component architecture that stays maintainable as your product grows.',
      'See my work', '#projects'),
  (2, 'Dashboards & Data UIs',
      'Analytics views, charts and role-based interfaces, like the platforms I shipped at Social Intelligence Lab.',
      'See my experience', '#work-history'),
  (3, 'Design-to-Code',
      'A UI/UX background means Figma designs turn into pixel-accurate, reusable components and design-system patterns.',
      'About me', '#about'),
  (4, 'API & Backend Integration',
      'Wiring the frontend to real data: REST APIs, authentication flows and managed backends such as Supabase, Convex and Clerk.',
      'See my experience', '#work-history'),
  (5, 'Performance & Accessibility',
      'Responsive, keyboard-friendly pages that load quickly and work for everyone, on every screen size.',
      'See my work', '#projects'),
  (6, 'AI-Assisted Development',
      'I use Claude Code and Codex to ship faster, then review, test and polish everything by hand so quality never slips.',
      'Let''s talk', '#contact')
on conflict (id) do nothing;

insert into hero_content (id, badge_text, heading_line1, heading_line2, subheading, cta_primary_label, cta_secondary_label) values (
  1,
  'Available for Work',
  'Frontend ',
  'Engineer',
  'Three years of building fast and responsive web apps with React, and NextJS, combining strong UI/UX with AI-driven development.',
  'View My Work',
  'Download Resume'
)
on conflict (id) do nothing;

insert into about_content (id, paragraph_1, paragraph_2, tags) values (
  1,
  'I''m a Frontend Engineer with a background in UI/UX design. I build responsive, accessible web applications with React and TypeScript from creator analytics dashboards and reporting tools to booking platforms and marketing sites.',
  'Having designed interfaces before building them, I bring a designer''s eye to the code: clear information hierarchy, reusable component patterns, and polished interactions backed by thorough QA and close collaboration with product and engineering teams.',
  array['Frontend Development', 'React & TypeScript', 'Dashboards & Web Apps', 'UI/UX Design']
)
on conflict (id) do nothing;

-- Reconciles the three conflicting copies found in Contact.tsx / ContactPage.tsx /
-- Footer.tsx into one canonical row. Edit via the CMS after seeding if these
-- aren't the values you want to keep.
insert into site_settings (
  id,
  contact_email, contact_phone_display, contact_whatsapp_digits,
  contact_location_short, contact_location_full,
  social_github, social_linkedin, social_behance,
  footer_tagline, copyright_text
) values (
  1,
  'efraimjamestalucod88@gmail.com',
  '(+63) 965 639 4996',
  '639656394996',
  'Philippines',
  'Zamboanga City, Philippines, 7000',
  'https://github.com/Hotpotato02133',
  'https://www.linkedin.com/in/efraim-james-talucod-065959244/',
  'https://www.behance.net/efraimjames',
  'Creating digital experiences that blend innovation with aesthetics. Let''s build something extraordinary together.',
  '© 2026 Efraim James Portfolio.'
)
on conflict (id) do nothing;
