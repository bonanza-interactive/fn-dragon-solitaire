import {gfx} from '@apila/engine';
import {schema} from '@apila/game-libraries';
import {byAspectRatio} from '@apila/game-libraries/dist/node-schema';

import {createButtonMeta} from '../../types';
import {GameLayer} from './common-schema';
import {createStageMenuButtonStates} from './game-ui-button-states';

export const BUTTONS: schema.NodeSchema = {
  type: gfx.DrawableType.Empty,
  name: 'buttons_root',
  if: {
    landscape: {
      position: [870, 120],
      scale: [0.7, 0.7],
      layout: byAspectRatio([
        {
          aspectRatio: 1024 / 744,
          position: [860, 120],
        },
        {
          aspectRatio: 1400 / 744,
          position: [870, 120],
        },
        {
          aspectRatio: 1736 / 744,
          position: [880, 120],
        },
      ]),
    },
    portrait: {
      layout: byAspectRatio([
        {
          aspectRatio: 1.0,
          position: [-20, 430],
          scale: [0.8, 0.8],
        },
        {
          aspectRatio: 944 / 680,
          position: [-20, 410],
          scale: [0.8, 0.8],
        },
        {
          aspectRatio: 944 / 500,
          position: [40, 420],
          scale: [0.9, 0.9],
        },
      ]),
    },
    // landscapeMobile: {
    //   layout: byAspectRatio([
    //     {
    //       aspectRatio: 1024 / 744,
    //       position: [-800, 225],
    //       scale: [0.9, 0.9],
    //     },
    //     {
    //       aspectRatio: 1372 / 854,
    //       position: [-830, 240],
    //       scale: [0.9, 0.9],
    //     },
    //     {
    //       aspectRatio: 1862 / 786,
    //       position: [-1075, 248],
    //       scale: [0.9, 0.9],
    //     },
    //     {
    //       aspectRatio: 1864 / 858,
    //       position: [-1005, 248],
    //       scale: [0.9, 0.9],
    //     },
    //     {
    //       aspectRatio: 1880 / 735,
    //       position: [-1097, 255],
    //       scale: [1, 1],
    //     },
    //   ]),
    // },
    // portraitMobile: {
    //   layout: byAspectRatio([
    //     {
    //       aspectRatio: 1.0,
    //       position: [0, 520],
    //       scale: [1.1, 1.1],
    //     },
    //     {
    //       aspectRatio: 1.78,
    //       position: [0, 500],
    //       scale: [1.15, 1.15],
    //     },
    //     {
    //       aspectRatio: 2.2,
    //       position: [0, 640],
    //       scale: [1.2, 1.2],
    //     },
    //     {
    //       aspectRatio: 3.0,
    //       position: [0, 1000],
    //       scale: [1.3, 1.3],
    //     },
    //   ]),
    // },
  },
  children: [
    {
      type: gfx.DrawableType.Sprite,
      name: 'return_to_selection',
      image: 'back_button',
      depthGroup: GameLayer.Foreground,
      pivot: [0.5, 0.5],
      meta: createButtonMeta({
        visualUpdateFunc: createStageMenuButtonStates('back_button'),
      }),
      if: {
        initial: {
          visible: false,
        },
        landscape: {
          position: [0, -106],
        },
        portrait: {
          position: [-440, 20],
        },
        // landscapeMobile: {
        //   position: [-80, 0],
        // },
        // portraitMobile: {
        //   position: [-370, 0],
        // },
      },
    },
    {
      type: gfx.DrawableType.Sprite,
      name: 'swap_selected',
      image: 'card_swap_button',
      depthGroup: GameLayer.Foreground,
      pivot: [0.5, 0.5],
      meta: createButtonMeta({
        visualUpdateFunc: createStageMenuButtonStates('card_swap_button'),
      }),
      if: {
        initial: {
          visible: false,
        },
        landscape: {
          position: [0, 56],
        },
        portrait: {
          position: [-300, 20],
        },
        // landscapeMobile: {
        //   position: [80, 0],
        // },
        // portraitMobile: {
        //   position: [370, 0],
        // },
      },
    },
  ],
};
