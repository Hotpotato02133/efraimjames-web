import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowUp, ArrowDown, Pencil, Trash2, Plus, X } from 'lucide-react';
import {
  adminListWorkHistory,
  adminSaveWorkHistory,
  adminDeleteWorkHistory,
  adminMoveWorkHistory,
  uploadAsset,
} from '../../lib/adminApi';
import type { WorkHistoryEntry } from '../../lib/types';
import { Field, Card, AdminButton, ErrorBanner, SuccessBanner, inputClass } from '../components/Field';

interface LinkFormState {
  name: string;
  url: string;
  logo: string;
  logoScale: string;
}

interface FormState {
  id?: string;
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  skillsText: string;
  links: LinkFormState[];
  displayOrder: number;
}

function toFormState(e: WorkHistoryEntry): FormState {
  return {
    id: e.id,
    period: e.period,
    role: e.role,
    company: e.company,
    location: e.location,
    description: e.description,
    skillsText: e.skills.join(', '),
    links: (e.projectLinks ?? []).map((l) => ({
      name: l.name,
      url: l.url,
      logo: l.logo,
      logoScale: l.logoScale ? String(l.logoScale) : '',
    })),
    displayOrder: e.displayOrder,
  };
}

function emptyFormState(nextOrder: number): FormState {
  return {
    period: '',
    role: '',
    company: '',
    location: '',
    description: '',
    skillsText: '',
    links: [],
    displayOrder: nextOrder,
  };
}

const WorkHistoryAdmin = () => {
  const [entries, setEntries] = useState<WorkHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setEntries(await adminListWorkHistory());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load work history.');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleLogoUpload = async (index: number, file: File | undefined) => {
    if (!file || !editing) return;
    setUploadingIndex(index);
    setError('');
    try {
      const url = await uploadAsset(file, 'logos');
      setEditing((prev) => {
        if (!prev) return prev;
        const links = [...prev.links];
        links[index] = { ...links[index], logo: url };
        return { ...prev, links };
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.');
    }
    setUploadingIndex(null);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError('');
    try {
      await adminSaveWorkHistory({
        id: editing.id,
        period: editing.period,
        role: editing.role,
        company: editing.company,
        location: editing.location,
        description: editing.description,
        skills: editing.skillsText.split(',').map((s) => s.trim()).filter(Boolean),
        projectLinks: editing.links
          .filter((l) => l.name && l.url && l.logo)
          .map((l) => ({
            name: l.name,
            url: l.url,
            logo: l.logo,
            logoScale: l.logoScale ? Number(l.logoScale) : undefined,
          })),
        displayOrder: editing.displayOrder,
      });
      setSuccess('Work history entry saved.');
      setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save.');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this work history entry?')) return;
    setError('');
    try {
      await adminDeleteWorkHistory(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete.');
    }
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    setError('');
    try {
      await adminMoveWorkHistory(entries, id, direction);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to reorder.');
    }
  };

  if (loading) return <p className="text-slate-500">Loading…</p>;

  const sorted = [...entries].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Work History</h1>
      {error && <ErrorBanner message={error} />}
      {success && <SuccessBanner message={success} />}

      {editing && (
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">{editing.id ? `Edit: ${editing.role}` : 'New Entry'}</h2>
            <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Period" hint="e.g. Mar 2026 - Sep 2026">
                <input
                  value={editing.period}
                  onChange={(e) => setEditing({ ...editing, period: e.target.value })}
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="Location">
                <input
                  value={editing.location}
                  onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                  required
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Role">
                <input
                  value={editing.role}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="Company">
                <input
                  value={editing.company}
                  onChange={(e) => setEditing({ ...editing, company: e.target.value })}
                  required
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Description">
              <textarea
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                required
                rows={3}
                className={inputClass}
              />
            </Field>

            <Field label="Skills (comma-separated)">
              <input
                value={editing.skillsText}
                onChange={(e) => setEditing({ ...editing, skillsText: e.target.value })}
                className={inputClass}
                placeholder="Frontend Dev, React, Git"
              />
            </Field>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">Project Links</label>
                <button
                  type="button"
                  onClick={() =>
                    setEditing({ ...editing, links: [...editing.links, { name: '', url: '', logo: '', logoScale: '' }] })
                  }
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add link
                </button>
              </div>
              <div className="space-y-3">
                {editing.links.map((link, i) => (
                  <div key={i} className="p-3 border border-slate-200 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                      value={link.name}
                      onChange={(e) => {
                        const links = [...editing.links];
                        links[i] = { ...links[i], name: e.target.value };
                        setEditing({ ...editing, links });
                      }}
                      placeholder="Project name"
                      className={inputClass}
                    />
                    <input
                      value={link.url}
                      onChange={(e) => {
                        const links = [...editing.links];
                        links[i] = { ...links[i], url: e.target.value };
                        setEditing({ ...editing, links });
                      }}
                      placeholder="https://..."
                      className={inputClass}
                    />
                    <div className="flex items-center gap-2 col-span-1 md:col-span-2">
                      {link.logo && <img src={link.logo} alt="" className="w-8 h-8 object-contain" />}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload(i, e.target.files?.[0])}
                        disabled={uploadingIndex === i}
                        className="text-sm flex-1"
                      />
                      <input
                        value={link.logoScale}
                        onChange={(e) => {
                          const links = [...editing.links];
                          links[i] = { ...links[i], logoScale: e.target.value };
                          setEditing({ ...editing, links });
                        }}
                        placeholder="Zoom (optional)"
                        className={inputClass + ' w-32'}
                      />
                      <button
                        type="button"
                        onClick={() => setEditing({ ...editing, links: editing.links.filter((_, idx) => idx !== i) })}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <AdminButton type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save Entry'}
              </AdminButton>
              <AdminButton variant="secondary" onClick={() => setEditing(null)}>
                Cancel
              </AdminButton>
            </div>
          </form>
        </Card>
      )}

      <div className="flex justify-end mb-3">
        <AdminButton variant="secondary" onClick={() => setEditing(emptyFormState(entries.length))}>
          <span className="flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add Entry
          </span>
        </AdminButton>
      </div>
      <Card>
        <ul className="divide-y divide-slate-100">
          {sorted.map((entry, i) => (
            <li key={entry.id} className="py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900">
                  {entry.role} · {entry.company}
                </p>
                <p className="text-xs text-slate-400">{entry.period}</p>
              </div>
              <button
                onClick={() => handleMove(entry.id, 'up')}
                disabled={i === 0}
                className="p-1.5 text-slate-400 hover:text-emerald-600 disabled:opacity-30"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleMove(entry.id, 'down')}
                disabled={i === sorted.length - 1}
                className="p-1.5 text-slate-400 hover:text-emerald-600 disabled:opacity-30"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setEditing(toFormState(entry));
                  setSuccess('');
                }}
                className="p-1.5 text-slate-400 hover:text-emerald-600"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(entry.id)} className="p-1.5 text-slate-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default WorkHistoryAdmin;
