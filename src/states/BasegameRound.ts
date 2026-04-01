import {replayRoundData} from '../client-state';
import {GAMEFW} from '../framework';
import {GAME} from '../game';
import {CLIENT_STATE} from '../main';
import {AnyState, State} from '../state-machine';
import {BackendUtil} from '../util/backend-util';
import {cardToIndex} from '../util/utils-game';
import {Ready} from './Ready';
import {Spinning} from './Spinning';

export type StateMachineEnterData = {
  restored: boolean;
};

export class BasegameRound extends State {
  public async run(_data: StateMachineEnterData): Promise<AnyState> {
    GAME.paytable.refreshWintable();
    GAME.dragonPanel.deactivateBonus();

    if (CLIENT_STATE.replay) {
      const roundData = replayRoundData(CLIENT_STATE);
      const selectedNumbers: number[] = roundData.round.rounds[
        CLIENT_STATE.roundStep
      ].selectedNumbers.map((card) => cardToIndex(card.rank, card.suit));
      await BackendUtil.chooseHandCards(selectedNumbers);
      if (GAME.cards.isCardSelectionMode()) {
        await GAME.cards.cardSelectionExitTransition();
      }
      GAME.dragonPanel.randomize(
        roundData.round.rounds[CLIENT_STATE.roundStep],
        false,
      );
      await GAME.cards.prepareRound(false);
      return new Spinning({
        roundState: roundData.round,
        bet: roundData.bet,
      });
    }

    CLIENT_STATE.reset();

    const placeBetPromise = await BackendUtil.play(GAMEFW.state().bet);
    CLIENT_STATE.roundInProgress = true;

    if (GAME.cards.isCardSelectionMode()) {
      await GAME.cards.cardSelectionExitTransition();
    }

    if (placeBetPromise.accepted) {
      const round = placeBetPromise.round.rounds[CLIENT_STATE.roundStep];
      GAME.dragonPanel.randomize(round, false);
    }

    const prepareRoundPromise = GAME.cards.prepareRound(false);

    const [roundResult] = await Promise.all([
      placeBetPromise,
      prepareRoundPromise,
    ]);

    if (!roundResult.accepted) {
      await GAME.cards.resetRound();
      return new Ready();
    }

    return new Spinning({
      roundState: roundResult.round,
      bet: roundResult.bet,
    });
  }
}
