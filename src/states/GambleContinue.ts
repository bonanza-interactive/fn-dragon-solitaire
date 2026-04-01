import {debugConfig} from '../config/config';
import {CORE, GAME} from '../game';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import {assert, wait} from '../util/utils';
import {GambleExit} from './GambleExit';
import {GAMEFW, LOCALIZER} from '../framework';
import {Input} from '@apila/casino-frame/types';
import {nextInput} from '../util/forward-input';
import {Gamble} from './Gamble';
import {replayRoundData} from '../client-state';

export class GambleContinue extends State<StateMachineRoundData> {
  public async run(data: StateMachineRoundData): Promise<AnyState> {
    assert(data.roundState.gambleResult !== undefined);

    if (debugConfig.autoPlay) {
      return new GambleExit();
    }

    GAME.baseGameFrameText.setTextString(
      LOCALIZER.get('gamble_query', LOCALIZER.money(CLIENT_STATE.winsum)),
    );
    GAMEFW.updateWins(CLIENT_STATE.winsum);

    if (CLIENT_STATE.replay) {
      const replayEnded =
        CLIENT_STATE.replay?.events[CLIENT_STATE.roundStep + 1].method ===
        'complete';
      if (replayEnded) {
        wait(1000);
        GAME.winScroll.hide();
        GAME.baseGameFrameText.hide();
        return new GambleExit();
      }
      const round = replayRoundData(CLIENT_STATE);
      if (round.round.gambleResult !== undefined) {
        await wait(1000);
        CORE.fx.trigger('fx_gamble_enter');
        GAME.baseGameFrameText.hide();
        GAME.winScroll.hide();
        await GAME.cards.collectCardsFromTable(true);
        CLIENT_STATE.roundStep++;
        return new Gamble({
          roundState: round.round,
          bet: round.bet,
        });
      }
      return new GambleExit();
    }

    const inputs: Input[] = ['collect', 'collectAndPlay', 'gamble'];
    GAMEFW.inputs(...inputs);
    const action = await nextInput();
    GAMEFW.inputs();

    if (action === 'collect') {
      GAME.winScroll.hide();
      GAME.baseGameFrameText.hide();
      return new GambleExit();
    } else if (action === 'collectAndPlay') {
      CLIENT_STATE.attemptAutoPlay = true;
      GAME.baseGameFrameText.hide();
      return new GambleExit();
    } else if (action === 'gamble') {
      CORE.fx.trigger('fx_gamble_enter');
      GAME.baseGameFrameText.hide();
      GAME.winScroll.hide();
      await GAME.cards.collectCardsFromTable(true);
      return new Gamble(data);
    }

    GAME.baseGameFrameText.hide();
    return new GambleExit();
  }
}
