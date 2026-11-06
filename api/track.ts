import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Server-side only: uses the service-role key to bypass RLS, since
// analytics_events deliberately has no anon/authenticated policies at all.
const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const VALID_EVENTS = new Set(['pageview', 'resume_download', 'contact_submit', 'project_click']);
const BOT_UA = /bot|crawl|spider|slurp|facebookexternalhit|previewbot|headless/i;

function parseDevice(ua: string): { deviceType: string; browser: string; os: string } {
  const deviceType = /Tablet|iPad/i.test(ua) ? 'tablet' : /Mobi|Android/i.test(ua) ? 'mobile' : 'desktop';

  let browser = 'Other';
  if (/Edg\//.test(ua)) browser = 'Edge';
  else if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) browser = 'Chrome';
  else if (/Firefox\//.test(ua)) browser = 'Firefox';
  else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';

  let os = 'Other';
  if (/Windows/.test(ua)) os = 'Windows';
  else if (/Mac OS X/.test(ua)) os = 'macOS';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iOS/.test(ua)) os = 'iOS';
  else if (/Linux/.test(ua)) os = 'Linux';

  return { deviceType, browser, os };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const ua = String(req.headers['user-agent'] ?? '');
  if (BOT_UA.test(ua)) {
    res.status(204).end();
    return;
  }

  const body = req.body ?? {};
  const { sessionId, eventType, path, referrer, projectId } = body;
  if (typeof sessionId !== 'string' || !sessionId || !VALID_EVENTS.has(eventType)) {
    res.status(400).json({ error: 'Invalid payload' });
    return;
  }

  const { deviceType, browser, os } = parseDevice(ua);
  const country = (req.headers['x-vercel-ip-country'] as string | undefined) ?? null;

  const { error } = await supabase.from('analytics_events').insert({
    session_id: sessionId,
    event_type: eventType,
    path: typeof path === 'string' ? path : null,
    referrer: typeof referrer === 'string' ? referrer : null,
    device_type: deviceType,
    browser,
    os,
    country,
    project_id: typeof projectId === 'string' ? projectId : null,
  });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(204).end();
}
