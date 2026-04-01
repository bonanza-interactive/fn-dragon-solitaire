import {gfx} from '@apila/engine';
import {anim} from '@apila/game-libraries';

export class DimLayer {
  private timeline = new anim.Timeline();
  private sprite: gfx.Sprite;
  private playback?: anim.Playback;

  constructor(node: gfx.Sprite) {
    this.sprite = node;
  }

  public dim(time: number, amount: number): void {
    this.timeline.tick(999);

    this.sprite.visible = true;
    if (this.playback !== undefined) {
      this.playback.remove();
    }

    this.playback = this.timeline.animate(
      anim.Linear(0, amount),
      time,
      anim.Property(this.sprite, 'opacity'),
    );
  }

  public clear(time: number): void {
    this.timeline.tick(999);

    if (this.playback !== undefined) {
      this.playback.remove();
    }

    this.playback = this.timeline
      .animate(
        anim.Linear(this.sprite.opacity, 0),
        time,
        anim.Property(this.sprite, 'opacity'),
      )
      .after(() => {
        this.sprite.visible = false;
      });
  }

  public update(delta: number): void {
    this.timeline.tick(delta);
  }
}
