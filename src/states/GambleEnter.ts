import {CORE, GAME} from '../game';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import {assert} from '../util/utils';
import {computeWinAmount} from '../util/win-amount';
import {Gamble} from './Gamble';

export class GambleEnter extends State<StateMachineRoundData> {
  public async run(data: StateMachineRoundData): Promise<AnyState> {
    const winAmount = computeWinAmount(
      data.roundState.winFactor,
      CLIENT_STATE.bet,
    );
    assert(winAmount !== undefined && winAmount > 0);

    CORE.fx.trigger('music_gamble');
    CORE.fx.trigger('fx_gamble_enter');

    GAME.baseGameFrameText.hide();
    GAME.winScroll.hide();
    GAME.paytableButton.hide();
    GAME.dragonPanel.hide(300);
    GAME.cards.stopEffects();

    await GAME.cards.collectCardsFromTable(true);
    await GAME.cards.discardHand();

    return new Gamble(data);
  }
}
