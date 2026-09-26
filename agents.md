# agents.md — Efraim James Portfolio

Context for AI coding agents working in this repository. Everything below was verified against the source code; if the code and this file disagree, trust the code and update this file.

---

## 1. Project Overview

| | |
|---|---|
| **Name** | Efraim James Portfolio (`package.json` name is still the template default `vite-react-typescript-starter`, version `0.0.0`) |
| **Owner** | Efraim James Talucod — Frontend Developer with a UI/UX design background, Zamboanga City, Philippines |
| **Type** | Personal portfolio — static single-page app (SPA) with client-side routing |
| **Stack** | React 18 + TypeScript + Vite 6 + Tailwind CSS 3 + Framer Motion |
| **Positioning** | Frontend Developer first, UI/UX design as a supporting strength. Hero headline is **"Frontend Developer"**; page `<title>` is "Efraim James - Frontend Developer". Keep new copy in this voice. |
| **Default branch** | `master` |

The site presents: a hero with toolkit marquee and resume download, service offerings, featured and other projects (each with its own detail page), an about blurb, a work-history timeline, and a contact form wired to EmailJS.

---

## 2. Tech Stack

### Runtime dependencies
| Package | Version | Used for |
|---|---|---|
| `react`, `react-dom` | ^18.3.1 | UI |
| `react-router-dom` | ^6.8.0 | Routing (`BrowserRouter`, `Routes`, `Link`, `useNavigate`, `useParams`, `useLocation`) |
| `framer-motion` | ^12.19.1 | Scroll-reveal animations, marquee, scroll-linked timeline line |
| `lucide-react` | ^0.344.0 | Primary icon set |
| `react-icons` | ^5.5.0 | Brand/tech logos in the Hero toolkit (`react-icons/fa`, `react-icons/si`) |
| `@emailjs/browser` | ^4.4.1 | Sending contact-form submissions |

### Dev dependencies
Vite ^6.3.5, `@vitejs/plugin-react` ^4.3.1, TypeScript ^5.5.3, Tailwind CSS ^3.4.1, PostCSS ^8.4.35, Autoprefixer ^10.4.18, ESLint ^9.9.1, `typescript-eslint` ^8.3.0, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`.

### Fonts
- **Plus Jakarta Sans** (200–800, incl. italics) — imported in `src/index.css`; the default `sans` font in Tailwind and forced on `*` in `@layer base`.
- **Instrument Serif** — loaded in `index.html`, mapped to Tailwind `font-serif`.
- **Inter** — loaded in `index.html` but not referenced anywhere (dead weight).

---

## 3. Scripts

```bash
npm run dev       # Vite dev server (http://localhost:5173)
npm run build     # Production build -> dist/   (note: runs `vite build` only, no `tsc` type-check)
npm run preview   # Serve the built dist/ locally
npm run lint      # ESLint over the project
```

There is **no test framework** configured. To type-check, run `npx tsc -b` (or `npx tsc -p tsconfig.app.json`).

---

## 4. Directory Structure

```
efraimjames-web/
├── index.html                 # HTML shell: meta, Google Fonts, favicon, dark-mode flash script
├── package.json
├── vite.config.ts             # react() plugin; optimizeDeps.exclude: ['lucide-react']
├── tailwind.config.js         # Theme extensions (fonts, colors, animations, gradients)
├── postcss.config.js          # tailwindcss + autoprefixer
├── eslint.config.js           # Flat config: js + typescript-eslint recommended, react-hooks, react-refresh
├── tsconfig.json              # References tsconfig.app.json + tsconfig.node.json
├── tsconfig.app.json          # strict, noUnusedLocals/Parameters, bundler resolution, jsx: react-jsx
├── tsconfig.node.json
├── README.md                  # Unmodified Vite template README
├── agents.md                  # This file
├── public/
│   ├── Logo1.png              # Logo + favicon (referenced as "/Logo1.png")
│   ├── CV-EFRAIM-JAMES-TALUCOD.pdf   # Older CV — not referenced by code
│   └── vite.svg               # Template leftover
└── src/
    ├── main.tsx               # Entry: StrictMode > BrowserRouter > App
    ├── App.tsx                # Routes + home page section order
    ├── index.css              # Tailwind layers, global styles, scrollbar, custom utilities
    ├── vite-env.d.ts          # Vite client types + `declare module '*.pdf'`
    ├── data/
    │   └── projects.ts        # Project type, all project data, lookup helpers
    ├── hooks/
    │   └── useDarkMode.ts     # Dark-mode hook (currently unused)
    ├── components/
    │   ├── Header.tsx
    │   ├── Hero.tsx
    │   ├── WhatICanDo.tsx
    │   ├── Projects.tsx
    │   ├── OtherProjects.tsx
    │   ├── LetsTalkMarquee.tsx
    │   ├── About.tsx
    │   ├── WorkHistory.tsx
    │   ├── Contact.tsx
    │   ├── Footer.tsx
    │   ├── InfiniteMarquee.tsx
    │   └── Skills.tsx         # Legacy "Services" section — not rendered anywhere
    ├── pages/
    │   ├── ContactPage.tsx    # /contact
    │   └── ProjectDetails.tsx # /project/:id
    └── assets/                # Images + current CV PDF (imported via ES modules)
