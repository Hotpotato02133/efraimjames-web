---
name: portfolio-content
description: Step-by-step workflows for routine changes to this portfolio site — adding a project, adding a home section or route, styling conventions, configuring Web3Forms, updating the resume, and the pre-finish checklist. Use when making content or structural changes to efraimjames-web.
---

# Portfolio content & maintenance workflows

## Add a new project
1. Put the image in `src/assets/` and `import` it at the top of `src/data/projects.ts`.
2. Append an object to the `projects` array with a unique kebab-case `id`.
3. To feature it, add its exact `title` to `featuredProjectTitles` in **both** `components/Projects.tsx` and `components/OtherProjects.tsx`.

## Content changes (projects, experience, services, contact info)
These are plain data edits — find the array in the relevant file (`data/projects.ts`, `WorkHistory.tsx`, `WhatICanDo.tsx`, `Hero.tsx` toolkit, `Contact.tsx`/`Footer.tsx`/`ContactPage.tsx` contact details). Contact details are duplicated across those three files — update all of them.

## New home section
Create `src/components/Name.tsx` with a `<section id="kebab-id" className="py-24 lg:py-32 bg-...">`, use the standard gradient heading and Framer `whileInView` reveal, add it to the `<main>` list in `App.tsx`, and add a nav item in `Header.tsx`/`Footer.tsx` if it should be linked.

## New route
Add a `<Route>` in `App.tsx`; include `<Header />` and `<Footer />` in the page component like the existing pages.

## Styling
Stick to the green/emerald/teal accent and slate/stone neutrals; extend `tailwind.config.js` for new tokens rather than hard-coding hex values.

## Before finishing any change
Run `npm run lint`, `npx tsc -b` (the build doesn't type-check), and `npm run build`. Visually check the change at mobile (<640px), tablet (`md`), and desktop (`lg+`) — the header switches to the hamburger below `lg` (1024px).

## Updating the resume
Replace the PDF in `src/assets/`, then update the import and the `link.download` filename in `Hero.tsx`.

## Configuring Web3Forms
1. Obtain a free key at web3forms.com by entering `efraimjamestalucod88@gmail.com`.
2. Set `VITE_WEB3FORMS_ACCESS_KEY=<key>` in `.env` (gitignored; template in `.env.example`).
3. Also set this environment variable in your hosting provider (Vercel, Netlify, etc.) settings for production builds.
