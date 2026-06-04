import { motion } from "framer-motion";
import { MapPin, FileText } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";
import { CharCascade } from "./Reveal";
import WarmShaderBg from "./WarmShaderBg";

function GlassFilter() {
  return (
    <svg className="hidden">
      <defs>
        <filter
          id="warm-glass"
          x="0%" y="0%" width="100%" height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="40" xChannelSelector="R" yChannelSelector="B" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="3" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

function MagneticButton({
  children,
  href,
  primary = false,
  icon: Icon,
}: {
  children: React.ReactNode;
  href: string;
  primary?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.ComponentType<any>;
}) {
  return (
    <motion.a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="relative flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: primary
            ? "linear-gradient(180deg, rgba(10,9,8,0.95) 0%, rgba(91,58,41,0.9) 100%)"
            : "linear-gradient(180deg, rgba(252,249,245,0.7) 0%, rgba(245,237,228,0.85) 100%)",
          boxShadow: primary
            ? "0 0 6px rgba(196,127,90,0.08), 0 2px 8px rgba(0,0,0,0.1), inset 2px 2px 0.5px -2px rgba(255,255,255,0.15), inset -2px -2px 0.5px -2px rgba(0,0,0,0.3), inset 0 0 8px 4px rgba(196,127,90,0.06), 0 0 12px rgba(196,127,90,0.12)"
            : "0 0 6px rgba(0,0,0,0.03), 0 2px 6px rgba(0,0,0,0.06), inset 2px 2px 0.5px -2px rgba(255,255,255,0.8), inset -1px -1px 0.5px -1px rgba(0,0,0,0.08), inset 0 0 6px 3px rgba(255,255,255,0.4), 0 0 10px rgba(196,127,90,0.06)",
          backdropFilter: 'url("#warm-glass")',
        }}
      />
      <span className={`relative z-10 ${primary ? "text-canvas" : "text-ink"}`}>
        {Icon && <Icon size={16} className="inline mr-1.5 -mt-0.5" />}
        {children}
      </span>
    </motion.a>
  );
}

const skills = [
  "RAG Systems",
  "LLM Fine-tuning",
  "Vector Search",
  "Embeddings",
  "Computer Vision",
  "LoRA",
];

export default function Hero() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center px-6 pt-20"
    >
      <WarmShaderBg />
      <GlassFilter />
      <div className="relative mx-auto max-w-3xl rounded-3xl border border-sand-light/40 bg-canvas/60 p-8 backdrop-blur-xl sm:p-12">
        {/* AI/ML label */}
        <motion.p
          className="section-label mb-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          AI/ML Engineer & Builder
        </motion.p>

        {/* Name with token cascade */}
        <h1 className="mb-2 text-center font-serif text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          <CharCascade text="Shivam Sourav" delay={0.3} className="gradient-text" />
        </h1>

        {/* Handle */}
        <motion.p
          className="mb-2 text-center font-mono text-sm text-sand"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          @shivamsourav
        </motion.p>

        {/* Location */}
        <motion.p
          className="mb-6 flex items-center justify-center gap-2 text-sm text-sand"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <MapPin size={14} className="text-terracotta" />
          Kolkata, India
        </motion.p>

        {/* Skill chips */}
        <motion.div
          className="mb-10 flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          {skills.map((skill, i) => (
            <motion.span
              key={skill}
              className="rounded-full border border-sand-light bg-canvas px-4 py-1.5 text-xs font-medium text-ink/70"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 + i * 0.06, duration: 0.4 }}
              whileHover={{
                scale: 1.08,
                borderColor: "rgba(196,127,90,0.4)",
                color: "#C47F5A",
                boxShadow: "0 0 16px rgba(196,127,90,0.08)",
              }}
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          <MagneticButton href="#projects" primary icon={FileText}>
            View Work
          </MagneticButton>
          <MagneticButton href="https://github.com/Shivam5560" icon={GithubIcon}>
            GitHub
          </MagneticButton>
          <MagneticButton href="https://www.linkedin.com/in/shivam-sourav-b889aa204/" icon={LinkedinIcon}>
            LinkedIn
          </MagneticButton>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
        >
          <span className="font-serif text-xs italic tracking-widest text-sand">Scroll</span>
          <motion.div
            className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-sand-light p-1"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div className="h-1.5 w-1.5 rounded-full bg-terracotta" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
