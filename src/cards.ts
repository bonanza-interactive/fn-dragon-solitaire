import {gfx, input} from '@apila/engine';
import {anim} from '@apila/game-libraries';
import {Card} from './card';
import {
  SOLITAIRE_DRAG_DEPTH_GROUP,
  type SolitaireDragLayoutSnapshot,
  type SolitairePickMove,
  filterKlondikeDragMoves,
  hitTestKlondikeDropTarget,
} from './cards-solitaire';
import {CardsInput} from './cards-input';
// import {Round} from './config/backend-types';
import {
  CARD_BACK,
  CARD_DRAGON,
  CardLocation,
  CardName,
  SOLITAIRE_CARD_OVERLAP_FACEDOWN,
  SOLITAIRE_CARD_OVERLAP_FACEUP,
  SOLITAIRE_SNAP_BACK_SECONDS,
  layoutConfig,
} from './config/config';
import {GameLayer} from './config/schemas';
import {CORE, GAME} from './game';
import {AUTO_TICK} from './main';
import {assert, getCardNodeName, voidPromise, wait} from './util/utils';
import {cardToIndex, indexToCard} from './util/utils-game';
import {getNode} from './util/utils-node';
import {GAMEFW, IS_MOBILE_DEVICE} from './framework';
import {setButtonState} from './button-state-handler';
import {getDealingTiming, getGambleTiming} from './config/timing';
import {RoundState} from './config/backend-types';

const SUIT_COUNT = 4;
const RANK_COUNT = 13;
const EXTRA_CARDS = 2; // dragoncard and backside
const HAND_INDEX = SUIT_COUNT * RANK_COUNT + EXTRA_CARDS;
const GAMBLE_COUNT = 5;

const RANK_OFFSET = 75;
const RANK_OFFSET_MOBILE = 90;
const SUIT_OFFSET = 200;
const SUIT_OFFSET_MOBILE = 200;
const HAND_OFFSET = 170;
const HAND_OFFSET_MOBILE = 200;
const GAMBLE_OFFSET = 200;
const TABLE_OFFSET = 80;
const TABLE_OFFSET_MOBILE = 105;

const SOLITAIRE_STOCK_LAYER_COUNT = 4;
const SOLITAIRE_STOCK_LAYER_OFFSET_X = -5;
const SOLITAIRE_STOCK_LAYER_OFFSET_Y = 3;
const SOLITAIRE_DROP_SECONDS = 0.16;
const SOLITAIRE_AUTOPLAY_STEP_SECONDS = 0.2;
const SOLITAIRE_STOCK_FLIP_SECONDS = 0.14;
const SOLITAIRE_ANIM_DEPTH_GROUP = SOLITAIRE_DRAG_DEPTH_GROUP + 50;
const SOLITAIRE_DOUBLE_CLICK_MS = 600;
const SOLITAIRE_CLICK_MOVE_TOLERANCE_PX = 14;
const SOLITAIRE_DRAG_START_THRESHOLD_PX = 8;
const SOLITAIRE_CARD_HALF_HEIGHT = 160;
const SOLITAIRE_MIN_DYNAMIC_OVERLAP = 16;
const SOLITAIRE_DROP_STACK_RATIO = 0.1;

const rankDelay = 0.02;
const suitDelay = rankDelay * RANK_COUNT * 0.2;

const deckPerspectiveBoneName = 'perspective_target';

export enum CardsState {
  None = 'None',
  Dealing = 'Dealing',
  Dealt = 'Dealt',
  Revealing = 'Revealing',
  Selecting = 'Selecting',
  Selected = 'Selected',
  Collecting = 'Collecting',
  GamblePick = 'GamblePick',
}

export enum ShuffleLocation {
  TableDeck,
  FirstCard,
}

enum ShuffleState {
  None,
  Shuffling,
  Ending,
}

const suitCardName: CardName[] = [
  CardName.StackSpades,
  CardName.StackClubs,
  CardName.StackDiamonds,
  CardName.StackHearts,
];

type ShuffleCard = {
  card: Card;
  randomOffset: number;
};

export class Cards {
  private readonly root: gfx.Empty;
  private readonly tableRoot: gfx.NodeProperties;
  private readonly deck: gfx.Spine;
  private readonly cards: Card[] = [];
  private readonly handNodes: gfx.Empty[] = [];
  private readonly tableNodes: gfx.Empty[] = [];
  private readonly gambleNodes: gfx.Empty[] = [];
  private readonly maxSelection;
  private readonly maxDrawCount;

  private tableCards: number[] = [];
  private handCards: number[] = [];
  private gambleCards: number[] = [];
  private basegameSelectedCards: number[] = [];
  private cardsState = CardsState.None;
  private shuffleCards: ShuffleCard[] = [];
  private shuffleState = ShuffleState.None;
  private shuffleAnim = 0;
  private gambleJiggleTimer = 0;

  private solitaireCardMap: Map<string, Card> = new Map();
  private currentPicks: SolitairePickMove[] = [];
  private solitaireRoundState: RoundState | null = null;
  private moveResolver?: (move: SolitairePickMove) => void;
  private solitaireListenerIds: number[] = [];
  private solitaireCanvasListenerId: number | undefined;

  private solitaireDrag?: {
    cards: Card[];
    grabOffsetWorld: [number, number];
    offsetFromPrimary: [number, number][];
    startParents: (gfx.Empty | null)[];
    startLocalPos: [number, number][];
    startWorldPos: [number, number][];
    startDepth: number[];
    from: string;
    count: number;
  };
  private solitaireSnapInProgress = false;
  private solitaireStockVisualCount = 0;
  private solitairePreAnimatedMove?: SolitairePickMove;
  private solitaireLastClick?: {
    mapKey: string;
    timeMs: number;
    canvasX: number;
    canvasY: number;
  };
  private solitairePendingPress?: {
    mapKey: string;
    cards: Card[];
    from: string;
    count: number;
    pressCanvasX: number;
    pressCanvasY: number;
  };

  private timeline = new anim.Timeline();
  private cardsInput = new CardsInput();
  private tempNumber = 5;

  constructor(root: gfx.Empty) {
    this.root = root;
    this.tableRoot = getNode(root, 'table_root');
    this.tableRoot.visible = false;
    this.maxSelection = Math.max(this.tempNumber, this.tempNumber);
    this.maxDrawCount = Math.max(this.tempNumber, this.tempNumber);

    const cardCount = Math.max(
      SUIT_COUNT * RANK_COUNT + EXTRA_CARDS + this.maxSelection,
      80,
    );
    for (let i = 0; i < cardCount; i++) {
      this.cards.push(
        new Card(this.root, this.timeline, (i + 1) % RANK_COUNT === 0),
      );
      this.cards[i].text.text = `{ffff00}${i}`;
      this.cards[i].text.visible = false;
    }

    const baseGameRoot = GAME.nodeStorage.baseGame.nodes.root;
    this.deck = getNode(baseGameRoot, 'deck_visual') as gfx.Spine;

    const tableDeck = this.getCardNode(CardName.TableDeck);
    tableDeck.scale = IS_MOBILE_DEVICE
      ? layoutConfig.cardScaleMobile
      : layoutConfig.cardScale;

    this.createCardNodes();

    AUTO_TICK.add(this.timeline);
  }

  private createCardNodes() {
    const baseGame = GAME.nodeStorage.baseGame;
    const cardRoot = getNode(baseGame.nodes.root, 'card_root');
    const selectionRoot = getNode(cardRoot, 'selection_root');
    const handRoot = getNode(cardRoot, 'hand_root');
    const gambleRoot = getNode(cardRoot, 'gamble_root');
    const rankOffset = IS_MOBILE_DEVICE ? RANK_OFFSET_MOBILE : RANK_OFFSET;
    const suitOffset = IS_MOBILE_DEVICE ? SUIT_OFFSET_MOBILE : SUIT_OFFSET;
    for (let suit = 0; suit < SUIT_COUNT; ++suit) {
      for (let rank = 0; rank < RANK_COUNT; ++rank) {
        const offset = [
          rank * rankOffset - (RANK_COUNT * 0.5 - 0.5) * rankOffset,
          suit * suitOffset - (SUIT_COUNT * 0.5 - 0.5) * suitOffset,
        ];
        CORE.gfx.createEmpty({
          name: getCardNodeName(suitCardName[suit], rank),
          parent: selectionRoot,
          position: [offset[0], offset[1]],
          scale: [0.6, 0.6],
        });
      }
    }
    for (let i = 0; i < this.maxSelection; ++i) {
      this.handNodes.push(
        CORE.gfx.createEmpty({
          name: getCardNodeName(CardName.Hand, i),
          parent: handRoot,
          scale: IS_MOBILE_DEVICE
            ? layoutConfig.handScaleMobile
            : layoutConfig.handScale,
        }),
      );
    }
    for (let i = 0; i < this.maxDrawCount; ++i) {
      this.tableNodes.push(
        CORE.gfx.createEmpty({
          name: getCardNodeName(CardName.Table, i),
          parent: this.tableRoot,
          scale: IS_MOBILE_DEVICE
            ? layoutConfig.cardScaleMobile
            : layoutConfig.cardScale,
        }),
      );
    }
    for (let i = 0; i < GAMBLE_COUNT; ++i) {
      const offsetX =
        i * GAMBLE_OFFSET - (GAMBLE_COUNT * 0.5 - 0.5) * GAMBLE_OFFSET;
      this.gambleNodes.push(
        CORE.gfx.createEmpty({
          name: getCardNodeName(CardName.Gamble, i),
          parent: gambleRoot,
          scale: layoutConfig.gambleCardScale,
          position: [offsetX, 0.0],
        }),
      );
    }
  }

