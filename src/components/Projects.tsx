import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Reveal, { StaggerContainer, StaggerItem } from "./Reveal";
import { Star, ExternalLink, Database, Bot, MessageSquare, FileCheck, FileOutput, Brain, FileSpreadsheet, HeartPulse, Leaf, Languages, Camera, Droplets, Feather } from "lucide-react";
import { VirusIcon } from "./Icons";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, React.ComponentType<any>> = {
  Database, Bot, MessageSquare, FileCheck, FileOutput, Brain,
  FileSpreadsheet, HeartPulse, Leaf, Virus: VirusIcon, Languages,
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

// AuraSQL typing terminal widget
function AuraSQLWidget() {
  const [step, setStep] = useState(0);
  const queries = [
    { nl: "Get top 5 projects by stars", sql: "SELECT * FROM projects ORDER BY stars DESC LIMIT 5;" },
    { nl: "Count users in Kolkata", sql: "SELECT COUNT(*) FROM profiles WHERE city = 'Kolkata';" },
    { nl: "List active agent workflows", sql: "SELECT id, status FROM tasks WHERE type = 'AGENT';" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % queries.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl bg-[#030504] border border-white/5 p-3.5 font-mono text-[9px] leading-relaxed shadow-inner w-full min-h-[105px] flex flex-col justify-between">
      <div>
        <div className="text-text-dim flex items-center gap-1.5 mb-1 text-[8px] tracking-wider uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          nl_prompt_input
        </div>
        <div className="text-cyan font-semibold leading-tight">&gt; "{queries[step].nl}"</div>
      </div>
      <div className="border-t border-white/5 pt-2 mt-2">
        <div className="text-text-dim text-[8px] tracking-wider uppercase mb-1">generated_sql</div>
        <motion.div 
          key={step} 
          initial={{ opacity: 0, y: 3 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-accent leading-normal break-all font-semibold"
        >
          {queries[step].sql}
        </motion.div>
      </div>
    </div>
  );
}

// Professional Grade RAG flow chart widget
function RAGPipelineWidget() {
  return (
    <div className="rounded-xl bg-[#030504] border border-white/5 p-3.5 font-mono text-[9px] w-full min-h-[105px] flex flex-col justify-between">
      <div className="text-text-dim flex items-center gap-1.5 mb-1.5 text-[8px] tracking-wider uppercase">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
        retrieval_flow
      </div>
      <div className="flex items-center justify-between text-center relative py-1 text-[8px]">
        <div className="rounded border border-white/10 bg-[#111a16] px-2 py-0.5 text-text">Query</div>
        <div className="text-accent text-[8px] animate-pulse">➔</div>
        <div className="rounded border border-white/10 bg-[#111a16] px-2 py-0.5 text-cyan font-bold">VectorDB</div>
        <div className="text-accent text-[8px] animate-pulse">➔</div>
        <div className="rounded border border-accent/20 bg-accent-glow px-2 py-0.5 text-accent font-bold">Rerank</div>
      </div>
      <div className="text-[8px] text-text-dim flex justify-between items-center mt-2 border-t border-white/5 pt-2">
        <span>Strategy: BM25 + Semantic</span>
        <span>Conf: <span className="text-accent font-bold">0.965</span></span>
      </div>
    </div>
  );
}

// RAG Chatbot typing message widget
function ChatbotWidget() {
  const [text, setText] = useState("");
  const fullText = "PEFT configs set. Fine-tuning Llama-3-8B with LoRA adapters active. Loss: 0.24...";

  useEffect(() => {
    let index = 0;
    setText("");
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setText(fullText.slice(0, index + 1));
        index++;
      } else {
        setTimeout(() => {
          index = 0;
          setText("");
        }, 4000);
      }
    }, 55);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-xl bg-[#030504] border border-white/5 p-3.5 font-mono text-[9px] leading-relaxed shadow-inner w-full min-h-[105px] flex flex-col justify-between">
      <div>
        <div className="text-text-dim flex items-center gap-1.5 mb-1 text-[8px] tracking-wider uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          training_stream
        </div>
        <div className="bg-[#111a16]/40 text-text-muted rounded-lg px-2.5 py-0.5 text-[8px] border border-white/5 w-fit mb-1">
          $ run lora_finetune.py
        </div>
      </div>
      <div className="border-t border-white/5 pt-2 mt-1">
        <div className="bg-[#090e0c] text-accent rounded-lg px-2 py-1.5 border border-accent/10 min-h-[36px] italic leading-snug flex items-center">
          <span>
            {text}
            <span className="animate-pulse font-bold text-cyan">|</span>
          </span>
        </div>
      </div>
    </div>
  );
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

function TiltProjectCard({ 
  project, 
  heightClass = "h-full" 
}: { 
  project: Project; 
  heightClass?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue<number>(0);
  const y = useMotionValue<number>(0);
  const springConfig = { damping: 25, stiffness: 300 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), springConfig);
  const [isHovered, setIsHovered] = useState(false);
  const [spotlightCoords, setSpotlightCoords] = useState({ x: 0, y: 0 });
  const Icon = iconMap[project.icon] || Database;

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={`relative w-full ${heightClass}`}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
        setSpotlightCoords({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        if (!isHovered) setIsHovered(true);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); setIsHovered(false); }}
      onMouseEnter={() => setIsHovered(true)}
    >
      <motion.div
        className="relative group flex flex-col justify-between overflow-hidden rounded-2xl glass-card p-5 glow-border transition-all w-full h-full"
        whileHover={{
          backgroundColor: "rgba(9, 14, 12, 0.85)",
          boxShadow: "0 12px 40px rgba(0,229,117,0.08), 0 0 32px rgba(212,175,55,0.05)",
        }}
        transition={{ duration: 0.3 }}
      >
        <CornerCrosshairs />
        
        {/* Spotlight overlay */}
        <div 
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(220px circle at ${spotlightCoords.x}px ${spotlightCoords.y}px, rgba(0, 229, 117, 0.06), transparent 85%)`
          }}
        />

        {/* Top gradient line on hover */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent"
          animate={{ opacity: isHovered ? 1 : 0, scaleX: isHovered ? 1 : 0.5 }}
          transition={{ duration: 0.4 }}
        />

        {/* Card Header (Window/IDE tabs style) */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 text-[9px] font-mono text-text-dim">
          <div className="flex items-center gap-1.5">
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500/40" />
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-500/40" />
              <span className="h-1.5 w-1.5 rounded-full bg-green-500/40" />
            </div>
            <span className="ml-1 select-none text-[8px] text-text-muted">
              {`src/projects/${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}${project.tags.includes("Python") ? ".py" : ".tsx"}`}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[8px] tracking-wider uppercase text-text-dim">{project.featured ? "FEATURED" : "MODULE"}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-col flex-grow">
          {/* Icon & Rating */}
          <div className="mb-3.5 flex items-start justify-between">
            <motion.div
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-glow text-accent border border-accent/20"
              animate={isHovered ? { scale: 1.05, boxShadow: "0 0 15px rgba(0, 229, 117, 0.2)" } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Icon size={18} />
            </motion.div>
            {project.stars && (
              <motion.div 
                className="flex items-center gap-1 text-xs font-bold text-cyan"
                animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
              >
                <motion.div animate={isHovered ? { rotate: [0, 15, -15, 0] } : {}} transition={{ duration: 0.5 }}>
                  <Star size={12} fill="currentColor" />
                </motion.div>
                {project.stars}
              </motion.div>
            )}
          </div>

          <h3 className="mb-2 font-serif text-lg font-bold text-text leading-tight">{project.title}</h3>
          <p className="text-xs leading-relaxed text-text-muted mb-4 line-clamp-3">
            {project.description}
          </p>

          {/* Embedded Interactive Code Mockup */}
          {project.featured && (
            <div className="mt-auto mb-3.5 w-full">
              {project.title === "AuraSQL" && <AuraSQLWidget />}
              {project.title === "Professional Grade RAG" && <RAGPipelineWidget />}
              {project.title === "RAG Chatbot" && <ChatbotWidget />}
            </div>
          )}
        </div>

        {/* Footer Area - Aligned to bottom */}
        <div className="mt-auto border-t border-white/5 pt-3.5">
          <div className="mb-3 flex flex-wrap gap-1">
            {project.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="rounded bg-surface-light px-1.5 py-0.5 font-mono text-[8px] text-text-dim border border-white/5"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-1">
            {project.href ? (
              <motion.a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-cyan group"
                whileHover={{ x: 3 }}
              >
                <span className="group-hover:text-white transition-colors">View on GitHub</span> 
                <ExternalLink size={10} className="group-hover:text-white transition-colors" />
              </motion.a>
            ) : (
              <span className="text-[9px] font-mono text-text-dim select-none">// Private Repo</span>
            )}
            <span className="font-mono text-[8px] text-text-dim select-none">
              [{isHovered ? `${Math.round(spotlightCoords.x)},${Math.round(spotlightCoords.y)}` : "0,0"}]
            </span>
          </div>
        </div>
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
          <h2 className="mb-4 font-serif text-3xl font-extrabold sm:text-4xl gradient-text">
            What I've built
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mb-12 max-w-lg text-text-muted">
            Curated highlights across AI, full-stack, and data science.
          </p>
        </Reveal>

        {/* Row-planned Bento Grid with full alignments */}
        <StaggerContainer className="mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.1}>
          {featured.map((p) => (
            <StaggerItem key={p.title}>
              <TiltProjectCard project={p} heightClass="h-[460px]" />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.05}>
          {others.map((p) => (
            <StaggerItem key={p.title}>
              <TiltProjectCard project={p} heightClass="h-[340px]" />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

