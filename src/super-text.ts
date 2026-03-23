import {gfx} from '@apila/engine';
import {ScaleImage} from './scale-image';
import {HiliteAnimation} from './hilite-animation';
import {MoveAnimation} from './move-animation';
import {WebfontSprite} from './webfont/sprite';
import {GAME} from './game';
import {FONT, FONT_STYLE} from './webfont/config';
import {LOCALIZER} from './framework';

export class SuperText {
  private text: WebfontSprite;

  private hiliteImage: HiliteAnimation;
  private scaleImage: ScaleImage;
  private moverImage: MoveAnimation;

  constructor(textSprite: gfx.Sprite) {
    this.text = new WebfontSprite(
      GAME.canvasTextBuilder,
      textSprite,
      FONT.superText,
      FONT_STYLE.superText
    );
    this.text.text = LOCALIZER.get('super_rounds');

    this.hiliteImage = new HiliteAnimation(this.text.sprite);
    this.scaleImage = new ScaleImage(this.text.sprite);
    this.moverImage = new MoveAnimation(this.text.sprite);
  }

  public move(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    time: number,
    delay = 0
    //pingPong: boolean = false
  ): void {
    this.text.visible = true;
    this.moverImage.move(x1, y1, x2, y2, time, delay);
  }

  public pulse(min: number, max: number, time: number, delay: number): void {
    this.text.visible = true;
    this.scaleImage.pulse(min, max, time, delay);
  }

  public hilite(
    start: number,
    stop: number,
    time: number,
    delay: number
    //pingPong: boolean = false
  ): void {
    this.text.visible = true;
    this.hiliteImage.hilite(start, stop, time, delay);
  }
}
