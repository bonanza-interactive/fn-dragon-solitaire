import {CORE, GAME} from '../game';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {onLayoutChanged} from '../node-storage';
import {AnyState, State} from '../state-machine';
import {getReelGameKitLayout} from '../util/utils-gfx';
import {Ready} from './ready';
import {ReadyRecovery} from './ReadyRecovery';
import {Replay} from './replay';

export class PreloadDone extends State<StateMachineRoundData | undefined> {
  public run(data?: StateMachineRoundData): AnyState {
    CORE.fx.trigger('fx_enter_game');
    CORE.fx.trigger('music_keno_idle');

    const layout = getReelGameKitLayout(CORE.gfx.layout);
    onLayoutChanged(GAME.nodeStorage, layout);

    if (CLIENT_STATE.replay) {
      GAME.nodeStorage.baseGame.nodes.root.visible = true;

      return new Replay();
    }

    if (data) {
      return new ReadyRecovery(data);
    }
    return new Ready();
  }
}
