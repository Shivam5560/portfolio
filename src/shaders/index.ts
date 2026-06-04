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
export { warmAmbientFrag } from './warmAmbient';
