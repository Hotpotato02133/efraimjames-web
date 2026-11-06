// One-off seed script: uploads project/logo images to Supabase Storage and
// inserts the projects, work_history, and hero_toolkit rows that the SQL
// migration (supabase/migrations/0001_init.sql) deliberately leaves empty.
//
// Run with: npm run db:seed
// Requires SUPABASE_SERVICE_ROLE_KEY (local .env, never committed) because
// inserts/storage writes must bypass RLS (anon can only read these tables).

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const assets = path.join(root, 'src', 'assets');

function loadEnv() {
  const file = path.join(root, '.env');
  const out = {};
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    out[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }
  return out;
}

const env = loadEnv();
const url = env.VITE_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);
const BUCKET = 'portfolio-assets';

function contentTypeFor(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  return 'application/octet-stream';
}

async function ensureBucket() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) throw error;
  if (buckets.some((b) => b.name === BUCKET)) return;
  const { error: createError } = await supabase.storage.createBucket(BUCKET, { public: true });
  if (createError) throw createError;
  console.log(`Created public bucket "${BUCKET}"`);
}

async function uploadAsset(localFile, storagePath) {
  const fullPath = path.join(assets, localFile);
  if (!existsSync(fullPath)) throw new Error(`Missing asset: ${fullPath}`);
  const buffer = readFileSync(fullPath);
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, { contentType: contentTypeFor(localFile), upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

// id -> local asset filename in src/assets
const projectImageFiles = {
  'digital-archiving-management-system': 'DAMS Project.jpg',
  'zion-shop': 'Zion Shop.jpg',
  'quantyx-trading-journal': 'Quantyx Trading Journal.jpg',
  facundo: 'Facundo-cover.png',
  broadheader: 'Broadheader.jpg',
  'ofbank-mobile': 'service-3a.jpg',
  travelista: 'service-3b.jpg',
  veloura: 'service-1c.jpg',
  leafly: 'Leafly-cover.png',
  'oro-dashboard': 'service-2b.png',
  'buenas-coffee': 'service-1b.jpg',
  'car-rental-ph': 'service-2a.png',
  'hyde-learning': 'service-1a.jpg',
  'oro-landing': 'service-2c.png',
  'logo-design': 'service-4a.jpg',
  'poster-design': 'service-4b.jpg',
  'banner-design': 'service-4d.jpg',
};

const projectsData = [
  { id: 'digital-archiving-management-system', title: 'Digital Archiving Management System', card_title: 'DAMS', description: 'A university registrar web app that scans student documents, extracts text via OCR, and stores them in a searchable archive.', full_description: 'Digital Archiving Management System is a university registrar web application that scans student documents, extracts text via Optical Character Recognition (OCR), and securely stores them in an indexed, searchable archive. Built as a solo project, it eliminates administrative paper bottlenecks with automated text extraction, instant keyword search, and systematic academic record organization.', tags: ['React', 'TypeScript', 'TailwindCSS', 'OCR', 'Document Management', 'Web App'], category: 'Fullstack Project', link: '#', year: '2026', client: 'University Registrar', role: 'Fullstack Developer', section: 'featured', display_order: 0 },
  { id: 'zion-shop', title: 'Zion Shop', description: 'A full-stack e-commerce app built with React, Shadcn UI, Supabase, and Clerk, featuring wishlists, cart management, and secure payment checkout.', full_description: 'Zion Shop is a full-stack e-commerce application built with React, Shadcn UI, Supabase, and Clerk. Developed as a solo project, it delivers a smooth shopping experience with interactive product catalogs, personalized customer wishlists, dynamic cart management, and secure payment checkout workflows backed by real-time database state and authentication.', tags: ['React', 'Shadcn UI', 'TailwindCSS', 'Supabase', 'Clerk', 'TypeScript', 'E-commerce'], category: 'Fullstack Project', link: 'https://zion-shop-znej.vercel.app/', year: '2026', client: 'Personal Project', role: 'Fullstack Developer', section: 'featured', display_order: 1 },
  { id: 'quantyx-trading-journal', title: 'Quantyx Trading Journal', description: 'A high-density trading journal & performance analytics terminal built with React, TanStack Table, Supabase RLS, and Clerk.', full_description: 'Quantyx Trading Journal is a high-density trading journal and performance analytics terminal built with React, TanStack Table, Supabase RLS, and Clerk. Developed as a solo project for disciplined market participants, it provides comprehensive trade logging, risk-to-reward analytics, interactive high-density data tables, and granular Row Level Security for private execution data.', tags: ['React', 'TanStack Table', 'Supabase RLS', 'Clerk', 'TypeScript', 'Data Analytics'], category: 'Fullstack Project', link: '#', year: '2026', client: 'Personal Project', role: 'Fullstack Developer', section: 'featured', display_order: 2 },
  { id: 'facundo', title: 'Facundo Booking', description: 'A focused fullstack booking reservation web app developed for Mr. Facundo, a well-known business owner in the Philippines.', full_description: 'Facundo is a specialized fullstack booking reservation web application tailored specifically for Mr. Facundo, a prominent business owner in the Philippines. Built as a comprehensive fullstack platform, it features a robust booking engine paired with a polished, high-performance interface that reflects the high standards of his services, providing a seamless and reliable reservation experience for clients.', tags: ['React', 'ShadCN', 'TailwindCSS', 'Supabase', 'Axios', 'Claude Code', 'Codex', 'Clerk Auth'], category: 'Fullstack Project', link: 'https://www.fcvndo.com/', year: '2024', client: 'Mr. Facundo', role: 'Frontend Developer', section: 'collaborative', display_order: 0 },
  { id: 'broadheader', title: 'Broadheader', description: 'A comprehensive fullstack website builder platform with intuitive drag-and-drop functionality, built to empower businesses to create professional websites seamlessly.', full_description: 'Broadheader is a powerful fullstack website builder platform that empowers businesses to create professional websites without coding knowledge. As the Frontend Developer, I engineered the intuitive drag-and-drop interface, integrated dynamic REST APIs, and built a modular library of customizable components and templates. The development heavily focused on delivering a frictionless, high-performance experience, ensuring complex site-building workflows are seamless and responsive for end-users.', tags: ['React', 'TypeScript', 'TailwindCSS', 'Vite', 'REST APIs', 'Fullstack Development'], category: 'Fullstack Project', link: 'https://www.broadheader.com/', year: '2024', client: 'Broadheader Technologies', role: 'Frontend Developer', section: 'collaborative', display_order: 1 },
  { id: 'ofbank-mobile', title: 'OFBank Mobile', description: 'A comprehensive mobile banking app redesign focusing on user experience and financial accessibility.', full_description: 'OFBank Mobile is a comprehensive redesign of a mobile banking application with a focus on user experience and financial accessibility. The project involved reimagining the entire user journey, from onboarding to daily transactions. The new design emphasizes security, ease of use, and accessibility for users of all technical backgrounds.', tags: ['Mobile App', 'Banking', 'UI/UX', 'Redesign'], category: 'UI/UX Design', link: 'https://www.behance.net/gallery/180193513/OFBank-Mobile-App-Redesign', year: '2023', client: 'OFBank', role: 'UI/UX Designer', section: 'other', display_order: 0 },
  { id: 'travelista', title: 'Travelista', description: 'A travel platform UI design with immersive visuals and user-friendly navigation for travel enthusiasts.', full_description: 'Travelista is a travel platform UI design that brings wanderlust to life through immersive visuals and user-friendly navigation. The design captures the excitement of travel while providing practical functionality for booking and planning trips. Every element was designed to inspire and facilitate the travel planning process.', tags: ['Travel', 'UI Design', 'Web Design', 'UX'], category: 'UI/UX Design', link: 'https://www.behance.net/gallery/181942299/Travelista-UI-Design-Web-Design', year: '2023', client: 'Travelista', role: 'UI Designer', section: 'other', display_order: 1 },
  { id: 'veloura', title: 'Veloura', description: 'A modern e-commerce platform with elegant design and seamless user experience for online shopping.', full_description: 'Veloura is a premium e-commerce platform designed with elegance and user experience at its core. The design features clean aesthetics, intuitive navigation, and a streamlined checkout process. Every element was carefully crafted to enhance the shopping experience and increase conversion rates while maintaining a sophisticated visual identity.', tags: ['Web Design', 'E-commerce', 'Figma', 'UI/UX'], category: 'Web Design', link: 'https://www.behance.net/gallery/212698409/Veloura-Web-Design-Figma', year: '2024', client: 'Veloura Fashion', role: 'Web Designer', section: 'other', display_order: 2 },
  { id: 'leafly', title: 'Leafly', description: 'A comprehensive booking platform where businesses can list their services for users to book salon, spa, and barber appointments.', full_description: 'Leafly is an all-in-one booking reservation platform designed to connect users with various local wellness and beauty businesses. Salons, spas, and barbershops can easily list their services on the platform, allowing users to browse, compare, and instantly book the services they desire. The project focused on creating an intuitive multi-tenant structure with a clean, inviting aesthetic.', tags: ['Multitenant', 'UI/UX Design', 'Booking Platform', 'Web App'], category: 'UI/UX Design', link: '#', year: '2024', client: 'Leafly Business Module', role: 'UI/UX Designer', section: 'other', display_order: 3 },
  { id: 'oro-dashboard', title: 'ORO Dashboard', description: 'An intelligent dashboard featuring AI integration for enhanced data visualization and user interaction.', full_description: 'ORO Dashboard is an intelligent analytics platform that leverages AI integration to provide enhanced data visualization and user interaction. Built with React and TypeScript, the dashboard offers real-time insights, customizable widgets, and predictive analytics. The interface was designed to present complex data in an accessible and actionable format.', tags: ['React', 'AI Integration', 'Dashboard', 'TypeScript'], category: 'Frontend', link: 'https://orowonder.vercel.app/', year: '2024', client: 'ORO Analytics', role: 'Frontend Engineer', section: 'other', display_order: 4 },
  { id: 'buenas-coffee', title: 'Buenas Coffee', description: 'A warm and inviting landing page design for a coffee shop with rich visuals and modern aesthetics.', full_description: 'Buenas Coffee is a beautifully crafted landing page design that captures the warmth and inviting atmosphere of a premium coffee shop. The design features rich visuals, modern aesthetics, and carefully selected typography that evokes the sensory experience of enjoying quality coffee. The project focused on creating an emotional connection with visitors.', tags: ['Landing Page', 'Web Design', 'Branding', 'UI/UX'], category: 'Web Design', link: 'https://www.behance.net/gallery/183390349/Buenas-Coffee-II-Landing-Page', year: '2023', client: 'Buenas Coffee Co.', role: 'Web Designer', section: 'other', display_order: 5 },
  { id: 'car-rental-ph', title: 'Car Rental PH', description: 'A comprehensive car rental platform with booking system and vehicle management features.', full_description: 'Car Rental PH is a full-featured car rental platform built for the Philippine market. The application includes a comprehensive booking system, vehicle management features, and user authentication. Built with React and modern JavaScript, the platform offers a responsive design that works seamlessly across all devices.', tags: ['React', 'Booking System', 'Responsive', 'JavaScript'], category: 'Frontend', link: 'https://car-rental-alpha-bice.vercel.app/', year: '2023', client: 'Car Rental PH', role: 'Frontend Developer', section: 'other', display_order: 6 },
  { id: 'hyde-learning', title: 'Hyde Learning', description: 'An innovative online learning platform interface with clean design and intuitive user experience.', full_description: 'Hyde Learning is an innovative online learning platform designed to make education accessible and engaging. The interface features clean design principles, intuitive navigation, and thoughtful user experience patterns. The project focused on creating an environment that promotes focused learning while maintaining visual appeal.', tags: ['UI Design', 'Education', 'Landing Page', 'UX'], category: 'Web Design', link: 'https://www.behance.net/gallery/186754327/Hyde-Online-Learning-Platform-UI-Design', year: '2023', client: 'Hyde Education', role: 'UI Designer', section: 'other', display_order: 7 },
  { id: 'oro-landing', title: 'ORO Landing', description: 'A sleek and modern landing page with compelling design elements and clear call-to-actions.', full_description: 'ORO Landing is a sleek and modern landing page designed to convert visitors into customers. The design features compelling visual elements, clear call-to-actions, and a responsive layout that adapts to any device. Built with React, the page offers smooth animations and optimized performance.', tags: ['React', 'Landing Page', 'Modern Design', 'Responsive'], category: 'Frontend', link: 'https://react-landing-page-or-ov2.vercel.app/', year: '2023', client: 'ORO Technologies', role: 'Frontend Developer', section: 'other', display_order: 8 },
  { id: 'logo-design', title: 'Logo Design', description: 'Professional brand identity and logo design services with creative and memorable visual solutions.', full_description: 'This logo design project showcases professional brand identity work with creative and memorable visual solutions. The project involved creating distinctive logos that capture the essence of each brand, ensuring they work across various applications and scales. Each design balances creativity with practicality.', tags: ['Branding', 'Logo Design', 'Identity', 'Creative'], category: 'Graphic Design', link: 'https://www.behance.net/gallery/181927731/Team-LAU-Logo-Design-Team-T-shirt-Design', year: '2023', client: 'Various Clients', role: 'Graphic Designer', section: 'other', display_order: 9 },
  { id: 'poster-design', title: 'Poster Design', description: 'Eye-catching poster designs for various campaigns and events with strong visual impact.', full_description: 'This poster design collection features eye-catching designs created for various campaigns and events. Each poster was crafted to deliver strong visual impact and effectively communicate the intended message. The designs balance artistic expression with clear communication objectives.', tags: ['Poster', 'Print Design', 'Marketing', 'Visual Design'], category: 'Graphic Design', link: 'https://www.behance.net/gallery/185524145/Hiring-Poster-Design', year: '2023', client: 'Various Clients', role: 'Graphic Designer', section: 'other', display_order: 10 },
  { id: 'banner-design', title: 'Banner Design', description: 'Professional banner designs for digital marketing campaigns with compelling visual elements.', full_description: 'This banner design project includes professional designs for digital marketing campaigns. Each banner was created with compelling visual elements that capture attention and drive engagement. The designs are optimized for various platforms and sizes while maintaining brand consistency.', tags: ['Banner', 'Digital Marketing', 'Advertising', 'Design'], category: 'Graphic Design', link: 'https://www.behance.net/gallery/211765299/Sample-Banner-Design', year: '2024', client: 'Various Clients', role: 'Graphic Designer', section: 'other', display_order: 11 },
];

const logoFiles = {
  yolk: 'yolk-logo.png',
  inspo: 'inspo-logo.png',
  broadheader: 'broadheader-logo.png',
  facundo: 'facundo-logo.png',
  oro: 'oro-logo.png',
};

const heroToolkitData = [
  { name: 'React', icon_key: 'react', display_order: 0 },
  { name: 'Next.js', icon_key: 'nextjs', display_order: 1 },
  { name: 'TypeScript', icon_key: 'typescript', display_order: 2 },
  { name: 'JavaScript', icon_key: 'javascript', display_order: 3 },
  { name: 'Tailwind CSS', icon_key: 'tailwindcss', display_order: 4 },
  { name: 'HTML5', icon_key: 'html5', display_order: 5 },
  { name: 'CSS3', icon_key: 'css3', display_order: 6 },
  { name: 'Git', icon_key: 'git', display_order: 7 },
  { name: 'Supabase', icon_key: 'supabase', display_order: 8 },
  { name: 'Convex', icon_key: 'convex', display_order: 9 },
  { name: 'MySQL', icon_key: 'mysql', display_order: 10 },
  { name: 'Clerk', icon_key: 'clerk', display_order: 11 },
  { name: 'Figma', icon_key: 'figma', display_order: 12 },
];

async function seedProjects() {
  const rows = [];
  for (const p of projectsData) {
    const file = projectImageFiles[p.id];
    const imageUrl = await uploadAsset(file, `projects/${p.id}${path.extname(file)}`);
    rows.push({ ...p, image_url: imageUrl });
    console.log(`Uploaded image for ${p.id}`);
  }
  const { error } = await supabase.from('projects').upsert(rows, { onConflict: 'id' });
  if (error) throw error;
  console.log(`Inserted ${rows.length} projects`);
}

async function seedWorkHistory() {
  const logoUrls = {};
  for (const [key, file] of Object.entries(logoFiles)) {
    logoUrls[key] = await uploadAsset(file, `logos/${key}${path.extname(file)}`);
    console.log(`Uploaded logo: ${key}`);
  }

  const rows = [
    {
      period: 'Mar 2026 - Sep 2026',
      role: 'Frontend Engineer',
      company: 'Undisclosed Group',
      location: 'Remote · New York, USA',
      description: 'Built and maintained frontend interfaces for two social-media intelligence platforms, including creator analytics, performance dashboards, and role-based reporting views. Collaborated closely with product and engineering through code review and QA to ship polished, reliable features.',
      project_links: [
        { name: 'Yolk', url: 'https://useyolk.com/', logo_url: logoUrls.yolk },
        { name: 'Inspo Web', url: 'https://app.findinspo.co/', logo_url: logoUrls.inspo, logo_scale: 1.9 },
      ],
      skills: ['Frontend Dev', 'Dashboards', 'Data Visualization', 'Role-Based UI', 'QA Testing', 'Git'],
      display_order: 0,
    },
    {
      period: 'Nov 2024 - Feb 2026',
      role: 'UI/UX Designer',
      company: 'Broadheader',
      location: 'Remote · Angeles City, Pampanga, PH',
      description: 'Led the design and frontend development for diverse projects including trading platforms and booking services. Implemented UI components, integrated REST APIs, and maintained clean code documentation.',
      project_links: [
        { name: 'Broadheader', url: 'https://www.broadheader.com/', logo_url: logoUrls.broadheader, logo_scale: 1.7 },
        { name: 'Facundo', url: 'https://www.fcvndo.com/', logo_url: logoUrls.facundo, logo_scale: 1.45 },
      ],
      skills: ['UI/UX', 'Frontend Dev', 'React / Vite', 'REST APIs'],
      display_order: 1,
    },
    {
      period: 'Aug 2024 - Jan 2025',
      role: 'Web Designer',
      company: 'Business Partner Group',
      location: 'Remote · Brisbane, Australia',
      description: 'Developed frontend components for key responsive pages. Led UX writing efforts for micro-copy and managed QA processes to ensure optimal user experiences and seamless functionality.',
      project_links: [],
      skills: ['Web Design', 'UX Writing', 'Frontend Dev', 'QA'],
      display_order: 2,
    },
    {
      period: 'Oct 2023 - Sep 2024',
      role: 'Frontend Developer',
      company: 'ORO Business Group',
      location: 'Onsite · Zamboanga City, PH',
      description: 'Collaborated in an agile environment to build and optimize frontend features. Expanded technical skills in JavaScript design patterns and actively participated in code reviews.',
      project_links: [{ name: 'ORO Admin', url: 'https://oroadmin.web.app/', logo_url: logoUrls.oro }],
      skills: ['JavaScript', 'React', 'Git', 'Agile'],
      display_order: 3,
    },
  ];

  const { error } = await supabase.from('work_history').insert(rows);
  if (error) throw error;
  console.log(`Inserted ${rows.length} work_history rows`);
}

async function seedHeroToolkit() {
  const { error } = await supabase.from('hero_toolkit').insert(heroToolkitData);
  if (error) throw error;
  console.log(`Inserted ${heroToolkitData.length} hero_toolkit rows`);
}

async function main() {
  await ensureBucket();

  const { count: projectCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
  if (projectCount > 0) {
    console.log(`projects already has ${projectCount} rows — skipping (delete rows first to re-seed)`);
  } else {
    await seedProjects();
  }

  const { count: workCount } = await supabase.from('work_history').select('*', { count: 'exact', head: true });
  if (workCount > 0) {
    console.log(`work_history already has ${workCount} rows — skipping`);
  } else {
    await seedWorkHistory();
  }

  const { count: toolkitCount } = await supabase.from('hero_toolkit').select('*', { count: 'exact', head: true });
  if (toolkitCount > 0) {
    console.log(`hero_toolkit already has ${toolkitCount} rows — skipping`);
  } else {
    await seedHeroToolkit();
  }

  console.log('Seed complete.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
