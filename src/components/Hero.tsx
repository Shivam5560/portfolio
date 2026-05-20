import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import { MapPin, FileText } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";
import { CharCascade } from "./Reveal";

function MagneticButton({
  children,
  href,
  primary = false,
  icon: Icon,
}: {
  children: React.ReactNode;
  href: string;
  primary?: boolean;
  icon?: React.ElementType;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.2);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.2);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className={`relative flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors ${
        primary
          ? "bg-ink text-canvas hover:bg-terracotta"
          : "border border-sand-light bg-transparent text-ink hover:border-terracotta hover:text-terracotta"
      }`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileHover={primary ? { scale: 1.05, boxShadow: "0 8px 32px rgba(196,127,90,0.3)" } : { scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {Icon && <Icon size={16} />}
      {children}
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
  const containerRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { damping: 20, stiffness: 200 });
  const springRotateY = useSpring(rotateY, { damping: 20, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    rotateY.set(((e.clientX - (rect.left + rect.width / 2)) / rect.width) * 8);
    rotateX.set(-((e.clientY - (rect.top + rect.height / 2)) / rect.height) * 8);
  };

  return (
    <section
      className="relative flex min-h-screen items-center justify-center px-6 pt-20"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { rotateX.set(0); rotateY.set(0); }}
    >
      <div className="mx-auto max-w-3xl text-center" ref={containerRef}>
        {/* Avatar with gradient border */}
        <motion.div
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full font-serif text-3xl font-bold"
          style={{
            rotateX: springRotateX,
            rotateY: springRotateY,
            transformPerspective: 800,
            background: "linear-gradient(135deg, #C47F5A, #8B5E7C, #5B8A9E)",
            padding: "2px",
          }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 200 }}
        >
          <span className="flex h-full w-full items-center justify-center rounded-full bg-canvas text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #C47F5A, #8B5E7C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            SS
          </span>
        </motion.div>

        {/* AI/ML label */}
        <motion.p
          className="section-label mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          AI/ML Engineer & Builder
        </motion.p>

        {/* Name with token cascade */}
        <h1 className="mb-2 font-serif text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          <CharCascade text="Shivam Sourav" delay={0.3} className="gradient-text" />
        </h1>

        {/* Handle */}
        <motion.p
          className="mb-2 font-mono text-sm text-sand"
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
