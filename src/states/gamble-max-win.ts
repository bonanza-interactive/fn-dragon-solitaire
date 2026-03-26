import {GameConfig} from '../config/config';
import {CORE, GAME} from '../game';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import {gambleMusicLevel, showWin} from '../util/utils-game';
import {GambleExit} from './gamble-exit';
import {LOCALIZER} from '../framework';
import {wait} from '../util/utils';

export class GambleMaxWin extends State<StateMachineRoundData> {
  public async run(data: StateMachineRoundData): Promise<AnyState> {
    CORE.fx.trigger(
      `fx_dbl_query_${gambleMusicLevel(CLIENT_STATE.winsum, data.bet)}`
    );

    // const allButtons = GameConfig.gameConfig.gamble.selections.map(
    //   (e) => e.type
    // );

    // for (const button of allButtons) {
    //   GAME.gambleButtons.hideButton(true, button);
    // }

    await showWin(CLIENT_STATE.winsum, true);
    GAME.baseGameFrameText.setText(
      LOCALIZER.get(
        'gamble_win_exceeds_max',
        LOCALIZER.money(CLIENT_STATE.winsum)
      )
    );

    await wait(1600);
    return new GambleExit(false);
  }
}
