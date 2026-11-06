import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowUp, ArrowDown, Pencil, Trash2, Plus, X } from 'lucide-react';
import {
  adminListProjects,
  adminSaveProject,
  adminDeleteProject,
  adminMoveProject,
  uploadAsset,
} from '../../lib/adminApi';
import type { Project } from '../../lib/types';
import { Field, Card, AdminButton, ErrorBanner, SuccessBanner, inputClass } from '../components/Field';

const SECTIONS: { key: Project['section']; label: string }[] = [
  { key: 'featured', label: 'Featured Projects' },
  { key: 'collaborative', label: 'Collaborative Projects' },
  { key: 'other', label: 'Explorations' },
];

interface FormState {
  isNew: boolean;
  id: string;
  title: string;
  cardTitle: string;
  description: string;
  fullDescription: string;
  image: string;
  tagsText: string;
  category: string;
  link: string;
  year: string;
  client: string;
  role: string;
  section: Project['section'];
  displayOrder: number;
}

function toFormState(p: Project): FormState {
  return {
    isNew: false,
    id: p.id,
    title: p.title,
    cardTitle: p.cardTitle ?? '',
    description: p.description,
    fullDescription: p.fullDescription,
    image: p.image,
    tagsText: p.tags.join(', '),
    category: p.category,
    link: p.link,
    year: p.year,
    client: p.client,
    role: p.role,
    section: p.section,
    displayOrder: p.displayOrder,
  };
}

function emptyFormState(section: Project['section'], nextOrder: number): FormState {
  return {
    isNew: true,
    id: '',
    title: '',
    cardTitle: '',
    description: '',
    fullDescription: '',
    image: '',
    tagsText: '',
    category: '',
    link: '#',
    year: String(new Date().getFullYear()),
    client: '',
    role: '',
    section,
    displayOrder: nextOrder,
  };
}

const ProjectsAdmin = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setProjects(await adminListProjects());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load projects.');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const startCreate = (section: Project['section']) => {
    const count = projects.filter((p) => p.section === section).length;
    setEditing(emptyFormState(section, count));
    setSuccess('');
  };

  const handleUpload = async (file: File | undefined) => {
    if (!file || !editing) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadAsset(file, 'projects');
      setEditing((prev) => (prev ? { ...prev, image: url } : prev));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.');
    }
    setUploading(false);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError('');
    try {
      await adminSaveProject({
        id: editing.id.trim(),
        title: editing.title,
        cardTitle: editing.cardTitle.trim() || undefined,
        description: editing.description,
        fullDescription: editing.fullDescription,
        image: editing.image,
        tags: editing.tagsText.split(',').map((t) => t.trim()).filter(Boolean),
        category: editing.category,
        link: editing.link,
        year: editing.year,
        client: editing.client,
        role: editing.role,
        section: editing.section,
        displayOrder: editing.displayOrder,
        isNew: editing.isNew,
      });
      setSuccess('Project saved.');
      setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save project.');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return;
    setError('');
    try {
      await adminDeleteProject(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete project.');
    }
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    setError('');
    try {
      await adminMoveProject(projects, id, direction);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to reorder.');
    }
  };

  if (loading) return <p className="text-slate-500">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Projects</h1>
      {error && <ErrorBanner message={error} />}
      {success && <SuccessBanner message={success} />}

      {editing && (
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              {editing.isNew ? 'New Project' : `Edit: ${editing.title}`}
            </h2>
            <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="ID (URL slug)" hint="Lowercase, hyphenated. Cannot be changed after creation.">
                <input
                  value={editing.id}
                  onChange={(e) => setEditing({ ...editing, id: e.target.value })}
                  disabled={!editing.isNew}
                  required
                  className={inputClass + (!editing.isNew ? ' bg-slate-50 text-slate-500' : '')}
                  placeholder="my-project-slug"
                />
              </Field>
              <Field label="Section">
                <select
                  value={editing.section}
                  onChange={(e) => setEditing({ ...editing, section: e.target.value as Project['section'] })}
                  className={inputClass}
                >
                  {SECTIONS.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Title">
                <input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="Card Title (optional, shorter display title)">
                <input
                  value={editing.cardTitle}
                  onChange={(e) => setEditing({ ...editing, cardTitle: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Short Description (shown on cards)">
              <textarea
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                required
                rows={2}
                className={inputClass}
              />
            </Field>

            <Field label="Full Description (shown on the project detail page)">
              <textarea
                value={editing.fullDescription}
                onChange={(e) => setEditing({ ...editing, fullDescription: e.target.value })}
                required
                rows={4}
                className={inputClass}
              />
            </Field>

            <Field label="Image">
              <div className="flex items-center gap-4">
                {editing.image && (
                  <img src={editing.image} alt="" className="w-20 h-20 object-cover rounded-lg border border-slate-200" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUpload(e.target.files?.[0])}
                  disabled={uploading}
                  className="text-sm"
                />
                {uploading && <span className="text-xs text-slate-400">Uploading…</span>}
              </div>
            </Field>

            <Field label="Tags (comma-separated)">
              <input
                value={editing.tagsText}
                onChange={(e) => setEditing({ ...editing, tagsText: e.target.value })}
                className={inputClass}
                placeholder="React, TypeScript, TailwindCSS"
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Category">
                <input
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  required
                  className={inputClass}
                  placeholder="Fullstack Project"
                />
              </Field>
              <Field label="Live Link (# to hide the button)">
                <input
                  value={editing.link}
                  onChange={(e) => setEditing({ ...editing, link: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Year">
                <input
                  value={editing.year}
                  onChange={(e) => setEditing({ ...editing, year: e.target.value })}
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="Client">
                <input
                  value={editing.client}
                  onChange={(e) => setEditing({ ...editing, client: e.target.value })}
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="Your Role">
                <input
                  value={editing.role}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                  required
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="flex gap-3 pt-2">
              <AdminButton type="submit" disabled={saving || uploading}>
                {saving ? 'Saving…' : 'Save Project'}
              </AdminButton>
              <AdminButton variant="secondary" onClick={() => setEditing(null)}>
                Cancel
              </AdminButton>
            </div>
          </form>
        </Card>
      )}

      {SECTIONS.map(({ key, label }) => {
        const items = projects.filter((p) => p.section === key).sort((a, b) => a.displayOrder - b.displayOrder);
        return (
          <div key={key} className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-slate-900">{label}</h2>
              <AdminButton variant="secondary" onClick={() => startCreate(key)}>
                <span className="flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Add Project
                </span>
              </AdminButton>
            </div>
            <Card>
              {items.length === 0 ? (
                <p className="text-sm text-slate-400">No projects in this section yet.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {items.map((p, i) => (
                    <li key={p.id} className="py-3 flex items-center gap-3">
                      <img src={p.image} alt="" className="w-12 h-12 object-cover rounded-md flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{p.title}</p>
                        <p className="text-xs text-slate-400">{p.category}</p>
                      </div>
                      <button
                        onClick={() => handleMove(p.id, 'up')}
                        disabled={i === 0}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 disabled:opacity-30"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMove(p.id, 'down')}
                        disabled={i === items.length - 1}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 disabled:opacity-30"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditing(toFormState(p));
                          setSuccess('');
                        }}
                        className="p-1.5 text-slate-400 hover:text-emerald-600"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectsAdmin;
