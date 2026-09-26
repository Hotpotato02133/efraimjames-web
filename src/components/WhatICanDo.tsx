import { motion, type Variants } from "framer-motion";
import { Code2, LayoutDashboard, PenTool, ArrowRight } from "lucide-react";

const WhatICanDo = () => {
  const capabilities = [
    {
      icon: <Code2 className="w-8 h-8" />,
      number: "01",
      title: "Frontend Development",
      description:
        "Building fast, responsive, and maintainable web applications with React, TypeScript, and modern tooling — clean code that scales with your product.",
      skills: [
        "React & Next.js",
        "TypeScript & JavaScript",
        "Tailwind CSS & Responsive Layouts",
        "REST API & Backend Integration",
        "Performance & Accessibility",
      ],
      link: "SEE MY WORK",
      target: "#projects",
    },
    {
      icon: <LayoutDashboard className="w-8 h-8" />,
      number: "02",
      title: "Dashboards & Web Apps",
      description:
        "Turning complex data and workflows into clear, interactive dashboards, reporting views, and role-based interfaces users actually enjoy.",
      skills: [
        "Analytics & Reporting Dashboards",
        "Interactive Charts & Data Views",
        "Role-Based Views & Route Guards",
        "Auth, Onboarding & Account Flows",
        "Reusable Component Patterns",
      ],
      link: "SEE MY EXPERIENCE",
      target: "#work-history",
    },
    {
      icon: <PenTool className="w-8 h-8" />,
      number: "03",
      title: "UI/UX-Driven Implementation",
      description:
        "Bridging design and code with a UI/UX background — translating Figma designs into pixel-perfect components and shaping interfaces around real user needs.",
      skills: [
        "Figma to Production Code",
        "Design Systems & Component Libraries",
        "Wireframing & Prototyping",
        "UX Research & Usability Testing",
        "Functional QA & UI Polish",
      ],
      link: "ABOUT ME",
      target: "#about",
    },
  ];

  const handleScrollTo = (target: string) => {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section id="what-i-can-do" className="py-24 lg:py-32 bg-stone-50 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 overflow-hidden">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-emerald-700 to-green-700 bg-clip-text text-transparent px-2">
            What I Can Do
          </h2>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
            Frontend development backed by a UI/UX design background — interfaces that look great, work flawlessly, and scale with your product.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {capabilities.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-white rounded-2xl p-8 lg:p-10 shadow-sm hover:shadow-xl border border-slate-100 hover:border-emerald-100 transition-all duration-300 flex flex-col"
            >
              {/* Top Decor Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-2xl origin-left" />

              {/* Header Part */}
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                  {service.icon}
                </div>
                <span className="text-4xl font-bold text-slate-200 group-hover:text-slate-300 transition-colors duration-300">
                  {service.number}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-slate-600 mb-8 leading-relaxed flex-grow">
                {service.description}
              </p>

              {/* Skills List */}
              <div className="space-y-2 mb-8 pt-6 border-t border-slate-100">
                {service.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className="flex items-center text-slate-500 text-sm font-medium group-hover:text-slate-700 transition-colors duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2.5" />
                    {skill}
                  </div>
                ))}
              </div>

              {/* CTA Link */}
              <button
                onClick={() => handleScrollTo(service.target)}
                className="flex items-center space-x-2 text-emerald-600 font-semibold text-sm group/link hover:text-emerald-700 transition-colors mt-auto">
                <span className="uppercase tracking-wide">{service.link}</span>
                <ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-300" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhatICanDo;
