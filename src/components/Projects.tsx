import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Reveal, { StaggerContainer, StaggerItem } from "./Reveal";
import { Star, ExternalLink, Database, Bot, MessageSquare, FileCheck, FileOutput, Brain, FileSpreadsheet, HeartPulse, Leaf, Languages, Camera, Droplets, Feather } from "lucide-react";
import { VirusIcon } from "./Icons";

const iconMap: Record<string, React.ElementType> = {
  Database, Bot, MessageSquare, FileCheck, FileOutput, Brain,
  FileSpreadsheet, HeartPulse, Leaf, VirusIcon as Virus, Languages,
  Camera, Droplets, Feather,
};

interface Project {
  title: string;
  description: string;
  tags: string[];
  icon: string;
  stars?: number;
  href?: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    title: "AuraSQL",
    description: "AI-powered Text2SQL platform with configurable multi-database connectivity, multi-table selection, executable SQL generation, Cohere embeddings, Pinecone schema retrieval, Groq LLMs, Supabase auth, and a Next.js dashboard.",
    tags: ["Next.js", "TypeScript", "Groq", "Pinecone", "Supabase", "Cohere"],
    icon: "Database", stars: 2,
    href: "https://github.com/Shivam5560/AuraSQL", featured: true,
  },
  {
    title: "Professional Grade RAG",
    description: "Production-ready RAG system with hybrid BM25 + semantic retrieval, mxbai-rerank-large-v2 reranking, LlamaIndex conversational context, Postgres + pgvector storage, Groq LLM integration, and traceable source citations.",
    tags: ["LlamaIndex", "Python", "pgvector", "Postgres", "Groq", "BM25"],
    icon: "Bot", stars: 2,
    href: "https://github.com/Shivam5560/Professional_Grade_RAG", featured: true,
  },
  {
    title: "RAG Chatbot",
    description: "Conversational RAG chatbot with streaming responses, document upload, intelligent chunking strategies, and multi-turn conversation memory.",
    tags: ["Python", "LangChain", "Streaming", "Vector Search"],
    icon: "MessageSquare", stars: 2,
    href: "https://github.com/Shivam5560/RAG-CHATBOT", featured: true,
  },
  {
    title: "ATS Resume Matcher",
    description: "LLM-based applicant tracking system with semantic resume-to-JD matching, explainable scoring, and Cohere embeddings with Pinecone vector search.",
    tags: ["Python", "Cohere", "FastAPI", "Pinecone"],
    icon: "FileCheck", href: "https://github.com/Shivam5560/ATS",
  },
  {
    title: "ResumeGen",
    description: "AI-powered resume generator that creates tailored, ATS-optimized resumes from user input with multiple templates and formats.",
    tags: ["TypeScript", "Next.js", "AI"],
    icon: "FileOutput", href: "https://github.com/Shivam5560/ResumeGen",
  },
  {
    title: "Nepali LLM",
    description: "Trained a SentencePiece tokenizer on Nepali text reducing token count by 80%, then fine-tuned Gemma-2B with LoRA for low-resource language NLU.",
    tags: ["Gemma", "LoRA", "Python", "Streamlit"],
    icon: "Brain",
  },
  {
    title: "CSV2SQL",
    description: "Convert CSV files to executable SQL insert statements with schema inference, type detection, and multi-table support.",
    tags: ["Python", "SQL", "Data"],
    icon: "FileSpreadsheet", href: "https://github.com/Shivam5560/CSV2SQL",
  },
  {
    title: "HealthyBaba",
    description: "Health management application with symptom tracking, wellness recommendations, and health data visualization dashboards.",
    tags: ["Python", "HealthTech"],
    icon: "HeartPulse", href: "https://github.com/Shivam5560/HealthyBaba",
  },
  {
    title: "Omdena Kenya — Crop Disease",
    description: "ML models for crop disease detection in Kenya using computer vision and deep learning. Part of Omdena's 40-person international AI collaboration.",
    tags: ["Python", "Computer Vision", "Deep Learning"],
    icon: "Leaf", href: "https://github.com/Shivam5560/Omdena-Kenya-CropDisease",
  },
  {
    title: "COVID-19 Zambia Analysis",
    description: "Data analysis and predictive modeling for COVID-19 trends in Zambia. Time-series forecasting with epidemiological data.",
    tags: ["Python", "Time Series", "Pandas"],
    icon: "Virus", href: "https://github.com/Shivam5560/Covid19_Zambia",
  },
  {
    title: "BERT Text Classification",
    description: "Fine-tuned BERT models for multi-class text classification tasks with custom datasets, achieving strong performance on domain-specific NLP benchmarks.",
    tags: ["BERT", "PyTorch", "NLP"],
    icon: "Languages", href: "https://github.com/Shivam5560/Bert-text-classification",
  },
  {
    title: "Attendance + Mask Detection",
    description: "Face recognition attendance system with real-time mask detection using OpenCV, Haar Cascade classifiers, CNNs, and VGG19-inspired deep learning.",
    tags: ["OpenCV", "CNN", "VGG19", "Python"],
    icon: "Camera", href: "https://github.com/Shivam5560/Attendance",
  },
  {
    title: "Flood Prediction",
    description: "Time-series forecasting with XGBoost and LSTM models for flood and waterbody prediction, combining feature engineering with deployable predictive workflows.",
    tags: ["XGBoost", "LSTM", "Pandas"],
    icon: "Droplets",
  },
  {
    title: "RhymeWeaver",
    description: "Creative poetry generation tool using NLP techniques for rhyme detection, meter analysis, and AI-assisted verse composition.",
    tags: ["Python", "NLP", "Creative AI"],
    icon: "Feather", href: "https://github.com/Shivam5560/RhymeWeaver",
  },
];

