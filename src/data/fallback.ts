// Frozen, build-time snapshot of the site's content, bundled into the app.
// src/lib/content.ts falls back to this whenever a Supabase fetch fails (missing
// env vars, network error, outage) so the public site never renders blank.
// This intentionally duplicates what's seeded in supabase/migrations/0001_init.sql —
// keep them in sync if you change the canonical content, but don't treat this file
// as the live source of truth once the CMS is in use; it's a safety net only.

import service1c from '../assets/service-1c.jpg';
import service2b from '../assets/service-2b.png';
import service1b from '../assets/service-1b.jpg';
import service2a from '../assets/service-2a.png';
import service1a from '../assets/service-1a.jpg';
import service2c from '../assets/service-2c.png';
import service3a from '../assets/service-3a.jpg';
import service4a from '../assets/service-4a.jpg';
import service3b from '../assets/service-3b.jpg';
import service4b from '../assets/service-4b.jpg';
import service4d from '../assets/service-4d.jpg';
import broadheaderProject from '../assets/Broadheader.jpg';
import facundoProject from '../assets/Facundo-cover.png';
import leaflyProject from '../assets/Leafly-cover.png';
import damsProject from '../assets/DAMS Project.jpg';
import zionShopProject from '../assets/Zion Shop.jpg';
import portfolioProject from '../assets/portfolio.jpg';

import yolkLogo from '../assets/yolk-logo.png';
import inspoLogo from '../assets/inspo-logo.png';
import broadheaderLogo from '../assets/broadheader-logo.png';
import facundoLogo from '../assets/facundo-logo.png';
import oroLogo from '../assets/oro-logo.png';

import type {
  Project,
  WorkHistoryEntry,
  HeroToolkitItem,
  HeroContent,
  AboutContent,
  SiteSettings,
  Capability,
  CustomSection,
  PageBlock,
} from '../lib/types';

