import React, { useEffect, useRef, useState } from "react";
import { Heart, Palette, User } from "lucide-react";

const Skills = () => {
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

  const capabilities = [
    {
      emoji: "😍",
      title: "UI/UX Design",
      description: "Creating intuitive and engaging user experiences",
      skills: [
        "User Interface Design",
        "User Experience Design",
        "Usability Testing",
        "Wireframing",
        "Prototyping",
      ],
    },
    {
      emoji: "🎨",
      title: "Graphic Design",
      description: "Visual design and brand identity solutions",
      skills: [
        "Branding & Identity",
        "Logo Design",
        "Mockups & Prototypes",
        "Illustrations",
        "Print Design",
      ],
    },
    {
      emoji: "👨‍💻",
      title: "Development",
      description: "Building responsive web and mobile applications",
      skills: [
        "Front-end development",
        "Web & Mobile Development",
        "Responsive Design",
        "React applications",
        "Platform solutions",
      ],
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="py-20 relative bg-gradient-to-br from-slate-50 via-white to-gray-50 overflow-hidden"
    >
      {/* Simple background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-green-100/30 to-emerald-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-emerald-700 to-green-700 bg-clip-text text-transparent">
            Capabilities
          </h2>
        </div>

        {/* Capabilities Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-16">
            {capabilities.map((capability, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Emoji Icon */}
                <div className="text-6xl mb-6 transform hover:scale-110 transition-transform duration-300">
                  {capability.emoji}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {capability.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 font-medium">
                  {capability.description}
                </p>

                {/* Skills List */}
                <div className="space-y-2">
                  {capability.skills.map((skill, skillIndex) => (
                    <div
                      key={skillIndex}
                      className="text-gray-600 hover:text-gray-800 transition-colors duration-200 py-1"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