  private updateCardHandPositions(selectedCount: number) {
    const handOffset = IS_MOBILE_DEVICE ? HAND_OFFSET_MOBILE : HAND_OFFSET;
    for (let i = 0; i < selectedCount && i < this.handNodes.length; ++i) {
      const offsetX = i * handOffset - (selectedCount * 0.5 - 0.5) * handOffset;
      this.handNodes[i].position = [offsetX, 0.0];
    }
  }

  private updateCardTablePositions(tableSize: number) {
    const tableOffset = IS_MOBILE_DEVICE ? TABLE_OFFSET_MOBILE : TABLE_OFFSET;
    for (let i = 0; i < tableSize && i < this.maxDrawCount; ++i) {
      const offsetX = i * tableOffset - (tableSize * 0.5 - 0.5) * tableOffset;
      this.tableNodes[i].position = [offsetX, 0.0];
    }
  }

  public recoverBasegameSelectedCards(selected: number[]): void {
    this.basegameSelectedCards = selected;
  }

  public getBasegameSelectedCards(): number[] {
    return this.basegameSelectedCards;
  }

  public stopEffects(): void {
    for (let i = 0; i < this.cards.length; i++) {
      this.cards[i].glow = false;
      this.cards[i].setWinParticle(false, -1, -1, false);
    }
  }

  public killEffects(): void {
    for (let i = 0; i < this.cards.length; i++) {
      this.cards[i].killEffects();
    }
  }

  public resetCards(isResetHand = true): void {
    const count = isResetHand
      ? this.cards.length
      : this.cards.length - this.maxSelection;
    for (let i = 0; i < count; i++) {
      this.cards[i].reset();
      this.cards[i].visible = false;
      this.cards[i].node.position = [0.0, 0.0];
      this.cards[i].setWinParticle(false, -1, -1, false);
    }
    this.shuffleState = ShuffleState.None;
  }

  public isCardSelectionMode(): boolean {
    return this.cardsState === CardsState.Selecting;
  }

  public async startCardSelection(isFreespins = false): Promise<void> {
    this.cardsState = CardsState.Selecting;

    if (!isFreespins) {
      const anims: Promise<void>[] = [];
      anims.push(GAME.cards.discardTable());
      anims.push(GAME.cards.discardHand());
      await Promise.all(anims);
    }

    for (let i = 0; i < this.cards.length - this.maxSelection; i++) {
      this.cards[i].dim();
    }
    await this.dealCardsToChooseFrom();

    // const selectionCards = this.cards.slice(0, HAND_INDEX - EXTRA_CARDS);
    // this.cardsInput.startSelection(selectionCards, isFreespins);
  }

  public async selectCards(
    selectedCards: number[],
    isFreeSpin?: boolean,
  ): Promise<void> {
    this.cardsInput.disableInput();
    const selectedCount = selectedCards.length;
    if (selectedCount < this.tempNumber) {
      return;
    }
    const minSelection = this.tempNumber;
    const include: number[] = selectedCount < minSelection ? selectedCards : [];
    const selected = isFreeSpin
      ? selectedCards
      : this.getBasegameSelectedCards().concat(selectedCards);
    await this.cardsInput.swapSelected(this.cards, selected, include.length);
    GAME.paytable.updateContent(selectedCount, isFreeSpin || false);
  }

  public async selectRandom(isFreespins = false): Promise<void> {
    this.cardsInput.disableInput();
    let randomizeCount = isFreespins ? this.tempNumber : this.tempNumber;

    if (!isFreespins) {
      const selectedCount = this.cardsInput.getSelectedCount();
      if (
        selectedCount >= this.tempNumber &&
        selectedCount <= this.tempNumber
      ) {
        randomizeCount = selectedCount;
      }
    }

    const minSelection = isFreespins ? this.tempNumber : this.tempNumber;
    const include: number[] =
      this.cardsInput.getSelected().length < minSelection
        ? this.cardsInput.getSelected()
        : [];

    const selected = this.getRandomCards(randomizeCount, include);
    await this.cardsInput.swapSelected(this.cards, selected, include.length);

    GAME.paytable.updateContent(randomizeCount, isFreespins);

    // const play = isFreespins
    //   ? UiState.Blink
    //   : PLATFORM.isPlayAllowed()
    //     ? PLATFORM.isCabinet
    //       ? PLATFORM.getPlayerMoney() >= CORE.sui.smallestBet
    //         ? UiState.Blink
    //         : UiState.Inactive
    //       : UiState.Blink
    //     : UiState.Inactive;

    // setUiState({
    //   ...UI_DEFAULT,
    //   play,
    //   exitGame: isFreespins ? UiState.Inactive : UiState.Active,
    //   payout:
    //     isFreespins || PLATFORM.getPlayerMoney() === 0
    //       ? UiState.Inactive
    //       : UiState.Active,
    //   bet: isFreespins ? UiState.Inactive : UiState.Active,
    //   user_return_to_selection: UiState.Active,
    //   user_swap_selected: UiState.Active,
    // });

    GAMEFW.inputs('play');
    const selectionCards = this.cards.slice(0, HAND_INDEX - EXTRA_CARDS);
    this.cardsInput.enableInput(selectionCards, isFreespins);
    setButtonState('return_to_selection', true, true);
    setButtonState('swap_selected', true, true);
  }

  public async clearSelected(isFreespins = false): Promise<void> {
    await this.cardsInput.swapSelected(this.cards, []);
    GAME.paytable.updateContent(0, isFreespins);
    // setUiState({
    //   ...UI_DEFAULT,
    //   play: UiState.Inactive,
    //   exitGame: isFreespins ? UiState.Inactive : UiState.Active,
    //   payout:
    //     isFreespins || PLATFORM.getPlayerMoney() === 0
    //       ? UiState.Inactive
    //       : UiState.Active,
    //   bet: isFreespins ? UiState.Inactive : UiState.Active,
    //   user_return_to_selection: UiState.Inactive,
    //   user_swap_selected: UiState.Active,
    // });
    GAMEFW.inputs();
    setButtonState('return_to_selection', false, true);
    setButtonState('swap_selected', true, true);
  }

  public async dealCardsToChooseFrom(): Promise<void> {
    this.resetCards();

    if (IS_MOBILE_DEVICE) {
      for (let i = 0; i < this.cards.length - this.maxSelection; ++i) {
        this.cards[i].slim = true;
      }
    }

    const anims: Promise<void>[] = [];
    for (let suit = 0; suit < SUIT_COUNT; ++suit) {
      for (let rank = 0; rank < RANK_COUNT; ++rank) {
        const index = suit * RANK_COUNT + rank;
        const card = this.cards[index];
        const start = {name: CardName.Deck};
        const target = {name: suitCardName[suit], index: rank};
        const durationSeconds = 0.2;
        const delaySeconds = suit * suitDelay + rank * rankDelay;
        const startOffset = [0, (suit - 2 + 0.5) * SUIT_OFFSET * 0.3];
        card.cardIndex = index;
        card.depthGroup = GameLayer.Cards + index;
        card.parent = this.getCardNode(start.name);
        anims.push(
          card.move(
            durationSeconds,
            delaySeconds,
            start,
            target,
            undefined,
            startOffset,
          ),
        );
      }
    }
    await Promise.all(anims);
  }

  public endCardSelection(isFreespins: boolean): void {
    this.handCards = this.cardsInput.endSelection();
    if (!isFreespins) {
      this.basegameSelectedCards = this.handCards;
    }
  }

  public async cardSelectionExitTransition(): Promise<void> {
    this.cardsState = CardsState.Selected;
    await this.collectSelectionCards(this.handCards);
    for (let i = 0; i < this.cards.length - this.maxSelection; i++) {
      this.cards[i].undim();
    }

    CORE.fx.trigger('fx_keno_to_hand');
    await this.arrangeChosenCards();
  }

  private async collectSelectionCards(
    excludedCards: number[] = [],
  ): Promise<void> {
    this.cardsState = CardsState.Collecting;

    CORE.fx.trigger('fx_collect_cards');

    const anims: Promise<void>[] = [];
    for (let suit = SUIT_COUNT - 1; suit >= 0; --suit) {
      for (let rank = RANK_COUNT - 1; rank >= 0; --rank) {
        const index = suit * RANK_COUNT + rank;
        const card = this.cards[index];
        if (!card.visible || excludedCards.includes(index)) {
          continue;
        }

        const start = {name: suitCardName[suit], index: rank};
        const target = {name: CardName.Discard, index: 0};
        const delay =
          (SUIT_COUNT - suit) * suitDelay + (RANK_COUNT - rank) * rankDelay;

        card.parent = this.getCardNode(start.name, start.index);
        anims.push(
          card.discard(0.2, delay, start, target).then(() => {
            card.reset();
          }),
        );
      }
    }

    await Promise.all(anims);
    this.cardsState = CardsState.None;
  }

