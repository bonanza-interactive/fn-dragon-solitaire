import {GAMEFW} from '../framework';
import {GAME} from '../game';
import {CLIENT_STATE} from '../main';
import {AnyState, State} from '../state-machine';
import {BackendUtil} from '../util/backend-util';
import {Autocomplete} from './Autocomplete';
import {EndRound} from './EndRound';
import {Ready} from './ready';

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

    if (
      currentRound.state === 'pick' &&
      (currentRound.picks?.length ?? 0) > 0
    ) {
      GAME.autocompleteButton.prepareForSolitairePicking(true);
      while (
        currentRound.state === 'pick' &&
        (currentRound.picks?.length ?? 0) > 0
      ) {
        const picks = currentRound.picks;
        if (!picks) break;
        const movePromise = GAME.cards.waitForSolitaireMove();
        const autoPromise = GAME.autocompleteButton.waitForPress();
        const raced = await Promise.race([
          movePromise.then((move) => ({tag: 'move' as const, move})),
          autoPromise.then(() => ({tag: 'auto' as const})),
        ]);
        if (raced.tag === 'auto') {
          GAME.cards.cancelPendingSolitaireMove();
          GAME.autocompleteButton.prepareForSolitairePicking(false);
          return new Autocomplete({
            roundState: currentRound,
            bet: placeBetResult.bet,
          });
        }
        const move = raced.move;
        const previousRound = currentRound;
        const pickIndex = BackendUtil.resolvePickIndex(move, picks);
        const newRound = await BackendUtil.solitairePick(pickIndex);
        await GAME.cards.animateSolitaireMove(previousRound, newRound, move);
        currentRound = newRound;
      }
      GAME.autocompleteButton.prepareForSolitairePicking(false);
    }

    CLIENT_STATE.roundInProgress = false;

    return new EndRound({
      roundState: currentRound,
      bet: placeBetResult.bet,
    });
  }
}
