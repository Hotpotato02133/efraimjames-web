import { NavLink, useLocation } from 'react-router-dom';
import { ExternalLink, PanelLeftClose, X } from 'lucide-react';
import { NAV_GROUPS } from '../nav';
import { cn } from '../../lib/utils';
import { CreatorProfile } from './CreatorProfile';
import { TipCard } from './TipCard';

export const SIDEBAR_WIDTH = 264;
export const SIDEBAR_RAIL_WIDTH = 76;

/**
 * Dark navigation rail. Desktop: toggles between a full sidebar and a
 * compact icon rail (hover reveals labels). Below `lg` it becomes an
 * off-canvas drawer with a backdrop.
 */
export const Sidebar = ({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onCollapse,
  email,
  tipsEnabled,
  onToggleTips,
  onSignOut,
}: {
  /** Effective state: true only when the viewport is desktop-sized and the rail is collapsed. */
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onCollapse: () => void;
  email: string;
  tipsEnabled: boolean;
  onToggleTips: (next: boolean) => void;
  onSignOut: () => void;
}) => {
  const { pathname } = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      <div
        aria-hidden="true"
        onClick={onCloseMobile}
        onTouchMove={(e) => e.preventDefault()}
        className={cn(
          'fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-[2px] transition-opacity touch-none overscroll-none lg:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      />

      <aside
        aria-label="Admin navigation"
        style={{ width: collapsed ? SIDEBAR_RAIL_WIDTH : SIDEBAR_WIDTH }}
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-full max-h-screen max-h-[100dvh] flex-col border-r border-white/5 bg-slate-950 text-slate-300 shadow-2xl shadow-slate-950/40 transition-[transform,width] duration-200 ease-out overscroll-contain touch-pan-y lg:translate-x-0 lg:shadow-none',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand */}
        <div
          onTouchMove={(e) => e.preventDefault()}
          className={cn('flex h-16 flex-shrink-0 items-center border-b border-white/5 select-none touch-none', collapsed ? 'justify-center px-2' : 'gap-3 px-4')}
        >
          <NavLink to="/admin" className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30" title="Dashboard">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-inset ring-white/10">
              <img src="/Logo1.png" alt="" className="h-6 w-6 object-contain" />
            </span>
            {!collapsed && (
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-white">Efraim James</span>
                <span className="block truncate text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-400">Portfolio Studio</span>
              </span>
            )}
          </NavLink>
          {!collapsed && (
            <>
              <button
                type="button"
                onClick={onCollapse}
                aria-label="Collapse sidebar"
                title="Collapse sidebar (Ctrl+B)"
                className="ml-auto hidden h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/5 hover:text-white lg:flex"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close menu"
                className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className={cn('flex-1 overflow-y-auto overflow-x-hidden py-4 overscroll-contain', collapsed ? 'px-3' : 'px-3')}>
          {NAV_GROUPS.map((group, gi) => (
            <div key={group.label} className={cn(gi > 0 && 'mt-5')}>
              {collapsed ? (
                gi > 0 && <div className="mx-2 mb-3 h-px bg-white/5" />
              ) : (
                <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{group.label}</p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end={item.end}
                        onClick={onCloseMobile}
                        title={collapsed ? item.label : undefined}
                        className={({ isActive }) =>
                          cn(
                            'group relative flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30',
                            collapsed ? 'justify-center px-0' : 'px-3',
                            isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && <span className="absolute inset-y-2 left-0 w-0.5 rounded-r bg-emerald-400" aria-hidden="true" />}
                            <Icon className={cn('h-[18px] w-[18px] flex-shrink-0', isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300')} />
                            {!collapsed && <span className="truncate">{item.label}</span>}
                            {collapsed && (
                              <span
                                role="tooltip"
                                className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                              >
                                {item.label}
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className={cn('flex-shrink-0 border-t border-white/5', collapsed ? 'p-2' : 'p-3')}>
          {!collapsed && tipsEnabled && <TipCard pathname={pathname} onDismiss={() => onToggleTips(false)} className="mb-3" />}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            title="View live site"
            className={cn(
              'mb-2 flex items-center gap-3 rounded-xl py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white',
              collapsed ? 'justify-center px-0' : 'px-3'
            )}
          >
            <ExternalLink className="h-[18px] w-[18px] flex-shrink-0 text-slate-500" />
            {!collapsed && <span>View live site</span>}
          </a>
          <CreatorProfile
            variant="card"
            collapsed={collapsed}
            email={email}
            tipsEnabled={tipsEnabled}
            onToggleTips={onToggleTips}
            onSignOut={onSignOut}
          />
        </div>
      </aside>
    </>
  );
};
