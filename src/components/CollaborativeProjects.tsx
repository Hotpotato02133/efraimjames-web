import { useRef, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion';
import { ArrowUpRight, ExternalLink, Users, Building2, Calendar, UserCheck } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { getProjects } from '../lib/content';
import { fallbackProjects } from '../data/fallback';
import { trackEvent } from '../lib/analytics';
import type { Project } from '../lib/types';

interface TeamGlideCardProps {
  project: Project;
  index: number;
  total: number;
}

const TeamGlideCard = ({ project, index, total }: TeamGlideCardProps) => {
  const cardRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isLeftColumn = index % 2 === 0;

  // Track this card's scroll progress through the viewport
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start 95%', 'end 8%'],
  });

  // Smooth spring physics for buttery scroll-linked motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 88,
    damping: 25,
    mass: 0.65,
    restDelta: 0.001,
  });

  // Differential dual-column glide: left & right cards converge laterally and glide at offset vertical velocities
  const cardY = useTransform(
    smoothProgress,
    [0, 0.36, 0.72, 1],
    prefersReducedMotion
      ? [0, 0, 0, 0]
      : isLeftColumn
      ? [85, 0, 0, -30]
      : [135, 0, 0, -50]
  );
  const cardX = useTransform(
    smoothProgress,
    [0, 0.36, 0.72, 1],
    prefersReducedMotion
      ? [0, 0, 0, 0]
      : [isLeftColumn ? -56 : 56, 0, 0, isLeftColumn ? -14 : 14]
  );
  const cardScale = useTransform(
    smoothProgress,
    [0, 0.34, 0.74, 1],
    prefersReducedMotion ? [1, 1, 1, 1] : [0.9, 1, 1, 0.95]
  );
  const cardRotateX = useTransform(
    smoothProgress,
    [0, 0.34, 0.74, 1],
    prefersReducedMotion ? [0, 0, 0, 0] : [8, 0, 0, -4]
  );
  const cardRotateZ = useTransform(
    smoothProgress,
    [0, 0.36, 0.74, 1],
    prefersReducedMotion ? [0, 0, 0, 0] : [isLeftColumn ? -1.8 : 1.8, 0, 0, 0]
  );
  const cardOpacity = useTransform(
    smoothProgress,
    [0, 0.24, 0.78, 1],
    prefersReducedMotion ? [1, 1, 1, 1] : [0.15, 1, 1, 0.6]
  );

  // Inner image counter-scroll parallax
  const imageY = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? ['0%', '0%'] : ['-7%', '7%']
  );
  const imageScale = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    prefersReducedMotion ? [1, 1, 1] : [1.1, 1.02, 1.08]
  );
  const badgeY = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [22, -22]
  );

  // Cursor-following emerald spotlight
  const mouseX = useMotionValue(-400);
  const mouseY = useMotionValue(-400);

  const handleMouseMove = ({ currentTarget, clientX, clientY }: MouseEvent<HTMLElement>) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const spotlightFill = useMotionTemplate`radial-gradient(460px circle at ${mouseX}px ${mouseY}px, rgba(16, 185, 129, 0.1), transparent 80%)`;
  const spotlightBorder = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, rgba(16, 185, 129, 0.55), transparent 80%)`;

  const formattedIndex = String(index + 1).padStart(2, '0');
  const formattedTotal = String(total).padStart(2, '0');
  const hasLiveLink = Boolean(project.link && project.link !== '#');

  const displayDomain = (() => {
    if (!hasLiveLink) return `team://projects/${project.id}`;
    try {
      const url = new URL(project.link, window.location.origin);
      return url.host.replace(/^www\./, '') + (url.pathname !== '/' ? url.pathname : '');
    } catch {
      return project.link;
    }
  })();

  return (
    <div className={`[perspective:1400px] ${!isLeftColumn ? 'lg:mt-14' : ''}`}>
      <motion.article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        style={{
          y: cardY,
          x: cardX,
          scale: cardScale,
          rotateX: cardRotateX,
          rotateZ: cardRotateZ,
          opacity: cardOpacity,
          transformStyle: 'preserve-3d',
        }}
        className="group relative flex flex-col h-full rounded-[2rem] sm:rounded-[2.4rem] border border-slate-200/80 bg-white p-4 sm:p-6 lg:p-7 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.1)] hover:shadow-[0_32px_80px_-20px_rgba(16,185,129,0.18)] transition-shadow duration-500 will-change-transform"
      >
        {/* Cursor-following emerald ambient fill */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[2rem] sm:rounded-[2.4rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlightFill }}
        />

        {/* Cursor-following emerald glowing border */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[2rem] sm:rounded-[2.4rem] p-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 [mask-composite:exclude] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]"
          style={{ background: spotlightBorder }}
        />

        {/* Top Visual Showcase Frame */}
        <div className="relative z-10 mb-6">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-slate-950 shadow-lg">
            {/* Browser Top Chrome */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-slate-900/95 px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              </div>

              <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] font-medium text-slate-300 truncate max-w-[180px] sm:max-w-[240px]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span className="truncate">{displayDomain}</span>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400/90 tabular-nums">
                <span>{formattedIndex}</span>
                <span className="text-slate-600">/</span>
                <span className="text-slate-400">{formattedTotal}</span>
              </div>
            </div>

            {/* Parallax Image Container */}
            <Link
              to={`/project/${project.id}`}
              onClick={() => trackEvent('project_click', { projectId: project.id })}
              className="block relative aspect-[16/10] w-full overflow-hidden bg-slate-900"
            >
              <motion.div
                style={{ y: imageY, scale: imageScale }}
                className="h-full w-full will-change-transform"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </motion.div>

              {/* Subtle gradient scrim */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

              {/* Floating Parallax Client Pill (Bottom-Left) */}
              <motion.div
                style={{ y: badgeY }}
                className="pointer-events-none absolute bottom-3.5 left-3.5 sm:bottom-4 sm:left-4 flex items-center gap-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg"
              >
                <Users className="h-3.5 w-3.5 text-emerald-400" />
                <span>{project.client}</span>
                <span className="text-white/40">·</span>
                <span className="text-emerald-300">{project.year}</span>
              </motion.div>

              {/* Hover Action Pill (Bottom-Right) */}
              <div className="pointer-events-none absolute bottom-3.5 right-3.5 sm:bottom-4 sm:right-4 flex items-center gap-1.5 rounded-full bg-emerald-600/95 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span>Case Study</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="relative z-10 flex flex-1 flex-col justify-between px-1 sm:px-2">
          <div>
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
              <span className="inline-flex items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 text-xs font-bold tracking-wider text-emerald-700 tabular-nums">
                #{formattedIndex}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">
                <Users className="h-3.5 w-3.5" />
                Team Shipped
              </span>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {project.category}
              </span>
            </div>

            {/* Title */}
            <Link
              to={`/project/${project.id}`}
              onClick={() => trackEvent('project_click', { projectId: project.id })}
              className="group/title inline-block"
            >
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight group-hover/title:text-emerald-600 transition-colors">
                {project.title}
              </h3>
            </Link>

            {/* Role & Client Metadata */}
            <div className="flex flex-wrap items-center gap-3 mt-2.5 mb-4 text-xs sm:text-sm font-medium text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                {project.role}
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-emerald-600" />
                {project.client}
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                {project.year}
              </span>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              {project.description}
            </p>
          </div>

          <div>
            {/* Tech Stack Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
                {project.tags.slice(0, 6).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-slate-200/90 bg-slate-50/90 px-2.5 py-1 text-xs font-semibold text-slate-600 transition-colors group-hover:border-emerald-200/80 group-hover:bg-emerald-50/50 group-hover:text-emerald-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <Link
                to={`/project/${project.id}`}
                onClick={() => trackEvent('project_click', { projectId: project.id })}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 hover:bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:shadow-lg hover:shadow-emerald-600/20 transition-all duration-300"
              >
                <span>View Case Study</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              {hasLiveLink && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('project_click', { projectId: project.id })}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/60 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-emerald-700 transition-all duration-300"
                >
                  <span>Visit Live Site</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
};

const CollaborativeProjects = () => {
  const projects = useContent(getProjects, fallbackProjects);
  const displayedProjects = projects
    .filter((p) => p.section === 'collaborative')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section
      id="collaborative-projects"
      className="relative py-24 lg:py-32 bg-stone-50 overflow-hidden"
    >
      {/* Subtle architectural grid backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-size:44px_44px] [background-image:linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-96 w-[38rem] rounded-full bg-emerald-100/40 blur-3xl"
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10 !overflow-visible">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-white border border-emerald-200/70 px-4 py-1.5 text-xs sm:text-sm font-semibold text-emerald-700 mb-5 shadow-sm"
          >
            <Users className="h-3.5 w-3.5 text-emerald-600" />
            <span>Collaborative Engineering</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-emerald-700 to-green-700 bg-clip-text text-transparent px-2"
          >
            Team Projects
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 leading-relaxed"
          >
            Production platforms shipped in close collaboration alongside cross-functional
            developers, designers, and stakeholders.
          </motion.p>
        </div>

        {/* Differential Dual-Column Glide Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-12 max-w-7xl mx-auto items-start">
          {displayedProjects.map((project, index) => (
            <TeamGlideCard
              key={project.id}
              project={project}
              index={index}
              total={displayedProjects.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollaborativeProjects;
