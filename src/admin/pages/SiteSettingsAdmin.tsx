import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { adminGetSiteSettings, adminSaveSiteSettings } from '../../lib/adminApi';
import type { SiteSettings } from '../../lib/types';
import { Field, Card, AdminButton, ErrorBanner, SuccessBanner, inputClass } from '../components/Field';

const SiteSettingsAdmin = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    adminGetSiteSettings()
      .then(setSettings)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load settings.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError('');
    try {
      await adminSaveSiteSettings(settings);
      setSuccess('Site settings saved.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save.');
    }
    setSaving(false);
  };

  if (loading || !settings) return <p className="text-slate-500">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Site Settings</h1>
      <p className="text-sm text-slate-500 mb-6">
        The single source of truth for contact info and social links — used across the home Contact section,
        the Contact page, the Header, and the Footer.
      </p>
      {error && <ErrorBanner message={error} />}
      {success && <SuccessBanner message={success} />}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Contact</h2>
          <Field label="Email">
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              required
              className={inputClass}
            />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Phone (display)" hint="e.g. (+63) 965 639 4996">
              <input
                value={settings.contactPhoneDisplay}
                onChange={(e) => setSettings({ ...settings, contactPhoneDisplay: e.target.value })}
                required
                className={inputClass}
              />
            </Field>
            <Field label="WhatsApp Digits" hint="Digits only, with country code, e.g. 639656394996">
              <input
                value={settings.contactWhatsappDigits}
                onChange={(e) => setSettings({ ...settings, contactWhatsappDigits: e.target.value })}
                required
                className={inputClass}
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Location (short)" hint="e.g. Philippines">
              <input
                value={settings.contactLocationShort}
                onChange={(e) => setSettings({ ...settings, contactLocationShort: e.target.value })}
                required
                className={inputClass}
              />
            </Field>
            <Field label="Location (full)" hint="e.g. Zamboanga City, Philippines, 7000">
              <input
                value={settings.contactLocationFull}
                onChange={(e) => setSettings({ ...settings, contactLocationFull: e.target.value })}
                required
                className={inputClass}
              />
            </Field>
          </div>

          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400 pt-4">Social Links</h2>
          <Field label="GitHub URL">
            <input
              value={settings.socialGithub}
              onChange={(e) => setSettings({ ...settings, socialGithub: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="LinkedIn URL">
            <input
              value={settings.socialLinkedin}
              onChange={(e) => setSettings({ ...settings, socialLinkedin: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Behance URL">
            <input
              value={settings.socialBehance}
              onChange={(e) => setSettings({ ...settings, socialBehance: e.target.value })}
              className={inputClass}
            />
          </Field>

          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400 pt-4">Footer</h2>
          <Field label="Footer Tagline">
            <textarea
              value={settings.footerTagline}
              onChange={(e) => setSettings({ ...settings, footerTagline: e.target.value })}
              rows={2}
              className={inputClass}
            />
          </Field>
          <Field label="Copyright Text">
            <input
              value={settings.copyrightText}
              onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
              className={inputClass}
            />
          </Field>

          <AdminButton type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save Settings'}
          </AdminButton>
        </form>
      </Card>
    </div>
  );
};

export default SiteSettingsAdmin;
