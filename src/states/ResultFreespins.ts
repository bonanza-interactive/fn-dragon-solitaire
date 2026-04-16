import {GAMEFW} from '../framework';
import {StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import {isExceedMaxWin, showWin} from '../util/utils-game';
import {computeWinAmount} from '../util/win-amount';
// import {GambleQuery} from './GambleQuery';
import {SettleBet} from './settlebet';

export class ResultFreespins extends State<StateMachineRoundData> {
  public run(data: StateMachineRoundData): AnyState {
    const winAmount = computeWinAmount(data.roundState.winFactor, data.bet);
    if (winAmount > 0) {
      GAMEFW.updateWins(winAmount);
    }

    const roundState = data.roundState;

    if (winAmount > 0 && data.bet > 0) {
      showWin(winAmount, true, false, isExceedMaxWin(roundState), true);
    }

    return new SettleBet();
  }
}
