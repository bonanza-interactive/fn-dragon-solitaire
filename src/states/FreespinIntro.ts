// import {GameConfig} from '../config/config';
import {GameLayer} from '../config/schemas';
import {CORE, GAME} from '../game';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import {TopElementsLocation} from '../top-elements-mover';
import {isRecovery, wait} from '../util/utils';
import {FreespinRound} from './FreespinRound';
import {Ready} from './Ready';
import {BackendUtil} from '../util/backend-util';
import {RecoveryStepState} from '../config/recovery-step';
import {setButtonState} from '../button-state-handler';
import {GAMEFW} from '../framework';
import {nextInput} from '../util/forward-input';
import {replayRoundData} from '../client-state';
import {cardToIndex} from '../util/utils-game';
const tempNumber = 5;
export class FreespinIntro extends State<StateMachineRoundData> {
  public async run(_data: StateMachineRoundData): Promise<AnyState> {
    setButtonState('return_to_selection', false, true);
    setButtonState('swap_selected', true, true);

    CORE.fx.trigger('music_freespin_keno');
    CORE.fx.trigger('fx_freespin_enter');
    CORE.fx.trigger('fx_freespin_ambience');

    if (CLIENT_STATE.replay) {
      GAME.cards.setAllDepthGroup(GameLayer.Background + 1);
      await GAME.freespinTransition.enter();

      await GAME.freespinPopup.show();
      await wait(1800);
      await GAME.freespinPopup.hide();
      await GAME.dragonPanel.freespinsStart();
      await GAME.topElementsMover.move(TopElementsLocation.CardSelection, true);

      GAME.paytable.updateContent(tempNumber, true);

      GAME.paytable.show();
      GAME.paytableButton.isPaytableVisible = true;
      GAME.paytableButton.updateImage();

      const roundData = replayRoundData(
        CLIENT_STATE,
        CLIENT_STATE.roundStep + 1,
      );

      const selectedNumbers: number[] = roundData.round.rounds[
        CLIENT_STATE.roundStep + 1
      ].selectedNumbers.map((card) => cardToIndex(card.rank, card.suit));
      await GAME.cards.startCardSelection(true);
      GAME.cardPickGui.hide();
      GAME.cardChangeButtons.disable();
      await GAME.cards.stopEffects();
      await BackendUtil.chooseHandCards(selectedNumbers, true);
      await GAME.cards.cardSelectionExitTransition();
      GAME.topElementsMover.move(TopElementsLocation.Default, true);
      CORE.fx.trigger('music_freespin_game');
      return new FreespinRound({
        roundState: roundData.round,
        bet: roundData.bet,
      });
    }

    if (CLIENT_STATE.recoveryState !== RecoveryStepState.FREESPINS_ENTER)
      GAME.winScroll.hide();

    if (isRecovery()) {
      await BackendUtil.step(
        RecoveryStepState.FREESPINS_ENTER,
        CLIENT_STATE.roundStep,
      );
    }

    GAME.cards.setAllDepthGroup(GameLayer.Background + 1);
    await GAME.freespinTransition.enter();

    await GAME.freespinPopup.show();
    await wait(1800);
    await GAME.freespinPopup.hide();
    await GAME.dragonPanel.freespinsStart();
    await GAME.topElementsMover.move(TopElementsLocation.CardSelection, true);

    GAME.paytable.updateContent(tempNumber, true);

    GAME.paytable.show();
    GAME.paytableButton.isPaytableVisible = true;
    GAME.paytableButton.updateImage();
    await GAME.cards.startCardSelection(true);
    GAME.cardChangeButtons.enable(true, true);
    GAME.cardPickGui.show(true);

    let action: string = '';
    while (action !== 'play' && action !== 'continue') {
      action = await nextInput();
    }
    GAMEFW.inputs();

    GAME.cardPickGui.hide();
    GAME.cardChangeButtons.disable();
    await GAME.cards.stopEffects();
    GAME.cards.endCardSelection(true);

    const roundResult = await BackendUtil.freespinPick();

    if (roundResult === undefined) {
      GAME.cards.resetRound();
      return new Ready();
    }

    if (isRecovery()) {
      await BackendUtil.step(RecoveryStepState.FREESPINS_SELECTION_EXIT, 1);
    }

    await GAME.cards.cardSelectionExitTransition();
    GAME.topElementsMover.move(TopElementsLocation.Default, true);

    CORE.fx.trigger('music_freespin_game');
    return new FreespinRound({
      roundState: roundResult.round,
      bet: roundResult.bet,
    });
  }
}
