import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Pencil, Plus, Save, Sparkles, Trash2, User, Wand2, Wrench } from 'lucide-react';
import {
  adminGetHeroContent,
  adminSaveHeroContent,
  adminGetAboutContent,
  adminSaveAboutContent,
  adminListHeroToolkit,
  adminSaveToolkitItem,
  adminDeleteToolkitItem,
  adminMoveToolkitItem,
  adminListCapabilities,
  adminSaveCapability,
} from '../../lib/adminApi';
import type { HeroContent, AboutContent, HeroToolkitItem, Capability } from '../../lib/types';
import { ICON_REGISTRY } from '../../lib/iconRegistry';
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
  Select,
  Tabs,
  Textarea,
  splitList,
} from '../components/ui';
import { Drawer } from '../components/Drawer';
import { ResumeUpload } from '../components/ResumeUpload';
import { useToast, errorMessage } from '../components/Toast';
import { useConfirm } from '../components/ConfirmDialog';

type Tab = 'hero' | 'about' | 'toolkit' | 'capabilities';

interface ToolkitFormState {
  id?: string;
  name: string;
  iconKey: string;
  displayOrder: number;
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

const HeroAboutAdmin = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const [tab, setTab] = useState<Tab>('hero');

  const [hero, setHero] = useState<HeroContent | null>(null);
  const [heroSaved, setHeroSaved] = useState<HeroContent | null>(null);
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [aboutSaved, setAboutSaved] = useState<AboutContent | null>(null);
  const [aboutTagsText, setAboutTagsText] = useState('');
  const [toolkit, setToolkit] = useState<HeroToolkitItem[]>([]);
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [capabilitiesSaved, setCapabilitiesSaved] = useState<Capability[]>([]);
  const [toolkitForm, setToolkitForm] = useState<ToolkitFormState | null>(null);

