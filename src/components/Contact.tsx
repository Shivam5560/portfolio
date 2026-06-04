import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import Reveal, { StaggerContainer, StaggerItem } from "./Reveal";
import { Mail, Phone, ArrowRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";

interface ContactCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  label: string;
  value: string;
  href: string;
}

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

function MagneticContactCard({ icon: Icon, label, value, href }: ContactCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue<number>(0);
  const y = useMotionValue<number>(0);
  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  return (
    <StaggerItem>
      <motion.a
        ref={ref}
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
        className="group relative overflow-hidden flex items-center gap-5 rounded-2xl glass-card p-6 border-white/5 transition-colors"
        style={{ x: springX, y: springY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        whileHover={{
          borderColor: "rgba(0, 229, 117, 0.3)",
          backgroundColor: "rgba(9, 14, 12, 0.8)",
          boxShadow: "0 12px 40px rgba(0, 229, 117, 0.15)",
        }}
      >
        <CornerCrosshairs />
        <motion.div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent-glow text-accent"
          whileHover={{ scale: 1.15, rotate: -5 }}
        >
          <Icon size={20} />
        </motion.div>
        <div className="flex-1">
          <div className="font-bold text-text group-hover:text-white transition-colors">{label}</div>
          <div className="text-sm text-text-muted">{value}</div>
        </div>
        <motion.div
          className="text-text-dim group-hover:text-accent transition-colors"
          whileHover={{ x: 4, scale: 1.2 }}
        >
          <ArrowRight size={18} />
        </motion.div>
      </motion.a>
    </StaggerItem>
  );
}

const contacts = [
  { icon: Mail, label: "Email", value: "shivamsourav2003@gmail.com", href: "mailto:shivamsourav2003@gmail.com" },
  { icon: Phone, label: "Phone", value: "+91 85218 46844", href: "tel:+918521846844" },
  { icon: GithubIcon, label: "GitHub", value: "github.com/Shivam5560", href: "https://github.com/Shivam5560" },
  { icon: LinkedinIcon, label: "LinkedIn", value: "shivam-sourav", href: "https://www.linkedin.com/in/shivam-sourav-b889aa204/" },
];

export default function Contact() {
  return (
    <section id="contact" className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="section-label mb-3 block">Contact</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mb-4 font-serif text-3xl font-extrabold sm:text-4xl gradient-text">
            Let's build something together
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mb-10 max-w-lg text-text-muted">
            Available for AI engineering, RAG, LLM applications, and backend microservice roles.
          </p>
        </Reveal>

        <StaggerContainer className="grid gap-5 sm:grid-cols-2" staggerDelay={0.1}>
          {contacts.map((c) => (
            <MagneticContactCard key={c.label} {...c} />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