```

---

## 5. Routing

Defined in `src/App.tsx` (router provided in `src/main.tsx`):

| Path | Element | Notes |
|---|---|---|
| `/` | Inline home layout | Full single-page portfolio |
| `/contact` | `pages/ContactPage.tsx` | Standalone contact page with its own Header/Footer |
| `/project/:id` | `pages/ProjectDetails.tsx` | `id` matches `Project.id` in `data/projects.ts`; shows "Project Not Found" fallback for unknown ids |

There is no catch-all/404 route. `App` wraps everything in a div that fades from `opacity-0` to `opacity-100` (1000 ms) on mount.

> **Deployment note:** because this uses `BrowserRouter`, the host must rewrite unknown paths to `index.html` (e.g. Vercel/Netlify SPA rewrite) or deep links like `/project/leafly` will 404 on refresh.

### Home page section order (`/`)

Rendered inside `bg-stone-50 text-gray-900` with a fixed, faint green dot-pattern SVG background:

| # | Component | Section `id` | Background |
|---|---|---|---|
| — | `Header` | — (fixed, `z-50`) | transparent |
| 1 | `Hero` | `#home` | `hero-bg.png` + dot pattern + blurred emerald/blue blobs |
| 2 | `WhatICanDo` | `#what-i-can-do` | `bg-stone-50` |
| 3 | `Projects` | `#projects` | `bg-stone-50` |
| 4 | `OtherProjects` | `#other-projects` | `bg-white` |
| 5 | `LetsTalkMarquee` | — | `bg-stone-50` |
| 6 | `About` | `#about` | `bg-white` |
| 7 | `WorkHistory` | `#work-history` | `bg-white` |
| 8 | `Contact` | `#contact` | `contact-bg.png` |
| — | `Footer` | — | `bg-white` |

---

## 6. Components

### `Header.tsx`
- Fixed, transparent header. Left: `/Logo1.png` + "Efraim James" in a green→emerald gradient text; clicking navigates to `/`.
- Desktop (`lg+`): centered glass pill nav (`bg-white/10 backdrop-blur-md`) with items **Home, About, Projects, What I Can Do** (`#home`, `#about`, `#projects`, `#what-i-can-do`), animated underline on hover; right-side **"Let's Talk"** gradient CTA → `/contact`.
- Mobile/tablet (`< lg`): hamburger (`Menu`/`X`) toggles a collapsible frosted panel (`max-h-0` ↔ `max-h-96`) containing the same items plus a "Contact Me" button. Menu closes after any click.
- `handleNavClick`: on `/contact` it calls `navigate('/' + href)`; everywhere else it `scrollIntoView({ behavior: 'smooth' })` on the section.

