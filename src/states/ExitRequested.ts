import {AnyState, State} from '../state-machine';
import {wait} from '../util/utils';
import {Ready} from './Ready';

export class ExitRequested extends State {
  public async run(): Promise<AnyState> {
    await wait(5000);

    return new Ready();
  }
}
