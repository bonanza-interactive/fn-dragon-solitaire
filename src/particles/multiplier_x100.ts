/* eslint-disable prettier/prettier */

import * as particle from '@apila/particle-runtime';

export const MULTIPLIER_X100: particle.EffectProperties = {
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
      id: 'shade',
      enabled: true,
      prewarm: false,
      maxParticleNum: {
        type: 'scalar',
        value: [64],
      },
      emitRate: {
        type: 'scalar',
        value: [3],
      },
      images: ['multiplier_x100_d2895c78e3bb5a6199ad8c31'],
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
        value: [1.5],
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
        type: 'scalar',
        value: [0],
      },
      particleSize: [
        {
          type: 'scalar',
          value: [700],
        },
        {
          type: 'scalar',
          value: [550],
        },
      ],
      particleColor: [
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
          value: [0.58],
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
            [0, 0, 0.2011173184357542, 1, 1, 1],
            [0, 0, 0.2011173184357542, 1, 1, 1],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 1, 1, 1, 1, 0.7636363636363637, 1, 1, 1, 1, 1, 1, 1, 1, 0,
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
      id: 'smoke',
      enabled: true,
      prewarm: false,
      maxParticleNum: {
        type: 'scalar',
        value: [64],
      },
      emitRate: {
        type: 'scalar',
        value: [500],
      },
      images: [
        'multiplier_x100_d7d94224ffd0252c8e471b4a',
        'multiplier_x100_9e0de2421576d59bcac952ed',
        'multiplier_x100_a11404538e8f8763a798c532',
        'multiplier_x100_af183326ee06197ff399ca44',
        'multiplier_x100_a7940b1cfc3672972f51e725',
        'multiplier_x100_373735c1f673a5ffb68a60c7',
        'multiplier_x100_e0c75a5ffc1737638b779cdb',
        'multiplier_x100_b12f0538791ccd342e55aa1d',
        'multiplier_x100_0e31a5a891705ca90cf60204',
        'multiplier_x100_55a6d37643a2f24b06e686fd',
        'multiplier_x100_0dd914a24ece21a82cf4e863',
        'multiplier_x100_6beb9e7f1f912b0ab4620183',
        'multiplier_x100_c857c595699b7505ad412322',
        'multiplier_x100_2c2c711cb7759cbc7a545061',
        'multiplier_x100_07ec723f96cca72024fd121d',
        'multiplier_x100_c8850b221fa36a4ea6bc28b3',
        'multiplier_x100_11728bd20bab81e3c8864b61',
        'multiplier_x100_dacbee6aa965dc30b2ff7b6c',
        'multiplier_x100_aa2b0b5f07b1efe378ddbd45',
        'multiplier_x100_54390e9943a76d831bccf2c9',
        'multiplier_x100_0cfffba62dfc0d574429f95e',
        'multiplier_x100_2d708154a0c9784952725774',
        'multiplier_x100_71341c313f8e4c9200e8d6ca',
        'multiplier_x100_6f05b8609b7f7f80c0b81230',
        'multiplier_x100_df8e02984acc0bbc5859d80d',
        'multiplier_x100_3f627431e588a35ef2197a5d',
        'multiplier_x100_7d022c1117c25c4f0aaf3541',
        'multiplier_x100_6fbd540212d66dbdde2e3712',
        'multiplier_x100_1b420fb6ab19fcca221a975e',
        'multiplier_x100_860cd23a5a528699df7fc966',
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
        type: 'ellipse',
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
        sectorSpawnAngle: {
          type: 'scalar',
          value: [0],
        },
        sectorSize: {
          type: 'scalar',
          value: [360],
        },
        minRadius: {
          type: 'vector2',
          value: [50, 25],
        },
        maxRadius: {
          type: 'vector2',
          value: [100, 50],
        },
      },
      startDelay: {
        type: 'scalar',
        value: [0],
      },
      emitDuration: {
        type: 'scalar',
        value: [0.1],
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
        type: 'minmax',
        value: [0.7, 1.5],
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
        value: [100, 200],
      },
      particleRotationSpeed: {
        type: 'minmax',
        value: [0, 0],
      },
      particleSize: [
        {
          type: 'minmax',
          value: [200, 300],
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
            0, 0, 0, 0, 1, 0.16883116883116883, 0.4235294117647059,
            0.34509803921568627, 0.34509803921568627, 1, 1, 0.23529411764705882,
            0.1450980392156863, 0.08235294117647059, 0,
          ],
          darkEaseType: 0,
          darkValues: [
            0, 1, 0.7411764705882353, 0.24313725490196078, 1, 1, 1, 0, 0, 0,
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
      id: 'shockwave',
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
      images: ['multiplier_x100_01e31b1cd86dff489a12884c'],
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
        value: [0.5],
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
          value: [600, 600],
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
          easeType: [3, 3],
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
            0, 1, 1, 1, 1, 0.24935064935064935, 1, 0.9490196078431372,
            0.6588235294117647, 1, 0.6441558441558441, 1, 0.7019607843137254,
            0.2235294117647059, 1, 1, 1, 0.5176470588235295, 0, 0,
          ],
          darkEaseType: 0,
          darkValues: [
            0, 1, 0.7725490196078432, 0.0784313725490196, 1,
            0.24675324675324675, 0.9803921568627451, 0.3333333333333333,
            0.11764705882352941, 0.71, 0.6857142857142857, 0.3803921568627451,
            0.07450980392156863, 0, 1, 1, 0, 0, 0, 1,
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
      id: 'twinkles',
      enabled: true,
      prewarm: false,
      maxParticleNum: {
        type: 'scalar',
        value: [64],
      },
      emitRate: {
        type: 'scalar',
        value: [100],
      },
      images: ['multiplier_x100_c560e184c4f99f7e65fd7532'],
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
        type: 'ellipse',
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
        sectorSpawnAngle: {
          type: 'scalar',
          value: [0],
        },
        sectorSize: {
          type: 'scalar',
          value: [360],
        },
        minRadius: {
          type: 'vector2',
          value: [200, 100],
        },
        maxRadius: {
          type: 'vector2',
          value: [420, 240],
        },
      },
      startDelay: {
        type: 'scalar',
        value: [1.5],
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
        type: 'minmax',
        value: [0.5, 1],
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
        type: 'minmax',
        value: [10, 30],
      },
      particleRotationSpeed: {
        type: 'minmax',
        value: [0, 0],
      },
      particleSize: [
        {
          type: 'minmax',
          value: [100, 100],
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
          easeType: [3, 3],
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
            [
              0, 0.4978540772532189, 0.19832402234636873, 1,
              0.39385474860335196, 0.5021459227467812, 0.6005586592178771, 1,
              0.7960893854748603, 0.4978540772532189, 1, 1,
            ],
            [
              0, 0.4978540772532189, 0.19832402234636873, 1,
              0.39385474860335196, 0.5021459227467812, 0.6005586592178771, 1,
              0.7960893854748603, 0.4978540772532189, 1, 1,
            ],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 1, 0.9764705882352941, 0.8588235294117647, 0,
            0.07272727272727272, 1, 0.9764705882352941, 0.8588235294117647, 1,
            0.4155844155844156, 1, 0.807843137254902, 0.3411764705882353, 1, 1,
            1, 0.35294117647058826, 0, 0,
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
      id: 'fire',
      enabled: true,
      prewarm: false,
      maxParticleNum: {
        type: 'scalar',
        value: [64],
      },
      emitRate: {
        type: 'scalar',
        value: [400],
      },
      images: [
        'multiplier_x100_199be5efb7621adf221d57a6',
        'multiplier_x100_e5a11b9f10f32343fc4cea63',
        'multiplier_x100_1ab1c7034b70c593429ec085',
        'multiplier_x100_92e0ba304416232635a178d6',
        'multiplier_x100_02db9421016adf0c16db3010',
        'multiplier_x100_411a63edbb1f4025eb9b8f2b',
        'multiplier_x100_d1c467d628bae18744a9071c',
        'multiplier_x100_9ef1b11f00de0672aed319fb',
        'multiplier_x100_7dc2aed75f29c10694fdaacf',
        'multiplier_x100_a58c3a4e94c270d8abc27d83',
        'multiplier_x100_03d2082312c05e5d0b86b43b',
        'multiplier_x100_5c13b59f09ca1e2425f8bac5',
        'multiplier_x100_0ead705bf436e2eeeae74025',
        'multiplier_x100_74734dc1b9d0830875f8980a',
        'multiplier_x100_251df0c80ed8683caf0e03fa',
        'multiplier_x100_361215d1077179dc16beec2b',
        'multiplier_x100_d2de2195d92fafd888a3bdb8',
        'multiplier_x100_2f3ae9d87c6e54ea5b573613',
        'multiplier_x100_92064a536e7f59c65387152d',
        'multiplier_x100_0401ab2b1dbd577aeecb35b9',
        'multiplier_x100_6096b84b5d3d355efc9bbc69',
        'multiplier_x100_a915441d59b9d69c232e729f',
        'multiplier_x100_0dae8f31068b6672b1d8f0cc',
        'multiplier_x100_ebbcf0e2670abe8aab964948',
        'multiplier_x100_ed5035eb85c80c8009de8180',
        'multiplier_x100_72be034e114dc37a39c1a687',
        'multiplier_x100_ac8fdade4a8e8f6ab8e8c77b',
        'multiplier_x100_d9fe82b2a2bdde729f526c51',
        'multiplier_x100_bd2af6093a9b9dbc501c0d79',
        'multiplier_x100_5fa58d5b9b091d7429c3fb5d',
      ],
      anchor: {
        type: 'vector2',
        value: [0, 0],
      },
      blendMode: 'premultiplied_alpha',
      randomSeed: {
        type: 'scalar',
        value: [5],
      },
      inWorldSpace: false,
      shader: 'particleDefaultShader',
      maskShader: 'particleDefaultMaskShader',
      shape: {
        type: 'ellipse',
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
        sectorSpawnAngle: {
          type: 'scalar',
          value: [0],
        },
        sectorSize: {
          type: 'scalar',
          value: [360],
        },
        minRadius: {
          type: 'vector2',
          value: [100, 50],
        },
        maxRadius: {
          type: 'vector2',
          value: [200, 100],
        },
      },
      startDelay: {
        type: 'scalar',
        value: [0],
      },
      emitDuration: {
        type: 'scalar',
        value: [0.1],
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
        type: 'scalar',
        value: [0],
      },
      particleAngle: {
        type: 'minmax',
        value: [0, 360],
      },
      particleLinearSpeed: {
        type: 'minmax',
        value: [100, 200],
      },
      particleRotationSpeed: {
        type: 'minmax',
        value: [0, 0],
      },
      particleSize: [
        {
          type: 'minmax',
          value: [100, 200],
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
            [0, 0.5107296137339056, 1, 1],
            [0, 0.5107296137339056, 1, 1],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 1, 1, 1, 0, 0.05194805194805195, 1, 0.9882352941176471,
            0.803921568627451, 1, 0.3038961038961039, 1, 0.7019607843137254,
            0.3431372549019608, 1, 0.638961038961039, 0.7686274509803922,
            0.34901960784313724, 0.16862745098039217, 0.51, 1,
            0.5372549019607843, 0, 0, 0,
          ],
          darkEaseType: 0,
          darkValues: [
            0, 1, 0.788235294117647, 0.396078431372549, 1, 0.15584415584415584,
            0.8470588235294118, 0.5176470588235295, 0.058823529411764705, 1,
            0.4077922077922078, 0.6039215686274509, 0.34509803921568627,
            0.09019607843137255, 1, 0.7506493506493507, 0.3803921568627451,
            0.12549019607843137, 0.023529411764705882, 0.49, 1,
            0.24705882352941178, 0, 0, 0,
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
      id: 'fire_glow',
      enabled: true,
      prewarm: false,
      maxParticleNum: {
        type: 'scalar',
        value: [64],
      },
      emitRate: {
        type: 'scalar',
        value: [400],
      },
      images: ['multiplier_x100_d2895c78e3bb5a6199ad8c31'],
      anchor: {
        type: 'vector2',
        value: [0, 0],
      },
      blendMode: 'add',
      randomSeed: {
        type: 'scalar',
        value: [5],
      },
      inWorldSpace: false,
      shader: 'particleDefaultShader',
      maskShader: 'particleDefaultMaskShader',
      shape: {
        type: 'ellipse',
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
        sectorSpawnAngle: {
          type: 'scalar',
          value: [0],
        },
        sectorSize: {
          type: 'scalar',
          value: [360],
        },
        minRadius: {
          type: 'vector2',
          value: [100, 50],
        },
        maxRadius: {
          type: 'vector2',
          value: [200, 100],
        },
      },
      startDelay: {
        type: 'scalar',
        value: [0],
      },
      emitDuration: {
        type: 'scalar',
        value: [0.1],
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
        type: 'scalar',
        value: [0],
      },
      particleAngle: {
        type: 'minmax',
        value: [0, 360],
      },
      particleLinearSpeed: {
        type: 'minmax',
        value: [100, 200],
      },
      particleRotationSpeed: {
        type: 'minmax',
        value: [0, 0],
      },
      particleSize: [
        {
          type: 'minmax',
          value: [200, 300],
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
          value: [0.35, 0.65],
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
            [0, 0.5107296137339056, 1, 1],
            [0, 0.5107296137339056, 1, 1],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 1, 1, 1, 0, 0.13766233766233765, 1, 0.5843137254901961,
            0.21568627450980393, 1, 1, 1, 0, 0, 0,
          ],
          darkEaseType: 0,
          darkValues: [
            0, 1, 0.788235294117647, 0.396078431372549, 1, 0.15584415584415584,
            0.8470588235294118, 0.5176470588235295, 0.058823529411764705, 1,
            0.4077922077922078, 0.6039215686274509, 0.34509803921568627,
            0.09019607843137255, 1, 0.7506493506493507, 0.3803921568627451,
            0.12549019607843137, 0.023529411764705882, 1, 1,
            0.24705882352941178, 0, 0, 0,
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
      id: 'sparks',
      enabled: true,
      prewarm: false,
      maxParticleNum: {
        type: 'scalar',
        value: [64],
      },
      emitRate: {
        type: 'scalar',
        value: [300],
      },
      images: ['multiplier_x100_b3d82429760b4774eda60fbb'],
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
        type: 'circle',
        position: {
          type: 'vector2',
          value: [0, 0],
        },
        direction: 'radial',
        sectorSpawnAngle: {
          type: 'scalar',
          value: [0],
        },
        sectorSize: {
          type: 'scalar',
          value: [360],
        },
        pivot: {
          type: 'vector2',
          value: [0, 0],
        },
        radius: {
          type: 'minmax',
          value: [5, 5],
        },
      },
      startDelay: {
        type: 'scalar',
        value: [0],
      },
      emitDuration: {
        type: 'scalar',
        value: [0.1],
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
      particleAlignToDirection: true,
      particleLifetime: {
        type: 'minmax',
        value: [0.5, 1],
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
        type: 'minmax',
        value: [400, 500],
      },
      particleRotationSpeed: {
        type: 'minmax',
        value: [0, 0],
      },
      particleSize: [
        {
          type: 'minmax',
          value: [3, 5],
        },
        {
          type: 'minmax',
          value: [30, 50],
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
          easeType: [1, 2],
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
            [0, 1, 1, 0],
            [0, 1, 1, 0.5021459227467812],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 1, 1, 1, 0, 0.10649350649350649, 1, 0.9803921568627451,
            0.6862745098039216, 1, 1, 1, 0.4235294117647059, 0, 1,
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
      id: 'multiplier',
      enabled: true,
      prewarm: false,
      maxParticleNum: {
        type: 'scalar',
        value: [64],
      },
      emitRate: {
        type: 'scalar',
        value: [3],
      },
      images: ['multiplier_x100_ff0f01ea622f15443b8b9213'],
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
        value: [1.8],
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
        type: 'scalar',
        value: [0],
      },
      particleSize: [
        {
          type: 'scalar',
          value: [680],
        },
        {
          type: 'scalar',
          value: [500],
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
            [
              0, 0, 0.20391061452513967, 0.6995708154506437, 0.7988826815642458,
              0.7467811158798283, 1, 1,
            ],
            [
              0, 0, 0.20391061452513967, 0.6995708154506437, 0.7988826815642458,
              0.7467811158798283, 1, 1,
            ],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 1, 1, 1, 1, 0.7454545454545455, 1, 1, 1, 0.49, 1, 1, 1, 1, 0,
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
