// import {GAMEFW} from '../framework';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
// import {
//   isExceedMaxWin,
//   showWin,
//   showWinWithMultiplier,
// } from '../util/utils-game';
// import {computeWinAmount} from '../util/win-amount';
import {FreespinOutro} from './FreespinOutro';
export class FreespinMaxWin extends State<StateMachineRoundData> {
  public async run(data: StateMachineRoundData): Promise<AnyState> {
    // const roundState = data.roundState;
    // const winAmount = computeWinAmount(roundState.winFactor, data.bet);
    // if (winAmount !== undefined && data.bet > 0) {
    //   if (winAmount > 0) {
    //     if (roundState.rounds && roundState.rounds[0].multiplier > 1) {
    //       await showWinWithMultiplier(
    //         winAmount,
    //         roundState.rounds[0].multiplier,
    //         true,
    //         isExceedMaxWin(roundState),
    //         true,
    //       );
    //     } else {
    //       await showWin(
    //         winAmount,
    //         true,
    //         true,
    //         isExceedMaxWin(roundState),
    //         true,
    //       );
    //     }
    //   }
    //   CLIENT_STATE.winsum = winAmount;
    //   GAMEFW.updateWins(winAmount);
    // }
    CLIENT_STATE.freespinsLeft = 0;
    return new FreespinOutro(data);
  }
}
