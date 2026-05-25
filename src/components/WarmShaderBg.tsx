import { useRef, useEffect } from "react";

const subtleShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;

#define FC gl_FragCoord.xy
#define T time
#define R resolution

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.0;
    a *= 0.5;
  }
  return v;
}

void main(void) {
  vec2 uv = FC / R;
  vec2 aspect = vec2(R.x / R.y, 1.0);

  // Very slow, large-scale warm blobs
  float n1 = fbm(uv * 1.5 + vec2(T * 0.008, T * 0.005));
  float n2 = fbm(uv * 2.0 - vec2(T * 0.006, T * 0.004) + n1 * 0.3);
  float n3 = fbm(uv * 1.2 + vec2(T * 0.003, -T * 0.007) + n2 * 0.2);

  // Combine into soft organic shapes
  float shape = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

  // Base warm cream
  vec3 cream = vec3(0.988, 0.976, 0.961);
  vec3 parchment = vec3(0.961, 0.929, 0.894);
  vec3 warmGlow = vec3(0.957, 0.910, 0.875);

  // Very subtle terracotta and plum accents at extremely low intensity
  vec3 terracotta = vec3(0.769, 0.498, 0.353);
  vec3 plum = vec3(0.545, 0.369, 0.486);
  vec3 dustyBlue = vec3(0.357, 0.541, 0.620);

  // Start from cream
  vec3 col = cream;

  // Very subtle parchment variation
  col = mix(col, parchment, shape * 0.15);
  col = mix(col, warmGlow, n2 * 0.08);

  // Gentle warm color accents — extremely subtle
  float accent = smoothstep(0.4, 0.7, shape);
  col = mix(col, mix(terracotta, plum, n3) * 1.1, accent * 0.04);
  col = mix(col, dustyBlue * 1.15, smoothstep(0.3, 0.6, n1) * 0.02);

  // Very subtle vignette
  float vig = 1.0 - length((uv - 0.5) * aspect) * 0.15;
  col *= 0.95 + vig * 0.05;

  // Film grain at very low intensity
  float grain = hash(FC + fract(T * 0.1) * 100.0);
  col += (grain - 0.5) * 0.008;

  O = vec4(col, 1.0);
}`;

export default function WarmShaderBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const rendererRef = useRef<{
    gl: WebGL2RenderingContext;
    program: WebGLProgram;
    buffer: WebGLBuffer;
    uniforms: Record<string, WebGLUniformLocation>;
    canvas: HTMLCanvasElement;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", { alpha: true });
    if (!gl) return;

    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);

    const vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

    const vertices = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(s));
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, vertexSrc);
    const fs = compile(gl.FRAGMENT_SHADER, subtleShaderSource);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      resolution: gl.getUniformLocation(program, "resolution")!,
      time: gl.getUniformLocation(program, "time")!,
    };

    rendererRef.current = { gl, program, buffer, uniforms, canvas };

    const resize = () => {
      const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener("resize", resize);

    const render = (now: number) => {
      const r = rendererRef.current;
      if (!r) return;

      gl.clearColor(0.988, 0.976, 0.961, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, now * 1e-3);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "#FCF9F5" }}
    />
  );
}
