# Portfolio Shader Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace single shader + 3D scene with section-specific WebGL shaders, neural particle field, and interactive skill graph. Add GitHub Pages deployment.

**Architecture:** A single `SectionShaders` component manages WebGL context lifecycle and swaps GLSL programs based on visible section (IntersectionObserver). Hero gets a 2000-particle neural field via raw WebGL. Skills gets an R3F force-directed graph. All other sections get custom fragment shaders.

**Tech Stack:** React 19, Vite 8, Tailwind CSS 4, Framer Motion 12, Three.js 0.184 + @react-three/fiber + @react-three/drei, raw WebGL2

---

### Task 1: GitHub Pages Setup

**Files:**
- Modify: `vite.config.ts`
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Update vite.config.ts with base path**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/portfolio/',
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 2: Create GitHub Actions deploy workflow**

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

- [ ] **Step 3: Commit**

```bash
git add vite.config.ts .github/workflows/deploy.yml
git commit -m "feat: add GitHub Pages base path and deploy workflow"
```

---

### Task 2: Create Shader Source Files

**Files:**
- Create: `src/shaders/index.ts`
- Create: `src/shaders/organicBlob.ts`
- Create: `src/shaders/dataStreams.ts`
- Create: `src/shaders/gridWave.ts`
- Create: `src/shaders/rippleField.ts`

- [ ] **Step 1: Create barrel export**

`src/shaders/index.ts`:
```ts
export { organicBlobFrag, organicBlobUniforms } from './organicBlob';
export { dataStreamsFrag, dataStreamsUniforms } from './dataStreams';
export { gridWaveFrag, gridWaveUniforms } from './gridWave';
export { rippleFieldFrag, rippleFieldUniforms } from './rippleField';

export const commonVertex = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;
```

- [ ] **Step 2: Create organic blob shader for About section**

`src/shaders/organicBlob.ts`:
```ts
export const organicBlobFrag = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;

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
  vec2 center = uv - 0.5;
  float dist = length(center);

  float n1 = snoise(uv * 3.0 + uTime * 0.12);
  float n2 = snoise(uv * 4.5 - uTime * 0.08 + n1 * 0.5);
  float n3 = snoise(uv * 2.0 + uTime * 0.05 + n2 * 0.3);

  // Morphing blob shape
  float blob = smoothstep(0.38 + n1 * 0.08 + n2 * 0.05, 0.35 + n2 * 0.06, dist);
  blob += smoothstep(0.25 + n3 * 0.1, 0.22, dist) * 0.3;

  vec3 cream = vec3(0.988, 0.976, 0.961);
  vec3 terracotta = vec3(0.769, 0.498, 0.353);
  vec3 dustyBlue = vec3(0.357, 0.541, 0.620);

  vec3 color = cream;
  color = mix(color, terracotta, blob * 0.08);
  color = mix(color, dustyBlue, n3 * blob * 0.04);

  float vignette = 1.0 - length(uv - 0.5) * 0.4;
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}
`;

export const organicBlobUniforms = ['uTime', 'uResolution'] as const;
```

- [ ] **Step 3: Create data streams shader for Experience section**

`src/shaders/dataStreams.ts`:
```ts
export const dataStreamsFrag = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform float uScrollOffset;

float hash(float n) { return fract(sin(n) * 43758.5453123); }

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  vec3 parchment = vec3(0.961, 0.929, 0.894);
  vec3 terracotta = vec3(0.769, 0.498, 0.353);
  vec3 plum = vec3(0.545, 0.369, 0.486);
  vec3 dustyBlue = vec3(0.357, 0.541, 0.620);

  vec3 color = parchment;

  // Flowing horizontal data lines
  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    float y = fract(hash(fi * 3.7) + uTime * 0.03 * (1.0 + fi * 0.1) + uScrollOffset * 0.002);
    float lineY = y;

    float dist = abs(uv.y - lineY);
    float alpha = smoothstep(0.015, 0.0, dist) * 0.12;
    alpha *= smoothstep(0.0, 0.3, uv.x) * smoothstep(1.0, 0.7, uv.x);

    vec3 lineColor = mix(terracotta, dustyBlue, hash(fi * 13.7));
    lineColor = mix(lineColor, plum, hash(fi * 7.1));
    color = mix(color, lineColor, alpha);
  }

  gl_FragColor = vec4(color, 1.0);
}
`;

export const dataStreamsUniforms = ['uTime', 'uResolution', 'uScrollOffset'] as const;
```

