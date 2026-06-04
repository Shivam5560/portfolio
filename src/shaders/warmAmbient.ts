export const warmAmbientFrag = `#version 300 es
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

  float t = uTime;

  // Slow drifting warm shapes
  float n1 = fbm(uv * 2.0 + vec2(t * 0.01, t * 0.008));
  float n2 = fbm(uv * 1.5 - vec2(t * 0.007, t * 0.005) + n1 * 0.4);
  float n3 = fbm(uv * 1.0 + vec2(t * 0.004, -t * 0.006) + n2 * 0.3);

  float shape = n1 * 0.4 + n2 * 0.35 + n3 * 0.25;

  // Warm palette
  vec3 cream = vec3(0.988, 0.976, 0.961);
  vec3 parchment = vec3(0.961, 0.929, 0.894);
  vec3 warmSand = vec3(0.957, 0.910, 0.875);

  vec3 terracotta = vec3(0.769, 0.498, 0.353);
  vec3 plum = vec3(0.545, 0.369, 0.486);
  vec3 dustyBlue = vec3(0.357, 0.541, 0.620);

  // Build color from cream base
  vec3 col = cream;

  // Parchment regions
  col = mix(col, parchment, smoothstep(0.3, 0.7, shape) * 0.35);

  // Warm sand highlights
  col = mix(col, warmSand, smoothstep(0.5, 0.8, n2) * 0.25);

  // Terracotta blush areas
  float terracottaMask = smoothstep(0.55, 0.85, shape) * smoothstep(0.2, 0.5, n3);
  col = mix(col, mix(terracotta, plum, n2) * 1.05, terracottaMask * 0.12);

  // Dusty blue cool accents
  float blueMask = smoothstep(0.6, 0.9, n1) * (1.0 - terracottaMask);
  col = mix(col, dustyBlue * 1.1, blueMask * 0.06);

  // Soft vignette
  float vig = 1.0 - length((uv - 0.5) * aspect) * 0.2;
  col *= 0.92 + vig * 0.08;

  // Film grain
  float grain = hash(gl_FragCoord.xy + fract(t * 0.05) * 100.0);
  col += (grain - 0.5) * 0.012;

  fragColor = vec4(col, 1.0);
}
`;
