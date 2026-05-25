export const subtleWarmFrag = `#version 300 es
precision highp float;

out vec4 fragColor;
uniform float uTime;
uniform vec2 uResolution;

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
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);

  float n1 = fbm(uv * 1.5 + vec2(uTime * 0.008, uTime * 0.005));
  float n2 = fbm(uv * 2.0 - vec2(uTime * 0.006, uTime * 0.004) + n1 * 0.3);
  float n3 = fbm(uv * 1.2 + vec2(uTime * 0.003, -uTime * 0.007) + n2 * 0.2);

  float shape = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

  vec3 cream = vec3(0.988, 0.976, 0.961);
  vec3 parchment = vec3(0.961, 0.929, 0.894);
  vec3 warmGlow = vec3(0.957, 0.910, 0.875);

  vec3 terracotta = vec3(0.769, 0.498, 0.353);
  vec3 plum = vec3(0.545, 0.369, 0.486);
  vec3 dustyBlue = vec3(0.357, 0.541, 0.620);

  vec3 col = cream;
  col = mix(col, parchment, shape * 0.15);
  col = mix(col, warmGlow, n2 * 0.08);

  float accent = smoothstep(0.4, 0.7, shape);
  col = mix(col, mix(terracotta, plum, n3) * 1.1, accent * 0.04);
  col = mix(col, dustyBlue * 1.15, smoothstep(0.3, 0.6, n1) * 0.02);

  float vig = 1.0 - length((uv - 0.5) * aspect) * 0.15;
  col *= 0.95 + vig * 0.05;

  float grain = hash(gl_FragCoord.xy + fract(uTime * 0.1) * 100.0);
  col += (grain - 0.5) * 0.008;

  fragColor = vec4(col, 1.0);
}
`;
