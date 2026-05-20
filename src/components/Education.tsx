import { motion } from "framer-motion";
import Reveal from "./Reveal";
import { GraduationCap } from "lucide-react";

export default function Education() {
  return (
    <section id="education" className="relative px-6 py-32 bg-parchment/30">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="section-label mb-3 block">Education</span>
        </Reveal>

        <Reveal delay={0.1}>
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-sand-light bg-canvas p-8"
            whileHover={{
              borderColor: "rgba(196,127,90,0.25)",
              boxShadow: "0 12px 40px rgba(196,127,90,0.04)",
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-terracotta via-plum to-dusty-blue" />

            <div className="flex items-start gap-5">
              <motion.div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-terracotta/15 bg-terracotta-dim text-terracotta"
                whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(196,127,90,0.15)" }}
              >
                <GraduationCap size={24} />
              </motion.div>
              <div>
                <h3 className="mb-1 font-serif text-xl font-semibold text-ink">
                  B.Tech in Artificial Intelligence & Data Science
                </h3>
                <p className="mb-1 text-sm text-sand">
                  Sikkim Manipal Institute of Technology (SMIT), East Sikkim
                </p>
                <p className="text-sm text-ink/55">
                  Graduating May 2025 · CGPA:{" "}
                  <motion.span
                    className="ml-1 font-semibold text-terracotta"
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
