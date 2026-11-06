import type { TooltipLink } from '../components/ui/animated-tooltip';

export interface Project {
  id: string;
  title: string;
  cardTitle?: string;
  description: string;
  fullDescription: string;
  image: string;
  tags: string[];
  category: string;
  link: string;
  year: string;
  client: string;
  role: string;
  section: 'featured' | 'collaborative' | 'other';
  displayOrder: number;
}

export interface WorkHistoryEntry {
  id: string;
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  projectLinks?: TooltipLink[];
  displayOrder: number;
}

export interface HeroToolkitItem {
  id: string;
  name: string;
  /** Key into the curated icon registry in Hero.tsx — never render as arbitrary code. */
  iconKey: string;
  displayOrder: number;
}

export interface HeroContent {
  badgeText: string;
  headingLine1: string;
  headingLine2: string;
  subheading: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
}

export interface AboutContent {
  paragraph1: string;
  paragraph2: string;
  tags: string[];
}

export interface SiteSettings {
  contactEmail: string;
  contactPhoneDisplay: string;
  contactWhatsappDigits: string;
  contactLocationShort: string;
  contactLocationFull: string;
  socialGithub: string;
  socialLinkedin: string;
  socialBehance: string;
  footerTagline: string;
  copyrightText: string;
}

export interface Capability {
  id: number;
  title: string;
  description: string;
  ctaLabel: string;
  ctaTarget: string;
}

export interface CustomSection {
  id: string;
  slug: string;
  title: string;
  bodyMarkdown: string;
  imageUrl?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  enabled: boolean;
}

export interface PageBlock {
  id: string;
  /** A fixed component key ('hero', 'projects', ...) or 'custom:<uuid>'. */
  blockKey: string;
  enabled: boolean;
  displayOrder: number;
}
