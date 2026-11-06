// Data-fetching layer backing the public site. Every function reads from Supabase
// (anon key, public-read RLS) and falls back to the bundled snapshot in
// src/data/fallback.ts on any error — missing env vars, network failure, or an
// outage — so the live site never renders blank.
//
// getProjectById/getRelatedProjects are plain synchronous helpers over an
// already-fetched list (not separate network calls), mirroring how
// src/data/projects.ts worked before this migration.

import { supabase } from './supabaseClient';
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
} from './types';
import {
  fallbackProjects,
  fallbackWorkHistory,
  fallbackHeroToolkit,
  fallbackHeroContent,
  fallbackAboutContent,
  fallbackSiteSettings,
  fallbackCapabilities,
  fallbackCustomSections,
  fallbackPageBlocks,
} from '../data/fallback';

// Rows keep bundled asset imports as their `image`/`logo` value until an admin
// uploads a replacement through the CMS, at which point `image_url`/`logo_url`
// (a Supabase Storage URL) takes over — both are plain strings to <img src>.

function mapProjectRow(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    title: row.title as string,
    cardTitle: (row.card_title as string | null) ?? undefined,
    description: row.description as string,
    fullDescription: row.full_description as string,
    image: row.image_url as string,
    tags: (row.tags as string[]) ?? [],
    category: row.category as string,
    link: row.link as string,
    year: row.year as string,
    client: row.client as string,
    role: row.role as string,
    section: row.section as Project['section'],
    displayOrder: row.display_order as number,
  };
}

interface ProjectLinkRow {
  name: string;
  url: string;
  logo_url: string;
  logo_scale?: number;
}

function mapWorkHistoryRow(row: Record<string, unknown>): WorkHistoryEntry {
  const projectLinkRows = (row.project_links as ProjectLinkRow[]) ?? [];
  return {
    id: row.id as string,
    period: row.period as string,
    role: row.role as string,
    company: row.company as string,
    location: row.location as string,
    description: row.description as string,
    skills: (row.skills as string[]) ?? [],
    projectLinks: projectLinkRows.length
      ? projectLinkRows.map((link) => ({
          name: link.name,
          url: link.url,
          logo: link.logo_url,
          logoScale: link.logo_scale,
        }))
      : undefined,
    displayOrder: row.display_order as number,
  };
}

function mapHeroToolkitRow(row: Record<string, unknown>): HeroToolkitItem {
  return {
    id: row.id as string,
    name: row.name as string,
    iconKey: row.icon_key as string,
    displayOrder: row.display_order as number,
  };
}

function mapCapabilityRow(row: Record<string, unknown>): Capability {
  return {
    id: row.id as number,
    title: row.title as string,
    description: row.description as string,
    ctaLabel: row.cta_label as string,
    ctaTarget: row.cta_target as string,
  };
}

function mapCustomSectionRow(row: Record<string, unknown>): CustomSection {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    bodyMarkdown: row.body_markdown as string,
    imageUrl: (row.image_url as string | null) ?? undefined,
    ctaLabel: (row.cta_label as string | null) ?? undefined,
    ctaUrl: (row.cta_url as string | null) ?? undefined,
    enabled: row.enabled as boolean,
  };
}

function mapPageBlockRow(row: Record<string, unknown>): PageBlock {
  return {
    id: row.id as string,
    blockKey: row.block_key as string,
    enabled: row.enabled as boolean,
    displayOrder: row.display_order as number,
  };
}

// Memoizes each getter's in-flight/resolved promise so the several components
// that need the same table (e.g. projects, site_settings) share one network
// request per page load instead of each firing their own.
function cached<T>(fn: () => Promise<T>): () => Promise<T> {
  let promise: Promise<T> | null = null;
  return () => {
    if (!promise) promise = fn();
    return promise;
  };
}

export const getProjects = cached(async (): Promise<Project[]> => {
  if (!supabase) return fallbackProjects;
  try {
    const { data, error } = await supabase.from('projects').select('*').order('display_order');
    if (error || !data) throw error ?? new Error('No project rows returned');
    return data.map(mapProjectRow);
  } catch {
    return fallbackProjects;
  }
});

