import {replayRoundData} from '../client-state';
import {GAMEFW} from '../framework';
import {GAME} from '../game';
import {CLIENT_STATE} from '../main';
import {AnyState, State} from '../state-machine';
import {BackendUtil} from '../util/backend-util';
import {Ready} from './ready';
import {Spinning} from './spinning';

export type StateMachineEnterData = {
  restored: boolean;
};

export class BasegameRound extends State {
  public async run(_data: StateMachineEnterData): Promise<AnyState> {
    GAME.baseGameFrameText.hide();
    GAME.winScroll.hide();

    // GAME.paytable.refreshWintable();

    if (CLIENT_STATE.replay) return new Spinning(replayRoundData(CLIENT_STATE));

    CLIENT_STATE.reset();
    const roundResult = await BackendUtil.play(GAMEFW.state().bet);
    if (!roundResult.accepted) {
      throw new Error('Bet not accepted');
    }
    GAME.cards.setOpenCards(roundResult.round.openCards);
    GAME.waste.setWastePile(roundResult.round.wastePile);
    GAME.waste.show();
    GAME.cards.dealCards();
    await GAME.cards.collectCards();

    if (!roundResult.accepted) {
      GAME.cards.resetCards();

      return new Ready();
    }

    return new Spinning(roundResult);
  }
}
