import {gfx} from '@apila/engine';
import {DrawableType} from '@apila/engine/dist/apila-gfx';
import {schema} from '@apila/game-libraries';
import {byAspectRatio} from '@apila/game-libraries/dist/node-schema';

import {
  WINTABLE_COUNT_X,
  WINTABLE_DY,
  WINTABLE_WIN_X,
  WINTABLE_Y,
} from '../../Paytable';
import {GameLayer, INITIALLY_HIDDEN} from './common-schema';

const DRAGON_PANEL: schema.NodeSchema = {
  type: gfx.DrawableType.Spine,
  name: 'dragon_panel',
  skeleton: 'wintable_dragon',
  depthGroup: GameLayer.Dragon,
  pivot: [0.5, 0.5],
  if: {
    landscape: {
      layout: byAspectRatio([
        {
          aspectRatio: 5 / 4,
          position: [-740, 200],
          scale: [0.47, 0.47],
        },
        {
          aspectRatio: 16 / 9,
          position: [-770, 280],
          scale: [0.47, 0.47],
        },
        {
          aspectRatio: 16 / 7,
          position: [-900, 300],
          scale: [0.6, 0.6],
        },
      ]),
    },
    portrait: {
      layout: byAspectRatio([
        {
          aspectRatio: 1 / 1,
          position: [-290, 60],
          scale: [0.5, 0.5],
        },
        {
          aspectRatio: 920 / 500,
          position: [-250, 60],
          scale: [0.65, 0.65],
        },
      ]),
    },
    landscapeMobile: {
      layout: byAspectRatio([
        {
          aspectRatio: 5 / 4,
          position: [-820, 240],
          scale: [0.5, 0.5],
        },
        {
          aspectRatio: 1332 / 839,
          position: [-780, 70],
          scale: [0.5, 0.5],
        },
        {
          aspectRatio: 1612 / 839,
          position: [-910, 20],
          scale: [0.6, 0.6],
        },
        {
          aspectRatio: 1864 / 798,
          position: [-1075, 90],
          scale: [0.6, 0.6],
        },
        {
          aspectRatio: 1864 / 723,
          position: [-1100, 100],
          scale: [0.65, 0.65],
        },
      ]),
    },
    portraitMobile: {
      position: [-260, 40],
      scale: [0.6, 0.6],
    },
    squareMobile: {
      position: [-320, 40],
      scale: [0.6, 0.6],
    },
  },
  children: [
    {
      type: gfx.DrawableType.BitmapText,
      name: 'dragon_freespin_counter',
      font: 'basic_text_big',
      scale: [1.5, 1.5],
      pivot: [0.5, 0.5],
      position: [0, 215],
      align: gfx.TextAlignment.CENTER,
      depthGroup: GameLayer.BehindCards,
      ...INITIALLY_HIDDEN,
    },
  ],
};

const PAYTABLE: schema.NodeSchema = {
  type: gfx.DrawableType.Empty,
  name: 'paytable_root',
  depthGroup: GameLayer.BehindCards,
  if: {
    landscape: {
      layout: byAspectRatio([
        {
          aspectRatio: 1030 / 790,
          position: [650, -170],
          scale: [0.7, 0.7],
        },
        {
          aspectRatio: 1270 / 790,
          position: [621, -80],
          scale: [0.7, 0.7],
        },
        {
          aspectRatio: 1800 / 797,
          position: [621, -56],
          scale: [0.7, 0.7],
        },
      ]),
    },
    portrait: {
      position: [130, -84],
      scale: [1.0, 1.0],
    },
    portraitMobile: {
      layout: byAspectRatio([
        {
          aspectRatio: 1 / 1,
          position: [120, -80],
          scale: [1.05, 1.05],
        },
        {
          aspectRatio: 1205 / 760,
          position: [105, -80],
          scale: [1.05, 1.05],
        },
        {
          aspectRatio: 920 / 500,
          position: [115, -80],
          scale: [1.05, 1.05],
        },
      ]),
    },
    landscapeMobile: {
      layout: byAspectRatio([
        {
          aspectRatio: 1030 / 790,
          position: [670, -190],
          scale: [0.8, 0.8],
        },
        {
          aspectRatio: 1270 / 790,
          position: [725, -180],
          scale: [0.8, 0.8],
        },
        {
          aspectRatio: 1800 / 797,
          position: [1130, -250],
          scale: [0.8, 0.8],
        },
      ]),
    },
    square: {
      position: [170, -80],
      scale: [1.1, 1.1],
    },
  },
  children: [
    {
      type: gfx.DrawableType.Empty,
      name: 'paytable_content',
      position: [0, 0],
      depthGroup: GameLayer.BehindCards,
      children: [
        {
          type: gfx.DrawableType.Sprite,
          name: 'paytable',
          image: 'pixel_black',
          size: [448, 320],
          pivot: [0.0, 0.0],
          opacity: 0.7,
          position: [-90, -48],
          depthGroup: GameLayer.BehindCards,
        },
        {
          type: gfx.DrawableType.Sprite,
          name: 'paytable',
          image: 'wintable_frame',
          pivot: [0.0, 0.0],
          position: [-90, -48],
          depthGroup: GameLayer.BehindCards,
        },
        {
          type: gfx.DrawableType.Sprite,
          name: 'paytable_count_header',
          position: [WINTABLE_COUNT_X, WINTABLE_Y - WINTABLE_DY - 10],
          pivot: [0.5, 0],
          depthGroup: GameLayer.BehindCards + 1,
        },
        {
          type: gfx.DrawableType.Sprite,
          name: 'paytable_win_header',
          position: [WINTABLE_WIN_X, WINTABLE_Y - WINTABLE_DY - 10],
          pivot: [0.5, 0],
          depthGroup: GameLayer.BehindCards + 1,
        },
      ],
    },
    {
      type: gfx.DrawableType.Sprite,
      name: 'wintable_button',
      position: [347, -58],
      pivot: [0.5, 0.5],
      scale: [0.65, 0.65],
      depthGroup: GameLayer.BehindCards + 1,
      if: {
        initial: {
          image: 'wintable_2_button',
        },
      },
    },
  ],
};

export const TOP_ELEMENTS: schema.NodeSchema = {
  type: DrawableType.Empty,
  name: 'top_elements',
  if: {
    landscape: {
      position: [0, -280],
      scale: [1, 1],
    },
    portrait: {
      position: [0, -540],
      scale: [1, 1],
    },
    squareMobile: {
      position: [0, -630],
      scale: [1.5, 1.5],
    },
    landscapeMobile: {
      layout: byAspectRatio([
        {
          aspectRatio: 5 / 4,
          position: [0, -380],
          scale: [1, 1],
        },
        {
          aspectRatio: 16 / 9,
          position: [0, -270],
          scale: [1, 1],
        },
        {
          aspectRatio: 16 / 7,
          position: [0, -200],
          scale: [1, 1],
        },
      ]),
    },
    portraitMobile: {
      scale: [1.2, 1.2],
      layout: byAspectRatio([
        {
          aspectRatio: 1.0,
          position: [0, -610],
          scale: [1.3, 1.3],
        },
        {
          aspectRatio: 1.78,
          position: [0, -700],
          scale: [1.2, 1.2],
        },
        {
          aspectRatio: 2.5,
          position: [0, -900],
          scale: [1.2, 1.2],
        },
      ]),
    },
  },
  children: [
    {
      type: DrawableType.Empty,
      name: 'top_elements_mover',
      children: [
        PAYTABLE,
        {
          type: DrawableType.Empty,
          name: 'dragon_mover',
          children: [DRAGON_PANEL],
        },
      ],
    },
  ],
};