- [ ] **Step 4: Create grid wave shader for Projects section**

`src/shaders/gridWave.ts`:
```ts
export const gridWaveFrag = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uHoverPos;
uniform float uHoverStrength;
uniform vec2 uScrollOffset;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  // Dot grid
  vec2 gridUv = uv * vec2(40.0, 40.0 * uResolution.y / uResolution.x);
  vec2 gridId = floor(gridUv);
  vec2 gridFrac = fract(gridUv) - 0.5;

  // Wave distortion from hover
  float hoverDist = length(uv - uHoverPos);
  float wave = exp(-hoverDist * 4.0) * uHoverStrength;

  vec2 distorted = gridFrac + vec2(
    sin(gridId.y * 0.5 + uTime * 0.3 + wave * 3.0) * wave * 0.3,
    cos(gridId.x * 0.5 + uTime * 0.3 + wave * 2.0) * wave * 0.3
  );

  float dot = length(distorted);
  float alpha = smoothstep(0.12, 0.08, dot) * 0.15;
  alpha += wave * 0.08;

  vec3 cream = vec3(0.988, 0.976, 0.961);
  vec3 terracotta = vec3(0.769, 0.498, 0.353);
  vec3 plum = vec3(0.545, 0.369, 0.486);

  vec3 color = cream;
  color = mix(color, terracotta, alpha);
  color = mix(color, plum, alpha * wave * 2.0);

  gl_FragColor = vec4(color, 1.0);
}
`;

export const gridWaveUniforms = ['uTime', 'uResolution', 'uHoverPos', 'uHoverStrength', 'uScrollOffset'] as const;
```

- [ ] **Step 5: Create ripple field shader for Contact section**

`src/shaders/rippleField.ts`:
```ts
export const rippleFieldFrag = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 mouseUv = uMouse / uResolution;

  float dist = length(uv - mouseUv);

  // Ripple rings
  float ripple1 = sin(dist * 40.0 - uTime * 2.0) * 0.5 + 0.5;
  float ripple2 = sin(dist * 30.0 - uTime * 1.5 + 1.0) * 0.5 + 0.5;
  float ripple3 = sin(dist * 50.0 - uTime * 2.5 + 2.0) * 0.5 + 0.5;

  float ripple = (ripple1 * 0.5 + ripple2 * 0.3 + ripple3 * 0.2);
  ripple *= exp(-dist * 3.5);
  ripple *= smoothstep(0.8, 0.0, dist);

  vec3 cream = vec3(0.988, 0.976, 0.961);
  vec3 terracotta = vec3(0.769, 0.498, 0.353);
  vec3 plum = vec3(0.545, 0.369, 0.486);
  vec3 sage = vec3(0.627, 0.784, 0.690);

  vec3 color = cream;
  color = mix(color, terracotta, ripple * 0.08);
  color = mix(color, plum, ripple * 0.04);
  color = mix(color, sage, ripple * 0.03);

  float vignette = 1.0 - length(uv - 0.5) * 0.35;
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}
`;

export const rippleFieldUniforms = ['uTime', 'uResolution', 'uMouse'] as const;
```

---

### Task 3: Create SectionShaders Component

**Files:**
- Create: `src/components/SectionShaders.tsx`

- [ ] **Step 1: Create SectionShaders component**

