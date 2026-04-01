#version 100
precision mediump float;

varying vec2 fsUv;
varying float fsOpacity;

uniform sampler2D tex0;
uniform sampler2D bumpMapTex;
uniform sampler2D highlightTex;

uniform float time;
uniform float startDelay;
uniform float hlIntensity;
uniform float hlGamma;
uniform vec3 hlColor;

const float hlSpeed = 8.0;
const float startPos = -10.0;
const float endPos = 2.0;

void main() {
  vec4 c = texture2D(tex0, fsUv);
  float hlFact = texture2D(highlightTex,
                         vec2(fsUv.x -
                              max(-1.0,
                                  mix(startPos, endPos,
                                      fract(time/hlSpeed - startDelay))),
                              fsUv.y)).r;
  vec3 bumpFact = texture2D(bumpMapTex, fsUv).rgb;
  c.rgb += hlColor * pow(bumpFact.r,hlIntensity) * hlFact * hlGamma;
  gl_FragColor = c * fsOpacity;
}
