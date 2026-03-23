import {gfx} from '@apila/engine';
import {
  DrawFilledText,
  DrawOutlineText,
  SetupCanvasShadow,
  SetupLinearGradient,
  popState,
  pushState,
} from './styling';

export type CanvasFontConfig = gfx.CanvasFont & Partial<{pad: number}>;

// const FONT_FAMILY = LOCALIZER.get('_font');

export const FONT = {
  windisplayText: {family: 'BoxedHeavy', heightPx: 92, pad: 32},
  windisplayMoney: {family: 'BoxedHeavy', heightPx: 128},
  superText: {family: 'Overlock-Black', heightPx: 140},
  basic: {family: 'Overlock-Bold', heightPx: 36},
} as const satisfies Record<string, CanvasFontConfig>;

export const FONT_STYLE = {
  windisplayText: [
    pushState,
    SetupCanvasShadow({shadowBlur: 2, shadowOffsetY: 6, shadowColor: 'black'}),
    SetupLinearGradient(
      0,
      0,
      0,
      1,
      [
        [0.15625, '#e86d18'],
        [0.40625, '#ffed33'],
        [0.53125, '#fdf172'],
        [0.59375, '#ffa827'],
        [0.78125, '#ffb122'],
        [1, '#fecf41'],
      ],
      {bounds: 'line-content'}
    ),
    DrawFilledText(),
    popState,
    DrawOutlineText({width: 3, fill: '#ffea1b'}),
  ],

  windisplayMoney: [
    pushState,
    (ctx) => ctx.translate(0, 4),
    DrawOutlineText({fill: '#5d3a06', width: 7}),
    (ctx, _, box) => {
      ctx.translate(0, -2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ff880d';
      ctx.strokeText(box.line, box.x, box.y + 0);
      ctx.strokeStyle = '#c43d09';
      ctx.strokeText(box.line, box.x, box.y + 2);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#923507';
      ctx.strokeText(box.line, box.x, box.y + 3);
      ctx.strokeStyle = '#703107';
      ctx.strokeText(box.line, box.x, box.y + 4);
    },
    popState,
    pushState,
    SetupLinearGradient(
      0,
      0,
      0,
      1,
      [
        [0.11050268856987815, '#ff8105'],
        [0.2555374673178432, '#ffdb2c'],
        [0.34078239850032066, '#ffff50'],
        [0.2965813230723694, '#ffff50'],
        [0.5081150411918505, '#d99933'],
        [0.7228059789847565, '#e8a627'],
        [0.8800256524098465, '#f3d466'],
      ],
      {bounds: 'line'}
    ),
    DrawFilledText(),
    popState,
    DrawOutlineText({width: 3, fill: '#fff91d'}),
  ],

  superText: [
    pushState,
    DrawOutlineText({fill: '#461d0a', width: 10}),
    popState,
    pushState,
    SetupLinearGradient(
      0,
      0,
      0,
      1,
      [
        [0.3, '#ffd53c'],
        [0.5, '#ffffb3'],
        [0.65, '#d48a18'],
        [0.95, '#deb216'],
      ],
      {bounds: 'line'}
    ),
    DrawFilledText(),
    popState,
  ],

  basic: [
    pushState,
    DrawOutlineText({fill: 'black', width: 2}),
    popState,
    pushState,
    SetupCanvasShadow({
      shadowColor: 'black',
      shadowBlur: 3,
      shadowOffsetX: 1.6,
      shadowOffsetY: 1.6,
    }),
    DrawFilledText({fill: 'white'}),
    popState,
  ],
} satisfies Record<string, gfx.CanvasTextDrawFn[]>;
