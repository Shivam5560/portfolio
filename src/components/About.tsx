import { motion } from "framer-motion";
import Reveal from "./Reveal";
import { useState } from "react";

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

interface HighlightItemProps {
  title: string;
  desc: string;
  delay: number;
}

function HighlightCard({ title, desc, delay }: HighlightItemProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  return (
    <Reveal delay={delay}>
      <motion.div
        className="glass-card relative group overflow-hidden flex items-start gap-4 rounded-2xl p-5 border-l-4 border-l-transparent transition-all"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setCoords({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
        }}
        whileHover={{
          x: 4,
          borderLeftColor: "#00e575",
          backgroundColor: "rgba(0, 229, 117, 0.05)",
          boxShadow: "0 8px 32px rgba(0, 229, 117, 0.1)",
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <CornerCrosshairs />
        
        {/* Spotlight overlay */}
        <div 
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(150px circle at ${coords.x}px ${coords.y}px, rgba(0, 229, 117, 0.06), transparent 85%)`
          }}
        />

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-glow text-accent font-sans text-xl font-bold relative z-20">
          {title[0]}
        </div>
        <div className="relative z-20">
          <h4 className="font-semibold text-text">{title}</h4>
          <p className="text-sm text-text-dim font-mono mt-0.5">{desc}</p>
        </div>
      </motion.div>
    </Reveal>
  );
}

export default function About() {
  const [bioCoords, setBioCoords] = useState({ x: 0, y: 0 });

  return (
    <section id="about" className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="section-label mb-3 block">About</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mb-12 font-serif text-3xl font-extrabold sm:text-4xl gradient-text">
            Bridging research and engineering
          </h2>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Bio card */}
          <div className="lg:col-span-3">
            <div 
              className="glass-card relative group overflow-hidden h-full space-y-6 rounded-3xl p-8 text-text-muted md:p-10"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setBioCoords({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                });
              }}
            >
              <CornerCrosshairs />
              
              {/* Spotlight overlay */}
              <div 
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                style={{
                  background: `radial-gradient(350px circle at ${bioCoords.x}px ${bioCoords.y}px, rgba(0, 229, 117, 0.06), transparent 85%)`
                }}
              />

              <Reveal delay={0.2} className="relative z-20">
                <p className="leading-relaxed text-lg text-text">
                  I'm an AI/ML engineer passionate about bridging research and engineering.
                  Currently at{" "}
                  <strong className="text-accent font-semibold">Nomura Research Institute</strong>, I architect
                  RAG platforms, LLM applications, and microservices that handle real workloads.
                </p>
              </Reveal>
              <Reveal delay={0.3} className="relative z-20">
                <p className="leading-relaxed">
                  My work spans the full stack of AI engineering — from fine-tuning LLMs and
                  building retrieval pipelines to designing scalable Java microservices with
                  Spring Boot. I've led teams at Omdena, built Text2SQL platforms, and shipped
                  production-grade AI systems used by real users.
                </p>
              </Reveal>
              <Reveal delay={0.4} className="relative z-20">
                <p className="leading-relaxed">
                  I thrive at the intersection of research and engineering: taking papers and
                  turning them into working, reliable software.
                </p>
              </Reveal>
            </div>
          </div>

          {/* Highlights Column */}
          <div className="lg:col-span-2 space-y-4">
            {[
              { title: "Nomura Research Institute", desc: "Associate Software Engineer (2024–Present)" },
              { title: "SMIT, Sikkim", desc: "B.Tech in AI & Data Science · CGPA 9.7" },
              { title: "Omdena", desc: "Data Scientist · Led 10-member ML team" },
              { title: "Open Source", desc: "GitHub · 10+ projects shipped" },
            ].map((h, i) => (
              <HighlightCard 
                key={h.title}
                title={h.title}
                desc={h.desc}
                delay={0.25 + i * 0.1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
