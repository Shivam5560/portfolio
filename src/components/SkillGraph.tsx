import { useRef, useMemo, useCallback, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Line } from '@react-three/drei';
import * as THREE from 'three';

interface SkillNode {
  id: string;
  label: string;
  category: string;
  position: [number, number, number];
  color: string;
}

interface Edge {
  from: string;
  to: string;
}

const skillData: { nodes: SkillNode[]; edges: Edge[] } = {
  nodes: [
    // Languages
    { id: 'python', label: 'Python', category: 'Languages', position: [-2.5, 1.2, 0], color: '#C47F5A' },
    { id: 'java', label: 'Java 21', category: 'Languages', position: [-2, 0.5, 0.3], color: '#C47F5A' },
    { id: 'ts', label: 'TypeScript', category: 'Languages', position: [-2.2, -0.3, -0.2], color: '#C47F5A' },
    { id: 'sql', label: 'SQL', category: 'Languages', position: [-2.8, -0.8, 0.1], color: '#C47F5A' },
    // AI/ML
    { id: 'pytorch', label: 'PyTorch', category: 'AI/ML', position: [-0.8, 1.8, 0.4], color: '#8B5E7C' },
    { id: 'tensorflow', label: 'TensorFlow', category: 'AI/ML', position: [-0.3, 1.5, -0.2], color: '#8B5E7C' },
    { id: 'huggingface', label: 'HF', category: 'AI/ML', position: [0.2, 1.7, 0.1], color: '#8B5E7C' },
    { id: 'llamaindex', label: 'LlamaIndex', category: 'AI/ML', position: [0.8, 1.4, -0.3], color: '#8B5E7C' },
    { id: 'langchain', label: 'LangChain', category: 'AI/ML', position: [0.6, 1.0, 0.2], color: '#8B5E7C' },
    { id: 'scikitlearn', label: 'Scikit', category: 'AI/ML', position: [-1.2, 0.9, -0.1], color: '#8B5E7C' },
    // LLM & RAG
    { id: 'rag', label: 'RAG', category: 'LLM & RAG', position: [1.5, 1.5, 0.1], color: '#5B8A9E' },
    { id: 'pinecone', label: 'Pinecone', category: 'LLM & RAG', position: [2.0, 1.0, -0.2], color: '#5B8A9E' },
    { id: 'pgvector', label: 'pgvector', category: 'LLM & RAG', position: [1.8, 0.5, 0.3], color: '#5B8A9E' },
    { id: 'cohere', label: 'Cohere', category: 'LLM & RAG', position: [2.3, 1.3, 0.0], color: '#5B8A9E' },
    { id: 'groq', label: 'Groq', category: 'LLM & RAG', position: [2.5, 0.8, -0.1], color: '#5B8A9E' },
    // Backend
    { id: 'spring', label: 'Spring Boot', category: 'Backend', position: [-1.5, -1.2, 0.3], color: '#A0C8B0' },
    { id: 'fastapi', label: 'FastAPI', category: 'Backend', position: [-0.8, -1.5, -0.2], color: '#A0C8B0' },
    { id: 'nextjs', label: 'Next.js', category: 'Backend', position: [-2.0, -1.8, 0.0], color: '#A0C8B0' },
    { id: 'camunda', label: 'Camunda', category: 'Backend', position: [-1.2, -1.8, 0.2], color: '#A0C8B0' },
    // Data
    { id: 'postgres', label: 'PostgreSQL', category: 'Data', position: [0.8, -1.5, 0.1], color: '#C6AC8F' },
    { id: 'mongodb', label: 'MongoDB', category: 'Data', position: [1.2, -1.0, -0.3], color: '#C6AC8F' },
    { id: 'redis', label: 'Redis', category: 'Data', position: [1.5, -1.3, 0.2], color: '#C6AC8F' },
    // Tools
    { id: 'docker', label: 'Docker', category: 'Tools', position: [2.2, -1.0, -0.1], color: '#5B3A29' },
    { id: 'git', label: 'Git', category: 'Tools', position: [2.5, -1.5, 0.1], color: '#5B3A29' },
  ],
  edges: [
    { from: 'python', to: 'pytorch' }, { from: 'python', to: 'tensorflow' },
    { from: 'python', to: 'fastapi' }, { from: 'python', to: 'scikitlearn' },
    { from: 'python', to: 'llamaindex' }, { from: 'python', to: 'langchain' },
    { from: 'java', to: 'spring' }, { from: 'ts', to: 'nextjs' },
    { from: 'pytorch', to: 'huggingface' }, { from: 'tensorflow', to: 'huggingface' },
    { from: 'llamaindex', to: 'rag' }, { from: 'langchain', to: 'rag' },
    { from: 'rag', to: 'pinecone' }, { from: 'rag', to: 'pgvector' },
    { from: 'rag', to: 'cohere' }, { from: 'rag', to: 'groq' },
    { from: 'spring', to: 'camunda' }, { from: 'spring', to: 'postgres' },
    { from: 'fastapi', to: 'postgres' }, { from: 'fastapi', to: 'redis' },
    { from: 'nextjs', to: 'postgres' }, { from: 'sql', to: 'postgres' },
    { from: 'sql', to: 'mongodb' }, { from: 'docker', to: 'spring' },
    { from: 'docker', to: 'fastapi' }, { from: 'git', to: 'python' },
    { from: 'git', to: 'java' }, { from: 'scikitlearn', to: 'pytorch' },
  ],
};

