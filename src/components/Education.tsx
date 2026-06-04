import { motion } from "framer-motion";
import Reveal from "./Reveal";
import { GraduationCap } from "lucide-react";

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

export default function Education() {
  return (
    <section id="education" className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="section-label mb-3 block">Education</span>
        </Reveal>

        <Reveal delay={0.1}>
          <motion.div
            className="relative overflow-hidden rounded-2xl glass-card p-8 border-white/5 transition-all"
            whileHover={{
              borderColor: "rgba(0, 229, 117, 0.3)",
              backgroundColor: "rgba(9, 14, 12, 0.8)",
              boxShadow: "0 12px 40px rgba(0, 229, 117, 0.15)",
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <CornerCrosshairs />
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent via-cyan to-accent" />

            <div className="flex items-start gap-5">
              <motion.div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent-glow text-accent"
                whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(0, 229, 117, 0.3)" }}
              >
                <GraduationCap size={24} />
              </motion.div>
              <div>
                <h3 className="mb-2 font-sans text-xl font-bold text-text">
                  B.Tech in Artificial Intelligence & Data Science
                </h3>
                <p className="mb-2 text-sm text-text-muted">
                  Sikkim Manipal Institute of Technology (SMIT), East Sikkim
                </p>
                <p className="text-sm text-text-dim">
                  Graduating May 2025 · CGPA:{" "}
                  <motion.span
                    className="ml-1 font-bold text-cyan"
                  >
                    9.7 / 10
                  </motion.span>
                </p>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
