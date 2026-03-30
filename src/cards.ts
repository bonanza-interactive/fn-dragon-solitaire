import {gfx} from '@apila/engine';
import {anim} from '@apila/game-libraries';
import {Card} from './card';
import {
  CardLocation,
  CardMovement,
  CardName,
  debugConfig,
} from './config/config';
import {GameLayer} from './config/schemas';
import {CORE} from './game';
import {getCardNodeName} from './util/utils';
import {cardToIndex, rankToIndex} from './util/utils-game';
import {getNode} from './util/utils-node';
import {assert} from './util/assert';
import {Timeline} from '@apila/game-libraries/dist/game-animation';

const CARD_ANIMS = 8;
const delay = 0.07;
const CARD_BACK = 52;

export enum CardsState {
  None = 'None',
  Dealing = 'Dealing',
  Dealt = 'Dealt',
  Selected = 'Selected',
  Collecting = 'Collecting',
}

type CardRenderOrderState = 'default' | 'swap';

const CardRenderOrder: Record<CardRenderOrderState, number[]> = {
  default: [0, 1, 2, 3, 4, 5, 6, 7],
  swap: [2, 3, 5, 6, 0, 1, 4, 7],
};

export class Cards {
  private _timeScale = 1;
  private root: gfx.Empty;
  private cards: Card[] = [];
  private cardsState = CardsState.None;

  private askedToDeal = false;
  private askedToReveal = false;
  private cardIndices: number[] = [];
  private askedToFlipDeck = false;
  private playerSelectedRight = false;
  private cardIndexLeft = -1;
  private cardIndexRight = -1;
  private askedToFlipCard = false;
  private playerSelectedCard = -1;
  private cardIndex = -1;

  private revealPromise?: () => void;
  private flipPromise?: () => void;
  private timeline = new anim.Timeline();
  private openCards: {rank: string; suit: string; isJoker: boolean}[][] = [];

  constructor(root: gfx.Empty) {
    this.root = root;
    for (let i = 0; i < CARD_ANIMS; i++) {
      this.cards.push(new Card(this.root, this.timeline));
      this.cards[i].text.text = `{ffff00}${i}`;
      this.cards[i].text.visible = false;
    }
    this.setCardRenderOrder('default');
  }

  set timeScale(n: number) {
    this._timeScale = n;
    for (const card of this.cards) {
      card.timeScale = n;
    }
  }

  public resetCards(): void {
    for (let i = 0; i < this.cards.length; i++) {
      this.cards[i].reset();
      this.cards[i].visible = false;
    }
  }

  public setCards(
    result: {rank: string; suit: string; isJoker: boolean}[]
  ): void {
    const cardOrder = [
      0,
      1,
      ...(this.playerSelectedRight ? [7, 6, 5] : [4, 3, 2]),
    ];

    for (let j = 0; j < result.length; j++) {
      const i = cardOrder[j];

      this.cards[i].visible = true;
      if (result[j].isJoker) {
        this.cards[i].cardIndex =
          53 + Math.floor(rankToIndex(result[j].rank) / 13);
      } else {
        this.cards[i].cardIndex = cardToIndex(result[j].rank, result[j].suit);
      }
      this.cards[i].reset();
      //todo: better naming than i and j
      this.cards[i].parent = this.getCardNode(CardName.Hand, j);
    }
  }

  public setDblCard(): void {
    this.cards[4].reset();
    this.cards[4].visible = true;
    this.cards[4].cardIndex = CARD_BACK;
    this.cards[4].parent = this.getCardNode(CardName.GambleHand);
  }

  public dealCards(): void {
    this.askedToDeal = true;
  }

  public setOpenCards(data: typeof this.openCards): void {
  this.openCards = data;
  }
   
