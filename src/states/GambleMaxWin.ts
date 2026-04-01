import {GAME} from '../game';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import {showWin} from '../util/utils-game';
import {GambleExit} from './GambleExit';
import {GAMEFW} from '../framework';

export class GambleMaxWin extends State<StateMachineRoundData> {
  public async run(data: StateMachineRoundData): Promise<AnyState> {
    // Just check here so the eslint won't complain about non-used field
    if (data.roundState) {
      GAMEFW.updateWins(CLIENT_STATE.winsum);

      await showWin(CLIENT_STATE.winsum, true, true, true, false);

      GAME.winScroll.hide();
      return new GambleExit();
    } else {
      return new GambleExit();
    }
  }
}
