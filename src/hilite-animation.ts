import {gfx} from '@apila/engine';
import {anim} from '@apila/game-libraries';
import {AUTO_TICK} from './main';

export class HiliteAnimation {
  private timeline = new anim.Timeline();
  private image: gfx.NodeProperties;

  constructor(image: gfx.NodeProperties) {
    this.image = image;

    AUTO_TICK.add(this);
  }

  public hilite(
    start: number,
    stop: number,
    time: number,
    delay = 0,
    pingPong = false
  ): void {
    this.image.visible = true;
    this.image.opacity = start;

    if (pingPong) {
      this.timeline
        .animate(anim.Linear(0, 1), time * 2, (t) => {
          const i = 0.5 - 0.5 * Math.cos(t * Math.PI * 2);
          this.image.opacity = (1 - i) * start + i * stop;
        })
        .delay(delay)
        .loop();
    } else {
      this.timeline
        .animate(
          anim.Linear(start, stop),
          time,
          anim.Property(this.image, 'opacity')
        )
        .delay(delay);
    }
  }

  public update(delta: number): void {
    this.timeline.tick(delta);
  }
}
