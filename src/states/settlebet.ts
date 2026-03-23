import {ChipType} from '../chips';
import {CORE, GAME} from '../game';
import {CLIENT_STATE} from '../main';
import {AnyState, State} from '../state-machine';
import {Ready} from './ready';
import {BackendUtil} from '../util/backend-util';
import {BasegameRound} from './basegame-round';
import {ReplayFinished} from './replay-finished';
import {GAMEFW} from '../framework';

export class SettleBet extends State<boolean> {
  public async run(collectAndPlay: boolean): Promise<AnyState> {
    if (CLIENT_STATE.replay) {
      return new ReplayFinished();
    }

    GAMEFW.updateWins(CLIENT_STATE.winsum);

    await BackendUtil.complete();

    if (CLIENT_STATE.bonusWon) {
      CORE.fx.trigger('fx_super_end');
      GAME.chips.playAnimation(ChipType.LEFT, 3);
      GAME.chips.playAnimation(ChipType.RIGHT1, 3);
      GAME.chips.playAnimation(ChipType.RIGHT2, 3);
      GAME.superBack.hilite(1, 0, 0.5);
    }

    GAME.paytable.setSuperround(1);
    GAME.paytable.refreshWintable();

    if (collectAndPlay) {
      return new BasegameRound();
    }
    return new Ready();
  }
}