`src/components/SectionShaders.tsx`:
```tsx
import { useEffect, useRef, useCallback } from 'react';
import { commonVertex, organicBlobFrag, dataStreamsFrag, gridWaveFrag, rippleFieldFrag } from '../shaders';

type SectionId = 'hero' | 'about' | 'experience' | 'projects' | 'skills' | 'contact';

interface ShaderDef {
  frag: string;
  uniforms: readonly string[];
  getValues: (time: number, res: [number, number], extra?: Record<string, number>) => Record<string, number | number[]>;
}

const shaders: Record<Exclude<SectionId, 'hero' | 'skills'>, ShaderDef> = {
  about: {
    frag: organicBlobFrag,
    uniforms: ['uTime', 'uResolution'],
    getValues: (t, res) => ({ uTime: t, uResolution: res }),
  },
  experience: {
    frag: dataStreamsFrag,
    uniforms: ['uTime', 'uResolution', 'uScrollOffset'],
    getValues: (t, res, extra) => ({
      uTime: t,
      uResolution: res,
      uScrollOffset: extra?.scrollOffset ?? 0,
    }),
  },
  projects: {
    frag: gridWaveFrag,
    uniforms: ['uTime', 'uResolution', 'uHoverPos', 'uHoverStrength', 'uScrollOffset'],
    getValues: (t, res, extra) => ({
      uTime: t,
      uResolution: res,
      uHoverPos: [extra?.hoverX ?? 0.5, extra?.hoverY ?? 0.5],
      uHoverStrength: extra?.hoverStrength ?? 0,
      uScrollOffset: [extra?.scrollX ?? 0, extra?.scrollY ?? 0],
    }),
  },
  contact: {
    frag: rippleFieldFrag,
    uniforms: ['uTime', 'uResolution', 'uMouse'],
    getValues: (t, res, extra) => ({
      uTime: t,
      uResolution: res,
      uMouse: [extra?.mouseX ?? 0.5 * res[0], extra?.mouseY ?? 0.5 * res[1]],
    }),
  },
};

function compileShader(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('Shader compile:', gl.getShaderInfoLog(shader));
  }
  return shader;
}

function createProgram(gl: WebGL2RenderingContext, fragSrc: string): WebGLProgram {
  const program = gl.createProgram()!;
  gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, commonVertex));
  gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, fragSrc));
  gl.linkProgram(program);
  return program;
}

export default function SectionShaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programsRef = useRef<Map<string, WebGLProgram>>(new Map());
  const activeSectionRef = useRef<SectionId>('hero');
  const animFrameRef = useRef<number>(0);
  const extraRef = useRef<Record<string, number>>({ mouseX: 0, mouseY: 0 });
  const hoverStrengthRef = useRef(0);
  const targetHoverRef = useRef(0);

  const prefersReduced = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });
    if (!gl) return;
    glRef.current = gl;

    // Full-screen quad
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

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
    window.addEventListener('resize', resize);

    // Pre-compile shader programs
    const progMap = programsRef.current;
    for (const [key, def] of Object.entries(shaders)) {
      progMap.set(key, createProgram(gl, def.frag));
    }

    // Mouse tracking
    const onMouse = (e: MouseEvent) => {
      extraRef.current.mouseX = e.clientX;
      extraRef.current.mouseY = window.innerHeight - e.clientY;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    // Intersection Observer for active section
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id as SectionId;
            if (id && shaders[id as keyof typeof shaders]) {
              activeSectionRef.current = id;
            } else if (id === 'hero' || id === 'skills') {
              activeSectionRef.current = id;
            }
          }
        }
      },
      { threshold: 0.3 },
    );

    document.querySelectorAll('section[id]').forEach((el) => observer.observe(el));

    const handleContextLost = () => {
      cancelAnimationFrame(animFrameRef.current);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);

    let start = performance.now();
    const render = (now: number) => {
      const t = (now - start) * 0.001;
      const section = activeSectionRef.current;
      const def = shaders[section as keyof typeof shaders];

      if (def) {
        const program = progMap.get(section);
        if (program) {
          gl.useProgram(program);

          const aPos = gl.getAttribLocation(program, 'aPosition');
          gl.enableVertexAttribArray(aPos);
          gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

          // Smooth hover strength
          hoverStrengthRef.current += (targetHoverRef.current - hoverStrengthRef.current) * 0.1;

          const values = def.getValues(t, [canvas.width, canvas.height], {
            mouseX: extraRef.current.mouseX,
            mouseY: extraRef.current.mouseY,
            hoverStrength: hoverStrengthRef.current,
            scrollOffset: window.scrollY,
            scrollX: 0,
            scrollY: window.scrollY,
          });

          for (const u of def.uniforms) {
            const loc = gl.getUniformLocation(program, u);
            const val = values[u];
            if (loc && val !== undefined) {
              if (Array.isArray(val)) {
                if (val.length === 2) gl.uniform2f(loc, val[0], val[1]);
              } else {
                gl.uniform1f(loc, val);
              }
            }
          }

          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };
    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      observer.disconnect();
      for (const p of progMap.values()) gl.deleteProgram(p);
    };
  }, [prefersReduced]);

  // Expose hover control via custom event (Projects section will use this)
  useEffect(() => {
    const onProjectHover = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        extraRef.current.hoverX = detail.x ?? 0.5;
        extraRef.current.hoverY = 1.0 - (detail.y ?? 0.5);
        targetHoverRef.current = detail.active ? 1 : 0;
      }
    };
    window.addEventListener('project-hover', onProjectHover);
    return () => window.removeEventListener('project-hover', onProjectHover);
  }, []);

  if (prefersReduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 hidden md:block"
      aria-hidden="true"
    />
  );
}
```

