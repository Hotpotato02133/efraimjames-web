import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { supabase } from '../../lib/supabaseClient';
import { Card } from '../components/Field';

interface RankedCount {
  key: string;
  count: number;
}

interface SummaryData {
  pageviewsByDay: { date: string; count: number }[];
  uniqueSessions: number;
  totalPageviews: number;
  topPaths: RankedCount[];
  topReferrers: RankedCount[];
  devices: RankedCount[];
  browsers: RankedCount[];
  countries: RankedCount[];
  resumeDownloads: number;
  contactSubmits: number;
}

const StatTile = ({ label, value }: { label: string; value: number | string }) => (
  <Card className="p-5">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
  </Card>
);

const BarList = ({ title, items }: { title: string; items: RankedCount[] }) => {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-slate-400">No data yet.</p>
      ) : (
        <ul className="space-y-2.5">
          {items.map((item) => (
            <li key={item.key}>
              <div className="flex justify-between text-xs text-slate-500 mb-1 gap-2">
                <span className="truncate">{item.key}</span>
                <span className="flex-shrink-0">{item.count}</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

const AnalyticsDashboard = () => {
  const [data, setData] = useState<SummaryData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (!supabase) throw new Error('Supabase is not configured.');
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        if (!token) throw new Error('Not authenticated.');
        const res = await fetch('/api/analytics-summary', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        setData(await res.json());
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load analytics.');
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="text-slate-500">Loading…</p>;

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Analytics</h1>
        <p className="text-slate-500 max-w-xl">
          {error}. Analytics is served by the <code>/api</code> serverless functions, which only run on a Vercel
          deployment (or locally via <code>vercel dev</code>) — a plain <code>npm run dev</code> session can't reach
          them.
        </p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Unique Visitors (30d)" value={data.uniqueSessions} />
        <StatTile label="Pageviews (30d)" value={data.totalPageviews} />
        <StatTile label="Resume Downloads" value={data.resumeDownloads} />
        <StatTile label="Contact Submissions" value={data.contactSubmits} />
      </div>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Pageviews — last 30 days</h3>
        {data.pageviewsByDay.length === 0 ? (
          <p className="text-sm text-slate-400">No pageviews recorded yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.pageviewsByDay}>
              <defs>
                <linearGradient id="pageviewFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} width={28} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Area type="monotone" dataKey="count" stroke="#059669" strokeWidth={2} fill="url(#pageviewFill)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BarList title="Top Pages" items={data.topPaths} />
        <BarList title="Top Referrers" items={data.topReferrers} />
        <BarList title="Devices" items={data.devices} />
        <BarList title="Browsers" items={data.browsers} />
        <BarList title="Top Countries" items={data.countries} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
