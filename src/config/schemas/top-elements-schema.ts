import {gfx} from '@apila/engine';
import {DrawableType} from '@apila/engine/dist/apila-gfx';
import {schema} from '@apila/game-libraries';
// import {byAspectRatio} from '@apila/game-libraries/dist/node-schema';

import {
  WINTABLE_COUNT_X,
  WINTABLE_DY,
  WINTABLE_WIN_X,
  WINTABLE_Y,
} from '../../Paytable';
import {createButtonMeta} from '../../types';
import {GameLayer, INITIALLY_HIDDEN} from './common-schema';
import {createSingleImageButtonStates} from './game-ui-button-states';
const DRAGON_PANEL: schema.NodeSchema = {
  type: gfx.DrawableType.Spine,
  name: 'dragon_panel',
  skeleton: 'wintable_dragon',
  depthGroup: GameLayer.Dragon,
  pivot: [0.5, 0.5],
  if: {
    landscape: {
      size: [0.5, 0.5],
      position: [-1040, 540],
    },
    portrait: {
      position: [-400, -580],
      size: [0.4, 0.4],
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

export const BONUS_CARD: schema.NodeSchema = {
  type: gfx.DrawableType.Empty,
  name: 'bonus_root',
  depthGroup: GameLayer.Cards,
  if: {
    landscape: {
      position: [-1040, -400],
      scale: [1.7, 1.7],
    },
    portrait: {
      position: [0, -1110],
      scale: [1.5, 1.5],
    },
  },
  children: [
    {
      type: gfx.DrawableType.Empty,
      name: 'bonus_card_content',
      position: [0, 0],
      depthGroup: GameLayer.Cards,
      children: [
        {
          type: gfx.DrawableType.Sprite,
          name: 'bonus_card_holder',
          image: 'bonus_card_holder',
          scale: [1, 1],
          pivot: [0.5, 0.5],
          position: [0, 0],
          depthGroup: GameLayer.Dragon,
        },
      ],
    },
  ],
};
const PAYTABLE: schema.NodeSchema = {
  type: gfx.DrawableType.Empty,
  name: 'paytable_root',
  depthGroup: GameLayer.BehindCards,
  if: {
    landscape: {
      position: [900, -270],
      scale: [1, 1],
      // layout: byAspectRatio([
      //   {
      //     aspectRatio: 1030 / 790,
      //     position: [650, -170],
      //     scale: [0.7, 0.7],
      //   },
      //   {
      //     aspectRatio: 1270 / 790,
      //     position: [621, -80],
      //     scale: [0.7, 0.7],
      //   },
      //   {
      //     aspectRatio: 1800 / 797,
      //     position: [621, -56],
      //     scale: [0.7, 0.7],
      //   },
      // ]),
    },
    portrait: {
      position: [280, -660],
      scale: [0.9, 0.9],
    },
    // portraitMobile: {
    //   layout: byAspectRatio([
    //     {
    //       aspectRatio: 1 / 1,
    //       position: [120, -80],
    //       scale: [1.05, 1.05],
    //     },
    //     {
    //       aspectRatio: 1205 / 760,
    //       position: [105, -80],
    //       scale: [1.05, 1.05],
    //     },
    //     {
    //       aspectRatio: 920 / 500,
    //       position: [115, -80],
    //       scale: [1.05, 1.05],
    //     },
    //   ]),
    // },
    // landscapeMobile: {
    //   layout: byAspectRatio([
    //     {
    //       aspectRatio: 1030 / 790,
    //       position: [670, -190],
    //       scale: [0.8, 0.8],
    //     },
    //     {
    //       aspectRatio: 1270 / 790,
    //       position: [725, -180],
    //       scale: [0.8, 0.8],
    //     },
    //     {
    //       aspectRatio: 1800 / 797,
    //       position: [1130, -250],
    //       scale: [0.8, 0.8],
    //     },
    //   ]),
    // },
    // square: {
    //   position: [170, -80],
    //   scale: [1.1, 1.1],
    // },
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
    {
      type: gfx.DrawableType.Sprite,
      name: 'autocomplete',
      image: 'autoComplete',
      pivot: [0.5, 0.5],
      scale: [1, 1],
      depthGroup: GameLayer.BehindCards + 1,
      meta: createButtonMeta({
        visualUpdateFunc: createSingleImageButtonStates('autoComplete'),
      }),
      if: {
        initial: {
          visible: true,
        },
        landscape: {
          position: [300, 600],
        },
        portrait: {
          position: [347, 360],
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
    // squareMobile: {
    //   position: [0, -630],
    //   scale: [1.5, 1.5],
    // },
    // landscapeMobile: {
    //   layout: byAspectRatio([
    //     {
    //       aspectRatio: 5 / 4,
    //       position: [0, -380],
    //       scale: [1, 1],
    //     },
    //     {
    //       aspectRatio: 16 / 9,
    //       position: [0, -270],
    //       scale: [1, 1],
    //     },
    //     {
    //       aspectRatio: 16 / 7,
    //       position: [0, -200],
    //       scale: [1, 1],
    //     },
    //   ]),
    // },
    // portraitMobile: {
    //   scale: [1.2, 1.2],
    //   layout: byAspectRatio([
    //     {
    //       aspectRatio: 1.0,
    //       position: [0, -610],
    //       scale: [1.3, 1.3],
    //     },
    //     {
    //       aspectRatio: 1.78,
    //       position: [0, -700],
    //       scale: [1.2, 1.2],
    //     },
    //     {
    //       aspectRatio: 2.5,
    //       position: [0, -900],
    //       scale: [1.2, 1.2],
    //     },
    //   ]),
    // },
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
