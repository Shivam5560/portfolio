export const gridWaveFrag = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uHoverPos;
uniform float uHoverStrength;
uniform vec2 uScrollOffset;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  vec2 gridUv = uv * vec2(40.0, 40.0 * uResolution.y / uResolution.x);
  vec2 gridId = floor(gridUv);
  vec2 gridFrac = fract(gridUv) - 0.5;

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
