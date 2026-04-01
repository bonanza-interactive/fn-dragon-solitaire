import {GAMEFW} from '../framework';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import {maxWinReached} from '../util/utils';
import {
  isExceedMaxWin,
  showWin,
  showWinWithMultiplier,
} from '../util/utils-game';
import {computeWinAmount} from '../util/win-amount';
import {GambleQuery} from './GambleQuery';
import {MaxWin} from './MaxWin';
import {SettleBet} from './Settlebet';

export class ResultWinBasegame extends State<StateMachineRoundData> {
  public async run(data: StateMachineRoundData): Promise<AnyState> {
    const roundState = data.roundState;

    const winAmount = computeWinAmount(roundState.winFactor, data.bet);

    if (maxWinReached(data)) {
      return new MaxWin(data);
    }

    if (winAmount !== undefined && data.bet > 0) {
      if (winAmount > 0) {
        let resolveWinScroll: () => void;
        CLIENT_STATE.winScrollCompletePromise = new Promise<void>((resolve) => {
          resolveWinScroll = resolve;
        });

        const onWinScrollComplete = () => {
          resolveWinScroll();
        };
        if (roundState.rounds && roundState.rounds[0].multiplier > 1) {
          void showWinWithMultiplier(
            winAmount,
            roundState.rounds[0].multiplier,
            false,
            isExceedMaxWin(roundState),
            true,
            onWinScrollComplete,
          );
        } else {
          void showWin(
            winAmount,
            true,
            false,
            isExceedMaxWin(roundState),
            true,
            onWinScrollComplete,
          );
        }
      }
      CLIENT_STATE.winsum += winAmount;
      GAMEFW.updateWins(winAmount);
    }

    if (GAMEFW.settings().game.gamble) {
      return new GambleQuery(data);
    } else {
      return new SettleBet();
    }
  }
}