  private async dealCardsInternal(): Promise<void> {
    this.cardsState = CardsState.Dealing;
    CORE.fx.trigger('fx_deal_cards');

    for (let i = 0; i < this.cards.length; i++) {
      this.cards[i].reset();
      this.cards[i].visible = false;
    }

    const anims: Promise<void>[] = [];

    for (let stackIndex = 0; stackIndex < this.openCards.length; stackIndex++) {
     const stack = this.openCards[stackIndex];
     if (!stack || stack.length === 0) continue;
     const topCard = stack[stack.length - 1];
      const card = this.cards[stackIndex]; 
      const start = {name: CardName.Deck};
      const target = {name: CardName.Stack, index: stackIndex}; 
      const durationSeconds = 0.3;
      const delaySeconds = stackIndex * delay;
      if (topCard.isJoker) {
      card.cardIndex =
        53 + Math.floor(rankToIndex(topCard.rank) / 13);
      } else {
      card.cardIndex = cardToIndex(topCard.rank, topCard.suit);
      }
      card.visible = true;
      anims.push(card.move(durationSeconds, delaySeconds, start, target));
    }
    await Promise.all(anims);
    this.cardsState = CardsState.Dealt;
  }

  public async revealCards(cardIndices: number[]): Promise<void> {
    this.askedToReveal = true;
    this.cardIndices = cardIndices;

    return new Promise((resolve) => {
      this.revealPromise = resolve;
    });
  }

  private revealCardsInternal(): void {
    CORE.fx.trigger('fx_reveal_cards');

    const flipTime = 0.3;

    this.cards[0].flip(CARD_BACK, this.cardIndices[0], 0.0, flipTime);
    this.cards[1].flip(CARD_BACK, this.cardIndices[1], 0.1, flipTime);
    this.cards[4].flip(CARD_BACK, this.cardIndices[2], 0.2, flipTime);
    const last = this.cards[7].flip(
      CARD_BACK,
      this.cardIndices[3],
      0.3,
      flipTime
    );

    last.after(() => {
      assert(this.revealPromise !== undefined);
      this.revealPromise();
      this.revealPromise = undefined;
    });
  }