  private async arrangeChosenCards(): Promise<void> {
    let delay = 0.0;
    const anims: Promise<void>[] = [];

    this.updateCardHandPositions(this.handCards.length);

    for (let i = 0; i < this.handCards.length; ++i) {
      const cardIndex = this.handCards[i];
      const suit = Math.floor(cardIndex / RANK_COUNT);
      const rank = cardIndex % RANK_COUNT;
      const start: CardLocation = {name: suitCardName[suit], index: rank};
      const target: CardLocation = {name: CardName.Hand, index: i};

      const handCardIndex = HAND_INDEX + i;
      this.cards[handCardIndex].parent = this.cards[cardIndex].parent;
      this.cards[handCardIndex].copyPosition(this.cards[cardIndex]);
      this.cards[handCardIndex].cardIndex = cardIndex;
      this.cards[handCardIndex].visible = true;
      this.cards[handCardIndex].depthGroup = this.cards[cardIndex].depthGroup;
      this.cards[cardIndex].reset();
      this.cards[cardIndex].visible = false;

      if (IS_MOBILE_DEVICE) {
        this.cards[handCardIndex].slim = true;
      } else {
        this.cards[handCardIndex].doSelectionExitAnimation(delay);
      }

      anims.push(
        this.cards[handCardIndex].move(0.5, delay, start, target, true),
      );
      delay += 0.1;
    }

    await Promise.all(anims);

    for (let i = 0; i < this.handCards.length; ++i) {
      const handCardIndex = HAND_INDEX + i;
      this.cards[handCardIndex].depthGroup = GameLayer.Cards + i;
    }
  }

  public async prepareRound(isFreespins: boolean): Promise<void> {
    const drawCount = isFreespins ? this.tempNumber : this.tempNumber;
    this.updateCardTablePositions(drawCount);

    if (this.deck.parent) {
      const firstPos = this.getCardNode(CardName.Table, 0).worldPosition;
      this.deck.parent.worldPosition = firstPos;
    }

    this.stopEffects();
    CORE.fx.trigger('fx_stack_slide_left');
    await this.collectCardsFromTable();
    if (!this.cards[HAND_INDEX].visible) {
      await this.restoreHand();
    }
    CORE.fx.trigger(
      isFreespins ? 'fx_stack_shuffle_long' : 'fx_stack_shuffle_short',
    );
    this.startShuffle(ShuffleLocation.FirstCard);
  }

  public async doRound(roundState: RoundState, isFreespins: boolean) {
    await wait(isFreespins ? 1000 : 200);
    await this.endShuffle();
    const drawnCards: number[] = [];
    for (const card of roundState.wastePile) {
      drawnCards.push(cardToIndex(card.rank, card.suit));
    }
    if (drawnCards.length === 0) {
      return;
    }

    const matchingCards: number[] = []; // temp
    const multiplier = roundState.winFactor || 1;
    const isWonFreespins = roundState.bonusWon || false;

    await this.dealCardsToTable(
      drawnCards,
      matchingCards,
      multiplier,
      isFreespins,
      isWonFreespins,
    );
  }

  public update(delta: number): void {
    for (const card of this.cards) {
      card.update(delta);
    }
    this.updateDeckPerspectiveEffect([0, 470]);
    this.updateShuffle(delta);
    this.updateGambleJiggle(delta);
  }

  private updateGambleJiggle(delta: number): void {
    if (this.cardsState !== CardsState.GamblePick) {
      return;
    }
    const timing = getGambleTiming();
    this.gambleJiggleTimer += delta;
    if (this.gambleJiggleTimer >= timing.jiggleInterval) {
      this.gambleJiggleTimer -= timing.jiggleInterval;

      for (let i = 1; i < GAMBLE_COUNT; ++i) {
        const index = HAND_INDEX + i;
        this.cards[index].jiggle(timing.jiggleDuration, 0.07 * i);
      }
    }
  }

  private updateDeckPerspectiveEffect(
    perspectivePosition: [number, number],
  ): void {
    const bone = this.deck.skeleton.findBone(deckPerspectiveBoneName);
    assert(bone !== null, `Cannot find bone named ${deckPerspectiveBoneName}!`);
    assert(this.deck.parent !== null, `Deck has no parent`);
    bone.x = perspectivePosition[0] - this.deck.parent.worldPosition[0];
    bone.y = Math.max(
      0.0, //this.deck.parent.worldPosition[1] - perspectivePosition[1],
      0.0,
    );
  }

  private getCardNode(name: CardName, index?: number): gfx.Empty {
    const nodeName = getCardNodeName(name, index);
    return getNode(this.root, nodeName);
  }

  public getHandSize(): number {
    return this.cardsState === CardsState.Selecting
      ? this.cardsInput.getSelectedCount()
      : this.handCards.length;
  }

  public getHandCards(): string[] {
    const selection: string[] = [];
    for (let i = 0; i < this.handCards.length; ++i) {
      selection.push(indexToCard(this.handCards[i]));
    }
    return selection;
  }

  private async dealCardsToTable(
    drawnCards: number[],
    matchingCards: number[],
    multiplier: number,
    isFreespins: boolean,
    isWonFreespins: boolean,
  ): Promise<void> {
    this.cardsState = CardsState.Dealing;

    this.tableCards = [];
    this.resetCards(false);
    this.updateCardTablePositions(drawnCards.length);

    const {promise: cardsDealed, resolve} = voidPromise();

    const deckParent = this.deck.parent;
    assert(deckParent !== null, `Deck has no parent`);

    const firstPos = this.getCardNode(CardName.Table, 0).worldPosition;
    let playback = this.timeline.animate(
      anim.InOutQuad(0.0, 1.0),
      0.1,
      (_t) => {
        deckParent.worldPosition = firstPos;
      },
    );

    const timeScale = isFreespins ? 1.3 : 1.0;

    enum DragonStatus {
      sleeping,
      active,
      deactivated,
    }
    let dragonStatus = isFreespins
      ? DragonStatus.active
      : DragonStatus.sleeping;

    const selected = this.handCards.length;
    const smallestMatch = GAME.paytable.getSmallestCombinationCount(
      selected,
      isFreespins,
    );
    const activatedCards: number[] = [];
    let matchCount = 0;
    const timing = getDealingTiming();

    for (let i = 1; i <= drawnCards.length; ++i) {
      const leftToDeal = drawnCards.length - i + 1;
      const isOneMissing = matchCount === selected - 1;
      const isLast = leftToDeal === 1;
      const isWinPossible =
        matchCount !== selected && leftToDeal >= smallestMatch - matchCount;

      const cardIndex = drawnCards[i - 1];
      const previousIndex = i > 1 ? drawnCards[i - 2] : -1;
      const card = this.cards[cardIndex];

      if (IS_MOBILE_DEVICE) {
        card.slim = true;
      }

      if (
        dragonStatus === DragonStatus.sleeping &&
        previousIndex === CARD_DRAGON &&
        (isWonFreespins || multiplier > 1)
      ) {
        dragonStatus = DragonStatus.active;
      }

      let delay = isWinPossible
        ? dragonStatus === DragonStatus.active ||
          (isOneMissing && selected == 2)
          ? multiplier >= 10
            ? timing.delayBetweenCardsIfBigMultiplier
            : timing.delayBetweenCardsIfMultiplier
          : matchCount >= smallestMatch
            ? timing.delayBetweenCardsIfWin
            : timing.delayBetweenCards
        : timing.delayBetweenCards;

      if (previousIndex === CARD_DRAGON) {
        delay = isWinPossible
          ? timing.delayOnDragon
          : timing.delayOnDragonNoWin;
      }

      if (matchCount === selected && dragonStatus !== DragonStatus.active) {
        delay = timing.anticipateDragon;
      }

      // always anticipate on big multipliers (even if dont have dragon)
      if (isWinPossible && multiplier >= 25) {
        delay = Math.max(timing.delayBetweenCardsIfBigMultiplier, delay);
      }

      let shouldAnticipate = false;

      //  anticipate hitting the missing card if only one missing from 2 cards selected
      if (isWinPossible && isOneMissing && selected > 2) {
        shouldAnticipate = true;
      }

      // anticipate the last card if can win
      if (
        isWinPossible &&
        isLast &&
        matchCount > 0 &&
        matchCount !== selected
      ) {
        shouldAnticipate = true;
      }

      const nextPayout = GAME.paytable.getPayoutWin(
        selected,
        matchCount < selected ? matchCount + 1 : selected,
        isFreespins,
      );
      const activeMultiplier =
        dragonStatus === DragonStatus.active ? multiplier : 1;
      const payoutFactor = (nextPayout * activeMultiplier) / 100;
      if (
        payoutFactor >= 10 &&
        (isWinPossible || dragonStatus !== DragonStatus.active)
      ) {
        shouldAnticipate = true;
      }

      // reset delay if doing the big anticipation animation (so no double anticipation slowdown)
      if (shouldAnticipate) {
        delay = timing.delayBetweenCards;
      }

      if (matchingCards.includes(cardIndex)) {
        ++matchCount;
      }

      playback = playback.after(() => {
        CORE.fx.trigger('fx_card_deal');
        if (shouldAnticipate && isLast) {
          CORE.fx.trigger('fx_anticipation_start');
        }
        card.depthGroup = GameLayer.Cards + i * 3;
        card.cardIndex = cardIndex;
        card.parent = this.getCardNode(CardName.Table, i - 1);
        card.visible = true;
        this.tableCards.push(cardIndex);
      });

      if (shouldAnticipate) {
        const antipateDistance = 50;
        if (isLast) {
          playback = playback
            .chain(anim.InOutQuad(0.0, 1.0), timing.anticipateReveal, (t) => {
              const fromPos = this.getFromPos(i);
              deckParent.worldPosition = [
                anim.easeLinear(fromPos[0], fromPos[0] + antipateDistance, t),
                fromPos[1],
              ];
            })
            .delay(delay)
            .chain(anim.InQuad(0.0, 1.0), timing.anticipateEnd, (t) => {
              const fromPos = this.getFromPos(i);
              const toPos = this.getToPos(i, isLast);
              deckParent.worldPosition = [
                anim.easeLinear(fromPos[0] + antipateDistance, toPos[0], t),
                anim.easeLinear(fromPos[1], toPos[1], t),
              ];
            });
        } else {
          playback = playback
            .chain(
              anim.InQuad(0.0, 1.0),
              timing.anticipateReveal * 0.9,
              (t) => {
                const fromPos = this.getFromPos(i);
                deckParent.worldPosition = [
                  anim.easeLinear(fromPos[0], fromPos[0] + antipateDistance, t),
                  fromPos[1],
                ];
              },
            )
            .delay(delay)
            .chain(anim.Linear(0.0, 1.0), timing.anticipateEnd * 0.8, (t) => {
              const fromPos = this.getFromPos(i);
              const toPos = this.getToPos(i, isLast);
              deckParent.worldPosition = [
                anim.easeLinear(fromPos[0] + antipateDistance, toPos[0], t),
                anim.easeLinear(fromPos[1], toPos[1], t),
              ];
            });
        }
      } else {
        playback = playback
          .chain(
            anim.Linear(0.0, 1.0),
            isLast
              ? timing.deckReturn * timeScale
              : timing.moveBetweenCards * timeScale,
            (t) => {
              const fromPos = this.getFromPos(i);
              const toPos = this.getToPos(i, isLast);
              deckParent.worldPosition = [
                anim.easeLinear(fromPos[0], toPos[0], t),
                anim.easeLinear(fromPos[1], toPos[1], t),
              ];
            },
          )
          .delay(delay);
      }

      playback = playback.before(() => {
        if (matchingCards.includes(cardIndex)) {
          activatedCards.push(cardIndex);
          this.handleMatchFound(
            cardIndex,
            selected,
            activatedCards,
            isFreespins,
          );
        }
      });

      playback.after(() => {
        if (cardIndex === CARD_DRAGON) {
          card.activateDragonCard();
          GAME.dragonPanel.activateBonus(isWonFreespins, 800);
        }
        if (isLast) {
          resolve();
        }
      });
    }

    await cardsDealed;

    if (drawnCards[drawnCards.length - 1] === CARD_DRAGON) {
      await wait(1000);
    }

    this.cardsState = CardsState.Dealt;
  }

