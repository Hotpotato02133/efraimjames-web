import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { LucideIcon } from 'lucide-react';
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Briefcase,
  Download,
  FolderKanban,
  Globe,
  Mail,
  Minus,
  Monitor,
  MousePointerClick,
  RefreshCw,
  Settings,
  Smartphone,
  Sparkles,
  Tablet,
  Users,
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { adminListProjects } from '../../lib/adminApi';
import { cn } from '../../lib/utils';
import { Badge, Button, Card, EmptyState, PageHeader, Skeleton, Tabs } from '../components/ui';
import { errorMessage } from '../components/Toast';

interface RankedCount {
  key: string;
  count: number;
}

interface PeriodTotals {
  uniqueSessions: number;
  totalPageviews: number;
  resumeDownloads: number;
  contactSubmits: number;
  projectClicks: number;
}

interface SummaryData extends PeriodTotals {
  days: number;
  since: string;
  until: string;
  pageviewsByDay: { date: string; count: number }[];
  previous: PeriodTotals;
  topPaths: RankedCount[];
  topReferrers: RankedCount[];
  topProjects: RankedCount[];
  devices: RankedCount[];
  browsers: RankedCount[];
  operatingSystems: RankedCount[];
  countries: RankedCount[];
}

type Range = '7' | '30' | '90';
const RANGE_TABS: { key: Range; label: string }[] = [
  { key: '7', label: '7 days' },
  { key: '30', label: '30 days' },
  { key: '90', label: '90 days' },
];

const EMERALD = '#059669';
const EMERALD_LIGHT = '#10b981';

const regionNames = typeof Intl !== 'undefined' && 'DisplayNames' in Intl ? new Intl.DisplayNames(['en'], { type: 'region' }) : null;

function countryName(code: string): string {
  try {
    return regionNames?.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

function formatDay(iso: string, withYear = false): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC', ...(withYear ? { year: 'numeric' } : {}) });
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

async function fetchSummary(days: Range): Promise<SummaryData> {
  if (!supabase) throw new Error('Supabase is not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).');
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) throw new Error('Your session has expired — sign in again.');

  const res = await fetch(`/api/analytics-summary?days=${days}`, { headers: { Authorization: `Bearer ${token}` } });
  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new Error(
      `The analytics API answered with ${res.status} ${contentType.split(';')[0] || 'no content type'} instead of JSON — the /api route is not being served.`
    );
  }
  const body = (await res.json()) as SummaryData & { error?: string };
  if (!res.ok) throw new Error(body.error ?? `Request failed (${res.status})`);
  return body;
}

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------

const Delta = ({ current, previous }: { current: number; previous: number }) => {
  if (previous === 0 && current === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-slate-400">
        <Minus className="h-3 w-3" /> no change
      </span>
    );
  }
  if (previous === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600">
        <ArrowUpRight className="h-3 w-3" /> new
      </span>
    );
  }
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-slate-400">
        <Minus className="h-3 w-3" /> 0%
      </span>
    );
  }
  const up = pct > 0;
  return (
    <span className={cn('inline-flex items-center gap-0.5 text-xs font-medium', up ? 'text-emerald-600' : 'text-red-500')}>
      {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {up ? '+' : ''}
      {pct}%
    </span>
  );
};

