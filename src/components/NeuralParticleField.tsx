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

  float angle = snoise(pos * 1.5 + uTime * 0.15) * 6.2832;
  float speed = snoise(pos * 2.0 - uTime * 0.1 + 5.0) * 0.3 + 0.7;

  vec2 noiseForce = vec2(cos(angle), sin(angle)) * speed * 0.002;

  vec2 mouseNdc = (uMouse / uResolution) * 2.0 - 1.0;
  vec2 toMouse = mouseNdc - pos;
  float mouseDist = length(toMouse);
  float attention = exp(-mouseDist * 2.5) * 0.3;
  vec2 mouseForce = normalize(toMouse + 0.001) * attention * 0.003;

  vec2 newPos = pos + (vel + noiseForce + mouseForce) * 0.016;
  newPos = mod(newPos + 1.0, 2.0) - 1.0;

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
  vec2 uv = gl_PointCoord - 0.5;
  float dist = length(uv);
  float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;

  vec3 terracotta = vec3(0.769, 0.498, 0.353);
  vec3 plum = vec3(0.545, 0.369, 0.486);
  vec3 dustyBlue = vec3(0.357, 0.541, 0.620);
  vec3 sage = vec3(0.627, 0.784, 0.690);

  float t = vLife;
  vec3 color = mix(terracotta, plum, smoothstep(0.2, 0.5, t));
  color = mix(color, dustyBlue, smoothstep(0.4, 0.7, t));
  color = mix(color, sage, smoothstep(0.6, 0.9, t));
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

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('Neural particle shader compile error:', gl.getShaderInfoLog(s));
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, vertexShader);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentShader);

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);

    gl.transformFeedbackVaryings(program, ['aPosition', 'aVelocity', 'aLife'], gl.SEPARATE_ATTRIBS);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Neural particle program link error:', gl.getProgramInfoLog(program));
    }

    const positions = new Float32Array(PARTICLE_COUNT * 2);
    const velocities = new Float32Array(PARTICLE_COUNT * 2);
    const lifetimes = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 2] = Math.random() * 2 - 1;
      positions[i * 2 + 1] = Math.random() * 2 - 1;
      velocities[i * 2] = (Math.random() - 0.5) * 0.01;
      velocities[i * 2 + 1] = (Math.random() - 0.5) * 0.01;
      lifetimes[i] = Math.random();
    }

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
      const src = i === 0 ? buffersA : buffersB;
      const dst = i === 0 ? buffersB : buffersA;

      gl.bindVertexArray(vaos[i]);

      gl.bindBuffer(gl.ARRAY_BUFFER, src.pos);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);

      gl.bindBuffer(gl.ARRAY_BUFFER, src.vel);
      gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(1);

      gl.bindBuffer(gl.ARRAY_BUFFER, src.life);
      gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(2);

      gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tfbs[i]);
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, dst.pos);
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, dst.vel);
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 2, dst.life);
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

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    let currentVao = 0;
    let start = performance.now();

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
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      for (const v of vaos) gl.deleteVertexArray(v);
      for (const t of tfbs) gl.deleteTransformFeedback(t);
      [buffersA, buffersB].forEach((b) => {
        gl.deleteBuffer(b.pos);
        gl.deleteBuffer(b.vel);
        gl.deleteBuffer(b.life);
      });
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
