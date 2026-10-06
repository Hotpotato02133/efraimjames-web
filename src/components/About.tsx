
import { motion } from 'framer-motion';

const About = () => {
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
            <p>
              I'm a Frontend Developer with a background in UI/UX design. I build responsive,
              accessible web applications with React and TypeScript from creator analytics
              dashboards and reporting tools to booking platforms and marketing sites.
            </p>
            <p>
              Having designed interfaces before building them, I bring a designer's eye to the
              code: clear information hierarchy, reusable component patterns, and polished
              interactions backed by thorough QA and close collaboration with product and
              engineering teams.
            </p>
          </motion.div>

          {/* Skills Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mt-10"
          >
            {['Frontend Development', 'React & TypeScript', 'Dashboards & Web Apps', 'UI/UX Design'].map((skill, index) => (
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
