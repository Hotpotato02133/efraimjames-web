import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Briefcase, Calendar, MapPin, ArrowUpRight, ChevronDown, Layers } from 'lucide-react';

interface ExperienceProject {
  name: string;
  url: string;
  description: string;
}

interface Experience {
  id: number;
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  projects?: ExperienceProject[];
  skills: string[];
}

const WorkHistory = () => {
  const experiences: Experience[] = [
    {
      id: 1,
      period: "Mar 2026 - Sep 2026",
      role: "Frontend Developer",
      company: "Undisclosed Group / Social Intelligence Lab",
      location: "Remote · New York, USA",
      description: "Built and maintained frontend interfaces for two social-media intelligence platforms, including creator analytics, performance dashboards, and role-based reporting views. Collaborated closely with product and engineering through code review and QA to ship polished, reliable features.",
      projects: [
        {
          name: "Yolk",
          url: "https://useyolk.com/",
          description: "Creator marketplace platform with role-based dashboards for agencies, clients, and creators.",
        },
        {
          name: "Inspo Web",
          url: "https://findinspo.co/",
          description: "AI-powered social-media analytics dashboard for tracking accounts and trends.",
        },
      ],
      skills: ["Frontend Dev", "Dashboards", "Data Visualization", "Role-Based UI", "QA Testing", "Git"],
    },
    {
      id: 2,
      period: "Nov 2024 - Feb 2026",
      role: "UI/UX Designer",
      company: "Broadheader",
      location: "Remote · Angeles City, Pampanga, PH",
      description: "Led the design and frontend development for diverse projects including trading platforms and booking services. Implemented UI components, integrated REST APIs, and maintained clean code documentation.",
      skills: ["UI/UX", "Frontend Dev", "React / Vite", "REST APIs"],
    },
    {
      id: 3,
      period: "Aug 2024 - Jan 2025",
      role: "Web Designer",
      company: "Business Partner Group",
      location: "Remote · Brisbane, Australia",
      description: "Developed frontend components for key responsive pages. Led UX writing efforts for micro-copy and managed QA processes to ensure optimal user experiences and seamless functionality.",
      skills: ["Web Design", "UX Writing", "Frontend Dev", "QA"],
    },
    {
      id: 4,
      period: "Oct 2023 - Sep 2024",
      role: "Frontend Developer",
      company: "ORO Business Group",
      location: "Onsite · Zamboanga City, PH",
      description: "Collaborated in an agile environment to build and optimize frontend features. Expanded technical skills in JavaScript design patterns and actively participated in code reviews.",
      skills: ["JavaScript", "React", "Git", "Agile"],
    }
  ];

  // Track progress across the timeline itself (not the whole section) so the
  // line fills in step with the cards, and smooth it with a spring.
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 60%"]
  });
  const lineProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="work-history" className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-emerald-700 to-green-700 bg-clip-text text-transparent px-2">
            Work History
          </h2>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
            A journey of continuous learning and creating impactful digital experiences over the years.
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="max-w-5xl mx-auto relative" ref={timelineRef}>
          {/* Vertical Line - scaled with a transform instead of animating height */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-slate-100 md:-translate-x-1/2">
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-emerald-400 to-teal-600 origin-top will-change-transform"
              style={{ scaleY: lineProgress }}
            />
          </div>

          <div className="space-y-12 md:space-y-16">
            {experiences.map((exp, index) => {
              const isEven = index % 2 === 0;

              return (
                <div key={exp.id} className="relative flex flex-col md:flex-row items-start w-full group">

                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 top-7 w-4 h-4 rounded-full bg-white border-4 border-emerald-500 -translate-x-1/2 z-10 group-hover:scale-125 transition-transform duration-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />

                  {/* Content Container (Left / Right Alternating for Desktop) */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className={`w-full md:w-1/2 pl-12 ${isEven ? 'md:pl-0 md:pr-12 lg:pr-16' : 'md:ml-auto md:pl-12 lg:pl-16'}`}
                  >
                    {/* Background Card */}
                    <div className="bg-stone-50 rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-xl border border-slate-100 transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1 relative overflow-hidden">

                      {/* Decorative Background Blob */}
                      <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className="relative z-10 flex flex-col items-start gap-2 mb-4">
                        {/* Period Tag */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-sm font-medium">
                          <Calendar className="w-4 h-4" />
                          <span>{exp.period}</span>
                        </div>

                        {/* Role & Company */}
                        <h3 className="text-2xl font-bold text-slate-900 mt-2">{exp.role}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 font-medium">
                          <span className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 flex-shrink-0" />
                            {exp.company}
                          </span>
                          <span className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            {exp.location}
                          </span>
                        </div>

                        {/* Projects reveal - hover or focus the badge to preview */}
                        {exp.projects && (
                          <div className="group/emp w-full mt-1">
                            <button
                              type="button"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 transition-colors duration-200"
                            >
                              <Layers className="w-3.5 h-3.5" />
                              {exp.projects.length} {exp.projects.length === 1 ? 'Project' : 'Projects'}
                              <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover/emp:rotate-180 group-focus-within/emp:rotate-180" />
                            </button>

                            <div className="grid grid-rows-[0fr] group-hover/emp:grid-rows-[1fr] group-focus-within/emp:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
                              <div className="overflow-hidden">
                                <div className="grid gap-2.5 pt-3">
                                  {exp.projects.map((project) => (
                                    <a
                                      key={project.name}
                                      href={project.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group/project block p-3.5 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition-[border-color,box-shadow] duration-300"
                                    >
                                      <div className="flex items-center justify-between gap-2 mb-1">
                                        <span className="font-semibold text-slate-900 text-sm group-hover/project:text-emerald-600 transition-colors duration-300">
                                          {project.name}
                                        </span>
                                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover/project:text-emerald-600 group-hover/project:translate-x-0.5 group-hover/project:-translate-y-0.5 transition-[color,transform] duration-300" />
                                      </div>
                                      <p className="text-xs text-slate-500 leading-relaxed">
                                        {project.description}
                                      </p>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-slate-600 leading-relaxed mb-6 relative z-10">
                        {exp.description}
                      </p>

                      {/* Skills/Tags */}
                      <div className="flex flex-wrap gap-2 relative z-10">
                        {exp.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-3 py-1 text-xs font-medium bg-white text-slate-600 border border-slate-200 rounded-lg group-hover:border-emerald-200 group-hover:text-emerald-700 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Closing Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mt-20"
        >
          <div className="w-3 h-3 rounded-full bg-slate-300" />
        </motion.div>
      </div>
    </section>
  );
};

export default WorkHistory;
