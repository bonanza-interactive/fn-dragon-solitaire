/* eslint-disable prettier/prettier */

import * as particle from '@apila/particle-runtime';

export const WIN_2: particle.EffectProperties = {
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
      id: 'flame-L',
      enabled: true,
      prewarm: false,
      maxParticleNum: {
        type: 'scalar',
        value: [64],
      },
      emitRate: {
        type: 'scalar',
        value: [5],
      },
      images: [
        'win_2_2b4026b4e30f1cca52c14491',
        'win_2_140551536738f80419907581',
        'win_2_1f382d6f7957bf60428fedf6',
        'win_2_5b3703c3b9ed4a46721caf29',
        'win_2_1c516772bdf2eea17b18f6ae',
        'win_2_3154d39bc0de25e516111353',
        'win_2_bdf3723dada5e74174dc84ac',
        'win_2_0a71b6f2f474b2f0bc193c04',
        'win_2_9d7c738c8d6e0fbee04c0321',
        'win_2_94b796367d9f60e6573778e8',
        'win_2_14c07084c96a72d2bfcac2ce',
        'win_2_c361ddd2155f5e09ac6e0039',
        'win_2_a51207d70ad36d5acd98b457',
        'win_2_8817bf0ea3fb742692dd0481',
        'win_2_dfabae140044e73893aac89f',
        'win_2_ff74837f771a719cbd5c1081',
        'win_2_4fd5c05269ba49ef1f95b5b3',
        'win_2_4a1cc14b32bc54e840d11300',
        'win_2_2bb32f4ef87091b19d86a64f',
        'win_2_7c35d16a2527f1180a3ccbae',
        'win_2_41961fa8b83fdfec9881d0da',
        'win_2_5f9b77806add95beda7e4fc4',
        'win_2_1bd3da7e4c1979fd601fc86f',
        'win_2_f042ea39c6a014423580caeb',
        'win_2_54e1e14b938bfd683432c284',
        'win_2_f76c2dc728b347d87c42f0f5',
        'win_2_341487fbb785a1c197017ca2',
        'win_2_999ed4753cd196093c511e99',
        'win_2_44b35f19bf3d826e6ce6b2d2',
        'win_2_34421c87643c5d4e30d1e4bb',
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
          value: [0, -32],
        },
        direction: 'global',
        pivot: {
          type: 'vector2',
          value: [0, 0],
        },
        p1: {
          type: 'vector2',
          value: [-100, 200],
        },
        p2: {
          type: 'vector2',
          value: [-130, 50],
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
        type: 'scalar',
        value: [0],
      },
      particleLinearSpeed: {
        type: 'minmax',
        value: [20, 50],
      },
      particleRotationSpeed: {
        type: 'minmax',
        value: [0, 0],
      },
      particleSize: [
        {
          type: 'minmax',
          value: [-200, 200],
        },
        {
          type: 'minmax',
          value: [400, 550],
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
          value: [0.47058823529411764, 1],
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
            [0, 0.28326180257510725, 1, 1],
            [0, 0.28326180257510725, 1, 1],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 1, 0.9882352941176471, 0.8941176470588236, 1, 1,
            0.6352941176470588, 0.592156862745098, 0.4117647058823529, 0,
          ],
          darkEaseType: 0,
          darkValues: [
            0, 0.9882352941176471, 1, 0.796078431372549, 1, 0.535064935064935,
            0.5372549019607843, 0.5176470588235295, 0.25882352941176473, 0.82,
            1, 0.3254901960784314, 0.30196078431372547, 0.23529411764705882, 0,
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
      id: 'flame-R',
      enabled: true,
      prewarm: false,
      maxParticleNum: {
        type: 'scalar',
        value: [64],
      },
      emitRate: {
        type: 'scalar',
        value: [5],
      },
      images: [
        'win_2_2b4026b4e30f1cca52c14491',
        'win_2_140551536738f80419907581',
        'win_2_1f382d6f7957bf60428fedf6',
        'win_2_5b3703c3b9ed4a46721caf29',
        'win_2_1c516772bdf2eea17b18f6ae',
        'win_2_3154d39bc0de25e516111353',
        'win_2_bdf3723dada5e74174dc84ac',
        'win_2_0a71b6f2f474b2f0bc193c04',
        'win_2_9d7c738c8d6e0fbee04c0321',
        'win_2_94b796367d9f60e6573778e8',
        'win_2_14c07084c96a72d2bfcac2ce',
        'win_2_c361ddd2155f5e09ac6e0039',
        'win_2_a51207d70ad36d5acd98b457',
        'win_2_8817bf0ea3fb742692dd0481',
        'win_2_dfabae140044e73893aac89f',
        'win_2_ff74837f771a719cbd5c1081',
        'win_2_4fd5c05269ba49ef1f95b5b3',
        'win_2_4a1cc14b32bc54e840d11300',
        'win_2_2bb32f4ef87091b19d86a64f',
        'win_2_7c35d16a2527f1180a3ccbae',
        'win_2_41961fa8b83fdfec9881d0da',
        'win_2_5f9b77806add95beda7e4fc4',
        'win_2_1bd3da7e4c1979fd601fc86f',
        'win_2_f042ea39c6a014423580caeb',
        'win_2_54e1e14b938bfd683432c284',
        'win_2_f76c2dc728b347d87c42f0f5',
        'win_2_341487fbb785a1c197017ca2',
        'win_2_999ed4753cd196093c511e99',
        'win_2_44b35f19bf3d826e6ce6b2d2',
        'win_2_34421c87643c5d4e30d1e4bb',
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
          value: [0, -32],
        },
        direction: 'global',
        pivot: {
          type: 'vector2',
          value: [0, 0],
        },
        p1: {
          type: 'vector2',
          value: [100, 200],
        },
        p2: {
          type: 'vector2',
          value: [130, 50],
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
        type: 'scalar',
        value: [0],
      },
      particleLinearSpeed: {
        type: 'minmax',
        value: [20, 50],
      },
      particleRotationSpeed: {
        type: 'minmax',
        value: [0, 0],
      },
      particleSize: [
        {
          type: 'minmax',
          value: [-200, 200],
        },
        {
          type: 'minmax',
          value: [400, 550],
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
          value: [0.47058823529411764, 1],
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
            [0, 0.28326180257510725, 1, 1],
            [0, 0.28326180257510725, 1, 1],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 1, 0.9882352941176471, 0.8941176470588236, 1, 1,
            0.6352941176470588, 0.592156862745098, 0.4117647058823529, 0,
          ],
          darkEaseType: 0,
          darkValues: [
            0, 0.9882352941176471, 1, 0.796078431372549, 1, 0.535064935064935,
            0.5372549019607843, 0.5176470588235295, 0.25882352941176473, 0.82,
            1, 0.3254901960784314, 0.30196078431372547, 0.23529411764705882, 0,
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
      id: 'flame-C',
      enabled: true,
      prewarm: false,
      maxParticleNum: {
        type: 'scalar',
        value: [64],
      },
      emitRate: {
        type: 'scalar',
        value: [4],
      },
      images: [
        'win_2_2b4026b4e30f1cca52c14491',
        'win_2_140551536738f80419907581',
        'win_2_1f382d6f7957bf60428fedf6',
        'win_2_5b3703c3b9ed4a46721caf29',
        'win_2_1c516772bdf2eea17b18f6ae',
        'win_2_3154d39bc0de25e516111353',
        'win_2_bdf3723dada5e74174dc84ac',
        'win_2_0a71b6f2f474b2f0bc193c04',
        'win_2_9d7c738c8d6e0fbee04c0321',
        'win_2_94b796367d9f60e6573778e8',
        'win_2_14c07084c96a72d2bfcac2ce',
        'win_2_c361ddd2155f5e09ac6e0039',
        'win_2_a51207d70ad36d5acd98b457',
        'win_2_8817bf0ea3fb742692dd0481',
        'win_2_dfabae140044e73893aac89f',
        'win_2_ff74837f771a719cbd5c1081',
        'win_2_4fd5c05269ba49ef1f95b5b3',
        'win_2_4a1cc14b32bc54e840d11300',
        'win_2_2bb32f4ef87091b19d86a64f',
        'win_2_7c35d16a2527f1180a3ccbae',
        'win_2_41961fa8b83fdfec9881d0da',
        'win_2_5f9b77806add95beda7e4fc4',
        'win_2_1bd3da7e4c1979fd601fc86f',
        'win_2_f042ea39c6a014423580caeb',
        'win_2_54e1e14b938bfd683432c284',
        'win_2_f76c2dc728b347d87c42f0f5',
        'win_2_341487fbb785a1c197017ca2',
        'win_2_999ed4753cd196093c511e99',
        'win_2_44b35f19bf3d826e6ce6b2d2',
        'win_2_34421c87643c5d4e30d1e4bb',
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
          value: [0, -32],
        },
        direction: 'global',
        pivot: {
          type: 'vector2',
          value: [0, 0],
        },
        p1: {
          type: 'vector2',
          value: [-80, 250],
        },
        p2: {
          type: 'vector2',
          value: [80, 250],
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
        value: [50, 100],
      },
      particleRotationSpeed: {
        type: 'minmax',
        value: [0, 0],
      },
      particleSize: [
        {
          type: 'minmax',
          value: [200, 350],
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
          value: [0.47058823529411764, 1],
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
            [0, 0.28326180257510725, 1, 1],
            [0, 0.28326180257510725, 1, 1],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 1, 0.9882352941176471, 0.8941176470588236, 1, 1,
            0.6352941176470588, 0.592156862745098, 0.4117647058823529, 0,
          ],
          darkEaseType: 0,
          darkValues: [
            0, 0.9882352941176471, 1, 0.796078431372549, 1, 0.535064935064935,
            0.5372549019607843, 0.5176470588235295, 0.25882352941176473, 0.82,
            1, 0.3254901960784314, 0.30196078431372547, 0.23529411764705882, 0,
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
