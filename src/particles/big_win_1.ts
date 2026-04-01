/* eslint-disable prettier/prettier */

import * as particle from '@apila/particle-runtime';

export const BIG_WIN_1: particle.EffectProperties = {
  version: {
    major: 8,
    minor: 0,
    patch: 0,
  },
  maskImage: 'big_win_1-mask-crown_mask',
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
        value: [60],
      },
      images: [
        'big_win_1_7d9085e09a6a9716f98266f2',
        'big_win_1_536090db4042967b3b985cb3',
        'big_win_1_51fd0331240d9fd9fa34811b',
        'big_win_1_d89ca19d774dbbd2b1b0755f',
        'big_win_1_622082b73b62265d4d74d35f',
        'big_win_1_c12f7d330ea20dc7a5559ebd',
        'big_win_1_136e5202a48ea2105b4221a4',
        'big_win_1_c1a4618649d437f3760fe568',
        'big_win_1_d1f3ce468302887c1286adcb',
        'big_win_1_e2232024684f0d4e3d37334d',
        'big_win_1_54a2e343e5f8169e61990b11',
        'big_win_1_5b39f47d4b0279a66676e2a9',
        'big_win_1_c6ccead4642adeb2abb93e45',
        'big_win_1_e90fced8b1e92c57305f3fd8',
        'big_win_1_960961cc5c22fd18fbe95be1',
        'big_win_1_49d3d66d4b64fe188d5d2e17',
        'big_win_1_9899535667260ef1591aa33c',
        'big_win_1_8661203dc46a9c4c2412a43a',
        'big_win_1_b81df9cec2ec8cc4f1d3582c',
        'big_win_1_33ca35a49d0b84345921f1bd',
        'big_win_1_dcdb705333f48bf65e18f4f3',
        'big_win_1_3434b355c4cd17ed33024bd2',
        'big_win_1_bf14492ed5c266d30cb8194f',
        'big_win_1_1fda099fadd33916bb3231e0',
        'big_win_1_8fbb3d1a04ed8478d26b0867',
        'big_win_1_d363073d282f0d654bf768b9',
        'big_win_1_e98b512bed7118cc94cdb7e2',
        'big_win_1_e5df2ae6a0faa85dca46bb99',
        'big_win_1_bb6cb452e37a5bfd3da8701a',
        'big_win_1_057f6fa0ac57ddfb46c764c3',
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
        type: 'line',
        position: {
          type: 'vector2',
          value: [0, 300],
        },
        direction: 'global',
        pivot: {
          type: 'vector2',
          value: [100, 0],
        },
        p1: {
          type: 'vector2',
          value: [-400, 0],
        },
        p2: {
          type: 'vector2',
          value: [400, 0],
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
        type: 'scalar',
        value: [270],
      },
      particleAngle: {
        type: 'minmax',
        value: [0, 360],
      },
      particleLinearSpeed: {
        type: 'minmax',
        value: [700, 900],
      },
      particleRotationSpeed: {
        type: 'minmax',
        value: [0, 0],
      },
      particleSize: [
        {
          type: 'minmax',
          value: [500, 800],
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
          value: [0.39215686274509803, 0.6274509803921569],
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
          value: [0],
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
            value: [25],
          },
          type: 'once',
        },
        scaleOverLifetime: {
          enabled: true,
          easeType: [3, 3],
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
            [
              0, 0.7467811158798283, 0.2905027932960894, 1, 0.6983240223463687,
              0.7467811158798283, 1, 1,
            ],
            [
              0, 0.7467811158798283, 0.2905027932960894, 1, 0.6983240223463687,
              0.7467811158798283, 1, 1,
            ],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 1, 0.8823529411764706, 0.23529411764705882, 1, 1, 1,
            0.2823529411764706, 0, 1,
          ],
          darkEaseType: 0,
          darkValues: [
            0, 1, 0.9725490196078431, 0.8588235294117647, 1,
            0.34545454545454546, 1, 0.7294117647058823, 0, 1, 1, 1,
            0.14901960784313725, 0, 1,
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
  ],
};
