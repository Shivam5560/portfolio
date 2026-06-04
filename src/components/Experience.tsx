import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Reveal from "./Reveal";
import { Briefcase, Calendar, Award, Target, Rocket } from "lucide-react";

interface ExperienceItem {
  period: string;
  title: string;
  company: string;
  bullets: string[];
  tags: string[];
  kpis: { label: string; value: string; desc: string; icon: React.ComponentType<any> }[];
}

const experiences: ExperienceItem[] = [
  {
    period: "Aug 2024 — Present",
    title: "Associate Software Engineer",
    company: "Nomura Research Institute & FT",
    bullets: [
      "Architected a <strong class='text-text font-semibold'>report microservice</strong> as a pluggable JAR framework enabling remote app integration and centralized report execution.",
      "Designed a <strong class='text-text font-semibold'>Camunda Saga-based workflow service</strong> for authorization flows on Java 21 & Spring Boot, orchestrating complex distributed transactions.",
      "Built a <strong class='text-text font-semibold'>Python AI microservice</strong> featuring multi-tenant RAG, query decomposition, semantic caching, and Langfuse observability.",
      "Developed an <strong class='text-text font-semibold'>LLM-based ATS recruiter agent</strong> using LlamaIndex, Cohere embeddings, and Pinecone, achieving <strong class='text-accent font-semibold'>90%+ resume match quality</strong>."
    ],
    tags: ["Java 21", "Spring Boot", "Python", "LlamaIndex", "Pinecone", "Camunda", "Langfuse"],
    kpis: [
      { label: "Resume Matching", value: "90%+", desc: "ATS engine quality score", icon: Target },
      { label: "Architecture", value: "Saga", desc: "Camunda transactions orchestrator", icon: Rocket },
      { label: "Tech Stack", value: "Java+Py", desc: "Dual microservices ecosystem", icon: Award },
    ]
  },
  {
    period: "Nov 2023 — Jun 2024",
    title: "Data Scientist",
    company: "Omdena",
    bullets: [
      "Led an international team of <strong class='text-text font-semibold'>10 ML engineers</strong> across data preprocessing, CNN training, and deployment.",
      "Conducted specialized <strong class='text-text font-semibold'>Pandas & NumPy workshops</strong> that accelerated model delivery by 35% across the cohort.",
      "Developed image classification models for <strong class='text-text font-semibold'>Crop Disease Detection</strong> and epidemiological models for <strong class='text-text font-semibold'>COVID-19 trends</strong>."
    ],
    tags: ["Python", "TensorFlow", "Scikit-Learn", "Computer Vision", "Team Leadership"],
    kpis: [
      { label: "Subgroup Lead", value: "10 Eng", desc: "Cross-border ML engineers lead", icon: Target },
      { label: "Deployments", value: "2 Projects", desc: "Zambia COVID & Kenya Crop models", icon: Rocket },
      { label: "Model Delivery", value: "+35%", desc: "Training speedup from workshops", icon: Award },
    ]
  }
];

function CornerCrosshairs() {
  return (
    <>
      <span className="absolute top-2 left-2 font-mono text-[9px] text-accent/30 select-none pointer-events-none">+</span>
      <span className="absolute top-2 right-2 font-mono text-[9px] text-accent/30 select-none pointer-events-none">+</span>
      <span className="absolute bottom-2 left-2 font-mono text-[9px] text-accent/30 select-none pointer-events-none">+</span>
      <span className="absolute bottom-2 right-2 font-mono text-[9px] text-accent/30 select-none pointer-events-none">+</span>
    </>
  );
}

export default function Experience() {
  const [activeTab, setActiveTab] = useState(0);
  const [spotlightCoords, setSpotlightCoords] = useState({ x: 0, y: 0 });

  return (
    <section id="experience" className="relative px-6 py-32 overflow-hidden">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="section-label mb-3 block">Experience</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mb-12 font-serif text-3xl font-extrabold sm:text-4xl gradient-text">
            Technical Career Dashboard
          </h2>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Left Column - Tab Selector Buttons */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-none">
            {experiences.map((exp, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`relative w-full text-left px-5 py-4 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all shrink-0 border cursor-pointer ${
                  activeTab === idx
                    ? "border-accent/20 bg-accent-glow text-accent"
                    : "border-white/5 bg-surface/50 text-text-dim hover:text-text-muted hover:border-white/10"
                }`}
              >
                {activeTab === idx && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute inset-y-0 left-0 w-1 bg-accent rounded-l-xl hidden lg:block"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {exp.company}
              </button>
            ))}
          </div>

          {/* Right Column - Sliding Info Panel & Metrics */}
          <div className="lg:col-span-8 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="relative group overflow-hidden rounded-2xl glass-card p-6 md:p-8"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setSpotlightCoords({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                  });
                }}
              >
                <CornerCrosshairs />
                
                {/* Spotlight overlay */}
                <div 
                  className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                  style={{
                    background: `radial-gradient(350px circle at ${spotlightCoords.x}px ${spotlightCoords.y}px, rgba(0, 229, 117, 0.07), transparent 85%)`
                  }}
                />
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5 mb-6">
                  <div>
                    <h3 className="font-sans text-xl font-bold text-text flex items-center gap-2">
                      <Briefcase size={18} className="text-accent" />
                      {experiences[activeTab].title}
                    </h3>
                    <p className="text-sm font-semibold text-cyan mt-1">
                      {experiences[activeTab].company}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs text-text-muted bg-surface/80 border border-white/5 rounded-lg px-3.5 py-1.5 w-fit">
                    <Calendar size={12} className="text-accent" />
                    {experiences[activeTab].period}
                  </div>
                </div>

                {/* KPI Metrics Dashboard Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                  {experiences[activeTab].kpis.map((kpi, idx) => {
                    const KpiIcon = kpi.icon;
                    return (
                      <div key={idx} className="rounded-xl border border-white/5 bg-[#111a16]/40 p-4 flex flex-col justify-between shadow-inner">
                        <div className="flex items-center justify-between text-text-dim mb-2">
                          <span className="font-mono text-[9px] tracking-wider uppercase">{kpi.label}</span>
                          <KpiIcon size={12} className="text-cyan animate-pulse" />
                        </div>
                        <div>
                          <div className="font-sans font-bold text-lg text-accent leading-none">{kpi.value}</div>
                          <div className="text-[10px] text-text-muted mt-1 leading-snug">{kpi.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Accomplishments */}
                <div className="mb-8">
                  <h4 className="font-mono text-[10px] text-text-dim tracking-widest uppercase mb-4">// Core Achievements</h4>
                  <ul className="space-y-3.5">
                    {experiences[activeTab].bullets.map((bullet, idx) => (
                      <li key={idx} className="flex gap-3 text-sm leading-relaxed text-text-muted">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                        <span dangerouslySetInnerHTML={{ __html: bullet }} />
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="font-mono text-[10px] text-text-dim tracking-widest uppercase mb-3">// Environment</h4>
                  <div className="flex flex-wrap gap-2">
                    {experiences[activeTab].tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-white/5 bg-surface-light px-2.5 py-1 text-xs font-mono text-text-dim"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
