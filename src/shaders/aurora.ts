export const auroraFrag = `#version 300 es
precision highp float;

out vec4 fragColor;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

// Noise functions
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
  
  // Mouse parallax
  vec2 mouseNdc = (uMouse / uResolution) * 2.0 - 1.0;
  uv += mouseNdc * 0.02;

  float t = uTime * 0.5;

  // Layer 1: Violet/Pink base
  float n1 = fbm(uv * aspect * 2.0 + vec2(t * 0.1, t * 0.05));
  float n2 = fbm(uv * aspect * 1.5 - vec2(t * 0.05, t * 0.1) + n1 * 0.5);
  
  // Layer 2: Cyan accents
  float n3 = fbm(uv * aspect * 3.0 + vec2(t * 0.2, -t * 0.1) + n2 * 1.5);
  
  // Colors
  vec3 midnight = vec3(0.012, 0.02, 0.016); // #030504
  vec3 emerald = vec3(0.0, 0.898, 0.459); // #00e575
  vec3 gold = vec3(0.831, 0.686, 0.216); // #d4af37
  vec3 sage = vec3(0.471, 0.529, 0.494); // #78877e
  
  vec3 col = midnight;
  
  // Add emerald/sage auroras
  float aurora1 = smoothstep(0.4, 0.8, n2) * 0.35;
  col = mix(col, mix(emerald, sage, n1), aurora1);
  
  // Add gold highlights
  float aurora2 = smoothstep(0.6, 0.9, n3) * 0.3;
  col = mix(col, gold, aurora2);

  // Soft vignette
  float vig = 1.0 - length((uv - 0.5) * aspect) * 0.5;
  col *= 0.7 + vig * 0.3;

  // Subtle grain
  float grain = hash(gl_FragCoord.xy + fract(t) * 100.0);
  col += (grain - 0.5) * 0.015;

  fragColor = vec4(col, 1.0);
}
`;
