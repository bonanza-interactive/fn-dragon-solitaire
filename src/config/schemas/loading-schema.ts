import {gfx} from '@apila/engine';
import {schema} from '@apila/game-libraries';

import {createLocalizedTextMeta} from '../../types';

function fitSquarelyToCanvas(): schema.LayoutFunc<gfx.NodeProperties> {
  return (node: gfx.NodeProperties, gfx: gfx.Gfx) => {
    const screenSize: number[] = [];
    gfx.normalizedCanvasToWorld(1.5, 1.5, screenSize);
    const maxDimension = Math.max(...screenSize);
    node.size = [maxDimension, maxDimension];
  };
}

function fitHorizontalToCanvas(): schema.LayoutFunc<gfx.NodeProperties> {
  return (node: gfx.NodeProperties, gfx: gfx.Gfx) => {
    const screenSize: number[] = [];
    gfx.normalizedCanvasToWorld(1.5, 1.5, screenSize);
    const maxDimension = screenSize[0];
    node.size = [maxDimension, maxDimension];
    node.position = [0.0, (screenSize[1] - maxDimension) * 0.5];
  };
}

export const LOADING_SCREEN: schema.NodeSchema = {
  type: gfx.DrawableType.Empty,
  name: 'loading_screen_root',
  children: [
    {
      type: gfx.DrawableType.Sprite,
      name: 'background_gradient',
      pivot: [0.5, 0.5],
      image: 'bg_gradient',
      scale: [3000, 1500],
    },
    {
      type: gfx.DrawableType.Sprite,
      name: 'background',
      pivot: [0.5, 0.5],
      image: 'splash_screen_color',
      if: {
        landscape: {
          position: [0, 0],
          layout: fitHorizontalToCanvas(),
        },
        portrait: {
          position: [0, 0],
          layout: fitSquarelyToCanvas(),
        },
      },
    },
    {
      type: gfx.DrawableType.Sprite,
      name: 'loader_logo',
      pivot: [0.5, 0.5],
      scale: [0.8, 0.8],
      image: 'loader_logo',
      if: {
        landscape: {
          position: [0, -350],
        },
        portrait: {
          position: [0, -300],
        },
      },
    },
    {
      type: gfx.DrawableType.Sprite,
      name: 'loader_cards',
      pivot: [0.5, 0.5],
      scale: [1, 1],
      image: 'cards',
      if: {
        landscape: {
          position: [0, 0],
        },
        portrait: {
          position: [0, 0],
        },
      },
    },
    {
      type: gfx.DrawableType.BitmapText,
      name: 'frame_text',
      font: 'villitkakkoset_bold',
      pivot: [0.5, 0.5],
      meta: createLocalizedTextMeta({
        localizationKey: 'loader_info',
      }),
      style: 'Default',
      align: gfx.TextAlignment.CENTER,
      lineHeightAdjust: -10,
      if: {
        landscape: {
          position: [0, 250],
        },
        portrait: {
          position: [0, 300],
        },
      },
    },
    {
      type: gfx.DrawableType.Sprite,
      name: 'game_studio_logo',
      pivot: [0.0, 0.0],
      image: 'game_studio_logo_fi',
      layout: [schema.canvasAnchorCorner('left', 10, 'top', 10)],
      if: {
        landscape: {
          scale: [1, 1],
        },
        portrait: {
          scale: [1.2, 1.2],
        },
      },
    },
    {
      type: gfx.DrawableType.Sprite,
      name: 'keyflag',
      pivot: [0.0, 0.0],
      image: 'keyflag',
      layout: [schema.canvasAnchorCorner('right', 0, 'top', 0)],
      if: {
        landscape: {
          scale: [1, 1],
        },
        portrait: {
          scale: [1, 1],
        },
      },
    },
    {
      type: gfx.DrawableType.Sprite,
      name: 'progress_bar_bg',
      pivot: [0.5, 0.5],
      image: 'progress_bar_bg',
      if: {
        landscape: {
          position: [0, 400],
        },
        portrait: {
          position: [0, 500],
        },
      },
      children: [
        {
          type: gfx.DrawableType.Sprite,
          name: 'progress_bar',
          pivot: [0.5, 0.5],
          image: 'progress_bar',
          glShader: 'progress_bar',
          if: {
            initial: {
              glUniform: {color: [1, 1, 1]},
            },
          },
        },
        {
          type: gfx.DrawableType.Sprite,
          name: 'progress_bar_top',
          pivot: [0.5, 0.5],
          image: 'progress_bar_top',
        },
        {
          type: gfx.DrawableType.Sprite,
          name: 'progress_bar_shine',
          pivot: [0.5, 0.5],
          scale: [11 * 64, 1.6 * 64],
          glShader: 'shiny_halo',
          glBlendFunc: [
            gfx.GlBlendConst.ONE,
            gfx.GlBlendConst.ONE,
            gfx.GlBlendConst.ONE,
            gfx.GlBlendConst.ONE,
          ],
          if: {
            initial: {
              visible: false,
              glUniform: {progress: [0.7, 0.2], opacity: [0.0]},
            },
          },
        },
        {
          type: gfx.DrawableType.BitmapText,
          name: 'loading_text',
          scale: [0.6, 0.6],
          pivot: [0.5, 0.5],
          position: [0, 65],
          font: 'villitkakkoset_bold',
          meta: createLocalizedTextMeta({
            localizationKey: 'loading_progress',
          }),
        },
        {
          type: gfx.DrawableType.BitmapText,
          name: 'loaded_text',
          position: [0, -2],
          scale: [0.85, 0.85],
          pivot: [0.5, 0.5],
          font: 'villitkakkoset_bold',
          if: {
            initial: {
              opacity: 0,
            },
          },
          meta: createLocalizedTextMeta({
            localizationKey: 'loading_complete',
          }),
        },
      ],
    },
  ],
};
