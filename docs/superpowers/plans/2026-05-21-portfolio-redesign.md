# Portfolio Redesign — Warm Editorial × Shaders × 3D

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the dark-themed portfolio into a warm editorial light-theme portfolio with GLSL shader background, 3D geometric elements, and AI/ML creative motifs.

**Architecture:** Keep the existing Vite + React 19 + Tailwind 4 + Framer Motion 12 stack. Add @react-three/fiber for 3D and a canvas-based GLSL shader for the background. Rewrite all components with the new warm-light color system, Georgia serif typography, and enhanced animations. Two new components (ShaderBackground, ThreeScene) provide the hero visual effects. Existing CursorGlow and MeshGradient are removed.

**Tech Stack:** React 19, TypeScript 6, Tailwind CSS 4, Framer Motion 12, Three.js, @react-three/fiber, @react-three/drei, Vite 8

---

### Task 1: Install new dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install three.js and React Three Fiber packages**

Run: `npm install three @react-three/fiber @react-three/drei`

Expected: Packages added to package.json and node_modules. No errors.

- [ ] **Step 2: Install type definitions**

Run: `npm install -D @types/three`

Expected: @types/three added to devDependencies.

- [ ] **Step 3: Verify installation**

Run: `npx tsc --noEmit`

Expected: No type errors from new packages.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add three, @react-three/fiber, @react-three/drei for 3D and shader effects"
```

---

### Task 2: Rewrite theme tokens in index.css

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Replace the entire index.css with warm-light theme**

Write `src/index.css`:

```css
@import "tailwindcss";

@theme {
  --color-canvas: #FCF9F5;
  --color-parchment: #F5EDE4;
  --color-parchment-alt: #EDE5DA;
  --color-terracotta: #C47F5A;
  --color-terracotta-dim: rgba(196, 127, 90, 0.12);
  --color-plum: #8B5E7C;
  --color-plum-dim: rgba(139, 94, 124, 0.1);
  --color-dusty-blue: #5B8A9E;
  --color-dusty-blue-dim: rgba(91, 138, 158, 0.1);
  --color-sage: #A0C8B0;
  --color-ink: #0A0908;
  --color-sand: #C6AC8F;
  --color-sand-light: #E0D5C5;
  --color-warm-brown: #5B3A29;
  --font-serif: "Georgia", "Times New Roman", serif;
  --font-sans: "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif;
  --font-mono: "SF Mono", "JetBrains Mono", ui-monospace, monospace;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  background: var(--color-canvas);
  color: var(--color-ink);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::selection {
  background: rgba(196, 127, 90, 0.25);
  color: var(--color-ink);
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--color-canvas); }
::-webkit-scrollbar-thumb { background: var(--color-sand-light); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--color-terracotta); }

