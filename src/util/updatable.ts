type Unknowns = ReadonlyArray<unknown>;
export interface Updatable {
  /**
   * Updates the object.
   * @param delta The delta time in seconds
   */
  update(delta: number): void;
}

export interface UpdatableWithArgs<T extends Unknowns> {
  /**
   * Updates the object.
   * @param delta The delta time in seconds
   * @param args additional args required by `update` implementation
   */
  update(delta: number, ...args: T): void;
}

export interface Tickable {
  /**
   * Updates the object.
   * @param delta The delta time in seconds
   */
  tick(delta: number): void;
}

export interface AutoUpdate {
  /**
   * Adds an updatable object to be updated. You can safely add it multiple
   * times without it being updated more than once.
   * @param obj The object to update from now on
   */
  add(obj: Updatable | Tickable): void;
  add<T extends Unknowns>(obj: UpdatableWithArgs<T>, ...args: T): void;
  /**
   * Removes an updatable object from being updated. You can safely call this
   * for an object that has not previously been added.
   * @param obj The object to not update anymore
   */
  remove<T extends Unknowns>(
    obj: Updatable | Tickable | UpdatableWithArgs<T>,
  ): void;
  /**
   * Updates all added updatable objects.
   *
   * NOTE: 'tick(delta)' is called before 'update(delta)'.
   * @param delta The delta time in seconds
   */
  update(delta: number): void;
}

/**
 * Creates a new instance of {@link AutoUpdate}.
 */
export function createAutoUpdate(): AutoUpdate {
  const tickables = new Set<Tickable>();
  const updatables = new Map<Updatable, Unknowns>();
  return {
    add: <T extends Unknowns>(obj: Updatable | Tickable, ...args: T): void => {
      if (isTickable(obj)) tickables.add(obj);
      if (isUpdatable(obj)) updatables.set(obj, args ?? []);
    },
    remove: (obj: Updatable | Tickable): void => {
      if (isTickable(obj)) tickables.delete(obj);
      if (isUpdatable(obj)) updatables.delete(obj);
    },
    update: (delta: number): void => {
      tickables.forEach((tickable) => {
        tickable.tick(delta);
      });

      for (const [k, v] of updatables.entries()) {
        if ((v?.length ?? 0) > 0) {
          (<UpdatableWithArgs<unknown[]>>k).update(delta, ...v);
        } else {
          k.update(delta);
        }
      }
    },
  };
}

// Type guards
function isTickable(obj: Updatable | Tickable): obj is Tickable {
  return (obj as Tickable).tick !== undefined;
}
function isUpdatable(obj: Updatable | Tickable): obj is Updatable {
  return (obj as Updatable).update !== undefined;
}
