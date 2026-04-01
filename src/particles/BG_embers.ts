/* eslint-disable prettier/prettier */

import * as particle from '@apila/particle-runtime';

export const BG_EMBERS: particle.EffectProperties = {
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
      id: 'smoke',
      enabled: true,
      prewarm: false,
      maxParticleNum: {
        type: 'scalar',
        value: [100],
      },
      emitRate: {
        type: 'scalar',
        value: [30],
      },
      images: [
        'BG_embers_ffacc9c003f0efc0dadeb064',
        'BG_embers_bfe5a4abbb6be7e251e6914a',
        'BG_embers_c6e1932fcd64883818a28a79',
        'BG_embers_0698efd528fbbb2b721682d1',
        'BG_embers_adce8350f62010d7fc9b1c2f',
        'BG_embers_f74ffdcd38da3521e4d35419',
        'BG_embers_702b498a773beb72dc42f6bf',
        'BG_embers_9436d9ab80113ac190afcbe9',
        'BG_embers_b8b4e361898c204e86ebf416',
        'BG_embers_2561b55255b22e2410928600',
        'BG_embers_1a9429587b3a5383f1833dee',
        'BG_embers_aac41b08096a557ee68d9126',
        'BG_embers_c60b2d087a731a2aa43ca6b0',
        'BG_embers_6ed1a2fe891ceada580bdb50',
        'BG_embers_14c8ba3051b24770121ca92f',
        'BG_embers_69543a176044cb0030c36558',
        'BG_embers_5d1f84e93b080db9dec0fc17',
        'BG_embers_e07dd90bc26006eff7f5c9d2',
        'BG_embers_583d9c648bced7c51431ea17',
        'BG_embers_c5fa9164dd32639991d2eca0',
        'BG_embers_d161ef3d574b63e674c805bf',
        'BG_embers_954f400c57faf9e0f36ebcea',
        'BG_embers_25799a3515e90861f6cba878',
        'BG_embers_8a5d46e1675bfdaf8fae14a4',
        'BG_embers_ea30edcb5a73ea9a191a05f5',
        'BG_embers_473d7ef6643b1f1977b9f375',
        'BG_embers_99225ed7a222602aac78e910',
        'BG_embers_e3b2bf5f4a9fbbe3e7b85f22',
        'BG_embers_f5572b5d154501a5edb700a0',
        'BG_embers_5604e5aa9350be4eb8602588',
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
          value: [0, -70],
        },
        direction: 'global',
        pivot: {
          type: 'vector2',
          value: [100, 0],
        },
        p1: {
          type: 'vector2',
          value: [-960, 0],
        },
        p2: {
          type: 'vector2',
          value: [960, 0],
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
        value: [2.5, 3.5],
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
        value: [10, 20],
      },
      particleRotationSpeed: {
        type: 'minmax',
        value: [-0.5, 0.5],
      },
      particleSize: [
        {
          type: 'minmax',
          value: [400, 500],
        },
      ],
      particleColor: [
        {
          type: 'minmax',
          value: [1, 1],
        },
        {
          type: 'minmax',
          value: [0.3568627450980392, 0.25882352941176473],
        },
        {
          type: 'minmax',
          value: [0.3568627450980392, 0.25882352941176473],
        },
        {
          type: 'minmax',
          value: [0.59, 0.78],
        },
      ],
      particleEnableDarkColor: true,
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
        value: [0, 29],
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
            value: [10],
          },
          type: 'forward',
        },
        scaleOverLifetime: {
          enabled: true,
          easeType: [2, 2],
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
            [0, 0.24463519313304716, 1, 1],
            [0, 0.24463519313304716, 1, 1],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 0.9607843137254902, 0.807843137254902, 0.5647058823529412, 0,
            0.4025974025974026, 1, 0.7490196078431373, 0.4980392156862745, 1, 1,
            0.7254901960784313, 0.10588235294117647, 0.10588235294117647, 0,
          ],
          darkEaseType: 0,
          darkValues: [
            0, 1, 0.6470588235294118, 0.2980392156862745, 0,
            0.42337662337662335, 1, 0.6431372549019608, 0.37254901960784315, 1,
            1, 0.7372549019607844, 0, 0, 0,
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
        value: [8],
      },
      images: ['BG_embers_48cf8d8118bcca8017b56474'],
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
          value: [0, -100],
        },
        direction: 'global',
        pivot: {
          type: 'vector2',
          value: [100, 0],
        },
        p1: {
          type: 'vector2',
          value: [-960, 0],
        },
        p2: {
          type: 'vector2',
          value: [960, 0],
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
        value: [2.5, 3.5],
      },
      particleDirection: {
        type: 'scalar',
        value: [270],
      },
      particleAngle: {
        type: 'scalar',
        value: [0],
      },
      particleLinearSpeed: {
        type: 'minmax',
        value: [50, 80],
      },
      particleRotationSpeed: {
        type: 'scalar',
        value: [0],
      },
      particleSize: [
        {
          type: 'minmax',
          value: [400, 500],
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
          value: [0.19607843137254902, 0.47058823529411764],
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
            type: 'minmax',
            value: [60, 60],
          },
          type: 'forward',
        },
        scaleOverLifetime: {
          enabled: false,
          easeType: [0, 0],
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
            [0, 0, 1, 1],
            [0, 0, 1, 1],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 1, 0.5529411764705883, 0.3607843137254902, 0,
            0.19220779220779222, 1, 0.6901960784313725, 0.3607843137254902, 1,
            1, 0.4470588235294118, 0.1843137254901961, 0, 0,
          ],
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
        value: [45],
      },
      images: [
        'BG_embers_ea824dc6842f41cc6c019f65',
        'BG_embers_fe8de3df3af5c7d5f27de959',
        'BG_embers_18e4e222061cf5bc93cddd4d',
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
          value: [0, 0],
        },
        direction: 'global',
        pivot: {
          type: 'vector2',
          value: [100, 0],
        },
        p1: {
          type: 'vector2',
          value: [-960, 0],
        },
        p2: {
          type: 'vector2',
          value: [960, 0],
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
        value: [2, 4],
      },
      particleDirection: {
        type: 'minmax',
        value: [225, 315],
      },
      particleAngle: {
        type: 'minmax',
        value: [0, 0],
      },
      particleLinearSpeed: {
        type: 'minmax',
        value: [50, 150],
      },
      particleRotationSpeed: {
        type: 'minmax',
        value: [0, 0],
      },
      particleSize: [
        {
          type: 'minmax',
          value: [10, 30],
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
          easeType: [16, 16],
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
            [0, 1, 0.3994413407821229, 0.7467811158798283, 1, 0],
            [0, 1, 0.3994413407821229, 0.7467811158798283, 1, 0],
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
    {
      id: 'embers_burst',
      enabled: true,
      prewarm: false,
      maxParticleNum: {
        type: 'scalar',
        value: [64],
      },
      emitRate: {
        type: 'scalar',
        value: [120],
      },
      images: [
        'BG_embers_ea824dc6842f41cc6c019f65',
        'BG_embers_fe8de3df3af5c7d5f27de959',
        'BG_embers_18e4e222061cf5bc93cddd4d',
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
          value: [0, 0],
        },
        direction: 'global',
        pivot: {
          type: 'vector2',
          value: [100, 0],
        },
        p1: {
          type: 'vector2',
          value: [-960, 0],
        },
        p2: {
          type: 'vector2',
          value: [960, 0],
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
        type: 'minmax',
        value: [15, 40],
      },
      loopAmount: {
        type: 'scalar',
        value: [-1],
      },
      revParticleDrawOrder: false,
      particleAlignToDirection: false,
      particleLifetime: {
        type: 'minmax',
        value: [2, 4],
      },
      particleDirection: {
        type: 'minmax',
        value: [225, 315],
      },
      particleAngle: {
        type: 'minmax',
        value: [0, 0],
      },
      particleLinearSpeed: {
        type: 'minmax',
        value: [50, 150],
      },
      particleRotationSpeed: {
        type: 'minmax',
        value: [0, 0],
      },
      particleSize: [
        {
          type: 'minmax',
          value: [10, 30],
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
          easeType: [16, 16],
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
            [0, 1, 0.3994413407821229, 0.7467811158798283, 1, 0],
            [0, 1, 0.3994413407821229, 0.7467811158798283, 1, 0],
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
