import {Round} from '../config/backend-types';
import {CARD_DRAGON, GameConfig} from '../config/config';
import {CORE, GAME} from '../game';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import {assert, wait} from '../util/utils';
import {cardToIndex} from '../util/utils-game';
import {FreespinIntro} from './FreespinIntro';
import {FreespinSpinning} from './FreespinSpinning';
import {GamblePick} from './GamblePick';
import {GambleRound} from './GambleRound';
import {ResultFreespins} from './ResultFreespins';
import {ResultWinBasegame} from './ResultWinBasegame';
import {Spinning} from './Spinning';
import {computeWinAmount} from '../util/win-amount';
import {RecoveryStepState} from '../config/recovery-step';
import {GAMEFW, LOCALIZER} from '../framework';

export class ReadyRecovery extends State<StateMachineRoundData> {
  public async run(data: StateMachineRoundData): Promise<AnyState> {
    GAME.nodeStorage.baseGame.nodes.root.visible = true;
    CLIENT_STATE.roundInProgress = true;

    console.log('Recovery state: ' + CLIENT_STATE.recoveryState?.toString());

    if (data.roundState.gambleResult) {
      await this.recoverGambleStart(data);
      if (
        data.roundState.gambleResult.result?.resultCards !== undefined &&
        data.roundState.gambleResult.result?.pick !== undefined
      ) {
        await this.recoverGambleRound(data);
        return new GambleRound(data);
      } else {
        const winAmount = computeWinAmount(
          data.roundState.gambleResult.stake * 2,
          data.bet,
        );
        GAME.baseGameFrameText.setTextString(
          LOCALIZER.get('gamble_info', LOCALIZER.money(winAmount)),
        );
        CORE.fx.trigger('music_gamble');

        return new GamblePick();
      }
    } else {
      if (
        CLIENT_STATE.recoveryState === undefined ||
        CLIENT_STATE.recoveryState === RecoveryStepState.BASEGAME
      ) {
        return this.recoverBaseGame(data);
      } else if (CLIENT_STATE.recoveryState === RecoveryStepState.END_ROUND) {
        if (data.roundState.canGamble) {
          await this.recoverEndRound(data);
          return new ResultWinBasegame(data);
        } else {
          return this.recoverBaseGame(data);
        }
      } else if (
        CLIENT_STATE.recoveryState === RecoveryStepState.FREESPINS_ENTER ||
        CLIENT_STATE.recoveryState ===
          RecoveryStepState.FREESPINS_SELECTION_EXIT ||
        CLIENT_STATE.recoveryState === RecoveryStepState.FREESPIN ||
        CLIENT_STATE.recoveryState === RecoveryStepState.FREESPINS_EXIT
      ) {
        const isFreepinRoundsStarted = data.roundState.rounds
          ? data.roundState.rounds.some((r) => r.roundType === 'freespin')
          : false;

        if (
          CLIENT_STATE.recoveryState === RecoveryStepState.FREESPINS_ENTER &&
          !isFreepinRoundsStarted
        ) {
          return this.recoverFreespinStart(data);
        } else if (
          CLIENT_STATE.recoveryState === RecoveryStepState.FREESPINS_EXIT
        ) {
          await this.recoverFreespinExit(data);
          return new ResultFreespins(data);
        } else {
          await this.recoverFreespinGame(data);
          CORE.fx.trigger('fx_freespin_ambience');
          return new FreespinSpinning(data);
        }
      }
    }

    assert(
      false,
      `recovery state failed ` +
        `(${CLIENT_STATE.recoveryState}:${CLIENT_STATE.roundStep})`,
    );
  }

  private async recoverGambleStart(data: StateMachineRoundData): Promise<void> {
    const winAmount = computeWinAmount(data.roundState.winFactor, data.bet);
    assert(winAmount !== undefined && winAmount > 0);
    assert(data.roundState.gambleResult !== undefined);

    CLIENT_STATE.winsum += winAmount;

    GAME.paytable.hide();
    GAME.paytableButton.hide();
    GAME.dragonPanel.hide();

    const openCard = data.roundState.gambleResult.openCard;
    const openCardIndex = cardToIndex(openCard.rank, openCard.suit);

    await GAME.cards.dealGambleCards();
    await GAME.cards.revealOpenGambleCard(openCardIndex);

    return Promise.resolve();
  }

  private async recoverGambleRound(data: StateMachineRoundData): Promise<void> {
    const gambleResult = data.roundState.gambleResult;
    assert(gambleResult !== undefined);
    assert(gambleResult.result?.resultCards !== undefined);

    assert(gambleResult.result.pick !== undefined);
    const pick = gambleResult.result.pick;

    const selectableCards = gambleResult.result?.resultCards.map((card) =>
      cardToIndex(card.rank, card.suit),
    );
    const isWinning =
      computeWinAmount(gambleResult.result.winFactor, data.bet) > 0;
    await GAME.cards.flipGambleCards(pick, selectableCards, isWinning);

    return Promise.resolve();
  }

