/* eslint-disable prettier/prettier */

import * as particle from '@apila/particle-runtime';

export const DRAGON_BREATH_2: particle.EffectProperties = {
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
        value: [40],
      },
      images: [
        'dragon_breath_2_60ad23a0c3e34c3492b5da98',
        'dragon_breath_2_b4a743c73b8d46e90fb41853',
        'dragon_breath_2_25eede0fa7a8380c1083b48c',
        'dragon_breath_2_83616b72f5097be7034e8d19',
        'dragon_breath_2_2ebafcad7b5f9ff2c8171a65',
        'dragon_breath_2_64911b377dbd4753e21ce7af',
        'dragon_breath_2_b53a2d12293714518104e7f0',
        'dragon_breath_2_59d8472fcf9ef85a11e9fc12',
        'dragon_breath_2_0eb25d558aaaa7291a3e794b',
        'dragon_breath_2_444da1e6adabc730a20e6b6a',
        'dragon_breath_2_490c4f5658d3b583e51605cf',
        'dragon_breath_2_f4348c2e32109ddd8a9622e8',
        'dragon_breath_2_23149ba25bffff482999c9bd',
        'dragon_breath_2_7a5b7ef2db0689a93ba8b9c0',
        'dragon_breath_2_3a3f6d15b06bd0a5fd7ac231',
        'dragon_breath_2_946523e9793ec913e25ac188',
        'dragon_breath_2_38eaa3854d0ccaccac34dd75',
        'dragon_breath_2_73f431c8e1e409985527800a',
        'dragon_breath_2_e08b09829e829b830924ace5',
        'dragon_breath_2_7c61f36160c3d56cb7424277',
        'dragon_breath_2_c77c7c63fec24739075b7c4e',
        'dragon_breath_2_28b7068d81696ebb6cba00e4',
        'dragon_breath_2_f5e796102c9ae63517dd3b77',
        'dragon_breath_2_6a4147941266422aeb278c4a',
        'dragon_breath_2_b4d9739c9d963ca185f38fb5',
        'dragon_breath_2_ef4252287ea9c09e02ce1aa5',
        'dragon_breath_2_51f8508798fbd4d28399d4e4',
        'dragon_breath_2_a39121d46036a4cc16ad2799',
        'dragon_breath_2_0e72156f8d9579f9ebc5bb40',
        'dragon_breath_2_6057eea339513d586d3c96d5',
      ],
      anchor: {
        type: 'vector2',
        value: [0, 0],
      },
      blendMode: 'premultiplied_alpha',
      randomSeed: {
        type: 'scalar',
        value: [1],
      },
      inWorldSpace: false,
      shader: 'particleDefaultShader',
      maskShader: 'particleDefaultMaskShader',
      shape: {
        type: 'point',
        position: {
          type: 'vector2',
          value: [0, 0],
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
        value: [1],
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
        value: [250, 400],
      },
      particleRotationSpeed: {
        type: 'minmax',
        value: [0, 0],
      },
      particleSize: [
        {
          type: 'minmax',
          value: [50, 80],
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
          value: [0.49, 0.75],
        },
      ],
      particleEnableDarkColor: true,
      particleDarkColor: [
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
          value: [0.26, 0.59],
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
            value: [0, 100],
          },
          angularValue: {
            type: 'scalar',
            value: [2],
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
            [0, 0, 0.6005586592178771, 1, 1, 1],
            [0, 0, 0.6005586592178771, 1, 1, 1],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 1, 1, 1, 1, 0.13506493506493505, 1, 0.9725490196078431,
            0.7294117647058823, 1, 0.3220779220779221, 1, 0.8117647058823529,
            0.5490196078431373, 1, 1, 0.8117647058823529, 0, 1, 0,
          ],
          darkEaseType: 0,
          darkValues: [
            0, 0.996078431372549, 1, 0.7411764705882353, 1, 0.2987012987012987,
            1, 0.6588235294117647, 0.2901960784313726, 1, 0.8025974025974026,
            0.2980392156862745, 0, 0.47058823529411764, 1, 1,
            0.16862745098039217, 0.00784313725490196, 0.5137254901960784, 0.1,
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
        value: [35],
      },
      images: ['dragon_breath_2_4c762af7e8fa4379edfb51b3'],
      anchor: {
        type: 'vector2',
        value: [0, 0],
      },
      blendMode: 'add',
      randomSeed: {
        type: 'scalar',
        value: [1],
      },
      inWorldSpace: false,
      shader: 'particleDefaultShader',
      maskShader: 'particleDefaultMaskShader',
      shape: {
        type: 'point',
        position: {
          type: 'vector2',
          value: [0, 0],
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
        value: [1],
      },
      revParticleDrawOrder: false,
      particleAlignToDirection: false,
      particleLifetime: {
        type: 'scalar',
        value: [1],
      },
      particleDirection: {
        type: 'minmax',
        value: [260, 280],
      },
      particleAngle: {
        type: 'minmax',
        value: [0, 360],
      },
      particleLinearSpeed: {
        type: 'minmax',
        value: [250, 400],
      },
      particleRotationSpeed: {
        type: 'minmax',
        value: [0, 0],
      },
      particleSize: [
        {
          type: 'minmax',
          value: [100, 250],
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
          value: [0.32, 0.66],
        },
      ],
      particleEnableDarkColor: false,
      particleDarkColor: [
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
          value: [0.26, 0.59],
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
            value: [0, 100],
          },
          angularValue: {
            type: 'scalar',
            value: [2],
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
            [0, 0, 0.6061452513966481, 1, 1, 1],
            [0, 0, 0.6061452513966481, 1, 1, 1],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 1, 0.8745098039215686, 0, 1, 0.2727272727272727, 1,
            0.25882352941176473, 0.7568627450980392, 0.67, 0.6103896103896104,
            0.7176470588235294, 0, 1, 0.39, 1, 0.10980392156862745, 0,
            0.48627450980392156, 0,
          ],
          darkEaseType: 0,
          darkValues: [
            0, 0.9490196078431372, 0.9254901960784314, 0.7686274509803922, 1,
            0.17922077922077922, 1, 0.8784313725490196, 0.4470588235294118, 1,
            0.509090909090909, 0.7411764705882353, 0.2196078431372549,
            0.0784313725490196, 1, 1, 0.5882352941176471, 0, 0, 0,
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
