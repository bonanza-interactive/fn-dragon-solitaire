/**
 * Simple signaling class. Can be used as event emitter/listener.
 */
export class Signal<T> {
  private callbacks: Array<(params: T) => void> = [];

  /**
   * Connects a callback to signal.
   * @param cb Callback to use
   */
  public connect(cb: (params: T) => void): void {
    if (this.callbacks.indexOf(cb) === -1) this.callbacks.push(cb);
  }

  /**
   * Removes callback from signal
   * @param cb Callback to use
   */
  public disconnect(cb: (params: T) => void): void {
    const index = this.callbacks.indexOf(cb);
    if (index >= 0) this.callbacks.splice(index, 1);
  }

  /**
   * Calls all connected callbacks.
   * @param params Parameters to send.
   */
  public emit(params: T): void {
    this.callbacks.forEach((cb) => cb(params));
  }
}