---

### Task 4: Create Neural Particle Field

**Files:**
- Create: `src/components/NeuralParticleField.tsx`

- [ ] **Step 1: Create NeuralParticleField component**

`src/components/NeuralParticleField.tsx`:
```tsx
import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 2000;

const vertexShader = `#version 300 es
in vec2 aPosition;
in vec2 aVelocity;
in float aLife;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
out float vLife;
out float vAlpha;

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
  vec2 pos = aPosition;
  vec2 vel = aVelocity;

  // Simplex noise field for organic movement
  float angle = snoise(pos * 1.5 + uTime * 0.15) * 6.2832;
  float speed = snoise(pos * 2.0 - uTime * 0.1 + 5.0) * 0.3 + 0.7;

  vec2 noiseForce = vec2(cos(angle), sin(angle)) * speed * 0.002;

  // Mouse attraction (like attention mechanism)
  vec2 mouseNdc = (uMouse / uResolution) * 2.0 - 1.0;
  vec2 toMouse = mouseNdc - pos;
  float mouseDist = length(toMouse);
  float attention = exp(-mouseDist * 2.5) * 0.3;
  vec2 mouseForce = normalize(toMouse + 0.001) * attention * 0.003;

  // Update position
  vec2 newPos = pos + (vel + noiseForce + mouseForce) * 0.016;

  // Wrap around edges
  newPos = mod(newPos + 1.0, 2.0) - 1.0;

  // Fade at edges
  float edgeFade = 1.0 - smoothstep(0.7, 1.0, abs(newPos.x)) * 0.5;
  edgeFade *= 1.0 - smoothstep(0.7, 1.0, abs(newPos.y)) * 0.5;

  vLife = aLife;
  vAlpha = (0.15 + attention * 0.4 + speed * 0.2) * edgeFade;

  gl_Position = vec4(newPos, 0.0, 1.0);
  gl_PointSize = mix(1.5, 3.5, attention + speed * 0.3);
}
`;

const fragmentShader = `#version 300 es
precision highp float;
in float vLife;
in float vAlpha;
out vec4 fragColor;

