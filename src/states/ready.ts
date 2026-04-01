import {CORE, GAME} from '../game';
import {AnyState, State} from '../state-machine';
import {BasegameRound} from './BasegameRound';
import {GAMEFW} from '../framework';
import {nextInput} from '../util/forward-input';
import {CardSelection} from './CardSelection';
import {setButtonState} from '../button-state-handler';

export class Ready extends State {
  public async run(): Promise<AnyState> {
    this.updateState();
    GAME.nodeStorage.baseGame.nodes.root.visible = true;

    if (!GAMEFW.state().autoplayRunning) {
      setButtonState('return_to_selection', true, true);
      setButtonState('swap_selected', true, true);
    }

    if (GAME.cards.getHandSize() === 0) {
      return new CardSelection(true);
    }

    GAME.paytable.refreshWintable();

    if (!GAMEFW.state().autoplayRunning) {
      GAME.cardChangeButtons.enable();
    }
    let isBackToSelectCards = false;

    // Card swap logic changes
    GAME.cardChangeButtons.changeSwapSelectedListener();
    GAMEFW.inputs('play');
    let action;
    while (action !== 'play' && action !== 'return_to_selection') {
      action = await nextInput();
      if (action === 'custom/return_to_selection') {
        isBackToSelectCards = true;
        break;
      }
    }
    GAMEFW.inputs();

    if (!GAMEFW.state().autoplayRunning) {
      this.updateState();
    }

    GAME.cardChangeButtons.disable();

    if (isBackToSelectCards) {
      GAME.dragonPanel.reset();
      return new CardSelection();
    } else {
      CORE.fx.trigger('music_game_spinning');
      return new BasegameRound();
    }
  }

  private updateState(): void {
    this.updateUI();
  }

  private updateUI(): void {
    setButtonState('return_to_selection', true, true);
    setButtonState('swap_selected', true, true);
  }
}
