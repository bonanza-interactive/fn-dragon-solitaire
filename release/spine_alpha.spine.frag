#version 100
precision mediump float;

varying vec2 fsUv;
varying vec4 fsColor;
varying vec4 fsDarkColor;
uniform sampler2D tex0;
uniform float opacity;

uniform vec4 multiplyColor;

void main() {
  vec4 c = texture2D(tex0, fsUv);
  gl_FragColor = vec4(
    c.rgb * fsColor.rgb - (c.rgb - c.a) * fsDarkColor.rgb,
    c.a * fsColor.a * opacity);

  gl_FragColor.rgba *= multiplyColor;
}
