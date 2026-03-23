import {GAME} from '../game';
import {GAMEFW} from '../framework';
import {AnyState, State} from '../state-machine';
import {BasegameRound} from './basegame-round';

export class Replay extends State {
  public async run(): Promise<AnyState> {
    GAME.nodeStorage.uiCommon.nodes.root.visible = true;
    GAME.nodeStorage.baseGame.nodes.root.visible = true;

    await GAMEFW.historyPlay();
    console.log(`start replay`);

    return new BasegameRound();
  }
}
