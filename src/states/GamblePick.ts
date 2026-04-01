import {replayRoundData} from '../client-state';
import {RecoveryStepState} from '../config/recovery-step';
import {GAMEFW} from '../framework';
import {CORE, GAME} from '../game';
import {CLIENT_STATE} from '../main';
import {AnyState, State} from '../state-machine';
import {BackendUtil} from '../util/backend-util';
import {assert, isRecovery} from '../util/utils';
import {cardToIndex} from '../util/utils-game';
import {computeWinAmount} from '../util/win-amount';
import {GambleRound} from './GambleRound';

export class GamblePick extends State {
  public async run(): Promise<AnyState> {
    if (CLIENT_STATE.replay) {
      CLIENT_STATE.roundStep++;
      const round = replayRoundData(CLIENT_STATE);
      assert(round.round.gambleResult !== undefined);
      assert(round.round.gambleResult.result !== undefined);
      const selectableCards = round.round.gambleResult.result.resultCards.map(
        (card: {rank: string; suit: string}) =>
          cardToIndex(card.rank, card.suit),
      );
      const pick = round.round.gambleResult.result.pick;
      const isWinning = round.round.gambleResult.result.winFactor > 0;
      await GAME.cards.flipGambleCards(pick, selectableCards, isWinning);
      return new GambleRound({
        roundState: round.round,
        bet: round.bet,
      });
    }
    const pick = await GAME.cards.selectGambleCard();
    CORE.fx.trigger('fx_gamble_pick');
    GAME.baseGameFrameText.hide();

    const result = await BackendUtil.gamblePick(pick);

    if (isRecovery()) {
      await BackendUtil.step(RecoveryStepState.GAMBLE_ROUND);
    }

    const gambleResult = result.gambleResult;
    assert(gambleResult !== undefined);
    assert(gambleResult.result !== undefined);

    const winAmount = computeWinAmount(
      gambleResult.result.winFactor,
      GAMEFW.state().bet,
    );
    if (winAmount !== undefined && winAmount > 0) {
      CORE.fx.trigger('fx_gamble_win');
    } else {
      CORE.fx.trigger('fx_gamble_lose');
    }

    const selectableCards = gambleResult.result.resultCards.map(
      (card: {rank: string; suit: string}) => cardToIndex(card.rank, card.suit),
    );

    const isWinning =
      computeWinAmount(gambleResult.result.winFactor, GAMEFW.state().bet) > 0;
    await GAME.cards.flipGambleCards(pick, selectableCards, isWinning);
    return new GambleRound({roundState: result, bet: GAMEFW.state().bet});
  }
}
