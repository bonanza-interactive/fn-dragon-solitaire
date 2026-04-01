/**
 * Timer tied to request animation frame.
 * Runs in sync with the engines rendering.
 */
export class RafTimer {
  private static active: Array<RafTimer> = [];

  /**
   * Step forward with given time delta.
   * @param delta Time delta in seconds.
   */
  public static doStep(delta: number): void {
    const remove: Array<RafTimer> = [];
    const ended: Array<RafTimer> = [];

    this.active.forEach((t) => {
      if (!t.paused) {
        t.trackTime -= delta;
        if (t.trackTime <= 0) {
          if (t.once) remove.push(t);
          else t.trackTime += t.time;
          if (t.handler) ended.push(t);
        }
      }
    });

    //Removes those that have ended.
    remove.forEach((t) => {
      t.stop();
    });

    // Call the callbacks that have ended. This is done after the main loop
    // as infinite loop could be created otherwise.
    ended.forEach((t) => {
      if (t.handler !== undefined) t.handler();
    });
  }

  /**
   * Shorthand to creating a single timer.
   * @param time How long should the timer run. In seconds.
   * @param handler Function to call when timer reaches target.
   * @param autostart Should the timer start automatically.
   */
  public static delay(
    time: number,
    handler?: () => void,
    autostart = true,
  ): RafTimer {
    return new RafTimer(time, true, handler, autostart);
  }

  /**
   * Waits for given amount of seconds before continuing with promise
   * @param seconds How long to sleep
   */
  public static sleep(seconds: number): Promise<void> {
    return new Promise((resolve) => RafTimer.delay(seconds, resolve));
  }

  /**
   * Set to true to pause the timer.
   */
  public paused: boolean;
  /**
   * Total time of timer
   */
  public time: number;
  /**
   * Active completion handler.
   */
  public handler: (() => void) | undefined;
  /**
   * Current track timer.
   */
  public trackTime: number;
  /**
   * Does the timer trigger only once or is it looping.
   */
  public once: boolean;

  /**
   * Builds a new timer
   * @param time Time to use in seconds
   * @param once Should the timer trigger only once or loop.
   * @param handler Function to call when timer ends.
   * @param autostart Should the timer start immediatly
   */
  public constructor(
    time: number,
    once?: boolean,
    handler?: () => void,
    autostart?: boolean,
  ) {
    this.time = time;
    this.once = once === undefined ? true : once;
    this.handler = handler;
    this.trackTime = time;
    this.paused = true;
    if (autostart) this.start();
  }

  /**
   * Starts the timer.
   */
  public start(): void {
    this.trackTime = this.time;
    this.paused = false;
    if (RafTimer.active.indexOf(this) === -1) {
      RafTimer.active.push(this);
    }
  }

  /**
   * Stops the timer and resets the tracktime.
   * For pausing use 'paused'.
   */
  public stop(): void {
    this.trackTime = 0;
    const index = RafTimer.active.indexOf(this);
    if (index >= 0) {
      RafTimer.active.splice(index, 1);
    }
  }
}