const featured = projects.filter((p) => p.featured);
const others = projects.filter((p) => !p.featured);

function TiltProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 300 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), springConfig);
  const [isHovered, setIsHovered] = useState(false);
  const Icon = iconMap[project.icon] || Database;

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); setIsHovered(false); }}
      onMouseEnter={() => setIsHovered(true)}
    >
      <motion.div
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-sand-light bg-canvas p-6"
        whileHover={{
          borderColor: "rgba(196,127,90,0.25)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.04), 0 0 32px rgba(196,127,90,0.04)",
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Top gradient line on hover */}
        <motion.div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-terracotta to-transparent"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        <div className="mb-4 flex items-start justify-between">
          <motion.div
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-terracotta/15 bg-terracotta-dim text-terracotta"
            animate={isHovered ? { scale: 1.1, boxShadow: "0 0 16px rgba(196,127,90,0.12)" } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Icon size={20} />
          </motion.div>
          {project.stars && (
            <div className="flex items-center gap-1 text-sm font-semibold text-terracotta">
              <Star size={13} fill="currentColor" />
              {project.stars}
            </div>
          )}
        </div>

        <h3 className="mb-2 font-serif text-lg font-semibold text-ink">{project.title}</h3>
        <p className="mb-5 flex-1 text-sm leading-relaxed text-ink/60">{project.description}</p>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-parchment px-2 py-0.5 text-xs font-medium text-ink/50 ring-1 ring-sand-light/50"
            >
              {tag}
            </span>
          ))}
        </div>

        {project.href && (
          <motion.a
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta"
            whileHover={{ x: 4 }}
          >
            View on GitHub <ExternalLink size={12} />
          </motion.a>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="section-label mb-3 block">Projects</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mb-4 font-serif text-3xl font-semibold sm:text-4xl gradient-text">
            What I've built
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mb-12 max-w-lg text-ink/55">
            Curated highlights across AI, full-stack, and data science.
          </p>
        </Reveal>

        <StaggerContainer className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.1}>
          {featured.map((p) => (
            <StaggerItem key={p.title}>
              <TiltProjectCard project={p} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.05}>
          {others.map((p) => (
            <StaggerItem key={p.title}>
              <TiltProjectCard project={p} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
