import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { ExternalLink, FolderKanban, Link2, Pencil, Plus, Trash2 } from 'lucide-react';
import { adminListProjects, adminSaveProject, adminDeleteProject, adminMoveProject } from '../../lib/adminApi';
import type { Project } from '../../lib/types';
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
  Select,
  Textarea,
  slugify,
  splitList,
} from '../components/ui';
import { Drawer } from '../components/Drawer';
import { ImageUpload } from '../components/ImageUpload';
import { useToast, errorMessage } from '../components/Toast';
import { useConfirm } from '../components/ConfirmDialog';

const SECTIONS: { key: Project['section']; label: string; hint: string }[] = [
  { key: 'featured', label: 'Featured Projects', hint: 'Solo work shown first on the home page — up to three cards.' },
  { key: 'collaborative', label: 'Collaborative Projects', hint: 'Work shipped with a team — two cards side by side.' },
  { key: 'other', label: 'Explorations', hint: 'Everything else, revealed by the "View all projects" toggle.' },
];

interface FormState {
  isNew: boolean;
  slugTouched: boolean;
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
    slugTouched: true,
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
    slugTouched: false,
    id: '',
    title: '',
    cardTitle: '',
    description: '',
    fullDescription: '',
    image: '',
    tagsText: '',
    category: 'Fullstack Project',
    link: '#',
    year: String(new Date().getFullYear()),
    client: '',
    role: '',
    section,
    displayOrder: nextOrder,
  };
}

