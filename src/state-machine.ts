export abstract class State<T = undefined> {
  public readonly data: Data<T>;

  constructor(...data: [T] extends [undefined] ? [] : [T]) {
    this.data = data[0] as Data<T>;
  }

  public abstract run(data: Data<T>): AnyState | Promise<AnyState>;

  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  public update(_delta: number): void {}
}

type Data<T> = T extends undefined ? unknown : T;

// End state (assuming there are state machines that should end)
class EndState extends State {
  public run(): Promise<State> {
    return Promise.reject('End state cannot be run');
  }
}

export const END = new EndState();

// Could be removed to encourage states to define their next states
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type AnyState = State<any>;

type StateConstructor = {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  new (arg?: any): State<any>;
};

export class StateMachine {
  public readonly states: StateConstructor[];
  public currentState: State;

  public previousLogTime = 0;

  constructor(states: StateConstructor[], initState: State) {
    this.states = states;
    this.currentState = initState;
  }

  private logTrace(_log: string): void {
    const timeNow = performance.now();
    const timeTook = Math.floor(timeNow - this.previousLogTime) / 1000;

    if (timeTook > 0.01) {
      _log += ` ${timeTook}s`;
    }

    this.previousLogTime = timeNow;
  }

  public async run() {
    while (true) {
      this.logTrace(`[enter: ${this.currentState.constructor.name}]`);

      const nextState = await this.currentState.run(this.currentState.data);

      this.logTrace(`[exit: ${this.currentState.constructor.name}]`);

      if (nextState === END) {
        return;
      }

      if (!this.states.some((s) => nextState instanceof s)) {
        throw new Error('State is not supported by this StateMachine');
      }

      this.currentState = nextState as State<undefined>;
    }
  }

  public update(delta: number) {
    this.currentState.update(delta);
  }
}
