import {GAME} from '../game';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import {assert, wait} from '../util/utils';
import {showWin} from '../util/utils-game';
import {GambleContinue} from './GambleContinue';
import {GambleExit} from './GambleExit';
import {GambleMaxWin} from './GambleMaxWin';
import {computeWinAmount} from '../util/win-amount';
import {GAMEFW, LOCALIZER} from '../framework';

export class GambleRound extends State<StateMachineRoundData> {
  public async run(data: StateMachineRoundData): Promise<AnyState> {
    const roundState = data.roundState;
    const gambleResult = roundState.gambleResult;

    assert(gambleResult !== undefined);
    assert(gambleResult.result !== undefined);

    const winAmount = computeWinAmount(gambleResult.result.winFactor, data.bet);

    CLIENT_STATE.winsum = winAmount;

    if (winAmount > 0 && data.roundState.canGamble) {
      GAME.baseGameFrameText.setTextString(
        LOCALIZER.get('gamble_win', LOCALIZER.money(winAmount)),
      );
    } else if (winAmount > 0) {
      GAME.baseGameFrameText.setTextString(
        LOCALIZER.get('gamble_win_exceeds_max', LOCALIZER.money(winAmount)),
      );
    }

    if (roundState.canGamble && gambleResult) {
      CLIENT_STATE.gambleStake = CLIENT_STATE.winsum;
    }

    const replayEnded =
      CLIENT_STATE.replay?.events[CLIENT_STATE.roundStep].method === 'complete';

    if (!roundState.canGamble && winAmount > 0)
      return new GambleMaxWin({roundState: roundState, bet: data.bet});
    else if (!replayEnded && roundState.canGamble && winAmount > 0) {
      void showWin(winAmount, false, false, false, false);
      return new GambleContinue({roundState: roundState, bet: data.bet});
    } else {
      GAME.baseGameFrameText.setText({key: 'gamble_lose', params: []});
      CLIENT_STATE.winsum = 0;
      GAMEFW.updateWins(CLIENT_STATE.winsum);
      await wait(1000);
      return new GambleExit();
    }
  }
}
