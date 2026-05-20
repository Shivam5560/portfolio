import { motion } from "framer-motion";
import Reveal, { StaggerContainer, StaggerItem } from "./Reveal";
import { Code2, Microchip, Globe, Server, Database, Wrench } from "lucide-react";

const skillGroups = [
  {
    title: "Languages",
    icon: Code2,
    skills: ["Python", "Java 21", "TypeScript", "SQL", "R", "C", "HTML/CSS"],
  },
  {
    title: "AI & ML",
    icon: Microchip,
    skills: ["TensorFlow", "PyTorch", "Scikit-Learn", "Hugging Face", "LlamaIndex", "LangChain", "XGBoost", "NLTK", "spaCy", "Ollama"],
  },
  {
    title: "LLM & RAG",
    icon: Globe,
    skills: ["RAG Pipelines", "Vector Databases", "Pinecone", "pgvector", "Cohere", "Groq", "Semantic Caching", "Hybrid Search", "Reranking", "Langfuse", "RAGAS"],
  },
  {
    title: "Backend & Cloud",
    icon: Server,
    skills: ["Spring Boot", "FastAPI", "Next.js", "REST APIs", "GraphQL", "Camunda", "Spring Cloud Gateway", "Eureka", "Redis", "Apache Tomcat", "ActiveMQ"],
  },
  {
    title: "Data & Databases",
    icon: Database,
    skills: ["PostgreSQL", "MongoDB", "OracleDB", "Pandas", "NumPy", "PySpark", "Power BI", "Tableau", "Looker", "Matplotlib", "Seaborn"],
  },
  {
    title: "Tools & Practices",
    icon: Wrench,
    skills: ["Git", "GitHub", "Jenkins", "Maven", "Docker", "Supabase", "Microservices", "Rate Limiting", "SSO", "Saga Pattern", "CI/CD"],
  },
];

function SkillGroup({ group }: { group: typeof skillGroups[0] }) {
  const Icon = group.icon;
  return (
    <StaggerItem>
      <motion.div
        className="rounded-2xl border border-sand-light bg-canvas p-6"
        whileHover={{
          y: -4,
          borderColor: "rgba(196,127,90,0.2)",
          boxShadow: "0 8px 24px rgba(196,127,90,0.04)",
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <h3 className="mb-4 flex items-center gap-2 font-serif text-base font-semibold text-ink">
          <Icon size={16} className="text-terracotta" />
          {group.title}
        </h3>
        <div className="flex flex-wrap gap-2">
          {group.skills.map((skill) => (
            <motion.span
              key={skill}
              className="cursor-default rounded-full border border-sand-light/60 bg-parchment/50 px-3 py-1 text-xs font-medium text-ink/60"
              whileHover={{
                scale: 1.08,
                borderColor: "rgba(196,127,90,0.3)",
                color: "#C47F5A",
                backgroundColor: "rgba(196,127,90,0.06)",
              }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </StaggerItem>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="section-label mb-3 block">Skills</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mb-12 font-serif text-3xl font-semibold sm:text-4xl gradient-text">
            Technologies I work with
          </h2>
        </Reveal>

        <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
          {skillGroups.map((g) => (
            <SkillGroup key={g.title} group={g} />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
