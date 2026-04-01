import {CORE, GAME} from '../game';
import {AnyState, State} from '../state-machine';
import {wait} from '../util/utils';
import {SettleBet} from './Settlebet';

export class GambleExit extends State {
  public async run(): Promise<AnyState> {
    await wait(1000);
    CORE.fx.trigger('fx_gamble_exit');
    GAME.cards.removeOpenGambleEffect();

    GAME.paytableButton.show();
    GAME.dragonPanel.show(300);

    await GAME.cards.collectCardsFromTable(true);
    await GAME.cards.restoreHand();

    return new SettleBet();
  }
}
