import {gfx} from '@apila/engine';
import {schema} from '@apila/game-libraries';

import {GameLayer, INITIALLY_HIDDEN} from './common-schema';

export const WIN_SCROLLER: schema.NodeSchema = {
  type: gfx.DrawableType.Empty,
  name: 'scroller-root',
  if: {
    portrait: {
      position: [0, 100],
    },
    landscape: {
      position: [0, -30],
    },
  },
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
          name: 'winscroll-tint',
          skeleton: 'bigwin_tint',
          depthGroup: GameLayer.BigWinEffect,
          ...INITIALLY_HIDDEN,
        },
        {
          type: gfx.DrawableType.Spine,
          name: 'big_win_spine',
          skeleton: 'big_win',
          position: [0, 0],
          depthGroup: GameLayer.BigWinEffect + 1,
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
                  pivot: [0.5, 0.6],
                  depthGroup: GameLayer.WinscrollText,
                  position: [0, -100],
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
