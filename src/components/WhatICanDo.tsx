import React from "react";
import { motion } from "framer-motion";
import { Layout, UserCheck, Layers, ArrowRight } from "lucide-react";

const WhatICanDo = () => {
  const capabilities = [
    {
      icon: <Layout className="w-8 h-8" />,
      number: "01",
      title: "UI Design",
      description:
        "Crafting visually appealing, pixel-perfect interfaces that align with your brand identity and delight users.",
      skills: [
        "Visual Design",
        "Design Systems",
        "Typography & Color",
        "Responsive Interfaces",
        "Interactive Components",
      ],
      link: "ABOUT UI DESIGN",
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      number: "02",
      title: "UX Research & Design",
      description:
        "Understanding user behaviors and needs to create seamless, intuitive, and accessible user journeys.",
      skills: [
        "User Research",
        "Information Architecture",
        "User Personas",
        "Journey Mapping",
        "Usability Testing",
      ],
      link: "ABOUT UX DESIGN",
    },
    {
      icon: <Layers className="w-8 h-8" />,
      number: "03",
      title: "Prototyping & Wireframing",
      description:
        "Translating concepts into interactive prototypes to visualize ideas and validate them before development.",
      skills: [
        "Low-fidelity Wireframes",
        "High-fidelity Prototypes",
        "Interactive Interactions",
        "User Flows",
        "Figma & Component Auto-layout",
      ],
      link: "ABOUT PROTOTYPING",
    },
  ];

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: any = {
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
            Specialized UI/UX design services aimed at creating intuitive, engaging, and impactful digital experiences.
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
              <button className="flex items-center space-x-2 text-emerald-600 font-semibold text-sm group/link hover:text-emerald-700 transition-colors mt-auto">
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
