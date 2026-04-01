/* eslint-disable prettier/prettier */

import * as particle from '@apila/particle-runtime';

export const BIG_WIN_3: particle.EffectProperties = {
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
      id: 'lightbeams',
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
      images: ['big_win_3_437e0ccb7299c4033dce0c1c'],
      anchor: {
        type: 'vector2',
        value: [0, -0.5],
      },
      blendMode: 'add',
      randomSeed: {
        type: 'random',
      },
      inWorldSpace: false,
      shader: 'particleDefaultShader',
      maskShader: 'particleDefaultMaskShader',
      shape: {
        type: 'circle',
        position: {
          type: 'vector2',
          value: [0, 0],
        },
        direction: 'radial',
        sectorSpawnAngle: {
          type: 'scalar',
          value: [40],
        },
        sectorSize: {
          type: 'scalar',
          value: [260],
        },
        pivot: {
          type: 'vector2',
          value: [0, 0],
        },
        radius: {
          type: 'minmax',
          value: [150, 150],
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
      particleAlignToDirection: true,
      particleLifetime: {
        type: 'minmax',
        value: [3, 5],
      },
      particleDirection: {
        type: 'scalar',
        value: [0],
      },
      particleAngle: {
        type: 'minmax',
        value: [0, 0],
      },
      particleLinearSpeed: {
        type: 'scalar',
        value: [15],
      },
      particleRotationSpeed: {
        type: 'minmax',
        value: [0, 0],
      },
      particleSize: [
        {
          type: 'minmax',
          value: [50, 120],
        },
        {
          type: 'minmax',
          value: [1000, 2000],
        },
      ],
      particleColor: [
        {
          type: 'minmax',
          value: [1, 1],
        },
        {
          type: 'minmax',
          value: [0.30196078431372547, 0.9686274509803922],
        },
        {
          type: 'minmax',
          value: [0, 0.6549019607843137],
        },
        {
          type: 'minmax',
          value: [0.47058823529411764, 0.47058823529411764],
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
            0, 1, 1, 1, 1, 0.2987012987012987, 1, 1, 1, 1, 1, 1, 1, 1, 0,
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
