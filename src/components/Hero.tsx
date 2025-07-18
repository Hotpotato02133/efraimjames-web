import React, { useEffect, useState } from 'react';
import { ArrowDown, Download, ArrowRight } from 'lucide-react';
import { 
  FaReact, 
  FaNodeJs, 
  FaGitAlt, 
  FaFigma, 
  FaJs,
  FaHtml5,
  FaCss3Alt
} from 'react-icons/fa';
import { 
  SiTypescript, 
  SiNextdotjs, 
  SiTailwindcss, 
  SiFramer,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiAdobexd
} from 'react-icons/si';
import InfiniteMarquee from './InfiniteMarquee';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleScrollToProjects = () => {
    const element = document.querySelector('#projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Tech stack with logos
  const techStack = [
    { name: 'React', icon: FaReact, color: 'text-blue-400' },
    { name: 'TypeScript', icon: SiTypescript, color: 'text-blue-500' },
    { name: 'Next.js', icon: SiNextdotjs, color: 'text-white' },
    { name: 'Tailwind CSS', icon: SiTailwindcss, color: 'text-cyan-400' },
    { name: 'Framer Motion', icon: SiFramer, color: 'text-pink-400' },
    { name: 'Node.js', icon: FaNodeJs, color: 'text-green-400' },
    { name: 'Express', icon: SiExpress, color: 'text-gray-300' },
    { name: 'MongoDB', icon: SiMongodb, color: 'text-green-400' },
    { name: 'PostgreSQL', icon: SiPostgresql, color: 'text-blue-400' },
    { name: 'Git', icon: FaGitAlt, color: 'text-orange-400' },
    { name: 'JavaScript', icon: FaJs, color: 'text-yellow-400' },
    { name: 'HTML5', icon: FaHtml5, color: 'text-orange-400' },
    { name: 'CSS3', icon: FaCss3Alt, color: 'text-blue-400' },
    { name: 'Figma', icon: FaFigma, color: 'text-purple-400' },
    { name: 'Adobe XD', icon: SiAdobexd, color: 'text-pink-400' },
    { name: 'Photoshop', icon: SiAdobephotoshop, color: 'text-blue-400' },
    { name: 'Illustrator', icon: SiAdobeillustrator, color: 'text-orange-400' }
  ];

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-black via-gray-950 to-zinc-950 transition-all duration-500 pt-16 sm:pt-20 pb-4 sm:pb-8">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/30 via-transparent to-emerald-950/20"></div>
        
        {/* Animated geometric shapes - adjusted for mobile */}
        <div className="absolute top-1/4 right-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-r from-emerald-500/15 to-green-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-r from-green-400/15 to-emerald-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Enhanced grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%2334d399%22%20fill-opacity%3D%220.05%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M0%200h40v40H0z%22/%3E%3Cpath%20d%3D%22M20%200v40M0%2020h40%22%20stroke%3D%22%2334d399%22%20stroke-width%3D%220.8%22%20stroke-opacity%3D%220.15%22/%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        {/* Enhanced central glow effect - adjusted for mobile */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] lg:w-[900px] h-[400px] sm:h-[600px] lg:h-[900px] bg-gradient-radial from-emerald-500/8 via-green-500/4 to-transparent rounded-full"></div>
        
        {/* Additional atmospheric layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-950/10 to-transparent"></div>
        
        {/* Enhanced floating particles - adjusted positions for mobile */}
        <div className="absolute top-20 left-4 sm:left-10 w-2 h-2 bg-emerald-400/40 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-8 sm:right-20 w-1 h-1 bg-green-400/50 rounded-full animate-ping delay-500"></div>
        <div className="absolute bottom-32 left-8 sm:left-20 w-1.5 h-1.5 bg-emerald-300/40 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-20 right-16 sm:right-32 w-1 h-1 bg-green-300/50 rounded-full animate-ping delay-700"></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-emerald-400/30 rounded-full animate-ping delay-300"></div>
        <div className="absolute bottom-40 right-1/3 w-1.5 h-1.5 bg-green-400/35 rounded-full animate-ping delay-900"></div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center relative z-10 max-w-5xl w-full">
        {/* Top badge */}
        <div className={`transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-full px-3 sm:px-5 py-2 mb-4 sm:mb-6 max-w-[90vw]">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-300 font-medium text-xs">
              ✨ Creative Web Designer & Developer
            </span>
          </div>
        </div>

        {/* Main content */}
        <div className={`transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight px-2 sm:px-0">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-green-300 bg-clip-text text-transparent block">
              Frontend Developer,
            </span>
            <span className="bg-gradient-to-r from-emerald-300 via-green-200 to-white bg-clip-text text-transparent block">
              Web & Graphic Designer
            </span>
          </h1>
          
          <div className="max-w-3xl mx-auto mb-6 sm:mb-8 px-2 sm:px-0">
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300/90 leading-relaxed font-light italic">
              With over 2 years plus of professional experience in crafting responsive user interfaces that drive meaningful digital experiences.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className={`flex flex-row gap-2 sm:gap-3 justify-center items-center mb-8 sm:mb-12 transition-all duration-1000 delay-400 px-2 sm:px-0 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <button
            onClick={handleScrollToProjects}
            className="group bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-4 sm:px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/25 flex items-center space-x-2 text-xs sm:text-base flex-1 sm:flex-none max-w-[140px] sm:max-w-none justify-center"
          >
            <span>Learn More</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <button className="group bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700 text-gray-200 hover:border-emerald-400 hover:bg-emerald-900/20 px-4 sm:px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center space-x-2 text-xs sm:text-base flex-1 sm:flex-none max-w-[140px] sm:max-w-none justify-center">
            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Download Resume</span>
            <span className="xs:hidden">Resume</span>
          </button>
        </div>

        {/* Scroll indicator */}
        <div className={`transition-all duration-1000 delay-600 mb-6 sm:mb-8 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <button
            onClick={handleScrollToProjects}
            className="text-emerald-400 hover:text-emerald-300 transition-colors duration-300 animate-bounce"
          >
            <ArrowDown className="w-5 h-5 mx-auto" />
          </button>
        </div>

        {/* Enhanced Infinite Marquee Section */}
        <div className={`transition-all duration-1000 delay-800 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="mb-4 sm:mb-6 px-2 sm:px-0">
            <p className="text-xs text-gray-400 font-medium tracking-wider uppercase mb-2">
              Powered by Industry-Leading Technologies
            </p>
            <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mx-auto"></div>
          </div>
          
          {/* Enhanced marquee with glowing effects */}
          <div className="overflow-hidden px-2 sm:px-0">
            <InfiniteMarquee speed={40} direction="left" className="pb-4">
              {techStack.map((tech, index) => {
                const IconComponent = tech.icon;
                return (
                  <div
                    key={index}
                    className="relative group bg-gray-800/60 backdrop-blur-md border border-gray-700/50 rounded-xl px-4 sm:px-6 py-3 sm:py-4 shadow-lg hover:shadow-xl transition-all duration-500 flex items-center space-x-2 sm:space-x-3 min-w-max hover:scale-105 hover:border-emerald-500/30 mx-2"
                  >
                    {/* Enhanced glowing border effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/0 via-emerald-400/20 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
                    <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-emerald-400/30 via-green-400/30 to-emerald-400/30 opacity-0 group-hover:opacity-100 transition-all duration-500" style={{ mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'xor' }}></div>
                    
                    {/* Content with enhanced styling */}
                    <div className="relative z-10 flex items-center space-x-2 sm:space-x-3">
                      <div className="p-1 sm:p-1.5 bg-gray-700 rounded-lg group-hover:bg-gray-600 transition-colors duration-300">
                        <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${tech.color} group-hover:scale-110 transition-transform duration-300`} />
                      </div>
                      <span className="text-gray-200 font-semibold text-xs sm:text-sm whitespace-nowrap group-hover:text-white transition-colors duration-300">
                        {tech.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </InfiniteMarquee>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;