  private getFromPos(index: number): ArrayLike<number> {
    return this.getCardNode(CardName.Table, index - 1).worldPosition;
  }

  private getToPos(index: number, isLast: boolean): ArrayLike<number> {
    return isLast
      ? this.getCardNode(CardName.TableDeck).worldPosition
      : this.getCardNode(CardName.Table, index).worldPosition;
  }

  private async handleMatchFound(
    index: number,
    selected: number,
    activatedCards: number[],
    isFreespin: boolean,
  ): Promise<void> {
    CORE.fx.trigger(`fx_card_win_${activatedCards.length}`);
    const dealerCard = this.cards[index];
    this.timeline
      .animate(anim.Linear(0.0, 1.0), 0.15, (t) => {
        dealerCard.node.position = [0.0, t * -60.0];
      })
      .after(() => {
        for (const cardIndex of activatedCards) {
          const handIndex = this.handCards.indexOf(cardIndex);
          if (handIndex !== -1) {
            const handCard = this.cards[HAND_INDEX + handIndex];
            handCard.setWinParticle(
              true,
              selected,
              activatedCards.length,
              isFreespin,
            );
          }
        }
        dealerCard.setWinParticle(true, 6, 1, false);
        GAME.paytable.hiliteWin();
      });
  }

  public async collectCardsFromTable(
    isReturnDeckToHome = false,
  ): Promise<void> {
    this.cardsState = CardsState.Collecting;

    if (this.gambleCards.length > 0) {
      for (let i = 0; i < this.gambleCards.length; ++i) {
        const index = this.gambleCards[i];
        const card = this.cards[index];
        card.flip(CARD_BACK, 0.0, 0.3);
        card.gambleWin = false;
        card.gambleLose = false;
      }

      await wait(300);
      CORE.fx.trigger('fx_collect_cards');
      const anims: Promise<void>[] = [];
      let delay = 0.0;

      for (let i = 0; i < this.gambleCards.length; ++i) {
        const index = this.gambleCards[i];
        const card = this.cards[index];
        anims.push(card.returnToTableDeck(delay));
        delay += 0.09;
      }

      await Promise.all(anims);
    }
    if (this.tableCards.length > 0) {
      // CORE.fx.trigger('fx_collect_cards');
    }
    const deckParent = this.deck.parent;
    assert(deckParent !== null, `Deck has no parent`);

    // send deck to first position if table have not cards and deck
    // should be in position where ready to start dealing cards
    if (this.tableCards.length === 0 && !isReturnDeckToHome) {
      this.timeline.animate(anim.InOutQuad(0.0, 1.0), 0.3, (t) => {
        const startPos = this.getCardNode(CardName.TableDeck).worldPosition;
        const firstPos = this.getCardNode(CardName.Table, 0).worldPosition;
        deckParent.worldPosition = [
          anim.easeLinear(startPos[0], firstPos[0], t),
          anim.easeLinear(startPos[1], firstPos[1], t),
        ];
      });
      await wait(300);
    }

    if (this.tableCards.length > 0) {
      const {promise: collecting, resolve} = voidPromise();
      this.timeline
        .animate(anim.InOutQuad(0.0, 1.0), 0.3, (t) => {
          const startPos = this.getCardNode(CardName.TableDeck).worldPosition;
          const firstPos = this.getCardNode(CardName.Table, 0).worldPosition;
          deckParent.worldPosition = [
            anim.easeLinear(startPos[0], firstPos[0], t),
            anim.easeLinear(startPos[1], firstPos[1], t),
          ];
          for (let i = 0; i < this.tableCards.length; ++i) {
            const index = this.tableCards[i];
            const card = this.cards[index];
            if (
              card.node.parent &&
              deckParent.worldPosition[0] < card.node.parent.worldPosition[0]
            ) {
              card.visible = false;
            }
          }
        })
        .after(() => {
          for (let i = 0; i < this.tableCards.length; ++i) {
            const index = this.tableCards[i];
            const card = this.cards[index];
            card.visible = false;
          }
        })
        .after(() => {
          resolve();
        });

      await collecting;

      if (isReturnDeckToHome) {
        this.timeline.animate(anim.InOutQuad(0.0, 1.0), 0.1, (t) => {
          const startPos = this.getCardNode(CardName.TableDeck).worldPosition;
          const firstPos = this.getCardNode(CardName.Table, 0).worldPosition;
          deckParent.worldPosition = [
            anim.easeLinear(firstPos[0], startPos[0], t),
            anim.easeLinear(firstPos[1], startPos[1], t),
          ];
        });
        await wait(100);
      }
    }

    this.tableCards = [];
    this.gambleCards = [];
    this.cardsState = CardsState.None;
  }

  public async doQuickShuffle(
    location: ShuffleLocation,
    durationMs: number,
  ): Promise<void> {
    this.startShuffle(ShuffleLocation.TableDeck);
    CORE.fx.trigger('fx_stack_shuffle_short');
    await wait(durationMs);
    await this.endShuffle();
  }

  private startShuffle(location: ShuffleLocation): void {
    const suffleCardCount = 20;
    this.shuffleCards = this.cards.slice(0, suffleCardCount).map((card) => ({
      card,
      randomOffset: Math.random() * 2.0 * Math.PI,
    }));

    const parentNode =
      location === ShuffleLocation.FirstCard
        ? this.getCardNode(CardName.Table, 0)
        : this.getCardNode(CardName.TableDeck);

    this.shuffleCards.forEach((shuffle) => {
      shuffle.card.parent = parentNode;
      shuffle.card.cardIndex = CARD_BACK;
      shuffle.card.visible = true;
      shuffle.card.shadow = false;
      shuffle.card.depthGroup = GameLayer.Deck + 1;
    });

    this.deck.visible = false;
    this.shuffleState = ShuffleState.Shuffling;
    this.shuffleAnim = 1.0;
  }

  private updateShuffle(delta: number): void {
    if (this.shuffleState === ShuffleState.None) {
      return;
    }

    this.shuffleAnim -= delta * 3;
    if (this.shuffleAnim <= 0.0) {
      if (this.shuffleState === ShuffleState.Shuffling) {
        this.shuffleAnim += 1.0;
      } else if (this.shuffleState === ShuffleState.Ending) {
        this.shuffleState = ShuffleState.None;
        this.deck.visible = true;
        this.shuffleCards.forEach((shuffle) => {
          shuffle.card.parent = this.getCardNode(CardName.TableDeck);
          shuffle.card.shadow = true;
          shuffle.card.visible = false;
        });
        this.shuffleCards = [];
        this.shuffleAnim = 0.0;
      }
    }

    for (let i = 0; i < this.shuffleCards.length; ++i) {
      const card = this.shuffleCards[i].card;
      card.node.position = this.getShuffleAnimPosition(
        i,
        this.shuffleAnim,
        this.shuffleCards[i].randomOffset,
      );
    }
  }

