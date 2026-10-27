import { useEffect, useState } from "react";
import { ArrowDown, Download, ArrowRight } from "lucide-react";
import {
  FaReact,
  FaFigma,
  FaHtml5,
  FaCss3Alt,
  FaGitAlt,
} from "react-icons/fa";
import {
  SiTypescript,
  SiJavascript,
  SiNextdotjs,
  SiTailwindcss,
  SiMysql,
  SiSupabase,
  SiClerk,
} from "react-icons/si";
import InfiniteMarquee from "./InfiniteMarquee";
import heroBg from "../assets/hero-bg.png";
import resumePdf from "../assets/CV-EFRAIM-JAMES-2026.pdf";
import jamesPhoto from "../assets/2X2JAMES.jpg";

const ConvexIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M15.09 18.916c3.488-.387 6.776-2.246 8.586-5.348-.857 7.673-9.247 12.522-16.095 9.545a3.47 3.47 0 0 1-1.547-1.314c-1.539-2.417-2.044-5.492-1.318-8.282 2.077 3.584 6.3 5.78 10.374 5.399m-10.501-7.65c-1.414 3.266-1.475 7.092.258 10.24-6.1-4.59-6.033-14.41-.074-18.953a3.44 3.44 0 0 1 1.893-.707c2.825-.15 5.695.942 7.708 2.977-4.09.04-8.073 2.66-9.785 6.442m11.757-5.437C14.283 2.951 11.053.992 7.515.933c6.84-3.105 15.253 1.929 16.17 9.37a3.6 3.6 0 0 1-.334 2.02c-1.278 2.594-3.647 4.607-6.416 5.352 2.029-3.763 1.778-8.36-.589-11.847" />
  </svg>
);

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [philippineTime, setPhilippineTime] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Live Philippine Time (Asia/Manila)
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const timeString = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Manila",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(now);
        setPhilippineTime(timeString);
      } catch {
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const manilaTime = new Date(utc + 3600000 * 8);
        let hours = manilaTime.getHours();
        const minutes = manilaTime.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        const minutesStr = minutes < 10 ? "0" + minutes : minutes;
        setPhilippineTime(`${hours}:${minutesStr} ${ampm}`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
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
      const response = await fetch(resumePdf);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "CV-EFRAIM-JAMES-2026.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(resumePdf, "_blank");
    }
  };

  // Toolkit with logos - Optimized for white background
  const techStack = [
    { name: "React", icon: FaReact, color: "text-blue-600" },
    { name: "Next.js", icon: SiNextdotjs, color: "text-slate-900" },
    { name: "TypeScript", icon: SiTypescript, color: "text-blue-700" },
    { name: "JavaScript", icon: SiJavascript, color: "text-yellow-500" },
    { name: "Tailwind CSS", icon: SiTailwindcss, color: "text-cyan-600" },
    { name: "HTML5", icon: FaHtml5, color: "text-orange-600" },
    { name: "CSS3", icon: FaCss3Alt, color: "text-blue-600" },
    { name: "Git", icon: FaGitAlt, color: "text-[#F05032]" },
    { name: "Supabase", icon: SiSupabase, color: "text-[#3FCF8E]" },
    { name: "Convex", icon: ConvexIcon, color: "text-[#EE342F]" },
    { name: "MySQL", icon: SiMysql, color: "text-[#4479A1]" },
    { name: "Clerk", icon: SiClerk, color: "text-[#6C47FF]" },
    { name: "Figma", icon: FaFigma, color: "text-purple-600" },
  ];

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center relative overflow-hidden pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-16"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Background ambient lighting and pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle Dot Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>

        {/* Soft ambient gradients */}
        <div className="absolute top-0 right-0 w-[32rem] h-[32rem] bg-emerald-100/60 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4"></div>
        <div className="absolute bottom-10 left-0 w-[30rem] h-[30rem] bg-teal-50/70 rounded-full blur-3xl translate-y-1/4 -translate-x-1/3"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto flex flex-col items-center">
        {/* Two-Column Hero: Left Content, Right Photo with balanced breathing room */}
        <div className="w-full max-w-5xl lg:max-w-[1100px] xl:max-w-[1180px] mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 xl:gap-24 2xl:gap-28">

            {/* Left Column: Content */}
            <div className="flex-1 max-w-xl flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Top badge */}
              <div
                className={`mb-5 transition-all duration-1000 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-100 text-sm font-medium text-slate-600 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Available for Work
                </span>
              </div>

              {/* Main Heading */}
              <div
                className={`mb-6 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem] font-bold tracking-tight text-slate-900 leading-[1.15] mb-5">
                  Frontend{" "}
                  <span className="inline-block pb-3 pr-2 -mb-3 font-bold italic bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                    Engineer
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal sm:font-medium">
                  Three years of building fast and responsive web apps with React, and NextJS,
                  combining strong UI/UX with AI-driven development.
                </p>
              </div>

              {/* CTA Buttons */}
              <div
                className={`flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center lg:justify-start transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
              >
                <button
                  onClick={handleScrollToProjects}
                  className="group relative px-8 py-3.5 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/25 hover:-translate-y-0.5 w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  View My Work
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={handleDownloadResume}
                  className="group px-8 py-3.5 sm:py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </button>
              </div>
            </div>

            {/* Right Column: Photo with Pill Overlay */}
            <div
              className={`w-full max-w-xs sm:max-w-sm lg:w-[350px] xl:w-[370px] flex-shrink-0 flex justify-center transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              <div className="relative w-full">
                {/* Soft decorative glow behind photo */}
                <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-tr from-emerald-500/25 via-teal-400/20 to-sky-400/15 rounded-[2.5rem] blur-2xl -z-10 opacity-70"></div>

                {/* Photo Frame Container */}
                <div className="relative rounded-[2rem] sm:rounded-[2.3rem] p-2 sm:p-2.5 bg-gradient-to-b from-white/95 via-white/80 to-white/60 border border-white/80 shadow-2xl shadow-slate-900/10 backdrop-blur-md">
                  <div className="relative rounded-[1.6rem] sm:rounded-[1.9rem] overflow-hidden aspect-[4/5] bg-gradient-to-b from-slate-50 to-slate-100">
                    <img
                      src={jamesPhoto}
                      alt="Efraim James"
                      className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-[1.03]"
                    />

                    {/* Component from reference image: Dark pill overlay */}
                    <div className="absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-4 z-10">
                      <div className="bg-[#18181b]/95 backdrop-blur-md rounded-full border border-white/10 shadow-2xl py-2.5 px-4 sm:py-3 sm:px-4.5 flex items-center justify-between gap-2.5 transition-all duration-300 hover:border-white/20">
                        <span className="text-xs sm:text-[13px] font-semibold text-white tracking-tight whitespace-nowrap">
                          Frontend Engineer
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-zinc-400 font-medium whitespace-nowrap">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Philippines</span>
                          <span className="text-zinc-600">·</span>
                          <span className="text-zinc-200 tabular-nums">
                            {philippineTime || "8:36 PM"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Tech Stack Section (Full Width Toolkit) */}
        <div
          className={`w-full mt-12 sm:mt-14 lg:mt-16 transition-all duration-1000 delay-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6 text-center">
            My Tech Stacks
          </p>

          <div className="relative">
            {/* Fade edges for marquee */}
            <div className="absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-transparent to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-transparent to-transparent z-10 pointer-events-none"></div>

            <InfiniteMarquee speed={80} direction="left" className="py-2">
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

      {/* Scroll Indicator */}
      <div
        className={`hidden sm:block absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
      >
        <button
          onClick={handleScrollToProjects}
          className="p-2 text-slate-400 hover:text-emerald-600 transition-colors animate-bounce"
          aria-label="Scroll down"
        >
          <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
