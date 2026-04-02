import {RecoveryStepState} from '../config/recovery-step';
import {GAMEFW} from '../framework';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import {BackendUtil} from '../util/backend-util';
import {isRecovery, winningRound} from '../util/utils';
import {MaxWin} from './MaxWin';
// import {ResultFreespins} from './ResultFreespins';
import {ResultNoWin} from './ResultNoWin';
import {ResultWinBasegame} from './ResultWinBasegame';
// import {ResultWinFreespins} from './ResultWinFreespins';

export class EndRound extends State<StateMachineRoundData> {
  public async run(data: StateMachineRoundData): Promise<AnyState> {
    if (CLIENT_STATE.winsum > 0) {
      GAMEFW.updateWins(CLIENT_STATE.winsum);
    }

    if (data.roundState.bonusWon) {
      if (data.roundState.maxWinFactorReached) {
        return new MaxWin(data);
      }
      // if (CLIENT_STATE.freespinsLeft === 0) {
      //   if (isRecovery()) {
      //     await BackendUtil.step(RecoveryStepState.FREESPINS_EXIT);
      //   }
      //   return new ResultFreespins(data);
      // } else {
      //   return new ResultWinFreespins(data);
      // }
    }

    if (winningRound(data)) {
      if (isRecovery()) {
        await BackendUtil.step(RecoveryStepState.END_ROUND);
      }
      return new ResultWinBasegame(data);
    }

    return new ResultNoWin();
  }
}
