import {gfx} from '@apila/engine';
import {anim} from '@apila/game-libraries';
import {AUTO_TICK} from './main';

export class AnimatedImage {
  private timeline = new anim.Timeline();

  private sprite: gfx.Sprite;
  private images: string[];
  private fps: number;

  private frameIndex = 0;

  private length = 0;
  private frames: number[] = [];
  private startIndex = 0;
  private loops = 0;

  private playing = false;
  private timer = 0;

  constructor(sprite: gfx.Sprite, images: string[], fps: number) {
    this.sprite = sprite;
    this.images = images;
    this.fps = fps;

    AUTO_TICK.add(this);
  }

  public playAnimation(
    length: number,
    frames: number[],
    startIndex = 0,
    loops = 1
  ): void {
    this.timer = 0;
    this.playing = true;

    this.length = length;
    this.frames = frames;
    this.startIndex = startIndex;
    this.loops = loops;

    if (this.startIndex >= 0 && this.startIndex < this.length) {
      this.frameIndex = this.startIndex;
    } else {
      this.frameIndex = 0;
    }

    this.sprite.image = this.images[this.frames[this.frameIndex]];
  }

  public update(delta: number): void {
    this.timeline.tick(delta);

    if (this.playing) {
      this.timer += delta;

      if (this.timer > 1 / this.fps) {
        this.timer = 0;

        if (++this.frameIndex < this.length) {
          this.sprite.image = this.images[this.frames[this.frameIndex]];
        } else if (--this.loops !== 0) {
          this.sprite.image = this.images[this.frames[(this.frameIndex = 0)]];
        } else {
          this.playing = false;
        }
      }
    }
  }
}
