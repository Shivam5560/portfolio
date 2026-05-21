export const rippleFieldFrag = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 mouseUv = uMouse / uResolution;

  float dist = length(uv - mouseUv);

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
