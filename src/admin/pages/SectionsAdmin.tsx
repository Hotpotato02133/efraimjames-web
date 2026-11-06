import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowUp, ArrowDown, Pencil, Trash2, Plus, X } from 'lucide-react';
import {
  adminListPageBlocks,
  adminToggleBlock,
  adminMoveBlock,
  adminListCustomSections,
  adminCreateCustomSection,
  adminUpdateCustomSection,
  adminDeleteCustomSection,
  uploadAsset,
} from '../../lib/adminApi';
import type { PageBlock, CustomSection } from '../../lib/types';
import { Field, Card, AdminButton, ErrorBanner, SuccessBanner, inputClass } from '../components/Field';

const FIXED_LABELS: Record<string, string> = {
  hero: 'Hero',
  'what-i-can-do': 'What I Can Do',
  projects: 'Featured Projects',
  'collaborative-projects': 'Collaborative Projects',
  'other-projects': 'Explorations',
  'lets-talk': "Let's Talk Marquee",
  about: 'About',
  'work-history': 'Work History',
  contact: 'Contact',
};

interface CustomFormState {
  id?: string;
  slug: string;
  title: string;
  bodyMarkdown: string;
  imageUrl: string;
  ctaLabel: string;
  ctaUrl: string;
}

function emptyCustomForm(): CustomFormState {
  return { slug: '', title: '', bodyMarkdown: '', imageUrl: '', ctaLabel: '', ctaUrl: '' };
}

const SectionsAdmin = () => {
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState<CustomFormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [b, c] = await Promise.all([adminListPageBlocks(), adminListCustomSections()]);
      setBlocks(b);
      setCustomSections(c);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load sections.');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggle = async (block: PageBlock) => {
    setError('');
    try {
      await adminToggleBlock(block.id, !block.enabled);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to toggle.');
    }
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    setError('');
    try {
      await adminMoveBlock(blocks, id, direction);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to reorder.');
    }
  };

  const handleUpload = async (file: File | undefined) => {
    if (!file || !form) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadAsset(file, 'projects');
      setForm((prev) => (prev ? { ...prev, imageUrl: url } : prev));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.');
    }
    setUploading(false);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError('');
    try {
      const input = {
        id: form.id,
        slug: form.slug,
        title: form.title,
        bodyMarkdown: form.bodyMarkdown,
        imageUrl: form.imageUrl || undefined,
        ctaLabel: form.ctaLabel || undefined,
        ctaUrl: form.ctaUrl || undefined,
      };
      if (form.id) {
        await adminUpdateCustomSection(input);
      } else {
        await adminCreateCustomSection(input, blocks.length);
      }
      setSuccess('Section saved.');
      setForm(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save section.');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this section? This cannot be undone.')) return;
    setError('');
    try {
      await adminDeleteCustomSection(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete.');
    }
  };

  if (loading) return <p className="text-slate-500">Loading…</p>;

  const sorted = [...blocks].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Home Page Sections</h1>
      {error && <ErrorBanner message={error} />}
      {success && <SuccessBanner message={success} />}

      {form && (
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">{form.id ? 'Edit Section' : 'New Custom Section'}</h2>
            <button onClick={() => setForm(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Slug (used as the anchor id)">
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  disabled={!!form.id}
                  required
                  className={inputClass + (form.id ? ' bg-slate-50 text-slate-500' : '')}
                  placeholder="new-section"
                />
              </Field>
              <Field label="Title">
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Body" hint="Separate paragraphs with a blank line. **bold** and *italic* are supported.">
              <textarea
                value={form.bodyMarkdown}
                onChange={(e) => setForm({ ...form, bodyMarkdown: e.target.value })}
                rows={5}
                className={inputClass}
              />
            </Field>
            <Field label="Image (optional)">
              <div className="flex items-center gap-4">
                {form.imageUrl && <img src={form.imageUrl} alt="" className="w-20 h-20 object-cover rounded-lg" />}
                <input type="file" accept="image/*" onChange={(e) => handleUpload(e.target.files?.[0])} disabled={uploading} className="text-sm" />
              </div>
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Button Label (optional)">
                <input
                  value={form.ctaLabel}
                  onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Button URL (optional)">
                <input
                  value={form.ctaUrl}
                  onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>
            <div className="flex gap-3">
              <AdminButton type="submit" disabled={saving || uploading}>
                {saving ? 'Saving…' : 'Save Section'}
              </AdminButton>
              <AdminButton variant="secondary" onClick={() => setForm(null)}>
                Cancel
              </AdminButton>
            </div>
          </form>
        </Card>
      )}

      <div className="flex justify-end mb-3">
        <AdminButton variant="secondary" onClick={() => setForm(emptyCustomForm())}>
          <span className="flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add Custom Section
          </span>
        </AdminButton>
      </div>

      <Card>
        <ul className="divide-y divide-slate-100">
          {sorted.map((block, i) => {
            const isCustom = block.blockKey.startsWith('custom:');
            const customSection = isCustom
              ? customSections.find((s) => s.id === block.blockKey.slice('custom:'.length))
              : undefined;
            const label = isCustom ? customSection?.title ?? '(missing section)' : FIXED_LABELS[block.blockKey] ?? block.blockKey;

            return (
              <li key={block.id} className="py-3 flex items-center gap-3">
                <label className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer">
                  <input type="checkbox" checked={block.enabled} onChange={() => handleToggle(block)} className="w-4 h-4" />
                  <span className={`font-medium truncate ${block.enabled ? 'text-slate-900' : 'text-slate-400'}`}>
                    {label}
                  </span>
                  {isCustom && <span className="text-xs text-slate-400">(custom)</span>}
                </label>
                <button
                  onClick={() => handleMove(block.id, 'up')}
                  disabled={i === 0}
                  className="p-1.5 text-slate-400 hover:text-emerald-600 disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMove(block.id, 'down')}
                  disabled={i === sorted.length - 1}
                  className="p-1.5 text-slate-400 hover:text-emerald-600 disabled:opacity-30"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                {isCustom && customSection && (
                  <>
                    <button
                      onClick={() =>
                        setForm({
                          id: customSection.id,
                          slug: customSection.slug,
                          title: customSection.title,
                          bodyMarkdown: customSection.bodyMarkdown,
                          imageUrl: customSection.imageUrl ?? '',
                          ctaLabel: customSection.ctaLabel ?? '',
                          ctaUrl: customSection.ctaUrl ?? '',
                        })
                      }
                      className="p-1.5 text-slate-400 hover:text-emerald-600"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(customSection.id)} className="p-1.5 text-slate-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
};

export default SectionsAdmin;
