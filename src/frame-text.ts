import {gfx} from '@apila/engine';
import {anim} from '@apila/game-libraries';
import {AUTO_TICK} from './main';

export class FrameText {
  private text: gfx.BitmapText;
  private visible = false;
  private timeline = new anim.Timeline();
  private animating = false;

  constructor(textNode: gfx.BitmapText) {
    this.text = textNode;
  }

  public setText(text: string, duration = 0.4): void {
    this.visible = true;
    this.text.visible = false;
    this.text.text = text;

    if (duration > 0.0) {
      this.clearTimeline();
      this.animating = true;

      AUTO_TICK.add(this.timeline);
      this.timeline.animate(
        anim.Linear(this.text.opacity, 1),
        duration,
        anim.Property(this.text, 'opacity')
      );
    }

    this.updateText();
  }

  public hide(duration = 0.2): void {
    if (this.visible) {
      if (duration > 0.0) {
        this.clearTimeline();
        this.animating = true;

        AUTO_TICK.add(this.timeline);
        this.timeline
          .animate(
            anim.Linear(this.text.opacity, 0),
            duration,
            anim.Property(this.text, 'opacity')
          )
          .after(() => {
            this.animating = false;
            this.visible = false;
            this.text.visible = false;
          });
      } else {
        this.visible = false;
        this.text.visible = false;
      }
    }
  }

  private updateText(): void {
    this.text.visible = this.visible;
  }

  private clearTimeline(): void {
    if (this.animating) {
      this.timeline = new anim.Timeline();
      this.animating = false;
    }
  }
}
