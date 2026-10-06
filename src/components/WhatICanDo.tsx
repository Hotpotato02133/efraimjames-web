import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  LayoutDashboard,
  PenTool,
  Plug,
  Gauge,
  Sparkles,
  Check,
} from "lucide-react";
import { SiSupabase, SiClerk, SiMysql } from "react-icons/si";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";

interface Capability {
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
  visual: ReactNode;
  cta: string;
  target: string;
  className?: string;
}

/* ---------- Card visuals ---------- */

const CodeVisual = () => {
  const rows: ReactNode[] = [
    <>
      <span className="text-purple-600">interface</span>{" "}
      <span className="text-emerald-700">CardProps</span> {"{"}
    </>,
    <>
      {"  "}title: <span className="text-blue-600">string</span>;
    </>,
    <>
      {"  "}onSelect: () <span className="text-purple-600">=&gt;</span>{" "}
      <span className="text-blue-600">void</span>;
    </>,
    <>{"}"}</>,
    <>
      <span className="text-purple-600">export const</span>{" "}
      <span className="text-emerald-700">Card</span> = ({"{"} title {"}"}:{" "}
      <span className="text-emerald-700">CardProps</span>) =&gt; (
    </>,
    <>
      {"  "}&lt;<span className="text-rose-600">button</span>{" "}
      <span className="text-amber-600">className</span>=
      <span className="text-sky-600">"rounded-2xl"</span>&gt;
    </>,
  ];

  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6 font-mono text-[11px] sm:text-sm leading-7 text-slate-600 shadow-inner">
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        <span className="ml-3 text-slate-400">Card.tsx</span>
      </div>
      <div className="overflow-hidden whitespace-pre">
        {rows.map((row, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.4 }}
          >
            {row}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ChartVisual = () => {
  const bars = [38, 62, 48, 80, 58, 92, 70];
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {["Agency", "Client", "Creator"].map((role, i) => (
            <span
              key={role}
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                i === 0
                  ? "bg-emerald-500 text-white"
                  : "bg-white text-slate-500 border border-slate-200"
              }`}
            >
              {role}
            </span>
          ))}
        </div>
      </div>
      <div className="flex h-24 items-end gap-2">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.7, ease: "easeOut" }}
            className="flex-1 rounded-t-md bg-gradient-to-t from-emerald-500 to-teal-300"
          />
        ))}
      </div>
    </div>
  );
};

const DesignVisual = () => (
  <div className="flex h-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <div className="w-24 rounded-xl border border-dashed border-purple-300 bg-white p-2.5">
      <div className="mb-2 text-[9px] font-semibold text-purple-500">Figma</div>
      <div className="mb-1.5 h-10 rounded-md bg-purple-100" />
      <div className="mb-1 h-1.5 w-3/4 rounded bg-slate-200" />
      <div className="h-1.5 w-1/2 rounded bg-slate-200" />
    </div>
    <motion.div
      animate={{ x: [0, 5, 0] }}
      transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
      className="text-emerald-500"
    >
      →
    </motion.div>
    <div className="w-24 rounded-xl border border-emerald-200 bg-white p-2.5 shadow-sm">
      <div className="mb-2 text-[9px] font-semibold text-emerald-600">&lt;Card /&gt;</div>
      <div className="mb-1.5 h-10 rounded-md bg-emerald-100" />
      <div className="mb-1 h-1.5 w-3/4 rounded bg-slate-200" />
      <div className="h-1.5 w-1/2 rounded bg-slate-200" />
    </div>
  </div>
);

const IntegrationVisual = () => {
  const items = [
    { name: "REST APIs", icon: Plug, color: "text-slate-700" },
    { name: "Supabase", icon: SiSupabase, color: "text-[#3FCF8E]" },
    { name: "Clerk", icon: SiClerk, color: "text-[#6C47FF]" },
    { name: "MySQL", icon: SiMysql, color: "text-[#4479A1]" },
  ];
  return (
    <div className="grid h-full grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-4 lg:grid-cols-4">
      {items.map(({ name, icon: Icon, color }, i) => (
        <motion.div
          key={name}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + i * 0.1 }}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
        >
          <Icon className={`h-6 w-6 ${color}`} />
          <span className="text-xs font-semibold text-slate-600">{name}</span>
        </motion.div>
      ))}
    </div>
  );
};

const QualityVisual = () => {
  const checks = [
    "Semantic HTML & ARIA",
    "Keyboard navigation",
    "Lazy loading & code splitting",
    "Mobile-first responsive",
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      {checks.map((label, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + i * 0.12 }}
          className="flex items-center gap-2.5 text-sm font-medium text-slate-700"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          {label}
        </motion.div>
      ))}
    </div>
  );
};

const AIVisual = () => (
  <div className="h-full rounded-2xl border border-slate-800 bg-slate-900 p-4 font-mono text-[11px] sm:text-xs leading-6 text-slate-300">
    {[
      { p: "$", t: "claude", c: "text-emerald-400" },
      { p: ">", t: "build the analytics table", c: "text-slate-300" },
      { p: "✓", t: "scaffolded component", c: "text-emerald-400" },
      { p: "✓", t: "reviewed & refined by me", c: "text-teal-300" },
    ].map((l, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 + i * 0.35 }}
        className="flex gap-2"
      >
        <span className={l.c}>{l.p}</span>
        <span className={i < 2 ? "text-slate-200" : l.c}>{l.t}</span>
      </motion.div>
    ))}
    <motion.span
      animate={{ opacity: [1, 0, 1] }}
      transition={{ repeat: Infinity, duration: 1 }}
      className="inline-block h-3.5 w-1.5 translate-y-0.5 bg-emerald-400"
    />
  </div>
);

/* ---------- Section ---------- */

const WhatICanDo = () => {
  const capabilities: Capability[] = [
    {
      number: "01",
      title: "Frontend Engineering",
      description:
        "Fast, accessible, type-safe interfaces with React, Next.js and TypeScript — component architecture that stays maintainable as your product grows.",
      icon: <Code2 className="h-6 w-6" />,
      visual: <CodeVisual />,
      cta: "See my work",
      target: "#projects",
      className: "lg:col-span-2",
    },
    {
      number: "02",
      title: "Dashboards & Data UIs",
      description:
        "Analytics views, charts and role-based interfaces, like the platforms I shipped at Social Intelligence Lab.",
      icon: <LayoutDashboard className="h-6 w-6" />,
      visual: <ChartVisual />,
      cta: "See my experience",
      target: "#work-history",
    },
    {
      number: "03",
      title: "Design-to-Code",
      description:
        "A UI/UX background means Figma designs turn into pixel-accurate, reusable components and design-system patterns.",
      icon: <PenTool className="h-6 w-6" />,
      visual: <DesignVisual />,
      cta: "About me",
      target: "#about",
    },
    {
      number: "04",
      title: "API & Backend Integration",
      description:
        "Wiring the frontend to real data: REST APIs, authentication flows and managed backends such as Supabase, Convex and Clerk.",
      icon: <Plug className="h-6 w-6" />,
      visual: <IntegrationVisual />,
      cta: "See my experience",
      target: "#work-history",
      className: "lg:col-span-2",
    },
    {
      number: "05",
      title: "Performance & Accessibility",
      description:
        "Responsive, keyboard-friendly pages that load quickly and work for everyone, on every screen size.",
      icon: <Gauge className="h-6 w-6" />,
      visual: <QualityVisual />,
      cta: "See my work",
      target: "#projects",
    },
    {
      number: "06",
      title: "AI-Assisted Development",
      description:
        "I use Claude Code and Codex to ship faster, then review, test and polish everything by hand so quality never slips.",
      icon: <Sparkles className="h-6 w-6" />,
      visual: <AIVisual />,
      cta: "Let's talk",
      target: "#contact",
      className: "lg:col-span-2",
    },
  ];

  const handleScrollTo = (target: string) => {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="what-i-can-do" className="py-24 lg:py-32 bg-stone-50 relative overflow-hidden">
      {/* Aceternity-style faint grid backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-size:40px_40px] [background-image:linear-gradient(to_right,#e7e5e4_1px,transparent_1px),linear-gradient(to_bottom,#e7e5e4_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] opacity-60"
      />

      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-emerald-700 to-green-700 bg-clip-text text-transparent px-2">
            What I Can Do
          </h2>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
            Frontend engineering from first component to production — with the design eye to make it feel right.
          </p>
        </motion.div>

        <BentoGrid>
          {capabilities.map((item, index) => (
            <BentoGridItem
              key={item.number}
              index={index}
              number={item.number}
              title={item.title}
              description={item.description}
              icon={item.icon}
              visual={item.visual}
              cta={item.cta}
              onCtaClick={() => handleScrollTo(item.target)}
              className={item.className}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
};

export default WhatICanDo;
