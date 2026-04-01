import {gfx} from '@apila/engine';
import {anim} from '@apila/game-libraries';
import {AUTO_TICK} from './main';
import {LOCALIZER} from './framework';

export class FrameText {
  private text: gfx.BitmapText;
  //private name: string;
  //private shortcuts: { key: string; tokens: TokenMap }[];
  private visible = false;
  private timeline = new anim.Timeline();
  private animating = false;

  constructor(textNode: gfx.BitmapText) {
    this.text = textNode;
  }

  public setText(
    textData: {key: string; params: string[]},
    duration = 0.4,
  ): void {
    this.visible = true;
    this.text.visible = false;
    this.text.text = LOCALIZER.get(textData.key, ...textData.params);

    if (duration > 0.0) {
      this.clearTimeline();
      this.animating = true;

      AUTO_TICK.add(this.timeline);
      this.timeline.animate(
        anim.Linear(this.text.opacity, 1),
        duration,
        anim.Property(this.text, 'opacity'),
      );
    }

    this.updateText();
  }

  public setTextString(t: string): void {
    this.text.text = t;
    this.visible = true;
    this.text.visible = false;
    this.clearTimeline();
    this.animating = true;

    AUTO_TICK.add(this.timeline);
    this.timeline.animate(
      anim.Linear(this.text.opacity, 1),
      0.4,
      anim.Property(this.text, 'opacity'),
    );
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
            anim.Property(this.text, 'opacity'),
          )
          .after(() => {
            this.animating = false;
            this.visible = false;
            this.text.visible = false;
            // CORE.localization.unbind(this.text);
          });
      } else {
        this.visible = false;
        this.text.visible = false;
        // CORE.localization.unbind(this.text);
      }
    }
  }

  private updateText(): void {
    const maxScrollSize = 620;
    const scale = Math.min(1, maxScrollSize / this.text.size[0]);
    this.text.scale = [scale, scale];
    this.text.visible = this.visible;
  }

  private clearTimeline(): void {
    if (this.animating) {
      this.timeline = new anim.Timeline();
      this.animating = false;
    }
  }
}
