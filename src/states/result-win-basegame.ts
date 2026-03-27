import {CORE, GAME} from '../game';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import { getWinningCards, showWin} from '../util/utils-game';
// import {GambleQuery} from './gamble-query';
import {computeWinCents} from '../util/win-amount';
import {SettleBet} from './settlebet';
import {GAMEFW} from '../framework';

export class ResultWinBasegame extends State<StateMachineRoundData> {
  public async run(data: StateMachineRoundData): Promise<AnyState> {
    const roundState = data.round;

    if (
      // roundState.win !== undefined &&
      // roundState.result !== undefined &&
      data.bet > 0
    ) {
      // const winIndex = getWinIndex(roundState.win);
      // const winningCards = getWinningCards(
        // roundState.result.map((e) => ({
        //   rank: e.rank,
        //   suit: e.suit,
        // })),
        // roundState.win.winningCards.map((e) => ({
        //   rank: e.rank,
        //   suit: e.suit,
        // }))
     
      // );

      if (CLIENT_STATE.sorted) {
        // 0, 1, 4, 7, ? ----- ? = 2, 3, 5, 6
        // if (!winningCards.includes(0)) {
        //   GAME.cards.dimCard(0);
        // }
        // if (!winningCards.includes(1)) {
        //   GAME.cards.dimCard(1);
        // }
        // if (!winningCards.includes(2)) {
        //   GAME.cards.dimCard(4);
        // }
        // if (!winningCards.includes(3)) {
        //   GAME.cards.dimCard(7);
        // }
        // if (!winningCards.includes(4)) {
        //   GAME.cards.dimCard(2);
        //   GAME.cards.dimCard(3);
        //   GAME.cards.dimCard(5);
        //   GAME.cards.dimCard(6);
        // }
        //sorted = false;
      } else {
        // if (!winningCards.includes(0)) {
        //   GAME.cards.dimCard(0);
        // }
        // if (!winningCards.includes(1)) {
        //   GAME.cards.dimCard(1);
        // }
        // if (!winningCards.includes(2)) {
        //   GAME.cards.dimCard(4);
        //   GAME.cards.dimCard(7);
        // }
        // if (!winningCards.includes(3)) {
        //   GAME.cards.dimCard(3);
        //   GAME.cards.dimCard(6);
        // }
        // if (!winningCards.includes(4)) {
        //   GAME.cards.dimCard(2);
        //   GAME.cards.dimCard(5);
        // }
      }

      CORE.fx.trigger('fx_super_end');
      // GAME.paytable.hiliteWins(winIndex);

      CORE.fx.trigger('fx_win_sound');

      // const enableBigWin = data.round.win
      //   ? data.round.win.hand === 'WILD_HAND'
      //   : false;
      const enableBigWin = false;

      const winPromise = showWin(computeWinCents(data), enableBigWin);

      if (enableBigWin || CLIENT_STATE.replay) {
        await winPromise;
      }
    }

    // if (GAMEFW.settings().game.gamble) return new GambleQuery(data);
    return new SettleBet(false);
  }
}
