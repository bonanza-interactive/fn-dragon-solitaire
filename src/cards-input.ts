import {input} from '@apila/engine';

import {Card} from './card';
import {GameConfig} from './config/config';
import {CORE, GAME} from './game';
import {wait} from './util/utils';
import {GAMEFW} from './framework';
import {setButtonState} from './button-state-handler';
import {CLIENT_STATE} from './main';

export class CardsInput {
  constructor() {}

  private listenerIds: number[] = [];
  private selectedCards: number[] = [];

  private minSelection = 2;
  private maxSelection = 6;

  private pressCard = -1;
  private isFreespins = false;

  public startSelection(cards: Card[], isFreespins: boolean) {
    this.selectedCards = [];
    this.pressCard = -1;
    this.isFreespins = isFreespins;

    this.minSelection = isFreespins
      ? GameConfig.gameConfig.freespin.minSelections
      : GameConfig.gameConfig.basegame.minSelections;

    this.maxSelection = isFreespins
      ? GameConfig.gameConfig.freespin.maxSelections
      : GameConfig.gameConfig.basegame.maxSelections;

    this.enableInput(cards, isFreespins);
  }

  public getSelectedCount(): number {
    return this.selectedCards.length;
  }

  public getSelected(): number[] {
    return this.selectedCards;
  }

  public endSelection(): number[] {
    this.disableInput();
    return this.selectedCards;
  }

  public async swapSelected(
    cards: Card[],
    selected: number[],
    skipDelayCount = 0,
  ): Promise<void> {
    const oldCount = this.selectedCards.length;
    const newCount = selected.length;
    if (oldCount !== newCount) {
      GAME.paytable.updateContent(newCount, this.isFreespins);
    }
    for (const cardIndex of this.selectedCards) {
      cards[cardIndex].glow = false;
    }
    this.selectedCards = selected;
    for (const cardIndex of this.selectedCards) {
      cards[cardIndex].glow = true;
      cards[cardIndex].bounce(0.5);
      CORE.fx.trigger('fx_keno_card_select');
      if (skipDelayCount > 0) {
        --skipDelayCount;
      } else {
        await wait(30);
      }
    }
  }

  public enableInput(cards: Card[], isFreespin: boolean): void {
    for (let i = 0; i < cards.length; ++i) {
      const listenerId = CORE.input.listenNode(
        cards[i].inputNode,
        (e: input.InputEvent) => {
          switch (e.type) {
            case input.EventType.ENTER:
              if (CORE.input.isPointerDown()) {
                this.toggleCardSelected(cards, i, isFreespin, true);
              }
              break;
            case input.EventType.PRESS:
              this.toggleCardSelected(cards, i, isFreespin, false);
              break;
            case input.EventType.RELEASE: {
              break;
            }
            default:
              break;
          }
        },
        'pointer',
      );
      this.listenerIds.push(listenerId);
    }
  }

  private toggleCardSelected(
    cards: Card[],
    cardIndex: number,
    isFreespin: boolean,
    isMousePointerDown: boolean,
  ) {
    const oldCount = this.selectedCards.length;
    const selectedIx = this.selectedCards.indexOf(cardIndex);
    if (selectedIx === -1) {
      if (this.selectedCards.length < this.maxSelection) {
        this.selectedCards.push(cardIndex);
        cards[cardIndex].glow = true;
        cards[cardIndex].light = true;
        cards[cardIndex].undim();
        cards[cardIndex].bounce(0.5);

        if (!isFreespin) {
          CORE.fx.trigger('music_keno_active');
        }
        CORE.fx.trigger('fx_keno_card_select');
      } else {
        if (!isMousePointerDown) {
          GAME.cardPickGui.shake();
          CORE.fx.trigger('fx_keno_select_max');
        }
      }
    } else {
      this.selectedCards.splice(selectedIx, 1);
      cards[cardIndex].glow = false;
      cards[cardIndex].light = false;
      cards[cardIndex].killEffects();
      cards[cardIndex].dim();
      cards[cardIndex].bounce(0.15);

      CORE.fx.trigger('fx_keno_unselect');
    }

    const newCount = this.selectedCards.length;
    // if (newCount !== oldCount) {
    //   const play = this.isFreespins
    //     ? newCount >= this.minSelection
    //       ? UiState.Blink
    //       : UiState.Inactive
    //     : PLATFORM.isPlayAllowed()
    //       ? PLATFORM.isCabinet
    //         ? PLATFORM.getPlayerMoney() >= CORE.sui.smallestBet
    //           ? newCount >= this.minSelection
    //             ? UiState.Blink
    //             : UiState.Inactive
    //           : UiState.Inactive
    //         : newCount >= this.minSelection
    //           ? UiState.Blink
    //           : UiState.Inactive
    //       : UiState.Inactive;
    //   const payout =
    //     PLATFORM.isPayoutAllowed() && PLATFORM.isSessionActive()
    //       ? UiState.Active
    //       : UiState.Inactive;
    //   const exitGame = PLATFORM.isExitGameAllowed()
    //     ? UiState.Active
    //     : UiState.Inactive;

    //   setUiState({
    //     ...UI_DEFAULT,
    //     play,
    //     bet: this.isFreespins ? UiState.Inactive : UiState.Active,
    //     payout,
    //     exitGame,
    //     user_return_to_selection:
    //       newCount > 0 ? UiState.Active : UiState.Inactive,
    //     user_swap_selected: UiState.Active,
    //   });
    // }
    setButtonState('return_to_selection', newCount > 0, true);
    setButtonState('swap_selected', true, true);
    if (newCount !== oldCount) {
      if (newCount >= this.minSelection) {
        GAMEFW.inputs(CLIENT_STATE.roundInProgress ? 'continue' : 'play');
      } else {
        GAMEFW.inputs();
      }
      GAME.paytable.updateContent(newCount, this.isFreespins);
    }
  }

  public disableInput(): void {
    for (const id of this.listenerIds) {
      CORE.input.removeListener(id);
    }
    this.listenerIds = [];
  }

  public async doGambleInput(cards: Card[]): Promise<number> {
    return new Promise((resolve) => {
      for (let i = 0; i < cards.length; ++i) {
        const listenerId = CORE.input.listenNode(
          cards[i].node,
          (e: input.InputEvent) => {
            if (e.type === input.EventType.PRESS) {
              resolve(i);
              this.disableInput();
            }
          },
          'pointer',
        );
        this.listenerIds.push(listenerId);
      }
    });
  }
}
