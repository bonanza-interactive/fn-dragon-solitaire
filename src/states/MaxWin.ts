import {GAMEFW} from '../framework';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import {
  isExceedMaxWin,
  showWin,
  showWinWithMultiplier,
} from '../util/utils-game';
import {computeWinAmount} from '../util/win-amount';
import {SettleBet} from './Settlebet';

export class MaxWin extends State<StateMachineRoundData> {
  public async run(data: StateMachineRoundData): Promise<AnyState> {
    const roundState = data.roundState;
    const winAmount = computeWinAmount(roundState.winFactor, data.bet);
    if (winAmount !== undefined && data.bet > 0) {
      if (winAmount > 0) {
        // if (data.roundState.freespinWon) {
        //   return new SettleBet();
        // }
        if (roundState.rounds) {
          await showWinWithMultiplier(
            winAmount,
            roundState.rounds[0].winFactor,
            true,
            isExceedMaxWin(roundState),
            true,
          );
        } else {
          await showWin(
            winAmount,
            true,
            true,
            isExceedMaxWin(roundState),
            true,
          );
        }
      }
      CLIENT_STATE.winsum += winAmount;
      GAMEFW.updateWins(winAmount);
    }
    return new SettleBet();
  }
}
