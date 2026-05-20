import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function GeometricShapes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
      groupRef.current.rotation.x += delta * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Icosahedron — terracotta wireframe */}
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh position={[-2.5, 0.8, 0]}>
          <icosahedronGeometry args={[0.6, 0]} />
          <meshBasicMaterial
            color="#C47F5A"
            wireframe
            transparent
            opacity={0.18}
          />
        </mesh>
      </Float>

      {/* Torus Knot — plum wireframe */}
      <Float speed={0.9} rotationIntensity={0.25} floatIntensity={0.5}>
        <mesh position={[2.2, -0.6, -0.5]}>
          <torusKnotGeometry args={[0.45, 0.12, 64, 8]} />
          <meshBasicMaterial
            color="#8B5E7C"
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>
      </Float>

      {/* Octahedron — dusty blue */}
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.35}>
        <mesh position={[0.8, 1.5, -1]}>
          <octahedronGeometry args={[0.35, 0]} />
          <meshBasicMaterial
            color="#5B8A9E"
            wireframe
            transparent
            opacity={0.14}
          />
        </mesh>
      </Float>

      {/* Small sphere particles — embedding space dots */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.6}>
        <mesh position={[-1.5, -1.2, -0.8]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#C47F5A" transparent opacity={0.25} />
        </mesh>
      </Float>
      <Float speed={1.7} rotationIntensity={0.1} floatIntensity={0.5}>
        <mesh position={[1.8, 0.3, -0.6]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#8B5E7C" transparent opacity={0.2} />
        </mesh>
      </Float>
      <Float speed={2.2} rotationIntensity={0.1} floatIntensity={0.7}>
        <mesh position={[-0.5, -0.8, -0.4]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color="#5B8A9E" transparent opacity={0.22} />
        </mesh>
      </Float>
      <Float speed={1.3} rotationIntensity={0.1} floatIntensity={0.45}>
        <mesh position={[2.8, 1, -1.2]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#A0C8B0" transparent opacity={0.18} />
        </mesh>
      </Float>
    </group>
  );
}

export default function ThreeScene() {
  const prefersReduced = typeof window !== "undefined"
    && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) return null;

  return (
    <div className="absolute inset-0 -z-5 hidden md:block" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <GeometricShapes />
      </Canvas>
    </div>
  );
}
