import type { ComponentType } from 'react';
import { FaReact, FaFigma, FaHtml5, FaCss3Alt, FaGitAlt } from 'react-icons/fa';
import {
  SiTypescript,
  SiJavascript,
  SiNextdotjs,
  SiTailwindcss,
  SiMysql,
  SiSupabase,
  SiClerk,
} from 'react-icons/si';

const ConvexIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M15.09 18.916c3.488-.387 6.776-2.246 8.586-5.348-.857 7.673-9.247 12.522-16.095 9.545a3.47 3.47 0 0 1-1.547-1.314c-1.539-2.417-2.044-5.492-1.318-8.282 2.077 3.584 6.3 5.78 10.374 5.399m-10.501-7.65c-1.414 3.266-1.475 7.092.258 10.24-6.1-4.59-6.033-14.41-.074-18.953a3.44 3.44 0 0 1 1.893-.707c2.825-.15 5.695.942 7.708 2.977-4.09.04-8.073 2.66-9.785 6.442m11.757-5.437C14.283 2.951 11.053.992 7.515.933c6.84-3.105 15.253 1.929 16.17 9.37a3.6 3.6 0 0 1-.334 2.02c-1.278 2.594-3.647 4.607-6.416 5.352 2.029-3.763 1.778-8.36-.589-11.847" />
  </svg>
);

// Curated whitelist: a hero_toolkit row's icon_key (CMS-editable) only ever
// picks one of these pre-built icon+color pairs — never rendered as arbitrary
// code. Hero.tsx renders from this; the admin toolkit editor offers it as a
// dropdown so an admin can never type in an icon_key that resolves to nothing.
export const ICON_REGISTRY: Record<
  string,
  { icon: ComponentType<{ className?: string }>; color: string; label: string }
> = {
  react: { icon: FaReact, color: 'text-blue-600', label: 'React' },
  nextjs: { icon: SiNextdotjs, color: 'text-slate-900', label: 'Next.js' },
  typescript: { icon: SiTypescript, color: 'text-blue-700', label: 'TypeScript' },
  javascript: { icon: SiJavascript, color: 'text-yellow-500', label: 'JavaScript' },
  tailwindcss: { icon: SiTailwindcss, color: 'text-cyan-600', label: 'Tailwind CSS' },
  html5: { icon: FaHtml5, color: 'text-orange-600', label: 'HTML5' },
  css3: { icon: FaCss3Alt, color: 'text-blue-600', label: 'CSS3' },
  git: { icon: FaGitAlt, color: 'text-[#F05032]', label: 'Git' },
  supabase: { icon: SiSupabase, color: 'text-[#3FCF8E]', label: 'Supabase' },
  convex: { icon: ConvexIcon, color: 'text-[#EE342F]', label: 'Convex' },
  mysql: { icon: SiMysql, color: 'text-[#4479A1]', label: 'MySQL' },
  clerk: { icon: SiClerk, color: 'text-[#6C47FF]', label: 'Clerk' },
  figma: { icon: FaFigma, color: 'text-purple-600', label: 'Figma' },
};
