import { motion, AnimatePresence } from "framer-motion";
import Reveal from "./Reveal";
import { Code2, Microchip, Globe, Server, Database, Wrench, Sparkles, Terminal } from "lucide-react";
import { useState } from "react";

const skillGroups = [
  {
    title: "Languages",
    icon: Code2,
    skills: ["Python", "Java 21", "TypeScript", "SQL", "R", "C", "HTML/CSS"],
    consoleType: "code",
  },
  {
    title: "AI & ML",
    icon: Microchip,
    skills: ["TensorFlow", "PyTorch", "Scikit-Learn", "Hugging Face", "XGBoost", "NLTK", "spaCy", "Ollama"],
    consoleType: "neural",
  },
  {
    title: "LLM & RAG",
    icon: Globe,
    skills: ["RAG Pipelines", "Vector Databases", "Pinecone", "pgvector", "Cohere", "Groq", "Semantic Caching", "Reranking", "Langfuse", "RAGAS"],
    consoleType: "rag",
  },
  {
    title: "Backend & Cloud",
    icon: Server,
    skills: ["Spring Boot", "FastAPI", "Next.js", "REST APIs", "GraphQL", "Camunda", "Spring Cloud Gateway", "Eureka", "Redis", "ActiveMQ"],
    consoleType: "routes",
  },
  {
    title: "Data & Databases",
    icon: Database,
    skills: ["PostgreSQL", "MongoDB", "OracleDB", "Pandas", "NumPy", "PySpark", "Power BI", "Tableau", "Looker", "Matplotlib", "Seaborn"],
    consoleType: "db",
  },
  {
    title: "Tools & Practices",
    icon: Wrench,
    skills: ["Git", "GitHub", "Jenkins", "Maven", "Docker", "Supabase", "Microservices", "Rate Limiting", "SSO", "Saga Pattern", "CI/CD"],
    consoleType: "ci",
  },
];

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

