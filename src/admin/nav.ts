import type { LucideIcon } from 'lucide-react';
import { Briefcase, FolderKanban, LayoutDashboard, Layers, Settings, Sparkles } from 'lucide-react';

/** The portfolio owner, shown in the sidebar profile card and login panel. */
export const CREATOR = {
  name: 'Efraim James',
  role: 'Software Engineer · Owner',
  github: 'https://github.com/Hotpotato02133',
};

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Short line under the page title and in the sidebar hover label. */
  description: string;
  end?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, description: 'Traffic, conversions and what visitors look at.', end: true },
    ],
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/projects', label: 'Projects', icon: FolderKanban, description: 'Personal, team and exploration project cards.' },
      { to: '/admin/work-history', label: 'Work History', icon: Briefcase, description: 'The timeline of roles, companies and shipped products.' },
      { to: '/admin/hero-about', label: 'Hero & About', icon: Sparkles, description: 'Headline, intro copy, toolkit marquee and capability cards.' },
      { to: '/admin/sections', label: 'Sections', icon: Layers, description: 'Reorder or hide home-page sections and add custom blocks.' },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { to: '/admin/site-settings', label: 'Site Settings', icon: Settings, description: 'Contact details, social links and footer copy used site-wide.' },
    ],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((group) => group.items);

export function findNavItem(pathname: string): NavItem | undefined {
  return ALL_NAV_ITEMS.find((item) => (item.end ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + '/')));
}

// Short, contextual hints shown by the creator tip card in the sidebar. Keyed
// by route; `general` tips are mixed into every page.
export const CREATOR_TIPS: Record<string, string[]> = {
  general: [
    'Every save goes live on the site immediately — there is no publish step, so double-check copy before saving.',
    'Press Ctrl + B (⌘ B on Mac) to collapse or expand this sidebar.',
    'Images you upload are stored in Supabase Storage and served from its CDN, so keep them under 8 MB.',
  ],
  '/admin': [
    'Visits to /admin are never tracked, so your own editing sessions don\'t inflate the numbers.',
    'Open the live site in a private window and your visit will appear on the next refresh.',
    'Switch the range to 7 days to see the effect of a post you just shared.',
  ],
  '/admin/projects': [
    'The order of cards inside a section here is the order visitors see on the home page.',
    'Set the live link to "#" to hide the "View Live Project" button on a project page.',
    'A project\'s ID becomes its URL (/project/your-slug) and cannot be changed after it is created.',
    'Personal Projects shows up to three cards and Team Projects two — put your strongest work first.',
  ],
  '/admin/work-history': [
    'Keep each description to one short paragraph so the timeline cards stay the same height.',
    'Logo zoom crops padded logos. Try 1.2 to 1.5 for marks with a lot of whitespace.',
    'Project links show up as logo tiles on the timeline; hovering reveals the name.',
  ],
  '/admin/hero-about': [
    'Heading line 2 is the gradient word on the hero — keep it to a single word or two.',
    'Toolkit icons come from a fixed registry; a brand-new logo needs a one-line code change.',
    'Capability cards keep their animations in code — only the copy is editable here.',
  ],
  '/admin/sections': [
    'Disabled sections keep their content; toggle them back on anytime.',
    'Custom sections support **bold**, *italic* and blank-line paragraphs.',
    'A custom section\'s slug becomes its anchor, so you can link to it with /#your-slug.',
  ],
  '/admin/site-settings': [
    'Contact details here feed the Contact section, the Contact page and the Footer at once.',
    'WhatsApp digits need the country code and no spaces — 63 for the Philippines.',
  ],
};
