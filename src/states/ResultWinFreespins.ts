import {GAMEFW} from '../framework';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import {assert, wait} from '../util/utils';
import {showWin} from '../util/utils-game';
import {computeWinAmount} from '../util/win-amount';
import {FreespinIntro} from './FreespinIntro';

export class ResultWinFreespins extends State<StateMachineRoundData> {
  public async run(data: StateMachineRoundData): Promise<AnyState> {
    const roundState = data.roundState;
    assert(roundState.rounds !== undefined);
    const round = roundState.rounds[CLIENT_STATE.roundStep];
    CLIENT_STATE.freespinsLeft = round.freespinsAmount ?? 0;

    const winAmount = computeWinAmount(roundState.winFactor, data.bet);
    if (winAmount !== undefined && data.bet > 0) {
      if (winAmount > 0) {
        const enableBigWin = false;
        const anims: Promise<void>[] = [];
        anims.push(showWin(winAmount, enableBigWin, true, false, false));
        anims.push(wait(2000));
        await Promise.all(anims);
      }

      CLIENT_STATE.winsum += winAmount;
      GAMEFW.updateWins(CLIENT_STATE.winsum);
    }

    return new FreespinIntro(data);
  }
}
