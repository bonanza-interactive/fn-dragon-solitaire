import {gfx} from '@apila/engine';
import {schema} from '@apila/game-libraries';

import {GameLayer} from './schema-layers';
import {INITIALLY_HIDDEN} from './common-schema';

export const WIN_SCROLLER: schema.NodeSchema = {
  type: gfx.DrawableType.Empty,
  name: 'scroller-root',
  children: [
    {
      type: gfx.DrawableType.Empty,
      name: 'moneyrain-root',
      depthGroup: GameLayer.CoinAnimation,
      ...INITIALLY_HIDDEN,
    },
    {
      type: gfx.DrawableType.Empty,
      name: 'winscroll-root',
      ...INITIALLY_HIDDEN,
      children: [
        {
          type: gfx.DrawableType.Spine,
          name: 'winscroll-effect',
          skeleton: 'bigwin',
          depthGroup: GameLayer.BigWinEffect,
          ...INITIALLY_HIDDEN,
        },
        {
          type: gfx.DrawableType.Empty,
          name: 'winscroll-fade-scaling',
          children: [
            {
              type: gfx.DrawableType.Empty,
              name: 'winscroll-bump-scaling',
              children: [
                {
                  type: gfx.DrawableType.BitmapText,
                  name: 'winscroll-text',
                  font: 'windisplay_bigwin_sum',
                  pivot: [0.5, 0.6],
                  depthGroup: GameLayer.WinscrollText,
                  align: gfx.TextAlignment.CENTER,
                },
                {
                  type: gfx.DrawableType.Sprite,
                  name: 'winscroll-title',
                  pivot: [0.5, 0.525],
                  depthGroup: GameLayer.WinscrollText,
                  position: [0, -70],
                  ...INITIALLY_HIDDEN,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const UI_COMMON_ROOT: schema.NodeSchema = {
  type: gfx.DrawableType.Empty,
  name: 'ui_common_root',
  children: [WIN_SCROLLER],
};