### `Hero.tsx`
- Badge pill "React · TypeScript · UI/UX Background", then headline **"Frontend / *Developer*"** ("Developer" on its own line, italic emerald→teal gradient). The subtitle is about building React/TypeScript apps with a UI/UX eye.
- Buttons: **View My Work** (smooth-scroll to `#projects`) and **Download Resume**.
- Resume download: imports `../assets/CV-EFRAIM-JAMES-2026.pdf`, fetches it as a blob and triggers a download named `CV-EFRAIM-JAMES-2026.pdf`; on failure falls back to `window.open` in a new tab (mobile-friendly approach).
- **"My Toolkit"** marquee (`InfiniteMarquee`, speed 80), ordered frontend → backend/services → design: React, Next.js, TypeScript, JavaScript, Tailwind CSS, HTML5, CSS3, Git, Supabase, Convex, MySQL, Clerk, Figma, Canva. Icons come from `react-icons`, except Convex, which is an inline SVG component (`ConvexIcon`) in the same file.
- Staggered entrance via an `isVisible` flag set after 300 ms and Tailwind `transition-all delay-*` classes. Bouncing `ArrowDown` scroll indicator.

### `WhatICanDo.tsx` (services)
Three Framer-Motion stagger-revealed cards, each with a Lucide icon, number, title, description, 5 bullet skills, and a CTA button that smooth-scrolls to its `target` section:
1. **Frontend Development** (`Code2`) — React & Next.js, TypeScript & JavaScript, Tailwind CSS & Responsive Layouts, REST API & Backend Integration, Performance & Accessibility → `#projects`
2. **Dashboards & Web Apps** (`LayoutDashboard`) — Analytics & Reporting Dashboards, Interactive Charts & Data Views, Role-Based Views & Route Guards, Auth/Onboarding & Account Flows, Reusable Component Patterns → `#work-history`
3. **UI/UX-Driven Implementation** (`PenTool`) — Figma to Production Code, Design Systems & Component Libraries, Wireframing & Prototyping, UX Research & Usability Testing, Functional QA & UI Polish → `#about`

Hover: top emerald→teal bar scales in, icon tile turns solid emerald. Variants are typed with Framer Motion's `Variants`.

### `Projects.tsx` (Featured Projects)
- Filters `projects` by a hard-coded title list: **Facundo Booking, Leafly, Broadheader, OFBank Mobile**.
- 2-column grid of 400 px image cards with a glassmorphism info box (title + category + `ArrowUpRight`); each card is a `<Link>` to `/project/:id`. Image zooms on hover.

### `OtherProjects.tsx`
- Every project **not** in the featured list (duplicates the same title array — keep both in sync).
- Shows 4 by default; a **View All Projects / Show Less Work** toggle appears when there are more than 4. Same card design as `Projects`.

### `LetsTalkMarquee.tsx`
Large, faint uppercase **"LET'S TALK +++"** text repeated 6×, scrolling via `InfiniteMarquee` (speed 40). Purely decorative.

### `About.tsx`
"About Me" heading, two paragraphs (a Frontend Developer with a UI/UX background who builds React/TypeScript dashboards and web apps), and tag pills: Frontend Development, React & TypeScript, Dashboards & Web Apps, UI/UX Design.

### `WorkHistory.tsx`
Vertical timeline with a scroll-linked gradient line (`useScroll` on the timeline container → `useSpring` → `scaleY`, transform-only), cards alternating left/right on `md+` (content always left-aligned), single column on mobile. Cards fade up once in view.

Each entry is an `Experience` (typed in the file): `period`, `role`, `company`, `location`, `description` (a single short paragraph — kept the same length across all entries), optional `projects` (`{ name, url, description }`), and `skills` tags.

Only entries with `projects` render a small "N Projects" pill under the company/location row. Hovering or focusing that pill (`group/emp` + `group-hover/focus-within`) smoothly expands a panel of project link-cards below it using a CSS `grid-template-rows: 0fr → 1fr` transition (no layout jump, no JS state); the chevron on the pill rotates in sync. This keeps the always-visible card the same shape across entries and reveals project detail on demand instead of inline.

| Period | Role | Company | Location | Tags |
|---|---|---|---|---|
| Mar 2026 – Sep 2026 | Frontend Developer | Undisclosed Group / Social Intelligence Lab — hover reveals Yolk (useyolk.com), Inspo Web (findinspo.co) | Remote · New York, USA | Frontend Dev, Dashboards, Data Visualization, Role-Based UI, QA Testing, Git |
| Nov 2024 – Feb 2026 | UI/UX Designer | Broadheader | Remote · Angeles City, Pampanga, PH | UI/UX, Frontend Dev, React / Vite, REST APIs |
| Aug 2024 – Jan 2025 | Web Designer | Business Partner Group | Remote · Brisbane, Australia | Web Design, UX Writing, Frontend Dev, QA |
| Oct 2023 – Sep 2024 | Frontend Developer | ORO Business Group | Onsite · Zamboanga City, PH | JavaScript, React, Git, Agile |

