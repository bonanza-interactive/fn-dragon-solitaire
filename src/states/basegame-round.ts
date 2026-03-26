import {replayRoundData} from '../client-state';
import {GAMEFW} from '../framework';
import {GAME} from '../game';
import {CLIENT_STATE} from '../main';
import {AnyState, State} from '../state-machine';
import {BackendUtil} from '../util/backend-util';
import {Ready} from './ready';
// import {Spinning} from './spinning';

export type StateMachineEnterData = {
  restored: boolean;
};

export class BasegameRound extends State {
public run(_data: StateMachineEnterData): AnyState {
  GAME.baseGameFrameText.hide();
  GAME.winScroll.hide();

  // GAME.paytable.refreshWintable();
  // GAME.cards.dealCards();

  CLIENT_STATE.reset();

  BackendUtil.play(GAMEFW.state().bet).then((roundResult) => {
    // GAME.cards.collectCards().then(() => {
    //   if (!roundResult.accepted) {
    //     GAME.cards.resetCards();
    //     return new Ready();
    //   }

    //   // return new Spinning(roundResult);
    // });
  });

  return new Ready(); // fallback return (important)
}
}