/* Floating animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Gradient text utility */
.gradient-text {
  background: linear-gradient(135deg, #5B3A29 0%, #C47F5A 40%, #8B5E7C 70%, #5B8A9E 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Typing cursor */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.typing-cursor::after {
  content: '|';
  animation: blink 1s step-end infinite;
  color: var(--color-terracotta);
  margin-left: 2px;
}

/* Glass effect for navbar */
.glass-light {
  background: rgba(252, 249, 245, 0.75);
  backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid rgba(198, 172, 143, 0.2);
}

/* Section label */
.section-label {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.8125rem;
  color: var(--color-sand);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
```

- [ ] **Step 2: Verify the dev server starts without CSS errors**

Run: `npm run dev`
Expected: Vite starts successfully, no CSS compilation errors in terminal.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: replace dark theme with warm editorial light theme tokens"
```

---

### Task 3: Update index.html fonts

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Swap font imports**

Replace the Google Fonts link in `<head>` to remove Space Grotesk (serif headings now use Georgia) and keep DM Sans for UI.

Edit `index.html` — replace the two font link tags:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet" />
```

Remove the Space Grotesk line entirely. Georgia is a system font, no import needed.

Also update the theme-color meta tag:

```html
<meta name="theme-color" content="#FCF9F5" />
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: update fonts to warm editorial system (Georgia serif + DM Sans)"
```

---

### Task 4: Create ShaderBackground component

**Files:**
- Create: `src/components/ShaderBackground.tsx`

- [ ] **Step 1: Write the shader background component**

Write `src/components/ShaderBackground.tsx`:

```tsx
import { useEffect, useRef } from "react";

// GLSL fragment shader — warm gradient noise
const fragShader = `
precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

// Simplex-like noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 mouseInfluence = uMouse * 0.15;

  float n1 = snoise(uv * 2.5 + uTime * 0.08 + mouseInfluence);
  float n2 = snoise(uv * 3.8 - uTime * 0.06 + mouseInfluence * 1.3);
  float n3 = snoise(uv * 1.7 + uTime * 0.05 + mouseInfluence * 0.7);

  // Warm palette: terracotta, plum, dusty blue, cream
  vec3 terracotta = vec3(0.769, 0.498, 0.353);
  vec3 plum = vec3(0.545, 0.369, 0.486);
  vec3 dustyBlue = vec3(0.357, 0.541, 0.620);
  vec3 cream = vec3(0.988, 0.976, 0.961);

  float blend1 = smoothstep(-0.3, 0.6, n1);
  float blend2 = smoothstep(-0.3, 0.6, n2);

  vec3 color = mix(cream, terracotta, blend1 * 0.06);
  color = mix(color, plum, blend2 * 0.05);
  color = mix(color, dustyBlue, n3 * 0.04);

  // Subtle vignette
  float vignette = 1.0 - length(uv - 0.5) * 0.5;
  color *= 0.92 + vignette * 0.08;

  gl_FragColor = vec4(color, 1.0);
}
`;

const vertexShader = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    // Compile shaders
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn("Shader compile error:", gl.getShaderInfoLog(s));
      }
      return s;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexShader));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragShader));
    gl.linkProgram(program);
    gl.useProgram(program);

    // Full-screen quad
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "uTime");
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uRes = gl.getUniformLocation(program, "uResolution");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1.0 - e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    let start = performance.now();
    const render = (now: number) => {
      gl.uniform1f(uTime, (now - start) * 0.001);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animFrameRef.current = requestAnimationFrame(render);
    };
    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      gl.deleteProgram(program);
    };
  }, []);

  const prefersReduced = typeof window !== "undefined"
    && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    return (
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: "linear-gradient(180deg, #FCF9F5 0%, #F5EDE4 50%, #FCF9F5 100%)",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 hidden md:block"
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 2: Verify the component compiles**

Run: `npx tsc --noEmit`
Expected: No TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ShaderBackground.tsx
git commit -m "feat: add GLSL shader background with warm gradient noise"
```

---

### Task 5: Create ThreeScene component

**Files:**
- Create: `src/components/ThreeScene.tsx`

- [ ] **Step 1: Write the 3D scene component**

Write `src/components/ThreeScene.tsx`:

```tsx
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function GeometricShapes() {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Gentle autonomous rotation
      groupRef.current.rotation.y += delta * 0.08;
      groupRef.current.rotation.x += delta * 0.04;
    }
  });

  // Track mouse for parallax
  if (typeof window !== "undefined") {
    window.addEventListener("mousemove", (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    }, { passive: true, once: false });
  }

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
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ThreeScene.tsx
git commit -m "feat: add 3D geometric scene with floating wireframe shapes"
```

---

### Task 6: Update Reveal component with enhanced variants

**Files:**
- Modify: `src/components/Reveal.tsx`

- [ ] **Step 1: Rewrite Reveal with attention-blur transition and token cascade variant**

Write `src/components/Reveal.tsx`:

```tsx
import { motion, useInView, type Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
  blur?: boolean;
}

