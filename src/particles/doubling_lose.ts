/* eslint-disable prettier/prettier */

import * as particle from '@apila/particle-runtime';

export const DOUBLING_LOSE: particle.EffectProperties = {
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
        value: [64],
      },
      emitRate: {
        type: 'scalar',
        value: [5],
      },
      images: [
        'doubling_lose_51d5d05145c8ca9972571333',
        'doubling_lose_171d255233a74c33eb44c926',
        'doubling_lose_1cad7f650065660de9b7f872',
        'doubling_lose_e2cceb9659fd308cf6eed637',
        'doubling_lose_4e0400700b5f4a2d37c5b8fc',
        'doubling_lose_5b6a0fd1c58f55e91f5aa99b',
        'doubling_lose_86633d589f49bb6beabfd1eb',
        'doubling_lose_b700e87edcf6ae34c6fc9202',
        'doubling_lose_892ee41bfe094f14a6d302d9',
        'doubling_lose_7ecca3fe7670b287d2cbd7bd',
        'doubling_lose_35ecf0fc71d432de4c306773',
        'doubling_lose_525b2bf2855f6d5c67897bbd',
        'doubling_lose_56ddfa3693fd59252f8f2091',
        'doubling_lose_4fe52b22ff609eb44bc6c6a3',
        'doubling_lose_62485a373fd50863c970c60b',
        'doubling_lose_2502a9152ad70bb884420df9',
        'doubling_lose_0a8e535f6f11f5eb6cd690c6',
        'doubling_lose_3baeab52ec5e2b8f125aec70',
        'doubling_lose_0f33ee7105d7b0f8be216886',
        'doubling_lose_952433743c8dab3643efa03d',
        'doubling_lose_407eade86050e01687d9b215',
        'doubling_lose_b2cad00c11ced2fbc446f7b3',
        'doubling_lose_4d312ea04fcf40b111121176',
        'doubling_lose_02018a558ec4749c4dbd01be',
        'doubling_lose_caf03c98eb9f883c5fc83b14',
        'doubling_lose_130320be9b4f536426ffda82',
        'doubling_lose_b3b7cc16beae98457833856e',
        'doubling_lose_be280dd1ed7f9b57abc4130f',
        'doubling_lose_42b32ec5e6c4f95298db00ad',
        'doubling_lose_6da97206e6b83acae1a5f32a',
        'doubling_lose_1de9ff88d1140a51a7862463',
        'doubling_lose_7c5044bac8dfc35936780b12',
        'doubling_lose_e26437e0534907dcdea31582',
        'doubling_lose_4e65ecde504f6d9d0415e7bc',
        'doubling_lose_0d7e84e5ad45c36bbad3ee44',
        'doubling_lose_e9463921373b7e23cf057acf',
      ],
      anchor: {
        type: 'vector2',
        value: [0, -1],
      },
      blendMode: 'premultiplied_alpha',
      randomSeed: {
        type: 'random',
      },
      inWorldSpace: true,
      shader: 'particleDefaultShader',
      shape: {
        type: 'line',
        position: {
          type: 'vector2',
          value: [0, 156],
        },
        direction: 'global',
        pivot: {
          type: 'vector2',
          value: [100, 0],
        },
        p1: {
          type: 'vector2',
          value: [-80, 0],
        },
        p2: {
          type: 'vector2',
          value: [80, 0],
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
      particleAlignToDirection: false,
      particleLifetime: {
        type: 'minmax',
        value: [1, 2],
      },
      particleDirection: {
        type: 'scalar',
        value: [270],
      },
      particleAngle: {
        type: 'minmax',
        value: [0, 0],
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
          value: [100, 150],
        },
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
          value: [0.31, 1],
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
        value: [0, 35],
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
          separateAxis: true,
          values: [
            [0, 0.7424892703862661, 1, 1],
            [0, 0.5021459227467812, 1, 1],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 0.9254901960784314, 0.6509803921568628, 0.29411764705882354, 0,
            0.10909090909090909, 0.4980392156862745, 0.36470588235294116,
            0.36470588235294116, 1, 1, 0.10980392156862745, 0.08627450980392157,
            0.03529411764705882, 0,
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
      maskShader: 'particleDefaultMaskShader',
      revParticleDrawOrder: false,
    },
    {
      id: 'ember',
      enabled: true,
      prewarm: false,
      maxParticleNum: {
        type: 'scalar',
        value: [64],
      },
      emitRate: {
        type: 'scalar',
        value: [20],
      },
      images: [
        'doubling_lose_f5f589f36cde59850a46684c',
        'doubling_lose_c698caa0a4ad54e492dc0b6b',
        'doubling_lose_32400b536053fc4ffa8236ef',
      ],
      anchor: {
        type: 'vector2',
        value: [0, 0],
      },
      blendMode: 'add',
      randomSeed: {
        type: 'random',
      },
      inWorldSpace: true,
      shader: 'particleDefaultShader',
      shape: {
        type: 'line',
        position: {
          type: 'vector2',
          value: [0, 156.82],
        },
        direction: 'global',
        pivot: {
          type: 'vector2',
          value: [100, 0],
        },
        p1: {
          type: 'vector2',
          value: [-100, 0],
        },
        p2: {
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
      particleAlignToDirection: false,
      particleLifetime: {
        type: 'minmax',
        value: [1, 2],
      },
      particleDirection: {
        type: 'minmax',
        value: [240, 300],
      },
      particleAngle: {
        type: 'minmax',
        value: [0, 360],
      },
      particleLinearSpeed: {
        type: 'minmax',
        value: [100, 300],
      },
      particleRotationSpeed: {
        type: 'minmax',
        value: [0, 0],
      },
      particleSize: [
        {
          type: 'minmax',
          value: [10, 20],
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
            [0, 0, 0.4022346368715084, 1, 1, 0],
            [0, 0, 0.4022346368715084, 1, 1, 0],
          ],
        },
        colorOverLifetime: {
          enabled: false,
          colorEaseType: 0,
          colorValues: [
            0, 1, 1, 1, 1, 0.4831168831168831, 1, 1, 1, 1, 1, 1, 1, 1, 0,
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
      maskShader: 'particleDefaultMaskShader',
      revParticleDrawOrder: false,
    },
  ],
};
