import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Briefcase, MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import { adminListWorkHistory, adminSaveWorkHistory, adminDeleteWorkHistory, adminMoveWorkHistory } from '../../lib/adminApi';
import type { WorkHistoryEntry } from '../../lib/types';
import {
  Badge,
  Button,
  Card,
  Chips,
  EmptyState,
  Field,
  IconButton,
  Input,
  PageHeader,
  PageSkeleton,
  ReorderButtons,
  SectionLabel,
  Textarea,
  splitList,
} from '../components/ui';
import { Drawer } from '../components/Drawer';
import { ImageUpload } from '../components/ImageUpload';
import { useToast, errorMessage } from '../components/Toast';
import { useConfirm } from '../components/ConfirmDialog';

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
  return { period: '', role: '', company: '', location: '', description: '', skillsText: '', links: [], displayOrder: nextOrder };
}

const WorkHistoryAdmin = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const [entries, setEntries] = useState<WorkHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setEntries(await adminListWorkHistory());
    } catch (e) {
      toast.error('Failed to load work history.', errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const closeDrawer = useCallback(() => setEditing(null), []);

  const updateLink = (index: number, patch: Partial<LinkFormState>) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const links = [...prev.links];
      links[index] = { ...links[index], ...patch };
      return { ...prev, links };
    });
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const incomplete = editing.links.find((l) => !l.name.trim() || !l.url.trim() || !l.logo);
    if (incomplete) {
      toast.error('Finish every project link.', 'Each link needs a name, a URL and a logo — or remove it.');
      return;
    }
    setSaving(true);
    try {
      await adminSaveWorkHistory({
        id: editing.id,
        period: editing.period.trim(),
        role: editing.role.trim(),
        company: editing.company.trim(),
        location: editing.location.trim(),
        description: editing.description.trim(),
        skills: splitList(editing.skillsText),
        projectLinks: editing.links.map((l) => ({
          name: l.name.trim(),
          url: l.url.trim(),
          logo: l.logo,
          logoScale: l.logoScale ? Number(l.logoScale) : undefined,
        })),
        displayOrder: editing.displayOrder,
      });
      toast.success(editing.id ? 'Entry saved.' : 'Entry added.');
      setEditing(null);
      await load();
    } catch (e) {
      toast.error('Failed to save entry.', errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (entry: WorkHistoryEntry) => {
    const ok = await confirm({
      title: `Delete "${entry.role} · ${entry.company}"?`,
      description: 'The entry disappears from the timeline on the live site. This cannot be undone.',
      confirmLabel: 'Delete entry',
      danger: true,
    });
    if (!ok) return;
    setBusyId(entry.id);
    try {
      await adminDeleteWorkHistory(entry.id);
      toast.success('Entry deleted.');
      await load();
    } catch (e) {
      toast.error('Failed to delete.', errorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    setBusyId(id);
    try {
      await adminMoveWorkHistory(entries, id, direction);
      await load();
    } catch (e) {
      toast.error('Failed to reorder.', errorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <PageSkeleton rows={4} />;

  const sorted = [...entries].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Work History"
        description="The timeline on the home page, top to bottom. Put your most recent role first."
        actions={
          <Button icon={Plus} onClick={() => setEditing(emptyFormState(entries.length))}>
            Add entry
          </Button>
        }
      />

      <Card flush>
        {sorted.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No work history yet"
            description="Add your roles and the products you shipped at each one."
            action={
              <Button variant="secondary" size="sm" icon={Plus} onClick={() => setEditing(emptyFormState(0))}>
                Add your first entry
              </Button>
            }
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {sorted.map((entry, i) => (
              <li key={entry.id} className={`flex flex-col gap-4 px-5 py-5 sm:flex-row sm:px-6 ${busyId === entry.id ? 'opacity-60' : ''}`}>
                <div className="flex flex-shrink-0 items-start gap-3 sm:w-44 sm:flex-col sm:gap-1.5">
                  <Badge tone="emerald" className="whitespace-nowrap">
                    {entry.period}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="h-3 w-3" /> {entry.location}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">
                    {entry.role} <span className="font-normal text-slate-400">at</span> {entry.company}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{entry.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    {entry.projectLinks && entry.projectLinks.length > 0 && (
                      <div className="flex items-center -space-x-1.5">
                        {entry.projectLinks.map((link) => (
                          <span
                            key={link.url}
                            title={link.name}
                            className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-slate-100 ring-1 ring-slate-200"
                          >
                            <img src={link.logo} alt={link.name} className="h-full w-full object-contain" style={link.logoScale ? { transform: `scale(${link.logoScale})` } : undefined} />
                          </span>
                        ))}
                      </div>
                    )}
                    <Chips items={entry.skills} max={6} />
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-1 self-start">
                  <ReorderButtons
                    onUp={() => handleMove(entry.id, 'up')}
                    onDown={() => handleMove(entry.id, 'down')}
                    disableUp={i === 0}
                    disableDown={i === sorted.length - 1}
                    busy={busyId !== null}
                  />
                  <IconButton label="Edit entry" icon={Pencil} onClick={() => setEditing(toFormState(entry))} />
                  <IconButton label="Delete entry" icon={Trash2} tone="danger" onClick={() => handleDelete(entry)} disabled={busyId !== null} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Drawer
        open={editing !== null}
        onClose={closeDrawer}
        title={editing?.id ? `Edit ${editing.role || 'entry'}` : 'New work history entry'}
        description="Keep the description to one short paragraph so cards line up."
        wide
        footer={
          <>
            <Button variant="secondary" onClick={closeDrawer} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form="work-history-form" loading={saving} disabled={uploading}>
              {editing?.id ? 'Save changes' : 'Add entry'}
            </Button>
          </>
        }
      >
        {editing && (
          <form id="work-history-form" onSubmit={handleSave} className="space-y-8">
            <section className="space-y-4">
              <SectionLabel>Role</SectionLabel>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Role" required>
                  <Input value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} required autoFocus placeholder="Software Engineer" />
                </Field>
                <Field label="Company" required>
                  <Input value={editing.company} onChange={(e) => setEditing({ ...editing, company: e.target.value })} required placeholder="Acme Inc." />
                </Field>
                <Field label="Period" required hint="e.g. Mar 2026 – Sep 2026">
                  <Input value={editing.period} onChange={(e) => setEditing({ ...editing, period: e.target.value })} required placeholder="Jan 2025 – Present" />
                </Field>
                <Field label="Location" required hint="e.g. Remote · New York, USA">
                  <Input value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} required placeholder="Remote · Manila, PH" />
                </Field>
              </div>
              <Field label="Description" required>
                <Textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} required rows={4} />
              </Field>
              <Field label="Skills" hint="Comma-separated. Rendered as tags under the card.">
                <Input value={editing.skillsText} onChange={(e) => setEditing({ ...editing, skillsText: e.target.value })} placeholder="Frontend Dev, React, Git" />
                <div className="mt-2">
                  <Chips items={splitList(editing.skillsText)} max={12} />
                </div>
              </Field>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <SectionLabel>Project links</SectionLabel>
                  <p className="mt-1 text-xs text-slate-400">Logo tiles under the card that open the live product.</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Plus}
                  onClick={() => setEditing({ ...editing, links: [...editing.links, { name: '', url: '', logo: '', logoScale: '' }] })}
                >
                  Add link
                </Button>
              </div>

              {editing.links.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400">No links yet.</p>
              ) : (
                <div className="space-y-3">
                  {editing.links.map((link, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-700">Link {i + 1}</p>
                        <IconButton
                          label="Remove link"
                          icon={Trash2}
                          tone="danger"
                          onClick={() => setEditing({ ...editing, links: editing.links.filter((_, idx) => idx !== i) })}
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <Field label="Name" required>
                          <Input value={link.name} onChange={(e) => updateLink(i, { name: e.target.value })} placeholder="Yolk" />
                        </Field>
                        <Field label="URL" required>
                          <Input value={link.url} onChange={(e) => updateLink(i, { url: e.target.value })} placeholder="https://…" type="url" />
                        </Field>
                        <div className="md:col-span-2 grid grid-cols-1 gap-3 md:grid-cols-[1fr_9rem]">
                          <ImageUpload
                            label="Logo"
                            value={link.logo}
                            onChange={(url) => updateLink(i, { logo: url })}
                            folder="logos"
                            shape="square"
                            onUploadingChange={setUploading}
                          />
                          <Field label="Zoom" hint="Crops padded logos. 1 = none.">
                            <Input
                              value={link.logoScale}
                              onChange={(e) => updateLink(i, { logoScale: e.target.value })}
                              placeholder="1.3"
                              inputMode="decimal"
                            />
                          </Field>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </form>
        )}
      </Drawer>
    </div>
  );
};

export default WorkHistoryAdmin;
