import { useCallback, useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Session } from '@supabase/supabase-js';
import { ChevronRight, ExternalLink, Menu, PanelLeftOpen } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { cn } from '../lib/utils';
import { findNavItem } from './nav';
import { Sidebar, SIDEBAR_RAIL_WIDTH, SIDEBAR_WIDTH } from './components/Sidebar';
import { CreatorProfile } from './components/CreatorProfile';
import { ToastProvider } from './components/Toast';
import { ConfirmProvider } from './components/ConfirmDialog';
import { Kbd } from './components/ui';

const COLLAPSED_KEY = 'ej_admin_sidebar_collapsed';
const TIPS_KEY = 'ej_admin_tips';

function readFlag(key: string, fallback: boolean): boolean {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : raw === '1';
  } catch {
    return fallback;
  }
}

function writeFlag(key: string, value: boolean) {
  try {
    localStorage.setItem(key, value ? '1' : '0');
  } catch {
    // Private mode / blocked storage: the preference just won't persist.
  }
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false));
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

// Session check is UX only — the actual security boundary is Postgres RLS
// (anon can SELECT content tables but never INSERT/UPDATE/DELETE; this guard
// just keeps a logged-out visitor from seeing the admin screens at all).
const AdminLayout = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [collapsedPref, setCollapsedPref] = useState(() => readFlag(COLLAPSED_KEY, false));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tipsEnabled, setTipsEnabled] = useState(() => readFlag(TIPS_KEY, true));
  const collapsed = isDesktop && collapsedPref;

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

  // Close the mobile drawer on navigation and keep the tab title in sync.
  const current = findNavItem(location.pathname);
  useEffect(() => {
    setMobileOpen(false);
    document.title = `${current?.label ?? 'Admin'} · Efraim James Studio`;
  }, [location.pathname, current?.label]);

  // Auto-close mobile drawer when switching to desktop breakpoint
  useEffect(() => {
    if (isDesktop && mobileOpen) {
      setMobileOpen(false);
    }
  }, [isDesktop, mobileOpen]);

  // Prevent background scrolling when mobile sidebar is open
  useEffect(() => {
    if (!mobileOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  const toggleSidebar = useCallback(() => {
    if (isDesktop) {
      setCollapsedPref((prev) => {
        writeFlag(COLLAPSED_KEY, !prev);
        return !prev;
      });
    } else {
      setMobileOpen((prev) => !prev);
    }
  }, [isDesktop]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleSidebar]);

  const handleToggleTips = (next: boolean) => {
    writeFlag(TIPS_KEY, next);
    setTipsEnabled(next);
  };

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    navigate('/admin/login');
  };

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="h-2 w-2 animate-ping rounded-full bg-emerald-500" />
          Checking your session…
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  const email = session.user.email ?? 'admin';

  return (
    <ToastProvider>
      <ConfirmProvider>
        <div className="min-h-screen bg-stone-50 text-slate-900">
          <Sidebar
            collapsed={collapsed}
            mobileOpen={mobileOpen}
            onCloseMobile={() => setMobileOpen(false)}
            onCollapse={toggleSidebar}
            email={email}
            tipsEnabled={tipsEnabled}
            onToggleTips={handleToggleTips}
            onSignOut={handleLogout}
          />

          <div
            className="flex min-h-screen flex-col transition-[padding] duration-200 ease-out"
            style={{ paddingLeft: isDesktop ? (collapsed ? SIDEBAR_RAIL_WIDTH : SIDEBAR_WIDTH) : 0 }}
          >
            <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label={isDesktop ? (collapsed ? 'Expand sidebar' : 'Collapse sidebar') : 'Open menu'}
                title={isDesktop ? 'Toggle sidebar (Ctrl+B)' : 'Open menu'}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900',
                  isDesktop && !collapsed && 'lg:hidden'
                )}
              >
                {isDesktop ? <PanelLeftOpen className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
                <span className="hidden text-slate-400 sm:inline">Admin</span>
                <ChevronRight className="hidden h-3.5 w-3.5 text-slate-300 sm:inline" />
                <span className="truncate font-semibold text-slate-900">{current?.label ?? 'Admin'}</span>
              </nav>

              <div className="flex-1" />

              <span className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 md:inline-flex">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Supabase connected
              </span>

              <span className="hidden items-center gap-1 text-xs text-slate-400 xl:inline-flex" title="Toggle sidebar">
                <Kbd>Ctrl</Kbd>
                <Kbd>B</Kbd>
              </span>

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                <ExternalLink className="h-4 w-4 text-slate-400" />
                <span className="hidden sm:inline">View site</span>
              </a>

              <CreatorProfile variant="avatar" email={email} tipsEnabled={tipsEnabled} onToggleTips={handleToggleTips} onSignOut={handleLogout} />
            </header>

            <main className="flex-1">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10"
              >
                <Outlet />
              </motion.div>
            </main>
          </div>
        </div>
      </ConfirmProvider>
    </ToastProvider>
  );
};

export default AdminLayout;
