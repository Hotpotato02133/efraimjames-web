import { useEffect, useState } from 'react';
import { Navigate, Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/work-history', label: 'Work History' },
  { to: '/admin/hero-about', label: 'Hero & About' },
  { to: '/admin/site-settings', label: 'Site Settings' },
  { to: '/admin/sections', label: 'Sections' },
];

// Session check is UX only — the actual security boundary is Postgres RLS
// (anon can SELECT content tables but never INSERT/UPDATE/DELETE; this guard
// just keeps a logged-out visitor from seeing the admin screens at all).
const AdminLayout = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!supabase) {
      setChecked(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecked(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    navigate('/admin/login');
  };

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading…
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link to="/admin" className="text-lg font-bold text-slate-900">
            Admin
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:inline">{session.user.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row gap-8">
        <nav className="flex md:flex-col gap-1 overflow-x-auto md:w-48 flex-shrink-0">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
