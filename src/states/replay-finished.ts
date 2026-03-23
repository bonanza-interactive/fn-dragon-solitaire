import {GAME} from '../game';
import {GAMEFW} from '../framework';
import {AnyState, State} from '../state-machine';
import {wait} from '../util/utils';

export class ReplayFinished extends State {
  public async run(): Promise<AnyState> {
    GAME.nodeStorage.baseGame.nodes.root.visible = true;
    await wait(2000);
    await GAMEFW.historyComplete();
    console.log('end replay');
    // just await here forever
    await new Promise(() => {});
    return new ReplayFinished();
  }
}
