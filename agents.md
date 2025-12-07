# Agents.md - Codebase Context for AI Assistants

## Project Overview

**Project Name:** Efraim James Portfolio  
**Type:** Personal Portfolio Website  
**Tech Stack:** React + TypeScript + Vite  
**Styling:** Tailwind CSS  
**Current Version:** 0.0.0

### Description
A modern, responsive portfolio website showcasing Efraim James's work as a Creative Web Designer. Features smooth animations, mobile-first design, and a clean, professional aesthetic with green accent colors.

---

## Technology Stack

### Core Technologies
- **React** 18.3.1 - UI framework
- **TypeScript** 5.5.3 - Type safety
- **Vite** 6.3.5 - Build tool and dev server
- **React Router DOM** 6.8.0 - Client-side routing

### Styling & UI
- **Tailwind CSS** 3.4.1 - Utility-first CSS framework
- **PostCSS** 8.4.35 - CSS processing
- **Autoprefixer** 10.4.18 - CSS vendor prefixing
- **Framer Motion** 12.19.1 - Animation library
- **Plus Jakarta Sans** - Primary font family

### Icons & Assets
- **Lucide React** 0.344.0 - Icon library
- **React Icons** 5.5.0 - Additional icon library

### Forms & Communication
- **EmailJS** 4.4.1 - Email service integration (used in contact form)

### Development Tools
- **ESLint** 9.9.1 - Code linting
- **TypeScript ESLint** 8.3.0 - TypeScript linting rules

---

## Project Structure

```
my-portfolio/
├── public/                      # Static assets
│   ├── Logo1.png               # Logo/favicon
│   └── vite.svg                # Vite icon
├── src/
│   ├── assets/                 # Images and static files
│   │   ├── Efraim_Talucod_Resume_2025.pdf
│   │   ├── about-img.jpg       # About section images
│   │   ├── carousel-*.jpg      # Project carousel images
│   │   ├── service-*.jpg/png   # Service/project screenshots
│   │   ├── Broadheader.jpg     # Hero section image
│   │   └── ...                 # Other images
│   ├── components/             # React components
│   │   ├── About.tsx          # About section
│   │   ├── Contact.tsx        # Contact form section
│   │   ├── Footer.tsx         # Footer with social links
│   │   ├── Header.tsx         # Navigation header
│   │   ├── Hero.tsx           # Landing/hero section
│   │   ├── InfiniteMarquee.tsx # Scrolling text animation
│   │   ├── Projects.tsx       # Projects showcase
│   │   └── Skills.tsx         # Skills display
│   ├── hooks/                  # Custom React hooks
│   │   └── useDarkMode.ts     # Dark mode toggle hook
│   ├── pages/                  # Page components
│   │   └── ContactPage.tsx    # Dedicated contact page
│   ├── App.tsx                # Main app component with routing
│   ├── main.tsx               # Application entry point
│   ├── index.css              # Global styles and Tailwind imports
│   └── vite-env.d.ts          # Vite type definitions
├── .env                        # Environment variables (gitignored)
├── .gitignore                  # Git ignore rules
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration (root)
├── tsconfig.app.json           # TypeScript config for app
├── tsconfig.node.json          # TypeScript config for Node
└── vite.config.ts              # Vite configuration
```

---

## Architecture & Patterns

### Routing Structure
The application uses React Router DOM with two main routes:
- **`/`** - Main portfolio page (single-page layout with all sections)
- **`/contact`** - Dedicated contact page

### Component Organization

#### Layout Components
- **Header**: Sticky navigation with responsive mobile menu, logo, and CTA button
- **Footer**: Social media links and copyright information

#### Section Components (displayed on home route)
- **Hero**: Landing section with main CTA and introduction
- **About**: Personal background and bio
- **Projects**: Portfolio projects showcase
- **Skills**: Technical skills and competencies
- **Contact**: Contact form inline on home page

#### Page Components
- **ContactPage**: Full-page contact form (separate route at `/contact`)

#### Utility Components
- **InfiniteMarquee**: Animated scrolling text component

### State Management
- Local component state using React hooks (`useState`, `useEffect`)
- Custom hooks for reusable logic (`useDarkMode`)
- LocalStorage for theme persistence

### Styling Approach
- **Utility-First**: Tailwind CSS classes directly in JSX
- **Custom Theme**: Extended color palette with green/emerald primary colors
- **Responsive**: Mobile-first design with breakpoints (sm, md, lg, xl)
- **Animations**: Custom Tailwind animations and Framer Motion

### Key Design Patterns
1. **Smooth Scrolling**: Native CSS smooth scroll behavior
2. **Fade-in Effects**: Opacity transitions on component mount
3. **Gradient Backgrounds**: Custom gradient utilities in Tailwind config
4. **Glass Morphism**: Backdrop blur effects on header
5. **Responsive Navigation**: Hamburger menu for mobile, full nav for desktop

---

## Key Features

### 1. Responsive Design
- Mobile-first approach
- Breakpoint-specific styles (sm, md, lg, xl)
- Touch-optimized navigation and interactions

### 2. Animations
- Fade-in on page load
- Smooth scroll navigation
- Hover effects on interactive elements
- Custom pulse and bounce animations
- Framer Motion for complex animations

### 3. Dark Mode Support
- Toggle functionality via `useDarkMode` hook
- LocalStorage persistence
- System preference detection
- Flash prevention on page load

### 4. Contact Integration
- EmailJS integration for form submissions
- Both inline contact form and dedicated contact page
- Validation and user feedback

