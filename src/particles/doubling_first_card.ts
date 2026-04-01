/* eslint-disable prettier/prettier */

import * as particle from '@apila/particle-runtime';

export const DOUBLING_FIRST_CARD: particle.EffectProperties = {
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
      id: 'flame',
      enabled: true,
      prewarm: true,
      maxParticleNum: {
        type: 'scalar',
        value: [64],
      },
      emitRate: {
        type: 'scalar',
        value: [55],
      },
      images: [
        'doubling_first_card_0062223d56eca75d5d71f571',
        'doubling_first_card_b24bb9f79e06f911ee6e8c8f',
        'doubling_first_card_5d528bc5d0f7f217b18689a5',
        'doubling_first_card_63c43367c965c84f4c5ffa71',
        'doubling_first_card_91009f23d166c567e06b5aa7',
        'doubling_first_card_20b187c91dbbffff3f198bcf',
        'doubling_first_card_b7e142ff476739302d103746',
        'doubling_first_card_0e46020d52fb9536e2656231',
        'doubling_first_card_aa09e0dc4835ccd0bfce44b9',
        'doubling_first_card_567d2dfe860248051e7d4acd',
        'doubling_first_card_b1b17018905f26be20ff9b33',
        'doubling_first_card_c0c09ee1cb0d671e5c164c3d',
        'doubling_first_card_54d3d82fb47036fa34ebeabb',
        'doubling_first_card_8a6d32802fbdc815d4e64f0b',
        'doubling_first_card_909ffcf85ea33a34e18020be',
        'doubling_first_card_707a42e77e630d6b0cb1bc37',
        'doubling_first_card_6d8b8d7fecf6a117969372d5',
        'doubling_first_card_d39eab87e0afc5c1124c2f40',
        'doubling_first_card_2a133358f4cb3557d29375fe',
        'doubling_first_card_92fd7d6d9388f764cf2aad0c',
        'doubling_first_card_c6549926fde0f681f0704f88',
        'doubling_first_card_ae7c603b06f5bb93ea91ccde',
        'doubling_first_card_583866ff0f70aae01eb94451',
        'doubling_first_card_30d976eb17118b8c286d1caf',
        'doubling_first_card_0a3cfc7cc088e478a4aa72c1',
        'doubling_first_card_9f4e037f553ebbcb0641791d',
        'doubling_first_card_574cfca77deafeccd6c119d1',
        'doubling_first_card_2d9495a4d94b67031ebecdc6',
        'doubling_first_card_1d9904beff16745ec4b9a1ed',
        'doubling_first_card_99c62cff67d7cddce3ce090b',
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
        type: 'rect',
        position: {
          type: 'vector2',
          value: [0, 0],
        },
        direction: 'global',
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
          value: [305, 420],
        },
        maxSize: {
          type: 'vector2',
          value: [305, 420],
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
        value: [225, 315],
      },
      particleAngle: {
        type: 'minmax',
        value: [0, 360],
      },
      particleLinearSpeed: {
        type: 'scalar',
        value: [0],
      },
      particleRotationSpeed: {
        type: 'minmax',
        value: [0, 0],
      },
      particleSize: [
        {
          type: 'minmax',
          value: [300, 350],
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
          value: [0.47058823529411764, 0.7058823529411765],
        },
      ],
      particleEnableDarkColor: false,
      particleDarkColor: [
        {
          type: 'minmax',
          value: [0, 0],
        },
        {
          type: 'minmax',
          value: [0, 0],
        },
        {
          type: 'minmax',
          value: [0, 0],
        },
        {
          type: 'minmax',
          value: [0.11764705882352941, 0.3137254901960784],
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
            [0, 0, 1, 1],
            [0, 0, 1, 1],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 1, 0.4627450980392157, 0.16862745098039217, 1,
            0.35844155844155845, 1, 0.5647058823529412, 0, 1, 1, 1,
            0.36470588235294116, 0.0196078431372549, 0,
          ],
          darkEaseType: 0,
          darkValues: [
            0, 1, 0.8784313725490196, 0.7450980392156863, 1, 1, 1,
            0.5882352941176471, 0.5882352941176471, 1,
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
