import {gfx} from '@apila/engine';
import {ButtonVisualState, ButtonVisualUpdateFunc} from '../../types';
import {getNode} from '../../util/utils-node';

// function buttonImages(button: string): string[] {
//   if (button === 'gamble_low') return GAME.gambleButtons.getImages('lo');
//   else if (button === 'gamble_black_seven')
//     return GAME.gambleButtons.getImages('b7');
//   else if (button === 'gamble_high') return GAME.gambleButtons.getImages('hi');

//   assert(false, `unknown button ${button}`);
// }

export function createGambleButtonStates(
  value: string,
  text: string
): ButtonVisualUpdateFunc {
  return (node: gfx.Sprite, state: ButtonVisualState, _g: gfx.Gfx) => {
    // const images = buttonImages(node.name);

    const valueNode = getNode(node, value);
    const textNode = getNode(node, text);

    switch (state) {
      case ButtonVisualState.ActivePressed:
      case ButtonVisualState.ActiveHighlightPressed:
        // node.image = images[2];
        valueNode.position = [0, 5];
        textNode.position = [0, 45];
        break;
      case ButtonVisualState.ActiveReleased:
      case ButtonVisualState.ActiveHighlightReleased:
        // node.image = images[1];
        valueNode.position = [0, 0];
        textNode.position = [0, 40];
        break;
      case ButtonVisualState.InactiveReleased:
      case ButtonVisualState.InactivePressed:
      case ButtonVisualState.InactiveHighlightReleased:
      case ButtonVisualState.InactiveHighlightPressed:
        // node.image = images[0];
        valueNode.position = [0, 5];
        textNode.position = [0, 45];
        break;
    }
  };
}
