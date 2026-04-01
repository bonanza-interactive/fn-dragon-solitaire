#version 100
precision mediump float;

attribute vec2 pos;
attribute vec2 uvi16;
attribute vec4 color8;
attribute float index16;
attribute vec4 uvrect;
uniform mat3 transform;

varying vec2 fsUv;
varying vec4 fsColor;
varying float fsIndex;
varying vec4 fsPos;

void main()
{
    gl_Position.xyz = transform * vec3(pos, 1.0);
    gl_Position.w = 1.0;
    fsUv = uvi16;
    fsColor = vec4(color8.rgb / 255.0, 1.0);
    fsIndex = index16;

    fsPos.xy = pos.xy;
}
