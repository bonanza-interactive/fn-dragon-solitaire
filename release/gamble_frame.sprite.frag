#version 100
precision mediump float;

varying vec2 fsUv;
varying float fsOpacity;

uniform sampler2D tex0;
uniform sampler2D bgTex;
uniform vec2 bgTexSize;
uniform float resScale;
uniform float bgOpacity;

void main() {
  vec4 c = texture2D(tex0, fsUv);
  vec2 bgUv = gl_FragCoord.xy / bgTexSize / resScale;
  vec3 bgC = texture2D(bgTex, bgUv).rgb;
  c.rgb = mix(c.rgb, bgC.rgb,
          (bgOpacity * fsOpacity * floor(c.a)));
  
  gl_FragColor = c * fsOpacity;
}
