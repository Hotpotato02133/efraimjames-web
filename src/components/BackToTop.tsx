import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const calculateScrollProgress = useCallback(() => {
    const scrollY = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const maxScroll = scrollHeight - clientHeight;

    // Show button after user scrolls past 300px
    setIsVisible(scrollY > 300);

    if (maxScroll > 0) {
      const progress = Math.min(Math.max((scrollY / maxScroll) * 100, 0), 100);
      setScrollProgress(progress);
    } else {
      setScrollProgress(0);
    }
  }, []);

  useEffect(() => {
    // Initial check
    calculateScrollProgress();

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          calculateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [calculateScrollProgress]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // SVG progress ring constants
  const size = 52;
  const strokeWidth = 3;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25,
          }}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 group"
        >
          {/* Tooltip */}
          <div
            role="tooltip"
            className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900/90 text-white text-xs font-medium rounded-lg shadow-lg backdrop-blur-sm opacity-0 pointer-events-none group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 whitespace-nowrap flex items-center gap-1"
          >
            <span>Back to top</span>
            <span className="text-emerald-400 font-mono text-[10px]">
              {Math.round(scrollProgress)}%
            </span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900/90" />
          </div>

          {/* Floating Action Button with Circular Scroll Progress */}
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="relative w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-full flex items-center justify-center bg-white/90 hover:bg-white text-slate-700 hover:text-emerald-600 border border-slate-200/90 hover:border-emerald-500/40 shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-emerald-500/20 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            {/* Circular Progress Ring */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
              viewBox={`0 0 ${size} ${size}`}
            >
              <defs>
                <linearGradient
                  id="backToTopProgressGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              {/* Background Track */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth={strokeWidth}
                className="opacity-70"
              />

              {/* Active Progress Stroke */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="url(#backToTopProgressGradient)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-150 ease-out"
              />
            </svg>

            {/* Icon */}
            <ArrowUp className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
