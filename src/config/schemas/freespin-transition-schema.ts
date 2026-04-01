import {gfx} from '@apila/engine';
import {schema} from '@apila/game-libraries';

import {GameLayer, INITIALLY_HIDDEN} from './common-schema';

export const FREESPIN_TRANSITION: schema.NodeSchema = {
  type: gfx.DrawableType.Empty,
  name: 'freespin_transition_root',
  ...INITIALLY_HIDDEN,
  children: [
    {
      type: gfx.DrawableType.Spine,
      name: 'freespin_BG_dark',
      skeleton: 'freespin_BG_dark',
      pivot: [0.5, 0.5],
      depthGroup: GameLayer.FsTransitionBackground,
      if: {
        portrait: {
          scale: [1, 1],
        },
        landscape: {
          scale: [1.5, 1.5],
        },
      },
    },
    {
      type: gfx.DrawableType.Spine,
      name: 'freespin_BG',
      skeleton: 'freespin_BG',
      pivot: [0.5, 0.5],
      depthGroup: GameLayer.FsTransitionBackground + 2,
      if: {
        portrait: {
          scale: [1, 1],
          position: [0, 0],
        },
        landscape: {
          scale: [1.5, 1.5],
          position: [0, -600],
        },
      },
    },
  ],
};
