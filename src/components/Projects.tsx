import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Smartphone, Monitor, Palette, Globe, ChevronDown, ChevronUp } from 'lucide-react';

// Import images as modules
import service1c from '../assets/service-1c.jpg';
import service2b from '../assets/service-2b.png';
import service1b from '../assets/service-1b.jpg';
import service2a from '../assets/service-2a.png';
import service1a from '../assets/service-1a.jpg';
import service2c from '../assets/service-2c.png';
import service3a from '../assets/service-3a.jpg';
import service4a from '../assets/service-4a.jpg';
import service3b from '../assets/service-3b.jpg';
import service4b from '../assets/service-4b.jpg';
import service4d from '../assets/service-4d.jpg';

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const projects = [
    {
      title: 'Veloura E-commerce',
      description: 'A modern e-commerce platform with elegant design and seamless user experience for online shopping.',
      image: service1c, // Use imported image
      tags: ['Web Design', 'E-commerce', 'Figma', 'UI/UX'],
      category: 'Web Design',
      icon: Palette,
      link: 'https://www.behance.net/gallery/212698409/Veloura-Web-Design-Figma'
    },
    {
      title: 'ORO Dashboard with Roo AI',
      description: 'An intelligent dashboard featuring AI integration for enhanced data visualization and user interaction.',
      image: service2b, // Use imported image
      tags: ['React', 'AI Integration', 'Dashboard', 'TypeScript'],
      category: 'Frontend Development',
      icon: Monitor,
      link: 'https://orowonder.vercel.app/'
    },
    {
      title: 'Buenas Coffee',
      description: 'A warm and inviting landing page design for a coffee shop with rich visuals and modern aesthetics.',
      image: service1b, // Use imported image
      tags: ['Landing Page', 'Web Design', 'Branding', 'UI/UX'],
      category: 'Web Design',
      icon: Palette,
      link: 'https://www.behance.net/gallery/183390349/Buenas-Coffee-II-Landing-Page'
    },
    {
      title: 'Car Rental PH',
      description: 'A comprehensive car rental platform with booking system and vehicle management features.',
      image: service2a, // Use imported image
      tags: ['React', 'Booking System', 'Responsive', 'JavaScript'],
      category: 'Frontend Development',
      icon: Monitor,
      link: 'https://car-rental-alpha-bice.vercel.app/'
    },
    {
      title: 'Hyde Landing Page',
      description: 'An innovative online learning platform interface with clean design and intuitive user experience.',
      image: service1a, // Use imported image
      tags: ['UI Design', 'Education', 'Landing Page', 'UX'],
      category: 'Web Design',
      icon: Palette,
      link: 'https://www.behance.net/gallery/186754327/Hyde-Online-Learning-Platform-UI-Design'
    },
    {
      title: 'ORO Landing Page',
      description: 'A sleek and modern landing page with compelling design elements and clear call-to-actions.',
      image: service2c, // Use imported image
      tags: ['React', 'Landing Page', 'Modern Design', 'Responsive'],
      category: 'Frontend Development',
      icon: Monitor,
      link: 'https://react-landing-page-or-ov2.vercel.app/'
    },
    {
      title: 'OFBank Mobile',
      description: 'A comprehensive mobile banking app redesign focusing on user experience and financial accessibility.',
      image: service3a, // Use imported image
      tags: ['Mobile App', 'Banking', 'UI/UX', 'Redesign'],
      category: 'UI/UX Design',
      icon: Smartphone,
      link: 'https://www.behance.net/gallery/180193513/OFBank-Mobile-App-Redesign'
    },
    {
      title: 'Logo Design',
      description: 'Professional brand identity and logo design services with creative and memorable visual solutions.',
      image: service4a, // Use imported image
      tags: ['Branding', 'Logo Design', 'Identity', 'Creative'],
      category: 'Graphic Design',
      icon: Palette,
      link: 'https://www.behance.net/gallery/181927731/Team-LAU-Logo-Design-Team-T-shirt-Design'
    },
    {
      title: 'Travelista',
      description: 'A travel platform UI design with immersive visuals and user-friendly navigation for travel enthusiasts.',
      image: service3b, // Use imported image
      tags: ['Travel', 'UI Design', 'Web Design', 'UX'],
      category: 'UI/UX Design',
      icon: Globe,
      link: 'https://www.behance.net/gallery/181942299/Travelista-UI-Design-Web-Design'
    },
    {
      title: 'Poster Design',
      description: 'Eye-catching poster designs for various campaigns and events with strong visual impact.',
      image: service4b, // Use imported image
      tags: ['Poster', 'Print Design', 'Marketing', 'Visual Design'],
      category: 'Graphic Design',
      icon: Palette,
      link: 'https://www.behance.net/gallery/185524145/Hiring-Poster-Design'
    },
    {
      title: 'Banner Design',
      description: 'Professional banner designs for digital marketing campaigns with compelling visual elements.',
      image: service4d, // Use imported image
      tags: ['Banner', 'Digital Marketing', 'Advertising', 'Design'],
      category: 'Graphic Design',
      icon: Palette,
      link: 'https://www.behance.net/gallery/211765299/Sample-Banner-Design'
    }
  ];

  const displayedProjects = showAllProjects ? projects : projects.slice(0, 3);

  const toggleShowAllProjects = () => {
    setShowAllProjects(!showAllProjects);
  };

  return (
    <section ref={sectionRef} id="projects" className="py-20 relative bg-gray-50">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-emerald-700 to-green-700 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A showcase of my recent work spanning web applications, mobile apps, and digital experiences. 
            Each project represents a unique challenge and creative solution.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mx-4 sm:mx-6 lg:mx-8">
          {displayedProjects.map((project, index) => (
            <div 
              key={`project-${index}`}
              className={`group bg-white border border-gray-200 cursor-pointer rounded-xl overflow-hidden hover:border-green-300 hover:shadow-xl hover:shadow-green-100 transition-all duration-500 transform hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              } ${
                index >= 3 && showAllProjects ? 'animate-fadeInUp' : ''
              }`}
              style={{ 
                transitionDelay: index < 3 ? `${index * 100}ms` : showAllProjects ? `${(index - 3) * 100 + 300}ms` : '0ms'
              }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2">
                  <project.icon className="w-5 h-5 text-green-600" />
                </div>
                <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/90 backdrop-blur-sm text-gray-900 p-2 rounded-lg hover:bg-green-500 hover:text-white transition-colors duration-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">
                    {project.category}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-green-100 hover:text-green-700 transition-colors duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`text-center mt-12 transition-all duration-1000 delay-500 px-6 sm:px-8 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <button 
            onClick={toggleShowAllProjects}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 inline-flex items-center space-x-2"
          >
            <span>{showAllProjects ? 'Show Less Projects' : 'View All Projects'}</span>
            {showAllProjects ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Projects;