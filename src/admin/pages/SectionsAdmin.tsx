import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { ExternalLink, Layers, Pencil, Plus, Trash2 } from 'lucide-react';
import {
  adminListPageBlocks,
  adminToggleBlock,
  adminMoveBlock,
  adminListCustomSections,
  adminCreateCustomSection,
  adminUpdateCustomSection,
  adminDeleteCustomSection,
} from '../../lib/adminApi';
import type { PageBlock, CustomSection } from '../../lib/types';
import {
  Badge,
  Button,
  Card,
  Field,
  IconButton,
  Input,
  PageHeader,
  PageSkeleton,
  ReorderButtons,
  SectionLabel,
  Switch,
  Textarea,
  slugify,
} from '../components/ui';
import { Drawer } from '../components/Drawer';
import { ImageUpload } from '../components/ImageUpload';
import { useToast, errorMessage } from '../components/Toast';
import { useConfirm } from '../components/ConfirmDialog';

const FIXED_SECTIONS: Record<string, { label: string; description: string }> = {
  hero: { label: 'Hero', description: 'Headline, intro and toolkit marquee' },
  'what-i-can-do': { label: 'What I Can Do', description: 'Six capability cards' },
  projects: { label: 'Personal Projects', description: 'Solo project cards' },
  'collaborative-projects': { label: 'Team Projects', description: 'Team project cards' },
  'other-projects': { label: 'Explorations', description: 'Everything else, behind a toggle' },
  'lets-talk': { label: "Let's Talk Marquee", description: 'Decorative scrolling text' },
  about: { label: 'About', description: 'Intro paragraphs and tags' },
  'work-history': { label: 'Work History', description: 'Timeline of roles' },
  contact: { label: 'Contact', description: 'Contact cards and form' },
};

interface CustomFormState {
  id?: string;
  slug: string;
  slugTouched: boolean;
  title: string;
  bodyMarkdown: string;
  imageUrl: string;
  ctaLabel: string;
  ctaUrl: string;
}

function emptyCustomForm(): CustomFormState {
  return { slug: '', slugTouched: false, title: '', bodyMarkdown: '', imageUrl: '', ctaLabel: '', ctaUrl: '' };
}

