/* eslint-disable prettier/prettier */

import * as particle from '@apila/particle-runtime';

export const DOUBLING_WIN: particle.EffectProperties = {
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
      id: 'border-2',
      enabled: true,
      prewarm: true,
      maxParticleNum: {
        type: 'scalar',
        value: [64],
      },
      emitRate: {
        type: 'scalar',
        value: [2],
      },
      images: ['doubling_win_f183a740ceaa2f8be27df066'],
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
        value: [-1],
      },
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
        type: 'scalar',
        value: [0],
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
          type: 'scalar',
          value: [215],
        },
        {
          type: 'scalar',
          value: [328],
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
          value: [0.3137254901960784, 0.6274509803921569],
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
          enabled: false,
          range: {
            type: 'scalar',
            value: [30],
          },
          type: 'forward',
        },
        scaleOverLifetime: {
          enabled: false,
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
            [0, 0.8884120171673819, 1, 1],
            [0, 0.8884120171673819, 1, 1],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 1, 0.7843137254901961, 0, 0, 0.45454545454545453, 1,
            0.9607843137254902, 0.6274509803921569, 1, 0.5896103896103896, 1,
            0.9607843137254902, 0.6274509803921569, 1, 1, 1, 0.7843137254901961,
            0, 0,
          ],
          darkEaseType: 0,
          darkValues: [
            0, 1, 0.9686274509803922, 0.5568627450980392, 1,
            0.41818181818181815, 1, 0.8274509803921568, 0.3176470588235294, 1,
            1, 1, 0.6666666666666666, 0, 0,
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
      maskShader: 'particleDefaultMaskShader',
      revParticleDrawOrder: false,
    },
    {
      id: 'border',
      enabled: true,
      prewarm: true,
      maxParticleNum: {
        type: 'scalar',
        value: [64],
      },
      emitRate: {
        type: 'scalar',
        value: [2],
      },
      images: ['doubling_win_f183a740ceaa2f8be27df066'],
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
        value: [-1],
      },
      particleAlignToDirection: false,
      particleLifetime: {
        type: 'scalar',
        value: [2],
      },
      particleDirection: {
        type: 'scalar',
        value: [0],
      },
      particleAngle: {
        type: 'scalar',
        value: [0],
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
          type: 'scalar',
          value: [235],
        },
        {
          type: 'scalar',
          value: [355],
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
          value: [0.3137254901960784, 0.6274509803921569],
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
          enabled: false,
          range: {
            type: 'scalar',
            value: [30],
          },
          type: 'forward',
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
            [0, 0.9184549356223176, 1, 1],
            [0, 0.9184549356223176, 1, 1],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 1, 0.6352941176470588, 0, 0.53, 0.4935064935064935, 1,
            0.8980392156862745, 0.4117647058823529, 1, 1, 0.6784313725490196,
            0.6431372549019608, 0, 0,
          ],
          darkEaseType: 0,
          darkValues: [
            0, 1, 0.9686274509803922, 0.5568627450980392, 1,
            0.41818181818181815, 1, 0.8274509803921568, 0.3176470588235294, 1,
            1, 1, 0.6666666666666666, 0, 0,
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
      maskShader: 'particleDefaultMaskShader',
      revParticleDrawOrder: false,
    },
  ],
};
