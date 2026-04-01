/* eslint-disable prettier/prettier */

import * as particle from '@apila/particle-runtime';

export const DOUBLING_WIN_2: particle.EffectProperties = {
  version: {
    major: 8,
    minor: 0,
    patch: 0,
  },
  maskImage: 'doubling_win_2-mask-card_mask',
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
      id: 'edges',
      enabled: true,
      prewarm: true,
      maxParticleNum: {
        type: 'scalar',
        value: [64],
      },
      emitRate: {
        type: 'scalar',
        value: [45],
      },
      images: [
        'doubling_win_2_2b69391bb0533f3e8323319c',
        'doubling_win_2_18ad72fc58246ef6caa92a88',
        'doubling_win_2_8a880de2bb2aebd4c9291aad',
        'doubling_win_2_e64d672238e19fcbab7851e2',
        'doubling_win_2_99d45d44a17c0a39e92fc9fa',
        'doubling_win_2_70b191f59087890afe22f4e6',
        'doubling_win_2_04f56202093a516042b95bc0',
        'doubling_win_2_c3b8ef12a32434280f0b3222',
        'doubling_win_2_01acbcc6ccc19540e2d67bf9',
        'doubling_win_2_27a1a2b5451c43d7dfb0bcd3',
        'doubling_win_2_a2bf2666a94dd8ac1076499b',
        'doubling_win_2_5293da8e3403df7d36565304',
        'doubling_win_2_56dd93039d2397f9dc855cd6',
        'doubling_win_2_f3acd1792173e9686d7c2a3e',
        'doubling_win_2_07ba6bd2b17ea6dfdc7f54be',
        'doubling_win_2_77cde43c78c1da021f163ebe',
        'doubling_win_2_c3e4e1d21c3b127cdc99b1f3',
        'doubling_win_2_651d51070bf35f7e01246298',
        'doubling_win_2_1277786e07066aea95f024c7',
        'doubling_win_2_9f2bb2bc7b42f5baab5fd4e7',
        'doubling_win_2_8c616626483bf00d22b3c5e7',
        'doubling_win_2_9e25445e3e32d25662d1bdb3',
        'doubling_win_2_5913f63370f770535cbee118',
        'doubling_win_2_adb72aa43fab88d72fd87a1c',
        'doubling_win_2_2ab386fa396562346792f9b1',
        'doubling_win_2_fcfe77fca6b72efaa213ae71',
        'doubling_win_2_28924a091c0f18991a0918b0',
        'doubling_win_2_220341775b8148a35d2ac72a',
        'doubling_win_2_b75179a6574cd65438a2fe93',
        'doubling_win_2_c9f0bd5b6bd9eb1344dbf269',
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
        type: 'rect',
        position: {
          type: 'vector2',
          value: [0, 0],
        },
        direction: 'radial',
        pivot: {
          type: 'vector2',
          value: [0, 0],
        },
        angle: {
          type: 'scalar',
          value: [0],
        },
        minSize: {
          type: 'vector2',
          value: [365, 480],
        },
        maxSize: {
          type: 'vector2',
          value: [365, 480],
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
        value: [0],
      },
      particleAngle: {
        type: 'minmax',
        value: [0, 360],
      },
      particleLinearSpeed: {
        type: 'minmax',
        value: [-20, -10],
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
          value: [0.7058823529411765],
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
            [0, 0, 1, 1],
            [0, 0, 1, 1],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 1, 1, 1, 1, 0.1012987012987013, 0.9803921568627451,
            0.9568627450980393, 0.7843137254901961, 0.75, 0.4155844155844156, 1,
            0.9058823529411765, 0.5294117647058824, 0.5, 1, 1,
            0.7254901960784313, 0.2901960784313726, 0,
          ],
          darkEaseType: 0,
          darkValues: [
            0, 0.9921568627450981, 0.9725490196078431, 0.8588235294117647, 1,
            0.3246753246753247, 1, 0.8901960784313725, 0.5098039215686274, 1, 1,
            1, 0.6509803921568628, 0, 0,
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
      id: 'gloss',
      enabled: true,
      prewarm: false,
      maxParticleNum: {
        type: 'scalar',
        value: [64],
      },
      emitRate: {
        type: 'scalar',
        value: [1],
      },
      images: ['doubling_win_2_4b24fe2ab029855dc2baa29a'],
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
          value: [-153, 155],
        },
        direction: 'global',
        pivot: {
          type: 'vector2',
          value: [100, 0],
        },
      },
      startDelay: {
        type: 'minmax',
        value: [0, 0.5],
      },
      emitDuration: {
        type: 'scalar',
        value: [1],
      },
      loopDelay: {
        type: 'scalar',
        value: [3],
      },
      loopAmount: {
        type: 'scalar',
        value: [-1],
      },
      revParticleDrawOrder: false,
      particleAlignToDirection: false,
      particleLifetime: {
        type: 'scalar',
        value: [2],
      },
      particleDirection: {
        type: 'scalar',
        value: [315],
      },
      particleAngle: {
        type: 'scalar',
        value: [135],
      },
      particleLinearSpeed: {
        type: 'minmax',
        value: [300, 400],
      },
      particleRotationSpeed: {
        type: 'minmax',
        value: [0, 0],
      },
      particleSize: [
        {
          type: 'minmax',
          value: [200, 400],
        },
        {
          type: 'scalar',
          value: [400],
        },
      ],
      particleColor: [
        {
          type: 'minmax',
          value: [1, 1],
        },
        {
          type: 'minmax',
          value: [0.9686274509803922, 0.9607843137254902],
        },
        {
          type: 'minmax',
          value: [0.6431372549019608, 0.40784313725490196],
        },
        {
          type: 'minmax',
          value: [0.6, 0.4117647058823529],
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
            0, 1, 1, 1, 0.5, 0.5012987012987012, 1, 1, 1, 1, 1, 1, 1, 1,
            0.5019607843137255,
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
  ],
};
