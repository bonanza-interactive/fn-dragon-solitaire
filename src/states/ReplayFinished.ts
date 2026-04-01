import {GAMEFW} from '../framework';
import {GAME} from '../game';
import {AnyState, State} from '../state-machine';

export class ReplayFinished extends State {
  public async run(): Promise<AnyState> {
    GAME.nodeStorage.baseGame.nodes.root.visible = true;
    await GAMEFW.historyComplete();
    // just await here forever
    await new Promise(() => {});
    return new ReplayFinished();
  }
}
