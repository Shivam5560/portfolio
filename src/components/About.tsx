import { motion } from "framer-motion";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="relative px-6 py-32 bg-parchment/20">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="section-label mb-3 block">About</span>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3">
            <Reveal delay={0.1}>
              <h2 className="mb-6 font-serif text-3xl font-semibold leading-tight sm:text-4xl gradient-text">
                Building intelligent systems that move from experiments into production.
              </h2>
            </Reveal>

            <div className="space-y-4 text-ink/65 font-serif">
              <Reveal delay={0.2}>
                <p className="leading-relaxed">
                  I'm an AI/ML engineer passionate about bridging research and engineering.
                  Currently at{" "}
                  <strong className="text-ink">Nomura Research Institute</strong>, I architect
                  RAG platforms, LLM applications, and microservices that handle real workloads.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="leading-relaxed">
                  My work spans the full stack of AI engineering — from fine-tuning LLMs and
                  building retrieval pipelines to designing scalable Java microservices with
                  Spring Boot. I've led teams at Omdena, built Text2SQL platforms, and shipped
                  production-grade AI systems used by real users.
                </p>
              </Reveal>
              <Reveal delay={0.4}>
                <p className="leading-relaxed">
                  I thrive at the intersection of research and engineering: taking papers and
                  turning them into working, reliable software.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {[
              { title: "Nomura Research Institute", desc: "Associate Software Engineer (2024–Present)" },
              { title: "SMIT, Sikkim", desc: "B.Tech in AI & Data Science · CGPA 9.7" },
              { title: "Omdena", desc: "Data Scientist · Led 10-member ML team" },
              { title: "Open Source", desc: "GitHub · 10+ projects shipped" },
            ].map((h) => (
              <Reveal key={h.title} delay={0.25}>
                <motion.div
                  className="flex items-start gap-4 rounded-xl border border-sand-light bg-parchment/50 p-5"
                  whileHover={{
                    y: -4,
                    borderColor: "rgba(196,127,90,0.25)",
                    boxShadow: "0 8px 24px rgba(196,127,90,0.04)",
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-terracotta-dim text-terracotta font-serif text-lg font-bold">
                    {h.title[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-ink">{h.title}</h4>
                    <p className="text-sm text-ink/55">{h.desc}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
