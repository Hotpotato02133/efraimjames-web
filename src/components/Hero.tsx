import React, { useEffect, useState } from "react";
import { ArrowDown, Download, ArrowRight } from "lucide-react";
import {
  FaReact,
  FaGitAlt,
  FaFigma,
  FaJs,
  FaHtml5,
  FaCss3Alt,
  FaSketch,
} from "react-icons/fa";
import {
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiFramer,
  SiSupabase,
  SiMysql,
  SiCanva,
} from "react-icons/si";
import InfiniteMarquee from "./InfiniteMarquee";
import heroBg from "../assets/hero-bg.png";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleScrollToProjects = () => {
    const element = document.querySelector("#projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Resume download function with mobile support
  const handleDownloadResume = async () => {
    try {
      // Fetch the PDF as a blob
      const response = await fetch('/CV-EFRAIM-JAMES-TALUCOD.pdf');
      const blob = await response.blob();
      
      // Create a blob URL
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'CV-EFRAIM-JAMES-TALUCOD.pdf';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open('/CV-EFRAIM-JAMES-TALUCOD.pdf', '_blank');
    }
  };

  // Tech stack with logos - Optimized for white background
  const techStack = [
    { name: "React", icon: FaReact, color: "text-blue-600" },
    { name: "Figma", icon: FaFigma, color: "text-purple-600" },
    { name: "TypeScript", icon: SiTypescript, color: "text-blue-700" },
    { name: "Next.js", icon: SiNextdotjs, color: "text-slate-900" },
    { name: "Tailwind CSS", icon: SiTailwindcss, color: "text-cyan-600" },
    { name: "Framer Motion", icon: SiFramer, color: "text-pink-600" },
    { name: "Supabase", icon: SiSupabase, color: "text-emerald-600" },
    { name: "MySQL", icon: SiMysql, color: "text-blue-700" },
    { name: "Canva", icon: SiCanva, color: "text-blue-600" },
    { name: "Git", icon: FaGitAlt, color: "text-orange-600" },
    { name: "JavaScript", icon: FaJs, color: "text-yellow-500" },
    { name: "HTML5", icon: FaHtml5, color: "text-orange-600" },
    { name: "CSS3", icon: FaCss3Alt, color: "text-blue-600" },
    { name: "Sketch", icon: FaSketch, color: "text-amber-600" },
  ];

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-32 md:pt-48 pb-12 sm:pb-16"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Clean background elements - Overlay for better text readability if needed */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle Dot Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>

        {/* Soft ambient gradients */}
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-emerald-50/80 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-blue-50/80 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl w-full">
        <div className="flex flex-col items-center text-center">
          
          {/* Top badge */}
          <div
            className={`transition-all duration-1000 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
          </div>

          {/* Main Heading */}
          <div
            className={`max-w-4xl mx-auto mb-8 transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
           <h1 className="text-6xl sm:text-6xl md:text-6xl lg:text-9xl font-medium tracking-[-1px] md:tracking-[-2px] lg:tracking-[-4px] text-slate-900 leading-[1.1] mb-6">
              Web Designer
              <span className="block mt-2 font-medium font-jakarta italic bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent tracking-[-1px] md:tracking-[-2px] lg:tracking-[-4px]">
                    & Developer
              </span>
          </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
              Premium Web Design, Development, and SEO services to help your business stand out.
            </p>
          </div>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center items-center mb-16 transition-all duration-1000 delay-400 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <button
              onClick={handleScrollToProjects}
              className="group relative px-8 py-4 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              View My Work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleDownloadResume}
              className="group px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 shadow-sm hover:shadow-md w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </button>
          </div>

          {/* Tech Stack Section */}
          <div
            className={`w-full transition-all duration-1000 delay-600 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">
              My Tech Stack
            </p>
            
            <div className="relative">
              {/* Fade edges for marquee */}
              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-transparent to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-transparent to-transparent z-10 pointer-events-none"></div>
              
              <InfiniteMarquee speed={80} direction="left" className="py-4">
                {techStack.map((tech, index) => {
                  const IconComponent = tech.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 px-6 py-3 rounded-xl shadow-sm mx-3 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="p-2 rounded-lg group-hover:bg-emerald-50 transition-colors">
                        <IconComponent className={`w-6 h-6 ${tech.color}`} />
                      </div>
                      <span className="font-semibold text-slate-700">
                        {tech.name}
                      </span>
                    </div>
                  );
                })}
              </InfiniteMarquee>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <button
          onClick={handleScrollToProjects}
          className="p-2 text-slate-400 hover:text-emerald-600 transition-colors animate-bounce"
          aria-label="Scroll down"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
