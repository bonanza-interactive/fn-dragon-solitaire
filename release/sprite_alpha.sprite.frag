#version 100

precision mediump float;

varying vec2 fsUv;
varying float fsOpacity;

uniform sampler2D tex0;
uniform vec4 tint;

void main() {
  vec4 color = texture2D(tex0, fsUv) * tint;
  color.a *= fsOpacity;
  gl_FragColor = color;
}