### `Contact.tsx` (inline section on `/`)
- Reveal driven by an `IntersectionObserver` (threshold 0.1) rather than Framer Motion.
- Left: contact cards — **Email** `efraimjamestalucod88@gmail.com`, **WhatsApp** `(+63) 965 639 4996` (`wa.me` link with prefilled message), **Location** Zamboanga City, Philippines (Google Maps link).
- Right: EmailJS form (see §8). Green-gradient submit with idle / "Sending..." spinner / "Message Sent!" states; resets 3 s after success.

### `Footer.tsx`
- Brand block with tagline and social links: **GitHub** `github.com/Hotpotato02133`, **LinkedIn** `linkedin.com/in/efraim-james-talucod-065959244/`, **Behance** `behance.net/efraimjames`.
- Quick Links (About, Projects, What I Can Do, Contact) — smooth-scroll only.
- "Get In Touch" block (email, phone, "Zamboanga City, Philippines, 7000") + "Let's talk" button → `/contact`.
- Copyright: "© 2026 Efraim James Portfolio."

### `InfiniteMarquee.tsx` (reusable)
```ts
interface InfiniteMarqueeProps {
  children: React.ReactNode;
  speed?: number;               // seconds per loop (higher = slower), default 50
  direction?: 'left' | 'right'; // default 'left'
  className?: string;
}
```
Renders `children` twice inside a `motion.div` animating `x` from `0%` → `-100%` (or reverse) on an infinite linear loop.

### `Skills.tsx` — unused
An older "Services" section (`#skills`: UI/UX Design, Graphic Design, Development). Superseded by `WhatICanDo` and not imported anywhere. Safe to delete or reuse.

---

## 7. Pages

### `pages/ContactPage.tsx` (`/contact`)
- Component is internally named `Contact` (same as the section component) but default-exported and imported as `ContactPage`.
- Reuses `Header` and `Footer`. Two-column layout: form card (left on desktop) and `contact-page-img.png` with a floating stats card — **24h Response Time**, **100% Satisfaction** (right on desktop, top on mobile).
- Form fields match the inline form; focus rings are **blue** here (vs. green in the section). Includes a "privacy policy" link that points to `#`.
- Bottom row: Email / Phone / Location ("Philippines").

### `pages/ProjectDetails.tsx` (`/project/:id`)
- Looks up the project via `getProjectById(id)`; scrolls to top when `id` changes.
- Shows: back button (`navigate('/#projects')`), 16:9 hero image, category badge, title, meta row (year / client / role), "About the Project" (`fullDescription`), "Technologies & Skills" tag pills, **View Live Project** button (hidden when `link === '#'`), and up to 3 **Related Projects** from the same `category` via `getRelatedProjects`.

---

## 8. Data Layer — `src/data/projects.ts`

The single source of truth for project content.

```ts
export interface Project {
  id: string;              // URL slug for /project/:id
  title: string;           // Also used for featured filtering — renaming breaks it
  description: string;     // Short blurb
  fullDescription: string; // Detail-page body
  image: string;           // Imported asset from src/assets
  tags: string[];
  category: string;        // 'UI/UX Design' | 'Web Design' | 'Frontend' | 'Graphic Design'
  link: string;            // External URL, or '#' to hide the "View Live Project" button
  year: string;
  client: string;
  role: string;
}

export const projects: Project[];
export const getProjectById: (id: string) => Project | undefined;
export const getRelatedProjects: (currentId: string, category: string, limit?: number /* 3 */) => Project[];
```

### Current projects (14, in array order)

