import {AnyState, State} from '../state-machine';
import {SettleBet} from './Settlebet';

export class ResultNoWin extends State {
  public run(): AnyState {
    return new SettleBet();
  }
}
