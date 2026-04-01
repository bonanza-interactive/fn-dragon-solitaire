import {GAMEFW} from '../framework';
import {GAME} from '../game';
import {AnyState, State} from '../state-machine';
import {BasegameRound} from './BasegameRound';
import {CardSelection} from './CardSelection';

export class Replay extends State {
  public async run(): Promise<AnyState> {
    GAME.nodeStorage.baseGame.nodes.root.visible = true;
    await GAMEFW.historyPlay();
    if (GAME.cards.getHandSize() === 0) {
      return new CardSelection(true);
    }

    return new BasegameRound();
  }
}
