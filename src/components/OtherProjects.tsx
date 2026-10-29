import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '../data/projects';

const OtherProjects = () => {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const excludedProjectTitles = [
    "Digital Archiving Management System",
    "Zion Shop",
    "Quantyx Trading Journal",
    "Facundo Booking",
    "Broadheader"
  ];
  
  // Exclude featured and collaborative ones
  const rawOtherProjects = projects.filter(p => !excludedProjectTitles.includes(p.title));

  // Ensure the top 4 projects are strictly ordered:
  // 1. OFBank Mobile, 2. Travelista, 3. Veloura, 4. Leafly
  const priorityIds = ['ofbank-mobile', 'travelista', 'veloura', 'leafly'];
  const prioritized = priorityIds
    .map(id => rawOtherProjects.find(p => p.id === id || p.title.toLowerCase() === id.toLowerCase()))
    .filter((p): p is (typeof rawOtherProjects)[0] => Boolean(p));
  const remainingOtherProjects = rawOtherProjects.filter(
    p => !priorityIds.includes(p.id) && !priorityIds.includes(p.title.toLowerCase())
  );
  const otherProjects = [...prioritized, ...remainingOtherProjects];

  // 4 projects are visible at first; the rest are revealed when clicking "View All Projects"
  const displayedProjects = showAllProjects ? otherProjects : otherProjects.slice(0, 4);

  const handleToggleProjects = () => {
    if (showAllProjects) {
      const section = document.getElementById('other-projects');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setShowAllProjects(!showAllProjects);
  };

  return (
    <section id="other-projects" className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 !overflow-visible">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-emerald-700 to-green-700 bg-clip-text text-transparent px-2"
          >
            Other Projects
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 leading-relaxed"
          >
            A collection of side projects and experiments showcasing varied styles, conceptual designs, and creative exploration.
          </motion.p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <AnimatePresence mode="popLayout">
            {displayedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: showAllProjects && index >= 4 ? Math.min((index - 4) * 0.05, 0.3) : Math.min(index * 0.08, 0.3) }}
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
        {otherProjects.length > 4 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mt-12 md:mt-16"
          >
            <button
              onClick={handleToggleProjects}
              className="inline-flex items-center justify-center px-8 py-3 border border-slate-200 hover:border-emerald-600 text-slate-900 hover:text-emerald-600 rounded-full font-semibold transition-all duration-300 bg-white hover:bg-emerald-50 shadow-sm hover:shadow"
            >
              {showAllProjects ? 'Show Less Work' : 'View All Projects'}
            </button>
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default OtherProjects;
