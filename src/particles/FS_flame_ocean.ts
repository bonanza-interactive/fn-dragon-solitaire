/* eslint-disable prettier/prettier */

import * as particle from '@apila/particle-runtime';

export const FS_FLAME_OCEAN: particle.EffectProperties = {
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
        value: [60],
      },
      images: [
        'FS_flame_ocean_60266bd2d6954259a7f78d37',
        'FS_flame_ocean_7e3ebf0a0d2161e8e694044c',
        'FS_flame_ocean_21a3a571f6610529ecc82fdb',
        'FS_flame_ocean_8ec765ba8d0d3de16a5d27a7',
        'FS_flame_ocean_22fc57e89880100856ac7fb0',
        'FS_flame_ocean_41024b6f71892d6fe8b24f74',
        'FS_flame_ocean_d018313752c6383f1f9a8b01',
        'FS_flame_ocean_9aa22a693a61d2eccd38f909',
        'FS_flame_ocean_f2b724d85ee255465e6c9f62',
        'FS_flame_ocean_ce4989a1aaa0c0d04316c266',
        'FS_flame_ocean_abff1847893a15f21e3c5835',
        'FS_flame_ocean_83e69d7d87b74038038109d9',
        'FS_flame_ocean_24702e3b61b130debcc38348',
        'FS_flame_ocean_0d9e66bb8a32741b55b602f5',
        'FS_flame_ocean_046261b70f90474f145fd652',
        'FS_flame_ocean_a0309e1f053f3e6f92c9549f',
        'FS_flame_ocean_e62e751efc3a4b8975e88e4c',
        'FS_flame_ocean_698ef5dd5ef462264c5ddae6',
        'FS_flame_ocean_2c43ad7fe423fa6f8b2b1540',
        'FS_flame_ocean_6b1fa1da3d8fd87fdbbf6a89',
        'FS_flame_ocean_53cba6ab79bfc5607e058135',
        'FS_flame_ocean_4cb80f29d10e92737bd91ada',
        'FS_flame_ocean_d1037f8a488c3292a2afc0a9',
        'FS_flame_ocean_a7e734607a4f0b76899cfcbc',
        'FS_flame_ocean_239c3f9ba7eb0bf6d4df9176',
        'FS_flame_ocean_c2f16a82bd0b90a27dc3b276',
        'FS_flame_ocean_7b7534c4f86e21072d36f328',
        'FS_flame_ocean_f09b50ee9cbec4b3b125c1bc',
        'FS_flame_ocean_dee716ca6e337106cd9fd235',
        'FS_flame_ocean_61e0bbfd1c66a1ff2a747ad5',
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
        direction: 'global',
        pivot: {
          type: 'vector2',
          value: [100, 0],
        },
        angle: {
          type: 'scalar',
          value: [0],
        },
        minSize: {
          type: 'vector2',
          value: [0, 0],
        },
        maxSize: {
          type: 'vector2',
          value: [1650, 120],
        },
      },
      startDelay: {
        type: 'scalar',
        value: [1],
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
        value: [260, 280],
      },
      particleAngle: {
        type: 'minmax',
        value: [0, 360],
      },
      particleLinearSpeed: {
        type: 'minmax',
        value: [200, 300],
      },
      particleRotationSpeed: {
        type: 'minmax',
        value: [-1, 1],
      },
      particleSize: [
        {
          type: 'minmax',
          value: [250, 350],
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
          value: [0.7843137254901961, 1],
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
          easeType: [6, 6],
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
            0, 1, 1, 1, 0, 0.14805194805194805, 0.9568627450980393,
            0.9568627450980393, 0.9568627450980393, 1, 0.3038961038961039,
            0.9490196078431372, 0.9568627450980393, 0.7607843137254902, 1,
            0.4935064935064935, 1, 0.7843137254901961, 0.4392156862745098, 1, 1,
            1, 0.23529411764705882, 0, 0,
          ],
          darkEaseType: 0,
          darkValues: [
            0, 1, 0.6509803921568628, 0.4, 0, 0.15844155844155844, 1,
            0.6549019607843137, 0.4, 1, 0.6519480519480519, 0.7607843137254902,
            0.03137254901960784, 0.03137254901960784, 0.58, 1,
            0.4117647058823529, 0, 0, 0,
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
      id: 'flame_glow',
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
      images: ['FS_flame_ocean_774b61c8d50f854ad369edbb'],
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
          value: [100, 0],
        },
        angle: {
          type: 'scalar',
          value: [0],
        },
        minSize: {
          type: 'vector2',
          value: [0, 0],
        },
        maxSize: {
          type: 'vector2',
          value: [1650, 120],
        },
      },
      startDelay: {
        type: 'scalar',
        value: [1],
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
        value: [1.5, 2],
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
        value: [200, 300],
      },
      particleRotationSpeed: {
        type: 'minmax',
        value: [-1, 1],
      },
      particleSize: [
        {
          type: 'minmax',
          value: [400, 500],
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
          value: [0.28, 0.65],
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
            [0, 0, 1, 1],
            [0, 0, 1, 1],
          ],
        },
        colorOverLifetime: {
          enabled: true,
          colorEaseType: 0,
          colorValues: [
            0, 1, 0.592156862745098, 0.3686274509803922, 0, 0.12987012987012986,
            1, 0.592156862745098, 0.3686274509803922, 1, 1, 1, 0, 0, 0,
          ],
          darkEaseType: 0,
          darkValues: [
            0, 0.9019607843137255, 0.3843137254901961, 0.12156862745098039, 1,
            1, 1, 0, 0, 0,
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
