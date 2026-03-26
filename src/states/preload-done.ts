import {CORE, GAME} from '../game';
import {onLayoutChanged} from '../node-storage';
import {AnyState, State} from '../state-machine';
import {getReelGameKitLayout} from '../util/utils-gfx';
import {Ready} from './ready';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
// import {ReadyRecovery} from './ready-recovery';
import {Replay} from './replay';

export class PreloadDone extends State<StateMachineRoundData | undefined> {
  public run(data?: StateMachineRoundData): AnyState {
    const layout = getReelGameKitLayout(CORE.gfx.layout);
    onLayoutChanged(GAME.nodeStorage, layout);

    if (CLIENT_STATE.replay) return new Replay();
    // if (data) return new ReadyRecovery(data);
    GAME.nodeStorage.uiCommon.nodes.root.visible = true;
    return new Ready();
  }
}
