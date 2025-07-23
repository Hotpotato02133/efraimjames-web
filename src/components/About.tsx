import React, { useEffect, useRef, useState } from 'react';
import { Palette, Code2, Lightbulb, Users, Sparkles, Award } from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
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

  const features = [
    {
      icon: Palette,
      title: 'Creative Design',
      description: 'Transforming ideas into visually stunning and user-friendly interfaces',
      gradient: 'from-pink-500 to-rose-500',
      iconBg: 'bg-gradient-to-r from-pink-500 to-rose-500',
      accent: 'pink'
    },
    {
      icon: Code2,
      title: 'Clean Code',
      description: 'Writing semantic, maintainable code that follows best practices',
      gradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      accent: 'blue'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Staying ahead of trends and implementing cutting-edge solutions',
      gradient: 'from-amber-500 to-orange-500',
      iconBg: 'bg-gradient-to-r from-amber-500 to-orange-500',
      accent: 'amber'
    },
    {
      icon: Users,
      title: 'User-Focused',
      description: 'Designing with the end user in mind for optimal experiences',
      gradient: 'from-emerald-500 to-green-500',
      iconBg: 'bg-gradient-to-r from-emerald-500 to-green-500',
      accent: 'emerald'
    }
  ];

  return (
    <section ref={sectionRef} id="about" className="py-20 relative bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 overflow-hidden">
      {/* Simple Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-md border border-emerald-200/50 rounded-full px-6 py-3 mb-8 shadow-lg">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700 font-medium text-sm tracking-wide">Get to know me</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-emerald-700 to-green-600 bg-clip-text text-transparent">
            About Me
          </h2>
        </div>

        {/* Static Journey Section */}
        <div className="relative bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl mx-4 sm:mx-6 lg:mx-8">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-blue-50/30 rounded-3xl"></div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start relative z-10">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-emerald-100/80 rounded-full px-4 py-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-medium text-sm">My Journey</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Crafting Digital Excellence Since 2019
              </h3>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  Starting as a self-taught designer, I've evolved into a full-stack creative professional 
                  who bridges the gap between design and development. My work spans from brand identity 
                  to complex web applications.
                </p>
                <p className="text-lg">
                  I believe great design is not just about how it looks, but how it works. Every pixel 
                  has a purpose, and every interaction should feel natural and delightful.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {['UI/UX', 'Frontend Development', 'Brand Identity', 'Graphic Design'].map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Simple Feature Cards with Basic Animations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`group relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl p-5 hover:shadow-lg transition-all duration-300 ease-out cursor-pointer transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Simple hover glow */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 shadow-md`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;