// Sub-consoles based on selected skill category
function ConsoleOutput({ type }: { type: string }) {
  if (type === "code") {
    return (
      <div className="space-y-3 font-mono text-[10px] leading-relaxed text-text-muted">
        <div>
          <span className="text-text-dim"># run compiler.py</span>
          <div className="text-accent">&gt; compiling active scripts...</div>
        </div>
        <div className="bg-[#030504] border border-white/5 rounded-lg p-3 text-cyan">
          <pre className="overflow-x-auto">
{`def init_agent():
    print("Agent Online")
    return Agent(model="llama3", env="production")`}
          </pre>
        </div>
        <div className="text-accent">Compilation successful. Execution latency: 0ms.</div>
      </div>
    );
  }

  if (type === "neural") {
    return (
      <div className="space-y-3 font-mono text-[10px] leading-normal text-text-muted">
        <div>
          <span className="text-text-dim">// neural_topology_map</span>
        </div>
        <div className="bg-[#030504] border border-white/5 rounded-lg p-4 text-center text-accent/80 select-none">
          <pre className="leading-tight">
{`[Input Layer]       [Hidden Nodes]      [Output Layer]
   O ───────────────►     O ─────────────►     O
   O ───────────────►     O ─────────────►     O
   O ───────────────►     O`}
          </pre>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-[9px]">
          <div className="border border-white/5 rounded p-1">Val Loss: <span className="text-cyan font-bold">0.038</span></div>
          <div className="border border-white/5 rounded p-1">Epochs: <span className="text-cyan font-bold">150/150</span></div>
          <div className="border border-white/5 rounded p-1">Acc: <span className="text-cyan font-bold">98.4%</span></div>
        </div>
      </div>
    );
  }

  if (type === "rag") {
    return (
      <div className="space-y-3 font-mono text-[10px] leading-relaxed text-text-muted">
        <div>
          <span className="text-text-dim">// vector_database_index_lookup</span>
        </div>
        <div className="bg-[#030504] border border-white/5 rounded-lg p-3 text-cyan">
          <div>Embedding Dimensions: <span className="text-text">1536 (Cohere-V3)</span></div>
          <div>Index Algorithm: <span className="text-text">HNSW Cosine Similarity</span></div>
          <div>Active Pinecone Namespace: <span className="text-accent font-semibold">"production-docs"</span></div>
        </div>
        <div className="text-[9px] text-text-dim flex justify-between">
          <span>Retrieval Strategy: Hybrid BM25</span>
          <span>Reranking: Cohere-Rerank</span>
        </div>
      </div>
    );
  }

  if (type === "routes") {
    return (
      <div className="space-y-2.5 font-mono text-[10px] text-text-muted">
        <div>
          <span className="text-text-dim">// active_gateway_route_registry</span>
        </div>
        <div className="grid gap-1.5">
          <div className="flex justify-between items-center bg-[#030504] border border-white/5 rounded px-2.5 py-1">
            <span className="text-accent font-semibold">GET</span>
            <span className="text-text-dim">/api/v1/agent/status</span>
            <span className="text-cyan font-bold">200 OK</span>
          </div>
          <div className="flex justify-between items-center bg-[#030504] border border-white/5 rounded px-2.5 py-1">
            <span className="text-accent font-semibold">POST</span>
            <span className="text-text-dim">/api/v1/auth/sso</span>
            <span className="text-cyan font-bold">201 CREATED</span>
          </div>
          <div className="flex justify-between items-center bg-[#030504] border border-white/5 rounded px-2.5 py-1">
            <span className="text-accent font-semibold">PUT</span>
            <span className="text-text-dim">/api/v1/workflow/camunda</span>
            <span className="text-cyan font-bold">200 OK</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "db") {
    return (
      <div className="space-y-3 font-mono text-[10px] leading-relaxed text-text-muted">
        <div>
          <span className="text-text-dim"># sql_schema_describe</span>
        </div>
        <div className="bg-[#030504] border border-white/5 rounded-lg p-3 text-cyan">
          <pre className="overflow-x-auto text-[9px]">
{`Table: user_profiles
───────────────────────────────────────
id       | uuid         | PRIMARY KEY
location | varchar(255) | INDEX
cgpa     | numeric(3,2) | default 9.7`}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-mono text-[10px] leading-relaxed text-text-muted">
      <div>
        <span className="text-text-dim">// git_ci_cd_deployment_pipeline</span>
      </div>
      <div className="flex items-center justify-between text-center relative py-1.5 text-[9px] bg-[#030504] border border-white/5 rounded-lg px-3">
        <div className="text-cyan font-bold">Build: Pass</div>
        <div className="text-accent text-[8px] animate-pulse">➔</div>
        <div className="text-cyan font-bold">Test: Pass</div>
        <div className="text-accent text-[8px] animate-pulse">➔</div>
        <div className="text-accent font-bold">Deploy: Active</div>
      </div>
      <div className="text-[9px] text-text-dim text-right">
        Containerization: Docker / Gateway Bridge
      </div>
    </div>
  );
}

export default function Skills() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [spotlightCoords, setSpotlightCoords] = useState({ x: 0, y: 0 });

  return (
    <section id="skills" className="relative px-6 py-32 overflow-hidden">
      <div className="mx-auto max-w-5xl relative z-10">
        <Reveal>
          <span className="section-label mb-3 block">Skills</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mb-12 font-serif text-3xl font-extrabold sm:text-4xl gradient-text">
            Technologies I work with
          </h2>
        </Reveal>

        {/* Structured 2-Column Console Layout */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Left Column: Skill Category Grids (spans 7 columns) */}
          <div className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
            {skillGroups.map((group, idx) => {
              const Icon = group.icon;
              return (
                <div key={idx} className="h-[210px]">
                  <motion.div
                    className={`relative overflow-hidden rounded-2xl glass-card p-5 h-full transition-all border ${
                      activeIdx === idx ? "border-accent/20 bg-accent-glow" : "border-white/5"
                    }`}
                    onMouseEnter={() => setActiveIdx(idx)}
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <CornerCrosshairs />
                    <h3 className="mb-3.5 flex items-center gap-2.5 font-serif text-base font-bold text-text">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-glow text-accent border border-accent/20">
                        <Icon size={16} />
                      </div>
                      {group.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {group.skills.map((skill) => (
                        <span
                          key={skill}
                          className="cursor-default rounded-md bg-surface-light px-2 py-0.5 font-mono text-[9px] text-text-dim border border-white/5"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Terminal Visualizer (spans 5 columns) */}
          <div className="lg:col-span-5 h-[436px] sticky top-28">
            <motion.div
              className="relative group overflow-hidden rounded-2xl glass-card p-6 h-full border border-white/5 flex flex-col justify-between"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setSpotlightCoords({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top
                });
              }}
              whileHover={{
                boxShadow: "0 12px 40px rgba(0, 229, 117, 0.1), 0 0 32px rgba(212, 175, 55, 0.05)",
              }}
              transition={{ duration: 0.3 }}
            >
              <CornerCrosshairs />
              
              {/* Spotlight overlay */}
              <div 
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                style={{
                  background: `radial-gradient(280px circle at ${spotlightCoords.x}px ${spotlightCoords.y}px, rgba(0, 229, 117, 0.07), transparent 85%)`
                }}
              />

              {/* Console Header */}
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#ff5f56]" />
                    <span className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
                    <span className="h-2 w-2 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[9px] text-text-dim">
                    <Terminal size={11} className="text-accent animate-pulse" />
                    Console Visualizer
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-serif text-sm font-semibold text-text mb-1">
                    Category: {skillGroups[activeIdx].title}
                  </h4>
                  <p className="text-[10px] text-text-dim font-mono">
                    // displaying environment variables
                  </p>
                </div>
              </div>

              {/* Dynamic content wrapper */}
              <div className="flex-1 flex flex-col justify-center py-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIdx}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="w-full"
                  >
                    <ConsoleOutput type={skillGroups[activeIdx].consoleType} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Console Footer */}
              <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between font-mono text-[8px] text-text-dim">
                <span>Active Model: Gemini-3.5-Flash</span>
                <span className="flex items-center gap-1 text-cyan animate-pulse">
                  <Sparkles size={8} /> LIVE
                </span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
