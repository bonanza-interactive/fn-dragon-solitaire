import {gfx, input} from '@apila/engine';
import {findAllImages} from './image-atlas';
import {CORE} from './game';

enum State {
  DISABLED = 0,
  ACTIVE = 1,
  PRESSED = 2,
}

type ButtonCallback = () => void;

export class Button {
  private images: string[];
  public sprite: gfx.Sprite;
  private cbId: number | null = null;
  private pressed = false;

  constructor(prefix: string) {
    this.images = findAllImages(prefix);
    this.sprite = CORE.gfx.createSprite();
    this.sprite.pivot = [0.5, 0.5];
    this.sprite.image = this.images[State.DISABLED];
  }

  public activate(cb: ButtonCallback): void {
    this.sprite.image = this.images[State.ACTIVE];
    this.cbId = CORE.input.listenNode(
      this.sprite,
      async (e: input.InputEvent) => {
        if (e.type === input.EventType.PRESS) {
          this.pressed = true;
          this.sprite.image = this.images[State.PRESSED];
        } else if (e.type === input.EventType.RELEASE && this.pressed) {
          this.pressed = false;
          this.sprite.image = this.images[State.ACTIVE];
          cb();
        } else if (e.type === input.EventType.EXIT) {
          this.pressed = false;
          this.sprite.image = this.images[State.ACTIVE];
        }
      }
    );
  }

  public disable(): void {
    this.pressed = false;
    this.sprite.image = this.images[State.DISABLED];
    if (this.cbId !== null) CORE.input.removeListener(this.cbId);
    this.cbId = null;
  }

  set parent(parent: gfx.NodeProperties) {
    this.sprite.parent = parent;
  }

  set visible(visible: boolean) {
    this.disable();
    this.sprite.visible = visible;
  }
}
