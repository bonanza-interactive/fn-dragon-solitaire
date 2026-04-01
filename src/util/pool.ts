/**
 * Pool options.
 * @param requireReturn Can items used only after they have been returned.
 * @param size How large pool should be reserved.
 * @param constructor Constructor function to generate objects.
 */
export interface PoolOptions<T> {
  /**
   * Require items to be returned before reusing.
   */
  requireReturn: boolean;
  /**
   * How many objects does the pool hold.
   */
  size: number;
  /**
   * Constructor function to generate the objects.
   */
  constructor: (index: number) => T;
}

/**
 * Generic pool for caching objects.
 */
export class Pool<T> {
  private options: PoolOptions<T>;

  //Currently available items
  private pool: T[];
  //Original pool. If requireReturn is false, then this is same as pool
  private origPool: T[];
  private index = 0;

  /**
   * Builds a new pool with given options.
   * @param options Pool options.
   */
  public constructor(options: PoolOptions<T>) {
    this.options = options;
    this.pool = new Array<T>(options.size);
    for (let i = 0; i < options.size; i++) {
      this.pool[i] = options.constructor(i);
    }
    if (options.requireReturn) this.origPool = this.pool.slice(0);
    else this.origPool = this.pool;
  }

  /**
   * Returns an item to pool.
   * Throws an error if requireReturn is false.
   * @param item Item to return
   */
  public return(item: T): void {
    if (!this.options.requireReturn) {
      throw new Error(
        'Cannot return an item to pool without return requirement.',
      );
    }
    this.pool.push(item);
  }

  /**
   * Gets all items in the pool
   */
  public getAll(): T[] {
    return this.origPool;
  }

  /**
   * Returns next item from the pool.
   */
  public getNext(): T {
    if (this.options.requireReturn) {
      const value = this.pool.pop();
      if (!value) {
        throw new Error(
          'Ran out of items in pool. Increase pool size or return items.',
        );
      }
      return value;
    } else {
      this.index = (this.index + 1) % this.pool.length;
      return this.pool[this.index];
    }
  }
}
