/* eslint-disable prettier/prettier */

import * as particle from '@apila/particle-runtime';

export const WIN_1: particle.EffectProperties = {
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
      id: 'glow_out',
      enabled: true,
      prewarm: true,
      maxParticleNum: {
        type: 'scalar',
        value: [2],
      },
      emitRate: {
        type: 'scalar',
        value: [1],
      },
      images: ['win_1_270153dc8318a064ca3b976d'],
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
          value: [0, 0],
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
          value: [280],
        },
        {
          type: 'scalar',
          value: [390],
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
      particleEnableDarkColor: true,
      particleDarkColor: [
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
            type: 'scalar',
            value: [30],
          },
          type: 'once',
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
            [0, 0.8669527896995708, 1, 1],
            [0, 0.8669527896995708, 1, 1],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 1, 0.9921568627450981, 0.9098039215686274, 0, 0.5142857142857142,
            1, 0.9764705882352941, 0.796078431372549, 1, 1, 1,
            0.9882352941176471, 0.9215686274509803, 0,
          ],
          darkEaseType: 0,
          darkValues: [
            0, 1, 1, 1, 0, 0.5142857142857142, 1, 0.9686274509803922,
            0.792156862745098, 0.89, 1, 1, 1, 1, 0,
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
      id: 'glow_base',
      enabled: true,
      prewarm: true,
      maxParticleNum: {
        type: 'scalar',
        value: [64],
      },
      emitRate: {
        type: 'scalar',
        value: [8],
      },
      images: ['win_1_aabb234988d659677eb6b382'],
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
          value: [0, 0],
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
        value: [2, 3],
      },
      particleDirection: {
        type: 'minmax',
        value: [260, 280],
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
          value: [220],
        },
        {
          type: 'scalar',
          value: [335],
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
          value: [0.35, 0.68],
        },
      ],
      particleEnableDarkColor: false,
      particleDarkColor: [
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
            type: 'scalar',
            value: [30],
          },
          type: 'once',
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
            [0, 1, 1, 0.9828326180257511],
            [0, 1, 1, 0.9828326180257511],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 1, 0.9921568627450981, 0.9098039215686274, 0,
            0.17142857142857143, 1, 0.9372549019607843, 0.7333333333333333, 1,
            0.7662337662337663, 1, 0.9882352941176471, 0.7529411764705882, 0.57,
            1, 1, 0.9764705882352941, 0.9058823529411765, 0,
          ],
          darkEaseType: 0,
          darkValues: [
            0, 1, 0.9411764705882353, 0.611764705882353, 1, 0.3246753246753247,
            0.611764705882353, 0.26666666666666666, 0.09411764705882353, 1, 1,
            0.18823529411764706, 0, 0, 0,
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
      id: 'gradient',
      enabled: true,
      prewarm: true,
      maxParticleNum: {
        type: 'scalar',
        value: [64],
      },
      emitRate: {
        type: 'scalar',
        value: [3],
      },
      images: ['win_1_1623932233728fca5ccc36f7'],
      anchor: {
        type: 'vector2',
        value: [0, -1],
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
          value: [0, 160],
        },
        direction: 'global',
        pivot: {
          type: 'vector2',
          value: [100, 0],
        },
      },
      startDelay: {
        type: 'scalar',
        value: [0.5],
      },
      emitDuration: {
        type: 'scalar',
        value: [1],
      },
      loopDelay: {
        type: 'minmax',
        value: [0, 0.3],
      },
      loopAmount: {
        type: 'scalar',
        value: [-1],
      },
      revParticleDrawOrder: false,
      particleAlignToDirection: false,
      particleLifetime: {
        type: 'minmax',
        value: [1, 2],
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
          value: [210],
        },
        {
          type: 'scalar',
          value: [280],
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
          value: [0.35294117647058826, 0.5882352941176471],
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
          easeType: [0, 18],
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
            [0, 1, 1, 1],
            [0, 0.6566523605150214, 1, 1],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 0.43529411764705883, 0.3607843137254902, 0.06274509803921569, 0,
            0.2519480519480519, 0.39215686274509803, 0.27450980392156865,
            0.043137254901960784, 1, 0.5168831168831168, 0.5686274509803921,
            0.396078431372549, 0.050980392156862744, 1, 1, 0.49019607843137253,
            0.2549019607843137, 0.043137254901960784, 0,
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
      id: 'glow_light',
      enabled: true,
      prewarm: true,
      maxParticleNum: {
        type: 'scalar',
        value: [64],
      },
      emitRate: {
        type: 'scalar',
        value: [4],
      },
      images: ['win_1_aabb234988d659677eb6b382'],
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
          value: [0, 0],
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
        value: [0.8],
      },
      particleDirection: {
        type: 'minmax',
        value: [260, 280],
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
          value: [220],
        },
        {
          type: 'scalar',
          value: [335],
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
          value: [0.55, 1],
        },
      ],
      particleEnableDarkColor: false,
      particleDarkColor: [
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
            type: 'scalar',
            value: [30],
          },
          type: 'once',
        },
        scaleOverLifetime: {
          enabled: false,
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
            [0, 0.7381974248927039, 1, 1],
            [0, 0.7381974248927039, 1, 1],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 1, 1, 1, 0, 0.14805194805194805, 0.7450980392156863,
            0.6901960784313725, 0.5058823529411764, 1, 0.4623376623376623,
            0.5372549019607843, 0.396078431372549, 0.16862745098039217, 1, 1,
            0.5803921568627451, 0.12156862745098039, 0.12156862745098039, 0,
          ],
          darkEaseType: 0,
          darkValues: [
            0, 1, 0.9411764705882353, 0.611764705882353, 1, 0.3246753246753247,
            0.611764705882353, 0.26666666666666666, 0.09411764705882353, 1, 1,
            0.18823529411764706, 0, 0, 0,
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
