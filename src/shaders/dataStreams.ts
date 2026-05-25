export const dataStreamsFrag = `#version 300 es
precision highp float;

out vec4 fragColor;
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

  fragColor = vec4(color, 1.0);
}
`;

export const dataStreamsUniforms = ['uTime', 'uResolution', 'uScrollOffset'] as const;
