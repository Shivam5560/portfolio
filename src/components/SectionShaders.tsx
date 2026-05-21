import { useEffect, useRef } from 'react';
import { commonVertex, organicBlobFrag, dataStreamsFrag, gridWaveFrag, rippleFieldFrag } from '../shaders';

type SectionId = 'hero' | 'about' | 'experience' | 'projects' | 'skills' | 'contact';

interface ShaderDef {
  frag: string;
  uniforms: readonly string[];
  getValues: (time: number, res: [number, number], extra?: Record<string, number>) => Record<string, number | number[]>;
}

const shaders: Record<string, ShaderDef> = {
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
    console.warn('Shader compile error:', gl.getShaderInfoLog(shader));
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

    // Full-screen quad vertices
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Handle resize
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

    // Pre-compile all shader programs
    const progMap = programsRef.current;
    for (const [key, def] of Object.entries(shaders)) {
      progMap.set(key, createProgram(gl, def.frag));
    }

    // Track mouse position
    const onMouse = (e: MouseEvent) => {
      extraRef.current.mouseX = e.clientX;
      extraRef.current.mouseY = window.innerHeight - e.clientY;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    // Track scroll for data stream effect
    const onScroll = () => {
      extraRef.current.scrollOffset = window.scrollY;
      extraRef.current.scrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Intersection Observer to detect active section
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id as SectionId;
            if (id && shaders[id]) {
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

    // Handle WebGL context loss
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(animFrameRef.current);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);

    // Render loop
    let start = performance.now();
    const render = (now: number) => {
      const t = (now - start) * 0.001;
      const section = activeSectionRef.current;
      const def = shaders[section];

      if (def) {
        const program = progMap.get(section);
        if (program) {
          gl.useProgram(program);

          const aPos = gl.getAttribLocation(program, 'aPosition');
          gl.enableVertexAttribArray(aPos);
          gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

          // Smooth hover strength transition
          hoverStrengthRef.current += (targetHoverRef.current - hoverStrengthRef.current) * 0.1;

          const values = def.getValues(t, [canvas.width, canvas.height], {
            mouseX: extraRef.current.mouseX,
            mouseY: extraRef.current.mouseY,
            hoverStrength: hoverStrengthRef.current,
            scrollOffset: extraRef.current.scrollOffset ?? 0,
            scrollX: extraRef.current.scrollX ?? 0,
            scrollY: extraRef.current.scrollY ?? 0,
          });

          for (const uniformName of def.uniforms) {
            const loc = gl.getUniformLocation(program, uniformName);
            const val = values[uniformName];
            if (loc === null || val === undefined) continue;
            if (Array.isArray(val)) {
              if (val.length === 2) gl.uniform2f(loc, val[0], val[1]);
            } else {
              gl.uniform1f(loc, val as number);
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
      window.removeEventListener('scroll', onScroll);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      observer.disconnect();
      for (const p of progMap.values()) gl.deleteProgram(p);
    };
  }, [prefersReduced]);

  // Listen for project hover events (dispatched by Projects component)
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
