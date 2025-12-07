import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Calendar, User, Briefcase } from 'lucide-react';
import { getProjectById, getRelatedProjects, Project } from '../data/projects';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = id ? getProjectById(id) : undefined;
  const relatedProjects = project ? getRelatedProjects(project.id, project.category) : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Project Not Found</h1>
          <p className="text-slate-600 mb-8">The project you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Back Button */}
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mb-8">
          <div className="mx-4 sm:mx-6 lg:mx-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => navigate('/#projects')}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </motion.button>
          </div>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 md:px-6 mb-12"
        >
          <div className="relative aspect-video max-w-5xl mx-auto overflow-hidden rounded-3xl shadow-2xl">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </motion.div>

        {/* Project Info */}
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                {project.category}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6"
            >
              {project.title}
            </motion.h1>

            {/* Meta Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-slate-200"
            >
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{project.year}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <User className="w-4 h-4" />
                <span className="text-sm">{project.client}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Briefcase className="w-4 h-4" />
                <span className="text-sm">{project.role}</span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mb-10"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About the Project</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {project.fullDescription}
              </p>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-10"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Technologies & Skills</h2>
              <div className="flex flex-wrap gap-3">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mb-16"
            >
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                View Live Project
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="pt-12 border-t border-slate-200"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-8">Related Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedProjects.map((relatedProject) => (
                    <Link
                      key={relatedProject.id}
                      to={`/project/${relatedProject.id}`}
                      className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
                    >
                      <img
                        src={relatedProject.image}
                        alt={relatedProject.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-semibold group-hover:text-emerald-400 transition-colors">
                          {relatedProject.title}
                        </h3>
                        <span className="text-white/70 text-sm">{relatedProject.category}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetails;
