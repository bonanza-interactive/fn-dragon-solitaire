#version 100
precision mediump float;

varying vec2 fsUv;
varying vec4 fsColor;
varying float fsIndex;
varying vec4 fsPos;

uniform sampler2D tex0;
uniform sampler2D tex_effects;

uniform float opacity;

uniform vec4 swipeParams;

void main() {
  vec4 colorFont = texture2D(tex0, fsUv);
  vec4 colorEffects = texture2D(tex_effects, fsUv);

  float colorStroke = colorEffects.b;
  float colorSwipe = colorEffects.r;

  float time1 = swipeParams.x;
  float time2 = max(0.0, swipeParams.z);

  float band = 1.0 - min(1.0, mod((time2 - fsPos.y+0.5), 2.0));
  float bandProgress = clamp(mod((time2 - fsPos.y), 2.0), 0.0, 1.0);
  float band2 = sin(pow(1.0 - bandProgress, 5.0)*3.1415926535);

  //float band = 1.0 - min(mod(min(time2 - fsPos.y + 0.5, 2.0), 2.0), 1.0);
  //float band2 = 1.0 - min(mod(min(time2 - fsPos.y, 2.0), 2.0), 1.0);

  float amount = (0.5 - 0.5 * cos(time1 * 3.1415926535 * 1.0));
  float amount2 = clamp(2.0 * abs(band-floor(band+0.5)) * 1.0, 0.0, 1.0);

  colorFont.rgb += 0.0 * 0.8 * vec3(1.0, 0.7, 0.15) *
    (swipeParams.y * amount * colorStroke +
     swipeParams.w * amount2 * band2 * colorSwipe);

  gl_FragColor = fsColor * colorFont * vec4(1, 1, 1, opacity);
}
