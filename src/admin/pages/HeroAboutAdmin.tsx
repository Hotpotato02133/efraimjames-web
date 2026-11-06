import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowUp, ArrowDown, Pencil, Trash2, Plus } from 'lucide-react';
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
import { Field, Card, AdminButton, ErrorBanner, SuccessBanner, inputClass } from '../components/Field';

interface ToolkitFormState {
  id?: string;
  name: string;
  iconKey: string;
  displayOrder: number;
}

const HeroAboutAdmin = () => {
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [aboutTagsText, setAboutTagsText] = useState('');
  const [toolkit, setToolkit] = useState<HeroToolkitItem[]>([]);
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [toolkitForm, setToolkitForm] = useState<ToolkitFormState | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savingHero, setSavingHero] = useState(false);
  const [savingAbout, setSavingAbout] = useState(false);
  const [savingToolkit, setSavingToolkit] = useState(false);
  const [savingCapId, setSavingCapId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [h, a, t, c] = await Promise.all([
        adminGetHeroContent(),
        adminGetAboutContent(),
        adminListHeroToolkit(),
        adminListCapabilities(),
      ]);
      setHero(h);
      setAbout(a);
      setAboutTagsText(a.tags.join(', '));
      setToolkit(t);
      setCapabilities(c);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load content.');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSaveHero = async (e: FormEvent) => {
    e.preventDefault();
    if (!hero) return;
    setSavingHero(true);
    setError('');
    try {
      await adminSaveHeroContent(hero);
      setSuccess('Hero content saved.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save hero content.');
    }
    setSavingHero(false);
  };

  const handleSaveAbout = async (e: FormEvent) => {
    e.preventDefault();
    if (!about) return;
    setSavingAbout(true);
    setError('');
    try {
      const tags = aboutTagsText.split(',').map((t) => t.trim()).filter(Boolean);
      await adminSaveAboutContent({ ...about, tags });
      setSuccess('About content saved.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save about content.');
    }
    setSavingAbout(false);
  };

  const handleSaveToolkitItem = async (e: FormEvent) => {
    e.preventDefault();
    if (!toolkitForm) return;
    setSavingToolkit(true);
    setError('');
    try {
      await adminSaveToolkitItem(toolkitForm);
      setToolkitForm(null);
      setSuccess('Toolkit item saved.');
      setToolkit(await adminListHeroToolkit());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save toolkit item.');
    }
    setSavingToolkit(false);
  };

  const handleDeleteToolkitItem = async (id: string) => {
    if (!window.confirm('Remove this toolkit item?')) return;
    setError('');
    try {
      await adminDeleteToolkitItem(id);
      setToolkit(await adminListHeroToolkit());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete.');
    }
  };

  const handleMoveToolkitItem = async (id: string, direction: 'up' | 'down') => {
    setError('');
    try {
      await adminMoveToolkitItem(toolkit, id, direction);
      setToolkit(await adminListHeroToolkit());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to reorder.');
    }
  };

  const handleSaveCapability = async (cap: Capability) => {
    setSavingCapId(cap.id);
    setError('');
    try {
      await adminSaveCapability(cap);
      setSuccess(`"${cap.title}" saved.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save.');
    }
    setSavingCapId(null);
  };

  if (loading || !hero || !about) return <p className="text-slate-500">Loading…</p>;

  const sortedToolkit = [...toolkit].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-slate-900">Hero & About</h1>
      {error && <ErrorBanner message={error} />}
      {success && <SuccessBanner message={success} />}

      {/* Hero content */}
      <Card>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Hero Section</h2>
        <form onSubmit={handleSaveHero} className="space-y-4">
          <Field label="Badge Text">
            <input
              value={hero.badgeText}
              onChange={(e) => setHero({ ...hero, badgeText: e.target.value })}
              className={inputClass}
            />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Heading Line 1">
              <input
                value={hero.headingLine1}
                onChange={(e) => setHero({ ...hero, headingLine1: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Heading Line 2 (gradient word)">
              <input
                value={hero.headingLine2}
                onChange={(e) => setHero({ ...hero, headingLine2: e.target.value })}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Subheading">
            <textarea
              value={hero.subheading}
              onChange={(e) => setHero({ ...hero, subheading: e.target.value })}
              rows={2}
              className={inputClass}
            />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Primary CTA Label">
              <input
                value={hero.ctaPrimaryLabel}
                onChange={(e) => setHero({ ...hero, ctaPrimaryLabel: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Secondary CTA Label">
              <input
                value={hero.ctaSecondaryLabel}
                onChange={(e) => setHero({ ...hero, ctaSecondaryLabel: e.target.value })}
                className={inputClass}
              />
            </Field>
          </div>
          <AdminButton type="submit" disabled={savingHero}>
            {savingHero ? 'Saving…' : 'Save Hero Content'}
          </AdminButton>
        </form>
      </Card>

      {/* About content */}
      <Card>
        <h2 className="text-lg font-bold text-slate-900 mb-4">About Section</h2>
        <form onSubmit={handleSaveAbout} className="space-y-4">
          <Field label="Paragraph 1">
            <textarea
              value={about.paragraph1}
              onChange={(e) => setAbout({ ...about, paragraph1: e.target.value })}
              rows={3}
              className={inputClass}
            />
          </Field>
          <Field label="Paragraph 2">
            <textarea
              value={about.paragraph2}
              onChange={(e) => setAbout({ ...about, paragraph2: e.target.value })}
              rows={3}
              className={inputClass}
            />
          </Field>
          <Field label="Tags (comma-separated)">
            <input value={aboutTagsText} onChange={(e) => setAboutTagsText(e.target.value)} className={inputClass} />
          </Field>
          <AdminButton type="submit" disabled={savingAbout}>
            {savingAbout ? 'Saving…' : 'Save About Content'}
          </AdminButton>
        </form>
      </Card>

      {/* Hero toolkit */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Tech Stack Marquee</h2>
          <AdminButton
            variant="secondary"
            onClick={() => setToolkitForm({ name: '', iconKey: Object.keys(ICON_REGISTRY)[0], displayOrder: toolkit.length })}
          >
            <span className="flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Add Item
            </span>
          </AdminButton>
        </div>

        {toolkitForm && (
          <form onSubmit={handleSaveToolkitItem} className="mb-4 p-4 border border-slate-200 rounded-lg space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Display Name">
                <input
                  value={toolkitForm.name}
                  onChange={(e) => setToolkitForm({ ...toolkitForm, name: e.target.value })}
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="Icon">
                <select
                  value={toolkitForm.iconKey}
                  onChange={(e) => setToolkitForm({ ...toolkitForm, iconKey: e.target.value })}
                  className={inputClass}
                >
                  {Object.entries(ICON_REGISTRY).map(([key, entry]) => (
                    <option key={key} value={key}>
                      {entry.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="flex gap-3">
              <AdminButton type="submit" disabled={savingToolkit}>
                {savingToolkit ? 'Saving…' : 'Save'}
              </AdminButton>
              <AdminButton variant="secondary" onClick={() => setToolkitForm(null)}>
                Cancel
              </AdminButton>
            </div>
          </form>
        )}

        <ul className="divide-y divide-slate-100">
          {sortedToolkit.map((item, i) => {
            const entry = ICON_REGISTRY[item.iconKey];
            const Icon = entry?.icon;
            return (
              <li key={item.id} className="py-2.5 flex items-center gap-3">
                {Icon && <Icon className={`w-5 h-5 ${entry.color}`} />}
                <span className="flex-1 font-medium text-slate-800">{item.name}</span>
                <button
                  onClick={() => handleMoveToolkitItem(item.id, 'up')}
                  disabled={i === 0}
                  className="p-1.5 text-slate-400 hover:text-emerald-600 disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMoveToolkitItem(item.id, 'down')}
                  disabled={i === sortedToolkit.length - 1}
                  className="p-1.5 text-slate-400 hover:text-emerald-600 disabled:opacity-30"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setToolkitForm({ id: item.id, name: item.name, iconKey: item.iconKey, displayOrder: item.displayOrder })}
                  className="p-1.5 text-slate-400 hover:text-emerald-600"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDeleteToolkitItem(item.id)} className="p-1.5 text-slate-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

      {/* Capabilities ("What I Can Do" cards) */}
      <Card>
        <h2 className="text-lg font-bold text-slate-900 mb-1">What I Can Do</h2>
        <p className="text-sm text-slate-400 mb-4">
          Only the copy is editable here — each card's icon and mini-animation are fixed in code.
        </p>
        <div className="space-y-4">
          {capabilities.map((cap) => (
            <div key={cap.id} className="p-4 border border-slate-200 rounded-lg space-y-3">
              <input
                value={cap.title}
                onChange={(e) =>
                  setCapabilities(capabilities.map((c) => (c.id === cap.id ? { ...c, title: e.target.value } : c)))
                }
                className={inputClass + ' font-semibold'}
              />
              <textarea
                value={cap.description}
                onChange={(e) =>
                  setCapabilities(capabilities.map((c) => (c.id === cap.id ? { ...c, description: e.target.value } : c)))
                }
                rows={2}
                className={inputClass}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  value={cap.ctaLabel}
                  onChange={(e) =>
                    setCapabilities(capabilities.map((c) => (c.id === cap.id ? { ...c, ctaLabel: e.target.value } : c)))
                  }
                  placeholder="CTA label"
                  className={inputClass}
                />
                <input
                  value={cap.ctaTarget}
                  onChange={(e) =>
                    setCapabilities(capabilities.map((c) => (c.id === cap.id ? { ...c, ctaTarget: e.target.value } : c)))
                  }
                  placeholder="#section-id"
                  className={inputClass}
                />
              </div>
              <AdminButton onClick={() => handleSaveCapability(cap)} disabled={savingCapId === cap.id}>
                {savingCapId === cap.id ? 'Saving…' : 'Save'}
              </AdminButton>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default HeroAboutAdmin;
