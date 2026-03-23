import {nextInput} from '../forward-input';
import {GAMEFW} from '../framework';
import {GAME} from '../game';
import {AnyState, State} from '../state-machine';
import {BasegameRound} from './basegame-round';

export class Ready extends State {
  public async run(): Promise<AnyState> {
    GAME.nodeStorage.baseGame.nodes.root.visible = true;

    GAMEFW.inputs('play');
    await nextInput();
    GAMEFW.inputs();

    return new BasegameRound();
  }
}
