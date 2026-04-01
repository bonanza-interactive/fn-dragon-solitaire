import {gfx} from '@apila/engine';

import {ButtonVisualState, ButtonVisualUpdateFunc} from '../../types';

export function createStageMenuButtonStates(
  name: string,
): ButtonVisualUpdateFunc {
  return (node: gfx.Sprite, state: ButtonVisualState, _g: gfx.Gfx) => {
    switch (state) {
      case ButtonVisualState.InactiveReleased:
      case ButtonVisualState.InactiveHighlightReleased:
      case ButtonVisualState.InactivePressed:
      case ButtonVisualState.InactiveHighlightPressed: {
        node.image = `${name}_disabled`;
        break;
      }
      case ButtonVisualState.ActiveReleased: {
        node.image = name;
        break;
      }
      case ButtonVisualState.ActiveHighlightReleased: {
        node.image = `${name}_active`;
        break;
      }
      case ButtonVisualState.ActivePressed:
      case ButtonVisualState.ActiveHighlightPressed: {
        node.image = `${name}_pressed`;
        break;
      }
      default: {
        break;
      }
    }
  };
}
