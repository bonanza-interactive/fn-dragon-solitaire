import {CORE, GAME} from '../game';
import {StateMachineRoundData} from '../main';
import {onLayoutChanged} from '../node-storage';
import {AnyState, State} from '../state-machine';
import {getReelGameKitLayout} from '../util/utils-gfx';
import {ReadyRecovery} from './ReadyRecovery';

export class LoadingRecovery extends State<StateMachineRoundData> {
  public run(data: StateMachineRoundData): AnyState {
    const layout = getReelGameKitLayout(CORE.gfx.layout);
    onLayoutChanged(GAME.nodeStorage, layout);
    return new ReadyRecovery(data);
  }
}