| id | Title | Category | Year | Image | Link | Featured |
|---|---|---|---|---|---|---|
| `facundo` | Facundo Booking | UI/UX Design | 2024 | Facundo-cover.png | `#` | ✅ |
| `leafly` | Leafly | UI/UX Design | 2024 | Leafly-cover.png | `#` | ✅ |
| `broadheader` | Broadheader | UI/UX Design | 2024 | Broadheader.jpg | broadheader.com | ✅ |
| `veloura` | Veloura | Web Design | 2024 | service-1c.jpg | Behance | |
| `oro-dashboard` | ORO Dashboard | Frontend | 2024 | service-2b.png | orowonder.vercel.app | |
| `buenas-coffee` | Buenas Coffee | Web Design | 2023 | service-1b.jpg | Behance | |
| `car-rental-ph` | Car Rental PH | Frontend | 2023 | service-2a.png | car-rental-alpha-bice.vercel.app | |
| `hyde-learning` | Hyde Learning | Web Design | 2023 | service-1a.jpg | Behance | |
| `oro-landing` | ORO Landing | Frontend | 2023 | service-2c.png | react-landing-page-or-ov2.vercel.app | |
| `ofbank-mobile` | OFBank Mobile | UI/UX Design | 2023 | service-3a.jpg | Behance | ✅ |
| `logo-design` | Logo Design | Graphic Design | 2023 | service-4a.jpg | Behance | |
| `travelista` | Travelista | UI/UX Design | 2023 | service-3b.jpg | Behance | |
| `poster-design` | Poster Design | Graphic Design | 2023 | service-4b.jpg | Behance | |
| `banner-design` | Banner Design | Graphic Design | 2024 | service-4d.jpg | Behance | |

### How to add a project
1. Put the image in `src/assets/` and `import` it at the top of `projects.ts`.
2. Append an object to `projects` with a unique kebab-case `id`.
3. To feature it, add its exact `title` to `featuredProjectTitles` in **both** `components/Projects.tsx` and `components/OtherProjects.tsx`.

---

## 9. Contact Form / EmailJS

Both `components/Contact.tsx` and `pages/ContactPage.tsx` use identical logic:

- `emailjs.init(VITE_EMAILJS_PUBLIC_KEY)` on mount, then `emailjs.sendForm(serviceId, templateId, formRef.current!, publicKey)`.
- Visible fields: `firstName`*, `lastName`*, `email`*, `phone` (with fixed 🇵🇭 +63 prefix), `project`* (textarea). `*` = required.
- Hidden mirror inputs are submitted for the EmailJS template: **`first_name`, `last_name`, `user_email`, `user_phone`, `project_details`**. If you rename a visible field, keep its hidden twin in sync, and keep the template variables matching these names.

### Environment variables (`.env`, gitignored, not committed)

```env
VITE_EMAILJS_PUBLIC_KEY=...
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_CONTACT_TEMPLATE_ID=...   # code falls back to "template_orw5xze"
```

Without them the code falls back to placeholder strings (`YOUR_PUBLIC_KEY`, `YOUR_SERVICE_ID`) and submissions will fail with the "Failed to send message" error. These must also be set in the hosting provider's env settings for production builds.

---

## 10. Styling System

### Tailwind (`tailwind.config.js`)
- `content`: `./index.html`, `./src/**/*.{js,ts,jsx,tsx}`
- **Fonts**: `sans` → Plus Jakarta Sans; `serif` → Instrument Serif.
- **Colors**:
  - `primary-50…900` — a **cyan** scale (`primary-500` = `#06b6d4`). Defined but essentially unused; the actual brand accent is Tailwind's built-in **green / emerald / teal**.
  - `deep-black #0a0a0a`, `rich-black #121212`, `void-black #080808` (unused).
- **Animations**: `animate-fade-in`, `animate-slide-up`, `animate-bounce-slow`, `animate-pulse-glow` (cyan glow).
- **Other**: `backdrop-blur-xs` (2px); backgrounds `bg-gradient-radial`, `bg-gradient-conic`, `bg-gradient-black`, `bg-gradient-void`.

### Visual language actually used
- **Page backgrounds** alternate `bg-stone-50` and `bg-white`.
- **Text**: `slate-900` headings, `slate-600` / `gray-600` body.
- **Section headings**: `text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-emerald-700 to-green-700 bg-clip-text text-transparent` — reuse this exact class set for new sections.
- **Primary CTAs**: `bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-full` + `hover:shadow-green-500/25`.
- **Secondary/dark CTAs**: `bg-slate-900 text-white rounded-full hover:-translate-y-1`.
- **Cards**: `rounded-2xl`/`rounded-3xl`, `border-slate-100`, `shadow-sm hover:shadow-xl`, emerald hover accents.
- **Glassmorphism**: `bg-white/10 backdrop-blur-md border-white/20` (nav pill, project card info boxes).
- **Section spacing**: `py-24 lg:py-32`, container `container mx-auto px-4 md:px-6`.

