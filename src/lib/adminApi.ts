// Write-side API for the admin CMS. Unlike lib/content.ts (cached, public,
// read-only with a fallback), every function here talks to Supabase directly
// and throws on error — the admin UI is expected to show that error, not
// paper over it with bundled data. Runs under the signed-in admin's session,
// so RLS's "authenticated" policies (not the service-role key) are what
// actually allow these writes.

import { supabase } from './supabaseClient';
import { clearContentCache } from './content';
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

function client() {
  if (!supabase) throw new Error('Supabase is not configured.');
  return supabase;
}

const BUCKET = 'portfolio-assets';

export async function uploadAsset(file: File, folder: 'projects' | 'logos' | 'resumes'): Promise<string> {
  const ext = file.name.split('.').pop() || 'png';
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await client().storage.from(BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw error;
  const { data } = client().storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadResumeAsset(file: File): Promise<{ url: string; filename: string }> {
  const ext = file.name.split('.').pop() || 'pdf';
  const cleanBase = file.name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  const path = `resumes/${Date.now()}-${cleanBase}.${ext}`;
  const contentType = file.type || 'application/pdf';
  const { error } = await client().storage.from(BUCKET).upload(path, file, {
    contentType,
    upsert: true,
  });
  if (error) throw error;
  const { data } = client().storage.from(BUCKET).getPublicUrl(path);
  return {
    url: data.publicUrl,
    filename: file.name,
  };
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

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

export async function adminListProjects(): Promise<Project[]> {
  const { data, error } = await client().from('projects').select('*').order('section').order('display_order');
  if (error) throw error;
  return data.map(mapProjectRow);
}

export interface ProjectInput {
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
  section: Project['section'];
  displayOrder: number;
  isNew: boolean;
}

export async function adminSaveProject(input: ProjectInput): Promise<void> {
  const row = {
    id: input.id,
    title: input.title,
    card_title: input.cardTitle || null,
    description: input.description,
    full_description: input.fullDescription,
    image_url: input.image,
    tags: input.tags,
    category: input.category,
    link: input.link,
    year: input.year,
    client: input.client,
    role: input.role,
    section: input.section,
    display_order: input.displayOrder,
  };
  const { error } = input.isNew
    ? await client().from('projects').insert(row)
    : await client().from('projects').update(row).eq('id', input.id);
  if (error) throw error;
}

export async function adminDeleteProject(id: string): Promise<void> {
  const { error } = await client().from('projects').delete().eq('id', id);
  if (error) throw error;
}

export async function adminMoveProject(
  projects: Project[],
  id: string,
  direction: 'up' | 'down'
): Promise<void> {
  const project = projects.find((p) => p.id === id);
  if (!project) return;
  const siblings = projects
    .filter((p) => p.section === project.section)
    .sort((a, b) => a.displayOrder - b.displayOrder);
  const index = siblings.findIndex((p) => p.id === id);
  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= siblings.length) return;
  const other = siblings[swapIndex];

  const { error: error1 } = await client()
    .from('projects')
    .update({ display_order: other.displayOrder })
    .eq('id', project.id);
  if (error1) throw error1;
  const { error: error2 } = await client()
    .from('projects')
    .update({ display_order: project.displayOrder })
    .eq('id', other.id);
  if (error2) throw error2;
}

// ---------------------------------------------------------------------------
// Work history
// ---------------------------------------------------------------------------

interface ProjectLinkRow {
  name: string;
  url: string;
  logo_url: string;
  logo_scale?: number;
}

function mapWorkHistoryRow(row: Record<string, unknown>): WorkHistoryEntry {
  const links = (row.project_links as ProjectLinkRow[]) ?? [];
  return {
    id: row.id as string,
    period: row.period as string,
    role: row.role as string,
    company: row.company as string,
    location: row.location as string,
    description: row.description as string,
    skills: (row.skills as string[]) ?? [],
    projectLinks: links.length
      ? links.map((l) => ({ name: l.name, url: l.url, logo: l.logo_url, logoScale: l.logo_scale }))
      : undefined,
    displayOrder: row.display_order as number,
  };
}

export async function adminListWorkHistory(): Promise<WorkHistoryEntry[]> {
  const { data, error } = await client().from('work_history').select('*').order('display_order');
  if (error) throw error;
  return data.map(mapWorkHistoryRow);
}

export interface WorkHistoryInput {
  id?: string;
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  projectLinks: { name: string; url: string; logo: string; logoScale?: number }[];
  displayOrder: number;
}

export async function adminSaveWorkHistory(input: WorkHistoryInput): Promise<void> {
  const row = {
    period: input.period,
    role: input.role,
    company: input.company,
    location: input.location,
    description: input.description,
    skills: input.skills,
    project_links: input.projectLinks.map((l) => ({
      name: l.name,
      url: l.url,
      logo_url: l.logo,
      logo_scale: l.logoScale,
    })),
    display_order: input.displayOrder,
  };
  const { error } = input.id
    ? await client().from('work_history').update(row).eq('id', input.id)
    : await client().from('work_history').insert(row);
  if (error) throw error;
}

export async function adminDeleteWorkHistory(id: string): Promise<void> {
  const { error } = await client().from('work_history').delete().eq('id', id);
  if (error) throw error;
}

export async function adminMoveWorkHistory(
  entries: WorkHistoryEntry[],
  id: string,
  direction: 'up' | 'down'
): Promise<void> {
  const sorted = [...entries].sort((a, b) => a.displayOrder - b.displayOrder);
  const index = sorted.findIndex((e) => e.id === id);
  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= sorted.length) return;
  const a = sorted[index];
  const b = sorted[swapIndex];

  const { error: error1 } = await client().from('work_history').update({ display_order: b.displayOrder }).eq('id', a.id);
  if (error1) throw error1;
  const { error: error2 } = await client().from('work_history').update({ display_order: a.displayOrder }).eq('id', b.id);
  if (error2) throw error2;
}

// ---------------------------------------------------------------------------
// Hero toolkit
// ---------------------------------------------------------------------------

function mapHeroToolkitRow(row: Record<string, unknown>): HeroToolkitItem {
  return {
    id: row.id as string,
    name: row.name as string,
    iconKey: row.icon_key as string,
    displayOrder: row.display_order as number,
  };
}

export async function adminListHeroToolkit(): Promise<HeroToolkitItem[]> {
  const { data, error } = await client().from('hero_toolkit').select('*').order('display_order');
  if (error) throw error;
  return data.map(mapHeroToolkitRow);
}

export async function adminSaveToolkitItem(input: {
  id?: string;
  name: string;
  iconKey: string;
  displayOrder: number;
}): Promise<void> {
  const row = { name: input.name, icon_key: input.iconKey, display_order: input.displayOrder };
  const { error } = input.id
    ? await client().from('hero_toolkit').update(row).eq('id', input.id)
    : await client().from('hero_toolkit').insert(row);
  if (error) throw error;
}

export async function adminDeleteToolkitItem(id: string): Promise<void> {
  const { error } = await client().from('hero_toolkit').delete().eq('id', id);
  if (error) throw error;
}

export async function adminMoveToolkitItem(
  items: HeroToolkitItem[],
  id: string,
  direction: 'up' | 'down'
): Promise<void> {
  const sorted = [...items].sort((a, b) => a.displayOrder - b.displayOrder);
  const index = sorted.findIndex((i) => i.id === id);
  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= sorted.length) return;
  const a = sorted[index];
  const b = sorted[swapIndex];

  const { error: error1 } = await client().from('hero_toolkit').update({ display_order: b.displayOrder }).eq('id', a.id);
  if (error1) throw error1;
  const { error: error2 } = await client().from('hero_toolkit').update({ display_order: a.displayOrder }).eq('id', b.id);
  if (error2) throw error2;
}

