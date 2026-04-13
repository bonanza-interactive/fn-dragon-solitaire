import {RecoveryStepState} from '../config/recovery-step';
import {GAMEFW} from '../framework';
import {GAME} from '../game';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import {BackendUtil} from '../util/backend-util';
import {isRecovery, winningRound} from '../util/utils';
import {FreespinRound} from './FreespinRound';
import {MaxWin} from './MaxWin';
import {ResultNoWin} from './ResultNoWin';
import {ResultWinBasegame} from './ResultWinBasegame';

export class EndRound extends State<StateMachineRoundData> {
  public async run(data: StateMachineRoundData): Promise<AnyState> {
    if (CLIENT_STATE.winsum > 0) {
      GAMEFW.updateWins(CLIENT_STATE.winsum);
    }

    if (
      data.roundState.featureStatus.multiplier &&
      data.roundState.featureStatus.multiplier > 1
    ) {
      GAME.dragonPanel.activateBonus(false, 800);
    }

    if (data.roundState.bonusWon) {
      if (data.roundState.maxWinFactorReached) {
        return new MaxWin(data);
      }
      return new FreespinRound(data);
    }

    const picksResolved =
      data.roundState.state === 'pick' &&
      Array.isArray(data.roundState.picks) &&
      data.roundState.picks.length === 0;

    if (winningRound(data) || picksResolved) {
      if (isRecovery()) {
        await BackendUtil.step(RecoveryStepState.END_ROUND);
      }
      return new ResultWinBasegame(data);
    }

    return new ResultNoWin();
  }
}
