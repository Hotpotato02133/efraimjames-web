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
import { ArrowUpRight, ExternalLink, Layers, Sparkles, Calendar, User } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { getProjects } from '../lib/content';
import { fallbackProjects } from '../data/fallback';
import { trackEvent } from '../lib/analytics';
import type { Project } from '../lib/types';

interface PersonalGlideCardProps {
  project: Project;
  index: number;
  total: number;
}

const PersonalGlideCard = ({ project, index, total }: PersonalGlideCardProps) => {
  const cardRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isEven = index % 2 === 0;

  // Track this card's journey through the viewport
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start 94%', 'end 6%'],
  });

  // Liquid spring smoothing so wheel & trackpad scrolling feels weightless
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.6,
    restDelta: 0.001,
  });

  // Outer card 3D scroll-driven glide transforms
  const cardY = useTransform(
    smoothProgress,
    [0, 0.32, 0.68, 1],
    prefersReducedMotion ? [0, 0, 0, 0] : [85, 0, 0, -40]
  );
  const cardX = useTransform(
    smoothProgress,
    [0, 0.34, 0.7, 1],
    prefersReducedMotion ? [0, 0, 0, 0] : [isEven ? -52 : 52, 0, 0, isEven ? -16 : 16]
  );
  const cardScale = useTransform(
    smoothProgress,
    [0, 0.3, 0.72, 1],
    prefersReducedMotion ? [1, 1, 1, 1] : [0.91, 1, 1, 0.95]
  );
  const cardRotateX = useTransform(
    smoothProgress,
    [0, 0.32, 0.72, 1],
    prefersReducedMotion ? [0, 0, 0, 0] : [7, 0, 0, -4]
  );
  const cardRotateY = useTransform(
    smoothProgress,
    [0, 0.34, 0.72, 1],
    prefersReducedMotion ? [0, 0, 0, 0] : [isEven ? 3.5 : -3.5, 0, 0, isEven ? -1.5 : 1.5]
  );
  const cardOpacity = useTransform(
    smoothProgress,
    [0, 0.22, 0.78, 1],
    prefersReducedMotion ? [1, 1, 1, 1] : [0.15, 1, 1, 0.55]
  );

  // Inner multi-plane parallax layers
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
  const contentY = useTransform(
    smoothProgress,
    [0, 0.36, 0.7, 1],
    prefersReducedMotion ? [0, 0, 0, 0] : [42, 0, 0, -24]
  );
  const floatingBadgeY = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [26, -26]
  );

  // Cursor-following emerald spotlight
  const mouseX = useMotionValue(-400);
  const mouseY = useMotionValue(-400);

  const handleMouseMove = ({ currentTarget, clientX, clientY }: MouseEvent<HTMLElement>) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const spotlightFill = useMotionTemplate`radial-gradient(520px circle at ${mouseX}px ${mouseY}px, rgba(16, 185, 129, 0.09), transparent 80%)`;
  const spotlightBorder = useMotionTemplate`radial-gradient(340px circle at ${mouseX}px ${mouseY}px, rgba(16, 185, 129, 0.55), transparent 80%)`;

  const formattedIndex = String(index + 1).padStart(2, '0');
  const formattedTotal = String(total).padStart(2, '0');
  const hasLiveLink = Boolean(project.link && project.link !== '#');

  // Clean display hostname for the window bar
  const displayDomain = (() => {
    if (!hasLiveLink) return `portfolio://projects/${project.id}`;
    try {
      const url = new URL(project.link, window.location.origin);
      return url.host + (url.pathname !== '/' ? url.pathname : '');
    } catch {
      return project.link;
    }
  })();

  return (
    <div className="[perspective:1400px]">
      <motion.article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        style={{
          y: cardY,
          x: cardX,
          scale: cardScale,
          rotateX: cardRotateX,
          rotateY: cardRotateY,
          opacity: cardOpacity,
          transformStyle: 'preserve-3d',
        }}
        className="group relative rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200/80 bg-white/95 p-4 sm:p-6 lg:p-8 xl:p-10 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.1)] hover:shadow-[0_32px_80px_-20px_rgba(16,185,129,0.16)] transition-shadow duration-500 will-change-transform"
      >
        {/* Cursor-following emerald ambient fill */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlightFill }}
        />

        {/* Cursor-following emerald glowing border */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] p-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 [mask-composite:exclude] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]"
          style={{ background: spotlightBorder }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
          {/* Visual Showcase Stage (7 Columns) */}
          <div
            className={`lg:col-span-7 ${
              isEven ? 'lg:order-1' : 'lg:order-2'
            }`}
          >
            <div className="relative">
              {/* Subtle ambient glow behind preview frame */}
              <div
                aria-hidden="true"
                className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-emerald-500/15 via-teal-400/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              {/* Studio Window Chrome + Parallax Image Stage */}
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-slate-950 shadow-xl">
                {/* Browser Top Chrome */}
                <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-slate-900/95 px-4 py-2.5 sm:px-5 sm:py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>

                  <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] font-medium text-slate-300 truncate max-w-[200px] sm:max-w-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                    <span className="truncate">{displayDomain}</span>
                  </div>

                  <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-emerald-400/90 tabular-nums">
                    <span>{formattedIndex}</span>
                    <span className="text-slate-600">/</span>
                    <span className="text-slate-400">{formattedTotal}</span>
                  </div>
                </div>

                {/* Clickable Image Viewport with Scroll-Driven Inner Parallax */}
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

                  {/* Vignette + hover scrim */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                  {/* Floating Parallax Badge (Bottom-Left) */}
                  <motion.div
                    style={{ y: floatingBadgeY }}
                    className="pointer-events-none absolute bottom-3.5 left-3.5 sm:bottom-5 sm:left-5 flex items-center gap-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{project.cardTitle || project.title}</span>
                    <span className="text-white/40">·</span>
                    <span className="text-emerald-300">{project.year}</span>
                  </motion.div>

                  {/* Hover Action Pill (Bottom-Right) */}
                  <div className="pointer-events-none absolute bottom-3.5 right-3.5 sm:bottom-5 sm:right-5 flex items-center gap-2 rounded-full bg-emerald-600/95 backdrop-blur-md px-4 py-2 text-xs font-semibold text-white shadow-lg translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span>Explore Case Study</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Project Intelligence Panel (5 Columns) */}
          <motion.div
            style={{ y: contentY }}
            className={`lg:col-span-5 flex flex-col justify-center ${
              isEven ? 'lg:order-2' : 'lg:order-1'
            }`}
          >
            {/* Top Index & Category Row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200/70 px-3 py-1 text-xs font-bold tracking-wider text-emerald-700 tabular-nums">
                #{formattedIndex}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-semibold text-slate-700">
                <Layers className="h-3.5 w-3.5 text-emerald-600" />
                {project.category}
              </span>
              {project.cardTitle && project.cardTitle !== project.title && (
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {project.cardTitle}
                </span>
              )}
            </div>

            {/* Project Title */}
            <Link
              to={`/project/${project.id}`}
              onClick={() => trackEvent('project_click', { projectId: project.id })}
              className="group/title inline-block"
            >
              <h3 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight group-hover/title:text-emerald-600 transition-colors">
                {project.title}
              </h3>
            </Link>

            {/* Role & Year Metadata */}
            <div className="flex flex-wrap items-center gap-4 mt-3 mb-5 text-xs sm:text-sm font-medium text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-emerald-600" />
                {project.role}
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                {project.year}
              </span>
            </div>

            {/* Project Description */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              {project.description}
            </p>

            {/* Tech Stack Pills */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.slice(0, 6).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-slate-200/90 bg-slate-50/80 px-3 py-1 text-xs font-semibold text-slate-600 transition-colors group-hover:border-emerald-200/80 group-hover:bg-emerald-50/40 group-hover:text-emerald-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
              <Link
                to={`/project/${project.id}`}
                onClick={() => trackEvent('project_click', { projectId: project.id })}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 hover:bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-lg hover:shadow-emerald-600/20 transition-all duration-300"
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
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/60 px-5 py-3 text-sm font-semibold text-slate-700 hover:text-emerald-700 transition-all duration-300"
                >
                  <span>Live Preview</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </motion.article>
    </div>
  );
};

const Projects = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const projects = useContent(getProjects, fallbackProjects);
  const displayedProjects = projects
    .filter((p) => p.section === 'featured')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Section-wide scroll progress for the header progress bar & ambient glow
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ['start 80%', 'end 20%'],
  });

  const smoothSectionProgress = useSpring(sectionProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const progressWidth = useTransform(smoothSectionProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative py-24 lg:py-32 bg-white overflow-hidden"
    >
      {/* Subtle architectural grid backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-size:44px_44px] [background-image:linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]"
      />

      {/* Ambient emerald glow orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 -left-40 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1/4 -right-40 h-96 w-96 rounded-full bg-teal-100/50 blur-3xl"
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10 !overflow-visible">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/60 px-4 py-1.5 text-xs sm:text-sm font-semibold text-emerald-700 mb-5 shadow-sm"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Solo Engineering & Architecture</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-emerald-700 to-green-700 bg-clip-text text-transparent px-2"
          >
            Personal Projects
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 leading-relaxed"
          >
            A curated selection of personal solo projects — each one crafted with clean code,
            modern architecture, and a strong eye for user experience.
          </motion.p>

          {/* Scroll-driven section progress bar */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Scroll Glide
            </span>
            <div className="h-1.5 w-28 sm:w-36 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                style={{ width: progressWidth }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
              />
            </div>
            <span className="text-[11px] font-bold tabular-nums text-emerald-600">
              {String(displayedProjects.length).padStart(2, '0')} Works
            </span>
          </div>
        </div>

        {/* Scroll-Driven Editorial Glide Stack */}
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16 lg:space-y-20">
          {displayedProjects.map((project, index) => (
            <PersonalGlideCard
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

export default Projects;
