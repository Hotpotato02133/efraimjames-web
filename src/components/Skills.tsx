import React from "react";
import { motion } from "framer-motion";
import { Layout, PenTool, Code2, ArrowRight } from "lucide-react";

const Skills = () => {
  const capabilities = [
    {
      icon: <Layout className="w-8 h-8" />,
      number: "01",
      title: "UI/UX Design",
      description:
        "Creating intuitive and engaging user experiences that captivate your audience by blending your brand voice and customer needs.",
      skills: [
        "User Interface Design",
        "User Experience Design",
        "Usability Testing",
        "Wireframing",
        "Prototyping",
      ],
      link: "ABOUT UI/UX DESIGN",
    },
    {
      icon: <PenTool className="w-8 h-8" />,
      number: "02",
      title: "Graphic Design",
      description:
        "Visual design and brand identity solutions tailored to your specifications, designed to deliver a flawless creative impact.",
      skills: [
        "Branding & Identity",
        "Logo Design",
        "Mockups & Prototypes",
        "Illustrations",
        "Print Design",
      ],
      link: "ABOUT GRAPHIC DESIGN",
    },
    {
      icon: <Code2 className="w-8 h-8" />,
      number: "03",
      title: "Development",
      description:
        "Building responsive web and mobile applications that are tailored to deliver a seamless user experience and proven results.",
      skills: [
        "Front-end development",
        "Web & Mobile Development",
        "Responsive Design",
        "React applications",
        "Platform solutions",
      ],
      link: "ABOUT DEVELOPMENT",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section id="skills" className="py-24 lg:py-32 bg-stone-50 relative overflow-hidden">
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
            Services
          </h2>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
            Comprehensive design and development solutions to elevate your digital
            presence and bring your vision to life.
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

export default Skills;
