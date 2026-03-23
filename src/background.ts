import {gfx} from '@apila/engine';
import {anim} from '@apila/game-libraries';
import {HiliteAnimation} from './hilite-animation';
import {getSprite} from './util/utils-node';

export class Background {
  private timeline = new anim.Timeline();
  private superSprites: gfx.Sprite[] = [];
  private animations: HiliteAnimation[] = [];

  constructor(root: gfx.NodeProperties) {
    this.superSprites.push(getSprite(root, 'bg_red'));
    this.superSprites.push(getSprite(root, 'coins_left_red'));
    this.superSprites.push(getSprite(root, 'coins_right_red'));
    for (const s of this.superSprites) {
      this.animations.push(new HiliteAnimation(s));
    }
  }

  public hilite(start: number, stop: number, time: number, delay = 0): void {
    for (const a of this.animations) {
      a.hilite(start, stop, time, delay);
    }
  }

  public setVisible(visible: boolean): void {
    for (const s of this.superSprites) {
      s.visible = visible;
    }
  }

  public update(delta: number): void {
    this.timeline.tick(delta);
  }
}
