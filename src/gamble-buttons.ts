import {gfx} from '@apila/engine';
import {MoveAnimation} from './move-animation';
import {getBitmapText, getNode} from './util/utils-node';
import {findAllImages} from './image-atlas';
import {GameConfig} from './config/config';
import {LOCALIZER} from './framework';
import {assert} from './util/assert';
import {CORE} from './game';
// import {GAMBLE_BUTTON_SHOW_TIME} from './states';
import {
  bindButtonListeners,
  setPickedGambleButton,
  unbindButtonListeners,
} from './button-state-handler';

const BUTTON_TEXT_MAX_SIZE = 150;

const gambleButtons = ['lo', 'b7', 'hi'] as const;
type GambleButton = (typeof gambleButtons)[number];

const SELECTION_TO_BUTTON: Record<string, GambleButton> = {
  ['low']: 'lo',
  ['black_seven']: 'b7',
  ['high']: 'hi',
};

export class GambleButtons {
  private movers: {
    lo: MoveAnimation;
    b7: MoveAnimation;
    hi: MoveAnimation;
  };

  private images: {
    lo: string[];
    b7: string[];
    hi: string[];
  };

  private multiplier: {
    lo: number;
    b7: number;
    hi: number;
  };

  private multiplierTexts: {
    lo: gfx.BitmapText;
    b7: gfx.BitmapText;
    hi: gfx.BitmapText;
  };

  private texts: {
    lo: gfx.BitmapText;
    b7: gfx.BitmapText;
    hi: gfx.BitmapText;
  };

  private values: {
    lo: gfx.BitmapText;
    b7: gfx.BitmapText;
    hi: gfx.BitmapText;
  };

  constructor(root: gfx.NodeProperties) {
    this.movers = {
      lo: new MoveAnimation(getNode(root, 'gamble_low_node')),
      b7: new MoveAnimation(getNode(root, 'gamble_black_seven_node')),
      hi: new MoveAnimation(getNode(root, 'gamble_high_node')),
    };

    this.images = {
      lo: findAllImages('dbl_lo_button'),
      b7: findAllImages('dbl_b7_button'),
      hi: findAllImages('dbl_hi_button'),
    };

    this.multiplier = {
      lo:
       0,
      b7:0,
      hi:0,
    };

    this.multiplierTexts = {
      lo: getBitmapText(root, 'gamble_lo_multiplier'),
      b7: getBitmapText(root, 'gamble_b7_multiplier'),
      hi: getBitmapText(root, 'gamble_hi_multiplier'),
    };

    this.texts = {
      lo: getBitmapText(root, 'gamble_lo_text'),
      b7: getBitmapText(root, 'gamble_b7_text'),
      hi: getBitmapText(root, 'gamble_hi_text'),
    };

    this.values = {
      lo: getBitmapText(root, 'gamble_lo_value'),
      b7: getBitmapText(root, 'gamble_b7_value'),
      hi: getBitmapText(root, 'gamble_hi_value'),
    };

    this.updateMultipliers(false);
    this.setGambleButtonTexts();
  }

  public getImages(button: GambleButton): string[] {
    return this.images[button];
  }

  public updateMultipliers(bonus: boolean): void {
    const color = bonus ? 'e20000' : '06c503';
    for (const button of gambleButtons) {
      const multiplierText = this.multiplierTexts[button];
      const multiplier = this.multiplier[button].toString();

      multiplierText.text = `{${color}}${LOCALIZER.get('gamble_multi', multiplier)}`;
    }
  }

  public setStake(selection: string, stake: number): void {
    const button = SELECTION_TO_BUTTON[selection];
    assert(button !== undefined, `No button found for selection: ${selection}`);

    const elements = this.getButtonElements(button);
    elements.value.text = LOCALIZER.money(elements.multiplier * stake);

    // Set maximum size for text
    const size = elements.value.size[0];

    let scale = 1;
    if (size > BUTTON_TEXT_MAX_SIZE) {
      scale = BUTTON_TEXT_MAX_SIZE / size;
    }
    elements.value.scale = [scale, scale];
  }

  public hideButton(animate: boolean, selection: string): void {
    const button = SELECTION_TO_BUTTON[selection];
    assert(button !== undefined, `No button found for selection: ${selection}`);

    const elements = this.getButtonElements(button);
    const to = CORE.gfx.normalizedCanvasToWorld(0.5, 1);

    if (!elements.mover.node.visible) return;

    if (animate) {
      // elements.mover.move(0, 0, to[0], to[1], GAMBLE_BUTTON_SHOW_TIME);
      // CORE.gameTimer.invoke(GAMBLE_BUTTON_SHOW_TIME, () => {
      //   elements.mover.node.visible = false;
      // });
    } else {
      elements.mover.set(to[0], to[1]);
      elements.mover.node.visible = false;
    }
  }

  public showButton(animate: boolean, selection: string): void {
    const button = SELECTION_TO_BUTTON[selection];
    assert(button !== undefined, `No button found for selection: ${selection}`);

    const elements = this.getButtonElements(button);

    if (animate) {
      const from = CORE.gfx.normalizedCanvasToWorld(0.5, 1);
      // elements.mover.move(from[0], from[1], 0, 0, GAMBLE_BUTTON_SHOW_TIME);
    } else {
      elements.mover.set(0, 0);
    }
  }

  public enableButtons(buttons: string[]): void {
    bindButtonListeners(buttons.map((id) => `gamble_${id}`));
  }

  public disableButtons(buttons: string[]): void {
    unbindButtonListeners(buttons.map((id) => `gamble_${id}`));
  }

  public highlightPick(buttons: string[], pick: string): void {
    setPickedGambleButton(
      buttons.map((id) => `gamble_${id}`),
      `gamble_${pick}`
    );
  }

  private setGambleButtonTexts(): void {
    for (const button of gambleButtons) {
      const text = this.texts[button];
      text.text = LOCALIZER.get(`gamble_${button}`);

      // Set maximum size for text
      const size = text.size[0];

      let scale = 1;
      if (size > BUTTON_TEXT_MAX_SIZE) {
        scale = BUTTON_TEXT_MAX_SIZE / size;
      }
      text.scale = [scale, scale];
    }
  }

  private getButtonElements(button: GambleButton): {
    multiplier: number;
    value: gfx.BitmapText;
    mover: MoveAnimation;
  } {
    return {
      multiplier: this.multiplier[button],
      value: this.values[button],
      mover: this.movers[button],
    };
  }
}
