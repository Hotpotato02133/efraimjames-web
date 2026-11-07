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
  os: string | null;
  country: string | null;
  project_id: string | null;
  created_at: string;
}

interface PeriodTotals {
  uniqueSessions: number;
  totalPageviews: number;
  resumeDownloads: number;
  contactSubmits: number;
  projectClicks: number;
}

const DEFAULT_DAYS = 30;
const MAX_DAYS = 365;

function rankCounts(counts: Record<string, number>, limit?: number) {
  const ranked = Object.entries(counts)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
  return limit ? ranked.slice(0, limit) : ranked;
}

function bump(counts: Record<string, number>, key: string | null | undefined) {
  if (!key) return;
  counts[key] = (counts[key] ?? 0) + 1;
}

function dayKey(iso: string) {
  return iso.slice(0, 10);
}

function totalsFor(events: AnalyticsEventRow[]): PeriodTotals {
  const sessions = new Set<string>();
  const totals: PeriodTotals = { uniqueSessions: 0, totalPageviews: 0, resumeDownloads: 0, contactSubmits: 0, projectClicks: 0 };
  for (const e of events) {
    sessions.add(e.session_id);
    if (e.event_type === 'pageview') totals.totalPageviews++;
    else if (e.event_type === 'resume_download') totals.resumeDownloads++;
    else if (e.event_type === 'contact_submit') totals.contactSubmits++;
    else if (e.event_type === 'project_click') totals.projectClicks++;
  }
  totals.uniqueSessions = sessions.size;
  return totals;
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

  const requestedDays = Number(Array.isArray(req.query.days) ? req.query.days[0] : req.query.days);
  const days = Number.isFinite(requestedDays) && requestedDays > 0 ? Math.min(Math.floor(requestedDays), MAX_DAYS) : DEFAULT_DAYS;

  // Current window = [since, now); the window before it (same length) feeds the
  // "vs previous period" deltas on the dashboard's stat tiles.
  const now = new Date();
  const since = new Date(now);
  since.setUTCDate(since.getUTCDate() - (days - 1));
  since.setUTCHours(0, 0, 0, 0);
  const previousSince = new Date(since);
  previousSince.setUTCDate(previousSince.getUTCDate() - days);

  const { data, error } = await adminClient
    .from('analytics_events')
    .select('session_id, event_type, path, referrer, device_type, browser, os, country, project_id, created_at')
    .gte('created_at', previousSince.toISOString())
    .order('created_at', { ascending: true });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const all = (data ?? []) as AnalyticsEventRow[];
  const sinceIso = since.toISOString();
  const current = all.filter((e) => e.created_at >= sinceIso);
  const previous = all.filter((e) => e.created_at < sinceIso);

  const pageviewsByDay: Record<string, number> = {};
  const pathCounts: Record<string, number> = {};
  const referrerCounts: Record<string, number> = {};
  const deviceCounts: Record<string, number> = {};
  const browserCounts: Record<string, number> = {};
  const osCounts: Record<string, number> = {};
  const countryCounts: Record<string, number> = {};
  const projectCounts: Record<string, number> = {};
  const sessionDevice = new Set<string>();

  for (const e of current) {
    // Device/browser/OS/country describe a visitor, so count each session once
    // rather than once per event — otherwise a long session dominates the mix.
    if (!sessionDevice.has(e.session_id)) {
      sessionDevice.add(e.session_id);
      bump(deviceCounts, e.device_type);
      bump(browserCounts, e.browser);
      bump(osCounts, e.os);
      bump(countryCounts, e.country);
    }

    if (e.event_type === 'pageview') {
      bump(pageviewsByDay, dayKey(e.created_at));
      bump(pathCounts, e.path);
      if (e.referrer) bump(referrerCounts, referrerHost(e.referrer));
    } else if (e.event_type === 'project_click') {
      bump(projectCounts, e.project_id);
    }
  }

  // Emit every day in the window (zero-filled) so the chart has a continuous
  // x-axis instead of skipping quiet days.
  const series: { date: string; count: number }[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setUTCDate(d.getUTCDate() + i);
    const key = d.toISOString().slice(0, 10);
    series.push({ date: key, count: pageviewsByDay[key] ?? 0 });
  }

  const totals = totalsFor(current);

  res.status(200).json({
    days,
    since: sinceIso,
    until: now.toISOString(),
    pageviewsByDay: series,
    ...totals,
    previous: totalsFor(previous),
    topPaths: rankCounts(pathCounts, 10),
    topReferrers: rankCounts(referrerCounts, 10),
    topProjects: rankCounts(projectCounts, 10),
    devices: rankCounts(deviceCounts),
    browsers: rankCounts(browserCounts),
    operatingSystems: rankCounts(osCounts),
    countries: rankCounts(countryCounts, 10),
  });
}

// Group referrers by host so "https://www.linkedin.com/feed/?x=1" and
// "https://www.linkedin.com/in/..." count as one source.
function referrerHost(referrer: string): string {
  try {
    return new URL(referrer).host.replace(/^www\./, '') || referrer;
  } catch {
    return referrer;
  }
}
