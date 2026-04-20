import {CORE, GAME} from '../game';
import {CLIENT_STATE} from '../main';
import {AnyState, State} from '../state-machine';
import {BackendUtil} from '../util/backend-util';
import {BasegameRound} from './BasegameRound';
import {Ready} from './ready';
import {ReplayFinished} from './ReplayFinished';

export class SettleBet extends State {
  private autoPlayTimer = 0.5;
  private allowAutoPlayAttempt?: () => void;

  public async run(): Promise<AnyState> {
    if (CLIENT_STATE.replay) {
      return new ReplayFinished();
    }
    CORE.fx.trigger('music_game_spinning');
    await BackendUtil.complete();
    CLIENT_STATE.roundInProgress = false;

    console.log('Settle bet');

    CLIENT_STATE.winsum = 0;

    GAME.baseGameFrameText.hide();
    GAME.winScroll.hide();

    GAME.paytable.refreshWintable();

    if (CLIENT_STATE.attemptAutoPlay) {
      return new BasegameRound();
    } else {
      CLIENT_STATE.waitForPlayBeforeNextRound = true;
      return new Ready();
    }
  }

  public update(dt: number): void {
    if (CLIENT_STATE.attemptAutoPlay) {
      this.autoPlayTimer -= dt;
    }
  }
}
