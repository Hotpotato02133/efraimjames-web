import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '../data/projects';

const Projects = () => {
  const [showAllProjects, setShowAllProjects] = useState(false);

  const displayedProjects = showAllProjects ? projects : projects.slice(0, 4);

  return (
    <section id="projects" className="py-24 lg:py-32 bg-stone-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
          >
            Featured Projects
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-slate-600 leading-relaxed"
          >
            A curated selection of my work in web applications, UI/UX design, and digital experiences. 
            Each project represents a commitment to quality and innovation.
          </motion.p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <AnimatePresence>
            {displayedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative h-[400px] w-full overflow-hidden rounded-3xl cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-500"
              >
                <Link 
                  to={`/project/${project.id}`}
                  className="block h-full w-full"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                    />
                    {/* Subtle Overlay */}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>

                  {/* Glass Info Box */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center justify-between p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg transform transition-all duration-300 group-hover:-translate-y-1">
                      <div className="flex flex-col">
                        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors drop-shadow-md">
                          {project.title}
                        </h3>
                        <span className="text-sm font-medium text-white/80 mt-1">
                          {project.category}
                        </span>
                      </div>
                      <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors backdrop-blur-sm">
                        <ArrowUpRight className="w-5 h-5 text-white group-hover:text-emerald-400 transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* View All Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-16 md:mt-24"
        >
          <button
            onClick={() => setShowAllProjects(!showAllProjects)}
            className="inline-flex items-center justify-center px-8 py-3 border border-slate-200 hover:border-emerald-600 text-slate-900 hover:text-emerald-600 rounded-full font-semibold transition-all duration-300 bg-white hover:bg-emerald-50"
          >
            {showAllProjects ? 'Show Less Work' : 'View All Projects'}
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default Projects;
