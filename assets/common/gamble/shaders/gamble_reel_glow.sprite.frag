#version 100
precision mediump float;

varying vec2 fsUv;
varying float fsOpacity;

uniform sampler2D tex0;
uniform vec3 glowColor;

void main() {
  vec4 c = texture2D(tex0, fsUv);
  c.rgb *= glowColor;
  gl_FragColor = c * fsOpacity;
}