export const fallbackProjects: Project[] = [
  {
    id: 'digital-archiving-management-system',
    title: 'Digital Archiving Management System',
    cardTitle: 'DAMS',
    description: 'A university registrar web app that scans student documents, extracts text via OCR, and stores them in a searchable archive.',
    fullDescription: 'Digital Archiving Management System is a university registrar web application that scans student documents, extracts text via Optical Character Recognition (OCR), and securely stores them in an indexed, searchable archive. Built as a solo project, it eliminates administrative paper bottlenecks with automated text extraction, instant keyword search, and systematic academic record organization.',
    image: damsProject,
    tags: ['React', 'TypeScript', 'TailwindCSS', 'OCR', 'Document Management', 'Web App'],
    category: 'Fullstack Project',
    link: '#',
    year: '2026',
    client: 'University Registrar',
    role: 'Fullstack Developer',
    section: 'featured',
    displayOrder: 0,
  },
  {
    id: 'zion-shop',
    title: 'Zion Shop',
    description: 'A full-stack e-commerce app built with React, Shadcn UI, Supabase, and Clerk, featuring wishlists, cart management, and secure payment checkout.',
    fullDescription: 'Zion Shop is a full-stack e-commerce application built with React, Shadcn UI, Supabase, and Clerk. Developed as a solo project, it delivers a smooth shopping experience with interactive product catalogs, personalized customer wishlists, dynamic cart management, and secure payment checkout workflows backed by real-time database state and authentication.',
    image: zionShopProject,
    tags: ['React', 'Shadcn UI', 'TailwindCSS', 'Supabase', 'Clerk', 'TypeScript', 'E-commerce'],
    category: 'Fullstack Project',
    link: 'https://zion-shop-znej.vercel.app/',
    year: '2026',
    client: 'Personal Project',
    role: 'Fullstack Developer',
    section: 'featured',
    displayOrder: 1,
  },
  {
    id: 'personal-website',
    title: 'Personal Website',
    cardTitle: 'Portfolio',
    description: 'A modern fullstack developer portfolio and CMS platform featuring an admin control center, custom dashboard analytics, live content management, and responsive bento architecture.',
    fullDescription: 'Personal Website is a modern fullstack developer portfolio and headless CMS platform designed and built from the ground up to showcase engineering and UI/UX capabilities. It features a secure authenticated admin panel (/admin), a custom privacy-friendly analytics dashboard tracking traffic, sessions, referrers, and conversion metrics via Vercel serverless functions, and a live CMS for managing projects, work history timeline, hero toolkit marquee, and custom page sections with Supabase Postgres, Auth, and Storage. Designed with React 18, TypeScript, Tailwind CSS, and Framer Motion, it delivers high performance, zero layout shift, and resilient offline fallback architecture.',
    image: portfolioProject,
    tags: ['React', 'TypeScript', 'TailwindCSS', 'Supabase', 'CMS Admin Panel', 'Analytics Dashboard', 'Vercel Functions'],
    category: 'Fullstack Project',
    link: 'https://efraimjames-web.vercel.app/',
    year: '2026',
    client: 'Personal Project',
    role: 'Fullstack Developer',
    section: 'featured',
    displayOrder: 2,
  },
  {
    id: 'facundo',
    title: 'Facundo Booking',
    description: 'A focused fullstack booking reservation web app developed for Mr. Facundo, a well-known business owner in the Philippines.',
    fullDescription: 'Facundo is a specialized fullstack booking reservation web application tailored specifically for Mr. Facundo, a prominent business owner in the Philippines. Built as a comprehensive fullstack platform, it features a robust booking engine paired with a polished, high-performance interface that reflects the high standards of his services, providing a seamless and reliable reservation experience for clients.',
    image: facundoProject,
    tags: ['React', 'ShadCN', 'TailwindCSS', 'Supabase', 'Axios', 'Claude Code', 'Codex', 'Clerk Auth'],
    category: 'Fullstack Project',
    link: 'https://www.fcvndo.com/',
    year: '2024',
    client: 'Mr. Facundo',
    role: 'Frontend Developer',
    section: 'collaborative',
    displayOrder: 0,
  },
  {
    id: 'broadheader',
    title: 'Broadheader',
    description: 'A comprehensive fullstack website builder platform with intuitive drag-and-drop functionality, built to empower businesses to create professional websites seamlessly.',
    fullDescription: 'Broadheader is a powerful fullstack website builder platform that empowers businesses to create professional websites without coding knowledge. As the Frontend Developer, I engineered the intuitive drag-and-drop interface, integrated dynamic REST APIs, and built a modular library of customizable components and templates. The development heavily focused on delivering a frictionless, high-performance experience, ensuring complex site-building workflows are seamless and responsive for end-users.',
    image: broadheaderProject,
    tags: ['React', 'TypeScript', 'TailwindCSS', 'Vite', 'REST APIs', 'Fullstack Development'],
    category: 'Fullstack Project',
    link: 'https://www.broadheader.com/',
    year: '2024',
    client: 'Broadheader Technologies',
    role: 'Frontend Developer',
    section: 'collaborative',
    displayOrder: 1,
  },
  {
    id: 'ofbank-mobile',
    title: 'OFBank Mobile',
    description: 'A comprehensive mobile banking app redesign focusing on user experience and financial accessibility.',
    fullDescription: 'OFBank Mobile is a comprehensive redesign of a mobile banking application with a focus on user experience and financial accessibility. The project involved reimagining the entire user journey, from onboarding to daily transactions. The new design emphasizes security, ease of use, and accessibility for users of all technical backgrounds.',
    image: service3a,
    tags: ['Mobile App', 'Banking', 'UI/UX', 'Redesign'],
    category: 'UI/UX Design',
    link: 'https://www.behance.net/gallery/180193513/OFBank-Mobile-App-Redesign',
    year: '2023',
    client: 'OFBank',
    role: 'UI/UX Designer',
    section: 'other',
    displayOrder: 0,
  },
  {
    id: 'travelista',
    title: 'Travelista',
    description: 'A travel platform UI design with immersive visuals and user-friendly navigation for travel enthusiasts.',
    fullDescription: 'Travelista is a travel platform UI design that brings wanderlust to life through immersive visuals and user-friendly navigation. The design captures the excitement of travel while providing practical functionality for booking and planning trips. Every element was designed to inspire and facilitate the travel planning process.',
    image: service3b,
    tags: ['Travel', 'UI Design', 'Web Design', 'UX'],
    category: 'UI/UX Design',
    link: 'https://www.behance.net/gallery/181942299/Travelista-UI-Design-Web-Design',
    year: '2023',
    client: 'Travelista',
    role: 'UI Designer',
    section: 'other',
    displayOrder: 1,
  },
  {
    id: 'veloura',
    title: 'Veloura',
    description: 'A modern e-commerce platform with elegant design and seamless user experience for online shopping.',
    fullDescription: 'Veloura is a premium e-commerce platform designed with elegance and user experience at its core. The design features clean aesthetics, intuitive navigation, and a streamlined checkout process. Every element was carefully crafted to enhance the shopping experience and increase conversion rates while maintaining a sophisticated visual identity.',
    image: service1c,
    tags: ['Web Design', 'E-commerce', 'Figma', 'UI/UX'],
    category: 'Web Design',
    link: 'https://www.behance.net/gallery/212698409/Veloura-Web-Design-Figma',
    year: '2024',
    client: 'Veloura Fashion',
    role: 'Web Designer',
    section: 'other',
    displayOrder: 2,
  },
  {
    id: 'leafly',
    title: 'Leafly',
    description: 'A comprehensive booking platform where businesses can list their services for users to book salon, spa, and barber appointments.',
    fullDescription: 'Leafly is an all-in-one booking reservation platform designed to connect users with various local wellness and beauty businesses. Salons, spas, and barbershops can easily list their services on the platform, allowing users to browse, compare, and instantly book the services they desire. The project focused on creating an intuitive multi-tenant structure with a clean, inviting aesthetic.',
    image: leaflyProject,
    tags: ['Multitenant', 'UI/UX Design', 'Booking Platform', 'Web App'],
    category: 'UI/UX Design',
    link: '#',
    year: '2024',
    client: 'Leafly Business Module',
    role: 'UI/UX Designer',
    section: 'other',
    displayOrder: 3,
  },
  {
    id: 'oro-dashboard',
    title: 'ORO Dashboard',
    description: 'An intelligent dashboard featuring AI integration for enhanced data visualization and user interaction.',
    fullDescription: 'ORO Dashboard is an intelligent analytics platform that leverages AI integration to provide enhanced data visualization and user interaction. Built with React and TypeScript, the dashboard offers real-time insights, customizable widgets, and predictive analytics. The interface was designed to present complex data in an accessible and actionable format.',
    image: service2b,
    tags: ['React', 'AI Integration', 'Dashboard', 'TypeScript'],
    category: 'Frontend',
    link: 'https://orowonder.vercel.app/',
    year: '2024',
    client: 'ORO Analytics',
    role: 'Frontend Engineer',
    section: 'other',
    displayOrder: 4,
  },
  {
    id: 'buenas-coffee',
    title: 'Buenas Coffee',
    description: 'A warm and inviting landing page design for a coffee shop with rich visuals and modern aesthetics.',
    fullDescription: 'Buenas Coffee is a beautifully crafted landing page design that captures the warmth and inviting atmosphere of a premium coffee shop. The design features rich visuals, modern aesthetics, and carefully selected typography that evokes the sensory experience of enjoying quality coffee. The project focused on creating an emotional connection with visitors.',
    image: service1b,
    tags: ['Landing Page', 'Web Design', 'Branding', 'UI/UX'],
    category: 'Web Design',
    link: 'https://www.behance.net/gallery/183390349/Buenas-Coffee-II-Landing-Page',
    year: '2023',
    client: 'Buenas Coffee Co.',
    role: 'Web Designer',
    section: 'other',
    displayOrder: 5,
  },
  {
    id: 'car-rental-ph',
    title: 'Car Rental PH',
    description: 'A comprehensive car rental platform with booking system and vehicle management features.',
    fullDescription: 'Car Rental PH is a full-featured car rental platform built for the Philippine market. The application includes a comprehensive booking system, vehicle management features, and user authentication. Built with React and modern JavaScript, the platform offers a responsive design that works seamlessly across all devices.',
    image: service2a,
    tags: ['React', 'Booking System', 'Responsive', 'JavaScript'],
    category: 'Frontend',
    link: 'https://car-rental-alpha-bice.vercel.app/',
    year: '2023',
    client: 'Car Rental PH',
    role: 'Frontend Developer',
    section: 'other',
    displayOrder: 6,
  },
  {
    id: 'hyde-learning',
    title: 'Hyde Learning',
    description: 'An innovative online learning platform interface with clean design and intuitive user experience.',
    fullDescription: 'Hyde Learning is an innovative online learning platform designed to make education accessible and engaging. The interface features clean design principles, intuitive navigation, and thoughtful user experience patterns. The project focused on creating an environment that promotes focused learning while maintaining visual appeal.',
    image: service1a,
    tags: ['UI Design', 'Education', 'Landing Page', 'UX'],
    category: 'Web Design',
    link: 'https://www.behance.net/gallery/186754327/Hyde-Online-Learning-Platform-UI-Design',
    year: '2023',
    client: 'Hyde Education',
    role: 'UI Designer',
    section: 'other',
    displayOrder: 7,
  },
  {
    id: 'oro-landing',
    title: 'ORO Landing',
    description: 'A sleek and modern landing page with compelling design elements and clear call-to-actions.',
    fullDescription: 'ORO Landing is a sleek and modern landing page designed to convert visitors into customers. The design features compelling visual elements, clear call-to-actions, and a responsive layout that adapts to any device. Built with React, the page offers smooth animations and optimized performance.',
    image: service2c,
    tags: ['React', 'Landing Page', 'Modern Design', 'Responsive'],
    category: 'Frontend',
    link: 'https://react-landing-page-or-ov2.vercel.app/',
    year: '2023',
    client: 'ORO Technologies',
    role: 'Frontend Developer',
    section: 'other',
    displayOrder: 8,
  },
  {
    id: 'logo-design',
    title: 'Logo Design',
    description: 'Professional brand identity and logo design services with creative and memorable visual solutions.',
    fullDescription: 'This logo design project showcases professional brand identity work with creative and memorable visual solutions. The project involved creating distinctive logos that capture the essence of each brand, ensuring they work across various applications and scales. Each design balances creativity with practicality.',
    image: service4a,
    tags: ['Branding', 'Logo Design', 'Identity', 'Creative'],
    category: 'Graphic Design',
    link: 'https://www.behance.net/gallery/181927731/Team-LAU-Logo-Design-Team-T-shirt-Design',
    year: '2023',
    client: 'Various Clients',
    role: 'Graphic Designer',
    section: 'other',
    displayOrder: 9,
  },
  {
    id: 'poster-design',
    title: 'Poster Design',
    description: 'Eye-catching poster designs for various campaigns and events with strong visual impact.',
    fullDescription: 'This poster design collection features eye-catching designs created for various campaigns and events. Each poster was crafted to deliver strong visual impact and effectively communicate the intended message. The designs balance artistic expression with clear communication objectives.',
    image: service4b,
    tags: ['Poster', 'Print Design', 'Marketing', 'Visual Design'],
    category: 'Graphic Design',
    link: 'https://www.behance.net/gallery/185524145/Hiring-Poster-Design',
    year: '2023',
    client: 'Various Clients',
    role: 'Graphic Designer',
    section: 'other',
    displayOrder: 10,
  },
  {
    id: 'banner-design',
    title: 'Banner Design',
    description: 'Professional banner designs for digital marketing campaigns with compelling visual elements.',
    fullDescription: 'This banner design project includes professional designs for digital marketing campaigns. Each banner was created with compelling visual elements that capture attention and drive engagement. The designs are optimized for various platforms and sizes while maintaining brand consistency.',
    image: service4d,
    tags: ['Banner', 'Digital Marketing', 'Advertising', 'Design'],
    category: 'Graphic Design',
    link: 'https://www.behance.net/gallery/211765299/Sample-Banner-Design',
    year: '2024',
    client: 'Various Clients',
    role: 'Graphic Designer',
    section: 'other',
    displayOrder: 11,
  },
];

