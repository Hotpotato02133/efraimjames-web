import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export interface TooltipLink {
  name: string;
  url: string;
  logo: string;
  // Extra zoom for logos exported with a lot of empty padding
  logoScale?: number;
}

const TooltipItem = ({ item }: { item: TooltipLink }) => {
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const spring = { stiffness: 100, damping: 15 };
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), spring);
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), spring);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => {
        const half = e.currentTarget.offsetWidth / 2;
        x.set(e.nativeEvent.offsetX - half);
      }}
    >
      <AnimatePresence>
        {hovered && (
          <div className="pointer-events-none absolute -top-14 left-1/2 z-50 -translate-x-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: "spring", stiffness: 260, damping: 10 },
              }}
              exit={{ opacity: 0, y: 20, scale: 0.6 }}
              style={{ translateX, rotate, whiteSpace: "nowrap" }}
              className="flex flex-col items-center rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs shadow-xl"
            >
              <span className="flex items-center gap-1 font-semibold text-white">
                {item.name}
                <ArrowUpRight className="h-3 w-3 text-emerald-400" />
              </span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${item.name}`}
        className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:scale-105 hover:border-emerald-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
      >
        <img
          src={item.logo}
          alt={`${item.name} logo`}
          loading="lazy"
          style={{ transform: `scale(${item.logoScale ?? 1})` }}
          className="h-9 w-9 object-contain"
        />
      </a>
    </div>
  );
};

/** Aceternity-style animated tooltip row for linked project logos. */
export const AnimatedTooltip = ({ items }: { items: TooltipLink[] }) => (
  <div className="flex flex-wrap items-center gap-3">
    {items.map((item) => (
      <TooltipItem key={item.name} item={item} />
    ))}
  </div>
);
