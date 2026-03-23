export class Pool<T> {
  private readonly used: T[];
  private readonly free: T[];
  private factory: () => T;
  constructor(factory: () => T) {
    this.used = [];
    this.free = [];
    this.factory = factory;
  }

  public reserve(): T {
    let item;
    if (this.free.length > 0) {
      item = this.free.pop() as T;
    } else {
      item = this.factory();
    }

    this.used.push(item);
    return item;
  }
  public release(instance: T): void {
    const i = this.used.indexOf(instance);

    // assert(
    //   i !== -1,
    //   'Attempted to release an instance not belonging to this pool'
    // );

    if (i !== -1) {
      this.used.splice(i, 1);
      this.free.push(instance);
    }
  }

  public releaseAll(): void {
    for (let i = 0; i < this.used.length; i++) {
      this.free.push(this.used[i]);
    }
    this.used.length = 0;
  }

  get itemsInUse(): ReadonlyArray<T> {
    return this.used;
  }

  get size(): number {
    return this.used.length + this.free.length;
  }
}
