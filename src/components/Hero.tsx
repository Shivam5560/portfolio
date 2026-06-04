import { motion } from "framer-motion";
import { MapPin, FileText, ChevronRight, Sparkles, Terminal as TerminalIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { CharCascade } from "./Reveal";
import NeuralParticleField from "./NeuralParticleField";

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
      className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide uppercase transition-all ${
        primary ? "glow-border text-white" : "glass-card text-text-muted hover:text-white"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        background: primary 
          ? "linear-gradient(to right, rgba(0, 229, 117, 0.2), rgba(212, 175, 55, 0.2))"
          : undefined,
        boxShadow: primary 
          ? "0 0 20px rgba(0, 229, 117, 0.2)"
          : undefined,
      }}
    >
      <span className="relative z-10 flex items-center gap-2">
        {Icon && <Icon size={14} />}
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

const logSequence = [
  "Initializing agent session...",
  "Connecting to Pinecone Vector DB... OK",
  "Fetching semantic cache... HIT",
  "Running hybrid retriever (BM25 + Semantic)...",
  "Reranking chunks with mxbai-rerank-v2...",
  "Rerank complete. Top similarity score: 0.965",
  "Forwarding context to Llama-3-8B-Instruct...",
  "Streaming response chunk: 12ms (85 tokens/sec)",
  "Agent task resolved successfully.",
  "System state: Idle. Awaiting instruction...",
];

export default function Hero() {
  const [logs, setLogs] = useState<string[]>([]);
  const logIndexRef = useRef(0);

  // Live Terminal Log Simulator
  useEffect(() => {
    // Initial logs load
    setLogs([logSequence[0]]);
    logIndexRef.current = 1;

    const interval = setInterval(() => {
      setLogs((prev) => {
        const nextLog = logSequence[logIndexRef.current];
        logIndexRef.current = (logIndexRef.current + 1) % logSequence.length;
        
        // Keep last 6 logs for terminal view
        const currentLogs = [...prev, nextLog];
        if (currentLogs.length > 6) {
          currentLogs.shift();
        }
        return currentLogs;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center px-6 pt-28 pb-16 overflow-hidden">
      <NeuralParticleField />
      
      <div className="relative mx-auto max-w-6xl w-full grid gap-12 lg:grid-cols-12 items-center z-10">
        
        {/* Left Column - Typographic profile */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Availability Badge */}
          <motion.div
            className="flex w-fit items-center gap-2 rounded-full border border-cyan/20 bg-cyan/5 px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase text-cyan mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan"></span>
            </span>
            Available for new opportunities
          </motion.div>

          {/* Technical Label */}
          <motion.p
            className="section-label mb-3 text-accent text-xs font-bold font-mono tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            // AI/ML ENGINEER & SYSTEMS BUILDER
          </motion.p>

          {/* Headline Name */}
          <h1 className="relative mb-2 font-serif text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl leading-none">
            {/* Ambient text glow layer (behind) */}
            <span className="absolute inset-0 select-none pointer-events-none blur-[10px] opacity-75 text-[#00e575]" aria-hidden="true">
              <CharCascade text="Shivam Sourav" delay={0.5} />
            </span>
            {/* Sharp gradient-filled foreground layer */}
            <CharCascade text="Shivam Sourav" delay={0.5} className="relative z-10 gradient-text block" />
          </h1>

          {/* Subheading details */}
          <motion.p
            className="mb-1.5 font-mono text-sm text-text-muted flex items-center gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <span className="text-accent">&gt;</span> @shivamsourav
          </motion.p>

          <motion.p
            className="mb-6 flex items-center gap-2 text-sm text-text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <MapPin size={14} className="text-cyan animate-pulse" />
            Kolkata, India
          </motion.p>

          <motion.p
            className="mb-8 max-w-xl text-base leading-relaxed text-text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            Architecting production-ready RAG platforms, fine-tuning large language models, 
            and deploying low-latency agentic architectures built to scale.
          </motion.p>

          {/* Skill chips */}
          <motion.div
            className="mb-10 flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            {skills.map((skill, i) => (
              <motion.span
                key={skill}
                className="rounded-lg border border-white/5 bg-surface/50 px-3.5 py-1.5 text-xs font-semibold text-text-muted transition-all"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 + i * 0.06, duration: 0.4 }}
                whileHover={{
                  scale: 1.05,
                  borderColor: "rgba(0, 229, 117, 0.4)",
                  color: "#e8ece9",
                  boxShadow: "0 0 16px rgba(0, 229, 117, 0.15)",
                  backgroundColor: "rgba(0, 229, 117, 0.05)"
                }}
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            <MagneticButton href="#projects" primary icon={FileText}>
              View Projects
            </MagneticButton>
            <MagneticButton href="#contact" icon={ChevronRight}>
              Let's Chat
            </MagneticButton>
          </motion.div>
        </div>

        {/* Right Column - Interactive AI Terminal Dashboard */}
        <motion.div
          className="lg:col-span-5 w-full flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.9, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 1.0, duration: 0.8, type: "spring" }}
        >
          <div className="w-full rounded-2xl border border-white/10 bg-[#090e0c]/85 p-6 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]">
            
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-text-dim">
                <TerminalIcon size={12} className="text-accent" />
                shivam_runtime_console
              </div>
            </div>

            {/* Simulated Live Statistics */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: "RAG Latency", val: "12ms", color: "text-accent" },
                { label: "Token Rate", val: "85 t/s", color: "text-cyan" },
                { label: "Search Accuracy", val: "96.5%", color: "text-text" },
                { label: "Active Threads", val: "CamundaSaga", color: "text-text-muted" },
              ].map((stat, i) => (
                <div key={i} className="rounded-xl border border-white/5 bg-[#111a16]/40 p-3 flex flex-col justify-between">
                  <span className="font-mono text-[9px] text-text-dim tracking-wider uppercase">{stat.label}</span>
                  <span className={`font-sans font-bold text-lg ${stat.color} mt-1`}>{stat.val}</span>
                </div>
              ))}
            </div>

            {/* Terminal Logs Block */}
            <div className="rounded-xl bg-[#030504] border border-white/5 p-4 font-mono text-xs text-text-muted min-h-[190px] flex flex-col justify-between overflow-hidden shadow-inner">
              <div className="space-y-2 select-none">
                {logs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-2"
                  >
                    <span className="text-accent shrink-0">$</span>
                    <span className={log.includes("OK") || log.includes("HIT") ? "text-accent" : ""}>
                      {log}
                    </span>
                  </motion.div>
                ))}

              </div>
              <div className="flex items-center gap-1.5 border-t border-white/5 pt-3 mt-3 text-[10px] text-text-dim">
                <Sparkles size={10} className="text-cyan animate-pulse" />
                Live log stream from local context
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