function ParticleNode({ node, isHovered, onHover }: {
  node: SkillNode;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      if (isHovered) {
        const s = 1 + Math.sin(Date.now() * 0.01) * 0.2;
        meshRef.current.scale.setScalar(s);
        if (glowRef.current) glowRef.current.scale.setScalar(s * 1.8);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        if (glowRef.current) glowRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <group position={node.position}>
      {/* Glow ring */}
      <mesh
        ref={glowRef}
        onPointerEnter={() => onHover(node.id)}
        onPointerLeave={() => onHover(null)}
      >
        <ringGeometry args={[0.1, 0.13, 32]} />
        <meshBasicMaterial color={node.color} transparent opacity={isHovered ? 0.6 : 0.15} side={THREE.DoubleSide} />
      </mesh>
      {/* Core sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color={node.color} transparent opacity={isHovered ? 1 : 0.5} />
      </mesh>
      {/* Label */}
      <Text
        position={[0, -0.16, 0]}
        fontSize={0.08}
        color={isHovered ? node.color : '#C6AC8F'}
        anchorX="center"
        anchorY="top"
      >
        {node.label}
      </Text>
    </group>
  );
}

function ConnectionLines({ nodes, edges, hoveredId }: {
  nodes: SkillNode[];
  edges: Edge[];
  hoveredId: string | null;
}) {
  const nodeMap = useMemo(() => {
    const m = new Map<string, [number, number, number]>();
    nodes.forEach((n) => m.set(n.id, n.position));
    return m;
  }, [nodes]);

  const lines = useMemo(() => {
    return edges
      .map((e) => {
        const from = nodeMap.get(e.from);
        const to = nodeMap.get(e.to);
        if (!from || !to) return null;
        const connected = hoveredId === e.from || hoveredId === e.to;
        return { key: `${e.from}-${e.to}`, from, to, connected };
      })
      .filter(Boolean) as { key: string; from: [number, number, number]; to: [number, number, number]; connected: boolean }[];
  }, [edges, nodeMap, hoveredId]);

  return (
    <>
      {lines.map(({ key, from, to, connected }) => (
        <Line
          key={key}
          points={[from, to]}
          color={connected ? '#C47F5A' : '#C6AC8F'}
          lineWidth={connected ? 1.5 : 0.5}
          transparent
          opacity={connected ? 0.6 : 0.15}
        />
      ))}
    </>
  );
}

function Scene() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  const onHover = useCallback((id: string | null) => setHoveredId(id), []);

  return (
    <group ref={groupRef}>
      <ConnectionLines nodes={skillData.nodes} edges={skillData.edges} hoveredId={hoveredId} />
      {skillData.nodes.map((node) => (
        <ParticleNode
          key={node.id}
          node={node}
          isHovered={hoveredId === node.id}
          onHover={onHover}
        />
      ))}
    </group>
  );
}

export default function SkillGraph() {
  const prefersReduced = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) return null;

  return (
    <div className="absolute inset-0 hidden md:block" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        scene={{ background: null }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <Scene />
      </Canvas>
    </div>
  );
}