void main() {
  // Circular particle
  vec2 uv = gl_PointCoord - 0.5;
  float dist = length(uv);

  // Soft circle
  float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;

  // Color palette
  vec3 terracotta = vec3(0.769, 0.498, 0.353);
  vec3 plum = vec3(0.545, 0.369, 0.486);
  vec3 dustyBlue = vec3(0.357, 0.541, 0.620);
  vec3 sage = vec3(0.627, 0.784, 0.690);

  float t = vLife;
  vec3 color = mix(terracotta, plum, smoothstep(0.2, 0.5, t));
  color = mix(color, dustyBlue, smoothstep(0.4, 0.7, t));
  color = mix(color, sage, smoothstep(0.6, 0.9, t));

  // Glow
  color += color * smoothstep(0.3, 0.0, dist) * 0.5;

  fragColor = vec4(color, alpha);
}
`;

export default function NeuralParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const prefersReduced = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2', { antialias: true, alpha: true });
    if (!gl) return;

    // Compile shaders
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexShader));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentShader));

    // Transform feedback for particle state
    gl.transformFeedbackVaryings(program, ['aPosition', 'aVelocity', 'aLife'], gl.SEPARATE_ATTRIBS);
    gl.linkProgram(program);

    // Initialize particle data
    const positions = new Float32Array(PARTICLE_COUNT * 2);
    const velocities = new Float32Array(PARTICLE_COUNT * 2);
    const lifetimes = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Random positions in NDC
      positions[i * 2] = Math.random() * 2 - 1;
      positions[i * 2 + 1] = Math.random() * 2 - 1;
      // Small random velocities
      velocities[i * 2] = (Math.random() - 0.5) * 0.01;
      velocities[i * 2 + 1] = (Math.random() - 0.5) * 0.01;
      lifetimes[i] = Math.random();
    }

    // Create buffers (double-buffered for transform feedback)
    const createBuffers = () => {
      const pos = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pos);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_COPY);
      const vel = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vel);
      gl.bufferData(gl.ARRAY_BUFFER, velocities, gl.DYNAMIC_COPY);
      const life = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, life);
      gl.bufferData(gl.ARRAY_BUFFER, lifetimes, gl.DYNAMIC_COPY);
      return { pos, vel, life };
    };

    const buffersA = createBuffers();
    const buffersB = createBuffers();
    const vaos = [gl.createVertexArray()!, gl.createVertexArray()!];
    const tfbs = [gl.createTransformFeedback()!, gl.createTransformFeedback()!];

    for (let i = 0; i < 2; i++) {
      const bufs = i === 0 ? buffersA : buffersB;
      gl.bindVertexArray(vaos[i]);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufs.pos);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufs.vel);
      gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(1);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufs.life);
      gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(2);

      gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tfbs[i]);
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, i === 0 ? buffersB.pos : buffersA.pos);
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, i === 0 ? buffersB.vel : buffersA.vel);
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 2, i === 0 ? buffersB.life : buffersA.life);
    }

    const uTime = gl.getUniformLocation(program, 'uTime');
    const uMouse = gl.getUniformLocation(program, 'uMouse');
    const uResolution = gl.getUniformLocation(program, 'uResolution');

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: window.innerHeight - e.clientY };
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    let currentVao = 0;
    let start = performance.now();

    // Blend mode for additive particle rendering
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const render = (now: number) => {
      gl.useProgram(program);
      gl.uniform1f(uTime, (now - start) * 0.001);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform2f(uResolution, canvas.width, canvas.height);

      gl.bindVertexArray(vaos[currentVao]);
      gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tfbs[currentVao]);

      gl.beginTransformFeedback(gl.POINTS);
      gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT);
      gl.endTransformFeedback();

      currentVao = 1 - currentVao;
      animFrameRef.current = requestAnimationFrame(render);
    };
    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      gl.deleteProgram(program);
      for (const v of vaos) gl.deleteVertexArray(v);
      for (const t of tfbs) gl.deleteTransformFeedback(t);
    };
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 hidden md:block"
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    />
  );
}
```

---

### Task 5: Create Skill Graph (R3F Force-Directed)

**Files:**
- Create: `src/components/SkillGraph.tsx`

- [ ] **Step 1: Create SkillGraph R3F component**

