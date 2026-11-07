---
name: portfolio-content
description: Step-by-step workflows for routine changes to this portfolio site — adding/editing content via the admin CMS, adding a new home section or route, styling conventions, configuring Web3Forms/Supabase env vars, updating the resume, and the pre-finish checklist. Use when making content or structural changes to efraimjames-web.
---

# Portfolio content & maintenance workflows

**Content now lives in Supabase, not in code.** Projects, work history, hero toolkit, about copy, contact/social info, and section order/visibility are all editable at `/admin` (admin login required) — see `AGENTS.md` §16–18 for the full architecture. Only reach for a code change when the task is genuinely structural (a new bespoke component, a new route, styling). If a user asks to "add a project" or "update my phone number," that's an admin-panel task, not a code edit.

## Add/edit a project
Go to `/admin/projects` (logged in): create/edit a row, upload the image there (goes to Supabase Storage), set `section` (`featured`/`collaborative`/`other`) and `display_order` to control where it appears — no more hard-coded title-matching arrays. Public pages (`Projects.tsx`, `CollaborativeProjects.tsx`, `OtherProjects.tsx`, `ProjectDetails.tsx`) pick this up automatically via `src/lib/content.ts`.

## Edit work history, hero toolkit, about copy, contact/social info
`/admin/work-history`, `/admin/hero-about`, `/admin/site-settings` respectively. `site_settings` is the single canonical source for contact/social — editing it there updates `Contact.tsx`, `ContactPage.tsx`, and `Footer.tsx` consistently (they used to drift out of sync as three separate hard-coded copies; that's fixed now).

## Toggle/reorder home sections, add a generic new section
`/admin/sections`: toggle/reorder the fixed sections (drives `page_blocks`), or create a new `custom_sections` block (heading + minimal markdown + optional image/button) and enable it. This covers "add a section" for content-only needs. It does **not** cover a bespoke new React component with its own layout/animation — that's the "New home section" code workflow below.

## New home section (bespoke component, not a CMS block)
Create `src/components/Name.tsx` with a `<section id="kebab-id" className="py-24 lg:py-32 bg-...">`, use the standard gradient heading and Framer `whileInView` reveal. Add it to `App.tsx`'s `COMPONENT_REGISTRY` map under a new `block_key`, then insert a matching row into `page_blocks` (via `/admin/sections` or a one-off SQL insert) so it actually renders. Add a nav item in `Header.tsx`/`Footer.tsx` if it should be linked.

## New route
Add a `<Route>` in `App.tsx`; include `<Header />` and `<Footer />` in the page component like the existing pages. If it needs data, add a getter to `src/lib/content.ts` (wrapped in `cached()`, with a fallback-array branch) rather than querying Supabase directly from the component.

## Styling
Stick to the green/emerald/teal accent and slate/stone neutrals; extend `tailwind.config.js` for new tokens rather than hard-coding hex values.

## Before finishing any change
Run `npm run lint`, `npx tsc -b` (the build doesn't type-check; `api/*.ts` and `vite.config.ts` are covered via `tsconfig.node.json`), and `npm run build`. Admin pages must use the shared kit in `src/admin/components/ui.tsx` (plus `useToast`/`useConfirm`/`Drawer`/`ImageUpload`) rather than ad-hoc inputs or `window.confirm`. Visually check the change at mobile (<640px), tablet (`md`), and desktop (`lg+`) — the header switches to the hamburger below `lg` (1024px). For admin-page changes, also check the admin UI at mobile width — it's used less often but should still not break.

## Updating the resume
Replace the PDF in `src/assets/`, then update the import and the `link.download` filename in `Hero.tsx`.

## Configuring Web3Forms
1. Obtain a free key at web3forms.com by entering `efraimjamestalucod88@gmail.com`.
2. Set `VITE_WEB3FORMS_ACCESS_KEY=<key>` in `.env` (gitignored; template in `.env.example`).
3. Also set this environment variable in Vercel's **Project Settings → Environment Variables** — a local `.env` never reaches the deployed build.

## Configuring Supabase env vars (new deployment or key rotation)
1. `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (client-safe, publishable key) and `SUPABASE_SERVICE_ROLE_KEY` (server-only secret key, used by `api/*.ts`) all go in `.env` locally and in Vercel's **Project Settings → Environment Variables** for production.
2. In Vercel's env-var UI, a `VITE_`-prefixed variable can't be marked "Sensitive" (the prefix bakes it into the public bundle regardless) — use the plain/Config type for the two `VITE_` vars, and Sensitive/Secret for `SUPABASE_SERVICE_ROLE_KEY`.
3. Vite inlines `VITE_*` vars at **build time**. After adding or changing any of these in Vercel, you must trigger **Deployments → Redeploy** — just saving the env var does not rebuild the site.
4. Never commit `.env` or any of these keys.

## Adding a new content table / CMS field
This is a backend change, not a content edit: write a SQL migration under `supabase/migrations/`, add RLS policies matching the existing pattern (public `SELECT`, `authenticated`-only writes), add a getter to `content.ts` + fallback entry in `fallback.ts`, add CRUD to `adminApi.ts`, and build/extend the relevant admin page. Verify RLS directly (anon key insert should be rejected) before considering it done — don't rely on the UI hiding buttons as the security boundary.