const ProjectsAdmin = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setProjects(await adminListProjects());
    } catch (e) {
      toast.error('Failed to load projects.', errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const startCreate = (section: Project['section']) => {
    const count = projects.filter((p) => p.section === section).length;
    setEditing(emptyFormState(section, count));
  };

  const closeDrawer = useCallback(() => setEditing(null), []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const id = editing.id.trim();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
      toast.error('Invalid ID.', 'Use lowercase letters, numbers and hyphens only, e.g. "zion-shop".');
      return;
    }
    if (!editing.image) {
      toast.error('Add a cover image before saving.');
      return;
    }
    setSaving(true);
    try {
      await adminSaveProject({
        id,
        title: editing.title.trim(),
        cardTitle: editing.cardTitle.trim() || undefined,
        description: editing.description.trim(),
        fullDescription: editing.fullDescription.trim(),
        image: editing.image,
        tags: splitList(editing.tagsText),
        category: editing.category.trim(),
        link: editing.link.trim() || '#',
        year: editing.year.trim(),
        client: editing.client.trim(),
        role: editing.role.trim(),
        section: editing.section,
        displayOrder: editing.displayOrder,
        isNew: editing.isNew,
      });
      toast.success(editing.isNew ? 'Project created.' : 'Project saved.', `"${editing.title.trim()}" is live on the site.`);
      setEditing(null);
      await load();
    } catch (e) {
      toast.error('Failed to save project.', errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project: Project) => {
    const ok = await confirm({
      title: `Delete "${project.title}"?`,
      description: 'The project card and its detail page are removed from the live site immediately. This cannot be undone.',
      confirmLabel: 'Delete project',
      danger: true,
    });
    if (!ok) return;
    setBusyId(project.id);
    try {
      await adminDeleteProject(project.id);
      toast.success('Project deleted.');
      await load();
    } catch (e) {
      toast.error('Failed to delete project.', errorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    setBusyId(id);
    try {
      await adminMoveProject(projects, id, direction);
      await load();
    } catch (e) {
      toast.error('Failed to reorder.', errorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <PageSkeleton rows={3} />;

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Projects"
        description="Each card links to its own detail page. Order within a section is the order visitors see."
        actions={
          <Button icon={Plus} onClick={() => startCreate('featured')}>
            New project
          </Button>
        }
      />

      <div className="space-y-6">
        {SECTIONS.map(({ key, label, hint }) => {
          const items = projects.filter((p) => p.section === key).sort((a, b) => a.displayOrder - b.displayOrder);
          return (
            <Card
              key={key}
              title={
                <span className="flex items-center gap-2">
                  {label}
                  <Badge>{items.length}</Badge>
                </span>
              }
              description={hint}
              actions={
                <Button variant="secondary" size="sm" icon={Plus} onClick={() => startCreate(key)}>
                  Add
                </Button>
              }
              flush
            >
              {items.length === 0 ? (
                <EmptyState
                  icon={FolderKanban}
                  title="Nothing here yet"
                  description="Projects you add to this section appear on the home page in this order."
                  action={
                    <Button variant="secondary" size="sm" icon={Plus} onClick={() => startCreate(key)}>
                      Add a project
                    </Button>
                  }
                  className="py-8"
                />
              ) : (
                <ul className="divide-y divide-slate-100">
                  {items.map((p, i) => (
                    <li key={p.id} className={`flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:px-6 ${busyId === p.id ? 'opacity-60' : ''}`}>
                      <div className="flex min-w-0 flex-1 items-center gap-4">
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-slate-100 text-[11px] font-semibold tabular-nums text-slate-500">
                          {i + 1}
                        </span>
                        <img src={p.image} alt="" className="h-14 w-24 flex-shrink-0 rounded-lg border border-slate-200 bg-slate-100 object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-2 truncate font-semibold text-slate-900">
                            <span className="truncate">{p.title}</span>
                            {p.link && p.link !== '#' ? (
                              <a
                                href={p.link}
                                target="_blank"
                                rel="noreferrer"
                                title={p.link}
                                className="flex-shrink-0 text-slate-300 hover:text-emerald-600"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            ) : (
                              <Link2 className="h-3.5 w-3.5 flex-shrink-0 text-slate-200" aria-label="No live link" />
                            )}
                          </p>
                          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                            <span>{p.category}</span>
                            <span className="text-slate-300">·</span>
                            <span>{p.year}</span>
                            <span className="text-slate-300">·</span>
                            <span className="font-mono text-[11px] text-slate-400">/project/{p.id}</span>
                          </p>
                          {p.tags.length > 0 && (
                            <div className="mt-2 hidden sm:block">
                              <Chips items={p.tags} max={5} />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-1 sm:pl-2">
                        <ReorderButtons
                          onUp={() => handleMove(p.id, 'up')}
                          onDown={() => handleMove(p.id, 'down')}
                          disableUp={i === 0}
                          disableDown={i === items.length - 1}
                          busy={busyId !== null}
                        />
                        <IconButton label="Edit project" icon={Pencil} onClick={() => setEditing(toFormState(p))} />
                        <IconButton label="Delete project" icon={Trash2} tone="danger" onClick={() => handleDelete(p)} disabled={busyId !== null} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          );
        })}
      </div>

      <Drawer
        open={editing !== null}
        onClose={closeDrawer}
        title={editing?.isNew ? 'New project' : `Edit ${editing?.title || 'project'}`}
        description={editing?.isNew ? 'Fill in the card and detail-page content.' : 'Changes go live as soon as you save.'}
        wide
        footer={
          <>
            <Button variant="secondary" onClick={closeDrawer} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form="project-form" loading={saving} disabled={uploading}>
              {editing?.isNew ? 'Create project' : 'Save changes'}
            </Button>
          </>
        }
      >
        {editing && (
          <form id="project-form" onSubmit={handleSave} className="space-y-8">
            <section className="space-y-4">
              <SectionLabel>Basics</SectionLabel>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Title" required>
                  <Input
                    value={editing.title}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        title: e.target.value,
                        id: editing.isNew && !editing.slugTouched ? slugify(e.target.value) : editing.id,
                      })
                    }
                    required
                    autoFocus
                    placeholder="Zion Shop"
                  />
                </Field>
                <Field label="ID (URL slug)" required hint={editing.isNew ? 'Generated from the title — becomes /project/<id>. Fixed after creation.' : 'Cannot be changed after creation.'}>
                  <Input
                    value={editing.id}
                    onChange={(e) => setEditing({ ...editing, id: slugify(e.target.value).replace(/-$/, '') || e.target.value.toLowerCase(), slugTouched: true })}
                    disabled={!editing.isNew}
                    required
                    placeholder="my-project-slug"
                    className="font-mono text-xs"
                  />
                </Field>
                <Field label="Section" required>
                  <Select value={editing.section} onChange={(e) => setEditing({ ...editing, section: e.target.value as Project['section'] })}>
                    {SECTIONS.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Card title" hint="Optional shorter title for the card, e.g. an acronym.">
                  <Input value={editing.cardTitle} onChange={(e) => setEditing({ ...editing, cardTitle: e.target.value })} placeholder="DAMS" />
                </Field>
              </div>
            </section>

            <section className="space-y-4">
              <SectionLabel>Media</SectionLabel>
              <ImageUpload
                label="Cover image"
                value={editing.image}
                onChange={(url) => setEditing((prev) => (prev ? { ...prev, image: url } : prev))}
                folder="projects"
                onUploadingChange={setUploading}
                hint="Shown at 16:10 on cards and 16:9 on the detail page — a 1600×1000 screenshot works well."
              />
            </section>

            <section className="space-y-4">
              <SectionLabel>Copy</SectionLabel>
              <Field label="Short description" required hint="One or two sentences shown on the card and in search previews.">
                <Textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} required rows={2} />
              </Field>
              <Field label="Full description" required hint="The “About the project” body on the detail page.">
                <Textarea value={editing.fullDescription} onChange={(e) => setEditing({ ...editing, fullDescription: e.target.value })} required rows={6} />
              </Field>
              <Field label="Technologies & skills" hint="Comma-separated. Rendered as tag pills.">
                <Input value={editing.tagsText} onChange={(e) => setEditing({ ...editing, tagsText: e.target.value })} placeholder="React, TypeScript, Supabase" />
                <div className="mt-2">
                  <Chips items={splitList(editing.tagsText)} max={12} />
                </div>
              </Field>
            </section>

            <section className="space-y-4">
              <SectionLabel>Details</SectionLabel>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Category" required hint="Groups related projects on the detail page.">
                  <Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} required placeholder="Fullstack Project" />
                </Field>
                <Field label="Live link" hint='Use "#" to hide the "View Live Project" button.'>
                  <Input value={editing.link} onChange={(e) => setEditing({ ...editing, link: e.target.value })} placeholder="https://…" />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Field label="Year" required>
                  <Input value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} required inputMode="numeric" />
                </Field>
                <Field label="Client" required>
                  <Input value={editing.client} onChange={(e) => setEditing({ ...editing, client: e.target.value })} required placeholder="Personal Project" />
                </Field>
                <Field label="Your role" required>
                  <Input value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} required placeholder="Fullstack Developer" />
                </Field>
              </div>
            </section>
          </form>
        )}
      </Drawer>
    </div>
  );
};

export default ProjectsAdmin;