export default function Reveal({
  children,
  className = "",
  delay = 0,
  duration = 0.7,
  y = 32,
  once = true,
  blur = false,
}: RevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, filter: blur ? "blur(8px)" : "blur(0px)" }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y, filter: blur ? "blur(8px)" : "blur(0px)" }
      }
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger container — unchanged logic, updated styles
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.08,
}: StaggerContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger item — token cascade feel
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

// Character cascade — staggered character animation like token streaming
interface CharCascadeProps {
  text: string;
  className?: string;
  delay?: number;
}

export function CharCascade({ text, className = "", delay = 0 }: CharCascadeProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const chars = text.split("");

  return (
    <span ref={ref} className={className} aria-label={text}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className={`inline-block ${char === " " ? "w-[0.3em]" : ""}`}
          initial={{ opacity: 0, y: 20, filter: "blur(3px)" }}
          animate={
            isInView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 20, filter: "blur(3px)" }
          }
          transition={{
            duration: 0.35,
            delay: delay + i * 0.03,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </span>
  );
}
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Reveal.tsx
git commit -m "feat: enhance Reveal with blur transitions and CharCascade for token-stream effect"
```

---

### Task 7: Redesign Navbar component

**Files:**
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Rewrite Navbar with warm-light styling**

Write `src/components/Navbar.tsx`:

```tsx
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-light" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <motion.a
          href="#"
          className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-terracotta font-serif text-lg font-bold text-terracotta"
          whileHover={{
            scale: 1.1,
            boxShadow: "0 0 20px rgba(196, 127, 90, 0.2)",
          }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          SS
        </motion.a>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="relative rounded-lg px-4 py-2 text-sm font-medium text-sand transition-colors hover:text-terracotta"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {link.label}
            </motion.a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <motion.a
            href="https://github.com/Shivam5560"
            target="_blank"
            rel="noreferrer"
            className="text-sand hover:text-terracotta transition-colors"
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <GithubIcon width={18} height={18} />
          </motion.a>
          <motion.a
            href="https://www.linkedin.com/in/shivam-sourav-b889aa204/"
            target="_blank"
            rel="noreferrer"
            className="text-sand hover:text-terracotta transition-colors"
            whileHover={{ scale: 1.2, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <LinkedinIcon width={18} height={18} />
          </motion.a>
          <motion.a
            href="mailto:shivamsourav2003@gmail.com"
            className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-canvas transition-all hover:bg-terracotta"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 4px 24px rgba(196, 127, 90, 0.25)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail size={14} className="inline mr-1" /> Hire me
          </motion.a>
        </div>
      </div>
    </motion.header>
  );
}
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: redesign Navbar with warm-light glass effect and ink CTA"
```

---

### Task 8: Redesign Hero component with shader + 3D + editorial

**Files:**
- Modify: `src/components/Hero.tsx`

- [ ] **Step 1: Rewrite Hero with shader, 3D scene, gradient name, skill chips**

Write `src/components/Hero.tsx`:

```tsx
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import { MapPin, FileText, ArrowDown } from "lucide-react";
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
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: redesign Hero with gradient text, token-cascade name, warm skill chips"
```

---

### Task 9: Redesign About component

**Files:**
- Modify: `src/components/About.tsx`

- [ ] **Step 1: Rewrite About with editorial two-column layout**

Write `src/components/About.tsx`:

```tsx
import { motion } from "framer-motion";
import Reveal from "./Reveal";

const highlights = [
  { label: "CGPA", value: "9.7", suffix: "/10" },
  { label: "Experience", value: "2+", suffix: "years" },
  { label: "Projects", value: "10+", suffix: "shipped" },
];

export default function About() {
  return (
    <section id="about" className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="section-label mb-3 block">About</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mb-12 font-serif text-3xl font-semibold sm:text-4xl gradient-text">
            Who I am
          </h2>
        </Reveal>

        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          {/* Left: prose */}
          <Reveal delay={0.15}>
            <div className="font-serif text-base leading-relaxed text-ink/75 space-y-5">
              <p>
                I'm an AI/ML Engineer and Associate Software Engineer passionate about
                building intelligent systems that solve real problems. My work spans
                Retrieval-Augmented Generation, LLM fine-tuning, and production
                microservices.
              </p>
              <p>
                Currently pursuing my B.Tech, I've shipped 10+ AI projects —
                from a production-grade RAG system with hybrid search to an AI-powered
                Text2SQL platform. I thrive at the intersection of research and
                engineering.
              </p>
              <p>
                When I'm not training models or designing vector search pipelines, I'm
                exploring new AI architectures, contributing to open-source, and pushing
                the boundaries of what language models can do.
              </p>
            </div>
          </Reveal>

          {/* Right: stats + highlights */}
          <div className="space-y-6">
            <Reveal delay={0.25}>
              <div className="grid grid-cols-3 gap-4">
                {highlights.map((h) => (
                  <motion.div
                    key={h.label}
                    className="flex flex-col items-center rounded-2xl border border-sand-light bg-parchment/50 p-5"
                    whileHover={{
                      scale: 1.04,
                      borderColor: "rgba(196,127,90,0.3)",
                      boxShadow: "0 8px 24px rgba(196,127,90,0.06)",
                    }}
                  >
                    <span className="font-serif text-2xl font-bold text-terracotta">
                      {h.value}
                    </span>
                    <span className="text-xs text-sand">{h.suffix}</span>
                    <span className="mt-1 text-xs font-medium text-ink/60">{h.label}</span>
                  </motion.div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.35}>
              <div className="rounded-2xl border border-sand-light bg-parchment/50 p-6">
                <h3 className="mb-3 font-serif text-lg font-semibold text-ink">
                  Current Focus
                </h3>
                <ul className="space-y-2 text-sm text-ink/65">
                  {[
                    "Advanced RAG architectures with hybrid retrieval",
                    "LLM fine-tuning with LoRA and QLoRA",
                    "Vector databases and embedding strategies",
                    "Building scalable AI microservices",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/About.tsx
git commit -m "feat: redesign About with editorial two-column layout and warm stat cards"
```

---

### Task 10: Redesign Experience component

**Files:**
- Modify: `src/components/Experience.tsx`

- [ ] **Step 1: Rewrite Experience with warm timeline cards**

Write `src/components/Experience.tsx`:

```tsx
import { motion } from "framer-motion";
import Reveal, { StaggerContainer, StaggerItem } from "./Reveal";
import { Briefcase, Calendar } from "lucide-react";

interface Role {
  title: string;
  company: string;
  period: string;
  description: string[];
}

const experiences: Role[] = [
  {
    title: "Associate Software Engineer",
    company: "Tech Mahindra",
    period: "2024 — Present",
    description: [
      "Building and maintaining scalable microservices in production",
      "Developing AI-powered internal tools for process automation",
      "Collaborating with cross-functional teams on enterprise solutions",
    ],
  },
  {
    title: "AI/ML Intern",
    company: "Omdena",
    period: "2023 — 2024",
    description: [
      "Collaborated with 40+ international AI engineers on crop disease detection",
      "Built computer vision models for agricultural applications in Kenya",
      "Contributed to data preprocessing and model evaluation pipelines",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="relative px-6 py-32 bg-parchment/30">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <span className="section-label mb-3 block">Experience</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mb-12 font-serif text-3xl font-semibold sm:text-4xl gradient-text">
            Where I've worked
          </h2>
        </Reveal>

        <StaggerContainer className="relative space-y-0" staggerDelay={0.15}>
          {/* Timeline line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-sand-light" />

          {experiences.map((exp, i) => (
            <StaggerItem key={exp.company}>
              <motion.div
                className="relative pl-14 pb-14 last:pb-0"
                whileHover={{ x: 4 }}
              >
                {/* Timeline dot */}
                <div className="absolute left-[12px] top-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full border-2 border-terracotta bg-canvas">
                  <div className="h-[5px] w-[5px] rounded-full bg-terracotta" />
                </div>

                <div className="rounded-2xl border border-sand-light bg-canvas p-6 transition-shadow hover:shadow-[0_8px_32px_rgba(196,127,90,0.06)]">
                  <div className="mb-1 flex items-center gap-2 text-xs font-medium text-terracotta">
                    <Briefcase size={12} />
                    {exp.company}
                  </div>
                  <h3 className="mb-1 font-serif text-xl font-semibold text-ink">
                    {exp.title}
                  </h3>
                  <p className="mb-4 flex items-center gap-1.5 text-xs text-sand">
                    <Calendar size={11} />
                    {exp.period}
                  </p>
                  <ul className="space-y-2">
                    {exp.description.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm leading-relaxed text-ink/65"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta/50" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Experience.tsx
git commit -m "feat: redesign Experience with warm timeline cards and dot indicators"
```

---

### Task 11: Redesign Projects component

**Files:**
- Modify: `src/components/Projects.tsx`

- [ ] **Step 1: Rewrite Projects with enhanced tilt cards, warm styling**

Write `src/components/Projects.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Projects.tsx
git commit -m "feat: redesign Projects with warm-card styling and enhanced tilt effects"
```

---

### Task 12: Redesign Skills component

**Files:**
- Modify: `src/components/Skills.tsx`

- [ ] **Step 1: Rewrite Skills with animated category cards**

Write `src/components/Skills.tsx`:

```tsx
import { motion } from "framer-motion";
import Reveal, { StaggerContainer, StaggerItem } from "./Reveal";

interface SkillCategory {
  name: string;
  items: string[];
}

const skillCategories: SkillCategory[] = [
  {
    name: "AI & Machine Learning",
    items: ["RAG Systems", "LLM Fine-tuning", "LoRA/QLoRA", "LangChain", "LlamaIndex", "Hugging Face", "Prompt Engineering"],
  },
  {
    name: "Backend & Data",
    items: ["Python", "FastAPI", "PostgreSQL", "pgvector", "Pinecone", "Redis", "Docker"],
  },
  {
    name: "Frontend & Tools",
    items: ["Next.js", "TypeScript", "React", "Tailwind CSS", "Git", "Linux", "REST APIs"],
  },
  {
    name: "ML Ops & Cloud",
    items: ["AWS (S3, EC2)", "Model Deployment", "CI/CD", "Vector Databases", "Streaming"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="relative px-6 py-32 bg-parchment/30">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <span className="section-label mb-3 block">Skills</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mb-12 font-serif text-3xl font-semibold sm:text-4xl gradient-text">
            Tech I work with
          </h2>
        </Reveal>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2" staggerDelay={0.1}>
          {skillCategories.map((cat) => (
            <StaggerItem key={cat.name}>
              <motion.div
                className="rounded-2xl border border-sand-light bg-canvas p-6"
                whileHover={{
                  borderColor: "rgba(196,127,90,0.2)",
                  boxShadow: "0 4px 20px rgba(196,127,90,0.04)",
                }}
              >
                <h3 className="mb-4 font-serif text-lg font-semibold text-ink">
                  {cat.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((skill, i) => (
                    <motion.span
                      key={skill}
                      className="rounded-full border border-sand-light/60 bg-parchment/50 px-3 py-1 text-xs font-medium text-ink/60"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.04 }}
                      whileHover={{
                        scale: 1.06,
                        borderColor: "rgba(196,127,90,0.3)",
                        color: "#C47F5A",
                        backgroundColor: "rgba(196,127,90,0.06)",
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Skills.tsx
git commit -m "feat: redesign Skills with warm category cards and animated chips"
```

---

### Task 13: Redesign Education component

**Files:**
- Modify: `src/components/Education.tsx`

- [ ] **Step 1: Rewrite Education with clean warm styling**

Write `src/components/Education.tsx`:

```tsx
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import { GraduationCap } from "lucide-react";

const education = [
  {
    degree: "B.Tech in Computer Science",
    school: "Your University",
    period: "2021 — 2025",
    detail: "CGPA: 9.7/10",
  },
];

export default function Education() {
  return (
    <section id="education" className="relative px-6 py-32">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <span className="section-label mb-3 block">Education</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mb-12 font-serif text-3xl font-semibold sm:text-4xl gradient-text">
            Academic background
          </h2>
        </Reveal>

        {education.map((edu, i) => (
          <Reveal key={edu.degree} delay={0.15 + i * 0.1}>
            <motion.div
              className="rounded-2xl border border-sand-light bg-parchment/40 p-8"
              whileHover={{
                borderColor: "rgba(196,127,90,0.2)",
                boxShadow: "0 4px 20px rgba(196,127,90,0.04)",
              }}
            >
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-terracotta">
                <GraduationCap size={16} />
                {edu.period}
              </div>
              <h3 className="mb-1 font-serif text-xl font-semibold text-ink">
                {edu.degree}
              </h3>
              <p className="text-sm text-ink/55">{edu.school}</p>
              <p className="mt-3 inline-block rounded-full border border-sand-light bg-canvas px-4 py-1 text-sm font-medium text-terracotta">
                {edu.detail}
              </p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Education.tsx
git commit -m "feat: redesign Education with warm card and clean layout"
```

---

### Task 14: Redesign Contact component

**Files:**
- Modify: `src/components/Contact.tsx`

- [ ] **Step 1: Rewrite Contact with warm link cluster**

Write `src/components/Contact.tsx`:

```tsx
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";

const contactLinks = [
  { label: "Email", value: "shivamsourav2003@gmail.com", href: "mailto:shivamsourav2003@gmail.com", icon: Mail },
  { label: "GitHub", value: "Shivam5560", href: "https://github.com/Shivam5560", icon: GithubIcon },
  { label: "LinkedIn", value: "shivam-sourav", href: "https://www.linkedin.com/in/shivam-sourav-b889aa204/", icon: LinkedinIcon },
  { label: "Location", value: "Kolkata, India", href: null, icon: MapPin },
];

export default function Contact() {
  return (
    <section id="contact" className="relative px-6 py-32 bg-parchment/30">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <span className="section-label mb-3 block">Contact</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mb-4 font-serif text-3xl font-semibold sm:text-4xl gradient-text">
            Let's connect
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mb-12 text-ink/55">
            I'm always open to discussing AI projects, research collaborations, or
            just geeking out about language models.
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="grid gap-3 sm:grid-cols-2">
            {contactLinks.map((link) => {
              const Icon = link.icon;
              const Component = link.href ? motion.a : motion.div;
              const props = link.href
                ? { href: link.href, target: link.href.startsWith("mailto") ? undefined : "_blank", rel: link.href.startsWith("mailto") ? undefined : "noreferrer" }
                : {};

              return (
                <Component
                  key={link.label}
                  {...props}
                  className="flex items-center gap-4 rounded-2xl border border-sand-light bg-canvas p-5 text-left transition-colors hover:border-terracotta/30"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 4px 20px rgba(196,127,90,0.05)",
                  }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-terracotta-dim text-terracotta">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-sand">{link.label}</div>
                    <div className="truncate text-sm font-semibold text-ink">
                      {link.value}
                    </div>
                  </div>
                  {link.href && (
                    <ArrowUpRight size={14} className="shrink-0 text-sand" />
                  )}
                </Component>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <motion.a
            href="mailto:shivamsourav2003@gmail.com"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-canvas transition-colors hover:bg-terracotta"
            whileHover={{
              scale: 1.04,
              boxShadow: "0 8px 32px rgba(196,127,90,0.3)",
            }}
            whileTap={{ scale: 0.96 }}
          >
            <Mail size={16} />
            Send me an email
          </motion.a>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Contact.tsx
git commit -m "feat: redesign Contact with warm link cards and ink CTA"
```

---

### Task 15: Redesign Footer component

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Rewrite Footer minimal ink-on-cream**

Write `src/components/Footer.tsx`:

```tsx
import { GithubIcon, LinkedinIcon } from "./Icons";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-sand-light bg-canvas px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2 font-serif text-sm text-sand">
          <span className="text-terracotta">SS</span>
          <span>Shivam Sourav</span>
          <span className="text-sand-light">·</span>
          <span>AI/ML Engineer</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Shivam5560"
            target="_blank"
            rel="noreferrer"
            className="text-sand transition-colors hover:text-terracotta"
          >
            <GithubIcon width={16} height={16} />
          </a>
          <a
            href="https://www.linkedin.com/in/shivam-sourav-b889aa204/"
            target="_blank"
            rel="noreferrer"
            className="text-sand transition-colors hover:text-terracotta"
          >
            <LinkedinIcon width={16} height={16} />
          </a>
          <a
            href="mailto:shivamsourav2003@gmail.com"
            className="text-sand transition-colors hover:text-terracotta"
          >
            <Mail size={16} />
          </a>
        </div>

        <p className="text-xs text-sand-light">
          Built with React, Tailwind & Framer Motion
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: redesign Footer with minimal ink-on-cream styling"
```

---

### Task 16: Update App.tsx to wire everything together

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace App.tsx to include shader, 3D, remove old components**

Write `src/App.tsx`:

```tsx
import { Suspense, lazy } from "react";
import ShaderBackground from "./components/ShaderBackground";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

const ThreeScene = lazy(() => import("./components/ThreeScene"));

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas">
      {/* Shader background (desktop only) */}
      <ShaderBackground />

      {/* 3D geometric elements in hero (desktop only, lazy loaded) */}
      <Suspense fallback={null}>
        <ThreeScene />
      </Suspense>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}

export default App;
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire App with shader background, lazy-loaded 3D scene, all redesigned sections"
```

---

### Task 17: Clean up unused files

**Files:**
- Delete: `src/components/MeshGradient.tsx`
- Delete: `src/components/CursorGlow.tsx`

- [ ] **Step 1: Remove old dark-theme components**

```bash
rm src/components/MeshGradient.tsx
rm src/components/CursorGlow.tsx
```

- [ ] **Step 2: Verify no imports reference deleted files**

Run: `npx tsc --noEmit`
Expected: No errors (no stale imports).

- [ ] **Step 3: Commit**

```bash
git add src/components/MeshGradient.tsx src/components/CursorGlow.tsx
git commit -m "chore: remove old dark-theme components (MeshGradient, CursorGlow)"
```

---

### Task 18: Visual verification and polish

**Files:**
- No specific files — visual QA pass

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

- [ ] **Step 2: Check the page loads without errors**

Open `http://localhost:5173` in browser.
Expected: Page renders with warm cream background, gradient hero text, all sections visible.

- [ ] **Step 3: Verify shader background (desktop only)**

Resize to > 768px width.
Expected: Warm gradient noise flowing in background, subtle mouse interaction.

- [ ] **Step 4: Verify 3D shapes in hero (desktop only)**

Expected: Wireframe geometric shapes (icosahedron, torus knot, octahedron) floating in hero background with gentle rotation.

- [ ] **Step 5: Verify animations**

Scroll through all sections.
Expected: Staggered reveals, blur-to-focus transitions, character cascade on name, tilt effect on project cards, magnetic buttons.

- [ ] **Step 6: Verify mobile (≤768px)**

Expected: Shader and 3D hidden, CSS gradient fallback background, all content readable, animations work.

- [ ] **Step 7: Verify reduced motion**

In Chrome DevTools: Rendering → check "Emulate prefers-reduced-motion".
Expected: Animations disabled or static, content fully visible.

- [ ] **Step 8: Commit any final tweaks**

If adjustments needed, commit them. Otherwise this task is verification-only.

- [ ] **Step 9: Run final type check**

Run: `npx tsc --noEmit`
Expected: Zero errors.
```