  private async endShuffle(): Promise<void> {
    this.shuffleState = ShuffleState.Ending;
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (this.shuffleState === ShuffleState.None) {
          clearInterval(interval);
          resolve();
        }
      }, 50); // Check every 50 ms
    });
  }

  private getShuffleAnimPosition(
    index: number,
    anim: number,
    randomOffset: number,
  ) {
    const multiplier = this.shuffleState === ShuffleState.Ending ? anim : 1.0;
    return [
      Math.sin(anim * Math.PI * 4.0 + randomOffset) * 50.0 * multiplier +
        13.0 * (index / this.shuffleCards.length),
      Math.sin(anim * Math.PI * 2.0 + randomOffset) * 5.0 -
        27.0 * (index / this.shuffleCards.length),
    ];
  }

  public async discardTable(): Promise<void> {
    const anims: Promise<void>[] = [];

    for (let i = 0; i < this.tableCards.length; ++i) {
      const index = this.tableCards[i];
      const card = this.cards[index];

      const start = {name: CardName.Table, index: i};
      const target = {name: CardName.Discard, index: 0};
      const delay = i * rankDelay;

      card.parent = this.getCardNode(start.name, start.index);
      anims.push(card.discard(0.2, delay, start, target));
    }
    this.tableCards = [];

    await Promise.all(anims);
  }

  public async discardHand(): Promise<void> {
    const anims: Promise<void>[] = [];

    for (let i = 0; i < this.handCards.length; ++i) {
      const index = HAND_INDEX + i;
      const card = this.cards[index];

      const start = {name: CardName.Hand, index: i};
      const target = {name: CardName.Discard, index: 0};
      const delay = i * rankDelay;

      card.parent = this.getCardNode(start.name, start.index);
      anims.push(card.discard(0.2, delay, start, target));
    }

    await Promise.all(anims);
  }

  public async randomizeHand(): Promise<void> {
    this.setHandDepthGroup(GameLayer.Deck);

    const isEffectPlaying = this.handCards.some((_cardIndex, index) =>
      this.cards[HAND_INDEX + index].isEffectPlaying(),
    );
    this.stopEffects();
    if (isEffectPlaying) {
      await wait(200);
    }

    if (this.tableCards.length > 0) {
      await this.collectCardsFromTable();
      await this.returnDeckHome();
    }

    const count = this.handCards.length;
    const randomized = this.getRandomCards(count, []);
    this.handCards = randomized;
    this.basegameSelectedCards = randomized;

    let delay = 0;
    const anims: Promise<void>[] = [];
    CORE.fx.trigger('fx_swap_cards');
    for (let i = 0; i < count; ++i) {
      const index = HAND_INDEX + i;
      const card = this.cards[index];
      anims.push(card.swap(randomized[i], delay));
      delay += 0.05;
    }
    await Promise.all(anims);
  }

  public setAllDepthGroup(depthGroup: number) {
    for (let i = 0; i < this.cards.length; ++i) {
      this.cards[i].depthGroup = depthGroup;
    }
    // Note: table cards bit a special case since they on top of each others
    // so need to still keep their order intact
    for (let i = 0; i < this.tableCards.length; ++i) {
      const index = this.tableCards[i];
      const card = this.cards[index];
      card.depthGroup = depthGroup + i * 3;
    }
  }

  public setHandDepthGroup(depthGroup: number) {
    for (let i = 0; i < this.handCards.length; ++i) {
      const index = HAND_INDEX + i;
      const card = this.cards[index];
      card.depthGroup = depthGroup;
    }
  }

  private getRandomCards(count: number, include: number[]): number[] {
    const ret: number[] = [...include];
    while (ret.length < count) {
      let randomCard = -1;
      while (randomCard === -1 || ret.includes(randomCard)) {
        randomCard = Math.floor(Math.random() * SUIT_COUNT * RANK_COUNT);
      }
      ret.push(randomCard);
    }
    return ret;
  }

  public async restoreHand(): Promise<void> {
    const anims: Promise<void>[] = [];
    for (let i = 0; i < this.handCards.length; ++i) {
      const index = HAND_INDEX + i;
      const card = this.cards[index];
      const start = {name: CardName.Deck};
      const target = {name: CardName.Hand, index: i};
      const durationSeconds = 0.2 + i * 0.01;
      const delaySeconds = i * 0.07;
      card.depthGroup = GameLayer.Cards + i;
      card.cardIndex = this.handCards[i];
      card.parent = this.getCardNode(start.name);
      anims.push(card.move(durationSeconds, delaySeconds, start, target));
    }

    await Promise.all(anims);
  }

  public async startGamble(): Promise<void> {
    await GAME.cards.collectCardsFromTable(true);
    await GAME.cards.discardHand();
  }

  public async endGamble(): Promise<void> {
    await GAME.cards.collectCardsFromTable(true);
    await GAME.cards.restoreHand();
  }

  public async dealGambleCards(): Promise<void> {
    const timing = getGambleTiming();
    CORE.fx.trigger('fx_gamble_deal_cards');

    this.gambleCards = [];

    const anims: Promise<void>[] = [];
    for (let i = 0; i < GAMBLE_COUNT; ++i) {
      const index = HAND_INDEX + i;
      const card = this.cards[index];
      const start = {name: CardName.TableDeck};
      const target = {name: CardName.Gamble, index: i};
      const durationSeconds = timing.dealDuration + i * 0.01;
      const delaySeconds = i * 0.07;
      const startOffset = [0, -20];
      card.reset();
      card.depthGroup = GameLayer.Deck + GAMBLE_COUNT - i;
      card.cardIndex = CARD_BACK;
      card.parent = this.getCardNode(start.name);
      card.visible = false;
      this.gambleCards.push(index);
      anims.push(
        card.move(
          durationSeconds,
          delaySeconds,
          start,
          target,
          false,
          startOffset,
        ),
      );
    }

    await Promise.all(anims);
  }

  public async revealOpenGambleCard(cardIndex: number): Promise<void> {
    const index = HAND_INDEX;
    const card = this.cards[index];
    await card.flip(cardIndex, 0.0, 0.3, 0, true);
    card.gambleFirstCard = true;
  }

  public removeOpenGambleEffect(): void {
    this.cards[HAND_INDEX].gambleFirstCard = false;
  }

  public async selectGambleCard(): Promise<number> {
    this.cardsState = CardsState.GamblePick;

    const gambleCards = this.cards.slice(
      HAND_INDEX + 1,
      HAND_INDEX + GAMBLE_COUNT,
    );
    const gambleInputPromise = this.cardsInput.doGambleInput(gambleCards);
    const racingPromises = [gambleInputPromise];
    const chosen = await Promise.race(racingPromises);
    this.cardsState = CardsState.None;
    return chosen;
  }

  public async flipGambleCards(
    pick: number,
    selectableCards: number[],
    isWin: boolean | undefined,
  ): Promise<void> {
    const chosenCard = this.cards[HAND_INDEX + pick + 1];
    await chosenCard.flip(selectableCards[pick], 0.0, 0.3);
    if (isWin) {
      chosenCard.gambleWin = true;
    } else {
      chosenCard.gambleLose = true;
    }
    await wait(100);

    const anims: Promise<void>[] = [];
    for (let i = 0; i < selectableCards.length; ++i) {
      if (i !== pick) {
        const card = this.cards[HAND_INDEX + i + 1];
        anims.push(card.flip(selectableCards[i], 0.0, 0.3));
      }
    }
    await Promise.all(anims);
  }

  public resetHandCards(selections: number[]): void {
    for (let i = 0; i < this.handCards.length; i++) {
      const handCardIndex = HAND_INDEX + i;
      this.cards[handCardIndex].reset();
      this.cards[handCardIndex].visible = false;
      this.cards[handCardIndex].node.position = [0.0, 0.0];
    }

    this.handCards = selections;
    this.updateCardHandPositions(this.handCards.length);
    for (let i = 0; i < this.handCards.length; ++i) {
      const cardIndex = this.handCards[i];
      const handCardIndex = HAND_INDEX + i;
      this.cards[handCardIndex].setPosition({name: CardName.Hand, index: i});
      this.cards[handCardIndex].cardIndex = cardIndex;
      this.cards[handCardIndex].visible = true;
      this.cards[handCardIndex].parent = this.getCardNode(CardName.Hand, i);
      this.cards[handCardIndex].depthGroup = GameLayer.Cards + handCardIndex;
      if (IS_MOBILE_DEVICE) {
        this.cards[handCardIndex].slim = false;
      }
    }
  }

  public async setDeckHidden(
    isHidden: boolean,
    animationTimeMs = 0,
    delayMs = 0,
  ): Promise<void> {
    const start = this.deck.opacity;
    const end = isHidden ? 0 : 1;

    if (animationTimeMs <= 0) {
      this.deck.opacity = end;
      return;
    }

    await wait(delayMs);

    const {promise: deckHide, resolve} = voidPromise();
    this.timeline
      .animate(anim.InOutQuad(start, end), animationTimeMs / 1000, (alpha) => {
        this.deck.opacity = alpha;
      })
      .after(() => {
        resolve();
      });
    await deckHide;
  }

  public async resetRound(): Promise<void> {
    if (this.shuffleState === ShuffleState.Shuffling) {
      await this.endShuffle();
    }
    await this.returnDeckHome();
  }

  private async returnDeckHome(): Promise<void> {
    const deckParent = this.deck.parent;
    assert(deckParent !== null, `Deck has no parent`);

    const from = deckParent.worldPosition;
    const to = this.getCardNode(CardName.TableDeck).worldPosition;

    this.timeline.animate(anim.InOutQuad(0.0, 1.0), 0.3, (t) => {
      deckParent.worldPosition = [
        anim.easeLinear(from[0], to[0], t),
        anim.easeLinear(from[1], to[1], t),
      ];
    });
    await wait(300);
  }

  public renderSolitaireBoard(
    roundState: RoundState,
    options?: {isAuto?: boolean},
  ): void {
    this.solitaireRoundState = roundState;
    this.currentPicks = roundState.picks ?? [];
    this.cancelSolitaireDragImmediate();
    this.solitaireCardMap.clear();
    this.resetCards();
    let cardSlot = 0;
    const overlap = this.computeSolitaireOverlaps(roundState);

    for (let col = 0; col < 7; col++) {
      const faceDownCount = roundState.faceDownCounts[col];
      const faceUpCards = roundState.openCards[col];

      for (let j = 0; j < faceDownCount; j++) {
        const card = this.cards[cardSlot];
        card.cardIndex = CARD_BACK;
        card.parent = this.getCardNode(CardName.SolTableau, col);
        card.node.position = [0, j * overlap.faceDown];
        card.visible = true;
        card.depthGroup = GameLayer.Cards + cardSlot;
        cardSlot++;
      }

      for (let j = 0; j < faceUpCards.length; j++) {
        const c = faceUpCards[j];
        const card = this.cards[cardSlot];
        card.cardIndex = cardToIndex(c.rank, c.suit);
        card.parent = this.getCardNode(CardName.SolTableau, col);
        card.node.position = [
          0,
          faceDownCount * overlap.faceDown + j * overlap.faceUp,
        ];
        card.visible = true;
        card.depthGroup = GameLayer.Cards + cardSlot;
        this.solitaireCardMap.set(`STACK_${col + 1}_${j}`, card);
        cardSlot++;
      }
    }

    if (roundState.wastePile.length > 0) {
      const waste = roundState.wastePile;

      for (let i = 0; i < waste.length; i++) {
        const w = waste[i];
        const card = this.cards[cardSlot];
        card.cardIndex = cardToIndex(w.rank, w.suit);
        card.parent = this.getCardNode(CardName.SolWaste);
        card.visible = true;
        card.depthGroup = GameLayer.Cards + cardSlot;
        if (i === waste.length - 1) {
          this.solitaireCardMap.set('WASTE_PILE', card);
        }

        cardSlot++;
      }
    }

    for (let slot = 0; slot < 4; slot++) {
      const top = roundState.foundationTops[slot];
      const card = this.cards[cardSlot];
      if (top) {
        card.cardIndex = cardToIndex(top.rank, top.suit);
      } else {
        card.cardIndex = CARD_BACK;
      }
      card.parent = this.getCardNode(CardName.SolFoundation, slot);
      card.node.position = [0, 0];
      card.visible = true;
      card.depthGroup = GameLayer.Cards + cardSlot;
      this.solitaireCardMap.set(`FOUNDATION_${slot}`, card);
      cardSlot++;
    }

    const hasStockMove =
      options?.isAuto || this.currentPicks.some((p) => p.from === 'STOCK');
    this.solitaireStockVisualCount = hasStockMove
      ? Math.max(
          1,
          Math.min(
            SOLITAIRE_STOCK_LAYER_COUNT,
            4 - (roundState.wastePile.length % 4),
          ),
        )
      : 0;
    if (this.solitaireStockVisualCount > 0) {
      for (let i = 0; i < this.solitaireStockVisualCount; i++) {
        const card = this.cards[cardSlot];
        card.cardIndex = CARD_BACK;
        card.parent = this.getCardNode(CardName.SolStock);
        card.node.position = [
          i * SOLITAIRE_STOCK_LAYER_OFFSET_X,
          i * SOLITAIRE_STOCK_LAYER_OFFSET_Y,
        ];
        card.visible = true;
        card.depthGroup = GameLayer.Cards + cardSlot;
        if (i === this.solitaireStockVisualCount - 1) {
          this.solitaireCardMap.set('STOCK', card);
        }
        cardSlot++;
      }
    }

    for (const card of this.cards) {
      if (card.visible) {
        card.glow = false;
      }
    }
  }

  public waitForSolitaireMove(): Promise<SolitairePickMove> {
    return new Promise((resolve) => {
      this.moveResolver = resolve;
      this.enableSolitaireInput();
    });
  }

  public cancelPendingSolitaireMove(): void {
    this.cancelSolitaireDragImmediate();
    this.solitairePendingPress = undefined;
    this.solitaireLastClick = undefined;
    this.moveResolver = undefined;
    this.disableSolitaireInput();
    this.solitairePreAnimatedMove = undefined;
  }

  private enableSolitaireInput(): void {
    this.disableSolitaireInput();

    const stockCard = this.solitaireCardMap.get('STOCK');
    if (stockCard) {
      const id = CORE.input.listenNode(
        stockCard.inputNode,
        (e: input.InputEvent) => {
          if (
            e.type !== input.EventType.PRESS ||
            this.solitaireSnapInProgress ||
            this.solitaireDrag
          ) {
            return;
          }
          this.onSolitaireStockClick();
        },
        'pointer',
      );
      this.solitaireListenerIds.push(id);
    }

    for (const [mapKey, card] of this.solitaireCardMap) {
      if (mapKey.startsWith('FOUNDATION_') || mapKey === 'STOCK') {
        continue;
      }
      const id = CORE.input.listenNode(
        card.inputNode,
        (e: input.InputEvent) => {
          if (
            e.type !== input.EventType.PRESS ||
            this.solitaireSnapInProgress ||
            this.solitaireDrag
          ) {
            return;
          }
          this.onSolitaireDragPress(mapKey, e);
        },
        'pointer',
      );
      this.solitaireListenerIds.push(id);
    }
  }

  private onSolitaireStockClick(): void {
    const resolve = this.moveResolver;
    if (!this.solitaireRoundState || !resolve) {
      return;
    }
    const move = this.currentPicks.find(
      (p) => p.from === 'STOCK' && p.to === 'WASTE_PILE',
    );
    if (!move) {
      return;
    }
    this.disableSolitaireInput();
    const stockCard = this.solitaireCardMap.get('STOCK');
    this.moveResolver = undefined;
    if (!stockCard) {
      resolve(move);
      return;
    }
    this.animateStockToWasteMove(stockCard).then(() => {
      this.solitairePreAnimatedMove = move;
      resolve(move);
    });
  }

  private onSolitaireDragPress(mapKey: string, e: input.InputEvent): void {
    if (
      !this.moveResolver ||
      this.solitaireSnapInProgress ||
      this.solitaireDrag
    ) {
      return;
    }
    if (this.solitairePendingPress) {
      return;
    }
    const roundState = this.solitaireRoundState;
    if (!roundState) return;
    const match = /^STACK_(\d+)_(\d+)$/.exec(mapKey);

    let cards: Card[] = [];
    let from = '';
    let count = 0;
    if (match) {
      const col = parseInt(match[1], 10);
      const j = parseInt(match[2], 10);

      from = `STACK_${col}`;
      const faceUp = roundState.openCards[col - 1];
      if (!faceUp || j < 0 || j >= faceUp.length) return;
      for (let k = j; k < faceUp.length; k++) {
        const c = this.solitaireCardMap.get(`${from}_${k}`);
        if (c) cards.push(c);
      }
      count = cards.length;
    } else if (mapKey === 'WASTE_PILE') {
      const wasteCard = this.solitaireCardMap.get('WASTE_PILE');
      if (!wasteCard) return;

      cards = [wasteCard];
      from = 'WASTE_PILE';
      const pick = this.currentPicks.find((p) => p.from === 'WASTE_PILE');
      count = pick ? pick.count : 1;
    }

    if (cards.length === 0) return;
    this.solitairePendingPress = {
      mapKey,
      cards,
      from,
      count,
      pressCanvasX: e.canvasX,
      pressCanvasY: e.canvasY,
    };

    this.removeSolitaireCanvasDragListener();

    this.solitaireCanvasListenerId = CORE.input.listenCanvas(
      (ev: input.InputEvent) => {
        if (
          !this.solitairePendingPress ||
          this.solitaireSnapInProgress ||
          this.solitaireDrag
        ) {
          return;
        }
        if (ev.type === input.EventType.POINTER_MOVE) {
          const dx = ev.canvasX - this.solitairePendingPress.pressCanvasX;
          const dy = ev.canvasY - this.solitairePendingPress.pressCanvasY;

          const distance = Math.hypot(dx, dy);

          if (distance < SOLITAIRE_DRAG_START_THRESHOLD_PX) {
            return;
          }
          const pending = this.solitairePendingPress;
          this.solitairePendingPress = undefined;

          this.beginSolitaireDrag(
            pending.cards,
            pending.from,
            pending.count,
            pending.pressCanvasX,
            pending.pressCanvasY,
          );

          this.applySolitaireDragAtCanvas(ev.canvasX, ev.canvasY);
        } else if (ev.type === input.EventType.RELEASE) {
          const pending = this.solitairePendingPress;
          this.solitairePendingPress = undefined;

          this.removeSolitaireCanvasDragListener();

          if (!pending) return;
          this.onSolitaireCardRelease(
            pending.mapKey,
            ev.canvasX,
            ev.canvasY,
            pending.count,
          );
        }
      },
    );
  }

  private onSolitaireCardRelease(
    mapKey: string,
    canvasX: number,
    canvasY: number,
    count: number,
  ): void {
    if (
      !this.moveResolver ||
      this.solitaireDrag ||
      this.solitaireSnapInProgress
    ) {
      return;
    }
    const now = Date.now();
    const last = this.solitaireLastClick;
    const isDoubleClick =
      !!last &&
      last.mapKey === mapKey &&
      now - last.timeMs <= SOLITAIRE_DOUBLE_CLICK_MS &&
      Math.hypot(canvasX - last.canvasX, canvasY - last.canvasY) <=
        SOLITAIRE_CLICK_MOVE_TOLERANCE_PX;
    if (isDoubleClick && this.tryResolveFoundationAutoMove(mapKey, count)) {
      this.solitaireLastClick = undefined;
      return;
    }
    this.solitaireLastClick = {mapKey, timeMs: now, canvasX, canvasY};
  }

  private tryResolveFoundationAutoMove(mapKey: string, count: number): boolean {
    const resolve = this.moveResolver;
    if (!resolve) {
      return false;
    }
    const from = this.getFromKey(mapKey);
    const move = this.currentPicks.find(
      (p) =>
        p.from === from && p.to.startsWith('FOUNDATION') && p.count === count,
    );
    if (!move) {
      return false;
    }
    this.disableSolitaireInput();
    this.solitairePendingPress = undefined;
    this.moveResolver = undefined;
    this.animateSolitaireAutoFoundationMove(move).then(() => {
      this.solitairePreAnimatedMove = move;
      resolve(move);
    });
    return true;
  }

  private async animateSolitaireAutoFoundationMove(
    move: SolitairePickMove,
  ): Promise<void> {
    const round = this.solitaireRoundState;
    if (!round) {
      return;
    }
    const movingCards = this.getCardsForMove(move);
    if (movingCards.length === 0) {
      return;
    }
    const destination = this.getMoveTargetWorldPosition(
      move,
      round,
      movingCards.length,
    );
    const overlap = this.computeSolitaireOverlaps(round);
    const promises: Promise<void>[] = [];
    for (let i = 0; i < movingCards.length; i++) {
      promises.push(
        this.animateCardWorldMove(
          movingCards[i],
          destination[0],
          destination[1] + i * overlap.faceUp,
          SOLITAIRE_DROP_SECONDS,
        ),
      );
    }
    await Promise.all(promises);
  }

  private getFromKey(mapKey: string): string {
    if (mapKey === 'WASTE_PILE') return 'WASTE_PILE';

    const match = /^STACK_(\d+)_/.exec(mapKey);
    if (match) {
      return `STACK_${match[1]}`;
    }

    return mapKey;
  }
  private beginSolitaireDrag(
    cards: Card[],
    from: string,
    count: number,
    pressCanvasX: number,
    pressCanvasY: number,
  ): void {
    const primary = cards[0];
    const pw = CORE.gfx.canvasToWorld(pressCanvasX, pressCanvasY) as [
      number,
      number,
    ];
    const primaryWorld = primary.node.worldPosition as [number, number];
    const grabOffsetWorld: [number, number] = [
      pw[0] - primaryWorld[0],
      pw[1] - primaryWorld[1],
    ];
    const offsetFromPrimary: [number, number][] = cards.map((c) => {
      const w = c.node.worldPosition as [number, number];
      return [w[0] - primaryWorld[0], w[1] - primaryWorld[1]];
    });
    const startParents = cards.map((c) => c.parent);
    const startLocalPos = cards.map(
      (c) => [c.node.position[0], c.node.position[1]] as [number, number],
    );
    const startDepth = cards.map((c) => c.depthGroup);
    const startWorldPos = cards.map(
      (c) =>
        [c.node.worldPosition[0], c.node.worldPosition[1]] as [number, number],
    );

    for (const c of cards) {
      c.depthGroup = SOLITAIRE_DRAG_DEPTH_GROUP;
    }

    this.solitaireDrag = {
      cards,
      grabOffsetWorld,
      offsetFromPrimary,
      startParents,
      startLocalPos,
      startWorldPos,
      startDepth,
      from,
      count,
    };

    for (const c of this.cards) {
      if (c.visible) {
        c.glow = false;
      }
    }
    for (const c of cards) {
      c.glow = true;
    }

    this.removeSolitaireCanvasDragListener();
    this.solitaireCanvasListenerId = CORE.input.listenCanvas(
      (ev: input.InputEvent) => {
        if (!this.solitaireDrag || this.solitaireSnapInProgress) {
          return;
        }
        if (ev.type === input.EventType.POINTER_MOVE) {
          this.applySolitaireDragAtCanvas(ev.canvasX, ev.canvasY);
        } else if (ev.type === input.EventType.RELEASE) {
          this.tryResolveSolitaireDropAt(ev.canvasX, ev.canvasY);
        }
      },
    );

    this.applySolitaireDragAtCanvas(pressCanvasX, pressCanvasY);
  }

  private removeSolitaireCanvasDragListener(): void {
    if (this.solitaireCanvasListenerId !== undefined) {
      CORE.input.removeListener(this.solitaireCanvasListenerId);
      this.solitaireCanvasListenerId = undefined;
    }
  }

  private applySolitaireDragAtCanvas(canvasX: number, canvasY: number): void {
    const drag = this.solitaireDrag;
    if (!drag) {
      return;
    }
    const world = CORE.gfx.canvasToWorld(canvasX, canvasY) as [number, number];
    const anchor: [number, number] = [
      world[0] - drag.grabOffsetWorld[0],
      world[1] - drag.grabOffsetWorld[1],
    ];
    for (let i = 0; i < drag.cards.length; i++) {
      const off = drag.offsetFromPrimary[i];
      drag.cards[i].node.worldPosition = [
        anchor[0] + off[0],
        anchor[1] + off[1],
      ];
    }
  }

  private tryResolveSolitaireDropAt(canvasX: number, canvasY: number): void {
    const drag = this.solitaireDrag;
    const resolve = this.moveResolver;
    if (!drag || !resolve) {
      return;
    }

    this.applySolitaireDragAtCanvas(canvasX, canvasY);
    const pointerWorld = CORE.gfx.canvasToWorld(canvasX, canvasY) as [
      number,
      number,
    ];
    const primary = drag.cards[0];
    const cardWorldX = primary.node.worldPosition[0];
    const cardWorldY = primary.node.worldPosition[1];
    const targetTo = hitTestKlondikeDropTarget(
      (name, index) => this.getCardNode(name, index),
      cardWorldX,
      cardWorldY,
      pointerWorld[0],
      pointerWorld[1],
    );
    const move = targetTo
      ? filterKlondikeDragMoves(
          this.currentPicks.filter(
            (p) => p.from === drag.from && p.count === drag.count,
          ),
        ).find((m) => m.to === targetTo)
      : undefined;

    this.removeSolitaireCanvasDragListener();

    if (move) {
      for (const c of drag.cards) {
        c.glow = false;
      }
      this.solitaireDrag = undefined;
      this.disableSolitaireInput();
      this.moveResolver = undefined;
      this.animateSolitaireDropToTarget(drag, move).then(() => {
        this.solitairePreAnimatedMove = move;
        resolve(move);
      });
      return;
    }

    this.solitaireDrag = undefined;
    this.snapBackSolitaireDrag(drag);
  }

  private restoreSolitaireDragCardsLayout(
    cards: Card[],
    startParents: (gfx.Empty | null)[],
    startLocalPos: [number, number][],
    startDepth: number[],
  ): void {
    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const par = startParents[i];
      if (par) {
        c.parent = par;
      }
      c.node.position = [...startLocalPos[i]] as [number, number];
      c.depthGroup = startDepth[i];
    }
  }

  private cancelSolitaireDragImmediate(): void {
    const drag = this.solitaireDrag;
    if (!drag) {
      return;
    }
    this.removeSolitaireCanvasDragListener();
    for (const c of drag.cards) {
      c.glow = false;
    }
    this.restoreSolitaireDragCardsLayout(
      drag.cards,
      drag.startParents,
      drag.startLocalPos,
      drag.startDepth,
    );
    this.solitaireDrag = undefined;
  }

  private snapBackSolitaireDrag(drag: SolitaireDragLayoutSnapshot): void {
    this.solitaireSnapInProgress = true;
    const cards = drag.cards;
    for (const c of cards) {
      c.glow = false;
    }
    const fromWorld = cards.map(
      (c) =>
        [c.node.worldPosition[0], c.node.worldPosition[1]] as [number, number],
    );
    const endWorld = drag.startWorldPos;

    this.timeline
      .animate(anim.InOutQuad(0.0, 1.0), SOLITAIRE_SNAP_BACK_SECONDS, (t) => {
        for (let i = 0; i < cards.length; i++) {
          cards[i].node.worldPosition = [
            anim.easeLinear(fromWorld[i][0], endWorld[i][0], t),
            anim.easeLinear(fromWorld[i][1], endWorld[i][1], t),
          ];
        }
      })
      .after(() => {
        this.restoreSolitaireDragCardsLayout(
          cards,
          drag.startParents,
          drag.startLocalPos,
          drag.startDepth,
        );
        this.solitaireSnapInProgress = false;
      });
  }

  private disableSolitaireInput(): void {
    this.removeSolitaireCanvasDragListener();
    this.solitairePendingPress = undefined;
    for (const id of this.solitaireListenerIds) {
      CORE.input.removeListener(id);
    }
    this.solitaireListenerIds = [];
  }

  public async animateSolitaireMove(
    previousRound: RoundState,
    nextRound: RoundState,
    move: SolitairePickMove,
    movedCards?: RoundState['wastePile'],
    skipTravelAnimation = false,
    isAutoPlay = false,
  ): Promise<void> {
    const movingCards = this.getCardsForMove(move, movedCards);
    if (!skipTravelAnimation && movingCards.length > 0) {
      const destination = this.getMoveTargetWorldPosition(
        move,
        nextRound,
        movingCards.length,
      );
      const overlap = this.computeSolitaireOverlaps(nextRound);
      const promises: Promise<void>[] = [];
      for (let i = 0; i < movingCards.length; i++) {
        promises.push(
          this.animateCardWorldMove(
            movingCards[i],
            destination[0],
            destination[1] + i * overlap.faceUp,
            SOLITAIRE_AUTOPLAY_STEP_SECONDS,
          ),
        );
      }
      await Promise.all(promises);
    }
    if (
      move.from === 'STOCK' &&
      move.to === 'WASTE_PILE' &&
      movingCards.length > 0
    ) {
      const wasteTop = nextRound.wastePile[nextRound.wastePile.length - 1];
      const flipTo =
        movedCards && movedCards.length > 0
          ? movedCards[movedCards.length - 1]
          : wasteTop;
      await movingCards[movingCards.length - 1].flip(
        flipTo
          ? cardToIndex(flipTo.rank, flipTo.suit)
          : movingCards[movingCards.length - 1].cardIndex,
        0,
        SOLITAIRE_STOCK_FLIP_SECONDS,
      );
    }

    this.solitairePreAnimatedMove = undefined;
    this.renderSolitaireBoard(nextRound, {isAuto: isAutoPlay});
    await this.animateTableauRevealIfNeeded(previousRound, nextRound, move);
  }

  public consumePreAnimatedMove(move: SolitairePickMove): boolean {
    const pre = this.solitairePreAnimatedMove;
    if (!pre) {
      return false;
    }
    const matches =
      pre.from === move.from && pre.to === move.to && pre.count === move.count;
    if (matches) {
      this.solitairePreAnimatedMove = undefined;
      return true;
    }
    return false;
  }

  private getCardsForMove(
    move: SolitairePickMove,
    movedCards?: RoundState['wastePile'],
  ): Card[] {
    if (move.from === 'STOCK') {
      const stockCard = this.solitaireCardMap.get('STOCK');
      return stockCard ? [stockCard] : [];
    }
    if (move.from === 'WASTE_PILE') {
      const waste = this.solitaireCardMap.get('WASTE_PILE');
      return waste ? [waste] : [];
    }
    const stackMatch = /^STACK_(\d+)$/.exec(move.from);
    if (!stackMatch) {
      return [];
    }
    const col = parseInt(stackMatch[1], 10);
    const result: Card[] = [];
    const count = movedCards?.length ?? move.count;
    for (let i = 0; i < count; i++) {
      const key = `STACK_${col}_${Math.max(0, this.getStackFaceUpCount(col) - count + i)}`;
      const c = this.solitaireCardMap.get(key);
      if (c) {
        result.push(c);
      }
    }
    return result;
  }

  private getStackFaceUpCount(col1Based: number): number {
    let count = 0;
    while (this.solitaireCardMap.has(`STACK_${col1Based}_${count}`)) {
      count++;
    }
    return count;
  }

  private getMoveTargetWorldPosition(
    move: SolitairePickMove,
    nextRound: RoundState,
    movingCount: number,
  ): [number, number] {
    const overlap = this.computeSolitaireOverlaps(nextRound);
    if (move.to === 'WASTE_PILE') {
      return [
        this.getCardNode(CardName.SolWaste).worldPosition[0],
        this.getCardNode(CardName.SolWaste).worldPosition[1],
      ];
    }
    if (move.to === 'FOUNDATION') {
      const slot = this.findFoundationSlotForTop(nextRound);
      return [
        this.getCardNode(CardName.SolFoundation, slot).worldPosition[0],
        this.getCardNode(CardName.SolFoundation, slot).worldPosition[1],
      ];
    }
    const stackMatch = /^STACK_(\d+)$/.exec(move.to);
    if (stackMatch) {
      const col = parseInt(stackMatch[1], 10) - 1;
      const faceDown = nextRound.faceDownCounts[col];
      const faceUp = nextRound.openCards[col].length;
      const targetIndex = Math.max(0, faceUp - movingCount);
      const y =
        this.getCardNode(CardName.SolTableau, col).worldPosition[1] +
        faceDown * overlap.faceDown +
        targetIndex * overlap.faceUp;
      return [this.getCardNode(CardName.SolTableau, col).worldPosition[0], y];
    }
    const waste = this.getCardNode(CardName.SolWaste).worldPosition;
    return [waste[0], waste[1]];
  }

  private findFoundationSlotForTop(nextRound: RoundState): number {
    const top = nextRound.foundationTops[nextRound.foundationTops.length - 1];
    if (!top) {
      return 0;
    }
    for (let i = 0; i < nextRound.foundationTops.length; i++) {
      const c = nextRound.foundationTops[i];
      if (c.suit === top.suit && c.rank === top.rank) {
        return i;
      }
    }
    return 0;
  }

  private async animateCardWorldMove(
    card: Card,
    toX: number,
    toY: number,
    duration: number,
  ): Promise<void> {
    const startDepth = card.depthGroup;
    card.depthGroup = SOLITAIRE_ANIM_DEPTH_GROUP;
    const fromX = card.node.worldPosition[0];
    const fromY = card.node.worldPosition[1];
    const {promise, resolve} = voidPromise();
    this.timeline
      .animate(anim.InOutQuad(0.0, 1.0), duration, (t) => {
        card.node.worldPosition = [
          anim.easeLinear(fromX, toX, t),
          anim.easeLinear(fromY, toY, t),
        ];
      })
      .after(() => {
        card.depthGroup = startDepth;
        resolve();
      });
    await promise;
  }

  private async animateSolitaireDropToTarget(
    drag: SolitaireDragLayoutSnapshot,
    move: SolitairePickMove,
  ): Promise<void> {
    if (!this.solitaireRoundState) {
      return;
    }
    const to = this.getMoveTargetWorldPosition(
      move,
      this.solitaireRoundState,
      drag.cards.length,
    );
    const promises: Promise<void>[] = [];
    const overlap = this.computeSolitaireOverlaps(this.solitaireRoundState);
    for (let i = 0; i < drag.cards.length; i++) {
      promises.push(
        this.animateCardWorldMove(
          drag.cards[i],
          to[0],
          to[1] + i * (overlap.faceUp * SOLITAIRE_DROP_STACK_RATIO),
          SOLITAIRE_DROP_SECONDS,
        ),
      );
    }
    await Promise.all(promises);
  }

  private async animateStockToWasteMove(stockCard: Card): Promise<void> {
    const wastePos = this.getCardNode(CardName.SolWaste).worldPosition;
    await Promise.all([
      this.animateCardWorldMove(
        stockCard,
        wastePos[0],
        wastePos[1],
        SOLITAIRE_STOCK_FLIP_SECONDS,
      ),
      stockCard.flip(CARD_BACK, 0, SOLITAIRE_STOCK_FLIP_SECONDS),
    ]);
    this.solitaireStockVisualCount = Math.max(
      0,
      this.solitaireStockVisualCount - 1,
    );
  }

  private async animateTableauRevealIfNeeded(
    previousRound: RoundState,
    nextRound: RoundState,
    move: SolitairePickMove,
  ): Promise<void> {
    const fromStack = /^STACK_(\d+)$/.exec(move.from);
    if (!fromStack) {
      return;
    }
    const col = parseInt(fromStack[1], 10) - 1;
    if (
      col < 0 ||
      col >= 7 ||
      previousRound.faceDownCounts[col] <= nextRound.faceDownCounts[col] ||
      nextRound.openCards[col].length === 0
    ) {
      return;
    }
    const revealedIndex = nextRound.openCards[col].length - 1;
    const revealed = this.solitaireCardMap.get(
      `STACK_${col + 1}_${revealedIndex}`,
    );
    const topCard = nextRound.openCards[col][revealedIndex];
    if (!revealed || !topCard) {
      return;
    }
    revealed.cardIndex = CARD_BACK;
    await revealed.flip(
      cardToIndex(topCard.rank, topCard.suit),
      0,
      SOLITAIRE_STOCK_FLIP_SECONDS,
    );
  }

  private computeSolitaireOverlaps(roundState: RoundState): {
    faceDown: number;
    faceUp: number;
  } {
    const root = getNode(this.root, 'solitaire_root');
    const tableau = this.getCardNode(CardName.SolTableau, 0);
    const rootBottomY = root.size[1] * (1 - root.pivot[1]);
    const availableSpan = Math.max(
      1,
      rootBottomY - tableau.position[1] - SOLITAIRE_CARD_HALF_HEIGHT,
    );
    let overlapScale = 1;
    for (let col = 0; col < 7; col++) {
      const faceDown = roundState.faceDownCounts[col] ?? 0;
      const faceUp = roundState.openCards[col]?.length ?? 0;
      const faceDownSteps = faceUp > 0 ? faceDown : Math.max(0, faceDown - 1);
      const faceUpSteps = Math.max(0, faceUp - 1);
      const baseSpan =
        faceDownSteps * SOLITAIRE_CARD_OVERLAP_FACEDOWN +
        faceUpSteps * SOLITAIRE_CARD_OVERLAP_FACEUP;
      if (baseSpan <= 0) {
        continue;
      }
      overlapScale = Math.min(overlapScale, availableSpan / baseSpan);
    }
    overlapScale = Math.min(1, overlapScale);
    return {
      faceDown: Math.max(
        SOLITAIRE_MIN_DYNAMIC_OVERLAP,
        SOLITAIRE_CARD_OVERLAP_FACEDOWN * overlapScale,
      ),
      faceUp: Math.max(
        SOLITAIRE_MIN_DYNAMIC_OVERLAP,
        SOLITAIRE_CARD_OVERLAP_FACEUP * overlapScale,
      ),
    };
  }
}
