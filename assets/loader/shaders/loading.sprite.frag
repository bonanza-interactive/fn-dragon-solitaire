#version 100
precision mediump float;

varying vec2 fsUv;
varying float fsOpacity;
//uniform sampler2D tex0;
//uniform sampler2D texAlpha;

void main() {
  vec4 c = vec4(1,0,0,1);//vec4(texture2D(tex0, fsUv).rgb, texture2D(texAlpha, fsUv).r);

  gl_FragColor = c * vec4(1, 1, 1, fsOpacity);
}
