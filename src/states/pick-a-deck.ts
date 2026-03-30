import {input} from '@apila/engine';
import {CORE, GAME} from '../game';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import {Result} from './result';
import {BackendUtil} from '../util/backend-util';
import {assert, assertDefined} from '../util/assert';
import {Actions} from '../config/backend-types';
import {wait} from '../util/utils';
import {findAction} from '../util/replay-util';
import {customInput, nextInput} from '../forward-input';

export class PickADeck extends State<StateMachineRoundData> {
  private swapping = false;

  public async run(data: StateMachineRoundData): Promise<AnyState> {
    console.log('data:', data);
    // if (data.round.allowSwap) {
    //   GAME.swapButton.visible = true;
    //   GAME.swapButton.activate(() => this.swapCards(this));
    // }

    GAME.cards.cardHilite('left');
    GAME.cards.cardHilite('right');

    //@fixme selecting deck will break reveal animation if selection is done
    //       during swap animation, animation states should probably be
    //       independent from each other

    let roundResult: StateMachineRoundData;
    if (CLIENT_STATE.replay) {
      const {
        roundState,
        params: {swap, pick},
      } = findAction(CLIENT_STATE.replay, Actions.PICK);

      if (swap !== CLIENT_STATE.swap) {
        await wait(1000);
        await this.swapCards(this);
      }
      CLIENT_STATE.deckSelect = pick;
      CLIENT_STATE.swap = swap;
      roundResult = {
        bet: CLIENT_STATE.replay.bet,
        round: assertDefined(roundState),
      };
      await wait(1000);
      GAME.swapButton.visible = false;
    } else {
      CLIENT_STATE.deckSelect = await this.selectCard();
      GAME.swapButton.visible = false;
      roundResult = await BackendUtil.pick(
        CLIENT_STATE.deckSelect,
        CLIENT_STATE.swap
      );
    }

    GAME.cards.disableCardHilites();

    GAME.cards.selectCards(CLIENT_STATE.deckSelect === 1);

    return new Result(roundResult);
  }

  private async swapCards(pickadeck: PickADeck): Promise<void> {
    this.swapping = true;

    GAME.swapButton.disable();
    await GAME.cards.swapCards();

    CLIENT_STATE.swap = !CLIENT_STATE.swap;

    GAME.swapButton.activate(() => pickadeck.swapCards(pickadeck));
    this.swapping = false;
  }

  private async selectCard(): Promise<number> {
    let left = 0;
    let right = 0;
    let leftWasPressed = false;
    let rightWasPressed = false;
    const cleanUp = () => {
      CORE.input.removeListener(left);
      CORE.input.removeListener(right);
    };
    left = CORE.input.listenNode(
      GAME.cards.cardSelectionNode('left'),
      (e: input.InputEvent) => {
        if (e.type === input.EventType.PRESS && !this.swapping) {
          leftWasPressed = true;
        } else if (e.type === input.EventType.EXIT) {
          leftWasPressed = false;
        } else if (e.type === input.EventType.RELEASE && leftWasPressed) {
          if (this.swapping) {
            leftWasPressed = false;
            return;
          }

          customInput('custom/pick0');
        }
      },
      'pointer'
    );
    right = CORE.input.listenNode(
      GAME.cards.cardSelectionNode('right'),
      (e: input.InputEvent) => {
        if (e.type === input.EventType.PRESS && !this.swapping) {
          rightWasPressed = true;
        } else if (e.type === input.EventType.EXIT) {
          rightWasPressed = false;
        } else if (e.type === input.EventType.RELEASE && rightWasPressed) {
          if (this.swapping) {
            rightWasPressed = false;
            return;
          }

          customInput('custom/pick1');
        }
      },
      'pointer'
    );

    const pickAction = await nextInput();
    cleanUp();
    const pick = Number.parseInt(pickAction.slice('custom/pick'.length), 10);
    assert(pick >= 0 && pick < 2);
    return pick;
  }
}