const SectionsAdmin = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<CustomFormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [b, c] = await Promise.all([adminListPageBlocks(), adminListCustomSections()]);
      setBlocks(b);
      setCustomSections(c);
    } catch (e) {
      toast.error('Failed to load sections.', errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const closeDrawer = useCallback(() => setForm(null), []);

  const handleToggle = async (block: PageBlock, label: string) => {
    setBusyId(block.id);
    // Optimistic flip so the switch feels instant; reload reconciles.
    setBlocks((prev) => prev.map((b) => (b.id === block.id ? { ...b, enabled: !b.enabled } : b)));
    try {
      await adminToggleBlock(block.id, !block.enabled);
      toast.success(`${label} ${block.enabled ? 'hidden' : 'visible'} on the home page.`);
    } catch (e) {
      toast.error('Failed to update section.', errorMessage(e));
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    setBusyId(id);
    try {
      await adminMoveBlock(blocks, id, direction);
      await load();
    } catch (e) {
      toast.error('Failed to reorder.', errorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!form) return;
    const slug = slugify(form.slug);
    if (!slug) {
      toast.error('Add a slug for the section.');
      return;
    }
    if (!form.id && blocks.some((b) => b.blockKey === slug)) {
      toast.error('That slug is already used by a built-in section.');
      return;
    }
    setSaving(true);
    try {
      const input = {
        id: form.id,
        slug,
        title: form.title.trim(),
        bodyMarkdown: form.bodyMarkdown,
        imageUrl: form.imageUrl || undefined,
        ctaLabel: form.ctaLabel.trim() || undefined,
        ctaUrl: form.ctaUrl.trim() || undefined,
      };
      if (form.id) {
        await adminUpdateCustomSection(input);
        toast.success('Section saved.');
      } else {
        await adminCreateCustomSection(input, blocks.length);
        toast.success('Section created.', 'It was added to the end of the home page — reorder it below.');
      }
      setForm(null);
      await load();
    } catch (e) {
      toast.error('Failed to save section.', errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (section: CustomSection) => {
    const ok = await confirm({
      title: `Delete "${section.title}"?`,
      description: 'The section and its place in the page order are removed. This cannot be undone.',
      confirmLabel: 'Delete section',
      danger: true,
    });
    if (!ok) return;
    setBusyId(section.id);
    try {
      await adminDeleteCustomSection(section.id);
      toast.success('Section deleted.');
      await load();
    } catch (e) {
      toast.error('Failed to delete.', errorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <PageSkeleton rows={2} />;

  const sorted = [...blocks].sort((a, b) => a.displayOrder - b.displayOrder);
  const enabledCount = sorted.filter((b) => b.enabled).length;

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Home Page Sections"
        description="Reorder or hide the sections of the home page, and add simple custom blocks (heading, text, image, button)."
        actions={
          <Button icon={Plus} onClick={() => setForm(emptyCustomForm())}>
            New custom section
          </Button>
        }
      />

      <Card
        title="Page order"
        description="Top to bottom, exactly as rendered on the home page."
        actions={
          <Badge tone="emerald">
            {enabledCount} of {sorted.length} visible
          </Badge>
        }
        flush
      >
        <ul className="divide-y divide-slate-100">
          {sorted.map((block, i) => {
            const isCustom = block.blockKey.startsWith('custom:');
            const customSection = isCustom ? customSections.find((s) => s.id === block.blockKey.slice('custom:'.length)) : undefined;
            const fixed = FIXED_SECTIONS[block.blockKey];
            const label = isCustom ? (customSection?.title ?? '(missing section)') : (fixed?.label ?? block.blockKey);
            const description = isCustom ? (customSection ? `Custom block · /#${customSection.slug}` : 'Its content row was deleted') : fixed?.description;
            const anchor = isCustom ? customSection?.slug : block.blockKey === 'hero' ? 'home' : block.blockKey;

            return (
              <li key={block.id} className={`flex items-center gap-4 px-5 py-3.5 sm:px-6 ${busyId === block.id ? 'opacity-60' : ''} ${!block.enabled ? 'bg-slate-50/60' : ''}`}>
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-slate-100 text-[11px] font-semibold tabular-nums text-slate-500">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`flex items-center gap-2 truncate font-medium ${block.enabled ? 'text-slate-900' : 'text-slate-400 line-through decoration-slate-300'}`}>
                    <span className="truncate">{label}</span>
                    {isCustom ? <Badge tone="blue">Custom</Badge> : <Badge>Built-in</Badge>}
                    {anchor && block.enabled && (
                      <a
                        href={`/#${anchor}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Open on the live site"
                        className="hidden flex-shrink-0 text-slate-300 hover:text-emerald-600 sm:inline-flex"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </p>
                  {description && <p className="truncate text-xs text-slate-400">{description}</p>}
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                  <Switch checked={block.enabled} onChange={() => handleToggle(block, label)} label={`${block.enabled ? 'Hide' : 'Show'} ${label}`} disabled={busyId !== null} />
                  <ReorderButtons
                    onUp={() => handleMove(block.id, 'up')}
                    onDown={() => handleMove(block.id, 'down')}
                    disableUp={i === 0}
                    disableDown={i === sorted.length - 1}
                    busy={busyId !== null}
                  />
                  {isCustom && customSection ? (
                    <>
                      <IconButton
                        label="Edit section"
                        icon={Pencil}
                        onClick={() =>
                          setForm({
                            id: customSection.id,
                            slug: customSection.slug,
                            slugTouched: true,
                            title: customSection.title,
                            bodyMarkdown: customSection.bodyMarkdown,
                            imageUrl: customSection.imageUrl ?? '',
                            ctaLabel: customSection.ctaLabel ?? '',
                            ctaUrl: customSection.ctaUrl ?? '',
                          })
                        }
                      />
                      <IconButton label="Delete section" icon={Trash2} tone="danger" onClick={() => handleDelete(customSection)} disabled={busyId !== null} />
                    </>
                  ) : (
                    <span className="hidden w-16 sm:block" aria-hidden="true" />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <Drawer
        open={form !== null}
        onClose={closeDrawer}
        title={form?.id ? 'Edit custom section' : 'New custom section'}
        description="A heading, some text, and optionally an image and a button."
        wide
        footer={
          <>
            <Button variant="secondary" onClick={closeDrawer} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form="custom-section-form" loading={saving} disabled={uploading}>
              {form?.id ? 'Save section' : 'Create section'}
            </Button>
          </>
        }
      >
        {form && (
          <form id="custom-section-form" onSubmit={handleSave} className="space-y-8">
            <section className="space-y-4">
              <SectionLabel>Heading</SectionLabel>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Title" required>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value, slug: !form.id && !form.slugTouched ? slugify(e.target.value) : form.slug })}
                    required
                    autoFocus
                    placeholder="Speaking & Writing"
                  />
                </Field>
                <Field label="Slug" required hint={form.id ? 'Fixed after creation — it is the section anchor.' : 'Becomes the anchor: /#your-slug'}>
                  <Input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value, slugTouched: true })}
                    disabled={!!form.id}
                    required
                    placeholder="new-section"
                    className="font-mono text-xs"
                  />
                </Field>
              </div>
            </section>

            <section className="space-y-4">
              <SectionLabel>Body</SectionLabel>
              <Field label="Text" hint={<>Separate paragraphs with a blank line. <code className="rounded bg-slate-100 px-1">**bold**</code> and <code className="rounded bg-slate-100 px-1">*italic*</code> are supported.</>}>
                <Textarea value={form.bodyMarkdown} onChange={(e) => setForm({ ...form, bodyMarkdown: e.target.value })} rows={8} />
              </Field>
              <ImageUpload
                label="Image (optional)"
                value={form.imageUrl}
                onChange={(url) => setForm((prev) => (prev ? { ...prev, imageUrl: url } : prev))}
                folder="projects"
                onUploadingChange={setUploading}
              />
            </section>

            <section className="space-y-4">
              <SectionLabel>Button (optional)</SectionLabel>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Label">
                  <Input value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} placeholder="Read more" />
                </Field>
                <Field label="URL">
                  <Input value={form.ctaUrl} onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })} placeholder="https://… or /contact" />
                </Field>
              </div>
            </section>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
              <Layers className="h-4 w-4 flex-shrink-0 text-slate-400" />
              New sections are added to the bottom of the home page and enabled right away — reorder them from the page order list.
            </div>
          </form>
        )}
      </Drawer>
    </div>
  );
};

export default SectionsAdmin;
