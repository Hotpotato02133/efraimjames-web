import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Two clients, two purposes: the anon client only verifies the caller's JWT
// (auth.getUser), the service-role client does the actual read — RLS has no
// policies on analytics_events at all, so only this function can see it.
const anonClient = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);
const adminClient = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

interface AnalyticsEventRow {
  session_id: string;
  event_type: string;
  path: string | null;
  referrer: string | null;
  device_type: string | null;
  browser: string | null;
  country: string | null;
  created_at: string;
}

function rankCounts(counts: Record<string, number>, limit?: number) {
  const ranked = Object.entries(counts)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
  return limit ? ranked.slice(0, limit) : ranked;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authHeader = String(req.headers.authorization ?? '');
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) {
    res.status(401).json({ error: 'Missing session token' });
    return;
  }

  const { data: userData, error: userError } = await anonClient.auth.getUser(token);
  if (userError || !userData.user) {
    res.status(401).json({ error: 'Invalid session' });
    return;
  }

  const since = new Date();
  since.setDate(since.getDate() - 30);

  const { data, error } = await adminClient
    .from('analytics_events')
    .select('session_id, event_type, path, referrer, device_type, browser, country, created_at')
    .gte('created_at', since.toISOString());

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const events = (data ?? []) as AnalyticsEventRow[];
  const sessions = new Set<string>();
  const pageviewsByDay: Record<string, number> = {};
  const pathCounts: Record<string, number> = {};
  const referrerCounts: Record<string, number> = {};
  const deviceCounts: Record<string, number> = {};
  const browserCounts: Record<string, number> = {};
  const countryCounts: Record<string, number> = {};
  let resumeDownloads = 0;
  let contactSubmits = 0;

  for (const e of events) {
    sessions.add(e.session_id);
    if (e.device_type) deviceCounts[e.device_type] = (deviceCounts[e.device_type] ?? 0) + 1;
    if (e.browser) browserCounts[e.browser] = (browserCounts[e.browser] ?? 0) + 1;
    if (e.country) countryCounts[e.country] = (countryCounts[e.country] ?? 0) + 1;

    if (e.event_type === 'pageview') {
      const day = e.created_at.slice(0, 10);
      pageviewsByDay[day] = (pageviewsByDay[day] ?? 0) + 1;
      if (e.path) pathCounts[e.path] = (pathCounts[e.path] ?? 0) + 1;
      if (e.referrer) referrerCounts[e.referrer] = (referrerCounts[e.referrer] ?? 0) + 1;
    } else if (e.event_type === 'resume_download') {
      resumeDownloads++;
    } else if (e.event_type === 'contact_submit') {
      contactSubmits++;
    }
  }

  res.status(200).json({
    pageviewsByDay: Object.entries(pageviewsByDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    uniqueSessions: sessions.size,
    totalPageviews: Object.values(pathCounts).reduce((sum, n) => sum + n, 0),
    topPaths: rankCounts(pathCounts, 10),
    topReferrers: rankCounts(referrerCounts, 10),
    devices: rankCounts(deviceCounts),
    browsers: rankCounts(browserCounts),
    countries: rankCounts(countryCounts, 10),
    resumeDownloads,
    contactSubmits,
  });
}
