/* eslint-disable prettier/prettier */

import * as particle from '@apila/particle-runtime';

export const WIN_GLOSS: particle.EffectProperties = {
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
      images: ['win_gloss_4b24fe2ab029855dc2baa29a'],
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
        type: 'minmax',
        value: [1, 10],
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