// ---------------------------------------------------------------------------
// Hero / About / Site settings (singleton rows)
// ---------------------------------------------------------------------------

async function syncResumeStorageMeta(resumeUrl?: string, resumeFilename?: string): Promise<void> {
  const storage = client().storage.from(BUCKET);
  const { data: existingMeta } = await storage.list('resumes-meta');

  const meta = JSON.stringify({
    resumeUrl: resumeUrl || '',
    resumeFilename: resumeFilename || 'CV-EFRAIM-JAMES-2026.pdf',
  });
  const fileName = `meta-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.json`;
  const { error: uploadErr } = await storage.upload(`resumes-meta/${fileName}`, meta, {
    contentType: 'application/json',
    cacheControl: '0',
    upsert: false,
  });
  if (uploadErr) throw uploadErr;

  if (existingMeta && existingMeta.length > 0) {
    await storage.remove(existingMeta.map((f) => `resumes-meta/${f.name}`));
  }

  // Clean up any replaced or removed PDF files in `resumes/` so only the active file remains
  try {
    const { data: resumeFiles } = await storage.list('resumes');
    if (resumeFiles && resumeFiles.length > 0) {
      const activeFileName = resumeUrl ? resumeUrl.split('/').pop()?.split('?')[0] : null;
      const stalePaths = resumeFiles
        .filter((f) => f.name !== activeFileName)
        .map((f) => `resumes/${f.name}`);
      if (stalePaths.length > 0) {
        await storage.remove(stalePaths);
      }
    }
  } catch {
    // ignore cleanup errors
  }
}

