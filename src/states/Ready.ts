import {GAME} from '../game';
import {CLIENT_STATE} from '../main';
import {AnyState, State} from '../state-machine';
import {BasegameRound} from './BasegameRound';
import {GAMEFW} from '../framework';
import {nextInput} from '../util/forward-input';

export class Ready extends State {
  public async run(): Promise<AnyState> {
    GAME.nodeStorage.baseGame.nodes.root.visible = true;
    GAME.paytable.refreshWintable();

    if (CLIENT_STATE.waitForPlayBeforeNextRound) {
      GAMEFW.inputs('play');
      let action;
      while (action !== 'play') {
        action = await nextInput();
      }
      GAMEFW.inputs();
      CLIENT_STATE.waitForPlayBeforeNextRound = false;
    }

    return new BasegameRound();
  }
}
