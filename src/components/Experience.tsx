import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import Reveal, { StaggerContainer, StaggerItem } from "./Reveal";
import { Briefcase, Calendar } from "lucide-react";

interface ExpCardProps {
  period: string;
  title: string;
  company: string;
  bullets: string[];
  tags: string[];
  featured?: boolean;
}

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

function ExpCard({ period, title, company, bullets, tags, featured = false }: ExpCardProps) {
  return (
    <StaggerItem>
      <TiltCard>
        <motion.div
          className={`relative overflow-hidden rounded-2xl border border-sand-light bg-canvas p-8 ${
            featured ? "border-l-[3px] border-l-terracotta" : ""
          }`}
          whileHover={{
            borderColor: "rgba(196,127,90,0.2)",
            boxShadow: "0 8px 32px rgba(196,127,90,0.04)",
          }}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            <div className="shrink-0">
              <span className="inline-block rounded-lg bg-terracotta-dim px-3 py-1 font-serif text-xs font-bold tracking-wider text-terracotta uppercase">
                {period}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-serif text-xl font-semibold text-ink">{title}</h3>
              <p className="mb-5 flex items-center gap-1.5 text-xs text-sand">
                <Briefcase size={11} />
                {company}
              </p>
              <ul className="mb-6 space-y-3">
                {bullets.map((b, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink/65">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta/50" />
                    <span dangerouslySetInnerHTML={{ __html: b }} />
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <motion.span
                    key={tag}
                    className="rounded-md bg-terracotta-dim/40 px-2.5 py-1 text-xs font-medium text-terracotta/80"
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(196,127,90,0.12)",
                      color: "#C47F5A",
                    }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </TiltCard>
    </StaggerItem>
  );
}

export default function Experience() {
  const experiences = [
    {
      period: "Aug 2024 — Present",
      title: "Associate Software Engineer",
      company: "Nomura Research Institute and Financial Technology · Kolkata",
      bullets: [
        "Architected a <strong>report microservice</strong> as a pluggable JAR framework enabling remote app integration and centralized report execution across multiple services.",
        "Designed a <strong>Camunda External Tasks & Saga-based workflow service</strong> for generic authorization flows on Java 21 and Spring Boot, orchestrating complex distributed transactions.",
        "Built a <strong>Python AI microservice</strong> with multi-tenant RAG, query decomposition, semantic caching, Langfuse observability, RAGAS evaluation, Spring Cloud Gateway, and Eureka service discovery.",
        "Implemented <strong>multi-strategy rate limiting</strong> and an <strong>SSO authentication bridge</strong> for cross-application single sign-on across the platform.",
        "Developed an <strong>LLM-based ATS</strong> using LlamaIndex, Cohere embeddings, Pinecone vector DB, Next.js, and FastAPI — achieving <strong>90%+ resume matching quality</strong>.",
      ],
      tags: [
        "Java 21", "Spring Boot", "Python", "FastAPI", "LlamaIndex", "Pinecone",
        "Cohere", "Camunda", "Langfuse", "RAGAS", "Next.js", "Eureka",
      ],
      featured: true,
    },
    {
      period: "Nov 2023 — Jun 2024",
      title: "Data Scientist",
      company: "Omdena · Remote",
      bullets: [
        "Led a <strong>10-member subgroup</strong> across data preprocessing and ML model deployment within a 40-person international collaboration.",
        "Conducted focused <strong>Pandas & NumPy workshops</strong> that improved shared workflows and accelerated model delivery across the team.",
        "Contributed to <strong>Crop Disease Detection</strong> (Kenya) and <strong>COVID-19 analysis</strong> (Zambia) projects using ML and deep learning techniques.",
      ],
      tags: ["Python", "Pandas", "NumPy", "Scikit-Learn", "Deep Learning", "Team Leadership"],
    },
  ];

  return (
    <section id="experience" className="relative px-6 py-32 bg-parchment/30">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="section-label mb-3 block">Experience</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mb-12 font-serif text-3xl font-semibold sm:text-4xl gradient-text">
            Where I've worked
          </h2>
        </Reveal>

        <StaggerContainer className="space-y-6" staggerDelay={0.15}>
          {experiences.map((exp) => (
            <ExpCard key={exp.period} {...exp} />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
