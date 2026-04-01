import {gfx} from '@apila/engine';
import {Spine} from '@apila/engine/dist/apila-gfx';
import {schema} from '@apila/game-libraries';
import {byAspectRatio} from '@apila/game-libraries/dist/node-schema';

import {GameLayer} from './common-schema';
import {LOCALIZER} from '../../framework';

export const BACKGROUND: schema.NodeSchema = {
  type: gfx.DrawableType.Empty,
  name: 'base_bg',
  children: [
    {
      type: gfx.DrawableType.Spine,
      name: 'background',
      skeleton: 'loke_background',
      pivot: [0.5, 0.5],
      depthGroup: GameLayer.Background,
      if: {
        initial: {
          layout: (spine: Spine) => {
            spine.state.setAnimation(1, 'bg_glow_loop', true);
          },
        },
        portrait: {
          layout: byAspectRatio([
            {aspectRatio: 1, scale: [4.3, 4.3]},
            {aspectRatio: 16 / 9, scale: [4.5, 4.5]},
          ]),
          position: [0, 0],
        },
        landscape: {
          layout: byAspectRatio([
            {aspectRatio: 5 / 4, scale: [2.8, 2.8]},
            {aspectRatio: 16 / 9, scale: [2.05, 2.05]},
          ]),
          position: [0, -20],
        },
        portraitMobile: {
          layout: byAspectRatio([
            {aspectRatio: 1, scale: [3.5, 3.5]},
            {aspectRatio: 16 / 6, scale: [7.0, 7.0]},
          ]),
          position: [0, -50],
        },
        square: {
          scale: [4, 4],
          position: [140, 50],
        },
        squareMobile: {
          scale: [4, 4],
          position: [0, 50],
        },
      },
    },
    {
      type: gfx.DrawableType.Sprite,
      name: 'black_left',
      image: 'pixel_black',
      pivot: [0.5, 0.5],
      depthGroup: GameLayer.Gradient,
      position: [-1600, 0],
      size: [500, 1600],
      if: {
        portrait: {
          visible: false,
        },
        landscape: {
          visible: true,
        },
      },
    },
    {
      type: gfx.DrawableType.Sprite,
      name: 'black_right',
      image: 'pixel_black',
      pivot: [0.5, 0.5],
      depthGroup: GameLayer.Gradient,
      position: [1600, 0],
      size: [500, 1600],
      if: {
        portrait: {
          visible: false,
        },
        landscape: {
          visible: true,
        },
      },
    },
    {
      type: gfx.DrawableType.Sprite,
      name: 'gradient_left',
      image: 'gradient',
      pivot: [0.0, 0.5],
      depthGroup: GameLayer.Gradient,
      if: {
        portrait: {
          visible: false,
          position: [-1450, 0],
          size: [700, 1600],
          opacity: 1.0,
        },
        landscape: {
          visible: true,
          position: [-1450, 0],
          size: [700, 1600],
          opacity: 1.0,
        },
        square: {
          visible: true,
          position: [-1400, 0],
          size: [700, 2000],
          opacity: 0.6,
        },
      },
    },
    {
      type: gfx.DrawableType.Sprite,
      name: 'gradient_right',
      image: 'gradient',
      pivot: [0.0, 0.5],
      depthGroup: GameLayer.Gradient,
      if: {
        portrait: {
          visible: false,
          position: [1450, 0],
          size: [-700, 1600],
          opacity: 1.0,
        },
        landscape: {
          visible: true,
          position: [1450, 0],
          size: [-700, 1600],
          opacity: 1.0,
        },
        square: {
          visible: true,
          position: [1400, 0],
          size: [-700, 2000],
          opacity: 0.6,
        },
      },
    },
    {
      type: gfx.DrawableType.Empty,
      name: 'top_bar',
      if: {
        portrait: {
          //layout: schema.canvasAnchorTop(-180),
          layout: byAspectRatio([
            {
              aspectRatio: 810 / 858,
              position: [0, -1360],
            },
            {
              aspectRatio: 1.78,
              position: [0, -1360],
            },
            {
              aspectRatio: 2.5,
              position: [0, -1800],
            },
          ]),
        },
        landscape: {
          layout: byAspectRatio([
            {
              aspectRatio: 1,
              position: [0, -950],
              scale: [1, 1],
            },
            {
              aspectRatio: 16 / 9,
              position: [0, -660],
              scale: [1, 1],
            },
            {
              aspectRatio: 16 / 7,
              position: [0, -660],
              scale: [1, 1],
            },
          ]),
        },
        square: {
          position: [0, -1360],
        },
      },
      children: [
        {
          type: gfx.DrawableType.Sprite,
          name: 'ui_bar_top_left',
          pivot: [0.0, 0.0],
          depthGroup: GameLayer.UiBar,
          if: {
            portrait: {
              image: 'UI_bar_mobile',
              scale: [-1.25, 1.25],
              position: [0, -20],
            },
            landscape: {
              image: 'UI_bar_desktop',
              scale: [-0.7, 0.7],
              position: [0, 0],
            },
          },
        },
        {
          type: gfx.DrawableType.Sprite,
          name: 'ui_bar_top_right',
          pivot: [0.0, 0.0],
          depthGroup: GameLayer.UiBar,
          if: {
            portrait: {
              image: 'UI_bar_mobile',
              scale: [1.25, 1.25],
              position: [0, -20],
            },
            landscape: {
              image: 'UI_bar_desktop',
              scale: [0.7, 0.7],
              position: [0, 0],
            },
          },
        },
        {
          type: gfx.DrawableType.Sprite,
          name: 'logo',
          image: LOCALIZER.get('_logo'),
          depthGroup: GameLayer.Logo,
          pivot: [0.5, 0.0],
          visible: true,
          if: {
            portrait: {
              scale: [0.6, 0.6],
              position: [0, 225],
            },
            landscape: {
              scale: [0.52, 0.52],
              position: [0, 65],
            },
            landscapeMobile: {
              scale: [0.53, 0.53],
              position: [0, 75],
            },
          },
        },
        {
          type: gfx.DrawableType.Sprite,
          name: 'logo_portrait_eng',
          depthGroup: GameLayer.Logo,
          pivot: [0.5, 0.0],
          visible: false,
          if: {
            portrait: {
              scale: [0.53, 0.53],
              position: [0, 210],
              image: 'logo_en2',
            },
            landscape: {
              scale: [0.52, 0.52],
              position: [0, 65],
              image: 'logo_en',
            },
            landscapeMobile: {
              scale: [0.53, 0.53],
              position: [0, 60],
              image: 'logo_en',
            },
            square: {
              scale: [0.47, 0.47],
              position: [0, 210],
              image: 'logo_en2',
            },
          },
        },
      ],
    },
    {
      type: gfx.DrawableType.Empty,
      name: 'bottom_bar',
      if: {
        portrait: {
          layout: schema.canvasAnchorBottom(-30),
        },
        landscape: {
          layout: schema.canvasAnchorBottom(-40),
        },
        square: {
          layout: schema.canvasAnchorBottom(-30),
        },
      },
      children: [
        {
          type: gfx.DrawableType.Empty,
          name: 'ember_fx',
          pivot: [0.5, 0.0],
          depthGroup: GameLayer.Ember,
          scale: [1, 1],
          if: {
            portrait: {
              position: [0, -140],
            },
            landscape: {
              position: [0, 30],
            },
            square: {
              position: [0, -150],
            },
            landscapeMobile: {
              position: [0, 10],
            },
          },
        },
        {
          type: gfx.DrawableType.Empty,
          name: 'flame_ocean',
          pivot: [0.5, 0.5],
          depthGroup: GameLayer.FsTransitionBackground + 3,
          if: {
            portrait: {
              position: [0, -250],
            },
            landscape: {
              position: [0, -50],
            },
            square: {
              position: [0, -250],
            },
            landscapeMobile: {
              position: [0, -100],
            },
          },
        },
        {
          type: gfx.DrawableType.Sprite,
          name: 'ui_bar_bottom_left',
          pivot: [0.0, 0.0],
          depthGroup: GameLayer.UiBar,
          position: [0, 0],
          if: {
            portrait: {
              image: 'UI_bar_mobile',
              scale: [-1.25, -1.25],
            },
            landscape: {
              image: 'UI_bar_desktop',
              scale: [-0.7, -0.7],
            },
            square: {
              image: 'UI_bar_mobile',
              scale: [-1.25, -1.25],
            },
          },
        },
        {
          type: gfx.DrawableType.Sprite,
          name: 'ui_bar_bottom_right',
          pivot: [0.0, 0.0],
          depthGroup: GameLayer.UiBar,
          position: [0, 0],
          if: {
            portrait: {
              image: 'UI_bar_mobile',
              scale: [1.25, -1.25],
            },
            landscape: {
              image: 'UI_bar_desktop',
              scale: [0.7, -0.7],
            },
            square: {
              image: 'UI_bar_mobile',
              scale: [1.25, -1.25],
            },
          },
        },
      ],
    },
  ],
};
