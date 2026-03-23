#version 100
precision mediump float;

varying vec2 fsUv;
varying float fsOpacity;
uniform sampler2D tex0;

void main() {
  vec4 c = texture2D(tex0, fsUv * 20.0);
  // fade in y/center x
  float dy = fsUv.y * 0.8;
  c.rgb = c.rgb * (1.0 - dy) + vec3(0, 0, 0) * dy;
  float dx = abs(0.5 - fsUv.x) * 2.0 * 0.8;
  c.rgb = c.rgb * (1.0 - dx) + vec3(0, 0, 0) * dx;
  // round shadow
  vec2 cen = vec2(0.55, 0.09);
  float r2max = 0.22;
  float r2 = pow(distance(fsUv.x, cen.x), 2.0) + pow(distance(fsUv.y, cen.y), 2.0);
  float s = smoothstep(r2max - 0.0025, r2max, r2);
  c.rgb = c.rgb * (1.0 - s) + c.rgb * 0.8 * s;
  gl_FragColor = c * vec4(1.0 * fsOpacity, 1.0 * fsOpacity, 1.0 * fsOpacity, fsOpacity);
}
