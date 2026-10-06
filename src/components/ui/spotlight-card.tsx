import type { MouseEvent, ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "../../lib/utils";

/** Card with a cursor-following emerald spotlight fill and border glow. */
export const SpotlightCard = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);

  const handleMouseMove = ({ currentTarget, clientX, clientY }: MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const fill = useMotionTemplate`radial-gradient(360px circle at ${mouseX}px ${mouseY}px, rgba(16,185,129,0.12), transparent 80%)`;
  const border = useMotionTemplate`radial-gradient(240px circle at ${mouseX}px ${mouseY}px, rgba(16,185,129,0.5), transparent 80%)`;

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-emerald-900/5",
        className
      )}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: fill }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl p-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 [mask-composite:exclude] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]"
        style={{ background: border }}
      />
      <div className="relative">{children}</div>
    </div>
  );
};
