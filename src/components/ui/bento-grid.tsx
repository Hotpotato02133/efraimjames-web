import type { MouseEvent, ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <div
    className={cn(
      "grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto",
      className
    )}
  >
    {children}
  </div>
);

interface BentoGridItemProps {
  className?: string;
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
  visual: ReactNode;
  cta: string;
  onCtaClick: () => void;
  index: number;
}

/**
 * Aceternity-style bento card with a cursor-following spotlight
 * (radial gradient driven by motion values, no re-renders on move).
 */
export const BentoGridItem = ({
  className,
  number,
  title,
  description,
  icon,
  visual,
  cta,
  onCtaClick,
  index,
}: BentoGridItemProps) => {
  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);

  const handleMouseMove = ({ currentTarget, clientX, clientY }: MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const spotlight = useMotionTemplate`radial-gradient(360px circle at ${mouseX}px ${mouseY}px, rgba(16,185,129,0.14), transparent 80%)`;
  const spotlightBorder = useMotionTemplate`radial-gradient(240px circle at ${mouseX}px ${mouseY}px, rgba(16,185,129,0.55), transparent 80%)`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay: (index % 3) * 0.1 }}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-emerald-900/5",
        className
      )}
    >
      {/* Spotlight border + fill */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 [mask-composite:exclude] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] p-px"
        style={{ background: spotlightBorder }}
      />

      {/* Visual */}
      <div className="relative mb-6 flex-1 min-h-[180px]">{visual}</div>

      {/* Text */}
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-500 group-hover:text-white">
            {icon}
          </div>
          <span className="text-3xl font-bold text-slate-200 transition-colors duration-300 group-hover:text-emerald-200">
            {number}
          </span>
        </div>
        <h3 className="mb-2 text-xl md:text-2xl font-bold text-slate-900">{title}</h3>
        <p className="mb-5 text-sm md:text-base leading-relaxed text-slate-600">
          {description}
        </p>
        <button
          onClick={onCtaClick}
          className="group/link inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-emerald-600 transition-colors hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500 rounded"
        >
          {cta}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
        </button>
      </div>
    </motion.article>
  );
};