export async function adminGetHeroContent(): Promise<HeroContent> {
  const { data, error } = await client().from('hero_content').select('*').eq('id', 1).single();
  if (error) throw error;

  let resumeUrl = (data.resume_url as string | null) ?? undefined;
  let resumeFilename = (data.resume_filename as string | null) ?? undefined;

  // Fallback: If migration 0003 hasn't been applied yet, read the latest
  // versioned metadata file in resumes-meta (storage.list() is a POST query
  // to Postgres storage.objects and never cached by Cloudflare Smart CDN).
  if (resumeUrl === undefined) {
    try {
      const storage = client().storage.from(BUCKET);
      const { data: metaFiles } = await storage.list('resumes-meta', {
        sortBy: { column: 'name', order: 'desc' },
        limit: 1,
      });
      if (metaFiles && metaFiles.length > 0) {
        const { data: urlData } = storage.getPublicUrl(`resumes-meta/${metaFiles[0].name}`);
        if (urlData?.publicUrl) {
          const res = await fetch(urlData.publicUrl, { cache: 'no-store' });
          if (res.ok) {
            const meta = await res.json();
            resumeUrl = meta?.resumeUrl || undefined;
            resumeFilename = meta?.resumeFilename || resumeFilename;
          }
        }
      }
    } catch {
      // ignore fallback error
    }
  }

  return {
    badgeText: data.badge_text,
    headingLine1: data.heading_line1,
    headingLine2: data.heading_line2,
    subheading: data.subheading,
    ctaPrimaryLabel: data.cta_primary_label,
    ctaSecondaryLabel: data.cta_secondary_label,
    resumeUrl,
    resumeFilename,
  };
}

export async function adminSaveHeroContent(input: HeroContent): Promise<void> {
  const updatePayload: Record<string, unknown> = {
    badge_text: input.badgeText,
    heading_line1: input.headingLine1,
    heading_line2: input.headingLine2,
    subheading: input.subheading,
    cta_primary_label: input.ctaPrimaryLabel,
    cta_secondary_label: input.ctaSecondaryLabel,
    resume_url: input.resumeUrl || null,
    resume_filename: input.resumeFilename || null,
  };

  const { error } = await client()
    .from('hero_content')
    .update(updatePayload)
    .eq('id', 1);

  if (error) {
    // If column resume_url does not exist on hero_content table yet:
    if (error.code === 'PGRST204' || error.message?.includes('resume_url')) {
      delete updatePayload.resume_url;
      delete updatePayload.resume_filename;
      const { error: retryError } = await client().from('hero_content').update(updatePayload).eq('id', 1);
      if (retryError) throw retryError;

      await syncResumeStorageMeta(input.resumeUrl, input.resumeFilename);
      clearContentCache();
      return;
    }
    throw error;
  }

  // Also sync versioned storage metadata and clean up old files
  try {
    await syncResumeStorageMeta(input.resumeUrl, input.resumeFilename);
  } catch {
    // ignore
  }
  clearContentCache();
}

export async function adminGetAboutContent(): Promise<AboutContent> {
  const { data, error } = await client().from('about_content').select('*').eq('id', 1).single();
  if (error) throw error;
  return { paragraph1: data.paragraph_1, paragraph2: data.paragraph_2, tags: data.tags ?? [] };
}

export async function adminSaveAboutContent(input: AboutContent): Promise<void> {
  const { error } = await client()
    .from('about_content')
    .update({ paragraph_1: input.paragraph1, paragraph_2: input.paragraph2, tags: input.tags })
    .eq('id', 1);
  if (error) throw error;
}

export async function adminGetSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await client().from('site_settings').select('*').eq('id', 1).single();
  if (error) throw error;
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
}

