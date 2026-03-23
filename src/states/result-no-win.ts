import {GAME} from '../game';
import {AnyState, State} from '../state-machine';
import {SettleBet} from './settlebet';

export class ResultNoWin extends State {
  public run(): AnyState {
    for (let i = 0; i < 8; i++) {
      GAME.cards.dimCard(i);
    }

    return new SettleBet(false);
  }
}