export const fallbackWorkHistory: WorkHistoryEntry[] = [
  {
    id: '1',
    period: 'Mar 2026 - Sep 2026',
    role: 'Frontend Engineer',
    company: 'Undisclosed Group',
    location: 'Remote · New York, USA',
    description: 'Built and maintained frontend interfaces for two social-media intelligence platforms, including creator analytics, performance dashboards, and role-based reporting views. Collaborated closely with product and engineering through code review and QA to ship polished, reliable features.',
    projectLinks: [
      { name: 'Yolk', url: 'https://useyolk.com/', logo: yolkLogo },
      { name: 'Inspo Web', url: 'https://app.findinspo.co/', logo: inspoLogo, logoScale: 1.9 },
    ],
    skills: ['Frontend Dev', 'Dashboards', 'Data Visualization', 'Role-Based UI', 'QA Testing', 'Git'],
    displayOrder: 0,
  },
  {
    id: '2',
    period: 'Nov 2024 - Feb 2026',
    role: 'UI/UX Designer',
    company: 'Broadheader',
    location: 'Remote · Angeles City, Pampanga, PH',
    description: 'Led the design and frontend development for diverse projects including trading platforms and booking services. Implemented UI components, integrated REST APIs, and maintained clean code documentation.',
    projectLinks: [
      { name: 'Broadheader', url: 'https://www.broadheader.com/', logo: broadheaderLogo, logoScale: 1.7 },
      { name: 'Facundo', url: 'https://www.fcvndo.com/', logo: facundoLogo, logoScale: 1.45 },
    ],
    skills: ['UI/UX', 'Frontend Dev', 'React / Vite', 'REST APIs'],
    displayOrder: 1,
  },
  {
    id: '3',
    period: 'Aug 2024 - Jan 2025',
    role: 'Web Designer',
    company: 'Business Partner Group',
    location: 'Remote · Brisbane, Australia',
    description: 'Developed frontend components for key responsive pages. Led UX writing efforts for micro-copy and managed QA processes to ensure optimal user experiences and seamless functionality.',
    skills: ['Web Design', 'UX Writing', 'Frontend Dev', 'QA'],
    displayOrder: 2,
  },
  {
    id: '4',
    period: 'Oct 2023 - Sep 2024',
    role: 'Frontend Developer',
    company: 'ORO Business Group',
    location: 'Onsite · Zamboanga City, PH',
    description: 'Collaborated in an agile environment to build and optimize frontend features. Expanded technical skills in JavaScript design patterns and actively participated in code reviews.',
    projectLinks: [
      { name: 'ORO Admin', url: 'https://oroadmin.web.app/', logo: oroLogo },
    ],
    skills: ['JavaScript', 'React', 'Git', 'Agile'],
    displayOrder: 3,
  },
];