  public async collectCards(): Promise<void> {
    this.cardsState = CardsState.Collecting;

    let cardCount = 0;
    const anims: Promise<void>[] = [];

    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i].visible) {
        cardCount++;
      }
      this.cards[i].reset();
      this.cards[i].cardIndex = CARD_BACK;
    }
    // dbl card
    if (cardCount === 1) {
      CORE.fx.trigger('fx_collect_cards');
      const start = {name: CardName.GambleHand};
      const target = {name: CardName.GambleDiscard};
      anims.push(this.cards[4].discard(0.2, 0, start, target));
    } else if (cardCount === 5) {
      CORE.fx.trigger('fx_collect_cards');

      const moves: CardMovement[] = [
        {
          start: {name: CardName.Hand, index: 0},
          target: {name: CardName.Discard, index: 0},
        },
        {
          start: {name: CardName.Hand, index: 1},
          target: {name: CardName.Discard, index: 1},
        },
        {
          start: {name: CardName.Hand, index: 2},
          target: {name: CardName.Discard, index: 2},
        },
        {
          start: {name: CardName.Hand, index: 3},
          target: {name: CardName.Discard, index: 3},
        },
        {
          start: {name: CardName.Hand, index: 4},
          target: {name: CardName.Discard, index: 4},
        },
        {
          start: {name: CardName.Hand, index: 2},
          target: {name: CardName.Discard, index: 2},
        },
        {
          start: {name: CardName.Hand, index: 3},
          target: {name: CardName.Discard, index: 3},
        },
        {
          start: {name: CardName.Hand, index: 4},
          target: {name: CardName.Discard, index: 4},
        },
      ];

      let delay = 0.0;
      for (let i = 0, index = 0; i < this.cards.length; i++) {
        const card = this.cards[i];
        if (card.visible) {
          const {start, target} = moves[index];
          card.parent = this.getCardNode(start.name, start.index);

          anims.push(card.discard(0.2, delay, start, target));

          delay += 0.1;
          index++;
        }
      }
    }

    await Promise.all(anims);
    this.cardsState = CardsState.None;
  }

  public async selectCard(pick: number): Promise<void> {
    const anims: Promise<void>[] = [];

    // hand: 0,1,4,7
    // pick: 2,3,5,6
    const picks = [
      [2, 0.4, 0.1],
      [3, 0.3, 0.1],
      [5, 0.1, 0.1],
      [6, 0.2, 0.1],
    ];
    const selectedPick = picks[pick];

    const moves: CardMovement[] = [
      {
        start: {name: CardName.FourOfAKindReserve, index: 0},
        target: {name: CardName.Hand, index: 0},
      },
      {
        start: {name: CardName.FourOfAKindReserve, index: 1},
        target: {name: CardName.Hand, index: 1},
      },
      {
        start: {name: CardName.FourOfAKindHand, index: 0},
        target: {name: CardName.FourOfAKindDiscard, index: 0},
      },
      {
        start: {name: CardName.FourOfAKindHand, index: 1},
        target: {name: CardName.FourOfAKindDiscard, index: 1},
      },
      {
        start: {name: CardName.FourOfAKindReserve, index: 2},
        target: {name: CardName.Hand, index: 2},
      },
      {
        start: {name: CardName.FourOfAKindHand, index: 3},
        target: {name: CardName.FourOfAKindDiscard, index: 3},
      },
      {
        start: {name: CardName.FourOfAKindHand, index: 2},
        target: {name: CardName.FourOfAKindDiscard, index: 2},
      },
      {
        start: {name: CardName.FourOfAKindReserve, index: 3},
        target: {name: CardName.Hand, index: 3},
      },
    ];

    for (const pick of picks) {
      if (pick !== selectedPick) {
        const i = pick[0];
        const {start, target} = moves[i];

        anims.push(this.cards[i].discard(0.1, 0, start, target));
      }
    }

    const selected = selectedPick[0];
    const time = selectedPick[1];
    const delay = selectedPick[2];
    const start = moves[selected].start;
    const target = {name: CardName.Hand, index: 4};

    anims.push(this.cards[selected].move(time, delay, start, target));

    const reveals = [
      [0, 0, 0.1, 0.4],
      [1, 1, 0.2, 0.3],
      [4, 4, 0.3, 0.2],
      [7, 3, 0.4, 0.1],
    ];

    for (const reveal of reveals) {
      const i = reveal[0];
      const time = reveal[2];
      const delay = reveal[3] + 0.1 * (3 - pick);
      const {start, target} = moves[i];

      anims.push(this.cards[i].move(time, delay, start, target));
    }

    await Promise.all(anims);
    this.cardsState = CardsState.Selected;
  }

  public async selectCards(selectRight: boolean) {
    const animateCards = selectRight ? [5, 6, 7] : [2, 3, 4];
    const clearCards = selectRight ? [2, 3, 4] : [5, 6, 7];

    const clearCardAnims: Promise<void>[] = [];

    if (debugConfig.collectSoundOnReveal) {
      CORE.fx.trigger('fx_collect_cards');
    }

    const clearedStackMoves: Record<number, CardMovement> = {
      2: {
        start: {name: CardName.StackLeft, index: 0},
        target: {name: CardName.StackLeftDiscard},
      },
      3: {
        start: {name: CardName.StackLeft, index: 1},
        target: {name: CardName.StackLeftDiscard},
      },
      4: {
        start: {name: CardName.StackLeft, index: 2},
        target: {name: CardName.StackLeftDiscard},
      },
      5: {
        start: {name: CardName.StackRight, index: 0},
        target: {name: CardName.StackRightDiscard},
      },
      6: {
        start: {name: CardName.StackRight, index: 1},
        target: {name: CardName.StackRightDiscard},
      },
      7: {
        start: {name: CardName.StackRight, index: 2},
        target: {name: CardName.StackRightDiscard},
      },
    };

    let time = 0;
    for (const i of clearCards.reverse()) {
      this.cards[i].cardIndex = CARD_BACK;
      const {start, target} = clearedStackMoves[i];

      clearCardAnims.push(
        this.cards[i].discard(0.1, 0.07 * time, start, target)
      );
      time++;
    }
    await Promise.all(clearCardAnims);
    CORE.fx.triggerDelayed('fx_select_cards', 0.3);

    time = 0;

    const selectedStackMoves: Record<number, CardMovement> = {
      2: {
        start: {name: CardName.StackLeft, index: 0},
        target: {name: CardName.Hand, index: 4},
      },
      3: {
        start: {name: CardName.StackLeft, index: 1},
        target: {name: CardName.Hand, index: 3},
      },
      4: {
        start: {name: CardName.StackLeft, index: 2},
        target: {name: CardName.Hand, index: 2},
      },
      5: {
        start: {name: CardName.StackRight, index: 0},
        target: {name: CardName.Hand, index: 4},
      },
      6: {
        start: {name: CardName.StackRight, index: 1},
        target: {name: CardName.Hand, index: 3},
      },
      7: {
        start: {name: CardName.StackRight, index: 2},
        target: {name: CardName.Hand, index: 2},
      },
    };

    const anims: Promise<void>[] = [];
    for (const i of animateCards) {
      const {start, target} = selectedStackMoves[i];
      anims.push(this.cards[i].move(0.1, 0.1 * time, start, target));
      time++;
    }

    await Promise.all(anims);
    this.cardsState = CardsState.Selected;
  }

  public async flipCard(
    chosenCard: number,
    card: {rank: string; suit: string; isJoker: boolean}
  ): Promise<void> {
    this.askedToFlipCard = true;

    this.playerSelectedCard = chosenCard;
    this.cardIndex = cardToIndex(card.rank, card.suit);

    if (card.isJoker) {
      this.cardIndex = 53 + Math.floor(this.cardIndex / 13);
    }

    return new Promise((resolve) => {
      this.flipPromise = resolve;
    });
  }

  private flipCardInternal(): void {
    if (this.playerSelectedCard === 0) {
      this.cards[2].flip(CARD_BACK, this.cardIndex, 0.0, 0.3);
    }
    if (this.playerSelectedCard === 1) {
      this.cards[3].flip(CARD_BACK, this.cardIndex, 0.0, 0.3);
    }
    if (this.playerSelectedCard === 2) {
      this.cards[5].flip(CARD_BACK, this.cardIndex, 0.0, 0.3);
    }
    if (this.playerSelectedCard === 3) {
      this.cards[6].flip(CARD_BACK, this.cardIndex, 0.0, 0.3);
    }

    runWaitAnimation(this.timeline, 0.3).then(() => {
      assert(this.flipPromise !== undefined);
      this.flipPromise();
      this.flipPromise = undefined;
    });
  }

  public async flipCards(
    selectRight: boolean,
    cardLeft: {rank: string; suit: string; isJoker: boolean},
    cardRight: {rank: string; suit: string; isJoker: boolean}
  ): Promise<void> {
    this.askedToFlipDeck = true;

    this.playerSelectedRight = selectRight;
    this.cardIndexLeft = cardToIndex(cardLeft.rank, cardLeft.suit);
    this.cardIndexRight = cardToIndex(cardRight.rank, cardRight.suit);

    if (cardLeft.isJoker) {
      this.cardIndexLeft = 53 + Math.floor(this.cardIndexLeft / 13);
    }
    if (cardRight.isJoker) {
      this.cardIndexRight = 53 + Math.floor(this.cardIndexRight / 13);
    }

    return new Promise((resolve) => {
      this.flipPromise = resolve;
    });
  }

  private flipCardsInternal(): void {
    if (this.playerSelectedRight) {
      this.cards[6].flip(CARD_BACK, this.cardIndexLeft, 0.0, 0.3);
      this.cards[5].flip(CARD_BACK, this.cardIndexRight, 0.1, 0.3);
    } else {
      this.cards[3].flip(CARD_BACK, this.cardIndexLeft, 0.0, 0.3);
      this.cards[2].flip(CARD_BACK, this.cardIndexRight, 0.1, 0.3);
    }

    runWaitAnimation(this.timeline, 0.4).then(() => {
      assert(this.flipPromise !== undefined);
      this.flipPromise();
      this.flipPromise = undefined;
    });
  }

  public async arrangeFourOfAKindCards(): Promise<void> {
    let delay = 0.0;
    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i].cardIndex;
      if (card >= 0 && card < 52 && card % 13 === 1) {
        delay = 0.7;
        break;
      }
    }

    const moves: CardMovement[] = [
      {
        start: {name: CardName.Hand, index: 0},
        target: {name: CardName.FourOfAKindReserve, index: 0},
      },
      {
        start: {name: CardName.Hand, index: 1},
        target: {name: CardName.FourOfAKindReserve, index: 1},
      },
      {
        start: {name: CardName.StackLeft, index: 0},
        target: {name: CardName.FourOfAKindHand, index: 0},
      },
      {
        start: {name: CardName.StackLeft, index: 1},
        target: {name: CardName.FourOfAKindHand, index: 1},
      },
      {
        start: {name: CardName.StackLeft, index: 2},
        target: {name: CardName.FourOfAKindReserve, index: 2},
      },
      {
        start: {name: CardName.StackRight, index: 0},
        target: {name: CardName.FourOfAKindHand, index: 3},
      },
      {
        start: {name: CardName.StackRight, index: 1},
        target: {name: CardName.FourOfAKindHand, index: 2},
      },
      {
        start: {name: CardName.StackRight, index: 2},
        target: {name: CardName.FourOfAKindReserve, index: 3},
      },
    ];

    const anims: Promise<void>[] = [];

    let time = 0;
    for (const i of [0, 1, 4, 7]) {
      const {start, target} = moves[i];
      anims.push(this.cards[i].move(0.1 + 0.1 * time, delay, start, target));

      time++;
    }

    time = 4;

    for (const i of [2, 3, 5, 6]) {
      const {start, target} = moves[i];
      anims.push(this.cards[i].move(0.1, 0.1 * time + delay, start, target));

      time++;
    }

    CORE.fx.triggerDelayed('fx_sort_swap', delay);
    await Promise.all(anims);
  }

  public async swapCards(): Promise<void> {
    CORE.fx.trigger('fx_sort_swap');
    const swapTime = 0.3;
    const anims: Promise<void>[] = [];

    this.setCardRenderOrder('swap');

    const swapPairs = [
      [0, 4, -150],
      [1, 7, -150],
      [4, 0, 150],
      [7, 1, 150],
    ];

    const swapMoves: Record<number, CardMovement> = {
      0: {
        start: {name: CardName.Hand, index: 0},
        target: {name: CardName.StackLeft, index: 2},
      },
      1: {
        start: {name: CardName.Hand, index: 1},
        target: {name: CardName.StackRight, index: 2},
      },
      4: {
        start: {name: CardName.StackLeft, index: 2},
        target: {name: CardName.Hand, index: 0},
      },
      7: {
        start: {name: CardName.StackRight, index: 2},
        target: {name: CardName.Hand, index: 1},
      },
    };

    for (const swapPair of swapPairs) {
      const from = swapPair[0];
      const arc = swapPair[2];
      const {start, target} = swapMoves[from];

      anims.push(this.cards[from].arcMove(arc, swapTime, 0, start, target));
    }

    await Promise.all(anims);

    // swap card
    const temp0 = this.cards[0].cardIndex;
    this.cards[0].cardIndex = this.cards[4].cardIndex;
    this.cards[4].cardIndex = temp0;
    const temp1 = this.cards[1].cardIndex;
    this.cards[1].cardIndex = this.cards[7].cardIndex;
    this.cards[7].cardIndex = temp1;

    this.cards[0].parent = this.getCardNode(CardName.Hand, 0);
    this.cards[1].parent = this.getCardNode(CardName.Hand, 1);
    this.cards[4].parent = this.getCardNode(CardName.StackLeft, 2);
    this.cards[7].parent = this.getCardNode(CardName.StackRight, 2);

    this.setCardRenderOrder('default');
  }

  public async dealDblCard(): Promise<void> {
    const anims: Promise<void>[] = [];

    for (let i = 0; i < this.cards.length; i++) {
      this.cards[i].reset();
      this.cards[i].visible = false;
      this.cards[i].cardIndex = CARD_BACK;
    }

    const start = {name: CardName.Deck};
    const target = {name: CardName.GambleHand};
    anims.push(this.cards[4].move(0.3, 0.0, start, target));

    await Promise.all(anims);
  }

  public async revealDblCard(cardIndex: number): Promise<void> {
    const delay = 0.1;
    const flipTime = 0.3;
    const flipDelay = 0.1;
    this.cards[4].flip(CARD_BACK, cardIndex, delay, flipTime, flipDelay);

    await runWaitAnimation(this.timeline, delay + flipTime + flipDelay);
  }

  private setCardRenderOrder(state: CardRenderOrderState) {
    const cardRenderOrder = CardRenderOrder[state];

    for (let i = 0; i < this.cards.length; ++i) {
      this.cards[i].depthGroup =
        GameLayer.Cards + cardRenderOrder.findIndex((v) => v === i);
    }
  }

  public async showJokerAnims(): Promise<void> {
    const anims: Promise<void>[] = [];
    for (let i = 0; i < this.cards.length; i++) {
      anims.push(this.cards[i].showJokerAnim());
    }
    await Promise.all(anims);
  }

  public cardSelectionNode(card: 'left' | 'right'): gfx.NodeProperties {
    if (card === 'left') {
      return this.cards[4].node;
    }
    return this.cards[7].node;
  }

  public cardSelectionNodesFourOfAKind(): gfx.NodeProperties[] {
    return [
      this.cards[2].node,
      this.cards[3].node,
      this.cards[5].node,
      this.cards[6].node,
    ];
  }

  public cardHilite(card: 'left' | 'right' | 'deck'): void {
    if (card === 'left') {
      this.cards[4].glow = true;
    } else if (card === 'right') {
      this.cards[7].glow = true;
    } else if (card === 'deck') {
      for (const i of [2, 3, 5, 6]) this.cards[i].glow = true;
    }
  }

  public disableCardHilites(): void {
    for (const c of this.cards) c.glow = false;
  }

  public dimCard(cardIndex: number): void {
    this.cards[cardIndex].dim();
  }

  public update(_delta: number): void {
    this.timeline.tick(_delta * this._timeScale);

    if (this.cardsState === CardsState.None && this.askedToDeal) {
      this.askedToDeal = false;
      this.dealCardsInternal();
    }
    if (this.cardsState === CardsState.Dealt && this.askedToReveal) {
      this.askedToReveal = false;
      this.revealCardsInternal();
    }
    if (this.cardsState === CardsState.Selected && this.askedToFlipDeck) {
      this.askedToFlipDeck = false;
      this.flipCardsInternal();
    }
    if (this.cardsState === CardsState.Selected && this.askedToFlipCard) {
      this.askedToFlipCard = false;
      this.flipCardInternal();
    }
  }

  private getCardNode(name: CardName, index?: number): gfx.Empty {
    const nodeName = getCardNodeName(name, index);
    return getNode(this.root, nodeName);
  }
}

export function runWaitAnimation(tl: Timeline, durationSec: number) {
  return new Promise<void>((res) => {
    tl.animate(
      () => 0,
      durationSec,
      () => {}
    ).after(res);
  });
}
