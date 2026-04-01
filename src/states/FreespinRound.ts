import {miscConfig} from '../config/config';
import {CORE, GAME} from '../game';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import {assert} from '../util/utils';
import {FreespinSpinning} from './FreespinSpinning';
import {BackendUtil} from '../util/backend-util';
import {GAMEFW} from '../framework';
import {nextInput} from '../util/forward-input';
import {RecoveryStepState} from '../config/recovery-step';
import {replayRoundData} from '../client-state';

export class FreespinRound extends State<StateMachineRoundData> {
  public async run(data: StateMachineRoundData): Promise<AnyState> {
    CORE.fx.trigger('fx_multiplier_activation');

    if (CLIENT_STATE.replay) {
      const freeSpinIndex = CLIENT_STATE.replay.events.findIndex(
        (e) => e.action === 'freespin_pick',
      );
      const round = replayRoundData(CLIENT_STATE, freeSpinIndex);
      GAME.winScroll.hide();
      GAME.paytable.refreshWintable();

      ++CLIENT_STATE.roundStep;
      await GAME.cards.prepareRound(true);

      return new FreespinSpinning({
        roundState: round.round,
        bet: round.bet,
      });
    }

    if (miscConfig.userStartFreespins) {
      GAMEFW.inputs('continue');
      await nextInput();
      GAMEFW.inputs();
    }
    GAMEFW.inputs();

    GAME.winScroll.hide();
    GAME.paytable.refreshWintable();

    ++CLIENT_STATE.roundStep;

    assert(data.roundState.rounds !== undefined);
    await BackendUtil.step(RecoveryStepState.FREESPIN, CLIENT_STATE.roundStep);

    await GAME.cards.prepareRound(true);

    return new FreespinSpinning(data);
  }
}