### Global CSS (`src/index.css`)
- Google Fonts import, then `@tailwind base/components/utilities`.
- `html`: smooth scrolling, `overflow-y: scroll` (always-visible scrollbar to avoid layout shift), `overflow-x: hidden`.
- `section { contain: layout style; }` to limit layout shift during animations.
- Custom scrollbar: 6px slate (4px gray on ≤768px); Firefox `scrollbar-width: thin`.
- Utility classes: `.animate-fadeInUp`, `.animate-glow`, `.glass`, `.gradient-text` (cyan→blue), `.glow-border` (animated green border on hover), `.glow-text`, `.marquee-container`, `.xs:hidden` / `.xs:inline` (hand-rolled 475px breakpoint).
- Global `button/a/input/textarea { transition: all 0.3s ease }` and `outline: none` on focus (see a11y notes).
- `::selection` cyan tint.
- **≤640px override**: `h1`, `h2`, `.text-5xl/.text-6xl/.text-7xl` are clamped with `!important` — this overrides responsive Tailwind font sizes on mobile, so mobile heading sizes are controlled here, not by `text-*` classes.
- Several rules are duplicated (html/body/`.container` blocks appear 2–3 times).

### Animation patterns
1. **Framer Motion scroll reveal** (most sections): `initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}` with incremental `delay`.
2. **Stagger variants** (`WhatICanDo`): container `staggerChildren: 0.2`, items fade up 30px.
3. **Tailwind transition + state flag** (`Hero`, `Contact`): toggle `opacity-0 translate-y-8` → `opacity-100 translate-y-0` with `duration-1000 delay-*`.
4. **Scroll-linked** (`WorkHistory`): `useScroll`/`useTransform` drives the timeline fill height.
5. **Infinite marquee** (`InfiniteMarquee`).

---

## 11. Assets

Imported via ES modules from `src/assets/` (Vite fingerprints them). `public/` files are referenced by absolute path (`/Logo1.png`).

**In use**: `hero-bg.png` (Hero), `contact-bg.png` (Contact section), `contact-page-img.png` (ContactPage), `CV-EFRAIM-JAMES-2026.pdf` (resume), `Facundo-cover.png`, `Leafly-cover.png`, `Broadheader.jpg`, `service-1a/1b/1c.jpg`, `service-2a/2b/2c.png`, `service-3a/3b.jpg`, `service-4a/4b/4d.jpg` (project images), `public/Logo1.png` (logo + favicon).

**Not referenced by code** (candidates for cleanup): `Flux.jpg`, `about-img.jpg`, `about-img 1.jpg`, `berkay.jpg`, `bpg.webp`, `carousel-11.jpg`, `carousel-2a.jpg`, `carousel-a.jpg`, `carousel-b.jpg`, `hero-section-sample.png`, `me1.png`, `mockup1.jpeg`, `react.svg`, `service-11/22/33/44.jpg`, `service-4c.png`, `src/assets/Logo1.png` (duplicate of the public one), `public/CV-EFRAIM-JAMES-TALUCOD.pdf`, `public/vite.svg`.

Several project images are large PNGs (e.g. `Leafly-cover.png` ≈ 1.3 MB) — converting to WebP/AVIF would help load time.

**Updating the resume**: replace the PDF in `src/assets/`, then update the import and the `link.download` filename in `Hero.tsx`.

---

## 12. Conventions

