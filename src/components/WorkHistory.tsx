import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Layers } from 'lucide-react';
import { TracingBeam } from './ui/tracing-beam';
import { SpotlightCard } from './ui/spotlight-card';
import { AnimatedTooltip, type TooltipLink } from './ui/animated-tooltip';
import yolkLogo from '../assets/yolk-logo.png';
import inspoLogo from '../assets/inspo-logo.png';
import broadheaderLogo from '../assets/broadheader-logo.png';
import facundoLogo from '../assets/facundo-logo.png';
import oroLogo from '../assets/oro-logo.png';

interface Experience {
  id: number;
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  projects?: TooltipLink[];
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
          logo: yolkLogo,
        },
        {
          name: "Inspo Web",
          url: "https://app.findinspo.co/",
          logo: inspoLogo,
          logoScale: 1.9,
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
      projects: [
        {
          name: "Broadheader",
          url: "https://www.broadheader.com/",
          logo: broadheaderLogo,
          logoScale: 1.7,
        },
        {
          name: "Facundo",
          url: "https://www.fcvndo.com/",
          logo: facundoLogo,
          logoScale: 1.45,
        },
      ],
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
      projects: [
        {
          name: "ORO Admin",
          url: "https://oroadmin.web.app/",
          logo: oroLogo,
        },
      ],
      skills: ["JavaScript", "React", "Git", "Agile"],
    }
  ];

  return (
    <section id="work-history" className="py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Faint grid backdrop, matching "What I Can Do" */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-size:40px_40px] [background-image:linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      <div className="container mx-auto px-4 md:px-6 relative">
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

        <TracingBeam>
          <ol className="space-y-12 md:space-y-16 pl-10 md:pl-16">
            {experiences.map((exp) => (
              <motion.li
                key={exp.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="grid gap-4 md:grid-cols-[200px_1fr] md:gap-10"
              >
                {/* Period + location rail */}
                <div className="md:sticky md:top-28 md:self-start space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                    <Calendar className="h-4 w-4" />
                    <span>{exp.period}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm font-medium text-slate-500">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    {exp.location}
                  </div>
                </div>

                {/* Card */}
                <SpotlightCard className="p-6 lg:p-8">
                  <h3 className="text-2xl font-bold text-slate-900">{exp.role}</h3>
                  <p className="mt-1 mb-5 flex items-center gap-2 font-medium text-slate-500">
                    <Briefcase className="h-4 w-4 flex-shrink-0" />
                    {exp.company}
                  </p>

                  <p className="mb-6 leading-relaxed text-slate-600">{exp.description}</p>

                  {exp.projects && (
                    <div className="mb-6">
                      <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        <Layers className="h-3.5 w-3.5" />
                        {exp.projects.length === 1 ? 'Project' : 'Projects'}
                      </p>
                      <AnimatedTooltip items={exp.projects} />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition-colors group-hover:border-emerald-200 group-hover:text-emerald-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </SpotlightCard>
              </motion.li>
            ))}
          </ol>
        </TracingBeam>
      </div>
    </section>
  );
};

export default WorkHistory;
