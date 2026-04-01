import {setButtonState} from '../button-state-handler';
import {GAMEFW} from '../framework';
import {CORE, GAME} from '../game';
import {CLIENT_STATE} from '../main';
import {AnyState, State} from '../state-machine';
import {TopElementsLocation} from '../top-elements-mover';
import {nextInput} from '../util/forward-input';
import {BasegameRound} from './BasegameRound';

export class CardSelection extends State {
  private skipTopElementAnimation = false;

  constructor(skipTopElementAnimation = false) {
    super();
    this.skipTopElementAnimation = skipTopElementAnimation;
  }

  public async run(): Promise<AnyState> {
    CORE.fx.trigger('fx_keno_mode_enter');
    CORE.fx.trigger('music_keno_idle');

    this.updateState(true);

    if (this.skipTopElementAnimation) {
      GAME.topElementsMover.move(TopElementsLocation.CardSelection);
    } else {
      GAME.topElementsMover.move(TopElementsLocation.CardSelection, true, 500);
    }

    GAME.cardChangeButtons.enable(true);
    GAME.paytable.refreshWintable(0);
    GAME.cards.killEffects();

    await GAME.cards.startCardSelection();

    if (CLIENT_STATE.replay) {
      return new BasegameRound();
    }

    GAME.cardPickGui.show(false);
    setButtonState('return_to_selection', false, true);

    let action;
    while (action !== 'play') {
      action = await nextInput();
    }
    GAMEFW.inputs();

    GAME.cardPickGui.hide();
    GAME.cardChangeButtons.disable();
    GAME.cards.stopEffects();
    GAME.cards.endCardSelection(false);

    GAME.topElementsMover.move(TopElementsLocation.Default, true);

    return new BasegameRound();
  }

  private updateState(isStartCardSelection: boolean): void {
    this.updateUI(isStartCardSelection);
  }

  private updateUI(isStartCardSelection: boolean): void {
    const handSize = isStartCardSelection ? 0 : GAME.cards.getHandSize();
    setButtonState('return_to_selection', handSize > 0, true);
    setButtonState('swap_selected', true, true);
  }
}
