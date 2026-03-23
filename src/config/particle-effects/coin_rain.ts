/* eslint-disable prettier/prettier */

import * as particle from '@apila/particle-runtime';

export const COIN_RAIN: particle.EffectProperties = {
  version: {
    major: 9,
    minor: 0,
    patch: 0
  },
  maskImage: "",
  maskRotation: {
    type: "scalar",
    value: [
      0
    ]
  },
  maskScale: {
    type: "scalar",
    value: [
      1
    ]
  },
  emitterProperties: [
    {
      id: "coin_burst",
      enabled: true,
      prewarm: false,
      maxParticleNum: {
        type: "scalar",
        value: [
          500
        ]
      },
      emitRate: {
        type: "scalar",
        value: [
          150
        ]
      },
      images: [
        "coin_rain_4822a639eab1cafcc5b0936b",
        "coin_rain_f0541e552cda467257adab36",
        "coin_rain_8ae3e1281691aa8bbeca4ec9",
        "coin_rain_84f5ad842be01c0c8484f8d0",
        "coin_rain_fb554688cef792c9742586d4",
        "coin_rain_db1ec1b49e963cca416bf2dd",
        "coin_rain_b7933e38e94b270d00951f18",
        "coin_rain_58755df3ebe232b3092f6a94",
        "coin_rain_d3c7f5c87e4fcaac56cc0c84",
        "coin_rain_6c7fdeab8c7ad59fb02e9d97",
        "coin_rain_ef47e860b83854af69e90367",
        "coin_rain_1d2d8ac695952819a019bd5d",
        "coin_rain_5515fac51c7a70b7ee0b30e2",
        "coin_rain_1828d4287bf323a9e3dbf04f",
        "coin_rain_4b4bc48dc0ff9395c146ea75",
        "coin_rain_2bfe50bcb6e38ec1b03ca00f",
        "coin_rain_887f9547903dd2eb83730652",
        "coin_rain_0e7278da6741205f8e1b4bdb",
        "coin_rain_6ca1b7bb6623ad406ec0a9f4",
        "coin_rain_6700ccc2949158dc8b47d3cd",
        "coin_rain_f1b48636cb9997e90ae11ad7",
        "coin_rain_de639a7bdd6789667546dd7f",
        "coin_rain_8da34ccf9149cbdce03e466e",
        "coin_rain_453042d9949065da9bbbf9d9",
        "coin_rain_607826703cd1793202717d0c",
        "coin_rain_97927f9f0fd7f6a761d6f8fe",
        "coin_rain_9175cd1dbfde5bbbf6c863af",
        "coin_rain_0e3c7af09cdef6a7f3e40307",
        "coin_rain_4d0ef65a2b8d5b9cb72b2390",
        "coin_rain_1adadf7bc3e2e7993e4a4b02"
      ],
      particleImageFrameOffset: {
        type: "minmax",
        value: [
          0,
          30
        ]
      },
      blendMode: "premultiplied_alpha",
      randomSeed: {
        type: "random"
      },
      inWorldSpace: true,
      shader: "particleDefaultShader",
      shape: {
        type: "ellipse",
        position: {
          type: "vector2",
          value: [
            0,
            0
          ]
        },
        direction: "radial",
        pivot: {
          type: "vector2",
          value: [
            0,
            141.53839111328125
          ]
        },
        angle: {
          type: "scalar",
          value: [
            0
          ]
        },
        minRadius: {
          type: "vector2",
          value: [
            90,
            60
          ]
        },
        maxRadius: {
          type: "vector2",
          value: [
            150,
            120
          ]
        },
        sectorSize: {
          type: "scalar",
          value: [
            360
          ]
        },
        sectorSpawnAngle: {
          type: "scalar",
          value: [
            0
          ]
        }
      },
      startDelay: {
        type: "scalar",
        value: [
          0
        ]
      },
      emitDuration: {
        type: "scalar",
        value: [
          0.1
        ]
      },
      loopDelay: {
        type: "scalar",
        value: [
          1.9
        ]
      },
      loopAmount: {
        type: "scalar",
        value: [
          1
        ]
      },
      particleLifetime: {
        type: "minmax",
        value: [
          3,
          4
        ]
      },
      particleDirection: {
        type: "minmax",
        value: [
          0,
          0
        ]
      },
      particleAngle: {
        type: "minmax",
        value: [
          0,
          360
        ]
      },
      particleLinearSpeed: {
        type: "minmax",
        value: [
          750,
          900
        ]
      },
      particleRotationSpeed: {
        type: "minmax",
        value: [
          -1,
          1
        ]
      },
      particleSize: [
        {
          type: "minmax",
          value: [
            80,
            110
          ]
        }
      ],
      particleColor: [
        {
          type: "scalar",
          value: [
            1
          ]
        },
        {
          type: "scalar",
          value: [
            1
          ]
        },
        {
          type: "scalar",
          value: [
            1
          ]
        },
        {
          type: "scalar",
          value: [
            1
          ]
        }
      ],
      affectors: {
        acceleration: {
          enabled: true,
          linearRange: {
            type: "vector2",
            value: [
              0,
              1000
            ]
          },
          angularValue: {
            type: "scalar",
            value: [
              0
            ]
          }
        },
        animation: {
          enabled: true,
          range: {
            type: "minmax",
            value: [
              60,
              60
            ]
          },
          type: "forward"
        },
        scaleOverLifetime: {
          enabled: true,
          values: [
            [
              0,
              0.5,
              1,
              1
            ],
            [
              0,
              0.5,
              1,
              1
            ]
          ],
          range: [
            {
              type: "vector2",
              value: [
                0,
                1
              ]
            },
            {
              type: "vector2",
              value: [
                0,
                1
              ]
            }
          ],
          separateAxis: false,
          easeType: [
            0,
            0
          ]
        },
        colorOverLifetime: {
          enabled: true,
          colorValues: [
            0,
            1,
            1,
            1,
            1,
            0.9186746987951807,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            0
          ],
          colorEaseType: 0,
          darkValues: [
            0,
            0,
            0,
            0,
            1,
            1,
            0,
            0,
            0,
            1
          ],
          darkEaseType: 0
        },
        dragOverLifetime: {
          enabled: false,
          linearDrag: {
            type: "scalar",
            value: [
              200
            ]
          },
          linearCurveValues: [
            [
              0,
              1,
              1,
              1
            ],
            [
              0,
              1,
              1,
              1
            ]
          ],
          linearEaseType: [
            0,
            0
          ],
          angularDrag: {
            type: "scalar",
            value: [
              200
            ]
          },
          angularCurveValues: [
            0,
            1,
            1,
            1
          ],
          angularEaseType: 0
        },
        pointAccelerator: {
          enabled: false,
          point: {
            type: "vector2",
            value: [
              0,
              0
            ]
          },
          magnitude: {
            type: "scalar",
            value: [
              500
            ]
          },
          magnitudeValues: [
            [
              0,
              1,
              1,
              1
            ],
            [
              0,
              1,
              1,
              1
            ]
          ],
          magnitudeEaseType: [
            0,
            0
          ]
        }
      },
      particleAlignToDirection: false,
      anchor: {
        type: "vector2",
        value: [
          0,
          0
        ]
      },
      particleDarkColor: [
        {
          type: "scalar",
          value: [
            0
          ]
        },
        {
          type: "scalar",
          value: [
            0
          ]
        },
        {
          type: "scalar",
          value: [
            0
          ]
        },
        {
          type: "scalar",
          value: [
            1
          ]
        }
      ],
      particleEnableDarkColor: false,
      maskShader: "particleDefaultMaskShader",
      revParticleDrawOrder: false,
      invertMask: false
    },
    {
      id: "coin_rain",
      enabled: true,
      prewarm: false,
      maxParticleNum: {
        type: "scalar",
        value: [
          1000
        ]
      },
      emitRate: {
        type: "scalar",
        value: [
          14
        ]
      },
      images: [
        "coin_rain_4822a639eab1cafcc5b0936b",
        "coin_rain_f0541e552cda467257adab36",
        "coin_rain_8ae3e1281691aa8bbeca4ec9",
        "coin_rain_84f5ad842be01c0c8484f8d0",
        "coin_rain_fb554688cef792c9742586d4",
        "coin_rain_db1ec1b49e963cca416bf2dd",
        "coin_rain_b7933e38e94b270d00951f18",
        "coin_rain_58755df3ebe232b3092f6a94",
        "coin_rain_d3c7f5c87e4fcaac56cc0c84",
        "coin_rain_6c7fdeab8c7ad59fb02e9d97",
        "coin_rain_ef47e860b83854af69e90367",
        "coin_rain_1d2d8ac695952819a019bd5d",
        "coin_rain_5515fac51c7a70b7ee0b30e2",
        "coin_rain_1828d4287bf323a9e3dbf04f",
        "coin_rain_4b4bc48dc0ff9395c146ea75",
        "coin_rain_2bfe50bcb6e38ec1b03ca00f",
        "coin_rain_887f9547903dd2eb83730652",
        "coin_rain_0e7278da6741205f8e1b4bdb",
        "coin_rain_6ca1b7bb6623ad406ec0a9f4",
        "coin_rain_6700ccc2949158dc8b47d3cd",
        "coin_rain_f1b48636cb9997e90ae11ad7",
        "coin_rain_de639a7bdd6789667546dd7f",
        "coin_rain_8da34ccf9149cbdce03e466e",
        "coin_rain_453042d9949065da9bbbf9d9",
        "coin_rain_607826703cd1793202717d0c",
        "coin_rain_97927f9f0fd7f6a761d6f8fe",
        "coin_rain_9175cd1dbfde5bbbf6c863af",
        "coin_rain_0e3c7af09cdef6a7f3e40307",
        "coin_rain_4d0ef65a2b8d5b9cb72b2390",
        "coin_rain_1adadf7bc3e2e7993e4a4b02"
      ],
      particleImageFrameOffset: {
        type: "minmax",
        value: [
          0,
          30
        ]
      },
      blendMode: "premultiplied_alpha",
      randomSeed: {
        type: "random"
      },
      inWorldSpace: true,
      shader: "particleDefaultShader",
      shape: {
        type: "ellipse",
        position: {
          type: "vector2",
          value: [
            0,
            -50
          ]
        },
        direction: "global",
        pivot: {
          type: "vector2",
          value: [
            0,
            0
          ]
        },
        angle: {
          type: "scalar",
          value: [
            0
          ]
        },
        minRadius: {
          type: "vector2",
          value: [
            0,
            0
          ]
        },
        maxRadius: {
          type: "vector2",
          value: [
            300,
            109.06
          ]
        },
        sectorSize: {
          type: "scalar",
          value: [
            360
          ]
        },
        sectorSpawnAngle: {
          type: "scalar",
          value: [
            0
          ]
        }
      },
      startDelay: {
        type: "scalar",
        value: [
          0
        ]
      },
      emitDuration: {
        type: "scalar",
        value: [
          0.5
        ]
      },
      loopDelay: {
        type: "scalar",
        value: [
          0
        ]
      },
      loopAmount: {
        type: "scalar",
        value: [
          -1
        ]
      },
      particleLifetime: {
        type: "minmax",
        value: [
          2,
          2
        ]
      },
      particleDirection: {
        type: "minmax",
        value: [
          225,
          315
        ]
      },
      particleAngle: {
        type: "minmax",
        value: [
          0,
          360
        ]
      },
      particleLinearSpeed: {
        type: "minmax",
        value: [
          500,
          650
        ]
      },
      particleRotationSpeed: {
        type: "minmax",
        value: [
          -0.5,
          0.5
        ]
      },
      particleSize: [
        {
          type: "minmax",
          value: [
            75,
            90
          ]
        }
      ],
      particleColor: [
        {
          type: "scalar",
          value: [
            1
          ]
        },
        {
          type: "scalar",
          value: [
            1
          ]
        },
        {
          type: "scalar",
          value: [
            1
          ]
        },
        {
          type: "scalar",
          value: [
            1
          ]
        }
      ],
      affectors: {
        acceleration: {
          enabled: true,
          linearRange: {
            type: "vector2",
            value: [
              0,
              1000
            ]
          },
          angularValue: {
            type: "scalar",
            value: [
              0
            ]
          }
        },
        animation: {
          enabled: true,
          range: {
            type: "minmax",
            value: [
              60,
              60
            ]
          },
          type: "forward"
        },
        scaleOverLifetime: {
          enabled: true,
          values: [
            [
              0,
              0.5,
              1,
              1
            ],
            [
              0,
              0.5,
              1,
              1
            ]
          ],
          range: [
            {
              type: "vector2",
              value: [
                0,
                1
              ]
            },
            {
              type: "vector2",
              value: [
                0,
                1
              ]
            }
          ],
          separateAxis: false,
          easeType: [
            0,
            0
          ]
        },
        colorOverLifetime: {
          enabled: false,
          colorValues: [
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1
          ],
          colorEaseType: 0,
          darkValues: [
            0,
            0,
            0,
            0,
            1,
            1,
            0,
            0,
            0,
            1
          ],
          darkEaseType: 0
        },
        dragOverLifetime: {
          enabled: false,
          linearDrag: {
            type: "scalar",
            value: [
              200
            ]
          },
          linearCurveValues: [
            [
              0,
              1,
              1,
              1
            ],
            [
              0,
              1,
              1,
              1
            ]
          ],
          linearEaseType: [
            0,
            0
          ],
          angularDrag: {
            type: "scalar",
            value: [
              200
            ]
          },
          angularCurveValues: [
            0,
            1,
            1,
            1
          ],
          angularEaseType: 0
        },
        pointAccelerator: {
          enabled: false,
          point: {
            type: "vector2",
            value: [
              0,
              0
            ]
          },
          magnitude: {
            type: "scalar",
            value: [
              500
            ]
          },
          magnitudeValues: [
            [
              0,
              1,
              1,
              1
            ],
            [
              0,
              1,
              1,
              1
            ]
          ],
          magnitudeEaseType: [
            0,
            0
          ]
        }
      },
      particleAlignToDirection: false,
      anchor: {
        type: "vector2",
        value: [
          0,
          0
        ]
      },
      particleDarkColor: [
        {
          type: "scalar",
          value: [
            0
          ]
        },
        {
          type: "scalar",
          value: [
            0
          ]
        },
        {
          type: "scalar",
          value: [
            0
          ]
        },
        {
          type: "scalar",
          value: [
            1
          ]
        }
      ],
      particleEnableDarkColor: false,
      maskShader: "particleDefaultMaskShader",
      revParticleDrawOrder: false,
      invertMask: false
    }
  ]
};