### 5. Performance Optimizations
- Vite for fast HMR and optimized builds
- Lazy loading considerations
- Optimized asset loading

---

## Color Scheme

### Primary Colors (Green Theme)
- **Primary 500**: `#06b6d4` (cyan)
- **Green 600**: Main brand color
- **Emerald 600**: Accent color
- **Stone 50**: Light background

### Custom Colors
- **Deep Black**: `#0a0a0a`
- **Rich Black**: `#121212`
- **Void Black**: `#080808`

### Usage
- Primary CTAs: Green to emerald gradient
- Hover states: Lighter green variants
- Text: Gray scale from 300-900
- Backgrounds: Stone 50 for light mode

---

## Custom Styling

### Scrollbar
- Custom webkit scrollbar styling
- Thin, minimal design (6px desktop, 4px mobile)
- Gray color scheme matching the design
- Smooth hover transitions

### Typography
- **Font**: Plus Jakarta Sans (Google Fonts)
- **Weights**: 200-800
- **Line Height**: 1.6 for body text
- **Font Smoothing**: Antialiased rendering

### Custom Animations (Tailwind Config)
1. **fade-in**: Simple opacity transition
2. **slide-up**: Vertical slide with fade
3. **bounce-slow**: Slower bounce animation
4. **pulse-glow**: Glowing shadow effect for CTAs

---

## Scripts & Commands

### Development
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Vite Configuration
- **Plugin**: @vitejs/plugin-react
- **Optimization**: Excludes lucide-react from pre-bundling
- **Port**: Default Vite dev server (usually 5173)

---

## File Naming Conventions

### Components
- PascalCase for component files: `Header.tsx`, `ContactPage.tsx`
- Descriptive names matching component purpose

### Hooks
- camelCase with 'use' prefix: `useDarkMode.ts`

### Styles
- kebab-case for CSS files: `index.css`

### Assets
- Descriptive names: `about-img.jpg`, `service-1a.png`
- Numbered variants for series: `carousel-1.jpg`, `carousel-2.jpg`

---

## Code Style Guidelines

### TypeScript
- Strict mode enabled in tsconfig
- Type annotations for props and function returns
- Interface definitions for component props

### React
- Functional components with hooks
- Props destructuring
- Conditional rendering with ternary operators
- Event handlers prefixed with 'handle': `handleClick`, `handleSubmit`

### Styling
- Tailwind utility classes in className prop
- Conditional classes using template literals
- Responsive modifiers: `sm:`, `md:`, `lg:`, `xl:`
- Hover and focus states: `hover:`, `focus:`

### Component Structure Pattern
```tsx
import React, { useState, useEffect } from 'react';
import { IconName } from 'lucide-react';

const ComponentName = () => {
  // State hooks
  const [state, setState] = useState(initialValue);
  
  // Effect hooks
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  // Render
  return (
    <div className="tailwind-classes">
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

---

## Important Notes

### Environment Variables
- `.env` file exists (gitignored)
- Likely contains EmailJS credentials
- Access via `import.meta.env.VITE_*` in Vite

### Assets Management
- Images stored in `src/assets/`
- Public assets in `public/` directory
- Resume PDF available: `Efraim_Talucod_Resume_2025.pdf`

### Navigation Behavior
- Smooth scroll to sections on home page
- Special handling for navigating from contact page to home sections
- Mobile menu closes after navigation

### Browser Compatibility
- Modern browsers (ES6+)
- Webkit scrollbar styling (Chrome, Safari, Edge)
- Firefox fallback scrollbar styles

---

## Future Considerations

### Potential Improvements
- Add unit tests (Jest/Vitest)
- Implement lazy loading for images
- Add analytics integration
- SEO optimization (meta tags, sitemap)
- Progressive Web App features
- Performance monitoring
- A11y improvements (ARIA labels, keyboard navigation)

### Known Dependencies
- EmailJS account required for contact form
- Google Fonts CDN for typography
- Image optimization could be improved

---

## Git Information

### Current Branch
- **master** (default branch)

### Recent Commits
- Added resume PDF and updated Hero section
- Updated Contact Page text
- Added social media links
- Added 2 additional projects
- Improved scrollbar behavior and color

### Ignored Files
- node_modules
- dist, dist-ssr
- .env (sensitive data)
- Editor configs (.vscode, .idea)
- Logs and debug files

---

## Contact & Deployment

### Owner Information
- **Name**: Efraim James Talucod
- **Portfolio URL**: (To be deployed)
- **Social Media**: Links available in Footer component

### Deployment
- Build command: `npm run build`
- Output directory: `dist/`
- Static site deployment compatible (Vercel, Netlify, GitHub Pages)

---

## Additional Context for AI Assistants

### When Making Changes

1. **Component Edits**: Maintain the existing animation and styling patterns
2. **New Components**: Follow the established file structure and naming conventions
3. **Styling**: Use Tailwind utilities; extend theme in `tailwind.config.js` if needed
4. **Icons**: Prefer Lucide React icons for consistency
5. **Routing**: Update `App.tsx` for new routes
6. **Assets**: Place in appropriate directory (src/assets vs public)

### Testing Changes
- Always run `npm run dev` to test locally
- Check responsive behavior at multiple breakpoints
- Verify smooth scrolling and animations
- Test both light and dark mode if applicable
- Run `npm run lint` to catch issues

### Code Quality
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use semantic HTML elements
- Maintain accessibility standards
- Comment complex logic only when necessary

---

**Last Updated**: January 2025  
**Document Version**: 1.0
