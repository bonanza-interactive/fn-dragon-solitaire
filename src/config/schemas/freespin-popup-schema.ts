import {gfx} from '@apila/engine';
import {schema} from '@apila/game-libraries';

import {UiLayer} from './common-schema';

export const FREESPIN_POPUP: schema.NodeSchema = {
  type: gfx.DrawableType.Empty,
  name: 'freespin_popup_root',
  if: {
    initial: {visible: false},
    landscape: {position: [0, 0]},
    portrait: {position: [0, 210]},
  },
  children: [
    {
      type: gfx.DrawableType.Sprite,
      name: 'freespin_popup_content_1',
      position: [0, -120],
      pivot: [0.5, 0.5],
      scale: [1.1, 1.1],
      depthGroup: UiLayer.FreespinTransitionText,
    },
    {
      type: gfx.DrawableType.Sprite,
      name: 'freespin_popup_content_2',
      position: [0, 30],
      pivot: [0.5, 0.5],
      scale: [1.1, 1.1],
      depthGroup: UiLayer.FreespinTransitionText,
    },
  ],
};
