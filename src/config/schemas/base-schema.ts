import {gfx} from '@apila/engine';
import {schema} from '@apila/game-libraries';

import {ButtonBlinkMode, ButtonLightType, createButtonMeta} from '../../types';
import {INITIALLY_HIDDEN} from './common-schema';
import {createGambleButtonStates} from './game-ui-button-states';
import {marginDeferred, marginLTRB} from '../../util/utils-schema';
import {CARD_NODES} from './card-schema';
import {GameLayer} from './schema-layers';
import {LOCALIZER} from '../../framework';

function dynamicMargin(): schema.LayoutFunc<gfx.NodeProperties> {
  const layoutFunc = (n: gfx.NodeProperties, g: gfx.Gfx) => {
    const margin = marginLTRB();
    marginDeferred({
      areaRect: [
        'paytable',
        'logo',
        'layout_margin_bottom',
        'layout_margin_right',
      ],
      marginValues: margin,
      anchor: [0.5, 0.5],
    })(n, g);
  };
  return layoutFunc;
}

export const BASE_GAME: schema.NodeSchema = {
  type: gfx.DrawableType.Empty,
  name: 'base_game_root',
  if: {
    initial: {
      visible: false,
    },
  },
  children: [
    {
      type: gfx.DrawableType.Empty,
      name: 'base_bg',
      children: [
        {
          type: gfx.DrawableType.Sprite,
          name: 'background',
          image: 'bg_green',
          glShader: 'background',
          pivot: [0.5, 0.5],
          position: [0, 0],
          size: [5120, 5120],
          depthGroup: GameLayer.Background,
          children: [
            {
              type: gfx.DrawableType.Sprite,
              image: 'coins_left_green',
              layout: [schema.canvasAnchorLeft(0), schema.canvasAnchorTop(0)],
              depthGroup: GameLayer.Background,
            },
            {
              type: gfx.DrawableType.Sprite,
              image: 'coins_right_green',
              layout: [schema.canvasAnchorRight(0), schema.canvasAnchorTop(0)],
              depthGroup: GameLayer.Background,
            },
          ],
        },
        {
          type: gfx.DrawableType.Sprite,
          name: 'bg_red',
          image: 'bg_red',
          glShader: 'background',
          pivot: [0.5, 0.5],
          position: [0, 0],
          size: [5120, 5120],
          depthGroup: GameLayer.Background,
          ...INITIALLY_HIDDEN,
          children: [
            {
              type: gfx.DrawableType.Sprite,
              name: 'coins_left_red',
              image: 'coins_left_red',
              layout: [schema.canvasAnchorLeft(0), schema.canvasAnchorTop(0)],
              depthGroup: GameLayer.Background,
            },
            {
              type: gfx.DrawableType.Sprite,
              name: 'coins_right_red',
              image: 'coins_right_red',
              layout: [schema.canvasAnchorRight(0), schema.canvasAnchorTop(0)],
              depthGroup: GameLayer.Background,
            },
          ],
        },
        {
          type: gfx.DrawableType.Empty,
          name: 'chips_left',
          position: [0, -200],
          depthGroup: GameLayer.Background,
          layout: [schema.canvasAnchorLeft(0)],
        },
        {
          type: gfx.DrawableType.Empty,
          name: 'chips_right1',
          position: [0, -200],
          depthGroup: GameLayer.Background,
          layout: [schema.canvasAnchorRight(0)],
        },
        {
          type: gfx.DrawableType.Empty,
          name: 'chips_right2',
          position: [0, 100],
          depthGroup: GameLayer.Background,
          layout: [schema.canvasAnchorRight(0)],
        },
      ],
    },
    {
      type: gfx.DrawableType.Empty,
      name: 'margin_area',
      layout: dynamicMargin(),
      children: [
        {
          type: gfx.DrawableType.Sprite,
          name: 'logo',
          image: LOCALIZER.get('_logo'),
          depthGroup: GameLayer.Logo,
          if: {
            portrait: {
              position: [0, -1000],
              scale: [0.85, 0.85],
              pivot: [0.5, 0.5],
            },
            landscape: {
              position: [-980, -450],
              scale: [0.85, 0.85],
              pivot: [0, 0],
            },
          },
        },
        {
          type: gfx.DrawableType.Empty,
          name: 'paytable_root',
          if: {
            portrait: {
              position: [0, -650],
              scale: [1, 1],
            },
            landscape: {
              position: [0, -350],
              scale: [0.9, 0.9],
            },
          },
          children: [
            {
              type: gfx.DrawableType.Sprite,
              name: 'paytable',
              image: 'paytable',
              pivot: [0.5, 0.5],
              position: [0, 0],
              depthGroup: GameLayer.Paytable,
              children: [
                {
                  type: gfx.DrawableType.Empty,
                  name: 'paytable_content',
                  position: [-540, -230],
                },
                {
                  // This node is used to align the game area with the right
                  // edge of GF's safe area (see dynamicMargin()). It uses
                  // the paytable node's dimensions for positioning in portrait
                  // mode. In landscape mode, half the width of the logo is
                  // added to help center the game area on screen.
                  type: gfx.DrawableType.Empty,
                  name: 'layout_margin_right',
                  if: {
                    landscape: {
                      position: [((1228 + 240) * 0.5) / 0.9, 0],
                    },
                    portrait: {
                      position: [1228 * 0.5, 0],
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          type: gfx.DrawableType.Empty,
          name: 'play_area',
          if: {
            portrait: {
              position: [0, -250],
            },
            landscape: {
              position: [0, 50],
            },
          },
          children: [
            {
              type: gfx.DrawableType.Empty,
              name: 'card_root',
              depthGroup: GameLayer.Cards,
              children: CARD_NODES,
            },
            {
              // This node is used to align the game area with the bottom
              // edge of GF's safe area (see dynamicMargin()). It uses
              // the doubling button node's dimensions and Y offset for
              // positioning. The multipliers come from the doubling button
              // scale values.
              type: gfx.DrawableType.Empty,
              name: 'layout_margin_bottom',
              if: {
                portrait: {
                  position: [0, 524 * 1.5],
                },
                landscape: {
                  position: [0, 300 + 84],
                },
              },
            },
            {
              type: gfx.DrawableType.Empty,
              name: 'temp_swap_button_root',
              pivot: [0.5, 0.5],
              if: {
                portrait: {
                  position: [485, 480],
                  scale: [1.2, 1.2],
                },
                landscape: {
                  position: [470, 30],
                  scale: [1, 1],
                },
              },
            },
            {
              type: gfx.DrawableType.Empty,
              name: 'gamble_low_node',
              children: [
                {
                  type: gfx.DrawableType.Sprite,
                  name: 'gamble_low',
                  pivot: [0.5, 0.5],
                  depthGroup: GameLayer.Gamble,
                  meta: createButtonMeta({
                    blinkMode: ButtonBlinkMode.Off,
                    lightType: ButtonLightType.Lamp,
                    //id: ButtonId.USER1,
                    colorActive: [68, 223, 255],
                    colorActiveBright: [68, 223, 255],
                    colorInactive: [1, 4, 4],
                    visualUpdateFunc: createGambleButtonStates(
                      'gamble_lo_value',
                      'gamble_lo_text'
                    ),
                  }),
                  children: [
                    {
                      type: gfx.DrawableType.BitmapText,
                      name: 'gamble_lo_multiplier',
                      font: 'basic_text',
                      position: [0, -110],
                      pivot: [0.5, 0.5],
                      depthGroup: GameLayer.Gamble,
                    },
                    {
                      type: gfx.DrawableType.BitmapText,
                      name: 'gamble_lo_value',
                      font: 'basic_text',
                      pivot: [0.5, 0.5],
                      depthGroup: GameLayer.Gamble,
                    },
                    {
                      type: gfx.DrawableType.BitmapText,
                      name: 'gamble_lo_text',
                      font: 'basic_text',
                      position: [0, 35],
                      pivot: [0.5, 0.5],
                      depthGroup: GameLayer.Gamble,
                    },
                  ],
                  if: {
                    initial: {
                      image: 'dbl_lo_button-0',
                    },
                    portrait: {
                      position: [-220, 400],
                    },
                    landscape: {
                      position: [-220, 300],
                    },
                  },
                },
              ],
              if: {
                initial: {
                  visible: false,
                },
                portrait: {
                  scale: [1.5, 1.5],
                },
                landscape: {
                  scale: [1, 1],
                },
              },
            },
            {
              type: gfx.DrawableType.Empty,
              name: 'gamble_black_seven_node',
              children: [
                {
                  type: gfx.DrawableType.Sprite,
                  name: 'gamble_black_seven',
                  pivot: [0.5, 0.5],
                  depthGroup: GameLayer.Gamble,
                  meta: createButtonMeta({
                    blinkMode: ButtonBlinkMode.Off,
                    lightType: ButtonLightType.Lamp,
                    //id: ButtonId.USER1,
                    colorActive: [68, 223, 255],
                    colorActiveBright: [68, 223, 255],
                    colorInactive: [1, 4, 4],
                    visualUpdateFunc: createGambleButtonStates(
                      'gamble_b7_value',
                      'gamble_b7_text'
                    ),
                  }),
                  children: [
                    {
                      type: gfx.DrawableType.BitmapText,
                      name: 'gamble_b7_multiplier',
                      font: 'basic_text',
                      position: [0, -110],
                      pivot: [0.5, 0.5],
                      depthGroup: GameLayer.Gamble,
                    },
                    {
                      type: gfx.DrawableType.BitmapText,
                      name: 'gamble_b7_value',
                      font: 'basic_text',
                      pivot: [0.5, 0.5],
                      depthGroup: GameLayer.Gamble,
                    },
                    {
                      type: gfx.DrawableType.BitmapText,
                      name: 'gamble_b7_text',
                      font: 'basic_text',
                      position: [0, 35],
                      pivot: [0.5, 0.5],
                      depthGroup: GameLayer.Gamble,
                    },
                  ],
                  if: {
                    initial: {
                      image: 'dbl_b7_button-0',
                    },
                    portrait: {
                      position: [0, 400],
                    },
                    landscape: {
                      position: [0, 300],
                    },
                  },
                },
              ],
              if: {
                initial: {
                  visible: false,
                },
                portrait: {
                  scale: [1.5, 1.5],
                },
                landscape: {
                  scale: [1, 1],
                },
              },
            },
            {
              type: gfx.DrawableType.Empty,
              name: 'gamble_high_node',
              children: [
                {
                  type: gfx.DrawableType.Sprite,
                  name: 'gamble_high',
                  pivot: [0.5, 0.5],
                  depthGroup: GameLayer.Gamble,
                  meta: createButtonMeta({
                    blinkMode: ButtonBlinkMode.Off,
                    lightType: ButtonLightType.Lamp,
                    //id: ButtonId.USER1,
                    colorActive: [68, 223, 255],
                    colorActiveBright: [68, 223, 255],
                    colorInactive: [1, 4, 4],
                    visualUpdateFunc: createGambleButtonStates(
                      'gamble_hi_value',
                      'gamble_hi_text'
                    ),
                  }),
                  children: [
                    {
                      type: gfx.DrawableType.BitmapText,
                      name: 'gamble_hi_multiplier',
                      font: 'basic_text',
                      position: [0, -110],
                      pivot: [0.5, 0.5],
                      depthGroup: GameLayer.Gamble,
                    },
                    {
                      type: gfx.DrawableType.BitmapText,
                      name: 'gamble_hi_value',
                      font: 'basic_text',
                      pivot: [0.5, 0.5],
                      depthGroup: GameLayer.Gamble,
                    },
                    {
                      type: gfx.DrawableType.BitmapText,
                      name: 'gamble_hi_text',
                      font: 'basic_text',
                      position: [0, 35],
                      pivot: [0.5, 0.5],
                      depthGroup: GameLayer.Gamble,
                    },
                  ],
                  if: {
                    initial: {
                      image: 'dbl_hi_button-0',
                    },
                    portrait: {
                      position: [220, 400],
                    },
                    landscape: {
                      position: [220, 300],
                    },
                  },
                },
              ],
              if: {
                initial: {
                  visible: false,
                },
                portrait: {
                  scale: [1.5, 1.5],
                },
                landscape: {
                  scale: [1, 1],
                },
              },
            },
            {
              type: gfx.DrawableType.Sprite,
              name: 'super_round_text',
              depthGroup: GameLayer.Foreground,
              pivot: [0.5, 0.5],
              ...INITIALLY_HIDDEN,
            },
            {
              type: gfx.DrawableType.BitmapText,
              name: 'frame_text',
              font: 'basic_text',
              depthGroup: GameLayer.Foreground,
              pivot: [0.5, 0.5],
              align: gfx.TextAlignment.CENTER,
              if: {
                initial: {
                  visible: false,
                },
                portrait: {
                  scale: [1.5, 1.5],
                  position: [0, 500],
                },
                landscape: {
                  scale: [1.2, 1.2],
                  position: [0, 240],
                },
              },
            },
          ],
        },
      ],
    },
  ],
};
