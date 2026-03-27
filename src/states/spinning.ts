import {ChipType} from '../chips';
import {CORE, GAME} from '../game';

import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import {cardToIndex, hasJoker, isSwappable} from '../util/utils-game';
import {showSuperRoundText} from '../util/utils-gfx';
import {FourOfAKind} from './four-of-a-kind';
import {PickADeck} from './pick-a-deck';
import {assert} from '../util/assert';

export class Spinning extends State<StateMachineRoundData> {
  public async run(data: StateMachineRoundData): Promise<AnyState> {
    CLIENT_STATE.bet = data.bet;
    CLIENT_STATE.bonusWon = data.round.bonusWon;

    // assert(
    //   (data.round.bonusWon  && !data.round.bonusWon) ||
    //     (data.round.bonusWon&& data.round.bonusWon),
    //   `mismatch in bonus ${data.round.bonusWon},
    // ${data.round.bonusWon}`
    // );

    // GAME.paytable.setSuperround(data.round.roundMultiplier);
    // GAME.paytable.updateWinsums(data.bet);

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

    // const cards = [...data.round.hand, ...data.round.flop].map((e) => ({
    //   rank: e.rank,
    //   suit: e.suit,
    // }));

    // const cardIndices = cards.map((e) => cardToIndex(e.rank, e.suit));

    // const fourOfAKind = data.round.hand.length === 4;
    // const swappable = isSwappable(cards);
    // assert(
    //   !data.round.allowSwap || swappable === data.round.allowSwap,
    //   `mismatch in swap, ${swappable} != ${data.round.allowSwap}`
    // );

    // await GAME.cards.revealCards(cardIndices);
    // if (fourOfAKind) {
    //   if (hasJoker(cards)) {
    //     await GAME.cards.showJokerAnims();
    //   }

    //   CLIENT_STATE.sorted = true;
    //   await GAME.cards.arrangeFourOfAKindCards();
    // } else if (swappable) {
    //   await GAME.cards.swapCards();

    //   if (hasJoker(cards)) {
    //     await GAME.cards.showJokerAnims();
    //   }

    //   CLIENT_STATE.swap = true;
    // } else {
    //   if (hasJoker(cards)) {
    //     await GAME.cards.showJokerAnims();
    //   }
    // }

    // return fourOfAKind ? new FourOfAKind(data) : new PickADeck(data);
    return new PickADeck(data);
  }
}
