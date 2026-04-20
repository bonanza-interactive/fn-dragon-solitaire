import {GAME} from '../game';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import {setButtonState} from '../button-state-handler';
import {
  applyAutocompleteMoveStep,
  extractAutocompleteMoveRounds,
} from './AutoCompleteMoves';
import {BackendUtil} from '../util/backend-util';
import {wait} from '../util/utils';
import {EndRound} from './EndRound';

const STEP_DELAY_MS = 120;

export class Autocomplete extends State<StateMachineRoundData> {
  public async run(data: StateMachineRoundData): Promise<AnyState> {
    GAME.autocompleteButton.prepareForSolitairePicking(false);
    setButtonState('autocomplete', false, true);

    let currentRound = data.roundState;
    const startLen = currentRound.rounds?.length ?? 0;

    const plannedFinal = await BackendUtil.autocomplete();
    const moveRounds = extractAutocompleteMoveRounds(plannedFinal, startLen);

    if (moveRounds.length === 0) {
      currentRound = plannedFinal;
      GAME.cards.renderSolitaireBoard(currentRound);
    } else {
      try {
        GAME.cards.renderSolitaireBoard(currentRound, {isAuto: true});
        for (const moveRound of moveRounds) {
          if (!moveRound.move) {
            continue;
          }
          await wait(STEP_DELAY_MS);
          const nextRound = applyAutocompleteMoveStep(
            currentRound,
            moveRound.move,
            moveRound.moved,
          );
          await GAME.cards.animateSolitaireMove(
            currentRound,
            nextRound,
            moveRound.move,
            moveRound.moved,
            false,
            true,
          );
          currentRound = nextRound;
        }
      } catch (e) {
        console.warn(
          'Autocomplete sequential pick failed, applying final state',
          e,
        );
        currentRound = plannedFinal;
        GAME.cards.renderSolitaireBoard(currentRound);
      }
    }

    if (currentRound.hash !== plannedFinal.hash) {
      currentRound = plannedFinal;
      GAME.cards.renderSolitaireBoard(currentRound);
    }

    CLIENT_STATE.roundInProgress = false;

    return new EndRound({
      roundState: currentRound,
      bet: data.bet,
    });
  }
}
