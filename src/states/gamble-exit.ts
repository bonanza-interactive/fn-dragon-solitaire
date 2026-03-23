import {GameConfig} from '../config/config';
import {CORE, GAME} from '../game';
import {CLIENT_STATE} from '../main';
import {AnyState, State} from '../state-machine';
import {SettleBet} from './settlebet';

export class GambleExit extends State<boolean> {
  public async run(collectAndPlay: boolean): Promise<AnyState> {
    GAME.paytable.refreshWintable();

    if (!CLIENT_STATE.replay) {
      GameConfig.gameConfig.gamble.selections
        .map((e) => e.type)
        .forEach((e) => GAME.gambleButtons.hideButton(true, e));
    }

    CORE.fx.trigger('fx_dbl_guess_stop');
    CORE.fx.trigger('fx_dbl_query_stop');

    return new SettleBet(collectAndPlay);
  }
}