export const fallbackHeroToolkit: HeroToolkitItem[] = [
  { id: '1', name: 'React', iconKey: 'react', displayOrder: 0 },
  { id: '2', name: 'Next.js', iconKey: 'nextjs', displayOrder: 1 },
  { id: '3', name: 'TypeScript', iconKey: 'typescript', displayOrder: 2 },
  { id: '4', name: 'JavaScript', iconKey: 'javascript', displayOrder: 3 },
  { id: '5', name: 'Tailwind CSS', iconKey: 'tailwindcss', displayOrder: 4 },
  { id: '6', name: 'HTML5', iconKey: 'html5', displayOrder: 5 },
  { id: '7', name: 'CSS3', iconKey: 'css3', displayOrder: 6 },
  { id: '8', name: 'Git', iconKey: 'git', displayOrder: 7 },
  { id: '9', name: 'Supabase', iconKey: 'supabase', displayOrder: 8 },
  { id: '10', name: 'Convex', iconKey: 'convex', displayOrder: 9 },
  { id: '11', name: 'MySQL', iconKey: 'mysql', displayOrder: 10 },
  { id: '12', name: 'Clerk', iconKey: 'clerk', displayOrder: 11 },
  { id: '13', name: 'Figma', iconKey: 'figma', displayOrder: 12 },
];