- **Components**: `PascalCase.tsx`, one default-exported arrow-function component per file (`const Name = () => { ... }; export default Name;`).
- **Hooks**: `useCamelCase.ts` in `src/hooks/`, named export.
- **Data**: typed arrays + helper functions in `src/data/`.
- **Handlers**: prefixed `handle` (`handleNavClick`, `handleSubmit`, `handleDownloadResume`).
- **Static content** (nav items, toolkit, services, experiences, contact info) lives as local arrays at the top of each component and is rendered with `.map`.
- **Styling**: Tailwind utilities inline; conditional classes via template literals; mobile-first responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`). Occasional inline `style` for background images.
- **Icons**: Lucide for UI icons; `react-icons` only for brand logos.
- **Imports**: Many files still `import React` although the JSX transform doesn't require it; `noUnusedLocals` may flag it — follow the file you're editing.
- Semantic `<section id="...">` for each home section — the `id` is the scroll target used by Header/Footer.

---

## 13. Known Issues & Gotchas

Useful when fixing bugs or extending the site:

1. **Hash navigation from other routes doesn't scroll.** `navigate('/#about')` (Header on `/contact`) and `navigate('/#projects')` (ProjectDetails back button) land on `/` but nothing scrolls to the hash — there's no hash-scroll effect on the home route. It just shows the top of the page.
2. **Header/Footer nav is dead on `/project/:id`.** `Header.handleNavClick` only special-cases `/contact`; on project pages (and in `Footer` on any sub-page) it `querySelector`s a section that doesn't exist, so nothing happens.
3. **Dark mode is half-wired.** `index.html` adds `class="dark"` based on `localStorage.darkMode` / system preference, and `useDarkMode` exists, but the hook is never used, `darkMode` isn't set in `tailwind.config.js` (defaults to `media`), and no `dark:` classes exist. The site is effectively light-only.
4. **`font-jakarta`** is used in `Header` and `Hero` but isn't defined in Tailwind — it's a no-op (the font already applies globally).
5. *(fixed)* `About.tsx` used to nest an `<h2>` inside a `motion.h2`.
6. **Featured list is duplicated** in `Projects.tsx` and `OtherProjects.tsx` and matched by `title`, not `id`.
7. *(fixed)* The CTA buttons in `WhatICanDo` used to do nothing; they now scroll to a section.
8. **Footer social links** don't open in a new tab (no `target="_blank"`), unlike the Contact links.
9. **Accessibility**: global `outline: none` on focused buttons/inputs removes keyboard focus indication (form inputs restore it with `focus:ring`, buttons don't); hamburger button has no `aria-label`.
10. **Mobile heading sizes** are forced by `!important` clamps in `index.css` (≤640px).
11. **SEO**: only a basic `<meta name="description">`; no Open Graph/Twitter tags, sitemap, or per-route titles. The favicon link declares `type="image/svg+xml"` for a PNG.
12. `README.md` is still the Vite template boilerplate.
13. `package.json` `name` is `vite-react-typescript-starter`.

---

## 14. Working in This Repo — Checklist for Agents

1. **Content changes** (projects, experience, services, contact info) are plain data edits — find the array in the relevant file (`data/projects.ts`, `WorkHistory.tsx`, `WhatICanDo.tsx`, `Hero.tsx` toolkit, `Contact.tsx`/`Footer.tsx`/`ContactPage.tsx` contact details). Contact details are duplicated across those three files — update all of them.
2. **New home section**: create `src/components/Name.tsx` with a `<section id="kebab-id" className="py-24 lg:py-32 bg-...">`, use the standard gradient heading and Framer `whileInView` reveal, add it to the `<main>` list in `App.tsx`, and add a nav item in `Header.tsx`/`Footer.tsx` if it should be linked.
3. **New route**: add a `<Route>` in `App.tsx`; include `<Header />` and `<Footer />` in the page component like the existing pages.
4. **Styling**: stick to the green/emerald/teal accent and slate/stone neutrals; extend `tailwind.config.js` for new tokens rather than hard-coding hex values.
5. **Before finishing**: `npm run lint`, `npx tsc -b` (the build doesn't type-check), and `npm run build`. Visually check the change at mobile (<640px), tablet (`md`), and desktop (`lg+`) — the header switches to the hamburger below `lg` (1024px).
6. Never commit `.env` or EmailJS credentials.

---

## 15. Deployment

- `npm run build` → static output in `dist/`.
- Compatible with Vercel / Netlify / any static host; configure an SPA fallback to `index.html` and set the three `VITE_EMAILJS_*` env vars at build time.
- No CI configuration is present in the repository.

---

*Last updated: 2026-09-26 — generated from a full read of the source at commit `1aff116`.*
