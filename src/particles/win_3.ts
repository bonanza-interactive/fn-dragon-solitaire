/* eslint-disable prettier/prettier */

import * as particle from '@apila/particle-runtime';

export const WIN_3: particle.EffectProperties = {
  version: {
    major: 8,
    minor: 0,
    patch: 0,
  },
  maskImage: '',
  maskRotation: {
    type: 'scalar',
    value: [0],
  },
  maskScale: {
    type: 'scalar',
    value: [1],
  },
  emitterProperties: [
    {
      id: 'flame',
      enabled: true,
      prewarm: false,
      maxParticleNum: {
        type: 'scalar',
        value: [64],
      },
      emitRate: {
        type: 'scalar',
        value: [10],
      },
      images: [
        'win_3_3173822c7ea0b5c99e41dfea',
        'win_3_f456892c23cf399e7bc06373',
        'win_3_f303196b6f485f32acb4f095',
        'win_3_29960de4b502647f91b92a94',
        'win_3_aaf220a75837b72bbace9829',
        'win_3_8aa2291b5ae82ca859d71026',
        'win_3_0dc80e0fbb069af5d154475e',
        'win_3_f694f0f6db8406ddf528b9c3',
        'win_3_2bb5ba985824f61f14ebb882',
        'win_3_accd98ae59fb9e12f32d3153',
        'win_3_02a0c420e92dd7ea21d58075',
        'win_3_9648ce3d882ec0906137a7c0',
        'win_3_f5b385ff309c6924c06b7468',
        'win_3_d4d73f9b4b0fed40cb1c8f90',
        'win_3_527a87a2b3f010b5e46fcf7a',
        'win_3_493e2b693b557015ca9e0559',
        'win_3_dcd8f5f0734015ddac0c0804',
        'win_3_5983beb8f8fdbdc5f85a7f2d',
        'win_3_f831fe99f00c3b1dfb62281a',
        'win_3_1ccd9c4cbb6812d15784ce6f',
        'win_3_83483a79f5d667e25596ef2d',
        'win_3_b00dee21b6e2b989a1f859d6',
        'win_3_94d9285194a37cd59a30081b',
        'win_3_bb56b59f38c107ef15efbd60',
        'win_3_fb8395044c7cb3b04103bb7c',
        'win_3_4bca6b5fa5fa159e9c49abf5',
        'win_3_51ef38c535115bb8ed3d67ba',
        'win_3_fc4a2bba01e6f0e6fadf722a',
        'win_3_b52e43a9595fe218b553600c',
        'win_3_b7a8caf2626f99eb31789dab',
      ],
      anchor: {
        type: 'vector2',
        value: [0, 0],
      },
      blendMode: 'premultiplied_alpha',
      randomSeed: {
        type: 'random',
      },
      inWorldSpace: false,
      shader: 'particleDefaultShader',
      maskShader: 'particleDefaultMaskShader',
      shape: {
        type: 'line',
        position: {
          type: 'vector2',
          value: [0, -32.12],
        },
        direction: 'global',
        pivot: {
          type: 'vector2',
          value: [100, 0],
        },
        p1: {
          type: 'vector2',
          value: [-50, 0],
        },
        p2: {
          type: 'vector2',
          value: [50, 0],
        },
      },
      startDelay: {
        type: 'scalar',
        value: [0],
      },
      emitDuration: {
        type: 'scalar',
        value: [1],
      },
      loopDelay: {
        type: 'scalar',
        value: [0],
      },
      loopAmount: {
        type: 'scalar',
        value: [-1],
      },
      revParticleDrawOrder: false,
      particleAlignToDirection: false,
      particleLifetime: {
        type: 'scalar',
        value: [1],
      },
      particleDirection: {
        type: 'minmax',
        value: [265, 275],
      },
      particleAngle: {
        type: 'minmax',
        value: [0, 360],
      },
      particleLinearSpeed: {
        type: 'minmax',
        value: [200, 300],
      },
      particleRotationSpeed: {
        type: 'minmax',
        value: [0, 0],
      },
      particleSize: [
        {
          type: 'minmax',
          value: [250, 300],
        },
      ],
      particleColor: [
        {
          type: 'scalar',
          value: [1],
        },
        {
          type: 'scalar',
          value: [1],
        },
        {
          type: 'scalar',
          value: [1],
        },
        {
          type: 'scalar',
          value: [1],
        },
      ],
      particleEnableDarkColor: true,
      particleDarkColor: [
        {
          type: 'scalar',
          value: [1],
        },
        {
          type: 'scalar',
          value: [1],
        },
        {
          type: 'scalar',
          value: [1],
        },
        {
          type: 'scalar',
          value: [1],
        },
      ],
      particleImageFrameOffset: {
        type: 'minmax',
        value: [0, 0],
      },
      affectors: {
        acceleration: {
          enabled: false,
          linearRange: {
            type: 'vector2',
            value: [0, 250],
          },
          angularValue: {
            type: 'scalar',
            value: [0],
          },
        },
        dragOverLifetime: {
          enabled: false,
          linearDrag: {
            type: 'scalar',
            value: [200],
          },
          linearCurveValues: [
            [0, 1, 1, 1],
            [0, 1, 1, 1],
          ],
          linearEaseType: [0, 0],
          angularDrag: {
            type: 'scalar',
            value: [200],
          },
          angularCurveValues: [0, 1, 1, 1],
          angularEaseType: 0,
        },
        animation: {
          enabled: true,
          range: {
            type: 'scalar',
            value: [30],
          },
          type: 'once',
        },
        scaleOverLifetime: {
          enabled: true,
          easeType: [1, 1],
          range: [
            {
              type: 'vector2',
              value: [0, 1],
            },
            {
              type: 'vector2',
              value: [0, 1],
            },
          ],
          separateAxis: false,
          values: [
            [0, 1, 1, 0.2532188841201717],
            [0, 1, 1, 0.2532188841201717],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 1, 1, 1, 1, 0.09090909090909091, 0.9803921568627451,
            0.9686274509803922, 0.7843137254901961, 1, 0.2961038961038961, 1,
            0.9019607843137255, 0.7490196078431373, 1, 1, 1, 0.2901960784313726,
            0.6901960784313725, 0,
          ],
          darkEaseType: 0,
          darkValues: [
            0, 1, 0.9607843137254902, 0.7215686274509804, 1, 0.2779220779220779,
            1, 0.792156862745098, 0.4588235294117647, 1, 0.8051948051948052,
            0.18823529411764706, 0, 0.2980392156862745, 1, 1,
            0.18823529411764706, 0, 0.13333333333333333, 0,
          ],
        },
        pointAccelerator: {
          enabled: false,
          point: {
            type: 'vector2',
            value: [0, 0],
          },
          magnitude: {
            type: 'scalar',
            value: [500],
          },
          magnitudeValues: [
            [0, 1, 1, 1],
            [0, 1, 1, 1],
          ],
          magnitudeEaseType: [0, 0],
        },
      },
    },
    {
      id: 'glow',
      enabled: true,
      prewarm: false,
      maxParticleNum: {
        type: 'scalar',
        value: [64],
      },
      emitRate: {
        type: 'scalar',
        value: [10],
      },
      images: ['win_3_7b30db4c8c1dfb64ae6fa658'],
      anchor: {
        type: 'vector2',
        value: [0, 0],
      },
      blendMode: 'add',
      randomSeed: {
        type: 'random',
      },
      inWorldSpace: false,
      shader: 'particleDefaultShader',
      maskShader: 'particleDefaultMaskShader',
      shape: {
        type: 'line',
        position: {
          type: 'vector2',
          value: [0, -32.12],
        },
        direction: 'global',
        pivot: {
          type: 'vector2',
          value: [100, 0],
        },
        p1: {
          type: 'vector2',
          value: [-50, 0],
        },
        p2: {
          type: 'vector2',
          value: [50, 0],
        },
      },
      startDelay: {
        type: 'scalar',
        value: [0],
      },
      emitDuration: {
        type: 'scalar',
        value: [1],
      },
      loopDelay: {
        type: 'scalar',
        value: [0],
      },
      loopAmount: {
        type: 'scalar',
        value: [-1],
      },
      revParticleDrawOrder: false,
      particleAlignToDirection: false,
      particleLifetime: {
        type: 'scalar',
        value: [1],
      },
      particleDirection: {
        type: 'minmax',
        value: [265, 275],
      },
      particleAngle: {
        type: 'minmax',
        value: [0, 360],
      },
      particleLinearSpeed: {
        type: 'minmax',
        value: [120, 320],
      },
      particleRotationSpeed: {
        type: 'minmax',
        value: [0, 0],
      },
      particleSize: [
        {
          type: 'minmax',
          value: [350, 450],
        },
      ],
      particleColor: [
        {
          type: 'minmax',
          value: [1, 1],
        },
        {
          type: 'minmax',
          value: [1, 1],
        },
        {
          type: 'minmax',
          value: [1, 1],
        },
        {
          type: 'minmax',
          value: [0.3137254901960784, 0.6196078431372549],
        },
      ],
      particleEnableDarkColor: false,
      particleDarkColor: [
        {
          type: 'scalar',
          value: [1],
        },
        {
          type: 'scalar',
          value: [1],
        },
        {
          type: 'scalar',
          value: [1],
        },
        {
          type: 'scalar',
          value: [1],
        },
      ],
      particleImageFrameOffset: {
        type: 'minmax',
        value: [0, 0],
      },
      affectors: {
        acceleration: {
          enabled: false,
          linearRange: {
            type: 'vector2',
            value: [0, 250],
          },
          angularValue: {
            type: 'scalar',
            value: [0],
          },
        },
        dragOverLifetime: {
          enabled: false,
          linearDrag: {
            type: 'scalar',
            value: [200],
          },
          linearCurveValues: [
            [0, 1, 1, 1],
            [0, 1, 1, 1],
          ],
          linearEaseType: [0, 0],
          angularDrag: {
            type: 'scalar',
            value: [200],
          },
          angularCurveValues: [0, 1, 1, 1],
          angularEaseType: 0,
        },
        animation: {
          enabled: false,
          range: {
            type: 'scalar',
            value: [30],
          },
          type: 'once',
        },
        scaleOverLifetime: {
          enabled: false,
          easeType: [1, 1],
          range: [
            {
              type: 'vector2',
              value: [0, 1],
            },
            {
              type: 'vector2',
              value: [0, 1],
            },
          ],
          separateAxis: false,
          values: [
            [0, 1, 1, 0.2532188841201717],
            [0, 1, 1, 0.2532188841201717],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 1, 0.8941176470588236, 0, 0, 0.10649350649350649, 1,
            0.8627450980392157, 0.5490196078431373, 1, 0.5792207792207792,
            0.6784313725490196, 0.1450980392156863, 0.34901960784313724, 0.75,
            1, 1, 0, 0.7490196078431373, 0,
          ],
          darkEaseType: 0,
          darkValues: [
            0, 1, 0.9568627450980393, 0.8, 1, 0.2727272727272727,
            0.6470588235294118, 0.3215686274509804, 0.20392156862745098, 1,
            0.6155844155844156, 0.27058823529411763, 0.07450980392156863,
            0.027450980392156862, 1, 1, 0.1803921568627451, 0, 0, 1,
          ],
        },
        pointAccelerator: {
          enabled: false,
          point: {
            type: 'vector2',
            value: [0, 0],
          },
          magnitude: {
            type: 'scalar',
            value: [500],
          },
          magnitudeValues: [
            [0, 1, 1, 1],
            [0, 1, 1, 1],
          ],
          magnitudeEaseType: [0, 0],
        },
      },
    },
    {
      id: 'embers',
      enabled: true,
      prewarm: false,
      maxParticleNum: {
        type: 'scalar',
        value: [64],
      },
      emitRate: {
        type: 'scalar',
        value: [10],
      },
      images: [
        'win_3_2e88cb9eb9448e72fc668f2d',
        'win_3_b23889a033f24b7d16d3218c',
        'win_3_28961391074e5c057dbb1cdc',
      ],
      anchor: {
        type: 'vector2',
        value: [0, 0],
      },
      blendMode: 'add',
      randomSeed: {
        type: 'random',
      },
      inWorldSpace: false,
      shader: 'particleDefaultShader',
      maskShader: 'particleDefaultMaskShader',
      shape: {
        type: 'point',
        position: {
          type: 'vector2',
          value: [0, -40.61],
        },
        direction: 'global',
        pivot: {
          type: 'vector2',
          value: [100, 0],
        },
      },
      startDelay: {
        type: 'scalar',
        value: [0],
      },
      emitDuration: {
        type: 'scalar',
        value: [1],
      },
      loopDelay: {
        type: 'scalar',
        value: [0],
      },
      loopAmount: {
        type: 'scalar',
        value: [-1],
      },
      revParticleDrawOrder: false,
      particleAlignToDirection: false,
      particleLifetime: {
        type: 'minmax',
        value: [1.5, 2],
      },
      particleDirection: {
        type: 'minmax',
        value: [245, 295],
      },
      particleAngle: {
        type: 'minmax',
        value: [0, 360],
      },
      particleLinearSpeed: {
        type: 'minmax',
        value: [100, 200],
      },
      particleRotationSpeed: {
        type: 'minmax',
        value: [0, 0],
      },
      particleSize: [
        {
          type: 'minmax',
          value: [20, 30],
        },
      ],
      particleColor: [
        {
          type: 'scalar',
          value: [1],
        },
        {
          type: 'scalar',
          value: [1],
        },
        {
          type: 'scalar',
          value: [1],
        },
        {
          type: 'scalar',
          value: [1],
        },
      ],
      particleEnableDarkColor: false,
      particleDarkColor: [
        {
          type: 'scalar',
          value: [0],
        },
        {
          type: 'scalar',
          value: [0],
        },
        {
          type: 'scalar',
          value: [0],
        },
        {
          type: 'scalar',
          value: [1],
        },
      ],
      particleImageFrameOffset: {
        type: 'minmax',
        value: [0, 2],
      },
      affectors: {
        acceleration: {
          enabled: false,
          linearRange: {
            type: 'vector2',
            value: [0, 250],
          },
          angularValue: {
            type: 'scalar',
            value: [0],
          },
        },
        dragOverLifetime: {
          enabled: false,
          linearDrag: {
            type: 'scalar',
            value: [200],
          },
          linearCurveValues: [
            [0, 1, 1, 1],
            [0, 1, 1, 1],
          ],
          linearEaseType: [0, 0],
          angularDrag: {
            type: 'scalar',
            value: [200],
          },
          angularCurveValues: [0, 1, 1, 1],
          angularEaseType: 0,
        },
        animation: {
          enabled: false,
          range: {
            type: 'minmax',
            value: [60, 60],
          },
          type: 'forward',
        },
        scaleOverLifetime: {
          enabled: true,
          easeType: [17, 17],
          range: [
            {
              type: 'vector2',
              value: [0, 1],
            },
            {
              type: 'vector2',
              value: [0, 1],
            },
          ],
          separateAxis: false,
          values: [
            [0, 1, 0.505586592178771, 0.4978540772532189, 1, 0],
            [0, 1, 0.505586592178771, 0.4978540772532189, 1, 0],
          ],
        },
        colorOverLifetime: {
          enabled: false,
          colorEaseType: 0,
          colorValues: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          darkEaseType: 0,
          darkValues: [0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
        },
        pointAccelerator: {
          enabled: false,
          point: {
            type: 'vector2',
            value: [0, 0],
          },
          magnitude: {
            type: 'scalar',
            value: [500],
          },
          magnitudeValues: [
            [0, 1, 1, 1],
            [0, 1, 1, 1],
          ],
          magnitudeEaseType: [0, 0],
        },
      },
    },
  ],
};
