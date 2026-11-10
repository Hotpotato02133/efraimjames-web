import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ExternalLink, Github, Lightbulb, LogOut, Mail, ShieldCheck } from 'lucide-react';
import avatar from '../../assets/2X2JAMES.jpg';
import { cn } from '../../lib/utils';
import { Switch } from './ui';
import { CREATOR } from '../nav';

/**
 * The signed-in creator, shown as a card in the sidebar footer and as an
 * avatar in the top bar. Both open the same popover with account details,
 * quick links, the tips toggle and sign-out.
 */
export const CreatorProfile = ({
  email,
  variant,
  collapsed = false,
  tipsEnabled,
  onToggleTips,
  onSignOut,
}: {
  email: string;
  variant: 'card' | 'avatar';
  /** Card variant only: render just the avatar when the sidebar is an icon rail. */
  collapsed?: boolean;
  tipsEnabled: boolean;
  onToggleTips: (next: boolean) => void;
  onSignOut: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isCard = variant === 'card';
  const compact = isCard && collapsed;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${CREATOR.name} — account menu`}
        className={cn(
          'group flex items-center gap-3 rounded-xl text-left transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30',
          isCard ? 'w-full p-2 hover:bg-white/5' : 'p-1 hover:bg-slate-100',
          compact && 'justify-center'
        )}
      >
        <span className="relative flex-shrink-0">
          <img
            src={avatar}
            alt=""
            className={cn('rounded-full object-cover ring-2', isCard ? 'h-10 w-10 ring-white/10' : 'h-9 w-9 ring-slate-200')}
          />
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400" title="Signed in" />
        </span>
        {isCard && !compact && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-white">{CREATOR.name}</span>
              <span className="block truncate text-xs text-slate-400">{email}</span>
            </span>
            <ChevronDown className={cn('h-4 w-4 flex-shrink-0 text-slate-500 transition-transform', open && 'rotate-180')} />
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Account"
            initial={{ opacity: 0, y: isCard ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isCard ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className={cn(
              'absolute z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl shadow-slate-900/15 max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain',
              isCard
                ? (compact ? 'bottom-0 left-full ml-3 w-72' : 'bottom-full left-0 mb-2 w-full min-w-[240px]')
                : 'right-0 top-full mt-2 w-72'
            )}
          >
            <div className="relative overflow-hidden bg-slate-950 px-4 pb-4 pt-5 text-white">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/30 blur-2xl" />
              <div className="relative flex items-center gap-3">
                <img src={avatar} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-emerald-400/60" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{CREATOR.name}</p>
                  <p className="truncate text-xs text-slate-300">{CREATOR.role}</p>
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 ring-1 ring-inset ring-emerald-400/30">
                    <ShieldCheck className="h-3 w-3" /> Admin
                  </span>
                </div>
              </div>
            </div>

            <div className="border-b border-slate-100 px-4 py-3">
              <p className="flex items-center gap-2 text-xs text-slate-500">
                <Mail className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                <span className="truncate" title={email}>
                  {email}
                </span>
              </p>
            </div>

            <div className="p-1.5">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              >
                <ExternalLink className="h-4 w-4 text-slate-400" /> View live site
              </a>
              <a
                href={CREATOR.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              >
                <Github className="h-4 w-4 text-slate-400" /> GitHub profile
              </a>
              <div className="flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-sm text-slate-700">
                <span className="flex items-center gap-2.5 min-w-0">
                  <Lightbulb className="h-4 w-4 flex-shrink-0 text-slate-400" />
                  <span className="truncate">Creator tips</span>
                </span>
                <Switch checked={tipsEnabled} onChange={onToggleTips} label="Show creator tips" />
              </div>
            </div>

            <div className="border-t border-slate-100 p-1.5">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onSignOut();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