export function getProjectById(projects: Project[], id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function getRelatedProjects(
  projects: Project[],
  currentId: string,
  category: string,
  limit: number = 3
): Project[] {
  const primaryMatches = projects.filter(
    (project) => project.id !== currentId && project.category === category
  );
  if (primaryMatches.length >= limit) {
    return primaryMatches.slice(0, limit);
  }
  const fallbackProjectsList = projects.filter(
    (project) => project.id !== currentId && project.category !== category
  );
  return [...primaryMatches, ...fallbackProjectsList].slice(0, limit);
}

export const getWorkHistory = cached(async (): Promise<WorkHistoryEntry[]> => {
  if (!supabase) return fallbackWorkHistory;
  try {
    const { data, error } = await supabase.from('work_history').select('*').order('display_order');
    if (error || !data) throw error ?? new Error('No work_history rows returned');
    return data.map(mapWorkHistoryRow);
  } catch {
    return fallbackWorkHistory;
  }
});

export const getHeroToolkit = cached(async (): Promise<HeroToolkitItem[]> => {
  if (!supabase) return fallbackHeroToolkit;
  try {
    const { data, error } = await supabase.from('hero_toolkit').select('*').order('display_order');
    if (error || !data) throw error ?? new Error('No hero_toolkit rows returned');
    return data.map(mapHeroToolkitRow);
  } catch {
    return fallbackHeroToolkit;
  }
});

export const getHeroContent = cached(async (): Promise<HeroContent> => {
  if (!supabase) return fallbackHeroContent;
  try {
    const { data, error } = await supabase.from('hero_content').select('*').eq('id', 1).single();
    if (error || !data) throw error ?? new Error('No hero_content row returned');
    return {
      badgeText: data.badge_text,
      headingLine1: data.heading_line1,
      headingLine2: data.heading_line2,
      subheading: data.subheading,
      ctaPrimaryLabel: data.cta_primary_label,
      ctaSecondaryLabel: data.cta_secondary_label,
    };
  } catch {
    return fallbackHeroContent;
  }
});

export const getAboutContent = cached(async (): Promise<AboutContent> => {
  if (!supabase) return fallbackAboutContent;
  try {
    const { data, error } = await supabase.from('about_content').select('*').eq('id', 1).single();
    if (error || !data) throw error ?? new Error('No about_content row returned');
    return {
      paragraph1: data.paragraph_1,
      paragraph2: data.paragraph_2,
      tags: data.tags ?? [],
    };
  } catch {
    return fallbackAboutContent;
  }
});

export const getSiteSettings = cached(async (): Promise<SiteSettings> => {
  if (!supabase) return fallbackSiteSettings;
  try {
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
    if (error || !data) throw error ?? new Error('No site_settings row returned');
    return {
      contactEmail: data.contact_email,
      contactPhoneDisplay: data.contact_phone_display,
      contactWhatsappDigits: data.contact_whatsapp_digits,
      contactLocationShort: data.contact_location_short,
      contactLocationFull: data.contact_location_full,
      socialGithub: data.social_github,
      socialLinkedin: data.social_linkedin,
      socialBehance: data.social_behance,
      footerTagline: data.footer_tagline,
      copyrightText: data.copyright_text,
    };
  } catch {
    return fallbackSiteSettings;
  }
});

export const getCapabilities = cached(async (): Promise<Capability[]> => {
  if (!supabase) return fallbackCapabilities;
  try {
    const { data, error } = await supabase.from('capabilities').select('*').order('id');
    if (error || !data) throw error ?? new Error('No capabilities rows returned');
    return data.map(mapCapabilityRow);
  } catch {
    return fallbackCapabilities;
  }
});

export const getCustomSections = cached(async (): Promise<CustomSection[]> => {
  if (!supabase) return fallbackCustomSections;
  try {
    const { data, error } = await supabase.from('custom_sections').select('*');
    if (error || !data) throw error ?? new Error('No custom_sections rows returned');
    return data.map(mapCustomSectionRow);
  } catch {
    return fallbackCustomSections;
  }
});

export const getPageBlocks = cached(async (): Promise<PageBlock[]> => {
  if (!supabase) return fallbackPageBlocks;
  try {
    const { data, error } = await supabase.from('page_blocks').select('*').order('display_order');
    if (error || !data) throw error ?? new Error('No page_blocks rows returned');
    return data.map(mapPageBlockRow);
  } catch {
    return fallbackPageBlocks;
  }
});
