import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AtSign, Globe, Mail, MapPin, MessageCircle, Save } from 'lucide-react';
import { adminGetSiteSettings, adminSaveSiteSettings } from '../../lib/adminApi';
import type { SiteSettings } from '../../lib/types';
import { Button, Card, Field, Input, PageHeader, PageSkeleton, Textarea } from '../components/ui';
import { useToast, errorMessage } from '../components/Toast';

const SiteSettingsAdmin = () => {
  const toast = useToast();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saved, setSaved] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const s = await adminGetSiteSettings();
      setSettings(s);
      setSaved(s);
    } catch (e) {
      toast.error('Failed to load settings.', errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    const digits = settings.contactWhatsappDigits.replace(/\D/g, '');
    const next = { ...settings, contactWhatsappDigits: digits };
    setSaving(true);
    try {
      await adminSaveSiteSettings(next);
      setSettings(next);
      setSaved(next);
      toast.success('Site settings saved.', 'Contact section, Contact page and Footer are updated.');
    } catch (err) {
      toast.error('Failed to save settings.', errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) return <PageSkeleton rows={3} />;

  const dirty = JSON.stringify(settings) !== JSON.stringify(saved);
  const set = (patch: Partial<SiteSettings>) => setSettings((prev) => (prev ? { ...prev, ...patch } : prev));

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Configuration"
        title="Site Settings"
        description="The single source of truth for contact details and social links — used by the Contact section, the Contact page, the Header and the Footer."
      />

      <form id="site-settings-form" onSubmit={handleSubmit} className="space-y-6">
        <Card title="Contact" description="How visitors reach you.">
          <div className="space-y-5">
            <Field label="Email" required>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input type="email" value={settings.contactEmail} onChange={(e) => set({ contactEmail: e.target.value })} required className="pl-10" />
              </div>
            </Field>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Phone (as displayed)" required hint="Shown verbatim, e.g. (+63) 965 639 4996">
                <Input value={settings.contactPhoneDisplay} onChange={(e) => set({ contactPhoneDisplay: e.target.value })} required />
              </Field>
              <Field label="WhatsApp number" required hint="Digits only with country code — used for the wa.me link.">
                <div className="relative">
                  <MessageCircle className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={settings.contactWhatsappDigits}
                    onChange={(e) => set({ contactWhatsappDigits: e.target.value })}
                    required
                    inputMode="numeric"
                    className="pl-10 font-mono"
                    placeholder="639656394996"
                  />
                </div>
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Location (short)" required hint="Contact page footer row, e.g. Philippines">
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input value={settings.contactLocationShort} onChange={(e) => set({ contactLocationShort: e.target.value })} required className="pl-10" />
                </div>
              </Field>
              <Field label="Location (full)" required hint="Footer and Contact section, e.g. Zamboanga City, Philippines, 7000">
                <Input value={settings.contactLocationFull} onChange={(e) => set({ contactLocationFull: e.target.value })} required />
              </Field>
            </div>
          </div>
        </Card>

        <Card title="Social links" description="Leave a field empty to hide that icon.">
          <div className="space-y-5">
            {(
              [
                { key: 'socialGithub', label: 'GitHub', placeholder: 'https://github.com/…' },
                { key: 'socialLinkedin', label: 'LinkedIn', placeholder: 'https://www.linkedin.com/in/…' },
                { key: 'socialBehance', label: 'Behance', placeholder: 'https://www.behance.net/…' },
              ] as { key: keyof SiteSettings; label: string; placeholder: string }[]
            ).map(({ key, label, placeholder }) => (
              <Field key={key} label={label}>
                <div className="relative">
                  <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input type="url" value={settings[key]} onChange={(e) => set({ [key]: e.target.value } as Partial<SiteSettings>)} placeholder={placeholder} className="pl-10" />
                </div>
              </Field>
            ))}
          </div>
        </Card>

        <Card title="Footer" description="Tagline under the logo and the copyright line.">
          <div className="space-y-5">
            <Field label="Tagline">
              <Textarea value={settings.footerTagline} onChange={(e) => set({ footerTagline: e.target.value })} rows={2} />
            </Field>
            <Field label="Copyright text">
              <div className="relative">
                <AtSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input value={settings.copyrightText} onChange={(e) => set({ copyrightText: e.target.value })} className="pl-10" />
              </div>
            </Field>
          </div>
        </Card>
      </form>

      {/* Sticky save bar — appears only when there is something to save. */}
      <AnimatePresence>
        {dirty && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4"
          >
            <div className="pointer-events-auto flex w-full max-w-xl items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/95 py-3 pl-5 pr-3 shadow-xl shadow-slate-900/10 backdrop-blur">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">Unsaved changes</span>
                <span className="hidden sm:inline"> — they go live as soon as you save.</span>
              </p>
              <div className="flex flex-shrink-0 items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => saved && setSettings(saved)} disabled={saving}>
                  Discard
                </Button>
                <Button type="submit" form="site-settings-form" size="sm" icon={Save} loading={saving}>
                  Save settings
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SiteSettingsAdmin;