export const fallbackHeroContent: HeroContent = {
  badgeText: 'Available for Work',
  headingLine1: 'Frontend ',
  headingLine2: 'Engineer',
  subheading: 'Three years of building fast and responsive web apps with React, and NextJS, combining strong UI/UX with AI-driven development.',
  ctaPrimaryLabel: 'View My Work',
  ctaSecondaryLabel: 'Download Resume',
  resumeUrl: '',
  resumeFilename: 'CV-EFRAIM-JAMES-2026.pdf',
};

export const fallbackAboutContent: AboutContent = {
  paragraph1: "I'm a Frontend Engineer with a background in UI/UX design. I build responsive, accessible web applications with React and TypeScript from creator analytics dashboards and reporting tools to booking platforms and marketing sites.",
  paragraph2: "Having designed interfaces before building them, I bring a designer's eye to the code: clear information hierarchy, reusable component patterns, and polished interactions backed by thorough QA and close collaboration with product and engineering teams.",
  tags: ['Frontend Development', 'React & TypeScript', 'Dashboards & Web Apps', 'UI/UX Design'],
};

// Canonical values reconcile the three conflicting copies previously hardcoded in
// Contact.tsx / ContactPage.tsx / Footer.tsx. Matches supabase/migrations/0001_init.sql.
export const fallbackSiteSettings: SiteSettings = {
  contactEmail: 'efraimjamestalucod88@gmail.com',
  contactPhoneDisplay: '(+63) 965 639 4996',
  contactWhatsappDigits: '639656394996',
  contactLocationShort: 'Philippines',
  contactLocationFull: 'Zamboanga City, Philippines, 7000',
  socialGithub: 'https://github.com/Hotpotato02133',
  socialLinkedin: 'https://www.linkedin.com/in/efraim-james-talucod-065959244/',
  socialBehance: 'https://www.behance.net/efraimjames',
  footerTagline: "Creating digital experiences that blend innovation with aesthetics. Let's build something extraordinary together.",
  copyrightText: '© 2026 Efraim James Portfolio.',
};