export async function adminSaveSiteSettings(input: SiteSettings): Promise<void> {
  const { error } = await client()
    .from('site_settings')
    .update({
      contact_email: input.contactEmail,
      contact_phone_display: input.contactPhoneDisplay,
      contact_whatsapp_digits: input.contactWhatsappDigits,
      contact_location_short: input.contactLocationShort,
      contact_location_full: input.contactLocationFull,
      social_github: input.socialGithub,
      social_linkedin: input.socialLinkedin,
      social_behance: input.socialBehance,
      footer_tagline: input.footerTagline,
      copyright_text: input.copyrightText,
    })
    .eq('id', 1);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Capabilities ("What I Can Do" cards) — text fields only, 6 fixed rows
// ---------------------------------------------------------------------------

function mapCapabilityRow(row: Record<string, unknown>): Capability {
  return {
    id: row.id as number,
    title: row.title as string,
    description: row.description as string,
    ctaLabel: row.cta_label as string,
    ctaTarget: row.cta_target as string,
  };
}

export async function adminListCapabilities(): Promise<Capability[]> {
  const { data, error } = await client().from('capabilities').select('*').order('id');
  if (error) throw error;
  return data.map(mapCapabilityRow);
}

export async function adminSaveCapability(input: Capability): Promise<void> {
  const { error } = await client()
    .from('capabilities')
    .update({ title: input.title, description: input.description, cta_label: input.ctaLabel, cta_target: input.ctaTarget })
    .eq('id', input.id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Page blocks + custom sections (home page layout)
// ---------------------------------------------------------------------------

function mapPageBlockRow(row: Record<string, unknown>): PageBlock {
  return {
    id: row.id as string,
    blockKey: row.block_key as string,
    enabled: row.enabled as boolean,
    displayOrder: row.display_order as number,
  };
}

export async function adminListPageBlocks(): Promise<PageBlock[]> {
  const { data, error } = await client().from('page_blocks').select('*').order('display_order');
  if (error) throw error;
  return data.map(mapPageBlockRow);
}

export async function adminToggleBlock(id: string, enabled: boolean): Promise<void> {
  const { error } = await client().from('page_blocks').update({ enabled }).eq('id', id);
  if (error) throw error;
}

export async function adminMoveBlock(blocks: PageBlock[], id: string, direction: 'up' | 'down'): Promise<void> {
  const sorted = [...blocks].sort((a, b) => a.displayOrder - b.displayOrder);
  const index = sorted.findIndex((b) => b.id === id);
  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= sorted.length) return;
  const a = sorted[index];
  const b = sorted[swapIndex];

  const { error: error1 } = await client().from('page_blocks').update({ display_order: b.displayOrder }).eq('id', a.id);
  if (error1) throw error1;
  const { error: error2 } = await client().from('page_blocks').update({ display_order: a.displayOrder }).eq('id', b.id);
  if (error2) throw error2;
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

export async function adminListCustomSections(): Promise<CustomSection[]> {
  const { data, error } = await client().from('custom_sections').select('*');
  if (error) throw error;
  return data.map(mapCustomSectionRow);
}

export interface CustomSectionInput {
  id?: string;
  slug: string;
  title: string;
  bodyMarkdown: string;
  imageUrl?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

// A custom section is both a content row (custom_sections) and a position in
// the page layout (page_blocks, block_key = 'custom:<id>') — creating one
// must do both, in order, since the block_key depends on the row's new id.
export async function adminCreateCustomSection(input: CustomSectionInput, nextDisplayOrder: number): Promise<void> {
  const { data, error } = await client()
    .from('custom_sections')
    .insert({
      slug: input.slug,
      title: input.title,
      body_markdown: input.bodyMarkdown,
      image_url: input.imageUrl || null,
      cta_label: input.ctaLabel || null,
      cta_url: input.ctaUrl || null,
      enabled: true,
    })
    .select('id')
    .single();
  if (error) throw error;

  const { error: blockError } = await client().from('page_blocks').insert({
    block_key: `custom:${data.id}`,
    enabled: true,
    display_order: nextDisplayOrder,
  });
  if (blockError) throw blockError;
}

export async function adminUpdateCustomSection(input: CustomSectionInput): Promise<void> {
  if (!input.id) throw new Error('Missing custom section id');
  const { error } = await client()
    .from('custom_sections')
    .update({
      title: input.title,
      body_markdown: input.bodyMarkdown,
      image_url: input.imageUrl || null,
      cta_label: input.ctaLabel || null,
      cta_url: input.ctaUrl || null,
    })
    .eq('id', input.id);
  if (error) throw error;
}

export async function adminDeleteCustomSection(id: string): Promise<void> {
  const { error: blockError } = await client().from('page_blocks').delete().eq('block_key', `custom:${id}`);
  if (blockError) throw blockError;
  const { error } = await client().from('custom_sections').delete().eq('id', id);
  if (error) throw error;
}