  const [loading, setLoading] = useState(true);
  const [savingHero, setSavingHero] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [savingAbout, setSavingAbout] = useState(false);
  const [savingToolkit, setSavingToolkit] = useState(false);
  const [savingCapId, setSavingCapId] = useState<number | null>(null);
  const [busyToolkitId, setBusyToolkitId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [h, a, t, c] = await Promise.all([adminGetHeroContent(), adminGetAboutContent(), adminListHeroToolkit(), adminListCapabilities()]);
      setHero(h);
      setHeroSaved(h);
      setAbout(a);
      setAboutSaved(a);
      setAboutTagsText(a.tags.join(', '));
      setToolkit(t);
      setCapabilities(c);
      setCapabilitiesSaved(c);
    } catch (e) {
      toast.error('Failed to load content.', errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaveHero = async (e: FormEvent) => {
    e.preventDefault();
    if (!hero) return;
    setSavingHero(true);
    try {
      await adminSaveHeroContent(hero);
      setHeroSaved(hero);
      toast.success('Hero content saved.');
    } catch (err) {
      toast.error('Failed to save hero content.', errorMessage(err));
    } finally {
      setSavingHero(false);
    }
  };

  const handlePersistResume = async (url: string, filename: string) => {
    if (!hero) return;
    const nextHero: HeroContent = {
      ...hero,
      resumeUrl: url || undefined,
      resumeFilename: filename,
    };
    setHero(nextHero);
    await adminSaveHeroContent(nextHero);
    setHeroSaved(nextHero);
  };

  const aboutDraft: AboutContent | null = about ? { ...about, tags: splitList(aboutTagsText) } : null;

  const handleSaveAbout = async (e: FormEvent) => {
    e.preventDefault();
    if (!aboutDraft) return;
    setSavingAbout(true);
    try {
      await adminSaveAboutContent(aboutDraft);
      setAbout(aboutDraft);
      setAboutSaved(aboutDraft);
      toast.success('About content saved.');
    } catch (err) {
      toast.error('Failed to save about content.', errorMessage(err));
    } finally {
      setSavingAbout(false);
    }
  };

  const closeToolkitForm = useCallback(() => setToolkitForm(null), []);

  const handleSaveToolkitItem = async (e: FormEvent) => {
    e.preventDefault();
    if (!toolkitForm) return;
    setSavingToolkit(true);
    try {
      await adminSaveToolkitItem({ ...toolkitForm, name: toolkitForm.name.trim() });
      setToolkitForm(null);
      toast.success(toolkitForm.id ? 'Toolkit item saved.' : 'Toolkit item added.');
      setToolkit(await adminListHeroToolkit());
    } catch (err) {
      toast.error('Failed to save toolkit item.', errorMessage(err));
    } finally {
      setSavingToolkit(false);
    }
  };

  const handleDeleteToolkitItem = async (item: HeroToolkitItem) => {
    const ok = await confirm({ title: `Remove "${item.name}" from the toolkit?`, confirmLabel: 'Remove', danger: true });
    if (!ok) return;
    setBusyToolkitId(item.id);
    try {
      await adminDeleteToolkitItem(item.id);
      setToolkit(await adminListHeroToolkit());
      toast.success('Toolkit item removed.');
    } catch (err) {
      toast.error('Failed to remove item.', errorMessage(err));
    } finally {
      setBusyToolkitId(null);
    }
  };

  const handleMoveToolkitItem = async (id: string, direction: 'up' | 'down') => {
    setBusyToolkitId(id);
    try {
      await adminMoveToolkitItem(toolkit, id, direction);
      setToolkit(await adminListHeroToolkit());
    } catch (err) {
      toast.error('Failed to reorder.', errorMessage(err));
    } finally {
      setBusyToolkitId(null);
    }
  };

  const handleSaveCapability = async (cap: Capability) => {
    setSavingCapId(cap.id);
    try {
      await adminSaveCapability(cap);
      setCapabilitiesSaved((prev) => prev.map((c) => (c.id === cap.id ? cap : c)));
      toast.success(`"${cap.title}" saved.`);
    } catch (err) {
      toast.error('Failed to save card.', errorMessage(err));
    } finally {
      setSavingCapId(null);
    }
  };

  if (loading || !hero || !about) return <PageSkeleton rows={2} />;

  const sortedToolkit = [...toolkit].sort((a, b) => a.displayOrder - b.displayOrder);
  const heroDirty = !same(hero, heroSaved);
  const aboutDirty = !same(aboutDraft, aboutSaved);

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Hero & About"
        description="The first things a visitor reads: the headline, your intro, the toolkit marquee and the capability cards."
      />

      <Tabs
        className="mb-6"
        value={tab}
        onChange={setTab}
        tabs={[
          { key: 'hero', label: 'Hero', icon: Sparkles },
          { key: 'about', label: 'About', icon: User },
          { key: 'toolkit', label: 'Toolkit', icon: Wrench, count: toolkit.length },
          { key: 'capabilities', label: 'Capabilities', icon: Wand2, count: capabilities.length },
        ]}
      />

      {tab === 'hero' && (
        <Card
          title="Hero section"
          description="Badge, headline and the two call-to-action buttons."
          actions={heroDirty ? <Badge tone="amber">Unsaved changes</Badge> : <Badge tone="emerald">Saved</Badge>}
        >
          <form onSubmit={handleSaveHero} className="space-y-5">
            <Field label="Badge text" hint="The small pill above the headline.">
              <Input value={hero.badgeText} onChange={(e) => setHero({ ...hero, badgeText: e.target.value })} />
            </Field>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Heading line 1">
                <Input value={hero.headingLine1} onChange={(e) => setHero({ ...hero, headingLine1: e.target.value })} />
              </Field>
              <Field label="Heading line 2" hint="Rendered in the italic emerald gradient.">
                <Input value={hero.headingLine2} onChange={(e) => setHero({ ...hero, headingLine2: e.target.value })} />
              </Field>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Preview</p>
              <p className="mt-2 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                {hero.headingLine1 || '…'}
                <br />
                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text font-serif italic text-transparent">{hero.headingLine2 || '…'}</span>
              </p>
            </div>
            <Field label="Subheading">
              <Textarea value={hero.subheading} onChange={(e) => setHero({ ...hero, subheading: e.target.value })} rows={3} />
            </Field>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Primary button label">
                <Input value={hero.ctaPrimaryLabel} onChange={(e) => setHero({ ...hero, ctaPrimaryLabel: e.target.value })} />
              </Field>
              <Field label="Secondary button label">
                <Input value={hero.ctaSecondaryLabel} onChange={(e) => setHero({ ...hero, ctaSecondaryLabel: e.target.value })} />
              </Field>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <ResumeUpload
                value={hero.resumeUrl}
                filename={hero.resumeFilename}
                onUploadingChange={setUploadingResume}
                onPersist={handlePersistResume}
                onChange={(url, filename) =>
                  setHero((prev) => (prev ? { ...prev, resumeUrl: url || undefined, resumeFilename: filename } : null))
                }
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" icon={Save} loading={savingHero} disabled={!heroDirty || uploadingResume}>
                Save hero
              </Button>
              {heroDirty && (
                <Button variant="ghost" onClick={() => heroSaved && setHero(heroSaved)}>
                  Discard
                </Button>
              )}
            </div>
          </form>
        </Card>
      )}

      {tab === 'about' && (
        <Card
          title="About section"
          description="Two short paragraphs and a row of tag pills."
          actions={aboutDirty ? <Badge tone="amber">Unsaved changes</Badge> : <Badge tone="emerald">Saved</Badge>}
        >
          <form onSubmit={handleSaveAbout} className="space-y-5">
            <Field label="Paragraph 1">
              <Textarea value={about.paragraph1} onChange={(e) => setAbout({ ...about, paragraph1: e.target.value })} rows={4} />
            </Field>
            <Field label="Paragraph 2">
              <Textarea value={about.paragraph2} onChange={(e) => setAbout({ ...about, paragraph2: e.target.value })} rows={4} />
            </Field>
            <Field label="Tags" hint="Comma-separated.">
              <Input value={aboutTagsText} onChange={(e) => setAboutTagsText(e.target.value)} />
              <div className="mt-2">
                <Chips items={splitList(aboutTagsText)} max={12} />
              </div>
            </Field>
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" icon={Save} loading={savingAbout} disabled={!aboutDirty}>
                Save about
              </Button>
              {aboutDirty && aboutSaved && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setAbout(aboutSaved);
                    setAboutTagsText(aboutSaved.tags.join(', '));
                  }}
                >
                  Discard
                </Button>
              )}
            </div>
          </form>
        </Card>
      )}

      {tab === 'toolkit' && (
        <Card
          title="Toolkit marquee"
          description="The scrolling row of technologies under the hero. Icons come from a fixed registry."
          actions={
            <Button
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={() => setToolkitForm({ name: '', iconKey: Object.keys(ICON_REGISTRY)[0], displayOrder: toolkit.length })}
            >
              Add item
            </Button>
          }
          flush
        >
          {sortedToolkit.length === 0 ? (
            <EmptyState icon={Wrench} title="No toolkit items" description="Add the technologies you want to show off in the marquee." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {sortedToolkit.map((item, i) => {
                const entry = ICON_REGISTRY[item.iconKey];
                const Icon = entry?.icon;
                return (
                  <li key={item.id} className={`flex items-center gap-4 px-5 py-3 sm:px-6 ${busyToolkitId === item.id ? 'opacity-60' : ''}`}>
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white">
                      {Icon ? <Icon className={`h-5 w-5 ${entry.color}`} /> : <span className="text-xs text-red-500">?</span>}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-400">{entry ? entry.label : `Unknown icon "${item.iconKey}"`}</p>
                    </div>
                    <ReorderButtons
                      onUp={() => handleMoveToolkitItem(item.id, 'up')}
                      onDown={() => handleMoveToolkitItem(item.id, 'down')}
                      disableUp={i === 0}
                      disableDown={i === sortedToolkit.length - 1}
                      busy={busyToolkitId !== null}
                    />
                    <IconButton
                      label="Edit item"
                      icon={Pencil}
                      onClick={() => setToolkitForm({ id: item.id, name: item.name, iconKey: item.iconKey, displayOrder: item.displayOrder })}
                    />
                    <IconButton label="Remove item" icon={Trash2} tone="danger" onClick={() => handleDeleteToolkitItem(item)} disabled={busyToolkitId !== null} />
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      )}

      {tab === 'capabilities' && (
        <div>
          <p className="mb-4 text-sm text-slate-500">
            The six “What I can do” cards. Each card's icon and mini-animation are fixed in code — only the copy and the button are editable.
          </p>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {capabilities.map((cap) => {
              const saved = capabilitiesSaved.find((c) => c.id === cap.id);
              const dirty = !same(cap, saved);
              const update = (patch: Partial<Capability>) => setCapabilities((prev) => prev.map((c) => (c.id === cap.id ? { ...c, ...patch } : c)));
              return (
                <Card
                  key={cap.id}
                  title={
                    <span className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-[11px] font-bold text-white">{cap.id}</span>
                      {saved?.title || `Card ${cap.id}`}
                    </span>
                  }
                  actions={dirty ? <Badge tone="amber">Unsaved</Badge> : null}
                  bodyClassName="space-y-4 p-5"
                >
                  <Field label="Title">
                    <Input value={cap.title} onChange={(e) => update({ title: e.target.value })} className="font-semibold" />
                  </Field>
                  <Field label="Description">
                    <Textarea value={cap.description} onChange={(e) => update({ description: e.target.value })} rows={3} />
                  </Field>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Button label">
                      <Input value={cap.ctaLabel} onChange={(e) => update({ ctaLabel: e.target.value })} />
                    </Field>
                    <Field label="Button target" hint="A section anchor like #projects.">
                      <Select value={cap.ctaTarget} onChange={(e) => update({ ctaTarget: e.target.value })}>
                        {['#projects', '#collaborative-projects', '#other-projects', '#about', '#work-history', '#contact', '#what-i-can-do'].map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                        {!['#projects', '#collaborative-projects', '#other-projects', '#about', '#work-history', '#contact', '#what-i-can-do'].includes(cap.ctaTarget) && (
                          <option value={cap.ctaTarget}>{cap.ctaTarget}</option>
                        )}
                      </Select>
                    </Field>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" icon={Save} onClick={() => handleSaveCapability(cap)} loading={savingCapId === cap.id} disabled={!dirty}>
                      Save card
                    </Button>
                    {dirty && saved && (
                      <Button size="sm" variant="ghost" onClick={() => update(saved)}>
                        Discard
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <Drawer
        open={toolkitForm !== null}
        onClose={closeToolkitForm}
        title={toolkitForm?.id ? 'Edit toolkit item' : 'Add toolkit item'}
        description="Pick an icon from the registry and give it a display name."
        footer={
          <>
            <Button variant="secondary" onClick={closeToolkitForm} disabled={savingToolkit}>
              Cancel
            </Button>
            <Button type="submit" form="toolkit-form" loading={savingToolkit}>
              {toolkitForm?.id ? 'Save item' : 'Add item'}
            </Button>
          </>
        }
      >
        {toolkitForm && (
          <form id="toolkit-form" onSubmit={handleSaveToolkitItem} className="space-y-5">
            <Field label="Display name" required>
              <Input value={toolkitForm.name} onChange={(e) => setToolkitForm({ ...toolkitForm, name: e.target.value })} required autoFocus placeholder="React" />
            </Field>
            <Field label="Icon" required>
              <Select value={toolkitForm.iconKey} onChange={(e) => setToolkitForm({ ...toolkitForm, iconKey: e.target.value })}>
                {Object.entries(ICON_REGISTRY).map(([key, entry]) => (
                  <option key={key} value={key}>
                    {entry.label}
                  </option>
                ))}
              </Select>
            </Field>
            {(() => {
              const entry = ICON_REGISTRY[toolkitForm.iconKey];
              const Icon = entry?.icon;
              return (
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white">
                    {Icon && <Icon className={`h-5 w-5 ${entry.color}`} />}
                  </span>
                  <span className="text-sm font-medium text-slate-700">{toolkitForm.name || entry?.label || 'Preview'}</span>
                </div>
              );
            })()}
          </form>
        )}
      </Drawer>
    </div>
  );
};

export default HeroAboutAdmin;
