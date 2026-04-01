#version 100
precision mediump float;

varying vec2 fsUv;
uniform sampler2D tex0;
uniform float progress;
uniform vec3 color;

#define readyColor vec3(0.3, 2.0, 0.5)
//
// Image horizontal slices
//  middle part is scaled,
//  start and end remain fixed size
//
#define startSize 0.0
#define endSize 0.0

#define midSize (1.0 - startSize - endSize)
#define startPos 0.0
#define midPos startSize
#define endPos (startSize + midSize)

//
// Get a mask and position for a coordinate in relation to a range
//  mask is enabled if coordinate is inside range
//  position is a relative value of coordinate inside the range
//
vec3 mixPart(float start, float end, float range, float scan) {
    float mask = float((scan >= start) && (scan <= end));
    float position = clamp(
        (scan - start) / (end - start),
        0.0, 1.0) * mask;
    return vec3(mask, position, 0.0);
}

void main() {

  vec2 uv = vec2(fsUv[0], fsUv[1]);

  vec3 p0 = mixPart(0.0, startSize, 1.0, uv.x);
  vec3 p1 = mixPart(startSize,
                    startSize + (midSize * progress),
                    1.0,
                    uv.x);
  vec3 p2 = mixPart(startSize + (progress * midSize),
                    startSize + (progress * midSize) + endSize,
                    1.0,
                    uv.x);

  vec4 col = vec4(0.0, 0.0, 0.0, 0.0);
  col += texture2D(tex0, vec2(p0.y * startSize, uv.y)) * p0.x;
  col += texture2D(tex0, vec2(p1.y * midSize + midPos, uv.y)) * p1.x;
  col += texture2D(tex0, vec2(p2.y * endSize + endPos, uv.y)) * p2.x;

  col.rgb *= color;

  gl_FragColor = col;
}
