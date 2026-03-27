import {ChipType} from '../chips';
import {GameConfig} from '../config/config';
import {CORE, GAME} from '../game';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import {getWinIndex} from '../util/utils-game';
import {showSuperRoundText} from '../util/utils-gfx';
import {EndRound} from './end-round';
// import {GambleRound} from './gamble-round';
import {Spinning} from './spinning';
import {assert} from '../util/assert';
import {GAMEFW} from '../framework';
import {computeWinCents} from '../util/win-amount';

export class ReadyRecovery extends State<StateMachineRoundData> {
  public async run(data: StateMachineRoundData): Promise<AnyState> {
    GAME.nodeStorage.baseGame.nodes.root.visible = true;
    GAME.nodeStorage.uiCommon.nodes.root.visible = true;

    GAME.paytable.setSuperround(data.round.roundMultiplier);
    GAME.paytable.updateWinsums(data.bet);

    if (data.round.win !== undefined) {
      GAME.paytable.hiliteWins(getWinIndex(data.round.win));
    }

    // if (data.round.gambleResult) {
    //   await this.recoverGambleGame(data);
    //   return new GambleRound(data);
    // } else 
    if (data.round.result) {
      return this.recoverEndRound(data);
    } else {
      return this.recoverBaseGame(data);
    }
  }

  // private async recoverGambleGame(data: StateMachineRoundData): Promise<void> {
  //   // assert(data.round.gambleSelectableOptions !== undefined);
  //   // assert(data.round.gambleResult !== undefined);

  //   GAMEFW.updateWins(computeWinCents(data.round.gambleResult.stake, data.bet));

  //   const {gamble} = GameConfig.gameConfig;

  //   for (const s of gamble.selections) {
  //     if (data.round.canGamble) {
  //       GAME.gambleButtons.showButton(false, s.type);
  //       GAME.gambleButtons.setStake(s.type, data.round.gambleResult.stake);
  //     }
  //   }

  //   GAME.gambleButtons.highlightPick(
  //     gamble.selections.map((e) => e.type),
  //     data.round.gambleResult.selection
  //   );

  //   if (CLIENT_STATE.bonusWon) {
  //     GAME.chips.playAnimation(ChipType.LEFT, 1);
  //     GAME.chips.playAnimation(ChipType.RIGHT1, 1);
  //     GAME.chips.playAnimation(ChipType.RIGHT2, 1);

  //     GAME.superBack.hilite(0.0, 1.0, 0.5);
  //     GAME.superBack.setVisible(true);
  //   }

  //   GAME.gambleButtons.updateMultipliers(CLIENT_STATE.bonusWon);

  //   GAME.cards.setDblCard();

  //   return Promise.resolve();
  // }

  private recoverBaseGame(data: StateMachineRoundData): AnyState {
    if (CLIENT_STATE.bonusWon) {
      CORE.fx.trigger('fx_super_start');
      GAME.chips.playAnimation(ChipType.LEFT, 1);
      GAME.chips.playAnimation(ChipType.RIGHT1, 1);
      GAME.chips.playAnimation(ChipType.RIGHT2, 1);

      showSuperRoundText();

      GAME.superBack.hilite(0.0, 1.0, 0.5);
      GAME.superBack.setVisible(true);
    }

    // GAME.gambleButtons.updateMultipliers(CLIENT_STATE.bonusWon);

    GAME.cards.dealCards();

    return new Spinning(data);
  }

  private recoverEndRound(data: StateMachineRoundData): AnyState {
    assert(data.round.result !== undefined);

    GAMEFW.updateWins(computeWinCents(data));

    if (CLIENT_STATE.bonusWon) {
      GAME.chips.playAnimation(ChipType.LEFT, 1);
      GAME.chips.playAnimation(ChipType.RIGHT1, 1);
      GAME.chips.playAnimation(ChipType.RIGHT2, 1);

      showSuperRoundText();

      GAME.superBack.hilite(0.0, 1.0, 0.5);
      GAME.superBack.setVisible(true);
    }

    // GAME.gambleButtons.updateMultipliers(CLIENT_STATE.bonusWon);

    GAME.cards.setCards(
      data.round.result.map((e) => ({
        rank: e.rank,
        suit: e.suit,
        isJoker: e.isJoker,
      }))
    );

    return new EndRound(data);
  }
}
