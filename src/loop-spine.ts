import {Spine} from '@apila/engine/dist/apila-gfx';
import {
  AnimationStateListener,
  Event,
  EventTimeline,
  Physics,
  TrackEntry,
} from '@apila/spine';

export class LoopSpine implements AnimationStateListener {
  public spine: Spine;
  private trackEntry?: TrackEntry;
  private loopStart = 0;
  private loopEnd = 0;

  private animationName: string;
  private eventStart: string;
  private eventEnd: string;

  private hideAfterEnd: false;

  constructor(
    spine: Spine,
    animationName: string,
    eventStart: string,
    eventEnd: string,
    hideAfterEnd: false,
  ) {
    this.spine = spine;
    this.spine.state.addListener(this);
    this.animationName = animationName;
    this.eventStart = eventStart;
    this.eventEnd = eventEnd;
    this.hideAfterEnd = hideAfterEnd;

    const anim = this.spine.skeleton.data.findAnimation(this.animationName);

    //store the looping part of the animation based on events in the animation
    for (const timeline of anim.timelines) {
      const eventTimeline = timeline as EventTimeline;
      if (eventTimeline.events !== undefined) {
        for (const event of eventTimeline.events) {
          if (event.data.name === this.eventStart) {
            this.loopStart = event.time;
          } else if (event.data.name === this.eventEnd) {
            this.loopEnd = event.time;
          }
        }
      }
    }
  }

  public startLoop(trackId?: number): void {
    this.spine.visible = true;
    this.trackEntry = this.spine.state.setAnimation(
      trackId ?? 0,
      this.animationName,
      true,
    );
    this.trackEntry.animationEnd = this.loopEnd;
  }

  public endLoop(): void {
    if (this.trackEntry !== undefined && this.trackEntry.animation !== null) {
      this.trackEntry.animationEnd = this.trackEntry.animation.duration;

      /*
      'trackTime' is how long the track has been playing, loops included.
      We're about to disable looping, so 'trackTime' needs to be less than
      the animation's duration or the animation will end instantly.
      */

      if (this.trackEntry.trackTime > this.loopStart && this.trackEntry.loop) {
        this.trackEntry.trackTime =
          this.trackEntry.trackTime % (this.loopEnd - this.loopStart);
      }
      this.trackEntry.loop = false;
    }
  }

  public complete(_entry: TrackEntry): void {
    if (this.trackEntry !== undefined && !this.trackEntry.loop) {
      this.trackEntry = undefined;

      if (this.hideAfterEnd) {
        this.spine.visible = false;
      }
    }
  }
  public event(entry: TrackEntry, event: Event): void {
    if (event.data.name === this.eventStart) {
      if (this.trackEntry !== undefined && !this.trackEntry.isComplete()) {
        /*
        When 'loop_start' is reached for the first time, cut the animation
        just to the looping part.
        */
        this.trackEntry.animationStart = this.loopStart;
        this.trackEntry.trackTime -= this.loopStart;
      }
    }
  }

  public update(t: number): void {
    this.spine.update(t, Physics.none);
  }
}