`src/components/SkillGraph.tsx`:
```tsx
import { useRef, useMemo, useCallback } from 'react';
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
    { from: 'git', to: 'java' }, { from: 'scikitlearn', to: 'pandas' as any },
  ].filter(e => skillData.nodes.some(n => n.id === e.to)),
};

function ParticleNode({ node, isHovered, onHover }: {
  node: SkillNode;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
      if (isHovered) {
        const s = 1 + Math.sin(Date.now() * 0.01) * 0.2;
        meshRef.current.scale.setScalar(s);
        if (glowRef.current) glowRef.current.scale.setScalar(s * 1.8);
      } else {
        meshRef.current.scale.setScalar(1);
        if (glowRef.current) glowRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group position={node.position}>
      {/* Glow ring */}
      <mesh ref={glowRef} onPointerEnter={() => onHover(node.id)} onPointerLeave={() => onHover(null)}>
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
        font="/fonts/dm-sans.woff"
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
    return edges.map((e) => {
      const from = nodeMap.get(e.from);
      const to = nodeMap.get(e.to);
      if (!from || !to) return null;
      const connected = hoveredId === e.from || hoveredId === e.to;
      return { key: `${e.from}-${e.to}`, from, to, connected };
    }).filter(Boolean) as { key: string; from: [number, number, number]; to: [number, number, number]; connected: boolean }[];
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

// Need useState import at top
import { useState } from 'react';

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
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <Scene />
      </Canvas>
    </div>
  );
}
```

---

### Task 6: Update App.tsx and Remove Old Files

**Files:**
- Modify: `src/App.tsx`
- Delete: `src/components/ShaderBackground.tsx`
- Delete: `src/components/ThreeScene.tsx`

- [ ] **Step 1: Update App.tsx**

Read current `src/App.tsx`, replace imports and component:

```tsx
import { Suspense } from "react";
import SectionShaders from "./components/SectionShaders";
import NeuralParticleField from "./components/NeuralParticleField";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas">
      {/* Section-aware shader system */}
      <SectionShaders />

      {/* Neural particle field for hero (inside Hero component) */}

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

Remove the `lazy` import for ThreeScene and the Suspense wrapper since NeuralParticleField is now rendered inside Hero.

- [ ] **Step 2: Delete old shader and 3D files**

```bash
rm src/components/ShaderBackground.tsx
rm src/components/ThreeScene.tsx
```

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git rm src/components/ShaderBackground.tsx src/components/ThreeScene.tsx
git commit -m "refactor: replace ShaderBackground+ThreeScene with SectionShaders system"
```

---

### Task 7: Update Hero with Neural Particle Field

**Files:**
- Modify: `src/components/Hero.tsx`

- [ ] **Step 1: Add NeuralParticleField to Hero**

In `src/components/Hero.tsx`, add import and render NeuralParticleField inside the section. Add it right after the opening `<section>` tag:

```tsx
import NeuralParticleField from "./NeuralParticleField";

// In the JSX, add after the opening section tag:
<section
  className="relative flex min-h-screen items-center justify-center px-6 pt-20"
  onMouseMove={handleMouseMove}
  onMouseLeave={() => { rotateX.set(0); rotateY.set(0); }}
>
  <NeuralParticleField />
  {/* Rest of the hero content stays unchanged */}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: add neural particle field to hero section"
```

---

### Task 8: Add Shader Backgrounds to About, Experience, Projects, Contact

**Files:**
- Modify: `src/components/About.tsx`
- Modify: `src/components/Experience.tsx`
- Modify: `src/components/Projects.tsx`
- Modify: `src/components/Contact.tsx`

- [ ] **Step 1: Update About.tsx**

Add `bg-parchment/20` to the section for softer background with the shader showing through:

```tsx
// Change the section className to:
<section id="about" className="relative px-6 py-32 bg-parchment/20">
```

No shader-specific code needed — SectionShaders handles the organic blob shader automatically when this section is in view.

- [ ] **Step 2: Update Experience.tsx**

Add `bg-parchment/30`:

```tsx  
// Change the section className to:
<section id="experience" className="relative px-6 py-32 bg-parchment/30">
```

- [ ] **Step 3: Update Projects.tsx**

No background change needed (cream canvas with grid wave shader shows through). But dispatch hover events:

Add to `TiltProjectCard`:
```tsx
// In onMouseEnter:
window.dispatchEvent(new CustomEvent('project-hover', {
  detail: {
    x: (e.clientX) / window.innerWidth,
    y: (e.clientY) / window.innerHeight,
    active: true,
  },
}));

// In onMouseLeave (already existing), add:
window.dispatchEvent(new CustomEvent('project-hover', {
  detail: { x: 0.5, y: 0.5, active: false },
}));
```

