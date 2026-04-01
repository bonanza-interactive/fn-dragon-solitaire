import {gfx} from '@apila/engine';

type Callback = () => void;

export class TimedEvent {
  private duration: number;
  private startTime: number;
  private onDone: Callback;
  private _running: boolean;

  constructor(duration: number, onDone: Callback) {
    this.duration = duration;
    this.onDone = onDone;
    this.startTime = UNSET_START_TIME;
    this._running = true;
  }

  public update(time: gfx.Time): void {
    if (this._running) {
      if (this.startTime === UNSET_START_TIME) {
        this.startTime = time.elapsed;
      }

      if (time.elapsed > this.startTime + this.duration) {
        this._running = false;
        this.onDone();
      }
    }
  }

  public isRunning(): boolean {
    return this._running;
  }

  public cancel(): void {
    this._running = false;
  }

  public stop(): void {
    this.duration = 0;
  }
}

const UNSET_START_TIME = -1;

export class GameTimer {
  private events: TimedEvent[] = [];

  // Invokes the callback method in time seconds.
  public invoke(time: number, onDone: Callback): TimedEvent {
    const event = new TimedEvent(time, onDone);
    this.events.push(event);
    return event;
  }

  public update(time: gfx.Time): void {
    for (let i = this.events.length - 1; i >= 0; --i) {
      const event = this.events[i];

      event.update(time);

      if (event.isRunning() === false) {
        this.events.splice(i, 1);
      }
    }
  }
}