  private recoverBaseGame(data: StateMachineRoundData): AnyState {
    assert(data.roundState.rounds !== undefined);

    this.resetHand(data.roundState.rounds[0], undefined);
    GAME.paytable.refreshWintable();

    const round = data.roundState.rounds[CLIENT_STATE.roundStep];
    GAME.dragonPanel.randomize(round, false, false);

    return new Spinning(data);
  }

  private resetHand(
    basegameRound: Round,
    freespinRound: Round | undefined,
  ): void {
    const originalHand = basegameRound.selectedNumbers.map((card) =>
      card.isJoker ? CARD_DRAGON : cardToIndex(card.rank, card.suit),
    );
    const currentHand =
      freespinRound === undefined
        ? originalHand
        : freespinRound.selectedNumbers.map((card) =>
            card.isJoker ? CARD_DRAGON : cardToIndex(card.rank, card.suit),
          );

    GAME.cards.recoverBasegameSelectedCards(originalHand);
    GAME.cards.resetHandCards(currentHand);
  }

  private recoverFreespinStart(data: StateMachineRoundData): AnyState {
    assert(data.roundState.rounds !== undefined);

    const round = data.roundState.rounds[CLIENT_STATE.roundStep];
    const winAmount = computeWinAmount(round.winFactor, data.bet);
    CLIENT_STATE.winsum += winAmount;
    GAMEFW.updateWins(CLIENT_STATE.winsum);
    CLIENT_STATE.freespinsLeft += round.freespinsAmount ?? 0;

    this.resetHand(data.roundState.rounds[0], undefined);
    GAME.dragonPanel.randomize(round, false, true);
    GAME.dragonPanel.activateBonus(true);

    return new FreespinIntro(data);
  }

  private async recoverFreespinGame(
    data: StateMachineRoundData,
  ): Promise<void> {
    assert(data.roundState.rounds !== undefined);

    // Make sure roundStep not in basegame round anymore.
    // Related to WBUG-182 issue where recovery was still in
    // freespins_enter state eventhough freespin was already over
    if (CLIENT_STATE.roundStep === 0) {
      CLIENT_STATE.roundStep = 1;
      const winAmount = computeWinAmount(
        data.roundState.rounds[0].winFactor,
        data.bet,
      );
      CLIENT_STATE.winsum = winAmount;
    }

    assert(data.roundState.rounds[0].freespinsAmount !== undefined);
    CLIENT_STATE.freespinsLeft =
      data.roundState.rounds[0].freespinsAmount - (CLIENT_STATE.roundStep - 1);
    let sumOfPreviousRoundWins = 0;
    for (let i = 0; i <= CLIENT_STATE.roundStep - 1; i++) {
      sumOfPreviousRoundWins += computeWinAmount(
        data.roundState.rounds[i].winFactor,
        data.bet,
      );
    }
    // if maxWinFactor has been reached, the sumofPreviousRoundWins can be larger than the max possible win
    const winAmount = Math.min(
      sumOfPreviousRoundWins,
      computeWinAmount(data.roundState.winFactor, data.bet),
    );
    GAMEFW.updateWins(winAmount);

    const round = data.roundState.rounds[CLIENT_STATE.roundStep];
    this.resetHand(data.roundState.rounds[0], round);
    GAME.paytable.updateContent(
      GameConfig.gameConfig.freespin.minSelections,
      true,
    );

    await GAME.freespinTransition.enter();
    await GAME.dragonPanel.freespinsStart();

    await wait(500);
    await GAME.dragonPanel.activateBonus(false);

    CORE.fx.trigger('music_freespin_game');

    return Promise.resolve();
  }

  private recoverFreespinExit(data: StateMachineRoundData): void {
    assert(data.roundState.rounds !== undefined);
    if (data.roundState.rounds !== undefined) {
      this.resetHand(data.roundState.rounds[0], undefined);
    }
    const winAmount = computeWinAmount(
      data.roundState.rounds[CLIENT_STATE.roundStep].winFactor,
      data.bet,
    );
    CLIENT_STATE.winsum += winAmount;
    GAME.paytable.updateContent(GAME.cards.getHandSize(), false);
  }

  private async recoverEndRound(data: StateMachineRoundData): Promise<void> {
    assert(data.roundState.rounds !== undefined);

    const round = data.roundState.rounds[CLIENT_STATE.roundStep];

    this.resetHand(data.roundState.rounds[0], undefined);
    GAME.paytable.refreshWintable();
    GAME.dragonPanel.randomize(round, false, false);

    CLIENT_STATE.winsum = 0;
    CLIENT_STATE.freespinsLeft = round.freespinsAmount ?? 0;

    GAMEFW.updateWins(CLIENT_STATE.winsum);

    CORE.fx.trigger('music_game_spinning');

    await GAME.cards.doRound(round, false);

    return Promise.resolve();
  }
}