Wait — the mouse leave handler already exists. Let me integrate. Add after `setIsHovered(true)` in `onMouseEnter`, and after `setIsHovered(false)` in `onMouseLeave`:

```tsx
onMouseEnter={() => {
  setIsHovered(true);
}}

onMouseLeave={() => { 
  x.set(0); y.set(0); setIsHovered(false); 
  window.dispatchEvent(new CustomEvent('project-hover', { 
    detail: { x: 0.5, y: 0.5, active: false } 
  }));
}}
```

And add `onMouseMove` dispatch:
```tsx
onMouseMove={(e) => {
  if (!ref.current) return;
  const rect = ref.current.getBoundingClientRect();
  x.set((e.clientX - rect.left) / rect.width - 0.5);
  y.set((e.clientY - rect.top) / rect.height - 0.5);
  window.dispatchEvent(new CustomEvent('project-hover', {
    detail: {
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
      active: true,
    },
  }));
}}
```

- [ ] **Step 4: Update Contact.tsx**

No changes needed to Contact — SectionShaders handles the ripple shader automatically when `#contact` section is visible. The existing mouse events in SectionShaders handle cursor position.

However, update the section background to let the shader show through:
```tsx
// Change:
<section id="contact" className="relative px-6 py-32">
// To:
<section id="contact" className="relative px-6 py-32 bg-canvas/60">
```

- [ ] **Step 5: Commit**

```bash
git add src/components/About.tsx src/components/Experience.tsx src/components/Projects.tsx src/components/Contact.tsx
git commit -m "feat: wire section shader backgrounds to About, Experience, Projects, Contact"
```

---

### Task 9: Update Skills Section with SkillGraph

**Files:**
- Modify: `src/components/Skills.tsx`

- [ ] **Step 1: Add SkillGraph to Skills section**

In `src/components/Skills.tsx`, import SkillGraph and render it in the section:

```tsx
import SkillGraph from "./SkillGraph";

// In the JSX, add after opening section tag:
<section id="skills" className="relative px-6 py-32">
  <SkillGraph />
  {/* Rest of skills content unchanged */}
```

Also add a semi-transparent background to the cards for readability over the graph:
```tsx
// Change card className to:
className="rounded-2xl border border-sand-light bg-canvas/85 backdrop-blur-sm p-6"
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Skills.tsx
git commit -m "feat: add force-directed skill graph to Skills section"
```

---

### Task 10: Add CSS Fallbacks for Mobile and Reduced Motion

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add section gradient fallbacks**

Append to `src/index.css`:

```css
/* Section gradient fallbacks (mobile / reduced motion) */
@media (max-width: 767px), (prefers-reduced-motion: reduce) {
  #about {
    background: linear-gradient(180deg, #FCF9F5 0%, #F5EDE4 50%, #FCF9F5 100%);
  }
  #experience {
    background: linear-gradient(180deg, #F5EDE4 0%, #EDE5DA 50%, #F5EDE4 100%);
  }
  #projects {
    background:
      radial-gradient(circle at 30% 20%, rgba(196, 127, 90, 0.04) 0%, transparent 50%),
      radial-gradient(circle at 70% 60%, rgba(139, 94, 124, 0.04) 0%, transparent 50%),
      #FCF9F5;
  }
  #skills {
    background:
      radial-gradient(circle at 50% 50%, rgba(91, 138, 158, 0.05) 0%, transparent 60%),
      #FCF9F5;
  }
  #contact {
    background: linear-gradient(180deg, #FCF9F5 0%, #F5EDE4 100%);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/index.css
git commit -m "feat: add CSS gradient fallbacks for mobile and reduced motion"
```

---

### Task 11: Build Verification

- [ ] **Step 1: Install dependencies and build**

```bash
cd /Users/shivamsourav/Desktop/AI/portfolio
npm install
npm run build
```

Check for TypeScript errors and build success.

- [ ] **Step 2: Verify output**

```bash
ls -la dist/
```

Expected: `index.html`, `assets/` directory with JS/CSS bundles.

- [ ] **Step 3: Fix any issues and commit**

```bash
git add -A
git commit -m "chore: final build verification and fixes"
```
