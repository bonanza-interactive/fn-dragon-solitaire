export function assert(condition: boolean, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}

export function assertDefined<T>(t: T | undefined | null, msg?: string): T {
  assert(t != null, msg);
  return t;
}
