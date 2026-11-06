import { motion } from 'framer-motion';
import { useContent } from '../hooks/useContent';
import { getAboutContent } from '../lib/content';
import { fallbackAboutContent } from '../data/fallback';

const About = () => {
  const about = useContent(getAboutContent, fallbackAboutContent);

  return (
    <section id="about" className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-emerald-700 to-green-700 bg-clip-text text-transparent px-2"
          >
            About Me
          </motion.h2>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6 text-slate-600 text-lg leading-relaxed"
          >
            <p>{about.paragraph1}</p>
            <p>{about.paragraph2}</p>
          </motion.div>

          {/* Skills Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mt-10"
          >
            {about.tags.map((skill, index) => (
              <span 
                key={index} 
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
