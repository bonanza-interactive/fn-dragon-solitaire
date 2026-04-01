import {ShuffleLocation} from '../cards';
import {GAME} from '../game';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import {assert, isRecovery} from '../util/utils';
import {GamblePick} from './GamblePick';
import {RecoveryStepState} from '../config/recovery-step';
import {computeWinAmount} from '../util/win-amount';
import {BackendUtil} from '../util/backend-util';
import {LOCALIZER} from '../framework';
import {replayRoundData} from '../client-state';
import {cardToIndex} from '../util/utils-game';

export class Gamble extends State<StateMachineRoundData> {
  public async run(data: StateMachineRoundData): Promise<AnyState> {
    const winAmount = computeWinAmount(data.roundState.winFactor, data.bet);
    assert(winAmount !== undefined);

    await GAME.cards.doQuickShuffle(ShuffleLocation.TableDeck, 500);
    await GAME.cards.dealGambleCards();

    if (CLIENT_STATE.replay) {
      const round = replayRoundData(CLIENT_STATE);
      const openCard = round.round.gambleResult?.openCard;
      assert(openCard !== undefined);
      const openCardIndex = cardToIndex(openCard.rank, openCard.suit);
      await GAME.cards.revealOpenGambleCard(openCardIndex);
      return new GamblePick();
    }

    const round = await BackendUtil.gamble();
    assert(round.gambleResult !== undefined);
    const openCardIndex = cardToIndex(
      round.gambleResult.openCard.rank,
      round.gambleResult.openCard.suit,
    );

    if (isRecovery()) {
      await BackendUtil.step(RecoveryStepState.GAMBLE_PICK);
    }

    await GAME.cards.revealOpenGambleCard(openCardIndex);

    GAME.baseGameFrameText.setTextString(
      LOCALIZER.get(
        'gamble_info',
        LOCALIZER.money(CLIENT_STATE.gambleStake * 2),
      ),
    );

    return new GamblePick();
  }
}
