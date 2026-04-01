import {gfx, input} from '@apila/engine';

import {CORE, GAME} from './game';

export class PaytableButton {
  private listenerId: number;
  private sprite: gfx.Sprite;
  private isHover = false;
  public isPaytableVisible = true;

  public constructor(sprite: gfx.Sprite) {
    this.sprite = sprite;
    this.listenerId = CORE.input.listenNode(this.sprite, (event) => {
      this.handleInput(event.type);
    });
    this.updateImage();
  }

  public show(): void {
    this.sprite.visible = true;
    if (this.isPaytableVisible) {
      GAME.paytable.show();
    } else {
      GAME.paytable.hide();
    }
  }

  public hide(): void {
    this.sprite.visible = false;
    GAME.paytable.hide();
  }

  private handleInput(type: input.EventType): void {
    switch (type) {
      case input.EventType.ENTER:
        this.isHover = true;
        this.updateImage();
        break;
      case input.EventType.EXIT:
        this.isHover = false;
        this.updateImage();
        break;
      case input.EventType.PRESS:
        this.onPress();
        break;
      case input.EventType.RELEASE:
        break;
      default:
        break;
    }
  }

  private onPress(): void {
    CORE.fx.trigger('fx_button_ui');
    this.isPaytableVisible = !this.isPaytableVisible;
    if (this.isPaytableVisible) {
      GAME.paytable.show();
    } else {
      GAME.paytable.hide();
    }
    this.updateImage();
  }

  public updateImage(): void {
    if (this.isPaytableVisible) {
      this.sprite.image = this.isHover
        ? 'wintable_2_button_active'
        : 'wintable_2_button';
    } else {
      this.sprite.image = this.isHover
        ? 'wintable_button_active'
        : 'wintable_button';
    }
  }
}
