import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "../../lib/utils";

/**
 * Aceternity-style Tracing Beam: an SVG line that fills with a gradient and
 * carries a glowing dot as the wrapped content scrolls past.
 */
export const TracingBeam = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 60%"],
  });

  const [started, setStarted] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => setStarted(v > 0));

  // Keep the beam as tall as the content, including after responsive reflow.
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const update = () => setSvgHeight(el.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const spring = { stiffness: 500, damping: 90 };
  const y1 = useSpring(
    useTransform(scrollYProgress, [0, 0.8], [50, Math.max(svgHeight - 50, 50)]),
    spring
  );
  const y2 = useSpring(
    useTransform(scrollYProgress, [0, 1], [50, Math.max(svgHeight - 200, 50)]),
    spring
  );

  return (
    <div ref={ref} className={cn("relative mx-auto w-full max-w-5xl", className)}>
      <div className="absolute left-0 top-3 md:-left-4">
        {/* Dot */}
        <motion.div
          transition={{ duration: 0.2, delay: 0.5 }}
          animate={{
            boxShadow: started ? "none" : "rgba(16,185,129,0.25) 0px 3px 8px",
          }}
          className="ml-[27px] flex h-4 w-4 items-center justify-center rounded-full border border-emerald-200 bg-white shadow-sm"
        >
          <motion.div
            transition={{ duration: 0.2, delay: 0.5 }}
            animate={{
              backgroundColor: started ? "#ffffff" : "#10b981",
              borderColor: started ? "#ffffff" : "#059669",
            }}
            className="h-2 w-2 rounded-full border border-emerald-600 bg-emerald-500"
          />
        </motion.div>

        {/* Line */}
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight}
          className="ml-4 block"
          aria-hidden="true"
        >
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="#e2e8f0"
            strokeOpacity="0.8"
            transition={{ duration: 10 }}
          />
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="url(#timeline-gradient)"
            strokeWidth="1.5"
            className="motion-reduce:hidden"
            transition={{ duration: 10 }}
          />
          <defs>
            <motion.linearGradient
              id="timeline-gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={y1}
              y2={y2}
            >
              <stop stopColor="#18CCFC" stopOpacity="0" />
              <stop stopColor="#34d399" />
              <stop offset="0.325" stopColor="#10b981" />
              <stop offset="1" stopColor="#14b8a6" stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </svg>
      </div>

      <div ref={contentRef}>{children}</div>
    </div>
  );
};
