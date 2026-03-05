import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';

const WorkHistory = () => {
  const experiences = [
    {
      id: 1,
      period: "2022 - Present",
      role: "Senior Product Designer",
      company: "Tech Innovators Studio",
      description: "Leading the design of enterprise-level SaaS products. Established a comprehensive design system that reduced development time by 30%. Mentored junior designers and collaborated closely with engineering teams to ensure pixel-perfect implementation.",
      skills: ["Design Systems", "Prototyping", "User Research", "Agile"],
    },
    {
      id: 2,
      period: "2019 - 2022",
      role: "UI/UX Designer",
      company: "Creative Digital Agency",
      description: "Transformed client ideas into engaging digital experiences. Worked on over 40+ projects ranging from e-commerce to corporate websites. Conducted A/B testing that led to a 25% increase in user conversion rates.",
      skills: ["Wireframing", "Figma", "Interaction Design", "Client Communication"],
    },
    {
      id: 3,
      period: "2017 - 2019",
      role: "Frontend Developer",
      company: "Startup Co.",
      description: "Bridged the gap between design and technical implementation. Built responsive single-page applications and translated static designs into interactive, accessible, and performant web components.",
      skills: ["React", "CSS/SCSS", "JavaScript", "Responsive Design"],
    }
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);

  return (
    <section id="work-history" className="py-24 lg:py-32 bg-white relative overflow-hidden" ref={containerRef}>
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
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-slate-100 transform md:-translate-x-1/2">
            <motion.div 
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-emerald-400 to-teal-600 origin-top"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="space-y-16">
            {experiences.map((exp, index) => {
              const isEven = index % 2 === 0;

              return (
                <div key={exp.id} className="relative flex flex-col md:flex-row items-start md:items-center w-full group">
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-white border-4 border-emerald-500 transform -translate-x-1/2 mt-6 md:mt-0 z-10 group-hover:scale-125 transition-transform duration-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />

                  {/* Content Container (Left / Right Alternating for Desktop) */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
                    className={`w-full md:w-1/2 pl-12 pr-4 md:px-12 ${isEven ? 'md:text-right md:pr-16 lg:pr-24' : 'md:ml-auto md:pl-16 lg:pl-24'} relative`}
                  >
                    {/* Background Card */}
                    <div className="bg-stone-50 rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 group-hover:-translate-y-1 relative overflow-hidden">
                      
                      {/* Decorative Background Blob */}
                      <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className={`flex flex-col gap-2 mb-4 ${isEven ? 'md:items-end' : 'md:items-start'}`}>
                        {/* Period Tag */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-sm font-medium">
                          <Calendar className="w-4 h-4" />
                          <span>{exp.period}</span>
                        </div>
                        
                        {/* Role & Company */}
                        <h3 className="text-2xl font-bold text-slate-900 mt-2">{exp.role}</h3>
                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                          <Briefcase className="w-4 h-4" />
                          <span>{exp.company}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-slate-600 leading-relaxed mb-6 relative z-10">
                        {exp.description}
                      </p>

                      {/* Skills/Tags */}
                      <div className={`flex flex-wrap gap-2 relative z-10 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
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
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mt-20"
        >
          <div className="w-3 h-3 rounded-full bg-slate-300" />
        </motion.div>
      </div>
    </section>
  );
};

export default WorkHistory;
