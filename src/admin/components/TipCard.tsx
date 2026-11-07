import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Lightbulb, X } from 'lucide-react';
import { CREATOR_TIPS } from '../nav';
import { cn } from '../../lib/utils';

/**
 * Contextual "creator tip" shown in the sidebar: short, route-specific hints
 * about how the CMS maps onto the live site, with a few general ones mixed in.
 */
export const TipCard = ({ pathname, onDismiss, className }: { pathname: string; onDismiss: () => void; className?: string }) => {
  const tips = useMemo(() => {
    const key = Object.keys(CREATOR_TIPS)
      .filter((k) => k !== 'general')
      .sort((a, b) => b.length - a.length)
      .find((k) => (k === '/admin' ? pathname === k : pathname.startsWith(k)));
    return [...(key ? CREATOR_TIPS[key] : []), ...CREATOR_TIPS.general];
  }, [pathname]);

  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [pathname]);

  const tip = tips[index % tips.length];

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent p-3.5',
        className
      )}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-400/20 blur-2xl" />
      <div className="relative flex items-start justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
          <Lightbulb className="h-3.5 w-3.5" /> Creator tip
        </span>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Hide creator tips"
          title="Hide tips (re-enable from your profile menu)"
          className="-mr-1 -mt-1 rounded-md p-1 text-slate-500 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="relative mt-2 min-h-[3.25rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={`${pathname}-${index}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="text-xs leading-relaxed text-slate-200"
          >
            {tip}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="relative mt-2.5 flex items-center justify-between">
        <span className="text-[10px] font-medium tabular-nums text-slate-500">
          {(index % tips.length) + 1} / {tips.length}
        </span>
        <button
          type="button"
          onClick={() => setIndex((i) => i + 1)}
          className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-emerald-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          Next tip <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};