const StatTile = ({
  label,
  value,
  previous,
  icon: Icon,
  days,
}: {
  label: string;
  value: number;
  previous: number;
  icon: LucideIcon;
  days: number;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
        <Icon className="h-4 w-4" />
      </span>
    </div>
    <p className="mt-3 text-3xl font-bold tabular-nums tracking-tight text-slate-900">{formatNumber(value)}</p>
    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
      <Delta current={value} previous={previous} />
      <span>vs previous {days}d</span>
    </p>
  </div>
);

const RankList = ({
  title,
  items,
  total,
  format = (key) => key,
  icon,
  emptyText = 'No data in this range yet.',
}: {
  title: string;
  items: RankedCount[];
  total?: number;
  format?: (key: string) => ReactNode;
  icon?: (key: string) => LucideIcon | undefined;
  emptyText?: string;
}) => {
  const max = Math.max(1, ...items.map((i) => i.count));
  const sum = total ?? items.reduce((acc, i) => acc + i.count, 0);
  return (
    <Card title={title} bodyClassName="p-4 sm:p-5">
      {items.length === 0 ? (
        <p className="py-4 text-center text-sm text-slate-400">{emptyText}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const RowIcon = icon?.(item.key);
            const share = sum > 0 ? Math.round((item.count / sum) * 100) : 0;
            return (
              <li key={item.key}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                  <span className="flex min-w-0 items-center gap-2 text-slate-700">
                    {RowIcon && <RowIcon className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />}
                    <span className="truncate" title={item.key}>
                      {format(item.key)}
                    </span>
                  </span>
                  <span className="flex flex-shrink-0 items-baseline gap-1.5 tabular-nums">
                    <span className="font-semibold text-slate-900">{formatNumber(item.count)}</span>
                    <span className="text-xs text-slate-400">{share}%</span>
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-emerald-500 transition-[width] duration-500" style={{ width: `${(item.count / max) * 100}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
};

const ChartTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length || !label) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-slate-500">{formatDay(label, true)}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums text-slate-900">
        {formatNumber(payload[0].value)} {payload[0].value === 1 ? 'pageview' : 'pageviews'}
      </p>
    </div>
  );
};

const DEVICE_ICONS: Record<string, LucideIcon> = { desktop: Monitor, mobile: Smartphone, tablet: Tablet };

const QUICK_ACTIONS = [
  { to: '/admin/projects', label: 'Add a project', description: 'Upload a cover and publish a new case study.', icon: FolderKanban },
  { to: '/admin/work-history', label: 'Update work history', description: 'Add a role or a shipped product.', icon: Briefcase },
  { to: '/admin/hero-about', label: 'Edit hero copy', description: 'Headline, intro and the toolkit marquee.', icon: Sparkles },
  { to: '/admin/site-settings', label: 'Site settings', description: 'Contact details and social links.', icon: Settings },
];

const DashboardSkeleton = () => (
  <div className="space-y-6" aria-busy="true">
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-2xl" />
      ))}
    </div>
    <Skeleton className="h-72 rounded-2xl" />
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-56 rounded-2xl" />
      ))}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const AnalyticsDashboard = () => {
  const [range, setRange] = useState<Range>('30');
  const [data, setData] = useState<SummaryData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [projectTitles, setProjectTitles] = useState<Record<string, string>>({});

  const load = useCallback(async (days: Range, mode: 'initial' | 'refresh') => {
    if (mode === 'initial') setLoading(true);
    else setRefreshing(true);
    setError('');
    try {
      setData(await fetchSummary(days));
      setUpdatedAt(new Date());
    } catch (e) {
      setError(errorMessage(e, 'Failed to load analytics.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(range, 'initial');
  }, [range, load]);

  // Project clicks are stored by id; show the human title where we can.
  useEffect(() => {
    adminListProjects()
      .then((projects) => setProjectTitles(Object.fromEntries(projects.map((p) => [p.id, p.cardTitle ?? p.title]))))
      .catch(() => {
        /* titles are cosmetic — ids are fine as a fallback */
      });
  }, []);

  const hasTraffic = useMemo(() => !!data && (data.totalPageviews > 0 || data.uniqueSessions > 0), [data]);
  const days = data?.days ?? Number(range);

  const header = (
    <PageHeader
      eyebrow="Overview"
      title="Dashboard"
      description={
        updatedAt
          ? `Traffic and conversions for the last ${days} days. Updated ${updatedAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}.`
          : `Traffic and conversions on the public site for the last ${days} days.`
      }
      actions={
        <>
          <Tabs tabs={RANGE_TABS} value={range} onChange={setRange} />
          <Button variant="secondary" icon={RefreshCw} loading={refreshing} onClick={() => load(range, 'refresh')} aria-label="Refresh">
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </>
      }
    />
  );

  if (loading) {
    return (
      <div>
        {header}
        <DashboardSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        {header}
        <Card>
          <div className="flex flex-col gap-5 sm:flex-row">
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertCircle className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold text-slate-900">Analytics couldn't be loaded</h2>
              <p className="mt-1 break-words text-sm text-slate-600">{error || 'No data returned.'}</p>
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
                <p className="font-semibold text-slate-700">How this page gets its data</p>
                <p className="mt-1">
                  The dashboard calls <code className="rounded bg-white px-1 py-0.5 text-slate-700">/api/analytics-summary</code>. On Vercel that is a
                  serverless function; during <code className="rounded bg-white px-1 py-0.5 text-slate-700">npm run dev</code> the Vite plugin in{' '}
                  <code className="rounded bg-white px-1 py-0.5 text-slate-700">vite.config.ts</code> serves the same file. Both need{' '}
                  <code className="rounded bg-white px-1 py-0.5 text-slate-700">VITE_SUPABASE_URL</code>,{' '}
                  <code className="rounded bg-white px-1 py-0.5 text-slate-700">VITE_SUPABASE_ANON_KEY</code> and{' '}
                  <code className="rounded bg-white px-1 py-0.5 text-slate-700">SUPABASE_SERVICE_ROLE_KEY</code> available to the server (Vercel project
                  settings in production, <code className="rounded bg-white px-1 py-0.5 text-slate-700">.env</code> locally).
                </p>
              </div>
              <div className="mt-4">
                <Button icon={RefreshCw} onClick={() => load(range, 'initial')}>
                  Try again
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {header}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatTile label="Unique visitors" value={data.uniqueSessions} previous={data.previous.uniqueSessions} icon={Users} days={days} />
        <StatTile label="Pageviews" value={data.totalPageviews} previous={data.previous.totalPageviews} icon={BarChart3} days={days} />
        <StatTile label="Project clicks" value={data.projectClicks} previous={data.previous.projectClicks} icon={MousePointerClick} days={days} />
        <StatTile label="Resume downloads" value={data.resumeDownloads} previous={data.previous.resumeDownloads} icon={Download} days={days} />
        <StatTile label="Contact submissions" value={data.contactSubmits} previous={data.previous.contactSubmits} icon={Mail} days={days} />
      </div>

      <Card
        className="mt-6"
        title="Pageviews over time"
        description={`${formatDay(data.since.slice(0, 10), true)} – ${formatDay(data.until.slice(0, 10), true)}`}
        actions={<Badge tone="emerald">{formatNumber(data.totalPageviews)} total</Badge>}
        bodyClassName="px-2 pb-3 pt-4 sm:px-4"
      >
        {!hasTraffic ? (
          <EmptyState
            icon={BarChart3}
            title="No visits recorded in this range"
            description="Pageviews are tracked on the public site only — open it in a private window and refresh this page to see your visit."
            className="py-10"
          />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data.pageviewsByDay} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="pageviewFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={EMERALD_LIGHT} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={EMERALD_LIGHT} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(value: string) => formatDay(value)}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
                minTickGap={28}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} width={32} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#cbd5e1', strokeDasharray: '3 3' }} />
              <Area
                type="monotone"
                dataKey="count"
                stroke={EMERALD}
                strokeWidth={2}
                fill="url(#pageviewFill)"
                activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff', fill: EMERALD }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <RankList title="Top pages" items={data.topPaths} total={data.totalPageviews} />
        <RankList title="Top referrers" items={data.topReferrers} emptyText="No referrers yet — direct visits don't carry one." />
        <RankList title="Most clicked projects" items={data.topProjects} format={(id) => projectTitles[id] ?? id} emptyText="No project cards clicked yet." />
        <RankList title="Devices" items={data.devices} icon={(key) => DEVICE_ICONS[key]} />
        <RankList title="Browsers" items={data.browsers} />
        <RankList title="Operating systems" items={data.operatingSystems} />
        <RankList
          title="Countries"
          items={data.countries}
          format={(code) => countryName(code)}
          icon={() => Globe}
          emptyText="Country comes from Vercel's edge headers, so it only appears on the deployed site."
        />
      </div>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Quick actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {QUICK_ACTIONS.map(({ to, label, description, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-600">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-900">{label}</span>
                <span className="block text-xs text-slate-500">{description}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AnalyticsDashboard;
