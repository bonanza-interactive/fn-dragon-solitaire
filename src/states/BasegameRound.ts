import {GAMEFW} from '../framework';
import {GAME} from '../game';
import {CLIENT_STATE} from '../main';
import {AnyState, State} from '../state-machine';
import {BackendUtil} from '../util/backend-util';
import {EndRound} from './EndRound';
import {Ready} from './Ready';

export type StateMachineEnterData = {
  restored: boolean;
};

export class BasegameRound extends State {
  public async run(): Promise<AnyState> {
    GAME.paytable.refreshWintable();
    GAME.dragonPanel.deactivateBonus();

    CLIENT_STATE.reset();

    const placeBetResult = await BackendUtil.play(GAMEFW.state().bet);
    CLIENT_STATE.roundInProgress = true;

    if (!placeBetResult.accepted) {
      CLIENT_STATE.waitForPlayBeforeNextRound = true;
      return new Ready();
    }

    CLIENT_STATE.bet = placeBetResult.bet;
    let currentRound = placeBetResult.round;
    GAME.cards.renderSolitaireBoard(currentRound);

    while (
      currentRound.state === 'pick' &&
      (currentRound.picks?.length ?? 0) > 0
    ) {
      const picks = currentRound.picks;
      if (!picks) break;
      const move = await GAME.cards.waitForSolitaireMove();
      const pickIndex = BackendUtil.resolvePickIndex(move, picks);
      const newRound = await BackendUtil.solitairePick(pickIndex);
      GAME.cards.renderSolitaireBoard(newRound);
      currentRound = newRound;
    }

    CLIENT_STATE.roundInProgress = false;

    return new EndRound({
      roundState: currentRound,
      bet: placeBetResult.bet,
    });
  }
}