export const fallbackCapabilities: Capability[] = [
  { id: 1, title: 'Frontend Engineering', description: 'Fast, accessible, type-safe interfaces with React, Next.js and TypeScript — component architecture that stays maintainable as your product grows.', ctaLabel: 'See my work', ctaTarget: '#projects' },
  { id: 2, title: 'Dashboards & Data UIs', description: 'Analytics views, charts and role-based interfaces, like the platforms I shipped at Social Intelligence Lab.', ctaLabel: 'See my experience', ctaTarget: '#work-history' },
  { id: 3, title: 'Design-to-Code', description: 'A UI/UX background means Figma designs turn into pixel-accurate, reusable components and design-system patterns.', ctaLabel: 'About me', ctaTarget: '#about' },
  { id: 4, title: 'API & Backend Integration', description: 'Wiring the frontend to real data: REST APIs, authentication flows and managed backends such as Supabase, Convex and Clerk.', ctaLabel: 'See my experience', ctaTarget: '#work-history' },
  { id: 5, title: 'Performance & Accessibility', description: 'Responsive, keyboard-friendly pages that load quickly and work for everyone, on every screen size.', ctaLabel: 'See my work', ctaTarget: '#projects' },
  { id: 6, title: 'AI-Assisted Development', description: 'I use Claude Code and Codex to ship faster, then review, test and polish everything by hand so quality never slips.', ctaLabel: "Let's talk", ctaTarget: '#contact' },
];

export const fallbackCustomSections: CustomSection[] = [];

export const fallbackPageBlocks: PageBlock[] = [
  { id: 'hero', blockKey: 'hero', enabled: true, displayOrder: 0 },
  { id: 'what-i-can-do', blockKey: 'what-i-can-do', enabled: true, displayOrder: 1 },
  { id: 'projects', blockKey: 'projects', enabled: true, displayOrder: 2 },
  { id: 'collaborative-projects', blockKey: 'collaborative-projects', enabled: true, displayOrder: 3 },
  { id: 'other-projects', blockKey: 'other-projects', enabled: false, displayOrder: 4 },
  { id: 'lets-talk', blockKey: 'lets-talk', enabled: true, displayOrder: 5 },
  { id: 'about', blockKey: 'about', enabled: true, displayOrder: 6 },
  { id: 'work-history', blockKey: 'work-history', enabled: true, displayOrder: 7 },
  { id: 'contact', blockKey: 'contact', enabled: true, displayOrder: 8 },
];
