import {gfx} from '@apila/engine';

import {
  bindButtonListeners,
  registerButton,
  setButtonState,
  unbindButtonListeners,
} from './button-state-handler';
import {CORE, GAME} from './game';
import {MetaType, isMeta} from './types';
import {getNode} from './util/utils-node';
import {EventType} from '@apila/engine/dist/apila-input';
import {CLIENT_STATE} from './main';
type button = {
  id: string;
  enabledInSelection: boolean;
};

export class CardChangeButtons {
  private readonly root: gfx.NodeProperties;
  private readonly buttonIds: button[] = [];
  private swapSelectedInputId = -1;
  private returnToSelectionInputId = -1;
  private selectionsDone = true;

  public constructor(parent: gfx.NodeProperties) {
    this.root = parent;
  }

  public register(buttonId: string, enabledInSelection: boolean): void {
    const buttonNode = getNode(this.root, buttonId) as gfx.Sprite;
    const metaCache = GAME.nodeStorage.baseGame.metaCache;
    const meta = metaCache.get(buttonId);
    if (isMeta(meta, MetaType.Button)) {
      registerButton({
        node: buttonNode,
        meta,
        state: {
          active: true,
          hover: false,
          pressed: false,
          highlight: false,
        },
      });
    }
    this.buttonIds.push({id: buttonId, enabledInSelection});
  }

  private bindChangeButtonListeners(
    buttonId: string,
    isFreeSpin?: boolean,
  ): void {
    if (CLIENT_STATE.replay) {
      return;
    }
    const buttonNode = getNode(this.root, buttonId) as gfx.Sprite;
    if (buttonId === 'swap_selected') {
      this.swapSelectedInputId = CORE.input.listenNode(
        buttonNode,
        async (e) => {
          if (this.selectionsDone && e.type === EventType.RELEASE) {
            this.selectionsDone = false;
            await GAME.cards.selectRandom(isFreeSpin);
            this.selectionsDone = true;
          }
        },
      );
    } else if (buttonId === 'return_to_selection') {
      this.returnToSelectionInputId = CORE.input.listenNode(buttonNode, (e) => {
        if (this.selectionsDone && e.type === EventType.RELEASE) {
          GAME.cards.clearSelected();
        }
      });
    }
  }

  public changeSwapSelectedListener(): void {
    const buttonNode = getNode(this.root, 'swap_selected') as gfx.Sprite;
    CORE.input.removeListener(this.swapSelectedInputId);
    this.swapSelectedInputId = CORE.input.listenNode(buttonNode, async (e) => {
      if (this.selectionsDone && e.type === EventType.RELEASE) {
        setButtonState('return_to_selection', false, true);
        setButtonState('swap_selected', false, true);
        this.selectionsDone = false;
        await GAME.cards.randomizeHand();
        this.selectionsDone = true;
        setButtonState('return_to_selection', true, true);
        setButtonState('swap_selected', true, true);
      }
    });
  }

  public enable(isSelection = false, isFreeSpin = false): void {
    for (const button of this.buttonIds) {
      if (!isSelection || button.enabledInSelection) {
        bindButtonListeners([button.id]);
        this.bindChangeButtonListeners(button.id, isFreeSpin);
      }
    }
  }

  public disable(isSelection = false): void {
    if (this.swapSelectedInputId !== -1) {
      CORE.input.removeListener(this.swapSelectedInputId);
    }
    if (this.returnToSelectionInputId !== -1) {
      CORE.input.removeListener(this.returnToSelectionInputId);
    }
    for (const button of this.buttonIds) {
      if (!isSelection || button.enabledInSelection) {
        unbindButtonListeners([button.id]);
      }
    }
  }
}
