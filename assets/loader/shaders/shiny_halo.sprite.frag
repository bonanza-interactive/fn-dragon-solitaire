#version 100
precision mediump float;

varying vec2 fsUv;
uniform float time;
uniform float opacity;

uniform vec3 progress;

void main() {

  float mul = fsUv[0] * (1.0 - fsUv[0]) * fsUv[1] * (1.0 - fsUv[1]) / 0.1;

  mul *= progress.x + progress.y * cos(time * 3.14159 * 1.5);

  gl_FragColor = vec4(vec3(1.0, 0.5, 0.0) * mul * opacity, 1);
}
